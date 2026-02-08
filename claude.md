# CLAUDE.md — Cubby Project Briefing

## What Is Cubby?

Cubby is a custom to-do / task management app built by Matt. It's a Progressive Web App (PWA) that works as a website on desktop and can be installed on phones (iOS and Android) as a standalone app with its own icon and no browser UI. Think of it as Matt's personal alternative to apps like Todoist or Things — built exactly the way he wants it.

## Who Is Matt?

Matt is a creative professional (YouTuber, video producer, musician) who is **not a coder**. He's learning as he builds. He understands what he wants features to do but doesn't always know the technical terminology. Explain things in plain language. Don't assume he knows programming jargon — if you use a technical term, briefly explain it.

Matt works on a Mac Studio.

Matt is very technically skilled in graphic design, Photoshop, Premiere, UI design, music production, etc. Don't hesitate to ask him to create mock-ups or design things.

## General Rules to Always Follow During Chats and Development

- Automatically update the version number at the bottom of the Cubby home screen for every new build. Just add one number to the third decimal spot with each new build, no matter how small the changes.
- Automatically update this document to contain the most up to date information about Cubby, it's features, what is currently implemented, what isn't working fully, and what should be added or improved.
- Always check and update the .md files before, during, and at the end of sessions.

### .md files

There are several .md files for you to reference. Please check them at the start of each session, and  continuously update and check them during chats and development sessions. The .md files purposes are:

- **ideas.md** is where Matt writes his ideas for Cubby. Reference it to see what Matt has in his head for new features.
- **notes.md** is for when Matt has a lot of notes or features to give you, and can organize them better there, so when he instructs you to check there for next steps, do that.
  - Feel free to reword, rewrite, reorganize, or add to the notes in notes.md. Making checklists or to-do lists is wise so Matt can keep track. 
- **notes-archive.md** is an archive on the notes Matt gives you. Before changing anything in notes.md, always copy the current notes in notes.md and move them to notes-archive.md
- **roadmap.md** is a roadmap of what to add next. Update this as much as possible during sessions.

## Tech Stack

- **Vanilla HTML, CSS, and JavaScript** — no frameworks, no React, no build tools
- **LocalStorage** for all data persistence (no backend, no database)
- **PWA features**: manifest file for installability, potential service worker for offline use
- The project was originally a single monolithic HTML file but has been **split into separate files** for maintainability

## Project Structure

```
~/Projects/Cubby/
  src/
    index.html      ← Structure and layout (the skeleton)
    styles.css      ← All styling, dark theme, responsive design (the skin)
    app.js          ← Core data, localStorage, navigation, color themes
    render.js       ← UI rendering (home, rooms, cubbies, tasks)
    tasks.js        ← Task operations (toggle, add, delete, move, etc.)
    modals.js       ← All modal dialogs (task, subtask, cubby, color, move)
    menus.js        ← Kebab menus for tasks, subcubbies, cubbies, rooms
    search.js       ← Global search with filters (⌘K shortcut)
    animations.js   ← FLIP animations for task reordering
```

> **Note**: The JS has been split into multiple files for maintainability. They load in a specific order defined in index.html.

## Current Features

These features exist and work in the current build:

### App Hierarchy
**Rooms → Cubbies → Subcubbies → Tasks → Subtasks**
- **Rooms**: Top-level organizational containers (e.g., "Work", "Personal")
- **Cubbies**: Color-themed project lists inside rooms
- **Subcubbies**: Sections within a cubby (e.g., "General", "Urgent")
- **Tasks**: Main items with text, due dates, tags, and expandable subtasks
- **Subtasks**: Nested items under tasks

### Features
- **Three-screen navigation**: Home → Room → Cubby views with back buttons
- **8 color themes**: blue, purple, pink, red, orange, yellow, green, teal
- **Task management**: Create, edit, delete, duplicate, move to top/bottom/other section
- **Subtasks**: Expandable subtask lists with visual tree connector lines
- **Tags**: Colored labels (8 colors) on tasks and subtasks
- **Due dates**: Smart display (Today, Tomorrow, Overdue, X days, etc.)
- **Global search**: ⌘K (or Ctrl+K) to search all tasks with filters (all/active/completed/due soon/overdue)
- **FLIP animations**: Smooth task reordering when completing/uncompleting
- **Kebab menus**: Context menus (three dots) for every item type
- **Dark theme**: The app uses a dark color scheme throughout
- **PWA installable**: Can be added to phone home screens and used like a native app
- **Fully local**: All data stays in the browser via localStorage (key: `cubby_data`) — nothing is sent anywhere

## What Was Removed (Do NOT Re-Add)

- **Sound effects / audio**: The app previously had sound effects that caused crashes on mobile and bloated the file size. All audio code (Audio objects, playSound functions, audio event handlers, base64 audio data) has been intentionally stripped out. **Do not add any audio functionality unless Matt explicitly asks for it.**

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
- **localStorage limits**: The app stores everything in localStorage, which typically has a ~5-10MB limit per origin. If the app grows to support lots of data, this could become an issue eventually, but it's fine for now.

## Future Aspirations (Not Yet Implemented)

Matt has mentioned interest in these but they are NOT current priorities unless he brings them up:

- PWA manifest and service worker setup for better installability and offline support
- Possible collaboration features (sharing with others)
- GitHub-based version control workflow (Matt has GitHub Desktop installed)

## Quick Reference for File Decisions

| What Matt asks for | File(s) to edit |
|---|---|
| Add a new screen or section | index.html |
| Change colors, fonts, spacing, layout | styles.css |
| Change how something looks on mobile | styles.css |
| Change app data structure or localStorage | app.js |
| Change how things are displayed/rendered | render.js |
| Change task/subtask behavior (complete, add, delete, move) | tasks.js |
| Change modal dialogs (add/edit popups) | modals.js |
| Change context menus (kebab/three-dot menus) | menus.js |
| Change search functionality | search.js |
| Change animations | animations.js |
| New feature (complex) | Multiple files — work through it step by step |
