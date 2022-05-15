<template>
  <div class="header-banner">
    <div class="header-banner-left">
      <span class="collapse">       <el-icon><Fold/></el-icon>    </span>
      <span class="menu-nav">
        <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }">  <el-icon :size="16" style="vertical-align: middle">    <HomeFilled />    </el-icon> <span style="vertical-align: middle;color: #858585">首页</span></el-breadcrumb-item>
    <el-breadcrumb-item v-for="item  in menuStore.getMenuNavPathList(tabsStore.tabs.curMenuItem.relaMenuId)">{{ item.title }}</el-breadcrumb-item>
  </el-breadcrumb>
      </span>
    </div>

    <div class="header-banner-right">管理员</div>

  </div>

</template>

<script>
import {useHeaderBannerStore} from '@/store/system-setting/header_banner'
import {useMenuStore} from '@/store/system-setting/menu'
import {useTabStore} from '@/store/system-setting/tabs'
import {reactive, ref, toRefs} from 'vue'


export default {
  name: "HeaderBanner",
  components: {},
  setup() {

    // const stateData = reactive({
    //
    // })

    const menuStore = useMenuStore()
    const headerBannerStore = useHeaderBannerStore()
    const tabsStore = useTabStore()

    return {
      // ...toRefs(stateData),
      // headerBannerStore,
      tabsStore,
      menuStore,

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
  display: inline-block;
  float: right;
  width: 18%;
  text-align: right;
  padding-right: 5px;
}

</style>