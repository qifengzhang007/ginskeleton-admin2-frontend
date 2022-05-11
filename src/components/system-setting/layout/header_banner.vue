<template>
  <div class="header">
    <div class="left">
   <span class="collaspe">
      <el-icon ><fold/></el-icon>
   </span>

      首页 / 系统设置 / 用户管理
    </div>
    <div class="right">管理员</div>

  </div>

</template>

<script>
import {Fold, Key} from '@element-plus/icons-vue'

export default {
  name: "HeaderBanner",
  components: {
    Key, Fold
  },
  setup() {
    return {}

  }

}
</script>

<style scoped>
.collaspe {
  display: inline-block;
  width: 80px;
  text-align: center;
  margin-right: 6px;
}

.header {
  height: 64px;
  line-height: 64px;
  vertical-align: middle;
  border-bottom: #E8E8E8FF 1px solid;
}

.header > div {
  color: #323337;
}

.left {
  display: inline-block;
  float: left;
  width: 80%;
  padding-left: 4px;
}

.right {
  display: inline-block;
  float: right;
  width: 18%;
  text-align: right;
  padding-right: 10px;
}

</style>