# FORM — Development workflow

## Iteration and release lanes

Use a `design/<change>` branch for visual iteration and an `engineering/<change>` branch for functional iteration. A push to those branches runs **FORM iteration checks / iteration**: the existing source/unit suite and a small WebKit selection. Superseded iteration runs on the same ref and event are cancelled. No iteration job deploys production.

Use `npm run test:design` for navigation, global headline geometry and theme gallery checks. Use `npm run test:engineering` for the engineering smoke selection, or one of:
- `npm run test:engineering:workouts`
- `npm run test:engineering:timers`
- `npm run test:engineering:storage`
- `npm run test:engineering:themes`
- `npm run test:engineering:progress`

These are selections of the existing Playwright suite, not replacement tests. `npm run test:browser` still runs the entire suite. For a focused theme edit, run the themes selection before release. Use Actions → FORM iteration checks → Run workflow to select a lane/area after this workflow reaches the default branch.

**FORM checks / verify** remains the release gate: full build (including source/unit tests), Cloudflare production dry run, WebKit setup, full browser suite, failure artifacts. It runs for all pull requests (including iteration branches), merge queue checks, manual dispatch and pushes to every branch except the two iteration prefixes. Main pushes always receive the full check. No production files, product code, test definitions or production deployment configuration are changed by this workflow optimization.

For rapid iteration, keep work on the iteration branch until ready for review; opening a pull request triggers the full release gate, and additional PR updates trigger it again. Do not merge until the gate succeeds for the current PR revision.

## Interactive preview

The existing development Worker uses the same application implementation as release, plus explicit development-only reset controls. It is a real interactive app, not a screenshot or an independent mock.

- On a development machine: `npm ci`, then `npm run dev`; open http://127.0.0.1:8787.
- On an iPhone/Duo on the same trusted Wi-Fi: `npm run preview:lan`; open http://<development-machine-LAN-IP>:8787. Use a trusted network; stop the server after use. The preview has its own origin/local storage and must not be used for real records.
- Optional hosted preview: **FORM isolated preview** is a manually dispatched workflow, with explicit PREVIEW confirmation, for design/engineering branches. It packages the development entry point and deploys only a Worker named `form-design-preview` with no production routes. It uses a separate Cloudflare account and the `form-preview` GitHub environment. Before enabling, create that dedicated account/Workers subdomain, restrict the environment to trusted iteration branches and appropriate reviewers if supported, and configure environment secrets `FORM_PREVIEW_CLOUDFLARE_API_TOKEN` and `FORM_PREVIEW_CLOUDFLARE_ACCOUNT_ID` scoped only to that account. Never supply a production token/account. The Workers URL is public unless separate access protection is configured; use synthetic data only. The deployed URL is shown in the manual workflow logs. This is not provisioned by the repository alone.

No preview job publishes the release Worker or alters the production Worker configuration. The local development config keeps hosted preview URLs disabled.

## Required GitHub administration (owner action)

A workflow does not itself enforce branch protection. In Settings → Branches (or Rules → Rulesets), protect `main`: require a pull request, require the existing full `verify` status check from FORM checks (select the exact check shown by GitHub), require an up-to-date branch, prohibit force pushes and deletion, and disallow bypass where supported. Do not require the lightweight iteration job as a substitute. Verify that an unsuccessful or missing full check blocks merging, including for administrators. Confirm the production hosting integration deploys only from main after that gate; do not change production hosting automatically.

The connected GitHub integration cannot administer branch protection. Until the owner enables the rule, this gate is a documented process and an automatic PR check, not a server-enforced merge restriction. Do not merge unvalidated work. The dedicated hosted preview also remains unavailable until its separate account and credentials are configured.
