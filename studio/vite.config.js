import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    postcss: {
      plugins: []
    }
  },
  server: {
    port: 3333
  }
})
