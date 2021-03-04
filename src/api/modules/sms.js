export default {
  API_LIST_SMS: {
    // 保存短信模板
    INTERFACE_POST_SMS_TEMPLATE_ADD: "api/market/marketSmsTemplate/addTemplate",
    // 编辑短信模板
    INTERFACE_POST_SMS_TEMPLATE_EDIT: "api/market/marketSmsTemplate/editTemplate",
    // 删除短信模板
    INTERFACE_POST_SMS_TEMPLATE_DELETE: "api/market/marketSmsTemplate/deleteTemplate",
    // 查询短信模板
    INTERFACE_GET_SMS_TEMPLATE: "api/market/marketSmsTemplate/getOrgTemplateList",
    // 机构查询所有审核通过的短信模板列表
    INTERFACE_GET_REVIEWED_SMS_TEMPLATEALL: "api/market/marketSmsTemplate/getOrgAllReviewedTemplateList",
    // 查询机构所有短信模板列表
    INTERFACE_GET_SMS_TEMPLATEALL: "api/market/marketSmsTemplate/getOrgAllTemplateList",
    // 根据keyID查询短信模板
    INTERFACE_GET_SMS_TEMPLATEBYKEYID: "api/market/marketSmsTemplate/getTemplateByKeyID",
    // 审核短信模板
    INTERFACE_POST_SMS_TEMPLATE_APPROVE: "api/market/marketSmsTemplate/reviewTemplate",
    // 查询任务列表
    INTERFACE_GET_SMS_SMSTASKLIST: "api/market/marketSmsTask/getMarketSmsTaskList",
    // 查询所有任务列表
    INTERFACE_GET_ALL_SMS_SMSTASKLIST: "api/market/marketSmsTask/getAllOrgMarketSmsTaskList",
    // 根据keyID查询任务
    INTERFACE_GET_SMS_SMSTASKBYID: "api/market/marketSmsTask/getMarketSmsTaskByKeyID",
    // 添加短信任务
    INTERFACE_POST_SMS_TASK_SAVE: "api/market/marketSmsTask/addMarketSmsTaskTmc",
    // 编辑短信任务
    INTERFACE_POST_SMS_TASK_EDIT: "api/market/marketSmsTask/editMarketSmsTaskTmc",
    // 删除短信任务
    INTERFACE_POST_SMS_TASK_DELETE: "api/market/marketSmsTask/deleteMarketSmsTaskTmc",
    // 查询短信记录
    INTERFACE_GET_SMS_RECORDLIST: "api/market/marketSmsTaskDetail/getTMCMarketRecordList",
    // 查询标签
    INTERFACE_GET_TMC_ORGTAGS: "api/tmc/classify/getOrgTags",
    // 查询所有医生医助
    INTERFACE_TMC_GET_ASSISTANT_DOCTOR: "api/peachUser/assistantGroup/getAllMemberByOrgID",
    // 发送自定义短信
    INTERFACE_TMC_POST_SENDCUSTOMSMS: "api/market/marketSendMsg/sendCustomSms"
  }
};
