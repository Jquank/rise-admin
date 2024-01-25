import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    visualizer()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: '@import "@/assets/css/global.variable.less";'
      }
    }
  },
  optimizeDeps: {
    include: ['element-plus/es/components/**/style/css']
  },
  server: {
    proxy: {
      '/mock': {
        target: 'https://mock.mengxuegu.com/mock/623ec0649a111d2ee2cb4b5f',
        changeOrigin: true
      }
      // '/mock': {
      //   target: 'http://localhost:3000/api',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/mock/, '')
      // }
    }
  }
})
