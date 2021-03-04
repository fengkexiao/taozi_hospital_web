<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">处方类别：</span>
        <el-select v-model="query.rpTypeID" placeholder="请选择" clearable filterable>
          <el-option v-for="item in rpTypes" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">处方ID：</span>
        <el-input v-model="query.rpID" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">患者：</span>
        <el-input v-model="query.patientName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">医生：</span>
        <el-input v-model="query.doctorName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">处方状态：</span>
        <el-select v-model="query.rpStatus">
          <el-option v-for="item in rpStatuss" :key="item.value" :label="item.label" :value="item.value">
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

    <base-title name="药师审方列表"></base-title>
    <el-table :data="tableData" stripe :loading="tableLoading" class="mt24">
      <el-table-column prop="keyID" label="处方ID" align="center"></el-table-column>
      <el-table-column prop="rpTypeName" label="处方类别" align="center"></el-table-column>
      <el-table-column prop="rpSource" label="处方来源" align="center" :formatter="formatSource"></el-table-column>
      <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="providerType" label="供应商" align="center" :formatter="formatProviderType"></el-table-column>
      <el-table-column prop="providerID" label="供应商名称" align="center" width="110px"></el-table-column>
      <el-table-column prop="recipeAllPrice" label="处方总价(元)" align="center" width="110px">
        <template #default="{row}">
          {{ row.recipeAllPrice | formatMoney }}
        </template>
      </el-table-column>
      <el-table-column prop="doctorName" label="医生名称" align="center"></el-table-column>
      <el-table-column prop="doctorTime" label="医生开方时间" align="center" width="155px"></el-table-column>
      <el-table-column prop="pharmacistName" label="药师名称" align="center"></el-table-column>
      <el-table-column prop="pharmacistTime" label="药师审核时间" align="center" width="155px">
        <template #default="{row}">
          {{ row.pharmacistTime | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="rpStatus" label="处方状态" align="center" :formatter="formatState"></el-table-column>
      <el-table-column prop="notPassReason" label="不通过原因" align="center" width="110px"></el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="trialParty(row, '1')">
              详情
            </span>
            <span class="opt-text" @click="trialParty(row, '2')" v-if="row.rpStatus === 1">
              审方
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
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
      query: {
        rpTypeID: "",
        rpID: "",
        patientName: "",
        doctorName: "",
        rpStatus: 1
      },
      rpTypes: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "中药",
          value: 1
        },
        {
          label: "西药",
          value: 0
        }
      ],
      rpStatuss: [
        {
          label: "未审",
          value: 1
        },
        {
          label: "通过",
          value: 2
        },
        {
          label: "不通过",
          value: 3
        }
      ]
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
        this.query = {
          rpTypeID: "",
          rpID: "",
          patientName: "",
          doctorName: "",
          rpStatus: 1
        }
      }
      let rpdate = {
        startDate: formatDate(this.rpDate[0]),
        endDate: formatDate(this.rpDate[1]),
        orgID: this.userInfo.orgID
      };
      let params = { ...this.pageInfo, ...this.query, ...rpdate };
      this.tableLoading = true;
      // this.$_API.API_RP_PRESCRIPTION_GETRP
      let requests = this.$_http.get(this.$_API.API_RP_PRESCRIPTION_GETRP, {
        params
      });
      requests
        .then(res => {
          if (!res.data) return;
          if (res.data === true) {
            return;
          }
          let oldData = res.data.datas;
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
    // 药师点击审方
    trialParty (row, key) {
      this.$router.push({
        name: "rpTemplate-medicine",
        // 跳转详情界面  传入订单 ID
        params: {
          inquiryId: row.keyID,
          state: key
        }
      });
    },
    formatState (row) {
      const arry = ["开方中", "未审", "通过", "不通过"];
      return arry[row.rpStatus];
    },
    formatProviderType (row) {
      const arry = {
        0: "平台",
        1: "医院",
        9: "三方"
      };
      return arry[row.providerType];
    },
    formatSource (row) {
      const arry = ["用户选购", "问诊开方", "线下开方"];
      return arry[row.rpSource];
    }
  }
};
</script>

<style scoped>
</style>
