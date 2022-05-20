import {defineStore} from 'pinia'


export const useRouteStore = defineStore({
    id: 'useRouteStore',
    state: () => {
        return {
            // 全局路由对象
            route: {},
            // 全局路由列表，从后端接口转换而来
            routeList: [],
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
        获取全部路由列表，包括默认路由
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
          后端返回的菜单列表，转换成前端需要的路由列表
         */
        menuListConvertRouteList(menuList, fName = '', fPath = '', routers = []) {
            let tmpName = '', tmpPath = ''
            tmpName += fName + '_'
            tmpPath += fPath + '/'
            for (let i = 0; i < menuList.length; i++) {
                if (menuList[i].children.length > 0) {
                    this.menuListConvertRouteList(menuList[i].children, menuList[i].name, menuList[i].path, routers)
                } else {
                    const temp = {
                        name: tmpName + menuList[i].name,
                        path: tmpPath.charAt(0) !== "/" ? "/" + tmpPath + menuList[i].path : tmpPath + menuList[i].path,
                        component: this.routeViews[`../../${menuList[i].component.endsWith('.vue') ? menuList[i].component : menuList[i].component + ".vue"}`],
                        meta: {
                            icon: menuList[i].icon,
                            title: menuList[i].title,
                            id: menuList[i].id
                        },
                    }
                    if (menuList[i].children.length === 0) {
                        routers.push(temp)
                    } else {
                        return
                    }
                }
            }
            return routers
        },

        /*
        初始化路由列表
         */
        initRouteList(menuList) {
            this.routeViews = import.meta.glob("@/views/*/*.vue")
            this.routeList = this.menuListConvertRouteList(menuList)
            // 初始化默认打开的第一页面
            if (this.routeList.length > 0) {
                this.homeRouter.redirect.name = this.routeList[0].name
            }
            return this.routeList
        }
    }
})