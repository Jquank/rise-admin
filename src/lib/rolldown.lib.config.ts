import { defineConfig } from 'rolldown'
import vue from '@vitejs/plugin-vue'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
// import dts from 'rollup-plugin-dts'
import less from 'rollup-plugin-less'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import commonjs from '@rollup/plugin-commonjs'

// // 组件库入口文件 (支持多入口按需加载)
// const components = [
//   'Button',
//   'Input',
//   'Select'
//   // 添加其他组件...
// ]

// const entries = {
//   index: path.resolve(__dirname, 'src/index.ts'),
//   ...components.reduce(
//     (acc, name) => {
//       acc[`components/${name}`] = path.resolve(
//         __dirname,
//         `src/components/${name}/index.ts`
//       )
//       return acc
//     },
//     {} as Record<string, string>
//   )
// }

export default defineConfig({
  // 入口配置
  input: './components/index.ts',

  // 输出配置
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: 'riseui.js',
    chunkFileNames: 'chunks/riseui-[hash].js',
    assetFileNames: 'assets/riseui-[hash][extname]'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '..')
    }
  },
  // 插件配置
  plugins: [
    // Vue3 支持
    vue({
      template: {
        compilerOptions: {
          // Vue3 特有的编译选项
          hoistStatic: true,
          cacheHandlers: true
        }
      },
      customElement: ((tag) => !tag.startsWith('el-'))()
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    less({
      output: 'dist/style.css', // 可选：将 Less 编译为独立 CSS 文件
      insert: false // 不注入到 <style> 标签
    }),
    // 第三方模块解析
    nodeResolve({
      extensions: ['.mjs', '.js', '.ts', '.vue'],
      mainFields: ['module', 'main'], // 优先 ES 模块
      resolveOnly: (module) => {
        return (
          !module.includes('lodash-es') &&
          !module.includes('@tinymce/tinymce-vue')
        )
      },
      preferBuiltins: true
    }),

    typescript({
      tsconfig: path.resolve(__dirname, '../../tsconfig.json'),
      emitDeclarationOnly: true, // 强制只生成声明文件
      noEmit: false, // 必须为 false
      allowImportingTsExtensions: false,
      declaration: true,
      declarationDir: path.resolve(__dirname, 'dist/types'),
      include: [
        path.resolve(__dirname, 'components/index.ts'),
        // path.resolve(__dirname, '*.d.ts'),
        path.resolve(__dirname, 'components/**/*.vue')
      ],
      exclude: ['**/__tests__/**', '**/*.spec.ts', '**/*.test.ts'],
      tslib: require.resolve('tslib')
    })
    // dts({
    //   sequential: true,
    //   fileOrder: {
    //     priority: ['**/const.ts', '**/types.ts'], // 先处理这些文件
    //     delay: ['**/internal/*'] // 后处理内部模块
    //   },
    //   entryRoot: path.resolve(__dirname, 'components/*'),
    //   outputDir: path.resolve(__dirname, 'dist/types'),
    //   tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    //   exclude: ['**/__tests__/**'],
    //   compilerOptions: {
    //     preserveSymlinks: true
    //   },
    //   rollupOptions: {
    //     output: {
    //       file: 'dist/types/index.d.ts' // 强制单文件输出
    //     }
    //   }
    // })
  ],

  // 外部依赖
  external: (id) => {
    return /^vue/.test(id) || /^element-plus/.test(id) || /\.css$/.test(id)
  }
})
