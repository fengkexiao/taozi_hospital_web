<template>
  <div class="app-container base-page" id="HospitalOrdersForYunInquiryBody">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">订单号：</span>
        <el-input v-model="query.keyID" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">下单日期：</span>
        <el-date-picker v-model="createTimes" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div>
      <div class="form-item">
        <span class="item-label">医生姓名：</span>
        <el-input v-model="query.doctorName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">患者姓名：</span>
        <el-input v-model="query.personName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">订单状态：</span>
        <el-select v-model="query.orderStatusID" placeholder="请选择" value filterable clearable>
          <el-option v-for="(item,index) in orderStateOptions" :key="index" :label="item.orderName" :value="item.orderStatusID"></el-option>
        </el-select>
      </div>
      <div class="form-item" v-if="userInfo.orgTypeID === 4">
        <span class="item-label">问诊类型：</span>
        <el-select v-model="query.inquiryTypeCode" placeholder="请选择" value filterable clearable>
          <el-option v-for="(item,index) in inquiryTypeOptions" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getTableData1stValidate">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
      </div>
    </div>
    <base-title name="问诊订单列表"></base-title>
    <el-table :data="tableData" stripe style="width: 100%" class="mt24" :loading="tableLoading">
      <el-table-column prop="keyID" label="订单号" align="center" width="250"></el-table-column>
      <el-table-column prop="doctorName" label="接诊医生" align="center"></el-table-column>
      <el-table-column prop="doctorPhone" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="personName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="personPhone" label="下单人电话" align="center"></el-table-column>
      <template v-if="userInfo.orgTypeID === 4">
        <el-table-column prop="inquiryTypeCode" label="问诊类型" :formatter="inquiryTypeFormatter" align="center"></el-table-column>
      </template>
      <el-table-column prop="price" label="订单金额（元）" align="center"></el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="165px" align="center"></el-table-column>
      <el-table-column prop="orderStatusName" label="订单状态" align="center"></el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getTableData1stValidate" @current-change="getTableData1stValidate" />
  </div>
</template>

<script>
import InputWithTip from "@/components/InputWithTip";
import { mapGetters } from "vuex";
import { formatDate } from "../../filters";

export default {
  name: "HospitalOrdersForYunInquiry",
  inject: ["reload"],
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InputWithTip
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      needQuery: false,
      tableLoading: false,
      tableData: [],
      createTimes: [],
      createTimesConversion: [],
      query: {
        keyID: "",
        doctorName: "",
        personName: "",
        orderStatusID: "",
        startTime: "",
        endTime: "",
        orgID: "",
        inquiryTypeCode: ""
      },
      orderStateOptions: [
        { orderStatusID: "", orderName: "全部" },
        { orderStatusID: 0, orderName: "待支付" },
        { orderStatusID: 2, orderName: "已取消" },
        { orderStatusID: 10, orderName: "支付成功" }
      ],
      inquiryTypeOptions: [
        { value: "", label: "全部" },
        { value: "text", label: "图文" },
        { value: "tele", label: "电话" },
        { value: "video", label: "视频" }
      ],
      pageInfo: { pageIndex: 1, pageSize: 10, totalRow: 0, totalPage: 1 },
      // 电话号码正则及提示
      formRules: {}
    };
  },
  created () {
    this.initializeDateRegion();
    console.log(this.userInfo);
  },
  activated () { },
  methods: {
    // 操作：重置输入框信息
    resetSearchInfo () {
      this.query = {
        keyID: "",
        doctorName: "",
        personName: "",
        orderStatusID: "",
        startTime: "",
        endTime: "",
        orgID: "",
        inquiryTypeCode: ""
      },
        this.initializeDateRegion();
    },
    initializeDateRegion () {
      let startDate = this.getInstant1st();
      let endDate = new Date();
      this.createTimes = [startDate, endDate];
      this.query.doctorName = "";
      this.query.keyID = "";
      this.query.personName = "";
      this.query.orderStatusID = "";
      this.query.inquiryTypeCode = "";
    },
    // 第一步验证表单
    getTableData1stValidate () {
      this.needQuery = true;
      if (this.tableLoading) {
        return;
      }
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
      // 转诊时间（开始、结束）
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
      this.getTableDataFinal();
    },
    getTableDataFinal () {
      let params = { ...this.query, ...this.pageInfo };
      console.log(params);
      this.$_http
        .get(this.$_API.INTERFACE_YUNINQUIR_YINQUIRY_HOS_LIST, { params })
        .then(response => {
          if (!response.data) return;
          let oldData = response.data.datas;
          this.pageInfo = response.data.pageInfo;
          oldData.forEach(item => {
            item.price = item.price / 100;
          });
          this.tableData = oldData;
        });
    },
    getInstant1st () {
      let date = new Date();
      date.setDate(1);
      date.setHours(0);
      date.setSeconds(0);
      date.setMinutes(0);
      return date;
    },
    inquiryTypeFormatter (row) {
      const item = this.inquiryTypeOptions.find(
        it => it.value === row.inquiryTypeCode
      );
      return item ? item.label : "";
    }
  }
};
</script>

<style scoped>
</style>
