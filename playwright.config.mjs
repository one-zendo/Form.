import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./tests',
 testMatch:'*.spec.mjs',
 use:{browserName:'webkit'},
 webServer:[{command:'npx wrangler dev --config wrangler.development.jsonc --local --port 8787',url:'http://127.0.0.1:8787',timeout:120000,reuseExistingServer:false},{command:'npx wrangler dev --local --port 8788',url:'http://127.0.0.1:8788',timeout:120000,reuseExistingServer:false}]
});
