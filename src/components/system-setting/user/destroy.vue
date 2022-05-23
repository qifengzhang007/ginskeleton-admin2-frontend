<template>
  <el-dialog v-model="destroy.isShow" :title="destroy.actionName" width="30%" draggable top="35vh">
    <span style="{font-size: 13px}">	<el-icon><Delete :size="100" color="red"/></el-icon> 本次将删除 <span style="color: #f14a4a;font-weight: bold">{{ destroy.delCounts }} </span> 条数据, 请确认!</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="destroy.isShow = false">取消</el-button>
        <el-button type="danger" @click="destroyData">  确认   </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {toRefs} from 'vue'

export default {
  name: 'Destroy',
  components: {},
  props: {
    destroy: Object,
  },
  emits: ['destroy_callback'],
  setup(props, context) {

    const {destroy} = toRefs(props)

    const destroyData = () => {
      // 传递 ids 删除数据
      destroy(destroy.value.ids).then(res => {
        if (res.status === 200) {
          context.emit('destroy_callback')
          //  this.$emit('destroy_after')
          // common_func.Curd.SuccessTips(this, res.data.msg)
        }
      }).catch(res => {
        // commonFunc.Curd.FailTips(this, res.data.msg+res.data.data)
      })
    }


    return {
      destroy,
      destroyData
    }
  }

}
</script>

<style scoped>

</style>