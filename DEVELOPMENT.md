# FORM — Development tracker and save point

## Current checkpoint
- App version: v0.1.0, Build 009 (latest committed app build; deployment and device testing pending).
- Phase 01: Design system foundation — in progress.
- Preview: https://formapp.connect-zendo.workers.dev
- Next task: device review of Build 009, all themes and orientations, then Phase 02 core architecture audit after acceptance.

## Design principles
Soft Spectrum solid action buttons use white text and icons on accessible deeper action fills; original pastel brand swatches remain distinct.
Soft Spectrum is the original screenshot-inspired palette from one-zendo/Form, restored in Build 008. Brand fills #58A5F8, #65CA79, #7D2DF2, #EC6568; separate accessible foreground tokens. Preserve original pale tints and neutral controls.
Precision Controls approved in Build 006: pill numeric fields, grouped timer adjustments, shared 44px touch targets and 48px primary controls.
Approved direction: Precision Paper + Glass (Build 005): compact open rows, aligned numbers, selective accent, functional glass. Paper holds information; Glass controls the experience.
Apple-inspired functional shell and motion; ChatGPT-inspired intelligent UI; Notion-inspired paper notebook content. Official Lucide icons, readable typography, semantic colors, restrained motion, concentric pill controls. Soft Spectrum, Graphite Lime, Monochrome. Optimize for Duo folded/unfolded, portrait/landscape. CSS glass approximation for web; native materials later.

## Roadmap
1. Design system — in progress
2. Core architecture — pending
3. Workouts and routine builder — existing partial implementation; completion pending
4. Active workout engine — existing partial implementation; completion pending
5. Home — existing partial implementation; completion pending
6. Progress, history and insights — pending completion
7. Profile and preferences — existing partial implementation; completion pending
8. Final refinement, accessibility, responsiveness and QA — pending

## Build log
- 001: persistent development version indicator.
- 002: dedicated touch swipe navigation repair; syntax checked, device verification pending.
- 003: equal-width icon-only navigation; committed, device verification pending.

- 004: shared glass treatment for navigation, rest timer and dialogs; paper radii for routine and active exercise cards; consolidated equal-width icon navigation CSS; adjusted mouse pointer capture; updated asset versions and visible build. Files: tokens.css, navigation.css, workouts.css, navigation.js, index.html. Readback and JS syntax checks passed; deployment and real-device tests pending. No workout data changes.

- 005: Precision Paper foundation: numbered compact routine rows with expandable exercise lists and retained edit/start controls, active-session summary, open exercise tracking layout, tinted navigation selection, shared spacing/type tokens. Files: tokens.css, navigation.css, workouts.css, workouts.js, navigation.js, index.html. JS syntax and selected readback checks passed; deployment/device testing pending. Concept gaps: previous-performance column, live session summary clock, search and single-row timer remain future tasks. No storage schema changes.

- 006: shared control sizing and responsive gutters, pill numeric inputs, compact single-row global glass timer with grouped ±15 controls, centered wide active workspace. Files: tokens.css, workouts.css, workouts.js, navigation.js, index.html. JS syntax and selected readback checks passed. Deployment and device testing pending. Search and previous performance remain future features. No storage schema changes.

- 007: source-level design/accessibility audit and fixes: Soft Spectrum accent/secondary contrast, semantic swipe colors, inert hidden swipe actions and expanded state, named dialogs, active heading, numbered set labels and numeric keyboard hints, focus outlines, reduced motion, safe-area gutters and Home timer clearance. Files: tokens.css, workouts.css, workouts.js, home.css, navigation.js, index.html. Selected contrast calculations (white on blue 5.99:1; muted on canvas 5.64:1), JS syntax and readback checks passed. Real browser, device, VoiceOver and full contrast audit pending. No storage schema changes.

- 008: restored original Soft Spectrum brand tokens, sky-blue primary fills, fresh-green completion, soft-red destructive fills, mint completion tint, pale-blue nav selection, violet Home insights, neutral controls and graphite text. Appearance swatches updated. Dark theme base tokens retained. Files: tokens.css, home.css, workouts.css, navigation.js, index.html. Selected contrast checks (primary 5.60:1, success 6.12:1, destructive 5.20:1), JS syntax and readback passed. Blush and insight tint available as tokens for future components; not every token is rendered. Device/deployment and comprehensive accessibility verification pending. No storage changes.

- 009: Soft Spectrum solid action fills #2875C9, #258044, #C63E49 with white foregrounds. Calculated contrast 4.69:1, 4.94:1, 5.02:1. Shared tokens and index build/cache version updated; exact readback passed. Other themes and original brand swatches retained. Device/deployment testing pending. No storage changes.

## Workflow
Read this file before resuming development. Inspect current source before edits. Design, approve, implement, validate, test, refine and record. Increment visible app build number for every app code update. Record changed files, checks, known issues, deployment/device verification status, and exact next task here. Documentation-only changes do not increment app build. Never mark untested behavior verified. Avoid accumulating overrides; consolidate obsolete code while preserving approved functionality.
