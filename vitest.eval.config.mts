import { loadEnv } from "vite";
import { defineConfig, mergeConfig } from "vitest/config";
import base from "./vitest.config.mjs";

/** Live evaluations against OpenAI. Kept apart from `npm test`, which never calls the network. */
export default mergeConfig(
  base,
  defineConfig({
    test: {
      include: ["lib/**/*.eval.ts"],
      env: loadEnv("development", process.cwd(), ""),
      testTimeout: 300_000,
      // Always print the report, also when every case passes
      silent: false,
      reporters: ["verbose"],
    },
  }),
);
