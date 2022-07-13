/*
这里主要封装一些业务使用的公共函数
 */
import config from '@/config/index'

export default {
    name: 'commonFunc',
    // 获取当前环境名称：dev=开发环境；pro=编译后环境
    getEnvName() {
        return process.env.NODE_ENV === 'development' ? 'dev' : 'pro'
    },
    // 获取配置项中的服务器ip（也可能是域名）
    getServerIp() {
        return  config[import.meta.env.MODE].serverIp
    },
    // 获取配置项中的接口地址前缀
    getApiUrlPre() {
        return  config[import.meta.env.MODE].apiPre
    },
    // 获取浏览器宽度
    GetBrowserWidth() {
        return document.body.clientWidth
    },
    // 获取浏览器高度
    GetBrowserHeight() {
        return document.body.clientHeight
    },
    // 获取菜单点击后渲染的内容区域高度
    BodyHeight() {
        return (document.body.clientHeight - 110) + 'px'
    },
    // 获取菜单点击后渲染的内容区域中 table 表格容器的高度
    TableHeight() {
        return (document.body.clientHeight - 185) + 'px'
    },
    // 组件select options 使用
    SelectStatus: [
        { value: 1, label: '启用' },
        { value: 0, label: '禁用' }
    ],
    // table数据中 status 为 0、1 映射为中文
    StatusMap: {
        0: '禁用',
        1: '启用'
    },
    // curd操作时顶栏显示的操作名
    CurdActionName: {
        insert: '新增',
        update: '修改',
        delete: '删除'
    },
    // 全局统一分页配置
    PageSizeOptions: [5, 20, 50, 100, 200, 500],
    // CURD 相关的公共函数
    Curd: {
        /*
        新增数据前的检查
        @condition 修改数据时的验证条件，如果不满足条件就提示
        @duration  提示文本持续毫秒
        */
        CreateCheck(condition, duration = 2000) {
            if (!condition) {
                ElMessage({
                    message: '请选中父级节点，才允许新增！',
                    type: 'error',
                    grouping: true,
                    duration: duration,
                    center: true,
                    customClass: "elMessageStyle"
                })
                return false
            }
            return true
        },

        /*
        修改数据前的检查
        参数列表参见 CreateCheck 函数
        @condition 修改数据时的验证条件，如果不满足条件就提示
        @duration  提示文本持续毫秒
        */
        EditCheck(condition, duration = 2000) {
            if (!condition) {
                ElMessage({
                    message: '请选中一条数据进行修改！',
                    type: 'error',
                    grouping: true,
                    duration: duration,
                    center: true,
                    customClass: "elMessageStyle"
                })
                return false
            }
            return true
        },

        /*
        删除数据前的校验（适用于多条数据删除动作）
        @condition  删除多条数据时的验证条件，如果不满足条件就提示
        @duration  提示文本持续毫秒
         */
        DestroyCheckForMoreItem(condition, duration = 2000) {
            if (!condition) {
                ElMessage({
                    message: '请至少选中一条数据进行删除',
                    type: 'error',
                    grouping: true,
                    duration: duration,
                    center: true,
                    customClass: "elMessageStyle"
                })
                return false
            }
            return true
        },

        /*
        删除数据前的校验（适用于单条数据删除动作）
        @condition  删除单条数据时的验证条件，如果不满足条件就提示
        @duration  提示文本持续毫秒
        */
        DestroyCheckForOneItem(condition, duration = 2000) {
            if (!condition) {
                ElMessage({
                    message: '请选中一条数据进行删除',
                    type: 'error',
                    duration: duration,
                    center: true,
                    customClass: "elMessageStyle"
                })
                return false
            }
            return true
        },

        /*
         成功时的提示
         @msg  提示文本
         @duration  提示文本持续毫秒
         */
        SuccessTips(msg = '成功', duration = 800) {
            ElMessage({
                message: msg,
                type: 'success',
                grouping: true,
                duration: duration,
                center: true,
                customClass: "elMessageStyle"
            })
        },

        /*
        失败时的提示
        @msg  提示文本
        @duration  提示文本持续毫秒
        */
        FailTips(msg = '失败', duration = 3000) {
            ElMessage({
                message: msg,
                type: 'error',
                grouping: true,
                duration: duration,
                center: true,
                customClass: "elMessageStyle"
            })
        },

    },

    /*
    获取数组中字段的拼接值
    示例： 参数一：  数组，参数二，数组中的键1，参数三，数组中的键2  ...  依次类推
    获取的结果是一个对象，需要通过  obj.键1 、obj.键2  ... 一次类推获取处理后的值
    */
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

    /*
    将一个对象的值进行初始化为0值(相关数据类型的系统默认值)
    */
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
    },


    /*
    计算权限分析界面需要展开的节点
    @treeArray 用户已有权限的原始数据数组
    @resArray 接受结果的数组，需要用户传入一个空数组接受结果
    */
    getNeedExpandTreeNodeForAnalysis(treeArray = [], resArray = []) {
        for (let i = 0; i < treeArray.length; i++) {
            if (treeArray[i].children) {
                this.getNeedExpandTreeNodeForAnalysis(treeArray[i].children, resArray)
            }
            if (treeArray[i].expand) {
                resArray.push(treeArray[i].id)
            }
        }
    },

    /*
    计算已分配的权限列表界面需要展开的节点
    @treeArray 用户已有权限的原始数据数组
    @resArray 接受结果的数组，需要用户传入一个空数组接受结果
    */
    getNeedExpandTreeNodeForAssignedAuth(treeArray = [], resArray = []) {
        for (let i = 0; i < treeArray.length; i++) {
            if (treeArray[i].children) {
                this.getNeedExpandTreeNodeForAssignedAuth(treeArray[i].children, resArray)
            }
            if (treeArray[i].expand !== undefined && treeArray[i].expand === 1) {
                resArray.push(treeArray[i].system_menu_button_id)
            }
        }
    }

}
