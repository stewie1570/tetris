import { defineConfig } from "vitest/config";
import { transformWithOxc } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  optimizeDeps: {
    rolldownOptions: {
      moduleTypes: {
        ".js": "jsx",
      },
    },
  },
  plugins: [
    {
      name: "treat-js-files-as-jsx",
      enforce: "pre",
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) {
          return null;
        }

        return transformWithOxc(code, id, {
          lang: "jsx",
          jsx: {
            runtime: "automatic",
          },
        });
      },
    },
    react(),
  ],
  build: {
    outDir: "build",
    sourcemap: true,
    emptyOutDir: true,
  },
  server: {
    port: Number(process.env.PORT) || 3000,
    strictPort: true,
    host: "127.0.0.1",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    // One jsdom per worker. A fresh document per file was most of the runtime.
    isolate: false,
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.*"],
    },
  },
});
