import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "src/popup/popup.html"),
        offscreen: path.resolve(__dirname, "public/offscreen.html")
      },
      output: {
        entryFileNames: "assets/[name].js"
      }
    }
  }
});
