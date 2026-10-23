# UX Architecture & Information Design

## Interactive About Me Website

| Property         | Value                                          |
| ---------------- | ---------------------------------------------- |
| Document Version | 1.0                                            |
| Status           | Draft — Pending Review                         |
| Phase            | Phase 2 — UX Architecture & Information Design |
| Related Document | `docs/product/PRD.md`                          |
| Last Updated     | 2026-10-23                                     |

---

# 1. Purpose

This document defines the information architecture, navigation model, user journeys, section hierarchy, and responsive behavior of the Interactive About Me website.

It translates the product requirements into a structural blueprint that will guide UI design and implementation.

The website combines an immersive visual experience with a functional professional portfolio.

The experience must be engaging without making essential information difficult to find.

# 2. UX Objectives

The architecture must support the following objectives:

1. Establish the owner's identity immediately.
2. Make the website's purpose understandable within the first few seconds.
3. Encourage visitors to explore selected projects.
4. Provide access to technical skills and engineering capabilities.
5. Support both exploratory browsing and direct navigation.
6. Deliver a deliberate desktop experience.
7. Provide an appropriately adapted mobile experience.
8. Keep essential information accessible without relying on animation.
9. Allow new visual ideas to be introduced without restructuring the entire website.

# 3. Information Architecture

## 3.1 Primary Structure

The initial release will use a single-page website with vertically arranged sections.

The proposed section order is:

1. Hero
2. About
3. Selected Projects
4. Technical Arsenal
5. How I Build
6. Contact

Each section serves a distinct communication objective.

## 3.2 Sitemap

```text
INTERACTIVE ABOUT ME
│
├── HERO
│   ├── Brand / Name
│   ├── Primary Headline
│   ├── Supporting Description
│   ├── Explore My Work
│   ├── About Me
│   └── Interactive Character
│
├── ABOUT
│   ├── Personal Introduction
│   ├── Background
│   └── Interests
│
├── SELECTED PROJECTS
│   ├── Project One
│   ├── Project Two
│   ├── Project Three
│   └── Project Details / External Links
│
├── TECHNICAL ARSENAL
│   ├── Programming
│   ├── Software Development
│   ├── AI / Machine Learning
│   └── Creative Technology
│
├── HOW I BUILD
│   ├── Problem Definition
│   ├── Planning and Architecture
│   ├── Implementation
│   └── Testing and Iteration
│
└── CONTACT
    ├── Contact Introduction
    ├── Email
    └── Professional Profiles
```

This sitemap is a logical model, not a requirement that every subsection become a separate page or visual component.

# 4. Section Specifications

## 4.1 Hero

### Objective

Create a distinctive first impression while communicating the website owner's identity and primary areas of interest.

### Desktop layout

The initial desktop composition will follow the supplied reference:

* Navigation positioned near the top.
* Headline and supporting description on the left.
* Character on the right.
* Primary and secondary actions beneath the text.
* Balanced negative space.
* A visual environment coordinated with the character.

The existing orange-background character animation will guide the initial art direction.

### Primary actions

**Explore My Work**

Navigates to the Selected Projects section.

**About Me**

Navigates to the About section.

Both actions must be keyboard-accessible and provide clear interaction feedback.

### Character behavior

The intended final experience includes real-time cursor tracking for the character's eyes and head.

The current MP4 provides predetermined animation only. Genuine cursor tracking requires a suitable real-time implementation.

This technical dependency must be resolved during the interaction milestone.

### Exit condition

The visitor should understand who the website introduces, what kind of work it showcases, and how to explore further.

---

## 4.2 About

### Objective

Provide context about the person behind the projects.

### Content hierarchy

1. Section heading.
2. Short introduction.
3. Background and interests.
4. Supporting visual element, if useful.

### UX requirements

* Text must remain readable.
* Visuals must support rather than obscure the content.
* The section may introduce a different character or visual concept.
* The layout must not depend on a complex animation to communicate its meaning.

The final composition will be determined during UI design.

---

## 4.3 Selected Projects

### Objective

Provide evidence of practical engineering and creative ability.

Projects are the primary conversion priority of the website.

### Content structure

Each project should support:

* Project title.
* Short description.
* Problem or objective.
* Technologies used.
* Preview image or demonstration.
* Relevant repository or live-demo links.

### Interaction model

Visitors should be able to understand the basic purpose of a project without opening another page.

Where a project has additional information, a dedicated project page or external link may provide deeper details.

### UX requirements

* Project names and descriptions must be easy to scan.
* Clickable areas must be clear.
* Hover effects must not be the only way to discover information.
* Links must have descriptive labels.
* Project previews must not significantly delay access to the rest of the portfolio.

The initial implementation may use placeholder projects.

---

## 4.4 Technical Arsenal

### Objective

Communicate the technologies and technical domains represented by the portfolio.

### Proposed categories

* Programming languages.
* Frontend development.
* Backend development.
* AI and machine learning.
* Creative technology and 3D.
* Development tools and infrastructure.

The categories are provisional and will be refined when actual content is introduced.

### UX requirements

* Organize technologies into meaningful groups.
* Avoid an undifferentiated wall of logos.
* Do not use unsupported proficiency percentages.
* Maintain readable text and consistent spacing.
* Use animation only when it improves comprehension.

---

## 4.5 How I Build

### Objective

Demonstrate the approach used to turn ideas into functional products.

### Proposed content sequence

1. Understand the problem.
2. Define requirements and constraints.
3. Design the solution.
4. Implement the system.
5. Test and refine.
6. Deploy and improve.

This section may use a process diagram, interactive visualization, or concise editorial layout.

The selected treatment must explain the process clearly without requiring the visitor to complete an interaction.

---

## 4.6 Contact

### Objective

Give interested visitors a clear next step.

### Content

* Short invitation.
* Email contact.
* Professional profile links.
* Other approved contact methods.

### UX requirements

* Links must work.
* Contact actions must be clearly identifiable.
* Placeholder contact details must not be presented as real.
* The section must remain usable without animation.
* The footer may repeat essential navigation links.

# 5. Navigation Architecture

## 5.1 Desktop Navigation

The desktop navigation should remain compact and visually secondary to the hero.

Proposed navigation:

```text
[ BRAND ]       ABOUT   PROJECTS   SKILLS   CONTACT
```

The final labels and visual treatment will be established during UI design.

The navigation should allow visitors to reach important sections directly.

The How I Build section may remain accessible through scrolling or be included in the navigation if the final composition warrants it.

## 5.2 Mobile Navigation

The mobile navigation will use a compact layout appropriate to the available screen width.

A menu button may reveal a navigation panel containing the section links.

If a menu is implemented:

* The button must expose its expanded state.
* Links must be keyboard-accessible.
* The menu must be usable with touch.
* The menu must not obscure important content unnecessarily.
* Its open and closed states must be visually distinct.

## 5.3 Navigation Behavior

Section navigation must:

* Reach the intended section.
* Avoid hiding headings behind a persistent header.
* Preserve sensible browser history behavior where applicable.
* Support direct links to sections.
* Respect reduced-motion preferences when animated scrolling is used.

The final header positioning and scrolling behavior will be established during design and implementation.

# 6. User Journeys

## 6.1 Journey A — Recruiter

**Goal:** Evaluate the candidate's capabilities quickly.

```text
LANDING
   ↓
UNDERSTAND IDENTITY
   ↓
OPEN SELECTED PROJECTS
   ↓
REVIEW PROJECT DETAILS
   ↓
CHECK TECHNICAL SKILLS
   ↓
CONTACT
```

### UX implications

* Projects must be easy to discover.
* The website should communicate its purpose immediately.
* Important project information should not be hidden behind decorative interactions.
* Contact information must be easy to locate.

## 6.2 Journey B — Developer

**Goal:** Understand what the owner builds and how the work is approached.

```text
LANDING
   ↓
EXPLORE VISUAL EXPERIENCE
   ↓
OPEN PROJECTS
   ↓
EXAMINE IMPLEMENTATION
   ↓
REVIEW TECHNICAL APPROACH
   ↓
OPEN REPOSITORY OR DEMO
```

### UX implications

* Relevant project links must be clearly available.
* Technical descriptions should be concise but informative.
* Interactive demonstrations should not interfere with access to source code or supporting information.

## 6.3 Journey C — Creative Technologist

**Goal:** Explore the site's interaction design and creative execution.

```text
LANDING
   ↓
INTERACT WITH HERO
   ↓
EXPLORE SCROLL TRANSITIONS
   ↓
DISCOVER OTHER VISUAL ELEMENTS
   ↓
EXPLORE PROJECTS
```

### UX implications

* The experience should reward exploration.
* Interactions should feel deliberate.
* Motion should connect sections rather than distract from them.
* The character in the hero must not be reused automatically in every subsequent section.

## 6.4 Journey D — Direct Visitor

**Goal:** Find a specific piece of information quickly.

```text
LANDING
   ↓
USE NAVIGATION
   ↓
REACH TARGET SECTION
   ↓
ACCESS INFORMATION
```

### UX implications

The website must support direct navigation without requiring visitors to experience every animation or section transition.

# 7. Responsive Information Design

## 7.1 Desktop

Desktop is the primary design target.

The layout may use:

* Multi-column compositions.
* Large expressive typography.
* Generous negative space.
* Rich character presentation.
* More elaborate transitions when justified.

The desktop design must not assume that every visitor has an unusually large display.

## 7.2 Tablet

Tablet layouts should preserve the design's visual hierarchy while adapting spacing, columns, and interaction targets.

Layouts may transition from two columns to one column when necessary.

## 7.3 Mobile

Mobile layouts will be designed deliberately.

Requirements:

* Compact navigation.
* Readable headings and descriptions.
* Touch-friendly buttons.
* Appropriate character sizing.
* No unintended horizontal overflow.
* Simplified motion when required by performance or usability.
* Clear section separation.
* Accessible interaction states.

The mobile design does not need to reproduce every desktop effect.

It must preserve the website's identity and essential functionality.

# 8. Interaction Architecture

## 8.1 Interaction Categories

Interactions will be organized into four categories.

| Category   | Examples                                        | Priority    |
| ---------- | ----------------------------------------------- | ----------- |
| Navigation | Section links and menu controls                 | Essential   |
| Functional | Project links and contact actions               | Essential   |
| Character  | Eye tracking and head movement                  | High        |
| Experience | Scroll transitions and secondary visual effects | Progressive |

Essential navigation and functional interactions must remain available if optional animation fails.

## 8.2 Scroll Behavior

The page will initially use normal vertical scrolling.

Scroll-driven animation may be introduced to connect sections, but it must not prevent visitors from navigating naturally.

Before introducing pinned scenes or complex camera transitions, validate:

* Mobile behavior.
* Browser history and anchor navigation.
* Keyboard accessibility.
* Reduced-motion behavior.
* Performance.
* The ability to skip directly to a section.

Complex scroll choreography is an enhancement, not a prerequisite for basic navigation.

## 8.3 Cursor Behavior

Cursor-based interactions are appropriate for desktop.

They must not assume that a cursor exists on touch devices.

The interface should avoid essential information or controls that are revealed only on hover.

The character's real-time cursor tracking remains dependent on the chosen animation implementation.

# 9. Content and Asset Strategy

## 9.1 Initial Content

Placeholder content will be used during early development.

Each placeholder must be identifiable and easy to replace.

Content should be stored separately from presentation components where practical.

## 9.2 Visual Assets

The project may use:

* The current hero character video.
* Project preview images.
* Additional 3D objects or characters.
* Supporting illustrations.
* Interface icons.

Every asset must have a defined purpose.

Large assets should be evaluated for size, loading behavior, and licensing before being introduced.

## 9.3 Content Readiness

Before public release, verify that:

* Placeholder project descriptions have been replaced or explicitly approved.
* Project links are valid.
* Contact links work.
* Supporting images load correctly.
* No private or unintended information is exposed.

# 10. UX Acceptance Criteria

The information architecture will be accepted when:

1. The major sections and their purposes are documented.
2. Navigation provides access to every essential section.
3. Primary visitor journeys have been defined.
4. Projects are clearly prioritized within the experience.
5. The desktop and mobile structures have been distinguished.
6. Essential information is accessible without animation.
7. The hero's cursor-tracking dependency is documented.
8. Additional characters and visual elements can be introduced selectively.
9. The page supports direct navigation as well as exploratory scrolling.
10. The proposed structure can accommodate new ideas without requiring a complete redesign.

# 11. Open UX Decisions

The following decisions remain open until the wireframing stage.

| Decision                        | Planned validation                                |
| ------------------------------- | ------------------------------------------------- |
| Exact hero proportions          | Desktop and mobile wireframes                     |
| Final navigation labels         | Information hierarchy and visual design           |
| Header behavior while scrolling | Prototype and usability review                    |
| Exact project presentation      | Project content and layout exploration            |
| Additional visual elements      | Section-specific concept exploration              |
| Scroll transition complexity    | Prototype, accessibility, and performance testing |
| Character implementation        | Technical proof of concept                        |
| Final typography and colors     | Design-system definition                          |

# 12. Next Deliverable

The next deliverable is the initial wireframe specification.

It will define:

* Desktop hero layout.
* Mobile hero layout.
* Section-by-section content hierarchy.
* Primary and secondary actions.
* Navigation placement.
* Responsive layout transitions.
* Initial spacing and alignment relationships.

The wireframes will establish structure rather than final visual styling.

Once reviewed, they will guide the design system and implementation.
