import {defineStore} from 'pinia'
import config from '@/config/index'

export const useRouteStore = defineStore({
    id: 'useRouteStore',
    persist: {
        enabled: true,
        strategies: [
            {
                key: config.dataStore.keyPre + 'useRouteStore',
                storage: localStorage,
                paths: ['outPageRouteList']  // 设置需要持久存储的键名
            }
        ]
    },
    state: () => {
        return {
            // 全局路由对象
            route: {},
            // 全局路由列表，从后端接口转换而来
            routeList: [],
            outPageRouteList: [], // 存储需要被iframe渲染的外部网页路由列表
            routeViews: {},
            //定义首页默认打开的页面（默认就是后台返回的第一个页面）
            homeRouter: {
                path: '/',
                redirect: {name: ''}
            },
        }
    },
    // 通过函数形式定义属性
    getters: {
        /*
        获取全局路由
        */
        getRoute() {
            return this.route
        },

        /*
        获取全部路由列表，包括默认路由
        */
        getAllRouteList() {
            return this.defaultRouteList.concat(this.routeList)
        },
        /*
        获取全部路由列表
        */
        getRouteList() {
            return this.routeList
        },
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

        /*
        将需要使用iframe渲染的外部路由专门存储起来
        */
        savePageRouteList() {
            this.outPageRouteList = this.routeList.filter(item => {
                if (item.meta.isOutPage) {
                    return item
                }
            })
        },
        getOutPageRouteList() {
            return this.outPageRouteList
        },
        /*
        * description 最大支持到三级菜单即可，对于后台系统足够满足需求，性能也好，避免采用递归无穷遍历可能带来性能问题。
        * */
        menuListConvertRouteList(menuList) {
            let routes = []
            const addRouter = (itemRouter, routerName = '', routerPath = '') => {
                let tmpRouter = {
                    name: '',
                    path: '',
                    component: '',
                    meta: {
                        isOutPage: false,
                        icon: '',
                        title: '',
                        id: 0
                    }
                }
                tmpRouter.name = routerName === '' ? itemRouter.name : routerName
                tmpRouter.path = routerPath === '' ? '/' + itemRouter.name : routerPath
                tmpRouter.component = this.routeViews[`/src/${itemRouter.component.endsWith('.vue') ? itemRouter.component : itemRouter.component + ".vue"}`]
                tmpRouter.meta.icon = itemRouter.icon
                tmpRouter.meta.title = itemRouter.title
                tmpRouter.meta.id = itemRouter.id
                tmpRouter.meta.isOutPage = itemRouter.is_out_page === 1
                routes.push(tmpRouter)
            }
            if (menuList && menuList.length > 0) {
                menuList.map((item, index) => {
                    if (item.has_sub_node) {
                        item.children.map(item2 => {
                            if (item2.has_sub_node) {
                                item2.children.map(item3 => {
                                    addRouter(item3, item.name + '_' + item2.name + '_' + item3.name, '/' + item.name + '/' + item2.name + '/' + item3.name)
                                    return true
                                })
                            } else {
                                addRouter(item2, item.name + '_' + item2.name, '/' + item.name + '/' + item2.name)
                            }
                            return true
                        })
                    } else {
                        addRouter(item)
                    }
                    return true
                })
            }

            return routes
        },
        /*
        初始化路由列表
         */
        initRouteList(menuList) {
            this.routeViews = import.meta.glob("@/views/**/*.vue")
            this.routeList = this.menuListConvertRouteList(menuList)
            // 初始化默认打开的第一页面
            if (this.routeList.length > 0) {
                this.homeRouter.redirect.name = this.routeList[0].name
            }
            // 将可能的外部页面存储起来
            this.savePageRouteList()
            console.log("初始化路由的地方过滤外部页面路由",this.outPageRouteList)
            return this.routeList
        }
    }
})
