import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standard stable Vite configuration block
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Forces Vite to boot cleanly on your original port
  }
})