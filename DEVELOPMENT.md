# FORM — Development tracker and save point

## Current checkpoint
- App version: v0.1.0, Build 006 (latest committed app build; deployment and device testing pending).
- Phase 01: Design system foundation — in progress.
- Preview: https://formapp.connect-zendo.workers.dev
- Next task: verify Build 006 on device, especially timer fit and controls in all themes/orientations. User approved Build 005 appearance; comprehensive interaction testing remains pending. Then Build 007: design-system consistency and accessibility audit before Phase 02.

## Design principles
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

## Workflow
Read this file before resuming development. Inspect current source before edits. Design, approve, implement, validate, test, refine and record. Increment visible app build number for every app code update. Record changed files, checks, known issues, deployment/device verification status, and exact next task here. Documentation-only changes do not increment app build. Never mark untested behavior verified. Avoid accumulating overrides; consolidate obsolete code while preserving approved functionality.
