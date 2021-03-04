// 医护上门相关api
export default {
  API_LIST_NURSE: {
    // 护理管理
    // 获取护理订单信息
    INTERFACE_NURSE_ORDERS: "api/nursing/nursingOrder/getNursingOrderByHospital",
    // 获取护理订单单项的列表信息
    INTERFACE_NURSE_ORDERS_LIST: "api/nursing/houseService/getHouseServicesByOrderID",
    // 取消护理订单单项的列表的订单
    INTERFACE_NURSE_ORDERS_CANCEL: "api/nursing/nursingOrder/cancelNursingOrderByHospital",
    // 获取护理订单单项的列表的订单的护士的信息
    INTERFACE_NURSE_ORDERS_NURSING: "api/peachUser/hospitalDoctor/getDoctorListWithInfo",
    // 分配/更改护理订单单项的列表的订单的护士
    INTERFACE_NURSE_ORDERS_DISTRIBUTION: "api/nursing/houseService/distributeNurseByHospital",
    // 获取护理订单单项的列表的订单的详情
    INTERFACE_NURSE_ORDERS_DETAIL: "api/nursing/nursingOrder/getNursingOrderDetail",
    // 护理价格
    // 获取护理价格列表信息
    INTERFACE_NURSE_ORDERS_PRICE_ONE: "api/peachUser/orgPara/queryOrgPara",
    INTERFACE_NURSE_ORDERS_PRICE_TWO: "api/nursing/hospital/getHospitalPrice",
    // 保存编辑的护理价格信息
    INTERFACE_NURSE_ORDERS_PRICE_SAVE_ONE: "api/peachUser/orgPara/modifyOrgPara",
    INTERFACE_NURSE_ORDERS_PRICE_SAVE_TWO: "api/nursing/hospital/saveHospitalPrice"
  }
};
