<template>
  <div class="app-container base-page">
    <base-title name="收支总统"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">收支总统：</span>
        <div style="width:150px">{{totalAmount | formatMoney}}</div>
      </div>
    </div>
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">年月：</span>
        <el-date-picker v-model="query.yearMonth" value-format="yyyy-MM" type="month" placeholder="请选择" style="width:120px" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <span class="item-label">收支状态：</span>
        <el-select v-model="query.balanceDirection" style="width:100px" placeholder="请选择" clearable filterable >
          <el-option v-for="item in directionOptions" :key="item.dirID" :label="item.dirName" :value="item.dirID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">业务状态：</span>
        <el-input v-model="query.billDesc" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </div>

    <base-title name="个人收支明细列表"></base-title>
    <el-table :data="tableData" stripe :loading="tableLoading" class="mt24">
      <el-table-column prop="billTime" label="账单时间" align="center"></el-table-column>
      <el-table-column prop="balanceDirection" label="收支" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.balanceDirection== 0">收入</span>
          <span v-if="scope.row.balanceDirection== 1">支出</span>
        </template>
      </el-table-column>
      <el-table-column prop="billDesc" label="业务" align="center"></el-table-column>
      <el-table-column prop="billAmount" label="交易金额" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.balanceDirection== 1" style="color:green;">{{-scope.row.billAmount | formatMoney}}</span>
          <span v-if="scope.row.balanceDirection== 0">{{scope.row.billAmount | formatMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="本次余额" align="center">
        <template slot-scope="scope">{{scope.row.balance | formatMoney}}</template>
      </el-table-column>
      <el-table-column prop="transID" label="交易号" align="center"></el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getList" @current-change="getList" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { formatMonth } from "../../filters";

export default {
  name: "finance-doctorFinancialDetails",
  // 参数
  props: {
    totalAmount: {
      type: Number,
      required: false
    },
    doctorID: {
      type: String,
      required: true
    }
  },
  inject: ["reload"],
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      tableLoading: false,
      accountBalance: {
        balance: 0,
        totalIncome: 0
      },
      tableData: [],
      query: {
        yearMonth: "",
        balanceDirection: "",
        billDesc: ""
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      },
      directionOptions: [
        { dirID: "", dirName: "全部" },
        { dirID: "0", dirName: "收入" },
        { dirID: "1", dirName: "支出" }
      ]
    };
  },
  created () {
    this.query.yearMonth = formatMonth(new Date());
  },
  activated () {
  },
  methods: {
    // 重置
    reset () {
      this.query.yearMonth = formatMonth(new Date());
      this.query.balanceDirection = "";
      this.query.billDesc = "";
    },
    // 查询
    getList () {
      let params = {
        orgID: this.userInfo.orgID,
        doctorID: this.doctorID,
        ...this.query,
        ...this.pageInfo
      };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_FINANCE_DOCTORBILLSLIST, {
          params
        })
        .then(res => {
          if (!res.data) return;
          // 填充表格数据
          this.tableData = res.data.datas;
          this.pageInfo = res.data.pageInfo;
        })
        .finally(it => {
          this.tableLoading = false;
        });
    }
  }
};
</script>
