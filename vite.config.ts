import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path' // <-- Importar path
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { // <-- Asegúrate de tener esta sección 'resolve'
    alias: {
      '@': path.resolve(__dirname, './src'), // <-- Y esta configuración de alias
    },
  },
})