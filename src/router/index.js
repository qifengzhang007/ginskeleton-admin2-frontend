import {createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */  '@/views/system-setting/home.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */   '@/views/system-setting/login.vue')
    },
    {
      path: '/layout',
      name: 'layout',
      component: () => import(/* webpackChunkName: "login" */   '@/views/layout/main.vue')
    },
    {
      path: '/system-setting/sys_menu',
      name: 'sys_menu',
      component: () => import(/* webpackChunkName: "sys_menu" */  '@/views/system-setting/sys_menu.vue')
    },
    {
      path: '/system-setting/organization',
      name: 'organization',
      component: () => import(/* webpackChunkName: "organization" */  '@/views/system-setting/organization.vue')
    },
    {
      path: '/system-setting/organization',
      name: 'organization',
      component: () => import(/* webpackChunkName: "organization" */  '@/views/system-setting/organization.vue')
    },
    {
      path: '/system-setting/post_members',
      name: 'post_members',
      component: () => import(/* webpackChunkName: "post_members" */  '@/views/system-setting/post_members.vue')
    },
    {
      path: '/system-setting/user',
      name: 'user',
      component: () => import(/* webpackChunkName: "users" */  '@/views/system-setting/user.vue')
    },
    {
      path: '/system-setting/button',
      name: 'button',
      component: () => import(/* webpackChunkName: "button" */  '@/views/system-setting/button.vue')
    },
    {
      path: '/system-setting/auth_dispath',
      name: 'auth_dispath',
      component: () => import(/* webpackChunkName: "auth_dispath" */  '@/views/system-setting/auth_dispath.vue')
    },
    {
      path: '/system-setting/auth_analysis',
      name: 'auth_analysis',
      component: () => import(/* webpackChunkName: "auth_analysis" */  '@/views/system-setting/auth_analysis.vue')
    },

    {
      path: '/dictionary/province_city',
      name: 'province_city',
      component: () => import(/* webpackChunkName: "province_city" */  '@/views/dictionary/province_city.vue')
    }

  ]
})
export default router


