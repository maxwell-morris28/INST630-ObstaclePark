import {defineConfig} from 'vite';
// vite.config.js
export default defineConfig({
  // config options
  build: {
    target: 'esnext' //browsers can handle the latest ES features
  }})