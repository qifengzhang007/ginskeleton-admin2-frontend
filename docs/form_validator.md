####  界面表单参数验证概述
- 1.iview 的表单验证器引用的组件：https://github.com/yiminghe/async-validator .
- 2.我们将最常用的验证语法列举在这里，便于开发者快速使用，其他比较少用的语法可以查看官方文档。


#### 常用语法一览
[在线代码预览（110行附近）](https://gitee.com/daitougege/gin-skeleton-admin-frontend/blob/master/src/components/system-setting/users/create_edit.vue)
表单验证需要满足的 2 个条件：
- 1.定义表单 `FormItem ` 的属性变量，与表单字段保持一致, 例如： `username`：
> CurdFormData.user_name 为表单字段名变量，需要事先定义好.
```code
            <FormItem label="用户名：" prop="user_name">
              <Input v-model="CurdFormData.user_name" placeholder="用户名">
              </Input>
            </FormItem>
```
- 2.将 `username` 属性变量防止在验证规则中进行验证：
```code

  ruleValidate: {
        user_name: [
          {type: 'string', required: true, min: 2, max: 40, message: '用户名为必选项，规则：[2,40]个文字', trigger: 'blur'}
        ],
        avatar: [
          {type: 'string', rrequired: true, message: '头像为必填选项，请上传...', trigger: 'blur'},
        ],
        status: [
          {type: 'number', required: true, message: '状态必须选择', trigger: 'blur'}
        ],
        birthday: [
        // patter 支持正则表达式模式，可以自定义。
        // 由于不同的系统使用的时间格式(UTC、GMT 、TIMESTAMP、YYYY-MM-DD HH:MM:SS)不同，前端可以按照后端需求设置日期时间格式，自定义验证规则。。
           {type: 'string', required: true, message: '出生日期为必填', trigger: 'blur', patter: /.+/}
        ]
      },

```

#### 验证器类型清单

