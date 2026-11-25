# FORM web architecture

## Release baseline and remediation order

The recovery point is `fb4dd830214898f1273c04548d4ea5d691781afc` (tree `c64731c7040e9ce48c91bd3032f8e747c38db0d4`). Pull requests 2 through 10 were merged. PR 1 is an older, unmerged workout-engine branch. Its changes require reconciliation before reuse. Cloudflare build 67752eeb-c5ad-4825-b514-c8e8934c50d8 succeeded. The public HTML, normalized only for the per-request nonce, and the install icon matched a local release build byte for byte. The branch baseline enumerated 209 WebKit cases and passed its source checks and Worker dry-run.

| Priority and confidence | Finding and impact | Dependency and remediation |
| --- | --- | --- |
| High, verified | Personal records, preferences, rest deadlines, recovery journals and backups shared a single origin-wide key space. Switching sample data into those keys would risk overwriting user history. | Introduce a fixed storage scope per loaded document before adding an opt-in demo. Preserve existing personal key names and storage versions. |
| High, verified | The public Personal screen mounted foldable diagnostics and registered live listeners. | Move the entire diagnostic panel to the development entry. Preserve the independent product fold controller. |
| High, verified | The workout minimize transition scanned and copied the CSSOM on every invocation. Several controllers injected fixed styles at runtime. | Share selectors with the inert transition surface. Collect static rules at Worker build time and resolve declarations with matching cascade context. |
| Medium, verified | History repeatedly constructed date formatters, calculated redundant set totals and rendered hidden rows. Cost scales with history size. | Reuse formatters and derived data. Build history rows when their view needs them. Measure the same workload before and after. |
| Medium, verified | CI ran identical full jobs on pushes and pull requests. A lockfile-generation workflow targeted a retired branch. | Keep a committed lockfile, one authoritative release run per PR revision, cached installs, and targeted checks during design iteration. |
| Medium, verified | One large browser script coupled routing, presentation, DOM construction, gestures and domain logic. Several source assertions depended on textual placement. | Extract cohesive owners incrementally, keep current call sites intact, and point assertions at the actual owner. Retain the behavioral suite. |
| Review, mixed confidence | Repeated selectors span breakpoints, theme fallbacks, keyboard mode, contrast and motion preferences. Selector repetition alone cannot establish a defect. | Remove proven shadowing only. Preserve conditional rules and verify computed geometry and styles across themes. |

The existing roadmap retains core usability as the milestone after stability, followed by records and celebrations, training insights, native integrations and FORM Plus. Apple device certification belongs to the native milestone.
