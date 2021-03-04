<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">审核日期：</span>
        <el-date-picker v-model="costAuditTime" type="date" placeholder="选择日期(必选)" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <span class="item-label">服务时间：</span>
        <el-date-picker v-model="yearMonth" type="month" placeholder="选择月份(必选)" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <span class="item-label">付款状态：</span>
        <el-select v-model="costStatusID" placeholder="请选择" value="" filterable clearable>
          <el-option v-for="(item,index) in costStateOptions" :key="index" :label="item.costStatusName" :value="item.costStatusID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getRoomPayListDataFun">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfoFun">重置</el-button>
      </div>
    </div>
    <base-title name="共享诊室出纳付款列表"></base-title>
    <el-table :data="roomPayListData" stripe :loading="tableLoading" class="mt24">
      <el-table-column prop="doctorName" label="医生名称" align="center"></el-table-column>
      <el-table-column prop="personName" label="患者名称" align="center"></el-table-column>
      <el-table-column label="预约时段">
        <template #default="{row}">
          {{row.bookDate}} {{row.openPeriodName}}
        </template>
      </el-table-column>
      <el-table-column prop="treatFeeTotal" label="治理金额" align="center"></el-table-column>
      <el-table-column prop="costFeeTotal" label="付款金额" align="center"></el-table-column>
      <el-table-column prop="costAuditTime" label="审核时间" align="center" width="155px">
        <template #default="{row}">
          {{ row.costAuditTime | formatDateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="costStatusName" label="付款状态" align="center"></el-table-column>
      <el-table-column prop="costPayTime" label="付款时间" align="center" width="155px">
        <template #default="{row}">
          {{ row.costPayTime | formatDateTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span v-if="row.costStatusID === 2" class="opt-text" @click="toPayDetailFun(row, 1)">
              付款
            </span>
            <span v-else class="opt-text" @click="toPayDetailFun(row, 2)">
              详情
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getRoomPayListDataFun" @current-change="getRoomPayListDataFun" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import BaseLoading from "../../components/global/base/BaseLoading";
import { formatDateTime } from "../../filters";

export default {
  name: "finance-roomPay",
  components: { BaseLoading },
  data () {
    return {
      tableLoading: false,
      query: {},
      costStatusID: "",
      costAuditTime: "",
      yearMonth: "",
      // 付款状态
      costStateOptions: [
        { costStatusName: "全部", costStatusID: "" },
        { costStatusName: "待付款", costStatusID: 2 },
        { costStatusName: "付款驳回", costStatusID: 3 },
        { costStatusName: "付款完成", costStatusID: 4 }
      ],
      roomPayListDataOld: [],
      roomPayListData: [],
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
      this.getRoomPayListDataFun();
    }
  },
  methods: {
    // 初始：日期默认选择当前
    initInfo () {
      this.costAuditTime = new Date();
      this.yearMonth = new Date();
    },
    // 操作：重置
    resetSearchInfoFun () {
      this.costAuditTime = new Date();
      this.yearMonth = new Date();
      this.query = {};
      this.costStatusID = "";
    },
    // 查询：获取共享诊室付款列表
    getRoomPayListDataFun () {
      if (this.tableLoading) {
        return;
      }
      if (this.costAuditTime && this.yearMonth) {
        this.query.costAuditTime = formatDateTime(this.costAuditTime);
        this.query.yearMonth = formatDateTime(this.yearMonth);
        let hospitalInfo = {
          hospitalID: this.userInfo.orgID
        };
        if (this.costStatusID === "") {
          hospitalInfo.allType = "pay";
        } else {
          hospitalInfo.costStatusID = this.costStatusID;
        }
        let params = { ...this.pageInfo, ...this.query, ...hospitalInfo };
        this.tableLoading = true;
        this.$_http.get(this.$_API.INTERFACE_FINANCE_SETTLE_LIST, { params }).then(res => {
          if (!res.data) return;
          this.roomPayListDataOld = res.data.datas;
          this.pageInfo = res.data.pageInfo;
          this.searchState = true;
          this.roomPayListChangeFun();
        }).finally(it => {
          this.tableLoading = false;
        });
      } else if (!this.query.costAuditTime) {
        this.$_error("请选择审核日期");
      } else if (!this.query.yearMonth) {
        this.$_error("请选择服务时间");
      }
    },
    // 转换：治疗金额、付款金额
    roomPayListChangeFun () {
      if (this.roomPayListDataOld) {
        this.roomPayListDataOld.forEach((item) => {
          if (item.treatFeeTotal) {
            item.treatFeeTotal = item.treatFeeTotal / 100;
          }
          if (item.costFeeTotal) {
            item.costFeeTotal = item.costFeeTotal / 100;
          }
        });
      }
      this.roomPayListData = this.roomPayListDataOld;
    },
    // 操作：付款、详情
    toPayDetailFun (row, time) {
      if (!row || !row.keyID || !time) {
        this.dataError();
        return;
      }
      // F: "出院结算", R: "重新结算", A: "审核", B: "付款", AD: "审核详情", BD: "付款详情"
      let mode = "";
      if (time === 1) {
        mode = "B";
      } else if (time === 2) {
        mode = "BD";
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
