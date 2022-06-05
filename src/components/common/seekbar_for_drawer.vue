<template>
  <div class="seekbar" id="seekbar" @mousedown.stop="fMouseDown($event)"></div>
</template>

<script>
export default {
  name: "SeekbarForDrawer",
  props: {},
  emits: ['fSeekBarCallback'],
  setup(props, context) {

    const fMouseDown = (event) => {
      const p = document.getElementById('seekbar').parentNode
      const startWidth = p.offsetWidth
      document.onselectstart =()=>false
      let endWidth = 0

      const x1 = event.clientX
      document.onmousemove = function (event2) {
        let xOffset = event2.clientX - x1
        endWidth = startWidth - xOffset
      }

      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
        document.onselectstart =()=>true
        // 这里获取拖动后产生的最终宽度： endWidth ， 向上回调即可
        context.emit('fSeekBarCallback', endWidth)
      }
      return false
    }

    return {
      fMouseDown
    }
  }
}
</script>

<style scoped>
.seekbar {
  position: absolute;
  display: inline-block;
  vertical-align: middle;
  left: 0;
  width: 6px;
  height: 100vh;
  border: solid 1px lightgray;
  background: url("../../assets/images/split_flag.png") no-repeat center;
  cursor: w-resize;
  border-radius: 4px;
}
</style>