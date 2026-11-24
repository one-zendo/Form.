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
