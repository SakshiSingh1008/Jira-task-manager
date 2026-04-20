import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// __define-ocg__
// __define-pcb__

let varOcg = "vite-config";
let varPcb = true;

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
  ],
})