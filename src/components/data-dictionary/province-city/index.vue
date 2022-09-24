<template>
  <Split>

    <template v-slot:left>
      <el-scrollbar :style="leftTreeContainerFixHeight" :height="leftTreeContainerFixHeight.height">
        <el-tree :expand-on-click-node="false" node-key="id" :current-node-key="1"  empty-text="暂无数据"
                 :props="leftTree.props" :load="fASyncData" lazy :highlight-current="true" @node-click="fLeftTreeCurrentChange"/>
      </el-scrollbar>

    </template>

    <template v-slot:right>
      <div :style="{height:bodyHeight}">
        <div class="tableList-area">
          <div class="toolBanner">
            区域名称:
            <el-input clearable v-model="tableList.searchKeyWords.name" placeholder="关键词" class="keyWordsInput"/>
            <el-button-group v-if="tableList.buttonGroupIsShow">
              <el-button type="primary" @click="fSearch" icon="Search" v-if="tableList.buttonList.select">查询</el-button>
              <el-button type="success" @click="fCreateEdit('insert')" icon="Plus" v-if="tableList.buttonList.insert">新增</el-button>
              <el-button type="primary" @click="fCreateEdit('update')" icon="Edit" v-if="tableList.buttonList.update">修改</el-button>
              <el-button type="danger" @click="fDelete" icon="Delete" v-if="tableList.buttonList.delete">删除</el-button>
            </el-button-group>
          </div>

          <el-table border :highlight-current-row="true" :style="tableList.style" :height="tableList.style.height" :data="tableList.data" ref="tableRef" @row-click="fTableRowClick">
            <TableHeader1/>
            <!--    ↓↓↓↓   业务字段  ↓↓↓↓   -->

            <el-table-column prop="name" label="区域名称" sortable show-overflow-tooltip/>
            <el-table-column prop="node_level" label="节点深度" sortable show-overflow-tooltip/>
            <el-table-column prop="sort" label="排序" sortable show-overflow-tooltip/>

            <!--     ↑↑↑↑   业务字段  ↑↑↑↑   -->
            <el-table-column prop="status" label="状态" sortable show-overflow-tooltip :formatter="fFormatter"/>
            <TableHeader2/>
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


  </Split>
</template>

<script>
import Split from '@/components/common/split.vue'
import commonFunc from '@/libs/common_func'
import {reactive, toRefs, watch} from "vue";
import {destroy, getSubListByFid, list} from '@/api/data-dictionary/province_city'
import {show_button, view_button_list} from '@/api/system-setting/auth'
import DeleteDataDialog from '@/components/common/delete_data_dialog.vue'
import Paging from '@/components/common/paging.vue'
import TableHeader1 from '@/components/common/table_header1.vue'
import TableHeader2 from '@/components/common/table_header2.vue'
import CreateEdit from './create_edit.vue'
import {useRouter} from "vue-router";

export default {
  name: "ProvinceCityIndex",
  components: {
    Split,
    TableHeader1,
    TableHeader2,
    CreateEdit,
    DeleteDataDialog,
    Paging,
  },
  setup() {
    const router = useRouter()
    const stateData = reactive({
      // 左侧树形列表相关的变量
      leftTreeContainerFixHeight: {
        overflowY: "auto",
        overflowX: "hidden",
        height: (commonFunc.GetBrowserHeight() - 140) + 'px',
        marginTop: "6px",
      },
      leftTree: {
        props: {
          label: 'title',
          children: 'children',
          isLeaf: 'is_leaf',
        },
        curItemId: 0,
        curItemTitle: '',
        data: [],
      },
      // 右侧table相关的变量
      bodyHeight: commonFunc.BodyHeight(),
      tableRef: {},
      tableList: {
        // 查询相关的关键词
        searchKeyWords: {
          name: '',
          fid: 0,
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
          fid: '',
          ftitle: '',
          name: '',
          sort: 0,
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

// 树形列表异步加载数据
    const fASyncData = (node, resolve) => {
      let curNodeId = node.level === 0 ? 0 : node.data.id
      // 左侧树数据初始化
      getSubListByFid(curNodeId).then(res => {
        stateData.leftTree.data = res.data.data
        if (node.level === 0 && stateData.leftTree.data.length > 0) {
          stateData.leftTree.curItemId = (stateData.leftTree.data[0]).id
          stateData.leftTree.curItemTitle = (stateData.leftTree.data[0]).title
          stateData.tableList.searchKeyWords.fid = stateData.leftTree.curItemId
        }
        return resolve(
            stateData.leftTree.data
        )
      }).catch(errRes => {
        return resolve([])
      })
    }
    // 树形节点选中、改变事件
    const fLeftTreeCurrentChange = (curItem, node, event) => {
      if (curItem.id > 0 && stateData.leftTree.curItemId !== curItem.id) {
        stateData.leftTree.curItemId = curItem.id
        stateData.leftTree.curItemTitle = curItem.title
        stateData.tableList.searchKeyWords.fid = stateData.leftTree.curItemId
      }
    }

    watch(() => stateData.leftTree.curItemId, (newItemId, oldItemId) => {
      if (newItemId > 0 && oldItemId !== undefined) {
        fSearch()
      }
    })
    // 右侧内容区域
    //界面元素鉴权后显示
    const btnElementAuth = () => {
      view_button_list(router.currentRoute.value.meta.id).then(res => {
        show_button(res.data.data, stateData.tableList.buttonList)
        stateData.tableList.buttonGroupIsShow = true
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
          stateData.curdCreateEdit.curdFormData.fid = stateData.leftTree.curItemId
          stateData.curdCreateEdit.curdFormData.ftitle = stateData.leftTree.curItemTitle
          delete stateData.curdCreateEdit.curdFormData['id']  // 去除新增无关的字段 id
          break;
        case 'update':
          const selectedArray = stateData.tableRef.getSelectionRows()
          if (commonFunc.Curd.EditCheck(selectedArray.length === 1)) {
            stateData.curdCreateEdit.curdFormData = Object.assign({}, selectedArray[0])
            if (stateData.curdCreateEdit.curdFormData.ftitle === undefined || stateData.curdCreateEdit.curdFormData.ftitle === '') {
              stateData.curdCreateEdit.curdFormData.ftitle = stateData.leftTree.curItemTitle
            }
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
      if (commonFunc.Curd.DestroyCheckForOneItem(resObj.id.length === 1)) {
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


    return {
      ...toRefs(stateData),
      fASyncData,
      fLeftTreeCurrentChange,

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

.keyWordsInput {
  width: 150px;
  margin-left: 4px;
  margin-right: 10px;
}

</style>
