<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">订单编号：</span>
        <el-input v-model="query.goodsOrderID" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入" clearable/>
      </div>
      <div class="form-item">
        <span class="item-label">患者姓名：</span>
        <el-input v-model="query.buyerName"  placeholder="请输入" clearable/>
      </div>
      <div class="form-item">
        <span class="item-label">IP医生：</span>
        <el-input v-model="query.assistantName"  placeholder="请输入" clearable/>
      </div>
      <div class="form-item">
        <span class="item-label">开方医生：</span>
        <el-input v-model="query.doctorName"  placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">收款方式：</span>
        <el-select v-model="query.payWay" placeholder="请选择" filterable clearable>
          <el-option v-for="(item) in stateOptions" :key="item.payWay" :label="item.payWayName" :value="item.payWay">
          </el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">创单时间：</span>
        <el-date-picker v-model="createTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <span class="item-label">审核状态：</span>
        <el-select v-model="query.financeStatusID" placeholder="请选择" filterable clearable>
          <el-option v-for="(item) in toExamineStatus" :key="item.financeStatusID" :label="item.financeStatusName" :value="item.financeStatusID">
          </el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">审核人姓名：</span>
        <el-input v-model="query.phone"  placeholder="请输入" clearable/>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="loadTable">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </div>
    <base-title name="订单审核列表"></base-title>
    <el-table :data="tableData" stripe :loading="tableLoading" class="mt24">
      <el-table-column prop="keyID" label="订单编号" align="center"></el-table-column>
      <el-table-column prop="buyerName" label="患者" align="center"></el-table-column>
      <el-table-column prop="receiverName" label="收货人" align="center"></el-table-column>
      <el-table-column prop="receiverPhone" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="5" label="省市区">
        <template #default="{row}">
          {{row | formatProvince}}
        </template>
      </el-table-column>
      <el-table-column prop="assistantName" label="IP医生" align="center"></el-table-column>
      <el-table-column prop="doctorName" label="开方医生" align="center"></el-table-column>
      <el-table-column prop="payWay" label="收款方式" align="center">
        <template #default="{row}">
          {{row.payWay | formatPayWay}}
        </template>
      </el-table-column>
      <el-table-column prop="orderStatusName" label="收款状态" align="center"></el-table-column>
      <el-table-column prop="costPrice" label="总价(元)" align="center">
        <template #default="{row}">
          {{row.costPrice | formatAmount}}
        </template>
      </el-table-column>
      <el-table-column prop="prePrice" label="预付(元)" align="center">
        <template #default="{row}">
          {{row.prePrice | formatAmount}}
        </template>
      </el-table-column>
      <el-table-column prop="waitPrice" label="待收(元)" align="center">
        <template #default="{row}">
          {{row.waitPrice | formatAmount}}
        </template>
      </el-table-column>
      <el-table-column prop="doctorRemark" label="订单备注" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创单时间" align="center" width="155px"></el-table-column>
      <el-table-column prop="financeStatusName" label="审核状态">
      </el-table-column>
      <el-table-column prop="financeName" label="审核人" align="center"></el-table-column>
      <el-table-column prop="financeTime" label="审核时间" align="center" width="155px">
        <template #default="{row}">
          {{row.financeTime | formatTime }}
        </template>
      </el-table-column>
      <el-table-column prop="18" label="操作" width="100" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span v-if="row.financeStatusID === 0 && row.orderStatusID === 10" class="opt-text" @click="toExamine(row)">
              审核
            </span>
            <span v-else class="opt-text" @click="details(row)">
              详情
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
  </div>
</template>
<script>
import { formatDate } from "../../filters";
import { mapGetters } from "vuex";

export default {
  name: "finance-examine",
  // 参数
  props: {
    sign: {
      type: String,
      required: false
    }
  },
  filters: {
    // 过滤省市区
    formatProvince (row) {
      if (row) {
        return row.province + row.city + row.area;
      }
      return "";
    },
    // 格式化金额
    formatAmount (val) {
      return (val / 100).toFixed(2);
    },
    // 过滤收款方式
    formatPayWay (val) {
      if (val === 0) {
        return "预付定金";
      } else if (val === 1) {
        return "在线支付";
      } else if (val === 2) {
        return "货到付款";
      }
    },
    // 过滤时间
    formatTime (val) {
      if (val === "1900-01-01 00:00:00") {
        return "";
      } else {
        return val;
      }
    }
  },
  data () {
    return {
      query: { payWay: "", orderStatusID: "", financeStatusID: "" },
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      },
      tableLoading: false,
      tableData: [],
      // 收款方式
      stateOptions: [
        { payWay: "", payWayName: "全部" },
        { payWay: "0", payWayName: "定金" },
        { payWay: "1", payWayName: "全款 " },
        { payWay: "2", payWayName: "货到付款 " }
      ],
      // 审核状态
      toExamineStatus: [
        { financeStatusID: "", financeStatusName: "全部" },
        { financeStatusID: "0", financeStatusName: "未审核" },
        { financeStatusID: "1", financeStatusName: "审核通过" },
        { financeStatusID: "2", financeStatusName: "审核不通过" }
      ],
      // 创单时间
      createTime: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  activated () {
    if (typeof this.sign !== "undefined" && this.sign === "1") {
      this.loadTable();
    }
  },
  created () {
    this.setPickerTimes();
  },
  methods: {
    // 重置
    reset () {
      this.query = { payWay: "", orderStatusID: "", financeStatusID: "" };
      this.setPickerTimes();
    },
    loadTable () {
      let startTime = formatDate(this.createTime[0]);
      let endTime = formatDate(this.createTime[1]);
      let data = {
        ...this.query,
        startTime: startTime,
        endTime: endTime,
        ...this.pageInfo,
        orgID: this.userInfo.orgID,
        sign: "1"
      };
      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_TMC_GET_GOODS_ORDER_LIST, data)
        .then(res => {
          if (!res.data) return;
          // 填充表格数据
          this.tableData = res.data.datas;
          this.pageInfo = res.data.pageInfo;
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 详情
    details (row) {
      this.$router.push({
        name: "to-Examine",
        params: { orderID: row.keyID, sign: "2", route: "finance-examine" }
      });
    },
    // 审核
    toExamine (row) {
      this.$router.push({
        name: "to-Examine",
        params: { orderID: row.keyID, sign: "1", route: "finance-examine" }
      });
    },
    getInstant1st () {
      let date = new Date();
      let separator = "-";
      let year = date.getFullYear();
      let beginDate = new Date(year + separator + "01-01");
      return beginDate;
    },
    setPickerTimes () {
      let startDate = this.getInstant1st();
      let endDate = new Date();
      this.createTime = [startDate, endDate];
    }
  }
};
</script>
