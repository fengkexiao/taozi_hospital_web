<template>
  <div class="app-container base-page">
      <base-title name="复诊任务列表" ></base-title>
      <el-table :data="doctorGroupList" style="width: 100%" stripe class="mt24">
        <el-table-column prop="" label="创建人" align="center">
          <template #default="{row}">
            <p v-if="row.assistantName !== ''">{{row.assistantName}}</p>
            <p v-else>{{row.doctorName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="reInquiryDate" label="复诊日期" align="center"></el-table-column>
        <el-table-column prop="addTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="reInquiryStatus" label="状态" align="center">
          <template #default="{row}">
            <p v-if="row.reInquiryStatus === 0">未复诊</p>
            <p v-if="row.reInquiryStatus === 1">已复诊</p>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination v-model="page" @size-change="getDoctorGroupList" @current-change="getDoctorGroupList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "subsequentVisit",
  components: {
    // eslint-disable-next-line vue/no-unused-components
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  filters: {
  },
  props: ["keyID", "orgID"],
  data() {
    return {
      doctorGroupList: [],
      page: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      }
    };
  },
  activated() {
    this.getDoctorGroupList();
  },
  methods: {
    getDoctorGroupList() {
      let params = {
        orgID: this.orgID,
        patientID: this.keyID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_TASK_LIST, { params })
        .then(response => {
          if (!response.data) return;
          this.doctorGroupList = response.data;
          // console.log(response, 12121);
        });
    },
    searchList() {
      this.page.pageIndex = 1;
      this.getDoctorGroupList();
    },
    handleSizeChange(val) {
      this.page.PageSize = val;
      this.getDoctorGroupList();
    },
    handleCurrentChange(val) {
      this.page.pageIndex = val;
      this.getDoctorGroupList();
    }
  },
  created() {
    this.getDoctorGroupList();
  }
};
</script>

<style scoped>
.left {
  float: left;
}
.right {
  float: right;
  margin-right: 20px;
  margin-top: 10px;
}
.color-blue {
  color: #438BEF;
  font-weight: 800;
}
</style>
