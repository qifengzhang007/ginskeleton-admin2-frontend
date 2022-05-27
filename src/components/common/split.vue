<template>
  <div>
    <div class="split-left-area">
      <slot name="left"></slot>
    </div>

    <div class="split-vertical-line" id="split-vertical-line">
      <span class="split-flags"></span>
    </div>

    <div class="split-right-area">
      <slot name="right"></slot>
    </div>
  </div>

</template>

<script>
import {onMounted} from "vue";

export default {
  name: "Split",
  props: [],
  setup(props, context) {

    onMounted(() => {
      const leftDom = document.querySelector("div.split-left-area")
      const rightDom = document.querySelector("div.split-right-area")

      const splitLineEle = document.getElementById("split-vertical-line")
      // 拖拽分隔条的起步是鼠标按下事件
      splitLineEle.addEventListener("mousedown", (event) => {
        const leftDomWidth = leftDom.offsetWidth
        const rightDomWidth = rightDom.offsetWidth
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

          if (leftDom.offsetWidth < 50) {
            leftDom.style.width = '50px'
            document.onmouseup()
          }
        }

      })
    })

    return {}
  }
}
</script>

<style scoped>

.split-left-area {
  display: inline-block;
  width: calc(16%);
  height: 100vh;
}

.split-vertical-line {
  display: inline-block;
  width: 6px;
  border-left: 1px solid #e1e1e1;
  border-right: 1px solid #e1e1e1;
  height: 100vh;
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

.split-right-area {
  display: inline-block;
  width: calc(83%);
  height: 100vh
}

</style>