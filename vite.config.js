import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate sourcemaps for better debugging
    sourcemap: true,
    // Ensure clean URLs work correctly
    rollupOptions: {
      output: {
        // Prevent hash in file names for cleaner URLs
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  server: {
    // Enable history API fallback for SPA routing
    historyApiFallback: true,
    port: 5173,
    // Configure proxy if needed for API calls
    proxy: {
      '/api': {
        target: 'https://crypto-api-xi.vercel.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1/crypto')
      }
    }
  },
  preview: {
    // Also enable history API fallback for preview
    historyApiFallback: true,
    port: 4173
  },
  resolve: {
    alias: {
      '@': '/src',  // Enable @ imports from src directory
    }
  }
})