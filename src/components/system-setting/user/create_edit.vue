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

        <el-form :model="propCreateEdit.curdFormData" class="demo-form-inline" label-position="left" label-width="110px">

          <el-row justify="space-between">
            <el-col :span="11">
              <el-form-item label="用户名">
                <el-input clearable v-model="propCreateEdit.curdFormData.user_name"/>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="姓名">
                <el-input clearable v-model="propCreateEdit.curdFormData.real_name"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row justify="space-between">
            <el-col :span="11">
              <el-form-item label="密码">
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
              <el-form-item label="头像">
                <el-input clearable v-model="propCreateEdit.curdFormData.avatar"/>
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

export default {
  name: "CreateEdit",
  components: {},
  props: {
    propCreateEdit: Object,
  },
  emits: ['fCreateEditCallback'],
  setup(props, context) {
    const {propCreateEdit} = toRefs(props)

    const stateData = reactive({
      selectStatus: commonFunc.SelectStatus,
    })


    // 抽屉界面相关的操作
    const fClose = (done) => {
      // 关闭销毁变量
      done()
    }
    const fCancel = () => {
      // 关闭销毁变量
      propCreateEdit.value.isShow = false
    }
    const fConfirm = () => {
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

    }

    return {
      propCreateEdit,
      ...toRefs(stateData),

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