import { defineConfig } from "vite";
import { resolve } from "path";
import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
  plugins: [reactRefresh()],
  build: {
    target: "esnext",
    minify: "esbuild",
    lib: {
      formats: ["es"],
      entry: resolve(__dirname, "src/panel/index.tsx"),
      name: "Workspace",
    },
    rollupOptions: {
      inlineDynamicImports: true,
    },
  },
});
