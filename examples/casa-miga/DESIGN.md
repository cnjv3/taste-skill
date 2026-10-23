---
name: CASA MIGA
description: El placer de ir más despacio. A sunlit Mediterranean café told at breakfast pace.
colors:
  crema: "#F5F0E7"
  blanco-calido: "#FBF9F4"
  terracota: "#C77857"
  terracota-profunda: "#A4552F"
  terracota-noche: "#8C4524"
  oliva: "#687454"
  oliva-tinta: "#4F5A3D"
  marron-cafe: "#49352B"
  marron-suave: "#6E5A4E"
  cafe-oscuro: "#30241E"
  arena: "#DED2C0"
  arena-tinta: "#C9B9A3"
  crema-sobre-oscuro: "#CBBBA8"
  tag-lino: "#E6E3D3"
  luz-calida: "#FFE4BC"
typography:
  display:
    fontFamily: "Cormorant Garamond, Garamond, Times New Roman, serif"
    fontSize: "clamp(2.55rem, 1.05rem + 6.1vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Cormorant Garamond, Garamond, Times New Roman, serif"
    fontSize: "clamp(2.3rem, 1.55rem + 2.6vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
  menu-link:
    fontFamily: "Cormorant Garamond, Garamond, Times New Roman, serif"
    fontSize: "clamp(2.6rem, 11vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.05
  statement:
    fontFamily: "Cormorant Garamond, Garamond, Times New Roman, serif"
    fontSize: "clamp(1.9rem, 1.3rem + 2.1vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.15
  lead:
    fontFamily: "Cormorant Garamond, Garamond, Times New Roman, serif"
    fontSize: "clamp(1.3rem, 1.05rem + 0.75vw, 1.7rem)"
    fontWeight: 500
    lineHeight: 1.3
  title-l:
    fontFamily: "Cormorant Garamond, Garamond, Times New Roman, serif"
    fontSize: "1.75rem"
    fontWeight: 500
    lineHeight: 1.15
  title:
    fontFamily: "Cormorant Garamond, Garamond, Times New Roman, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.15
  caption:
    fontFamily: "Cormorant Garamond, Garamond, Times New Roman, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.3
  body-l:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.95rem + 0.25vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  body-s:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.16em"
  label-sm:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.14em"
  seal:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "8.4px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.02em"
rounded:
  frame: "4px"
  pill: "999px"
spacing:
  gutter: "clamp(1.25rem, 4.2vw, 4.5rem)"
  section: "clamp(5rem, 3.5rem + 6.5vw, 10rem)"
  column-gap: "clamp(1rem, 2.2vw, 2rem)"
  container: "90rem"
components:
  button-primary:
    backgroundColor: "{colors.terracota-profunda}"
    textColor: "{colors.blanco-calido}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 1.6rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.terracota-noche}"
  button-outline:
    textColor: "{colors.marron-cafe}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 1.6rem"
    height: "3rem"
  button-outline-hover:
    backgroundColor: "{colors.marron-cafe}"
    textColor: "{colors.crema}"
  button-disabled:
    backgroundColor: "{colors.arena}"
    textColor: "{colors.marron-suave}"
  tab-selected:
    backgroundColor: "{colors.terracota-profunda}"
    textColor: "{colors.blanco-calido}"
    rounded: "{rounded.pill}"
    height: "2.75rem"
  tag:
    backgroundColor: "{colors.tag-lino}"
    textColor: "{colors.oliva-tinta}"
    rounded: "{rounded.pill}"
  photo-frame:
    backgroundColor: "{colors.arena}"
    rounded: "{rounded.frame}"
---

# Design System: CASA MIGA

## Overview

**Creative North Star: "La mesa junto a la ventana"**

One table by one window, at nine in the morning. Every surface of the site is either that light (crema limewash, linen white, side-lit photography) or the shade behind it (café oscuro), and the page keeps returning to the same ceramic cup as you scroll: poured, filled, steaming. The system is warm and quiet on purpose; its energy comes from photography, scale contrast in the type, and one choreographed scroll scene, never from colour noise or decoration.

Typography carries the editorial voice. A light, high-contrast Garamond set in capitals speaks the headlines with an italic second voice for the emotional turn of a phrase; a plain geometric sans does every practical job (prices, labels, buttons, hours). Terracotta is touched, not painted: it marks where a hand acts. Olive appears only as drawn botanical line.

The palette, the two families and the light, warm character are client commitments from the brief, not house defaults.

**Key Characteristics:**
- Light crema ground for most of the page, one café oscuro chapter (the ritual) and a café oscuro footer.
- Capitals in Cormorant Garamond for every headline, italic for the turn of a phrase.
- Manrope in tracked capitals for nav, buttons, tabs and field labels; sentence case for body.
- Photography carries texture and appetite; nothing imitates material in CSS.
- Hairline rules in arena instead of boxes and cards.
- Motion is slow, eased out and authored once per scene.

## Colors

A warm, low-saturation morning palette: limewash and linen neutrals, coffee browns for ink, terracotta for touch and olive for drawn botany.

### Primary
- **Terracota profunda** (#A4552F): fills that carry text (primary button, selected tab), the seal's sprig, the handwritten-style note, step markers on light ground. It is the brand terracotta deepened until white text reaches 5.4:1.
- **Terracota** (#C77857): the brand terracotta from the brief, used on dark grounds (focus ring, ritual progress line, active step number, logo sprig in the footer) where it reads at 3.9:1 or better.
- **Terracota noche** (#8C4524): hover state of the primary fill.

### Secondary
- **Verde oliva** (#687454): line drawings of olive sprigs only. Never body text (4.4:1 on crema).
- **Oliva tinta** (#4F5A3D): text inside the placeholder tag.

### Neutral
- **Crema** (#F5F0E7): page ground, header when solid, mobile menu.
- **Blanco cálido** (#FBF9F4): alternate section ground (carta, nuestra casa) so long sections read as separate rooms.
- **Marrón café** (#49352B): primary ink for headlines, names and prices (10:1 on crema).
- **Marrón suave** (#6E5A4E): secondary ink for paragraphs and descriptions (5.7:1 on crema).
- **Café oscuro** (#30241E): the ritual chapter and the footer; never pure black.
- **Arena** (#DED2C0): hairlines, dividers, photo placeholder fill, disabled button fill.
- **Arena tinta** (#C9B9A3): dotted price leaders, scrollbar thumb.
- **Crema sobre oscuro** (#CBBBA8): secondary text on café oscuro.
- **Lino** (#E6E3D3): the background of the "Ejemplo" placeholder tag.
- **Luz cálida** (#FFE4BC): only as the travelling light sweep over the croissant macro, at 50% in soft-light blend.

### Named Rules
**The Touch Rule.** Terracotta marks what a hand does: the primary button, the selected tab, the seal, the note. It never fills a section or decorates a heading.

**The No Black Rule.** The darkest value in the system is café oscuro (#30241E). Shadows, overlays and veils are tinted from it.

## Typography

**Display Font:** Cormorant Garamond (with Garamond, Times New Roman)
**Body Font:** Manrope (with system-ui)

**Character:** A fine, high-contrast book Garamond in capitals, like a café's painted window lettering, against a calm geometric sans that handles every number and instruction. Two families only; the italic of the Garamond is the third voice.

### Hierarchy
- **Display** (400, clamp(2.55rem, 1.05rem + 6.1vw, 6rem), 0.94): the hero headline only, uppercase, roman line then italic line.
- **Headline** (400, clamp(2.3rem, 1.55rem + 2.6vw, 3.75rem), 1): every section headline, the ritual title and the croissant's "Capa a capa.", uppercase except that italic statement.
- **Menu link** (400, clamp(2.6rem, 11vw, 3.5rem), 1.05): links in the full-screen mobile menu.
- **Statement** (400, clamp(1.9rem, 1.3rem + 2.1vw, 3rem), 1.15): the closing interlude, centred.
- **Lead** (500, clamp(1.3rem, 1.05rem + 0.75vw, 1.7rem), 1.3): the hero's supporting sentence, Garamond in sentence case.
- **Title L** (500, 1.75rem): wordmark on desktop, carta category headings without JS, legal subheads.
- **Title** (600, 1.5rem, 1.15): dish names, the note, qualities, footer line, menu line.
- **Caption** (Garamond italic 400, 1.25rem, 1.3): figure captions, step captions, contact-sheet words, featured product names.
- **Body L / Body** (Manrope 400, 1rem to 1.125rem, 1.65 to 1.7): paragraphs, max 34rem measure.
- **Body S / Small** (Manrope 400, 0.875rem / 0.8125rem): dish descriptions, notes, hints, footer base.
- **Label** (Manrope 600, 0.75rem, letter-spacing 0.15 to 0.16em, uppercase): navigation, buttons, tabs, field labels, step titles.
- **Label S** (Manrope 600 to 700, 0.6875rem, letter-spacing 0.12 to 0.18em, uppercase): the "Ejemplo" tag, scroll cue, image caption chip, step numbers.
- **Seal** (Manrope 600, 8.4px in SVG user units): the seal's circumference text only; it scales with the 100px seal.

### Named Rules
**The Capitals Speak Rule.** Headlines are set in Garamond capitals and never carry an eyebrow or kicker above them; the headline introduces itself.

**The Tabular Price Rule.** Prices use Manrope with tabular lining figures and the Spanish format `2,20 €`, aligned right after a dotted leader.

## Layout

A 90rem container with a fluid gutter (clamp(1.25rem, 4.2vw, 4.5rem)); desktop sections use a 12-column grid with a fluid column gap (clamp(1rem, 2.2vw, 2rem)) and asymmetric spans (6 + 5, 5 + 7, 7 + 4) rather than centred halves. Sections breathe with clamp(5rem, 3.5rem + 6.5vw, 10rem) of vertical padding and alternate crema and blanco cálido grounds, with one full-bleed café oscuro chapter in the middle.

Mobile is composed, not shrunk: the hero stacks text over the photograph with the seal beside the buttons; the carta's tabs scroll sideways; the obrador's panoramic photo bleeds to the edges; the contact sheet becomes a staggered two-column grid; the ritual keeps its pinned scene with text set at the bottom.

## Elevation & Depth

Flat. There are no box shadows on content. Depth comes from photography (side light, shallow focus), from tinted veils over photographs (crema veils for light grounds, café oscuro veils for the ritual), and from the single hairline under the header once it turns solid.

### Named Rules
**The Light Not Shadow Rule.** Separation is made with ground changes and hairlines; when an image needs legible text over it, it gets a veil of the ground colour, never a drop shadow on the text (the hero scroll cue on phone is the one soft text glow, over photography).

## Shapes

Two radii only: 4px on photographs and frames, fully rounded pills on buttons, tabs and tags. Rules are 1px arena hairlines; price leaders are 1px dotted arena tinta. The one round form is the stamped seal: a 1px circle with its text set on the circumference and an olive sprig at its centre.

## Components

### Buttons
- **Shape:** pill (999px), 3rem tall (2.6rem in the header), label type.
- **Primary:** terracota profunda fill, blanco cálido text, arrow icon that slides 3px on hover (diagonal for external links).
- **Hover / Focus:** fill deepens to terracota noche; 2px terracota profunda focus ring offset 3px; press scales to 0.97.
- **Outline:** 1px marrón café border at 45% opacity, fills marrón café with crema text on hover.
- **Disabled:** arena fill with marrón suave text and a one-line explanation beneath (used by "Cómo llegar" until a Maps link exists).

### Tabs
- **Style:** label type in marrón suave on the section ground; the selected tab is a terracota profunda pill revealed by a clip-path over a duplicated row, so colour and shape move together (0.4s ease-in-out).
- **Behaviour:** arrow keys, Home and End; panels fade their rows in with a 35ms stagger.

### Placeholder tag
- **Style:** lino pill with oliva tinta tracked capitals ("Ejemplo", "Plantilla"). Every unconfirmed fact on the page carries one until real data replaces it.

### Dish row
- **Style:** Garamond 600 name, dotted leader, Manrope tabular price, Manrope description below; rows separated by arena hairlines.

### Navigation
- **Style:** label type; hover and active section draw a 1px underline from the left. Over the hero the header is transparent; past the top it turns crema with a hairline, over café oscuro it turns café oscuro with crema text, and it hides while scrolling down.
- **Mobile:** "Menú" with two hairlines opens a full-screen crema dialog, curtain clip from the top (0.5s), Garamond capitals links staggered 50ms.

### The seal
- **Style:** 100px stamped circle, "HECHO DESPACIO · SERVIDO CON CARIÑO ·" set on the circumference, sprig at the centre. Enters with a rotation, turns slowly with scroll.

### The ritual
- **Style:** a pinned, full-bleed photographic sequence on café oscuro: defocused, pour, push into the cup, dissolve to the finished cup, WebGL steam. A four-step list with the active step in full opacity and its italic caption revealed; a terracotta progress hairline on the right.

## Do's and Don'ts

### Do:
- **Do** keep at least 65% of every page on crema or blanco cálido.
- **Do** set every headline in Cormorant Garamond capitals and let the italic carry the emotional half of a phrase.
- **Do** use terracota profunda for any terracotta that carries text, and the brand terracota on dark grounds.
- **Do** mark every unverified fact (price, hours, address, phone, account) with the "Ejemplo" tag until it is real.
- **Do** let photography carry texture; place it in 4px frames or full bleed.
- **Do** author motion once per scene with the shared curves (`cubic-bezier(0.16, 1, 0.3, 1)` for reveals, `cubic-bezier(0.23, 1, 0.32, 1)` for UI), and give every scene a still version under reduced motion.

### Don't:
- **Don't** use pure black, neon, blue or purple gradients (client brief).
- **Don't** add a kicker or eyebrow above a headline, or section numbers outside a real sequence like the ritual's four steps.
- **Don't** build product grids of identical cards; the carta is a set list with hairlines.
- **Don't** imitate ceramic, flour, wood or steam in CSS; use photography or the WebGL steam.
- **Don't** add drop shadows to content or glass blur as decoration.
- **Don't** create links or buttons that look functional before their destination exists.
