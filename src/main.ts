import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'
import SvgIcon from './components/SvgIcon.vue'
import VueGridLayout from 'vue-grid-layout'
import i18n from './locales'

import 'element-plus/theme-chalk/dark/css-vars.css'
// import './assets/icons/iconfont.js'
import '//at.alicdn.com/t/c/font_4380660_r3zwauwij5l.js'
import './assets/css/index.less'

const pinia = createPinia()
const app = createApp(App)
app.component('SvgIcon', SvgIcon)
app.use(router).use(pinia).use(VueGridLayout).use(i18n)
app.mount('#app')
