import {createPinia} from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

// 使用 pinia 对全局变量进行状态管理，代替 vuex
const store = createPinia()
store.use(piniaPluginPersist)

export default store