# Proposal: Simple Instagram-like Blog System

## 1. Overview
Build a lightweight social blog platform that feels similar to Instagram, but with a much simpler scope. Users can register, log in, create posts, and view a feed of recent posts.

## 2. Goal
Create a small web app where:
- visitors can view public posts
- registered users can log in
- only authenticated users can create new posts
- all data is stored in SQLite

## 3. Core Features
### MVP Features
- User registration
- User login and logout
- Session-based authentication
- Create a new post
- View a feed of posts
- Show post author and timestamp

### Optional Later Enhancements
- Image uploads
- Likes and comments
- Follow/follower system
- Profile pages
- Search or hashtags

## 4. Suggested Tech Stack
- Backend: Python + Flask
- Database: SQLite
- Frontend: HTML, CSS, JavaScript
- Templates: Jinja2

## 5. User Stories
- As a visitor, I can browse the blog feed.
- As a new user, I can register for an account.
- As a returning user, I can log in securely.
- As an authenticated user, I can create a post.
- As an unauthenticated user, I cannot create a post.

## 6. Scope Notes
This version should stay simple and focus on:
- secure basic authentication
- clear post creation flow
- easy-to-read feed experience

## 7. Success Criteria
The project is successful when a user can:
1. register an account
2. log in
3. create a post
4. see it appear in the feed
5. be blocked from posting when not logged in

## 8. Next Step
Review this proposal, then proceed to the architecture and design documents.
