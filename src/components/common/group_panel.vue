<template>
  <div class="group-panel-area">
    <div class="group-panel-head" @click="groupIconIsOpen=!groupIconIsOpen">
      <span class="group-icon">
        <template v-if="groupIconIsOpen">
         <el-icon><ArrowDown/></el-icon>
        </template>
        <template v-else>
       <el-icon><ArrowRight/></el-icon>
        </template>
      </span>
      <span class="group-icon-line"> {{ title }}  </span>
    </div>

    <div class="group-panel-content" v-show="groupIconIsOpen">
      <!--插槽占位，使用时会被外部内容替换-->
      <slot name="groupContent"></slot>
    </div>
  </div>

</template>

<script>
import {reactive, toRefs} from "vue";

export default {
  name: "GroupPanel",
  props: {
    // 指定分组的图标序号
    title: {
      type: String,
      default: "基本分组"
    },
    panelIsOpen: {
      type: Boolean,
      default: true
    }
  },
  setup(props, context) {

    const {title, panelIsOpen} = toRefs(props)

    const stateData = reactive({
      groupIconIsOpen: panelIsOpen,  // 分组面板默认是否打开
    })

    return {
      ...toRefs(stateData),
      title
    }
  }
}
</script>

<style scoped>

.group-panel-head {
  display: block;
  height: 26px;
  line-height: 26px;
  vertical-align: middle;
  margin-bottom: 8px;
}

.group-icon {
  display: inline-block;
  width: 26px;
  height: 26px;
  text-align: center;
  vertical-align: middle;
  background: #F3F3F3FF;
}

.group-icon-line {
  display: inline-block;
  vertical-align: middle;
  width: calc(100% - 26px);
  height: 26px;
  background: #F3F3F3FF;
}

.group-panel-area {
  padding: 2px 4px;
  border: solid 1px #F3F3F3FF;
  margin-bottom: 10px;
}

</style>
