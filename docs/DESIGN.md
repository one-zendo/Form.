# FORM Design System

## Identity
Modernized spreadsheet meets Apple-inspired matte paper and selective Liquid Glass. Compact, readable, fresh, timeless. Stable navigation, purposeful motion, adaptive phone and Duo layouts.

## Mandatory theme readiness
Every new UI component, asset and code change must support Soft Spectrum (default) and Graphite Lime from inception. Use shared semantic CSS custom properties in src/tokens.css: canvas, surface, ink, muted, accent, selected, line, success, danger, info, control, on-accent. Add semantic tokens centrally for new roles (warning, focus, disabled, overlays, charts, shadows) with values for both themes before using them. Never hardcode theme-specific colors in component styles or SVGs; palette definitions and swatch previews are exceptions. Use currentColor for monochrome SVG icons. For multicolor illustrations, provide theme-aware semantic fills or appropriate variants. Do not use color alone to communicate state. Ensure readable contrast, including text on accent backgrounds. Keep layout, typography, spacing and interaction behavior consistent across themes. Test both themes and persistence before marking verified.

## Icons
Use exact official Lucide SVG geometry fetched from lucide-icons/lucide, pinned to 0.468.0, embedded locally with upstream license. No external runtime CDN. Navigation icons 21px, stroke 2, rounded caps and joins. Animal icons are temporary deployment test assets.

## Engineering
Shared reusable components, semantic tokens, minimal dependencies, responsive safe areas, reduced-motion support. Preserve original FORM as visual reference, not architectural reference. Record changes and verification in DEVELOPMENT.md.
