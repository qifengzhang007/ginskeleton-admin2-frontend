<template>
  <div>
    <el-input v-model="abc" placeholder="abc" clearable/>
    users 用户管理:{{ userInfo.user.Info.user_name }}, 年龄：{{ userInfo.user.Info.age }}
    <el-button type="primary" @click="userInfo.user.Info.age++">Default</el-button>

    <div>


      <el-icon  :size="80">
        <component  is="Menu" />
        <component is="Delete" />
        <component is="avatar" />
        <component is="grid" />
      </el-icon>
    </div>
  </div>
</template>

<script>
import {list} from '@/api/system-setting/user'
import {useUserStore} from '@/store/system-setting/user'
import {storeToRefs} from 'pinia'
import {reactive, ref} from 'vue'


export default {
  name: "User",
  components: {},
  setup() {

    let tempParams = reactive({
      user_name: '',
      page: 1,
      limit: 20,
      age: 10
    })
    let userInfo = useUserStore()
    let {user, test_params} = storeToRefs(userInfo)

    let abc = ref('')

    list(tempParams).then(res => {
      console.log("请求后端接口返回值：", res.data)
    }).catch(res => {
      console.log("后端接口响应异常：", res)
    })

    const btn_test = () => {
      console.log("btn_test")
      test_params.value++
    }

    return {
      user, test_params,
      userInfo,
      abc,
      // tempParams,

      btn_test
    }

  }
}
</script>

<style scoped>

</style>