import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
export const SERVER_LOG = ".playwright/servidor.log";

/**
 * End-to-end tests against a production build, with the simulated AI (no OpenAI, no cost).
 * Three browsers: computer (Chromium), iPhone (WebKit, Safari's engine) and Android (Chromium).
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: "list",
  globalTeardown: "./e2e/sin-mensajes-en-logs.ts",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "computador", use: { ...devices["Desktop Chrome"] } },
    { name: "iphone", use: { ...devices["iPhone 13"] } },
    { name: "android", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    // The server log is kept so the teardown can prove no message ever reaches it
    command: `mkdir -p .playwright && npm run build && npx next start -p ${PORT} > ${SERVER_LOG} 2>&1`,
    url: `http://localhost:${PORT}`,
    timeout: 240_000,
    reuseExistingServer: false,
    env: {
      ORACULO_IA_SIMULADA: "1",
      ORACULO_SECRET: "solo-para-pruebas-e2e-0123456789abcdefghijklmnopqrstuvwxyz",
    },
  },
});
