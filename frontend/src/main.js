// 应用入口：挂载 App、注册 Pinia/路由/全局样式（《前端目录结构说明》）
import { createApp } from 'vue'
import App from './App.vue'
import pinia from './store'
import router from './router'
import '@/styles/index.scss'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
