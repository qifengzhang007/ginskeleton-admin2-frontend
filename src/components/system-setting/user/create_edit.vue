<template>
  <div>
    <el-drawer
        v-model="propCreateEdit.isShow"
        :title="propCreateEdit.drawerTitle"
        size="55%"
        direction="rtl"
        :before-close="fClose"
        :close-on-click-modal="false"
    >
      <template #default>

        <el-form ref="formRef" :model="propCreateEdit.curdFormData" :rules="rules" label-position="left" label-width="110px">
          <el-row justify="space-between">
            <el-col :span="11">
              <el-form-item label="用户名" prop="user_name">
                <el-input clearable v-model="propCreateEdit.curdFormData.user_name"/>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="姓名" prop="real_name">
                <el-input clearable v-model="propCreateEdit.curdFormData.real_name"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row justify="space-between">
            <el-col :span="11">
              <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="propCreateEdit.curdFormData.pass" placeholder="" show-password/>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="联系方式">
                <el-input clearable v-model="propCreateEdit.curdFormData.phone"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row justify="space-between">
            <el-col :span="11">
              <el-form-item label="状态">
                <el-select v-model="propCreateEdit.curdFormData.status" :fit-input-width="true">
                  <el-option v-for="item in selectStatus" :key="item.value"
                             :label="item.label" :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row justify="space-between">
            <el-col :span="11">
              <el-form-item label="上传头像">
                <UploadFile @fUploadCallback="fUploadCallback"/>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="">
                <Image :propImgShortPath="propCreateEdit.curdFormData.avatar"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row justify="space-between">
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input clearable type="textarea" v-model="propCreateEdit.curdFormData.remark" :rows="3" maxlength="128" show-word-limit/>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </template>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="fCancel">取消</el-button>
          <span class="blank-area"></span>
          <el-button type="primary" @click="fConfirm">确认</el-button>
        </div>
      </template>

    </el-drawer>
  </div>


</template>

<script>
import {reactive, toRefs} from "vue";
import commonFunc from '@/libs/common_func'
import {create, edit} from '@/api/system-setting/user'
import UploadFile from '@/components/common/upload_file.vue'
import {getServerIp} from '@/libs/util'
import Image from '@/components/common/image.vue'

export default {
  name: "CreateEdit",
  components: {
    UploadFile,
    Image
  },
  props: {
    propCreateEdit: Object,
  },
  emits: ['fCreateEditCallback'],
  setup(props, context) {
    const {propCreateEdit} = toRefs(props)

    const stateData = reactive({
      formRef: {},
      selectStatus: commonFunc.SelectStatus,
      imgServerPre: getServerIp(),
      rules: {
        user_name: [{type: 'string', required: true, message: '账户不能为空', trigger: 'blur'}],
        pass: [{type: 'string', required: true, message: '密码不能为空', trigger: 'blur'}],
        real_name: [{type: 'string', required: true, message: '姓名不能为空', trigger: 'blur'}],
      },
    })

    // 文件上传组件相关的属性传递
    //@shortSavePath 文件上传以后返回的短路径，例如：/public/storage/uploaded/2022_05/0ed83dee0302f84e345674ece32d3cb5.png
    //@fullSavePath 文件上传以后返回的全路径，例如：http://127.0.0.1:20201/public/storage/uploaded/2022_05/0ed83dee0302f84e345674ece32d3cb5.png
    const fUploadCallback = (shortSavePath, fullSavePath) => {
      propCreateEdit.value.curdFormData.avatar = shortSavePath
    }

    // 抽屉界面相关的操作
    const fClose = (done) => {
      // 关闭按钮销毁变量
      commonFunc.objInit(propCreateEdit.value.curdFormData)
      done()
    }
    const fCancel = () => {
      // 取消按钮销毁变量
      commonFunc.objInit(propCreateEdit.value.curdFormData)
      propCreateEdit.value.isShow = false
    }
    const fConfirm = () => {
      // 表单参数校验完成后提交
      stateData.formRef.validate((valid, fields) => {
        if (valid) {
          switch (propCreateEdit.value.curdFormData.action) {
            case 'insert':
              create(propCreateEdit.value.curdFormData).then(res => {
                if (res.data.code === 200) {
                  commonFunc.Curd.SuccessTips(res.data.msg)
                  // 刷新主界面数据
                  context.emit('fCreateEditCallback')
                }
              }).catch(errResponse => {
                commonFunc.Curd.FailTips(errResponse.response.data.msg)
              })
              break;
            case 'update':
              edit(propCreateEdit.value.curdFormData).then(res => {
                if (res.data.code === 200) {
                  commonFunc.Curd.SuccessTips(res.data.msg)
                  // 刷新主界面数据
                  context.emit('fCreateEditCallback')
                }
              }).catch(errResponse => {
                commonFunc.Curd.FailTips(errResponse.response.data.msg)
              })
              break;
          }
        } else {
          //  console.log("表单字段验证失败：", fields)
        }
      })
    }

    return {
      ...toRefs(stateData),
      propCreateEdit,

      fUploadCallback,
      fClose,
      fCancel,
      fConfirm
    }
  }
}
</script>

<style scoped>
.drawer-footer {
  display: block;
  text-align: center;

}

.blank-area {
  display: inline-block;
  width: 40px;
}

</style>