import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

const root = resolve(import.meta.dirname);

export default defineConfig({
  root,
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        cli: resolve(root, "cli.html"),
      },
    },
  },
});
