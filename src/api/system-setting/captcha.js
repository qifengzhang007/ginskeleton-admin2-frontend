import axios from '@/libs/api_request'

// 获取验证码ID和图片地址
export const get = () => {
  return axios.captchaGet('/captcha/')
}


// 获取验证码ID和图片地址
export const getImg = (img) => {
  return axios.captchaImgGet(img)
}

// 验证
export const check = (url) => {
  return axios.captchaGet(url)
}

