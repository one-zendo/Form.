# FORM — Design principles

Train with focus, follow your progress

## Visual identity
- Apple Health-inspired, minimalist, native-feeling interface; spacious layouts, clear hierarchy, system typography, subtle separators and rounded controls.
- Use Lucide icons, restrained semantic colors, translucent surfaces and subtle shadows.
- Light palette: canvas #F2F2F7, paper #FFFFFF, ink #111114, muted #636366, action #006DD6, brand #0088FF, success #34C759, insight #9339C7, danger #FF383C, warning #FF8D28.
- Graphite-lime dark palette: canvas #17171F, paper #24242E, ink #FFFFFF, muted #92929C, accent #B0FF00, insight #B69CFF, danger #FF354D, warning #E9B75B.

## Interaction
- Smooth restrained spring-like motion for inline editing, expansion and exercise swaps; preserve scroll position and avoid unnecessary modals.
- Floating rounded navigation dock with translucent backdrop, sliding selection indicator and four tabs: Home, Workouts, Progress, Profile.
- Minimum 44-point touch targets, visible keyboard focus, safe-area awareness, reduced-motion and reduced-transparency alternatives.
- Focused workout experience; adapt layouts to iPhone, Duo folded/unfolded and Apple Watch.

## Branding
- FORM wordmark at upper left with the tagline directly below.
- Prioritize clarity, focus and progress over decorative clutter.

## Official icon system
- Use official Lucide icons exclusively for web interface icons, sourced from the published Lucide packages (lucide-static for the Worker test; lucide-react if React is adopted).
- Do not redraw or approximate existing icons. Default to 24px, 2px stroke, rounded caps and joins, consistent optical sizing and semantic color. Provide accessible labels for icon-only controls.
- Reference: https://lucide.dev/icons/

- For enlarged standalone icons, reduce SVG stroke width optically; the 64px test icon uses 1.25 viewBox units instead of 2.

- Use the latest verified stable official Lucide release when establishing or upgrading dependencies; pin the version for reproducible deployments and verify builds after upgrades.

## Approved design system — v1.0 (2026-11-24)
The preceding design principles remain authoritative.

### Typography
Native system typography (San Francisco on Apple platforms). Proposed baseline sizes/weights: wordmark 34/750, large title 34/700, page title 28/700, section heading 22/650, headline 17/600, body 17/400, supporting 15/400, caption 12/400. Scale with accessibility preferences; use tabular numerals for timers, weights and repetitions.

### Icon sizing
Official Lucide only. Default 24px/2 stroke; small 16–20px, prominent 28–32px, standalone 48–64px. Preserve rounded caps and joins and existing optical stroke policy. Accessible labels and minimum 44-point touch targets. ChatGPT specimens are illustrative, not authoritative icon assets.

### Spacing and geometry
Four-point spacing system: 4, 8, 12, 16, 20, 24, 32, 40, 48. Radius scale: 8, 12, 16, 24 for controls, containers, cards and prominent surfaces.

### Components
Primary action: filled semantic action color; secondary action: outlined or quiet treatment. Exercise cards support inline expansion and editing, one-tap set completion and contextual actions. Settings rows use clear labels, supporting text and accessible toggles. Floating navigation dock retains four tabs, translucent backdrop and sliding selection indicator. Support light and graphite-lime dark palettes. Component specimens are conceptual, not final screen designs.

### Motion
Restrained spring-like motion; button feedback 100–150ms, selection 180–250ms, inline expansion 250–350ms, exercise swaps and screen transitions 300–400ms. Preserve scroll and respect reduced motion.

### Accessibility
44-point minimum touch targets, scalable typography, WCAG AA contrast targets, VoiceOver/screen reader support, visible keyboard focus, non-color status cues, reduced-motion and reduced-transparency alternatives.

### Validation
Existing palettes remain unchanged. Validate contrast, responsive behavior, official icon rendering and production motion before implementation approval. Exact responsive breakpoints and final screen designs remain pending.
