<template>
  <el-dialog v-model="propSelect.isShow" :title="propSelect.title.length>1?propSelect.title:'选择按钮'" width="56%" draggable top="15vh" @close="fClose">
    <template #header>
      <div>
        <el-icon>
          <Search color="#606060FF"/>
        </el-icon>
        {{ propSelect.title.length > 1 ? propSelect.title : '选择按钮' }}
      </div>
    </template>
    <div>

      <div class="tableList-area">
        <div class="toolBanner">
          按钮名称:
          <el-input v-model="tableList.searchKeyWords.button_name" placeholder="关键词" class="keyWordsInput"/>
          <el-button type="primary" @click="fSearch" icon="Search">查询</el-button>
        </div>

        <el-table border :style="tableList.style" :height="tableList.style.height" :data="tableList.data" ref="tableRef" @row-click="fTableRowClick">
          <TableHeader1/>
          <!--    ↓↓↓↓   业务字段  ↓↓↓↓   -->

          <el-table-column prop="cn_name" label="按钮名" sortable show-overflow-tooltip/>
          <el-table-column prop="en_name" label="英文编码" sortable show-overflow-tooltip/>
          <el-table-column prop="color" label="按钮颜色" sortable show-overflow-tooltip/>
          <el-table-column prop="allow_method" label="允许请求方式" sortable show-overflow-tooltip/>

          <!--     ↑↑↑↑   业务字段  ↑↑↑↑   -->

          <TableHeader2/>
        </el-table>
      </div>
      <div class="paging-area">
        <Paging :propPage="tableList" @fPageCallback="fSearch"/>
      </div>

    </div>
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
import TableHeader1 from './table_header1.vue'
import TableHeader2 from './table_header2.vue'
import Paging from '@/components/common/paging.vue'
import {list} from  '@/api/system-setting/button'

export default {
  name: 'SelectButton',
  components: {
    TableHeader1,
    TableHeader2,
    Paging,


  },
  props: {
    propSelect: Object,   // 属性名必须固定为： propSelect
  },
  emits: ['fSelectedCallback'],  // 向上回调函数名必须固定为：fSelectedCallback
  setup(props, context) {
    const {propSelect} = toRefs(props)
    const stateData = reactive({
      bodyHeight: '600px',
      tableRef: {},
      tableList: {
        // 查询相关的关键词
        searchKeyWords: {
          button_name: '',
          page: 1,
          limit: 20
        },
        total: 0, // 数据总条数
        data: [],
        buttonGroupIsShow: false,
        // 本页面可展示的按钮列表全部先定义
        style: {
          width: '100%',
          height: '450px'
        }
      },
    })

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

    const fTableRowClick = (row, column, event) => {
      if (propSelect.value.mode === 'one') {
        stateData.tableRef.clearSelection()
      }
      stateData.tableRef.toggleRowSelection(row, undefined)
    }

    const fSelected = () => {
      const selectedRows = stateData.tableRef.getSelectionRows()
      if (selectedRows.length < 1) {
        commonFunc.Curd.FailTips("请至少选中一条才能确认")
        return
      }
      if (propSelect.value.mode === 'one') {
        context.emit('fSelectedCallback', selectedRows[0])
      } else if (propSelect.value.mode === 'more') {
        context.emit('fSelectedCallback', selectedRows)
      }
      propSelect.value.isShow = false
    }

    // 对话框关闭时所有的变量恢复为默认值
    const fClose = () => {
      // elementPlus 的对话框消失的时候有个渐渐淡出的动画，滞后200毫秒销毁本界面相关的变量，用户就不会在界面未消失时看见界面数据的变化。
      // setTimeout(() => {
      //   commonFunc.objInit(propSelect.value)
      // }, 200)
    }

    // 默认执行一次查询
    fSearch()

    return {
      ...toRefs(stateData),
      fSearch,
      fTableRowClick,

      propSelect,
      fSelected,
      fClose
    }
  }

}
</script>

<style scoped>
.keyWordsInput {
  width: 300px;
  margin-left: 4px;
  margin-right: 10px;
}

.toolBanner {
  display: flex;
  align-items: center;
  padding: 2px 0 6px 2px;
}

</style>

<style>
div.el-dialog__body {
  font-size: 13px;
}
</style>