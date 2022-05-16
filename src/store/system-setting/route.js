import {defineStore} from 'pinia'


export const useRouteStore = defineStore({
    id: 'useRouteStore',
    state: () => {
        return {
            // 全局路由对象
            route: {},
            // 全局路由列表，从后端接口转换而来
            routeList: [],
            // 前端所必须的几个默认路由
            defaultRouteList: [
                {
                    path: '/login',
                    name: 'login',
                    components: {
                        login: () => import(/* webpackChunkName: "login" */   '@/views/system-setting/login.vue'),
                    },
                    meta: {
                        icon: "menu",
                        id: -1,
                        title: "登录入口"
                    }
                },
                {
                    path: '/:pathMatch(.*)*',
                    name: 'blank_page',
                    component: () => import(/* webpackChunkName: "blank_page" */  '@/views/system-setting/blank_page.vue'),
                    meta: {
                        icon: "",
                        id: -2,
                        title: ''
                    }
                }
            ]
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