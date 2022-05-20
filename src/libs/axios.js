import axios from 'axios'
import {clearLocalStorageAll, getToken, removeToken} from '@/libs/util'
import config from '@/config/index'
import {ElMessage} from 'element-plus'

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
     description 请求拦截器
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
         description 响应拦截器
         */
        instance.interceptors.response.use(res => {
            const {data, status} = res
            return {data, status}
        }, error => {
            // console.log("响应错误原始信息：：", error)
            switch (error.response.status) {
                case 0:
                    removeToken()
                    clearLocalStorageAll()
                    ElMessage(config.errorSetting.serverNotStartTips)
                    alert("错误：" + config.errorSetting.serverNotStartTips + window.location.href)
                    if (!window.location.href.endsWith("login")) {
                        window.location.href = '/' + config.defaultRoute.notLoginDefaultRouterName
                    }
                    break
                case 401:
                    removeToken()
                    clearLocalStorageAll()
                    setTimeout(() => {
                        window.location.href = '/' + config.defaultRoute.notLoginDefaultRouterName
                    }, 1000);
                    break
                case 405:
                    ElMessage.error(config.errorSetting.noAuthTips)
                    break
            }
            return Promise.reject(error)
        })
    }

    /*
    description 封装axios的post请求
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
