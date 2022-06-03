###  ChildrenTable  通用子表组件
>  该组件主要用于被主表嵌套使用

### 可能使用的业务场景
- 1.主表一条数据，挂载了子表的多条数据，这样的模式就可以在一个界面编辑，在业务逻辑关系上思路非常紧凑.
- 2.如下的一个主表和子表同时操作的示例界面.

![主表子表示例图](https://www.ginskeleton.com/images/master_slaver_tb.jpg)

### 使用指南
>	[相关代码详情](../src/components/system-setting/system-menu/create_edit.vue)
```code

	// 1.引用组件
    import ChildrenTable from '@/components/common/children_table.vue'

	// 2.子表组件相关的配置参数一览

	// 2.1 在页面使用子表组件
       <ChildrenTable :propChildrenTable="childrenTable"/>
	   
	 // 2.2 子表组件属性（配置）介绍  
      childrenTable: {
        action: propCreateEdit.value.curdFormData.action,  // 子表组件使用的场景动作参数：insert、update.
        allRows: [], // 结果存储数组
        deletedButtonIds: '', // 子表 被删除的id文本格式，例如：1,2,3,4
        //定义一行(条)记录所需要的字段
        rowField: {
          id: 0,
          fr_auth_system_menu_id: 0,
          fr_auth_button_cn_en_id: 0,
          button_name: '',
          request_url: '/',
          request_method: "*",
          short_path: "",
          remark: ''
        },
        // 定义表的一行需要展示的全部字段格式
        rowFieldFormat: [
          {
            name: '按钮名称',//表单名称
            type: "dialog",//类型{弹出框}
            field: 'button_name',//字段名
            componentPath: './select_button.vue',  // 只能使用相对路径，基准路径就是 ChildrenTable 子表的目录
            width: 3,//宽度,参考 elementPlus 的row、col布局，一个  row 由24个column构成，但是系统会使用一个 col，作为删除按钮列，内容区域最多只能配置23个col
            //  modalWidth: '900px', // 弹出框宽度
            //字段与弹出框组件字段的映射
            map: {
              fr_auth_button_cn_en_id: 'id',
              button_name: 'cn_name',
              request_method: 'allow_method'
            }
          },
          {
            name: '接口地址',
            type: "string",
            field: 'request_url',
            width: 6,
          },
          {
            name: '接口允许请求方式',
            type: "selectOption",
            field: 'request_method',
            width: 4,
            options: [
              {
                label: "*",
                value: "*",
              },
              {
                label: "GET",
                value: "GET",
              },
              {
                label: "POST",
                value: "POST",
              },
            ]
          },
          {
            name: '备注',
            type: "string",
            field: 'remark',
            width: 4,
          },
          {
            name: '上传文件',
            type: "upload",
            field: 'short_path',
            width: 5,
          },
          {
            name: '删除',
            type: "action",
            field: 'action',
            width: 2,
          },
        ],
        // 新增界面可以设置默认填充的值
        defaultListForCreate: [
          {
            id: 0,
            fr_auth_system_menu_id: 0,
            fr_auth_button_cn_en_id: 1,
            button_name: '新增',
            request_url: '/',
            request_method: "POST",
            remark: '',
            short_path: "",
          },
          {
            id: 0,
            fr_auth_system_menu_id: 0,
            fr_auth_button_cn_en_id: 2,
            button_name: '删除',
            request_url: '/',
            request_method: "POST",
            remark: '',
            short_path: "",
          },
          {
            id: 0,
            fr_auth_system_menu_id: 0,
            fr_auth_button_cn_en_id: 3,
            button_name: '修改',
            request_url: '/',
            request_method: "POST",
            remark: '',
            short_path: "",
          },
          {
            id: 0,
            fr_auth_system_menu_id: 0,
            fr_auth_button_cn_en_id: 4,
            button_name: '查询',
            request_url: '/',
            request_method: "GET",
            remark: '',
            short_path: "",
          }
        ]
      }
```

###  最终主表、子表提交的数据格式

```code
# 主表数据
{
    "action": "insert",
    "fid": 41,
    "ftitle": "基础数据",
    "title": "测试菜单",
    "status": 1,
    "sort": 102,
    "remark": "测试菜单",
    "button_array": [
        {
            "id": 0,
            "fr_auth_system_menu_id": 0,
            "fr_auth_button_cn_en_id": 1,
            "button_name": "新增",
            "request_url": "/test/insert",
            "request_method": "POST",
            "remark": "",
            "short_path": "/public/storage/uploaded/2022_06/9d2e958044648753cb6373b458b1dcfe.jpg"
        },
        {
            "id": 0,
            "fr_auth_system_menu_id": 0,
            "fr_auth_button_cn_en_id": 2,
            "button_name": "删除",
            "request_url": "/test/del",
            "request_method": "POST",
            "remark": "",
            "short_path": "/public/storage/uploaded/2022_06/9ab7e0a6743c906a19d4a4e4e915c628.png"
        },
        {
            "id": 0,
            "fr_auth_system_menu_id": 0,
            "fr_auth_button_cn_en_id": 3,
            "button_name": "修改",
            "request_url": "/test/edit",
            "request_method": "POST",
            "remark": "",
            "short_path": ""
        },
        {
            "id": 0,
            "fr_auth_system_menu_id": 0,
            "fr_auth_button_cn_en_id": 4,
            "button_name": "查询",
            "request_url": "/test/seletc",
            "request_method": "GET",
            "remark": "",
            "short_path": "/public/storage/uploaded/2022_06/daf6fce92b1b2331225655c85988d24a.png"
        }
    ],
    "button_delete": "",
    "name": "test_menu"
}


```

### 其他说明
- 主表、子表模式提交的数据比较复杂，需要以json方式提交, 红色标注在提交数据时需要格外关注。 
 
![主表子表提交数据](https://www.ginskeleton.com/images/user_sub_data.png)

