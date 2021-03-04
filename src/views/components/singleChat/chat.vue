<template>
  <div class="container">

    <el-header id="header" style="background: #fff;height:44px;">
      <span style="font-size:14px;font-weight:400;">{{nameStr}}</span>
      <img src="./../../../assets/image/online.png" class="online-status" v-if="onlineStatus">
      <img src="./../../../assets/image/offline.png"  class="online-status" v-else>
      <div id="private-msg" @click="privateMsg">
        <el-badge :value="tmc.unreadCountPrivate" id="item" v-if="tmc.unreadCountPrivate">
          <i class="el-icon-chat-line-round dashed" style="border: 1px dashed #7d6d6d;"></i>
        </el-badge>
      </div>
    </el-header>
    <template v-if="this.dataInfoDetail.clientID === clientID && this.dataInfoDetail.inquiryType === 2">
      <div class="video_main" v-if="joinState">
        <div class="video-dialog_footer video-dial" @click="startVideo">
          <img src="../../../assets/image/video_dial.png" alt="">
          <span>发起视频</span>
        </div>
      </div>
    </template>
    <template v-else>
      <el-main id="main" ref="mainRefs" class="chat-container">
        <div class="moreMsg">
          <template>
            <span @click="moreMsg" v-if="tim.rpIsCompleted === 0 ">查看更多消息</span>
            <span v-else>没有更多了</span>
          </template>
        </div>
        
        <message-row v-for="(item, index) in tim.rpMsgList" :key="index" :message="item" :clientState="clientState" :recordList="tim.rpMsgList" :index="index" :to="to" :patientFaceImage="patientFaceImage"></message-row>
      </el-main>

      <el-footer id="footer">
        <div style="display: flex;">
          <div style="">
            <el-tooltip class="item" effect="dark" content="发送图片" placement="top-start">
              <div class="chat-tool-icon-box" @click="handleSendImageClick">
                <img class="chat-tool-icon" src="@/assets/image/tmcinquiry/chatTool/img.png" />
              </div>
            </el-tooltip>
          </div>
          <div placement="top-start" trigger="click" style="margin-left: 10px;">
            <el-tooltip class="item" effect="dark" content="常用语" placement="top-start">
              <div class="chat-tool-icon-box" @click="handleShowWords(0)">
                <img class="chat-tool-icon" src="@/assets/image/tmcinquiry/chatTool/common-language.png" />
              </div>
            </el-tooltip>
          </div>
        </div>
        <div style="height: 75px;">
          <input type="file" id="imagePicker" ref="imagePicker" accept=".jpg, .jpeg, .png, .gif" @change="sendImage" style="display:none" />
          <textarea v-model="msg" id="input-area" placeholder="请输入" autofocus="autofocus" @keydown="shortCutKeys($event)"></textarea>
        </div>
        <div style="padding-top:20;">
          <el-button style="margin: 0 0 0 auto;display: block;width:72px;height:30px;border-radius:5px;" @click="sendMsg">发送</el-button>
        </div>
      </el-footer>
    </template>
    <common-words :visible.sync="wordsVisible" :type="type" :orgID="userInfo.orgID" @click="handleWordsClick"></common-words>
    <!-- 视频弹框 -->
    <pop-up-video :videoVisible.sync="videoVisible" :roomID.sync="roomID" @hangup="hangup" :joinState="joinState" :videoMultiTalk="videoMultiTalk"></pop-up-video>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import CommonWords from "./components/commonWords";
import timPublic from "./timPublic";
import dealMsg from "./dealMsg";
import messageRow from "./messageRow";
import RtcClient from "./trtc";
import popUpVideo from "./popUpVideo";
export default {
  name: "chat",
  components: {
    messageRow,
    CommonWords,
    popUpVideo
  },
  props: {
    userSig: {
      type: String,
      default: ''
    },
    to: {
      type: String,
      default: ''
    },
    cus_tim: {
      type: Object
    },
    conversationID: {
      type: String,
      default: ""
    },
    nameStr: {
      type: String,
      default: ""
    },
    onlineStatus:{
      type:Boolean,
      default:false
    },
    dataInfoDetail:{
      type: Object,
      default: {}
    },
    inquiryType: {
      type: Number,
      default: null
    },
    hangupVideo: {
      type: Boolean,
      default: false
    },
    patientFaceImage: {
      type: String,
      default:''
    },
    verbalTrickData: {
      type: Object,
      default: {}
    }
  },
  mixins: [timPublic, dealMsg],
  data () {
    return {
      type: 1,
      wordsVisible: false,
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      id: "",
      name: "",
      // 私聊框展示
      privateShow: false,
      dialogVisible: false,
      msg: "",
      listData: [],
      visible: false,
      pharseList: {
        parent: [],
        child: []
      },
      material: {
        parent: [],
        child: []
      },
      visible2: false,
      privateNotReadCount: 0,
      // sendMsgTime 时间控制发送;
      sendMsgTime: 0,
      // 历史问诊Index
      historyInquiryIndex: 0,
      doctorLivePlay: null,
      patientLivePlay: null,
      // 直播框是否展示
      liverVideoShow: false,
      cuscus_tim: {},
      clientID: "",
      joinState: true,
      videoVisible: false,
      clientState: false
    };
  },
  computed: {
    ...mapGetters(["tmc", "userInfo", "tim"])
  },
  watch: {
    "to": {
      handler: function (val) {
        if (val) {
          this.changeChat();
        }
      }
    },
    "cid": {
      handler: function (val) {
        // 会话变化后关闭私聊窗口
        if (val) {
          // this.privateShow = false;
          // this.changeChat(this.privateShow);
        }
      }
    },
    "tim.isCompleted": {
      immediate: true,
      handler: function (val) {
        this.$nextTick(() => {
          this.msgPosition();
        });
      }
    },
    "tim.rpMsgList": {
      immediate: true,
      handler: function (val) {
         this.msgPosition();
      }
    },
    "cus_tim": {
      immediate: true,
      deep: true,
      handler (val, oldVal) {
      }
    },
    dataInfoDetail(val) {
      this.dataInfoDetail = val
      if(this.dataInfoDetail && this.dataInfoDetail.clientID) {
        this.clientState = this.dataInfoDetail.clientID === this.clientID
      }else {
        this.clientState = false
      }
    },
    inquiryType(val) {
      let video = document.getElementById("video-dialogPopUp")
      if(video) {
        if(!this.joinState && val === 2) {
          video.style.zIndex = "100"
        }else {
          video.style.zIndex = "-100"
        }
      }
    },
    hangupVideo(val) {
      if(val && this.videoVisible) {
        this.hangup()
      }
    },
    verbalTrickData(val) {
      if(val) {
        this.msg = val.tip
        if(val.type === "send") {
          this.sendMsg()
        }
      }
    }
  },
  created () {
    this.clientID = process.env.VUE_APP_PHARMACY_CLIENTID
    this.$bus.$on("reciveMessage", this.reciveMessage);
    this.listenBusMsg();
    // 定位消息
    this.msgPosition();
    window.addEventListener("timOnReceiveMessage", this.timOnReceiveMessage);
    
  },
  methods: {
    ...mapActions({
      initrpIsCompleted: "tim/initrpIsCompleted" // 上报已读
    }),
    handleShowWords (type) {
      this.wordsVisible = true
    },
    // 关键字输入框点击
    handleWordsClick (data) {
      this.msg = "";
      this.msg = data.classifyName || data.content;
      this.wordsVisible = false;
    },
    timOnReceiveMessage ({ detail }) {
      // let data = detail;
      // const msgList = data.filter(item => {
      //   return (
      //     item.conversationID.replace("C2C", "") === this.tmc.conversationID
      //   );
      // });
      console.log("---timOnReceiveMessage")
      this.refreshRpMsgList(detail);
      this.dealCustomeMessage(detail);
      //      this.refreshPrivateMsgList(msgPrivateList);
      //    this.setCurConversionRead();
    },
    ...mapActions({
      resetConversationID: "tmc/resetConversationID", // 改变会话ID
      resetPrivateChatID: "tmc/resetPrivateChatID", // 改变私聊ID
      getMoreMsg: "tim/getMoreMsg", // 获取更多消息
      getMoreRpMsg: "tim/getMoreRpMsg", // 获取更多消息
      setMessageRead: "tim/setMessageRead", // 上报已读
      changeUnreadCountPrivateFun: "tmc/changeUnreadCountPrivateFun", // 修改私聊未读数
      changePrivateShowFun: "tmc/changePrivateShowFun", // 修改私聊框展示
      refreshMsgList: "tim/refreshMsgList",
      refreshRpMsgList: "tim/refreshRpMsgList",
      cleanRpMsgList: "tim/cleanRpMsgList",
      // 刷新历史消息
      refreshHistoryMsgList: "tim/refreshHistoryMsgList",
      // 修改直播地址
      changeLiveStreamIDFun: "tmc/changeLiveStreamIDFun"
    }),
    // 监听消息
    listenBusMsg () {
      // 监听切换对话
      this.$bus.$on("changeChat", this.changeChat);
    },
    changeChat (data) {
      // tim.rpIsCompleted = 0;
      this.initrpIsCompleted();
      this.cleanRpMsgList();
      this.msg = "";
      this.historyInquiryIndex = 0;
      this.moreMsg();
      // 定位消息
      this.msgPosition();
    },
    reciveMessage (data) {
      this.dealCustomeMessage(data);
      this.$nextTick(() => {
        this.msgPosition();
      });
    },
    // 定位到消息最后一行
    msgPosition () {
      try {
        setTimeout(() => {
          let container = document.querySelector('.chat-container')
          container.scrollTop = container.scrollHeight;
        }, 20);
      } catch (error) {
      }
    },
    privateMsg () {
      this.privateShow = !this.privateShow;
      this.changePrivateShowFun(this.privateShow);
      // 上报私聊已读
      if (this.privateShow && this.tmc.privateChatID) {
        this.$bus.$emit("setMessageReadRes", this.tmc.privateChatID);
        this.setMessageRead(this.tmc.privateChatID);
        this.changeUnreadCountPrivateFun(0);
      }
    },
    sendMsg() {
      // 防止连续点击发送
      let curTime = new Date().getTime();
      if (curTime - this.sendMsgTime > 300) {
        let payload = {
          text: this.msg
        };
        this.sendMessage("TEXT", payload, 1);
        this.sendMsgTime = curTime;
        this.sendMessage("TEXT", payload, 2);
        this.msg = "";
      }
    },
    // 发送图片
    async sendImage() {
      let payload = {
        file: document.getElementById("imagePicker")
      };
      await this.sendMessage("IMAGE", payload);
      this.$refs.imagePicker.value="";
    },
    handleSendImageClick () {
      this.$refs.imagePicker.click();
    },
    // 发送三人群消息 showType：0/不传 消息发送成功后展示  1 只展示不发送消息 2 只发送消息不展示
    async sendMessage(messageType, payload, showType) {
      let message = await this.cus_tim.createMessage(
        this.to,
        payload,
        messageType
      );
      if (!showType) {
        // 发送消息
        let res = await this.cus_tim.sendMessage(message);
        this.$bus.$emit("sendMessageRes", res.data);
        this.refreshRpMsgList([res.data.message]);
        this.msg = "";
      } else if (showType === 1) {
        // 不用发送直接展示消息
        this.refreshRpMsgList([message]);
        this.msg = "";
      } else if (showType === 2) {
        // 发送消息
        await this.cus_tim.sendMessage(message);
      }
      // 定位消息
      this.$nextTick(() => {
        this.msgPosition();
      });
    },
    moreMsg () {
      let id = JSON.parse(JSON.stringify(this.to));
      if (this.tim.rpIsCompleted === 0) {
        this.getMoreRpMsg(id);
      } else {
        if (this.historyInquiryIndex < this.tmc.historyInquiryList.length) {
          this.dealHistoryMsg(this.historyInquiryIndex);
          this.historyInquiryIndex++;
        }
      }
      this.$nextTick(() => {
        this.msgPosition();
      });
    },
    // 提交医生
    commitToDoctor () {
      if (!this.tmc.inquiryID) {
        return;
      }
      this.$confirm("确认提交给医生吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 发送提示医生的hint消息
          let data = {
            customType: "hint",
            childType: "both",
            data: {
              text:
                "IP医生" +
                this.tmc.assistantName +
                "提交了患者" +
                this.tmc.patientName +
                "资料"
            }
          };
          let payload = {
            data: JSON.stringify(data),
            description: "[IP医生提交消息]",
            extension: "tmc"
          };
          this.sendPrivateMessage("CUSTOM", payload);
          this.$notify({
            title: "成功",
            message: "提交成功",
            type: "success"
          });
        })
        .catch(() => {
          this.$notify.info({
            title: "已取消",
            message: "已取消提交"
          });
        });
    },
    // 直播播放
    playLiver () {
      if (this.tmc.patientLiveAddress && this.tmc.doctorLiveAddress) {
        var patientOptions = {
          m3u8: this.tmc.patientLiveAddress, // 这个替换成flv接可以了
          autoplay: true, // iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
          poster: "",
          width: "480", // 视频的显示宽度，请尽量使用视频分辨率宽度
          height: "320" // 视频的显示高度，请尽量使用视频分辨率高度
        };
        var doctorOptions = {
          m3u8: this.tmc.doctorLiveAddress, // 这个替换成flv接可以了
          autoplay: true, // iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
          poster: "",
          width: "480", // 视频的显示宽度，请尽量使用视频分辨率宽度
          height: "320" // 视频的显示高度，请尽量使用视频分辨率高度
        };
        if (this.doctorLivePlay === null) {
          // eslint-disable-next-line no-undef
          this.doctorLivePlay = new TcPlayer(
            "doctor-liver-video",
            doctorOptions
          );
        }
        if (this.patientLivePlay === null) {
          // eslint-disable-next-line no-undef
          this.patientLivePlay = new TcPlayer(
            "patient-liver-video",
            patientOptions
          );
        }
      }
    },
    // 关闭直播
    closeLiver () {
      this.liverVideoShow = false;
      this.doctorLivePlay = null;
      this.patientLivePlay = null;
    },
    // 快捷键
    shortCutKeys (event) {
      let keyCode = event.keyCode;
      if (keyCode === 13 && (event.ctrlKey || event.shiftKey)) {
        this.msg = this.msg + "\n";
      } else if (keyCode === 13) {
        event.preventDefault();
        this.sendMsg();
        this.msgPosition()
      }
    }
  },
  destroyed () {
    this.closeLiver();
  }
};
</script>

<style lang="scss">
.container #main .moreMsg .el-loading-spinner {
  margin-top: -8px !important;
}
</style>

<style lang="scss" scoped>
.chat-tool-icon-box {
  text-align: center;
  margin-top: 17px;
  margin-bottom: 5px;
}
.chat-tool-icon-box-1 {
  text-align: center;
  margin-top: 11px;
  margin-bottom: 25px;
  margin-left: 10px;
  opacity: 0.3;
}
.chat-tool-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}
.chat-tool-text {
  font-size: 12px;
  color: #bbb7b7;
}
.videoInfoBox {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.el-icon-circle-upload {
  height: 25px;
  background: url("../../../assets/image/tmcinquiry/upload.png") no-repeat;
  background-size: contain;
  background-position: center;
}
.container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
  .dashed {
    color: #7d6d6d;
    font-size: 21px;
    padding: 2px;
    display: block;
  }
  #header {
    height: 100px;
    position: relative;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    #private-msg {
      margin: 0 0 0 auto;
      display: flex;
      align-items: center;
      font-size: 15px;
      cursor: pointer;
      #item {
        margin-right: 7px;
        font-size: 12px;
        position: relative;
        top: -3px;
      }
    }
  }
  #main {
    height: calc(100% - 215px);
    border-bottom: 1px solid #e8e8e8;
    //min-height: 350px;
    padding-top: 0;
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
    #mainDiv {
      height: calc(100% - 320px);
      min-height: 350px;
    }
  }
  #footer {
    height: 168px !important;
    padding:0 16px;
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
::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  height: 30px;
  background-color: #b8b8b8;
  outline-offset: -2px;
  filter: alpha(opacity = 50);
  -moz-opacity: 0.5;
  -khtml-opacity: 0.5;
  opacity: 0.5;
}
.video-dialog-textContent {
  width: 100%;
  display: flex;
  justify-content: center;
}
.liver-window {
  width: 100%;
  height: 0px;
  display: flex;
  justify-content: center;
  z-index: 111111;
}
.patient-liver-video {
  z-index: 111111;
}
.doctor-liver-video {
  z-index: 111111;
}
.online-status{
  width:42px;
  margin-left:8px;
}
.video_main {
  height: calc(100% - 44px);
  width: 100%;
  position: absolute;
  z-index: 100;
  background: linear-gradient(180deg,#182430, #545454);
  top: 44px;
  left: 0px;
}
.video-dial {
  width: 50%;
  height: 65px;
  background: #00ac8f;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  margin-left: 25%;
  border-radius: 10px;
  cursor: pointer;
  position: absolute;
  bottom: 50px;
  z-index: 200;
  img {
    height: 48px;
    width: 48px;
    margin-right: 13px;
  }
  .video-dialog_footer__end {
    background: url("./../../../assets/image/dial.png") no-repeat;
  }
}
</style>
