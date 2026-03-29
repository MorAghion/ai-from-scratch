import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Hot-reload content .txt files by invalidating the loader module
function contentHotReload() {
  return {
    name: 'content-hot-reload',
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.txt') && file.includes('/content/')) {
        const loaderModule = server.moduleGraph.getModulesByFile(
          new URL('./src/content/loader.js', import.meta.url).pathname
        )
        if (loaderModule) {
          loaderModule.forEach(mod => server.moduleGraph.invalidateModule(mod))
        }
        server.ws.send({ type: 'full-reload' })
        return []
      }
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), contentHotReload()],
  server: {
    port: 3000,
    open: true,
  },
})
