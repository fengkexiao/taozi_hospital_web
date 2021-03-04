<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">处方订单来源：</span>
        <el-select v-model="query.orgID" placeholder="请选择" clearable filterable>
          <el-option v-for="(item) in rpOrgIDList" :key="item.keyID" :label="item.orgName" :value="item.orgID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">处方编号：</span>
        <el-input v-model="query.rpID" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">患者姓名：</span>
        <el-input v-model="query.patientName" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">开方医生：</span>
        <el-input v-model="query.doctorName" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">审方状态：</span>
        <el-select v-model="query.reviewStatusID" placeholder="请选择" clearable filterable>
          <el-option v-for="(item) in rpStatus" :key="item.reviewStatusID" :label="item.reviewStatusName" :value="item.reviewStatusID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">审方药师：</span>
        <el-input v-model="query.pharmacistName" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">开方时间：</span>
        <el-date-picker v-model="createTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </div>

    <base-title name="TMC药师审方列表"></base-title>
    <el-table :data="tableData" stripe :loading="tableLoading" class="mt24">
      <el-table-column prop="orgName" label="处方订单来源" align="center" width="155px"></el-table-column>
      <el-table-column prop="keyID" label="处方编号" align="center"></el-table-column>
      <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="doctorName" label="开方医生" align="center"></el-table-column>
      <el-table-column prop="diagnosis" label="诊断" align="center"></el-table-column>
      <el-table-column prop="rpTime" label="开方时间" align="center" width="155px"></el-table-column>
      <el-table-column prop="reviewStatusName" label="审方状态" align="center"></el-table-column>
      <el-table-column prop="pharmacistName" label="审方药师" align="center"></el-table-column>
      <el-table-column prop="reviewTime" label="审方时间" align="center" width="155px">
        <template #default="{row}">{{row.reviewTime | formatTime }}</template>
      </el-table-column>
      <el-table-column prop="9" label="操作" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" v-if="row.reviewStatusID === 0 && row.orderStatusID === 10 && row.financeStatusID === 1" @click="trialParty(row)">审方</span>
            <span class="opt-text" v-else @click="details(row)">详情</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getList" @current-change="getList" />
  </div>
</template>

<script>
import { formatDate } from "../../filters";
import { mapGetters } from "vuex";
export default {
  name: "hf-pharmacistTrialParty",
  props: {
    sign: {
      type: String,
      required: false
    }
  },
  filters: {
    // 过滤处方状态
    // formatRpStatus(val) {
    //   if (val === 0) {
    //     return "待审核";
    //   } else if (val === 1) {
    //     return "审核通过";
    //   } else if (val === 2) {
    //     return "审核不通过";
    //   }
    //   return "";
    // }
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
      query: { reviewStatusID: "", orgID: "" },
      tableData: [],
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      },
      tableLoading: false,
      rpStatus: [
        { reviewStatusID: "", reviewStatusName: "全部" },
        { reviewStatusID: 0, reviewStatusName: "未审核" },
        { reviewStatusID: 1, reviewStatusName: "审核通过" },
        { reviewStatusID: 2, reviewStatusName: "审核不通过" }
      ],
      rpOrgIDList: [],
      // 时间查询
      createTime: []
    };
  },
  activated () {
    if (typeof this.sign !== "undefined" && this.sign === "1") {
      this.getList();
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.setPickerTimes();
    this.getRpOrgIDList();
  },
  methods: {
    // 重置
    reset () {
      this.query = { reviewStatusID: "", orgID: "" };
      this.createTime = [];
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
    },
    // 查询处方订单来源
    getRpOrgIDList () {
      let params = {
        orgID: this.userInfo.orgID,
        groupCode: "OP_TMC_ORG",
        paraCode: "OP_TMC_ORG_HUAFUSTORE",
        paraValue: "1"
      };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_HOSPITALUSER_ORGPARAS, { params })
        .then(res => {
          if (res.data) {
            this.rpOrgIDList = res.data;
            // 默认选择第一个
            if (this.rpOrgIDList.length > 0) {
              this.query.orgID = this.rpOrgIDList[0].orgID;
            }
            this.getOrgName();
          }
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    getOrgName () {
      let orgIDs = [];
      orgIDs = this.rpOrgIDList.map((item) => {
        return item.orgID;
      });
      orgIDs = [...new Set(orgIDs)];
      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_NURSE_ORDERS_PRICE_FOUR, orgIDs)
        .then(res => {
          if (!res.data) return;
          res.data.forEach(item => {
            this.rpOrgIDList.forEach(it => {
              if (item.keyID === it.orgID) {
                this.$set(it, "orgName", item.orgName);
              }
            });
          });
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 查询
    getList () {
      if (!this.query.orgID) {
        this.$message.error("请选择处方订单来源");
        return false;
      }
      let startTime = formatDate(this.createTime[0]);
      let endTime = formatDate(this.createTime[1]);
      let data = {
        ...this.query,
        ...this.pageInfo,
        startTime,
        endTime
      };
      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_TMC_POST_RP_GETRPLISTFORPHAR, data)
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
    // 点击审方操作
    trialParty (row) {
      this.$router.push({
        name: "trialPartyAndDetails",
        params: { rpID: row.keyID, sign: "1", route: "hf-pharmacistTrialParty" },
        query: { orgID: row.orgID }
      });
    },
    // 点击详情操作
    details (row) {
      this.$router.push({
        name: "trialPartyAndDetails",
        params: { rpID: row.keyID, sign: "2", route: "hf-pharmacistTrialParty" },
        query: { orgID: row.orgID }
      });
    }
  }
};
</script>

<style lang="scss">
</style>
