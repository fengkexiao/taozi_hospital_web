<template>
  <div class="app-container order-pool">
    <audio style="visibility: hidden;position: absolute;z-index: -1" controls="controls" title="播放音乐" ref="audioRefs">
      <source src="@/assets/music/lingsheng.mp3" type="audio/mpeg" />
    </audio>
    <div class="order-pool_header">
      <div class="left-container">
        <base-image :src="avatar" class="user-avatar" />
        <span class="staff-name">{{userInfo.staffName}}</span>
        <el-tag v-if="userInfo.doctorInfo" style="margin-left:24px;">{{userInfo.doctorInfo.sectionName || '' }}</el-tag>
        <el-tag style="margin-left:16px;">{{userInfo.orgName}}</el-tag>
        <div class="stop" v-if="!receptionStatus" style="margin-left:38px;"></div>
        <div class="stop-text" v-show="!receptionStatus">停止接诊</div>
        <div class="pending" v-if="receptionStatus"></div>
        <div class="pending-text" v-show="receptionStatus">服务中</div>
        <el-button type="danger" style="margin-left:36px;" v-show="receptionStatus" @click="handleStop">暂停接诊</el-button>
        <el-button type="primary" style="margin-left:36px;" v-show="!receptionStatus" @click="handleStart" :loading="startLoading">开始接诊</el-button>
      </div>
      <div class="right-container">
        <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
      </div>
    </div>
    <base-title class="order-title" name="问诊列表" v-if="receptionStatus"></base-title>
    <el-table :data="orderList" ref="orderTable" style="width: 100%" :loading="tableLoading" v-if="receptionStatus" stripe>
      <el-table-column prop="clientID" label="来源" align="center">
        <template slot-scope="scope">
          <span>{{formateClient(scope.row.clientID)}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="sectionName" label="科室" align="center"></el-table-column> -->
      <el-table-column prop="inquiryType" label="问诊方式" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.inquiryType===0">普通</span>
          <span v-else-if="scope.row.inquiryType===1">图文</span>
        </template>
      </el-table-column>
      <el-table-column prop="patientName" label="问诊人姓名" align="center"></el-table-column>
      <el-table-column label="性别/年龄" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.patientSex===1">男</span>
          <span v-if="scope.row.patientSex===2">女</span>
          /{{scope.row.patientAge}}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="illDesc" label="患者主诉" align="center" show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="addTime" label="发起时间" align="center" width="170">
        <template slot-scope="scope">
          <span>{{scope.row.addTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="订单计时" align="center">
        <template slot-scope="scope">
          <span class="time">{{scope.row.time}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button class="receipt-btn" v-if="scope.row.isTop && scope.row.orderStatus===4" @click="handleContinue(scope.row)">需重开方</el-button>
          <el-button class="receipt-btn" v-if="scope.row.isTop && scope.row.orderStatus!==4" @click="handleContinue(scope.row)">继续处理</el-button>
          <el-button class="receipt-btn" v-if="!scope.row.isTop" @click="handleReceipt(scope.row)">接单</el-button>
        </template>
      </el-table-column>
      <div slot="empty">
        <div class="no-data" v-if="!tableLoading">
          <img src="./../../assets/image/no_data.png">
          <p>暂无数据～</p>
        </div>
      </div>
    </el-table>
    <div v-else class="reset-container">
      <div v-if="showBtn">
        <img src="./../../assets/image/reset.png">
        <p class="p1">当前状态：休息中～</p>
        <p class="p2">点击下方“开始接诊”按钮开始接诊服务</p>
        <el-button type="primary" v-show="!receptionStatus" @click="handleStart" :loading="startLoading">开始接诊</el-button>
      </div>
    </div>
    <patientDetails :dialogVisible.sync="dialogVisible" :orderId.sync="orderId" :userSig="userSig" :rpID="rpID" :chatList="chatList" :currentChat.sync="currentChat" :orderStatus="orderStatus"></PatientDetails>
    <div :class="[showMsg?'headerBox':'','join-fixed']" v-if="chatList.length>0" @click="dialogVisible=true,showMsg=false">
      <img src="./../../assets/image/join-group.png">
      <p>进入问诊</p>
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
    PatientDetails
  },
  data () {
    return {
      checkSubmit: false,
      orderStatus: 0,
      dialogVisible: false,
      orderId: '',
      showBtn: false,
      avatar,
      dialogVisible: false,
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
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  async created () {
    await this.getAllClient();
    this.initStatus()
    window.addEventListener("timOnReceiveMessage", this.timOnReceiveMessage);
    this.getclientSys()
  },
  mounted(){
    this.visiblePage(true)
  },
  destroyed () {
    //  this.handleStop()
  },
  watch: {
    '$route' (val) {
      this.getAllClient();
      this.initStatus()
    },
    dialogVisible (val) {
      if (!val) {
        this.handleRefresh()
      }
    }
  },
  methods: {
    // 页面控制
    visiblePage (flag) {
      console.log('====')
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
          //这里增加声音
          if (this.$refs.audioRefs) {
            this.$refs.audioRefs.play()
          }
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
    // 获取所有客户
    async getAllClient () {
      const res = await this.$_http.get(this.$_API.INTERFACE_RP_GET_GETALLCLIENT, {});
      if (res.data) {
        this.clientList = res.data || [];
      }
    },
    // 格式化来源
    formateClient (clientId) {
      let index = this.clientList.findIndex(item => {
        return item.clientID === clientId;
      });
      if (index > -1) {
        return this.clientList[index].clientName || '';
      }
      return ''
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
          if (res.data) {
            let flag = this.chatList.find(chatItem => {
              return chatItem.orderID === item.orderID
            })
            if (!flag) {
              this.chatList.push(item)
            }
            this.dialogVisible = true
            this.currentChat = item
            this.orderId = item.orderID
            this.orderStatus = item.orderStatus || 0
            this.showMsg = false
            this.rpID = item.rpID
            if (item.inquiryType === 0) {
              this.chatList = []
            }
          }
        } catch (error) {
          this.checkSubmit = false;
          this.handleRefresh()
        }
      }, 500)

    },
    // 继续处理
    async handleContinue (item) {
      let res = {};
      let flag = this.chatList.find(chatItem => {
        return chatItem.orderID === item.orderID
      })
      if (!flag) {
        this.chatList.push(item)
      }
      this.orderId = item.orderID
      res = await this.$_http.get(this.$_API.INTERFACE_RP_GET_GETDETAIL, {
        params: {
          orderID: this.orderId
        }
      });
      if (item.orderStatus === 4 && res.data.orderStatus != 4) {
        this.$message({
          message: '订单状态已更新，请刷新后重试',
          type: 'warning'
        });
        return;
      }
      this.dialogVisible = true
      this.currentChat = item
      this.orderStatus = item.orderStatus || 0
      this.showMsg = false
      this.rpID = item.rpID
      if (item.inquiryType === 0) {
        this.chatList = []
      }
      //this.$router.push({ name: "patirentDetails", params: { orderId: item.orderID } });
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
          let tmpList = res.data.orderPool || [];
          let topList = res.data.disposal || []
          this.shuffle(tmpList)
          topList.map(item => {
            item.isTop = true
          })
          let newList = []
          if (topList.length >= 10) {
            newList = topList
          } else {
            let len = 10 - topList.length
            let newTmpList = tmpList.slice(0, len)
            newList = topList.concat(newTmpList)
          }
          newList.map((item, index) => {
            this.$set(newList[index], "time", '');
          });
          this.orderList = JSON.parse(JSON.stringify(newList));
          this.timeCal();
          let countList = this.orderList.filter(item => {
            return item.orderStatus === 0
          })
          if (countList.length > 0) {
            this.show()
          } else {
            this.clears()
          }
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    shuffle (arr) {
      for (var i = 0; i < arr.length; i++) {
        var iRand = parseInt(arr.length * Math.random());
        var temp = arr[i];
        arr[i] = arr[iRand];
        arr[iRand] = temp;
      }
      return arr
    },
    // 开始接诊
    handleStart () {
      this.getUseSig()
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
          sessionStorage.removeItem('online')
        }
      }
    },
    // 获取
    getUseSig () {
      this.startLoading = true
      let params = {
        userId: this.userInfo.keyID
      };
      let requests = this.$_http.get(this.$_API.API_RP_INITIAL_GETUSERSIG, {
        params
      });
      requests.then(res => {
        if (!res.data) return;
        this.userSig = res.data.userSig;
        this.login()
      });
    },
    // im登陆 //im
    async login () {
      this.cus_tim = SingleChat.getInstance(this.userInfo.keyID, this.userSig);
      this.receptionStatus = true;
      this.startLoading = false
      let params = {
        doctorID: this.userInfo.doctorID,
        doctorName: this.userInfo.staffName,
        staffID: this.userInfo.keyID,
        hospitalID: this.userInfo.orgID,
      };
      const res = await this.$_http.post(this.$_API.INTERFACE_RP_POST_CREATERECORD, params);
      console.log(res)
      if (res.data) {
        sessionStorage.setItem('online', res.data)
      }
      this.handleRefresh()
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
    }
  }
};
</script>

<style >
.notification-imgs {
  background-image: url("./../../assets/image/notice.png");
  width: 23px;
  background-size: cover;
  height: 30px;
}
.el-notification.left {
  left: 210px;
}
</style>
<style lang="scss" scoped>
.order-pool_header {
  padding-top: 34px;
  margin-left: 24px;
  margin-right: 24px;
  padding-bottom: 34px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e8e8e8;
  .staff-name {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    margin-left: 8px;
  }
  .left-container {
    display: flex;
    align-items: center;
  }
  .right-container {
    display: flex;
    align-items: center;
  }
}
.order-title {
  padding-top: 26px;
  padding-bottom: 26px;
}
.join-fixed {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 77px;
  right: 45px;
  text-align: center;
  padding-top: 5px;
  cursor: pointer;
  img {
    width: 46px;
    height: 46px;
  }
  p {
    font-size: 12px;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    position: absolute;
    margin-top: -10px;
    margin-left: 11px;
  }
}
.reset-container {
  text-align: center;
  margin-top: 112px;
  padding-bottom: 88px;
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
    margin-top: 49px;
  }
  .p2 {
    margin-top: 16px;
    font-size: 14px;
    margin-bottom: 30px;
    color: #5a595c;
  }
}
.order-pool {
  .pending {
    border: 1px solid #438bef;
    border-radius: 6px;
    width: 6px;
    height: 6px;
    background: #438bef;
    display: inline-block;
    margin-left: 38px;
  }
  .pending-text {
    margin-left: 4px;
    display: inline-block;
    color: #438bef;
    font-size: 14px;
  }
  .stop {
    border: 1px solid #fe5853;
    border-radius: 6px;
    width: 6px;
    height: 6px;
    background: #fe5853;
    display: inline-block;
    //margin-bottom: 2px;
    margin-left: 38px;
  }
  .stop-text {
    margin-left: 4px;
    font-size: 14px;
    display: inline-block;
    color: #fe5853;
  }
}

.time {
  color: #fe5853;
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
  width: 66px;
  height: 26px;
  padding: 0;
  line-height: 26px;
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
  border: 1px solid rgba(67, 139, 239, 1);
  color: #438bef;
  border: 1px solid rgba(67, 139, 239, 1);
}
</style>
