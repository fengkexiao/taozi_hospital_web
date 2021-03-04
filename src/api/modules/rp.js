// 云处方相关api
export default {
  API_LIST_RP: {
    // 获取处方列表
    API_RP_PRESCRIPTION_GETRP: "api/rp/prescription/getRp",
    // 药师审方
    API_RP_PRESCRIPTION_REVIEWRP: "api/rp/prescription/reviewRp",
    // 根据医院id列表查询医院
    API_RP_GET_HOSPITAL_NAME_BY_ID:
      "api/peachUser/hospitalMng/getHospitalNameById",
    // 获取处方详情
    API_RP_PRESCRIPTION_GETRPDETAIL: "api/rp/prescription/getRpDetail",
    // 获取患者信息
    API_RP_INQUIRY_GETPATIENTINFO: "api/rp/inquiry/getPatientInfo",
    // 获取问诊订单列表
    API_RP_INQUIRY_GETINQUIRYORDER: "api/rp/inquiry/getInquiryOrder",
    // 开具处方
    API_RP_PRESCRIPTION_MAKERP: "api/rp/prescription/makeRp",
    // 获取患者信息 + 药品信息
    API_RP_INQUIRY_GETPRESCRIBE: "api/rp/inquiry/getPrescribe",
    // 医生响应时间（创建视频房间号一端调用，更新医生忙碌状态）
    API_RP_INQUIRY_RESPONSEINQUIRY: "api/rp/inquiry/responseInquiry",
    // 设置医生在线状态
    API_RP_IMSTATUS_SETFREE: "api/rp/imStatus/setFree",
    // 根据患者用户Id 获取患者信息
    API_PEACHUSER_PERSONUSER_GETPERSONUSERBYPERSONID:
      "api/peachUser/personUser/getPersonUserByPersonID",
    // 根据医生手机号获取医生信息
    API_PEACHUSER_DOCTORMNG_GETDOCTORBYPHONE:
      "api/peachUser/doctorMng/getDoctorByPhone",
    // 云药房
    // 获取商品信息
    API_MEDICINE_MEDICINEGOODS_GETPARTNERGOODSINFOBYLIST:
      "/api/medicine/medicineGoods/getPartnerGoodsInfoByList",
    // 获取药品详情
    API_MEDICINE_MEDICINEPRODUCT_GETMEDICINEINFOBYLIST:
      "/api/medicine/medicineProduct/getMedicineInfoByList",
    // 获取userSig
    API_RP_INITIAL_GETUSERSIG: "api/rp/initial/getUserSig",
    // 创建问诊
    API_RP_CREATE_INQUIRY: "api/rp/inquiry/create",
    // 获取视频房间号
    API_RP_INITIAL_GETROOMID: "api/rp/initial/getRoomId",
    // 视频问诊更新（视频挂断或者取消的时候会调用，更新医生的忙碌状态）
    API_RP_UPDATE_INQUIRY_TYPE: "api/rp/inquiry/updateInquiryType",
    // 结束问诊
    API_RP_END_INQUIRY: "api/rp/inquiry/end",
    // 刷新订单池
    INTERFACE_RP_GET_FRESHORDERPOOL: "api/rp/rpOrder/freshOrderPool2",
    // 抢单
    INTERFACE_RP__GET_GRABORDER: "api/rp/rpOrder/grabOrder",
    // 获取处方订单详情
    INTERFACE_RP_GET_GETDETAIL: "api/rp/rpOrder/getDetail",
    // 历史开方
    INTERFACE_RP_GET_GETLISTBYCONDITION: "api/rp/rpOrder/getListByCondition",
    // 获取处方详情
    INTERFACE_RP_GET_GETRPBYID: "api/rp/prescription/getRpByID",
    // 来源
    INTERFACE_RP_GET_GETALLCLIENT: "api/rp/client/getAllClient",
    // 复核
    INTERFACE_RP_POST_REVIEWRPORDER: "api/rp/rpOrder/reviewRpOrder",
    // 上线
    INTERFACE_RP_POST_CREATERECORD: "api/rp/rpOrder/createRecord",
    // 下线
    INTERFACE_RP_POST_UPDATERECORD: "api/rp/rpOrder/updateRecord",
    // 获取客户
    INTERFACE_RP_GET_GETCLIENTLIST: "api/rp/rpOrder/getClientList",
    // 获取字典
    INTERFACE_RP_GET_GEtSICKNEESSDICT: "api/peachUser/sicknessDict/search",
    // 云端混流
    INTERFACE_RP_POST_VIDEO_MIX: "api/rp/video/mix",
    // 获取配置
    INTERFACE_RP_POST_GETCLIENTORG: "api/rp/client/getClientOrgPara",
    // 历史审方
    INTERFACE_RP_GET_HISTORYRPOFPHAR: "api/rp/prescription/getHistoryRpOfPhar",
    // 查询药师处方列表
    INTERFACE_RP_GET_PENDINGREVIEWRP: "api/rp/prescription/getPendingReviewRp",
    // 云处方药师审核
    INTERFACE_RP_GET_REVIEWDISPATCHRP: "api/rp/prescription/reviewDispatchRp",
    // 获取医生在线状态
    INTERFACE_RP_POST_DOCTORSTATUS: "api/rp/doctorStatus/getDoctorStatus",
    // 药品记录
    INTERFACE_RP_GET_MEDICIENTEMPLATE: "api/rp/rpOrder/getMedicienTemplate",
    // 处方凭证
    INTERFACE_RP_GET_CEERTIFICATEURL: "api/rp/rpOrder/getOrderCertificateUrl",
    // 调用记录日志
    INTERFACE_RP_POST_LOGORDEROP: "api/rp/rpOrder/logOrderOp",
    //药品说明书
    INTERFACE_RP_GET_INSTRUCTION_SEARCH :"/api/rp/instruction/search",
    //获取医生已接诊订单
    INTERFACE_RP_GET_DEALINGORDER: "/api/rp/rpOrder/getDoctorDealingOrder",
    //查询患者轨迹
    INTERFACE_RP_POST_GETPATIENTTRACE: "/api/rp/trace/getPatientTrace",
    //根据orderId获取聊天记录
    INTERFACE_RP_GET_GETIMRECORDBYRPORDERID: "/api/rp/inquiry/getIMRecordByRpOrderID",
    // 查询药品字典列表
    INTERFACE_RP_GET_MEDICINERULE_PAGE: "api/rpmanagement/medicineRule/page",
    // 查询药品字典详情
    INTERFACE_RP_GET_MEDICINERULE_DETAIL: "api/rpmanagement/medicineRule/detail",
    // 查询药品字典禁用启用
    INTERFACE_RP_GET_MEDICINERULE_DISABLE: "api/rpmanagement/medicineRule/disable",
    // 保存药品规则
    INTERFACE_RP_GET_MEDICINERULE_SAVE: "api/rpmanagement/medicineRule/save",
    // 简易创建问诊(视频)
    INTERFACE_RP_POST_SIMPLECREATERECORD: "api/rp/inquiry/simpleCreateRecord",
    // 简易创建问诊(视频 根据业务ID查询，如果有就返回最新创建的，没有就创建)
    INTERFACE_RP_POST_SIMPLECREATERECORDBYBIZID: "api/rp/inquiry/simpleCreateRecordByBizID",
    // 发起视频
    INTERFACE_RP_POST_STARTVIDEO: "api/communication/video/startVideo",
    // 结束视频
    INTERFACE_RP_POST_ENDVIDEO: "api/communication/video/endVideo",
    // 查询药品
    INTERFACE_RP_POST_SEARCH: "api/pharmacy/pharmacyGoods/search",
    // 查询药品分类
    INTERFACE_RP_GET_CLASSIFYLIST: "api/pharmacy/pharmacyGoods/getClassifyList",
    // 查询告警列表
    INTERFACE_RP_GET_DYNAMICRULE_LIST: "api/rpmanagement/dynamicRule/list",
    // 告警规则启用禁用
    INTERFACE_RP_GET_DYNAMICRULE_DISABLE: "api/rpmanagement/dynamicRule/disable",
    // 告警规则添加
    INTERFACE_RP_GET_DYNAMICRULE_SAVE: "api/rpmanagement/dynamicRule/save",
    // 告警规则详情
    INTERFACE_RP_GET_DYNAMICRULE_DETAIL: "api/rpmanagement/dynamicRule/detail",
    // 告警规则删除
    INTERFACE_RP_GET_DYNAMICRULE_DELETE: "api/rpmanagement/dynamicRule/delete",
  }
};
