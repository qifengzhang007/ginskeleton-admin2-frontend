import axios from 'axios'
import {clearLocalStorageAll, getToken, removeToken} from '@/libs/util'
import config from '@/config/index'
import router from '@/router/index'
import commonFunc from "./common_func";

class HttpRequest {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl
    }

    getInsideConfig() {
        return {
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        }
    }

    /*
      请求拦截器
     @instance axios 对象实例
     @url 请求的url
     */
    interceptors(instance, url) {
        instance.interceptors.request.use(config => {
            // 接口请求增加token
            config.headers.Authorization = 'Bearer ' + getToken()
            return config
        }, error => {
            return Promise.reject(error)
        })

        /*
          响应拦截器
         */
        instance.interceptors.response.use(res => {
            const {data, status} = res
            return {data, status}
        }, error => {
            switch (error.response.status) {
                case 0:
                    ElNotification({
                        title: '网络通讯错误',
                        message: config.errorSetting.serverNotStartTips,
                        type: 'error',
                    })
                    break
                case 401:
                    removeToken()
                    clearLocalStorageAll()
                    ElNotification({
                        title: '页面授权过期',
                        message: config.errorSetting.tokenExpiredTips,
                        type: 'error',
                    })
                    setTimeout(() => {
                        router.push({name:config.defaultRoute.notLoginDefaultRouterName})
                    }, 1000);
                    break
                case 405:
                    commonFunc.Curd.FailTips(config.errorSetting.noAuthTips)
                    break
            }
            return Promise.reject(error)
        })
    }

    /*
    封装axios的post请求
    @options axios接受的配置参数
    */
    request(options) {
        const instance = axios.create()
        options = Object.assign(this.getInsideConfig(), options)
        this.interceptors(instance, options.url)
        return instance(options)
    }
}

export default HttpRequest
