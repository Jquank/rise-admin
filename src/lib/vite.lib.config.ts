import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import dts from 'vite-plugin-dts'
import path from 'path'
import fs from 'fs'

// 获取所有组件入口
function getComponentsEntries(componentsDir) {
  const dirs = fs.readdirSync(componentsDir)
  const entries = {}

  dirs.forEach((dir) => {
    const fullPath = path.join(componentsDir, dir)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      // 检查是否存在 index.ts 或 组件同名文件
      const indexFile = path.join(fullPath, 'index.ts')
      const vueFile = path.join(fullPath, `${dir}.vue`)
      if (fs.existsSync(indexFile)) {
        entries[dir] = indexFile
      } else if (fs.existsSync(vueFile)) {
        entries[dir] = vueFile
      }
    }
  })

  return entries
}

// 动态生成入口配置
const entries = getComponentsEntries(path.resolve(__dirname, './components'))

console.log(entries)

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
