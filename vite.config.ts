import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

//import NodeGlobalsPolyfillPlugin from "@esbuild-plugins/node-globals-polyfill"

// https://vitejs.dev/config/
export default defineConfig({
  root: "./example",
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./example/src', import.meta.url)),
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: "util",
      web3: fileURLToPath(new URL('./node_modules/web3/dist/web3.min.js', import.meta.url))
    }
  }
})
