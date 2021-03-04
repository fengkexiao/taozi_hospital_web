<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">患者姓名：</span>
        <el-input v-model="query.patientName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">患者电话：</span>
        <el-input v-model="query.patientPhone" placeholder="请输入" form-type="phone" clearable></el-input>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getPatient">查询</el-button>
      </div>
    </div>

    <base-title name="患者管理列表"></base-title>

    <el-table :data="tableData" stripe class="mt24" :loading="tableLoading">
      <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="patientPhone" label="患者电话" align="center"></el-table-column>
      <el-table-column prop="kindName" label="最近一次诊断结果" align="center"></el-table-column>
      <el-table-column prop="firstScore" label="首次诊断评分" align="center"></el-table-column>
      <el-table-column prop="lastScore" label="最近一次复诊评分" align="center"></el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="goPatientContrasr(row.keyID,row.lastKindCode,row.diseaseCode)">评分对比</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getPatient()" @current-change="getPatient()" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data () {
    return {
      query: {},
      tableData: [],
      tableLoading: false,
      patient: {},
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      }
    };
  },
  // 获取当前登录对象
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    // 获取患者列表  加载数据
    getPatient () {
      let params = { ...this.pageInfo, ...this.query };
      this.tableLoading = true;
      let requests = this.$_http.get(
        this.$_API.API_HOU_PATIENT_HOUPATIENTLIST,
        {
          params
        }
      );
      requests
        .then(res => {
          if (!res.data) return;
          this.tableData = res.data.datas;
          this.pageInfo = res.data.pageInfo;
        })
        .finally(it => {
          this.tableLoading = false;
        });
      return requests;
    },
    // 跳转患者评分对比详情
    goPatientContrasr (keyID, kindCode1, diseaseCode) {
      if (
        keyID !== undefined &&
        kindCode1 !== undefined &&
        diseaseCode !== undefined
      ) {
        this.$router.push({
          name: "patientContrast",
          params: {
            patientID: keyID,
            kindCode: kindCode1,
            diseaseCode: diseaseCode
          }
        });
      } else {
        this.$_success("该患者还没有进行过评分对比");
      }
    }
  }
};
</script>
