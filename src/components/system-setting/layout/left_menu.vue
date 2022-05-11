<template>
  <div id="left-menu">
    <el-aside class="aside">
      <div class="left-logo">
        <div>
          <img src="@/assets/images/logo.png" alt="logo">
          <span>后台管理系统</span>
        </div>
      </div>
      <el-menu
          background-color="#1d1e23"
          text-color="#d3d3d4"
          :router="true"
          active-text-color="#fefefe"
          :unique-opened="false"
          :collapse-transition="false"
          :default-active='menuInfo.menu.currentMenu.path'
          class="el-menu-vertical-demo"
      >

        <el-sub-menu index="0">
          <template #title>
            <span class="menu-one-title">首页</span>
          </template>
        </el-sub-menu>

        <el-sub-menu index="1">
          <template #title>
            <span>系统配置</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/system-setting/sys_menu"><i class="el-icon-picture"/>系统菜单</el-menu-item>
            <el-menu-item index="/system-setting/organization"><i class="el-icon-star-on"/>组织结构</el-menu-item>
            <el-menu-item index="/system-setting/post_members"><i class="el-icon-star-on"/>岗位成员</el-menu-item>
            <el-menu-item index="/system-setting/user"><i class="el-icon-star-on"/>用户管理</el-menu-item>
            <el-menu-item index="/system-setting/button"><i class="el-icon-star-on"/>按钮设置</el-menu-item>
            <el-menu-item index="/system-setting/auth_dispath"><i class="el-icon-star-on"/>权限分配</el-menu-item>
            <el-menu-item index="/system-setting/auth_analysis"><i class="el-icon-star-on"/>权限分析</el-menu-item>

          </el-menu-item-group>
        </el-sub-menu>

        <el-sub-menu index="2">
          <template #title>
            <span>基础数据</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/dictionary/province_city"><i class="el-icon-menu"/>省份城市</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

      </el-menu>


    </el-aside>
  </div>
</template>

<script>
import {useMenuStore} from '@/store/menu'
import {storeToRefs} from 'pinia'

export default {
  name: "LeftMenu",
  components: {},
  setup() {
    const menuInfo = useMenuStore()     // 实例化
   // let {user} = storeToRefs(menu)   // 根据实际情况进行对象成员的解构
console.log(menuInfo)

    return {
      menuInfo
    }
  }
}
</script>

<style scoped>
.left-logo, .left-logo > div {
  display: flex;
  height: 50px;
  line-height: 50px;
  vertical-align: middle !important;
  padding-left: 2px;
}

.left-logo img {
  width: 50px;
  height: 50px;
  margin-right: 8px;
}

.left-logo span {
  font-size: 16px;
  color: white;
}

.aside {
  width: 255px !important;
  background-color: #1d1e23;
  overflow: hidden;
  overflow-y: auto;
}

.aside::-webkit-scrollbar {
  display: none;
}

</style>