<template>
  <ElConfigProvider :locale="locale">
    <el-pagination small="small" layout="total,prev, pager, next,sizes" :default-page-size="20" prev-text="上一页" next-text="下一页" background
                   :total="propPage.total" v-model:current-page="propPage.searchKeyWords.page" v-model:page-size="propPage.searchKeyWords.limit" :page-sizes="pageOptions"
    />
  </ElConfigProvider>
</template>

<script>
import commonFunc from '@/libs/common_func'
import {reactive, toRefs, watch} from "vue";
import {ElConfigProvider} from 'element-plus'
import chCn from 'element-plus/lib/locale/lang/zh-cn'

export default {
  name: "Paging",
  components: {
    ElConfigProvider
  },
  props: {
    propPage: Object,
  },
  emits: ['fPageCallback'],
  setup(props, context) {
    const {propPage} = toRefs(props)
    const stateData = reactive({
      pageOptions: commonFunc.PageSizeOptions
    })
    // 分页组件改变事件,通过监听绑定的变量实现，
    // elementPlus 官方提示，不要使用相关事件实现，后续版本会移出事件模式
    watch(() => propPage.value.searchKeyWords.page, (newPage, oldPage) => {
      context.emit('fPageCallback')
    }, {immediate: true})

    watch(() => propPage.value.searchKeyWords.limit, (newLimit, oldLimit) => {
      context.emit('fPageCallback')
    }, {immediate: true})

    return {
      ...toRefs(stateData),
      propPage,
      locale: chCn
    }
  }
}
</script>

<style>
div.el-pagination {
  display: inline-flex;
}
</style>