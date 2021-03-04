<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">姓名：</span>
        <el-input v-model="query.patientName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">IP医生：</span>
        <el-input v-model="query.assistantName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">医生：</span>
        <el-input v-model="query.doctorName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">药师：</span>
        <el-input v-model="query.pharmacistName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">审核状态：</span>
        <el-select v-model="query.reviewStatusID" placeholder="请选择" filterable clearable>
          <el-option v-for="item in options" :key="item.value" :label="item.reviewName" :value="item.reviewStatusID">
          </el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">开方日期：</span>
        <el-date-picker v-model="rpDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="loadTable">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="loadTable('rf')">重置</el-button>
      </div>
    </div>

    <base-title name="处方管理列表"></base-title>
    <el-table :data="tableData" stripe class="mt24" :loading="tableLoading">
      <el-table-column prop="patientName" label="患者姓名" align="center" width="150"></el-table-column>
      <el-table-column prop="diagnosis" label="诊断" align="center"></el-table-column>
      <el-table-column prop="assistantName" label="IP医生" align="center" width="150"></el-table-column>
      <el-table-column prop="doctorName" label="医生" align="center" width="150"></el-table-column>
      <el-table-column prop="rpTime" label="开方时间" align="center" width="200">
        <template #default="{row}">
          {{ row.rpTime | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="pharmacistName" label="药师" align="center" width="150"></el-table-column>
      <el-table-column prop="reviewStatusID" label="审核状态" align="center" width="150">
        <template slot-scope="scope">
          <p v-if="scope.row.reviewStatusID == 0">未审核</p>
          <p v-if="scope.row.reviewStatusID == 1">审核通过</p>
          <p v-if="scope.row.reviewStatusID == 2">审核不通过</p>
        </template>
      </el-table-column>
      <el-table-column prop="reviewTime" label="审方时间" align="center" width="200">
        <template #default="{row}">
          {{ row.reviewTime | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="trialParty(row)">
              查看详情
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
  </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatMonth, formatDate } from "../../filters";
export default {
  data () {
    return {
      pageInfo: {
        pageSize: 10,
        pageIndex: 1
      },
      // 列表数据
      tableData: [],
      tableLoading: false,
      rpDate: [formatMonth(new Date()) + "-01", formatDate(new Date())],
      options: [
        { reviewStatusID: "", reviewName: "全部" },
        { reviewStatusID: "0", reviewName: "待审核" },
        { reviewStatusID: "1", reviewName: "审核通过" },
        { reviewStatusID: "2", reviewName: "审核不通过" }
      ],
      query: {
        rpTypeID: "",
        rpID: "",
        patientName: "",
        doctorName: "",
        reviewStatusID: ""
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.loadTable();
  },
  methods: {
    // 获取列表数据
    loadTable (key) {
      if (key === "rf") {
        this.$refs.formData.resetFields();
        return;
      }
      let rpdate = {
        startDate: formatDate(this.rpDate[0]),
        endDate: formatDate(this.rpDate[1])
      };
      let params = { ...this.pageInfo, ...this.query, ...rpdate, orgID: this.userInfo.orgID };
      this.tableLoading = true;
      // this.$_API.API_RP_PRESCRIPTION_GETRP
      let requests = this.$_http.get(this.$_API.INTERFACE_TMC_GET_RP_GETRPLIST, {
        params
      });
      requests
        .then(res => {
          if (!res.data) return;
          if (res.data === true) {
            return;
          }
          let oldData = res.data.datas;
          console.log(res.data.datas);
          let hospitalIDs = [];
          oldData.forEach(item => {
            if (item.providerID) {
              hospitalIDs.push(item.providerID);
            }
          });
          if (hospitalIDs.length > 0) {
            this.getHospitalName(oldData, hospitalIDs);
          } else {
            this.tableData = res.data.datas;
          }
          this.pageInfo = res.data.pageInfo;
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 根据ID获取机构名称
    getHospitalName (oldData, hospitalIDs) {
      this.$_http
        .post(
          this.$_API.API_RP_GET_HOSPITAL_NAME_BY_ID,
          hospitalIDs
        ).then(res => {
          oldData.forEach(item => {
            res.data.forEach(item2 => {
              if (item2.keyID === item.providerID) {
                item.providerID = item2.orgName;
              }
            });
          });
          this.tableData = oldData;
        });
    },
    // 详情
    trialParty (row) {
      if (!row || !row.keyID) {
        return;
      }
      this.$router.push({
        name: "tmc-RpDetail",
        // 跳转详情界面  传入订单 ID
        params: {
          rpID: row.keyID
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
