import Cookies from 'js-cookie'
import config from '@/config/index'

/*
这里主要封装一些框架使用的基础功能函数
 */


/*
设置 token
 */
export const setToken = (token) => {
    let seconds = 3600 * (config.dataStore.tokenStoreToCookieExpiration);  // cookie 默认8小时有效期
    let exp = new Date(new Date() * 1 + seconds * 1000);
    Cookies.set(config.dataStore.keyPre + config.dataStore.userTokenKey, token, {expires: exp})
}

/*
获取 token
 */
export const getToken = () => {
    const token = Cookies.get(config.dataStore.keyPre + config.dataStore.userTokenKey)
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
            document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();//清除当前域名下的,例如：m.kevis.com
            document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();//清除当前域名下的，例如 .m.kevis.com
            document.cookie = keys[i] + '=0;path=/;domain=kevis.com;expires=' + new Date(0).toUTCString();//清除一级域名下的或指定的，例如 .kevis.com
        }
    }
}


/*
获取环境名称：dev=开发环境；pro=生产环境
 */
export const getEnvName = () => {
    return process.env.NODE_ENV === 'development' ? 'dev' : 'pro'
}

/*
获取服务器ip，自动适配环境
 */
export const getServerIp = () => {
    return getEnvName() === 'dev' ? config.baseUrl.dev_server_ip : config.baseUrl.pro_server_ip
}

/*
获取 api 接口前缀
 */
export const getApiUrlPre = () => {
    return getEnvName() === 'dev' ? config.baseUrl.dev_api_pre : config.baseUrl.pro_api_pre
}

