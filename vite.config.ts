import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'Yami',
      fileName: 'Yami'
    }
  }
})
