// 共享诊室子系统相关api
export default {
  API_LIST_SHARE_ROOM: {
    // 共享诊室
    // 获取共享诊室列表(医院)
    INTERFACE_SHARE_ROOM_LIST: "api/shareRoom/hospitalRoom/getRoomsOfHospital",
    // 获取共享诊室详情
    INTERFACE_SHARE_ROOM_INFO: "api/shareRoom/hospitalRoom/getRoomInfo",
    // 获取共享诊室图片
    INTERFACE_SHARE_ROOM_PICTURE: "api/shareRoom/hospitalRoom/getRoomPics",
    // 保存共享诊室
    INTERFACE_SHARE_ROOM_ADD: "api/shareRoom/hospitalRoom/addRoomInfo",
    // 修改共享诊室
    INTERFACE_SHARE_ROOM_MODIFY: "api/shareRoom/hospitalRoom/modifyRoomInfo",
    // 开放/关闭共享诊室
    INTERFACE_SHARE_ROOM_CHANGE: "api/shareRoom/hospitalRoom/changeRoomStatus",
    // 查询共享诊室排期
    INTERFACE_SHARE_ROOM_PLAN_GET: "api/shareRoom/hospitalRoom/getRoomPlan",
    // 保存共享诊室排期
    INTERFACE_SHARE_ROOM_PLAN_SAVE: "api/shareRoom/hospitalRoom/saveRoomPlan",

    // 医生预订订单
    // 获取医生预订订单列表(医院)
    INTERFACE_SHARE_ROOM_ORDER_LIST: "api/shareRoom/doctorRoomHold/getDoctorHoldOrders",
    // // 获取医生详情：基本信息
    // INTERFACE_GET_DOCTOR: "/api/peachUser/doctorMng/getDoctor",
    // // 获取医生详情：证书
    // INTERFACE_GET_DOCTORCERTIFIES: "/api/peachUser/doctorMng/getDoctorCertifies",
    // 获取医生预订订单详情
    INTERFACE_SHARE_ROOM_ORDER_INFO: "api/shareRoom/doctorRoomHold/getDoctorHoldOrder",
    // 获取医生预订时段详情
    INTERFACE_SHARE_ROOM_ORDER_PERIOD: "api/shareRoom/doctorRoomHold/getDoctorHoldPeriod",
    // 同意医生预订订单
    INTERFACE_SHARE_ROOM_ORDER_ACCEPT: "api/shareRoom/doctorRoomHold/acceptDoctorHoldOrder",
    // 拒绝医生预订订单
    INTERFACE_SHARE_ROOM_ORDER_REJECT: "api/shareRoom/doctorRoomHold/rejectDoctorHoldOrder",
    // 查询医生ID集合是否已多点执业
    INTERFACE_SHARE_ROOM_ORDER_LIST_PRACTICE: "api/peachUser/hospitalDoctorPractice/getDoctorIsPracticeInHospital",

    // 患者预约到院
    // 获取患者预约列表(医院)
    INTERFACE_SHARE_ROOM_BOOK_LIST: "api/shareRoom/personRoomBook/getPersonBooks",
    // 标记、撤销未到院
    INTERFACE_SHARE_ROOM_BOOK_MARK: "api/shareRoom/personRoomBook/doPersonBookUncome",
    // 获取患者预约到院详情
    INTERFACE_SHARE_ROOM_BOOK_INFO: "api/shareRoom/personBookCost/getPersonBookCostDetails",

    // 患者到院结算
    // 获取患者结算费用明细
    INTERFACE_SHARE_ROOM_COST_INFO: "api/shareRoom/personBookCost/getPersonBookCostDetails",
    // 获取更多费用项目列表
    INTERFACE_SHARE_ROOM_COST_ITEM_MORE: "api/shareRoom/chargeRule/getChargeRuleByHospital",
    // 提交结算、重新结算
    INTERFACE_SHARE_ROOM_COST_SAVE: "api/shareRoom/personBookCost/savePersonBookCostDetails",

    // 获取患者预约结算单列表
    INTERFACE_SHARE_ROOM_COST_LIST: "api/shareRoom/personBookCost/getPersonBookCosts",
    // 审核患者预约结算单
    INTERFACE_SHARE_ROOM_COST_AUDIT: "api/shareRoom/personBookCost/auditPersonBookCos",
    // 获取患者结算付款单列表
    INTERFACE_SHARE_ROOM_PAY_LIST: "api/shareRoom/personBookCost/getPersonBookPays",
    // 患者结算付款单付款
    INTERFACE_SHARE_ROOM_COST_PAY: "api/shareRoom/personBookCost/payPersonBookCost",
    // 患者结算付款单分账
    INTERFACE_SHARE_ROOM_COST_PROFIT: "api/shareRoom/personBookCost/profitPersonBookCost",

    // 查询多点执业医生列表
    INTERFACE_SHARE_ROOM_PRACTICE_LIST: "api/peachUser/hospitalDoctorPractice/getHospitalDoctorPracticeList",
    // 根据医生电话获取医生详情（医生用户 + 医生信息）
    INTERFACE_SHARE_ROOM_DOCTOR_BY_PHONE: "api/peachUser/doctorMng/getDoctorByPhone",
    // 根据医生ID查询医生详情（医生用户 + 医生信息）
    INTERFACE_SHARE_ROOM_DOCTOR_BY_KEYID: "api/peachUser/hospitalDoctor/getDoctor",
    // 添加已有多点执业医生
    INTERFACE_SHARE_ROOM_PRACTICE_ADD: "api/peachUser/hospitalDoctorPractice/addHospitalDoctorPractice",
    // 给新添加的多点执业医生发送验证码
    INTERFACE_SHARE_ROOM_PRACTICE_SMS: "api/peachUser/hospitalDoctorPractice/getCode",
    // 审核邀请码
    INTERFACE_SHARE_ROOM_PRACTICE_VALIDATE: "api/peachUser/hospitalDoctorPractice/validateCode",
    // 医院审核医生发起的执业申请
    INTERFACE_SHARE_ROOM_PRACTICE_APPLY: "api/peachUser/hospitalDoctorPractice/toExamineAdopt",

    // 共享诊室结算审核
    // 获取共享诊室结算审核、付款列表
    INTERFACE_FINANCE_SETTLE_LIST: "api/shareRoom/personBookCost/getPersonBookCosts",
    // 提交共享诊室结算审核
    INTERFACE_FINANCE_SETTLE_SAVE: "api/shareRoom/personBookCost/auditPersonBookCost",
    // 共享诊室结算审核：审核通过、审核不通过、驳回付款
    INTERFACE_FINANCE_SETTLE_AUDIT_PASS: "api/shareRoom/personBookCost/auditPersonBookCost",
    // 共享诊室结算审核：确认付款
    INTERFACE_FINANCE_SETTLE_AUDIT_PAY: "api/shareRoom/personBookCost/personBookCostPay"
  }
};
