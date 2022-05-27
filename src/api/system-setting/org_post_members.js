import axios from '@/libs/api_request'

// 根据组织机构、岗位 ID，查询成员列表
export const getMembersByOrgPostId = (params) => {
    return axios.get('/post_members/list',params)
}

//新增
export const create = (data) => {
    return axios.post('/post_members/create',data)
}

// 编辑、修改
export const edit = (data) => {
    return axios.post('/post_members/edit',data)
}

// 删除
export const destroy = (id) => {
    return axios.post('/post_members/destroy',{id:id})
}
