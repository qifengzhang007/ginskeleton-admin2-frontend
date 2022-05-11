<template>
  <div id="container-app">
    <Main/>
  </div>

</template>

<script>
import Main from '@/views/layout/main.vue'


export default {
  name: "App",
  components: {
    Main
  },
  setup() {

    return {
      title: 'APP'
    }
  }
}
</script>

<style scoped>

</style>