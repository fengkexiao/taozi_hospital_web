<template>
  <div id="dropList" :class="apiKey+'class'">
    <div class="el-collapse-item__header header" v-if="fold" @click="handleClick">
      <i class="el-collapse-item__arrow el-icon-arrow-right" :class="{'is-active': isActive}" style="margin: 0 5px 0 0;font-size: 20px"></i>
      <slot name="title">{{title}}</slot>
      <span class="num" v-if="num !== 0">{{num}}</span>
    </div>
    <el-collapse-transition>
      <div v-show="isShow || !fold">
        <div v-for="(item, index) in timeKeys" :key="index">
          <div v-if="timeAndMultiTalk[item] && timeAndMultiTalk[item].patient" @click="changeChat(timeAndMultiTalk[item])" class="list" :class="{'active': timeAndMultiTalk[item].multiTalk.patientID === tmc.patientID && apiKey === tmc.groupName}">
            <div class="avatar">
              <el-badge :value="timeAndMultiTalk[item].unreadCount || ''" :max="99" id="item" :hidden="title==='消息' || title==='未接诊患者'?false:true">
                <el-avatar :src="timeAndMultiTalk[item].patient.faceImage||defaultAvatar" shape="square" v-bind:class="[timeAndMultiTalk[item].unreadCount>0 && (title==='消息' || title==='未接诊患者')?'chat-avatar':'',((title==='消息' || title==='未接诊患者') && !timeAndMultiTalk[item].tmcPatient.online)?'offline-status-gray':'']"></el-avatar>
                <img src="./../../../assets/image/tmcinquiry/man.png" class="avatar-sex" v-if="timeAndMultiTalk[item].tmcPatient.sex===1" v-bind:class="[timeAndMultiTalk[item].unreadCount>0 && (title==='消息' || title==='未接诊患者')?'chat-avatar':'',((title==='消息' || title==='未接诊患者') && !timeAndMultiTalk[item].tmcPatient.online)?'offline-status-gray':'']">
                <img src="./../../../assets/image/tmcinquiry/woman.png" class="avatar-sex" v-if="timeAndMultiTalk[item].tmcPatient.sex===2" v-bind:class="[timeAndMultiTalk[item].unreadCount>0 && (title==='消息' || title==='未接诊患者')?'chat-avatar':'',((title==='消息' || title==='未接诊患者') && !timeAndMultiTalk[item].tmcPatient.online)?'offline-status-gray':'']">
                <img src="./../../../assets/image/tmcinquiry/online-status.png" class="avatar-status" v-if="(title==='消息' || title==='未接诊患者') && timeAndMultiTalk[item].tmcPatient.online" v-bind:class="[timeAndMultiTalk[item].unreadCount>0 && (title==='消息' || title==='未接诊患者')?'chat-avatar':'']">
                <img src="./../../../assets/image/tmcinquiry/offline-status.png" class="avatar-status" v-if="(title==='消息' || title==='未接诊患者') && !timeAndMultiTalk[item].tmcPatient.online" v-bind:class="[timeAndMultiTalk[item].unreadCount>0 && (title==='消息' || title==='未接诊患者')?'chat-avatar':'']">
              </el-badge>
            </div>
            <div style="display: inline-block;width: 100%;">
              <li>
                <div class="li-title">
                  <span class="li-name">{{ timeAndMultiTalk[item].tmcPatient.patientName||timeAndMultiTalk[item].patient.personName}}</span>
                  <span v-if="title==='未接诊患者'">{{timeAndMultiTalk[item].tmcPatient.hasContact===1?'已接诊':''}}</span>
                  <div>
                    <span v-if="timeAndMultiTalk[item].tmcPatient.patientLevel" class="li-label">{{timeAndMultiTalk[item].tmcPatient.patientLevel}}</span>
                    <img src="./../../../assets/image/tmcinquiry/phone.png" class="li-icon" v-if="timeAndMultiTalk[item].tmcPatient.phone">
                    <img src="./../../../assets/image/tmcinquiry/wechat.png" class="li-icon" v-if="timeAndMultiTalk[item].tmcPatient.unionID">
                  </div>
                </div>
                <div class="li-tags">
                  <div class="tags-container">
                    <div class="li-tags_item" v-for="(item,index) of timeAndMultiTalk[item].tmcPatient.tagsArr" :key="index">{{item}}</div>
                  </div>
                  <span class="li-time" v-if="timeAndMultiTalk[item].multiTalk.lastSendTime&&timeAndMultiTalk[item].multiTalk.lastSendTime!='1900-01-01 00:00:00.0'">{{dealLastTime(timeAndMultiTalk[item].multiTalk.lastSendTime)}}</span>
                </div>
              </li>
              <li class="li-msg" v-if="timeAndMultiTalk[item].multiTalk.lastSendContent">{{dealLastMsg(timeAndMultiTalk[item])}}</li>
              <li class="li-msg" v-if="timeAndMultiTalk[item].multiTalk.reInquiryDate">请于{{timeAndMultiTalk[item].multiTalk.reInquiryDate}}回访</li>
            </div>
          </div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { formatDate } from "../../../filters";
import defaultAvatar from "@/assets/image/tmcinquiry/default-avatar.png";
import dealListMsg from "./dealListMsg";
import timPublic from "./timPublic";
import "./../../../utils/time.js";
export default {
  name: "dropDownList",
  mixins: [dealListMsg, timPublic],
  props: {
    title: {
      type: String,
      default () {
        return "";
      }
    },
    apiKey: {
      type: String,
      default () {
        return "all";
      }
    },
    fold: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters(["tmc", "userInfo", "tim"])
  },
  data () {
    return {
      listContainer: {},
      pageIndex: 1,
      totalUnRead: 0,
      defaultAvatar,
      isShow: false,
      isActive: false,
      num: 0,
      patients: [],
      // inquiry-multitalkID（群ID===inquiryID）
      inquiryMultitalkID: {},
      // inquiry-private-multitalkID(私聊的群ID==='p-'+inquiryID)
      inquiryPrivateMultitalkID: {},
      // multitalkID 为属性 时间戳为值
      multiTalkIdAndTime: {},
      // 时间戳 为属性  multitalk为值
      timeAndMultiTalk: {},
      // timeAndMultiTalk 的所有属性数组
      timeKeys: [],
      timer: null,
      isBottomed: false,
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    };
  },
  created () {
    console.log('1111')
    this.initList();
    this.listenBusMsg();
    this.$bus.$on("refreshList", () => {
      this.initList();
    });
    if (this.apiKey === "inquiry" || this.apiKey === "missedPatients") {
      this.timer = setInterval(() => {
        this.getOnlineStatus();
      }, 5000);
    }
  },
  destroyed () {
    clearInterval(this.timer);
  },
  mounted () {
    this.listContainer = document.querySelector('.' + this.apiKey + 'class')
    this.listContainer.addEventListener('scroll', this.doSomething)
  },
  watch: {
    timeKeys: {
      handler (val) {
        // this.clearContact();
        //  this.setTotalCount();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    doSomething () {
      let scrollcurHeight = this.listContainer.scrollTop;
      if (this.listContainer.scrollHeight - this.listContainer.scrollTop === this.listContainer.clientHeight) {
        if (this.isBottomed) return false
        this.search()
      }
    },
    // 获取医生在线状态
    async getOnlineStatus () {
      try {
        if (this.timeKeys.length > 0) {
          let list = [];
          for (let i = 0; i < this.timeKeys.length; i++) {
            if (this.timeAndMultiTalk[this.timeKeys[i]].tmcPatient.keyID) {
              list.push(this.timeAndMultiTalk[this.timeKeys[i]].tmcPatient.keyID);
            }
          }
          const res = await this.$_loop_http.post(this.$_API.INTERFACE_GET_GET_ONLINE_STATUS, list);
          if (res.data) {
            let tmpObj = res.data || {};
            for (let i = 0; i < this.timeKeys.length; i++) {
              this.$set(this.timeAndMultiTalk[this.timeKeys[i]].tmcPatient, "online", false);
              // this.$set(this.timeAndMultiTalk[this.timeKeys[i]].tmcPatient, "channelCode", "");
              // this.$set(this.timeAndMultiTalk[this.timeKeys[i]].tmcPatient, "channelName", "");
              // this.$set(this.timeAndMultiTalk[this.timeKeys[i]].tmcPatient, "pathName", "");
              let keyID = this.timeAndMultiTalk[this.timeKeys[i]].tmcPatient.keyID;
              if (tmpObj[keyID] && keyID === tmpObj[keyID].patientID) {
                this.$set(this.timeAndMultiTalk[this.timeKeys[i]].tmcPatient, "online", true);
                // this.$set(this.timeAndMultiTalk[this.timeKeys[i]].tmcPatient, "channelCode", "");
                // this.$set(this.timeAndMultiTalk[this.timeKeys[i]].tmcPatient, "channelName", "");
                // this.$set(this.timeAndMultiTalk[this.timeKeys[i]].tmcPatient, "pathName", "");
              }
            }
          }
        }
        this.$forceUpdate();
      } catch (error) {
        console.error(error);
      }
    },
    // 清除条数
    clearContact () {
      let keys = Object.keys(this.timeAndMultiTalk);
      for (let i = 0; i < keys.length; i++) {
        if (this.timeAndMultiTalk[keys[i]].tmcPatient.hasContact === 1) {
          delete this.timeAndMultiTalk[keys[i]];
        }
      }
      this.$forceUpdate();
    },
    // 设置总条数
    setTotalCount () {
      if (this.apiKey === "inquiry" || this.apiKey === "missedPatients") {
        let totalCount = 0;
        for (let i = 0; i < this.timeKeys.length; i++) {
          if (this.timeAndMultiTalk[this.timeKeys[i]]) {
            if (this.timeAndMultiTalk[this.timeKeys[i]].tmcPatient.hasContact < 1 && this.apiKey === "missedPatients") {
              totalCount += this.timeAndMultiTalk[this.timeKeys[i]].unreadCount || 0;
            } else {
              totalCount += this.timeAndMultiTalk[this.timeKeys[i]].unreadCount || 0;
            }
          }
        }
        this.$emit("messaageUnReadChange", { totalCount, apiKey: this.apiKey });
      }
    },
    initList () {
      this.inquiryMultitalkID = {};
      this.inquiryPrivateMultitalkID = {};
      this.multiTalkIdAndTime = {};
      this.timeAndMultiTalk = {};
      this.search()
    },
    search () {
      let params = {
        orgID: this.userInfo.orgID,
        staffID: this.userInfo.keyID,
        type: this.userInfo.jobType
      };
      let dateKey = {
        day: formatDate(new Date()),
        tomorrow: this.getTomorrow(new Date()),
        week: this.getLastDayOfWeek(new Date()),
        month: this.getLastDayOfMonth(new Date())
      };
      let key = this.apiKey;
      if (dateKey[key]) {
        params["endTime"] = dateKey[key];
        key = "byTime";
      }

      this.getPatientList(key, params);
    },
    ...mapActions({
      changeChatFun: "tmc/changeChatFun", // 切换会话窗口
      cleanMsgList: "tim/cleanMsgList", // 清空消息列表
      initMsgList: "tim/initMsgList", // 初始化消息
      initPrivateMsgList: "tim/initPrivateMsgList", // 初始化私聊消息
      setMessageRead: "tim/setMessageRead", // 上报已读
      clearTmcFun: "tmc/clearTmcFun", // 清空tmc
      changeUnreadCountPrivateFun: "tmc/changeUnreadCountPrivateFun", // 修改私聊未读数
      changeHistoryInquiryListFun: "tmc/changeHistoryInquiryListFun", // 修改历史问诊ID列表
      setCurGroupNoMoreMsg: "tim/setCurGroupNoMoreMsg" // 设置当前群没有更多消息
    }),
    // 监听消息
    listenBusMsg () {
      if (this.apiKey === "inquiry" || this.apiKey === "missedPatients") {
        // 接收消息分发
        this.$bus.$on("reciveMessage", this.reciveMessage);
        // 发送消息分发
        this.$bus.$on("sendMessageRes", this.sendMessageRes);
        // 未读消息
        this.$bus.$on("unReadMsgRes", this.unReadMsgRes);
        // 上报已读
        this.$bus.$on("setMessageReadRes", this.setMessageReadRes);
        // 发送消息(展示最后一条发送的消息)
        this.$bus.$on("sendMessageTo", this.sendMessageTo);
      }
      if (this.apiKey === "inquiry" || this.apiKey === "missedPatients" || this.apiKey === "all") {
        // 创建问诊(会处理患者排序)
        this.$bus.$on("createTMCInquiry", this.createTMCInquiry);
        this.$bus.$on("createFirstTMCInquiry", this.createTMCInquiry);
        // 结束问诊
        this.$bus.$on("endTMCInquiry", this.endTMCInquiry);
        // 切换医生医助
        this.$bus.$on("tmcChangeDoctor", this.createTMCInquiry);
      }
    },
    handleClick () {
      this.isShow = !this.isShow;
      this.isActive = !this.isActive;
    },
    // 发送消息(展示最后一条发送的消息)
    async sendMessageTo (data) {
      if (this.apiKey === "missedPatients") {
        for (let i = 0; i < this.timeKeys.length; i++) {
          if (data.multiTalkID === this.timeAndMultiTalk[this.timeKeys[i]].multiTalk.keyID) {
            if (this.timeAndMultiTalk[this.timeKeys[i]].tmcPatient.hasContact <= 0) {
              let params = {
                orgID: this.userInfo.orgID,
                keyID: this.timeAndMultiTalk[this.timeKeys[i]].tmcPatient.keyID
              };
              const res = await this.$_http.post(this.$_API.INTERFACE_POST_MODIFY_PATIENT_CONTACT, params);
              if (res.data) {
                this.$set(this.timeAndMultiTalk[this.timeKeys[i]].tmcPatient, "hasContact", 1);
              }
            }
          }
        }
      }
      for (let i = 0; i < this.timeKeys.length; i++) {
        if (data.multiTalkID === this.timeAndMultiTalk[this.timeKeys[i]].multiTalk.keyID) {
          this.$set(this.timeAndMultiTalk[this.timeKeys[i]].multiTalk, "lastSendContent", JSON.stringify(data.message));
          this.$set(this.timeAndMultiTalk[this.timeKeys[i]].multiTalk, "lastSendTime", new Date().getTime() / 1000);
        }
      }
    },
    updateLastSendTime (data) {
      data.forEach(element => {
        let inquiryID = element.conversationID.replace("GROUP", "");
        // 多方群未读
        let multiTalkID = this.inquiryMultitalkID[inquiryID];
        if (multiTalkID) {
          let time = this.multiTalkIdAndTime[multiTalkID];
          if (time) {
            this.$set(this.timeAndMultiTalk[time].multiTalk, "lastSendTime", element.lastMessage.lastTime);
          }
        } else {
          // 私聊群未读
          multiTalkID = this.inquiryPrivateMultitalkID[inquiryID];
          if (multiTalkID) {
            let time = this.multiTalkIdAndTime[multiTalkID];
            if (time) {
              this.$set(this.timeAndMultiTalk[time].multiTalk, "lastSendTime", element.lastMessage.lastTime);
            }
          }
        }
      });
      this.$forceUpdate();
    },
    // 接收分发的消息
    reciveMessage (data) {
      this.dealCustomeMessage(data);
      this.sortListByReceiveMsg(data);
    },
    // 发送消息分发
    sendMessageRes (data) {
      this.sortListBySendMsg(data);
    },
    // 根据接收到的消息排序
    sortListByReceiveMsg (data) {
      let flag = false;
      data.forEach(msg => {
        // 问诊ID就是群ID
        let inquiryID = msg.conversationID.replace("GROUP", "");
        let multiTalkID = this.inquiryMultitalkID[inquiryID];
        if (multiTalkID) {
          // 多方对话消息
          let time = this.multiTalkIdAndTime[multiTalkID];
          if (time) {
            flag = true;
            let multitalk = this.timeAndMultiTalk[time];

            let newTime = new Date().getTime();
            while (this.timeAndMultiTalk[newTime]) {
              newTime++;
            }
            this.multiTalkIdAndTime[multiTalkID] = newTime;
            this.timeAndMultiTalk[newTime] = multitalk;
            // 移除原来的
            delete this.timeAndMultiTalk[time];
            this.$set(this.timeAndMultiTalk[newTime].multiTalk, "lastSendTime", new Date().getTime() / 1000);
            this.$set(this.timeAndMultiTalk[newTime].multiTalk, "lastSendContent", JSON.stringify(msg));
            // 未读消息计数
            if (this.tmc.multiTalkID !== multiTalkID) {
              if (this.timeAndMultiTalk[newTime].unreadCount) {
                this.timeAndMultiTalk[newTime].unreadCount++;
              } else {
                if (msg.from !== this.userInfo.keyID) {
                  this.timeAndMultiTalk[newTime].unreadCount = 1;
                }
              }
            }
          }
        } else {
          // 私聊消息
          multiTalkID = this.inquiryPrivateMultitalkID[inquiryID];
          if (multiTalkID) {
            let time = this.multiTalkIdAndTime[multiTalkID];
            if (time) {
              flag = true;
              let multitalk = this.timeAndMultiTalk[time];

              let newTime = new Date().getTime();
              while (this.timeAndMultiTalk[newTime]) {
                newTime++;
              }
              this.multiTalkIdAndTime[multiTalkID] = newTime;
              this.timeAndMultiTalk[newTime] = multitalk;
              // 移除原来的
              delete this.timeAndMultiTalk[time];
              // 未读消息计数
              if (
                this.tmc.conversationID !== inquiryID.replace("p-", "") ||
                !this.tmc.privateShow
              ) {
                if (this.timeAndMultiTalk[newTime].unreadCountPrivate) {
                  // 有私聊未读就累加
                  ++this.timeAndMultiTalk[newTime].unreadCountPrivate;
                } else {
                  // 没有私聊未读就设置1条
                  this.timeAndMultiTalk[newTime].unreadCountPrivate = 1;
                }
                this.changeUnreadCountPrivateFun(
                  this.timeAndMultiTalk[newTime].unreadCountPrivate
                );
              }
            }
          }
        }
      });
      if (flag) {
        this.timeKeys = Object.keys(this.timeAndMultiTalk);
        this.timeKeys.reverse();
      }
      this.setTotalCount();
    },
    // 根据发送消息排序
    sortListBySendMsg (data) {
      let msg = data.message;
      let flag = false;
      // 问诊ID就是群ID
      let inquiryID = msg.conversationID.replace("GROUP", "");
      let multiTalkID = this.inquiryMultitalkID[inquiryID];
      let time = this.multiTalkIdAndTime[multiTalkID];
      if (time) {
        flag = true;
        let multitalk = this.timeAndMultiTalk[time];

        let newTime = new Date().getTime();
        while (this.timeAndMultiTalk[newTime]) {
          newTime++;
        }
        this.multiTalkIdAndTime[multiTalkID] = newTime;
        this.timeAndMultiTalk[newTime] = multitalk;
        // 移除原来的
        delete this.timeAndMultiTalk[time];
      }
      if (flag) {
        this.timeKeys = Object.keys(this.timeAndMultiTalk);
        this.timeKeys.reverse();
      }
    },
    // 收到未读消息
    unReadMsgRes (data) {
      data.forEach(element => {
        let inquiryID = element.conversationID.replace("GROUP", "");
        // 多方群未读
        let multiTalkID = this.inquiryMultitalkID[inquiryID];
        if (multiTalkID) {
          let time = this.multiTalkIdAndTime[multiTalkID];
          if (time) {
            this.timeAndMultiTalk[time].unreadCount = element.unreadCount;
            this.$set(this.timeAndMultiTalk[time].multiTalk, "lastSendTime", element.lastMessage.lastTime);
          }
        } else {
          // 私聊群未读
          multiTalkID = this.inquiryPrivateMultitalkID[inquiryID];
          if (multiTalkID) {
            let time = this.multiTalkIdAndTime[multiTalkID];
            if (time) {
              this.timeAndMultiTalk[time].unreadCountPrivate =
                element.unreadCount;
              this.$set(this.timeAndMultiTalk[time].multiTalk, "lastSendTime", element.lastMessage.lastTime);
            }
          }
        }
      });
      this.timeKeys = Object.keys(this.timeAndMultiTalk);
      this.timeKeys.reverse();
      this.$forceUpdate();
      this.setTotalCount();
    },
    // 收到上报已读信息
    setMessageReadRes (data) {
      let multiTalkID = this.inquiryMultitalkID[data];
      if (multiTalkID) {
        // 多方群上报已读
        let time = this.multiTalkIdAndTime[multiTalkID];
        if (time) {
          this.$set(this.timeAndMultiTalk[time], "unreadCount", 0);
          this.setTotalCount();
        }
      } else {
        // 私聊群上报已读
        multiTalkID = this.inquiryPrivateMultitalkID[data];
        let time = this.multiTalkIdAndTime[multiTalkID];
        if (time) {
          this.$set(this.timeAndMultiTalk[time], "unreadCountPrivate", 0);
          this.setTotalCount();
        }
      }
    },
    // 收到创建问诊信息
    createTMCInquiry (data) {
      // 根据multiTalkID查询对话
      if (this.apiKey === "missedPatients" && data.createType !== "createFirstTMCInquiry") {
        // 如果是未接诊患者列表 并且不是第一次创问诊 就不处理
        return;
      }
      let multiTalkID = data.talkID;
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_MULTI_TALK_BY_ID, {
          params: { orgID: this.userInfo.orgID, multiTalkID: multiTalkID }
        })
        .then(res => {
          if (res && res.data) {
            let dataObj = res.data;
            dataObj.unreadCount = 0;
            dataObj.unreadCountPrivate = 0;
            dataObj.hasContact = 0;
            let keyID = dataObj.multiTalk.keyID;
            let inquiryID = dataObj.multiTalk.imID;
            if (inquiryID) {
              this.inquiryMultitalkID[inquiryID] = keyID;
            }
            // 删除旧的数据
            let oldTime = this.multiTalkIdAndTime[multiTalkID];
            if (oldTime) {
              delete this.timeAndMultiTalk[oldTime];
            }
            let time = new Date().getTime();
            while (this.timeAndMultiTalk[time]) {
              time++;
            }
            this.multiTalkIdAndTime[keyID] = time;
            this.timeAndMultiTalk[time] = dataObj;
            dataObj.unreadCount = 1;
            this.timeKeys = Object.keys(this.timeAndMultiTalk);
            this.timeKeys.reverse();
            this.num = this.timeKeys.length;
            if (
              keyID === this.tmc.multiTalkID &&
              this.apiKey === this.tmc.groupName
            ) {
              // clearMsg 0 不清空 1清空
              let option = {
                clearMsg: 0
              };
              this.changeChat(dataObj, option);
            }
          }
          this.setTotalCount();
        });
      // this.initList();
    },
    // 收到结束问诊信息
    endTMCInquiry (data) {
      if (this.apiKey === "inquiry") {
        let multiTalkID = data.talkID;
        let inquiryID = data.inquiryID;
        let time = this.multiTalkIdAndTime[multiTalkID];

        delete this.inquiryMultitalkID[inquiryID];
        delete this.multiTalkIdAndTime[multiTalkID];
        delete this.timeAndMultiTalk[time];

        this.timeKeys = Object.keys(this.timeAndMultiTalk);
        this.timeKeys.reverse();
        this.num = this.timeKeys.length;
      } else if (this.apiKey === "all") {
        this.isShow = true;
        let multiTalkID = data.talkID;
        let time = this.multiTalkIdAndTime[multiTalkID];
        this.timeAndMultiTalk[time].multiTalk.imID = "";
        // clearMsg 0 不清空 1清空
        let option = {
          clearMsg: 0
        };
        this.changeChat(this.timeAndMultiTalk[time], option);
      }
    },
    // 切换会话
    changeChat (item, option) {
      this.changeChatFun({
        doctorStaffID: item.multiTalk.doctorStaffID,
        doctorName: item.doctor.doctorName,
        assistantStaffID: item.multiTalk.assistantStaffID,
        assistantName: item.assistant.doctorName,

        personID: item.multiTalk.personID,
        patientID: item.multiTalk.patientID,
        patientName: item.patient.personName,
        conversationID: item.multiTalk.imID,
        multiTalkID: item.multiTalk.keyID,
        groupName: this.apiKey,
        unreadCountPrivate: item.unreadCountPrivate,

        doctor: item.doctor,
        assistant: item.assistant,
        patient: item.patient,
        tmcPatient: item.tmcPatient,
        multiTalk: item
      });
      // 默认操作 和 清空操作
      if (option == null || option.clearMsg === 1) {
        // 清空消息列表
        this.cleanMsgList();
        if (item.multiTalk.imID) {
          // 初始化群聊消息
          this.initMsgList(item.multiTalk.imID);
          // 初始化私聊消息
          this.initPrivateMsgList("p-" + item.multiTalk.imID);
        } else {
          // 如果没有问诊ID,就设置当前群消息为没有未读消息
          this.setCurGroupNoMoreMsg();
        }
        this.getHistoryInquiryID();
      }
      // 上报群聊已读
      if (item.multiTalk.imID) {
        this.$bus.$emit("setMessageReadRes", item.multiTalk.imID);
        this.setMessageRead(item.multiTalk.imID);
      }
      // 切换对话发送消息
      let changeChatParams = {};
      this.$bus.$emit("changeChat", changeChatParams);
    },
    // 获取全部患者
    getPatientList (key, params) {
      const apis = {
        all: this.$_API.INTERFACE_TMC_GET_ALL_MULTI_TALK_PAGE, // 全部患者
        inquiry: this.$_API.INTERFACE_TMC_GET_INQUIRY_MULTI_TALK_GET_PAGE, // 问诊中患者
        outTime: this.$_API.INTERFACE_TMC_GET_OUTTIME_MULTI_TALK_PAGE, // 到期未复诊
        byTime: this.$_API.INTERFACE_TMC_GET_MULTI_TALK_BYTIME_PAGE, // 按时间查询需复诊患者
        noMedicine: this.$_API.INTERFACE_TMC_GET_NOPURCHASE_MULTI_TALK_PAGE, // 未购药患者
        followUpTask: this.$_API.INTERFACE_TMC_GET_FOLLOW_TASK_MULTI_TALK_PAGE, // 跟进任务
        missedPatients: this.$_API.INTERFACE_TMC_GET_NO_CONTACT_MULTITALKLIST_PAGE // 未接诊
      };

      params.pageSize = 15
      params.pageIndex = this.pageIndex++
      this.$_http
        .get(apis[key], {
          params
        })
        .then(res => {
          // if (!res.data || res.data.length === 0) return;
          let list = res.data.datas || []
          let patientArray = list;
          patientArray.reverse();
          patientArray.map(item => {
            let keyID = item.multiTalk.keyID;
            let inquiryID = item.multiTalk.imID;
            if (inquiryID) {
              this.inquiryMultitalkID[inquiryID] = keyID;
              this.inquiryPrivateMultitalkID["p-" + inquiryID] = keyID;
            }
            let time = new Date().getTime();
            while (this.timeAndMultiTalk[time]) {
              time++;
            }
            let tagsArr = [];
            if (item.tmcPatient) {
              let patientTags = item.tmcPatient.patientTags || "";
              if (patientTags) {
                let tmpArr = patientTags.split(",");
                tagsArr = tmpArr.slice(0, 2) || [];
              }
            }
            item.tmcPatient.tagsArr = tagsArr;
            this.multiTalkIdAndTime[keyID] = time;
            this.timeAndMultiTalk[time] = item;
            // this.patients.push(item);
          });
          this.timeKeys = Object.keys(this.timeAndMultiTalk);
          this.timeKeys.reverse();
          this.num = this.timeKeys.length;
          if (list.length < 15) {
            this.isBottomed = true
          }
        });
    },
    // 获取这周的周一
    getLastDayOfWeek (date) {
      let weekday = date.getDay() || 7; // 获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
      date.setDate(date.getDate() + (7 - weekday)); // 往前算（weekday-1）天，年份、月份会自动变化
      return formatDate(date);
    },
    getTomorrow (date) {
      var day3 = date;
      day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
      return day3.getFullYear() + "-" + (day3.getMonth() + 1) + "-" + day3.getDate();
    },
    // 获取这个月的最后一天
    getLastDayOfMonth (date) {
      let month = date.getMonth();
      date.setMonth(month + 1); // 设置月份加1
      date.setDate(0); // 设置月份减1
      return formatDate(date);
    },
    // 处理最后一条消息
    dealLastMsg (item) {
      let msg = item.multiTalk.lastSendContent;
      try {
        if (msg) {
          let msgObj = JSON.parse(item.multiTalk.lastSendContent);
          let msgType = msgObj.type;
          let msgContent = "";
          if (msgObj._elements) {
            msgContent = msgObj._elements[0].content || "";
          }
          switch (msgType) {
            case "TIMTextElem":
              return msgContent.text;
            case "TIMLocationElem":
              break;
            case "TIMFaceElem":
              break;
            case "TIMCustomElem":
              let dataObj = JSON.parse(msgContent.data);
              if (dataObj.customType === "hint") {
                return "[" + dataObj.data.text + "]";
              } else if (dataObj.customType === "card") {
                return "[" + dataObj.data.title + "]";
              } else {
                return "";
              }
            case "TIMSoundElem":
              return "[语音]";
            case "TIMImageElem":
              return "[图片]";
            case "TIMFileElem":
              break;
            case "TIMVideoFileElem":
              break;
          }
        };
      } catch (error) {
        console.error(error);
      }
    },
    dealLastTime (time) {
      let dateStr = "";
      if (typeof (time) === "string") {
        var index = time.lastIndexOf("\.");
        if (index > -1) {
          time = new Date(time.substring(0, index)).getTime() / 1000;
        }
      }
      if (!isNaN(time)) {
        dateStr = new Date(time * 1000).toWeiXinString();
      }
      return dateStr;
    },
    fillZero (str) {
      if (str < 10) {
        return "0" + str;
      } else {
        return str;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@-webkit-keyframes twinkling {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
/*此处的scaleout需要与上面定义的名字scaleout 保持一致*/
.chat-avatar {
  animation: twinkling 1s infinite ease-in-out;
}
#dropList {
  width: 340px;
  overflow: auto;
  position: relative;
  border-bottom: 1px solid #ebeef5;
  .header {
    border: none;
    height: 38px;
    line-height: 38px;
    padding: 0 10px;
  }
  .active {
    background: #f6f6f6;
  }
  .list {
    padding: 10px 10px;
    align-items: center;
    align-content: center;
    display: flex;
    font-size: 13px;
    &:hover {
      background: #f6f6f6;
      cursor: pointer;
    }
    li {
      width: 270px;
      list-style: none;
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .li-title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        .li-name {
          font-size: 14px;
        }
        .li-label {
          border: 1px solid #ffa102;
          color: #ffa102;
          border-radius: 2px;
          font-size: 12px;
        }
        .li-icon {
          width: 12px;
          height: 12px;
          margin-left: 4px;
        }
      }
      .li-tags {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2px;
        .tags-container {
          display: flex;
          height: 19px;
          .li-tags_item {
            padding: 0 2px;
            color: #438bef;
            font-size: 12px;
            border-radius: 2px;
            opacity: 0.5;
            border: 1px solid rgba(67, 139, 239, 1);
            margin-right: 6px;
            height: 19px;
            line-height: 19px;
          }
        }
        .li-time,
        .li-msg {
          color: #87888b;
        }
        .li-msg {
          height: 12px;
        }
      }
    }

    .avatar /deep/ .el-avatar {
      width: 40px;
      height: 40px;
    }
    .avatar {
      width: 40px;
      height: 40px;
      line-height: 40px;
      display: inline-block;
      border-radius: 5px;
      margin-right: 10px;
      position: relative;
      .badge {
        width: 100%;
        height: 100%;
      }
      img {
        display: block;
        height: 100%;
      }
      .avatar-sex {
        height: 12px;
        width: 14px;
        position: absolute;
        top: 28px;
        right: 0;
      }
      .avatar-status {
        position: absolute;
        z-index: 99;
        width: 26px;
        height: 26px;
        top: 0px;
        left: 0px;
      }
    }
  }
  .num {
    margin: 0 5px 0 auto;
  }
  .offline-status-gray {
    object-fit: cover;
    filter: grayscale(100%);
  }
}
</style>
