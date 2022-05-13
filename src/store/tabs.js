import {defineStore} from 'pinia'
import {useRouteStore} from "@/store/route";
//点击 菜单时 与 tabs 实现联动

export const useTabStore = defineStore({
    id: 'useTabStore',
    state: () => {
        return {
            tabs: {
                // list 数组的基本结构
                item: {
                    type: 'info',
                    label: '',   // 相当于菜单的 name 字段
                    isActive: false,
                    relaMenuId: -1,  // tab 对应的菜单 id, 该值是唯一的
                    path: ''  // tab 对应的路由路径
                },
                curPath: '',
                list: [],
            }
        }
    },
    getters: {
        getTabList(userId) {
            return this.tabs.list
        },

    },
    actions: {
        /* 点击菜单时， 添加 tab 导航按钮
        @item tab单条数据
        */
        add(menuName, menuId, menuPath, actionFrom = 'menu') {
            this.tabs.curPath = menuPath

            const tepItem = Object.assign({}, this.tabs.item)
            tepItem.label = menuName
            tepItem.isActive = true
            tepItem.relaMenuId = menuId
            tepItem.path = menuPath
            console.log("tab切换时的参数：", tepItem)
            const exists = this.tabs.list.some(item => {
                return item.relaMenuId === menuId
            })
            // 如果菜单对应的tab不存在，则添加
            if (!exists) {
                this.tabs.list.push(tepItem)
                // 如果菜单对应的tab存在，则激活
            }
            this.activeTab(menuId)
            this.syncChangeRouter(menuPath, actionFrom)
        },

        /* 删除 tab 导航按钮
        @item tab单条数据
        @curTabIsActive 被删除的tab是否处于激活状态
        */
        remove(relaMenuId, curTabIsActive) {
            let tabIndex = this.indexOf(relaMenuId)
            let nextTabName = ''
            let nextTabIndex = -1
            this.tabs.list.splice(tabIndex, 1)
            if (!curTabIsActive) {
                return
            }
            if (this.tabs.list.length > 0 && this.tabs.list.length === tabIndex) {
                nextTabIndex = tabIndex - 1
                this.tabs.list[nextTabIndex].isActive = true
            } else if (this.tabs.list.length > 1) {
                nextTabIndex = tabIndex
                this.tabs.list[nextTabIndex].isActive = true
            } else if (this.tabs.list.length === 1) {
                nextTabIndex = 0
                this.tabs.list[nextTabIndex].isActive = true
            }
            if (this.tabs.list.length > 0) {
                this.tabs.curPath = this.tabs.list[nextTabIndex].path
                this.syncChangeRouter(this.tabs.curPath, 'tab')
            }

        },

        /* 寻找数组中的某个元素的索引
        @item tab单条数据
        */
        indexOf(relaMenuId) {
            for (let i = 0; i < this.tabs.list.length; i++) {
                if (this.tabs.list[i].relaMenuId === relaMenuId) return i;
            }
            return -1;
        },

        /* 激活选中的tab页签，同时设置其他tab页签为未激活
        @item tab单条数据
        */
        activeTab(menuId) {
            const needActiveTabIndex = this.indexOf(menuId)
            this.tabs.list.forEach((item, index) => this.tabs.list[index].isActive = index === needActiveTabIndex)
        },

        /*
       点击  tab 页签时与路由联动
         */
        syncChangeRouter(path, actionFrom) {
            const routerStore = useRouteStore()
            if (actionFrom !== 'menu' && path !== routerStore.getRoute.currentRoute.path) {
                routerStore.getRoute.push(path)
            }
        },

        /*
        tab切换时设置当前的路由path
        @path  路由路径
         */
        setCurrentRoutePath(path) {
            this.tabs.curPath = path
        }
    }


})