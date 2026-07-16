# Little Posts

A small, Instagram-inspired blog application implemented from this folder's proposal, design, and architecture documents.

## Run locally

```bash
cd Blog
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000`. The SQLite database is created automatically at `Blog/instance/blog.sqlite` and is intentionally ignored by Git.

Set `BLOG_SECRET_KEY` to a stable random value before deploying. Set `BLOG_SECURE_COOKIES=1` when serving the app over HTTPS. Flask's development server is for local use only.
