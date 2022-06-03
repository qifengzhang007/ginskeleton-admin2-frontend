<template>
  <div class="children-table-container">
    <div class="children-tool-bar">
      <el-button type="primary" icon="Plus" size="small" @click="fCreate">新增</el-button>
    </div>
    <!--  渲染 表头-->
    <el-row class="children-table-header" :gutter="6">
      <el-col v-for="(item,index) in propChildrenTable.rowFieldFormat" :span="item.width?item.width:4" :key="index">
        <div>{{ item.name }}</div>
      </el-col>

    </el-row>

    <el-row :gutter="6" v-for="(dataRow,dataRowIndex)  in propChildrenTable.allRows" :key="dataRowIndex" class="children-table-body">
      <template v-for="(dataFieldValue,dataFieldKey) in dataRow">

        <template v-for="(rowFieldFormat,rowFieldIndex)  in propChildrenTable.rowFieldFormat">
          <template v-if="dataFieldKey===rowFieldFormat.field">
            <!--  渲染 text input 框-->
            <template v-if="rowFieldFormat.type==='string'  ||  rowFieldFormat.type==='text'  ">
              <el-col :span="rowFieldFormat.width">
                <el-input type="text" size="small" v-model="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]" placeholder=""/>
              </el-col>
            </template>

            <!--  渲染 number input 框-->
            <template v-if="rowFieldFormat.type==='number' ">
              <el-col :span="rowFieldFormat.width">
                <el-input type="number" size="small" v-model="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]" placeholder=""/>
              </el-col>
            </template>

            <!--  渲染 select-option 框-->
            <template v-if="rowFieldFormat.type==='selectOption' ">
              <el-col :span="rowFieldFormat.width">
                <el-select class="m-2" placeholder="" size="small" v-model="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]">
                  <el-option
                      v-for="option in rowFieldFormat.options"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                  />
                </el-select>
              </el-col>
            </template>

            <!--  渲染 dialog  框-->
            <template v-if="rowFieldFormat.type==='dialog' ">
              <el-col :span="rowFieldFormat.width">
                <el-input type="text" size="small" readonly v-model="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]">
                  <template #append>
                    <el-button icon="Search" size="small" @click="fSelectComponent(dataRowIndex,rowFieldFormat.field,rowFieldFormat.componentPath)"/>
                  </template>
                </el-input>
              </el-col>
            </template>

            <!--  渲染 uploadFile  框-->
            <template v-if="rowFieldFormat.type==='upload' ">
              <el-col :span="rowFieldFormat.width">
                <el-input type="text" size="small" readonly v-model="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]">

                  <template #append>
                    <el-upload
                        :show-file-list="false"
                        :action="actionUrl"
                        :headers="headers"
                        :on-success="fSuccess"
                        :on-error="fError"
                    >
                      <template #trigger>
                        <Upload style="width: 16px; height: 16px;" @click="fUpdateUploadField(dataRowIndex,rowFieldFormat.field)"/>
                      </template>
                      <span style="display: inline-block;width: 10px"></span>
                      <el-link :underline="false" download="" target="_blank" title="点击下载文件" :href="fGetFileFullPath(propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field])">
                        <ArrowDown style="width: 14px; height: 14px;"/>
                      </el-link>
                    </el-upload>
                  </template>

                </el-input>
              </el-col>
            </template>

          </template>

        </template>


      </template>
      <!--最后一列渲染一个按钮-->
      <el-col :span="1">
        <el-button icon="Close" size="small" @click="fDelete(dataRowIndex)"/>
      </el-col>
    </el-row>

    <!--引入公共组件-->
    <component :is="dynamicComponent" v-bind:propSelect="propSelect" @fSelectedCallback="fSelectedCallback"></component>

  </div>
</template>

<script>
import {defineAsyncComponent, reactive, shallowRef, toRefs, watch} from "vue";
import {getToken} from '@/libs/util'
import commonFunc from '@/libs/common_func'

export default {
  name: "ChildrenTable",
  components: {
    // UploadFile
  },
  props: {
    propChildrenTable: Object
  },
  setup(props, context) {
    const {propChildrenTable} = toRefs(props)

    let dynamicComponent = shallowRef(null)

    const stateData = reactive({
      selectedRowIndex: 0,   // 子表被选择的当前行索引
      selectedRowField: '',  // 子表被选择的当前行对应的字段
      tmpDelIds: [],
      propSelect: {
        isShow: false,
        title: "",
        mode: 'one'  // 数据选择模式： one=单选（选择后返回的结果只有一条），more(允许选择多条数据)，选择结果是一个数组
      },

      //表单内嵌文件上传
      actionUrl: commonFunc.getApiUrlPre() + '/upload/files',
      headers: {
        Authorization: 'Bearer ' + getToken()
      },

    })

    watch(() => propChildrenTable, (newPropChildrenTable, oldPropChildrenTable) => {
      if (newPropChildrenTable.value.action === 'insert') {
        propChildrenTable.value.allRows = newPropChildrenTable.value.defaultListForCreate
      }
    }, {deep: true, immediate: true})

    // 新增一行事件
    const fCreate = () => {
      const blankRow = Object.assign({}, propChildrenTable.value.rowField)
      propChildrenTable.value.allRows.push(blankRow)
    }
    // 删除一行事件
    const fDelete = (dataRowIndex) => {
      const tmpId = propChildrenTable.value.allRows[dataRowIndex].id
      if (tmpId > 0) {
        stateData.tmpDelIds.push(tmpId)
        propChildrenTable.value.button_delete = stateData.tmpDelIds.toString()
      }
      propChildrenTable.value.allRows.splice(dataRowIndex, 1)
    }

// dialog 对话框选择事件
    const fSelectComponent = (dataRowIndex, selectedField, componentPath) => {
      stateData.selectedRowIndex = dataRowIndex
      stateData.selectedRowField = selectedField

      dynamicComponent.value = defineAsyncComponent(() => import( /* @vite-ignore */ componentPath))

      // stateData.propSelect.title = "选择模块"
      stateData.propSelect.mode = "one"  //  目前子表只允许单条选择
      stateData.propSelect.isShow = true
    }
    // 更新当前行字段映射
    const fUpdateSelectMapField = (selectedItem) => {
      const dataRowIndex = stateData.selectedRowIndex
      const selectedField = stateData.selectedRowField

      for (let index in propChildrenTable.value.rowFieldFormat) {
        if (propChildrenTable.value.rowFieldFormat[index].field === selectedField) {
          for (let key in propChildrenTable.value.rowFieldFormat[index].map) {
            propChildrenTable.value.allRows[dataRowIndex][key] = selectedItem[propChildrenTable.value.rowFieldFormat[index].map[key]]
          }
        }
      }
    }
    // 公共选择组件确认后的回调
    const fSelectedCallback = (selectedItem) => {
      fUpdateSelectMapField(selectedItem)
    }

    //文件上传前收集鼠标点击行索引、字段名参数
    const fUpdateUploadField = (dataRowIndex, selectedField) => {
      stateData.selectedRowIndex = dataRowIndex
      stateData.selectedRowField = selectedField
    }

    // 上传成功后的回调
    // @res 上传成功返回的结果
    // @uploadFile 被上传的文件路径信息
    const fSuccess = (res, uploadFile) => {
      if (res.code === 200) {
        propChildrenTable.value.allRows[stateData.selectedRowIndex][stateData.selectedRowField] = res.data.path
      } else {
        commonFunc.Curd.FailTips("文件上传失败：" + res.msg)
      }
    }
    //上传失败后的回调
    // @errRes 上传失败返回的结果
    // @uploadFile 被上传的文件路径信息
    const fError = (errRes, uploadFile) => {
      const err = JSON.parse(errRes.message)
      commonFunc.Curd.FailTips("文件上传失败：" + err.msg)
    }

    // 获取附件完整路径：
    const fGetFileFullPath = (shortPath) => {
      return shortPath.length > 10 ? commonFunc.getServerIp() + shortPath : ''
    }

    return {
      ...toRefs(stateData),
      propChildrenTable,
      dynamicComponent,

      fGetFileFullPath,
      fSelectedCallback,
      fSelectComponent,
      fUpdateUploadField,
      fSuccess,
      fError,
      fCreate,
      fDelete
    }
  }
}
</script>

<style scoped>
.children-table-container {
  display: block;
  margin-top: 10px;
  border: #dcdfe6 1px solid;
  border-radius: 2px;
  padding: 10px 10px
}

.children-tool-bar {
  display: flex;
  justify-content: start;
  align-items: center;
  height: 28px;

}

.children-table-header {
  display: flex;
  justify-content: start;
  align-items: center;
  height: 28px;
  background-color: #f5f7fa;
}

.children-table-body {
  margin: 4px 0;
}

</style>