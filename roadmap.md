# Cubby — Feature Roadmap

## Phase 1: Enhance What's Already Built (Complete)

- [x] **Task Details / Memos** — Add a description or notes field to tasks and subtasks
- [x] **Progress Bars on Tasks** — Show completion percentage based on subtask progress
- [x] **Views / Tasks Page** — Smart filtered perspectives of tasks across all Cubbies by due date
- [x] **Archive System** — Auto-archive completed tasks with configurable duration/date-change modes
- [x] **Trash System** — Soft-delete with configurable auto-purge, restore from trash
- [x] **Settings Screen** — User profile, auto-archive/trash config, theme color customization
- [x] **Central Navigation Bar** — 7-tab bottom nav (Tasks, Notes, Cubbies, New, Home, Search, Profile)
- [x] **Custom Theme Colors** — Color picker to customize each of the 8 theme colors
- [x] **Views refinements** — Due date positioning, fixed-width date boxes, highlight selected task in cubby
- [x] **Cubby creation improvements** — Color picker during creation, workspace selection, cubby description
- [x] **Cubby settings button** — In-cubby settings menu (color, description, share, move, duplicate, archive, delete)
- [x] **Due date color mode in cubbies** — Toggle for due-date-based task coloring within individual cubbies

## Phase 2: Dual Desktop/Mobile Layout (In Progress)

- [x] **Dual Desktop/Mobile Layout** — Permanent sidebar nav on desktop, bottom tab bar + slide-out sidebar on mobile (CSS media queries at 768px)
- [x] **Center-aligned desktop content** — All content centered in the work area between sidebar and browser edge with max-width constraints
- [x] **Dashboard Home Screen** — Quick stats (overdue/today/this week/done), upcoming tasks feed, quick action buttons, date display
- [x] **App Home Customization** — Let users reorder/hide dashboard sections, pin cubbies, add widgets

### Desktop Design Pass

Reference screenshots: Asana (home, list view) and Monday.com (board, notes) in `/screenshots/`

#### Stage 1: Sidebar Polish ✅ (v1.5.0)
- [x] Refine sidebar styling (tighter spacing, better visual hierarchy like Monday.com)
- [x] Collapsible workspace sections (click workspace name to expand/collapse its cubbies)
- [x] Active cubby/workspace highlighting (show which one you're currently viewing)
- [x] "New Workspace" button in sidebar workspace area
- [x] User avatar/name at bottom of sidebar

#### Stage 2: Home Screen (Desktop)
Inspired by Asana Home — 2-column widget grid.
- [ ] Redesign home as a 2-column card grid (My Tasks + Projects side by side)
- [ ] Date + greeting at top, full width
- [ ] Stats cards as a compact row above the grid
- [ ] Upcoming tasks and workspace list as proper widget cards with headers
- [ ] Consider removing workspace list from home (sidebar already shows them)

#### Stage 3: Cubby View (Inside a Cubby)
Inspired by Asana/Monday list views — full-width task lists.
- [ ] Full-width task list (edge to edge within the work area)
- [ ] Cubby title + description as a proper header bar at top
- [ ] Collapsible subcubby sections with color-coded headers
- [ ] Wider task rows with more breathing room on desktop
- [ ] Consider column-style info display (due date, tags visible inline, not hidden in modal)

#### Stage 4: Tasks Page (All Tasks View)
Like Asana's "My Tasks" list.
- [ ] Full-width task list on desktop
- [ ] Cleaner filter tabs as a proper toolbar
- [ ] Color mode toggle refined for desktop (toolbar button, not mobile switch)

#### Stage 5: Settings & Other Screens
- [ ] Settings as a clean centered single-column layout
- [ ] Archive/Trash screens refined for desktop width
- [ ] Cubbies Browse screen — grid layout for workspace/cubby cards on desktop

#### Stage 6: Mobile Design Pass
Dedicated pass to optimize every screen for mobile after desktop is complete.
- [ ] Mobile home screen (vertical stack, touch-optimized)
- [ ] Mobile cubby view (full-width cards, larger touch targets)
- [ ] Mobile sidebar overlay refinement
- [ ] Bottom tab bar polish

## Phase 3: Major New Features

- [ ] **Calendar** — Visual calendar view for tasks, deadlines, and reminders with filtering options
- [ ] **Notebooks** — Document system with formatting, checklists, templates, sketching, and image support
- [ ] **Advanced Themes** — Full theme presets, create and switch between complete themes
- [ ] **Icons for Tasks / Cubbies** — Choose or upload icons to assign to tasks, cubbies, rooms, etc.

## Phase 4: Ambitious Additions

- [ ] **My House** — Room and space-based home organization with chore timers and recurring task widgets
- [ ] **Day Tracker** — Track hobbies, countdowns, streaks; customizable widgets across the app
- [ ] **Sharing / Collaboration** — Share cubbies, tasks, notebooks with other users; real-time sync
