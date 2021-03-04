// TMC内容管理api
export default {
  API_LIST_SYSTEM: {
    // 医生组管理
    // 添加医生组
    INTERFACE_POST_OUTSIDEDOC_ADD: "api/hospitalUser/outSideDoc/add",
    // 获取院外医生组
    INTERFACE_GET_OUTSIDEDOC_LIST: "api/hospitalUser/outSideDoc/list",
    // 删除院外医生组
    INTERFACE_POST_OUTSIDEDOC_DEL: "api/hospitalUser/outSideDoc/del",
    // 修改院外医生组
    INTERFACE_POST_OUTSIDEDOC_MODIFY: "api/hospitalUser/outSideDoc/modify",
    // 获取医生列表
    INTERFACE_GET_DOCTORUSER_DOCTORLIST: "api/peachUser/doctorUser/getHospitalStaffByIds",
    // 获取医生组医生列表
    INTERFACE_GET_OUTSIDEDOC_SEARCHDOC: "api/hospitalUser/outSideDoc/searchDoc",
    // 添加医生到医生组
    INTERFACE_POST_OUTSIDEDOC_ADDDOC: "api/hospitalUser/outSideDoc/addDoc",
    // 从医生组删除医生
    INTERFACE_POST_OUTSIDEDOC_DELDOC: "api/hospitalUser/outSideDoc/delDoc",
    // 查询医院标准项目列表
    INTERFACE_GET_STANDARD_PROJECT_LIST: "api/hospitalUser/feeItemManage/listStand",
    // 添加标准项目
    INTERFACE_POST_STANDARD_PROJECT_ADD: "api/hospitalUser/feeItemManage/addStand",
    // 删除标准项目
    INTERFACE_POST_STANDARD_PROJECT_DELETE: "api/hospitalUser/feeItemManage/delStand",
    // 获取医院映射列表
    INTERFACE_GET_HOSPITALMAP_PROJECT_LIST: "api/hospitalUser/feeItemManage/listMapping",
    // 添加医院映射项目
    INTERFACE_POST_HOSPITALMAP_PROJECT_ADD: "api/hospitalUser/feeItemManage/addMapping",
    // 删除医院映射项目
    INTERFACE_POST_HOSPITALMAP_PROJECT_DELETE: "api/hospitalUser/feeItemManage/delMapping"
  }
};
