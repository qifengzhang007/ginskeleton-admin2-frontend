import axios from '@/libs/api_request'


// 集成的地方三方报表对应的接口可以全部设置在这里
// 一个系统的报表数量总体来讲是有限可控的，因此可以集中、一次性管理

export default {
    name: 'ReportSet',

    // 列车时刻表
    trainTimetable: {
        reportId: "reportTrainTrainTimetable",   //每个需要使用iframe渲染的报表必须设置唯一的报表id
        reportUrl: "http://49.232.145.118:8085/jmreport/view/737519583182499840"
    },

    // 员工基本信息表
    employees: {
        reportId: "reportEmployees",  //每个需要使用iframe渲染的报表必须设置唯一的报表id
        reportUrl: "http://49.232.145.118:8085/jmreport/view/737128175057547264"
    }

}
