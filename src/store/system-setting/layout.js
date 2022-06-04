import {defineStore} from 'pinia'
import config from '@/config/index'

export const useLayoutStore = defineStore(
    {
        id: 'useLayoutStore',
        persist: {
            enabled: true,
            strategies: [
                {
                    key: config.dataStore.keyPre + 'useLayoutStore',
                    storage: localStorage,
                    paths: ['layout']
                }
            ]
        },
        state: () => {
            return {
                layout: {
                    leftMenuDefaultWidth: 225,
                    leftMenuIsShow: true,
                    leftMenuWidth: 225,
                },
            }
        },
        getters: {
            getLeftMenuWidth() {
                return this.layout.leftMenuWidth
            },
        },
        actions: {
            /*
            设置左侧宽度尺寸
            @width 左侧菜单宽度, 单位：数字型
             */
            setLeftMenuWidth(width) {
                this.layout.leftMenuWidth = width
            },

            /*
            收缩、展开左侧菜单
             */
            collapseExpandLeftMenu() {
                this.layout.leftMenuIsShow = !this.layout.leftMenuIsShow
                this.layout.leftMenuWidth = this.layout.leftMenuIsShow ? this.layout.leftMenuDefaultWidth : 0
            },

        }
    }
)