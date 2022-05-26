<template>
  <img v-if="propImgShortPath.length>10" :src="imgServerPre+propImgShortPath" class="thumbnail" alt="图片缺失"/>
</template>

<script>
import {reactive, toRefs} from 'vue'
import {getServerIp} from '@/libs/util'

export default {
  name: "Image",
  props: {
    propImgShortPath: String,
  },
  
  setup(props, context) {
    const {propImgShortPath} = toRefs(props)
    const stateData = reactive({
      imgServerPre: getServerIp()
    })
    
    return {
      ...toRefs(stateData),
      propImgShortPath
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