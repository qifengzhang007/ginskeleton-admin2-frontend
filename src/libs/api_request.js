import HttpRequest from '@/libs/axios'
import commonFunc from '@/libs/common_func'
import Qs from 'qs'
import config from '@/config/index'

const httpClient = new HttpRequest(commonFunc.getApiUrlPre())
const captchaClient = new HttpRequest(commonFunc.getServerIp())

export default {
    name: "axios",

    /*
    *get方式提交数据
    * @request_uri 请求的短地址
    * @form_data 参数
    */
    get(request_uri, params) {
        return httpClient.request({
            url: request_uri,
            method: 'get',
            params: params,
            timeout: config.requestTimeout || 5000
        })
    },

    /*
    * post form 表单方式提交数据
    * @request_uri 请求的短地址
    * @form_data 参数
    */
    post(request_uri, form_data) {
        return httpClient.request({
            url: request_uri,
            method: 'post',
            data: Qs.stringify(form_data),
            timeout: config.requestTimeout || 5000
        })
    },

    /*
    * 提交原生 json 格式数据，以 post 方式提交数据（服务端需要允许post方式提交的raw json )
    * @request_uri 请求的短地址
    * @json 参数
    */
    post_raw(request_uri, json) {
        return httpClient.request({
            //baseURL: '',   //  将前缀设置为空，request_uri 参数可以指定任何站点的完整地址
            url: request_uri,
            method: 'post',
            data: json,
            headers: {
                "Content-Type": "application/json"
            },
            timeout: config.requestTimeout || 5000
        })
    },

    //验证码
    captchaGet(request_uri, params) {
        return captchaClient.request({
            url: request_uri,
            method: 'get',
            params: params
        })
    },

    captchaImgGet(request_uri, params) {
        return captchaClient.request({
            url: request_uri,
            method: 'get',
            params: params,
            responseType: 'arraybuffer'
        })
    },
    // 更多请求方式请自行封装即可

}
