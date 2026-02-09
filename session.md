# Cubby — Session Notes

## Last Updated
2026-02-08

## Current Status
Home customization feature shipped (v1.3.0). Users can reorder and show/hide dashboard sections. Phase 1 complete. Supabase auth works but cloud sync tables are not yet connected.

## What's Done
- App is fully functional with localStorage (rooms, cubbies, subcubbies, tasks, subtasks)
- Supabase client library is loaded and configured (`src/supabase.js`)
- Authentication system works (sign up, sign in, sign out, session checking)
- Auth screen UI exists with styling
- Cloud task functions are stubbed out in `supabase.js` but NOT connected to the app yet
- All actual data still lives in localStorage only
- **Dashboard home screen** (v1.1.2) — Quick stats row, upcoming tasks feed, quick actions, date display
- **Nav bar remapping** (v1.1.3) — Home highlights on dashboard, Cubbies highlights on browse/room/cubby; upcoming tasks colored by cubby with cubby names
- **Cubbies browse screen** (v1.1.4) — Dedicated workspace/cubby list accessible from Cubbies nav tab
- **Phase 1 complete** — All 14 items marked done
- **Home customization** (v1.3.0) — Users can reorder dashboard sections (stats, upcoming, quick actions, workspaces) and toggle their visibility via edit mode

## What's Next
1. **Icons feature** — Choose or upload icons to assign to tasks, cubbies, rooms
2. **Overdue styling improvements** — Thicker red border, more vivid appearance
3. **Notebooks** — Phase 3 feature, contenteditable approach for MVP
4. **Create Supabase database tables** — design the schema to match the app's hierarchy
5. **Hook up cloud functions** — replace/supplement localStorage calls with Supabase reads and writes
6. **Set up Row Level Security (RLS)** — so each user can only see their own data

## Important Decisions Made
- Using Supabase for auth + database (not just auth)
- Dashboard approach for table creation (visual, easier to learn)
- Audio/sound effects were intentionally removed — do NOT re-add
- App uses vanilla HTML/CSS/JS — no frameworks
