// 智能审方接口文档
export default {
  API_LIST_AUTORE: {
    //智能查询
    INTERFACE_AUTORE_POST_CHECK: "/api/autoreview/dynamicRule/check",
    //智能查询
    INTERFACE_AUTORE_GET_LIST: "/api/autoreview/medicineInstruction/list",
    // 智能审方查询药品规则
    INTERFACE_AUTORE_POST_FLUSHINFO: "/api/autoreview/rationalMedicine/flushInfo",
    // 一键报错
    INTERFACE_AUTORE_POST_SUBMITERROR: "/api/autoreview/rationalMedicine/submitError",
    // 获取全部话术
    INTERFACE_AUTORE_GET_SPEECHCRAFT_GETALL: "/api/autoreview/speechcraft/getAll",
    // 话术调用记录
    INTERFACE_AUTORE_GET_SPEECHCRAFT_RECORDUSE: "/api/autoreview/speechcraft/recordUse",
    // 获取场景
    INTERFACE_AUTORE_GET_SPEECHCRAFT_DETECTSCENE: "/api/autoreview/speechcraft/detectScene",
  }
}