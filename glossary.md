# Cubby Terminology Glossary

This document defines all terminology used in Cubby to ensure clear communication about features and components.

---

## Core Data Structures

### Workspace (also called "Room" in code)
Top-level organizational container that holds cubbies. Examples: "Work", "Personal", "School".
- Has a name and optional color theme
- Contains multiple cubbies
- Displayed as cards on the home screen and in the Cubbies Browse screen

### Cubby
Mid-level container within a workspace that groups related subcubbies. Examples: "Project Alpha", "Errands", "Study Materials".
- Has a name and color theme (required)
- Contains multiple subcubbies
- Displayed as cards in the Room View

### Subcubby
Container within a cubby that holds individual tasks. Examples: "Frontend", "Backend", "Bug Fixes".
- Has a name
- Contains multiple tasks
- Can be expanded/collapsed
- Color inherits from parent cubby

### Task
Individual actionable item within a subcubby.
- Has text (description)
- Can be completed/uncompleted (checkbox)
- Optional due date
- Optional subtasks
- Can be expanded to show subtasks
- Color inherits from parent cubby

### Subtask
Sub-item under a task for breaking down work into smaller pieces.
- Has text (description)
- Can be completed/uncompleted (checkbox)
- No due date
- Color inherits from parent cubby

---

## Screens & Views

### Home Screen
Main dashboard showing overview of tasks and workspaces.
- Default screen when opening Cubby
- Contains 4 customizable sections (see below)
- Has greeting with date
- Has search button
- Has customize (edit) and sign out buttons

### Cubbies Browse Screen
List view of all workspaces with their cubbies, organized by workspace.
- Accessed from bottom navigation
- Shows workspace sections with nested cubby lists
- Each cubby shows incomplete task count

### Room View
Detail view of a single workspace showing all its cubbies.
- Accessed by clicking a workspace card
- Shows cubby cards in a list
- Has "new cubby" button at bottom
- Has back button to return to home

### Cubby View
Detail view of a single cubby showing all subcubbies and tasks.
- Accessed by clicking a cubby card
- Shows subcubbies as expandable sections
- Can add new subcubbies and tasks
- Has back button to return to room view

### Views Screen (All Tasks)
Filterable list of all tasks across all workspaces.
- Accessed from Quick Actions or bottom navigation
- Has filter buttons: all, overdue, today, this week, no date
- Shows tasks grouped by due date or status
- Clicking a task navigates to its cubby

### Archive Screen
List of archived tasks (removed from active views but preserved).
- Accessed from bottom navigation
- Shows completed/archived tasks
- Can restore tasks back to active
- Can permanently delete to trash

### Trash Screen
List of deleted tasks before permanent removal.
- Accessed from bottom navigation
- Shows trashed tasks with automatic deletion timer
- Can restore tasks back to active
- Tasks auto-delete after configured duration

### Settings Screen
Configuration panel for app preferences.
- Accessed from bottom navigation
- Contains auto-archive settings
- Contains auto-trash settings
- Contains color customization
- Contains user name field

---

## Home Screen Sections

The home screen has 4 customizable sections that can be reordered, hidden, or shown:

### Quick Stats
4 colored cards showing task counts:
- **Overdue** (red): Tasks past their due date
- **Today** (yellow): Tasks due today
- **This Week** (blue): Tasks due within 7 days
- **Done** (green): Tasks completed this week
- Empty stats (count = 0) are greyed out and desaturated
- Clicking a stat (except "Done") opens Views screen with that filter applied

### Upcoming Tasks
List of next 7 upcoming tasks (or fewer if less exist).
- Shows task text, cubby name, and due date pill
- Color-coded by cubby theme
- Clicking navigates to that task's cubby
- "see all" button opens Views screen
- Empty state shows "no tasks yet" message

### Quick Actions
4 button shortcuts for common actions:
- **New Task** (green): Opens new task modal
- **New Cubby** (purple): Opens new cubby modal
- **New Workspace** (blue): Opens new workspace modal
- **All Tasks** (yellow): Opens Views screen

### Workspaces
List of all workspace cards.
- Shows workspace name and cubby count
- Color-coded by workspace theme
- Clicking opens Room View for that workspace
- "new workspace" button at bottom

---

## Home Customization Feature

### Edit Mode (Home Customization Mode)
Special state where home sections can be reorganized.
- Activated by clicking the edit/customize button (pencil icon) in header
- Shows dashed borders around each section
- Adds control buttons to each section
- Sections smoothly animate when reordered (FLIP animation)

### Section Controls
UI elements that appear in Edit Mode:
- **Section label**: Shows the section name at top
- **Up arrow button**: Moves section up in order (disabled if first)
- **Down arrow button**: Moves section down in order (disabled if last)
- **Hide/Show button**: Toggles section visibility
  - Says "hide" when visible
  - Says "show" when hidden
  - Hidden sections appear greyed out in edit mode
  - Hidden sections completely removed in normal mode

---

## UI Components

### Cards
Rectangular containers for content:
- **Workspace Card (room-card)**: Shows workspace name and cubby count on home screen
- **Cubby Card (cubby-card)**: Shows cubby name in Room View or Cubbies Browse
- **Stat Card (dashboard-stat-card)**: Shows task count for a category in Quick Stats
- **Upcoming Task Card (upcoming-task)**: Shows single task in Upcoming Tasks section
- **Task**: Individual task item in a subcubby
- **Active cards**: 2px border (colored, interactable, has content)
- **Inactive/Empty cards**: 1px border (greyed out, desaturated, disabled)

### Modals
Overlay dialogs for forms and detailed views:
- New Task Modal
- New Cubby Modal
- New Workspace Modal
- Edit Workspace Modal
- Edit Cubby Modal
- Edit Task Modal
- Search Modal
- Task Details Modal (when clicking expanded task)

### Menus
Context menus (3-dot buttons):
- **Room Menu**: Edit workspace, delete workspace
- **Cubby Menu**: Edit cubby, delete cubby
- Appear as vertical 3-dot buttons on cards

### Buttons
Various button types:
- **Quick Action Button**: Large colorful buttons in Quick Actions section
- **Add Button**: Plus buttons for creating new items (new cubby, new workspace, etc.)
- **Control Button**: Small utility buttons (edit, delete, move, etc.)
- **Header Button**: Icon buttons in screen headers (search, edit, sign out)
- **More Button**: 3-dot menu buttons on cards

---

## Features

### Drag & Drop
System for reordering items:
- Drag handle: 6-dot grip icon on left of draggable items
- Currently used for reordering cubbies within workspaces
- Visual feedback: dragged item has reduced opacity, drop zones highlighted

### Search
Global task search functionality:
- Accessed via search button on home screen or search icon in headers
- Searches all task text across all workspaces
- Real-time filtering as you type
- Shows results grouped by cubby
- Click result to navigate to that task

### Filters (in Views Screen)
Task sorting options:
- **All**: Show all incomplete tasks
- **Overdue**: Tasks past due date
- **Today**: Tasks due today (current day)
- **This Week**: Tasks due within next 7 days
- **No Date**: Tasks without a due date

### Auto-Archive
Automatic task archival system:
- Moves completed tasks to Archive screen after configured duration
- **Mode Options**:
  - Off: Never auto-archive
  - Duration: Archive after X days/weeks/months
  - Date Change: Archive on specific recurring event
- **Duration Options**: 1 day, 1 week, 1 month, custom days
- **Date Change Options**: New day, new week (configurable week start), new month

### Auto-Trash
Automatic task deletion system:
- Moves archived tasks to Trash screen after configured duration
- Eventually permanently deletes trashed tasks
- Same configuration options as Auto-Archive

### Color Themes
Visual theming system for workspaces and cubbies:
- **8 Default Colors**: Blue, Purple, Pink, Red, Orange, Yellow, Green, Teal
- Each theme includes:
  - Primary color (for main UI elements)
  - Background color (subtle tinted dark background)
  - Card color (for card backgrounds)
  - Card hover color
  - Border color
  - Text color
  - Text muted color (for secondary text)
  - Glow color (for special effects)
- **Custom Colors**: Can create custom color themes from hex values in Settings

---

## Visual Design System

### Border Weight Hierarchy
Consistent rule for border thickness throughout the app:
- **2px borders**: Active/available colored cards (interactable, has content, clickable)
- **1px borders**: Inactive/unavailable grey cards (empty states, desaturated, disabled)
- Examples:
  - Stat card with tasks: 2px
  - Empty stat card: 1px
  - Workspace card: 2px
  - Upcoming task card: 2px

### Stroke Width
SVG icon stroke consistency:
- **2.5px stroke**: Home screen icons for prominence (header buttons, search, quick actions, workspace arrows)
- **2px stroke**: Most other icons throughout the app

### Empty States
Visual treatment for cards with no content:
- 30% opacity
- 50% saturation (desaturated/washed out)
- 1px border (instead of 2px)
- Not clickable (pointer-events disabled)
- No hover effects

### Animations
Motion design patterns:
- **FLIP technique**: Smooth position transitions when reordering (First, Last, Invert, Play)
  - 300ms duration
  - cubic-bezier(0.4, 0, 0.2, 1) easing
  - Used for home section reordering
  - To be used for all future reorderable elements
- **Slide-in animations**: Entrance animations on screen load
- **Scale animations**: Click feedback on buttons and cards
- **Expand/collapse**: Task and subcubby expansion animations

---

## Data Persistence

### localStorage
Primary data storage:
- Key: `cubby_data`
- Stores entire appData object
- Updated on every change via `saveData()`

### Supabase
Cloud sync system:
- **Tables**: workspaces, cubbies, subcubbies, tasks, subtasks
- Auth via email/password
- Bidirectional sync with localStorage
- `loadFromSupabase()` reconstructs data on app load
- `saveToSupabase()` pushes changes to cloud

---

## Technical File Structure

### Core Files
- **app.js**: Data structures, state management, color themes
- **render.js**: All rendering functions for screens and components
- **tasks.js**: Task operations (add, edit, delete, complete, archive, etc.)
- **views.js**: Views screen (All Tasks) logic and filtering
- **search.js**: Global search functionality
- **menus.js**: Context menu logic
- **modals.js**: Modal dialogs (new/edit forms)
- **settings.js**: Settings screen logic
- **drag.js**: Drag & drop functionality
- **animations.js**: FLIP and other animation utilities
- **supabase.js**: Supabase integration and sync
- **sync.js**: Data synchronization logic
- **styles.css**: All styling (single CSS file)
- **index.html**: App structure and markup

---

## Version History

- **v1.3.0**: Home customization feature (current)
- **v1.2.0**: Cubbies browse screen
- **v1.1.0**: Archive & trash system
- **v1.0.0**: Initial release

---

*Last updated: February 9, 2026*
