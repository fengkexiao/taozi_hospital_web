<template>
  <div class="app-container base-page" id="orderBody">
    <base-title name="医生预定诊室"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">预约时间：</span>
        <el-date-picker v-model="yearMonth" type="month" placeholder="选择月份-必选" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <span class="item-label">下单时间：</span>
        <el-date-picker v-model="orderTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <span class="item-label">诊室：</span>
        <el-input v-model="query.roomName" placeholder="请输入" label-name="诊室" clearable ></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">医生电话：</span>
        <el-input v-model="query.doctorPhone" form-type="phone" placeholder="请输入" label-name="医生电话" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">预订状态：</span>
        <el-select v-model="query.orderStatus" placeholder="请选择" clearable filterable>
          <el-option v-for="item in orderStateOptions" :key="item.orderStatus" :label="item.orderStatusName" :value="item.orderStatus"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getBookingOrderDataFun">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfoFun">重置</el-button>
      </div>
    </div>
    <el-table :data="doctorHoldOrdersData" :loading="tableLoading" stripe>
      <el-table-column prop="roomName" label="诊室" align="center"></el-table-column>
      <el-table-column label="预订医生" @click="toDoctorDetailFun(row)" align="center">
        <template #default="{row}">
          <a class="doctorNameClass" @click="toDoctorDetailFun(row)">{{row.doctorName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="doctorPhone" label="医生联系电话" align="center"></el-table-column>
      <el-table-column prop="dayNum" label="预订时段数" align="center"></el-table-column>
      <el-table-column prop="orderTime" label="下单时间" align="center">
        <template #default="{row}">
          {{ row.orderTime | formatDateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="orderStatusName" label="预订状态" align="center"></el-table-column>
      <el-table-column prop="comfirmTime" label="确认时间" align="center">
        <template #default="{row}">
          {{ row.comfirmTime | formatDateTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="toBookingDetailsFun(row)">详情</span>
            <div class="line" v-if="row.orderStatus===0"></div>
            <span class="opt-text" v-if="row.orderStatus===0" @click="bookingDetailsAgreeFun(row)">同意</span>
            <div class="line" v-if="row.orderStatus===0"></div>
            <span class="text-danger opt-text" v-if="row.orderStatus===0" @click="bookingDetailsRefuseFun(row)">拒绝</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getBookingOrderDataFun" @current-change="getBookingOrderDataFun" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import InputWithTip from "@/components/InputWithTip";
import { formatDateTime } from "../../filters";
export default {
  name: "room-order",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InputWithTip
  },
  data () {
    return {
      // 查询条件集合
      query: { orderStatus: "" },
      // 下单开始、结束时间【选择的、转换后的】
      yearMonth: "",
      orderTime: [],
      orderTimeConversion: [],
      // 预订状态集合
      orderStateOptions: [
        { orderStatus: "", orderStatusName: "全部" },
        { orderStatus: 0, orderStatusName: "待确认" },
        { orderStatus: 1, orderStatusName: "已同意" },
        { orderStatus: 2, orderStatusName: "已拒绝" },
        { orderStatus: 3, orderStatusName: "已撤销" }
      ],
      // 预订状态选值
      orderStatusID: "",
      // 电话号码正则及提示
      formRules: {
        doctorPhone: [
          {
            trigger: "blur",
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码（11位）"
          }
        ]
      },
      // 页码：参数集合
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      },
      tableLoading: false,
      // 预订诊室列表数据[转换前、后]
      doctorHoldOrdersDataOld: [],
      doctorHoldOrdersData: [],
      searchState: false,
      docPracticeData: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.setPickerTimes();
  },
  activated () {
    if (this.searchState) {
      this.getBookingOrderDataFun();
    }
  },
  methods: {
    setPickerTimes () {
      this.yearMonth = new Date();
    },
    // 操作：重置输入框信息
    resetSearchInfoFun () {
      //this.$refs.formOrder.resetFields();
      this.query = { orderStatus: "" };
      this.yearMonth = new Date();
      this.orderTime = [];
    },
    // 操作：查询医生预订订单列表，
    // 查询：用户所在医院ID、预约时间（年月）、下单时间(开始，结束)、诊室名、医生电话、预订状态ID、页码信息
    // hospitalID、yearMonth、（orderStartTime，orderEndTime）、roomName、doctorPhone、orderStatus、pageInfo
    getBookingOrderDataFun () {
      if (this.tableLoading) {
        return;
      }
      // 预约时间选择=》日<到秒>
      if (this.yearMonth) {
        if (this.query.doctorPhone) {
          if ((/^1[3-9]\d{9}$/.test(this.query.doctorPhone))) {
            this.getBookingOrderDataHttp();
          }
        } else {
          this.getBookingOrderDataHttp();
        }
      } else {
        this.$_error("请选择预约时间！");
      }
    },
    getBookingOrderDataHttp () {
      this.doctorHoldOrdersDataOld = [];
      this.doctorHoldOrdersData = [];
      this.query.yearMonth = formatDateTime(this.yearMonth);
      if (this.orderTime) {
        this.orderTimeConversion = [];
        this.orderTime.forEach((item) => {
          item = formatDateTime(item);
          this.orderTimeConversion.push(item);
        });
        this.query.orderStartTime = this.orderTimeConversion[0];
        this.query.orderEndTime = this.orderTimeConversion[1];
      }
      let searchInfo = {
        hospitalID: this.userInfo.orgID
      };
      let params = { ...this.pageInfo, ...searchInfo, ...this.query };
      this.tableLoading = true;
      this.$_http.get(this.$_API.INTERFACE_SHARE_ROOM_ORDER_LIST, { params }).then(res => {
        if (!res.data) return;
        this.doctorHoldOrdersDataOld = res.data.datas;
        this.pageInfo = res.data.pageInfo;
        this.searchState = true;
        this.changeBookingOrderFun();
      }).finally(it => {
        this.tableLoading = false;
      });
    },
    // 操作：跳转=》医生详情
    toDoctorDetailFun (row) {
      if (!row || !row.doctorID) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "user-doctor-edit",
        params: { keyID: row.doctorID, mode: "V", backUrl: "/shareroom/doctorHold" }
      });
    },
    // 操作：跳转=》预订详情
    toBookingDetailsFun (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "room-order-detail",
        params: { roomOrderID: row.keyID, yearMonth: this.query.yearMonth }
      });
    },
    // 操作：同意预订
    bookingDetailsAgreeFun (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.$confirm("同意医生预订诊室?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let roomOrderID = row.keyID;
        this.$_http.post(this.$_API.INTERFACE_SHARE_ROOM_ORDER_ACCEPT, roomOrderID).then(res => {
          this.$message({
            type: "success",
            message: "已同意"
          });
          this.getBookingOrderDataFun();
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消同意"
        });
      });
      // 判断是否已在本院多点执业
      // if (row.relStatusID !== 4) {
      //   this.$confirm("医生到院坐诊，需完成多点执业认证，线下完成多点执业认证后，在本平台“用户管理-多点执业管理”中登记后才能完成预订。", "温馨提示", {
      //     confirmButtonText: "去登记",
      //     type: "warning",
      //   }).then(() => {
      //     this.$router.push({
      //       name: "user-practice-doctor",
      //       params: {}
      //     });
      //   });
      // } else {
      //   this.$confirm("同意医生预订诊室?", "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning",
      //   }).then(() => {
      //     let roomOrderID = row.keyID;
      //     this.$_http.post(this.$_API.INTERFACE_SHARE_ROOM_ORDER_ACCEPT, roomOrderID).then(res => {
      //       this.$message({
      //         type: "success",
      //         message: "已同意"
      //       });
      //       this.getBookingOrderDataFun();
      //     });
      //   }).catch(() => {
      //     this.$message({
      //       type: "info",
      //       message: "已取消同意"
      //     });
      //   });
      // }
    },
    // 操作：拒绝预订
    bookingDetailsRefuseFun (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.$confirm("拒绝医生预订诊室?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let roomOrderID = row.keyID;
        this.$_http.post(this.$_API.INTERFACE_SHARE_ROOM_ORDER_REJECT, roomOrderID).then(res => {
          this.$message({
            type: "success",
            message: "已拒绝"
          });
          this.getBookingOrderDataFun();
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消拒绝"
        });
      });
    },
    // 转换：根据状态ID，给予对应的状态名字
    changeBookingOrderFun () {
      this.doctorHoldOrdersDataOld.forEach((item) => {
        this.orderStateOptions.forEach((items) => {
          if (item.orderStatus !== "" && item.orderStatus === items.orderStatus) {
            item.orderStatusName = items.orderStatusName;
          }
        });
      });
      // this.getDocPracticeFun();
      this.doctorHoldOrdersData = this.doctorHoldOrdersDataOld;
    },
    // 根据医生ID查询是否已到本院多点执业
    // getDocPracticeFun() {
    //   if (this.doctorHoldOrdersDataOld.length > 0) {
    //     let hospitalIDArr = [];
    //     for (let i = 0; i < this.doctorHoldOrdersDataOld.length; i++) {
    //       let obj = {};
    //       if (hospitalIDArr.length === 0) {
    //         obj.orgID = this.userInfo.orgID;
    //         obj.doctorsID = this.doctorHoldOrdersDataOld[0].doctorID;
    //         hospitalIDArr.push(obj);
    //       } else {
    //         let isEqual = false;
    //         for (let j = 0; j < hospitalIDArr.length; j++) {
    //           if (this.doctorHoldOrdersDataOld[i].doctorID === hospitalIDArr[j]) {
    //             isEqual = true;
    //           }
    //         }
    //         if (isEqual === false) {
    //           obj.orgID = this.userInfo.orgID;
    //           obj.doctorsID = this.doctorHoldOrdersDataOld[i].doctorID;
    //           hospitalIDArr.push(obj);
    //         }
    //       }
    //     }
    //     this.$_http.post(this.$_API.INTERFACE_SHARE_ROOM_ORDER_LIST_PRACTICE, hospitalIDArr).then(res => {
    //       if (!res.data) return;
    //       this.docPracticeData = res.data;
    //       this.addOrdersDocPraFun();
    //     });
    //   }
    // },
    // // 操作：增加是否多点执业到显示数据中
    // addOrdersDocPraFun() {
    //   this.doctorHoldOrdersDataOld.forEach((item) => {
    //     this.docPracticeData.forEach((items) => {
    //       if (item.doctorID === items.doctorID) {
    //         item.isPractice = items.practiceCode;
    //       }
    //     });
    //   });
    //   this.doctorHoldOrdersData = this.doctorHoldOrdersDataOld;
    // },
    // 提醒：表格数据错误时的处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.getBookingOrderDataFun();
    }
  }
};
</script>

<style scoped>
#orderBody .doctorNameClass {
  color: blue;
  text-decoration: underline;
}
</style>
