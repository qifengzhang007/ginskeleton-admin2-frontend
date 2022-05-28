<template>
  <el-table-column prop="remark" label="备注" sortable show-overflow-tooltip/>
  <el-table-column prop="created_at" label="创建时间" width="150" sortable show-overflow-tooltip/>
  <el-table-column prop="updated_at" label="更新时间" width="150" sortable show-overflow-tooltip/>
</template>

<script>
export default {
  name: "TableHeader2"
}
</script>
