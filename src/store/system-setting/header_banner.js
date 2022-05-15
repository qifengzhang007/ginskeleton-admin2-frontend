import {defineStore} from 'pinia'

export const useHeaderBannerStore = defineStore(
    {
        id: 'useHeaderBannerStore',
        state: () => {
            return {
                headerBanner: {
                    navPathName: '',
                },
            }
        },
        getters: {
            getNavPathName() {
                return this.headerBanner.navPathName
            },
        },
        actions: {
            /*
            *菜单点击时设置
            */
            setHeaderBannerNav(navPathName) {
                this.headerBanner.navPathName = navPathName
            },

        }
    }
)