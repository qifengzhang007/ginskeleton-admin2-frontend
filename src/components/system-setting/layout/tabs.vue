<template>
  <div id="layout-tab">
    <el-tag
        v-for="item in items"
        :key="item.label"
        :type="item.type"
        :class="{'mx-1':true,'tab-btn':true}"
        size="large"
        effect="plain"
        :hit="false"
        closable
    >
      <span class="circle" v-if="item.label==='组织机构'"> </span>
      <span class="tab-title">  {{ item.label }}</span>
    </el-tag>

  </div>

</template>

<script>
import {ref} from 'vue'

export default {
  name: "Tabs",
  components: {},
  setup() {

    const items = [
      {type: 'info', label: 'Tag - helloworld 1'},
      {type: 'info', label: 'Tag helloworld 2'},
      {type: 'info', label: 'Tag helloworld 3'},
      {type: 'info', label: '岗位成员'},
      {type: 'info', label: '组织机构'},
    ]
    let tabIndex = 2
    const editableTabsValue = ref('2')
    let editableTabs = ref([
      {
        title: 'Tab 1',
        name: '1',
        content: 'Tab 1 content',
      },
      {
        title: 'Tab 2',
        name: '2',
        content: 'Tab 2 content',
      },
    ])


    return {
      items
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
  background-color: #409eff;
  display: inline-block;
  vertical-align: middle;
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