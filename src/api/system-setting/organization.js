import axios from '@/libs/api_request'

export const list = (params) => {
    return axios.get('/organization/list', params)
}

export const create = (data) => {
    return axios.post('/organization/create', data)
}

export const edit = (data) => {
    return axios.post('/organization/edit', data)
}

export const destroy = (id) => {
    return axios.post('/organization/destroy', {id: parseInt(id)})
}

// 左侧数据获取接口
export const getSubListByFid = (id) => {
    return axios.get('/organization/get_by_fid', {fid: id})
}
