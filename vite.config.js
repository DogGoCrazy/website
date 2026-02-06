import { defineConfig } from "vite";

export default defineConfig({
  base: "/website/",   // 👈 ADD THIS LINE

  server: {
    port: 5173,
    strictPort: false,
  },
});
