<template>
  <div class='app-container base-page'>
    <div>
      <base-title name="查询条件"></base-title>
      <div class="base-search_form">
        <div class="form-item">
          <span class="item-label">关键字：</span>
          <el-input placeholder="请输入" v-model="query.condition" clearable></el-input>
        </div>
        <div class="form-item">
          <span class="item-label">就诊时间：</span>
          <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format='yyyy-MM-dd'></el-date-picker>
        </div>
        <div class="form-item">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        </div>
        <div class="form-item">
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>

    <div>
      <base-title name="问诊人信息列表"></base-title>
      <el-table :data="historyPrescriptionList" style="width:100%;margin-top:24px;" :loading="tableLoading" stripe>
        <!-- <el-table-column prop="clientID" label="来源" align="center">
          <template slot-scope="scope">
            <span>{{formateClient(scope.row.clientID)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="sectionName" label="科室" align="center"></el-table-column>
        <el-table-column prop="groupDesc" label="问诊方式" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.inquiryType===0">普通</span>
            <span v-if="scope.row.inquiryType===1">图文</span>
            <span v-if="scope.row.inquiryType===2">视频</span>
          </template>
        </el-table-column>
        <el-table-column prop="patientName" label="问诊人姓名" align="center"></el-table-column>
        <el-table-column prop="patientSex" label="性别" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.patientSex===1">男</span>
            <span v-if="scope.row.patientSex===2">女</span>
          </template>
        </el-table-column>
        <el-table-column prop="patientAge" label="年龄" align="center"></el-table-column>
        <el-table-column prop="illDesc" label="患者主诉" align="center"></el-table-column>
<!--        <el-table-column prop="mainDesc" label="主诊断" align="center"></el-table-column>-->
        <el-table-column prop="receiptTime" label="问诊时间" min-width="170" align="center"></el-table-column>
        <el-table-column prop="orderStatus" label="是否开方" align="center">
          <template slot-scope="scope">
            <span>{{formateOrderStatus(scope.row.orderStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="groupDesc" label="操作" align="center">
          <template slot-scope="scope">
            <div class="option-btn_group">
              <span class="opt-text" @click="handleDetail(scope.row)">详情</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination v-model="page" background @size-change="getHistoryPrescriptionList" @current-change="getHistoryPrescriptionList" />
    </div>

    <record-detail :dialogVisible.sync="recordDetailVisible" :rpID="rpID" :orderID="orderID" :name="name" :sex="sex" :age="age" :inquiryType="inquiryType" :orderStatus="orderStatus" :from="from" :sectionName="sectionName" :doctorName="doctorName"></record-detail>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import RecordDetail from "./components/RecordDetail";
export default {
  name: "pharmacistGroup",
  components: {
    RecordDetail
  },
  data () {
    return {
      historyPrescriptionList: [],
      query: {},
      formData: {},
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      orderID:'',
      time: [],
      recordDetailVisible: false,
      rpID: "",
      orderStatusList: [
        { label: "未接单", value: 0 },
        { label: "待开方", value: 1 },
        { label: "已开方", value: 2 },
        { label: "拒绝", value: 3 },
        { label: "审核不通过", value: 4 },
        { label: "审核通过", value: 5 }
      ],
      inquiryType: "",
      orderStatus: "",
      from: "",
      sectionName: "",
      doctorName: "",
      tableLoading: false,
      clientList: [],
      name: "",
      sex: 1,
      age: 0
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.getAllClient();
    this.initDate();
  },
  methods: {
    initDate () {
      let date = new Date();
      let monthStart = date.setDate(1);
      let currentMonth = date.getMonth();
      let nextMonth = ++currentMonth;
      let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
      let oneDay = 1000 * 60 * 60 * 24;
      let firstDay = moment(monthStart).format("YYYY-MM-DD");
      let lastDay = moment(nextMonthFirstDay - oneDay).format("YYYY-MM-DD");
      this.time = [firstDay, lastDay];
    },
    // 获取所有客户
    async getAllClient () {
      const res = await this.$_http.get(this.$_API.INTERFACE_RP_GET_GETALLCLIENT, {});
      if (res.data) {
        this.clientList = res.data || [];
      }
    },
    // 查看详情
    handleDetail (item) {
      console.log(item)
      this.recordDetailVisible = true;
      this.orderID = item.keyID;
      this.rpID = item.rpID;
      this.inquiryType = item.inquiryType === 0 ? "普通" : (item.inquiryType === 1 ? "图文" : "视频");
      this.orderStatus = this.formateOrderStatus(item.orderStatus);
      this.from = this.formateClient(item.clientID);
      this.sectionName = item.sectionName;
      this.doctorName = item.doctorName;
      this.name = item.patientName;
      this.sex = item.patientSex;
      this.age = item.patientAge;
    },
    // 格式化来源
    formateClient (clientId) {
      let index = this.clientList.findIndex(item => {
        return item.clientID === clientId;
      });
      if (index > -1) {
        return this.clientList[index].clientName || "";
      }
      return "";
    },
    // 格式化状态
    formateOrderStatus (id) {
      let index = this.orderStatusList.findIndex(item => {
        return item.value === id;
      });
      return this.orderStatusList[index].label;
    },
    // 查询
    handleQuery () {
      this.getHistoryPrescriptionList();
    },
    // 重置
    handleReset () {
      this.query.condition = "";
      this.time = [];
    },
    // 历史处方
    getHistoryPrescriptionList () {
      if (this.tableLoading) {
        return;
      }
      this.tableLoading = true;
      let bizInfo = {
        doctorID: this.userInfo.doctorID,
        condition: this.query.condition
      };
      if (this.time.length > 0) {
        bizInfo.startTime = this.time[0];
        bizInfo.endTime = this.time[1];
      }
      let params = { ...this.page, ...bizInfo };
      this.$_http
        .get(this.$_API.INTERFACE_RP_GET_GETLISTBYCONDITION, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.historyPrescriptionList = res.data.datas || [];
          this.page = res.data.pageInfo;
        })
        .finally(it => {
          this.tableLoading = false;
        });
    }
  }
};
</script>

<style scoped>
</style>
