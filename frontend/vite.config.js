import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
      react(),
      nodePolyfills({
        protocolImports : true
      }),
    ],
    build : {
        outDir: '../dist/',
        emptyOutDir: true
    }
});
