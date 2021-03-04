<template>
  <div class="app-container order-pool">
    <audio style="visibility: hidden;position: absolute;z-index: -1" controls="controls" title="播放音乐" ref="audioRefs">
      <source src="@/assets/music/lingsheng.mp3" type="audio/mpeg" />
    </audio>
    <div class="pool_left">
      <!-- 头部信息 -->
      <div class="pool-header">
        <!-- 医生状态 -->
        <div class="pool-header_doctor">
          <div class="doctor-info">
            <base-image :src="avatar" class="doctor-avatar" />
          </div>
          <div class="doctor-status">
            <div class="status1">{{userInfo.staffName}}</div>
            <div class="status2">
              <div class="sction" :title="userInfo.doctorInfo?(userInfo.doctorInfo.sectionName + ',' + userInfo.orgName) : userInfo.orgName">
                <el-tag v-show="userInfo.doctorInfo">{{userInfo.doctorInfo.sectionName || '' }}</el-tag>
                <el-tag style="margin-left:8px;">{{userInfo.orgName}}</el-tag>
              </div>
              <div class="statusInfo">
                <div class="stop" v-show="!receptionStatus"></div>
                <div class="stop-text" v-show="!receptionStatus">停止接诊</div>
                <div class="pending" v-show="receptionStatus"></div>
                <div class="pending-text" v-show="receptionStatus">服务中</div>
              </div>
            </div>
            <div class="status3">
              <el-button type="danger" style="background: #F5222D;border-radius: 4px;margin-left: 0px;" v-show="receptionStatus" @click="handleStop">暂停接诊</el-button>
              <el-button type="primary" style="background:#438BEF;border-radius: 4px;margin-left: 0px;" v-show="!receptionStatus" @click="handleStart" :loading="startLoading">开始接诊</el-button>
              <el-button type="primary" style="background:#438BEF;border-radius: 4px;" @click="handleReload">
                <div style="display: flex;justify-content: center;align-items: center;font-size:12px;">
                  <img src="./../../assets/image/icon_refresh.png" style="width: 12px;height: 12px;margin-right: 4px;">刷新
                </div>
              </el-button>
            </div>
            <div class="status3">
              <div style="display: flex;justify-content: center;align-items: center;">
                <el-button style="border-radius: 4px;border-color:#8c8c8c;" @click="handleHome">
                  <div style="display: flex;justify-content: center;align-items: center;font-size:12px;">
                    <img src="./../../assets/image/icon_home.png" style="width: 12px;height: 12px;margin-right: 4px;">主页
                  </div>
                </el-button>
              </div>
            </div>
          </div>
        </div>
        <!-- 订单列表 -->
        <div class="pool-header_list">
          <el-table :data="orderList" ref="orderTable" class="order-table" :loading="tableLoading" max-height="190">
            <!-- <el-table-column prop="inquiryType" label="来源" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.inquiryType===0">普通</span>
                <span v-else-if="scope.row.inquiryType===1">图文</span>
                <span v-else-if="scope.row.inquiryType===2">视频</span>
              </template>
            </el-table-column> -->
            <el-table-column prop="inquiryType" label="问诊方式" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.inquiryType===0">普通</span>
                <span v-else-if="scope.row.inquiryType===1">图文</span>
                <span v-else-if="scope.row.inquiryType===2">视频</span>
              </template>
            </el-table-column>
            <el-table-column prop="patientName" label="问诊人姓名" align="center"></el-table-column>
            <el-table-column label="性别/年龄" align="center">
              <template slot-scope="scope">
                <span v-show="scope.row.patientSex===1">男</span><span v-show="scope.row.patientSex===2">女</span>/{{scope.row.patientAge}}
              </template>
            </el-table-column>
            <el-table-column prop="time" label="订单计时" align="center">
              <template slot-scope="scope">
                <span class="time">{{scope.row.time}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button class="receipt-btn" v-show="scope.row.isTop && scope.row.orderStatus===4" @click="handleContinue(scope.row)">需重开方</el-button>
                <el-button class="receipt-btn" v-show="scope.row.isTop && scope.row.orderStatus!==4" @click="handleContinue(scope.row)">继续处理</el-button>
                <el-button class="receipt-btn" v-show="!scope.row.isTop" @click="handleReceipt(scope.row)">接单</el-button>
              </template>
            </el-table-column>
            <div slot="empty"></div>
          </el-table>
        </div>
      </div>
      <!-- 操作区 -->
      <div class="pool-body">
        <div class="pool-body-detail">
          <div class="pool-body_patient" v-show="showBtn && receptionStatus &&  patientList.length>0">
            <div class="patient-title">接诊列表</div>
            <ul class="patient-list">
              <li class="patient-item" v-for="(item,index) of patientList" :key="index" :class="[item.active?'active':'',((item.inquiryType===1 ||item.inquiryType===2) && !item.online)?'offline-status':'']" @click="handlePatientItem(item,index)">
                <div class="item-avatar">
                  <img v-if="item.clientID === clientID && item.faceImage" :src="item.faceImage" style="width:32px;height:32px;">
                  <img v-else :src="gen_text_img(item.patientName,item)">
                  <span class="item-msg_count" v-if="item.msgCount">{{item.msgCount}}</span>
                </div>
                <div class="item-user">
                  <span class="patient-name">{{item.patientName}}</span>
                  <i class="iconfont iconbianzu" v-show="item.inquiryType===1 || item.inquiryType===2"></i>
                  <img src="./../../assets/image/icon_warning@2x.png" class="icon-warning" v-show="item.orderStatus===4" />
                </div>
              </li>
            </ul>
          </div>
          <!-- 聊天区域 -->
          <div class="pool-body_chat" v-show="showBtn && receptionStatus && patientList.length>0 && (currentChat.inquiryType===1 || currentChat.inquiryType===2)">
            <div class="pool-body-unchat" v-show="currentChat.inquiryType!==1 && currentChat.inquiryType!==2">
              <img src="./../../assets/image/illustrator.png">
              <span>该订单不支持问诊功能</span>
            </div>
            <chat :userSig="userSig" :to="to" :cus_tim="cus_tim" :inquiryType="inquiryType" :conversationID="to" :nameStr="nameStr" :onlineStatus="currentChat.online" :dataInfoDetail="dataInfoDetail" v-show="currentChat.inquiryType===1 || currentChat.inquiryType===2" :hangupVideo="hangupVideo" :patientFaceImage="patientFaceImage" :verbalTrickData="verbalTrickData"></chat>
          </div>
          <!-- 处方详情 -->
          <div class="pool-body_info" v-show="showBtn && receptionStatus && patientList.length>0">
            <div class="order-back" v-show="orderStatus===4">
              <img src="./../../assets/image/icon_warning@2x.png" class="icon-warning" />
              <span>药师审方不通过，请重新修改处方</span>
            </div>
            <patient-details ref="patientDetail" @sendEndMessage="sendEndMessage" @detailLoad="handleDetailLoad" :orderId.sync="orderId" :userSig="userSig" :rpID="rpID" :chatList="chatList" :currentChat.sync="currentChat" :orderStatus="orderStatus" v-show="patientList.length>0" @patinetInfo="patinetInfoDetail" :riskStatiscal="riskStatiscal" :validateResults="validateResults" @videoReviewrPorder="videoReviewrPorder"></patient-details>
          </div>
          <div class="reset-container" v-show="showBtn && !receptionStatus">
            <img src="./../../assets/image/reset.png">
            <p class="p1">当前状态：休息中～</p>
            <p class="p2">点击下方“开始接诊”按钮开始接诊服务</p>
            <el-button type="primary" v-show="!receptionStatus" @click="handleStart" :loading="startLoading">开始接诊</el-button>
          </div>
        </div>
        <!-- 没有数据 -->
        <div class="reset-container no-order" v-show="receptionStatus && patientList.length<=0">
          <img src="./../../assets/image/no-order.png">
        </div>
      </div>
    </div>
    <div class="pool_right">
      <div class="prescriptions">
        <span :class="['tab',activeIndex == 1?'active':'']" @click="activeIndex = 1">风险监测</span>
        <span :class="['tab',activeIndex == 2?'active':'']"  @click="activeIndex = 2">用药说明</span>
      </div>
      <risk-monitoring v-show="activeIndex == 1 && showBtn && receptionStatus &&  patientList.length > 0 && (medicineResult.length > 0 || validateResults.length > 0)" @toMonitor="toMonitor" :medicineResult="medicineResult" :validateResults="validateResults" :riskStatiscal="riskStatiscal" :dataInfoDetail="dataInfoDetail" :warningState="true"></risk-monitoring>
      <div v-show="activeIndex == 1 && (!showBtn || !receptionStatus ||  patientList.length == 0 || (medicineResult.length == 0 && validateResults.length == 0))" class="noData">暂无风险监测</div>
      <!-- 话术库 -->
      <verbal-trick v-show="activeIndex == 1" @verbalTrickEmit="verbalTrickEmit" :scene="scene"></verbal-trick>
      <medical-information  v-show="activeIndex == 2 && showBtn && receptionStatus &&  patientList.length > 0  && medicineResult.length > 0" :medicineResult="medicineResult"></medical-information>
      <div v-show="activeIndex == 2 && (!showBtn || !receptionStatus ||  patientList.length == 0 || medicineResult.length == 0)" class="noData" style="height: calc(100% - 40px);">暂无用药说明</div>
    </div>
  </div>
</template>

<script>
import PatientDetails from "./PatientDetails";
import { mapGetters } from "vuex";
import avatar from "@/assets/image/default-avatar.png";
import moment from "moment";
import "@/assets/sdk/webim/webim.js";
import "@/assets/sdk/webim/json2.js";
/* eslint-disable */
import MessageBox from "element-ui/packages/message-box";
import { SDK_APP_ID } from "@/common/Constant";
import SingleChat from "./../components/class/SingleChat.js";
import Chat from "./../components/singleChat/chat.vue";
import riskMonitoring from "./components/riskMonitoring";
import medicalInformation from "./components/medicalInformation";
import verbalTrick from "./components/verbalTrick";
const delay = (function () {
  let timer = 0
  return function (callback, ms) {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()
export default {
  name: "orderPool",
  components: {
    PatientDetails,
    Chat,
    riskMonitoring,
    medicalInformation,
    verbalTrick
  },
  data () {
    return {
      patientList: [],
      checkSubmit: false,
      orderStatus: 0,
      orderId: '',
      showBtn: false,
      avatar,
      bizID: '',
      receptionStatus: false,
      orderList: [],
      tableLoading: false,
      listeners: {
        onConnNotify: this.onConnNotify,
        onMsgNotify: this.onMsgNotify,
        onC2cEventNotifys: this.onC2cEventNotifys
      },
      options: {
        isLogOn: false
      },
      userSig: "",
      startLoading: false,
      clientList: [],
      clientArrayList: [],
      chatList: [],
      currentChat: {},
      cus_tim: {},
      showMsg: false,
      rpID: '',
      time: 0,
      title_bak: document.title,
      title: document.title,
      timer: null,
      to: '',
      nameStr: '',
      interval:{},
      activeIndex: 1,
      dataInfoDetail:{},
      medicineResult:[],
      validateResults:[],
      riskStatiscal: {},
      inquiryType: null,
      hangupVideo: false,
      clientID: "",
      patientFaceImage: "",
      verbalTrickData: {},
      scene: ""
    };
  },
  computed: {
    ...mapGetters(["userInfo","tmc"])
  },
  async created () {
    this.clientID = process.env.VUE_APP_PHARMACY_CLIENTID
    await this.initStatus();
    await this.getclientSys();
    await this.getUserSign();
    await this.getPatientList();
    this.setCheckPatient()
  },
  async mounted () {
    window.addEventListener("timOnReceiveMessage", this.timOnReceiveMessage);
    this.visiblePage(true)
  },
  methods: {
    // 主页
    handleHome () {
      window.open(window.location.origin + '/home');
    },
    // 重新加载
    async handleReload () {
      await this.handleRefresh()
      await this.getPatientList()
      this.setCheckPatient()
    },
    // IM处理结束消息
    sendEndMessage (payloads) {
      this.cus_tim.sendCustomMessage(this.to, payloads);
    },
    // 获取userSign
    async getUserSign () {
      let params = {
        userId: this.userInfo.keyID
      };
      let res = await this.$_http.get(this.$_API.API_RP_INITIAL_GETUSERSIG, {
        params
      });
      if (res) {
        if (!res.data) return;
        this.userSig = res.data.userSig;
        this.cus_tim = SingleChat.getInstance(this.userInfo.keyID, this.userSig);
        try {
          
        } catch (error) {
          
        }
      }
    },
    // 重新加载详情
    async reloadDetail () {
      this.orderId = ''
      this.currentChat = {}
      await this.handleRefresh()
      await this.getPatientList()
      this.setCheckPatient()
    },
    // 发送消息
    sendMsg (item) {
      let param = {
        "customType": "sys",
        "childType": "sendDoctorInfo",
        "data": {
          "staffName": this.userInfo.staffName,
          "faceImage": this.userInfo.doctorInfo.faceImage,
          "titleName": this.userInfo.doctorInfo.titleName,
          "doctorID": this.userInfo.doctorID
        }
      };
      let payload = {
        data: JSON.stringify(param),
        description: "[医生信息]",
        extension: "rp"
      };
      this.cus_tim.sendCustomMessage(this.to, payload);
      let data = {
        customType: "hint",
        childType: "both",
        data: {
          text: `${this.userInfo.staffName}-${this.userInfo.doctorInfo.titleName}已为您接诊`
        }
      };
      let payloads = {
        data: JSON.stringify(data),
        description: "[IP医生提交消息]",
        extension: "tmc"
      };
      this.cus_tim.sendCustomMessage(this.to, payloads);
    },
    // 获取文本头像
    gen_text_img (s, item) {
      if (s) {
        if (s.length > 0) {
          s = s.substring(0, 1)
        }
        let colors = [];
        if (item.patientSex === 1) {
          colors = [
            "#387FE2"
          ]
        } else {
          colors = [
            "#FF9AC9"
          ]
        }
        let cvs = document.createElement("canvas");
        cvs.setAttribute('width', 32);
        cvs.setAttribute('height', 32);
        cvs.setAttribute('height', 32);
        let ctx = cvs.getContext("2d");
        ctx.fillStyle = colors[Math.floor(Math.random() * (colors.length))];
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.font = 14 * 1 + "px Arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(s, 32 / 2, 32 / 2);
        return cvs.toDataURL('image/jpeg', 1);
      }
    },
    // 页面控制
    visiblePage (flag) {
      let side = document.querySelector(".sidebar-container");
      let header = document.querySelector(".fixed-header");
      let mainContainer = document.querySelector(".main-container");
      let appMain = document.querySelector(".app-main");
      if (flag) {
        side.style.display = "none";
        header.style.display = "none";
        mainContainer.className = mainContainer.className + " ml0";
        mainContainer.className = mainContainer.className + " reset-main-container";
        appMain.className = appMain.className + " reset-app-main";
      } else {
        side.style.display = "block";
        header.style.display = "block";
        mainContainer.className = mainContainer.className.replace("ml0", "");
        appMain.className = appMain.className.replace("reset-app-main", "");
      }
    },
    // tim 消息响应
    timOnReceiveMessage ({ detail }) {
      // 有新订单的消息提示
      this.notice(detail)
      // 消息条数
      this.messageCount(detail)
    },
    // 消息条数
    messageCount (detail) {
      let strConversationID = "";
      for (const msg of detail) {
        if (msg.conversationType === "C2C") {
          let conversationID = msg.from;
          strConversationID = conversationID.replace("C2C", "");
        }
      }
      // strConversationID  当前消息的会话id
      // this.to    发给谁
      // item.to    接诊列表中患者的会话id
      this.patientList.map(item => {
        if (item.to === strConversationID && this.to !== strConversationID) { // 
          item.msgCount++
        } else if (item.to === strConversationID) {
          item.msgCount = 0
        }
      })
      this.$forceUpdate()
    },
    // 消息提示
    async notice (detail) {
      let flag = false
      if (!this.receptionStatus) {
        return false
      }
      for (const msg of detail) {
        if (msg.payload.extension === "rpOrder" || msg.payload.extension === 'rpPharmacistRefuse') {
          let str = ''
          if (msg.payload.extension === "rpOrder") {
            str = '您有新的续方订单啦～'
          } else {
            str = '您有订单审方不通过,请尽快处理～'
          }
          this.$notify({
            title: "通知",
            iconClass: "notification-imgs",
            message: str,
            duration: 3000,
            position: 'top-left',
            offset: 95
          });
          flag = true
          this.handleRefresh()
          this.getPatientList('11')
          //这里增加声音
          if (this.$refs.audioRefs) {
            this.$refs.audioRefs.play()
          }
        }
        // 订单超时被回收，刷新页面
        if (msg.payload.extension === 'rpOrderTimeOutFresh') {
          this.orderId = ''
          await this.handleRefresh()
          await this.getPatientList('11')

          this.setCheckPatient()
        }
      }
      if (!flag) {
        this.showMsg = true
      }
    },
    // 初始化状态
    async initStatus () {
      await this.getClient()
      if (sessionStorage.getItem('online')) {
        this.receptionStatus = true;
        this.startLoading = false
        this.handleStart()
      }
      this.showBtn = true
    },
    // 获取接诊人列表
    async getPatientList (type) {
      clearInterval(this.interval)
      try {
        const res = await this.$_http.get(this.$_API.INTERFACE_RP_GET_DEALINGORDER, { params: { doctorID: this.userInfo.doctorID } });
        if (res.data) {
          this.patientList = res.data || []
          let orderPatientIDs=[]
          this.patientList.map(async item => {
            if(item.inquiryType===1 || item.inquiryType===2){
              item.to = item.patientImID || ''
              item.msgCount = 0
              orderPatientIDs.push(item.patientImID)
            }
            if(item.clientID === this.clientID && item.userID) {
              // 获取用户信息
              let userInfo = await this.$_http.get(this.$_API.INTERFACE_GET_PERSONUSERBYPERSON, {
                params: {
                  personID: item.userID
                }
              });
              if(userInfo) {
                item.patientName = userInfo.data.personName
                item.faceImage = userInfo.data.faceImage
              }
            }
          })
         this.interval= setInterval(() => {
            if(orderPatientIDs.length>0){
              this.getPatientTrace(orderPatientIDs)
            }
          }, 3000);
          if (!this.orderId) {
            if (this.patientList.length > 0) {
              this.handlePatientItem(this.patientList[0], 0)
            }
          } else if (this.orderId && !type) {
            this.patientList.find((item, index) => {
              if (item.orderID === this.orderId) {
                this.handlePatientItem(item, 0)
              }
            })
          } else if (this.orderId && type) {
            this.patientList.find((item, index) => {
              if (item.orderID === this.orderId) {
                item.active = true
                console.log(item)
              }
            })
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    // 默认选中
    setCheckPatient () {

    },
    // 获取所有客户
    async getClient () {
      const res = await this.$_http.get(this.$_API.INTERFACE_RP_GET_GETCLIENTLIST, {
        params: {
          doctorID: this.userInfo.doctorID,
          doctorTypeID: this.userInfo.doctorInfo.doctorTypeID
        }
      });
      if (res.data) {
        this.clientArrayList = res.data || [];
      }
    },
    // 获取哪些客户可以减数量
    async getclientSys () {
      let params = {
        "groupCode": "OP_RP_CLIENT",
        "paraCode": "OP_RP_CLIENT_EDITAMOUNT"
      };
      const res = await this.$_http.post(this.$_API.INTERFACE_RP_POST_GETCLIENTORG, params);
      if (res.data) {
        let list = res.data || []
        let tmpList = []
        list.map(item => {
          if (item.paraValue === '1') {
            tmpList.push(item.clientID)
          }
        })
        sessionStorage.setItem('client_org', JSON.stringify(tmpList))
      }
    },
    // 动态时间计算
    timeCal (time) {
      setInterval(() => {
        this.orderList.map((item, index) => {
          var a = moment(new Date(item.addTime).getTime());
          var b = moment(new Date().getTime());
          var x = b.diff(a, "seconds");
          var d = moment.duration(x, 'minutes');
          let time = moment(new Date(new Date(item.addTime))).format('YYYY-MM-DD HH:mm:ss')
          let nowTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          let flag = moment(nowTime).isBefore(time)
          if (flag) {
            item.time = '00:00:00'
          } else {
            item.time = this.formatSeconds(x)
          }
          this.$set(item, index, item);
        });
      }, 1000);
    },
    formatSeconds (value) {
      let result = parseInt(value)
      let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
      let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
      let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
      let res = '';
      res += `${h}:`;
      res += `${m}:`;
      res += `${s}`;
      return res;
    },
    // 补0
    addZero (time) {
      if (time < 10) {
        time = `0${time}`;
      }
      return time;
    },
    // 抢单
    async handleReceipt (item) {
      delay(async () => {
        let res = {}
        try {
          if (this.checkSubmit) {
            return false;
          }
          this.checkSubmit = true;
          res = await this.$_http.get(this.$_API.INTERFACE_RP__GET_GRABORDER, {
            params: {
              orderID: item.orderID,
              staffID: this.userInfo.keyID,
              orgID: this.userInfo.orgID,
              doctorID: this.userInfo.doctorID,
              doctorName: this.userInfo.staffName
            }
          });
          this.checkSubmit = false;
          this.bizID = item.bizID
          this.orderId = item.orderID
          await this.handleRefresh()
          await this.getPatientList()
          this.setCheckPatient()
        } catch (error) {
          this.checkSubmit = false;
          await this.handleRefresh()
          await this.getPatientList('111')
          this.setCheckPatient()
        }
      }, 500)

    },
    // 点击患者列表
    handlePatientItem (item, index) {
      this.patientList.map(item => {
        item.active = false
      })
      item.active = true
      this.currentChat = item
      this.orderId = item.orderID
      this.orderStatus = item.orderStatus || 0
      this.showMsg = false
      this.rpID = item.rpID
      this.inquiryType = item.inquiryType
      setTimeout(() => {
        if (this.$refs.patientDetail) {
          this.$refs.patientDetail.initInfo(true)
        }
      }, 0);
      this.hangupVideo = false
      setTimeout(() => {
        this.nameStr = item.patientName
        this.patientFaceImage = item.faceImage
      },200)
    },
    // 获取在线状态
    async getPatientTrace(list){
      const res = await this.$_http.post(this.$_API.INTERFACE_RP_POST_GETPATIENTTRACE, list,{headers:{log:0}})
      if(res.data){
        let onlineObj=res.data 
        this.patientList.map(item=>{
          if(onlineObj[item.patientImID]){
            this.$set(item,'online',true)
          }else{
            this.$set(item,'online',false)
          }
        })
      }
    },
    // 详情加载完成,发送医生接诊消息
    async handleDetailLoad (data) {
      this.dataInfoDetail = data
      this.to = data.to
      this.patientList.map((item, index) => {
        if (item.orderID === data.orderID) {
          item.msgCount = 0
          this.$set(item, 'msgCount', 0)
        }
      })
      if (data.inquiryType === 1) {
        let res = await this.cus_tim.getMessageList('C2C' + this.to, 15)
        if (res && res.code === 0) {
          if (res.data.messageList.length <= 0) {
            this.sendMsg(data)
          } else if (data.orderStatus === 1 && res.data.messageList.length > 0) {
            this.sendMsg(data)
          }
        }
      }
      if (data.orderStatus === 4) {
        this.sendMsg(data)
      }
    },
    // 刷新
    handleRefresh () {
      if (!this.receptionStatus) {
        return false
      }
      if (this.tableLoading) {
        return;
      }

      this.tableLoading = true;
      let clientArrayStr = ''
      let tmpClientList = []
      this.clientArrayList.map(item => {
        tmpClientList.push(item.clientID)
      })
      if (tmpClientList.length <= 0) {
        this.$message({
          message: '医生还未分组，请先联系运营为医生分组',
          type: 'warning'
        });
        return false
      }
      this.$_http
        .get(this.$_API.INTERFACE_RP_GET_FRESHORDERPOOL, {
          params: {
            sectionCode: this.userInfo.doctorInfo.sectionCode || '',
            //sectionCode: "02",
            clientID: tmpClientList.join(','),
            doctorID: this.userInfo.doctorID
          }
        })
        .then(res => {
          if (!res.data) return;
          let newList = res.data || [];

          newList.map((item, index) => {
            this.$set(newList[index], "time", '');
          });
          this.orderList = JSON.parse(JSON.stringify(newList));
          this.timeCal();
          if (this.orderList.length > 0) {
            this.show()
          } else {
            this.clears()
          }
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 开始接诊
    handleStart () {
      this.login()
    },
    // 暂停接诊   // im
    async handleStop () {
      if (sessionStorage.getItem('online')) {
        this.receptionStatus = false;
        this.orderList = []
        let params = {
          keyID: sessionStorage.getItem('online'),
        };
        const res = await this.$_http.post(this.$_API.INTERFACE_RP_POST_UPDATERECORD, params);
        if (res.data) {
          //SingleChat.clearInstance()
          sessionStorage.removeItem('online')
          //this.cus_tim.logout()
          this.clears()
        }
      }
    },
    // 获取
    getUseSig () {
      // this.startLoading = true
      // let params = {
      //   userId: this.userInfo.keyID
      // };
      // let requests = this.$_http.get(this.$_API.API_RP_INITIAL_GETUSERSIG, {
      //   params
      // });
      // requests.then(res => {
      //   if (!res.data) return;
      //   this.userSig = res.data.userSig;
      this.login()
      //});
    },
    // im登陆 //im
    async login () {
      this.receptionStatus = true;
      this.startLoading = false
      let params = {
        doctorID: this.userInfo.doctorID,
        doctorName: this.userInfo.staffName,
        staffID: this.userInfo.keyID,
        hospitalID: this.userInfo.orgID,
      };
      const res = await this.$_http.post(this.$_API.INTERFACE_RP_POST_CREATERECORD, params);
      if (res.data) {
        //this.cus_tim = SingleChat.getInstance(this.userInfo.keyID, this.userSig);
        sessionStorage.setItem('online', res.data)
      }
      await this.handleRefresh()
      await this.getPatientList()
      this.setCheckPatient()
    },
    show () {
      var title = this.title.replace("", "").replace("您有新的订单啦", "");
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.time++;
        this.show();
        if (this.time % 2 == 0) {
          document.title = "您有新的订单啦"
        } else {
          document.title = '\u200E'
        };
      }, 200);
      return [this.timer, this.title];
    }
    ,
    clears () {
      clearTimeout(this.timer);
      document.title = '桃子互联网医院-医院端';
    },
    // 子传父开处方编辑数据
    patinetInfoDetail(item) {
      this.dataInfoDetail = item.dataInfo
      this.rationalMedicineCheck(item.dataInfo,item.action)
      if(item.type == 'multi') {
        this.rationalMedicineFlushInfo(item.dataInfo)
      }
      this.detectScene(item.dataInfo)
    },
    // 子传父事件重新检测审方
    toMonitor() {
      this.rationalMedicineCheck(this.dataInfoDetail,"reCheck")
    },
    // 检测审方
    async rationalMedicineCheck(data,action) {
      let medicineList = [];
      if(data.medicines) {
        data.medicines.forEach(ele => {
          let obj = {
            medicineName: ele.medicineName,
            specification: ele.specification,
            medicineAmount: ele.medicineAmount,                 
            formType: ele.formType,
            takeDose: ele.takeDose,
            takeFrequence: ele.takeFrequence,
            takeDirection: ele.takeDirection,
            medicationDays: ele.medicationDays,
            isCertificate: data.certificateUrl ? 1 : 0
          }
          medicineList.push(obj);
        });
        let params = {
          rp:{
            medicineList: medicineList,
            source: 'peach',
            endPoint: "web",
            clientID: data.clientID,
            orderID: data.orderID,
            doctorID: data.doctorID,
            doctorName: data.doctorName,
            action: action
          },
          patientInfo:{
            patientName: data.patientName,
            patientSex: data.patientSex,
            patientAge: data.patientAge,
            patientWeight: data.patientWeight,
            illDesc: data.illDesc,
            // historyOfAllergy: data.historyOfAllergy,
            allergyDetail: data.allergyDetail,
            // historyOfSickness: data.historyOfSickness,
            sicknessDetail: data.sicknessDetail,
            liver: data.liver == "正常"? 0 : 1,
            renal: data.renal == "正常"? 0 : 1,
            pregnancy: data.pregnancy == "备孕"?1:(data.pregnancy == "妊娠"?2:(data.pregnancy == "哺乳"?3:'')),
            primaryDiagnosis: data.primaryDiagnosis,
            reInquiry: data.certificateUrl ? 1 : 0
          }
        }
        this.validateResults = []
        this.riskStatiscal = {}
        const res = await this.$_http.post(this.$_API.INTERFACE_AUTORE_POST_CHECK, params)
        if(res.data) {
          let validateResults = res.data.caculateResultList
          let arr = []
          validateResults.forEach(ele => {
            ele.state = true
            arr.push(ele)
          })
          this.validateResults = arr
          this.riskStatiscal = res.data.reportStatiscal
        }
      }
    },
    // 查询药品规格信息
    rationalMedicineFlushInfo(data) {
      if(JSON.stringify(data) !== '{}') {
        let params = []
        data.medicines.forEach(ele => {
          params.push(ele.medicineName);
        })
        this.medicineResult = []
        this.$_http.post(this.$_API.INTERFACE_AUTORE_POST_FLUSHINFO, {medicineNames:params}).then(res => {
          if(res.data) {
            this.medicineResult = res.data
          }
        })
      }
    },
    videoReviewrPorder() {
      this.hangupVideo = true
    },
    // 话术库数据
    verbalTrickEmit(item) {
      if(this.currentChat.inquiryType === 1 || this.currentChat.inquiryType === 2) {
        this.verbalTrickData = item
      }else {
        this.verbalTrickData = {}
      }
    },
    // 获取当前场景
    detectScene(data) {
      let medicines = []
      data.medicines.forEach(ele => {
        let obj = {
          'fullName': ele.medicineName
        }
        medicines.push(obj)
      })
      let params = {
        "allergy": data.allergyDetail,
        "liver": data.liver == "正常"? 0 : 1,
        "renal": data.renal == "正常"? 0 : 1,
        "medicines": medicines,
        "patientAge": data.patientAge,
        "pregnant": data.pregnancy == "备孕"?1:(data.pregnancy == "妊娠"?2:(data.pregnancy == "哺乳"?3:''))
      }
      this.$_http.post(this.$_API.INTERFACE_AUTORE_GET_SPEECHCRAFT_DETECTSCENE, params).then(res => {
        if(res.success) {
          this.scene = res.data.scene
        }
      })
    }
  }
};
</script>

<style lang="scss" >
.notification-imgs {
  background-image: url("./../../assets/image/notice.png");
  width: 23px;
  background-size: cover;
  height: 30px;
}
.el-notification.left {
  left: 210px;
}
.order-table {
  &::before {
    height: 0px;
  }
  .el-table__header-wrapper {
    table {
      thead {
        tr {
          th {
            background: #ffffff;
            border-bottom: 1px solid #e8e8e8 !important;
          }
        }
      }
    }
  }
  .el-table__body-wrapper {
    table {
      tbody {
        tr {
          td {
            height: 44px;
            border-bottom: 0px;
            color: #262626;
          }
        }
      }
    }
  }
}

// 1440
// 1336
@media screen and (max-width: 1920px) {
  .pool-body_chat {
    width: 400px;
  }
}

@media screen and (max-width: 1440px) {
  .pool-body_chat {
    width: 374px;
  }
}
</style>
<style lang="scss"  scoped>
.pool-patient_container {
  width: calc(100vw - 248px);
  padding-left: 14px;
  height: calc(100vh - 212px);
  overflow: auto;
}
.pool_left {
  width: calc(100% - 436px);
  float: left;
}
.pool_right {
  width: 420px;
  float: left;
  background: #fff;
  margin-left: 16px;
  height: 100vh;
  overflow: auto;
  .prescriptions {
    height: 40px;
    line-height: 40px;
    background: #3489ff;
    padding-left: 10px;
    .tab {
      text-align: center;
      display: inline-block;
      width: 80px;
      font-size: 14px;
      line-height: 28px;
      height: 28px;
      color: #fff;
      margin-right: 20px;
      cursor: pointer;
    }
    .active {
      background: rgba(255,255,255,0.20);
      border-radius: 5px;
      box-shadow: 0px -1px 2px 0px rgba(52,137,255,0.69); 
    }
  }
  .noData {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 542px);
    color: #ffa216;
  }
}
.pool-header {
  background: #f0f2f5;
  overflow: hidden;
  margin-top: 16px;
  .pool-header_doctor {
    flex-shrink: 0;
    width: 325px;
    height: 190px;
    margin-right: 12px;
    background: #fff;
    padding: 24px 24px 0 24px;
    display: flex;
    border-radius: 5px;
    float: left;
    .doctor-info {
      .doctor-avatar {
        width: 49px;
        height: 49px;
        border-radius: 49px;
      }
    }
    .doctor-status {
      width: 100%;
      padding-left: 16px;
      button {
        border-radius: 2px;
      }
      .status1 {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #000000;
      }
      .status2 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding-top: 6px;
        .sction {
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .el-tag {
          height: 20px;
          background: rgba(67, 139, 239, 0.15);
          border-radius: 2px;
          color: #438bef;
          font-size: 12px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          color: undefined;
          line-height: 20px;
        }
        .statusInfo {
           .pending {
            border: 1px solid #438bef;
            border-radius: 6px;
            width: 6px;
            height: 6px;
            background: #438bef;
            display: inline-block;
          }
          .pending-text {
            margin-left: 4px;
            display: inline-block;
            color: #262626;
            font-weight: 400;
            font-size: 14px;
          }
          .stop {
            border: 1px solid #fe5853;
            border-radius: 6px;
            width: 6px;
            height: 6px;
            background: #fe5853;
            display: inline-block;
          }
          .stop-text {
            margin-left: 4px;
            font-size: 14px;
            display: inline-block;
            color: #262626;
          }
        }
      }
      .status3 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 16px;
      }
    }
  }
  .pool-header_list {
    height: 190px;
    background: #fff;
    border-radius: 5px;
    width: calc(100% - 337px);
    float: left;
  }
}
.order-pool {
  background: #f0f2f5;
  padding-left: 16px;
  min-width: 1366px;
  overflow: hidden;
}

.order-back {
  height: 36px;
  margin-top: 8px;
  background: rgba(245, 34, 45, 0.1);
  border: 1px solid #f5222d;
  border-radius: 2px;
  color: #f5222d;
  text-align: center;
  display: flex;
  justify-content: center;
  font-size: 14px;
  align-items: center;
  span {
    margin-left: 8px;
  }
}

.option-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  img {
    width: 16px;
    height: 16px;
  }
  span {
    margin-left: 4px;
    width: 28px;
    height: 22px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    color: #262626;
    line-height: 22px;
  }
}

.pool-body {
  margin-top: 12px;
  background: #fff;
  height: calc(100vh - 232px);
  overflow: hidden;
  border-radius: 5px;
  .pool-body-detail {
    display: flex;
    .pool-body_patient {
      width: 145px;
      background: #fff;
      height: calc(100vh - 228px);
      overflow: auto;
      border: 1px solid #e8e8e8;

      .patient-title {
        height: 56px;
        width: 100%;
        text-align: center;
        line-height: 56px;
        border-bottom: 1px solid #e8e8e8;
        font-size: 16px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #000000;
      }
      .patient-list {
        margin: 0;
        padding: 0;
        .patient-item {
          margin: 0;
          padding: 4px 8px;
          list-style: none;
          height: 40px;
          display: flex;
          cursor: pointer;
          &:hover {
            background: #f6f6f6;
          }
          &.active {
            background: #f6f6f6;
          }
          &.offline-status{
            opacity: 0.7;
          }
          .patient-name {
            max-width: 56px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .item-avatar {
            img {
              border-radius: 4px;
            }
          }

          .item-msg_count {
            width: 13px;
            height: 13px;
            opacity: 0.85;
            background: #fe5853;
            color: #fff;
            font-size: 10px;
            border-radius: 50%;
            display: block;
            text-align: center;
            position: relative;
            top: -40px;
            left: 25px;
          }
          .item-user {
            line-height: 36px;
            padding-left: 8px;
            font-size: 14px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #000000;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
    .pool-body_chat {
      background: #fff;
      height: calc(100vh - 228px);
      overflow: auto;
      border: 1px solid #e8e8e8;
      //border-bottom: 0;
      border-left: 0;
      border-right: 0;
      .pool-body-unchat {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-top: 212px;
        img {
          width: 245px;
          height: 199px;
        }
        span {
          margin-top: 44px;
          font-size: 18px;
          font-weight: 500;
          color: #000000;
        }
      }
    }
    .pool-body_info {
      flex: 1;
      background: #fff;
      height: calc(100vh - 228px);
      overflow: auto;
      border: 1px solid #e8e8e8;
      border-bottom: 0;
      padding-left: 16px;
      background: #ffffff;
      padding-bottom: 20px;
    }
  }
}
.iconbianzu {
  color: #52c41a;
  margin-left: 4px;
  font-size: 12px;
}
.icon-warning {
  width: 12px;
  height: 12px;
  margin-left: 4px;
  flex-shrink: 0;
}
.reset-container {
  text-align: center;
  padding-top: 161px;
  width: 100%;
  img {
    width: 243px;
    height: 161px;
  }
  p {
    margin: 0;
    padding: 0;
  }
  .p1 {
    font-size: 18px;
    font-weight: 500;
    margin-top: 49px;
  }
  .p2 {
    margin-top: 16px;
    font-size: 14px;
    margin-bottom: 30px;
    color: #5a595c;
  }
  button {
    border-radius: 2px;
  }
}
.no-order {
  img {
    width: 365px;
    height: 347px;
  }
}

.time {
  color: #f5222d;
  font-weight: 500;
}
.user-avatar {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  margin: 0;
}
.no-data {
  margin-bottom: 20px;
  img {
    width: 243px;
    height: 171px;
    margin-top: 79px;
  }
  p {
    margin: 0;
    padding: 0;
    line-height: 0;
  }
}

@keyframes fade {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}

@-webkit-keyframes fade {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}
.headerBox {
  color: #fff;
  animation: fade 600ms infinite;
  -webkit-animation: fade 600ms infinite;
}
.receipt-btn {
  width: 60px;
  height: 26px;
  padding: 0;
  line-height: 26px;
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
  border: 1px solid rgba(67, 139, 239, 1);
  color: #438bef;
  &:hover {
    background: #387fe2;
    color: #ffffff;
  }
}
</style>
