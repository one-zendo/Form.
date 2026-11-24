# FORM — Design handbook

Authoritative visual and interaction specification. Historical palettes and token values: [Palette archive](docs/PALETTES.md). Current implementation and verification: [Development checkpoint](DEVELOPMENT.md).

## 1. Identity
- Brand: FORM. Tagline: Train with focus, follow your progress.
- The intelligent training notebook: distinct FORM identity, editorial precision, clarity and cohesion above decoration. Apple informs execution quality, not appearance.
- Paper holds information; Glass controls the experience; intelligence connects them.
- Compact, readable, fresh, timeless; modernized spreadsheet with purposeful motion.

## 2. Layout and materials
- Precision Paper: matte content, open canvas, numbered routine rows, subtle separators, selective cards, aligned inline set tables, previous performance, compact metadata and contextual editing. Avoid unnecessary nested containers.
- Precision Glass: translucent navigation and functional overlays with shared edge, highlight, blur and shadow tokens; opaque fallback and reduced-transparency support. CSS approximates glass; native Apple Liquid Glass is not available in the web app.
- Solid accent primary actions; shared geometry and materials across themes.

## 3. Themes and semantic color
Approved target themes: Unified Apple 2.0 (default) and Graphite Lime (performance dark). Unified Apple uses updated Apple-inspired system palette: light blue #0088FF, green #34C759, purple #CB30E0, red #FF383C, orange #FF8D28, yellow #FFCC00; canvas #F2F2F7, paper #FFFFFF, ink #000000. White text and icons are the preferred solid action treatment; validate contrast and obtain approval for accessible fill variants. Graphite Lime retains its existing palette and dark foreground on lime. Soft Spectrum and Monochrome remain archived; other historical palettes require approval. Build 002 implements the two target themes and approved Home preview action fill #006DD6 with white; original blue #0088FF remains the brand swatch. Graphite supporting accents: blue #69A5F8, violet #B69CFF, amber #E9B75B, red #F43A50.
- Soft Spectrum original canvas #F5F7FA (later #F0F5FB), paper #FFFFFF, ink #2A3035, muted #828384, divider #E5E7EB, control #E9EAEA.
- Original brand blue #58A5F8, green #65CA79, purple #7D2DF2, red #EC6568; tints #EDF6FE, #EDF9F1, #FCEFF0, #D2E8FD.
- Preserve original soft fills and preferred white action text/icons as visual references. White normal text on original blue, green and red fails 4.5:1. Review contrast explicitly before implementation; do not silently darken brand colors. Accessible alternatives from Build 009: #2875C9, #258044, #C63E49 with white (4.69, 4.94, 5.02); Build 008 dark foreground alternatives #172B40, #153B21, #35151A respectively.
- Every component and asset must support both target themes from inception. Central token file: src/design/tokens.css. Semantic roles include canvas, surface/paper, ink, muted, accent, selected, line, success, danger, info, control, on-accent, warning, focus, disabled, overlays, charts and shadows. Add missing roles centrally before use; do not hardcode theme-specific component or SVG colors except palette definitions and swatches.
- Use currentColor for monochrome SVG; semantic fills or variants for multicolor assets. Never use color alone to communicate state. Keep layout, typography and behavior consistent; test theme persistence.

## 4. Typography and geometry
Single native system sans-serif stack, tabular digits, sentence case, readable hierarchy. Shared design targets (CSS px; subject to visual approval):

| Role | Target |
|---|---|
| Logo | 32 bold |
| Page title | 28 semibold |
| Section | 20 semibold |
| Card title | 17 semibold |
| Body | 16–17 regular |
| Workout values | 17 medium, tabular |
| Button | 16 semibold |
| Secondary | 14 |
| Touch target | At least 44 × 44 |
| Primary action | 48–52 high |
| Standard / navigation icon | 22 / 21 |
| Action and numeric input radius | 999 |
| Icon-only control | Circular |
| Paper card radius | 16 |
| Dialog radius | 28–32 |
| Card padding | 16 |
| Gaps / section spacing | 8–16 / 24 |

Primary, secondary and confirmation buttons use pills. Text links, swipe segments, cards and navigation retain distinct geometry. Support text enlargement without clipping.

## 5. Navigation and motion
- Always-visible, icon-only glass dock: Home, Workouts, Progress, Profile. Accessible names required. Historical 12px nav labels are not visible in the current design.
- Approved Build 001 concept: continuous horizontal finger tracking, snap to nearest tab on release, cancellation restores selection, tap and keyboard activation, direct page switching without unnecessary transitions.
- Compact dock on narrow screens; centered on wide screens, safe-area aware, independent of scrolling, progressive backdrop blur.
- Global rest timer above dock, same width, compact countdown, minus/plus 15 seconds, pause and skip; available across pages. No swipe-to-minimize workout mini player. Timer is a future feature, not implemented in Build 001.
- Smooth inline expansion, drag displacement and swipe deletion. Motion communicates state without delaying interaction; reduced-motion fallback.

## 6. Icons
Official Lucide 0.468.0, locally bundled via lucide-react, upstream license retained; no runtime CDN. Navigation: house, dumbbell, chart-no-axes-column-increasing, user-round. Stroke 2, rounded caps and joins, currentColor.

## 7. Adaptive and accessibility approval
Review every major component in both target themes across Duo folded portrait, folded landscape, unfolded portrait and unfolded landscape (eight combinations), plus conventional phones. Reflow rather than scale/stretch; adapt to viewport, keyboard and safe areas; preserve state on resize/rotation.
Check contrast, ergonomics, scrolling, keyboard, VoiceOver, text enlargement, reduced motion/transparency, loading, empty, error, success, disabled, offline, sync and interrupted states where applicable. Performance and perceived responsiveness are design requirements. Record actual results; never assume device verification.
References: [Apple typography](https://developer.apple.com/design/human-interface-guidelines/typography), [Apple accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility).

## 8. Engineering and change control
Shared reusable components and semantic tokens; minimal dependencies; consistency over isolated overrides. Original FORM is a visual reference, not architectural authority. Obtain approval before major visual changes. Record implementation and verification in DEVELOPMENT.md. Historical values are references, not automatic defaults.

## 9. Approved Home concept
One dominant next-workout card; open weekly metrics and dated training journal; grouped set segments, inline journal expansion and week browsing. Matte digital notebook, intelligently compact rather than sparse or crowded. Reflow at 600px into approximately 53:47 columns; actual Duo proportions require device review. Sample data explicitly labeled; demo start is not a workout engine.
