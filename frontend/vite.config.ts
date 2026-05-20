import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: __dirname,
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  preview: {
    allowedHosts: ["gilded-plates-showcase-1.onrender.com"],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
