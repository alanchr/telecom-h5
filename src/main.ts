import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css'
import './assets/styles/global.css'

/**
 * 应用入口
 * 创建Vue实例，挂载Pinia状态管理和路由
 */
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
