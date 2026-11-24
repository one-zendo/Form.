# FORM Design System

## Identity
Modernized spreadsheet meets Apple-inspired matte paper and selective Liquid Glass. Compact, readable, fresh, timeless. Stable navigation, purposeful motion, adaptive phone and Duo layouts.

## Mandatory theme readiness
Every new UI component, asset and code change must support Soft Spectrum (default) and Graphite Lime from inception. Use shared semantic CSS custom properties in src/tokens.css: canvas, surface, ink, muted, accent, selected, line, success, danger, info, control, on-accent. Add semantic tokens centrally for new roles (warning, focus, disabled, overlays, charts, shadows) with values for both themes before using them. Never hardcode theme-specific colors in component styles or SVGs; palette definitions and swatch previews are exceptions. Use currentColor for monochrome SVG icons. For multicolor illustrations, provide theme-aware semantic fills or appropriate variants. Do not use color alone to communicate state. Ensure readable contrast, including text on accent backgrounds. Keep layout, typography, spacing and interaction behavior consistent across themes. Test both themes and persistence before marking verified.

## Icons
Use exact official Lucide SVG geometry fetched from lucide-icons/lucide, pinned to 0.468.0, embedded locally with upstream license. No external runtime CDN. Navigation icons 21px, stroke 2, rounded caps and joins. Animal icons are temporary deployment test assets.

## Engineering
Shared reusable components, semantic tokens, minimal dependencies, responsive safe areas, reduced-motion support. Preserve original FORM as visual reference, not architectural reference. Record changes and verification in DEVELOPMENT.md.

## Readability and adaptive approval standard
Every page and major component requires review in both themes across Duo folded portrait, folded landscape, unfolded portrait and unfolded landscape (eight combinations). Adapt to available viewport width and height, safe areas and keyboard; preserve state during resize/rotation. Use reflow, not scaling down or stretching. Default web typography targets in CSS px: logo 32 bold, page title 28 semibold, section 20 semibold, card title 17 semibold, body 16–17 regular, workout values 17 medium, buttons 16 semibold, secondary 14, nav labels 12. Support text enlargement; avoid clipping. Controls: minimum 44x44 CSS px touch area, primary height 48–52, standard icons 22 (existing navigation 21), button radius 12, card radius 16, dialog radius 28–32, card padding 16, gaps 8–16, sections 24. These are proposed shared defaults, subject to visual approval. Check contrast, ergonomics, scroll, keyboard, safe areas and state preservation. Record actual test results; never assume device verification. Apple references: https://developer.apple.com/design/human-interface-guidelines/typography and https://developer.apple.com/design/human-interface-guidelines/accessibility.
