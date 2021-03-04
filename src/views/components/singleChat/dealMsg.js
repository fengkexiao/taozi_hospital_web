import { mapGetters } from "vuex";
// eslint-disable-next-line import/no-duplicates
import { VIDEO_CLIENT_ID } from "@/common/Constant";
// eslint-disable-next-line import/no-duplicates
import { TMC_LIVE_ADDRESS } from "@/common/Constant";

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
      doctorStreamID: "",
      patientStreamID: "",
      createRecord: {}
    };
  },
  methods: {
    startVideo() {
      this.simpleCreateRecordByBizID()
    },
    // 创建rp视频问诊
    simpleCreateRecordByBizID() {
      console.log(this.userInfo)
      console.log(this.dataInfoDetail)
      let params = {
        bizID: this.dataInfoDetail.bizID,
        clientID: this.dataInfoDetail.clientID,
        clientUserID: this.dataInfoDetail.patientImID,
        doctorID: this.dataInfoDetail.staffID,
        doctorName: this.dataInfoDetail.doctorName,
        bizType: 'pharmacy',
        requestRole: 1,
        requestInquiryType: 2,
        inquiryType: 1
      }
      this.$_http.post(this.$_API.INTERFACE_RP_POST_SIMPLECREATERECORDBYBIZID, params).then(res => {
        if(res.success) {
          this.creatStartVideo(res.data)
          this.createRecord = res.data
        }else {
          this.$message.warning(res.data.message);
        }
      })
    },
    // 发起视频
    creatStartVideo(data) {
      let params = {
        inquiryID: data.keyID,
        sponsorsID: this.dataInfoDetail.staffID,
        receiverID: this.dataInfoDetail.patientImID
      }
      this.$_http.post(this.$_API.INTERFACE_RP_POST_STARTVIDEO, params).then(res => {
        if(res.success) {
          // 展示弹框
          this.videoVisible = true;
          this.joinState = false
        }else {
          this.$message.warning(res.data.message);
        }
      })
    },
    // 结束视频
    hangup() {
      let params = {
        inquiryID: this.createRecord.keyID,
        sponsorsID: this.dataInfoDetail.staffID,
        receiverID: this.dataInfoDetail.patientImID
      }
      this.$_http.post(this.$_API.INTERFACE_RP_POST_ENDVIDEO, params).then(res => {
        if(res.success) {
          this.videoVisible = false;
          this.joinState = true
        }else {
          this.$message.warning(res.data.message);
        }
      });
    },

    /** ----------------dealVideo-end--------------- */

    /** ----------------dealHistoryMsg-start--------------- */
    dealHistoryMsg(historyInquiryIndex) {
      let params = {
        pageIndex: 0,
        inquiryID: this.tmc.historyInquiryList[historyInquiryIndex].keyID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_HISTORY_BY_INQUIRYID, {
          params
        })
        .then(res => {
          if (res && res.data) {
            let msgList = [];
            res.data.forEach(element => {
              msgList.push(element);
            });
            this.refreshHistoryMsgList(msgList);
          }
        });
    },
    /** ----------------dealHistoryMsg-end--------------- */

    /** ----------------dealCustome-start--------------- */
    // 处理自定义消息
    dealCustomeMessage(data) {
      console.log(data)
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        if (item.type === "TIMCustomElem") {
          let data = JSON.parse(item.payload.data);
          let customType = data.customType;
          switch (customType) {
            case "sys":
              this.dealSysMessage(data);
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
    dealSysMessage(data) {
      let childType = data.childType;
      switch (childType) {
        case "video":
          this.dealSysVideoMessage(data);
          break;
      }
    },
    // 处理hint消息
    dealHintMessage(data) { },
    // 处理卡片消息
    dealCardMessage(data) { },

    /** --------------sys-start-------------- **/
    // 处理视频消息
    dealSysVideoMessage(data) {
      // 开始视频
      if (data.data.type === "start" && data.data.roomID) {
        console.log("开始视频----")
        this.roomID = data.data.roomID;
        this.doctorStreamID = data.data.receiverStreamID;
        this.patientStreamID = data.data.sponsorsStreamID;
        this.videoMultiTalk = {
          doctorStreamID: this.doctorStreamID,
          patientStreamID: this.patientStreamID
        }
      }else if(data.data.type === "end") { 
        console.log("结束视频----")
        console.log(data)
        // 结束视频
        this.doctorStreamID ="";
        this.patientStreamID = "";
        this.videoMultiTalk = {}
        this.videoVisible = false
        this.joinState = true
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
