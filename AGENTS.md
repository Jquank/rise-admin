# AI Agent Instructions for `rise` workspace

让 AI 编码代理在本仓库内安全、高效地贡献代码。

## Code Style

- **Vue 组件：** 统一使用 `<script setup lang="ts">`（Composition API），文件和组件名使用小写 kebab-case（`aaa` 或 `aaa-bbb`）。
- **格式化：** Prettier + ESLint（`@vue/eslint-config-prettier`），参见 `package.json`。**改完代码后务必运行 `npx eslint --fix <file>` 格式化，再运行 `npm run build` 验证。**
- **自动导入：** Element Plus 组件（`el-button`、`el-select` 等）在 `<template>` 中由 `unplugin` 自动导入，无需手动 import。但在 `<script setup>` 中调用的 `ElMessage`、`ElMessageBox`、`ElNotification` 需要手动 `import { ... } from 'element-plus'`。
- **路径别名：** `@/` → `src/`，`@lib` → `src/lib/dist`。
- **布局：** 优先使用 Flex 布局，满足不了需求时使用 Grid 布局。

## Architecture

- **入口：** `src/main.ts`，构建配置见 `vite.config.ts`。
- **状态管理：** Pinia，**Setup Store 风格**（`defineStore` + Composition API），store 见 `src/store/`。
- **路由：** Vue Router（hash 模式），`src/router/modules/*.ts` 通过 `import.meta.glob` 自动发现。路由守卫会检查 token、加载权限、按 `mergedMenuAuth` 动态过滤路由。路由元信息类型见 `src/types/extension.d.ts`。
- **API 层：** 三层 API 目录，均使用 `src/utils/http.ts` 的 Axios 实例（自动附加 Bearer token，401 时清除并跳转登录）：
  - **`src/_api/`** — 主要 API 层，类风格封装，对接真实后端。
  - `src/_api2/` — `_api/` 的子集变体。
  - `src/api/` — 基于本地 mock 数据，非主要使用。
  - 详见 `src/_api/http.ts`、`src/utils/http.ts`。
- **组件库：** 共享组件在 `src/components/`，布局组件在 `src/layout/`，可发布库 `@jquank/rise-ui` 在 `src/lib/components/`（通过 `npm run build:lib` 构建）。
- **全局插件/指令：** `VueGridLayout`（拖拽网格布局）、`v-permission`（权限控制）、`v-ellipsis-tooltip`（文本溢出提示）已在 `main.ts` 中全局注册，无需手动引入。
- **TypeScript：** `strict: false`，`noUnusedLocals: true`，`noUnusedParameters: true`。类型增强见 `src/types/extension.d.ts`。

## Commands

```bash
npm run dev          # 启动开发服务器
npm run build        # vue-tsc 类型检查 + vite 构建
npm run build:lib    # 构建组件库 @jquank/rise-ui
npm run preview      # 预览构建产物
```

> **注意：** 项目未定义 `test`/`lint` 脚本。验证变更请运行 `npm run build`。

## Key Conventions

- **新增 API：** 在 `src/_api/modules/` 中创建类风格模块，在 `src/_api/index.ts` 中重新导出类型和实例。响应类型遵循 `ResponseType<T>`（`src/_api/responseType.ts`）。
- **新增路由：** 在 `src/router/modules/` 添加文件，路由元信息类型见 `src/types/extension.d.ts`。
- **样式：** Less，全局变量自动注入（`@/assets/css/global.variable.less`），主题通过 CSS 自定义属性切换（`default`/`light`/`dark`），见 `src/assets/css/`。
- **国际化：** `vue-i18n` v9（Composition API 模式），语言文件在 `src/locales/`。
- **示例页面：** 新组件或交互演示放在 `src/examples/`。
- **CSS：** 有层级关系的样式优先使用 Less 嵌套写法（父子/状态类嵌套在选择器内），减少平铺重复定义。
- **优先使用 lib 组件：** 表单和表格场景优先使用 `@jquank/rise-ui` 中的 `RForm`（配置驱动表单）和 `RTable`（含 `mergeColumnConfig`），配套 `RPagination` 分页。若现有组件无法满足需求，优先优化或扩展 lib 组件功能，而非在业务代码中另起炉灶。
- **复用与抽象：** 遇到重复出现的同种场景（如列表筛选、详情抽屉、批量操作等），应封装为可复用组件——通用性强的放入 `src/lib/components/`（组件库），业务耦合度高的放入 `src/components/`（业务组件）；若封装代价过高或场景确实特殊，可自行决定是否内联实现。
- **图标使用：** 项目使用 `SvgIcon` 组件 + iconfont 图标库，**不要**使用 Element Plus 内置图标（如 `:icon="'Delete'"` 或 `:icon="'Plus'"`）。用法：`<SvgIcon icon="font_class" />`，可用图标名见 `src/assets/icons/iconfont.json` 中每个 glyph 的 `font_class` 字段。常用：`add` / `add-circle`（新增）、`delete`（删除）、`edit`（编辑）、`filter`（筛选）、`setting`（设置）、`guanbi`（关闭）、`browse`（浏览）、`xihuan`（喜欢）。

## Proxy & Env

Vite 开发代理配置（`vite.config.ts`）：`/api`、`/board`、`/uploads` → `http://localhost:3000`，`/mock` → mock 服务。环境变量使用 Vite 标准 `.env` 规则，**禁止提交密钥或凭证**。
测试账号：admin，密码：gj1030

## Contribution Rules

- 最小化变更范围，仅修改与任务直接相关的文件。
- 修改类型/接口时同步更新 `src/types/` 或 `src/types/extension.d.ts`。
- 新增依赖前评估复用可能性，必要时在 PR 描述中说明理由。
- 不确定约定时，创建讨论性 PR 并标注疑问。
