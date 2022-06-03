###  GinSkeleton-Admin (前端部分)
>  基于iview(4.5.0) + GinSkeleton(1.5) 开发

### [在线演示地址: GinSkeleton-Admin](http://139.196.101.31:20202/)

### 1.业务开发指南
> GinSkeleton 前后端配合才是一整套系统, 现将前端开发指南编写如下：
> 为了配合后端部分开发指南，我们使用相同的模块：按钮管理表(tb_auth_button_cn_en) 做代码演示
#### 1.1 视图入口地址
```code
// src/view/system_setting/button/index.vue ,
// 其中 view/system_setting/button/index  是后端配置菜单(路由地址)所需要的
// 开发完成此页面，告知后端, 配置在相关菜单，访问即可到达此页面
```
#### 1.2 以上视图页面对应的组件(components)地址
```code
 // src/components/system_setting/button
 // 以上目录内部包含了 增删改查相关的代码，请自行阅读即可

```
#### 1.3 开发过程中，注意事项
> 3.1 我们以查询界面为例介绍注意事项
```code

 // 1.界面按钮设置注意事项

 // 以下代码就是当前界面所设置的全部的按钮代码，每个按钮的代码，增删改查在本系统都是固定的
 // 除此之外的按钮代码请向后端获取，后端在按钮表统一设置所有的按钮代码，最后才能精确控制每个按钮的权限
         buttonList: {
          insert: 'insert',
          delete: 'delete',
          update: 'update',
          select: 'select',
        },

  // 界面导入函数代码说明
  import {list} from '@/api/system_setting/button'   // @ 表示目录已经定位到 src/
  import {list} from '_c/api/system_setting/xxx'     // _c 表示目录已经定位到 src/components/

```

####  1.4 开发完成的视图(页面)需要在后台配置
```code
  // 开发完成的视图(页面) 需要将导出名称, 配置在后端系统
  // 例如：src/view/system_setting/button/index.vue
  // 视图组件导出的名称为： button_cn_en
  //相关代码如下：
    export default {
    // 注意这里视图的导出名称： button_cn_en  必须后台界面中的路由名称一致，否则 tab 切换页签的时候接口每次都刷新
    name: 'button_cn_en',
    components: {
      MenuButton
    }
  }

  // 那么就需要在后台系统：
  // 菜单设置---按钮设置---（界面参数）路由名称 ，设置为： button_cn_en
  // 也就是说，前台的每一个视图(页面)名称都需要在后台菜单设置对应的路由名称

```
![前后端路由对应关系设置](https://www.ginskeleton.com/images/view_name.jpg)
![菜单与前端页面](https://www.ginskeleton.com/images/menu_page.png)
