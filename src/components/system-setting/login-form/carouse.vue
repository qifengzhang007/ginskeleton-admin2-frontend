<template>
    <el-carousel  arrow="never"  height="520px" :interval=3000 >
<!--      <el-carousel-item  v-for="index  in 3" >    <div class="carouse_item_common carouse_item{{index}}"><img src="@/assets/images/bg{{index}}.png" alt="图片丢失"/></div> </el-carousel-item>-->
      <el-carousel-item>    <div class="carouse_item_common carouse_item1"><img src="@/assets/images/bg1.png" alt="图片丢失"/></div> </el-carousel-item>
      <el-carousel-item>    <div class="carouse_item_common carouse_item2"><img src="@/assets/images/bg2.png" alt="图片丢失"/></div> </el-carousel-item>
      <el-carousel-item>    <div class="carouse_item_common carouse_item3"><img src="@/assets/images/bg3.png" alt="图片丢失"/></div> </el-carousel-item>
    </el-carousel>
</template>

<script>
export default {
  name: 'Carouse',
  data () {
    return {
      setting: {
        autoplay: true,
        autoplaySpeed: 2000,
        dots: 'inside',
        radiusDot: true,
        trigger: 'click',
        arrow: 'never' // hover 悬浮显;  always 一直显示 ;  never  不显示
      }
    }
  }
}
</script>

<style scoped>
.carousel {
  display: block;
  width: 100%;
  height: 550px;
  background: #000f2e
}

.carouse_item_common {
  box-sizing: border-box;
  text-align: left;
  padding-left: 300px;
  width: 100%;
  height: 100%;
}

.carouse_item1 {
  background: #000f2e;
}

.carouse_item2 {
  background: #000002;
}

.carouse_item3 {
  background: #000f2d;
}
.ivu-carousel-dots{
  text-align: center;
}

</style>
