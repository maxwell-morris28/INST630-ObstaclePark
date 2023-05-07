import {defineConfig} from 'vite';
// vite.config.js
export default defineConfig({
  // config options
  build: {
    target: 'esnext' //browsers can handle the latest ES features
  },
  base: '/https://maxwell-morris28.github.io/INST630-ObstaclePark/ObstaclePark/'
})