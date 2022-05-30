<template>
  <el-image v-if="propImgShortPath.length>10" :src="imgServerPre+propImgShortPath" fit="contain" class="thumbnail">
    <template #error>
      <div class="image-slot">
        <Picture style="width: 80px; color: lightgray" />
      </div>
    </template>
  </el-image>
</template>

<script>
import {reactive, toRefs} from 'vue'
import commonFunc from '@/libs/common_func'

export default {
  name: "Image",
  props: {
    propImgShortPath: String,
  },

  setup(props, context) {
    const {propImgShortPath} = toRefs(props)
    const stateData = reactive({
      imgServerPre: commonFunc.getServerIp()
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