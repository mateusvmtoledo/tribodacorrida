import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    basicSsl() // Este plugin já cuida de tudo!
  ],
  server: {
    port: 8080,
    host: true,
    // https: true <--- APAGUE ESTA LINHA, ela não é necessária com o plugin
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})