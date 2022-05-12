import {defineStore} from 'pinia'
import {menuList} from '@/api/system-setting/menu'


export const useMenuStore = defineStore({
    id: 'useMenuStore', state: () => {
        return {
            menu: {
                collapseStatus: 2014,
                currentMenu: {
                    name: 'home',
                    path: '/',
                    navPathName: '',
                    icon: 'grid',
                },
                list: []
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
            this.menu.list = menuList(userId)
            return this.menu.list
        },

        setCurrentSelectedMenuStatus(objParam) {
            this.menu.currentMenu.index = objParam.id
            this.menu.currentMenu.name = objParam.name
        }
    }
})