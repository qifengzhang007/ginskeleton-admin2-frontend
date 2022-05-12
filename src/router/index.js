import {createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: {name: 'home'}
        },
        {
            path: '/home',
            name: 'home',
            component: () => import(/* webpackChunkName: "home" */  '@/views/system-setting/home.vue'),
            meta: {
                icon: "grid",
                id: 1
            }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "login" */   '@/views/system-setting/login.vue'),
            meta: {
                icon: "grid",
                id: 2
            }
        },
        {
            path: '/layout',
            name: 'layout',
            component: () => import(/* webpackChunkName: "login" */   '@/views/layout/main.vue'),
            meta: {
                icon: "grid",
                id: 3
            }
        },
        {
            path: '/system-setting/system_menu',
            name: 'sys_menu',
            component: () => import(/* webpackChunkName: "sys_menu" */  '@/views/system-setting/sys_menu.vue'),
            meta: {
                icon: "grid",
                id: 4
            }
        },
        {
            path: '/system-setting/organization',
            name: 'organization',
            component: () => import(/* webpackChunkName: "organization" */  '@/views/system-setting/organization.vue'),
            meta: {
                icon: "grid",
                id: 5
            }
        },
        {
            path: '/system-setting/organization',
            name: 'organization',
            component: () => import(/* webpackChunkName: "organization" */  '@/views/system-setting/organization.vue'),
            meta: {
                icon: "grid",
                id: 6
            }
        },
        {
            path: '/system-setting/post_members',
            name: 'post_members',
            component: () => import(/* webpackChunkName: "post_members" */  '@/views/system-setting/post_members.vue'),
            meta: {
                icon: "grid",
                id: 7
            }
        },
        {
            path: '/system-setting/user',
            name: 'user',
            component: () => import(/* webpackChunkName: "users" */  '@/views/system-setting/user.vue'),
            meta: {
                icon: "grid",
                id: 8
            }
        },
        {
            path: '/system-setting/button_cn_en',
            name: 'button',
            component: () => import(/* webpackChunkName: "button" */  '@/views/system-setting/button.vue'),
            meta: {
                icon: "grid",
                id: 9
            }
        },
        {
            path: '/system-setting/org_post_auth_assignment',
            name: 'auth_dispath',
            component: () => import(/* webpackChunkName: "auth_dispath" */  '@/views/system-setting/auth_dispath.vue'),
            meta: {
                icon: "grid",
                id: 10
            }
        },
        {
            path: '/system-setting/org_post_auth_analysis',
            name: 'auth_analysis',
            component: () => import(/* webpackChunkName: "auth_analysis" */  '@/views/system-setting/auth_analysis.vue'),
            meta: {
                icon: "grid",
                id: 11
            }
        },

        {
            path: '/data_dictionary/province_city',
            name: 'province_city',
            component: () => import(/* webpackChunkName: "province_city" */  '@/views/dictionary/province_city.vue'),
            meta: {
                icon: "grid",
                id: 12
            }
        }

    ]
})
export default router


