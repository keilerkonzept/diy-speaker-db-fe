import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = command === 'build';
  
  return {
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss({
        // Disable Tailwind CSS tree shaking in development mode
        minify: isProduction,
        cssMinify: isProduction,
        treeShake: isProduction
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})
