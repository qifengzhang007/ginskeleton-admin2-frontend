####  2.1 node 环境安装

##### &nbsp;&nbsp;&nbsp;&nbsp; Windows7 系统
> 1.nodejs 推荐版本：v13.14系列（该系列是win7能够使用的最高版本）.
2.请根据自己的系统环境下载安装对应版本： https://nodejs.org/dist/latest-v13.x/

##### &nbsp;&nbsp;&nbsp;&nbsp;  Windows10 系统
> 1.nodejs 使用最新版本即可： https://nodejs.org/zh-cn/download/

#### 镜像源设置
>  根据自己的实际情况，决定是否使用国内淘宝镜像替换 nmp 官方镜像源：
```code
  // 设置https不校验参数，避免发生证书校验错误
  npm  config set "strict-ssl" false -g

  // 使用淘宝镜像替换官方镜像源
 npm install -g cnpm --registry=https://registry.npm.taobao.org
 cnpm  -v //查看版本，测试是否安装成功

```

###  2.2 安装本项目依赖
```code
// 项目根目录执行
cnpm  install

```

###  2.3 启动本项目
```code
// 项目根目录执行
npm run  dev

// 此时如果无法运行（运行报错等，基本都是 cnpm  install 安装依赖包有问题）
// 请删除主目录内的 node_modules ，重新运行  cnpm  install 安装依赖


// 浏览器会自动打开本地分配的登陆地址
// 默认登陆信息如下，更多参见：src/config/index.js
// 账号： admin
// 密码：ginskeleton

```

###  <font color='red'> 2.4 开发环境、生产环境参数配置 </font>
>  <font color='red'> 编译为生产环境时，务必检查配置文件服务器ip、端口等参数信息!  </font>
```code

  // 1.设置编译前的生产环境参数配置
  路径：
  ./src/config/index.js
  配置参数：
    baseUrl: {
    // npm run dev 有效
    dev: 'http://127.0.0.1:20201/admin/',

    // npm run build 有效
    pro: 'http://你的生产环境服务器ip:20201/admin/'
  },


```

### 2.5 编译、打包
```code

  // 最后编译、打包
    npm run build

```

###  2.6 nginx 配置,供部署参考使用
> GinSkeleton 提供了nginx 日志(access.log 、 error.log)集中管理功能，可以直接对接到 ELK 服务器，请参考后端项目日志集中管理方案部分.
```code

server
 {
     listen 20202;
     server_name www.ginskeleton.com ;
     index index.html index.htm;
     # 设置项目根目录，dist 目录为本项目编译后解压目录
     root  /home/wwwroot/test/dist;

    #解决vue项目部署后刷新页面出现404的问题
    location  / {
        try_files $uri $uri/ /index.html;
    }

     location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
     {
         expires      30d;
     }

     location ~ .*\.(js|css)?$
     {
         expires      12h;
     }

     location ~ /.well-known {
         allow all;
     }

     location ~ /\.
     {
         deny all;
     }

		# 设置访问日志与错误日志记录，相关路径请自行修改
    access_log   /home/wwwlogs/ginskeleton_admin_fronted_access.log ;
    error_log   /home/wwwlogs/ginskeleton_admin_fronted_error.log ;
 }

```



