import tim from "./tim";
import TIM from "tim-js-sdk";
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["tmc", "userInfo"])
  },
  data () {
    return {
      isLoading: true
    };
  },
  methods: {
    ...mapActions({
      changeSDK: "tim/changeSDK", // 改变SDK 状态
      initMsgList: "tim/initMsgList", // 初始化聊天消息
      refreshMsgList: "tim/refreshMsgList", // 更新聊天记录
      refreshPrivateMsgList: "tim/refreshPrivateMsgList", // 更新私聊记录
      setMessageRead: "tim/setMessageRead" // 上报已读
    }),
    unbindEvent () {
      tim.off(TIM.EVENT.MESSAGE_RECEIVED, this.onMessageReceived);
    },
    bindEvent () {
      // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
      tim.on(TIM.EVENT.SDK_READY, this.onReadyStateUpdate, this);
      // // SDK NOT READT
      // tim.on(TIM.EVENT.SDK_NOT_READY, this.onReadyStateUpdate, this);
      // // 被踢出
      // tim.on(TIM.EVENT.KICKED_OUT, () => {
      // });
      // // SDK内部出错
      // tim.on(TIM.EVENT.ERROR, this.onError);
      // 取消监听(防止多次监听的情况)
      tim.off(TIM.EVENT.MESSAGE_RECEIVED, this.onMessageReceived);
      // 收到新消息
      tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage);
      // // 会话列表更新
      // tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, event => {
      // });
    },
    onReadyStateUpdate ({ name }) {
      const _this = this;
      const isSDKReady = name === TIM.EVENT.SDK_READY;
      _this.changeSDK(isSDKReady);
      if (isSDKReady) {
        // 初始化对话列表
        if (_this.tmc.conversationID) {
          _this.initMsgList(_this.tmc.conversationID);
        }
        // 获取未读消息
        let promise = tim.getConversationList();
        promise.then(function (imResponse) {
          const conversationList = imResponse.data.conversationList;
          // console.warn(conversationList);
          _this.$bus.$emit("unReadMsgRes", conversationList);
        }).catch(function (imError) {
          console.warn("getConversationList error:", imError); // 获取会话列表失败的相关信息
        });
      }
      this.isLoading = false;
    },
    async getConversation() {
      const res = await tim.getConversationList();
      return res;
    },
    // 发送三人群消息 showType：0/不传 消息发送成功后展示  1 只展示不发送消息 2 只发送消息不展示
    sendMessage (messageType, payload, groupID, showType) {

      this.timSendMessage(0, messageType, payload, groupID, showType);
    },
    // 发送私聊群消息
    sendPrivateMessage (messageType, payload, groupID, showType) {
      this.timSendMessage(1, messageType, payload, groupID, showType);
    },
    // groupType 0：医患助群 1:私聊群
    timSendMessage (groupType, messageType, payload, groupID, showType) {
      const _this = this;
      // 如果群ID为空，就使用当前选择的群
      if (!groupID) {
        if (groupType === 0) {
          groupID = _this.tmc.conversationID.replace("GROUP", "");
        } else if (groupType === 1) {
          groupID = _this.tmc.privateChatID.replace("GROUP", "");
        }
      }
      // 为了 showType === 2,可能会没有groupID,设置一个默认ID
      if (!groupID) {
        groupID = "default001";
      }
      let message = {};
      let options = {
        to: groupID,
        conversationType: TIM.TYPES.CONV_GROUP,
        payload
      };
      let msg = "";
      switch (messageType) {
        case "TEXT":
          message = tim.createTextMessage(options);
          msg = payload.text;
          break;
        case "IMAGE":
          message = tim.createImageMessage(options);
          msg = "[图片]";
          break;
        case "AUDIO":
          message = tim.createAudioMessage(options);
          msg = "";
          break;
        case "FILE":
          message = tim.createFileMessage(options);
          msg = "[文件]";
          break;
        case "CUSTOM":
          message = tim.createCustomMessage(options);
          msg = "";
          break;
        case "VIDEO":
          message = tim.createVideoMessage(options);
          msg = "[视频]";
          break;
        case "FACE":
          message = tim.createFaceMessage(options);
          msg = "[表情]";
          break;
        case "ADDRESS":
          message = tim.createCustomMessage(options);
          msg = "";
          break;
      }

      if (!showType) {
        // 发送消息
        let promise = tim.sendMessage(message);
        promise.then(function (res) {
          // 发送成功
          _this.$bus.$emit("sendMessageRes", res.data);
          if (groupType === 0) {
            _this.refreshMsgList([res.data.message]);
          } else if (groupType === 1) {
            _this.refreshPrivateMsgList([res.data.message]);
          }
          _this.msg = "";
        }).catch(function (imError) {
          // 发送失败
          console.warn("sendMessage error:", imError);
        });
      } else if (showType === 1) {
        // 不用发送直接展示消息
        if (groupType === 0) {
          _this.refreshMsgList([message]);
        } else if (groupType === 1) {
          _this.refreshPrivateMsgList([message]);
        }
        _this.msg = "";
      } else if (showType === 2) {
        // 发送消息
        tim.sendMessage(message);
      }

      if (msg && showType !== 1 && groupType === 0) {
        let params = {
          msg: msg,
          doctorName: this.tmc.doctorName,
          personID: this.tmc.personID,
          assistantStaffID: this.tmc.assistantStaffID,
          orgID: this.userInfo.orgID
        };
        this.$_http.get(_this.$_API.INTERFACE_TMC_GET_SENDWXMSG, { params }).then(res => { });
      }
      this.$bus.$emit("sendMessageTo", { ...this.tmc, message });
    },
    // 接收im消息 TIMTextElem
    onReceiveMessage ({ data }) {
      // if(!data[0].payload.data&&data[0].type!=="TIMGroupSystemNoticeElem"){
      //   if(this.isOn&&this.$refs.audioRefs){
      //     this.$refs.audioRefs.play()
      //   }
      // }
      if(data){
        let flag = false
        for (let i=0;i<data.length;i++){
          if(!data[i].payload.data&&!data[i].isSystemMessage&&data[i].flow==='in'){
            flag = true;
            break;
          }
        }
        if(flag){
            if(this.isOn&&this.$refs.audioRefs){
              this.$refs.audioRefs.play()
            }
        }
      }
      console.log("receive IM message----------" + JSON.stringify(data));
      this.$bus.$emit("reciveMessage", data);
      const msgPrivateList = data.filter((item) => {
        return item.conversationID.replace("GROUP", "") === this.tmc.privateChatID;
      });
      const msgList = data.filter((item) => {
        return item.conversationID.replace("GROUP", "") === this.tmc.conversationID;
      });
      this.refreshMsgList(msgList);
      this.refreshPrivateMsgList(msgPrivateList);
      this.setCurConversionRead();
    },
    // 取消监听im消息
    onMessageReceived (event) {
      console.log("----取消监听---");
    },
    // 上报当前会话已读
    setCurConversionRead () {
      // 上报群聊已读
      if (this.tmc.conversationID) {
        this.setMessageRead(this.tmc.conversationID);
        this.$bus.$emit("setMessageReadRes", this.tmc.conversationID);
      }
      // 上报私聊已读
      if (this.privateShow && this.tmc.privateChatID) {
        this.setMessageRead(this.tmc.privateChatID);
        this.$bus.$emit("setMessageReadRes", this.tmc.privateChatID);
      }
    }
  }
};
