import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  plugins: [
    react(),  
    tailwindcss()
  ],
  server: {
    port: 3000,
  },
})
