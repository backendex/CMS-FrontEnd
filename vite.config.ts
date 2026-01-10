import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from '@tailwindcss/vite' // <-- El nombre importado es tailwindcss

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss() // <-- Aquí debe coincidir con el nombre de arriba
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})