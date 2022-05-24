/*
这里主要封装一些业务使用的公共函数
 */


export default {
    name: 'commonFunc',
    GetBrowserWidth() {
        return document.body.clientWidth
    },
    GetBrowserHeight() {
        return document.body.clientHeight
    },
    BodyHeight() {
        return (document.body.clientHeight - 110) + 'px'
    },
    TableHeight() {
        return (document.body.clientHeight - 185) + 'px'
    },
    SelectStatus: [
        {value: 1, label: '启用'},
        {value: 0, label: '禁用'}
    ],
    StatusMap: {
        0: '禁用',
        1: '启用'
    },
    CurdActionName: {
        insert: '新增',
        update: '修改',
        delete: '删除'
    },
    PageSizeOptions: [5, 20, 50, 100, 200, 500],
    // 处理异步加载时树形数据格式
    DelNullChildren(data, firstIsSelected) {
        if (data && data.length > 0) {
            return data.map((value, index) => {
                if (index === 0) {
                    value.selected = firstIsSelected
                } else {
                    value.selected = 0
                }
                if (value.children == null) {
                    delete value.children
                    delete value.loading
                }
                return value
            })
        } else {
            return data
        }
    },
    // CURD 相关的公共函数
    Curd: {
        // 参数列表：
        // 1.开发者传递一个bool类型的条件，不满足该条件就会进行提示
        CreateCheck(condition) {
            if (!condition) {
                ElMessage({
                    message: '请选中父级节点，才允许新增！',
                    type: 'error',
                    grouping: true
                })
                return false
            }
            return true
        },
        // 修改数据钱的检查
        // 参数列表参见 CreateCheck 函数
        EditCheck(condition) {
            if (!condition) {
                ElMessage({
                    message: '请选中一条数据进行修改！',
                    type: 'error',
                    grouping: true,
                })
                return false
            }
            return true
        },
        // 删除数据前的校验（适用于多条数据删除动作）
        DestroyCheckForMoreItem(condition) {
            if (!condition) {
                ElMessage({
                    message: '请至少选中一条数据进行删除',
                    type: 'error',
                    grouping: true,
                })
                return false
            }
            return true
        },
        // 删除数据前的校验（适用于单条数据删除动作）
        DestroyCheckForOneItem(condition) {
            if (!condition) {
                ElMessage({
                    message: '请选中一条数据进行删除',
                    type: 'error',
                })
                return false
            }
            return true
        },
        SuccessTips(msg = '成功') {
            ElMessage({
                message: msg,
                type: 'success',
                grouping: true
            })
        },
        FailTips(msg = '失败') {
            ElMessage({
                message: msg,
                type: 'error',
                grouping: true
            })
        },
        // 公共对象
        // 参数列表参见 CreateCheck 函数
        // CommonComponentSelectedCheck(obj_vue, condition) {
        //     if (!condition) {
        //         ElMessage.warning("只允许选中一条数据进行引用")
        //         return false
        //     }
        //     return true
        // },
        // 获取后端public路径
    },
    // 获取数组中字段的拼接值
    // 示例： 参数一：  数组，参数二，数组中的键1，参数三，数组中的键2  ...  依次类推
    // 获取的结果是一个对象，需要通过  obj.键1 、obj.键2  ... 一次类推获取处理后的值
    GetArrayColumnConcatVals() {
        let res = {}
        if (arguments.length >= 2) {
            for (let i = 1; i < arguments.length; i++) {
                res[arguments[i]] = []
            }
            arguments[0].map((item, index) => {
                for (let i = 1; i < arguments.length; i++) {
                    res[arguments[i]].push(item[arguments[i]])
                }
            })
        }
        return res
    },
    // 将一个对象的值进行初始化为0值(相关数据类型的系统默认值)
    objInit(obj) {
        for (let key in obj) {
            switch (typeof obj[key]) {
                case 'string':
                    obj[key] = '';
                    break;
                case 'number':
                    obj[key] = 0;
                    break;
                case 'object':
                    if (obj[key] instanceof Array) {
                        obj[key] = []
                    } else {
                        this.objInit(obj[key]);
                    }
                    break;
                case 'boolean':
                    obj[key] = false;
                    break;
            }
        }
        return obj;
    }
}
