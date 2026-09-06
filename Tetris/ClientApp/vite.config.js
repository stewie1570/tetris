import { defineConfig } from "vitest/config";
import { transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    {
      name: "treat-js-files-as-jsx",
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) {
          return null;
        }

        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
    react(),
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
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
    fileParallelism: false,
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.*"],
    },
  },
});
