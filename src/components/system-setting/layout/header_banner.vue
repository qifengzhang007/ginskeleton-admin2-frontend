<template>
  <div class="header-banner">
    <div class="header-banner-left">
      <span class="collapse">       <el-icon><Fold/></el-icon>    </span>
      <span class="menu-nav">
        <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }">  <el-icon :size="16" style="vertical-align: middle">    <HomeFilled/>    </el-icon> <span style="vertical-align: middle;color: #858585">首页</span></el-breadcrumb-item>
    <el-breadcrumb-item v-for="item  in menuStore.getMenuNavPathList(tabsStore.tabs.curMenuItem.relaMenuId)">{{ item.title }}</el-breadcrumb-item>
  </el-breadcrumb>
      </span>
    </div>

    <div class="header-banner-right">
      <el-icon :size="24">
        <FullScreen/>
      </el-icon>
      <el-avatar shape="circle" :size="50" src="http://139.196.101.31:20201/storage/uploaded/2021_03/0cab2657f435a6424d5716ec8ce6c847.png"/>

      <el-dropdown size="small" @command="handleCommand">
    <span class="el-dropdown-link">
      <el-icon class="el-icon--right">
        <arrow-down/>
      </el-icon>
    </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="loginOut">退出登陆</el-dropdown-item>
            <el-dropdown-item divided command="edit">编辑信息</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </div>

  </div>

</template>

<script>
import {useMenuStore} from '@/store/system-setting/menu'
import {useTabStore} from '@/store/system-setting/tabs'
import {useRouteStore} from '@/store/system-setting/route'


export default {
  name: "HeaderBanner",
  components: {},
  setup() {

    // const stateData = reactive({
    //
    // })

    const menuStore = useMenuStore()
    const tabsStore = useTabStore()
    const routerStore = useRouteStore()
    // const headerBannerStore = useHeaderBannerStore()


    const handleCommand = (command) => {
      switch (command) {
        case 'loginOut':
          console.log('退出登陆')
          routerStore.getRoute.push('/login')
          break
        case 'edit':
          console.log('编辑个人信息')
          break
      }
    }


    return {
      // ...toRefs(stateData),
      // headerBannerStore,
      tabsStore,
      menuStore,
      handleCommand
    }

  }

}
</script>

<style scoped>
.collapse {
  display: inline-block;
  width: 80px;
  text-align: center;
  margin-right: 6px;
}

.header-banner {
  height: 64px;
  line-height: 64px;
  vertical-align: middle;
  border-bottom: #E8E8E8FF 1px solid;
}

.header-banner > div {
  color: #323337;
}

.header-banner-left {
  display: flex;
  align-items: center;
  float: left;
  width: 80%;
  padding-left: 4px;
}

.menu-nav {
  display: inline-block;
  font-size: 18px;
}

.header-banner-right {
  display: flex;
  float: right;
  width: 18%;
  height: 100%;
  padding-right: 15px;
  vertical-align: middle;
  align-items: center;
  justify-content: flex-end;
}

</style>