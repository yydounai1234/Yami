import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const config = {
    build: {
      lib: {
        entry: './lib/main.ts',
        name: 'Yami',
        fileName: 'Yami',
      },
    },
  }
  if (mode === 'development') {
    return config
  } else {
    return {
      publicDir: false,
      ...config,
    }
  }
})
