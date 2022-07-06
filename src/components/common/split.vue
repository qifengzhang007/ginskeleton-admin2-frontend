<template>
  <div>
    <div :style="splitLeftArea" class="split-left-area">
      <slot name="left"></slot>
    </div>

    <div class="split-vertical-line" id="split-vertical-line">
      <span class="split-flags"></span>
    </div>

    <div :style="splitRightArea" class="split-right-area">
      <slot name="right"></slot>
    </div>
  </div>

</template>

<script>
import commonFunc from '@/libs/common_func'
import {onMounted, reactive, toRefs} from "vue";

export default {
  name: "Split",
  props: {
    // 左侧分割比例，单位：百分比，右侧会自动计算，不需要指定
    splitRatio: {
      type: Number,
      default: 16
    }
  },
  setup(props, context) {

    const {splitRatio} = toRefs(props)

    const stateData = reactive({
      splitLeftArea: {
        display: 'inline-block',
        width: `calc(${splitRatio.value}%)`,
        height: '100vh'
      },
      splitRightArea: {
        display: 'inline-block',
        width: `calc(${100 - splitRatio.value - 1}%)`,
        height: '100vh',
        paddingLeft:'6px',
      }
    })

    // 页面元素加载结束开始处理分割逻辑相关的拖拽事件
    onMounted(() => {
      const leftDom = document.querySelector("div.split-left-area")
      const rightDom = document.querySelector("div.split-right-area")

      const splitLineEle = document.getElementById("split-vertical-line")
      // 拖拽分隔条的起步是鼠标按下事件
      splitLineEle.addEventListener("mousedown", (event) => {
        const leftDomWidth = leftDom.offsetWidth
        const rightDomWidth = rightDom.offsetWidth
        const leftRightTotalWidth=leftDomWidth+rightDomWidth

        const x1 = event.clientX

        // 注册鼠标放开事件
        document.onmouseup = (e3) => {
          document.onmousemove = null;
          document.onmouseup = null;
        }
        // 注册鼠标移动事件
        document.onmousemove = (event2) => {
          // let x2 = event2.clientX
          let xOffset = event2.clientX - x1
          leftDom.style.width = (leftDomWidth + xOffset) + 'px'
          rightDom.style.width = (rightDomWidth - xOffset) + 'px'

          // 限制左侧最小宽度为50px
          if (leftDom.offsetWidth < 50) {
            leftDom.style.width = '50px'
            rightDom.style.width = (leftRightTotalWidth-50)+'px'
            document.onmouseup()
          }
          // 限制右侧最小宽度为50px
          if (rightDom.offsetWidth < 50) {
            rightDom.style.width = '50px'
            leftDom.style.width = (leftRightTotalWidth-50)+'px'
            document.onmouseup()
          }

        }
      })

    })

    return {
      ...toRefs(stateData),
    }
  }
}
</script>

<style scoped>

.split-vertical-line {
  position: absolute;
  top:120px;
  display: inline-block;
  width: 6px;
  border-left: 1px solid #e1e1e1;
  border-right: 1px solid #e1e1e1;
  height: calc(100vh - 140px);
  cursor: w-resize;
}

.split-flags {
  display: inline-block;
  height: 60px;
  width: 100%;
  position: relative;
  top: 40%;
  background: url("../../assets/images/split_flag.png");
}

</style>
