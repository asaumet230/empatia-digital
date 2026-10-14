import { fileURLToPath } from "node:url";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    // Outside Next.js `server-only` throws on import; tests run on the "server" side anyway.
    alias: { "server-only": fileURLToPath(new URL("./node_modules/server-only/empty.js", import.meta.url)) },
  },
  test: {
    environment: "node",
    // End-to-end tests run with Playwright (`npm run test:e2e`)
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
