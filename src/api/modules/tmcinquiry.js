// TMC管理子系统相关api
export default {
  API_LIST_TMC: {
    // 工具分类
    // 获取工具分类表
    INTERFACE_TMC_GET_TOOL_CLASSIFY_LIST:
      "api/tmc/classify/getToolClassifyById",
    // 保存分类
    INTERFACE_TMC_POST_TOOL_CLASSIFY_ADD: "api/tmc/classify/saveToolClassify",
    // 删除分类
    INTERFACE_TMC_POST_TOOL_CLASSIFY_DELETE:
      "api/tmc/classify/deleteToolClassify",
    // 修改地址
    INTERFACE_TMC_POST_UPDAE_ADDRESS:
      "api/tmc/goodsOrder/fillDeliveryAddr",
    // 常用语模板
    // 查询常用语模板
    INTERFACE_TMC_GET_PHRASE_TEMPLATE_GET: "api/tmc/classify/getPhraseTemplate",
    // 保存常用语模板
    INTERFACE_TMC_POST_PHRASE_TEMPLATE_SAVE:
      "api/tmc/classify/savePhraseTemplate",
    // 素材模板
    // 查询素材模板
    INTERFACE_TMC_GET_MATERIAL_TEMPLATE_GET:
      "api/tmc/classify/getMaterialTemplate",
    // 保存素材模板
    INTERFACE_TMC_POST_MATERIAL_TEMPLATE_SAVE:
      "api/tmc/classify/saveMaterialTemplate",
    // 患者分级
    // 查询患者分级列表
    INTERFACE_TMC_GET_PATIENT_LEVEL_LIST: "api/tmc/patientLevel/patientLevel",
    // 患者分级列表（未禁用的）
    INTERFACE_TMC_GET_PATIENT_LEVEL_NODISABLELIST:
      "api/tmc/patientLevel/patientLevelByDisable",
    // 保存患者分级列表
    INTERFACE_TMC_POST_PATIENT_LEVEL_SAVE: "api/tmc/patientLevel/save",
    // 启用/禁用分级
    INTERFACE_TMC_POST_MATERIAL_TEMPLATE_DISABLE:
      "api/tmc/patientLevel/disable",
    // 患者信息
    // 获取患者信息列表
    INTERFACE_TMC_GET_PATIENT_LIST: "api/tmc/patient/list",
    // 获取未接诊患者
    INTERFACE_TMC_GET_NO_CONTACT_MULTITALKLIST: "api/tmc/multiTalk/getNoContactMultiTalkList",
    INTERFACE_TMC_GET_NO_CONTACT_MULTITALKLIST_PAGE: "api/tmc/multiTalk/getNoContactMultiTalkPage",
    
    // 按条件查询患者信息
    INTERFACE_TMC_GET_PATIENT_LISTINFO: "api/tmc/patient/getInfoByItem",
    // 获取患者总人数
    INTERFACE_TMC_GET_PATIENT_TOTALNUM: "api/tmc/patient/countPatientNum",
    // 获取患者信息
    INTERFACE_TMC_GET_PATIENT_INFO: "api/tmc/patient/get",
    // 获取患者档案
    INTERFACE_TMC_GET_PATIENT_RECORD: "api/tmc/patient/getPatientDoc",
    // 保存患者信息
    INTERFACE_TMC_POST_PATIENT_INFO_SAVE: "api/tmc/patient/save",
    // 新增患者信息
    INTERFACE_TMC_POST_PATIENT_INFO_ADD: "api/tmc/patient/add",
    // 发送问诊短信
    INTERFACE_TMC_GET_MESSAGE: "api/tmc/patient/sendInquiryMsg",
    // 保存患者档案
    INTERFACE_TMC_POST_PATIENT_INFO_SAVE_DOC: "api/tmc/patient/savePatientDoc",
    // 获取未购药患者
    INTERFACE_TMC_GET_PATIENT_NOT_BUY: "api/tmc/patient/notBuy",
    // 更换医助
    INTERFACE_TMC_GET_CHANGE_ASSISTANT: "api/tmc/patient/repalceAssisDoct",
    // 患者症状
    // 获取患者症状列表
    INTERFACE_TMC_GET_PATIENT_SYMPTOM_LIST: "api/tmc/patientSymptom/list",
    // 保存症状描述
    INTERFACE_TMC_POST_PATIENT_SYMPTOM_SAVE: "api/tmc/patientSymptom/save",
    // 患者沟通
    // 获取患者沟通列表
    INTERFACE_TMC_GET_PATIENT_CONTACT_LIST: "api/tmc/patientContact/list",
    // 保存患者沟通记录
    INTERFACE_TMC_POST_PATIENT_CONTACT_SAVE: "api/tmc/patientContact/save",
    // 复诊任务
    // 获取复诊任务列表
    INTERFACE_TMC_GET_TASK_LIST: "api/tmc/reInquiryTask/list",
    // 创建复诊任务
    INTERFACE_TMC_POST_TASK_ADD: "api/tmc/reInquiryTask/add",
    // 获取到期未复诊
    INTERFACE_TMC_GET_TASK_OVERDUE: "api/tmc/reInquiryTask/overdue",
    // 获取今日需复诊
    INTERFACE_TMC_GET_TASK_TODAY: "api/tmc/reInquiryTask/today",
    // 获取本周需复诊
    INTERFACE_TMC_GET_TASK_WEEK: "api/tmc/reInquiryTask/week",
    // 获取本月需复诊
    INTERFACE_TMC_GET_TASK_MONTH: "api/tmc/reInquiryTask/month",
    // 多方对话
    // 搜索患者
    INTERFACE_TMC_MULTITALK_QUERYPAGE:
    "api/tmc/multiTalk/queryMultiTalkPage",
    // 查询问诊中的所有多方对话列表
    INTERFACE_TMC_GET_INQUIRY_MULTI_TALK_GET:
      "api/tmc/multiTalk/getInquiryMultiTalkList",
    // 查询问诊中的所有多方对话列表
    INTERFACE_TMC_GET_INQUIRY_MULTI_TALK_GET_PAGE:
      "api/tmc/multiTalk/getInquiryMultiTalkPage",
    // 查询员工的所有多方对话列表
    INTERFACE_TMC_GET_ALL_MULTI_TALK:
      "api/tmc/multiTalk/getStaffAllMultiTalkList",
    INTERFACE_TMC_GET_ALL_MULTI_TALK_PAGE:
      "api/tmc/multiTalk/getStaffAllMultiTalkPage",
    // 查询到期未复诊多方对话列表
    INTERFACE_TMC_GET_OUTTIME_MULTI_TALK:
      "api/tmc/multiTalk/getRpInquiryOutTimeMultiTalkList",
    INTERFACE_TMC_GET_OUTTIME_MULTI_TALK_PAGE:
      "api/tmc/multiTalk/getRpInquiryOutTimeMultiTalkPage",
    // 根据复诊时间查询多方对话列表
    INTERFACE_TMC_GET_MULTI_TALK_BYTIME:
      "api/tmc/multiTalk/getRpInquiryMultiTalkListByTime",
    INTERFACE_TMC_GET_MULTI_TALK_BYTIME_PAGE:
      "api/tmc/multiTalk/getRpInquiryMultiTalkPageByTime",
    // 查询未购药多方对话列表
    INTERFACE_TMC_GET_NOPURCHASE_MULTI_TALK:
      "api/tmc/multiTalk/getNoPurchaseMultiTalkList",
    INTERFACE_TMC_GET_NOPURCHASE_MULTI_TALK_PAGE:
      "api/tmc/multiTalk/getNoPurchaseMultiTalkPage",
    // 查询单个对话根据ID
    INTERFACE_TMC_GET_MULTI_TALK_BY_ID: "api/tmc/multiTalk/getMultiTalkByID",
    // 获取订单跟进任务列表
    INTERFACE_TMC_GET_FOLLOW_TASK_MULTI_TALK:
      "api/tmc/multiTalk/getFollowTaskMultiTalkList",
    INTERFACE_TMC_GET_FOLLOW_TASK_MULTI_TALK_PAGE:
      "api/tmc/multiTalk/getFollowTaskMultiTalkPage",
    // 获取最近联系列表
    INTERFACE_TMC_GET_MULTI_TALK_DAY: "api/tmc/multiTalk/list",
    // 根据问诊ID查询对话信息
    INTERFACE_TMC_GET_MULTI_BY_INQUIRYID:
      "api/tmc/multiTalk/getMultiTalkByInquiryID",
    // 创建问诊
    INTERFACE_TMC_POST_CREATE_INQUIRY: "api/tmc/inquiryRecord/createInquiry",
    // 结束问诊
    INTERFACE_TMC_POST_END_INQUIRY: "api/tmc/inquiryRecord/endInquiry",
    // 查询未结束问诊
    INTERFACE_TMC_POST_NOT_END_INQUIRY:
      "api/tmc/inquiryRecord/getNotEndInquiry",
    // 更新多方对话
    INTERFACE_TMC_POST_MULTI_TALK_MODIFY: "api/tmc/multiTalk/modify",
    // 删除多方对话
    INTERFACE_TMC_POST_MULTI_TALK_DEL: "api/tmc/multiTalk/del",
    // 问诊记录
    // 获取正在进行问诊
    INTERFACE_TMC_GET_INQUIRY_RECORD_INQUIRING:
      "api/tmc/inquiryRecord/inquiring",
    // 获取跟进任务
    INTERFACE_TMC_GET_INQUIRY_RECORD_FOLLOW: "api/tmc/inquiryRecord/follow",
    // 结束问诊
    INTERFACE_TMC_POST_INQUIRY_RECORD_END: "api/tmc/inquiryRecord/end",
    // 处方
    // 获取处方列表
    INTERFACE_TMC_GET_RP_LIST: "api/tmc/rp/list",
    // 查询处方列表
    INTERFACE_TMC_GET_RP_GETRPLIST: "api/tmc/rp/getRpList",
    // 获取处方详情
    INTERFACE_TMC_GET_RP_DETAIL: "api/tmc/rp/get",
    // 获取处方详情
    INTERFACE_TMC_GET_RP_DETAIL_INQUIRY: "api/tmc/rp/getRpInfoByInquiryID",
    // 批量获取处方详情
    INTERFACE_TMC_GET_RP_DETAILLIST: "api/tmc/rp/getRpByList",
    // 获取处方详情（通过InquiryID）
    INTERFACE_TMC_GET_RPINFO_DETAIL: "api/tmc/rp/getRpInfoByInquiryID",
    // 新增处方
    INTERFACE_TMC_POST_RP_ADD: "api/tmc/rp/saveRP",
    // 修改处方状态
    INTERFACE_TMC_POST_RP_MODIFY_STATUS: "api/tmc/rp/modifyStatus",
    // 获取药师审核列表
    INTERFACE_TMC_POST_RP_GETRPLISTFORPHAR: "api/tmc/rp/getRpListForPhar",
    // 药师审核处方
    INTERFACE_TMC_POST_RP_REVIEW: "api/tmc/rp/review",
    // 修改处方支付状态
    INTERFACE_TMC_POST_RP_PAY_STATUS: "api/tmc/rp/payStatus",
    // 根据患者获取处方列表
    INTERFACE_TMC_GET_RP_LIST_BY_PERSON: "api/tmc/rp/listByPerson",
    // 药品订单
    // 药房发货列表
    INTERFACE_TMC_GET_GOODSORDER_GETLISTFORDELIVERY:
      "api/tmc/goodsOrder/getListForDelivery",
    // 获取药品订单列表
    INTERFACE_TMC_GET_GOODS_ORDER_LIST: "api/tmc/goodsOrder/list",
    // 选择发货方式
    INTERFACE_TMC_POST_GOODS_ORDER_DELIVERY: "api/tmc/goodsOrder/delivery",
    // 获取订单详情
    INTERFACE_TMC_GET_GOODS_ORDER_DETAIL: "api/tmc/goodsOrder/detail",
    // 财务审核处方
    INTERFACE_TMC_POST_GOODS_ORDER_REVIEW: "api/tmc/goodsOrder/review",
    // 修改价格后发送给患者
    INTERFACE_TMC_POST_GOODS_ORDER_MODIFYPRICE:
      "api/tmc/goodsOrder/modifyPrice",
    // 更新订单状态
    INTERFACE_TMC_POST_GOODS_ORDER_CHANGE_STATUS:
      "api/tmc/goodsOrder/updateDeliveryStatus",
    // 获取患者历史订单
    INTERFACE_TMC_GET_GOODS_ORDER_GET_BY_PERSON:
      "api/tmc/goodsOrder/getOrderByPerson",
    // 医助分组
    // 获取分组列表
    INTERFACE_TMC_GET_ASSISTANT_GROUP_LIST: "api/peachUser/assistantGroup/list",
    // 获取分组(医生医助关系组)
    INTERFACE_TMC_GET_ASSISTANT_GROUP_LISTDATA:
      "api/peachUser/assistantGroup/getAssistantMemberByOrgID",
    // 添加分组
    INTERFACE_TMC_POST_ASSISTANT_GROUP_ADD: "api/peachUser/assistantGroup/add",
    // 获取分组详情
    INTERFACE_TMC_GET_ASSISTANT_GROUP_DETAIL:
      "api/peachUser/assistantGroup/get",
    // 编辑分组
    INTERFACE_TMC_POST_ASSISTANT_GROUP_SAVE:
      "api/peachUser/assistantGroup/save",
    // 启用/禁用分组
    INTERFACE_TMC_POST_ASSISTANT_GROUP_DISABLE:
      "api/peachUser/assistantGroup/disable",
    // 处方分类
    // 获取工具分类列表
    INTERFACE_TMC_GET_RP_CLASSIFY_LIST: "api/tmc/rpClassify/list",
    // 新增分类
    INTERFACE_TMC_POST_RP_CLASSIFY_ADD: "api/tmc/rpClassify/add",
    // 修改分类
    INTERFACE_TMC_POST_RP_CLASSIFY_MODIFY: "api/tmc/rpClassify/modify",
    // 删除分类
    INTERFACE_TMC_POST_RP_CLASSIFY_DEL: "api/tmc/rpClassify/del",
    // 处方模板
    // 获取处方模板
    INTERFACE_TMC_GET_RP_CLASSIFY_GET: "api/tmc/rpTemplate/get",
    // 保存处方模板
    INTERFACE_TMC_POST_RP_CLASSIFY_SAVE: "api/tmc/rpTemplate/save",
    // 查询机构下的所有标签
    INTERFACE_TMC_GET_ORG_TAG: "api/tmc/classify/getOrgTags",
    // 根据talkID查询问诊ID
    INTERFACE_TMC_GET_INQUIRYIDS_BY_TALKID:
      "api/tmc/history/getInquiryIDByTalk",
    // 根据问诊ID查询聊天记录
    INTERFACE_TMC_GET_HISTORY_BY_INQUIRYID:
      "api/tmc/history/findHistoryMsgByInquiryID",
    // 查询患者评价列表
    INTERFACE_TMC_GET_PATIENT_COMMENT: "api/tmc/commentReview/list",
    // 删除患者评价
    INTERFACE_TMC_DELETE_PATIENT_COMMENT: "api/tmc/commentReview/delete",
    // 患者评价审核
    INTERFACE_TMC_REVIEW_PATIENT_COMMENT: "api/tmc/commentReview/review",
    // 患者评价置顶
    INTERFACE_TMC_TOP_PATIENT_COMMENT: "api/tmc/commentReview/top",
    // 保存患者沟通信息
    INTERFACE_TMC_TOP_SAVECONTACT: "api/tmc/patientContact/saveContact",
    // 保存患者沟通信息
    INTERFACE_TMC_POST_UPLOADSAVECONTACT:
      "api/tmc/patientContact/uploadAddSaveContract",
    // 获取患者沟通列表
    INTERFACE_TMC_POST_GETCONTACTLIST: "api/tmc/patientContact/getContactList",
    // 删除患者沟通列表
    INTERFACE_TMC_POST_DELCONTACT: "api/tmc/patientContact/deleteContact",
    // 获取问诊文字
    INTERFACE_TMC_GET_DIAGNOSISTEMPLATE: "api/tmc/diagnosisTemplate/getList",
    // 保存问诊文字
    INTERFACE_TMC_POST_DIAGNOSISTEMPLATE: "api/tmc/diagnosisTemplate/save",
    // 查询问诊记录
    INTERFACE_TMC_GET_INQUIRY_HISTORY: "api/tmc/inquiryRecord/getInquiryRecord",
    // 外呼接口
    INTERFACE_TMC_POST_CALL_DIALOUT: "api/tmc/communication/dialout",
    // 挂机接口
    INTERFACE_TMC_POST_CALL_HANGUP: "api/tmc/communication/hangUp",
    // 7moor添加组/修改组
    INTERFACE_7MOOR_ADD_GROUP: "api/communication/orgSkillGroup/add",
    // 7moor删除组
    INTERFACE_7MOOR_DELETE_GROUP: "api/communication/orgSkillGroup/delete",
    // 查询组
    INTERFACE_7MOOR_GET_GROUPLIST: "api/communication/orgSkillGroup/findList",
    // 查询坐席人员
    INTERFACE_7MOOR_GET_GROUP_FINDPAGE: "api/communication/orgSeat/findPage",
    // 修改坐席组人员
    INTERFACE_7MOOR_ORGSEAT_ADD: "api/communication/orgSeat/add",
    // 删除坐席组人员
    INTERFACE_7MOOR_ORGSEAT_DELETE: "api/communication/orgSeat/delete",
    // 查询医生医助
    INTERFACE_TMC_GET_STAFFLISTWITHJOBTYPE: "api/peachUser/hospitalStaff/getStaffListWithJobType",
    // 查询电话状态
    INTERFACE_7MOOR_ORGSEAT_GET_STATUS: "api/communication/orgSeat/getStatus",
    // 签入
    INTERFACE_7MOOR_ORGSEAT_SIGNIN: "api/communication/orgSeat/signIn",
    // 签出
    INTERFACE_7MOOR_ORGSEAT_SIGNOUT: "api/communication/orgSeat/signOut",
    // 查询曾用药
    INTERFACE_TMC_GET_PATIENTPURCHASWRECORD: "api/tmc/patient/getPatientPurchaseRecord",
    // 查询常用语树
    INTERFACE_TMC_GET_GETTOOLCLASSIFYTREEBYID: "api/tmc/classify/getToolClassifyTreeById",
    // 发送微信订阅
    INTERFACE_TMC_GET_SENDWXMSG: "api/tmc/wxMsg/sendSubscribeMsg",
    // 我的订单
    INTERFACE_TMC_GET_GOODS_ORDER_STAFFLIST: "api/tmc/goodsOrder/getStaffList",
    // 推广组管理
    // 获取推广组列表
    INTERFACE_GET_PROMOTE_GROUP_LIST: "api/tmc/adGroup/getAdGroupList",
    // 新增推广组
    INTERFACE_POST_PROMOTE_GROUP_ADD: "api/tmc/adGroup/addAdGroup",
    // 删除推广组
    INTERFACE_POST_PROMOTE_GROUP_DELETE: "api/tmc/adGroup/deleteAdGroup",
    // 修改推广组
    INTERFACE_POST_PROMOTE_GROUP_UPDATE: "api/tmc/adGroup/modifyAdGroup",
    // 查询推广组内的医助成员
    INTERFACE_GET_PROMOTE_GROUP_ASSISTANT: "api/tmc/adGroup/getAdGroupMemberPage",
    // 查询推广组外的医助
    INTERFACE_GET_PROMOTE_GROUP_OTHER_ASSISTANT: "api/peachUser/assistantGroup/getAssistantMemberPage",
    // 新增推广组医助成员
    INTERFACE_POST_PROMOTE_GROUP_TEAM_ADD: "api/tmc/adGroup/addAdGroupMember",
    // 移除推广组医助成员
    INTERFACE_POST_PROMOTE_GROUP_TEAM_DELETE: "api/tmc/adGroup/deleteAdGroupMember",
    // 修改未沟通
    INTERFACE_POST_MODIFY_PATIENT_CONTACT: "api/tmc/patient/modifyPatientContact",
    // 查询患者的H5短链码
    INTERFACE_GET_PATIENT_H5_URL: "api/tmc/patient/getPatientH5Link",
    // 患者聊天记录
    INTERFACE_POST_TMC_FIND_HISTORYMSG: "api/tmc/history/findHistoryMsgByMultiInquiryID",
    // 视频记录
    INTERFACE_POST_GETPAGEVIDEORECORD: "api/tmc/inquiryRecord/getPageVideoRecord",
    // 电话记录
    INTERFACE_POST_GETPAGECALLRECORD: "api/tmc/inquiryRecord/getPageCallRecord",
    // 患者头像
    INTERFACE_POST_GETPERSONINFOBYPATIENTID: "api/tmc/patient/getPersonInfoByPatientID",
    // 医生头像
    INTERFACE_GET_GETDOCTORINFOBYSTAFFIDS: "api/peachUser/hospitalStaff/getDoctorInfoByStaffIDs",
    // 检查能否合并
    INTERFACE_POST_CHECK_MERGESTATUS: "api/tmc/merge/checkMergeStatus",
    // 合并患者
    INTERFACE_POST_MERGE: "api/tmc/merge/submitMerge",
    // 在线状态
    INTERFACE_GET_GET_ONLINE_STATUS: "api/tmc/patientTrace/getOnLineStatus",
    // 聊天窗口在线状态
    INTERFACE_GET_GET_CHAT_ONLINE_STATUS: "api/tmc/patientTrace/getInstanceStatus",
    // 根据问诊ID查询配送信息
    INTERFACE_GET_BY_INQUIRY_ID: "api/tmc/goodsOrder/getOrderDeliveryByInquiryID"
  }
};
