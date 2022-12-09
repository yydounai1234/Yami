import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig((option) => {
	const mode = option.mode
	const config = {
		build: {
			lib: {
				entry: './lib/main.ts',
				name: 'Yami',
				fileName: 'Yami'
			}
		}
	}
	if (mode === 'development') {
		return { ...config, plugins: [vue()] }
	} else {
		return {
			publicDir: false,
			...config
		}
	}
})
