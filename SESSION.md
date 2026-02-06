# Cubby — Session Notes

## Last Updated
2026-02-05

## Current Status
Setting up Supabase database tables for cloud sync.

## What's Done
- App is fully functional with localStorage (rooms, cubbies, subcubbies, tasks, subtasks)
- Supabase client library is loaded and configured (`src/supabase.js`)
- Authentication system works (sign up, sign in, sign out, session checking)
- Auth screen UI exists with styling
- Cloud task functions are stubbed out in `supabase.js` but NOT connected to the app yet
- All actual data still lives in localStorage only

## What's Next
1. **Create Supabase database tables** — design the schema to match the app's hierarchy (Rooms → Cubbies → Subcubbies → Tasks → Subtasks). Doing this through the Supabase dashboard so Matt can learn the process visually.
2. **Hook up cloud functions** — replace/supplement localStorage calls with Supabase reads and writes
3. **Set up Row Level Security (RLS)** — so each user can only see their own data
4. **Handle sync** — make the app read/write from Supabase instead of (or in addition to) localStorage

## Important Decisions Made
- Using Supabase for auth + database (not just auth)
- Dashboard approach for table creation (visual, easier to learn)
- Audio/sound effects were intentionally removed — do NOT re-add
- App uses vanilla HTML/CSS/JS — no frameworks

## Notes
- Supabase credentials are in `src/supabase.js` (URL + anon key) — these are public/client-side keys, which is fine
- The `SESSION.md` file was created this session so future Claude sessions can pick up where we left off
