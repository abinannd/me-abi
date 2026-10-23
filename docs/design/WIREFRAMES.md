# About Me Portfolio — Wireframe Specification

**Document status:** Draft — Pending Review
**Phase:** UX Design
**Previous document:** `docs/design/UX-ARCHITECTURE.md`
**Purpose:** Define page composition, content hierarchy, layout behavior, and responsive transitions before visual styling begins.

---

## 1. Design Direction

### Product identity

**Engineer × Creative Technologist × Builder**

The portfolio should communicate technical competence and creative thinking through a combination of clear information architecture, immersive visuals, and purposeful interaction.

### Design principles

1. **Content first:** Visitors should understand who I am and what I build without navigating a complex interface.
2. **Visual impact:** The hero establishes a distinctive identity through the character animation and strong typography.
3. **Projects over decoration:** Visual effects must not compete with the projects or technical information.
4. **Purposeful interaction:** Every animation or interactive element should have a clear reason to exist.
5. **Responsive by design:** Desktop, tablet, and mobile layouts must each feel intentional.
6. **Progressive enhancement:** The site remains usable when advanced animation is disabled or unavailable.

---

# 2. Global Page Structure

The portfolio is a single-page experience with the following sections:

1. Hero
2. About
3. Selected Projects
4. Technical Arsenal
5. How I Build
6. Contact

### Global navigation

**Desktop**

`[LOGO / INITIALS]     About   Projects   Skills   Process   Contact     [Resume ↗]`

Requirements:

* Navigation remains visually unobtrusive.
* Section links scroll to their respective sections.
* The active section may be indicated subtly.
* The resume action remains optional until a resume is available.
* The navigation must not obscure content.

**Mobile**

`[LOGO / INITIALS]                                      [MENU ☰]`

The menu opens a compact navigation panel with the same destinations. It must support keyboard interaction and close after a destination is selected.

---

# 3. Wireframe A — Desktop Hero

**Target viewport:** 1440 × 900
**Minimum supported desktop width:** 1024 px

### Layout

```text
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  LOGO          ABOUT  PROJECTS  SKILLS  PROCESS  CONTACT   RESUME ↗  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                                                                     │
│  ENGINEER × CREATIVE                         ┌───────────────────┐  │
│  TECHNOLOGIST × BUILDER                      │                   │  │
│                                              │                   │  │
│  I BUILD DIGITAL                             │   CHARACTER       │  │
│  EXPERIENCES THAT                            │   ANIMATION       │  │
│  FEEL DIFFERENT.                             │                   │  │
│                                              │   MP4 / 3D MODEL  │  │
│  A short introduction about                  │                   │  │
│  engineering, creative technology,           │                   │  │
│  and the things I build.                     └───────────────────┘  │
│                                                                     │
│  [EXPLORE PROJECTS ↘]  [CONTACT ME ↗]                               │
│                                                                     │
│  Computer Science • Development • Creative Technology               │
│                                                                     │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  SCROLL TO EXPLORE ↓                                                │
└─────────────────────────────────────────────────────────────────────┘
```

### Left column — Identity and content

Content order:

1. Small identity label.
2. Primary headline.
3. Short introduction.
4. Primary and secondary calls to action.
5. Optional supporting expertise line.

The headline should be the strongest typographic element. Keep it concise enough to fit in approximately three lines at the reference viewport.

**Primary action:** Explore Projects
**Secondary action:** Contact Me

The introduction should eventually explain what I build and the kind of problems I enjoy solving. Until the final copy is approved, use placeholder text.

### Right column — Character visual

The character is the hero's primary visual anchor.

Requirements:

* Use the supplied character MP4 as the initial visual asset.
* Preserve the source composition and character details.
* Do not apply automatic zoom or aggressive camera movement.
* Avoid placing important text over the character.
* Ensure the video container scales without distorting the source aspect ratio.
* Avoid unnecessary controls if the animation is decorative.
* Provide a poster image or fallback when video playback is unavailable.

**Important technical distinction:** An MP4 can play its existing animation, but it cannot make the character look toward the cursor in real time. That interaction requires a rigged 3D character or another suitable real-time implementation. The first prototype must establish which implementation is practical before the interaction is promised.

### Desktop proportions

Initial layout targets:

| Element                  | Target                     |
| ------------------------ | -------------------------- |
| Navigation height        | 72–88 px                   |
| Main content width       | 1200–1320 px               |
| Left content column      | 48–52%                     |
| Right visual column      | 48–52%                     |
| Column gap               | 32–64 px                   |
| Hero vertical alignment  | Centered                   |
| Hero minimum height      | Approximately one viewport |
| Outer horizontal padding | 5–7vw                      |

These are starting values, not final design tokens.

---

# 4. Wireframe B — Mobile Hero

**Target viewport:** 390 × 844
**Additional validation widths:** 360 px and 430 px

### Layout

```text
┌──────────────────────────────┐
│                              │
│  LOGO                  [☰]   │
│                              │
├──────────────────────────────┤
│                              │
│  ENGINEER × CREATIVE         │
│  TECHNOLOGIST × BUILDER      │
│                              │
│  I BUILD DIGITAL             │
│  EXPERIENCES THAT             │
│  FEEL DIFFERENT.              │
│                              │
│  A short introduction about  │
│  engineering, creative       │
│  technology, and building.   │
│                              │
│  [EXPLORE PROJECTS]          │
│  [CONTACT ME]                │
│                              │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │       CHARACTER        │  │
│  │       ANIMATION        │  │
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  SCROLL TO EXPLORE ↓         │
│                              │
└──────────────────────────────┘
```

### Mobile behavior

* Stack content vertically.
* Keep the headline and primary action visible without excessive scrolling.
* Place the character visual below the main introduction and actions.
* Allow the character container to grow or shrink while preserving its aspect ratio.
* Use full-width or comfortably sized buttons.
* Keep the navigation accessible with one hand.
* Do not depend on hover effects.
* Disable expensive cursor-following effects on touch devices.
* Respect reduced-motion preferences.
* Prevent horizontal overflow.

The exact placement of the character remains open to visual testing. A split composition may be explored on larger phones, but the default mobile design should prioritize readability.

---

# 5. Wireframe C — About Section

### Desktop

```text
┌─────────────────────────────────────────────────────────────────────┐
│  ABOUT                                                              │
│                                                                     │
│  A LITTLE ABOUT HOW I THINK AND BUILD                               │
│                                                                     │
│  ┌────────────────────────────┐  ┌──────────────────────────────┐  │
│  │                            │  │                              │  │
│  │  Short biography            │  │  Supporting visual,          │  │
│  │                            │  │  portrait, or abstract       │  │
│  │  Interests and approach     │  │  technical composition       │  │
│  │                            │  │                              │  │
│  └────────────────────────────┘  └──────────────────────────────┘  │
│                                                                     │
│  [EXPLORE MY PROJECTS ↘]                                            │
└─────────────────────────────────────────────────────────────────────┘
```

### Content requirements

The section should answer:

* What is my background?
* What kinds of problems interest me?
* How do I combine engineering and creative technology?
* What am I currently exploring?

Avoid a long autobiography. The section should provide context and direct visitors toward the projects.

### Mobile behavior

Stack the biography and supporting visual. The visual is optional if it does not add meaningful information.

---

# 6. Wireframe D — Selected Projects

This is the portfolio's primary credibility section.

```text
┌─────────────────────────────────────────────────────────────────────┐
│  SELECTED PROJECTS                                                  │
│                                                                     │
│  Things I've designed, built, tested, or explored.                  │
│                                                                     │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐  │
│  │                             │  │                             │  │
│  │       PROJECT VISUAL        │  │       PROJECT VISUAL        │  │
│  │                             │  │                             │  │
│  ├─────────────────────────────┤  ├─────────────────────────────┤  │
│  │ Project name                │  │ Project name                │  │
│  │ Short description           │  │ Short description           │  │
│  │ Technologies                │  │ Technologies                │  │
│  │ [CASE STUDY ↗]              │  │ [CASE STUDY ↗]              │  │
│  └─────────────────────────────┘  └─────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐  │
│  │       ADDITIONAL PROJECT     │  │       ADDITIONAL PROJECT     │  │
│  └─────────────────────────────┘  └─────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Project card hierarchy

Each project should present:

1. Project name.
2. One-sentence purpose or problem statement.
3. Visual preview.
4. Technology stack.
5. Contribution or role, where relevant.
6. Link to a live demo, repository, or case study.

The card must not depend on animation to reveal essential information.

### Responsive behavior

* Desktop: two-column grid by default.
* Tablet: two columns where the content remains legible.
* Mobile: one column.
* Project visuals should use consistent aspect ratios where practical.
* Cards should support keyboard navigation.
* External links should be clearly identifiable.

Project content will initially use placeholders. Real project details should be added only after their descriptions and links have been verified.

---

# 7. Wireframe E — Technical Arsenal

```text
┌─────────────────────────────────────────────────────────────────────┐
│  TECHNICAL ARSENAL                                                  │
│                                                                     │
│  The tools I use to turn ideas into working systems.               │
│                                                                     │
│  ┌─────────────────────┐ ┌─────────────────────┐ ┌───────────────┐ │
│  │ DEVELOPMENT         │ │ AI & DATA           │ │ CREATIVE TECH │ │
│  │                     │ │                     │ │               │ │
│  │ Languages           │ │ ML frameworks       │ │ 3D / WebGL    │ │
│  │ Frameworks          │ │ Data tools          │ │ Animation     │ │
│  │ Development tools   │ │ Model workflows     │ │ Visual design │ │
│  └─────────────────────┘ └─────────────────────┘ └───────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Requirements

* Group technologies by meaningful categories.
* Distinguish regularly used tools from tools currently being explored.
* Avoid arbitrary skill percentages.
* Use text labels and optional icons.
* Do not use decorative 3D effects that make the section harder to scan.

The final categories and technologies will be based on confirmed experience, not assumptions.

---

# 8. Wireframe F — How I Build

This section explains the user's approach to creating projects.

```text
┌─────────────────────────────────────────────────────────────────────┐
│  HOW I BUILD                                                        │
│                                                                     │
│  FROM AN IDEA TO A WORKING PRODUCT                                  │
│                                                                     │
│  01  EXPLORE         Understand the problem                         │
│  ───────────────────────────────────────────────────────────────    │
│  02  DESIGN          Define the experience and architecture          │
│  ───────────────────────────────────────────────────────────────    │
│  03  BUILD           Implement the core functionality               │
│  ───────────────────────────────────────────────────────────────    │
│  04  TEST            Validate behavior and performance               │
│  ───────────────────────────────────────────────────────────────    │
│  05  ITERATE         Improve based on what is learned                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

This is a provisional framework. It should be adjusted to reflect the actual development process and should not imply professional experience that has not been established.

Motion may be used to emphasize the progression, but the content must remain understandable without it.

---

# 9. Wireframe G — Contact

```text
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  HAVE AN INTERESTING IDEA?                                          │
│                                                                     │
│  Let's talk about projects, technology, or collaboration.           │
│                                                                     │
│  [GET IN TOUCH ↗]                                                   │
│                                                                     │
│  Email     GitHub     LinkedIn                                      │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  LOGO / INITIALS                 © YEAR   BUILT WITH ...             │
└─────────────────────────────────────────────────────────────────────┘
```

### Requirements

* Make the primary contact method obvious.
* Use verified links only.
* Avoid a contact form unless there is a practical reason to maintain one.
* Provide clear focus and hover states.
* Include a simple footer with minimal visual noise.

---

# 10. Interaction and Motion Rules

## Hero

* The character animation should be visually prominent but not distract from the headline.
* Cursor-following behavior is a progressive enhancement, not a core navigation mechanism.
* If a live 3D implementation is feasible, eye movement should be subtle and natural.
* Head rotation should have constrained angles and eased transitions.
* Avoid snapping, jitter, extreme rotations, or continuous camera movement.

## Scrolling

* Use smooth scrolling where appropriate.
* Section entrances may use subtle opacity and position transitions.
* Avoid forcing visitors to scroll through a long animation before accessing content.
* Do not hijack the browser's normal scrolling.
* Keep motion short and purposeful.

## Interactive components

* Buttons must provide visible hover, focus, and pressed states.
* Navigation must work with a keyboard.
* Motion should respect `prefers-reduced-motion`.
* Touch devices must not depend on pointer-hover behavior.
* Core content must remain accessible if JavaScript animations fail.

---

# 11. Visual Direction — Still to Be Decided

The wireframes define structure, not final styling.

Three directions can be explored during visual design:

### Direction A — Minimal Editorial

* Warm off-white background.
* Dark typography.
* Restrained accent color.
* Large type and generous spacing.
* Character visual treated as a distinct focal element.

### Direction B — Dark Technical

* Charcoal or near-black background.
* High-contrast typography.
* Restrained orange or another accent.
* Technical visual language with carefully controlled glow.

### Direction C — Hybrid Cinematic

* Minimal, readable content areas.
* Cinematic hero visual.
* Strong contrast between the character and surrounding layout.
* More expressive motion in selected sections, restrained everywhere else.

**Recommended starting point:** Direction C. It best balances a memorable hero with the clarity expected from a technical portfolio.

The final choice must be made after comparing the character asset against the proposed background and testing the page at desktop and mobile sizes.

---

# 12. Accessibility and Performance Requirements

* Maintain readable text contrast.
* Use semantic heading levels and landmarks.
* Provide descriptive link labels.
* Ensure all interactive elements are keyboard accessible.
* Avoid flashing or rapidly oscillating visual effects.
* Respect reduced-motion settings.
* Provide a fallback for the hero video or 3D scene.
* Avoid loading the full 3D experience before it is needed.
* Compress and optimize images and video.
* Prevent layout shifts when media loads.
* Test mobile performance on a mid-range device, not only on a development laptop.

---

# 13. Wireframe Acceptance Criteria

The wireframes are ready for approval when:

* [ ] Every planned page section has a defined content hierarchy.
* [ ] Desktop hero composition is clear.
* [ ] Mobile hero composition is clear.
* [ ] Navigation destinations and primary actions are defined.
* [ ] Project cards expose the information visitors need.
* [ ] Each section has a defined responsive behavior.
* [ ] The character asset's role and technical limitations are documented.
* [ ] Motion is optional for accessing essential information.
* [ ] The visual direction is selected or explicitly left open for comparison.
* [ ] No unresolved layout decision blocks the first prototype.

---

# 14. Decisions Required Before Visual Design

The following decisions remain open:

1. **Visual direction:** Minimal Editorial, Dark Technical, or Hybrid Cinematic.
2. **Hero asset:** MP4-only initial prototype or investigation of a real-time 3D character.
3. **Background treatment:** Integrate the character's orange background, isolate the character, or build a surrounding scene.
4. **Navigation identity:** Name, initials, or a custom wordmark.
5. **Resume:** Include a resume action at launch or omit it until a verified file is available.

These decisions should be resolved before detailed styling and implementation. They do not require polishing every section before the first prototype.

---

## Next Deliverable

After reviewing this specification, the next step is **Visual Design and Hero Prototype**.

We will establish the color palette, typography, spacing system, and hero composition, then build the first working version. The prototype will help validate the design against the actual character asset before we invest in complex 3D interactions.
