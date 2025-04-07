import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import dts from 'vite-plugin-dts'
import path from 'path'
console.log(path.resolve(__dirname, '..'))

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
      rollupTypes: true,
      tsconfigPath: path.resolve(__dirname, '../../tsconfig.json'),
      include: ['**/*'],
      outDir: './dist/types',
      exclude: ['dist', 'vite.lib.config.ts', 'node_modules'],
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
      fileName: 'riseui'
    },
    rollupOptions: {
      external: (id) => {
        return /^vue/.test(id) || /^element-plus/.test(id) || /\.css$/.test(id)
      },
      output: {
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
