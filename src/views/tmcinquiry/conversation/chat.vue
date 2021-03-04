<template>
  <div class="container">
    <!-- 结束问诊弹框 -->
    <pop-up-end-inquiry :dialogVisible.sync="dialogVisible"></pop-up-end-inquiry>
    <!-- 视频弹框 -->
    <pop-up-video :videoVisible.sync="videoVisible" :roomID.sync="roomID" @hangup="hangup" :videoMultiTalk="videoMultiTalk||tmc.multiTalk"></pop-up-video>
    <!-- 电话弹窗 -->
    <pop-up-phone ref="popPhone" class="phoneVisible" :phoneVisible.sync="phoneVisible" @hangdown="hangdown" :autoStart="autoStart" :sendSync="sendSync" :defaultVal="defaultVal" @getDataFromChild="getDataFromChild"></pop-up-phone>
    <!-- 确认接收视频弹框 -->
    <el-dialog title="是否接受视频问诊" :visible.sync="confirmVideoVisible" width="30%" :before-close="rejectVideo" :close-on-click-modal="false">
      <div class="video-dialog-textContent">{{videoFromName}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectVideo">拒 绝</el-button>
        <el-button type="primary" @click="acceptVideo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 直播窗口 -->
    <div class="liver-window" v-if="liverVideoShow">
      <div style="width:480px;height:20px;z-index: 111111">
        <div class="videoInfoBox">
          <div v-if="videoMultiTalk&&videoMultiTalk.patient">用户：{{videoMultiTalk.patient.personName}}</div>
          <div v-if="videoMultiTalk&&videoMultiTalk.doctor">医生：{{videoMultiTalk.doctor.doctorName}}</div>
        </div>
        <div id="patient-liver-video" class="patient-liver-video"></div>
        <div id="doctor-liver-video" class="patient-liver-video"></div>
      </div>
    </div>
    <!-- 私聊消息 -->
    <transition name="el-fade-in-linear">
      <private-msg v-show="privateShow" :privateMsg="privateMsg"></private-msg>
    </transition>

    <div style="position: relative;width: 100%;height: 100%;">
      <el-header id="header">
        <div class="head-left">
          <span>{{ tmc.tmcPatient.patientName||tmc.patient.personName}}</span>
          <img src="./../../../assets/image/tmcinquiry/chat-online.png" v-if="tmc.tmcPatient.online && tmc.tmcPatient.pathName==='问诊页'" class="chat-online">
          <img src="./../../../assets/image/tmcinquiry/online-chat.png" v-if="tmc.tmcPatient.online && tmc.tmcPatient.pathName!=='问诊页'" class="chat-offline">
          <img src="./../../../assets/image/tmcinquiry/chat-offline.png" v-if="!tmc.tmcPatient.online" class="chat-offline">
          <span v-if="tmc.tmcPatient.channelName" style="font-size:12px;margin-left:5px;">{{tmc.tmcPatient.channelName}}-</span>
          <span style="font-size:12px;">{{tmc.tmcPatient.pathName}}</span>
        </div>
        <div id="private-msg" @click="privateMsg">
          <el-badge :value="tmc.unreadCountPrivate" id="item" v-if="tmc.unreadCountPrivate">
            <i class="el-icon-chat-line-round dashed" style="border: 1px dashed #7d6d6d;"></i>
          </el-badge>私聊医生
        </div>
      </el-header>

      <el-main id="main" ref="mainRef">
        <div class="moreMsg">
          <template>
            <span @click="moreMsg" v-if="tim.isCompleted === 0 || historyInquiryIndex < tmc.historyInquiryList.length">查看更多消息</span>
            <span v-else>没有更多了</span>
          </template>
        </div>
        <message-row v-for="(item, index) in tim.msgList" :key="index" :message="item" :index="index"></message-row>
      </el-main>

      <el-footer id="footer">
        <div style="display: flex;height:45px;">
          <div style="margin-left: 10px;margin-top: 7px;">
            <el-tooltip class="item" effect="dark" content="视频通话" placement="top-start">
              <div class="chat-tool-icon-box" @click="startVideo">
                <img class="chat-tool-icon" src="@/assets/image/tmcinquiry/chatTool/video.png" />
              </div>
            </el-tooltip>
          </div>
          <div style="margin-left: 10px;margin-top: 7px;" v-if="tmc.tmcPatient.phone && tmc.tmcPatient.phone.length === 11">
            <el-tooltip class="item" effect="dark" content="拨打电话" placement="top-start">
              <div class="chat-tool-icon-box" @click="startPhone">
                <img class="chat-tool-icon" src="@/assets/image/tmcinquiry/chatTool/phone.png" />
                <!-- <div class="chat-tool-text">拨打电话</div> -->
              </div>
            </el-tooltip>
          </div>
          <el-tooltip class="item" effect="light" placement="top-start" v-else>
            <div slot="content" style="text-align: center;font-size: 14px">该患者还未绑定电话，无法使用此功能！</div>
            <div class="chat-tool-icon-box-1">
              <img class="chat-tool-icon" src="@/assets/image/tmcinquiry/chatTool/phone.png" />
              <!-- <div class="chat-tool-text">拨打电话</div> -->
            </div>
          </el-tooltip>
          <div placement="top-start" trigger="click" style="margin-left: 10px;margin-top: 7px;">
            <el-tooltip class="item" effect="dark" content="常用语" placement="top-start">
              <div class="chat-tool-icon-box" @click="handleShowWords(0)">
                <img class="chat-tool-icon" src="@/assets/image/tmcinquiry/chatTool/common-language.png" />
              </div>
            </el-tooltip>
          </div>
          <div placement="top-start" trigger="click" style="margin-left: 10px;margin-top: 7px;">
            <el-tooltip class="item" effect="dark" content="患教素材" placement="top-start">
              <div class="chat-tool-icon-box" @click="handleShowWords(1)">
                <img class="chat-tool-icon" src="@/assets/image/tmcinquiry/chatTool/material.png" />
              </div>
            </el-tooltip>
          </div>
          <div style="margin-left: 10px;margin-top: 7px;">
            <el-tooltip class="item" effect="dark" content="发送图片" placement="top-start">
              <div class="chat-tool-icon-box" @click="handleSendImageClick">
                <img class="chat-tool-icon" src="@/assets/image/tmcinquiry/chatTool/img.png" />
              </div>
            </el-tooltip>
          </div>

          <el-dropdown @visible-change="visibleChange(false)" :hide-on-click="true" placement="top-start" trigger="click" style="margin-left: 10px;margin-top: 7px;" ref="messageDrop" v-if="tmc.tmcPatient.phone && tmc.tmcPatient.phone.length === 11">

            <el-tooltip class="item" effect="dark" content="发送短信" placement="top-start">
              <div class="chat-tool-icon-box">
                <img class="chat-tool-icon" src="@/assets/image/tmcinquiry/chatTool/short-msg.png" />
                <!-- <div class="chat-tool-text">发送短信</div> -->
              </div>
            </el-tooltip>
            <el-dropdown-menu slot="dropdown">
              <!-- 发送短信弹窗 -->
              <div style="width:400px;height:180px">
                <!-- 模板 -->
                <div class="sms-message-row">
                  <el-row>
                    <el-col :span="6" style="display:flex;align-items:center">
                      <div style="color:#787679">选择模板：</div>
                    </el-col>
                    <el-col :span="14">
                      <el-select v-model="selectedMarketSmsTemplate.templateID" @change="changeMarketSmsTemplate" ref="selectDelete" filterable clearable placeholder="请选择">
                        <el-option v-for="(item, index) in allMarketSmsTemplate" :key="index" :label="item.templateName" :value="item.keyID"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="4">
                      <el-button @click="determine" type="primary" size="small" v-if="selectedMarketSmsTemplate.templateID">确定</el-button>
                    </el-col>
                  </el-row>
                </div>
                <!-- 自定义 -->
                <div class="sms-message-row">
                  <el-row>
                    <el-col :span="6" style="display:flex;align-items:center">
                      <div style="color:#787679">自定义:</div>
                    </el-col>
                    <el-col :span="18">
                      <base-input v-model="templateContent" type="textarea" :rows="2" placeholder="请输入内容" :maxlength="200" :show-word-limit="false"></base-input>
                    </el-col>
                  </el-row>
                  <el-row>
                    <div class="addH5Div" @click="addH5UrlToContentFun">添加H5链接</div>
                  </el-row>
                </div>
                <div class="sms-message-row">
                  <el-row class="msg-row">
                    <el-col :span="10" style="text-align:center">
                      <el-button @click="closeSms" size="small">取消</el-button>
                    </el-col>
                    <el-col :span="14" style="text-align:center">
                      <el-button size="small" @click="sendCustomSms" type="primary">发送</el-button>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
          <el-tooltip class="item" effect="light" placement="top-start" v-else>
            <div slot="content" style="text-align: center;font-size: 14px">该患者还未绑定电话，无法使用此功能！</div>

            <el-tooltip class="item" effect="dark" content="发送短信" placement="top-start">
              <div class="chat-tool-icon-box-1">
                <img class="chat-tool-icon" src="@/assets/image/tmcinquiry/chatTool/short-msg.png" />
              </div>
            </el-tooltip>
          </el-tooltip>
          <div style="margin-left: 10px;margin-top: 7px;">
            <el-tooltip class="item" effect="dark" content="点击后发送给患者确认地址的消息" placement="top-start">
              <div class="chat-tool-icon-box" @click="sendAddress">
                <img class="chat-tool-icon" src="@/assets/image/tmcinquiry/chatTool/card.png" />
              </div>
            </el-tooltip>
          </div>
          <div style="margin-left: 55%;margin-top: 5px;">
            <el-tooltip class="item" effect="dark" content="提交医生" placement="top-start">
              <div class="chat-tool-icon-box" v-if="userInfo.jobType===1" :style="tmc.inquiryID?'':'opacity:0.3'" @click="commitToDoctor">
                <i class="el-icon-upload2 dashed"></i>
                <!-- <div class="chat-tool-text">提交医生</div> -->
              </div>
            </el-tooltip>
          </div>
          <div style="margin-top: 5px;margin-left: 10px;">
            <el-tooltip class="item" effect="dark" content="结束问诊" placement="top-start">
              <div class="chat-tool-icon-box" :style="tmc.inquiryID?'':'opacity:0.3'" @click="endInquiry">
                <i class="el-icon-switch-button dashed"></i>
                <!-- <div class="chat-tool-text">结束问诊</div> -->
              </div>
            </el-tooltip>
          </div>
        </div>
        <div style="height: calc(100% - 157px);">
          <input type="file" id="imagePicker" ref="imagePicker" accept=".jpg, .jpeg, .png, .gif" @change="sendImage" style="display:none" />
          <textarea v-model="msg" id="input-area" placeholder="请输入" autofocus="autofocus" @keydown="shortCutKeys($event)"></textarea>
        </div>
        <div style="padding: 20px 0">
          <!-- <el-button style="margin: 0 0 0 auto;display: block;" @click="sendMsg" v-if="msg">发送</el-button> -->
          <el-tooltip class="item" effect="light" placement="top-start" :manual="true" v-model="sendTipFlag">
            <div slot="content" style="text-align: center;font-size: 14px">不能发送空白消息</div>
            <el-button style="margin: 0 0 0 auto;display: block;" @click="sendMsg">发送</el-button>
          </el-tooltip>
        </div>
      </el-footer>
      <common-words :visible.sync="wordsVisible" :type="type" :orgID="userInfo.orgID" @click="handleWordsClick"></common-words>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import privateMsg from "./privateMsg";
import popUpEndInquiry from "./popUpEndInquiry";
import timPublic from "./timPublic";
import dealMsg from "./dealMsg";
import popUpVideo from "./popUpVideo";
import popUpPhone from "./popUpPhone";
import messageRow from "./messageRow";
import CommonWords from "./commonWords";
import "@/assets/sdk/webim/MD5.js";
// import ajax from "axios";
// import RtcClient from "./trtc";
export default {
  name: "chat",
  components: {
    privateMsg,
    popUpEndInquiry,
    popUpVideo,
    messageRow,
    CommonWords,
    popUpPhone
  },
  mixins: [timPublic, dealMsg],
  data () {
    return {
      isClickMoreMsg: true,
      type: 0,
      wordsVisible: false,
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      id: "",
      name: "",
      // 私聊框展示
      privateShow: false,
      dialogVisible: false,
      msg: "",
      templateContent: "",
      listData: [],
      sysMessage: "",
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
      // 所有营销短信模板
      allMarketSmsTemplate: [],
      // 选中的模板
      selectedMarketSmsTemplate: {
        templateID: "",
        templateName: ""
      },
      // 发送提示控制
      sendTipFlag: false,
      autoStart: true,
      sendSync: true,
      defaultVal: sessionStorage.getItem("timer") ? parseInt(sessionStorage.getItem("timer")) : 0
    };
  },
  computed: {
    ...mapGetters(["tmc", "userInfo", "tim"])
  },
  mounted () {
  },
  watch: {
    "tmc.tmcPatient": {
      deep: true,
      immediate: true,
      handler (val) {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          this.getOnlineStatus();
        }, 1500);
      }
    },
    "tmc.conversationID": {
      immediate: true,
      deep: true,
      handler: function (val) {
        // 会话变化后关闭私聊窗口
        if (val) {
          this.privateShow = false;
          this.changePrivateShowFun(this.privateShow);
        }
      }
    },
    "tim.isCompleted": {
      immediate: true,
      deep: true,
      handler: function (val) {
        this.$nextTick(() => {
          this.msgPosition();
        });
      }
    },
    "tmc.patientLiveAddress": {
      immediate: true,
      deep: true,
      handler: function (val) {
        if (this.userInfo.jobType === 1) {
          if (!val) {
            this.closeLiver();
          } else {
            // 由于直播不稳定暂时屏蔽 2020-02-28
            // this.liverVideoShow = true;
            // setTimeout(() => {
            //   this.playLiver();
            // }, 3000);
          }
        }
      }
    },
    "tim.msgList": {
      immediate: true,
      deep: true,
      handler: function (val) {
      }
    }
  },
  created () {
    this.$bus.$on("reciveMessage", this.reciveMessage);
    this.getMaterial();
    this.listenBusMsg();
    // 发起直播（医助）
    if (this.userInfo.jobType === 1) {
      // 由于直播不稳定暂时屏蔽 2020-02-28
      // this.liverVideoShow = true;
      // setTimeout(() => {
      //   this.playLiver();
      // }, 500);
    }
    // 定位消息
    this.msgPosition();
    // 获取审核通过的营销短信模板
    this.getOrgReviewedSmsTemplate();
  },
  methods: {
    ...mapActions({
      resetConversationID: "tmc/resetConversationID", // 改变会话ID
      resetPrivateChatID: "tmc/resetPrivateChatID", // 改变私聊ID
      getMoreMsg: "tim/getMoreMsg", // 获取更多消息
      setMessageRead: "tim/setMessageRead", // 上报已读
      changeUnreadCountPrivateFun: "tmc/changeUnreadCountPrivateFun", // 修改私聊未读数
      changePrivateShowFun: "tmc/changePrivateShowFun", // 修改私聊框展示
      refreshMsgList: "tim/refreshMsgList",
      // 刷新历史消息
      refreshHistoryMsgList: "tim/refreshHistoryMsgList",
      // 修改直播地址
      changeLiveStreamIDFun: "tmc/changeLiveStreamIDFun"
    }),
    //发送确实地址
    sendAddress(){
       let params = {
         orgID: this.userInfo.orgID,
         inquiryID: this.tmc.inquiryID
       }
       if(!this.tmc.inquiryID){
         this.$message.warning('暂无问诊！')
         return
       }
       this.$_http.get(this.$_API.INTERFACE_GET_BY_INQUIRY_ID,{params}).then(res=>{
           if(res.success){
             let data = {
               customType: "card",
               childType: "address",
               data: {
                 orgID: this.userInfo.orgID,
                 inquiryID: this.tmc.inquiryID,
                 title:"请您确认地址",
                 ...res.data
               }
             };
             let payload = {
               data: JSON.stringify(data),
               description: "确认收货地址",
               extension: "tmc"
             };
             this.sendMessage("ADDRESS", payload);
           }
       })
    },
    async getOnlineStatus () {
      try {
        let patientID = this.tmc.patientID || "";
        if (patientID) {
          const res = await this.$_loop_http.post(this.$_API.INTERFACE_GET_GET_CHAT_ONLINE_STATUS, [patientID]);
          if (res.data) {
            let keys = Object.keys(res.data);
            if (keys.length > 0) {
              let obj = res.data[patientID];
              this.tmc.tmcPatient.online = true;
              this.tmc.tmcPatient.channelCode = obj.channelCode;
              this.tmc.tmcPatient.channelName = obj.channelName;
              this.tmc.tmcPatient.pathName = obj.pathName;
            } else {
              this.tmc.tmcPatient.online = false;
              this.tmc.tmcPatient.channelCode = "";
              this.tmc.tmcPatient.channelName = "";
              this.tmc.tmcPatient.pathName = "";
            }
          }
        }
        this.$forceUpdate();
      } catch (error) {
        console.error(error);
      }
    },
    // 展示关键字
    handleShowWords (type) {
      this.type = type;
      this.wordsVisible = true;
    },
    // 关键字输入框点击
    handleWordsClick (data) {
      if (this.type === 1) {
        let tmpData = {
          customType: "card",
          childType: "tmcMaterial",
          data: {
            materialType: data.materialType,
            title: data.title,
            descrip: data.descrip,
            logoUrl: data.logoUrl,
            url: data.url
          }
        };
        let payload = {
          data: JSON.stringify(tmpData),
          description: "[素材]",
          extension: "tmc"
        };
        this.sendMaterial(payload);
      } else {
        if (data.mark === undefined) {
          this.msg = "";
          this.msg = data.classifyName || data.content;
        }
      }
      this.wordsVisible = false;
    },
    getDataFromChild (data) {
      sessionStorage.setItem("timer", parseInt(data));
    },
    // 监听消息
    listenBusMsg () {
      // 监听切换对话
      this.$bus.$on("changeChat", this.changeChat);
    },
    changeChat (data) {
      console.log("切换对话----");
      this.historyInquiryIndex = 0;
      this.msg = '';
      // 定位消息
      this.msgPosition();
    },
    // 获取素材模板目录
    getMaterial () {
      let params = {
        classifyType: 1,
        // 发送者
        orgID: this.userInfo.orgID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_TOOL_CLASSIFY_LIST, {
          params
        })
        .then(res => {
          if (!res.data) {
            return false;
          }
          // 得到父目录和子目录
          this.material.parent = res.data.filter(item => {
            return item.parantID === "";
          });
          this.material.child = res.data.filter(item => {
            return item.parantID !== "";
          });
          this.material.parent.forEach(item => {
            this.$set(item, "child", []);
            this.$set(item, "mark", false);
            this.material.child.forEach(i => {
              if (item.keyID === i.parantID) {
                item["child"].push(i);
              }
            });
          });
        });
    },
    reciveMessage (data) {
      this.dealCustomeMessage(data);
      this.$nextTick(() => {
        this.msgPosition();
      });
    },
    // 定位到消息最后一行
    msgPosition () {
      setTimeout(() => {
        this.$refs.mainRef.$el.scrollTop = this.$refs.mainRef.$el.scrollHeight;
      }, 20);
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
    endInquiry () {
      if (this.tmc.inquiryID) {
        this.dialogVisible = !this.dialogVisible;
      }
    },
    // 创建问诊 showType：0 消息发送成功后展示 1 只展示不发送消息 2 只发送消息不展示
    createInquiry (messageType, payload, groupID, showType) {
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
    sendMsg () {
      // 防止连续点击发送
      if (!this.msg) {
        this.sendTipFlag = true;
        setTimeout(it => {
          this.sendTipFlag = false;
        }, 500);
      } else {
        let curTime = new Date().getTime();
        if (curTime - this.sendMsgTime > 300) {
          let payload = {
            text: this.msg
          };
          this.sendMessage("TEXT", payload, "", 1);
          this.sendMsgTime = curTime;
          if (!this.tmc.conversationID) {
            this.createInquiry("TEXT", payload, "", 2);
          } else {
            this.sendMessage("TEXT", payload, "", 2);
          }
          this.msg = "";
          this.$nextTick(() => {
            this.msgPosition();
          });
        }
      }
      // 定位消息
    },
    // 发送图片
    sendImage () {
      let payload = {
        file: document.getElementById("imagePicker")
      };
      // 如果没有问诊创建问诊
      if (!this.tmc.conversationID) {
        this.createInquiry("IMAGE", payload, "");
      } else {
        this.sendMessage("IMAGE", payload, "");
      }
    },
    // 发送素材
    sendMaterial (payload) {
      // 如果没有问诊创建问诊
      this.sendMessage("CUSTOM", payload, "", 1);
      if (!this.tmc.conversationID) {
        this.createInquiry("CUSTOM", payload, "", 2);
      } else {
        this.sendMessage("CUSTOM", payload, "", 2);
      }
    },
    handleSendImageClick () {
      this.$refs.imagePicker.click();
    },
    async moreMsg () {
      if (this.isClickMoreMsg) {
        this.isClickMoreMsg = false;
        if (this.tim.isCompleted === 0) {
          this.getMoreMsg(this.tmc.conversationID);
          this.isClickMoreMsg = true;
        } else {
          if (this.historyInquiryIndex < this.tmc.historyInquiryList.length) {
            if (this.historyInquiryIndex === 0) {
              try {
                await this.dealLastestHistoryMsg(this.historyInquiryIndex, this.tim.msgList);
                this.isClickMoreMsg = true;
                this.historyInquiryIndex++;
              }
              catch (e) {
                this.isClickMoreMsg = true;
              }

            } else {
              try {
                await this.dealHistoryMsg(this.historyInquiryIndex);
                this.isClickMoreMsg = true;
                this.historyInquiryIndex++;
              }
              catch (e) {
                this.isClickMoreMsg = true;
              }
            }
          }
        }
      }
    },
    formatTimeStamp (timestamp, format) {
      if (!timestamp) {
        return 0;
      }
      var formatTime;
      format = format || "yyyyMMddHHmmss";
      var date = new Date(timestamp);
      var o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "H+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds() // 秒
      };
      if (/(y+)/.test(format)) {
        formatTime = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      } else {
        formatTime = format;
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(formatTime)) { formatTime = formatTime.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); }
      }
      return formatTime;
    },
    // startPhone() {
    //   // this.confirmPhoneVisible = true;
    //   let Base64 = require("js-base64").Base64;
    //   let timestamp = this.formatTimeStamp(new Date());
    //   let Authorization = Base64.encode("T00000014325" + ":" + timestamp);
    //   let str = "T00000014325" + "a83b6860-7d76-11ea-8094-d7d4a969e244" + timestamp;
    //   let sig = str.MD5(32).toLocaleUpperCase();
    //   let params = {
    //     FromExten: "8000",
    //     Exten: "18950075330",
    //     ExtenType: "Local"
    //   };
    //   ajax.post("https://openapis.7moor.com/v20160818/call/dialout/T00000014325" + "?sig=" + sig, params, { headers: { "Authorization": Authorization } })
    //     .then(res => {
    //       console.log(res);
    //       // this.$message({
    //       //   message: res.data,
    //       //   type: "success"
    //       // });
    //     });
    // },
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
      }
    },
    // 查询营销短信模板
    getOrgReviewedSmsTemplate () {
      // let params = { orgID: this.userInfo.orgID };
      // this.$_http
      //   .get(this.$_API.INTERFACE_GET_REVIEWED_SMS_TEMPLATEALL, {
      //     params
      //   })
      //   .then(res => {
      //     if (!res.data) return;
      //     this.allMarketSmsTemplate = res.data;
      //   });
    },
    changeMarketSmsTemplate (event) {
      if (!event) {
        this.selectedMarketSmsTemplate.templateName = "";
        return;
      }
      let chooseTemplate = this.allMarketSmsTemplate.find(it => {
        if (it.keyID === event) {
          return it;
        }
      });
      this.selectedMarketSmsTemplate.templateName = chooseTemplate.templateName;
    },
    determine () {
      let selectTemplate = this.allMarketSmsTemplate.find(item => {
        if (this.selectedMarketSmsTemplate.templateID === item.keyID) {
          return item.templateContent;
        }
      });
      this.templateContent = selectTemplate.templateContent;
    },
    addH5UrlToContentFun () {
      // let isHaveH5 = this.templateContent.indexOf("http://192.168.1.123:8080/index");
      let isHaveH5 = this.templateContent.indexOf("https://tmch5.100cbc.com/index");
      let isHaveCSH5 = this.templateContent.indexOf("https://tmch5-cs.100cbc.com/index");
      console.log(isHaveCSH5);
      console.log(isHaveH5);
      if (isHaveH5 > -1 || isHaveCSH5 > -1) {
        return;
      }
      let params = {
        orgID: this.userInfo.orgID,
        patientID: this.tmc.patientID
      };
      this.$_http.get(this.$_API.INTERFACE_GET_PATIENT_H5_URL, { params }).then(res => {
        if (!res.data) return;
        this.templateContent = this.templateContent + " " + res.data + " ";
      });
      // this.templateContent = this.templateContent + " http://192.168.1.123:8080/index?c=z4656t&i=1";
    },
    sendCustomSms () {
      if (!this.templateContent) {
        this.$alert(
          "您还未编辑短信内容哦，请编辑短信内容后发送。",
          "温馨提示",
          {
            confirmButtonText: "确定",
            callback: action => { }
          }
        );
        return false;
      }
      this.$confirm("您确定要发送吗？", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            orgID: this.userInfo.orgID,
            patientID: this.tmc.patientID,
            templateContent: this.templateContent
          };
          this.$_http
            .post(this.$_API.INTERFACE_TMC_POST_SENDCUSTOMSMS, params)
            .then(res => {
              if (!res.data) return;
              this.$_success("发送成功...");
              this.templateContent = "";
              this.$refs.messageDrop.hide();
              this.$refs.selectDelete.blur();
            });
        })
        .catch(() => { });
    },
    closeSms () {
      this.templateContent = "";
      this.$refs.selectDelete.blur();
      this.$refs.messageDrop.hide();
    },
    visibleChange () {
      this.$refs.selectDelete.blur();
      // console.log(this.$refs.selectDelete);
    }
  },
  destroyed () {
    this.closeLiver();
    clearInterval(this.interval);
  }
};
</script>

<style lang="scss">
.container #main .moreMsg .el-loading-spinner {
  margin-top: -8px !important;
}
</style>

<style lang="scss" scoped>
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
    height: calc(100% - 320px);
    border-bottom: 1px solid #e8e8e8;
    min-height: 350px;
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
    height: 260px !important;
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
.chat-tool-icon-box {
  text-align: center;
  margin-top: 5px;
  margin-bottom: 5px;
}
.chat-tool-icon-box-1 {
  text-align: center;
  margin-top: 11px;
  margin-bottom: 5px;
  margin-left: 10px;
  opacity: 0.3;
}
.chat-tool-icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.chat-tool-text {
  font-size: 12px;
  color: #bbb7b7;
}
.addH5Div {
  width: 100%;
  padding: 10px 0;
  text-align: center;
  cursor: pointer;
  font-size: 15px;
  color: #438bef;
}
.sms-message-row {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 20px;
  margin-right: 10px;
}
.msg-row {
  margin-left: 100px;
  margin-right: 100px;
}
.phoneVisible {
  margin-left: 50px;
}
.chat-offline {
  width: 42px;
  height: 16px;
  margin-left: 8px;
}
.chat-online {
  width: 65px;
  height: 16px;
  margin-left: 8px;
}
.head-left {
  display: flex;
  justify-content: baseline;
  align-items: center;
}
</style>
