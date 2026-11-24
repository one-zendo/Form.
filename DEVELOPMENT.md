# FORM — Development tracker and save point

## Current checkpoint
- App version: v0.1.0, Build 004 (latest committed app build; deployment and device testing pending).
- Phase 01: Design system foundation — in progress.
- Preview: https://formapp.connect-zendo.workers.dev
- Next task: verify Build 004 on Duo in all orientations and themes, including tap/swipe navigation and rest timer. Then Build 005: shared typography, spacing and control geometry.

## Design principles
Approved direction: Paper + Glass (Build 004). Paper holds information; Glass controls the experience.
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

## Workflow
Read this file before resuming development. Inspect current source before edits. Design, approve, implement, validate, test, refine and record. Increment visible app build number for every app code update. Record changed files, checks, known issues, deployment/device verification status, and exact next task here. Documentation-only changes do not increment app build. Never mark untested behavior verified. Avoid accumulating overrides; consolidate obsolete code while preserving approved functionality.
