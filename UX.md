# FORM — UX architecture
Version 1.0 · Approved 2026-11-24

## Information architecture
- Home: Today, quick start, active session, activity and recent summaries.
- Workouts: Routines, exercises, history, scheduling.
- Progress: Overview, strength, volume, records, consistency.
- Profile: Preferences, integrations, data, privacy, support.

## Core journeys
- Routine: Workouts → Create Routine → Name → Add exercises → Configure sets/reps/rest → Save.
- Workout: Start from Home or Workouts → Review exercise and previous performance → Adjust values if needed → Complete set in one tap → Automatic rest if enabled → Continue → Finish/save → Summary.
- Progress: Open Progress → Essential insights → Select metric/exercise → Detailed history.

## Active workout
Dedicated experience rather than a primary tab. Show duration, completed sets, exercise details, set values, completion controls and rest timer. Allow minimizing, navigating elsewhere and returning without losing the session.

## Responsive architecture
Compact: single-column content and bottom tabs. Expanded: adaptive multi-column content rather than stretched interfaces. Detailed layouts and breakpoints to be defined later.

## Interaction principles
- Predictable, consistent navigation.
- Inline editing whenever practical.
- Smooth exercise swapping preserving compatible settings.
- One-tap completion when values are correct.
- Progressive disclosure of advanced controls.
- Confirmation or undo for destructive actions.
- Active sessions accessible from any primary tab.
- Helpful empty states without fabricated data.
- Clear errors and recovery options.
- Purposeful, smooth motion respecting reduced-motion settings.

## Application states
Design relevant screens for empty, loading, success, error, offline, syncing, recovery and permissions states.

Conceptual layouts are not final visual designs.

## Mandatory Duo adaptive layout requirement (2026-11-24)
Design, wireframe, prototype and test distinct compact/folded, unfolded portrait and unfolded landscape configurations for all relevant screens. Apple specifications: outer 1398×2034 pixels (5.4 inch), inner 1878×2670 pixels (7.6 inch), both up to 120Hz; source https://www.apple.com/ca/iphone-duo/specs/. Provisional 3× logical canvases: 466×678, 626×890, 890×626 respectively; measure actual viewport, safe areas and scaling on device before finalizing breakpoints. Adapt to available window dimensions including multitasking, not device name alone. Preserve workout state, completed sets, rest timer, unsaved edits, selection, navigation, equivalent scroll location and appearance across folding and rotation. Require no clipping or inaccessible controls; test on actual hardware before declaring compatibility. Specific screen arrangements remain design proposals pending wireframe approval.

## Mandatory cross-layout change parity
Maintain one shared application core, workout data model, business logic, reusable components and design tokens across folded/compact, unfolded portrait and unfolded landscape. Every applicable feature, design update, interaction improvement and bug fix must propagate across all three configurations. Layout-specific composition and sizing may differ to suit available space; avoid duplicated implementations and divergent functionality. Review and test all three configurations for every applicable change before marking it complete, including state continuity during folding and rotation. Document any necessary layout-specific exception explicitly.
