import axios from '@/libs/api_request'

// 获取验证码ID和图片地址
export const getCaptchaInfo = () => {
    return axios.captchaGet('/captcha/')
}

export const getCaptchaServerPre = () => {
    return axios.captchaGet('/captcha/')
}

//根据 获取验证码ID获取图片地址
export const getCaptchaImg = (img) => {
    return axios.captchaImgGet(img)
}

// 校验验证码
export const checkCaptcha = (url) => {
    return axios.captchaGet(url)
}

