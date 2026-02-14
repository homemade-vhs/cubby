# CLAUDE.md — Cubby Project Briefing

## What Is Cubby?

Cubby is a custom to-do / task management app built by Matt. It's a Progressive Web App (PWA) that works as a website on desktop and can be installed on phones (iOS and Android) as a standalone app with its own icon and no browser UI. Think of it as Matt's personal alternative to apps like Todoist or Things — built exactly the way he wants it.

## Who Is Matt?

Matt is a creative professional (YouTuber, video producer, musician) who is **not a coder**. He's learning as he builds. He understands what he wants features to do but doesn't always know the technical terminology. Explain things in plain language. Don't assume he knows programming jargon — if you use a technical term, briefly explain it.

Matt works on a Mac Studio.

Matt is very technically skilled in graphic design, Photoshop, Premiere, UI design, music production, etc. Don't hesitate to ask him to create mock-ups or design things.

## General Rules to Always Follow During Chats and Development

- Automatically update the version number at the bottom of the Cubby home screen for every new build. Just add one number to the third decimal spot with each new build, no matter how small the changes. The version is displayed via `settings.js` in the `renderSettings()` function.
- Automatically update this document to contain the most up to date information about Cubby, its features, what is currently implemented, what isn't working fully, and what should be added or improved.
- Always check and update the .md files before, during, and at the end of sessions.
- After every batch of changes, **always stage, commit, and push to GitHub** (`git add`, `git commit`, `git push origin main`). Don't wait for Matt to ask — do it automatically after finishing each set of changes.

### .md files

There are several .md files for you to reference. Please check them at the start of each session, and continuously update and check them during chats and development sessions. The .md files purposes are:

- **ideas.md** is where Matt writes his ideas for Cubby. Reference it to see what Matt has in his head for new features.
- **notes.md** is for when Matt has a lot of notes or features to give you, and can organize them better there, so when he instructs you to check there for next steps, do that.
  - Feel free to reword, rewrite, reorganize, or add to the notes in notes.md. Making checklists or to-do lists is wise so Matt can keep track.
- **notes-archive.md** is an archive on the notes Matt gives you. Before changing anything in notes.md, always copy the current notes in notes.md and move them to notes-archive.md
- **roadmap.md** is a roadmap of what to add next. Update this as much as possible during sessions.

## Tech Stack

- **Vanilla HTML, CSS, and JavaScript** — no frameworks, no React, no build tools
- **Supabase** for authentication (email/password sign-in) and cloud data sync
- **localStorage** as the local data cache (key: `cubby_data`)
- **PWA features**: manifest file for installability, works as standalone app on mobile
- The project was originally a single monolithic HTML file but has been **split into separate files** for maintainability

## Project Structure

```
~/Projects/Cubby/
  CLAUDE.md         ← This file (project briefing for Claude)
  ideas.md          ← Matt's feature ideas and aspirations
  notes.md          ← Current development notes/instructions from Matt
  notes-archive.md  ← Archive of past notes
  roadmap.md        ← Feature roadmap with phases
  src/
    index.html      ← Structure and layout (the skeleton)
    styles.css      ← All styling, dark theme, responsive design (the skin)
    supabase.js     ← Supabase auth, sign-in/sign-up, session management
    sync.js         ← Cloud data sync (save/load to Supabase)
    app.js          ← Core data, localStorage, navigation, color themes
    animations.js   ← FLIP animations for task reordering
    drag.js         ← Drag-and-drop for task/subcubby reordering
    render.js       ← UI rendering (home, rooms, cubbies, tasks)
    tasks.js        ← Task operations (toggle, add, delete, move, archive, trash, auto-archive/trash)
    modals.js       ← All modal dialogs (task, subtask, cubby, color, move)
    menus.js        ← Kebab menus for tasks, subcubbies, cubbies, rooms
    search.js       ← Global search with filters (Cmd+K shortcut)
    views.js        ← Tasks page (all tasks sorted by due date with color modes)
    settings.js     ← Settings, Archive, and Trash screen rendering and handlers
```

> **Note**: The JS files load in a specific order defined in index.html: supabase.js > sync.js > app.js > animations.js > drag.js > render.js > tasks.js > modals.js > menus.js > search.js > views.js > settings.js

## Current Features

These features exist and work in the current build (v1.4.1):

### App Hierarchy
**Workspaces > Cubbies > Subcubbies > Tasks > Subtasks**
- **Workspaces** (called "rooms" in code): Top-level organizational containers (e.g., "Work", "Personal"). Can optionally have a color theme (dark background with colored border/text).
- **Cubbies**: Color-themed project lists inside workspaces
- **Subcubbies**: Sections within a cubby (e.g., "General", "Urgent")
- **Tasks**: Main items with text, due dates, tags, descriptions, and expandable subtasks
- **Subtasks**: Nested items under tasks

### Navigation
- **Dual-layout system**: Separate desktop and mobile layouts using CSS media queries at 768px breakpoint
- **Desktop (>768px)**: Permanent sidebar on the left (260px wide) with logo, nav links (Home, Tasks, Cubbies, Search), workspace/cubby tree, New Task button, and Settings. No bottom tab bar. Content area shifts right of the sidebar.
- **Mobile (≤768px)**: Bottom tab bar with 5 tabs (Home, Tasks, New+, Cubbies, Menu). Menu button slides out the sidebar as an overlay from the left. Sidebar has close button and dark overlay behind it.
- **Sidebar**: Shows navigation, all workspaces with nested cubbies, and highlights the active view. Renders workspace/cubby list dynamically.
- **Three-screen navigation**: Home > Room > Cubby views with back buttons
- **Cubbies Browse Screen**: Dedicated screen for browsing all workspaces and cubbies, accessible from Cubbies nav tab
- **Search**: Accessible from sidebar, home screen search bar, and Cmd+K shortcut

### Dashboard Home Screen
- **Greeting + date**: Personalized time-based greeting with today's date (day of week, month, day)
- **Quick Stats row**: 4 stat cards showing Overdue (red), Today (yellow), This Week (blue), Done this week (green) — tapping Overdue/Today/This Week opens Views filtered to that category
- **Upcoming Tasks widget**: Shows next 7 upcoming tasks sorted by due date, with cubby color dot, cubby name label, task name, and due date pill. Tapping a task navigates to it in its cubby with highlight. "See all" button opens Views.
- **Quick Actions row**: 4 icon buttons — New Task, New Cubby, New Workspace, All Tasks
- **Workspaces section**: Room cards with workspace label above them
- **Search bar**: Quick access to global search (Cmd+K)

### Cubbies Browse Screen
- **Workspace sections**: Each workspace displayed as an expandable section with name, cubby count, and arrow to navigate to workspace
- **Cubby list items**: Each cubby shows color dot, name, active task count, and arrow to jump directly into the cubby
- **New Workspace button**: Quick-add button at bottom of the browse list
- **Direct navigation**: Tapping a cubby navigates directly into it; tapping workspace header goes to the room view

### User Accounts & Sync
- **Supabase authentication**: Email/password sign-in and sign-up
- **Cloud sync**: Data syncs to Supabase so it persists across devices
- **Display name**: Users can set a custom display name in settings (used in greeting and nav bar)
- **Personalized greeting**: Time-based greeting on home screen ("Good morning", "Good evening", etc.)

### Tasks Page (formerly "Views")
- Shows all tasks across all cubbies sorted by due date
- **Two color modes**: "color by due date" (default) and "color by cubby"
- Toggle button switches between modes
- Filter tabs: Upcoming, All, Overdue

### Task Management
- Create, edit, delete, duplicate tasks and subtasks
- Move tasks to top/bottom/other section
- **Tags**: Colored labels (8 colors) on tasks and subtasks
- **Due dates**: Smart display (Today, Tomorrow, Overdue, X days, etc.)
- **Descriptions**: Optional text descriptions on tasks
- **Subtasks**: Expandable subtask lists with visual tree connector lines
- **Task descriptions**: Icon indicator when a task has a description

### Archive & Trash System
- **Archive**: Completed tasks auto-archive based on user settings
  - Two modes: "After duration" or "On date change"
  - Duration options: Immediately, 1 day, 3 days, 1 week (default), 2 weeks, 1 month, custom, never
  - Date-change options: New day, new week, new month, new year (with configurable week start day)
- **Trash**: Deleted items go to trash before permanent deletion
  - Same two modes as archive (duration or date-change)
  - Duration options include "Immediately" for instant permanent deletion
  - Items can be restored from trash
- Both accessible from Settings > Data section

### Customization
- **All-lowercase UI**: All UI text is rendered lowercase via CSS `text-transform: lowercase` on `html, body`. User-created content (task text, cubby names, descriptions, etc.) is exempted with `text-transform: none`. When adding new UI elements, apply `text-transform: none` to any element that displays user input.
- **8 color themes**: blue, purple, pink, red, orange, yellow, green, teal
- **Workspace colors**: Workspaces can optionally have a color (dark sunken background with colored border/text, distinct from cubby card styling)
- **Custom theme colors**: Users can customize each color theme's primary color via a color picker in Settings. All derived colors (backgrounds, borders, glows) are auto-generated from the primary color. Reset to defaults available.
- **Dark theme**: The entire app uses a dark color scheme
- **Hover effects**: Buttons, task cards, and interactive elements brighten on hover (brightness + saturation filter)
- **Click pop animation**: Interactive elements shrink, darken, and spring back when clicked for tactile feedback

### Other Features
- **Global search**: Cmd+K (or Ctrl+K) to search all tasks with filters (all/active/completed/due soon/overdue)
- **FLIP animations**: Smooth task reordering when completing/uncompleting
- **Drag and drop**: Reorder tasks and subcubbies by dragging
- **Kebab menus**: Context menus (three dots) for every item type
- **PWA installable**: Can be added to phone home screens and used like a native app

## What Was Removed (Do NOT Re-Add)

- **Sound effects / audio**: The app previously had sound effects that caused crashes on mobile and bloated the file size. All audio code has been intentionally stripped out. **Do not add any audio functionality unless Matt explicitly asks for it.**

## Development Rules

Follow these rules carefully. They exist because of real problems encountered during development:

### 1. Make Surgical Edits Only
Do NOT regenerate entire files. Make targeted, specific changes to the exact lines that need modification. If you need to add a function, add just that function. If you need to change a style, change just that rule. This keeps things stable and predictable.

### 2. Only Build What Is Asked For
Do not add features, screens, UI elements, or "improvements" that Matt didn't request. If Matt asks to change button color, change the button color — don't also reorganize the layout or add a loading screen. Scope creep has caused major problems in the past.

### 3. One Feature at a Time
Work on one change or feature per request. Finish it, confirm it works, then move to the next thing. Don't bundle multiple changes together unless Matt specifically asks for it.

### 4. Explain What You Changed
After making edits, briefly tell Matt:
- Which file(s) you edited
- What specifically you added, changed, or removed
- How to test the change (if applicable)

**Always end your response with a changes summary table** formatted like this:

| # | Task | Files Changed |
|---|------|---------------|
| 1 | **Short description** | `file.js` — what changed |

This gives Matt a quick at-a-glance reference for everything that was done.

### 5. Don't Break Existing Functionality
Before making changes, consider what might be affected. If a change could potentially break drag-and-drop, task saving, or other existing features, mention the risk before proceeding.

### 6. Test Before Declaring Victory
If you can run the app or check the code for obvious errors, do so. Don't just make an edit and say "done" — verify it makes sense in context.

## How to Guide Matt

When Matt describes what he wants in plain language, help him understand the process:

- **Tell him which file(s) are involved** before making changes
- **Use analogies** he'll understand — the HTML/CSS/JS split can be explained as skeleton/skin/brain
- **If something is risky or complex**, explain that upfront so he can decide whether to proceed
- **If you're unsure what he means**, ask a clarifying question rather than guessing

## Common Gotchas

These have caused issues before — be aware of them:

- **Audio on mobile**: Mobile browsers block autoplay audio and have strict interaction requirements. This is why audio was removed. Don't go down this rabbit hole.
- **Large file regeneration**: Never output an entire file when only a few lines need to change. This wastes context and has historically caused crashes.
- **Unasked-for features**: A previous session added a "start screen" that wasn't requested and broke click functionality across the app. Stick to what's asked.
- **Settings re-render flash**: The settings page previously used `animate-in delay-X` classes on sections. When `renderSettings()` re-rendered after a button click, all sections would flash invisible (opacity: 0) before animating back in. These animation classes have been removed from settings sections to prevent this.
- **localStorage limits**: The app stores data locally in localStorage (~5-10MB limit). Supabase handles cloud persistence.
- **appData.settings null safety**: Functions like `runAutoArchive()` and `runAutoTrashPurge()` must check for `appData.settings` existence before accessing properties, because Supabase-loaded data may not include the settings field.

## Key Data Structures

### appData (stored in localStorage as `cubby_data`)
```javascript
{
    rooms: [...],           // Array of room/workspace objects with cubbies (rooms can have optional .color property)
    cubbies: {...},         // Cubby data keyed by cubby ID
    archive: [...],         // Archived tasks
    trash: [...],           // Deleted tasks (with deletedAt timestamp)
    settings: {
        userName: '',       // Display name for greeting
        customColors: {},   // Custom color overrides { colorName: '#hex' }
        autoArchive: {
            mode: 'duration',       // 'duration' or 'date-change'
            duration: '1week',      // 'immediate', '1day', '3days', '1week', '2weeks', '1month', 'custom', 'never'
            customDays: 7,
            dateChange: 'new-week', // 'new-day', 'new-week', 'new-month', 'new-year'
            weekStart: 'monday'     // 'monday' or 'sunday'
        },
        autoTrash: {
            mode: 'duration',
            duration: '1month',
            customDays: 30,
            dateChange: 'new-week',
            weekStart: 'monday'
        }
    }
}
```

## Quick Reference for File Decisions

| What Matt asks for | File(s) to edit |
|---|---|
| Add a new screen or section | index.html |
| Change colors, fonts, spacing, layout | styles.css |
| Change how something looks on mobile | styles.css |
| Change app data structure or localStorage | app.js |
| Change color themes or add theme features | app.js + settings.js |
| Change how things are displayed/rendered | render.js |
| Change task/subtask behavior (complete, add, delete, move) | tasks.js |
| Change auto-archive or auto-trash logic | tasks.js |
| Change modal dialogs (add/edit popups) | modals.js |
| Change context menus (kebab/three-dot menus) | menus.js |
| Change search functionality | search.js |
| Change the Tasks page (all tasks by due date) | views.js |
| Change Settings, Archive, or Trash screens | settings.js |
| Change animations | animations.js |
| Change drag-and-drop behavior | drag.js |
| Change auth or sign-in flow | supabase.js |
| Change cloud sync behavior | sync.js |
| New feature (complex) | Multiple files — work through it step by step |
