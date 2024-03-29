<template>
  <div>
    <el-drawer v-model="propCreateEdit.isShow" :before-close="fClose" :close-on-click-modal="false" direction="rtl" :title="propCreateEdit.drawerTitle" :size="drawerSize">
      <template #default>
        <SeekbarForDrawer @fSeekBarCallback="fSeekBarCallback"/>
        <el-form ref="formRef" :model="propCreateEdit.curdFormData" :rules="rules" label-position="left" label-width="110px">
          <el-row justify="space-between">
            <el-col :span="11">
              <el-form-item label="上级节点" prop="fid">
                <el-input clearable v-model="propCreateEdit.curdFormData.ftitle" readonly>
                  <template #append>
                    <el-button icon="Search" @click="fSelectProvinceCity"/>
                  </template>
                </el-input>
                <el-input type="hidden" clearable v-model="propCreateEdit.curdFormData.fid"/>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="区域名称" prop="name">
                <el-input clearable v-model="propCreateEdit.curdFormData.name"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row justify="space-between">
            <el-col :span="11">
              <el-form-item label="状态">
                <el-select v-model="propCreateEdit.curdFormData.status" :fit-input-width="true">
                  <el-option v-for="item in selectStatus" :key="item.value"   :label="item.label" :value="item.value"   />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="排序">
                <el-input type="number" clearable v-model="propCreateEdit.curdFormData.sort" placeholder=""/>
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
<!--    引入省份城市公共组件-->
    <SelectProvinceCity :propSelect="propSelectProvinceCity" @fSelectedCallback="fSelectedProvinceCityCallback"/>
  </div>
</template>

<script>
import {reactive, toRefs} from "vue";
import commonFunc from '@/libs/common_func'
import SeekbarForDrawer from '@/components/common/seekbar_for_drawer.vue'
import {create, edit} from '@/api/data-dictionary/province_city'
import SelectProvinceCity  from '@/components/common/select_province_city.vue'

export default {
  name: "CreateEdit",
  components: {
    SeekbarForDrawer,
    SelectProvinceCity
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
        fid: [{type: 'number', min:1,required: true, message: '上级节点为必填项', trigger: 'blur'}],
        name: [{type: 'string',required: true, message: '区域名称为必填项', trigger: 'blur'}],
      },
      // 选择省份城市，公共组件
      propSelectProvinceCity: {
        isShow: false,
        title: "选择省份城市",
        mode: 'one'  // 对于树形列表次参数无效
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
    // 2选择省份城市
    const fSelectProvinceCity = () => {
      stateData.propSelectProvinceCity.isShow = true
    }
    // 省份城市公共对象选择结果回调
    // 树形表格：返回结果是一个对象
    const fSelectedProvinceCityCallback = (row) => {
      if (row) {
        propCreateEdit.value.curdFormData.fid = row.id
        propCreateEdit.value.curdFormData.ftitle = row.title
      }
    }

    return {
      ...toRefs(stateData),
      propCreateEdit,

      fSeekBarCallback,
      fUploadCallback,
      fClose,
      fConfirm,
      fSelectProvinceCity,
      fSelectedProvinceCityCallback
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