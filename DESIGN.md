# FORM — Authoritative design language and palette reference

Clean-slate reset after Build 009. No previous implementation is authoritative. Brand: FORM. Tagline: Train with focus, follow your progress.

## Latest design decisions
A modern electronic training notebook: Notion + ChatGPT content intelligence with an Apple-inspired functional shell. Paper holds information; Glass controls the experience; intelligence connects them. Soft Spectrum means the original screenshot-inspired palette, not a generic blue theme. User prefers original soft fills and white action text/icons over Build 009 darker fills. This preference is not a claim of WCAG compliance: white normal text on original blue, green and red fails 4.5:1. Preserve accessible alternatives and explicitly review contrast before implementation. Do not silently darken brand colors. Build 009 alternatives blue #2875C9, green #258044, red #C63E49 (white contrast 4.69, 4.94, 5.02). Build 008 dark foregrounds #172B40, #153B21, #35151A respectively. Original screenshot canvas #F5F7FA, later canvas #F0F5FB; original muted #828384 and divider #E5E7EB. Default Soft Spectrum; optional Graphite Lime and dark Monochrome; historical Midnight and light Monochrome available for future approval.

## Precision Paper and Precision Controls
Open content canvas, numbered routine rows, subtle separators, selective cards, inline set tables with aligned tabular numbers, previous performance, compact metadata, contextual editing. No unnecessary nested containers. Pills for actions and numeric fields; circular icon controls; 44px minimum targets, 48px primary actions. Always-visible icon-only glass navigation: Home, Workouts, Progress, Profile. Global rest timer above navigation, same width, compact countdown, minus/plus 15 seconds, pause and skip; available across pages. No swipe-to-minimize workout mini player. Motion should be restrained, responsive and state-expressive: direct tab switching, smooth inline expansion, drag displacement and swipe deletion, reduced-motion fallback. Responsive reflow for Duo folded/unfolded portrait/landscape and ordinary phones. Accessibility, keyboard, VoiceOver, contrast, loading/empty/error/success/offline/disabled/sync/interrupted states, performance and consistency are design requirements. Use shared components and semantic tokens, not isolated overrides. Design approval before major visual changes.

## Prior approved design specification
# FORM Design System

## Identity
Modernized spreadsheet meets Apple-inspired matte paper and selective Liquid Glass. Compact, readable, fresh, timeless. Stable navigation, purposeful motion, adaptive phone and Duo layouts.

## Mandatory theme readiness
Every new UI component, asset and code change must support Soft Spectrum (default) and Graphite Lime from inception. Use shared semantic CSS custom properties in src/tokens.css: canvas, surface, ink, muted, accent, selected, line, success, danger, info, control, on-accent. Add semantic tokens centrally for new roles (warning, focus, disabled, overlays, charts, shadows) with values for both themes before using them. Never hardcode theme-specific colors in component styles or SVGs; palette definitions and swatch previews are exceptions. Use currentColor for monochrome SVG icons. For multicolor illustrations, provide theme-aware semantic fills or appropriate variants. Do not use color alone to communicate state. Ensure readable contrast, including text on accent backgrounds. Keep layout, typography, spacing and interaction behavior consistent across themes. Test both themes and persistence before marking verified.

## Icons
Use exact official Lucide SVG geometry fetched from lucide-icons/lucide, pinned to 0.468.0, embedded locally with upstream license. No external runtime CDN. Navigation icons 21px, stroke 2, rounded caps and joins. Animal deployment test completed; production navigation uses house, dumbbell, chart-no-axes-column-increasing and user-round.

## Engineering
Shared reusable components, semantic tokens, minimal dependencies, responsive safe areas, reduced-motion support. Preserve original FORM as visual reference, not architectural reference. Record changes and verification in DEVELOPMENT.md.

## Readability and adaptive approval standard
Every page and major component requires review in both themes across Duo folded portrait, folded landscape, unfolded portrait and unfolded landscape (eight combinations). Adapt to available viewport width and height, safe areas and keyboard; preserve state during resize/rotation. Use reflow, not scaling down or stretching. Default web typography targets in CSS px: logo 32 bold, page title 28 semibold, section 20 semibold, card title 17 semibold, body 16–17 regular, workout values 17 medium, buttons 16 semibold, secondary 14, nav labels 12. Support text enlargement; avoid clipping. Controls: minimum 44x44 CSS px touch area, primary height 48–52, standard icons 22 (existing navigation 21), action button radius full pill (999px), icon-only buttons circular, card radius 16, dialog radius 28–32, card padding 16, gaps 8–16, sections 24. These are proposed shared defaults, subject to visual approval. Check contrast, ergonomics, scroll, keyboard, safe areas and state preservation. Record actual test results; never assume device verification. Apple references: https://developer.apple.com/design/human-interface-guidelines/typography and https://developer.apple.com/design/human-interface-guidelines/accessibility.

## Approved material system
Matte Paper for content; CSS glass-inspired translucent navigation and overlays with opaque fallback, shared edge/highlight/blur/shadow tokens; solid accent for primary actions. Both themes required. Keep navigation visible, safe-area aware, and independent of scrolling. Native Apple Liquid Glass is not available to this CSS web implementation.

## Approved button geometry
Primary, secondary and confirmation action buttons use the shared pill radius; icon-only controls use circular geometry with a minimum 44px touch target. Text links, swipe-reveal segments, cards, fields and navigation retain their distinct geometry. Both themes use the same shapes.


## Build 009 token reference (historical values, not executable code)
- :root
--canvas:#F0F5FB; --surface:#fff; --ink:#2A3035; --muted:#566275; --accent:#075FCB; --selected:#EDF6FE; --line:#D5DFED; --tab-height:48px; --icon-size:21px; --radius:12px; --button-radius:999px; --icon-button-radius:50%; --font:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
- :root
--success:#207438; --danger:#BC2038; --info:#075FCB; --control:#E9EAEA; --on-accent:#fff
- :root[data-theme="graphite-lime"]
--canvas:#17171F; --surface:#24252D; --ink:#F7F7FA; --muted:#A4A5AF; --accent:#A8F900; --selected:#303C20; --line:#363740; --success:#A8F900; --danger:#F43A50; --info:#69A5F8; --control:#393A42; --on-accent:#17171F
- :root
--paper:var(--surface); --glass:rgba(255,255,255,.78); --glass-edge:rgba(104,115,133,.20); --glass-highlight:rgba(255,255,255,.8); --glass-shadow:0 5px 24px rgba(16,27,48,.09); --glass-blur:22px; --paper-radius:16px; --glass-radius:25px; --nav-inset:10px; --nav-height:74px; --on-success:#fff; --warning:#A56312
- :root[data-theme="graphite-lime"]
--glass:rgba(43,44,53,.82); --glass-edge:rgba(164,165,175,.24); --glass-highlight:rgba(255,255,255,.12); --glass-shadow:0 5px 24px rgba(0,0,0,.28); --on-success:#17171F; --warning:#E9B75B
- /* Shared progressive navigation backdrop. */
:root
--nav-fade-height:130px; --nav-fade-blur:14px; --nav-fade-tint:rgba(240,245,251,.86)
- :root[data-theme="graphite-lime"]
--nav-fade-tint:rgba(23,23,31,.86)
- :root[data-theme="monochrome"]
--canvas:#000000; --surface:#212121; --ink:#FFFFFF; --muted:#999999; --accent:#FFFFFF; --selected:#383838; --line:#383838; --success:#30D158; --danger:#FF453A; --info:#64A8FF; --control:#303030; --on-accent:#000000; --on-success:#000000; --warning:#FFD166; --glass:rgba(33,33,33,.88); --glass-edge:rgba(255,255,255,.16); --glass-highlight:rgba(255,255,255,.08); --glass-shadow:0 5px 24px rgba(0,0,0,.3); --nav-fade-tint:rgba(0,0,0,.86)
- /* Precision Paper shared scale. */
:root
--space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-5:24px; --text-meta:13px; --text-body:16px; --text-section:20px; --touch-target:44px; --nav-selection:color-mix(in srgb,var(--accent) 15%,var(--surface))
- /* Precision Controls: shared geometry and responsive gutters. */
:root
--control-height:44px; --primary-height:48px; --control-gap:8px; --page-gutter:clamp(14px,4vw,24px); --workspace-width:1040px; --rest-dock-height:64px
- /* Original screenshot-inspired Soft Spectrum: brand fills separated from accessible foregrounds. */
:root
--accent-fill:var(--accent); --success-fill:var(--success); --danger-fill:var(--danger); --accent-fill-ink:var(--on-accent); --success-fill-ink:var(--on-success); --danger-fill-ink:var(--on-danger,#fff); --success-tint:color-mix(in srgb,var(--success) 12%,var(--paper)); --insight:var(--accent); --insight-tint:var(--selected)
- :root:not([data-theme]),:root[data-theme="soft-spectrum"]
--spectrum-blue:#58A5F8; --spectrum-green:#65CA79; --spectrum-purple:#7D2DF2; --spectrum-red:#EC6568; --spectrum-ice:#EDF6FE; --spectrum-mint:#EDF9F1; --spectrum-blush:#FCEFF0; --spectrum-pale-blue:#D2E8FD; --accent-fill:#2875C9; --success-fill:#258044; --danger-fill:#C63E49; --accent-fill-ink:#FFFFFF; --success-fill-ink:#FFFFFF; --danger-fill-ink:#FFFFFF; --success-tint:var(--spectrum-mint); --insight:var(--spectrum-purple); --insight-tint:#F2EAFE; --nav-selection:var(--spectrum-pale-blue)

## Historical palettes from original FORM repository
- html[data-form-palette="graphite"]: --palette-bg:#16161E;--palette-card:#22232C;--palette-cell:#34353F;--palette-ink:#F5F5F7;--palette-muted:#92939D;--palette-line:#30313B;--palette-accent:#B4FA16;--palette-on:#16161E;--palette-done:#343B27
- html[data-form-palette="midnight"]: --palette-bg:#101827;--palette-card:#1E293B;--palette-cell:#334155;--palette-ink:#F5F5F7;--palette-muted:#94A3B8;--palette-line:#344155;--palette-accent:#60A5FA;--palette-on:#101827;--palette-done:#203B36
- html[data-form-palette="mono"]: --palette-bg:#F4F4F4;--palette-card:#FFFFFF;--palette-cell:#EAEAEA;--palette-ink:#171717;--palette-muted:#737373;--palette-line:#DADADA;--palette-accent:#171717;--palette-on:#FFFFFF;--palette-done:#E0E8E2
- Quiet Performance v1 —
--qp-canvas:#F6F8FB; --qp-surface:#FFFFFF; --qp-subtle:#EDF2F8; --qp-ink:#101D33; --qp-secondary:#627086; --qp-line:#DCE4EF; --qp-blue:#247CF4; --qp-blue-soft:#EAF2FF; --qp-amber:#B56800; --qp-amber-soft:#FFF4E3; --qp-success:#167A58
- Electric Pop —
--blue:#2675FF; --qp-blue:#2675FF; --form-action:#2675FF; --form-primary:#2675FF; --form-focus-ring:#2675FF; --green:#00C896; --form-success:#00C896; --form-progress:#00C896; --form-completion-green:#00C896; --coral:#FF694A; --purple:#A36BFF; --form-insight:#A36BFF; --form-warmup:#FFC247; --form-action-tint:#EAF1FF; --form-primary-tint:#EAF1FF; --form-success-tint:#DDF9F1; --form-progress-track:#DDF9F1; --form-insight-tint:#F2EAFF; --form-warmup-tint:#FFF4D6
- unified Apple palette 2026-11-22
--ink:#111114; --muted:#737780; --line:#E5E5EA; --surface:#F0F1F5; --white:#FFFFFF; --blue:#0A84FF; --green:#30D158; --purple:#BF5AF2; --red:#FF453A; --coral:#FF9F0A; --yellow:#FFD60A; --form-bg:#F5F6FA; --form-card:#FFFFFF; --form-subtle:#F0F1F5; --form-blue:#0A84FF; --form-green:#30D158; --form-purple:#BF5AF2; --form-yellow:#FFD60A; --form-orange:#FF9F0A
- Signature Palette —
--form-brand:#3478F6; --form-action:#278C46; --form-progress:#47BD60; --form-success:#278C46; --form-completion-green:#47BD60; --form-success-tint:#E5F6E9; --form-progress-track:#DFE7F1; --form-active:#E99428; --form-ink:#14213A; --form-muted:#738095; --form-frost:#F3F6FC; --form-card:#FFFFFF; --form-border:#D9E3F0
- Light Palette —
--ink:#2A3035; --muted:#828384; --line:#E5E7EB; --surface:#E9EAEA; --white:#FFFFFF; --blue:#58A5F8; --green:#65CA79; --purple:#7D2DF2; --red:#EC6568; --form-blue:#58A5F8; --form-green:#65CA79; --form-purple:#7D2DF2; --form-bg:#F5F7FA; --form-card:#FFFFFF; --form-subtle:#EDF6FE; --form-brand:#58A5F8; --form-success:#65CA79; --form-action:#65CA79; --form-completion-green:#65CA79; --form-success-tint:#EDF9F1; --form-frost:#EDF6FE; --form-border:#E5E7EB; --form-muted:#828384; --form-progress:#65CA79; --form-progress-track:#E9EAEA; --form-compact-success:#65CA79; --qp-blue:#58A5F8; --form-palette-blue:#58A5F8; --form-palette-green:#65CA79; --form-palette-purple:#7D2DF2; --form-palette-red:#EC6568; --form-palette-soft-blue:#EDF6FE; --form-palette-soft-green:#EDF9F1; --form-palette-soft-pink:#FCEFF0; --form-palette-light-blue:#D2E8FD; --form-palette-control:#E9EAEA; --form-palette-ink:#2A3035
- Original theme picker: Soft Spectrum #F0F5FB #FFFFFF #1684F8 #22C55E; Graphite Lime #16161E #22232C #B4FA16 #92939D; Midnight #101827 #1E293B #60A5FA #94A3B8; light Monochrome #F4F4F4 #FFFFFF #171717 #A3A3A3.
- Sources: original one-zendo/Form index.html; current one-zendo/Form. src/tokens.css and docs/DESIGN.md before reset. Historical palettes are references, not automatic defaults.
