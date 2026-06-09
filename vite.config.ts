import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  base: "./", 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    open: '/',
    proxy: {
      '/api': {
        target: 'https://romantic-spence.74-208-70-235.plesk.page',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            const cookie = proxyReq.getHeader('cookie') || '';
            const newCookie = cookie 
              ? `${cookie}; plesk_technical_domain=1` 
              : 'plesk_technical_domain=1';
            proxyReq.setHeader('cookie', newCookie);
          });
        },
      },
    },
  },
})