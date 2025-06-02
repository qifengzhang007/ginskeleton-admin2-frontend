### GinSkeleton-Admin2 (前端部分)
> 基于 vue3.x + vite5.x+ javascript + elementPlus + pinia + vue-router4.x + axios 等最新技术栈构建的全新后台管理系统.


###  [在线文档](https://www.yuque.com/xiaofensinixidaouxiang/qmanaq/qmucb4)
> 文档包含了最主要的使用功能说明、界面效果图、演示地址等.


####  更新日志
**v2.1.10  2025-06-02**
- 1.项目依赖包更细至最新版
- 2.项目打包、构建使用 rolldown ,将项目构建速度提升2倍.
- 3.本版本需要搭配 **[gin-skeleton-admin2-backend](https://gitee.com/daitougege/gin-skeleton-admin2-backend)** ≥ v2.1.00 .


#### `vite6` 与 `rolldown` 打包构建说明
- 如果您正在使用 `vite5.x` 调试、打包、构建项目，需要执行以下代码，清除相关的缓存，才能使 `vite6+rolldown` 生效，提升速度。
```code
yarn remove vite
yarn add vite@npm:rolldown-vite@latest
yarn install --force

# 经过与vite5.x版本的对比，发现vite6.x版本比vite5.x版本在执行  yarn build 时快了2倍左右.
```