import {createRouter, createWebHashHistory,createWebHistory} from 'vue-router'

const router = createRouter({
   // history: createWebHashHistory(),
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            components: {
                login: () => import(/* webpackChunkName: "login" */   '@/views/system-setting/login.vue'),
            },
            meta: {
                icon: "",
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
})
export default router


