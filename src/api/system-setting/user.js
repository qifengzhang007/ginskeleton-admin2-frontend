import axios from '@/libs/api_request'

export const login = ({ user_name, pass,captcha_id,captcha_value }) => {
  let data = {
    user_name: user_name,
    pass: pass,
    captcha_id: captcha_id,
    captcha_value: captcha_value
  }
  return axios.post('users/login', data)
}

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
export const destory = (id) => {
  return axios.post('/users/destroy', {id: id})
}

// 获取info
export const getUserInfo = () => {
  return axios.get('/users/info')
}

// 权限分析界面，带岗位用户列表查询
export const user_list_with_post = (params) => {
  return axios.get('/auth_analysis/user_list_with_post', params)
}

// 权限分析界面，根据用户id查询已拥有的所有权限
export const has_auth_list = (id) => {
  return axios.get('/auth_analysis/has_auth_list', {id:id})
}

// 查询打开的菜单对应的页面具有的按钮列表
export const view_button_list = (params) => {
 return axios.get('/users/has_view_button_list', params)
}

// 根据接口查询拥有的按钮元素权限与页面定义的按钮对比，最终显示拥有权限的按钮元素
export const show_button=(hasButtonList,curButtonList)=>{
  for (var key in curButtonList) {
    curButtonList[key] = hasButtonList.some((value, index) => {
      return value.en_name === curButtonList[key];
    })
  }
}
// 获取个人基本信息
export const personal_info = (params) => {
  return axios.get('/users/personal_info', params)
}

// 编辑个人基本信息
export const personal_edit = (params) => {
  return axios.post('/users/personal_edit', params)
}
