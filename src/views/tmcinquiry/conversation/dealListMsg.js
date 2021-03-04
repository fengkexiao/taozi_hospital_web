import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["tmc", "userInfo"])
  },
  methods: {
    // 获取历史问诊记录
    getHistoryInquiryID() {
      let params = {
        orgID: this.userInfo.orgID,
        talkID: this.tmc.multiTalkID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_INQUIRYIDS_BY_TALKID, {
          params
        })
        .then(res => {
          if (res && res.data) {
            this.changeHistoryInquiryListFun(res.data);
          }
        });
    },
    // 处理自定义消息
    dealCustomeMessage(data) {
      console.log("-------dealCustomeMsg--------" + JSON.stringify(data));
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
        case "firstCreateTMCInquiry":
          this.dealSysFirstCreateTMCInquiry(data);
          break;
        case "createTMCInquiry":
          this.dealSysCreateTMCInquiry(data);
          break;
        case "endTMCInquiry":
          this.dealSysEndTMCInquiry(data);
          break;
        case "tmcChangeDoctor":
          this.dealSysTmcChangeDoctor(data);
          break;
      }
    },
    // 处理hint消息
    dealHintMessage(data) { },
    // 处理卡片消息
    dealCardMessage(data) { },

    /** -----------sys-start----------- **/
    // 处理第一次创建tmc问诊 （第一次创建暂时不做特殊处理）
    dealSysFirstCreateTMCInquiry(data) {
      console.log("first inquiry-------" + JSON.stringify(data));
      let talkID = data.data.talkID;
      let inquiryID = data.data.inquiryID;
      let params = {
        talkID: talkID,
        inquiryId: inquiryID,
        createType: "createFirstTMCInquiry"
      };
      this.$bus.$emit("createFirstTMCInquiry", params);
    },
    // 处理创建tmc问诊
    dealSysCreateTMCInquiry(data) {
      console.log("inquiry--------" + JSON.stringify(data));
      let talkID = data.data.talkID;
      let inquiryID = data.data.inquiryID;
      let params = {
        talkID: talkID,
        inquiryId: inquiryID,
        createType: "createTMCInquiry"
      };
      this.$bus.$emit("createTMCInquiry", params);
    },
    // 处理结束tmc问诊
    dealSysEndTMCInquiry(data) {
      console.log("------结束问诊");
      let talkID = data.data.talkID;
      let inquiryID = data.data.inquiryID;
      let params = {
        talkID: talkID,
        inquiryId: inquiryID
      };
      this.$bus.$emit("endTMCInquiry", params);
    },
    // 切换医生医助
    dealSysTmcChangeDoctor(data) {
      console.log("------切换医生医助");
      let talkID = data.data.talkID;
      let inquiryID = data.data.inquiryID;
      let params = {
        talkID: talkID,
        inquiryId: inquiryID,
        createType: "tmcChangeDoctor"
      };
      this.$bus.$emit("tmcChangeDoctor", params);
    }
    /** -----------sys-end----------- **/

    /** -----------hint-start----------- **/
    /** -----------hint-end----------- **/

    /** -----------card-start----------- **/
    /** -----------card-end----------- **/
  }
};
