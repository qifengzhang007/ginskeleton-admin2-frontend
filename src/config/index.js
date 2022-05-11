export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  loginTitle: '企业项目开发骨架',  // 登陆背景显示的标题
  cmsTitle: '后台管理系统', // 登录后显示的标题
  copy_right:'Copyright © 2020-2021 www.ginskeleton.com, All rights reserved.',
  login_params:{
    user_name:'admin',
    pass:'ginskeleton'
  },
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,

  /**
   * @description api请求基础路径
   */
  baseUrl: {
    // npm run dev 有效
    dev_captcha: 'http://127.0.0.1:20201',
    dev: 'http://127.0.0.1:20201/admin',

    // npm run build 有效
    pro_captcha: 'http://139.196.101.31:20201',
    pro: 'http://139.196.101.31:20201/admin'
  },


}