// 财务管理相关API
export default {
  API_LIST_FINANCE: {
    INTERFACE_FINANCE_BALANCE: "api/peachUser/account/querybalance",
    INTERFACE_FINANCE_BILLS: "api/peachUser/account/queryBills",
    // 充值申请
    INTERFACE_FINANCE_RECHARGE: "api/money/HospitalRechargeRecord/sumbitHospitalRechargeApply",
    // 提现申请
    INTERFACE_FINANCE_WITHDRAWAL: "api/money/HospitalWithdrawRecord/sumbitHospitalWithdrawApply",
    // 获取单个医生支付明细列表
    INTERFACE_GET_FINANCE_DOCTORBILLSLIST: "/api/account/account/queryDoctorBills",
    // 获取医生支付总计列表
    INTERFACE_GET_FINANCE_DOCTORBALANCELIST: "/api/account/account/queryDoctorBalance"
  }
};
