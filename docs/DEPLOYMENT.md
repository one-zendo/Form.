# Cloudflare Workers deployment — FORM

Worker: form
Repository: one-zendo/Form.
Production branch: main
Root directory: /
Build command: npm run test && npm run build
Deploy command: npx wrangler deploy
Assets: ./dist (configured in wrangler.jsonc)
Node version: 22 (NODE_VERSION build variable if needed)

Workers Builds installs dependencies before running the build command. Until a package lock exists, use npm install for manual builds. Never deploy the raw repository or src directory. Vite emits fingerprinted assets. A backend Worker is not required for this static application shell.

In Cloudflare dashboard open Workers & Pages > form > Settings > Build, confirm repository and branch, replace old build/deploy commands with the values above, save, and retry a build. A successful build must pass tests and TypeScript compilation. Verify deployed page shows DEV v0.1.0 (001), then test taps, swipe, cancellation, keyboard, theme persistence and Duo orientations.

Dashboard changes and live deployment require authorized Cloudflare access; not performed in this session.
