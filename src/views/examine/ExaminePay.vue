<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">状态：</span>
        <el-select v-model="orderStatusID" placeholder="请选择" filterable clearable value="">
          <el-option v-for="item in stateOptions" :key="item.orderStatusID" :label="item.serviceStatusName" :value="item.orderStatusID"></el-option>
        </el-select>
      </div>
      <div class="form-item" v-if="orderStatusID===33">
        <span class="item-label">付款时间：</span>
        <el-date-picker v-model="searchTimes" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getExamineOrderData">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="refreshQueryCondition">重置</el-button>
      </div>
    </div>

    <base-title name="数据列表"></base-title>
    <el-table :data="orderData" stripe :loading="tableLoading" class="mt24">
      <el-table-column prop="doctorName" label="推荐医生" align="center"></el-table-column>
      <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="platformIncome" label="应付平台费用（元）" align="center" width="155px">
        <template #default="{row}">
          {{row.platformIncome | formatMoney() }}
        </template>
      </el-table-column>
      <el-table-column prop="doctorIncome" label="应付医生费用（元）" align="center"  width="155px">
        <template #default="{row}">
          {{row.doctorIncome | formatMoney() }}
        </template>
      </el-table-column>
      <el-table-column prop="examineTime" label="结算发起时间" align="center"  width="155px">
        <template #default="{row}">
          {{ row.createTime | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="orderStatusName" label="状态" align="center"></el-table-column>
      <el-table-column label="付款时间">
        <template #default="{row}">
          <span v-if="row.hospitalCostTime=='1900-01-01 00:00:00'">暂未付款</span>
          <span v-if="row.hospitalCostTime!='1900-01-01 00:00:00'">{{row.hospitalCostTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span v-if="row.orderStatusID===31" class="opt-text" @click="costEnsure(row)">
              付款
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getExamineOrderData" @current-change="getExamineOrderData" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { formatDate } from "../../filters";

export default {
  name: "finance-examinePay",
  data () {
    return {
      reportDialogVisible: false,
      picIsShow: false,
      oneRow: "",
      keyID: "",
      orderData: [],
      // 查询：条件集合
      query:
      {
        beginDate: "",
        endDate: ""
      },
      orderStatusID: "all",
      // 查询：状态下拉集合
      stateOptions: [
        { orderStatusID: "all", serviceStatusName: "全部" },
        { orderStatusID: 31, serviceStatusName: "待付款" },
        { orderStatusID: 33, serviceStatusName: "付款完成" }
      ],
      searchTimes: [],
      searchTimesConversion: [],
      // 页码：参数集合
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      },
      picNames: [],
      dialogVisible: false,
      dialogImageUrl: "",
      tableLoading: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.setPickerTimes();
    this.getExamineOrderData();
  },
  activated () {
    this.setPickerTimes();
    this.getExamineOrderData();
  },
  methods: {
    setPickerTimes () {
      this.searchTimes = new Date();
    },
    // 查询： 订单数据，加载表格
    getExamineOrderData () {
      if (this.tableLoading) {
        return;
      }
      // 查询条件：医院ID、状态编号
      if (this.searchTimes.length > 0) {
        this.searchTimesConversion = [];
        this.searchTimes.forEach((item) => {
          item = formatDate(item);
          this.searchTimesConversion.push(item);
        });
        this.query.beginDate = this.searchTimesConversion[0];
        this.query.endDate = this.searchTimesConversion[1];
      } else {
        this.query.beginDate = this.dataFunction().beginDate;
        this.query.endDate = this.dataFunction().endDate;
      }
      let hospitalID = this.userInfo.orgID;
      let orderStatusID = this.orderStatusID;
      let pageIndex = this.pageInfo.pageIndex;
      let pageSize = this.pageInfo.pageSize;
      let params = { pageIndex, pageSize, hospitalID, ...this.query, orderStatusID };
      this.tableLoading = true;
      this.$_http.get(this.$_API.INTERFACE_QUERY_HOSPITAL_ORDER_FOR_SETTLE_BY_PAGE, { params }).then(res => {
        if (!res.data) return;
        this.orderData = res.data.datas;
        this.pageInfo = res.data.pageInfo;
      }).finally(it => {
        this.tableLoading = false;
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
    costEnsure (row) {
      this.$confirm("是否确认付款?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.costOrder(row);
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
    },

    costOrder (row) {
      this.$_http.post(this.$_API.INTERFACE_Cost_Order, {
        keyID: row.keyID
      }).then(response => {
        this.getExamineOrderData();
      });
    },
    refreshQueryCondition () {
      this.query = { beginDate: "", endDate: "" };
      this.orderStatusID = "all";
      this.searchTimes = [];
    },
    // 提醒：表格数据错误时的处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.getExamineOrderData();
    }
  }
};
</script>

<style lang="scss">
#eSettleBox {
  .el-dialog__body span:nth-of-type(1) {
    color: #333333;
  }

  .el-dialog__body span:nth-of-type(2) {
    color: #6c778c;
  }

  .el-textarea,
  #textareaBody {
    max-width: 550px;
  }

  #btnThinkMore {
    padding: 10px 27px;
  }

  .uploadLabel {
    display: inline;
  }
}
</style>
