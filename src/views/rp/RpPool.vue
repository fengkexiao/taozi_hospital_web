<template>
  <div class="app-container order-pool">

    <div class="order-pool_header">
      <div class="left-container">
        <base-image :src="avatar" class="user-avatar" />
        <span class="staff-name">{{userInfo.staffName}}</span>
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
    <el-table :data="tableData" :loading="tableLoading" v-if="receptionStatus || tableData.length>0" stripe>
      <el-table-column prop="keyID" label="处方ID" align="center"></el-table-column>
      <el-table-column prop="rpTypeName" label="处方类别" align="center"></el-table-column>
      <!-- <el-table-column prop="rpSource" label="处方来源" align="center" :formatter="formatSource"></el-table-column> -->
      <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="providerType" label="供应商" align="center" :formatter="formatProviderType"></el-table-column>
      <el-table-column prop="providerID" label="供应商名称" align="center" min-width="100"></el-table-column>
      <el-table-column prop="recipeAllPrice" label="处方总价(元)" align="center" min-width="100">
        <template #default="{row}">
          {{ row.recipeAllPrice | formatMoney }}
        </template>
      </el-table-column>
      <el-table-column prop="doctorName" label="医生名称" align="center" width="100"></el-table-column>
      <el-table-column prop="doctorTime" label="医生开方时间" align="center" width="155px"></el-table-column>
      <el-table-column prop="pharmacistName" label="药师名称" align="center"></el-table-column>
      <el-table-column prop="pharmacistTime" label="药师审核时间" align="center" width="155px">
        <template #default="{row}">
          {{ row.pharmacistTime | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="rpStatus" label="处方状态" align="center" :formatter="formatState"></el-table-column>
      <el-table-column prop="notPassReason" label="不通过原因" align="center" min-width="100"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="{row}">
          <div v-if="row.rpStatus === 4" style="display: inline-block;">
            <el-button type="primary" size="mini" @click="trialParty(row, '2')">
              审方
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div v-else class="reset-container">
      <div v-if="showBtn">
        <img src="./../../assets/image/reset.png" />
        <p class="p1">当前状态：休息中～</p>
        <p class="p2">点击下方“开始审方”按钮开始审方服务</p>
        <el-button type="primary" v-show="!receptionStatus" @click="handleStart" :loading="startLoading">开始审方</el-button>
      </div>
    </div>
    <patientDetails :dialogVisible.sync="dialogVisible" :orderId.sync="orderId" :userSig="userSig" :rpID="rpID" :chatList="chatList" :currentChat.sync="currentChat" :orderStatus="orderStatus"></patientDetails>
    <div :class="[showMsg ? 'headerBox' : '', 'join-fixed']" v-if="chatList.length > 0" @click="(dialogVisible = true), (showMsg = false)">
      <img src="./../../assets/image/join-group.png" />
      <p>进入审方</p>
    </div>
  </div>
</template>

<script>
import PatientDetails from "./RpPatientDetails";
import { mapGetters } from "vuex";
import avatar from "@/assets/image/default-avatar.png";
import moment from "moment";
import "@/assets/sdk/webim/webim.js";
import "@/assets/sdk/webim/json2.js";
/* eslint-disable */
import MessageBox from 'element-ui/packages/message-box';
import { SDK_APP_ID } from '@/common/Constant';
import SingleChat from './../components/class/SingleChat.js';
export default {
  name: 'orderPool',
  components: {
    PatientDetails
  },
  data () {
    return {
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
      clientArrayList: [],
      userSig: '',
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
      tableData: [],
      startTime: 0
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  async created () {
    this.getUseSig();
    this.getClient();
    this.getDoctroStatus();
    window.addEventListener('timOnReceiveMessage', this.timOnReceiveMessage);
  },
  destroyed () {
    clearTimeout(this.timer);
    // this.$message({
    //           message: '切换页面将退出登录',
    //           type: 'warning'
    //         });
    // this.handleStop();
    window.removeEventListener('timOnReceiveMessage', this.timOnReceiveMessage);
  },
  watch: {
    $route (val) {

    },
    dialogVisible (val) {
      if (!val) {
        this.handleRefresh();
      }
    }
  },
  methods: {
    // 获取药师组
    async getClient () {
      const res = await this.$_http.get(this.$_API.INTERFACE_RP_GET_GETCLIENTLIST, {
        params: {
          doctorID: this.userInfo.doctorInfo.doctorID,
          doctorTypeID: this.userInfo.doctorInfo.staffTypeID
        }
      });
      if (res.data) {
        this.clientArrayList = res.data || [];
        this.handleRefresh();
      }
    },
    // 通知
    timOnReceiveMessage ({ detail }) {
      let flag = false;
      for (let i = 0; i < detail.length; i++) {
        let msg = detail[i]
        console.log(msg.payload.extension)
        if (msg.payload.extension === 'rpInfo') {
          this.$notify({
            title: '通知',
            iconClass: 'notification-imgs',
            message: '有新的处方啦～',
            duration: 3000,
            position: 'bottom-right'
          });
          flag = true;
          this.handleRefresh();
        }
        if (msg.payload.extension === 'rpTimeoutOffline') {
          this.getDoctroStatus()
          setTimeout(() => {
            this.handleRefresh();
          }, 2000);
          this.$alert('由于您长时间未操作,已自动下线~', '提示', {
            confirmButtonText: '确定'
          });
        }
        if (msg.payload.extension === 'rpTimeout') {
          setTimeout(() => {
            this.handleRefresh();
          }, 2000);
        }
      }
      if (!flag) {
        this.showMsg = true;
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
      return '';
    },
    // 动态时间计算
    timeCal (time) {
      setInterval(() => {
        this.orderList.map((item, index) => {
          var a = moment(new Date(item.addTime).getTime());
          var b = moment(new Date().getTime());
          var x = b.diff(a, 'seconds');
          var d = moment.duration(x, 'minutes');
          item.time = this.formatSeconds(x);
          this.$set(item, index, item);
        });
      }, 1000);
    },
    formatSeconds (value) {
      let result = parseInt(value);
      let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
      let m = Math.floor((result / 60) % 60) < 10 ? '0' + Math.floor((result / 60) % 60) : Math.floor((result / 60) % 60);
      let s = Math.floor(result % 60) < 10 ? '0' + Math.floor(result % 60) : Math.floor(result % 60);
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
    // 接单
    async handleReceipt (item) {
      let res = {};
      try {
        res = await this.$_http.get(this.$_API.INTERFACE_RP__GET_GRABORDER, {
          params: {
            orderID: item.orderID,
            staffID: this.userInfo.keyID,
            orgID: this.userInfo.orgID,
            doctorID: this.userInfo.doctorID,
            doctorName: this.userInfo.staffName
          }
        });
        if (res.data) {
          let flag = this.chatList.find(chatItem => {
            return chatItem.orderID === item.orderID;
          });
          if (!flag) {
            this.chatList.push(item);
          }
          this.dialogVisible = true;
          this.currentChat = item;
          this.orderId = item.orderID;
          this.orderStatus = item.orderStatus || 0;
          this.showMsg = false;
          this.rpID = item.rpID;
          if (item.inquiryType === 0) {
            this.chatList = [];
          }
        }
      } catch (error) {
        this.handleRefresh();
      }
    },
    // 继续处理
    async handleContinue (item) {
      let flag = this.chatList.find(chatItem => {
        return chatItem.orderID === item.orderID;
      });
      if (!flag) {
        this.chatList.push(item);
      }
      this.orderId = item.orderID;
      this.dialogVisible = true;
      this.currentChat = item;
      this.orderStatus = item.orderStatus || 0;
      this.showMsg = false;
      this.rpID = item.rpID;
      if (item.inquiryType === 0) {
        this.chatList = [];
      }
      //this.$router.push({ name: "patientDetails", params: { orderId: item.orderID } });
    },
    // 刷新
    handleRefresh () {
      let params = {
        pharmacistStaffID: this.userInfo.keyID
      };
      this.$_http.get(this.$_API.INTERFACE_RP_GET_PENDINGREVIEWRP, { params }).then(res => {
        if (!res) return false;
        this.tableData = res.data || [];
        this.$forceUpdate()
        if (this.tableData.length > 0) {
          this.show()
        } else {
          this.clears()
        }
      })
    },
    shuffle (arr) {
      for (var i = 0; i < arr.length; i++) {
        var iRand = parseInt(arr.length * Math.random());
        var temp = arr[i];
        arr[i] = arr[iRand];
        arr[iRand] = temp;
      }
      return arr;
    },
    // 获取医生在线状态
    async getDoctroStatus () {
      const res = await this.$_http.post(this.$_API.INTERFACE_RP_POST_DOCTORSTATUS, {
        staffID: this.userInfo.keyID
      });
      if (res.data) {
        if (res.data.offlineType === 0 || res.data.offlineType === 3) {
          this.receptionStatus = true;
          sessionStorage.setItem('rpOnline', res.data.keyID);
          this.handleRefresh();
        }
      } else {
        this.receptionStatus = false;
        this.orderList = [];
        this.clears()
        sessionStorage.removeItem('rpOnline');
      }
      this.showBtn = true;
    },
    // 开始接诊
    async handleStart () {
      this.startLoading = true;
      setTimeout(async () => {
        this.receptionStatus = true;
        let tmpClientList = []
        this.clientArrayList.map(item => {
          tmpClientList.push(item.clientID)
        })
        let params = {
          doctorID: this.userInfo.doctorID,
          doctorName: this.userInfo.staffName,
          staffID: this.userInfo.keyID,
          hospitalID: this.userInfo.orgID,
          doctorTypeID: 3,
          clients: tmpClientList
        };
        const res = await this.$_http.post(this.$_API.INTERFACE_RP_POST_CREATERECORD, params);
        if (res.data) {
          this.startLoading = false;
          sessionStorage.setItem('rpOnline', res.data);
        }
        this.handleRefresh();
      }, this.startTime);
    },
    // 暂停接诊   // im
    async handleStop () {
      setTimeout(async () => {
        if (sessionStorage.getItem('rpOnline')) {
          let params = {
            keyID: sessionStorage.getItem('rpOnline'),
            doctorTypeID: 3,
            staffID: this.userInfo.keyID
          };
          const res = await this.$_http.post(this.$_API.INTERFACE_RP_POST_UPDATERECORD, params);
          if (res.data) {
            this.receptionStatus = false;
            this.orderList = [];
            this.clears()
            sessionStorage.removeItem('rpOnline');
          }
          this.startTime = 1000
        }
      }, this.startTime);
    },
    // 获取
    getUseSig () {
      let params = {
        userId: this.userInfo.keyID
      };
      let requests = this.$_http.get(this.$_API.API_RP_INITIAL_GETUSERSIG, {
        params
      });
      requests.then(res => {
        if (!res.data) return;
        this.userSig = res.data.userSig;
        this.login();
      });
    },
    // im登陆
    async login () {
      this.cus_tim = SingleChat.getInstance(this.userInfo.keyID, this.userSig);
    },
    show () {
      var title = this.title.replace('', '').replace('有新的处方单需审核', '');
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.time++;
        this.show();

        if (this.time % 2 == 0 && this.tableData.length > 0) {
          document.title = '有新的处方单需审核';
        } else {
          document.title = '\u200E';
        }
      }, 200);
      return [this.timer, this.title];
    },
    clears () {
      clearTimeout(this.timer);
      document.title = '桃子互联网医院-医院端';
    },
    formatSource (row) {
      const arry = ["用户选购", "问诊开方", "线下开方"];
      return arry[row.rpSource];
    },
    formatState (row) {
      const arry = ["开方中", "未审", "通过", "不通过", "处理中"];
      return arry[row.rpStatus];
    },
    formatProviderType (row) {
      const arry = {
        0: "平台",
        1: "医院",
        9: "三方"
      };
      return arry[row.providerType];
    },
    // 药师点击审方
    trialParty (row, key) {
      let logParams = {
        orderStatus: 5,
        rp: row
      };
      this.$_http
        .post(this.$_API.INTERFACE_RP_POST_LOGORDEROP,
          logParams
        ).then(() => { })
      let params = {
        inquiryId: row.keyID
      };
      this.$_http
        .get(this.$_API.API_RP_PRESCRIPTION_GETRPDETAIL, {
          params
        })
        .then(res => {
          if (!res.data) return;
          if (res.data.pharmacistStaffID === this.userInfo.keyID) {
            this.$router.push({
              name: "rpTemplateYS",
              // 跳转详情界面  传入订单 ID
              params: {
                inquiryId: row.keyID,
                state: key
              }
            });
          } else {
            this.$message({
              message: '处方超时未处理，已被重新派单',
              type: 'warning'
            });
            this.handleRefresh()
            return false
          }
        });
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
    margin-left: 38px;
  }
  .stop-text {
    margin-left: 4px;
    display: inline-block;
    color: #fe5853;
    font-size: 14px;
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
