# FORM — Development checkpoint

## Current version
v0.1.0 · Build 002. React, TypeScript, Vite, shared CSS tokens and bundled Lucide React 0.468.0. Future offline IndexedDB, Zustand if needed, workout engine and browser tests.

## Implemented source
- Application shell, adaptive Home with labeled sample data, three remaining placeholder pages.
- Shared swipeable navigation: continuous pointer tracking, snap, cancellation, keyboard activation, fixed safe-area-aware pill, progressive blur and reduced-motion/transparency fallback.
- Profile theme selection and persistence: Unified Apple and Graphite Lime; old theme values migrate to default.
- Visible build indicator; no workout data changes.

## Verification
| Check | Status |
|---|---|
| Repository source and tracker | Read back verified |
| Pure navigation geometry | Six assertions passed independently |
| Vitest suite | Written; full runner not verified |
| Dependency installation / lockfile | Not verified / no lockfile |
| TypeScript / Vite production build | Not independently verified |
| Cloudflare | Worker target corrected to form; user retried build; live Build 001 not independently verified |
| Browser, accessibility and Duo testing | Pending |

## Next steps
1. Confirm live preview shows Build 002 at https://form.connect-zendo.workers.dev.
2. Verify build logs, tap/swipe/cancel/keyboard, theme persistence and all Duo orientations.
3. Refine navigation before building other components.
4. Establish shared design components and data foundation; then Workouts, Active Workout, Home, Progress and Profile, followed by final QA.

## History
- Retired Build 009: clean-slate reset; Git history retained, no separate backup, original repository untouched, browser storage not cleared.
- Build 001: modular shell, navigation, themes, geometry tests and Wrangler static assets configuration committed. Initial five assertions passed; later six passed.
- Deployment review: source inspected, deployment instructions saved; user configured Cloudflare and retried build. Dashboard screenshot identified Worker name form rather than formapp; Wrangler and docs corrected. New preview address established; live app verification remains pending.
- Documentation audit: reorganized design handbook, preserved historical token archive verbatim, corrected stale README and legacy pointers, consolidated workflow and verification. No app code changes; Build 001 unchanged.

See [DESIGN.md](DESIGN.md), [AGENTS.md](AGENTS.md), [deployment guide](docs/DEPLOYMENT.md).

- Theme decision: Unified Apple 2.0 and Graphite Lime approved as two primary target themes; white action text preferred for Unified Apple, subject to contrast review. Existing Build 001 themes unchanged pending implementation. Historical palettes retained.

- Build 002: approved Home component, responsive single/two-column layout, sample week browsing, expandable journal, demo start state, system typography, two target themes. Source files read back verified. No production workout records or engine. Full compilation, browser, deployment and Duo testing pending. Next: review Home on device before further screen work.
