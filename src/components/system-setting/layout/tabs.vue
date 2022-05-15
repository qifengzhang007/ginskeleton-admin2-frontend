<template>
  <div id="layout-tab-container">
    <div id="layout-tab-left" ref="scrollOuter" class="scroll-box" @mouseScroll.prevent="handlerScroll($event)" @mousewheel.prevent="handlerScroll($event)">

      <el-icon @click="arrowBtnClick(360)" class="left-btn">
        <ArrowLeft id="arrowLeft"/>
      </el-icon>

      <ul ref="scrollBody" class="scroll-tab" :style="{left: tagBodyLeft+'px'}">
        <li class="scroll-tabs" v-for="(item,index) in tabStore.tabs.list" :key="index"
            @click.stop="activeTab(item.name,item.relaMenuId,item.icon,item.path,'tab')"
        >
          <el-icon :size="14" :class="{tabIconTxtActive:item.isActive}">
            <component :is="item.icon"/>
          </el-icon>
          <span :class="{tabTitle:true,tabIconTxtActive:item.isActive}">{{ item.name }}</span>
          <span class="close-icon" @click.stop="tabStore.remove(item.relaMenuId,item.isActive)">x</span>
        </li>
      </ul>

      <el-icon @click="arrowBtnClick(-360)" class="right-btn">
        <ArrowRight id="arrowRight"/>
      </el-icon>

    </div>


    <div id="layout-tab-right">
      <el-dropdown @command="handleCloseCommand" size="small">
    <span class="el-dropdown-link">
      <el-button circle size="small">X</el-button>
    </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="closeOther">关闭其它</el-dropdown-item>
            <el-dropdown-item command="closeAll" divided>关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

  </div>
</template>

<script>
import {ref} from 'vue'
import {ArrowLeft, ArrowRight, CircleClose} from '@element-plus/icons-vue'
import {useTabStore} from "@/store/tabs";


export default {
  name: 'Tabs',
  components: {
    ArrowLeft,
    ArrowRight,
    CircleClose,
  },
  setup() {

    const tabStore = useTabStore();


    const scrollOuter = ref(null)
    const scrollBody = ref(null)
    const tagBodyLeft = ref(0)

    const arrowBtnClick = (offset) => {
      let outerWidth = scrollOuter.value.offsetWidth
      let bodyWidth = scrollBody.value.offsetWidth
      if (offset > 0) {
        tagBodyLeft.value = Math.min(0, tagBodyLeft.value + offset)
        tagBodyLeft.value += 2
      } else {
        tagBodyLeft.value = outerWidth < bodyWidth ? Math.max(tagBodyLeft.value + offset, outerWidth - bodyWidth) : 0
        tagBodyLeft.value -= 40
      }
    }

    const handlerScroll = (event) => {
      arrowBtnClick(event.wheelDelta)
    }
    const handleCloseCommand = (command) => {
      switch (command) {
        case 'closeOther':
          tabStore.closeOtherTabs()
          break
        case 'closeAll':
          tabStore.closeAllTabs()
          break
      }
    }

    // tab 激活(添加)事件
    const activeTab = (menuName, relaMenuId, menuIcon, menuPath, actionFrom) => {
      tabStore.add(menuName, relaMenuId, menuIcon, menuPath, actionFrom)
    }

    return {

      scrollOuter,
      scrollBody,
      tagBodyLeft,
      arrowBtnClick,
      handlerScroll,
      handleCloseCommand,
      tabStore,
      activeTab,
    }
  }
}
</script>

<style>
#layout-tab-container {
  display: block;
  height: 42px;
  line-height: 42px;
  vertical-align: middle;
  box-shadow: 0 0 10px #e7e7e7 inset;
  background-color: #f8f8f8;
  width: calc(100% - 2px);
  overflow: hidden;
}

#layout-tab-left {
  float: left;
  display: inline-block;
}

#layout-tab-right {
  float: right;
  display: inline-block;
  width: 40px;
  height: 42px;
  text-align: center;
  right: 0;
}

#layout-tab-right button {
  margin-top: 8px;
}

.scroll-box {
  position: relative;
  width: calc(100% - 40px);
  height: 42px;
  padding: 0 20px;
  overflow: hidden;
}

.scroll-tab {
  position: relative;
  display: inline-flex;
  transition: all 0.2s;
  margin-top: -4px;
}

/* tab页签（list）样式 */
.scroll-tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 130px;
  line-height: 30px;
  height: 30px;
  margin: 0 4px;
  list-style: none;
  background-color: white;
  cursor: default;
  padding-left: 4px;
}

li.scroll-tabs:hover {
  background-color: #fcfcfc;
}

li.scroll-tabs:first-child {
  margin-left: 16px;
}

li.scroll-tabs:last-child {
  margin-right: 20px;
}

/* 左右滚动按钮 */
.left-btn, .right-btn {
  position: absolute;
  top: 0;
  width: 30px;
  height: 38px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  z-index: 99;
  background-color: white;
}

.left-btn {
  left: 0;
  border-top: 1px solid #dadada;
  border-right: 1px solid #dadada;
  border-bottom: 1px solid #dadada;
}

.right-btn {
  right: 0;
  border-top: 1px solid #dadada;
  border-left: 1px solid #dadada;
  border-right: 1px solid #eaeaea;
  border-bottom: 1px solid #dadada;
}

.tabIconTxtActive {
  color: #2d8cf0;
}

.tabTitle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  text-align: center;
  font-size: 13px;
}

.close-icon {
  display: inline-block;
  text-align: right;
  width: 26px;
  padding-right: 6px;
  font-size: 18px;
  position: relative;
  top: -2px;
  font-family: "微软雅黑 Light", serif;
  color: #9a9a9a;
}

span.close-icon:hover {
  color: #409eff;
}

</style>


<style>
#arrowLeft:hover, #arrowRight:hover {
  color: #409eff;
}
</style>