import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入你封装的 axios 实例
import service from './utils/axios'

const app = createApp(App)

// 将 axios 挂载到全局，这样组件中可以通过 getCurrentInstance().proxy.axios 访问
app.config.globalProperties.axios = service

// 使用插件并挂载应用
app.use(ElementPlus)
    .use(router)
    .mount('#app')
