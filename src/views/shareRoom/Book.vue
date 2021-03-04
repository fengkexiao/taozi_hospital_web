<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>

    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">诊室名称：</span>
        <el-input v-model="query.roomName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">医生电话：</span>
        <el-input v-model="query.doctorPhone" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">患者电话：</span>
        <el-input v-model="query.personPhone" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">订单状态：</span>
        <el-select v-model="orderID" placeholder="请选择" value="" clearable filterable>
          <el-option v-for="(item,index) in orderStateOptions" :key="index" :label="item.orderName" :value="item.orderID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">预约时段：</span>
        <el-date-picker v-model="startTime" type="date" placeholder="选择日期-必选"></el-date-picker>
        <span id="openPeriodSelect">
          <el-select v-model="query.openPeriod" placeholder="请选择" value="">
            <el-option v-for="(item,index) in openPeriodStateOptions" :key="index" :label="item.openPeriodName" :value="item.openPeriod"></el-option>
          </el-select>
        </span>
      </div>
      <div class="form-item">
        <span class="item-label">服务时间：</span>
        <el-date-picker v-model="yearMonth" type="month" placeholder="选择月份-必选"></el-date-picker>
      </div>
      <div class="form-item">
        <span class="item-label">下单时间：</span>
        <el-date-picker v-model="orderTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getPatientBookingOrderDataFun">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfoFun">重置</el-button>
      </div>
    </div>
    <base-title name="患者列表"></base-title>
    <el-table :data="patientBookingOrderData" :loading="tableLoading" class="mt24" stripe>
      <el-table-column prop="roomName" label="诊室名称" align="center"></el-table-column>
      <el-table-column prop="doctorName" label="医生姓名" width="80" align="center"></el-table-column>
      <el-table-column prop="doctorPhone" label="医生电话" width="115" align="center"></el-table-column>
      <el-table-column label="预约时段" width="130" align="center">
        <template #default="{row}">
          {{row.bookDate}} {{row.openPeriodName}}
        </template>
      </el-table-column>
      <el-table-column prop="personName" label="患者姓名" width="80" align="center"></el-table-column>
      <el-table-column prop="personPhone" label="患者电话" width="115" align="center"></el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="155px" align="center">
        <template #default="{row}">
          {{ row.createTime | formatDateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="treatFeeTotal" label="治疗金额" align="center">
        <template #default="{row}">
          {{ row.treatFeeTotal}}
        </template>
      </el-table-column>
      <el-table-column prop="costFeeTotal" label="结算金额" align="center">
        <template #default="{row}">
          {{ row.costFeeTotal}}
        </template>
      </el-table-column>
      <el-table-column prop="costCreateTime" label="结算时间" width="155px" align="center">
        <template #default="{row}">
          {{ row.costCreateTime | formatDateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="orderStatusName" label="订单状态" align="center">
        <template #default="{row}">
          <span v-if="row.costStatusID === 0 || row.costStatusID">{{row.costStatusName}}</span>
          <span v-else-if="row.bookStatusID === 0 || row.bookStatusID">{{row.bookStatusName}}</span>
          <span v-else-if="row.orderStatusID === 0 || row.orderStatusID">{{row.orderStatusName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="355" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="toPatientBookingDetailsFun(row)">详情</span>
            <div class="line"></div>
            <template v-if="!row.costStatusID && row.costStatusID !== 0">
              <span class="opt-text" v-if="row.bookStatusID === 1" @click="patientBookingDetailsSignFun(row)">标记未到院</span>
              <div class="line" v-if="row.bookStatusID === 1"></div>
              <span class="opt-text" v-if="row.bookStatusID === 2" @click="patientBookingDetailsSignFun(row)">撤销未到院标记</span>
              <div class="line" v-if="row.bookStatusID === 2"></div>
            </template>
            <span class="opt-text" v-if="row.bookStatusID === 1 && !row.costStatusID && row.costStatusID !== 0" @click="patientBookingSettleAccountsFun(row,1)">出院结算</span>
            <span class="opt-text" v-if="row.costStatusID === 1 || row.costStatusID === 3" @click="patientBookingSettleAccountsFun(row,3)">重新结算</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getPatientBookingOrderDataFun" @current-change="getPatientBookingOrderDataFun" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import InputWithTip from "@/components/InputWithTip";
import { formatDateTime } from "../../filters";
export default {
  name: "room-book",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InputWithTip
  },
  inject: ["reload"],
  data () {
    return {
      query: { openPeriod: 0 },
      // 下单时间
      orderTime: [],
      orderTimeConversion: [],
      yearMonth: "",
      startTime: "",
      openPeriodStateOptions: [
        { openPeriod: 0, openPeriodName: "上午" },
        { openPeriod: 1, openPeriodName: "下午" },
        { openPeriod: 2, openPeriodName: "晚上" }
      ],
      // 订单状态下垃集合
      orderStateOptions: [
        { orderID: "", orderName: "全部", orderStatusID: "" },
        { orderID: 1, orderName: "待支付", orderStatusID: 0 },
        { orderID: 3, orderName: "支付失败", orderStatusID: 11 },
        { orderID: 4, orderName: "申请退款", orderStatusID: 20 },
        { orderID: 5, orderName: "退款成功", orderStatusID: 21 },
        { orderID: 6, orderName: "退款失败", orderStatusID: 22 },
        { orderID: 11, orderName: "待入院", bookStatusID: 0 },
        { orderID: 12, orderName: "已入院", bookStatusID: 1 },
        { orderID: 13, orderName: "未到院", bookStatusID: 2 },
        { orderID: 21, orderName: "待审核", costStatusID: 0 },
        { orderID: 22, orderName: "审核不通过", costStatusID: 1 },
        { orderID: 23, orderName: "待付款", costStatusID: 2 },
        { orderID: 24, orderName: "付款驳回", costStatusID: 3 },
        { orderID: 25, orderName: "付款完成", costStatusID: 4 }
      ],
      orderID: "",
      // 电话号码正则及提示
      formRules: {
        doctorPhone: [
          {
            trigger: "blur",
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码（11位）"
          }
        ],
        personPhone: [
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
      patientBookingOrderDataOld: [],
      patientBookingOrderData: [],
      searchState: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.initInfo();
  },
  activated () {
    if (this.searchState) {
      this.getPatientBookingOrderDataFun();
    }
  },
  methods: {
    // 日期默认选择当前
    initInfo () {
      this.startTime = new Date();
      this.yearMonth = new Date();
    },
    // 操作：重置输入框信息
    resetSearchInfoFun () {
      //this.$refs.formOrder.resetFields();
      this.query = { openPeriod: 0 };
      this.orderID = "";
      this.startTime = new Date();
      this.yearMonth = new Date();
      this.orderTime = [];
      this.pageInfo.pageSize = 10;
      this.pageInfo.pageIndex = 1;
    },
    // 查询：患者预约到院订单列表，条件：所在医院ID、诊室名 、医生电话、患者电话、订单状态ID、预约时段、服务时间（上午、下午、晚上）、下单时间（开始，结束）、页码信息
    // hospitalID、roomName、doctorPhone、personPhone、[orderStatusID,bookStatusID,costStatusID]、startTime（openPeriod）、yearMonth、（orderStartTime，orderEndTime）、pageInfo
    getPatientBookingOrderDataFun () {
      if (this.tableLoading) {
        return;
      }
      if (this.yearMonth !== "" && this.startTime !== "") {
        if (this.query.doctorPhone && this.query.personPhone) {
          if ((/^1[3-9]\d{9}$/.test(this.query.doctorPhone)) && (/^1[3-9]\d{9}$/.test(this.query.personPhone))) {
            this.getPatientBookingOrderDataHTTP();
          }
        } else if (this.query.doctorPhone || this.query.personPhone) {
          if ((/^1[3-9]\d{9}$/.test(this.query.doctorPhone)) || (/^1[3-9]\d{9}$/.test(this.query.personPhone))) {
            this.getPatientBookingOrderDataHTTP();
          }
        } else {
          this.getPatientBookingOrderDataHTTP();
        }
      } else {
        this.$_error("请选择预约时段及服务时间！");
      }
    },
    getPatientBookingOrderDataHTTP () {
      this.patientBookingOrderDataOld = [];
      this.patientBookingOrderData = [];
      // 预约时间选择=》日及时段（上午、下午、晚上）
      this.query.startTime = formatDateTime(this.startTime);
      // 服务时间：月份
      this.query.yearMonth = formatDateTime(this.yearMonth);
      // 去除空键值
      for (const key in this.query) {
        if (this.query[key] === "") {
          delete this.query[key];
        }
      }
      // 下单时间（开始、结束）
      let orderTimeData = {};
      if (this.orderTime) {
        this.orderTimeConversion = [];
        this.orderTime.forEach((item) => {
          item = formatDateTime(item);
          this.orderTimeConversion.push(item);
        });
        orderTimeData.createStartTime = this.orderTimeConversion[0];
        orderTimeData.createEndTime = this.orderTimeConversion[1];
      }
      // 把orderID的值在orderStateOptions中取出对应的状态ID，赋值给query中
      let orderDate = {};
      if (this.orderID !== "") {
        this.orderStateOptions.forEach((item) => {
          if (this.orderID === item.orderID) {
            if (this.orderID > 20) {
              orderDate = { costStatusID: item.costStatusID };
            } else if (this.orderID > 10) {
              orderDate = { bookStatusID: item.bookStatusID };
            } else if (this.orderID > 0) {
              orderDate = { orderStatusID: item.orderStatusID };
            }
          }
        });
      }
      let hospitalInfo = {
        hospitalID: this.userInfo.orgID
      };
      let params = { ...this.pageInfo, ...this.query, ...orderDate, ...orderTimeData, ...hospitalInfo };
      this.tableLoading = true;
      this.$_http.get(this.$_API.INTERFACE_SHARE_ROOM_BOOK_LIST, { params }).then(res => {
        if (!res.data) return;
        this.patientBookingOrderDataOld = res.data.datas;
        this.pageInfo = res.data.pageInfo;
        this.searchState = true;
        this.changeBookingOrderFun();
      }).finally(it => {
        this.tableLoading = false;
      });
    },
    // 操作：跳转到患者预约详情页
    toPatientBookingDetailsFun (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "room-book-detail",
        params: { keyID: row.keyID }
      });
    },
    // 操作：标记未到院、撤销未到院标记
    patientBookingDetailsSignFun (row) {
      if (!row || !row.keyID) {
        if (!row.bookStatusID && row.bookStatusID !== 0) {
          this.dataError();
          return;
        }
      }
      let params = {
        keyID: row.keyID
      };
      let title = "";
      if (row.bookStatusID === 1 || row.bookStatusID === 0) {
        params.bookStatusID = 2;
        params.bookStatusName = "未到院";
        title = "标记患者未到院？";
      } else if (row.bookStatusID === 2) {
        params.bookStatusID = 1;
        params.bookStatusName = "已入院";
        title = "标记患者已入院？";
      }
      this.$confirm(title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",

      }).then(() => {
        this.$_http.post(this.$_API.INTERFACE_SHARE_ROOM_BOOK_MARK, { ...params }).then(res => {
          this.$message({
            type: "success",
            message: "成功标记患者" + params.bookStatusName
          });
          this.getPatientBookingOrderDataFun();
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
    },
    // 操作：出院结算、重新结算，跳转到结算页面
    patientBookingSettleAccountsFun (row, time) {
      if (!row || !row.keyID || !time) {
        this.dataError();
        return;
      }
      // F: "出院结算", R: "重新结算", A: "审核", B: "付款", AD: "审核详情", BD: "付款详情"
      let mode = "";
      if (time === 1) {
        mode = "F";
      } else if (time === 3) {
        mode = "R";
      }
      this.$router.push({
        name: "room-book-cost",
        params: { keyID: row.keyID, mode }
      });
    },
    // 转换：根据状态ID，给予对应的状态名字;  治理金额、结算金额 / 100
    changeBookingOrderFun () {
      this.patientBookingOrderDataOld.forEach((item) => {
        this.openPeriodStateOptions.forEach((itemsOption) => {
          if (item.openPeriod === itemsOption.openPeriod) {
            item.openPeriodName = itemsOption.openPeriodName;
          }
        });
        if (item.treatFeeTotal) {
          item.treatFeeTotal = item.treatFeeTotal / 100;
        }
        if (item.costFeeTotal) {
          item.costFeeTotal = item.costFeeTotal / 100;
        }
      });
      this.patientBookingOrderData = this.patientBookingOrderDataOld;
    },
    // 提醒：表格数据错误时的处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.getPatientBookingOrderDataFun();
    }
  }
};
</script>

<style lang="scss">
#openPeriodSelect {
  .el-select {
    width: 80px;
  }
}
</style>
