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
    }
  },
  setup(props, context) {

    const {title} = toRefs(props)

    const stateData = reactive({
      groupIconIsOpen: true,  // 分组面板的图标默认是否打开

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
  background: #EAF2FCFF;
}

.group-icon-line {
  display: inline-block;
  vertical-align: middle;
  width: calc(100% - 26px);
  height: 26px;
  background: #EAF2FCFF;
}

.group-panel-area {
  padding: 2px 4px ;
  border: solid 1px;
  border: #e8e8e8 solid 1px;
}

</style>
