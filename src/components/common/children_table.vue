<template>
  <div class="children-table-container">
    <div class="children-tool-bar">
      <el-button type="primary" icon="Plus" size="small" @click="fCreate">新增</el-button>
      <el-button type="primary" icon="DocumentCopy" size="small" @click="fCopy">复制最后一条</el-button>
    </div>
    <!--  渲染 表头-->
    <el-row class="children-table-header" :gutter="6">
      <el-col v-for="(item,index) in propChildrenTable.rowFieldFormat" :span="item.width?item.width:4" :key="index">
        <div v-show="item.isShow">{{ item.name }}</div>
      </el-col>
    </el-row>

    <el-row :gutter="4" v-for="(dataRow,dataRowIndex)  in propChildrenTable.allRows" :key="dataRowIndex" class="children-table-body">
      <template v-for="(rowFieldFormat,rowFieldIndex)  in propChildrenTable.rowFieldFormat">
        <template v-for="(dataFieldValue,dataFieldKey) in dataRow">
          <template v-if="dataFieldKey===rowFieldFormat.field">
            <!--  渲染 text input 框-->
            <template v-if="rowFieldFormat.type==='string'  ||  rowFieldFormat.type==='text'  ">
              <el-col :span="rowFieldFormat.width">
                <template v-if="typeof rowFieldFormat.formatter =='function'">
                  <el-input type="text" size="small" clearable v-model="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]" placeholder=""
                            :readonly="rowFieldFormat.readonly" v-show="rowFieldFormat.isShow"
                            :formatter="rowFieldFormat.formatter(propChildrenTable.allRows[dataRowIndex])"/>

                </template>
                <template v-else>
                  <el-input type="text" size="small" clearable v-model="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]" placeholder=""
                            :readonly="rowFieldFormat.readonly" v-show="rowFieldFormat.isShow"/>

                </template>

              </el-col>
            </template>

            <!--  渲染 number input 框-->
            <template v-if="rowFieldFormat.type==='number' ">
              <el-col :span="rowFieldFormat.width">
                <template v-if="typeof rowFieldFormat.formatter =='function'">
                  <el-input type="number" size="small" clearable v-model.number="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]"
                            :readonly="rowFieldFormat.readonly" v-show="rowFieldFormat.isShow" style="max-width:140px"
                            :formatter="rowFieldFormat.formatter(propChildrenTable.allRows[dataRowIndex])"
                  />
                </template>
                <template v-else>
                  <el-input type="number" size="small" clearable v-model.number="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]" placeholder=""
                            :readonly="rowFieldFormat.readonly" v-show="rowFieldFormat.isShow" style="max-width:140px"/>
                </template>

              </el-col>
            </template>

            <!--  渲染 date 框-->
            <template v-if="rowFieldFormat.type==='date' ">
              <div v-show="rowFieldFormat.isShow">
                <el-col :span="rowFieldFormat.width">
                  <el-date-picker type="date" size="small" clearable v-model="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]" placeholder=""
                                  :readonly="rowFieldFormat.readonly" @change="fDateChange($event,dataRowIndex,rowFieldFormat.field)"
                                  style="max-width:144px"/>
                </el-col>
              </div>
            </template>

            <!--  渲染 select-option 框-->
            <template v-if="rowFieldFormat.type==='selectOption' ">
              <el-col :span="rowFieldFormat.width">
                <el-select class="m-2" placeholder="" size="small" v-model="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]"
                           :readonly="rowFieldFormat.readonly" v-show="rowFieldFormat.isShow">

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
                <el-input type="text" size="small" readonly v-model="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]"
                          :readonly="rowFieldFormat.readonly" v-show="rowFieldFormat.isShow">

                  <template #append>
                    <el-button icon="Search" size="small" @click="fSelectComponent(dataRowIndex,rowFieldFormat.field,rowFieldFormat.componentPath)"/>
                  </template>
                </el-input>
              </el-col>
            </template>

            <!--  渲染 uploadFile  框-->
            <template v-if="rowFieldFormat.type==='upload' ">
              <el-col :span="rowFieldFormat.width">
                <el-input type="text" size="small" readonly clearable v-model="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]"
                          :readonly="rowFieldFormat.readonly" v-show="rowFieldFormat.isShow">
                  <template #append>
                    <el-upload :show-file-list="false" :action="actionUrl" :headers="headers" :on-success="fSuccess" :on-error="fError">
                      <template #trigger>
                        <Upload style="width: 16px; height: 16px;" @click="fUpdateUploadField(dataRowIndex,rowFieldFormat.field)"/>
                      </template>
                      <span style="display: inline-block;width: 10px"></span>
                      <el-link :underline="false" download="" target="_blank" title="点击下载文件"
                               :href="fGetFileFullPath(propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field])">
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

    <!--求和行  -->
    <el-row :gutter="6" v-for="(dataRow,dataRowIndex)  in childrenTableLastItem" :key="dataRowIndex" class="children-table-body-sum">
      <template v-for="(rowFieldFormat,rowFieldIndex)  in propChildrenTable.rowFieldFormat">
        <template v-for="(dataFieldValue,dataFieldKey) in dataRow">
          <template v-if="dataFieldKey===rowFieldFormat.field">
            <!--  渲染 number input 框-->
            <template v-if="rowFieldFormat.rowSum && rowFieldFormat.rowSum.calcSum ">
              <el-col :span="rowFieldFormat.width">
                <span style="margin-left: 6px">{{ rowFieldFormat.rowSum.label }}{{ fSum(rowFieldFormat, propChildrenTable.allRows) }}</span>
              </el-col>
            </template>
            <template v-else>
              <!--  根据指定的字段宽度占位即可-->
              <el-col :span="rowFieldFormat.width">
                <span style="margin-left:6px">{{ rowFieldFormat.rowSum ? rowFieldFormat.rowSum.label : '' }} </span>
              </el-col>
            </template>

          </template>

        </template>
      </template>
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
      // 同目录的公共组件存储起来，方便后续被其他页面动态引用
      selectComponents: import.meta.glob(["./select*.vue", '!**/select_sys_menu.vue']),

      // 定义变量接受childrenTable 的最后一条数据，用于计算求和、小计使用
      childrenTableLastItem: [propChildrenTable.value.allRows[0]]
    })

    // console.log("最后一行：",stateData.childrenTableLastItem)
    // 求和函数
    //@rowSumProperty  求和行设置的属性(对象参数)
    //@originData  原始被求和的原始数据
    const fSum = (rowSumProperty, originAllData) => {
      let tmpSum = 0.0
      for (let index in originAllData) {
        tmpSum += parseFloat((originAllData[index])[rowSumProperty.field])
      }
      // 做为一个全局变量
      return tmpSum.toFixed(rowSumProperty.rowSum.accuracy);
    }

    watch(() => propChildrenTable, (newPropChildrenTable, oldPropChildrenTable) => {
      if (newPropChildrenTable.value.action === 'insert') {
        propChildrenTable.value.allRows = newPropChildrenTable.value.defaultListForCreate
      }

      if (propChildrenTable.value.allRows.length > 0) {
        stateData.childrenTableLastItem = [propChildrenTable.value.allRows[0]]
      } else {
        stateData.childrenTableLastItem = []
      }
    }, {deep: true, immediate: true})

    // 新增一行事件
    const fCreate = () => {
      const blankRow = Object.assign({}, propChildrenTable.value.rowField)
      propChildrenTable.value.allRows.push(blankRow)
    }
    // 复制最后一行
    const fCopy = () => {
      if (propChildrenTable.value.allRows.length > 0) {
        // 重新定义变量接受，否则复制出来的数据都会指向同一个指针
        let tmpItem = Object.assign({}, propChildrenTable.value.allRows[propChildrenTable.value.allRows.length - 1])
        if (tmpItem.id > 0) {
          // 将复制出来的数据id设置为0，这样才能作为新数据插入数据库
          tmpItem.id = 0
        }
        propChildrenTable.value.allRows.push(tmpItem)
      }
    }
    // 删除一行事件
    const fDelete = (dataRowIndex) => {
      const tmpId = propChildrenTable.value.allRows[dataRowIndex].id
      if (tmpId > 0) {
        stateData.tmpDelIds.push(tmpId)
        propChildrenTable.value.deleted_ids = stateData.tmpDelIds.toString()
      }
      propChildrenTable.value.allRows.splice(dataRowIndex, 1)
    }

// dialog 对话框选择事件
    const fSelectComponent = (dataRowIndex, selectedField, componentPath) => {
      stateData.selectedRowIndex = dataRowIndex
      stateData.selectedRowField = selectedField
      dynamicComponent.value = defineAsyncComponent(stateData.selectComponents[componentPath])

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

    // 日期改变时通过change事件修改绑定的变量为文本型
    const fDateChange = (defaultDate, rowIndex, FieldName) => {
      if (propChildrenTable.value.allRows.length > 0) {
        (propChildrenTable.value.allRows[rowIndex])[FieldName] = commonFunc.DateFormat(defaultDate)
      }
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
      fCopy,
      fDelete,
      fDateChange,
      fSum
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

.children-table-body-sum {
  margin: 8px 0 0 0;
  font-family: 'Microsoft YaHei UI Light', system-ui, sans-serif;
  font-weight: bold;
}

</style>
