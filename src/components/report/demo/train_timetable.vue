<template>
  <div :style="{height:bodyHeight}">
    <div class="tableList-area">
      <div class="toolBanner">
        始发地:
        <el-input clearable v-model="propIframe.params.departure" placeholder="关键词" class="keyWordsInput"/>

        <el-button-group v-if="tableList.buttonGroupIsShow">
          <el-button type="primary" @click="fSearch" icon="Search" v-if="tableList.buttonList.select">查询</el-button>
        </el-button-group>
      </div>

      <Iframe :propIframe="propIframe" ref="iframeRef"/>

    </div>
  </div>
</template>

<script>
import commonFunc from '@/libs/common_func'
import {useTabStore} from "@/store/system-setting/tabs";
import {reactive, toRefs} from 'vue'
import {show_button, view_button_list} from '@/api/system-setting/auth'
import Iframe from '@/components/common/iframe.vue'
import ReportSet from '@/api/report-api/report'

export default {
  name: "TrainTimetableIndex",
  components: {
    Iframe,
  },
  setup() {
    const tabsStore = useTabStore()
    const stateData = reactive({
      iframeRef: null,
      // iframe 属性设置
      propIframe: {
        iframeId: ReportSet.trainTimetable.reportId,
        url: ReportSet.trainTimetable.reportUrl,
        // 查询参数
        params: {
          pageNo: 1,
          pageSize: 50,
          departure: "",
        }
      },
      bodyHeight: commonFunc.BodyHeight(),
      tableList: {
        // 本页面可展示的按钮列表全部先定义
        buttonList: {
          insert: 'insert',
          delete: 'delete',
          update: 'update',
          select: 'select',
        },
        buttonGroupIsShow: false,
      },
    })

    //界面元素鉴权后显示
    const btnElementAuth = () => {
      view_button_list(tabsStore.tabs.curMenuItem.relaMenuId).then(res => {
        show_button(res.data.data, stateData.tableList.buttonList)
        stateData.tableList.buttonGroupIsShow = true
        fSearch()
      }).catch(res => {
      })
    }
    btnElementAuth()

    // 查询相关======================
    const fSearch = () => {
      stateData.iframeRef.fReloadPage()
    }

    // 导出变量、函数
    return {
      ...toRefs(stateData),

      fSearch
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
