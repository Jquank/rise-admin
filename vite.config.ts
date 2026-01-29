/*
 * @Author: gongjian 478197650@qq.com
 * @Date: 2023-12-17 22:23:09
 * @LastEditors: gongjian 478197650@qq.com
 * @LastEditTime: 2025-03-09 21:49:28
 * @FilePath: \rise\web\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    cssCodeSplit: false
  },
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
      '@': path.resolve(__dirname, 'src'),
      '@lib': path.resolve(__dirname, 'src/lib/dist')
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
    include: ['element-plus/es/components/**/style/css'],
    exclude: ['rise-ui']
  },
  server: {
    proxy: {
      '/mock': {
        target: 'https://mock.mengxuegu.com/mock/623ec0649a111d2ee2cb4b5f',
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:3000',
        // target: 'http://112.124.23.47:3000',
        changeOrigin: true
      },
      '/board': {
        target: 'http://localhost:3000',
        // target: 'http://112.124.23.47:3000',
        changeOrigin: true
      }
    }
  }
})
