// 智能审方接口文档
export default {
  API_LIST_ASSISTANT: {
    //病症
    INTERFACE_ASSISTANT_PARAS: "api/hospitalUser/orgPara/queryOrgParas",
    //获取医生积分
    INTERFACE_ASSISTANT_ASSISATANTPOINT: "api/tmc/orderPoint/getAssistantPoint",
    // 智能审方查询药品规则
    INTERFACE_ASSISTANT_ASSISTANTRP: "/api/tmc/rp/queryAssistantRpPC",
    // 智能审方查询药品规则
    INTERFACE_ASSISTANT_ASSISTANT_PATIENGBYITEM: "/api/tmc/patient/getAssistantPatientByItem",
    // 智能审方查询药品规则
    INTERFACE_ASSISTANT_STATISTIC: "/api/tmc/patient/getStatisticsInfoWithOrderStatus",
    // 获取订单总金额
    INTERFACE_ASSISTANT_ORDRERSUM: "/api/tmc/goodsOrder/getAssistantOrderSum",
    // 获取订单总金额
    INTERFACE_ASSISTANT_ORDRERSUMHOME: "/api/tmc/patient/getStatisticsInfoPC",
    
    
    
  }
}