import {defineStore} from 'pinia'
import common_func from '@/libs/common_func'

export const useUserStore = defineStore(
    {
        id: 'useUserStore',
        state: () => {
            return {
                user: {
                    Info: {
                        user_name: '张三丰',
                        id: 1,
                        sex: 1,
                        age: 18,
                    },
                    token: {
                        isValid: true,
                        val: "",
                    }
                },
            }
        },
        getters: {
            getUserInfo() {
                return this.user.Info
            },
        },
        actions: {
            setUserToken(token) {
                this.user.token.isValid = true
                this.user.token.val = token
            },
            destroyUserInfo() {
                console.log('destroyUserInfo---11111', this.user)
                this.user = common_func.objInit(this.user)
                console.log('destroyUserInfo---22222', this.user)
            }
        }
    }
)