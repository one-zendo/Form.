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

## Mandatory Duo adaptive layout requirement (2026-11-24)
Design, wireframe, prototype and test distinct compact/folded, unfolded portrait and unfolded landscape configurations for all relevant screens. Apple specifications: outer 1398×2034 pixels (5.4 inch), inner 1878×2670 pixels (7.6 inch), both up to 120Hz; source https://www.apple.com/ca/iphone-duo/specs/. Provisional 3× logical canvases: 466×678, 626×890, 890×626 respectively; measure actual viewport, safe areas and scaling on device before finalizing breakpoints. Adapt to available window dimensions including multitasking, not device name alone. Preserve workout state, completed sets, rest timer, unsaved edits, selection, navigation, equivalent scroll location and appearance across folding and rotation. Require no clipping or inaccessible controls; test on actual hardware before declaring compatibility. Specific screen arrangements remain design proposals pending wireframe approval.

## Mandatory cross-layout change parity
Maintain one shared application core, workout data model, business logic, reusable components and design tokens across folded/compact, unfolded portrait and unfolded landscape. Every applicable feature, design update, interaction improvement and bug fix must propagate across all three configurations. Layout-specific composition and sizing may differ to suit available space; avoid duplicated implementations and divergent functionality. Review and test all three configurations for every applicable change before marking it complete, including state continuity during folding and rotation. Document any necessary layout-specific exception explicitly.

## Wordmark refinement
The displayed brand wordmark is exactly **FORM.** (uppercase with a terminal period). Apply consistently across all screens, themes and adaptive layouts. The tagline remains unchanged.

## Profile icon refinement
Use standalone monochrome official Lucide icons in Profile settings rows, without colored background tiles. Follow theme-aware neutral foreground colors; reserve accent colors for meaningful selection and status. Apply across all Duo configurations.

## Optical consistency and alignment — latest standard
Supersedes earlier standard UI icon stroke width of 2: use official Lucide icons at 24px with 1.75 stroke width, rounded caps and joins; selected icons retain the same weight. Verify optical consistency at smaller sizes. Profile menu labels use medium weight (500), standalone neutral icons, concise labels and aligned icon/text/chevron columns. Align neighboring card edges and group headings to a shared grid; landscape Profile overview uses a full-width personal profile card followed by aligned Preferences and Data and support groups, with a category/detail split when a setting is selected. Remove redundant Profile branding/footer and explanatory preview copy. Keep the fixed dock clear of content and suppress persistent scrollbars without disabling scrolling. Apply shared refinements across all layouts and themes. Implement straightforward visual corrections proactively within approved scope, document decisions and verify source changes; device validation remains required.

## Icon sizing refinement
Use 20px Profile row and avatar icons, 22px navigation dock icons, and 18px settings chevrons. Retain 1.75 Lucide stroke width and existing touch targets. These contextual sizes supersede the general 24px default for these components across all layouts and themes.

## Appearance menu simplification
Show only the Appearance label, standalone icon and chevron in Profile. Current theme selection is indicated inside the Appearance page only. Supersedes earlier current-theme row requirements across all layouts.

## Persistent Profile workspace
Supersedes landscape overview cards: unfolded landscape always shows the Profile settings sidebar on the left and selected detail on the right, defaulting to My profile when entering via the dock. Compact and unfolded portrait retain the main settings menu and dedicated detail pages. Preserve explicit detail selection and personal inputs during layout changes. My profile supports locally saved name and training goal; no account required. Keep navigation dock anchored to the non-scrolling shell. Device validation pending.

## Independent workspace scrolling
In unfolded landscape master-detail workspaces, each panel owns its vertical scroll position. Scrolling one panel must not move its neighbor or the navigation dock. Reserve dock clearance below both panels. Compact and portrait detail pages retain single-page scrolling. Verify on device before declaring complete.

## Routine quick start
Use compact grouped routine rows with separate circular official Lucide play controls (20px, 1.75 stroke, 44px target). Row opens details; play starts the selected routine once the active engine exists. Until then show an explicit unavailable message. Preserve full Start Workout action in details and shared behavior across all layouts.

## Workouts dock navigation
Selecting Workouts returns to its main routine library in every layout, clearing detail selection without discarding unsaved drafts. Create routine offers recovery of an existing draft.

## Routine editor save state
Keep Save visible in the sticky editor header across layouts. Disable when unchanged, highlight with theme action color when draft differs from saved routine (or a new draft has content). Validate on save; preserve draft on navigation or failure. Successful save returns to routine details.

## Unsaved routine navigation
Before leaving a changed routine editor through in-app navigation, present a theme-aware modal with Apply changes, Discard changes (destructive), and Keep editing. Apply validates and saves before continuing; failure keeps the editor open. Discard removes the draft, not the saved routine. Cancel preserves the draft. Unchanged editors navigate immediately. Folding and rotation do not trigger confirmation. Browser termination relies on draft recovery. Device testing required.

## Routine selection and exercise disclosure
Highlight the full selected routine row with a subtle theme action tint, including its separate play control; retain keyboard focus indication. Routine details open with all exercise disclosures collapsed; entire summary is tappable, with official Lucide chevron down when collapsed and up when expanded. Hide set grids completely until expanded. Apply to all layouts.

## Filled action button foreground
Filled primary actions use white text and icons on light theme blue #006DD6, and dark text and icons #17171F on original dark theme lime #B0FF00. Lime-filled buttons are the approved exception to white foreground. Bright lime remains the dark theme accent for navigation and selection. Quiet, disabled and icon-only controls retain semantic foregrounds. Shared across all layouts.
