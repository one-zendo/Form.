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
