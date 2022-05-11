import {defineStore} from 'pinia'

export const useMenuStore = defineStore({
    id: 'useMenuStore', state: () => {
        return {
            menu: {
                collapseStatus: false,
                currentMenu: {
                    index: 0,
                    name: 'home',
                    path: '/',
                    navPathName:'',
                },
                list: [],
            }
        }
    },
    getters: {
        getMenuList(userId) {
            //根据userId 查询属于该用户的菜单
            return this.menu.list
        },
    },
    actions: {
        setCurrentSelectedMenuStatus(objParam) {
            this.menu.currentMenu.index = objParam.id
            this.menu.currentMenu.name = objParam.name
        }
    }
})