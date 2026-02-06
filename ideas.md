# Cubby — Feature Ideas and Roadmap

---

## Main Features

### User Accounts / Hosting Sync

- Cubby will require an account to use.
- Data such as Cubbies, tasks, notebooks, settings, etc is stored to the user's Cubby account and sync across devices (desktop / mobile version). Hosted through a Cubby domain name and server.
- For example, I could add a task on mobile and it would update it instantly on the desktop version as well.
- Users can share Cubbies / tasks / notebooks / etc. to keep track of work and shared projects.
- User data updates in real time across platforms for all users on a shared item, allowing them to keep track of progress from others on shared items.

---

### App Home

A default landing area for the app / website that shows when you first start it up, or go back to the home page.

The layout has a welcome message at the top, and under that are different sections / items / widgets that can be organized, added, removed, etc. This gives the user full customization over what information or actions they have on their home, cutting out the fluff and only using what they want. (Widget examples explained further down)

**At the top:**

- Personalized welcome message with the user's name that changes depending on time of day, etc.
- A search icon for searching the app
- A menu icon for more options like settings

**A few quick welcome message examples:**

- "Good morning, [NAME]!"
- "Hey there, [NAME]!"
- "Welcome back, [NAME]."
- "You're up early, [NAME]."
- "Happy Friday, [NAME]!"
- "Hey [NAME], what's new?"
- "Yo [NAME]!"

**Other widget slots / buttons / sections:**

- A quick look at upcoming tasks / deadlines / highest priority tasks.
- Some buttons to get to work — "New task", "New notebook", etc.
- Some big navigation buttons, ideas include "My Tasks", "My Cubbies", "My House", "My Notebooks", etc.
- Widgets that the user can add such as a "Day Tracker" widget, a custom "New (something)" button, a progress bar for something, etc.

---

### Notebooks

A document system for the app that allows you to create and edit documents and lists.

- Includes tools that let you format your documents how you want, style them with different colors, headers and body styles, fonts, etc.
- Ability to create checklists, bulleted lists, etc. Maybe even the ability to connect certain tasks / subtasks to checklists or sections somehow so they're interlinked.
- Besides the option to add checklists or bulleted lists etc to a document, also the option to create new documents based on templates. Examples:
  - New Document
  - Checklist
  - Custom List
  - Shopping List
  - Journal Entry (set the date and organize journal entries, like a Diary)
  - etc.
- Ability to sketch or draw in your pages (named "Scribble" or "Sketch" maybe), change brush size and color etc, shapes, and option to add text to a shape and choose how the text behaves in that shape (alignment etc)
- Ability to add images or files to documents.

---

### Views

- See tasks at a glance, sort by "Views" such as Today, This Week, Next Week, Down The Road, etc.

> **[Clarification]:** Views are filtered perspectives of your existing tasks across all Cubbies — not separate lists. Think of them like smart folders that automatically pull in tasks based on their due dates or priority, so you can quickly see what's relevant right now without digging through individual Cubbies.

---

### Calendar

A calendar that keeps track of your various tasks, deadlines, reminders, etc.

- Can toggle or sort which things appear on the calendar (checkboxes to toggle on or off different things like "task", "deadline", "meeting", "only things from specific cubby", "only things from specific tag or color", "custom user defined category", etc)
- Different views / layout options such as whole month as a traditional calendar layout, week view as a list, etc.

---

### Settings

- Ability to customize the colors, fonts, sizes, etc.
- Create themes, easily switch between them, save and load themes.

---

### My House

A separate section of the app that's dedicated for organizing your home life. This lets you create custom areas like Floors (1F, 2F, etc), Rooms (Living Room, Downstairs Bathroom, Studio, etc), Spaces (Front Yard, Garage, Attic, etc). You can organize all of these how you like, nesting them like folders that can be easily navigated, folded, etc.

- Will probably rename Rooms, so there's no confusion between Rooms that contain Cubbies, and Rooms for the House section of the app.

**Chores & Tasks:**

- Within each one of these Rooms or Spaces, you can keep track of specific chores such as "Sweep floor".
- The tasks within the House section of Cubby can be integrated with the rest of the app. For example, outside of the House section of the app, if you create a task in a hypothetical Cubby called "General To-Do List", you can assign that task to a specific floor, room, or space from your House section (if set up). Then it will appear in both your Cubby "General To-Do List", and in your House section. Updating one updates the other.

**Unique House Features (To Flesh Out):**

- I'd like to flesh the House idea out more and make it unique from regular Cubbies. Maybe it has sections in each Room like "Clean", "Organize", etc, and default tasks that can be assigned to that room that have timers that slowly drain a progress bar by a user specified time.
- For example, in a Room called "Bedroom", I could add a "widget" (placeholder name) that's for "Vacuum". I could set the frequency to every 2 weeks. Once I activate the widget, it starts slowly draining a progress bar / counts down for the 2 week period, and then reminds me that it's time to vacuum once the period is up. When I do the task again, I can reset the timer. I can also "Snooze" a timer by increments if I don't feel like doing the task that day etc. These timer tasks would also appear in my upcoming Views like "Vacuum Bedroom tomorrow".

**Collaboration:**

- Once user accounts are set-up, users can add other Cubby users to their House section and can both keep track of house tasks and chores and widgets.

---

### Day Tracker

- Track hobbies, count down until date, track days since etc.
- Create and customize widgets that you can add to different parts of the app (Cubbies, Rooms, Notebooks, etc).
- Also has its own dedicated View where you can view them all.

---

## Function

### Central Menu / Navigation Bar

A menu bar that spans all pages and stays locked in the same place on screen no matter scrolling or page position, on a layer above everything else.

- Has some basic navigation buttons, maybe the option to customize which buttons are on it.

**Some button / tab ideas for navigation:**

- Home, Cubbies, Calendar, House, Notebooks, user defined specific Cubby or Room etc., Settings, etc.

**Some button / tab ideas for functions:**

- New (opens menu to choose what kind of item to create "new" for: Task, Reminder, Cubby, Room, Notebook page, Widget (Day tracker etc), etc.)

---

### Task Details / Memos

More in depth options that can be added to a task or subtask, beyond tags / due dates / priority etc.

- The option to add "memos" or "details" to tasks, which are just custom notes or descriptions.
- For example, for the task "Brainstorm ideas for Cubby", you could add a memo or description like "Don't forget to take a break to go for a walk" or something.
- Either the details for a task can appear on a new page / window when you click a "details" icon button that's on the task, or maybe they appear as a window that pops up smaller from the task like a bubble, or maybe they're part of the dropdown menu that subtasks appear in.

**More "details" can include:**

- Description / memo
- Assign to House
- Assign task to other Cubby user / add remove people to task
- etc.

**Progress bars:**

- Progress bars for things like tasks with subtasks, etc.

> **[Clarification]:** This means if a task has 4 subtasks and 2 are completed, the task would show a 50% progress bar. This gives a visual sense of completion without having to expand and count subtasks.

---

### Interface / UI

**Icons for tasks and cubbies:**

- Choose from a selection of icons to assign to a task or cubby or room etc.
- Alternatively, upload your own images as icons.

**Custom banners and backgrounds for rooms / cubbies / etc:**

- Pick an image to use as a banner for a cubby or room.
- Adjust the background image opacity over a solid color, choose tiled, stretch / crop, etc.

**Themes:**

- A few default options, with more able to be custom installed.

---

## Misc Ideas (Down The Road)

- Apple Glass looking buttons and design
- Very subtle gradients
