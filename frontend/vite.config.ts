import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': []
        }
      }
    }
  },
  server: {
    port: 4331,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/snapshot': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/export': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/view': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/docs': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/avatars': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/sessions': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/details': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/cron': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/healthz': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/digest': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/audit': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/exceptions': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/notifications': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/action-queue': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/usage-cost': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/projects': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/tasks': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/graph': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/done-checklist': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/brain': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      },
      '/session': {
        target: 'http://127.0.0.1:4320',
        changeOrigin: true
      }
    }
  }
})
