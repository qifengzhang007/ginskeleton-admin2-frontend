<template>
  <div class="index_style">
    <h1> 主线版本: <a target="_blank" href="https://gitee.com/daitougege/GinSkeleton">GinSkeleton</a></h1>
    <span style="color:lightslategray"> Admin 系统基于 GinSkeleton(v1.5.xx + elementPlus 系列技术栈开发</span>
    <h5>后端仓库地址： <a target="_blank" href="https://gitee.com/daitougege/gin-skeleton-admin-backend">GinSkeleton-Admin-Backend</a></h5>
    <h5>前端仓库地址： <a target="_blank" href="https://gitee.com/daitougege/gin-skeleton-admin-frontend">GinSkeleton-Admin-Frontend</a></h5>
  </div>
</template>


<script>
import {list, show_button, view_button_list} from '@/api/system-setting/user'

export default {
  name: 'Home',
  setup() {

    let tempParams={
      user_name: '',
      page: 1,
      limit: 20
    }

    list(tempParams).then(res => {
     console.log("请求后端接口返回值：",res.data)
    }).catch(res => {
      console.log("后端接口响应异常：",res)
    })

    return {

    }
  }
}

</script>

<style scoped>
.index_style {
  text-align: center;
  color: #5c6b77;
  margin-top:15%;
  font-size:14px;
}
</style>
