<template>
  <div :style="{height:bodyHeight}">

    <div class="tableList-area">
      <div class="toolBanner">
        用户名:
        <el-input v-model="tableList.searchKeyWords.user_name" placeholder="关键词" class="keyWordsInput"/>
        <el-button-group>
          <el-button type="primary" @click="search" icon="Search">查询</el-button>
          <el-button type="success" @click="search" icon="Plus">新增</el-button>
          <el-button type="primary" @click="search" icon="Edit">修改</el-button>
          <el-button type="danger" @click="handleDestroy('delete')" icon="Delete">批量删除</el-button>
        </el-button-group>
      </div>

      <el-table border :style="tableList.style" :height="tableList.style.height" :highlight-current-row="true" :data="tableList.data" ref="tableRef" @row-click="tableRowClick">
        <el-table-column type="selection" width="50" align="center"/>
        <el-table-column prop="id" label="id" width="100" sortable fixed/>
        <!--    ↓↓↓↓   业务字段  ↓↓↓↓   -->

        <el-table-column prop="user_name" label="用户名" sortable show-overflow-tooltip/>
        <el-table-column prop="real_name" label="姓名" sortable show-overflow-tooltip/>
        <el-table-column prop="phone" label="联系方式" sortable show-overflow-tooltip/>
        <el-table-column prop="status" label="状态" sortable show-overflow-tooltip/>
        <el-table-column prop="login_times" label="登陆次数" sortable show-overflow-tooltip/>
        <el-table-column prop="last_login_ip" label="最近登陆ip" sortable show-overflow-tooltip/>
        <el-table-column prop="remark" label="备注" sortable show-overflow-tooltip/>

        <!--     ↑↑↑↑   业务字段  ↑↑↑↑   -->
        <el-table-column prop="created_at" label="创建时间" width="150" sortable show-overflow-tooltip/>
        <el-table-column prop="updated_at" label="更新时间" width="150" sortable show-overflow-tooltip/>
      </el-table>
    </div>
    <div class="paging-area">
      <ElConfigProvider :locale="locale">
        <el-pagination small="small" layout="total,prev, pager, next,sizes" :default-page-size="20" prev-text="上一页" next-text="下一页" background
                       :total="tableList.total" v-model:current-page="tableList.searchKeyWords.page" v-model:page-size="tableList.searchKeyWords.limit" :page-sizes="tableList.pageOptions"
        />
      </ElConfigProvider>
    </div>

    <!--    导入的其他组件-->
    <Destroy :destroy="destroy" @destroy_callback="search"/>

  </div>
</template>

<script>
import commonFunc from '@/libs/common_func'
import {reactive, toRefs, watch} from 'vue'
import {list} from '@/api/system-setting/user'
import {ElConfigProvider} from 'element-plus'
import chCn from 'element-plus/lib/locale/lang/zh-cn'
import {Delete, Edit, Plus, Search} from '@element-plus/icons-vue'
import Destroy from './destroy.vue'


export default {
  name: "UserIndex",
  components: {
    Destroy,
    ElConfigProvider,
    Search, Edit, Delete, Plus
  },
  setup() {
    // 页面元素鉴权
    // const auth_button= (buttonList) =>{
    //   for (let key in stateData.tableList.buttonList) {
    //     stateData.tableList.buttonList[key] = buttonList.some((value, index) => {
    //       return value.en_name === stateData.tableList.buttonList[key];
    //     })
    //   }
    //   return stateData.tableList.buttonList
    // }
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
        buttonList: {
          insert: 'insert',
          delete: 'delete',
          update: 'update',
          select: 'select',
        },
        total: 0,
        data: [],
        // 分页配置
        pageOptions: commonFunc.PageSizeOptions,
        style: {
          width: '100%',
          height: commonFunc.TableHeight(),

        }
      },

      destroy: {
        actionName: '',
        isShow: false,
        ids: '',
        delCounts: 0,
      }

    })

    // 查询相关======================
    const search = () => {
      list(stateData.tableList.searchKeyWords).then(res => {
        stateData.tableList.data = res.data.data.data
        stateData.tableList.total = res.data.data.count
      }).catch(res => {
        stateData.tableList.data = []
        stateData.tableList.total = 0
      })
    }
    // 分页组件改变事件,通过监听绑定的变量实现，elementPlus 官方提示，不要使用相关事件，后续版本会移出事件模式
    watch(() => stateData.tableList.searchKeyWords.page, (newPage, oldPage) => {
      search()
    }, {immediate: true})

    watch(() => stateData.tableList.searchKeyWords.limit, (newLimit, oldLimit) => {
      search()
    }, {immediate: true})

// 查询相关==========================


    // 删除相关
    const handleDestroy = (action) => {
      const selectedArray = stateData.tableRef.getSelectionRows()
      const resObj = commonFunc.GetArrayColumnConcatVals(selectedArray, 'id')
      if (resObj.id.length >= 1) {
        stateData.destroy.actionName = commonFunc.CurdActionName[action]
        stateData.destroy.isShow = true
        stateData.destroy.ids = resObj.id.toString()
        stateData.destroy.delCounts = resObj.id.length
      } else {
        console.log("请至少选中一条进行删除")
      }

    }


    const tableRowClick = (row, column, event) => {
      stateData.tableRef.toggleRowSelection(row, undefined)
    }
    // 默认初始化动作
    search()

    // 导出变量、函数
    return {
      ...toRefs(stateData),

      search,
      handleDestroy,


      tableRowClick,
      locale: chCn
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

.btnGroup {
  padding: 0 10px;
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

<style>
div.el-pagination {
  display: inline-flex;
}
</style>