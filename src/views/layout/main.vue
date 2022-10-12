<template>
  <div id="layout-main">

    <div v-if="userStore.user.token.isValid">
      <!--    左侧菜单区域-->
      <div id="layout-left" :style="layoutLeft" v-show="layoutStore.layout.leftMenuIsShow">
        <LeftMenu/>
      </div>

      <!--    右侧区域：banner + tabs + content 区域 -->
      <div id="layout-right" :style="layoutRight">
        <HeaderBanner/>
        <Tabs/>
        <div id="layout-content">
          <!--    router-view 组件渲染本站的路由对应的页面 -->
          <router-view v-slot="{ Component, route }">
            <template v-if="!route.meta.isOutPage">
              <transition :name="route.meta.transition || 'fade'" mode="out-in">
                <keep-alive>
                  <component :is="Component" :key="route.meta.usePathKey ? route.path : undefined"/>
                </keep-alive>
              </transition>
            </template>
          </router-view>

          <!--    如果是外部网页需要使用 iframe 组件渲染到本系统 -->
          <div v-for="(item,index)   in outPageRouteList" v-show="curRoute.path===item.path">
            <component :key="item.key" :is="item.value"/>
          </div>

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
import {useLayoutStore} from "@/store/system-setting/layout";
import {useUserStore} from "@/store/system-setting/user";
import {useTabStore} from "@/store/system-setting/tabs";
import {useRouteStore} from "@/store/system-setting/route";
import {useReloadStore} from "@/store/system-setting/reload";
import config from '@/config/index';
import {getToken} from '@/libs/util';
import {reactive, toRefs, watch, defineAsyncComponent, markRaw} from "vue";

export default {
  name: "Main",
  components: {
    HeaderBanner,
    Tabs,
    LeftMenu,
  },
  setup() {
    const userStore = useUserStore()     // 实例化

    //页面布局相关
    const layoutStore = useLayoutStore()
    const stateData = reactive({
      layoutLeft: {
        float: 'left',
        top: 0,
        display: 'inline-block',
        minHeight: '100vh',
        width: `${layoutStore.getLeftMenuWidth > 0 ? layoutStore.getLeftMenuWidth + 'px' : 0} !important`,
        backgroundColor: '#1d1e23'
      },
      layoutRight: {
        float: 'right',
        top: 0,
        display: 'inline-block',
        width: `calc(100% - ${layoutStore.getLeftMenuWidth > 0 ? layoutStore.getLeftMenuWidth + 'px' : 0})  !important`,
        minHeight: '100vh'
      },
      // 可能的外部页面路由
      outPageRouteList: [],
      curRoute: {}
    })

    // 监听布局变化
    watch(() => layoutStore.layout, (newVal, oldVal) => {
      if (newVal.leftMenuWidth === 0) {
        stateData.layoutLeft.width = `0 !important`
        stateData.layoutRight.width = `calc(100% + ${newVal.leftMenuWidth}px) !important`
      } else {
        stateData.layoutLeft.width = `${newVal.leftMenuWidth}px !important`
        stateData.layoutRight.width = `calc(100% - ${newVal.leftMenuWidth}px) !important`
      }
    }, {deep: true, immediate: true})

    // 路由相关
    const reloadStore = useReloadStore()     // 实例化
    const tabsStore = useTabStore()
    const router = useRouter()
    let routerStore = useRouteStore()
    routerStore.setRoute(router)

    // 监听菜单点击时实时变化的路由
    watch(() => tabsStore.tabs.curMenuItem, (newVal, oldVal) => {
      if (newVal) {
        stateData.curRoute = newVal
        // 如果是外部网页，就存储起来使用iframe组件渲染
        if (newVal.isOutPage) {
          if (!fOutPageRouteIsSave(newVal.viewComponentPath)) {
            fSaveOutPageRoute(newVal.viewComponentPath, newVal.path, routerStore.getViewComponent(newVal.viewComponentPath))
          }
        }
      }
    }, {deep: true, immediate: true})

    // 检测外部页面路由是否已经缓存
    const fOutPageRouteIsSave = (keyName) => {
      for (let index in stateData.outPageRouteList) {
        if ((stateData.outPageRouteList[index]).key === keyName) {
          return true
        }
      }
      return false
    }
    // 如果外部页面路由没有缓存，则调用该函数进行缓存
    const fSaveOutPageRoute = (keyName, path, value) => {
      stateData.outPageRouteList.push(
          {
            key: keyName,
            path: path,
            value: markRaw(defineAsyncComponent(value))
          }
      )

    }
    //根据键获取缓存的外部页面组件
    const fGetOutPageRoute = (keyName) => {
      for (let index in stateData.outPageRouteList) {
        if ((stateData.outPageRouteList[index]).key === keyName) {
          return (stateData.outPageRouteList[index]).value
        }
      }
      return null
    }

    const routerGuard = () => {
      router.beforeEach((to, from, next) => {
        if (to.name === config.defaultRoute.notLoginDefaultRouterName) {
          // 如果是登录路由，则不需要判断，直接跳转到登陆页面
          userStore.destroyUserInfo()
          next()
        } else {
          // 如果是业务路由，当token无效时，跳转到登录页面
          if (!getToken() || !userStore.user.token.isValid) {
            userStore.destroyUserInfo()
            // 如果没有，则跳至登录页面
            next({name: config.defaultRoute.notLoginDefaultRouterName})
          } else {
            tabsStore.add(to.meta.title, to.meta.id, to.meta.icon, to.path, to.meta.viewComponentPath, to.meta.isOutPage)
            next()
          }
        }
      })
    }

    if (getToken() && userStore.user.token.isValid) {
      reloadStore.reloadRouterMenu(userStore.user.info.id).then(res => {
        routerGuard()
        router.push({path: window.location.href.substring((window.location.href.match(/^http(s)?:\/\/.+?\//ig)[0]).length - 1)})
      }).catch(errResponse => {
        if (errResponse.response.status === 401) {
          router.push({name: config.defaultRoute.notLoginDefaultRouterName})
        } else {
          console.log("src/views/layout/main.vue异常捕获：", errResponse)
        }
      })
    } else {
      routerGuard()
    }

    return {
      ...toRefs(stateData),
      layoutStore,
      userStore,
      fGetOutPageRoute
    }
  }
}
</script>

<style scoped>
#layout-main {
  overflow-x: hidden;
}

#layout-left {
}

#layout-right {
}

#layout-content {
  display: block;
  padding: 4px;
  overflow: hidden;
  height: calc(100vh - 108px);
}
</style>
