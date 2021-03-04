import tim from "@/views/tmcinquiry/conversation/tim";
import { Loading } from "element-ui";
const state = {
  isLogin: false, // tim登录状态
  isSDKReady: false, // tim sdk 是否就绪
  msgList: [], // 消息记录
  nextReqMessageID: "", // 用于续拉，分页续拉时传入该字段
  isCompleted: 0, // 表示是否已经拉完所有消息

  // 私聊
  privateMsgList: [], // 私聊记录
  privateNextReqMessageID: "", // 用于续拉，分页续拉时传入该字段
  privateIsCompleted: 0, // 表示是否已经拉完所有消息

  rpMsgList: [], // rp
  rpMsgNextReqMessageID: "", // 聊天
  rpIsCompleted: 0, // 用于已完成消息
  // 未读消息
  unReadMsg: {}
};
const elLoading = { target: "#main .moreMsg", spinner: "el-icon-loading" };
const mutations = {
  toggleIsLogin (statef, isLogin) {
    state.isLogin = typeof isLogin === "undefined" ? !state.isLogin : isLogin;
  },
  toggleIsSDKReady (state, isSDKReady) {
    state.isSDKReady =
      typeof isSDKReady === "undefined" ? !state.isSDKReady : isSDKReady;
  },
  initMsgList (state, data) {
    state.msgList = data.messageList;
    state.nextReqMessageID = data.nextReqMessageID;
    state.isCompleted = data.isCompleted;
  },
  initRpMsgList (state, data) {
    state.rpMsgList = data.messageList;
    state.rpMsgNextReqMessageID = data.nextReqMessageID;
    state.rpIsCompleted = data.isCompleted;
  },
  getMoreMsgList (state, data) {
    state.msgList = [...data.messageList, ...state.msgList];
    state.nextReqMessageID = data.nextReqMessageID;
    state.isCompleted = data.isCompleted;
  },
  getMoreRpMsgList (state, data) {
    let res = Object.keys(data);
    if (res.length > 0) {
      state.rpMsgList = [...data.messageList, ...state.rpMsgList];
      state.rpMsgNextReqMessageID = data.nextReqMessageID;
      state.rpIsCompleted = data.isCompleted ? 1 : 0;
    }
  },
  refreshMsgList (state, msgList) {
    state.msgList = [...state.msgList, ...msgList];
  },
  refreshRpMsgList (state, msgList) {
    state.rpMsgList = [...state.rpMsgList, ...msgList];
  },
  refreshHistoryMsgList (state, msgList) {
    state.msgList = [...msgList, ...state.msgList];
  },
  // 清空群聊和私聊消息
  cleanMsgList (state) {
    state.privateMsgList = [];
    state.msgList = [];
  },
  cleanRpMsgList () {
    state.privateRpMsgList = [];
    state.rpMsgList = [];
  },
  // 私聊
  initPrivateMsgList (state, data) {
    state.privateMsgList = data.messageList;
    state.privateNextReqMessageID = data.nextReqMessageID;
    state.privateIsCompleted = data.isCompleted;
  },
  getPrivateMoreMsgList (state, data) {
    state.privateMsgList = [...data.messageList, ...state.privateMsgList];
    state.privateNextReqMessageID = data.nextReqMessageID;
    state.privateIsCompleted = data.isCompleted;
  },
  refreshPrivateMsgList (state, msgList) {
    state.privateMsgList = [...state.privateMsgList, ...msgList];
  },
  setCurGroupNoMoreMsg (state) {
    state.isCompleted = 1;
  },
  initrpIsCompleted () {
    state.rpMsgNextReqMessageID=''
    state.rpIsCompleted = 0;
  }
};

const actions = {
  // 登录TIM
  login (context, data) {
    tim
      .login({
        userID: data.userID,
        userSig: data.userSig
      })
      .then(() => {
        context.commit("toggleIsLogin", true);
      })
      .catch((imError) => { });
  },
  // 登出
  logout (context) {
    tim.logout().then(() => {
      context.commit("toggleIsLogin");
    });
  },
  // 改变SDK 状态
  changeSDK (context, isSDKReady) {
    context.commit("toggleIsSDKReady", isSDKReady);
  },
  // 获取聊天消息列表
  initMsgList (context, conversationID) {
    conversationID = "GROUP" + conversationID;
    const loading = Loading.service(elLoading);
    tim
      .getMessageList({ conversationID, count: 15 })
      .then((res) => {
        context.commit("initMsgList", res.data);
        loading.close();
      })
      .catch((err) => {
        console.log(err);
        loading.close();
      });
  },
  // 刷新消息列表
  refreshMsgList (context, msgList) {
    context.commit("refreshMsgList", msgList);
    console.log("消息列表---" + JSON.stringify(msgList));
  },
  // 刷新消息列表
  refreshRpMsgList (context, msgList) {
    context.commit("refreshRpMsgList", msgList);
    console.log("消息列表---" + JSON.stringify(msgList));
  },
  // 刷新历史消息列表
  refreshHistoryMsgList (context, msgList) {
    context.commit("refreshHistoryMsgList", msgList);
    console.log("消息列表---" + JSON.stringify(msgList));
  },
  // 获取更多消息
  getMoreMsg (context, conversationID) {
    conversationID = "GROUP" + conversationID;
    const loading = Loading.service(elLoading);
    const { nextReqMessageID } = state;
    tim
      .getMessageList({ conversationID, nextReqMessageID, count: 15 })
      .then((res) => {
        context.commit("getMoreMsgList", res.data);
        loading.close();
      })
      .catch((err) => {
        console.log(err);
        loading.close();
      });
  },
  // 获取更多消息
  getMoreRpMsg (context, conversationID) {
    conversationID = "C2C" + conversationID;
    const loading = Loading.service(elLoading);
    const { rpMsgNextReqMessageID } = state;
    let nextReqMessageID = rpMsgNextReqMessageID;
    let promise = tim.getMessageList({
      conversationID,
      nextReqMessageID,
      count: 15
    });
    if (promise) {
      promise
        .then((res) => {
          context.commit("getMoreRpMsgList", res.data);
          loading.close();
        })
        .catch((err) => {
          loading.close();
        });
    } else {
      context.commit("getMoreRpMsgList", []);
      loading.close();
    }
  },
  initrpIsCompleted (context, data) {
    context.commit("initrpIsCompleted");
  },
  // 清理消息列表
  cleanMsgList (context) {
    context.commit("cleanMsgList");
  },
  // 清理消息列表
  cleanRpMsgList (context) {
    context.commit("cleanRpMsgList");
  },
  // 获取私聊聊天消息列表
  initPrivateMsgList (context, conversationID) {
    conversationID = "GROUP" + conversationID;
    const loading = Loading.service(elLoading);
    tim
      .getMessageList({ conversationID, count: 15 })
      .then((res) => {
        context.commit("initPrivateMsgList", res.data);
        loading.close();
        // console.log(res.data.messageList);
      })
      .catch((err) => { 
        console.log(err);
        loading.close();
      });
  },
  // 刷新私聊消息列表
  refreshPrivateMsgList (context, msgList) {
    context.commit("refreshPrivateMsgList", msgList);
  },
  // 获取更多消息
  getPrivateMoreMsg (context, conversationID) {
    conversationID = "GROUP" + conversationID;
    const loading = Loading.service(elLoading);
    const { nextReqMessageID } = state;
    tim
      .getMessageList({ conversationID, nextReqMessageID, count: 15 })
      .then((res) => {
        context.commit("getPrivateMoreMsgList", res.data);
        loading.close();
        // console.log(res.data.messageList);
      })
      .catch((err) => {
        loading.close();
      });
  },
  // 上报已读
  setMessageRead (context, conversationID) {
    let newConversationID = "GROUP" + conversationID;
    let promise = tim.setMessageRead({ conversationID: newConversationID });
    promise
      .then(function (imResponse) {
        // 已读上报成功
        console.log("---" + JSON.stringify(imResponse));
      })
      .catch(function (imError) {
        // 已读上报失败
        console.warn("setMessageRead error:", imError);
      });
  },
  // 设置没有更多消息
  setCurGroupNoMoreMsg (context) {
    context.commit("setCurGroupNoMoreMsg");
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
