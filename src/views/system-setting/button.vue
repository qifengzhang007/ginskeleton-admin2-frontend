<template>

  <div>
    <el-input  v-model="btn_name" placeholder="按钮--001"  clearable  />
按钮管理
  </div>

</template>

<script>
import {ref} from "vue";


export default {
  name: "Button",
  components:{},
  setup() {
    const  btn_name= ref('Button')

    return {
      btn_name
    }
  }
}
</script>

<style scoped>

</style>