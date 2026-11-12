---
name: PuneAfterhours
description: A classified sheet on newsprint, with one red shell, ink type, and green only once something is settled.
colors:
  newsprint: "#c5c8c4"
  sheet: "#e7e8e4"
  field: "#f7f7f5"
  on-red: "#fff7f2"
  ink: "#1c1916"
  muted: "#2c3833"
  neighbor: "#394640"
  rule: "rgba(28, 25, 22, .22)"
  red: "#9c1c16"
  ok: "#2f5d50"
  confirm: "#e5f2eb"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(40px, 6vw, 56px)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.02em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.02em"
  title:
    fontFamily: "Source Sans 3, Segoe UI, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Source Sans 3, Segoe UI, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Source Sans 3, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.45
rounded:
  sm: "6px"
  md: "8px"
  pill: "999px"
spacing:
  tight: "4px"
  stack: "8px"
  row: "12px"
  gap: "14px"
  inset: "22px"
  page: "28px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.field}"
    rounded: "{rounded.sm}"
    padding: "11px 14px"
  button-primary-hover:
    backgroundColor: "{colors.red}"
    textColor: "{colors.field}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "11px 14px"
  button-quiet-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.field}"
  button-choice:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 14px"
  button-choice-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.field}"
    rounded: "{rounded.pill}"
    padding: "10px 14px"
  input:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px"
    width: "100%"
  shell:
    backgroundColor: "{colors.red}"
    textColor: "{colors.on-red}"
    padding: "14px 22px"
  nav-tab:
    textColor: "{colors.on-red}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  nav-tab-current:
    backgroundColor: "{colors.on-red}"
    textColor: "{colors.red}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "20px 18px 16px"
  confirm:
    backgroundColor: "{colors.confirm}"
    textColor: "{colors.ok}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
---

# Design System: PuneAfterhours

## Overview

**Creative North Star: "The Classified Sheet"**

PuneAfterhours is a working sheet. The ground is newsprint gray, the type is ink, and one red runs the full-bleed shell and every heading. Groups of work sit on a lighter flat sheet. Panels stay flat.

A screen is a column of facts. Home puts four jobs in one row of sheets. Every other collection is a list: a hairline under each row, a condensed red day when the row is a birthday, the name in ink, the detail a step quieter. Hover or focus a list and the row you are on keeps its name at full ink while the other names drop one step. Green marks a plan the host has locked, and the banner after a form is accepted. A plan that is still a proposal, and a source that is down, stay red. A healthy source list is unmarked.

Barlow Condensed carries the wordmark, the headings, and the day numeral. Source Sans 3 carries the sentences, the facts, the labels, and the buttons. Corners stay small. The only full pills are single-select choices. State changes cut from one color to the next.

**Key Characteristics:**

- Newsprint ground, a lighter sheet, a near-white field
- One red for the shell, the headings, the links, and unsettled states
- Green only for a locked plan or an accepted form
- Barlow Condensed for headings and the day, Source Sans 3 for text
- Flat sheets and hairline rows
- The active list name stays ink; the others step down

## Colors

A gray sheet, one red, ink, and a green that appears once something is settled.

### Primary

- **Shell Red** (#9c1c16): The full-bleed bar, every heading, text links, text selection, the scrollbar thumb, and any unsettled state. "Not locked" and a source that is unavailable are this red. An action wears it only while hovered. The bar and the headings are the same red.

### Secondary

- **Locked Green** (#2f5d50): The label when a host has locked a plan, and the text of the banner after a form is accepted.
- **Confirm Wash** (#e5f2eb): The fill of that accepted-form banner. It is the only green surface.

### Neutral

- **Newsprint** (#c5c8c4): The page ground and the scrollbar track.
- **Sheet** (#e7e8e4): Job panels, form cards, and any grouped block.
- **Field** (#f7f7f5): Input fill, the unselected choice, and the text on an ink button.
- **On-red Cream** (#fff7f2): Type on the shell, the current tab's chip, and selected text.
- **Ink** (#1c1916): Body, facts, buttons at rest, field strokes, and the focus outline.
- **Muted** (#2c3833): Hints, privacy lines, empty states, and the detail under a row name.
- **Neighbor** (#394640): Names in a list that is hovered or focused, except the row you are on.
- **Hairline** (rgba(28, 25, 22, .22)): The rule under every list row. Ink at 22% opacity.

### Named Rules

**The One Red Rule.** The shell, the headings, text links, text selection, and every unsettled state share Shell Red. An action wears that red only on hover.

**The Locked Green Rule.** Locked Green is the locked label. Confirm Wash is the banner after a form is accepted. A source that is up leaves the state line empty. A source that is down, and a plan that is not locked, stay Shell Red.

## Typography

**Display Font:** Barlow Condensed (with Arial Narrow, sans-serif)
**Body Font:** Source Sans 3 (with Segoe UI, sans-serif)

**Character:** Condensed and heavy for the words that name a section. A plain sans, in ink, for everything a person reads or fills in. The heading names the category. The line under it is ordinary type.

### Hierarchy

- **Display** (700, clamp(40px, 6vw, 56px), line-height 1, tracking 0.02em): The page title, in Shell Red. On a phone it sits at 40px.
- **Headline** (700, 34px, line-height 1, tracking 0.02em): Section and job headings, in Shell Red. 30px on a phone, and 26px when the heading is a job in the stacked home row. The shell wordmark is the same face at 32px (26px on a phone), in On-red Cream, tracking 0.01em, line-height 1.
- **Title** (700, 20px, line-height 1.3): The one fact in a job sheet, in Ink, set in Source Sans 3. 16px inside a job sheet on a phone.
- **Body** (400, 17px, line-height 1.5): Sentences. Opening lines and section lines are 18px at line-height 1.45, capped at 68 characters, and drop to 15px and 1.35 on a phone.
- **Label** (700, 15px, line-height 1.45): Form labels, in Ink. The same size at regular weight, in Muted, is the hint, the empty state, the privacy line, and the detail under a name. A row name is 17px and bold.

### Named Rules

**The Two Faces Rule.** Barlow Condensed is the wordmark, the headings, and the day numeral. Source Sans 3 is every sentence, fact, label, button, and tab.

## Layout

The shell is full bleed. The wordmark sits on one side and the text links on the other, wrapping as a group, with an 8px by 20px gap and padding of 14px 22px. On a phone the bar padding is 10px 12px and the gap is 6px. Content is a centered column, max width 1120px, padding 28px 22px 64px. On a phone that padding is 12px 12px 40px. Home jobs are four columns with a 14px gap. At 980px the grid is two columns. At 640px it is one column, the gap closes to 6px, and each job sheet's padding tightens to 8px 12px. Lists and forms use the column width. A heading that follows content in the column picks up 40px above it. Opening copy stops at 68 characters.

**The Working Column Rule.** Content sits in one column, 1120px wide, under a full-bleed bar. The bar wraps so every link stays on screen. Home jobs are four columns, two columns at 980px, and one column at 640px.

## Elevation & Depth

No shadows. Depth is the tone step from newsprint to sheet to field. A panel does not move when pointed at. Focus is a 3px solid ink outline, offset 2px. Text selection fills with Shell Red and sets the type in On-red Cream. The scrollbar thumb is Shell Red on the newsprint track.

**The Flat Sheet Rule.** Panels are flat. Depth is the step from newsprint to sheet to field. Focus is a 3px ink outline, offset 2px.

## Shapes

Sheets and cards are 8px. Buttons, tabs, fields, and the confirmation banner are 6px. A single-select choice is a pill (999px) with a 1.5px ink stroke. Fields and the quiet button use that same 1.5px ink stroke. List rows are square at the corner and close with a 1px rule, including the last row.

**The Small Corner Rule.** A sheet is 8px. A button, tab, field, and the confirmation banner are 6px.

**The Pill Is a Choice Rule.** A fully round pill is a single-select choice. Navigation and actions stay at 6px.

**The Rule List Rule.** A list is rows separated by a 1px ink rule at 22% opacity.

## Components

### Buttons

Actions are short, heavy, and ink. They read as stamps.

- **Shape:** Gently squared (6px).
- **Primary:** Ink fill, field text, padding 11px 14px, 15px bold. A job-sheet action is this same control, set at the end of the sheet, with the underline removed. The form submit stretches to the sheet width, centers its label, and sits 18px below the fields. On a phone the job action tightens to 8px 12px.
- **Hover / Focus:** Hover cuts the fill to Shell Red and keeps the field text. Focus is the 3px ink outline, offset 2px. A disabled submit drops to 45% opacity, loses the pointer, and stays ink on hover.
- **Quiet:** Transparent, ink text, a 1.5px ink border, the same radius and padding. Hover fills with ink and flips the text to field. This is the undo, such as removing an RSVP.

### Choice groups

- **Style:** Pill, field fill, ink text, 1.5px ink border, padding 10px 14px, 15px bold. The group wraps with an 8px gap.
- **State:** The selected choice is ink with field text. The others stay field. Pointing at a choice does not fill it.

### Sheets

- **Corner Style:** 8px.
- **Background:** Sheet, on the newsprint ground.
- **Shadow Strategy:** None. See Elevation & Depth.
- **Border:** None.
- **Internal Padding:** 20px 18px 16px, stacked with an 8px gap. Inside a job sheet the action sits at the end. On a phone a job sheet tightens to 8px 12px with a 2px stack.

### Inputs

- **Style:** Full width, field fill, 1.5px ink border, 6px radius, 12px padding, 16px type. The caret is Shell Red. A textarea is at least 96px tall and grows vertically. A paired control, such as day and month, shares a row with a 10px gap. The label above a field is 15px bold, with 16px above it and 6px below.
- **Focus:** The 3px ink outline, offset 2px.
- **Error / Disabled:** No error color is defined. A failed action is said in hint text. The submit stays disabled, at 45% opacity, until the form is ready.

### Navigation

The shell is a full-bleed red bar. The wordmark is Barlow Condensed, 700, 32px, line-height 1, tracking 0.01em, in On-red Cream, with no underline. Tabs wrap, with a 4px gap. A tab is 16px bold, On-red Cream, padding 8px 12px, 6px corners, no underline. Hover lays On-red Cream over the bar at 16% opacity. The current tab is an On-red Cream chip with Shell Red type. On a phone the wordmark is 26px, tabs are 15px, and tab padding is 7px 8px.

### List rows

A collection is a stack of rules, on the newsprint, not a stack of sheets.

- A row is a flex line, baseline aligned, gap 14px, padding 12px 2px, with the hairline under it. When the row is the link, the underline is removed and the type stays ink.
- The day numeral is Barlow Condensed, 700, 28px, Shell Red, at least 36px wide.
- The name is 17px bold. The detail is 15px, in Muted.
- A stacked row, such as a proposal, turns the same rule into a column with a 4px gap. Its state line is 15px bold: Shell Red while the plan is not locked or a source is unavailable, Locked Green when the host has locked it.

**The Focus Holds the Row Rule.** When a list is hovered or contains focus, every row name drops to Neighbor, and the name under the pointer or inside the focused row returns to Ink. The day numeral and the detail stay as they are.

### Confirmation

The accepted-form banner uses Confirm Wash, Locked Green type, weight 600, 6px corners, and padding 12px 14px, with 14px above it. It stays hidden until the submit succeeds.

**The Ink Button Rule.** An action is ink with field-colored text. Hover cuts the fill to Shell Red. A disabled action stays ink at 45% opacity.

## Do's and Don'ts

### Do:

- **Do** set the ground to newsprint and a working group to the sheet color, with fields a step lighter.
- **Do** use Shell Red for the bar, headings, links, selection, and any unsettled state.
- **Do** keep an action ink at rest, with field-colored type and 6px corners, and turn the fill red only on hover.
- **Do** separate list rows with the hairline rule, and drop the other names to Neighbor while the active name stays ink.
- **Do** use Locked Green and Confirm Wash only for a locked label or the accepted-form banner.
- **Do** set the wordmark, headings, and day numeral in Barlow Condensed, and sentences, facts, labels, and buttons in Source Sans 3.
- **Do** mark focus with a 3px ink outline, offset 2px.

### Don't:

- **Don't** add a shadow, a blur, a lift, or a second red.
- **Don't** turn a list into sheets or cards.
- **Don't** use green for a link, a heading, a button, a not-locked plan, or a source that is down.
- **Don't** paint a resting button red, or round an action into a pill.
- **Don't** set a sentence in Barlow Condensed, or a heading in Source Sans 3.
- **Don't** collapse the shell into a menu. The bar wraps.
