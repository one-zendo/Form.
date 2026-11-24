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
