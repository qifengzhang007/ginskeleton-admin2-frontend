<template>
  <div id="layout-tab">
    <el-tag v-for="item in tabsStore.tabs.list" :key="item.label" :type="item.type" :relaMenuId="item.relaMenuId" :relaMenuPath="item.path"
            :class="{'mx-1':true,'tab-btn':true}" size="large" effect="plain" :hit="false" closable
            @close="tabsStore.remove(item.relaMenuId,item.isActive)"
            @click="activeTab(item.label,item.relaMenuId,item.path,'tab')"
    >
      <span :class="{circle:true, circleActive:item.isActive}"> </span>
      <span class="tab-title">  {{ item.label }}</span>
    </el-tag>

  </div>

</template>

<script>
import {useTabStore} from "@/store/tabs";
import {useRouter} from 'vue-router'
import {useRouteStore} from "@/store/route";

export default {
  name: "Tabs",
  components: {},
  setup() {
    const tabsStore = useTabStore();
    // const router = useRouter();
    // const routerStore = useRouteStore()

    const activeTab = (menuName, relaMenuId, menuPath,actionFrom) => {
      tabsStore.add(menuName, relaMenuId, menuPath,actionFrom)
    }
    return {
      tabsStore,
      activeTab
    }
  }
}
</script>

<style scoped>
#layout-tab {
  display: block;
  padding-left: 4px;
  height: 42px;
  line-height: 42px;
  vertical-align: middle;
  box-shadow: 0 0 10px #e7e7e7 inset;
  background-color: #f8f8f8;
  width: calc(100% - 2px);
  overflow: hidden;
  z-index: 6;
}

.tab-btn {
  width: 130px;
  margin-right: 4px;
  color: #323337
}

.tab-selected {
  line-height: 32px;
  height: 32px;
  vertical-align: middle;
}

/*设置圆形*/
.circle {
  height: 12px;
  width: 12px;
  border-radius: 6px;
  background-color: #e1e1e1;
  display: inline-block;
  vertical-align: middle;
}

.circleActive {
  background-color: #409eff;
}

.tab-title {
  display: inline-block;
  width: 90px;
  vertical-align: middle;
  text-align: center;
}
</style>

<style>
span.el-tag {
  cursor: default;
}

.el-tag__close:hover {
  background-color: #409eff;
}
</style>