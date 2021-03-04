<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">结算日期：</span>
        <el-date-picker v-model="costCreateTime" type="date" placeholder="选择日期(必选)" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <span class="item-label">服务时间：</span>
        <el-date-picker v-model="yearMonth" type="month" placeholder="请选择月(必选)" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <span class="item-label">订单状态：</span>
        <el-select v-model="costStatusID" placeholder="请选择" value="" clearable filterable>
          <el-option v-for="(item,index) in costStateOptions" :key="index" :label="item.costStatusName" :value="item.costStatusID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getFinanceSettleListDataFun">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfoFun">重置</el-button>
      </div>
    </div>
    <base-title name="共享诊室结算列表"></base-title>
    <el-table :data="financeSettleListData" stripe class="mt24" :loading="tableLoading">
      <el-table-column prop="doctorName" label="医生名称" align="center"></el-table-column>
      <el-table-column prop="personName" label="患者名称" align="center"></el-table-column>
      <el-table-column label="预约时段">
        <template #default="{row}">
          {{row.bookDate}} {{row.openPeriodName}}
        </template>
      </el-table-column>
      <el-table-column prop="treatFeeTotal" label="治理金额" align="center"></el-table-column>
      <el-table-column prop="costFeeTotal" label="结算金额" align="center"></el-table-column>
      <el-table-column prop="costCreateTime" label="结算时间" align="center" width="155px">
        <template #default="{row}">
          {{ row.costCreateTime | formatDateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="costStatusName" label="审核状态" align="center"></el-table-column>
      <el-table-column prop="costAuditTime" label="审核时间" align="center" width="155px">
        <template #default="{row}">
          {{ row.costAuditTime | formatDateTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span v-if="row.costStatusID === 0" class="opt-text" @click="toSettleDetailsFun(row,1)">
              审核
            </span>
            <span v-else type="primary" class="opt-text" @click="toSettleDetailsFun(row,2)">
              详情
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getFinanceSettleListDataFun" @current-change="getFinanceSettleListDataFun" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDateTime } from "../../filters";

export default {
  name: "finance-roomSettle",
  data () {
    return {
      tableLoading: false,
      query: {},
      costCreateTime: "",
      yearMonth: "",
      costStatusID: "",
      // 审核状态
      costStateOptions: [
        { costStatusName: "全部", costStatusID: "" },
        { costStatusName: "待审核", costStatusID: 0 },
        { costStatusName: "审核不通过", costStatusID: 1 }
      ],
      financeSettleListDataOld: [],
      financeSettleListData: [],
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      },
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
      this.getFinanceSettleListDataFun();
    }
  },
  methods: {
    // 初始：日期默认选择当前
    initInfo () {
      this.costCreateTime = new Date();
      this.yearMonth = new Date();
    },
    // 操作：重置
    resetSearchInfoFun () {
      this.costCreateTime = new Date();
      this.yearMonth = new Date();
      this.query = {};
      this.costStatusID = "";
    },
    // 查询：获取结算审核列表
    getFinanceSettleListDataFun () {
      if (this.tableLoading) {
        return;
      }
      if (this.costCreateTime && this.yearMonth) {
        this.query.costCreateTime = formatDateTime(this.costCreateTime);
        this.query.yearMonth = formatDateTime(this.yearMonth);
        let hospitalInfo = {
          hospitalID: this.userInfo.orgID
        };
        if (this.costStatusID === "") {
          hospitalInfo.allType = "audit";
        } else {
          hospitalInfo.costStatusID = this.costStatusID;
        }
        let params = { ...this.pageInfo, ...this.query, ...hospitalInfo };
        this.tableLoading = true;
        this.$_http.get(this.$_API.INTERFACE_FINANCE_SETTLE_LIST, { params }).then(res => {
          if (!res.data) return;
          this.financeSettleListDataOld = res.data.datas;
          this.pageInfo = res.data.pageInfo;
          this.searchState = true;
          this.financeSettleListChangeFun();
        }).finally(it => {
          this.tableLoading = false;
        });
      } else if (!this.costCreateTime) {
        this.$_error("请选择结算日期");
      } else if (!this.yearMonth) {
        this.$_error("请选择服务时间");
      }
    },
    // 转换：治疗金额、结算金额  / 100
    financeSettleListChangeFun () {
      if (this.financeSettleListDataOld) {
        this.financeSettleListDataOld.forEach((item) => {
          if (item.treatFeeTotal) {
            item.treatFeeTotal = item.treatFeeTotal / 100;
          }
          if (item.costFeeTotal) {
            item.costFeeTotal = item.costFeeTotal / 100;
          }
        });
      }
      this.financeSettleListData = this.financeSettleListDataOld;
    },
    // 操作：审核、详情
    toSettleDetailsFun (row, time) {
      if (!row || !row.keyID || !time) {
        this.dataError();
        return;
      }
      // F: "出院结算", R: "重新结算", A: "审核", B: "付款", AD: "审核详情", BD: "付款详情"
      let mode = "";
      if (time === 1) {
        mode = "A";
      } else if (time === 2) {
        mode = "AD";
      }
      this.$router.push({
        name: "room-book-cost",
        params: { keyID: row.keyID, mode }
      });
    },
    // 提醒：表格数据错误时的处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.getFinanceSettleListDataFun();
    }
  }
};
</script>

<style scoped>
</style>
