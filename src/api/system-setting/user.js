import axios from '@/libs/api_request'

// 查询
export const list = (params) => {
  return axios.get('/users/list', params)
}

// 新增
export const create = (data) => {
  return axios.post('/users/create', data)
}

// 修改
export const edit = (data) => {
  return axios.post('/users/edit', data)
}

// 删除
export const destroy = (id) => {
  return axios.post('/users/destroy', {id: id})
}

//  ===================  ↓↓↓ 扩展接口 ↓↓↓ ==================
// 获取info
export const getUserInfo = () => {
  return axios.get('/users/info')
}

// 获取个人基本信息
export const personalInfo = () => {
  return axios.get('/users/personal_info')
}

// 编辑个人基本信息
export const personalEdit = (params) => {
  return axios.post('/users/personal_edit', params)
}

// 用户登录系统
export const login = ({ user_name, pass,captcha_id,captcha_value }) => {
  let data = {
    user_name: user_name,
    pass: pass,
    captcha_id: captcha_id,
    captcha_value: captcha_value
  }
  return axios.post('users/login', data)
}