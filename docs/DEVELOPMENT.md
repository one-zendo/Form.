# FORM 2.0 — Development Registry

Source of truth for development status. Update this file with every feature or page change. Distinguish committed implementation from verified runtime behavior. Preserve original FORM repository.

## Pages
| Page | Status |
|---|---|
| Home | Implemented; runtime verification pending |
| Workouts | Scaffolded |
| Progress | Scaffolded |
| Profile | Scaffolded |
| Routine Builder | Planned |
| Active Workout | Planned |
| Exercise Library | Planned |
| Workout Summary | Planned |
| Workout History | Planned |
| Settings | Planned |

## Features
| Feature | Status |
|---|---|
| Bottom navigation | Implemented; runtime verification pending |
| Shared design tokens | Implemented |
| Official Lucide integration | Committed; verification pending |
| Zoom prevention | Committed; verification pending |
| Five-second update detection | Committed; verification pending |
| Active workout refresh guard | Scaffolded; integrate with workout engine |
| Responsive Duo layout | Planned |
| Workout engine | Planned |
| Rest timer | Planned |
| Local persistence | Planned |
| Theme system | Initial Profile selector committed; Soft Spectrum and Graphite Lime; runtime verification pending |

## Design principles
Modern Apple-inspired, compact, spreadsheet-inspired, Soft Spectrum default, official Lucide icons, stable navigation, responsive layouts, restrained motion, shared tokens and modular code.

## Change history
- Initial static shell, navigation and tokens.
- Navigation icon library integration: 3193966cb4ebd03d09dd808fa92ec1531da28354.
- Viewport and touch controls: 95ec85945ef8977d8e0bdcb091d06e0fe06ea017, 17361199cf3296a709a95a195fe6b64db06cd425.
- Auto-update module and integration: 37b7a80a9eaae576a0d70162df5ee7d1cefd0493, 03ec6eb63dbdf238bffe9ff7f4cd0345f1f7d631.

## Workflow
For every change, record affected pages, features, implementation status, verification results, known issues and relevant commits. Do not mark untested behavior verified.

- Added optional Graphite Lime dark theme inspired by supplied reference; shared semantic tokens and persisted Profile selection.

- Navigation icon rendering fix: local inline SVGs replace CDN import; official asset provenance and live rendering still require verification.

- User confirmed official local Lucide animal test renders after asset cache bust v17. Material foundation committed: paper, glass and accent tokens/classes, translucent persistent navigation, both palettes, opaque fallback; asset version v18. Runtime and eight-configuration checks pending. Home content remains scaffolded.

- Restored official house, dumbbell, chart-no-axes-column-increasing and user-round navigation icons from pinned Lucide integration after successful animal test. Asset version v19; restored icons runtime check pending.

- v20 Home: responsive paper layout, greeting, workout navigation, expandable calendar, history-derived streak/month totals and journal, official local Lucide icons. Reads form.data.v2; no seeded history. Workout and Progress destinations remain scaffolded; workout engine and data migration pending. Device verification pending.

- v21: Home date aligned upper right beside FORM logo, compact localized date format; runtime verification pending.

- v22: unfolded/landscape Home uses shared dashboard grid rows, matched card heights, compact short-viewport spacing and centered width-capped persistent navigation. Folded single-column layout retained. Device verification pending.

- v23: unified Home card anatomy, section headings inside matte surfaces, common padding/radius and aligned wide-layout card edges. Runtime verification pending.

- v24: consolidated overlapping Home responsive CSS; consistent card anatomy, compact viewport rules, history-derived three-day activity bars and same-period previous-month comparisons (only when data exists). Source audit completed; browser/device checks and workout scheduling integration remain pending.
