import {defineStore} from 'pinia'
import {getUserInfo} from '@/api/system-setting/user'
import {useUserStore} from "@/store/system-setting/user";
import {useMenuStore} from "@/store/system-setting/menu";
import {getToken} from '@/libs/util'
import {useRouteStore} from "@/store/system-setting/route";
import router from '@/router/index'

/*
在需要的页面，重载路由列表和菜单列表
 */

export const useReloadStore = defineStore(
    {
        id: 'useReloadStore',
        state: () => {
            return {
                user: {
                    Info: {
                        id: 0,
                        user_name: '',
                        real_name: '',
                        avatar: '',
                        login_times: 0,
                        phone: '',
                    },
                    token: {
                        isValid: false,
                        val: "",
                    }
                },
            }
        },
        getters: {},
        actions: {
            /*
            description: 当页面刷新时，重载路由和菜单信息
            @userId 用户id
             */
            reloadRouterMenu(userId) {
                return new Promise((resolver, reject) => {
                    const userStore = useUserStore();
                    const routerStore = useRouteStore();
                    const menuStore = useMenuStore();
                    getUserInfo(userId).then(res => {
                        if (res && res.data.code === 200) {
                            // // 1.初始化用户信息
                            userStore.setUserInfo(Object.assign({token: getToken()}, res.data.data))
                            //2.后端menu转为前端需要的路由列表
                            const routeList = routerStore.initRouteList(res.data.data.menus)
                            //3.初始化菜单列表
                            menuStore.initMenuList(res.data.data.menus)
                           router.addRoute(routerStore.homeRouter)
                            routeList.map(item => {
                                router.addRoute(item)
                                return true
                            })
                            return resolver(true)
                        }
                    }).catch(err => {
                        return reject(err)
                    })
                })
            },
        }
    }
)