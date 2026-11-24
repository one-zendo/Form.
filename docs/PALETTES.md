# FORM — Palette and historical token archive

Reference only. These values are preserved verbatim from the retired design document; they do not override [DESIGN.md](../DESIGN.md) or represent current executable CSS.

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
