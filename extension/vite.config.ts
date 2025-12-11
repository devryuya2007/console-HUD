import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"
import { readFileSync } from "fs"

const manifestPath = resolve(__dirname, "manifest.json")

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    {
      name: "copy-extension-manifest",
      apply: "build",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "manifest.json",
          source: readFileSync(manifestPath, "utf-8"),
        })
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
      },
    },
  },
})
