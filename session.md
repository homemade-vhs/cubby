# Cubby — Session Notes

## Last Updated
2026-02-08

## Current Status
Dashboard home screen shipped (v1.1.2). Supabase auth works but cloud sync tables are not yet connected.

## What's Done
- App is fully functional with localStorage (rooms, cubbies, subcubbies, tasks, subtasks)
- Supabase client library is loaded and configured (`src/supabase.js`)
- Authentication system works (sign up, sign in, sign out, session checking)
- Auth screen UI exists with styling
- Cloud task functions are stubbed out in `supabase.js` but NOT connected to the app yet
- All actual data still lives in localStorage only
- **Dashboard home screen** — Quick stats row, upcoming tasks feed, quick actions, date display

## What's Next
1. **Phase 1 remaining items** — Views refinements, cubby creation improvements, cubby settings button, due date color mode in cubbies
2. **Home customization** — Let users reorder/hide dashboard sections, pin cubbies, widget system
3. **Create Supabase database tables** — design the schema to match the app's hierarchy
4. **Hook up cloud functions** — replace/supplement localStorage calls with Supabase reads and writes
5. **Set up Row Level Security (RLS)** — so each user can only see their own data

## Important Decisions Made
- Using Supabase for auth + database (not just auth)
- Dashboard approach for table creation (visual, easier to learn)
- Audio/sound effects were intentionally removed — do NOT re-add
- App uses vanilla HTML/CSS/JS — no frameworks
