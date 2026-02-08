# Cubby - Notes Archive

> This file contains past notes from notes.md, archived after completion for future reference.

---

# Notes for Feb 7, 2026 (9:00 PM)

---

## 1. Views

- **Due date position:** For the task cards in Views, can the due date always be displayed as the right-most item in the card?
- **Sizing of items in card:** Can you make the width of the box that displays the due date text always be the same width no matter what the text inside the box is? (Example: Today, Tomorrow, 5 Days, Dec 15, Overdue, etc)
  - Make the width of the box that displays the due date always be the width of the longest text string (I think that might be "Tomorrow").
  - Make the due date text center aligned in its due date box. If no due date is assigned, can you make it a blank box with no text? (same width as the other due date boxes, and use the color scheme of the card it's in, just slightly darker)
  - **Apply everywhere:** Also apply this change to Tasks in Cubbies and across the app, but with a little difference from the way it shows in the Views tab:
    - **Chevron and kebab buttons placement:** These 2 buttons appear in the task cards when viewed in a Cubby, but not in View mode, so the placement needs to be determined. Put them to the right of the other items.
    - **Order of items in a card, from left ro right:** (LEFT SIDE) Checkbox → Task Name (and Cubby name if in Views tab) → (MIDDLE) Blank space usually, depending on size of browser → (RIGHT SIDE) Task Description Icon (if description exists for task) → Subtask Progress Bar → Subtask Progress Counter → Due Date → Chevron → Kebab.
    - **Width:** Make sure that these assets each generate as the same horizontal width (as in, each asset type (progress bar, due date, etc) has it's own specified width, and will always generate as that width no matter what. I am not saying that all asset types need to be the same width as all other types) This is for uniformity! It's pleasing to the eye. If confused, feel free to ask me.
- **Selected task highlighting issue:** I noticed when you click a task in Views and it takes the user to that cubby, it highlights the task that was selected with a flashing border. Love this, but the border currently gets cut off on the left, ride, and top sides. Maybe there is some display issue that is cropping things bigger than the card's size?
  - The border is great, and when the selected task is highlighted and shown in it's respective cubby, make all other tasks in the cubby become more transparent, as to only highlight focus on the one you selected. Use the same method of "dimming transparency" as when you open a task to view subtasks.
  - When you click anywhere else or away from the highlighted task, the rest of the items return to normal opacity, and now you are in the cubby as normal.
- **Due Date Color Mode toggle size:** "Due Date Color Mode" toggle button is a different height than the rest of the buttons for selecting a view, so it's hanging down lower from a top alignment.
  - Make sure all buttons or toggles up there are the same height no matter what.
  - Move the "Due Date Color Mode" toggle to the other side of the layout to be right aligned so it isn't next to the other View toggles.
  - Add text inside that toggle (to the left of the sun icon, so the sun icon is always the right-most in the button) that says "color by due date (sun icon)"
- **Changes to due date colors:** I'm realizing that some of the date colors need to change in order to be more urgent or differentiated. Let's do this color scheme:
  - Overdue: Red
  - Today: Yellow
  - Tomorrow: Green
  - This Week: Blue
  - Next Week: Purple
  - Later: White
  - No Date: None / Grey

---

## 2. Cubbies

- **Cubby creation color selection:** When you create a new Cubby, let the user choose the Color before creating.
- **Cubby creation workspace selection:** When creating a new Cubby, also let users select which Workspace to put it in. By default, have the current Workspace selected.
- **Cubby creation description:** Add the option to give a Cubby a Cubby Description, similar to Tasks.
  - This description would display as smaller text below the name of the Cubby in the Cubby itself (not in the card that's located in the Workspace menu where you select a Cubby to enter, just within the Cubby itself under the name.)
- **Due Date Color Mode toggle in Cubbies:** Could we implement a toggle for the Due Date Color Mode that can be toggled while in a Cubby?
  - When toggled, it will change the colors of the tasks and subtasks to reflect the due date color scheme, like it currently does in Views.
  - Make the background color of the Cubby, as well as any colors that are set to that Cubby's theme, change to the greyscale color theme that is used on the main menu currently.
- **Cubby Settings button:** Please add a button within all Cubbies to the left of the "+ New Task" button, for "Cubby Settings".
  - Cubby settings will open a menu of options similar to when you select the kebab menu on a task. The menu options needed will be:
    - Cubby color theme
      - Currently, this option is only located in the kebab menu that's in the Workspace view of your Cubbies. Let's make the option available in here too so the user doesn't have to back out of the Cubby in order to edit it.
    - Edit Cubby description
    - Share Cubby (doesn't have to be functional yet, but should be added for now but greyed out.)
    - Move Cubby to...
    - Duplicate Cubby
    - Archive Cubby
    - Delete Cubby
      - Make sure this option is color coded in red, or in a way that visually shows it's a big decision.

---

## 3. Visual tweaks

- **Overdue border:** Can we make the overdue red border more red? It's a little light red / salmony right now. Would love for it to show urgency by being a more vivid red, and also thicker!

---

## 4. Archive system

- **Creation of an Archive system:** This is a big task, but we definitely need an "Archive" system where users can view Archived Cubbies / tasks / etc.
  - Make "Archive" an option in kebab menus. (Example: "Archive task" in task kebab menu, "Archive subtask" in subtask kebab menu, "Archive Cubby" in Cubby kebab menu and settings menu, etc.)
- **Location of Archive:** User can access their archive from the Settings menu.
- **Auto-archive for completed tasks:** My original idea for Cubby included a feature where completed tasks would still remain visible for a period of time before they automatically archive.
  - This is so users can visually see the tasks they're completing and have completed, for a sense of accomplishment. For me personally, I find it a bit hard to feel accomplished when I use a to-do list app and the task just vanishes when I complete it.
- **Auto-archive time:** In the overall Settings tab (where it says your name in the Nav bar), let the user change the "Auto-archive tasks after..." The options could be split into 2 categories:
- **Auto-archive after a certain amount of time:**
  - On completion (tasks immediately become archived when marked complete)
  - After 1 day (24 hours after being marked as complete)
  - After 3 days (72 hours after being marked as complete)
  - After 1 week (**Default setting**) (7 days after being marked as complete)
  - After 2 weeks (14 days after being marked as complete)
  - After 1 month (30 days after being marked as complete)
  - After custom length (user can pick a length of time)
  - Never (Completed tasks remain, unless user manually archives them.)
- **Auto-archive when a certain date change occurs:**
  - On start of new day (The next instance of midnight after being marked complete)
  - On start of new week (The next instance of a new week starting after being marked complete)
    - When selected, prompt user to choose when they want the "new week" to begin: Sunday, or Monday. Some people, like myself, prefer the start of the work week being when things reset.
  - On start of new month (The next instance of a new month starting after being marked complete)
  - On start of new year (The next instance of a new year starting after being marked complete)
  - On custom date (user can pick a date on the calendar, such as the 20th of each month)
  - On custom day of the week (user can pick a day of the week, such as the start of every Friday after being marked complete)

---

## 5. Trash system

- **Deletion confirmation:** Before deleting an item (task, cubby, workspace, etc) make sure a confirmation dialogue window appears, asking the user to make sure they want to delete.
- **Trash:** Allow deleted items to remain in a "Trash" area for a certain amount of time after being deleted.
  - Deleted items in the Trash can be "restored" (undeleted) for a certain period of time. After that period, the deleted items will auto-delete forever.
  - This period of time can also be changed in the settings, using the same system as used by the Auto-archive time for completed tasks.
    - Allow users to manually delete items forever as well, if they want to clear some stuff before the specified period of time ends.
  - The Trash area can be accessed from a button located in the Archive.
- **Location of Trash:** User can access their Trash from the Settings menu.
