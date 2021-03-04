import { mapGetters, mapActions } from "vuex";
// eslint-disable-next-line import/no-duplicates
import { VIDEO_CLIENT_ID } from "@/common/Constant";
// eslint-disable-next-line import/no-duplicates
// import { TMC_LIVE_ADDRESS } from "@/common/Constant";
// import { TENCENT_LIVE_BIZ_ID } from "@/common/Constant";

export default {
  computed: {
    ...mapGetters(["tmc", "userInfo"])
  },
  data() {
    return {
      // 视频发起群ID
      videoInquiryID: "",
      // 视频发起者ID
      videoPatientID: "",
      // 视频对话信息
      videoMultiTalk: null,
      // 视频发起人姓名
      videoFromName: "",
      // 视频框展示
      videoVisible: false,
      // 电话展示框
      phoneVisible: false,
      // 确认视频框展示
      confirmVideoVisible: false,
      // 视频房间号
      roomID: 0,
      // 云问诊ID
      rpInquiryID: "",
      // 视频发起类型 1 患者发起 2医助发起
      videoStartType: 0,
      // 更新问诊状态参数
      updateInquiryParam: {
        // 问诊ID
        keyID: "",
        // 问诊状态 0:待接诊 1:已接诊 2:未响应 3:拒绝 4:取消
        inquiryType: 0,
        // 用户ID
        clientUserID: "",
        // 医生ID
        doctorID: ""
      },
      // 电话状态
      callState: false,
      doctorStreamID: "",
      patientStreamID: ""
    };
  },
  methods: {
    ...mapActions({
      updateGroupObj: "tmc/updateGroupObj" // 更新消息对象
    }),
    /** ----------------dealVideo-start--------------- */
    startVideo() {
      if (this.userInfo.jobType === 0) {
        // 医生发起问诊
        this.createRpInquiry();
        // 去过30秒未接听就取消
        setTimeout(() => {
          if (!this.roomID) {
            this.hangup();
          }
        }, 30000);
      } else if (this.userInfo.jobType === 1) {
        // 医助发起视频(给医生发送消息)
        let data = {
          customType: "sys",
          childType: "video",
          data: {
            sendFrom: "assistant",
            videoInquiryID: this.tmc.inquiryID
          }
        };
        let payload = {
          data: JSON.stringify(data),
          description: "[视频接诊消息]",
          extension: "tmc"
        };
        this.sendMessage("CUSTOM", payload);
        this.$message.success("等待医生接听视频");
      }
    },
    startPhone(payload) {
      // this.$refs.popPhone.startTime();
      // 防止连续点击
      if (this.callState === false) {
        // 如果没有问诊创建问诊
        if (!this.tmc.conversationID) {
          this.createCallInquiry("CALL", payload, "", 2);
        }
        this.callPhone();
      } else {
        this.$message({
          message: "您点击太快啦",
          type: "warning"
        });
      }
    },
    callPhone() {
      let params = {
        staffID: this.userInfo.keyID,
        // staffID: "20011315503005271990514001",
        jobType: this.userInfo.jobType,
        phoneNum: this.tmc.tmcPatient.phone
      };
      this.callState = true;
      this.$_http
        .post(this.$_API.INTERFACE_TMC_POST_CALL_DIALOUT, params)
        .then(res => {
          if (!res) return;
          if (res.data === "Dialout") {
            this.phoneVisible = true;
            setTimeout(() => {
              this.callState = false;
            }, 3000);
          }
        })
        .catch(() => {
          this.callState = false;
        });
    },
    hangdown() {
      this.endCallInquiry();
      this.callState = false;
    },
    // 创建问诊 showType：0 消息发送成功后展示 1 只展示不发送消息 2 只发送消息不展示
    createCallInquiry(messageType, payload, groupID, showType) {
      const {
        patientID,
        assistantStaffID,
        assistantName,
        doctorStaffID,
        doctorName,
        multiTalkID
      } = this.tmc;
      this.$_http
        .post(this.$_API.INTERFACE_TMC_POST_CREATE_INQUIRY, {
          orgID: this.userInfo.orgID,
          patientID,
          assistantStaffID,
          assistantName,
          doctorStaffID,
          doctorName,
          talkID: multiTalkID
        })
        .then(res => {
          if (!res.data.keyID) return;
          this.resetConversationID(res.data.keyID);
          this.resetPrivateChatID(res.data.privateIM);
          // this.sendMessage(messageType, payload, groupID, showType);
        });
    },
    // 创建rp问诊(用this.videoMultiTalk创建就是医助发起视频)
    createRpInquiry() {
      let params = {};
      if (this.videoStartType === 2) {
        // 医助发起的视频(医助发起问诊就不一定是医生当前选择的患者)
        params = {
          bizID: this.videoMultiTalk.multiTalk.imID,
          bizType: "tmc",
          // clientID 常量
          clientID: VIDEO_CLIENT_ID,
          sponsorsID: this.userInfo.keyID,
          sponsorsName: this.userInfo.name || "noDoctor",
          receiverID: this.videoMultiTalk.multiTalk.imID,
          receiverName: this.videoMultiTalk.multiTalk.imID,
          patientName: this.videoMultiTalk.patient.personName,
          doctorID: this.userInfo.keyID,
          clientUserID: this.videoMultiTalk.multiTalk.imID,
          // 0患者发起，1医生发起
          requestRole: "1",
          patientInfo: {
            patientName: this.videoMultiTalk.patient.personName,
            patientSex: this.videoMultiTalk.patient.sex,
            patientAge: 0, // age需要根据生日计算
            patientPhone: this.videoMultiTalk.tmcPatient.phone,
            patientIdNo: this.videoMultiTalk.tmcPatient.idNumber || ""
          }
        };
      } else {
        // 医生自己发起的视频
        params = {
          bizID: this.tmc.conversationID || this.videoMultiTalk.multiTalk.imID,
          bizType: "tmc",
          // clientID 常量
          clientID: VIDEO_CLIENT_ID,
          sponsorsID: this.userInfo.keyID,
          sponsorsName: this.userInfo.name || "noDoctor",
          receiverID: this.tmc.conversationID || this.videoMultiTalk.multiTalk.imID,
          receiverName: this.tmc.conversationID || this.videoMultiTalk.multiTalk.imID,
          patientName: this.tmc.patient.personName || this.videoMultiTalk.patient.personName,
          doctorID: this.userInfo.keyID,
          clientUserID: this.tmc.conversationID,
          // 0患者发起，1医生发起
          requestRole: "1",
          patientInfo: {
            patientName: this.tmc.patient.personName,
            patientSex: this.tmc.patient.sex,
            patientAge: 0, // age需要根据生日计算
            patientPhone: "",
            patientIdNo: this.tmc.patientIdNo || ""
          }
        };
      }
      this.$_http.post(this.$_API.API_RP_CREATE_INQUIRY, params).then(
        res => {
          // 展示弹框
          this.videoVisible = true;
        },
        res => {
          if (res.code === -1) {
            this.$message.warning(res.data.message);
          } else {
            alert("发起视频失败");
          }
        }
      );
    },
    // 接收视频
    acceptVideo() {
      this.confirmVideoVisible = false;
      if (this.videoStartType === 1) {
        // 患者发起
        this.getRoomID();
      } else if (this.videoStartType === 2) {
        // 医助发起
        this.startVideo();
      }
    },
    // 拒绝视频
    rejectVideo() {
      this.confirmVideoVisible = false;
      let data = {
        customType: "sys",
        childType: "video",
        data: {
          name: this.userInfo.keyID,
          time: new Date().getTime(),
          type: "reject",
          requestRole: "1"
        }
      };
      let payload = {
        data: JSON.stringify(data),
        description: "[视频接诊消息]",
        extension: "tmc"
      };
      this.sendMessage("CUSTOM", payload, this.videoInquiryID);
    },
    // 挂断视频
    hangup() {
      this.videoVisible = false;
      // 发送房间号
      let data = {};
      if (this.roomID) {
        data = {
          customType: "sys",
          childType: "video",
          data: {
            name: this.userInfo.keyID,
            time: new Date().getTime(),
            type: "hangUp",
            requestRole: "1"
          }
        };
        // 结束问诊
        this.endRpInquiry();
      } else {
        data = {
          customType: "sys",
          childType: "video",
          data: {
            name: this.userInfo.keyID,
            time: new Date().getTime(),
            type: "cancel",
            requestRole: "1"
          }
        };
        // 更新问诊状态
        this.updateRpInquiry(4);
      }
      let payload = {
        data: JSON.stringify(data),
        description: "[视频接诊消息]",
        extension: "tmc"
      };
      this.sendMessage("CUSTOM", payload, this.videoInquiryID);
    },
    // 获取房间号
    getRoomID() {
      let params = {
        inquiryId: this.rpInquiryID,
        // 发送者
        sponsorsId: this.userInfo.keyID,
        // 接收者
        receiverId: this.videoPatientID
      };
      this.$_http
        .get(this.$_API.API_RP_INITIAL_GETROOMID, {
          params
        })
        .then(res => {
          console.log("------getRoomID------" + JSON.stringify(res.data));
          this.roomID = res.data.roomId;
          this.videoVisible = true;
          // 发送房间号
          let data = {
            customType: "sys",
            childType: "video",
            data: {
              name: this.userInfo.keyID,
              time: new Date().getTime(),
              roomId: this.roomID,
              receiverStreamId: res.data.receiverStreamId,
              sponsorsStreamId: res.data.sponsorsStreamId,
              type: "accept",
              requestRole: "1"
            }
          };
          let payload = {
            data: JSON.stringify(data),
            description: "[视频接诊消息]",
            extension: "tmc"
          };
          this.sendMessage("CUSTOM", payload, this.videoInquiryID);
          this.responseRpInquiry();
        });
    },
    // 根据问诊ID查询患者信息 type 0 医生查询 1 医助查询
    getMultitalkByInquiryID(type) {
      let params = {
        orgID: this.userInfo.orgID,
        inquiryID: this.videoInquiryID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_MULTI_BY_INQUIRYID, { params })
        .then(res => {
          if (res && res.data) {
            this.videoMultiTalk = res.data;
            if (this.videoMultiTalk.tmcPatient) {
              this.videoFromName = this.videoMultiTalk.tmcPatient.patientName;
              this.videoPatientID = this.videoMultiTalk.tmcPatient.keyID;
              if (!this.videoFromName && this.videoMultiTalk.patient) {
                this.videoFromName = this.videoMultiTalk.patient.personName;
              }
            }
            if (type !== 1) {
              this.confirmVideoVisible = true;
            }
          }
        });
    },
    // 修改医生响应状态
    responseRpInquiry() {
      this.updateInquiryParam.keyID = this.rpInquiryID;
      this.updateInquiryParam.clientUserID = this.videoInquiryID;
      this.updateInquiryParam.doctorID = this.userInfo.keyID;
      this.$_http
        .post(this.$_API.API_RP_INQUIRY_RESPONSEINQUIRY, this.updateInquiryParam)
        .then(res => { });
    },
    // 0:待接诊 1:已接诊 2:未响应 3:拒绝 4:取消
    updateRpInquiry(inquiryType) {
      this.updateInquiryParam.keyID = this.rpInquiryID;
      this.updateInquiryParam.inquiryType = inquiryType;
      this.updateInquiryParam.clientUserID = this.videoInquiryID;
      this.updateInquiryParam.doctorID = this.userInfo.keyID;
      this.$_http
        .post(this.$_API.API_RP_UPDATE_INQUIRY_TYPE, this.updateInquiryParam)
        .then(res => { });
    },
    // 结束rp问诊
    endRpInquiry() {
      this.updateInquiryParam.keyID = this.rpInquiryID;
      this.updateInquiryParam.clientUserID = this.videoInquiryID;
      this.updateInquiryParam.doctorID = this.userInfo.keyID;
      this.$_http
        .post(this.$_API.API_RP_END_INQUIRY, this.updateInquiryParam)
        .then(res => { });
    },
    // 挂断电话
    endCallInquiry() {
      let params = {
        staffID: this.userInfo.keyID,
        callID: this.sysMessage ? this.sysMessage.data.callID : "",
        jobType: this.userInfo.jobType
      };
      this.$_http
        .post(this.$_API.INTERFACE_TMC_POST_CALL_HANGUP, params)
        .then(res => {
          this.phoneVisible = false;
          this.callState = false;
        });
    },
    /** ----------------dealVideo-end--------------- */

    /** ----------------dealHistoryMsg-start--------------- */
    async dealLastestHistoryMsg(historyInquiryIndex, msgList) {
      let obj = this.tmc.historyInquiryList[historyInquiryIndex];
      let params = {
        pageIndex: 0,
        inquiryID: obj.keyID
      };
      const res = await this.$_http.get(this.$_API.INTERFACE_TMC_GET_HISTORY_BY_INQUIRYID, { params });
      if (res && res.data) {
        let tmp = [];
        if (res.data.length === 0) return;
        // 从mongo中获取最近一次历史记录，与IM中的历史记录比较去重
        let msgObj = {};
        msgList.forEach(imMsg => {
          let random = imMsg.random;
          msgObj[random] = imMsg;
        });
        res.data.forEach(mongoMsg => {
          let random = mongoMsg.random;
          if (!msgObj[random]) {
            tmp.push(mongoMsg);
          }
        });
        // 查询其他医生医助信息（切换医生医助的情况）
        tmp.map(item => {
          if (item.from === obj.patientID && obj.finalPatientID) {
            item.from = obj.finalPatientID;
          }
        });
        let keyList = Object.keys(this.tmc.groupObj);
        let keyStr = keyList.join(",");
        let tmpList = [];
        tmp.map(item => {
          let from = item.from || "";
          if (from !== "administrator" && keyStr.indexOf(from) < 0) {
            tmpList.push(item.from);
          }
        });
        if (this.distinct(tmpList).length > 0) {
          const doctorInfo = await this.$_http.post(this.$_API.INTERFACE_GET_GETDOCTORINFOBYSTAFFIDS, { orgID: this.userInfo.orgID, staffIDs: this.distinct(tmpList) });
          if (doctorInfo.data && doctorInfo.data.length > 0) {
            this.updateGroupObj(doctorInfo.data || []);
          }
        }
        this.refreshHistoryMsgList(tmp || []);
      }
    },

    async dealHistoryMsg(historyInquiryIndex) {
      let obj = this.tmc.historyInquiryList[historyInquiryIndex];
      let params = {
        pageIndex: 0,
        inquiryID: obj.keyID
      };
      const res = await this.$_http.get(this.$_API.INTERFACE_TMC_GET_HISTORY_BY_INQUIRYID, { params });
      if (res && res.data) {
        let tmp = res.data || [];
        tmp.map(item => {
          if (item.from === obj.patientID && obj.finalPatientID) {
            item.from = obj.finalPatientID;
          }
        });
        let keyList = Object.keys(this.tmc.groupObj);
        let keyStr = keyList.join(",");
        let tmpList = [];
        tmp.map(item => {
          let from = item.from || "";
          if (from !== "administrator" && keyStr.indexOf(from) < 0) {
            tmpList.push(item.from);
          }
        });
        if (this.distinct(tmpList).length > 0) {
          const doctorInfo = await this.$_http.post(this.$_API.INTERFACE_GET_GETDOCTORINFOBYSTAFFIDS, { orgID: this.userInfo.orgID, staffIDs: this.distinct(tmpList) });
          if (doctorInfo.data && doctorInfo.data.length > 0) {
            this.updateGroupObj(doctorInfo.data || []);
          }
        }
        this.refreshHistoryMsgList(tmp || []);
      }
    },
    distinct(arr) {
      let obj = {};
      let newArr = [];
      for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i]]) {
          obj[arr[i]] = 1;
          newArr.push(arr[i]);
        }
      }
      return newArr;
    },
    /** ----------------dealHistoryMsg-end--------------- */

    /** ----------------dealCustome-start--------------- */
    // 处理自定义消息
    dealCustomeMessage(datas) {
      for (let i = 0; i < datas.length; i++) {
        let item = datas[i];
        if (item.type === "TIMCustomElem") {
          let time = item.time;
          let data = JSON.parse(item.payload.data);
          let customType = data.customType;
          switch (customType) {
            case "sys":
              this.dealSysMessage(data, time);
              break;
            case "hint":
              this.dealHintMessage(data);
              break;
            case "card":
              this.dealCardMessage(data);
              break;
          }
        }
      }
    },
    // 处理系统消息
    dealSysMessage(data, time) {
      let childType = data.childType;
      switch (childType) {
        case "video":
          this.dealSysVideoMessage(data);
          break;
        case "call":
          this.dealSysPhoneMessage(data, time);
          break;
      }
    },
    dealSysPhoneMessage(data, time) {
      // console.log(data);
      // 只有医助才能接电话
      if (this.userInfo.jobType !== 1) return;
      let endTime = Date.parse(new Date()) / 1000;
      let startTime = time;
      let timeDiff = endTime - startTime;
      let minute = Math.floor(timeDiff / 60);
      // 系统提示的信息超过30分钟后就不显示弹窗，只有消息提醒
      // console.log(minute, "时间差");
      if (data.data.callState === "Ringing" && minute < 30) {
        this.phoneVisible = true;
        this.sysMessage = JSON.parse(JSON.stringify(data));
        console.log("患者来电话了：" + this.sysMessage);
      } else if (data.data.callState === "Hangup") {
        this.phoneVisible = false;
        this.callState = false;
        if (data.data.callState === "notDeal" || data.data.callState === "leak") {
          // 漏接电话
        }
      }
    },
    // 处理hint消息
    dealHintMessage(data) { },
    // 处理卡片消息
    dealCardMessage(data) { },

    /** --------------sys-start-------------- **/
    // 处理视频消息
    dealSysVideoMessage(data) {
      if (data.data.type === "accept" && data.data.roomId) {
        this.doctorStreamID = data.data.receiverStreamId;
        this.patientStreamID = data.data.sponsorsStreamId;
        let liveStream = {
          doctorStreamID: this.doctorStreamID,
          patientStreamID: this.patientStreamID
        };
        this.changeLiveStreamIDFun(liveStream);
        if (this.userInfo.jobType === 0) {
          this.roomID = data.data.roomId;
        }
      } else if (data.data.inquiryId) {
        if (data.data.requestRole === "0" && this.userInfo.jobType === 0) {
          // (医生端)患者发起问诊
          this.videoStartType = 1;
          this.rpInquiryID = data.data.inquiryId;
          this.videoInquiryID = data.data.clientUserId;
          this.getMultitalkByInquiryID(0);
        } else if (data.data.requestRole === "1" && this.userInfo.jobType === 0) {
          // （医生端）医生发起问诊
          this.rpInquiryID = data.data.inquiryId;
        } else if (this.userInfo.jobType === 1) {
          // (医助端)医生或者患者发起
          this.videoInquiryID = data.data.clientUserId;
          this.getMultitalkByInquiryID(1);
        }
      } else if (data.data.sendFrom === "assistant" && this.userInfo.jobType === 0) {
        // 医助发起问诊
        if (!this.confirmVideoVisible && !this.videoVisible) {
          this.videoStartType = 2;
          this.videoInquiryID = data.data.videoInquiryID;
          this.getMultitalkByInquiryID(0);
        }
      } else if (data.data.type === "reject" && data.data.requestRole === "0" && this.userInfo.jobType === 0) {
        this.closeVideoInitData();
        this.$message.warning("对方繁忙中");
      } else if (data.data.type === "hangUp") {
        if (data.data.requestRole === "0" && this.userInfo.jobType === 0) {
          this.closeVideoInitData();
        }
        let liveStream = {
          doctorStreamID: "",
          patientStreamID: ""
        };
        this.changeLiveStreamIDFun(liveStream);
        this.$message.warning("视频已挂断");
        // 初始化
        this.videoStartType = 0;
      } else if (data.data.type === "cancel" && data.data.requestRole === "0" && this.userInfo.jobType === 0) {
        this.closeVideoInitData();
        this.$message.warning("视频已取消");
        // 初始化
        this.videoStartType = 0;
      }
    },
    closeVideoInitData() {
      // 关闭确认窗口
      this.confirmVideoVisible = false;
      // 关闭视频窗口
      this.videoVisible = false;
      // 对话对象清空
      this.videoMultiTalk = null;
    }
    /** --------------sys-end-------------- **/

    /** --------------hint-start-------------- **/
    /** --------------hint-end-------------- **/

    /** --------------card-start-------------- **/
    /** --------------card-end-------------- **/
  }
};
