export const menuList = (userId) => {
    return [
        {
            "id": 2,
            "fid": 0,
            "title": "系统配置",
            "name": "system-setting",
            "loading": false,
            "icon": "grid",
            "path": "/system-setting",
            "component": "无",
            "remark": "",
            "has_sub_node": 0,
            "children": [
                {
                    "id": 3,
                    "fid": 2,
                    "title": "系统菜单",
                    "name": "system_menu",
                    "loading": false,
                    "icon": "avatar",
                    "path": "system_menu",
                    "component": "view/system-setting/system-menu/index",
                    "remark": "",
                    "has_sub_node": 0,
                    "children": []
                },
                {
                    "id": 4,
                    "fid": 2,
                    "title": "组织机构",
                    "name": "organization",
                    "loading": false,
                    "icon": "grid",
                    "path": "organization",
                    "component": "view/system-setting/org-post-tree/index",
                    "remark": "",
                    "has_sub_node": 0,
                    "children": []
                },
                {
                    "id": 5,
                    "fid": 2,
                    "title": "岗位成员",
                    "name": "post_members",
                    "loading": false,
                    "icon": "md-person-add",
                    "path": "post_members",
                    "component": "view/system-setting/post-members/index",
                    "remark": "",
                    "has_sub_node": 0,
                    "children": []
                },
                {
                    "id": 6,
                    "fid": 2,
                    "title": "用户管理",
                    "name": "user",
                    "loading": false,
                    "icon": "md-person",
                    "path": "user",
                    "component": "view/system-setting/users/index",
                    "remark": "",
                    "has_sub_node": 0,
                    "children": []
                },
                {
                    "id": 7,
                    "fid": 2,
                    "title": "权限分配",
                    "name": "org_post_auth_assignment",
                    "loading": false,
                    "icon": "md-code",
                    "path": "org_post_auth_assignment",
                    "component": "view/system-setting/org-post-auth-assignment/index",
                    "remark": "",
                    "has_sub_node": 0,
                    "children": []
                },
                {
                    "id": 8,
                    "fid": 2,
                    "title": "权限分析",
                    "name": "org_post_auth_analysis",
                    "loading": false,
                    "icon": "md-grid",
                    "path": "org_post_auth_analysis",
                    "component": "view/system-setting/org-post-auth-analysis/index",
                    "remark": "",
                    "has_sub_node": 0,
                    "children": []
                },
                {
                    "id": 10,
                    "fid": 2,
                    "title": "按钮设置",
                    "name": "button_cn_en",
                    "loading": false,
                    "icon": "md-radio-button-on",
                    "path": "button_cn_en",
                    "component": "view/system-setting/button/index",
                    "remark": "",
                    "has_sub_node": 0,
                    "children": []
                }
            ]
        },
        {
            "id": 41,
            "fid": 0,
            "title": "基础数据",
            "name": "data_dictionary",
            "loading": false,
            "icon": "ios-grid",
            "path": "/data_dictionary",
            "component": "无",
            "remark": "",
            "has_sub_node": 0,
            "children": [
                {
                    "id": 42,
                    "fid": 41,
                    "title": "省份城市",
                    "name": "province_city",
                    "loading": false,
                    "icon": "md-podium",
                    "path": "province_city",
                    "component": "view/data-dictionary/province-city/index",
                    "remark": "",
                    "has_sub_node": 0,
                    "children": []
                }
            ]
        }
    ];
}

