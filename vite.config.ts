import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import {config} from 'dotenv';
config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  define: {
    "process.env": process.env
  },
  server: {
    port: 3000,
    allowedHosts: true
  },
  preview: {
    port: 3000,
    allowedHosts: true
  },
   build: {
      chunkSizeWarningLimit: 1600
   }
});
