"""A lightweight, server-rendered social blog built with Flask and SQLite."""

import os
import secrets
from datetime import datetime, timedelta, timezone
from functools import wraps

from flask import Flask, abort, flash, g, redirect, render_template, request, url_for
from werkzeug.security import check_password_hash, generate_password_hash

from db import get_db, init_app as init_db_app

SESSION_COOKIE = "blog_session"
SESSION_LIFETIME = timedelta(days=14)
MAX_POST_LENGTH = 500


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def create_app(test_config=None) -> Flask:
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        DATABASE=os.path.join(app.instance_path, "blog.sqlite"),
        SECRET_KEY=os.environ.get("BLOG_SECRET_KEY", secrets.token_hex(32)),
        # Keep local development usable on http://127.0.0.1; set this to 1 behind HTTPS.
        SESSION_COOKIE_SECURE=os.environ.get("BLOG_SECURE_COOKIES") == "1",
    )
    if test_config:
        app.config.update(test_config)

    os.makedirs(app.instance_path, exist_ok=True)
    init_db_app(app)

    @app.before_request
    def load_current_user() -> None:
        g.user = None
        g.session = None
        token = request.cookies.get(SESSION_COOKIE)
        if not token:
            return

        row = get_db().execute(
            """
            SELECT users.id, users.username, users.email, sessions.session_token,
                   sessions.csrf_token, sessions.expires_at
            FROM sessions JOIN users ON users.id = sessions.user_id
            WHERE sessions.session_token = ?
            """,
            (token,),
        ).fetchone()
        if row is None:
            return
        if datetime.fromisoformat(row["expires_at"]) <= utc_now():
            get_db().execute("DELETE FROM sessions WHERE session_token = ?", (token,))
            get_db().commit()
            return
        g.user = row
        g.session = row

    @app.context_processor
    def inject_template_state():
        return {"current_user": g.user, "csrf_token": g.session["csrf_token"] if g.session else None}

    def require_login(view):
        @wraps(view)
        def wrapped_view(*args, **kwargs):
            if g.user is None:
                flash("Please log in to create a post.", "error")
                return redirect(url_for("login"))
            return view(*args, **kwargs)
        return wrapped_view

    def require_csrf() -> None:
        if g.session is None or not secrets.compare_digest(
            request.form.get("csrf_token", ""), g.session["csrf_token"]
        ):
            abort(400, "Invalid or missing form token. Please reload the page and try again.")

    def create_session(user_id: int):
        session_token = secrets.token_urlsafe(32)
        csrf_token = secrets.token_urlsafe(32)
        expires_at = (utc_now() + SESSION_LIFETIME).isoformat()
        db = get_db()
        db.execute("DELETE FROM sessions WHERE expires_at <= ?", (utc_now().isoformat(),))
        db.execute(
            "INSERT INTO sessions (user_id, session_token, csrf_token, expires_at) VALUES (?, ?, ?, ?)",
            (user_id, session_token, csrf_token, expires_at),
        )
        db.commit()
        return session_token

    def login_response(user_id: int):
        response = redirect(url_for("feed"))
        response.set_cookie(
            SESSION_COOKIE,
            create_session(user_id),
            max_age=int(SESSION_LIFETIME.total_seconds()),
            httponly=True,
            samesite="Lax",
            secure=app.config["SESSION_COOKIE_SECURE"],
        )
        return response

    @app.get("/")
    @app.get("/posts")
    def feed():
        posts = get_db().execute(
            """
            SELECT posts.id, posts.content, posts.created_at, users.username
            FROM posts JOIN users ON users.id = posts.user_id
            ORDER BY posts.created_at DESC, posts.id DESC
            """
        ).fetchall()
        return render_template("feed.html", posts=posts, max_post_length=MAX_POST_LENGTH)

    @app.route("/register", methods=("GET", "POST"))
    def register():
        if g.user:
            return redirect(url_for("feed"))
        if request.method == "POST":
            username = request.form.get("username", "").strip()
            email = request.form.get("email", "").strip().lower()
            password = request.form.get("password", "")
            error = None
            if not 3 <= len(username) <= 30:
                error = "Username must be between 3 and 30 characters."
            elif "@" not in email or len(email) > 254:
                error = "Enter a valid email address."
            elif len(password) < 8:
                error = "Password must be at least 8 characters."
            if error is None:
                try:
                    cursor = get_db().execute(
                        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
                        # PBKDF2 is broadly available on Python 3.9+ (including macOS's system Python).
                        (username, email, generate_password_hash(password, method="pbkdf2:sha256")),
                    )
                    get_db().commit()
                    flash("Welcome to Little Posts!", "success")
                    return login_response(cursor.lastrowid)
                except Exception as exc:
                    if "UNIQUE constraint failed" in str(exc):
                        error = "That username or email is already in use."
                    else:
                        raise
            flash(error, "error")
        return render_template("register.html")

    @app.route("/login", methods=("GET", "POST"))
    def login():
        if g.user:
            return redirect(url_for("feed"))
        if request.method == "POST":
            identity = request.form.get("identity", "").strip()
            password = request.form.get("password", "")
            user = get_db().execute(
                "SELECT id, password_hash FROM users WHERE username = ? OR email = ?", (identity, identity.lower())
            ).fetchone()
            if user is None or not check_password_hash(user["password_hash"], password):
                flash("Incorrect username/email or password.", "error")
            else:
                flash("You are logged in.", "success")
                return login_response(user["id"])
        return render_template("login.html")

    @app.post("/logout")
    @require_login
    def logout():
        require_csrf()
        get_db().execute("DELETE FROM sessions WHERE session_token = ?", (g.session["session_token"],))
        get_db().commit()
        response = redirect(url_for("feed"))
        response.delete_cookie(SESSION_COOKIE)
        flash("You have been logged out.", "success")
        return response

    @app.post("/posts")
    @require_login
    def create_post():
        require_csrf()
        content = request.form.get("content", "").strip()
        if not content:
            flash("A post cannot be empty.", "error")
        elif len(content) > MAX_POST_LENGTH:
            flash(f"Posts must be {MAX_POST_LENGTH} characters or fewer.", "error")
        else:
            get_db().execute("INSERT INTO posts (user_id, content) VALUES (?, ?)", (g.user["id"], content))
            get_db().commit()
            flash("Your post is live.", "success")
        return redirect(url_for("feed"))

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
