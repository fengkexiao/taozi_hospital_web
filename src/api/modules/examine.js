// 开检查单相关api
export default {
  API_LIST_EXAMINE: {

    // 医院停用/开启自己的检查类别
    INTERFACE_TOGGLE_HOSPITAL_CLASS_BY_SELF: "api/transfer/examineHospital/toggleHospitalClassBySelf",
    // 通过类别分页查找检查项目
    INTERFACE_GET_HOSPITAL_ITEM_BY_CLASS_BY_PAGE: "api/transfer/examineHospital/getHospitalItemByClassByPage",
    // 分页查询医院的全部检查项目
    INTERFACE_GET_HOSPITAL_ITEM_BY_PAGE: "api/transfer/examineHospital/getHospitalItemByPage",
    // 平台停用/开启医院的检查项目
    INTERFACE_TOGGLE_HOSPITAL_ITEM_BY_CONSOLE: "api/transfer/examineHospital/toggleHospitalItemByConsole",
    // 医院停用/开启自己的检查项目
    INTERFACE_TOGGLE_HOSPITAL_ITEM_BY_SELF: "api/transfer/examineHospital/toggleHospitalItemBySelf",
    // 获取医院的检查订单列表
    INTERFACE_GET_HOSPITAL_ORDER_BY_PAGE: "api/transfer/examineOrder/getHospitalOrderByPage",
    // 会诊检查订单开单
    INTERFACE_RECEPT_ORDER: "api/transfer/examineOrder/receptOrder",
    // 到院支付开始检查
    INTERFACE_WRITE_OFF_UNDER_LINE: "api/transfer/examineOrder/writeOffUnderLine",
    // 核销核销码
    INTERFACE_WRITE_OFF_TICKET_CODE: "api/transfer/examineOrder/writeOffTicketCode",
    // 获取检查订单详情
    INTERFACE_GET_ORDER_BY_ID: "api/transfer/examineOrder/getOrderByID",
    // 医生查询
    INTERFACE_INTERFACE_USER_DOCTOR_LIST: "api/peachUser/hospitalDoctor/getDoctorList",
    // 前端判断是否显示上传检查报告
    INTERFACE_CHECK_PIC_SHOULD_SHOW: "api/transfer/examineOrder/checkPicShouldShow",
    // 取消订单（未支付取消）
    INTERFACE_CANCEL_ORDER: "api/transfer/examineOrder/cancelOrder",
    // 取消订单（已支付退款）
    INTERFACE_REFUND_ORDER: "api/transfer/examineOrder/refundOrder",
    // 获取检查报告详情
    INTERFACE_GET_REPORT_BY_ORDER_ID: "api/transfer/examineOrder/getReportByOrderID",
    // 是否可以点击完成检查
    INTERFACE_CHECK_REPORT_FINISH: "api/transfer/examineOrder/checkReportFinish",
    // 完成检查
    INTERFACE_FINISH_EXAMINE: "api/transfer/examineOrder/finishExamine",
    // 查询财务结算订单
    INTERFACE_QUERY_HOSPITAL_ORDER_FOR_SETTLE_BY_PAGE: "api/transfer/examineOrder/queryHospitalOrderForSettleByPage",
    // 增加检查报告
    INTERFACE_ADD_REPORT_PIC: "api/transfer/examineOrder/addReportPic",
    // 删除检查报告
    INTERFACE_REMOVE_REPORT_PIC: "api/transfer/examineOrder/removeReportPic",
    // 删除检查报告
    INTERFACE_Cost_Order: "api/transfer/examineOrder/costOrder",
    // 根据医生电话获取医生详情（医生用户 + 医生信息）
    INTERFACE_GET_DOCTOR_BY_PHONE: "api/peachUser/doctorMng/getDoctorByPhone",
    // 根据医生ID获取医生详情（医生用户 + 医生信息）
    INTERFACE_GET_DOCTOR_PHONE_LIST_BY_IDLIST: "api/peachUser/doctorMng/getDoctorPhoneListByIDList",
    // 查询某一医院开通的检查类别
    INTERFACE_GET_HOSPITAL_CLASS_LIST: "api/transfer/examineHospital/getHospitalClassList"
  }
};
