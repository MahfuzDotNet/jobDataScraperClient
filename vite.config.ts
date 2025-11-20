// import path from "path"
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     host: '0.0.0.0',
//     port: 5000,
//     strictPort: true,
//     allowedHosts: 'all',
//     proxy: {
//       '/api': {
//         target: 'http://192.168.0.103:8000',
//         changeOrigin: true,
//         secure: false,
//         ws: true
//       }
//     }
//   }
// })






import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    proxy: {
      "/api": {
        target: "http://192.168.0.102:8000", // ✅ same IP as frontend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
