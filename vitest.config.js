import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // Use jsdom for browser-like testing
    globals: true, // Enable global test functions like `describe`, `it`, etc.
    setupFiles: "./vitest.setup.js", // Setup file for additional configurations
  },
});
