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
        <el-menu-item index="20">
          <el-icon>     <grid/>  </el-icon>
          <span>首页</span>
        </el-menu-item>

        <el-sub-menu :index="item.path" v-for="(item,index)  in menuList">
          <template #title>
            <span>{{item.title}}</span>
          </template>
          <el-menu-item-group>
              <el-menu-item :index="item.path+'/'+itemL2.path"  v-for="(itemL2,index2)  in item.children" >
                  <el-icon>     <grid/>  </el-icon>
                  {{itemL2.title}}
              </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>


      </el-menu>
    </el-aside>
  </div>
</template>

<script>
import {useMenuStore} from '@/store/menu'
import {Avatar, Grid, Menu} from '@element-plus/icons-vue'
import {reactive, toRefs} from "vue";


export default {
  name: "LeftMenu",
  components: {
    Menu, Avatar, Grid
  },
  setup() {
    const menuInfo = useMenuStore()     // 实例化
    let  menuList=menuInfo.getMenuList()

    const sateData={
      abc:1024,
      def:1024,
    }


    // let {user} = storeToRefs(menu)   // 根据实际情况进行对象成员的解构
    console.log(menuInfo)

    // 本页面需要导出清单：
    return {
      //1.数据（变量结构之后导出
      ...toRefs(sateData),
      menuList,
      //2.函数列表
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