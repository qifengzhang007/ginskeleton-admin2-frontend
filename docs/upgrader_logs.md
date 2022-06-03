#### V1.0.26 (2022-04-18)
###### [搭配后端的版本](https://gitee.com/daitougege/gin-skeleton-admin-backend) >= v1.0.36
- 1.精简代码.
- [更多更新日志](./docs/update_logs.md)

#### V1.0.25 (2022-01-25)
###### [搭配后端的版本](https://gitee.com/daitougege/gin-skeleton-admin-backend) >= v1.0.29
- 1.文件上传组件独立封装、精简化.
- 2.增加个人信息编辑功能.
- 3.使用文档小幅度更新.

#### V1.0.24 (2021-11-29)
###### [搭配后端的版本](https://gitee.com/daitougege/gin-skeleton-admin-backend) >= v1.0.25
- 1.修复退出登录闪烁的问题.

#### V1.0.23 (2021-11-27)
###### [搭配后端的版本](https://gitee.com/daitougege/gin-skeleton-admin-backend) >= v1.0.25
- 1.修复树形公共组件数据很多的时候样式边界溢出bug.
- 2.修复菜单页面在没有任何数据选中的状态下，点击修改按钮没有提示的bug.

#### V1.0.22 (2021-11-27)
###### [搭配后端的版本](https://gitee.com/daitougege/gin-skeleton-admin-backend) >= v1.0.25
- 1.依赖包`IviewUI` 更新至最新版本:`v4.7.0`,并解决版本之间兼容性问题.
- 2.公共组件被引用时增加支持单选模式、多选模式.
- 3.修复表格字段无法拖拽调整宽度的bug.
- 4.修复不同权限的账号切换后，缓存需要手动F5刷新,没有自动刷新的bug.
- 5.代码整体做了一次精简.

#### V1.0.21 (2021-11-01)
###### [搭配后端的版本](https://gitee.com/daitougege/gin-skeleton-admin-backend) >= v1.0.24
- 1.细节完善:路由组件路径自动以` / ` 开头, 避免浏览器出现地址的追加现象.

#### V1.0.20 (2021-10-24)
###### [搭配后端的版本](https://gitee.com/daitougege/gin-skeleton-admin-backend) >= v1.0.24
- 1.bug修复：系统菜单排序字段由 字符串 类型修正为  数字类型

#### V1.0.19 (2021-09-28)
###### [搭配后端的版本](https://gitee.com/daitougege/gin-skeleton-admin-backend) >= v1.0.17
- 1.子表组件功能更新：
- 1.1 增加列字段属性，是否显示、是否只读.
- 1.2 行样式更新，紧凑化，方便子表在有限的界面中，容纳更多的数据.
2. 详细使用文档参见：[子表使用文档](./docs/childrenTable.md)

#### V1.0.18 (2021-09-24)
###### [搭配后端的版本](https://gitee.com/daitougege/gin-skeleton-admin-backend) >= v1.0.17
- 1.子表组件增强功能更新：[子表使用文档](./docs/childrenTable.md)


#### V1.0.17 (2021-08-27)
###### [搭配后端的版本](https://gitee.com/daitougege/gin-skeleton-admin-backend) >= v1.0.17
- 1.修复岗位成员界面新增数据时,参数校验异常bug.

#### V1.0.16 (2021-08-02)
###### [搭配后端的版本](https://gitee.com/daitougege/gin-skeleton-admin-backend) >= v1.0.17
- 1.修复岗位成员界面字段与验证字段不完全一致的bug.
- 2.部署文档增加可能的错误解决办法.

#### V1.0.15 (2021-06-24)
###### [搭配后端的版本](https://gitee.com/daitougege/gin-skeleton-admin-backend) >= v1.0.17
- 1.更新项目依赖库版本,主要包括 iviewUi界面库版本至最新版本 v4.6.1 以及其他库.
- 2.删除未引用的依赖库.

#### V1.0.14 (2021-05-29)
###### [搭配后端的版本](https://gitee.com/daitougege/gin-skeleton-admin-backend) >= v1.0.17
-  1.登录时验证账号、密码、验证码逻辑完善,解决现有机制下,登陆接口被用户使用postman可绕过验证码验证的不严谨问题.

#### V1.0.13 (2021-05-25)
###### [搭配后端的版本](https://gitee.com/daitougege/gin-skeleton-admin-backend) = v1.0.16
-  1.省份城市编辑界面删除一处多余必填项验证

#### V1.0.12 (2021-04-15)
-  1.完善前台表单验证,如果验证不通过禁止提交后台,并给出提示.

#### V1.0.11 (2021-04-02)
-  1.修复用户退出浏览器(未关闭)继续登录缓存没有清除的bug.

#### V1.0.10 (2021-04-02)
-  1.系统菜单主表与子表数据提交方式切换为 raw 方式提交json,方便后台直接使用.

#### V1.0.02 (2021-04-01)
-  1.开启新增、修改界面的尺寸拖动条.
-  2.登陆页背景轮播图微调.
-  3.src/libs/api.request.js 文件增加raw_post 函数,方便开发者提交json格式数据.

#### V1.0.01 (2021-03-31)
-  1.完善岗位成员、组织机构模块操作.
-  2.select option 组件调整为Iview UI 默认组件.
-  3.公共组件命名规范化.
-  4.更新已下载版本方法：覆盖系统自带文件夹即可.

#### V1.0.00 (2021-03-23)
-  1.GinSkeleton-Admin-frontend 系统 v1.0.0 版本发布.
