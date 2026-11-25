# FORM — Design principles

Train with focus, follow your progress

## Visual identity
- Apple Health-inspired, minimalist, native-feeling interface; spacious layouts, clear hierarchy, Inter typography, subtle separators and rounded controls.
- Use Lucide icons, restrained semantic colors, translucent surfaces and subtle shadows.
- Light palette: canvas #F2F2F7, paper #FFFFFF, ink #111114, muted #636366, action #006DD6, brand #0088FF, success #34C759, insight #9339C7, danger #FF383C, warning #FF8D28.
- Graphite Lime palette: canvas #141414, paper #222222, elevated #2E2E2E, ink #F5F5F5, muted #A3A3A3, accent #B0FF00, danger #FF6961, timer #0088FF, success #30D158, warning #FFB340.

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
Inter is the approved cross-platform typeface. Baseline sizes/weights: wordmark 28/700, large title 34/700, page title 28/700, section heading 22/650, headline 17/600, body 17/400, supporting 15/400, caption 12/400. Scale with accessibility preferences; use tabular numerals for timers, weights and repetitions.

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
The displayed brand wordmark is exactly **FORM** (uppercase, without a terminal period). Apply consistently across all screens, themes and adaptive layouts. The tagline remains unchanged.

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

## Weekly activity completion
Completed day markers use the theme action accent (lime in dark mode, blue in light mode) with contrasting check icons, rather than a separate success green.

## Action icon refinement
Filled action and routine quick-start icons use 18px, 1.75 stroke, preserving touch targets. Remove redundant decorative dumbbell tile from Home workout hero across all layouts.

## Workout play icon
Use official Lucide Circle Play (circle-play.svg) for all workout start actions, including Home, routine details and quick-start rows. Retain 18px sizing, 1.75 stroke and existing touch targets and theme colors.

## Engineering architecture
Worker HTML, shared stylesheet and browser entry are separate assets. Preserve rendered output during extraction. Source checks inspect browser syntax and static DOM references. Production bundling and device interaction tests remain required.

## Mandatory visual cohesion across Duo configurations
Treat folded/compact, unfolded portrait and unfolded landscape as one visual product, not three independent designs. Share semantic color tokens, typography hierarchy, spacing and radius scales, card and control treatments, icon sizes and strokes, selection/completion states, motion and accessibility behavior. Adapt only composition, dimensions, density and placement when available space requires it. Preserve alignment, consistent surface hierarchy, safe-area clearance and unobstructed content, including persistent controls. Avoid nested rounded separators, conflicting component variants and layout-specific styling drift. Every visual change must be reviewed in all three configurations in both light and dark themes; document intentional responsive exceptions and add regression coverage where practical. Do not mark visual changes fully verified until browser checks and relevant device validation are complete.

## Automatic cross-layout implementation workflow
When a UI adjustment is approved or explicitly requested for implementation, automatically inspect and update the shared components and design tokens and any necessary responsive rules for folded, unfolded portrait and unfolded landscape in the same development pass. Do not wait for separate approval for equivalent cross-layout fixes. Preserve intentional adaptive differences and existing functionality. Prefer a single shared implementation over copying styles. Add or update cross-layout regression checks as appropriate, verify available checks, and report any unverified device or deployment behavior. Requests for samples, discussion, or explicit instructions not to change code remain preview-only until implementation is authorized.

## Wireframe delivery for UI adjustments
For every UI adjustment, provide a concise interactive in-chat wireframe of the affected interface, grounded in the latest source and available device screenshots. Use simplified components with the actual FORM theme colors, not generated images. Show all materially different adaptive arrangements (folded, unfolded portrait, unfolded landscape), or a shared example when the change is identical. Clearly distinguish proposed or implemented behavior from simulated interactions and unverified live rendering. Include the wireframe alongside the implementation report for approved changes; preview-only requests do not authorize code changes.

## Mandatory three-configuration wireframe presentation
Supersedes the shared-example allowance in Wireframe delivery for UI adjustments. For every UI adjustment, show three distinct visual in-chat wireframes: folded/compact, unfolded portrait, and unfolded landscape, even when the shared adjustment is identical. Preserve each configuration's proportions, existing screen composition and FORM theme. Where practical, provide a shared Original/Proposed control that updates all three previews together. Do not substitute a table or checklist for the three visual previews. Use simplified interactive components, not generated images. Preview-only requests do not authorize application code changes.

## Component-focused preview exception
For discussion or refinement of an individual UI component, show only the affected component by default, with variants or interactive states as useful. Full folded, unfolded portrait and unfolded landscape screen wireframes are required for screen-level or responsive composition changes, or when explicitly requested. This supersedes the mandatory three-configuration presentation rule for component-only previews, but does not change automatic cross-layout implementation, theme adaptation or testing requirements.

## Approved floating capsule design
Navigation dock and workout timer share 56px height, full pill radius, border and surface tokens. Timer countdown and ready-state exercise/status are centered; during rest Electric Blue (#0088FF) fills the entire pill in proportion to remaining time with white foreground, compact minus/plus and Skip controls. Ready state hides countdown and rest controls without changing geometry. Folded and portrait stack above dock; landscape places timer beside dock. Preserve deadlines and theme adaptation; check white text contrast, safe areas and device touch targets. Browser and hardware validation required.

## Shared corner geometry
Content cards use --radius-card:20px; controls and primary buttons use --radius-control:12px; compact set inputs use --radius-small:8px; floating navigation and timer use --radius-full:999px. Maintain one global radius scale across all layouts and themes; do not hardcode component-specific numeric border radii.

## UI capitalization

Use Title Case for all app-authored button labels, including navigation, icon-button accessible names, and dynamically updated actions. Use sentence case for headings, descriptions, and messages. Preserve user-entered routine and exercise names, data values, and input labels. Write labels explicitly in source; do not use CSS text-transform or automatic title casing.

## Semantic color palette

Primary actions and selected navigation share --action and --on-action: lime #B0FF00 on dark surfaces, Apple system blue #0088FF as light brand reference, with web contrast-adjusted #0066CC for actions and text. Electric blue #0088FF remains the active rest timer fill, with independent white timer text and dark track. Completion uses green (#34C759 dark, #007A30 light). Dark canvas #17171F, surface #24242E, muted #92929C; destructive actions use the danger token. Do not introduce separate workout accent overrides. The bright timer white small text is a known contrast exception (approximately 3.5:1).

## Active workout focus

One exercise is expanded in portrait; landscape retains list/detail layout with the same selected exercise. Selecting a card never collapses it. Completing its last set advances to the next unfinished exercise, wrapping if necessary. Completed exercises remain selectable for corrections. Inline set counts and completion checks replace collapse chevrons. Selection is UI-only; workout persistence and rest timing remain independent.

## Apple light appearance

Reference: https://developer.apple.com/design/human-interface-guidelines/color (system colors). Use grouped canvas #F2F2F7, white surfaces, black primary labels, secondary #636366, Apple blue #0088FF for brand reference, and Apple's increased-contrast purple #B02FC2. Web-specific darker variants #0066CC (action), #007A30 (success), #D51028 (danger) achieve 4.5:1 or better against white and grouped canvas. These are contrast adaptations, not exact native system color values. Preserve the approved dark theme and shared timer (existing white-on-blue contrast exception). Native SwiftUI should use dynamic semantic system APIs rather than fixed hex colors. No component-specific palette overrides.

Routine list play controls use a 22px outlined icon in a transparent 44px target. Selected routines use the semantic action accent; others use muted foreground. Retain the selection line and existing row highlight.

## Permanent product-wide design governance

These standards govern all future FORM design and implementation decisions, including new features, refinements and bug fixes. Cohesion over novelty; clarity over decoration; quality over speed. Evaluate changes against the whole product, not an isolated screenshot. Preserve approved behavior and data. When a proposed change weakens consistency, accessibility or usability, explain the tradeoff and recommend an alternative rather than automatically agreeing.

- System first: reuse semantic tokens, typography, spacing, geometry, official Lucide icons and shared component patterns. Replace obsolete rules rather than stacking overrides. Use a neutral circular surface for standalone header actions such as Create and Edit; avoid a redundant outer circle around an already circled play glyph. Preserve meaningful selection indicators. Do not infer approval for unrelated visual changes.
- Hierarchy: filled accent for primary actions, accent for meaningful selection and important actions, neutral surfaces for secondary controls, muted passive indicators, semantic completion and danger colors, independent rest timer color. Never rely on color alone.
- Adaptive consistency: review compact, unfolded portrait and landscape in both themes; vary composition only when justified by space. Preserve navigation, scroll, selection, drafts, workout and timer state. Keep floating controls clear of content.
- Interaction: consistent restrained motion, accessible hit targets, keyboard and screen-reader support, reduced motion and transparency, no abrupt clipping. Prefer actual device evidence over mockup aesthetics.
- Engineering: inspect existing source and tests before proposing changes; use shared implementations, remove superseded code, add regression coverage in the same change, verify builds and deployment separately from physical-device validation. Report limitations and intentional exceptions.
- Design review gate: audit affected screens and related shared components before proposing UI changes; show source-grounded previews and explain tradeoffs. For app-wide audits, inspect Home, Workouts, active workout, Progress, Profile, navigation, timer, dialogs, responsive rules and accessibility. Record findings with evidence and priority; distinguish source findings from observed runtime behavior. No unsolicited redesign during an audit.
- Authority: current semantic palette, shared corner geometry, optical consistency, active workout focus and latest routine play control rules supersede conflicting historical examples. Maintain these standards as the source of truth and reconcile contradictory documentation when changing a component.

## Consolidation baseline — shared icon and card rules
Preserve the existing rendered 20px dock icon size (supersedes historical 22px dock specification); 22px routine play icons and 1.75 stroke remain. Shared icon geometry lives in the stylesheet, not runtime timer CSS. Routine row and detail card base declarations are consolidated without changing responsive composition. Larger layout and dialog consolidation remain separate audited stages.

## Simplified routine list — current standard
Supersedes all routine-list quick-start/play-control specifications. Routine cards are single-purpose selection controls across compact, unfolded portrait and landscape; tap anywhere on the row to open/select details. Start Workout remains the explicit primary action in details. Retain selected row surface and existing landscape lime selection line. Home quick start and active workout behavior remain unchanged. No replacement icon. Remove obsolete routine-play styles and tests.

## Active workout cohesive set controls
Use neutral input surfaces, semantic success foreground for completed set number, weight and reps, success-filled check control, shared 8px radius and 44px control height. Landscape exercise choices use the routine selection surface and indicator, no outlines, and matching 2:3 workspace proportions. Manual exercise changes use a reduced-motion-aware 180ms fade; existing rendering and timer logic remain unchanged. Full incremental rendering is deferred.

## Persistent workout capsule
The 56px capsule has three tab-independent states: idle shows Workout in progress and the session name with a semantic success dot; active rest shows the exercise that initiated the rest and countdown; completed rest shows Continue Workout and zero. No navigation chevron. The center resumes the session. Optional restExercise persists alongside existing deadline fields; legacy records without an origin display Resting rather than guessing. Existing countdown, reset and fill architecture retained.

## Active set completion refinement
Supersedes earlier green completed-set styling. Set numbers and inputs use muted text until logged, then primary ink; focused inputs use primary ink. A 32px outlined circle within a 44px accessible button becomes a filled semantic action circle with a check when logged. Compact exercise cards retain numeric progress, including completed counts; expanded cards omit counts and redundant checkmarks. Existing timer and layout remain unchanged.

## Final active workout spacing and focus
Completing a final set retains the selected exercise; only explicit selection switches focus. Supersedes automatic advancement. Set tables share one grid across orientations, 24px set column, equal flexible data columns, 44px completion target, 8px gaps and 16px card horizontal padding using shared tokens. Completed progress segments use the action accent; partial segments use a muted action blend. Selected header spacing is tightened. Timer and set completion visuals remain unchanged.

Light Home workout card: full brand blue idle, orange active, white copy, green pulsing status, 132px minimum height, one semantic button with decorative action capsule. Idle opens explicit routine selection (including labeled samples, empty workout and create routine); active resumes. Dark Home unchanged. Bright approved colors with white text are a contrast exception pending accessibility refinement. Reduced motion disables pulse and transitions.

Home header: Form. wordmark, sticky upper-right local date, progressive blur, scrolling tagline and greeting from existing personal-name storage. Date refreshes on shared tick and visibility return. Light rest track #E5E5EA with adaptive foreground sampled at each control center; dark rest track remains #24242E. No countdown or storage changes. Header applies in both themes using existing palette.

Training streak replaces Weekly Activity. Counts distinct local training dates with completed sets, Monday-based weekly goals, no sample records. First explicit schedule applies current week; subsequent edits apply next Monday and preserve prior effective schedules. A current incomplete week does not break the previous streak until it ends. No inferred actual rest or retroactive goals. Shared floating dialog blur and motion; orange streak, blue planned recovery. Schedule storage uses versioned recovery records.

Streak card finishing refinement: use a neutral moon icon as the rest-day schedule control (rather than calendar/cog), retaining its Manage Rest Days accessible label and existing modal action. Use bright system orange #FF9500 for the streak title and personal-best value instead of darker orange. Flame and recovery-day semantics remain unchanged.

Home workout card: remove redundant 'Workout in progress' label and green live dot; active orange card and Resume pill already establish state/action. Remove redundant right arrow from both Start and Resume pill. Keep workout name, elapsed minutes, completed/total sets, CTA pill, existing card geometry, color, and active workout behavior. Status is still conveyed by active orange card; no timer/session logic changes.

Streak card final compact layout: remove weekly count and progress bar entirely; rename Longest streak to Personal best. Retain computed current streak title, weekly day markers, recovery Moon control, personal-best calculation and persisted schedule. This removes only redundant display, not weekly goal/streak logic.

## Approved brand lockup and global headline system — 2026-11-24
This section supersedes earlier conflicting wordmark, theme, typography and headline specifications in this document.

- Wordmark: uppercase FORM, no period; Inter Bold 700, 28px base size, tracking -0.7px.
- Signature accent: 3px stroke, 24px centerline length, rounded caps and joins, visually centered in a 44px header. Same stroke for logo, main-page headlines and back chevrons. The 24×32 SVG uses line path M12 4 L12 16 L12 28 and back path M16 7 L7 16 L16 25.
- Optical spacing target: 10px from visible stroke edge to visible first-letter ink, not merely CSS gap. The implementation uses a 24px slot, zero grid gap and shared -2px title optical offset; inspect real Inter glyph bounds on device and refine globally if necessary. Maintain a 44px invisible back hit area independently.
- Theme options: Default (blue #0088FF) and Graphite Lime (lime #B0FF00), using identical geometry and component hierarchy. Neutral surfaces and semantic danger, timer, success and warning colors preserve their respective roles.
- Typography: Inter throughout the web app, weights 400/600/700 for body, controls/card titles and headlines. Self-host pinned Fontsource Inter variable font, OFL 1.1; retain full copyright/license notice at /licenses/inter.txt and with native distribution. Use system fallback only when font unavailable or missing a glyph. Preserve accessibility and tabular numerals.
- Brand scaling: enlarge the complete lockup proportionally for external assets; do not keep literal 3px at arbitrary scales. Do not add gradients, shadows, decorative outlines, or arbitrary variations. The current app icon is a legacy asset until a separately approved vector icon is generated.
- Home tagline: Train with focus, follow your progress. Align with wordmark text. Use the signature accent on all primary page titles; detail pages morph to back chevron; landscape split panes keep the line.
- Partner motion: 320ms content transition, 280ms glyph morph, 28px travel, stationary chrome, reversible swipe feedback, no overshoot; reduced-motion fallback. Verify on actual devices in both themes before declaring visual acceptance.

### Headline consistency enforcement
All primary page title text and the editable routine title use the shared `.form-headline` component class. Font family, weight, size, line-height, height, tracking and optical offset derive from the same root tokens; no per-page font sizing. The optical offset is calculated from the 10px target, glyph slot and stroke, with a 1.5px nominal glyph-bearing allowance. Verify actual glyph bounds in Inter on device; do not confuse box spacing with visible ink spacing. Primary headlines use a 44px title row; Home may additionally contain tagline and date. No changes to card or section title hierarchy.

### Home headline alignment
Home uses the same 44px primary title row and accent geometry as other pages. No additional vertical padding above the wordmark. Weekday aligns within the title row, date and tagline share the secondary row (18px line height), and wrapped taglines are allowed. Adaptive folded layouts reserve the actual measured brand height before the greeting and workout card. Preserve safe areas and global headline tokens.

### Efficient use of viewport space
Use 16px compact page gutters, 20px wide landscape gutters, 16px top inset (8px short landscape), always respecting safe areas. Derive bottom clearance from the actual visible floating navigation and timer heights, spacing and safe area, rather than independent fixed page margins. In wide landscape side-by-side chrome consumes only the taller control's height. Keep content scrollable when it cannot fit instead of shrinking 44px interaction targets or clipping. Keep page headers, typography, card radii and semantic colors unchanged. Home adapts to the available viewport and preserves dedicated hinge geometry. Active Workout uses the shared scroll-edge fade and does not reserve unnecessary blank space. Do not stretch content solely to fill a screen; prefer readable groups and functional space. Validate compact, unfolded portrait, landscape and timer-visible states on device.

### Graphite Lime — restrained accent (approved)
Graphite surfaces carry the Home workout card in both idle and active states. Use soft white for the title and muted gray for supporting text. Confine lime to the Start capsule and existing brand/selection/action accents; use amber for the Resume capsule to retain the active-session signal. Keep semantic timer, recovery, warning and completion colors independent. Default theme, geometry, responsive behavior and motion remain unchanged.

### Graphite Lime — cross-page accent consistency
Keep routine, progress, profile and active workout surfaces neutral. Use the shared lime action accent for selected controls, completed set checks and progress segments, and the compact training-streak trophy and completed training-day markers. Use graphite foreground on filled lime. Preserve blue planned recovery and rest timer, green timer completion, amber resume, red destructive actions and purple strength insights. No geometry or motion changes. Default is unchanged.
