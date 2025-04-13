import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '..')
    }
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    dts({
      outDir: './dist/types',
      rollupTypes: false,
      tsconfigPath: path.resolve(__dirname, '../../tsconfig.json'),
      include: [
        path.resolve(__dirname, 'components/**/*'),
        path.resolve(__dirname, 'index.ts')
      ],
      exclude: ['dist', 'node_modules'],
      staticImport: true,
      insertTypesEntry: true,
      copyDtsFiles: true
    })
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: './index.ts',
      name: 'riseui',
      formats: ['es'],
      fileName: 'riseui'
    },
    rollupOptions: {
      external: (id) => {
        return /^vue/.test(id) || /^element-plus/.test(id) || /\.css$/.test(id)
      },
      output: {
        inlineDynamicImports: false,
        manualChunks: (id) => {
          console.log(id)
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          // 更精确的组件分包
          if (id.split('components/').length === 2 && id.endsWith('.vue')) {
            const componentName = path.basename(id, '.vue')
            return `components/${componentName}`
          }
        },
        entryFileNames: 'index.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus'
        },
        assetFileNames: 'style.css'
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
})
