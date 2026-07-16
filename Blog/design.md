# Design: Simple Instagram-like Blog System

## 1. Design Goals
Create a clean and friendly experience that feels close to Instagram, but remains simple enough for a first version.

## 2. Core User Experience
### Landing / Feed View
- show a list of posts from newest to oldest
- display author name and timestamp
- show post content in a card-style layout

### Authentication Experience
- show a simple register form with username, email, and password
- show a login form with email/username and password
- redirect users to the feed after success

### Post Creation Experience
- only show the create-post form when the user is logged in
- show a short textarea and a submit button
- after posting, refresh the feed to include the new content

## 3. Page Structure
### Home Page
- header with app name
- login/register links when logged out
- logout button when logged in
- feed of posts
- create-post card for logged-in users

### Register Page
- username field
- email field
- password field
- submit button
- link back to login

### Login Page
- email or username field
- password field
- submit button
- link to register

## 4. Visual Style
- modern, minimal, social-media-inspired layout
- soft background colors
- rounded cards for posts
- clear spacing and readable typography
- simple buttons with hover states

## 5. Component Layout
### Header
- app title
- navigation links
- auth actions

### Post Card
- author name
- timestamp
- content body

### Composer Card
- text area
- submit button
- validation feedback

## 6. Interaction Rules
- unauthenticated users can view posts
- unauthenticated users cannot submit posts
- authenticated users can create posts immediately after login
- errors should be shown clearly for invalid login or registration attempts

## 7. Database-Informed Design
The UI should reflect the database structure:
- each post belongs to one user
- each user can have many posts
- the feed is a reverse-chronological list of posts

## 8. Design Notes
The first version should prioritize clarity over complexity. The goal is to make the app feel approachable and easy to use while keeping the implementation manageable.
