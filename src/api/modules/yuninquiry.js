// 转诊系统相关api
export default {
  API_LIST_YUNINQUIRY: {

    // 查看医院端问诊列表
    INTERFACE_YUNINQUIR_YINQUIRY_HOS_LIST: " api/yunInquiry/inquiryOrder/inquiryHosList",
    // 查看医院端问诊列表
    INTERFACE_YUNINQUIR_SCHEDULE_LIST: "api/yunInquiry/hospitalSchedule/getDocInquiryPrices",
    // 获取医院通用时间列表
    INTERFACE_YUNINQUIR_GET_BASE_SCHEDULE: "api/yunInquiry/hospitalSchedule/getBaseSchedule",
    // 保存医院通用时间列表
    INTERFACE_YUNINQUIR_SAVE_BASE_SCHEDULE: "api/yunInquiry/hospitalSchedule/saveBaseSchedules",
    // 保存医院通用时间列表
    INTERFACE_YUNINQUIR_GET_DOC_INQUIRY_PRICE: "api/yunInquiry/hospitalSchedule/getDocInquiryPrice",
    // 保存医院通用时间列表
    INTERFACE_YUNINQUIR_SAVE_DOC_INQUIRY_PRICE: "api/yunInquiry/hospitalSchedule/saveDocInquiryPrice",
    // 获取医生排班
    INTERFACE_YUNINQUIR_GET_DOC_SCHEDULE: "/api/yunInquiry/hospitalSchedule/getDocSchedule",
    // 保存医生排班
    INTERFACE_YUNINQUIR_SAVE_DOCTOR_PRACTISE_ON_INTERNET_SCHEDULE: "/api/yunInquiry/hospitalSchedule/saveDoctorPractiseOnInternetSchedule"

  }
};
