<template>
  <div class="system_title_common system_title">
    <img src="@/assets/images/system_logo.png" alt="图片缺失"/>
    <span>{{ title }}</span>
  </div>
</template>

<script>
import config from '@/config/index'
import {reactive, toRefs} from "vue";

export default {
  name: 'Title',
  setup() {
    const stateData = reactive({
      title: config.loginTitle
    })
    return {
      ...toRefs(stateData)
    }
  }
}
</script>

<style scoped>

.system_title {
  display: block;
  margin-left: 370px;
  width: 600px;
  height: 50px;
  line-height: 50px;
  vertical-align: middle;
  font-size: 18px;
}

.system_title_common {
  height: 50px;
  line-height: 50px;
}

div.system_title > span {
  display: inline-block;
  vertical-align: top;
  padding-left: 10px;
}

</style>
