---
name: PuneAfterhours
description: Four flat color pans on white, in one slab, for a small crew.
colors:
  magenta: "#c2185b"
  turmeric: "#f0b400"
  indigo: "#3949ab"
  leaf: "#2e7d32"
  magenta-wash: "#f3d0de"
  white: "#fff"
  ink: "#1c1914"
  rim: "#111"
typography:
  display:
    fontFamily: "Zilla Slab, Iowan Old Style, Palatino, serif"
    fontSize: "clamp(36px, 5vw, 52px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Zilla Slab, Iowan Old Style, Palatino, serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Zilla Slab, Iowan Old Style, Palatino, serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "Zilla Slab, Iowan Old Style, Palatino, serif"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.45
  label:
    fontFamily: "Zilla Slab, Iowan Old Style, Palatino, serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.45
rounded:
  pan: "18px"
  row: "14px"
  field: "12px"
  pill: "999px"
spacing:
  tight: "4px"
  stack: "8px"
  row: "12px"
  list: "14px"
  block: "16px"
  card: "18px"
  side: "22px"
  foot: "64px"
components:
  button-primary:
    backgroundColor: "{colors.rim}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  button-primary-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.rim}"
  button-quiet:
    backgroundColor: "{colors.white}"
    textColor: "{colors.rim}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  button-quiet-hover:
    backgroundColor: "{colors.rim}"
    textColor: "{colors.white}"
  button-choice:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  button-choice-on:
    backgroundColor: "{colors.rim}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "12px"
    width: "100%"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "5px 10px"
  nav-link-hover:
    backgroundColor: "{colors.magenta-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "5px 10px"
  nav-link-current:
    backgroundColor: "{colors.magenta}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "5px 10px"
  pan-birthday:
    backgroundColor: "{colors.magenta}"
    textColor: "{colors.white}"
    rounded: "{rounded.pan}"
    padding: "14px 14px 16px"
  pan-wall:
    backgroundColor: "{colors.turmeric}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pan}"
    padding: "14px 14px 16px"
  pan-proposal:
    backgroundColor: "{colors.indigo}"
    textColor: "{colors.white}"
    rounded: "{rounded.pan}"
    padding: "14px 14px 16px"
  pan-whats-on:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.white}"
    rounded: "{rounded.pan}"
    padding: "14px 14px 16px"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pan}"
    padding: "18px 16px 16px"
  list-row:
    textColor: "{colors.ink}"
    rounded: "{rounded.row}"
    padding: "12px"
  confirm:
    backgroundColor: "{colors.turmeric}"
    textColor: "{colors.ink}"
    rounded: "{rounded.row}"
    padding: "12px 14px"
---

# Design System: PuneAfterhours

## Overview

**Creative North Star: "Four flat color pans"**

PuneAfterhours is four flat color pans for a small crew. The ground is white. Birthday, Wall, Proposal, and What's on are equal jobs, each a solid pan with one fact and one action. The page is not a newspaper and not a poster, and it has no hero.

The bar is white. The wordmark is Zilla Slab in ink, with five links beside it. The link you are on is a magenta chip. The pan you are on has a 4px black rim, and the others do not. A form card wears that same rim. Nothing flashes and nothing lifts. No rule runs between the pans. Only the gap.

One face does the whole page. Zilla Slab at 700 carries the wordmark, names, labels, and buttons. The same face at 500 carries facts and sentences. Italics are not used. Body text on white is ink. A heading inside a pan inherits that pan's foreground: white on magenta, indigo, and leaf, and ink on turmeric.

**Key Characteristics:**

- White ground and four equal pans: magenta, turmeric, indigo, and leaf
- One face, Zilla Slab: 700 for names and 500 for facts, no italics
- A 4px black rim on the pan you are on, and the same rim on form cards
- Black pill buttons that invert to white on hover
- The current link is a magenta chip
- List rows have no hairline and take the rim on hover or focus

## Colors

Four equal pans on a white ground, with ink for reading and a black rim for the thing you are on.

### Primary

- **Birthday Magenta** (#c2185b): The Birthday pan, with white type. On the white page it is also the text link, the current nav chip, the day numeral, text selection, the caret, and the scrollbar thumb.
- **Wall Turmeric** (#f0b400): The Wall pan, with ink type. It is also the fill of the banner after a form is accepted, with ink type.
- **Proposal Indigo** (#3949ab): The Proposal pan, with white type. It is also the color of a source tag on a discovered event.
- **Leaf** (#2e7d32): The What's on pan, the green, with white type. It marks that job. It does not mark a locked plan or a healthy source.
- **Magenta Wash** (#f3d0de): The hover fill behind a nav link that is not the current one. The label stays ink. It is not a fifth pan.

### Neutral

- **White** (#fff): The page ground, the bar, form cards, fields, the unselected choice, the quiet button, the inverted action, and the type on the magenta, indigo, and leaf pans.
- **Ink** (#1c1914): Body text on white, page headings, type on turmeric, and the type on an unselected choice.
- **Rim** (#111): The 4px outline, the focus outline, the button fill, and the 2px stroke on buttons, choices, and fields.

### Named Rules

**The Equal Pans Rule.** Birthday magenta, Wall turmeric, Proposal indigo, and What's on leaf are four equal fills. None outranks the others. No rule sits between them. Only the gap.

**The Inherited Heading Rule.** A heading inside a pan inherits that pan's foreground: white on magenta, indigo, and leaf, and ink on turmeric. A heading on white is ink.

**The Magenta Mark Rule.** On white, magenta is the text link, the current nav chip, the day numeral, text selection, the caret, and the scrollbar thumb. It does not recolor a heading on the white page.

## Typography

**Display Font:** Zilla Slab (with Iowan Old Style, Palatino, serif)
**Body Font:** Zilla Slab (with Iowan Old Style, Palatino, serif)

**Character:** One slab for the wordmark, the names, and the sentences. Weight does the ranking. 700 names a thing. 500 tells the fact.

### Hierarchy

- **Display** (700, clamp(36px, 5vw, 52px), line-height 1.05, tracking -0.02em): The page title, in ink. On a phone it is 36px.
- **Headline** (700, 28px, line-height 1.05, tracking -0.02em): Section headings on white, in ink, and the name of a pan, in that pan's foreground. 26px on a phone, and 22px when the heading is a pan in the stacked home row. The wordmark is the same face at 28px (24px on a phone), in ink, tracking -0.02em, line-height 1, with no underline.
- **Title** (500, 18px, line-height 1.3): The one fact in a pan. 16px inside a pan on a phone.
- **Body** (500, 17px, line-height 1.45): Sentences. Opening lines and section lines are 18px at line-height 1.4, capped at 68 characters, and drop to 16px and 1.35 on a phone.
- **Label** (700, 16px, line-height 1.45): Form labels, nav links, and buttons. Hints, empty states, privacy lines, and the detail under a row name are 16px at weight 500. On white they are ink. Inside a pan they inherit. A row name is 17px and 700. A day numeral is 26px and 700, in magenta. A source tag is 15px and 700, in indigo. On a phone, nav links are 15px, and the hint and state inside a pan are 15px.

### Named Rules

**The One Slab Rule.** Zilla Slab is the only face. 700 is the wordmark, the names, the labels, and the buttons. 500 is the facts and the sentences. The italic is not loaded and not used.

## Layout

The bar is full bleed and white. The wordmark sits on one side and the links on the other, wrapping as a group, with an 8px by 20px gap and padding of 14px 22px 8px. On a phone the bar padding is 10px 12px 6px and the gap is 6px. Content is a centered column, max width 1120px, padding 12px 22px 64px. On a phone that padding is 8px 12px 32px. Home pans are four columns with a 12px gap. At 980px the grid is two columns. At 640px it is one column, the gap closes to 8px, and each pan's padding tightens to 10px 12px 12px. Lists and forms use the column width. A heading that follows content in the column picks up 36px above it. Opening copy stops at 68 characters.

**The Working Column Rule.** Content sits in one column, 1120px wide, under a white bar that wraps so every link stays on screen. Home pans are four columns, two columns at 980px, and one column at 640px.

**The No Hero Rule.** The first viewport is the white bar, one lede, and the four pans. There is no hero.

## Elevation & Depth

No shadows. The page does not step through a tonal ladder. Depth is the 4px solid rim. A form card wears it at rest. A pan wears it when it is the one you are on. A list row wears it on hover or focus. A control's focus is the same rim, offset 2px. Text selection fills with Birthday Magenta and sets the type in white. The scrollbar thumb is Birthday Magenta on the white track.

**The Rim Rule.** The only depth mark is a 4px solid black rim. It sits on the pan you are on, on every form card, and on a list row under hover or focus. Focus on a control is that same rim, offset 2px. There is no shadow.

**The Still Rule.** Nothing flashes, lifts, or eases between colors. A hover swaps a fill. The page may scroll smoothly, and reduced motion turns that off.

## Shapes

Pans and form cards are 18px. List rows and the accepted banner are 14px. Fields are 12px. Buttons, choices, and nav links are pills (999px). Fields, buttons, choices, and the quiet action use a 2px solid rim stroke. The pan, the card, and the focused row use a 4px outline, so the corner stays the radius of the shape.

**The Pan Corner Rule.** A pan and a form card are 18px. A list row and the accepted banner are 14px. A field is 12px.

**The Pill Rule.** A button, a choice, and a nav link are pills. The current link is a magenta pill. An action is a black pill.

**The Open List Rule.** A list row does not close with a hairline. Hover or focus draws the 4px rim.

## Components

### Buttons

Actions are black pills. They are the one thing to do on a pan or at the end of a form.

- **Shape:** Pill (999px), with a 2px rim stroke.
- **Primary:** Rim fill, white text, padding 8px 14px, 16px at weight 700. A pan action sits at the end of the pan, with the underline removed. The form submit stretches to the card width, centers its label, and sits 18px below the fields. On a phone the pan action sits 6px below the fact.
- **Hover / Focus:** Hover inverts the fill to white and the type to rim. Focus is the 4px rim outline, offset 2px. A disabled submit drops to 45% opacity, loses the pointer, and stays a black pill on hover.
- **Quiet:** White fill, rim text, a 2px rim stroke, the same radius and padding. Hover fills with the rim and flips the type to white. This is the undo, such as removing an RSVP.

**The Black Pill Rule.** An action is a black pill with white type and a 2px black stroke. Hover inverts it to a white pill with black type. A disabled submit stays the black pill at 45% opacity and does not invert.

### Chips

A choice group is a wrap of single-select pills. The current-page chip is part of the bar, under Navigation.

- **Style:** Pill, white fill, ink text, 2px rim stroke, padding 8px 14px, 16px at weight 700. The group wraps with an 8px gap.
- **State:** The selected choice is rim with white text. The others stay white. Pointing at a choice does not fill it.

### Cards

Two containers, both 18px, both flat.

Job pans are the four home jobs. Each pan is one name, one fact, and one action.

- **Corner Style:** 18px.
- **Background:** Birthday is magenta with white type. Wall is turmeric with ink type. Proposal is indigo with white type. What's on is leaf with white type.
- **Shadow Strategy:** None. See Elevation & Depth.
- **Border:** None. The pan you are on wears the 4px rim outline. At rest that pan is Birthday. Pointing at a pan, or focusing inside it, moves the rim and clears the others.
- **Internal Padding:** 14px 14px 16px, stacked with a 4px gap. On a phone, 10px 12px 12px. The heading inherits the pan foreground. The fact is 18px at weight 500, and 16px on a phone. The action is the black pill.

Form cards hold a signup, a proposal, an RSVP, or the admin gate.

- **Corner Style:** 18px.
- **Background:** White, on the white ground, so the rim is what separates the card.
- **Shadow Strategy:** None.
- **Border:** The 4px rim outline is always on.
- **Internal Padding:** 18px 16px 16px, stacked with an 8px gap.

**The Current Pan Rule.** At rest, Birthday wears the rim. Pointing at a pan, or focusing inside it, moves the rim to that pan and clears the others. Leaving the row returns the rim to Birthday. A form card keeps the rim whether or not it is hovered.

### Inputs

- **Style:** Full width, white fill, 2px rim stroke, 12px radius, 12px padding, 16px type at weight 500. The caret is Birthday Magenta. A textarea is at least 96px tall and grows vertically. A paired control, such as day and month, shares a row with a 10px gap. The label above a field is 16px at weight 700, with 16px above it and 6px below.
- **Focus:** The 4px rim outline, offset 2px.
- **Error / Disabled:** No error color is defined. A failed action is said in hint text. The submit stays disabled, at 45% opacity, until the form is ready.

### Navigation

The bar is white and full bleed. The wordmark is Zilla Slab, 700, 28px, line-height 1, tracking -0.02em, in ink, with no underline. Links wrap, with a 4px gap. A link is 16px at weight 700, ink, padding 5px 10px, a pill, no underline. Hover lays Magenta Wash behind the ink label. The current link is a Birthday Magenta chip with white type, and it stays magenta when hovered. On a phone the wordmark is 24px, links are 15px, and link padding is 4px 8px.

A text link in the column is Birthday Magenta, underlined, with the underline offset 3px. The link after a list, and the source links in a row, are that same magenta at weight 700.

### List rows

A collection is a stack of open rows on the white ground.

- A row is a flex line, baseline aligned, gap 14px, padding 12px, radius 14px. When the row is the link, the underline is removed and the type stays ink.
- Hover or focus draws the 4px rim. The name stays ink, and the other names stay ink.
- The day numeral is 700, 26px, Birthday Magenta, at least 36px wide.
- The name is 17px at weight 700. The detail is 16px at weight 500, in ink.
- A stacked row, such as a proposal or a discovered event, turns the same row into a column with a 4px gap. Its state line is 16px at weight 700 and inherits the surface, whether the plan is locked, still a proposal, or a source is unavailable. A source tag is 15px at weight 700, in Proposal Indigo.

### Confirmation

The accepted-form banner uses Wall Turmeric, ink type, weight 700, 14px corners, and padding 12px 14px, with 14px above it. It stays hidden until the submit succeeds. A link inside the banner stays Birthday Magenta.

## Do's and Don'ts

### Do:

- **Do** set the ground and the bar to white, and paint Birthday magenta, Wall turmeric, Proposal indigo, and What's on leaf.
- **Do** let a heading inside a pan inherit that pan's foreground, and set body text on white in ink.
- **Do** use Zilla Slab only: 700 for names, the wordmark, labels, and buttons, and 500 for facts and sentences.
- **Do** mark the pan you are on, every form card, and a hovered or focused list row with a 4px solid rim.
- **Do** make an action a black pill with white type that inverts on hover.
- **Do** mark the current nav link as a magenta chip with white type.
- **Do** leave the pans separated by the gap alone, and leave list rows without a hairline.

### Don't:

- **Don't** add a shadow, a lift, a blur, or a flash.
- **Don't** put a rule between the pans or a hairline under a list row.
- **Don't** add a hero, a second typeface, or an italic.
- **Don't** make the page a newspaper or a poster, and don't bring back a newsprint ground or a red shell.
- **Don't** give a locked plan, a proposal, or an unavailable source its own status color. The line inherits the surface.
- **Don't** collapse the bar into a menu. The bar wraps.
- **Don't** add a photograph or a logo mark.
