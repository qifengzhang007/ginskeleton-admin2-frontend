<template>
  <div :style="{height:bodyHeight}">

    <div class="tableList-area">
      <div class="toolBanner">
        用户名:
        <el-input v-model="tableList.searchKeyWords.user_name" placeholder="关键词" class="keyWordsInput"/>
        <el-button-group v-if="tableList.buttonGroupIsShow">
          <el-button type="primary" @click="fSearch" icon="Search" v-if="tableList.buttonList.select">查询</el-button>
          <el-button type="success" @click="fCreateEdit('insert')" icon="Plus" v-if="tableList.buttonList.insert">新增</el-button>
          <el-button type="primary" @click="fCreateEdit('update')" icon="Edit" v-if="tableList.buttonList.update">修改</el-button>
          <el-button type="danger" @click="fDelete" icon="curdDelete" v-if="tableList.buttonList.delete">批量删除</el-button>
        </el-button-group>
      </div>

      <el-table border :style="tableList.style" :height="tableList.style.height" :data="tableList.data" ref="tableRef" @row-click="fTableRowClick">
        <el-table-column type="selection" width="50" align="center" id="t500"/>
        <el-table-column prop="id" label="id" width="100" sortable fixed/>
        <!--    ↓↓↓↓   业务字段  ↓↓↓↓   -->

        <el-table-column prop="user_name" label="用户名" sortable show-overflow-tooltip/>
        <el-table-column prop="real_name" label="姓名" sortable show-overflow-tooltip/>
        <el-table-column prop="phone" label="联系方式" sortable show-overflow-tooltip/>
        <el-table-column prop="status" label="状态" sortable show-overflow-tooltip :formatter="fFormatter"/>
        <el-table-column prop="login_times" label="登陆次数" sortable show-overflow-tooltip/>
        <el-table-column prop="last_login_ip" label="最近登陆ip" sortable show-overflow-tooltip/>

        <!--     ↑↑↑↑   业务字段  ↑↑↑↑   -->
        <el-table-column prop="remark" label="备注" sortable show-overflow-tooltip/>
        <el-table-column prop="created_at" label="创建时间" width="150" sortable show-overflow-tooltip/>
        <el-table-column prop="updated_at" label="更新时间" width="150" sortable show-overflow-tooltip/>
      </el-table>
    </div>
    <div class="paging-area">
      <Paging :propPage="tableList" @fPageCallback="fPageCallback"/>

    </div>

    <!--    新增、修改组件： 需要两个必传参数：1.属性变量、2.新增或者修改后的回调函数 -->
    <CreateEdit :propCreateEdit="curdCreateEdit" @fCreateEditCallback="fCreateEditCallback"/>
    <!--    删除组件 : 需要两个必传参数：1.属性变量、2.删除后的回调函数  -->
    <DeleteDataDialog :propDelete="curdDelete" @fDeleteCallback="fDeleteCallback"/>

  </div>
</template>

<script>
import commonFunc from '@/libs/common_func'
import {useRouter} from 'vue-router'
import {reactive, toRefs} from 'vue'
import {destroy, list} from '@/api/system-setting/user'
import {show_button, view_button_list} from '@/api/system-setting/auth'
import DeleteDataDialog from '@/components/common/delete_data_dialog.vue'
import CreateEdit from './create_edit.vue'
import Paging from '@/components/common/paging.vue'


export default {
  name: "UserIndex",
  components: {
    CreateEdit,
    DeleteDataDialog,
    Paging,
  },
  setup() {
    const router = useRouter()
    const stateData = reactive({
      bodyHeight: commonFunc.BodyHeight(),
      tableRef: {},
      tableList: {
        // 查询相关的关键词
        searchKeyWords: {
          user_name: '',
          page: 1,
          limit: 20
        },
        total: 0, // 数据总条数
        data: [],
        buttonGroupIsShow: false,
        // 本页面可展示的按钮列表全部先定义
        buttonList: {
          insert: 'insert',
          delete: 'delete',
          update: 'update',
          select: 'select',
        },
        style: {
          width: '100%',
          height: commonFunc.TableHeight(),
        }
      },
      // 新增、修改时，传递给子组件的属性变量，
      curdCreateEdit: {
        isShow: false,
        drawerTitle: '',
        curdFormData: {
          action: '',
          id: 0,
          real_name: '',
          user_name: '',
          pass: '',
          phone: '',
          avatar: '',
          status: 1,
          remark: '',
        }
      },
      // 删除数据时，传递给子组件的属性变量，数据格式如下：
      curdDelete: {
        actionName: '',
        isShow: false,
        ids: '',
        delCounts: 0,
        // ↓↓↓  请求接口后服务端返回的 code 和 msg
        serverResCode: 0,
        serverResMsg: '',
      }
    })

    //界面元素鉴权后显示
    const btnElementAuth = () => {
      view_button_list(router.currentRoute.value.meta.id).then(res => {
        show_button(res.data.data, stateData.tableList.buttonList)
        stateData.tableList.buttonGroupIsShow = true
        fSearch()
      }).catch(res => {
      })
    }
    btnElementAuth()

    // 查询相关======================
    const fSearch = () => {
      list(stateData.tableList.searchKeyWords).then(res => {
        stateData.tableList.data = res.data.data.data
        stateData.tableList.total = res.data.data.count
      }).catch(res => {
        stateData.tableList.data = []
        stateData.tableList.total = 0
      })
    }
    // 分页组件回调函数
    const fPageCallback = () => {
      fSearch()
    }

// 新增、修改相关
    const fCreateEdit = (action) => {
      switch (action) {
        case 'insert':
          stateData.curdCreateEdit.curdFormData.status = 1
          delete stateData.curdCreateEdit.curdFormData['id']  // 去除新增无关的字段 id
          break;
        case 'update':
          const selectedArray = stateData.tableRef.getSelectionRows()
          if (commonFunc.Curd.EditCheck(selectedArray.length === 1)) {
            stateData.curdCreateEdit.curdFormData = Object.assign({}, selectedArray[0])
            stateData.curdCreateEdit.curdFormData.pass = '####*****####'  // 密码掩码，该掩码表示不对密码做任何操作
            delete stateData.curdCreateEdit.curdFormData['created_at']  // 去除更新无关的字段
            delete stateData.curdCreateEdit.curdFormData['updated_at']
          } else {
            return
          }
          break;
      }
      stateData.curdCreateEdit.curdFormData.action = action
      stateData.curdCreateEdit.drawerTitle = commonFunc.CurdActionName[action]
      stateData.curdCreateEdit.isShow = true
    }
    const fCreateEditCallback = () => {
      fSearch()
    }


    // 删除之前收集请求参数、弹出对话框
    const fDelete = () => {
      const selectedArray = stateData.tableRef.getSelectionRows()
      const resObj = commonFunc.GetArrayColumnConcatVals(selectedArray, 'id')
      if (commonFunc.Curd.DestroyCheckForMoreItem(resObj.id.length >= 1)) {
        stateData.curdDelete.actionName = commonFunc.CurdActionName['delete']
        stateData.curdDelete.isShow = true
        stateData.curdDelete.ids = resObj.id.toString()
        stateData.curdDelete.delCounts = resObj.id.length
      }
    }
    //请求接口删除数据
    const fDeleteCallback = () => {
      destroy(stateData.curdDelete.ids).then(res => {
        stateData.curdDelete.serverResCode = res.data.code
        stateData.curdDelete.serverResMsg = res.data.msg
        fSearch()

      }).catch(errResponse => {
        stateData.curdDelete.serverResCode = errResponse.response.status
        stateData.curdDelete.serverResMsg = errResponse.response.data.msg
      })
    }

    // 格式化 status 字段
    const fFormatter = (row, column) => {
      return commonFunc.StatusMap[row.status]
    }
    const fTableRowClick = (row, column, event) => {
      stateData.tableRef.toggleRowSelection(row, undefined)
    }

    // 导出变量、函数
    return {
      ...toRefs(stateData),

      fSearch,
      fPageCallback,
      fCreateEdit,
      fCreateEditCallback,
      fDelete,
      fDeleteCallback,
      fFormatter,
      fTableRowClick
    }
  }
}
</script>

<style scoped>

.tableList-area {
  padding-left: 4px;
}

.toolBanner {
  display: flex;
  align-items: center;
  padding: 2px 0 6px 2px;
}

.paging-area {
  margin: 2px 0;
  text-align: center;
  vertical-align: middle;
}

.keyWordsInput {
  width: 150px;
  margin-left: 4px;
  margin-right: 10px;
}

</style>