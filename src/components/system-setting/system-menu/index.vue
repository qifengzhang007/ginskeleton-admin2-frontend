<template>
  <Split>

    <template v-slot:left>
      <el-scrollbar :style="leftTreeContainerFixHeight" :height="leftTreeContainerFixHeight.height">
        <el-tree :expand-on-click-node="false" node-key="id" :current-node-key="0" empty-text="暂无数据" :default-expanded-keys="[0]"
                 :props="leftTree.props" :load="fASyncData" lazy :highlight-current="true" ref="leftTreeRef" @node-click="fLeftTreeCurrentChange"/>
      </el-scrollbar>
    </template>

    <template v-slot:right>
      <div :style="{height:bodyHeight}">
        <div class="tableList-area">
          <div class="toolBanner">
            菜单名称:
            <el-input clearable v-model="tableList.searchKeyWords.title" placeholder="关键词" class="keyWordsInput"/>
            <el-button-group v-if="tableList.buttonGroupIsShow">
              <el-button type="primary" @click="fSearch" icon="Search" v-if="tableList.buttonList.select">查询</el-button>
              <el-button type="success" @click="fCreateEdit('insert')" icon="Plus" v-if="tableList.buttonList.insert">新增</el-button>
              <el-button type="primary" @click="fCreateEdit('update')" icon="Edit" v-if="tableList.buttonList.update">修改</el-button>
              <el-button type="danger" @click="fDelete('delete')" icon="Delete" v-if="tableList.buttonList.delete">删除</el-button>
            </el-button-group>
          </div>

          <el-table border :highlight-current-row="true" :style="tableList.style" :height="tableList.style.height" :data="tableList.data" ref="tableRef"
                    @row-click="fTableRowClick">
            <TableHeader1/>
            <!--    ↓↓↓↓   业务字段  ↓↓↓↓   -->

            <el-table-column prop="title" label="菜单名称" width="120" sortable show-overflow-tooltip/>
            <el-table-column prop="icon" label="图标" width="110" sortable show-overflow-tooltip/>
            <el-table-column prop="name" label="路由名称" width="180" sortable show-overflow-tooltip/>
            <el-table-column prop="component" label="视图组件路径" width="280" sortable show-overflow-tooltip/>
            <el-table-column prop="is_out_page" label="是否为外部页面" width="140" sortable show-overflow-tooltip align="center">
              <template #default="scope">
                <template v-if="scope.row.node_level>=2">
                  <el-tag :type="scope.row.is_out_page?'danger':''">{{ fIsOutPageFormatter(scope.row.is_out_page) }}</el-tag>
                </template>
                <template v-else>
                  <el-tag>-</el-tag>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="80" sortable show-overflow-tooltip/>
            <el-table-column prop="button_list" label="菜单对应页面按钮" width="280" sortable show-overflow-tooltip>
              <template #default="scope">
                <el-button size="small" plain :color="item.button_color" :key="scope.$index+'_'+index" v-for="(item,index)  in scope.row.button_list" @click.stop="">
                  {{ item.button_name }}
                </el-button>
              </template>
            </el-table-column>
            <!--     ↑↑↑↑   业务字段  ↑↑↑↑   -->
            <el-table-column prop="status" label="状态" width="80" sortable show-overflow-tooltip :formatter="fFormatter"/>
            <el-table-column prop="remark" label="备注" sortable show-overflow-tooltip/>
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
import {show_button, view_button_list} from '@/api/system-setting/auth'
import DeleteDataDialog from '@/components/common/delete_data_dialog.vue'
import Paging from '@/components/common/paging.vue'
import {useRouter} from "vue-router";
import TableHeader1 from '@/components/common/table_header1.vue'
import TableHeader2 from '@/components/common/table_header2.vue'
import {destroy, getSubListByFid, list, menu_mount_auth_button} from '@/api/system-setting/system_menu'
import CreateEdit from './create_edit.vue'

export default {
  name: "SystemMenuIndex",
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
      leftTreeRef: {},
      leftTree: {
        props: {
          label: 'title',
          children: 'children',
          isLeaf: 'is_leaf',
        },
        curItemId: 0, // 左侧树当前行的id
        curItemTitle: '',  // 左侧树当前行的标题
        curItemIsLeaf: false,  //左侧当前行节点是否为叶子节点
        data: [],
      },
      // 右侧table相关的变量
      bodyHeight: commonFunc.BodyHeight(),
      tableRef: {},
      tableList: {
        // 查询相关的关键词
        searchKeyWords: {
          title: '',
          fid: 0,
          page: 1,
          limit: 20
        },
        total: 0, // 数据总条数
        data: [],  // 后台接口返回的table 列表数据
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
          title: '',
          component: '',
          is_out_page: 0,
          status: 1,
          sort: 1,
          remark: '',
          button_array: [],   // 子表数据
          button_delete: '',   // 子表在修改时可能被删除的按钮ids
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
      if (node.level === 0) {
        stateData.leftTree.curItemId = 0
        stateData.leftTree.curItemIsLeaf = false
        stateData.leftTree.curItemTitle = '菜单虚拟根节点'
        stateData.tableList.searchKeyWords.fid = 0
        fSearch()
        return resolve(
            [{
              id: 0,
              fid: 0,
              title: "菜单虚拟根节点",
              is_leaf: false,
              children: []
            }]
        )
      } else {
        // 左侧树鼠标点击箭头加载下一级
        getSubListByFid(curNodeId).then(res => {
          stateData.leftTree.data = res.data.data
          if (node.level === 0 && stateData.leftTree.data.length > 0) {
            stateData.leftTree.curItemIsLeaf = (stateData.leftTree.data[0]).is_leaf
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
    }
    // 树形节点选中、改变事件
    const fLeftTreeCurrentChange = (curItem, node, event) => {
      if (stateData.leftTree.curItemId !== curItem.id) {
        stateData.leftTree.curItemIsLeaf = curItem.is_leaf
        stateData.leftTree.curItemId = curItem.id
        stateData.leftTree.curItemTitle = curItem.title
        stateData.tableList.searchKeyWords.fid = stateData.leftTree.curItemId
      }
    }
    // 监听左侧树选中节点值改变后触发右侧数据刷新
    watch(() => stateData.leftTree.curItemId, (newItemId, oldItemId) => {
      if (stateData.leftTree.curItemIsLeaf === false && newItemId >= 0 && oldItemId !== undefined) {
        fSearch()
      } else if (stateData.leftTree.curItemIsLeaf) {
        stateData.tableList.data = []
      }
    }, {deep: true, immediate: true})


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
          let selectedRows = stateData.tableRef.getSelectionRows()
          if (commonFunc.Curd.EditCheck(selectedRows.length === 1)) {
            stateData.curdCreateEdit.curdFormData = Object.assign({}, selectedRows[0])
            //  修改数据时，加载子表界面数据
            menu_mount_auth_button(selectedRows[0].id).then(res => {
              if (res.data.data !== null) {
                stateData.curdCreateEdit.curdFormData.button_list = res.data.data
              } else {
                stateData.curdCreateEdit.curdFormData.button_list = []
              }
            })

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
    const fDelete = (action) => {
      const selectedArray = stateData.tableRef.getSelectionRows()
      const resObj = commonFunc.GetArrayColumnConcatVals(selectedArray, 'id')
      if (commonFunc.Curd.DestroyCheckForOneItem(resObj.id.length === 1)) {
        stateData.curdDelete.actionName = commonFunc.CurdActionName[action]
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
    // 格式化 is_out_page字段
    const fIsOutPageFormatter = (isOutPage) => {
      if (isOutPage) {
        return "是"
      } else {
        return "否"
      }
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
      fIsOutPageFormatter,
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
