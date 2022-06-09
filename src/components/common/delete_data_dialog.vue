<template>
  <el-dialog v-model="propDelete.isShow" :title="propDelete.actionName" width="420px" draggable top="35vh" @close="fClose">
    <template #header>
      <div>
        <el-icon>
          <Delete color="#ef2f2f"/>
        </el-icon>
        {{ propDelete.actionName }}
      </div>
    </template>
    <div class="dialog-content">
      <span style="{font-size: 13px}">	 本次将删除 <span class="high-light">{{ propDelete.delCounts }} </span> 条数据, 确认删除吗 ？</span>
      <br/> <br/>
      <template v-if="propDelete.serverResCode===400">
        删除结果：<span class="high-light">失败 , {{ propDelete.serverResMsg }}</span>
      </template>
      <template v-else-if="propDelete.serverResCode!==0 && propDelete.serverResCode!==200">
        <el-icon color="#ef2f2f">
          <WarningFilled/>
        </el-icon>
        删除操作出错：<span class="high-light">{{ propDelete.serverResMsg }}</span>
      </template>
    </div>
    <template #footer>
      <span class="dialog-footer">
<!--        <el-button @click="propDelete.isShow = false">取消</el-button>-->
        <el-button type="danger" @click="fDelete" :disabled="propDelete.serverResCode===200">          {{ propDelete.actionName }}   </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {toRefs, watch} from 'vue'
import commonFunc from '@/libs/common_func'

export default {
  name: 'DeleteDataDialog',
  components: {},
  props: {
    propDelete: Object,
  },
  emits: ['fDeleteCallback'],
  setup(props, context) {
    const {propDelete} = toRefs(props)

    const fDelete = () => {
      context.emit('fDeleteCallback')
    }

    watch(() => propDelete.value.serverResCode, (newCode, oldCode) => {
      if (newCode === 200) {
        propDelete.value.isShow = false
        commonFunc.Curd.SuccessTips("删除成功!")
      }
    })
    // 对话框关闭时所有的变量恢复为默认值
    const fClose = () => {
      // elementPlus 的对话框消失的时候有个渐渐淡出的动画，滞后100毫秒销毁本界面相关的变量，用户就不会在界面未消失时看见界面数据的变化。
      setTimeout(() => {
        commonFunc.objInit(propDelete.value)
      }, 100)
    }

    return {
      propDelete,
      fDelete,
      fClose
    }
  }

}
</script>

<style scoped>
.high-light {
  color: #f14a4a;
}

.dialog-content {
  display:flex;
  align-items: center;
  min-height: 60px;
}

.dialog-footer {
  display: block;
  text-align: center;
}
</style>
