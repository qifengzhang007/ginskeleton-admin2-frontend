import axios from '@/libs/api_request'

// 左侧数据获取接口
export const getSubListByFid = (id) => {
    return axios.get('/system_menu/get_by_fid',{fid:id})
}
// 右侧list
export const list = (params) => {
    return axios.get('/system_menu/list',params)
}
//新增
export const createByJson = (json) => {
    return axios.post_raw('/system_menu/create',json)
}

//修改
export const editByJson = (json) => {
    return axios.post_raw('/system_menu/edit',json)
}

//删除
export const destroy = (id) => {
    return axios.post('/system_menu/destroy',{id: parseInt(id)})
}

//系统菜单挂接的按钮列表(可被分配的按钮数据源列表)
export const menu_mount_auth_button = (menuId) => {
    return axios.get('/system_menu/mount_auth_button',{fr_auth_system_menu_id:menuId})
}
