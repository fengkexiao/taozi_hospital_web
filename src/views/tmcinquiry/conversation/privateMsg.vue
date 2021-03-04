<template>
  <div class="container">
    <el-header id="header">
      <span v-if="userInfo.jobType===1">{{tmc.doctorName}}</span>
      <span v-if="userInfo.jobType===0">{{tmc.assistantName}}</span>
      <div id="private-msg" @click="privateMsg">
        <i class="el-icon-d-arrow-right"></i>
        隐藏
      </div>
    </el-header>
    <el-main id="main" ref="mainRef">
      <el-row class="moreMsg">
        <template v-if="tim.privateMsgList.length !== 0">
          <span @click="moreMsg" v-if="tim.privateIsCompleted === 0">查看更多消息</span>
          <span v-else>没有更多了</span>
        </template>
      </el-row>
      <el-row v-for="(item, index) in tim.privateMsgList" :key="index" class="chatRow">
        <message-row :message="item"></message-row>
      </el-row>
    </el-main>
    <el-footer id="footer">
      <div style="height: calc(100% - 36px);">
        <textarea
          v-model="msg"
          id="input-area"
          placeholder="请输入"
          autofocus="autofocus"
          @keydown="shortCutKeys($event)"
        ></textarea>
      </div>
      <el-tooltip
        class="item"
        effect="light"
        placement="top-start"
        :manual="true"
        v-model="sendTipFlag"
      >
        <div slot="content" style="text-align: center;font-size: 14px">不能发送空白消息</div>
        <el-button style="margin: 0 0 0 auto;display: block;" @click="sendMsg">发送</el-button>
      </el-tooltip>
    </el-footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import timPublic from "./timPublic";
import dealMsg from "./dealMsg";
import messageRow from "./messageRow";
export default {
  components: {
    messageRow
  },
  props: ["privateMsg"],
  computed: {
    ...mapGetters(["tmc", "tim", "userInfo"])
  },
  mixins: [timPublic, dealMsg],
  data() {
    return {
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      msg: "",
      sendMsgTime: 0,
      // 发送提示控制
      sendTipFlag: false
    };
  },
  watch: {
    "tim.privateMsgList": {
      immediate: true,
      handler: function(val) {
        this.msgPosition();
      }
    }
  },
  mounted() {},
  methods: {
    ...mapActions({
      initPrivateMsgList: "tim/initPrivateMsgList", // 初始化私聊消息
      resetConversationID: "tmc/resetConversationID", // 改变会话ID
      resetPrivateChatID: "tmc/resetPrivateChatID" // 改变私聊ID
    }),
    createInquiry(messageType, payload, groupID, showType) {
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
          this.sendMessage(messageType, payload, groupID, showType);
        });
    },
    sendMsg() {
      if (!this.msg) {
        this.sendTipFlag = true;
        setTimeout(it => {
          this.sendTipFlag = false;
        }, 500);
      } else {
        // 防止连续点击发送
        let curTime = new Date().getTime();
        if (curTime - this.sendMsgTime > 300) {
          let payload = {
            text: this.msg
          };
          this.sendPrivateMessage("TEXT", payload, "", 1);
          this.sendMsgTime = curTime;
          if (!this.tmc.conversationID) {
            this.createInquiry("TEXT", payload, "", 2);
          } else {
            this.sendPrivateMessage("TEXT", payload, "", 2);
          }
        }
      }
    },
    moreMsg() {
      this.initPrivateMsgList(this.tmc.privateChatID);
    },
    // 快捷键
    shortCutKeys(event) {
      let keyCode = event.keyCode;
      if (keyCode === 13 && (event.ctrlKey || event.shiftKey)) {
        this.msg = this.msg + "\n";
      } else if (keyCode === 13) {
        event.preventDefault();
        this.sendMsg();
      }
    },
    // 定位到消息最后一行
    msgPosition() {
      setTimeout(() => {
        this.$refs.mainRef.$el.scrollTop = this.$refs.mainRef.$el.scrollHeight;
      }, 20);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 60% !important;
  height: 60% !important;
  background: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  position: absolute !important;
  z-index: 2;
  top: 0;
  right: 0;
  #header {
    height: 100px;
    position: relative;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    background-color: #f6f6f6;
    #private-msg {
      margin: 0 0 0 auto;
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 15px;
      #item {
        margin-right: 7px;
        font-size: 12px;
        position: relative;
        top: -3px;
      }
    }
  }
  #main {
    height: calc(100% - 150px);
    border-bottom: 1px solid #e8e8e8;
    .moreMsg {
      color: #2887e8;
      font-size: 13px;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .myChat {
      text-align: right;
      .chatInfo {
        background: #d5e9fe;
        &:before {
          border-color: transparent transparent transparent #d5e9fe;
          right: -16px;
          left: auto;
        }
      }
    }
    .chatInfo {
      background: #eeeeee;
      padding: 5px 20px;
      min-height: 28px;
      border-radius: 8%;
      display: inline-block;
      position: relative;
      &:before {
        content: "";
        border-width: 8px;
        border-style: solid;
        border-color: transparent #eeeeee transparent transparent;
        position: absolute;
        left: -16px;
      }
    }
    .chatRow {
      margin: 10px 0;
    }
  }
  #footer {
    height: 90px !important;
    padding: 10px;
    span {
      width: 48px;
      text-align: center;
      font-size: 12px;
      color: #bbb7b7;
      margin-right: 20px;
      cursor: pointer;
    }
    #input-area {
      resize: none;
      border: none;
      outline: none;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
