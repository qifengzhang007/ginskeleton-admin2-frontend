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
                id: 1,
                title: "首页"
            }
        },
        {
            path: '/login',
            name: 'login',
            components: {
                //  default: ()=>import(/* webpackChunkName: "default" */   '@/views/system-setting/login.vue'),
                login: () => import(/* webpackChunkName: "login" */   '@/views/system-setting/login.vue'),
            },
            meta: {
                icon: "grid",
                id: 2,
                title: "登录"
            }
        },
        {
            path: '/layout',
            name: 'layout',
            component: () => import(/* webpackChunkName: "login" */   '@/views/layout/main.vue'),
            meta: {
                icon: "grid",
                id: 3,
                title: "布局"
            }
        },
        {
            path: '/system-setting/system_menu',
            name: 'sys_menu',
            component: () => import(/* webpackChunkName: "sys_menu" */  '@/views/system-setting/sys_menu.vue'),
            meta: {
                icon: "grid",
                id: 4,
                title: "系统菜单"
            }
        },
        // {
        //     path: '/system-setting/organization',
        //     name: 'organization',
        //     component: () => import(/* webpackChunkName: "organization" */  '@/views/system-setting/organization.vue'),
        //     meta: {
        //         icon: "grid",
        //         id: 5,
        //         title: "组织机构"
        //     }
        // },
        {
            path: '/system-setting/organization',
            name: 'organization',
            component: () => import(/* webpackChunkName: "organization" */  '@/views/system-setting/organization.vue'),
            meta: {
                icon: "grid",
                id: 6,
                title: "组织机构"
            }
        },
        {
            path: '/system-setting/post_members',
            name: 'post_members',
            component: () => import(/* webpackChunkName: "post_members" */  '@/views/system-setting/post_members.vue'),
            meta: {
                icon: "grid",
                id: 7,
                title: '岗位成员'
            }
        },
        {
            path: '/system-setting/user',
            name: 'user',
            component: () => import(/* webpackChunkName: "users" */  '@/views/system-setting/user.vue'),
            meta: {
                icon: "grid",
                id: 8,
                title: '用户'
            }
        },
        {
            path: '/system-setting/button_cn_en',
            name: 'button',
            component: () => import(/* webpackChunkName: "button" */  '@/views/system-setting/button.vue'),
            meta: {
                icon: "grid",
                id: 9,
                title: '按钮'
            }
        },
        {
            path: '/system-setting/org_post_auth_assignment',
            name: 'auth_dispath',
            component: () => import(/* webpackChunkName: "auth_dispath" */  '@/views/system-setting/auth_dispath.vue'),
            meta: {
                icon: "grid",
                id: 10,
                title: '权限分配'
            }
        },
        {
            path: '/system-setting/org_post_auth_analysis',
            name: 'auth_analysis',
            component: () => import(/* webpackChunkName: "auth_analysis" */  '@/views/system-setting/auth_analysis.vue'),
            meta: {
                icon: "grid",
                id: 11,
                title: '权限分析'
            }
        },

        {
            path: '/data_dictionary/province_city',
            name: 'province_city',
            component: () => import(/* webpackChunkName: "province_city" */  '@/views/dictionary/province_city.vue'),
            meta: {
                icon: "grid",
                id: 12,
                title: '省市区'
            }
        }

    ]
})
export default router

