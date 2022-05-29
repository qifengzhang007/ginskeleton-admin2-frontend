<template>
  <div :style="{width:browseWidth}">
    <Title></Title>
    <Form></Form>
    <Carouse></Carouse>
    <CopyRight></CopyRight>
  </div>
</template>

<script setup>
import Title from '_c/system-setting/login-form/title.vue'
import Carouse from '_c/system-setting/login-form/carouse.vue'
import Form from '_c/system-setting/login-form/form.vue'
import CopyRight from '_c/system-setting/login-form/copy_right.vue'
import commonFunc from '@/libs/common_func'
import {ref} from "vue"

const browseWidth = ref(commonFunc.GetBrowserWidth() + 'px')
</script>

<style scoped>

.system_title {
  margin-top: 150px;
}

#login-carouse {
  text-align: center;
}

/*表单登陆对话框*/
#login-form {
  position: absolute;
  margin-left: calc(100% * 0.7);
  margin-top: 110px;
  z-index: 5;
}

</style>
