import {ElMessage} from 'element-plus'

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
    SelectStatus: [
        {value: 1, label: '启用'},
        {value: 0, label: '禁用'}
    ],
    StatusMap: {
        0: '禁用',
        1: '启用'
    },
    CurdWay: {
        create: '新增',
        edit: '修改',
        destroy: '删除'

    },
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
        // 1.vue对象
        // 2.检查的条件，为真即可进行下一步，否则给出提示，返回  false
        CreateCheck(obj_vue, condition) {
            if (!condition) {
                ElMessage.warning("请选中父级节点，才允许新增")
                return false
            }
            return true
        },
        // 修改数据钱的检查
        // 参数列表参见 CreateCheck 函数
        EditCheck(obj_vue, condition) {
            if (!condition) {
                ElMessage.warning('请选中一条数据进行修改')
                return false
            }
            return true
        },
        // 删除数据前的校验（适用于单条数据删除动作）
        DestroyCheckForOneItem(obj_vue, condition) {
            if (!condition) {
                ElMessage.warning('请选中一条数据进行删除')
                return false
            }
            return true
        },
        // 删除数据前的校验（适用于多条数据删除动作）
        DestroyCheckForMoreItem(obj_vue, condition) {
            if (!condition) {
                ElMessage.warning('请选中一条或者多条数据进行删除')
                return false
            }
            return true
        },
        SuccessTips(obj_vue, msg) {
            ElMessage.success("成功")
        },
        FailTips(obj_vue, msg) {
            ElMessage.warning("失败")
        },
        // 公共对象
        // 参数列表参见 CreateCheck 函数
        CommonComponentSelectedCheck(obj_vue, condition) {
            if (!condition) {
                ElMessage.warning("只允许选中一条数据进行引用")
                return false
            }
            return true
        },
        // 获取后端public路径
    },
    // 获取数组中字段的拼接值
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
