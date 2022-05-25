import axios from '@/libs/api_request'

// 权限分析界面，带岗位用户列表查询
export const user_list_with_post = (params) => {
    return axios.get('/auth_analysis/user_list_with_post', params)
}

// 权限分析界面，根据用户id查询已拥有的所有权限
export const has_auth_list = (id) => {
    return axios.get('/auth_analysis/has_auth_list', {id: id})
}

// 查询打开的菜单对应的页面具有的按钮列表
export const view_button_list = (menuId) => {
    return axios.get('/users/has_view_button_list', {menu_id: menuId})
}

// 根据接口查询拥有的按钮元素权限与页面定义的按钮对比，最终显示拥有权限的按钮元素
export const show_button = (hasButtonList, curButtonList) => {
    for (const key in curButtonList) {
        curButtonList[key] = hasButtonList.some((value, index) => {
            return value.en_name === curButtonList[key];
        })
    }
}