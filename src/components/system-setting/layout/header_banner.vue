<template>
  <div class="header-banner">
    <div class="header-banner-left">
      <span class="collapse">
          <el-icon>
                   <component @click="layoutStore.collapseExpandLeftMenu" :is="layoutStore.layout.leftMenuIsShow?'ArrowLeft':'ArrowRight'"/>
          </el-icon>
      </span>
      <span class="menu-nav">
        <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }">  <el-icon :size="16" style="vertical-align: middle">    <HomeFilled/>    </el-icon> <span style="vertical-align: middle;color: #858585">首页</span></el-breadcrumb-item>
    <el-breadcrumb-item v-for="item  in menuStore.getMenuNavPathList(tabsStore.tabs.curMenuItem.relaMenuId)">{{ item.title }}</el-breadcrumb-item>
  </el-breadcrumb>
      </span>
    </div>

    <div class="header-banner-right">

      <img :src="getFullScreenRelaIconPath()" alt="" @click="browserScreenFullEvent()">&nbsp;&nbsp;&nbsp;&nbsp;
      <el-avatar shape="square" fit="fit" style="background-color: white" :size="40" :src="userStore.user.info.fullAvatarUrl"/>

      <el-dropdown size="small" @command="handleCommand">
    <span class="el-dropdown-link">
      <el-icon class="el-icon--right">
        <arrow-down id="arrow-down"/>
      </el-icon>
    </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item  command="edit">编辑信息</el-dropdown-item>
            <el-dropdown-item divided command="loginOut">退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </div>
    <!--引入个人资料编辑组件-->
    <Profile :propCreateEdit="curdCreateEdit"/>
  </div>
</template>

<script>
import {useLayoutStore} from "@/store/system-setting/layout";
import {useMenuStore} from '@/store/system-setting/menu'
import {useTabStore} from '@/store/system-setting/tabs'
import {useRouteStore} from '@/store/system-setting/route'
import {useUserStore} from '@/store/system-setting/user'
import screenfull from 'screenfull'
import {reactive, toRefs} from 'vue'
import {personalInfo} from '@/api/system-setting/user'
import Profile from '@/components/system-setting/user/profile.vue'
import commonFunc from '@/libs/common_func'

export default {
  name: "HeaderBanner",
  components: {
    Profile
  },
  setup() {
    const layoutStore = useLayoutStore()

    const stateData = reactive({
      fullScreen: {
        Status: 0,
      },
      //  修改时，传递给子组件的属性变量，
      curdCreateEdit: {
        isShow: false,
        drawerTitle: '',
        curdFormData: {
          action: '',
          id: 0,
          real_name: '',
          user_name: '',
          pass: '',
          phone: '',
          avatar: '',
          status: 1,
          remark: '',
        }
      },
    })

    const menuStore = useMenuStore()
    const tabsStore = useTabStore()
    const routerStore = useRouteStore()
    const userStore = useUserStore()

    const handleCommand = (command) => {
      switch (command) {
        case 'loginOut':
          userStore.destroyUserInfo()
          routerStore.getRoute.push('/login')
          break
        case 'edit':
          personalInfo().then(res => {
            if (res.data.code === 200) {
              stateData.curdCreateEdit.isShow = true
              stateData.curdCreateEdit.drawerTitle = "编辑信息"
              stateData.curdCreateEdit.curdFormData.action = "update"
              stateData.curdCreateEdit.curdFormData = Object.assign({}, res.data.data)
              stateData.curdCreateEdit.curdFormData.pass='####*****####'  // 密码使用功能掩码代替
            }
          }).catch(errRes => {
            commonFunc.Curd.FailTips("获取个人信息出错：" + errRes.response.data.msg)
          })
          break
      }
    }

    const browserScreenFullEvent = () => {
      if (!screenfull.isEnabled) return
      stateData.fullScreen.Status === 0 ? stateData.fullScreen.Status = 1 : stateData.fullScreen.Status = 0
      stateData.fullScreen.Status ? screenfull.toggle() : screenfull.exit()
    }
    const getFullScreenRelaIconPath = () => {
      return new URL(`../../../assets/images/full-icon-${stateData.fullScreen.Status}.png`, import.meta.url).href
    }

    return {
      ...toRefs(stateData),

      layoutStore,
      tabsStore,
      menuStore,
      userStore,
      handleCommand,
      browserScreenFullEvent,
      getFullScreenRelaIconPath
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

i.el-icon:hover {
  color: #2d8cf0;
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

#arrow-down:hover {
  color: #409eff;
}

</style>