<template>
  <el-dialog v-model="propSelect.isShow" :title="propSelect.title.length>1?propSelect.title:'选择菜单'" width="450px" draggable top="15vh" @close="fClose">

    <template #header>
      <div>
        <el-icon>
          <Search color="#606060FF"/>
        </el-icon>
        {{ propSelect.title }}
      </div>
    </template>
    <el-scrollbar :style="leftTreeContainerFixHeight" :height="leftTreeContainerFixHeight.height">
      <el-tree :expand-on-click-node="false" node-key="id" :current-node-key="1" :props="leftTree.props" :load="fASyncData" lazy :highlight-current="true" @node-click="fLeftTreeCurrentChange"/>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="propSelect.isShow = false">取消</el-button>
        <el-button type="primary" @click="fSelected">  确认   </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import commonFunc from '@/libs/common_func'
import {reactive, toRefs} from 'vue'
import {getSubListByFid} from '@/api/system-setting/system_menu'

export default {
  name: 'SelectSysMenu',
  components: {},
  props: {
    propSelect: Object,       // 属性名必须固定为： propSelect
  },
  emits: ['fSelectedCallback'],       // 向上回调函数名必须固定为：fSelectedCallback
  setup(props, context) {
    const {propSelect} = toRefs(props)

    const stateData = reactive({
      // 左侧树形列表相关的变量
      leftTreeContainerFixHeight: {
        overflowY: "auto",
        overflowX: "hidden",
        height: '500px',
        marginTop: "6px",
      },
      leftTree: {
        props: {
          label: 'title',
          children: 'children',
          isLeaf: 'is_leaf',
        },
        curSelectedItem: {},
        data: [],
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
        stateData.leftTree.curSelectedItem = curItem
      }
    }
    //选中确认事件
    const fSelected = () => {
      if (!stateData.leftTree.curSelectedItem) {
        commonFunc.Curd.FailTips("请至少选中一条才能确认")
        return
      }
      context.emit('fSelectedCallback', stateData.leftTree.curSelectedItem)
      propSelect.value.isShow = false
    }

    const fClose = () => {
    }

    return {
      ...toRefs(stateData),
      propSelect,

      fASyncData,
      fLeftTreeCurrentChange,
      fClose,
      fSelected,
    }
  }

}
</script>

<style scoped>

</style>