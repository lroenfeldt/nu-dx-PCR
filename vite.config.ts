import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    // React plugin for JSX and other React features
    react(),

    // Electron configurations
    electron([
      // Main process configurations
      { entry: "electron/main.ts" },
      { entry: "electron/logger.ts" },
      { entry: "electron/spawn.ts" },
      { entry: "electron/deleteLogs.ts" },

      // Preload script configuration
      {
        entry: "electron/preload.ts",
        onstart(options) {
          // Reload page when preload script build is complete instead of restarting Electron app.
          options.reload();
        },
      },
    ]),

    // Configuration for Electron renderer process
    renderer(),
  ],
  base: "./",
  build: {
    outDir: "dist-electron",
    assetsDir: "assets",
  },
});
