<template>
  <div>
    <el-drawer v-model="propCreateEdit.isShow" :before-close="fClose" :close-on-click-modal="false" direction="rtl" :title="propCreateEdit.drawerTitle" :size="drawerSize">
      <template #default>
        <SeekbarForDrawer @fSeekBarCallback="fSeekBarCallback"/>
        <el-form ref="formRef" :inline-message="true" :model="propCreateEdit.curdFormData" :rules="rules" label-position="left" label-width="110px">
          <el-row justify="space-between">
            <el-col :span="11">
              <el-form-item label="按钮名" prop="cn_name">
                <el-input clearable v-model="propCreateEdit.curdFormData.cn_name"/>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="英文编码" prop="en_name">
                <el-input clearable v-model="propCreateEdit.curdFormData.en_name"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row justify="space-between">
            <el-col :span="11">
              <el-form-item label="按钮颜色" prop="color">
                <el-input v-model="propCreateEdit.curdFormData.color" placeholder="这里的颜色只用于后台菜单展示，不作用于前端" style="width: 90%"/>
                <el-color-picker v-model="propCreateEdit.curdFormData.color"/>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="请求方式" prop="allow_method">
                <el-input clearable v-model="propCreateEdit.curdFormData.allow_method" placeholder="GET、POST等"/>
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
import {create, edit} from '@/api/system-setting/button'

export default {
  name: "CreateEdit",
  components: {
    SeekbarForDrawer
  },
  props: {
    propCreateEdit: Object,
  },
  emits: ['fCreateEditCallback'],
  setup(props, context) {
    const {propCreateEdit} = toRefs(props)

    const stateData = reactive({
      drawerSize:'55%',
      formRef: {},
      selectStatus: commonFunc.SelectStatus,
      rules: {
        cn_name: [{type: 'string', required: true, message: '按钮名为必填项', trigger: 'blur'}],
        en_name: [{type: 'string', required: true, message: '按钮英文编码为必填项', trigger: 'blur'}],
        color: [{type: 'string', required: true, message: '按钮颜色为必填项', trigger: 'blur'}],
        allow_method: [{type: 'string', required: true, message: '请求方式为必填项', trigger: 'blur'}],
      },
    })

    // 抽屉界面相关的操作
    const fClose = (done) => {
      // 关闭按钮销毁变量
      commonFunc.objInit(propCreateEdit.value.curdFormData)
      done()
    }

    // 抽屉拖动事件回调，
    const fSeekBarCallback = (endWidth) => {
      stateData.drawerSize = endWidth
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

      fSeekBarCallback,
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

.blank-area {
  display: inline-block;
  width: 40px;
}

</style>
