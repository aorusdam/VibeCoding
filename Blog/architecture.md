# Architecture: Simple Instagram-like Blog System

## 1. Architecture Summary
The app will follow a simple client-server architecture:
- a web server handles routes and authentication
- a SQLite database stores users and posts
- templates render the HTML pages
- static files provide styling and browser behavior

## 2. Recommended Stack
- Python 3
- Flask web framework
- SQLite database via sqlite3
- Jinja2 templates
- HTML/CSS/JavaScript for the frontend

## 3. Main Components
### Web Server
Handles:
- home page
- register page
- login page
- logout action
- post creation
- feed rendering

### Authentication Layer
- password hashing with a secure algorithm
- session-based login state
- access control for protected routes

### Database Layer
SQLite will store the core business data:
- users
- posts
- sessions

## 4. Data Model
### users
- id (INTEGER, primary key)
- username (TEXT, unique)
- email (TEXT, unique)
- password_hash (TEXT)
- created_at (TEXT)

### posts
- id (INTEGER, primary key)
- user_id (INTEGER, foreign key)
- content (TEXT)
- created_at (TEXT)

### sessions
- id (INTEGER, primary key)
- user_id (INTEGER)
- session_token (TEXT, unique)
- expires_at (TEXT)

## 5. Request Flow
### Registration Flow
1. User submits register form
2. Server validates input
3. Server hashes password
4. Server inserts new user into SQLite
5. Server creates a session and redirects to feed

### Login Flow
1. User submits login form
2. Server checks email/username and password hash
3. If valid, server creates session
4. User is redirected to the home feed

### Post Creation Flow
1. Logged-in user submits post content
2. Server validates input
3. Server stores the post with the current user id
4. Server redirects back to feed

## 6. Route Structure
- GET / -> home/feed page
- GET /register -> registration page
- POST /register -> create user
- GET /login -> login page
- POST /login -> authenticate user
- POST /logout -> destroy session
- GET /posts -> feed page
- POST /posts -> create post

## 7. Security Considerations
- Never store plain-text passwords
- Use server-side session handling
- Protect post creation routes so only authenticated users can access them
- Validate and sanitize user input

## 8. File Organization
```text
app/
  templates/
    base.html
    login.html
    register.html
    feed.html
  static/
    style.css
    app.js
  app.py
  db.py
  models.py
  auth.py
  schema.sql
```

## 9. Notes
This architecture is intentionally simple so it is easy to build, test, and extend later.
