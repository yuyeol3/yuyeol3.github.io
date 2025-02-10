import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { compression } from 'vite-plugin-compression2';
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        nodePolyfills({
        protocolImports : true
        }),
        compression(),
        // compression({
        //     algorithm : 'brotliCompress'
        // }),
    ],
    build : {
        outDir: '../dist/',
        emptyOutDir: true
    }
});
