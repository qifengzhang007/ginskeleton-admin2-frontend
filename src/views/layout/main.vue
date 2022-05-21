<template>
  <div id="layout-main">

    <div v-if="userStore.user.token.isValid">
      <!--    左侧菜单区域-->
      <div id="layout-left">
        <LeftMenu/>
      </div>

      <!--    右侧区域：banner + tabs + content 区域 -->
      <div id="layout-right">
        <HeaderBanner/>
        <Tabs/>
        <div id="layout-content">
          <router-view v-slot="{ Component, route }">
            <transition :name="route.meta.transition || 'fade'" mode="out-in">
              <keep-alive>
                <component
                    :is="Component"
                    :key="route.meta.usePathKey ? route.path : undefined"
                />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </div>

    </div>
    <div v-else>
      <router-view v-slot="{ Component }" name="login">
        <transition name="router-fade" mode="out-in">
          <component :is="Component"/>
        </transition>
      </router-view>
    </div>

  </div>

</template>

<script>
import HeaderBanner from '@/components/system-setting/layout/header_banner.vue'
import Tabs from '@/components/system-setting/layout/tabs.vue'
import LeftMenu from '@/components/system-setting/layout/left_menu.vue'
import {useRouter} from 'vue-router'
import {useUserStore} from "@/store/system-setting/user";
import {useTabStore} from "@/store/system-setting/tabs";
import {useRouteStore} from "@/store/system-setting/route";
import {useReloadStore} from "@/store/system-setting/reload";
import config from '@/config/index';

export default {
  name: "Main",
  components: {
    HeaderBanner,
    Tabs,
    LeftMenu,
  },
  setup() {
    const userStore = useUserStore()     // 实例化
    const reloadStore = useReloadStore()     // 实例化
    const tabsStore = useTabStore()

    const router = useRouter()
    let routerStore = useRouteStore()
    routerStore.setRoute(router)

    const routerGuard = () => {
      router.beforeEach((to, from, next) => {
        if (to.name === config.defaultRoute.notLoginDefaultRouterName) {
          // 如果是登录路由，则不需要判断，直接跳转到登陆页面
          userStore.destroyUserInfo()
          next()
        } else {
          // 如果是业务路由，当token无效时，跳转到登录页面
          if (!userStore.user.token.isValid) {
            userStore.destroyUserInfo()
            // 如果没有，则跳至登录页面
            next({name: config.defaultRoute.notLoginDefaultRouterName})
          } else {
            tabsStore.add(to.meta.title, to.meta.id, to.meta.icon, to.path)
            next()
          }
        }
      })
    }

    if (userStore.user.token.isValid) {
      reloadStore.reloadRouterMenu(userStore.user.info.id).then(res => {
        routerGuard()
      }).catch(err => {
        console.log("src/views/layout/main.vue出错：", err)
      })
    } else {
      routerGuard()
    }


    return {
      userStore
    }
  }
}
</script>

<style scoped>
#layout-main {
  overflow-x: hidden;
}

#layout-left {
  float: left;
  top: 0;
  display: inline-block;
  min-height: 100vh;
  width: 255px !important;
  background-color: #1d1e23;
}

#layout-right {
  float: right;
  top: 0;
  display: inline-block;
  width: calc(100% - 255px);
  min-height: 100vh;
}

#layout-content {
  display: block;
  padding: 4px 4px;
  overflow-y: auto;
  height: calc(100vh - 64px - 42px - 2px);
}
</style>