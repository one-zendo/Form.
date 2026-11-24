# FORM — Wireframes
## Home — approved 2026-11-24
Shared components: FORM wordmark and exact tagline, calendar shortcut, date, today's workout, quick start, weekly activity, recent workout, progress insight, floating four-tab dock.
- Folded (provisional 466×678): single-column scroll, primary start/resume action first, compact workout summary.
- Unfolded portrait (626×890): full-width workout card with exercise preview, paired activity/recent cards, full-width progress insight, quick start.
- Unfolded landscape (890×626): two-panel dashboard, workout and quick start left, activity/recent/progress right, centered dock.
All essential functionality shared; expanded layouts expose additional detail without exclusive functionality.
States: scheduled (start/view routine), active (resume, live progress), rest day (choose workout), first-time (create routine or empty workout, no fabricated stats), offline (local actions/data), interrupted (recover existing session, avoid duplicate).
Review: consistent content, clear primary action, dedicated portrait/landscape compositions, appropriate first-time/rest states, consistent dock.
Illustrative values only. Actual viewport measurements, safe areas and hardware validation pending. Shared components/state must persist across folding and rotation.

## Workouts — approved 2026-11-24
Shared: title, create action, routine search/filter, start empty workout, routine cards, exercise library, schedule, history, floating dock. Routine cards show name, exercise/set counts; expanded portrait adds muscle groups. Context menu: start, edit, duplicate, schedule, archive, delete (confirmation or undo).
- Folded: single-column routine library; selection opens dedicated detail screen.
- Unfolded portrait: two-column routine grid, full-width search and quick start; selection opens expanded detail.
- Unfolded landscape: master-detail workspace; routines left, selected routine details, exercise list, start/edit actions right.
Preserve selected routine, search, filters, unsaved edits and active session across layout changes. All functionality shared.
States: empty library with create guidance, no results with clear search/filter action, active workout resume and duplicate prevention, offline local routine access/editing, recoverable archived routines, save errors preserving edits. Routine builder and active workout require separate wireframes. Illustrative data only; actual viewport and hardware validation pending.

## Progress — approved 2026-11-24
Shared: week/month/year date filters, workouts/training duration/PR count/volume summary cards, strength/volume/consistency trend selector, interactive charts, personal records, consistency calendar, exercise performance, volume and history shortcuts, floating dock.
- Folded: compact two-column metrics and vertically scrolling chart/detail cards.
- Unfolded portrait: expanded metrics, full-width charts and additional insight space.
- Unfolded landscape: metrics and charts left, personal records, consistency and detail links right.
Progressive disclosure: overview → metric detail → exercise performance → original workout record. Chart inspection via touch/drag, accessible labels, consistent units and dates. Preserve period, metric, exercise and inspected point across layouts. Strength includes weight/reps/estimated 1RM; volume, frequency, duration and PRs derive from real records. No invented measurements or trends. States: empty history, insufficient data, offline local calculation, recalculation after edits/deletions, unavailable metric explanation. Exact formulas, MVP scope, viewport and hardware validation pending. Illustrative wireframe values only.

## Profile — approved 2026-11-24
Shared: optional personal profile (name, image, goals), workout preferences (weight/distance units, rest defaults, automatic timers, previous performance, RPE/RIR), appearance (system/light/dark/focused workout), Apple integrations, notifications/haptics, data management, privacy, support and floating dock.
- Folded: single-column grouped settings with dedicated category pages and back navigation.
- Unfolded portrait: full-width profile header, paired preference cards with descriptions, grouped data/support.
- Unfolded landscape: category list left, editable selected settings right.
Single shared preference store; preserve selected category, input, appearance and scroll context across folding/rotation. Autosave preferences; preserve failed saves for recovery. Convert displayed units without changing physical measurements; defaults apply to future applicable sets; hiding RPE/RIR does not delete records. Respect permissions; explicit confirmation for data deletion. Core training requires neither account nor internet. Native integrations must not be falsely shown connected in web prototype. Actual viewport and hardware validation pending.

## Phase 5.1 — complete
Home, Workouts, Progress and Profile approved for all three configurations. Phase 5.2 begins with Routine Builder; all secondary screens require cross-layout parity and review.

## Wireframe presentation standard — approved
Use interactive grayscale wireframes with proportional device canvases for all Duo screens: folded 466:678, unfolded portrait 626:890, unfolded landscape 890:626 (provisional logical dimensions). Preserve the actual aspect ratio in chat; do not merely rearrange content within a portrait container. Provide layout switching and relevant interaction controls. Profile Appearance shows the current theme in the category row; folded and unfolded portrait open a dedicated settings page with back navigation, while landscape uses a category/detail split. Show System, Light and Dark as visual theme choices. Keep the dock anchored and selection consistent. Focused workout appearance remains a later feature. This is a wireframe standard, not a claim of implemented or hardware-tested behavior.
