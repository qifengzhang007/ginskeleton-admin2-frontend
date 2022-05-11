<template>
  <div class="copyright"> {{ copyright }}</div>
</template>

<script>
import config from '@/config/index'

export default {
  name: 'CopyRight',
  data() {
    return {
      copyright: config.copy_right
    }
  }
}
</script>

<style scoped>
.copyright {
  width: 100%;
  height: 40px;
  line-height: 40px;
  vertical-align: middle;
  text-align: center;
  position: fixed;
  font-size: 14px;
  bottom: 0;
}
</style>
