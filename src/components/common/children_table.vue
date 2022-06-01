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
                    <el-button icon="Search" size="small"/>
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
import {defineAsyncComponent, reactive, ref, shallowRef, toRefs, watch} from "vue";

export default {
  name: "ChildrenTable",
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
        title: "选择用户",
        mode: 'one'  // 数据选择模式： one=单选（选择后返回的结果只有一条），more(允许选择多条数据)，选择结果是一个数组
      },
    })

    watch(() => propChildrenTable.value.allRows, (newAllRows, oldAllRows) => {
      if (newAllRows.length === 0) {
        propChildrenTable.value.allRows = propChildrenTable.value.defaultListForCreate
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
        propChildrenTable.value.deletedIds = stateData.tmpDelIds.toString()
      }
      propChildrenTable.value.allRows.splice(dataRowIndex, 1)
    }

// dialog 对话框选择事件
    const fSelectComponent = (dataRowIndex, selectedField, componentPath) => {
      stateData.selectedRowIndex = dataRowIndex
      stateData.selectedRowField = selectedField

      dynamicComponent.value = defineAsyncComponent(() => import( componentPath))

      // stateData.propSelect.title = "选择模块"
      stateData.propSelect.mode = "one"  //  目前子表只允许单条选择
      stateData.propSelect.isShow = true

    }

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

    const fSelectedCallback = (selectedItem) => {
      fUpdateSelectMapField(selectedItem)
    }

    return {
      ...toRefs(stateData),
      propChildrenTable,
      dynamicComponent,

      fSelectedCallback,
      fSelectComponent,
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