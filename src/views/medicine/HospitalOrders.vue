<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">订单编号：</span>
        <el-input placeholder="请输入" v-model="query.orderID" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">客户：</span>
        <el-input placeholder="请输入" v-model="query.personName" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">订单状态：</span>
        <el-select v-model="query.orderStatusID" placeholder="请选择" filterable clearable>
          <el-option v-for="item in stateOptions" :key="item.orderStatusID" :label="item.orderStatusName" :value="item.orderStatusID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">下单时间：</span>
        <el-date-picker v-model="createTimes" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getTableData1stValidate">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
      </div>
    </div>

    <base-title name="订单管理列表"></base-title>
    <el-table :data="getPeachOrdersData" class="mt24" stripe :loading="tableLoading">
      <el-table-column prop="keyID" label="订单编号" align="center"></el-table-column>
      <el-table-column prop="addTime" label="下单时间" align="center" width="155px">
        <template #default="{row}">{{ row.addTime | formatDateTime }}</template>
      </el-table-column>
      <el-table-column prop="personName" label="客户" align="center"></el-table-column>
      <el-table-column prop="medicineForm" label="药品类型" align="center"></el-table-column>
      <el-table-column prop="orderPrice" label="订单金额(元)" align="center" width="110">
        <template slot-scope="scope">
          <p>{{scope.row.orderPrice | formatMoneyForSumShow}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="payTypeName" label="支付类型" align="center"></el-table-column>
      <el-table-column prop="orderStatusName" label="订单状态" align="center"></el-table-column>
      <el-table-column prop="payTime" label="支付时间" align="center" width="155px">
        <template #default="{row}">{{ row.payTime | formatDateTime }}</template>
      </el-table-column>
      <el-table-column prop="deliveryTypeName" label="发货方式" align="center"></el-table-column>
      <el-table-column prop="deliveryStatusName" label="发货状态" align="center"></el-table-column>
      <el-table-column prop="deliveryTime" label="发货时间" align="center" width="155px">
        <template #default="{row}">{{ row.deliveryTime | formatDateTime }}</template>
      </el-table-column>
      <el-table-column label="处方编号" align="center">
        <template #default="{row}">
          <p style="color: #409EFF;cursor: pointer" @click="gotoDetail(row)">{{row.rpID}}</p>
          <a :href="row.rpFileStampFileUrl" v-if="row.rpFileStampFileUrl" download="down" target="_blank">下载</a>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="toDetail(row)">详情</span>
            <!-- <div class="line"></div> -->
            <!-- 1.互联网医院 非三方药  2.货到付款 订单状态不为已取消（可直接发货）3.在线支付 已支付完成（可直接发货）-->
            <template v-if=" row.deliveryStatusID < 2 && userInfo.orgTypeID === 4">
              <span class="opt-text" v-if="row.payTypeID === 2 && row.orderStatusID != 2 || (row.payTypeID !== 2 && row.orderStatusID === 10)" @click="tosend(row)">发货</span>
            </template>
            <template v-else>
              <span class="opt-text" v-if="row.deliveryStatusID < 2 && row.rpStatus === 2 && ((row.payTypeID !== 2 && row.orderStatusID === 10) || row.payTypeID === 2)" @click="tosend(row)">发货</span>
            </template>
            <span class="opt-text" v-if="row.deliveryStatusID === 2 && row.payTypeID === 2 &&  row.orderStatusID != 2" @click="receiveGoods(row)" v-loading.fullscreen.lock="fullscreenLoading">确认收货
            </span>
            <span class="opt-text" v-if="(row.deliveryStatusID === 0 || row.deliveryStatusID === 1) && row.orderStatusID === 10" @click="refund(row)" v-loading.fullscreen.lock="fullscreenLoading">退款
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="page" @size-change="getMedicineOrderList" @current-change="getMedicineOrderList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDate } from "../../filters";
import InputWithTip from "@/components/InputWithTip";

export default {
  name: "hospitalOrders",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InputWithTip
  },
  data () {
    return {
      medicineOrderList: [],
      getPeachOrdersData: [],
      getOrdersHospitalNameData: [],
      fullscreenLoading: false,
      tableLoading: false,
      visited: false,
      query: {
        startTime: "",
        endTime: "",
        orderStatusID: ""
      },
      // 输入值查询结果的医院名称数据
      getHospitalNameData: [],
      // 查询：状态下拉集合
      stateOptions: [
        { orderStatusID: "", orderStatusName: "全部" },
        { orderStatusID: 0, orderStatusName: "待支付" },
        { orderStatusID: 2, orderStatusName: "已取消" },
        { orderStatusID: 10, orderStatusName: "支付成功" },
        { orderStatusID: 11, orderStatusName: "支付失败" },
        { orderStatusID: 20, orderStatusName: "申请退款" },
        { orderStatusID: 21, orderStatusName: "退款成功" },
        { orderStatusID: 22, orderStatusName: "退款失败" }
      ],
      serviceTypeID: "",
      createTimes: [],
      createTimesConversion: [],
      page: {
        // 分页参数
        pageIndex: 1,
        pageSize: 10
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    searchList () {
      this.page.pageIndex = 1;
      this.getMedicineOrderList();
    },
    handleSizeChange (val) {
      this.page.PageSize = val;
      this.getMedicineOrderList();
    },
    handleCurrentChange (val) {
      this.page.pageIndex = val;
      this.getMedicineOrderList();
    },
    // 查看详情的方法
    toDetail (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "medicine-order-detail",
        params: { orderID: row.keyID }
      });
    },
    // 发货的方法
    tosend (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "medicine-deliverGoods",
        params: { orderID: row.keyID, payTypeID: row.payTypeID }
      });
    },
    // 日期方法
    dataFunction () {
      let date = new Date();
      let endDate = formatDate(date);
      let separator = "-";
      let year = date.getFullYear();
      let beginDate = year + separator + "01-01";
      let dataRegion = {};
      dataRegion.beginDate = beginDate;
      dataRegion.endDate = endDate;
      return dataRegion;
    },
    getInstant1st () {
      let date = new Date();
      date.setDate(1);
      date.setHours(0);
      date.setSeconds(0);
      date.setMinutes(0);
      return date;
    },
    // 操作：重置输入框信息
    resetSearchInfo () {
      // this.$refs.formOrder.resetFields();
      this.query = {
        startTime: "",
        endTime: "",
        orderStatusID: ""
      };
      this.initializeDateRegion();
    },
    initializeDateRegion () {
      let startDate = this.getInstant1st();
      let endDate = new Date();
      this.createTimes = [startDate, endDate];
    },
    // 第一步验证表单
    getTableData1stValidate () {
      if (this.createTimes.length === 2) {
        if (
          !(
            this.createTimes[0].getFullYear() ===
            this.createTimes[1].getFullYear() &&
            this.createTimes[0].getMonth() === this.createTimes[1].getMonth()
          )
        ) {
          this.$alert("查询条件中的起始日期应在同一月份", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
        }
      }
      this.getTableData2ndFormatParameter();
    },
    // 第三步 格式化参数
    getTableData2ndFormatParameter () {
      // 下单时间（开始、结束）
      // console.log(this.query.startTime, 222);
      if (this.createTimes.length > 0) {
        this.createTimesConversion = [];
        this.createTimes.forEach(item => {
          item = formatDate(item);
          this.createTimesConversion.push(item);
        });
        this.query.startTime = this.createTimesConversion[0];
        this.query.endTime = this.createTimesConversion[1];
      } else {
        this.query.startTime = this.dataFunction().beginDate;
        this.query.endTime = this.dataFunction().endDate;
      }
      this.query.orgID = this.userInfo.orgID;
      this.getMedicineOrderList();
      // console.log(this.query.startTime, 111);
    },
    getMedicineOrderList () {
      let _this = this;
      let params = {
        ...this.page,
        ...this.query,
        orgID: this.userInfo.orgID,
        // orgID: "19101017081245568380511001",
        orderID: this.query.orderID,
        personName: this.query.personName,
        orderStatusID: this.query.orderStatusID
      };
      // console.log(params);
      this.$_http
        .get(this.$_API.INTERFACE_GET_MEDICINE_ORDER_FOR_HOSPITAL_BY_PAGE, {
          params
        })
        .then(response => {
          if (!response.data) return;
          _this.visited = true;
          _this.medicineOrderList = response.data.datas;
          _this.page = response.data.pageInfo;
          _this.getOrdersHospitalNameFun();
        });
    },
    // 查询：根据数据中处方ID批量查处方
    getOrdersHospitalNameFun () {
      if (this.medicineOrderList.length > 0) {
        let rpIDs = [];
        this.medicineOrderList.forEach(item => {
          if (item.rpID !== "") {
            rpIDs.push(item.rpID);
          }
        });
        rpIDs = [...new Set(rpIDs)];
        // console.log(rpIDs, 1212);
        this.$_http
          .post(this.$_API.INTERFACE_GET_GETRPDETAILS, { rpIDs })
          .then(res => {
            if (!res.data) return;
            this.getOrdersHospitalNameData = res.data;
            // console.log(this.getOrdersHospitalNameData, 1111);
            this.addOrdersHospitalNameFun();
          });
      } else {
        this.getPeachOrdersData = [];
      }
    },
    //
    addOrdersHospitalNameFun () {
      this.medicineOrderList.forEach(item => {
        this.getOrdersHospitalNameData.forEach(items => {
          if (item.rpID === items.keyID) {
            item.rpStatus = items.rpStatus;
            item.rpFileStampFileUrl = items.rpFileStampFileUrl;
            item.providerType = items.providerType;
          }
        });
      });
      this.getPeachOrdersData = this.medicineOrderList;
      console.log(this.getPeachOrdersData);
    },
    // 提醒：表格数据错误时的处理
    dataError () {
      this.$_warning("数据出错了，正在重新获取数据");
    },
    // 查看处方详情页
    gotoDetail (row) {
    // if(this.userInfo.orgTypeID==4){
    //   this.$router.push({
    //     name: "rpTemplateHf",
    //     // 跳转详情界面  传入订单 ID
    //     params: {
    //       inquiryId: row.rpID,
    //       state: "1",
    //       route: "hospitalOrders"
    //     }
    //   });
    // }else{
      this.$router.push({
        name: "rpTemplate",
        // 跳转详情界面  传入订单 ID
        params: {
          inquiryId: row.rpID,
          state: "1",
          route: "hospitalOrders"
        }
      });
    // }
    },
    receiveGoods (row) {
      this.$confirm("是否确定收货?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            orderID: row.keyID,
            payTypeID: row.payTypeID
          };
          this.fullscreenLoading = true;
          // console.log(params, 222);
          this.$_http
            .post(this.$_API.INTERFACE_CONFIRM_RECEIPT, params)
            .then(res => {
              this.$message({
                type: "success",
                message: "确认成功!"
              });
              setTimeout(() => {
                this.fullscreenLoading = false;
              }, 2000);
              this.getTableData1stValidate();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    refund (row) {
      var apiUrl = "";
      if (this.userInfo.orgTypeID === 4) {
        apiUrl = this.$_API.INTERFACE_POST_MEDICINE_OTHERREFUND;
      } else {
        apiUrl = this.$_API.INTERFACE_POST_MEDICINE_REFUND;
      }
      this.$confirm("你将进行退款程序, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableLoading = true;
          this.page = {
            // 分页参数
            pageIndex: 1,
            pageSize: 10
          };
          this.$_http
            .post(apiUrl, {
              keyID: row.keyID
            })
            .then(
              response => {
                this.$_success("退款成功");
                this.tableLoading = false;
                this.getMedicineOrderList();
              },
              () => {
                this.tableLoading = false;
              }
            );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退款"
          });
        });
    }
  },
  created () {
    this.initializeDateRegion();
  },
  activated () {
    this.getTableData1stValidate();
  }
};
</script>
