import axios from '@/libs/api_request'

// 查询
export const list = (params) => {
  return axios.get('/button/list', params)
}

// 新增
export const create = (data) => {
  return axios.post('/button/create', data)
}

// 修改
export const edit = (data) => {
  return axios.post('/button/edit', data)
}

// 删除
export const destroy = (id) => {
  return axios.post('/button/destroy', {id: id})
}
