import axios from '@/libs/api_request'

export const list = (params) => {
  return axios.get('/province_city/list',params)
}

export const create = (data) => {
  return axios.post('/province_city/create',data)
}

export const edit = (data) => {
  return axios.post('/province_city/edit',data)
}

export const destroy = (id) => {
  return axios.post('/province_city/destroy',{id: parseInt(id)})
}

// 左侧数据获取接口(传递fid查询子级数据)
export const getSubListByFid = (fid) => {
  return axios.get('/province_city/get_sublist',{fid:fid})
}
