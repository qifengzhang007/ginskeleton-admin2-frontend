export default {

    /**
     * @description 配置显示在浏览器标签的title
     */
    loginTitle: '企业项目开发骨架',  // 登陆背景显示的标题
    cmsTitle: '后台管理系统', // 登录后显示的标题
    copy_right: 'Copyright © 2020-2021 www.ginskeleton.com, All rights reserved.',
    login_params: {
        user_name: 'admin',
        pass: 'ginskeleton'
    },

    /**
     * @description api请求基础路径
     */
    baseUrl: {
        // npm run dev 有效
        dev_server_ip: 'http://127.0.0.1:20201',
        dev_api_pre: 'http://127.0.0.1:20201/admin',

        // npm run build 有效
        pro_server_ip: 'http://139.196.101.31:20201',
        pro_api_pre: 'http://139.196.101.31:20201/admin'
    },

    /**
     * @description 本地数据存储相关的设置
     */
    dataStore:{
        // 存储cookie、localStorage 时，key 的前缀，
        keyPre:"K1_",    // 基于本套框架开发多个系统时，强烈建议不同的系统设置不同的前缀.
        userTokenKey:"UserToken"   // 用户登录后token存储在cookie的键
    },

    //  ============== 后面设置基本上无需改动 ======
    /**
     * @description 出错设置
     */
    errorSetting: {
        serverNotStartTips: '网络错误 - 可能是服务端未启动，请联系管理员',
        noAuthTips: '该接口没有权限访问，请联系管理员分配权限.',
    },
    /**
     * @description 默认路由设置
     */
    defaultRoute: {
        notLoginDefaultRouterName: 'login',
        loginDefaultRouterName: '/',
    }

}