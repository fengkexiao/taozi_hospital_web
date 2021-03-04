// 转诊系统相关api
export default {
  API_LIST_TRANSFER: {

    // 医院分页查询转诊订单
    INTERFACE_HOSPITAL_GET_ORDERS_BY_PAGE: "api/transfer/transferOrder/hospitalGetOrdersByPage",
    // 同意接诊
    INTERFACE_AGREE_RECEIVE: "api/transfer/transferOperate/agreeReceive",
    // 新增治疗信息 / 患者流转
    INTERFACE_ADD_TREATMENT: "api/transfer/transferTreatment/addTreatment",
    // 获取订单详情
    INTERFACE_ORDER_DETAIL: " api/transfer/transferOrder/orderDetail",
    // 获取患者病例资料图片
    INTERFACE_GET_PATIENT_IMGS: " api/transfer/transferOrder/getPatientImgs",
    // 获取科室的列表
    INTERFACE_GET_SECTION_LIST: "api/peachUser/hospitalSection/getSectionList",
    // 获取某一医院的医生列表
    INTERFACE_GET_DOCTOR_LIST: "api/peachUser/hospitalDoctor/getDoctorList",
    // 拒绝接诊
    INTERFACE_REFUSE_RECEIVE: "api/transfer/transferOperate/refuseReceive",
    // 确认入院
    INTERFACE_CONFIRM_IN: "api/transfer/transferOperate/confirmIn",
    // 确认未入院
    INTERFACE_CONFIRM_NOT_IN: "api/transfer/transferOperate/confirmNotIn",
    // 获取治疗信息
    INTERFACE_TREATMENT_LIST: "api/transfer/transferTreatment/treatmentList",
    // 查询医院转诊分润规则
    INTERFACE_RULE_LIST: "api/transfer/transferProfit/ruleList",
    // 新增分润规则
    INTERFACE_ADD_RULE: "api/transfer/transferProfit/addRule",
    // 修改分润规则
    INTERFACE_MODIFY_RULE: "api/transfer/transferProfit/modifyRule",
    // 启用禁用分润规则
    INTERFACE_SWITCH_ENABLE: "api/transfer/transferProfit/switchEnable",
    // 获取transferTreatment
    INTERFACE_GET_TRANSFER_TREATMENT: "api/transfer/transferTreatment/getTransferTreatment",
    // 保存图片的接口
    INTERFACE_SAVE_IMAGE: "api/transfer/transferTreatment/saveImage",
    // 删除图片的接口
    INTERFACE_DELETE_IMAGE: "api/transfer/transferTreatment/deleteImage",
    // 保存结算信息
    INTERFACE_SAVE_SETTLE: "api/transfer/transferTreatment/saveSettle",
    // 修改就诊信息
    INTERFACE_UPDATE_TREATMENT_INFO: "api/transfer/transferTreatment/updateTreatmentInfo",
    // 获取结算信息列表
    INTERFACE_GET_TRANSFER_INFOS: "api/transfer/transferOrder/getTransferInfos",
    // 获取结算信息列表
    INTERFACE_INSPECT_FOR_LEAVE_HOSPITAL: "api/transfer/transferOrder/inspectForLeaveHospital",
    // 获取结算信息列表
    INTERFACE_SETTLE_APPLY: " api/transfer/transferOperate/settleApply",
    // 修改患者信息
    INTERFACE_UPDATE_PATIENT_INFO: " api/transfer/transferOperate/updatePatientInfo",
    // 删除治疗信息
    INTERFACE_REMOVE_TREATMENT: " api/transfer/transferTreatment/removeTreatment",
    // 医院分页查询转诊结算订单
    INTERFACE_HOSPITAL_GET_SETTLE_ORDERS_BY_PAGE: " api/transfer/transferOrder/hospitalGetSettleOrdersByPage",
    // 医院分页查询转诊付款订单
    INTERFACE_HOSPITAL_GET_PAY_ORDERS_BY_PAGE: " api/transfer/transferOrder/hospitalGetPayOrdersByPage",
    // 结算审核确认
    INTERFACE_SETTLE_APPROVAL: "api/transfer/transferOperate/settleApproval",
    // 结算审核拒绝
    INTERFACE_SETTLE_REFUSE: "api/transfer/transferOperate/settleRefuse",
    // 获取财务审核详情
    INTERFACE_AUDIT_DETAIL: "api/transfer/transferOrder/getAuditInfo",
    // 付款驳回
    INTERFACE_PAY_REFUSE: "api/transfer/transferOperate/payRefuse",
    // 付款确认
    INTERFACE_PAY_APPROVAL: "api/transfer/transferOperate/payApproval",
    // 新增科室
    INTERFACE_ADD_SECTION: " api/peachUser/hospitalSection/addSection",
    // 字典服务
    INTERFACE_SYS_DICT_QUERY_LIST: " api/peachUser/sysdict/queryList",
    // 修改科室
    INTERFACE_MODIFY_SECTION: " api/peachUser/hospitalSection/modifySection",
    // 切换科室的状态
    INTERFACE_SWITCH_ENABLE_SECTION: " api/peachUser/hospitalSection/switchEnable",
    // 保存医院推广的相关图片
    INTERFACE_HOSPITAL_PROMOTE_SAVE_IMAGE: " api/peachUser/hospitalPromote/saveImage",
    // 保存医院推广文字信息
    INTERFACE_HOSPITAL_PROMOTE_SAVE_PROMOTE: " api/peachUser/hospitalPromote/savePromote",
    // 删除医院推广的相关图片
    INTERFACE_HOSPITAL_PROMOTE_DELETE_IMAGE: " api/peachUser/hospitalPromote/deleteImage",
    // 获取医生详情：基本信息
    INTERFACE_TRANSFER_GET_DOCTOR: "/api/peachUser/doctorMng/getDoctor",
    // 通过医生电话查询信息
    INTERFACE_GET_DOCTOR_BY_PHONE: " api/peachUser/doctorMng/getDoctorByPhone",
    // 查询转诊分润规则
    INTERFACE_TRANSFER_GET_SHARERULEGROUP_LIST: "api/hospitalUser/shareRuleGroup/list",
    // 删除转诊分润规则
    INTERFACE_TRANSFER_POST_SHARERULEGROUP_DEL: "api/hospitalUser/shareRuleGroup/del",
    // 获取院外所有医生组
    INTERFACE_TRANSFER_GET_OUTSIDEDOC_ALLLIST: "api/hospitalUser/outSideDoc/getAll",
    // 获取医院映射项目
    INTERFACE_TRANSFER_GET_FEEITEMMANAGE_LISTALLMAPPING: "api/hospitalUser/feeItemManage/listAllMapping",
    // 添加转诊分润规则
    INTERFACE_TRANSFER_POST_SHARERULEGROUP_ADD: "api/hospitalUser/shareRuleGroup/add",
    // 获取分润规则详情
    INTERFACE_TRANSFER_POST_SHARERULEGROUP_DETAIL: "api/hospitalUser/shareRuleGroup/detail",
    // 更新分润规则
    INTERFACE_TRANSFER_POST_SHARERULEGROUP_MODIFY: "api/hospitalUser/shareRuleGroup/modify",
    // 分润规则是否禁用
    INTERFACE_TRANSFER_POST_SHARERULEGROUP_SWITCHSTATUS: "api/hospitalUser/shareRuleGroup/switchStatus",
    // 相应分润规则下医生组医生列表
    INTERFACE_TRANSFER_POST_SHARERULEGROUP_RULEDOCTORLIST: "api/hospitalUser/shareRuleGroup/ruleDoctorList",
    // 相应分润规则下医生组医生添加
    INTERFACE_TRANSFER_POST_SHARERULEGROUP_RULEDOCTORADD: "api/hospitalUser/shareRuleGroup/ruleDoctorAdd",
    // 相应分润规则下医生组医生删除
    INTERFACE_TRANSFER_POST_SHARERULEGROUP_RULEDOCTORREMOVE: "api/hospitalUser/shareRuleGroup/ruleDoctorRemove",
    // 分润规则详情
    INTERFACE_TRANSFER_POST_SHARERULEGROUP_RULEDETAIL: "api/hospitalUser/shareRuleGroup/platRuleDetail",
    // 获取收费项目
    INTERFACE_TRANSFER_GET_FEEITEMMANAGE_LIST: "api/hospitalUser/feeItemManage/listStand"

  }
};
