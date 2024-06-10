import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": "/src/components",
      "@layout": "/src/layouts",
      "@route": "/src/routes",
      "@constant": "/src/constants",
      "@pages": "/src/pages",
      "@features": "/src/features",
      "@apis": "/src/apis",
      "@utils": "/src/utils",
      "@store": "/src/app",
    },
  },
});
