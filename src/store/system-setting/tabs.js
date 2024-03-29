import {defineStore} from 'pinia'
import {useRouteStore} from "@/store/system-setting/route";
import {useMenuStore} from "@/store/system-setting/menu";
import commonFunc from '@/libs/common_func'

//点击 菜单时 与 tabs 实现联动

export const useTabStore = defineStore({
    id: 'useTabStore',
    state: () => {
        return {
            tabs: {
                // list 数组的空白数据结构
                item: {
                    name: '',   // 菜单的 name 字段
                    isActive: false,
                    relaMenuId: -1,  // tab 对应的菜单 id, 该值是唯一的
                    icon: '',
                    path: '',  // tab 对应的路由路径
                    viewComponentPath:'',
                    isOutPage:0
                },
                curMenuItem: {
                    name: '',
                    isActive: true,
                    relaMenuId: 0,
                    icon: '',
                    path: '',
                    viewComponentPath: '',
                    isOutPage:0
                },
                curPath: '',
                list: [],
            }
        }
    },
    getters: {
        /*
        * 获取所有的tabList
        * */
        getTabList(userId) {
            return this.tabs.list
        },

    },
    actions: {
        /* 点击菜单时， 添加 tab 导航按钮
        @menuName 菜单名称
        @menuId 菜单id
        @menuIcon 菜单图标英文单词
        @menuPath 菜单对应的路由路径
        @viewRoute路径信息
        @actionFrom 调用tab-add方法事件来源
        */
        add(menuName, menuId, menuIcon, menuPath,viewComponentPath,isOutPage, actionFrom = 'menu') {
            if (this.tabs.curMenuItem.path === menuPath || menuName === '') return

            // tepItem 变量用于后面的数组方法：push，不能直接使用this.tabs.curMenuItem ，否则永远只会添加成功最一条
            const tepItem = Object.assign({}, this.tabs.item)
            tepItem.name = menuName
            tepItem.isActive = true
            tepItem.relaMenuId = menuId
            tepItem.icon = menuIcon
            tepItem.path = menuPath
            // 以下两个参数主要标记被加载的页面是否为外部页面，决定个后续渲染组件究竟时使用 view-router 或者 iframe
            tepItem.viewComponentPath = viewComponentPath
            tepItem.isOutPage = isOutPage

            this.tabs.curMenuItem = Object.assign({}, tepItem)

            const exists = this.tabs.list.some(item => {
                return item.relaMenuId === menuId
            })
            // 如果菜单对应的tab不存在，则添加
            if (!exists) {
                this.tabs.list.push(tepItem)
                // 如果菜单对应的tab存在，则激活
            }

            this.syncChangeRouter(menuPath, actionFrom)
            this.activeTab(menuId)

            const menuStore = useMenuStore()
            menuStore.setMenuNavPathList(menuId)
            menuStore.menu.defaultActive = menuPath
        },

        /* 删除 tab 导航按钮
        @item tab单条数据
        @curTabIsActive 被删除的tab是否处于激活状态
        */
        remove(relaMenuId, curTabIsActive) {
            let tabIndex = this.indexOf(relaMenuId)
            let nextTabName = ''
            let nextTabIndex = -1  // 下一个需要激活的 tab 页签的索引
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
            }
            if (this.tabs.list.length > 0) {
                this.tabs.curMenuItem.relaMenuId = this.tabs.list[nextTabIndex].relaMenuId
                this.tabs.curMenuItem.path = this.tabs.list[nextTabIndex].path
                this.tabs.curMenuItem.viewComponentPath = this.tabs.list[nextTabIndex].viewComponentPath
                this.tabs.curMenuItem.isOutPage = this.tabs.list[nextTabIndex].isOutPage
                this.syncChangeRouter(this.tabs.curMenuItem.path, 'tab')
            } else {
                //关闭最后一个tab页签，直接调用全部关闭方法即可
                this.closeAllTabs()
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
           关闭非选中的其它tab页签
         */
        closeOtherTabs() {
            if (this.tabs.list.length === 0) return
            this.tabs.list[0] = this.tabs.curMenuItem
            this.tabs.list.splice(1, this.tabs.list.length - 1)
        },
        /*
            关闭所有tab页签
        */
        closeAllTabs() {
            this.tabs.list = []
            useMenuStore().menu.defaultActive = ''
            commonFunc.objInit(this.tabs.curMenuItem)
            this.syncChangeRouter('/blank_page', 'tab')
        },

        /*
       退出时， 销毁本对象
         */
        destroy() {
            commonFunc.objInit(this.tabs)
        },

        /*
        * 获取当前路由path
        * */
        getCurMenuItem() {
            return this.tabs.curMenuItem
        },

    }


})
