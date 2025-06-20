import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.', // Ensures Vite uses the current directory
  plugins: [react()],
  server: {
    port: 3000
  }
})
