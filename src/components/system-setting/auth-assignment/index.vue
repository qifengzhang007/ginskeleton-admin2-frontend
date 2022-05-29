<template>
  <Split :splitRatio="26">
    <template v-slot:left>
      <div :style="{height:bodyHeight}">
        <div class="tableList-area">
          <div class="toolBanner">
            用户姓名:
            <el-input v-model="tableList.searchKeyWords.title" placeholder="关键词" class="keyWordsInput"/>
            <el-button-group v-if="tableList.buttonGroupIsShow">
              <el-button type="primary" @click="fSearch" icon="Search" v-if="tableList.buttonList.select">查询</el-button>
            </el-button-group>
          </div>

          <el-table :highlight-current-row="true" :style="tableList.style" :height="tableList.style.height" :data="tableList.data" ref="tableRef" @row-click="fTableRowClick">
            <el-table-column prop="id" label="id" width="100" sortable fixed/>
            <!--    ↓↓↓↓   业务字段  ↓↓↓↓   -->

            <el-table-column prop="real_name" label="用户姓名" sortable show-overflow-tooltip>
              <template #default="scope">
                <span style="display:block;">{{ scope.row.real_name }}</span>
                <span class="sub-title">{{ scope.row.post_name }}</span>
              </template>
            </el-table-column>
            <!--     ↑↑↑↑   业务字段  ↑↑↑↑   -->
          </el-table>
        </div>
        <div class="paging-area">
          <Paging :propPage="tableList" @fPageCallback="fPageCallback"/>
        </div>

      </div>
    </template>

    <template v-slot:right>
      <el-scrollbar :style="leftTreeContainerFixHeight" :height="leftTreeContainerFixHeight.height">
        <el-tree :expand-on-click-node="false" :highlight-current="true" node-key="id" :current-node-key="1" :props="rightTree.props" :data="rightTree.data" :default-expanded-keys="rightTree.needExpandedKeys">
          <template #default="{ node, data }">
          <span class="tree-node">
            <template v-if="data.node_type==='dept'">
                 <OfficeBuilding style="width: 15px; height: 15px; color: #1178e2"/>
            </template>
             <template v-else-if="data.node_type==='menu'">
                 <Menu style="width: 15px; height: 15px; color: #54a1f6"/>
            </template>
              <template v-else-if="data.node_type==='button'">
                 <SetUp style="width: 15px; height: 15px; color:#045bb4"/>
            </template>
          <span class="tree-node-title">  {{ node.label }}</span>
          </span>
          </template>
        </el-tree>
      </el-scrollbar>
    </template>


  </Split>
</template>

<script>
import Split from '@/components/common/split.vue'
import commonFunc from '@/libs/common_func'
import {reactive, toRefs} from "vue";
import {has_auth_list, show_button, user_list_with_post, view_button_list} from '@/api/system-setting/auth'
import Paging from '@/components/common/paging.vue'
import {useRouter} from "vue-router";

export default {
  name: "AuthAnalysisIndex",
  components: {
    Split,
    Paging,
  },
  setup() {
    const router = useRouter()
    const stateData = reactive({
      // 左侧树形列表相关的变量
      leftTreeContainerFixHeight: {
        overflowY: "auto",
        overflowX: "hidden",
        height: (commonFunc.GetBrowserHeight() - 115) + 'px',
        marginTop: "6px",
      },
      rightTree: {
        props: {
          label: 'title',
          children: 'children',
          isLeaf: 'is_leaf',
        },
        curItemId: 0, // 左侧树当前行的id
        curItemTitle: '',  // 左侧树当前行的标题
        curItemIsLeaf: false,  //左侧当前行节点是否为叶子节点
        data: [],
        needExpandedKeys: [],
      },
      // 右侧table相关的变量
      bodyHeight: commonFunc.BodyHeight(),
      tableRef: {},
      tableList: {
        // 查询相关的关键词
        searchKeyWords: {
          real_name: '',
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
          title: '',
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


    // 右侧内容区域
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
      user_list_with_post(stateData.tableList.searchKeyWords).then(res => {
        stateData.tableList.data = res.data.data.data
        stateData.tableList.total = res.data.data.count
        if (stateData.tableList.data.length > 0) {
          stateData.tableRef.setCurrentRow(stateData.tableList.data[0])
          showUserHasAuthList((stateData.tableList.data[0]).id)
        }

      }).catch(res => {
        stateData.tableList.data = []
        stateData.tableList.total = 0
      })
    }
    // 分页组件回调函数
    const fPageCallback = () => {
      fSearch()
    }

    const fTableRowClick = (row, column, event) => {
      showUserHasAuthList(row.id)
    }
    const showUserHasAuthList = (userId) => {
      has_auth_list(userId).then(res => {
        stateData.rightTree.data = res.data.data
        commonFunc.getNeedExpandTreeNode(res.data.data, stateData.rightTree.needExpandedKeys)
      }).catch(res => {
        stateData.rightTree.data = []
      })
    }


    return {
      ...toRefs(stateData),

      fSearch,
      fPageCallback,
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
  width: 250px;
  margin-left: 4px;
  margin-right: 10px;
}

.sub-title {
  display: block;
  color: #94989f;
}

.tree-node {
  display: inline-block;
  height: 25px;
  line-height: 25px;
  vertical-align: middle;
}

span.tree-node * {
  vertical-align: middle;
}

.tree-node-title {
  padding-left: 6px;
}

</style>