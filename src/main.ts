import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'
import SvgIcon from './components/SvgIcon.vue'
import VueGridLayout from 'vue-grid-layout'
import i18n from './locales'
import { permission } from '@/directive/permission'
import { ellipsisTooltip } from '@/directive/ellipsis-tooltip'
import 'element-plus/dist/index.css'
// element-plus 主题色css变量
import 'element-plus/theme-chalk/dark/css-vars.css'

// 全局ElMessage, ElNotification 样式
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/notification/style/css'

// iconfont
import './assets/icons/iconfont.js'
// import '//at.alicdn.com/t/c/font_4380660_y9o1riysz9a.js'

// css
import './assets/css/index.less'

import '@jquank/rise-ui/style.css'

const pinia = createPinia()
const app = createApp(App)
app.component('SvgIcon', SvgIcon)
app.directive('permission', permission)
app.directive('ellipsis-tooltip', ellipsisTooltip)
app.use(router).use(pinia).use(VueGridLayout).use(i18n)
app.mount('#app')
app.provide('app', app)
