import {defineStore} from 'pinia'
import commonFunc from '@/libs/common_func'
import {clearCookie, clearLocalStorageAll, removeToken} from '@/libs/util'
import {useTabStore} from '@/store/system-setting/tabs'
import config from '@/config/index'

export const useUserStore = defineStore(
    {
        id: 'useUserStore',
        persist: {
            enabled: true,
            strategies: [
                {
                    key: config.dataStore.keyPre + 'useUserStore',
                    storage: localStorage,
                    paths: ['user']
                }
            ]
        },
        state: () => {
            return {
                user: {
                    info: {
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
        getters: {
            getUserInfo() {
                return this.user.info
            },
        },
        actions: {
            /*
            登陆成功初始化一下用户最基本信息
             */
            setUserBaseInfo(userId, token) {
                this.user.info.id = userId
                this.user.token.val = token
                this.user.token.isValid = true
            },

            /**
             * 设置用户的完整信息
             * @param userInfo
             */
            setUserInfo(userInfo) {
                this.user.info.id = userInfo.id
                this.user.info.user_name = userInfo.user_name
                this.user.info.real_name = userInfo.real_name
                this.user.info.avatar = userInfo.avatar
                this.user.info.phone = userInfo.phone
                this.user.info.login_times = userInfo.login_times
                this.user.token.isValid = true
                this.user.token.val = userInfo.token
            },

            /*
            退出登陆时需要销毁的对象，可以全部集群在这里调用去销毁
             */
            destroyUserInfo() {
                clearCookie()
                removeToken()
                clearLocalStorageAll()
                commonFunc.objInit(this.user)
                useTabStore().destroy()
            }
        }
    }
)