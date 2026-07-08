import { defineConfig } from 'vite/config'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import { fileURLToPath, URL } from 'node:url'
import pxToViewport from 'postcss-px-to-viewport'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()]
    })
  ],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [
        pxToViewport({
          viewportWidth: 750,
          unitPrecision: 5,
          viewportUnit: 'vw',
          selectorBlackList: ['.ignore-viewport'],
          minPixelValue: 1,
          mediaQuery: false
        })
      ]
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
