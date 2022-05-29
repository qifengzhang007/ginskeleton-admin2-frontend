<template>
  <div>
    <el-drawer v-model="propCreateEdit.isShow" :before-close="fClose" :close-on-click-modal="false" direction="rtl" :title="propCreateEdit.drawerTitle" size="55%">
      <template #default>
        <el-form ref="formRef" :model="propCreateEdit.curdFormData" :rules="rules" label-position="left" label-width="110px">
          <el-row justify="space-between">
            <el-col :span="11">
              <el-form-item label="岗位名称" prop="org_post_id">
                <el-input clearable v-model="propCreateEdit.curdFormData.post_name" readonly>
                  <template #append>
                    <el-button icon="Search" @click="fSelectOrgPost"/>
                  </template>
                </el-input>
                <el-input type="hidden" clearable v-model="propCreateEdit.curdFormData.org_post_id"/>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="用户名" prop="user_id">
                <el-input clearable v-model="propCreateEdit.curdFormData.user_name" readonly>
                  <template #append>
                    <el-button icon="Search" @click="fSelectUser"/>
                  </template>
                </el-input>
                <el-input type="hidden" clearable v-model="propCreateEdit.curdFormData.user_id"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row justify="space-between">
            <el-col :span="11">
              <el-form-item label="状态">
                <el-select v-model="propCreateEdit.curdFormData.status" :fit-input-width="true">
                  <el-option v-for="item in selectStatus" :key="item.value" :label="item.label" :value="item.value"/>
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

    <!--   引入用户公共组件  -->
    <SelectUser :propSelect="propSelectUser" @fSelectedCallback="fSelectedUserCallback"/>
    <!--   引入组织机构公共组件  -->
    <SelectOrgPost :propSelect="propSelectOrgPost" @fSelectedCallback="fSelectedOrgPostCallback"/>
  </div>
</template>

<script>
import {reactive, toRefs} from "vue";
import commonFunc from '@/libs/common_func'
import {create, edit} from '@/api/system-setting/org_post_members'
import SelectUser from '@/components/common/select_user.vue'
import SelectOrgPost from '@/components/common/select_org_post.vue'

export default {
  name: "CreateEdit",
  components: {
    SelectUser,
    SelectOrgPost
  },
  props: {
    propCreateEdit: Object,
  },
  emits: ['fCreateEditCallback'],
  setup(props, context) {
    const {propCreateEdit} = toRefs(props)
    const formCreateEdit = Object.assign({}, propCreateEdit.value)
// console.log("属性副本：",formCreateEdit)
    const stateData = reactive({
      formRef: {},
      selectStatus: commonFunc.SelectStatus,
      rules: {
        org_post_id: [{type: 'number', min: 1, required: true, message: '岗位为必填项', trigger: 'blur'}],
        user_id: [{type: 'number', min: 1, required: true, message: '用户名名称为必填项', trigger: 'blur'}],
      },
      propSelectUser: {
        isShow: false,
        title: "选择用户",
        mode: 'one'  // 数据选择模式： one=单选（选择后返回的结果只有一条），more(允许选择多条数据)，选择结果是一个数组
      },
      propSelectOrgPost: {
        isShow: false,
        title: "选择 部门 -> 岗位",
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
      done()
    }
// 确认事件
    const fConfirm = () => {
      console.log("action:",propCreateEdit.value.curdFormData.action)
      // 表单参数校验完成后提交
      stateData.formRef.validate((valid, fields) => {
        if (valid) {
          console.log("action2:",propCreateEdit.value.curdFormData.action)
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

    // 公共组件
    // 1.选择用户
    const fSelectUser = () => {
      stateData.propSelectUser.isShow = true
    }
    // 用户模块公共对象选择结果回调
    // 水平表格：如果是单选模式（one），返回一行对象类型的数据，如果是多选模式（more），返回一个对象数组
    const fSelectedUserCallback = (row) => {
      if (row) {
        propCreateEdit.value.curdFormData.user_id = row.id
        propCreateEdit.value.curdFormData.user_name = row.user_name
        propCreateEdit.value.curdFormData.real_name = row.real_name
      }
    }
    // 2..选择岗位
    const fSelectOrgPost = () => {
      stateData.propSelectOrgPost.isShow = true
    }
    // 部门岗位公共对象选择结果回调
    // 树形表格：返回结果是一个对象
    const fSelectedOrgPostCallback = (row) => {
      if (row) {
        propCreateEdit.value.curdFormData.org_post_id = row.id
        propCreateEdit.value.curdFormData.post_name = row.title
      }
    }

    return {
      ...toRefs(stateData),
      propCreateEdit,
      formCreateEdit,

      fUploadCallback,
      fClose,
      fConfirm,
      fSelectOrgPost,
      fSelectUser,
      fSelectedUserCallback,
      fSelectedOrgPostCallback
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