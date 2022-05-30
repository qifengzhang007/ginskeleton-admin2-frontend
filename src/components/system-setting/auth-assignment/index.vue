<template>
  <Split>
    <template v-slot:left>
      <el-scrollbar :style="leftTreeContainerFixHeight" :height="leftTreeContainerFixHeight.height">
        <el-tree :expand-on-click-node="false" node-key="id" :default-expanded-keys="[1]" :current-node-key="1"
                 :props="leftTree.props" :load="fASyncData" lazy :highlight-current="true" @node-click="fLeftTreeCurrentChange"/>
      </el-scrollbar>
    </template>

    <template v-slot:right>
      <Split :splitRatio="40">
        <template v-slot:left>
          <el-scrollbar :style="leftTreeContainerFixHeight" :height="leftTreeContainerFixHeight.height">
            <el-tree :expand-on-click-node="false" :highlight-current="true" node-key="system_menu_id" :current-node-key="1" show-checkbox
                     :props="leftTree.props" :data="assignedAuth.data" :default-expanded-keys="assignedAuth.needExpandedKeys">
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

        <template v-slot:right>

          <Split :splitRatio="15">
            <template v-slot:left>
              <div v-show="assignAuthEle.buttonWarp" :style="assignAuthEle.style">
                <el-button type="primary" @click="fAssignAuth" icon="ArrowLeft" v-if="assignAuthEle.buttonList.insert">分配</el-button>
                <div style="height: 10px"></div>
                <el-button type="danger" @click="fDestroyAuth" icon="ArrowRight" v-if="assignAuthEle.buttonList.delete">删除</el-button>
              </div>
            </template>

            <template v-slot:right>
              <el-scrollbar :style="leftTreeContainerFixHeight" :height="leftTreeContainerFixHeight.height">
                <el-tree :expand-on-click-node="false" :highlight-current="true" node-key="system_menu_id" :current-node-key="1" show-checkbox
                         :props="leftTree.props" :data="allAuth.data" :default-expanded-keys="allAuth.needExpandedKeys">
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

      </Split>

    </template>


  </Split>
</template>

<script>
import Split from '@/components/common/split.vue'
import commonFunc from '@/libs/common_func'
import {reactive, toRefs, watch} from "vue";
import {getAllSystemMenuTree, getAssignedSystemMenuTree, show_button, view_button_list} from '@/api/system-setting/auth'
import Paging from '@/components/common/paging.vue'
import {useRouter} from "vue-router";
import {getSubListByFid} from '@/api/system-setting/organization'

export default {
  name: "AuthAssignmentIndex",
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
      leftTree: {
        props: {
          label: 'title',
          children: 'children',
          isLeaf: 'is_leaf',
        },
        curItemId: 0, // 左侧树当前行的id
        curItemTitle: '',  // 左侧树当前行的标题
        data: [],
      },
      assignedAuth: {
        data: [],   //已分配的权限列表
        needExpandedKeys: [],  // 默认需要展开的菜单keys（id数组）
      },
      allAuth: {
        data: [], //全部权限列表（待分配权限列表）
        needExpandedKeys: [],  // 默认需要展开的菜单keys（id数组）
      },
      assignAuthEle: {
        buttonWarp: false,
        buttonList: {
          insert: 'insert',
          delete: 'delete'
        },
        style: {
          textAlign: 'center',
          marginTop: parseInt((commonFunc.GetBrowserHeight() - 110)  / 2 -35 ) + 'px'
        }
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
      }
    }

    // 监听组织机构节点变化，同步改变已分配权限列表
    watch(() => stateData.leftTree.curItemId, (newItemId, oldItemId) => {
      if (newItemId > 0 && oldItemId !== undefined) {
        getAssignedAuthList(newItemId)
      }
    }, {deep: true, immediate: true})

    // 右侧内容区域
    //界面元素鉴权后显示
    const btnElementAuth = () => {
      view_button_list(router.currentRoute.value.meta.id).then(res => {
        show_button(res.data.data, stateData.assignAuthEle.buttonList)
        stateData.assignAuthEle.buttonWarp = true
      }).catch(res => {
      })
    }

    // 根据部门、岗位id获取已经分配的系统菜单、按钮
    const getAssignedAuthList = (orgPostId) => {
      if (orgPostId > 0) {
        getAssignedSystemMenuTree(orgPostId).then(res => {
          stateData.assignedAuth.data = res.data.data.data
          commonFunc.getNeedExpandTreeNodeForAssignedAuth(res.data.data.data, stateData.assignedAuth.needExpandedKeys)
        }).catch(res => {
          stateData.assignedAuth.data = []
        })
      } else {
        stateData.assignedAuth.data = []
      }
    }

    // 查询全部权限列表
    const getAllAuthList = () => {
      getAllSystemMenuTree().then(res => {
        stateData.allAuth.data = res.data.data.data
        commonFunc.getNeedExpandTreeNodeForAssignedAuth(res.data.data.data, stateData.allAuth.needExpandedKeys)
      }).catch(res => {
        stateData.allAuth.data = []
      })
    }

    // 分配权限
    const fAssignAuth = () => {

    }
    // 删除权限
    const fDestroyAuth = () => {

    }

    // 页面打开需要执行一次的函数
    getAllAuthList()
    btnElementAuth()

    return {
      ...toRefs(stateData),

      fASyncData,
      fLeftTreeCurrentChange,
      fAssignAuth,
      fDestroyAuth,
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