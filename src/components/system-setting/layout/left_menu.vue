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
          :unique-opened="true"
          :collapse-transition="false"
          default-active='/'
          class="el-menu-vertical-demo"
      >
        <!--
        <el-menu-item index="20">
          <el-icon>
            <Grid/>
          </el-icon>
          <span>首页</span>
        </el-menu-item>
      -->
        <el-sub-menu :index="item.path" v-for="(item,index)  in menuStore.menu.list">
          <template #title>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item :index="'/'+item.path+'/'+itemL2.path" v-for="(itemL2,index2)  in item.children" :menuName="itemL2.title">
              <el-icon>
                <Grid/>
              </el-icon>
              {{ itemL2.title }}
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>


      </el-menu>
    </el-aside>
  </div>
</template>

<script>
import {useMenuStore} from '@/store/system-setting/menu'
import {useHeaderBannerStore} from '@/store/system-setting/header_banner'
import {reactive, toRefs} from "vue";

export default {
  name: "LeftMenu",
  components: {},
  setup() {
    const menuStore = useMenuStore()     // 实例化
    const headerBannerStore = useHeaderBannerStore()

    const sateData = reactive({
      key: '',
    })

    return {
      //1.数据（变量结构之后导出
      ...toRefs(sateData),
      //2.函数列表
      menuStore,
      headerBannerStore
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