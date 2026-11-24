# FORM — Product requirements and MVP
Version 1.0 · Approved 2026-11-24

## Navigation
Home | Workouts | Progress | Profile

## Functional requirements
- Home: Today's workout, quick start, resume active workout, weekly activity and recent workout summaries.
- Workouts: Create/manage routines, search exercise library, custom exercises, reorder/replace exercises, configure sets/reps/weight/rest, workout history.
- Active workout: One-tap set completion, previous performance, automatic/manual rest timers, warm-up/normal/drop/failure sets, optional RPE/RIR, pause/resume/finish, recovery and post-workout summary.
- Progress: Consistency, personal records, strength progression, volume, exercise performance history.
- Profile: Preferences, units, default workout settings, appearance, data management, privacy and support.
- Apple ecosystem: Apple Watch companion, HealthKit, Live Activities/Dynamic Island, rest notifications/haptics, widgets.
- Data: Offline-first storage, automatic saving, interrupted workout recovery, export/import and reliable device synchronization.

## Roadmap
### MVP 1 — Web preview
Four-tab navigation, responsive iPhone and Duo layouts, exercise library, routine builder, active workout engine, set logging/rest timers, history, basic progress insights, persistent local storage, light/dark appearance.
### MVP 2 — Native Apple experience
Native SwiftUI application, Apple Watch companion, HealthKit, Live Activities, widgets/haptics, reliable device synchronization, native accessibility, TestFlight beta.
### Version 1.0 — Public release
Advanced progress insights, backup/recovery, import/export, performance optimization, comprehensive testing, transparent monetization, App Store release.

## Non-functional requirements
- Performance: Responsive interactions and smooth animations.
- Reliability: No silent loss of workout records.
- Accessibility: VoiceOver, scalable text, sufficient contrast.
- Privacy: Personal data private by default.
- Usability: Minimal interactions during training.
- Maintainability: Modular, reusable, documented code.
- Visual consistency: One design system using official Lucide icons.
- Offline: Core workout features work without internet.

## Outside initial scope
Social feeds/followers, public leaderboards, AI-generated coaching, nutrition/calorie tracking, advertising, competitive challenges, exercise video marketplace. Social feeds conflict with product philosophy.

## Web MVP acceptance criteria
Users can independently create a routine, add/configure exercises, start a workout, log sets/use rest timers, recover after interruption, finish/save, review history and understand training progress. All eight steps must work reliably without placeholder functionality or fabricated workout data.

## Constraints
Web-first development using existing Cloudflare infrastructure. Native Apple integrations require separate native implementation and cannot be fully validated in the web preview.
