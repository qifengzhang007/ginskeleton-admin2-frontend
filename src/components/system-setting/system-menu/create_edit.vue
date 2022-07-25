<template>
  <div>
    <el-drawer v-model="propCreateEdit.isShow" :before-close="fClose" :close-on-click-modal="false" direction="rtl" :title="propCreateEdit.drawerTitle" :size="drawerSize">
      <template #default>
        <SeekbarForDrawer @fSeekBarCallback="fSeekBarCallback"/>
        <el-form ref="formRef" :inline-message="true" :model="propCreateEdit.curdFormData" :rules="rules" label-position="left" label-width="110px">
          <el-row justify="space-between">
            <el-col :span="11">
              <el-form-item label="上级节点">
                <el-input v-model="propCreateEdit.curdFormData.ftitle" readonly>
                  <template #append>
                    <el-button icon="Search" @click="fSelectSysMenu"/>
                  </template>
                </el-input>
                <el-input type="hidden" clearable v-model="propCreateEdit.curdFormData.fid"/>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="菜单名称" prop="title">
                <el-input clearable v-model="propCreateEdit.curdFormData.title"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row justify="space-between">
            <el-col :span="11">
              <el-form-item label="路由名称" prop="name">
                <el-input clearable v-model="propCreateEdit.curdFormData.name" placeholder="菜单的英文单词，保证唯一性即可"/>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="图标">
                <el-input clearable v-model="propCreateEdit.curdFormData.icon" placeholder="elementPlus 官网直接复制图标单词即可"/>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row justify="space-between">
            <el-col :span="11">
              <el-form-item label="视图组件">
                <el-input clearable v-model="propCreateEdit.curdFormData.component" placeholder="前端视图组件路径，从views目录开始"/>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="排序" prop="sort">
                <el-input type="number" clearable v-model.number="propCreateEdit.curdFormData.sort" placeholder="设置菜单的展示顺序,系统会降序展示"/>
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

          菜单对应页面元素
          <ChildrenTable :propChildrenTable="childrenTable"/>


        </el-form>
      </template>

      <template #footer>
        <div class="drawer-footer">
          <el-button type="primary" @click="fConfirm">{{ propCreateEdit.drawerTitle }}</el-button>
        </div>
      </template>

    </el-drawer>
    <!--   引入组织机构公共组件  -->
    <SelectSysMenu :propSelect="propSelectSysMenu" @fSelectedCallback="fSelectedSysMenuCallback"/>
  </div>
</template>

<script>
import {reactive, toRefs, watch} from "vue";
import commonFunc from '@/libs/common_func'
import SeekbarForDrawer from '@/components/common/seekbar_for_drawer.vue'
import ChildrenTable from '@/components/common/children_table.vue'
import SelectSysMenu from '@/components/common/select_sys_menu.vue'
import {createByJson, editByJson} from "../../../api/system-setting/system_menu";

export default {
  name: "CreateEdit",
  components: {
    SeekbarForDrawer,
    SelectSysMenu,
    ChildrenTable,
  },
  props: {
    propCreateEdit: Object,
  },
  emits: ['fCreateEditCallback'],
  setup(props, context) {
    const {propCreateEdit} = toRefs(props)

    const stateData = reactive({
      drawerSize: '55%',
      formRef: {},
      selectStatus: commonFunc.SelectStatus,
      rules: {
        name: [{type: 'string', required: true, message: '菜单对应的路由名称为必填项', trigger: 'blur'}],
        title: [{type: 'string', required: true, message: '菜单名称为必填项', trigger: 'blur'}],
        sort: [{type: 'number', required: true, message: '排序字段为必填项', trigger: 'blur'}],
      },
      propSelectSysMenu: {
        isShow: false,
        title: "选择上级节点",
        mode: 'one'  // 对于树形列表次参数无效
      },

      // 子表相关的配置
      childrenTable: {
        action: propCreateEdit.value.curdFormData.action,
        allRows: [], // 结果存储数组
        deleted_ids: '', // 子表 被删除的id存储数组,返回文本格式：1,2,3
        //定义一行(条)记录所需要的字段
        rowField: {
          id: 0,
          fr_auth_system_menu_id: 0,
          fr_auth_button_cn_en_id: 0,
          button_name: '',
          request_url: '/',
          request_method: "*",
          remark: ''
        },
        // 定义表的一行需要展示的全部字段格式
        rowFieldFormat: [
          {
            name: '按钮名称',//表单名称
            type: "dialog",//类型{弹出框}
            field: 'button_name',//字段名
            componentPath: './select_button.vue',  // 只能使用相对路径，基准路径就是 ChildrenTable 子表的目录
            width: 4,//宽度,参考 elementPlus 的row、col布局，一个  row 由24个column构成
            //字段与弹出框组件字段的映射
            map: {
              fr_auth_button_cn_en_id: 'id',
              button_name: 'cn_name',
              request_method: 'allow_method'
            },
            isShow:true,
            readonly:false
          },
          {
            name: '接口地址',
            type: "string",
            field: 'request_url',
            width: 9,
            isShow:true,
            readonly:false
          },
          {
            name: '接口允许请求方式',
            type: "selectOption",
            field: 'request_method',
            width: 4,
            options: [
              {
                label: "*",
                value: "*",
              },
              {
                label: "GET",
                value: "GET",
              },
              {
                label: "POST",
                value: "POST",
              },
            ],
            isShow:true,
            readonly:false
          },
          {
            name: '备注',
            type: "string",
            field: 'remark',
            width: 5,
            isShow:true,
            readonly:false
          },
          // {
          //   name: '上传文件',
          //   type: "upload",
          //   field: 'short_path',
          //   width: 5,
          // },
          {
            name: '删除',
            type: "action",
            field: 'action',
            width: 2,
          },
        ],
        // 新增界面可以设置默认填充的值
        defaultListForCreate: [
          {
            id: 0,
            fr_auth_system_menu_id: 0,
            fr_auth_button_cn_en_id: 1,
            button_name: '新增',
            request_url: '/',
            request_method: "POST",
            remark: '',
          },
          {
            id: 0,
            fr_auth_system_menu_id: 0,
            fr_auth_button_cn_en_id: 2,
            button_name: '删除',
            request_url: '/',
            request_method: "POST",
            remark: '',
          },
          {
            id: 0,
            fr_auth_system_menu_id: 0,
            fr_auth_button_cn_en_id: 3,
            button_name: '修改',
            request_url: '/',
            request_method: "POST",
            remark: '',
          },
          {
            id: 0,
            fr_auth_system_menu_id: 0,
            fr_auth_button_cn_en_id: 4,
            button_name: '查询',
            request_url: '/',
            request_method: "GET",
            remark: '',
          }
        ]
      }
    })

    // 监听表单属性变量变化，修改界面如果子表有数据，需要填充子表
    watch(() => propCreateEdit.value.curdFormData, (newCurdFormData, oldCurdFormData) => {
      stateData.childrenTable.action = newCurdFormData.action
      let tmpCount = 0
      if (tmpCount === 0 && newCurdFormData.action === 'update') {
        stateData.childrenTable.allRows = newCurdFormData.button_list
        tmpCount++
      }
    }, {deep: true, immediate: true})


    // 抽屉界面相关的操作
    const fClose = (done) => {
      // 关闭按钮销毁变量
      commonFunc.objInit(propCreateEdit.value.curdFormData)

      stateData.childrenTable.allRows = []
      stateData.childrenTable.deleted_ids = ''
      done()
    }

    // 选择组织机构
    const fSelectSysMenu = () => {
      stateData.propSelectSysMenu.isShow = true
    }
    // 部门岗位公共对象选择结果回调
    // 树形表格：返回结果是一个对象
    const fSelectedSysMenuCallback = (row) => {
      if (row) {
        propCreateEdit.value.curdFormData.fid = row.id
        propCreateEdit.value.curdFormData.ftitle = row.title
      }
    }
    // 抽屉拖动事件回调，
    const fSeekBarCallback = (endWidth) => {
      stateData.drawerSize = endWidth
    }

    const fConfirm = () => {
      // 表单参数校验完成后提交
      stateData.formRef.validate((valid, fields) => {
        if (valid) {
          // 主表单参数校验完成后，继续追加子表参数
          propCreateEdit.value.curdFormData.button_array = stateData.childrenTable.allRows
          propCreateEdit.value.curdFormData.button_delete = stateData.childrenTable.deleted_ids

          switch (propCreateEdit.value.curdFormData.action) {
            case 'insert':
              createByJson(propCreateEdit.value.curdFormData).then(res => {
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
              editByJson(propCreateEdit.value.curdFormData).then(res => {
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
      fSelectSysMenu,
      fSelectedSysMenuCallback,
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
