import Cookies from 'js-cookie'
import config from '@/config/index'

/*
这里主要封装一些框架使用的基础功能函数
 */


/*
设置 token
 */
export const setToken = (token) => {
    localStorage.setItem(config.dataStore.keyPre + config.dataStore.userTokenKey, token)
}

/*
获取 token
 */
export const getToken = () => {
    const token = localStorage.getItem(config.dataStore.keyPre + config.dataStore.userTokenKey);
    if (token) return token
    else return false
}


/*
删除 token
 */
export const removeToken = () => {
    return Cookies.remove(config.dataStore.keyPre + config.dataStore.userTokenKey)
}

/*
清除所有 localStorage
 */
export const clearLocalStorageAll = () => {
    window.localStorage.clear()
}

/*
清除所有cookies
 */
export const clearCookie = () => {
    const keys = document.cookie.match(/[^ =;]+(?==)/g);
    if (keys) {
        for (let i = keys.length; i--;) {
            document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();
            document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();
        }
    }
}
