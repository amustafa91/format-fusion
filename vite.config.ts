import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    modulePreload: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['js-yaml', 'fast-xml-parser'],
        },
      },
    },
  },
})
