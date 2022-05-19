<template>
  <div id="login-form">
    <el-form ref="loginForm" :model="form" :rules="rules">

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

        <!--        <img v-if="imgShow" @click="flushCaptcha" style="width:150px;height:30px;float:left;margin-left:20px" :src="'data:image/png;base64,'+imgData" alt="">-->
        <!--        <img v-if="imgShow" @click="flushCaptcha" style="width:150px;height:30px;float:left;margin-left:20px"-->
        <!--             src="http://127.0.0.1:20201/captcha/hXjVBcqkaCM7mXX23lMQ.png" alt="获取验证码出错">-->
      </el-form-item>

      <el-form-item>
        <el-button type="primary" style="width: calc(100%)" @click="handleSubmit">登录</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import {login} from '@/api/system-setting/user'
import {get, getImg} from "@/api/system-setting/captcha"
import config from '@/config/index'
import {reactive, ref, toRefs} from "vue";
import {useRouteStore} from "@/store/system-setting/route";
import {useUserStore} from "@/store/system-setting/user";
import {useMenuStore} from "@/store/system-setting/menu";
import {setToken} from '@/libs/util'
import {useReloadStore} from "@/store/system-setting/reload";

export default {
  name: 'Form',
  components: {},
  setup() {
    let routerStore = useRouteStore()
    let menuStore = useMenuStore()
    let userStore = useUserStore()

    const loginForm = ref(null)
    const stateData = reactive({
      imgShow: false,
      captchaId: "",
      captchaUrl: "",
      captchaFlushUrl: "",
      imgData: "",
      isShow: true,
      form: {
        user_name: config.login_params.user_name,
        pass: config.login_params.pass,
        captcha_id: "",
        captcha_value: ""
      },
      rules: {
        username: [
          {required: 'true', message: '账户不能为空', trigger: 'blur'}
        ],
        pass: [
          {required: 'true', message: '密码不能为空', trigger: 'blur'}
        ]
      }
    });

    //  获取验证码
    const getCaptcha = () => {
      get().then(res => {
        stateData.form.captcha_id = res.data.data.id
        stateData.captchaUrl = res.data.data.img_url
        stateData.captchaFlushUrl = res.data.data.refresh
        getImg(stateData.captchaUrl).then(res => {
          stateData.imgData = new Buffer(res.data, 'binary').toString('base64')
          stateData.imgShow = true
        })
        stateData.form.captcha_value = ""
      })
    }
    // 根据验证码ID刷新验证码，获取下一个值
    const flushCaptcha = () => {
      getImg(stateData.captchaFlushUrl).then(res => {
        stateData.imgData = new Buffer(res.data, 'binary').toString('base64')
        stateData.form.captcha_value = ""
      })
    }
    // 登陆参数、验证码参数一起提交
    const handleSubmit = () => {
      // if (stateData.form.captcha_value.length === 0) {
      //   // this.$Message.error('请输入验证码')
      //   alert('请输入验证码')
      //   return
      // }
      loginForm.value.validate((valid) => {
        if (valid) {
          login(stateData.form).then(res => {

            console.log("请求失败也会到这里？？？？", res)   //  这里后续探究一下，为什么请求失败会到这里？？？

            if (res && res.data.code === 200) {
              // 先初始化用户的id和token
              userStore.setUserBaseInfo(res.data.data.userId, res.data.data.token)
              setToken(res.data.data.token)
              const reloadStore = useReloadStore()     // 实例化
              reloadStore.reloadRouterMenu(res.data.data.userId).then(res => {
                routerStore.getRoute.push(config.defaultRoute.loginDefaultRouterName)
              }).catch(err => {
                console.log(err)
              })
            }
          }).catch(err => {
            console.log("登陆失败", err)
          })
        } else {
          alert('最基本的参数校验失败')
        }
      })

    }
    //getCaptcha()
    return {
      ...toRefs(stateData),
      loginForm,
      getCaptcha,
      flushCaptcha,
      handleSubmit
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
