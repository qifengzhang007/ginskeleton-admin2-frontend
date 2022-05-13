import {defineStore} from 'pinia'


export const useRouteStore = defineStore({
    id: 'useRouteStore', state: () => {
        return {
            route: {}
        }
    },
    // 通过函数形式定义属性
    getters: {
        /*
        获取全局路由
        */
        getRoute() {
            return this.route
        }
    },
    // 定义函数
    actions: {
        /*
       在项目初始化时，使用全局变量接受vue router
        @route vue router对象
        */
        setRoute(route) {
            this.route = route
        },

    }
})