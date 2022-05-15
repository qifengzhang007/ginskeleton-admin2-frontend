import {defineStore} from 'pinia'
import {menuList} from '@/api/system-setting/menu'


export const useMenuStore = defineStore({
    id: 'useMenuStore',
    state: () => {
        return {
            menu: {
                // 当前菜单,该值为默认值
                currentMenu: {
                    id: '',  // 最新打开的菜单id
                    defaultPath: '/',  // 默认打开的路由
                },
                list: [],
                menuNavPathList: new Map(),
                menuNavPathListArray: [],
                tmpPath: ''
            }
        }
    },
    // 通过函数形式定义属性
    getters: {},
    // 定义函数
    actions: {
        /*
        根据userId 查询属于该用户的菜单
        @userId 用户id
        */
        getMenuList(userId) {
            return this.menu.list.length > 0 ? this.menu.list : this.menu.list = menuList(userId)
        },

        /*
             独立初始化 menuNavPathListArray
         */
        setMenuNavPathListArrayEmpty() {
            this.tmpPath = ''
            this.menu.menuNavPathListArray = []
        },
        /*
        递归获取菜单导航路径链条
        @menuId 菜单id
        */
        getMenuNavPathListRecursive(id, menuList = this.menu.list) {
            for (let item of menuList) {
                if (item.id === id) {
                    this.tmpPath = item.path;
                    this.menu.menuNavPathListArray.push(Object.assign({}, item))
                    return
                } else {
                    this.tmpPath = ''
                }

                if (item.children.length > 0) {
                    this.getMenuNavPathListRecursive(id, item.children)
                    if (this.tmpPath !== '') {
                        this.menu.menuNavPathListArray.push(Object.assign({}, item))
                    }
                }
            }
            return this.menu.menuNavPathListArray
        },

        /*
        设置菜单导航路径
        @menuId 菜单id
        @menuNavPathName 菜单导航路径名称
         */
        setMenuNavPathList(menuId) {
            this.menu.currentMenu.id = menuId
            if (this.menu.menuNavPathList.get(menuId)) {
                return
            }
            this.setMenuNavPathListArrayEmpty()
            this.menu.menuNavPathList.set(menuId, this.getMenuNavPathListRecursive(menuId).reverse())
        },

        /*
        设置菜单导航路径
        @menuId 菜单id
        @menuNavPathName 菜单导航路径名称
        */
        getMenuNavPathList(menuId) {
            this.setMenuNavPathList(menuId)
            return this.menu.menuNavPathList.get(menuId)
        },
    }
})