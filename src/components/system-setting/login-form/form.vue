<template>
  <div id="login-form">
    <el-form ref="loginFormRef" :model="form" :rules="rules">

      <el-form-item prop="user_name">
        <el-input v-model="form.user_name" placeholder="请输入用户名">
          <template #prefix>
            <el-icon class="el-input__icon">
              <avatar/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password>
          <template #prefix>
            <el-icon class="el-input__icon">
              <key/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="captcha_value">
        <el-input v-model="form.captcha_value" placeholder="输入验证码" style="width: 230px">
          <template #prefix>
            <el-icon class="el-input__icon">
              <grid/>
            </el-icon>
          </template>
        </el-input>

        <img @click="getCaptcha" style="width:130px;height:30px;float:left;margin-left:20px"
             :src="captcha.captchaFullUrl" alt="获取验证码出错">
      </el-form-item>

      <el-form-item>
        <el-button type="primary" style="width: calc(100%)" @click="submitForm(loginFormRef)">登录</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import {login} from '@/api/system-setting/user'
import {getCaptchaInfo} from "@/api/system-setting/captcha"
import config from '@/config/index'
import {reactive, ref, toRefs} from "vue";
import {useRouteStore} from "@/store/system-setting/route";
import {useUserStore} from "@/store/system-setting/user";
import {getServerIp, setToken} from '@/libs/util'
import {useReloadStore} from "@/store/system-setting/reload";
import {ElMessage} from 'element-plus'

export default {
  name: 'Form',
  components: {},
  setup() {
    let routerStore = useRouteStore()
    let userStore = useUserStore()

    const loginFormRef = ref(null)
    const stateData = reactive({
      captcha: {
        captchaId: "",
        captchaShortUrl: "",
        captchaFullUrl: "",
        captchaRefreshUrl: "",
        captchaTmpRefreshUrl: "",
      },
      form: {
        user_name: config.login_params.user_name,
        pass: config.login_params.pass,
        captcha_id: "",
        captcha_value: ""
      },
      rules: {
        username: [
          {type: 'string', required: 'true', message: '账户不能为空', trigger: 'blur'}
        ],
        pass: [
          {type: 'string', required: 'true', message: '密码不能为空', trigger: 'blur'}
        ],
        captcha_value: [
          {type: 'string', required: 'true', len: 4, message: '验证码不能为空', trigger: 'blur'}
        ]
      }
    });

    //  获取验证码
    const getCaptcha = () => {
      getCaptchaInfo().then(res => {
        if (res.status === 200) {
          stateData.captcha.captchaId = res.data.data.id
          stateData.captcha.captchaShortUrl = res.data.data.img_url
          stateData.captcha.captchaFullUrl = getServerIp() + res.data.data.img_url
          stateData.captcha.captchaRefreshUrl = getServerIp() + res.data.data.refresh
          stateData.form.captcha_id = stateData.captcha.captchaId
        }
      })
    }

    // 登陆参数、验证码参数一起提交
    const submitForm = (formRef) => {
      formRef.validate((valid) => {
        if (valid) {
          login(stateData.form).then(res => {
            if (res.status === 200 && res.data.code === 200) {
              // 先初始化用户的id和token
              userStore.setUserBaseInfo(res.data.data.id, res.data.data.token)
              setToken(res.data.data.token)
              const reloadStore = useReloadStore()     // 实例化
              reloadStore.reloadRouterMenu(res.data.data.id).then(res => {
                routerStore.getRoute.push(config.defaultRoute.loginDefaultRouterName)
              }).catch(err => {
                console.log(err)
              })
            }
          }).catch(errResponse => {
            ElMessage({
              type: "error",
              message: '登录失败：' + errResponse.response.data.msg
            })
            console.log("登陆失败", errResponse)
            // alert('登录失败：' + errResponse.response.data.msg)
            getCaptcha()
          })
        } else {
          // alert('最基本的参数校验失败')
          ElMessage.error("参数校验失败")
        }
      })

    }
    getCaptcha()
    return {
      ...toRefs(stateData),
      loginFormRef,
      getCaptcha,
      submitForm
    }
  }
}
</script>

<style scoped>
#login-form {
  display: inline-block;
  padding: 30px 20px;
  text-align: center;
  width: 420px;
  height: 310px;
  line-height: 310px;
  vertical-align: middle;
  background: #F9F9F9;
  border-radius: 6px;
}
</style>
