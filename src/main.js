import {createApp} from 'vue'
import App from './App.vue'
import router from './router/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './index.css'
import store from "./store/index";

const app = createApp(App)

// 全局注册 elementPlus 的图标, 这样就可以在后台配置动态图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(store)
app.use(router)

app.mount('#app')