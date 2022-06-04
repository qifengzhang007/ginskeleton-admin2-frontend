<template>
  <div>
    <el-drawer v-model="propCreateEdit.isShow" :before-close="fClose" :close-on-click-modal="false" direction="rtl" :title="propCreateEdit.drawerTitle" :size="drawerSize">
      <template #default>
        <SeekbarForDrawer @fSeekBarCallback="fSeekBarCallback"/>
        <el-row >
          <el-col :span="4" style="border-right: solid 1px #d7dae2;margin-right: 10px;height: calc(100vh - 136px)">
            <el-result title="" :sub-title="propCreateEdit.curdFormData.real_name">
              <template #icon>
                <Image :propImgShortPath="propCreateEdit.curdFormData.avatar" width="100px" height="100px"  style="border-radius: 50%;border: #b0d2f8 solid 1px"/>
              </template>
            </el-result>
          </el-col>
          <el-col :span="18">
            <el-form ref="formRef" :inline-message="true" :model="propCreateEdit.curdFormData" :rules="rules" label-position="left" label-width="110px">
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
              </el-row>

              <el-row justify="space-between">
                <el-col :span="24">
                  <el-form-item label="备注">
                    <el-input clearable type="textarea" v-model="propCreateEdit.curdFormData.remark" :rows="10" maxlength="128" show-word-limit/>
                  </el-form-item>
                </el-col>
              </el-row>

            </el-form>
          </el-col>
        </el-row>

      </template>

      <template #footer>
        <div class="drawer-footer">
          <el-button type="primary" @click="fConfirm">{{ propCreateEdit.drawerTitle }}</el-button>
        </div>
      </template>

    </el-drawer>
  </div>
</template>

<script>
import {reactive, toRefs} from "vue";
import commonFunc from '@/libs/common_func'
import SeekbarForDrawer from '@/components/common/seekbar_for_drawer.vue'
import { personalEdit} from '@/api/system-setting/user'
import UploadFile from '@/components/common/upload_file.vue'
import Image from '@/components/common/image.vue'



export default {
  name: "Profile",
  components: {
    SeekbarForDrawer,
    UploadFile,
    Image,

  },
  props: {
    propCreateEdit: Object,
  },
  emits: ['fCreateEditCallback'],
  setup(props, context) {
    const {propCreateEdit} = toRefs(props)

    const stateData = reactive({
      drawerSize: '60%',
      formRef: {},
      selectStatus: commonFunc.SelectStatus,
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

    // 抽屉拖动事件回调，
    const fSeekBarCallback = (endWidth) => {
      stateData.drawerSize = endWidth
    }

    // 抽屉界面相关的操作
    const fClose = (done) => {
      // 关闭按钮销毁变量
      commonFunc.objInit(propCreateEdit.value.curdFormData)
      done()
    }

    const fConfirm = () => {
      // 表单参数校验完成后提交
      stateData.formRef.validate((valid, fields) => {
        if (valid) {
          personalEdit(propCreateEdit.value.curdFormData).then(res => {
            if (res.data.code === 200) {
              commonFunc.Curd.SuccessTips(res.data.msg)
              // 刷新主界面数据
              context.emit('fCreateEditCallback')
            }
          }).catch(errResponse => {
            commonFunc.Curd.FailTips(errResponse.response.data.msg)
          })
        } else {
          //  console.log("表单字段验证失败：", fields)
        }
      })
    }

    return {
      ...toRefs(stateData),
      propCreateEdit,

      fSeekBarCallback,
      fUploadCallback,
      fClose,
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

</style>