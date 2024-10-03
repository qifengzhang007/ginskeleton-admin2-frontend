<template>
  <div class="tags2-style">
    <el-tag v-for="tag in propTagList.tagList" :key="tag.name" closable :type="tag.type?tag.type:'primary'" @close="tagClose($event,tag)">
      {{ tag.name }}
    </el-tag>
  </div>
</template>

<script>
import {toRefs} from 'vue'

export default {
  name: "Tags2",
  props: {
    //  propTagList 必须满足格式： 对象中必须含有成员 key(一般是uuid值) 、name(显示名称) 、type："primary" 默认值，可以不传递
    //  1.数组格式：propTagList.tagList: [{key:"键-uuid", name:"tag 名称", "type":"primary"}，{key:"键-uuid2", name:"tag2 名称", "type":"primary"} ]  , type: success、info、warning、danger
    propTagList: Object  //  数组类型在js中使用  typeof 检测结果也是  object
  },
  setup(props, context) {
    const {propTagList} = toRefs(props)
    //   根据传递的tag对象，删除数据
    const deleteItemFromTagList = (delItem) => {
      propTagList.value.tagList = propTagList.value.tagList.filter((item) => {
        return item.key !== delItem.key
      })
    }

    //  tag  close 事件
    const tagClose = (mouseEvent, tag) => {
      deleteItemFromTagList(tag)
    }

    return {
      // ...toRefs(stateData),
      propTagList,
      tagClose
    }

  }
}
</script>


<style scoped>
div.tags2-style {
  border: 1px solid #e4e4e4;
  border-radius: 4px;
  padding: 2px;
}

div.tags2-style:hover {
  border: 1px solid #87a7f3;
}

span.el-tag {
  margin: 2px !important;
}
</style>
