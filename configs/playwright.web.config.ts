// @ts-check
/* eslint-disable */
const { defineConfig, devices } = require("@playwright/test");
import baseConfig from "./playwright.default.config.ts";

export default defineConfig({
  ...baseConfig,
  reporter: [["dot"]],
  use: {
    headless: process.env.CI !== 'false',
    trace: "off",
    screenshot: "only-on-failure",
    launchOptions: {
      args: ["--start-maximized"],
    },
    baseURL: process.env.PROD_WEB_URL,
  },
  projects: [
    {
      name: "webkit",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        deviceScaleFactor: undefined,
        viewport: null,
      },
    },
  ],
});
