export default {

    /*
     * @description 配置显示在浏览器标签的title
     */
    loginTitle: '企业项目开发骨架',  // 登陆背景显示的标题
    cmsTitle: '后台管理系统', // 登录后显示的标题
    copyRight: 'Copyright © 2022 www.ginskeleton.com, All rights reserved.',
    loginParams: {
        userName: 'admin',
        pass: 'ginskeleton'
    },

    /*
    *  npm run dev ;
    * npm  run  build:dev   开发调试、以及打包开发环境时有效
    */
    dev:{
        serverIp: 'http://127.0.0.1:22001',   // 服务器ip
        apiPre: 'http://127.0.0.1:22001/admin',   // 接口前缀
    },

    /*
    *  npm run build  生产环境有效
    */
    pro:{
        serverIp: 'http://139.196.101.31:22001',
        apiPre: 'http://139.196.101.31:22001/admin',
    },
    //  ==============↓↓↓   后面的设置基本上无需改动   ↓↓↓======

    /*
    所有的api接口请求超时时间，单位：毫秒
    */
    requestTimeout: 5000,

    /*
     * @description 本地数据存储相关的设置
     */
    dataStore: {
        // 存储cookie、localStorage 时，key 的前缀，
        keyPre: "K1_",  // 建议不同的项目使用项目编号作为前缀
        userTokenKey: "UserToken",   // 用户登录后token存储在cookie的键
        tokenStoreToCookieExpiration: 8,  //  token存储到cookie的默认有效期（单位：小时）
    },

    /*
     * @description 出错设置
     */
    errorSetting: {
        serverNotStartTips: '可能是服务端未启动，请联系管理员',
        noAuthTips: 'Casbin 鉴权未通过，请在后台检查 casbin 设置参数',  // 接口没有授权时的错误提示，需要和后台casbin未通过时的提示一致，否则会显示2条信息，
        tokenExpiredTips: '页面token授权已过期，请重新登陆.',
    },

    /*
     * @description 默认路由设置
     */
    defaultRoute: {
        notLoginDefaultRouterName: 'login',
        loginDefaultRouterName: '/',
    }

}
