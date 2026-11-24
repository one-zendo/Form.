# FORM — Developer instructions

## Before work
1. Confirm repository is one-zendo/Form. (trailing period). Never modify original one-zendo/Form.
2. Read root DESIGN.md and DEVELOPMENT.md. Consult docs/PALETTES.md for historical values and docs/DEPLOYMENT.md for hosting.
3. Identify the approved task, current build and pending verification. Ask before major visual changes.

## Implementation
Use React, TypeScript, Vite, shared semantic tokens and reusable components. Keep navigation and future workout engine independent of pages. Use official bundled Lucide icons, responsive reflow and accessible controls. Support every active theme. Do not import retired code as authoritative or introduce unapproved design changes.

## Verification and save point
Run relevant tests and compilation where available; check interaction, themes, accessibility and device layouts. Distinguish source inspection, executed tests, deployment and physical-device verification. Never claim untested behavior works.
Increment visible build for application code updates; documentation and deployment-only changes do not increment it. Update DEVELOPMENT.md with changes, actual tests, limitations and next task. Read back writes to verify. Keep DESIGN.md authoritative and historical palettes intact.
