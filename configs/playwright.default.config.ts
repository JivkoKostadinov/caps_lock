// @ts-check
/* eslint-disable */
const { defineConfig } = require("@playwright/test");
import fs from "fs";
import path from "path";

// parse all lines from the env file like key=value and merge it to process.env
const envFile = process.env.ENV_FILE || ".env.vault";
const envPath = path.resolve(__dirname, "..", envFile);

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] ?? "";
      // remove surrounding quotes if present
      if (value.startsWith('"') && value.endsWith('"'))
        value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'"))
        value = value.slice(1, -1);
      process.env[key] = value;
    }
  }
  console.log(`✅ Loaded env file: ${envPath}`);
} else {
  console.warn(`⚠️ Env file not found: ${envPath}`);
}

export default defineConfig({
  timeout: 2 * 60 * 1000,
  testMatch: /.*\.ts/,
  reporter: "line",
  fullyParallel: true,
  actionTimeout: 50000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  workers: process.env.CI ? 1 : undefined,
  testDir: "../tests/",
  expect: {
    timeout: 20000,
  },
});
