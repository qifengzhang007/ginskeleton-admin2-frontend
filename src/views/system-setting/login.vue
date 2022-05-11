<template>
  <div :style="{width:browseWidth}">
    <Title></Title>
    <Form ref="loginForm"></Form>
    <Carouse></Carouse>
    <CopyRight></CopyRight>
  </div>
</template>

<script>
import Title from '_c/system-setting/login-form/title.vue'
import Carouse from '_c/system-setting/login-form/carouse.vue'
import Form from '_c/system-setting/login-form/form.vue'
import CopyRight from '_c/system-setting/login-form/copy_right.vue'
import common_func from '@/libs/common_func'
import {reactive, ref, toRefs} from "vue"

export default {
  name: 'Loign',
  components: {
    Title,
    Carouse,
    Form,
    CopyRight
  },
  setup() {
    const loginForm = ref(null)
    const state = reactive({
      browseWidth: common_func.GetBrowserWidth() + 'px',

    })
    const handleSubmit = () => {
    }
    return {
      ...toRefs(state),
      loginForm,
      handleSubmit
    }

  }
}
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
