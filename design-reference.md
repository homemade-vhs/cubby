# Cubby — Design Reference

A complete reference of all colors, sizes, spacing, and design tokens used in Cubby. Use this when creating mockups in Photoshop.

**Canvas size**: 1440 × 900px (desktop) / 390 × 844px (mobile)
**Font**: Plus Jakarta Sans (Google Fonts) — weights: 400, 500, 600, 700, 800
**All UI text is lowercase** — only user-typed content keeps original casing.

---

## Colors

### Core Surfaces

| Element | Hex / Value | Notes |
|---------|-------------|-------|
| Page background | `#0a0a0f` | Near-black, used on all screens |
| Sidebar background | `#0d0d14` | Barely lighter than page bg |
| Sidebar right border | `rgba(255,255,255, 0.06)` | 1px solid |
| Modal background | `#1a1a24` | Dark blue-gray |
| Card / container bg | `rgba(255,255,255, 0.03)` | Nearly invisible |
| Card border | `rgba(255,255,255, 0.06)` | Faint white |
| Card hover bg | `rgba(255,255,255, 0.05)` | Slightly brighter |
| Button bg | `rgba(255,255,255, 0.05)` | Same as input bg |
| Button border | `rgba(255,255,255, 0.08)` | Slightly more visible |
| Input field bg | `rgba(255,255,255, 0.05)` | |
| Input field border | `rgba(255,255,255, 0.15)` | More visible for usability |
| Input focus border | `rgba(255,255,255, 0.3)` | |
| Dashed placeholder border | `rgba(255,255,255, 0.1)–0.15` | "Add new" buttons |

### Text Colors

| Element | Value | Notes |
|---------|-------|-------|
| Primary text | `#ffffff` | White |
| Body text | `rgba(255,255,255, 0.8)` | Slightly dimmed |
| Muted text | `rgba(255,255,255, 0.5)` | Labels, subtitles |
| Subtle text | `rgba(255,255,255, 0.4)` | Section labels, counts |
| Placeholder / dim text | `rgba(255,255,255, 0.3)` | Placeholder text, arrows |
| Disabled / empty text | `rgba(255,255,255, 0.25)` | Empty states |
| Version / faintest text | `rgba(255,255,255, 0.15)` | Logo, version number |

### 8 Cubby Theme Colors

Each cubby gets one of these as its accent color. The primary color is used for dots, checkboxes, borders, and highlights.

| Theme | Primary | Card bg (15%) | Border (45%) | Light Text |
|-------|---------|---------------|--------------|------------|
| Blue | `#6BA3FF` | `rgba(107,163,255, 0.15)` | `rgba(107,163,255, 0.45)` | `#c5dfff` |
| Purple | `#C77DFF` | `rgba(199,125,255, 0.15)` | `rgba(199,125,255, 0.45)` | `#e8c8ff` |
| Pink | `#FF6BAD` | `rgba(255,107,173, 0.15)` | `rgba(255,107,173, 0.45)` | `#ffc8e0` |
| Red | `#FF6B6B` | `rgba(255,107,107, 0.15)` | `rgba(255,107,107, 0.45)` | `#ffc8c8` |
| Orange | `#FFB05A` | `rgba(255,176,90, 0.15)` | `rgba(255,176,90, 0.45)` | `#ffe0c0` |
| Yellow | `#FFE85A` | `rgba(255,232,90, 0.15)` | `rgba(255,232,90, 0.45)` | `#fff8c0` |
| Green | `#6BF5A0` | `rgba(107,245,160, 0.15)` | `rgba(107,245,160, 0.45)` | `#c0ffe0` |
| Teal | `#5AF0E0` | `rgba(90,240,224, 0.15)` | `rgba(90,240,224, 0.45)` | `#c0fff8` |

Each theme also has: hover bg at 25% opacity, muted text at 70% opacity, glow at 50% opacity.

### Due Date Colors

| Status | Text Color | Background (20% opacity of text color) |
|--------|------------|----------------------------------------|
| Overdue | `#ff6b6b` | `rgba(255,107,107, 0.2)` |
| Today | `#feca57` | `rgba(254,202,87, 0.2)` |
| Tomorrow | `#2ed573` | `rgba(46,213,115, 0.2)` |
| This week | `#5B8EFF` | `rgba(91,142,255, 0.2)` |
| Next week | `#a55eea` | `rgba(165,94,234, 0.2)` |
| Future | `#ffffff` | `rgba(255,255,255, 0.12)` |

### Tag Colors

| Tag | Text Color | Background (25% opacity) |
|-----|------------|--------------------------|
| Red | `#ff6b6b` | `rgba(255,107,107, 0.25)` |
| Orange | `#ff9f43` | `rgba(255,159,67, 0.25)` |
| Yellow | `#feca57` | `rgba(254,202,87, 0.25)` |
| Green | `#2ed573` | `rgba(46,213,115, 0.25)` |
| Blue | `#5B8EFF` | `rgba(91,142,255, 0.25)` |
| Purple | `#a55eea` | `rgba(165,94,234, 0.25)` |
| Pink | `#ff6bb5` | `rgba(255,107,181, 0.25)` |
| Gray | `rgba(255,255,255, 0.7)` | `rgba(255,255,255, 0.15)` |

### UI Accent Colors

| Element | Color |
|---------|-------|
| Confirm / primary buttons | `#5B8EFF` |
| Confirm button pressed | `#4a7de8` |
| Delete buttons | `#ff4444` |
| Delete text / icons | `#ff6b6b` |
| Delete hover bg | `rgba(255,107,107, 0.1)` |
| Edit mode accent (blue) | `#6ba3ff` |

---

## Border Radius (Rounded Corners)

| Radius | Used On |
|--------|---------|
| **20px** | Room cards, cubby browse sections, modals, large containers |
| **16px** | Cubby cards, stat cards, quick action buttons, add-cubby buttons, section wrappers |
| **14px** | Quick action icon circles, cubby browse items |
| **12px** | Tasks, buttons (back, settings, toggle), inputs, context menus, add-task buttons |
| **10px** | Tag input containers, move options, smaller buttons, pills |
| **8px** | Small pills (due date, tag counts, control buttons), color swatches |
| **6px** | Checkboxes, expand buttons, due date badges |
| **50% (circle)** | Color dots, avatars, color picker buttons |

> **Rule of thumb**: Bigger element = bigger radius. Cards: 16–20px. Buttons: 10–12px. Small pills: 6–8px.

---

## Border / Stroke Widths

| Width | Used On |
|-------|---------|
| **1px solid** | Buttons, inputs, modals, menus, small elements |
| **1px dashed** | "Add new" placeholder buttons (add task, add cubby, add workspace) |
| **2px solid** | Room cards, stat cards, cubby browse sections, expanded task borders, checkboxes |
| **2px dashed** | Edit mode containers |

> **Rule of thumb**: Most borders are 1px. Larger cards (rooms, cubbies, stats) use 2px.

---

## Font Sizes

| Size | Used On |
|------|---------|
| **36px** | Cubby title (inside a cubby, the big name at top) |
| **28px** | Dashboard stat numbers |
| **24px** | Greeting name ("good morning, matt") |
| **20px** | Modal titles, room card names |
| **18px** | Plus (+) signs on "add" buttons |
| **16px** | Task text, input fields, modal buttons, greeting subtext, room info |
| **14px** | Button labels, descriptions, back button text, menu items, date inputs |
| **13px** | Section headings ("workspaces", "upcoming"), sidebar nav items, banner text |
| **12px** | "See all" links, sidebar cubby names, stat card labels |
| **11px** | Due date pill text, stat card sublabels, small button labels, task counts |
| **10px** | Tag text |

---

## Font Weights

| Weight | Name | Usage |
|--------|------|-------|
| **800** | Extra Bold | Cubby title, section labels, greeting name |
| **700** | Bold | Modal titles, room names, stat numbers, subcubby headers |
| **600** | Semibold | Buttons, tags, due date pills, nav items, sidebar items |
| **500** | Medium | Body text, task text, descriptions, muted labels |
| **400** | Regular | Rarely used — most body text is 500 |

---

## Spacing & Padding

| Size | Used On |
|------|---------|
| **24px** | Modal inner padding, large section spacing |
| **20px** | Screen padding (left/right edges), cubby card padding, room card gaps |
| **16px** | Task inner padding, menu item padding, card padding, section gaps |
| **12px** | Gap between checkbox/text/buttons in a task row, cubby browse item gap |
| **8px** | Small gaps (icon-to-text, tag spacing, tight margins) |
| **6px** | Tightest gaps (between task cards, tag pill gaps) |

---

## Element Sizes

| Element | Size |
|---------|------|
| Sidebar | 260px wide, full height |
| Bottom nav (mobile) | 72px tall + safe area inset |
| Content max-width (desktop) | 800px centered (some screens 700 or 900) |
| Modal max-width | 400px |
| Checkbox | 24 × 24px |
| Expand button | 28 × 28px |
| Quick action icon circle | 44 × 44px |
| Color swatch | 32 × 32px |
| Color dot (in swatch) | 14 × 14px |
| Cubby browse dot | 10 × 10px |
| Upcoming task dot | 8 × 8px |
| Due date badge | 64px wide (fixed) |
| Tag color picker button | 24 × 24px |

---

## Transitions & Animations

| Speed | Used On |
|-------|---------|
| **0.15s ease** | Fast micro-interactions (hover color, tag selection) |
| **0.2s ease** | Standard (buttons, cards, backgrounds, borders) |
| **0.3s ease** | Larger animations (chevron rotation, expand/collapse) |
| **0.3s cubic-bezier(0.4, 0, 0.2, 1)** | Sidebar slide in/out |

---

## Shadows & Effects

| Element | Value |
|---------|-------|
| Modal shadow | `0 20px 60px rgba(0,0,0, 0.5)` |
| Context menu shadow | `0 10px 40px rgba(0,0,0, 0.5)` |
| Checked checkbox glow | `0 0 12px` + cubby's glow color |
| Modal backdrop blur | `blur(4px)` |
| Card backdrop blur | `blur(12px)` |
| Modal backdrop color | `rgba(0,0,0, 0.7)` |

---

## Hover & Click Effects

- **Hover**: Elements brighten via `filter: brightness(1.1) saturate(1.1)` or background color change
- **Click pop**: Elements shrink to `scale(0.95)`, darken with `brightness(0.9)`, then spring back with `cubic-bezier(0.34, 1.56, 0.64, 1)` (bouncy overshoot)
- **Active press**: Background shifts to slightly brighter `rgba(255,255,255, 0.1)` or `0.02`

---

## Layout Reference (Desktop at 1440px)

```
┌─────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌────────────────────────────────────────┐ │
│ │          │ │                                        │ │
│ │ SIDEBAR  │ │         CONTENT AREA                   │ │
│ │  260px   │ │     (centered, max 800px)              │ │
│ │          │ │                                        │ │
│ │          │ │   ┌──────────────────────────┐         │ │
│ │  Nav     │ │   │   Your actual content    │         │ │
│ │  links   │ │   │   lives in here          │         │ │
│ │          │ │   │                          │         │ │
│ │  ─────── │ │   └──────────────────────────┘         │ │
│ │          │ │          ↑ 800px max ↑                  │ │
│ │  Work-   │ │     ~190px          ~190px             │ │
│ │  spaces  │ │     empty           empty              │ │
│ │          │ │                                        │ │
│ │  ─────── │ │                                        │ │
│ │  User    │ │                                        │ │
│ └──────────┘ └────────────────────────────────────────┘ │
│   260px                    1180px                       │
└─────────────────────────────────────────────────────────┘
                         1440px
```
