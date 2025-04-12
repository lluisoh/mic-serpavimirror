import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      reporter: ["text", "html"],
      exclude: [
        ...configDefaults.coverage.exclude ?? [],
        '**/app.ts',
        '**/server.ts',
        '**/index.ts',
        '**/*.types.ts',
        "**/scripts/**",
        "**/data/**",
        "**/__mocks__/**",
      ]
    },
    exclude: [
      ...configDefaults.exclude,
    ],
  },
});
