<template>
  <div>
    <div class="children-table-container">
      <div class="children-tool-bar">
        <el-button type="primary" icon="Plus" size="small" @click="fCreate" v-show="!propChildrenTable.actionBtnIsHidden">新增</el-button>
        <el-button type="primary" icon="DocumentCopy" size="small" @click="fCopy" v-show="!propChildrenTable.actionBtnIsHidden">复制最后一条</el-button>
      </div>
      <!--  渲染 表头-->
      <div class="children-table-header">
      <span class="col-style" v-for="(item,index) in propChildrenTable.rowFieldFormat" :style="{minWidth:item.width}" :key="index">
        <div v-show="item.isShow" v-html="item.name"></div>
      </span>
      </div>

      <div class="row-style children-table-body" v-for="(dataRow,dataRowIndex)  in propChildrenTable.allRows" :key="dataRowIndex">
        <template v-for="(rowFieldFormat,rowFieldIndex)  in propChildrenTable.rowFieldFormat">
          <template v-for="(dataFieldValue,dataFieldKey) in dataRow">
            <template v-if="dataFieldKey===rowFieldFormat.field">
              <!--  渲染 text input 框-->
              <template v-if="rowFieldFormat.type==='string'  ||  rowFieldFormat.type==='text'  ">
             <span class="col-style" :style="{minWidth:rowFieldFormat.width}">
                <el-input type="text" size="small" clearable v-model.string="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]" placeholder=""
                          :readonly="rowFieldFormat.readonly" v-show="rowFieldFormat.isShow"
                />
              </span>
              </template>

              <!--  渲染 number input 框-->
              <template v-if="rowFieldFormat.type==='number' ">
             <span class="col-style" :style="{minWidth:rowFieldFormat.width}">
                <template v-if="typeof rowFieldFormat.formatter =='function'">
                  <el-input-number controls-position="right" size="small" clearable v-model="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]"
                                   :readonly="rowFieldFormat.readonly" v-show="rowFieldFormat.isShow" style="max-width:140px"
                                   :precision="rowFieldFormat.precision??0" :min="rowFieldFormat.min??0"
                                   :formatter="rowFieldFormat.formatter(propChildrenTable.allRows[dataRowIndex])"
                  />
                </template>
                <template v-else>
                  <el-input-number controls-position="right" size="small" clearable v-model="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]" placeholder=""
                                   :precision="rowFieldFormat.precision??0" :min="rowFieldFormat.min??0"
                                   :readonly="rowFieldFormat.readonly" v-show="rowFieldFormat.isShow" style="max-width:140px"/>
                </template>

              </span>
              </template>

              <!--  渲染 date 框-->
              <template v-if="rowFieldFormat.type==='date' || rowFieldFormat.type==='month' ">
                <div v-show="rowFieldFormat.isShow">
               <span class="col-style" :style="{minWidth:rowFieldFormat.width}">
                  <el-date-picker :type="rowFieldFormat.type" size="small" clearable v-model="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]"
                                  placeholder=""
                                  :readonly="rowFieldFormat.readonly" @change="fDateChange($event,dataRowIndex,rowFieldFormat.field)"
                                  style="max-width:144px"/>
                </span>
                </div>
              </template>

              <!--  渲染 select-option 框-->
              <template v-if="rowFieldFormat.type==='selectOption' ">
             <span class="col-style" :style="{minWidth:rowFieldFormat.width}">
                <el-select class="m-2" placeholder="" size="small" v-model="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]"
                           :disabled="rowFieldFormat.readonly" v-show="rowFieldFormat.isShow">
                  <el-option v-for="option in rowFieldFormat.options" :key="option.value" :label="option.label" :value="option.value"/>
                </el-select>
              </span>
              </template>

              <!--  渲染 dialog  框-->
              <template v-if="rowFieldFormat.type==='dialog' ">
             <span class="col-style" :style="{minWidth:rowFieldFormat.width}">
                <el-input type="text" size="small" readonly v-model="propChildrenTable.allRows[dataRowIndex][rowFieldFormat.field]"
                          :readonly="rowFieldFormat.readonly" v-show="rowFieldFormat.isShow">

                  <template #append>
                    <el-button icon="Search" size="small" @click="fSelectComponent(dataRowIndex,rowFieldFormat.field,rowFieldFormat.componentPath)"/>
                  </template>
                </el-input>
              </span>
              </template>

              <!--  渲染 uploadFile  框-->
              <template v-if="rowFieldFormat.type==='upload' ">
             <span class="col-style" :style="{minWidth:rowFieldFormat.width}">
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
              </span>
              </template>

            </template>

          </template>


        </template>
        <!--最后一列渲染分摊调整按钮+一个删除小按钮-->
        <span class="col-style-close" v-show="setDistributionBtnShow">
        <el-button icon="Operation" size="small" type="primary" @click="fDistribution(dataRowIndex)">{{ setDistributionBtnTitle }}</el-button>
        </span>
        <span class="col-style-close" v-show="setItemDeleteBtnShow">
        <el-button icon="Close" size="small" @click="fDelete(dataRowIndex)" type="danger"/>
        </span>

      </div>

      <!--求和行  -->
      <el-row class="row-style-sum children-table-body-sum" v-for="(dataRow,dataRowIndex)  in childrenTableLastItem" :key="dataRowIndex">
        <template v-for="(rowFieldFormat,rowFieldIndex)  in propChildrenTable.rowFieldFormat">
          <template v-for="(dataFieldValue,dataFieldKey) in dataRow">
            <template v-if="dataFieldKey===rowFieldFormat.field">
              <!--  渲染 number input 框-->
              <template v-if="rowFieldFormat.rowSum && rowFieldFormat.rowSum.calcSum ">
             <span class="col-style" :style="{minWidth:rowFieldFormat.width}">
                <span style="margin-left: 6px">{{ rowFieldFormat.rowSum.label }}{{ fSum(rowFieldFormat, propChildrenTable.allRows) }}</span>
              </span>
              </template>
              <template v-else>
                <!--  根据指定的字段宽度占位即可-->
                <span class="col-style" :style="{minWidth:rowFieldFormat.width}">
                <span style="margin-left:6px">{{ rowFieldFormat.rowSum ? rowFieldFormat.rowSum.label : '' }} </span>
              </span>
              </template>

            </template>

          </template>
        </template>
      </el-row>

    </div>
  </div>

  <div style="z-index: 999999">
    <!--引入公共组件-->
    <component :is="dynamicComponent" v-bind:propSelect="propSelect" @fSelectedCallback="fSelectedCallback"></component>
  </div>

</template>

<script>
import {defineAsyncComponent, reactive, shallowRef, toRefs, watch, onUnmounted} from "vue";
import {getToken} from '@/libs/util'
import commonFunc from '@/libs/common_func'

export default {
  name: "ChildrenTablePlus",
  components: {
    // UploadFile
  },
  props: {
    propChildrenTable: Object
  },
  emits: ['fDistributionCall'],
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
      childrenTableLastItem: [propChildrenTable.value.allRows[0]],
      setItemDeleteBtnShow: true,
      setDistributionBtnShow: true,
      setDistributionBtnTitle: '',
    })

    // console.log("最后一行：",stateData.childrenTableLastItem)
    // 求和函数
    //@rowSumProperty  求和行设置的属性(对象参数)
    //@originData  原始被求和的原始数据
    const fSum = (rowSumProperty, originAllData) => {
      let tmpSum = 0.0
      for (let index in originAllData) {
        let tmpNumer = parseFloat((originAllData[index])[rowSumProperty.field])
        //tmpSum += parseFloat((originAllData[index])[rowSumProperty.field])
        tmpSum += Number.isNaN(tmpNumer) ? 0 : tmpNumer
      }
      // 做为一个全局变量
      return tmpSum.toFixed(rowSumProperty.rowSum.accuracy);
    }

    watch(() => propChildrenTable, (newPropChildrenTable, oldPropChildrenTable) => {
      // console.log("底层监听删除小按钮是否显示：",stateData.setItemDeleteBtnShow)
      // 删除小按钮是否显示
      stateData.setItemDeleteBtnShow = propChildrenTable.value.setItemDeleteBtnShow !== false;
      // 分摊小按钮是否显示
      stateData.setDistributionBtnShow = propChildrenTable.value.setDistributionBtnShow !== false;
      // 在部门作为条件筛选数据时，意味着不是填报界面，而是核对、复核界面，
      // 因此 设置标题为 查看分摊比例
      if (propChildrenTable.value.filter_dept) {
        stateData.setDistributionBtnTitle = '查看分摊比例'
        stateData.setItemDeleteBtnShow = false
        // stateData.setDistributionBtnShow=false
      } else {
        stateData.setDistributionBtnTitle = '配置分摊比例'
        // stateData.setItemDeleteBtnShow=true
        // stateData.setDistributionBtnShow=true
      }

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
        if (tmpItem.uuid !== '') {
          // 将复制出来的数据 uuid 设置为空值，这样才能作为新数据插入数据库
          tmpItem.uuid = ''
        }

        // propChildrenTable.value.allRows.push(tmpItem)  // 2024-09-18 注释，使用深拷贝
        propChildrenTable.value.allRows.push(commonFunc.DeepCopy(tmpItem))
      }
    }
    // 删除一行事件
    const fDelete = (dataRowIndex) => {
      const tmpId = propChildrenTable.value.allRows[dataRowIndex].id ? propChildrenTable.value.allRows[dataRowIndex].id : propChildrenTable.value.allRows[dataRowIndex].uuid
      if (tmpId) {
        stateData.tmpDelIds.push(tmpId)
        propChildrenTable.value.deleted_ids = stateData.tmpDelIds.toString()
      }
      propChildrenTable.value.allRows.splice(dataRowIndex, 1)
    }

    //预算分摊
    const fDistribution = (dataRowIndex) => {
      // propChildrenTable.value.currentDistributionItem = propChildrenTable.value.allRows[dataRowIndex]
      context.emit('fDistributionCall', dataRowIndex, propChildrenTable.value.allRows)

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
      fSum,
      fDistribution
    }
  }
}
</script>

<style scoped>

.children-tool-bar {
  display: flex;
  justify-content: start;
  align-items: center;
  height: 28px;
}


.children-table-header {
  display: flex;
  flex-wrap: nowrap;
  line-height: 32px;
  /*  min-width: 120px;*/
  margin: 2px 0 0 6px;
  background-color: #edf0f5;
}

.children-table-body {
  margin: 4px 0;
}

div.children-table-container {
  width: 100%;
  display: block;
  padding: 4px 2px 10px 2px;
  overflow-x: auto;
}

/* 行样式 */
div.row-style {
  display: flex;
  flex-wrap: nowrap;
  line-height: 32px;
  margin-top: 2px;
  /*  min-width: 120px;*/
}

/* 非最后一个col元素的样式 */
div.row-style span:not(last-child) {
  border-left: #ececec 1px solid;
  border-top: #ececec 1px solid;
  border-bottom: #ececec 1px solid;
}

/* 最后一个col元素的样式 */
div.row-style span:last-child {
  border-right: #ececec 1px solid;
  border-top: #ececec 1px solid;
  border-bottom: #ececec 1px solid;
}


span.col-style {
  display: inline-block;
  /*  min-width: 120px;*/
  padding-left: 5px;
}

span.col-style-close {
  display: inline-block;
  /*  min-width: 120px;*/
  margin-left: 10px;
}

/* 小计、求和行样式 */
div.row-style-sum {
  display: flex;
  flex-wrap: nowrap;
  line-height: 30px;
  margin-top: 2px;
}

.children-table-body-sum {
  font-family: 'Microsoft YaHei UI Light', system-ui, sans-serif;
  font-weight: bold;
}


</style>
