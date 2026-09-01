# StudyRank — Setup Guide

## What's built so far
- Landing page, Signup, Login, Logout
- A `profiles` table that auto-creates itself for each new user (this is
  what will hold everyone's points)
- Route protection (`feed.html`, `leaderboard.html`, `profile.html` all
  redirect to login if you're not signed in)
- A shared navbar that shows your username's points and a logout button
- Full database schema (tables for questions, answers, and votes are
  already created, even though we haven't built those pages yet — this
  way step 2 is just writing JS, no more SQL needed)

## Step 1: Create your Supabase project
1. Go to https://supabase.com → New Project.
2. Wait ~2 minutes for it to spin up.

## Step 2: Run the database schema
1. In your Supabase project, open **SQL Editor** → **New query**.
2. Paste in everything from `schema.sql` in this folder.
3. Click **Run**. You should see 4 new tables under **Table Editor**:
   `profiles`, `questions`, `answers`, `votes`.

## Step 3: Turn off email confirmation (recommended for a hackathon demo)
By default Supabase makes new users confirm their email before they can
log in — annoying when you're demoing quickly.
1. Go to **Authentication** → **Providers** → **Email**.
2. Turn **Confirm email** OFF.
3. Save.

(You can leave it on if you'd rather test the real flow — signup.html
already handles both cases.)

## Step 4: Connect your code to Supabase
1. In Supabase, go to **Settings** → **API**.
2. Copy the **Project URL** and the **anon public** key.
3. Open `js/supabaseClient.js` in this project and paste them in:
   ```js
   const SUPABASE_URL = "https://xxxxx.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOi...";
   ```

## Step 5: Run the site locally
This project has **no build step** — it's plain HTML/CSS/JS — but you
still need to serve it over `http://` rather than opening the file
directly, or some browser security rules will block things.

Easiest options:
- **VS Code**: install the "Live Server" extension, right-click
  `index.html` → "Open with Live Server".
- **Python** (if installed): run this in the project folder:
  ```
  python -m http.server 5500
  ```
  then open `http://localhost:5500`.

## Step 6: Test it
1. Open the site → Sign Up with a username/email/password.
2. You should land on `feed.html` and see a navbar with "⭐ 0 pts".
3. Click Logout → you're sent to `login.html`.
4. Log back in with the same email/password → back to the feed.
5. Try opening `feed.html` directly while logged out — it should bounce
   you to `login.html`. That's `requireAuth()` working.

If signup/login throws an error, it's almost always one of:
- Wrong URL/key in `supabaseClient.js`
- `schema.sql` wasn't run yet (so the `profiles` table doesn't exist)
- Opening the HTML file directly instead of through Live Server

## What to build next (in order)
1. **Post & view questions** (`feed.html`) — a form that inserts into
   `questions`, and a list that selects and renders them. This is the
   core content loop.
2. **Answer a question + view answers** (`question.html`) — click a
   question from the feed, see its detail + an answer form.
3. **Points & voting** — when someone upvotes an answer: insert into
   `votes` (blocked by the `unique` constraint if they already voted),
   increment `answers.votes`, and increment the answer author's
   `profiles.points`. For a hackathon, doing this as 2–3 sequential
   client-side calls is fine; a Postgres trigger is the "do it properly"
   version if you have time later.
4. **Leaderboard** — `select * from profiles order by points desc`,
   render as a ranked list.
5. **Profile page** — show a user's own questions/answers/points.

Say "let's build feature 1" (or whichever number) when you're ready and
we'll write it the same way — full working code, explained file by file.