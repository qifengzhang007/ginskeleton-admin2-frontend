<template>
  <el-image v-if="propImgShortPath.length>10" :src="imgServerPre+propImgShortPath" fit="contain" class="thumbnail" :style="imgStyle">
    <template #error>
      <div class="image-slot">
        <Picture style="width: 30px; color: lightgray"/>
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
    propImgShortPath: String,  // 该组件只需要传递一个属性 propImgShortPath ，内容格式：/public/storage/...cc7c00c11f.png
    width: {
      type: String,
      default: '100px',
    },
    height: {
      type: String,
      default: '100px',
    },
  },

  setup(props, context) {
    const {propImgShortPath, width, height} = toRefs(props)
    const stateData = reactive({
      imgServerPre: commonFunc.getServerIp(),
      imgStyle: {
        width: width,
        height: height
      }
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