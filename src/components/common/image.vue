<template>
  <img v-if="propShortPath.length>10" :src="fullPath" class="thumbnail" alt=""/>
</template>

<script>
import {reactive, toRefs, watch} from 'vue'
import {getServerIp} from '@/libs/util'

export default {
  name: "Image",
  props: {
    propShortPath: Object,
  },
  setup(props, context) {
    const propShortPath = toRefs(props)
    console.log("propShortPath",propShortPath)
    const stateData = reactive({
      fullPath: getServerIp() + propShortPath
    })

    watch(propShortPath, (n, o) => {
      console.log("监听路径变化：", n, o)
    })
    return {
      ...toRefs(stateData),
      propShortPath
    }
  }
}
</script>

<style scoped>
.thumbnail {
  max-width: 200px;
  max-height: 200px;
}
</style>