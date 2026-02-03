import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from '@tailwindcss/vite' // <-- El nombre importado es tailwindcss

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss() // <-- Aquí debe coincidir con el nombre de arriba
  ],
  proxy: {
      '/api': {
        target: 'http://localhost:5000', // <-- CAMBIA ESTO por el puerto real de tu API en C#
        changeOrigin: true,
        secure: false,
      },
    },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})



