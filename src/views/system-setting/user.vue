<template>
  <div>
    <el-input v-model="testParams.user_name" placeholder="abc" clearable/>

    <el-button type="primary" @click="testParams.age++">Default</el-button>
    <br/>
    <br/>
    用户姓名:{{ testParams.user_name }}
    <br/>
    <br/>
    用户年龄:{{ testParams.age }}
    <div>


      <el-icon :size="80">
        <component is="Menu"/>
        <component is="Delete"/>
        <component is="avatar"/>
        <component is="grid"/>
      </el-icon>
    </div>
  </div>
</template>

<script>
import {reactive} from 'vue'


export default {
  name: "User",
  components: {},
  setup() {

    let testParams = reactive({
      user_name: '',
      age: 10
    })


    return {
      testParams
    }

  }
}
</script>

<style scoped>

</style>