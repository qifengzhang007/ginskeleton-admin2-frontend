import Cookies from 'js-cookie'

/*
这里主要封装一些框架使用的基础功能函数
 */

export const TOKEN_KEY = 'GinSkeletonUserToken'

export const setToken = (token) => {
    let seconds = 3600 * 8;  // cookie 默认8小时有效期
    let expires = new Date(new Date() * 1 + seconds * 1000);
    Cookies.set(TOKEN_KEY, token, {expires: expires})
}

export const removeToken = () => {
    return Cookies.remove(TOKEN_KEY)
}

export const clearLocalStorageAll = () => {
    localStorage.clear();
}

export const getToken = () => {
    const token = Cookies.get(TOKEN_KEY)
    if (token) return token
    else return false
}

export const clearCookie = () => {
    const keys = document.cookie.match(/[^ =;]+(?==)/g);
    if (keys) {
        for (let i = keys.length; i--;) {
            document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();//清除当前域名下的,例如：m.kevis.com
            document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();//清除当前域名下的，例如 .m.kevis.com
            document.cookie = keys[i] + '=0;path=/;domain=kevis.com;expires=' + new Date(0).toUTCString();//清除一级域名下的或指定的，例如 .kevis.com
        }
    }
}

export const hasChild = (item) => {
    return item.children && item.children.length !== 0
}