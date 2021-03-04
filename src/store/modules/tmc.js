import { TMC_LIVE_ADDRESS, TENCENT_LIVE_BIZ_ID } from "@/common/Constant";

const state = {
  personID: "", // 个人ID
  patientID: "", // 患者ID
  patientName: "", // 患者姓名
  doctorStaffID: "", // 医生ID
  doctorName: "", // 医生姓名
  assistantStaffID: "", // 医助ID
  assistantName: "", // 医助姓名
  inquiryID: "", // 问诊ID
  groupName: "", // 当前会话分组
  conversationID: "", // 当前会话ID
  privateChatID: "", // 当前私聊ID
  multiTalkID: "", // 当前多方对话ID
  unreadCountPrivate: 0, // 私聊未读消息
  privateShow: false, // 私聊窗口开关状态
  // 多方对话对象
  multiTalk: {},
  // peachUser person的信息
  patient: {},
  // 医生的信息
  doctor: {},
  // 医助的信息
  assistant: {},
  // tmc patient的信息
  tmcPatient: {},
  // 包含patient doctor assistant
  groupObj: {},
  // 聊天右边菜单页面控制
  activeIndex: "1",
  // 历史问诊ID列表
  historyInquiryList: [],
  // 医生视频流
  doctorStreamID: "",
  // 患者视频流
  patientStreamID: "",
  // 医生直播地址
  doctorLiveAddress: "",
  // 患者直播地址
  patientLiveAddress: "",
  // 保存聊天记录
  saveChatLog: ""
};

const mutations = {
  changeChat(state, data) {
    state.doctorStaffID = data.doctorStaffID;
    state.doctorName = data.doctorName;
    state.assistantStaffID = data.assistantStaffID;
    state.assistantName = data.assistantName;

    state.personID = data.personID;
    state.patientID = data.patientID;
    state.patientName = data.patientName;
    state.multiTalkID = data.multiTalkID;
    state.conversationID = data.conversationID;
    // 问诊ID和会话ID相同
    state.inquiryID = data.conversationID;
    state.privateChat = data.privateChat;
    state.groupName = data.groupName;
    if (data.conversationID) {
      state.privateChatID = "p-" + data.conversationID;
    }
    // 私聊未读消息
    state.unreadCountPrivate = data.unreadCountPrivate;
    state.multiTalk = data.multiTalk || {};
    state.doctor = data.doctor || {};
    state.assistant = data.assistant || {};
    state.patient = data.patient || {};
    state.tmcPatient = data.tmcPatient || {};
    // 添加角色
    state.patient.role = "患者";
    state.doctor.role = "医生";
    state.assistant.role = "医助";
    // 封装 groupObj
    state.groupObj = {};
    state.groupObj[state.assistantStaffID] = state.assistant;
    state.groupObj[state.doctorStaffID] = state.doctor;
    state.groupObj[state.patientID] = state.patient;
  },
  resetConversationID(state, conversationID) {
    // 问诊ID和会话ID相同
    state.conversationID = conversationID;
    state.inquiryID = conversationID;
  },
  resetPrivateChatID(state, privateChatID) {
    state.privateChatID = privateChatID;
  },
  resetAllInfo(state) {
    state = {
      personID: "", // 个人ID
      patientID: "", // 患者ID
      patientName: "", // 患者姓名
      doctorStaffID: "", // 医生ID
      doctorName: "", // 医生姓名
      assistantStaffID: "", // 医助ID
      assistantName: "", // 医助姓名
      inquiryID: "", // 问诊ID
      groupName: "", // 当前会话分组
      conversationID: "", // 当前会话ID
      privateChatID: "", // 当前私聊ID
      patient: {},
      doctor: {},
      assistant: {},
      groupObj: {},
      // 聊天右边菜单页面控制
      activeIndex: "0"
    };
  },
  saveChatLog(state) {
    state.saveChatLog = new Date().getTime();
  },
  // initState(state, data) {
  //   state.personID = data.personID;
  //   state.patientID = data.patientID;
  //   state.patientName = data.patientName;
  //   state.doctorStaffID = data.doctorStaffID;
  //   state.doctorName = data.doctorName;
  //   state.assistantStaffID = data.assistantStaffID;
  //   state.assistantName = data.assistantName;
  //   state.inquiryID = data.keyID;
  //   state.groupName = data.groupName;
  //   state.multiTalkID = data.multiTalkID;
  //   state.conversationID = "";
  //   state.privateChatID = "";

  //   state.patient = data.patient || {};
  //   state.tmcPatient = data.tmcPatient || {};
  //   state.doctor = data.doctor || {};
  //   state.assistant = data.assistant || {};

  //   // 添加角色
  //   state.patient.role = "患者";
  //   state.doctor.role = "医生";
  //   state.assistant.role = "医助";
  //   // 封装 groupObj
  //   state.groupObj = {};
  //   state.groupObj[state.assistantStaffID] = state.assistant;
  //   state.groupObj[state.doctorStaffID] = state.doctor;
  //   state.groupObj[state.patientID] = state.patient;
  // },
  changeActiveIndex(state, activeIndex) {
    state.activeIndex = activeIndex;
  },
  // 清空tmc消息
  clearTmcMsg(state) {
    state.inquiryID = "";
    state.conversationID = "";
    state.privateChatID = "";
  },
  // 清空tmc
  clearTmc(state) {
    state.personID = "";
    state.patientID = "";
    state.patientName = "";
    state.doctorStaffID = "";
    state.doctorName = "";
    state.assistantStaffID = "";
    state.assistantName = "";
    state.inquiryID = "";
    state.groupName = "";
    state.conversationID = "";
    state.privateChatID = "";
    state.multiTalkID = "";
    state.patient = {};
    state.doctor = {};
    state.assistant = {};
    state.tmcPatient = {};
    state.groupObj = {};
    state.activeIndex = "0";
  },
  // 改变私聊未读消息
  changeUnreadCountPrivate(state, unreadCountPrivate) {
    state.unreadCountPrivate = unreadCountPrivate;
  },
  // 改变私聊窗口状态
  changePrivateShow(state, privateShow) {
    state.privateShow = privateShow;
  },
  // 修改历史问诊ID
  changeHistoryInquiryList(state, list) {
    state.historyInquiryList = list;
  },
  // 修改直播地址
  changeLiveStreamID(state, liveStream) {
    state.doctorStreamID = TENCENT_LIVE_BIZ_ID + "_" + liveStream.doctorStreamID;
    state.patientStreamID = TENCENT_LIVE_BIZ_ID + "_" + liveStream.patientStreamID;
    state.doctorLiveAddress = TMC_LIVE_ADDRESS + liveStream.doctorStreamID;
    state.patientLiveAddress = TMC_LIVE_ADDRESS + liveStream.patientStreamID;
  },
  // 更新group
  updateGroupObj(state, data) {
    if (data) {
      for (let i = 0; i < data.length; i++) {
        state.groupObj[data[i].keyID] = data[i] || {};
      }
    }
  }
};

const actions = {
  updateGroupObj(context, data) {
    context.commit("updateGroupObj", data);
  },
  saveChatLog(context) {
    context.commit("saveChatLog");
  },
  changeChatFun(context, data) {
    context.commit("changeChat", data);
  },
  // initStateFun(context, data) {
  //   context.commit("initState", data);
  // },
  resetConversationID(context, conversationID) {
    context.commit("resetConversationID", conversationID);
  },
  resetPrivateChatID(context, privateChatID) {
    context.commit("resetPrivateChatID", privateChatID);
  },
  changeActiveIndex(context, activeIndex) {
    context.commit("changeActiveIndex", activeIndex);
  },
  clearTmcMsgFun(context) {
    context.commit("clearTmcMsg");
  },
  clearTmcFun(context) {
    context.commit("clearTmc");
  },
  changeUnreadCountPrivateFun(context, unreadCountPrivate) {
    context.commit("changeUnreadCountPrivate", unreadCountPrivate);
  },
  changePrivateShowFun(context, privateShow) {
    context.commit("changePrivateShow", privateShow);
  },
  changeHistoryInquiryListFun(context, list) {
    context.commit("changeHistoryInquiryList", list);
  },
  changeLiveStreamIDFun(context, liveStream) {
    context.commit("changeLiveStreamID", liveStream);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
