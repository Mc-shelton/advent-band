import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.epub'],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      // Fix MUI v6 internal bucket imports for esbuild/vite
      { find: /^@mui\/bucket\/(.*)$/, replacement: '@mui/system/$1' },
      { find: '@mui/bucket', replacement: '@mui/system' },
      // Ensure a single React instance to avoid invalid hook calls
      { find: 'react', replacement: path.resolve(__dirname, 'node_modules/react') },
      { find: 'react-dom', replacement: path.resolve(__dirname, 'node_modules/react-dom') }
    ],
  },
  optimizeDeps: {
    force: true,
    // Prebundle MUI + Emotion to stabilize module graph
    include: [
      '@mui/material',
      '@mui/system',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled'
    ]
  }
})
