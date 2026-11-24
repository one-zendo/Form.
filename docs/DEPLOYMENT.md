# FORM — Cloudflare Workers deployment

## Settings
| Setting | Value |
|---|---|
| Worker | form |
| Repository | one-zendo/Form. |
| Production branch | main |
| Root directory | / |
| Build command | npm run test && npm run build |
| Deploy command | npx wrangler deploy |
| Assets | ./dist (wrangler.jsonc) |
| Recommended Node | 22 |

Preview: https://form.connect-zendo.workers.dev. The old formapp address is not the new deployment target.

## Build and deploy
Workers Builds installs dependencies before the build command. Until a lockfile exists, use npm install for manual builds. Never deploy raw source; Vite emits fingerprinted assets. A backend Worker is not required for the static shell.
In Workers & Pages > form > Settings > Build, confirm repository, branch and commands, save and retry. A successful build must pass tests and TypeScript compilation.

## Verify
Check build logs and live version DEV v0.1.0 (001) or current checkpoint version. Test taps, swipe, cancellation, keyboard, theme persistence and Duo orientations. Record results in [DEVELOPMENT.md](../DEVELOPMENT.md).
Dashboard settings were reportedly saved by the user; Worker target corrected in repository. Live deployment and build logs not independently verified.
