<template>
  <div id="left-menu">
    <el-aside class="aside">
      <div class="left-logo">
        <div>
          <img src="@/assets/images/logo.png" alt="logo">
          <span>{{config.cmsTitle}}</span>
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
        <template v-for="(item,index)  in menuStore.menu.list">
          <template v-if="item.has_sub_node">
            <el-sub-menu :index="'/'+item.path" class="menu-level1">
              <template #title>
                <el-icon>
                  <component :is="item.icon"/>
                </el-icon>
                <span>{{ item.title }}</span>
              </template>
              <template v-for="(itemL2,index2)  in item.children">
                <template v-if="itemL2.has_sub_node">
                  <el-sub-menu :index="'/'+item.path+'/'+itemL2.path" class="menu-level2">
                    <template #title>
                      <el-icon>
                        <component v-if="itemL2.icon.length>=2" :is="itemL2.icon"/>
                      </el-icon>
                      <span>{{ itemL2.title }}</span>
                    </template>
                    <el-menu-item :index="'/'+item.path+'/'+itemL2.path+'/'+itemL3.path" v-for="itemL3  in itemL2.children" class="menu-level3">
                      <template #title>
                        <el-icon>
                          <component v-if="itemL3.icon.length>=2" :is="itemL3.icon"/>
                        </el-icon>
                        <span>     {{ itemL3.title }} </span>
                      </template>
                    </el-menu-item>
                  </el-sub-menu>
                </template>
                <template v-else>
                  <el-menu-item :index="'/'+item.path+'/'+itemL2.path" :menuName="itemL2.title" class="menu-level2">
                    <template #title>
                      <el-icon>
                        <component v-if="itemL2.icon.length>=2" :is="itemL2.icon"/>
                      </el-icon>
                      <span>     {{ itemL2.title }} </span>
                    </template>
                  </el-menu-item>
                </template>
              </template>


            </el-sub-menu>
          </template>
          <template v-else>
            <el-menu-item :index="'/'+item.path" :key="index" class="menu-level1">
              <el-icon>
                <component v-if="item.icon.length>=2" :is="item.icon"/>
              </el-icon>
              <span>{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>

      </el-menu>
    </el-aside>
  </div>
</template>

<script>
import {useMenuStore} from '@/store/system-setting/menu'
import {useHeaderBannerStore} from '@/store/system-setting/header_banner'
import {reactive, toRefs} from "vue";
import config  from "@/config/index";

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
      config,
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