import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/lib/theme-chalk/index.css'
const app = createApp(App)
app.use(ElementPlus, { locale })
app.mount('#app')