import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

// Prefer the sandbox's preinstalled Chromium so tests run without
// downloading browsers. Falls back to Playwright's bundled binary.
const PREINSTALLED = [
  "/chromium-1194/chrome-linux/chrome",
  "/chromium_headless_shell-1194/chrome-linux/headless_shell",
].find((p) => existsSync(p));

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:8080",
    viewport: { width: 1280, height: 900 },
    trace: "off",
    launchOptions: PREINSTALLED ? { executablePath: PREINSTALLED } : undefined,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

