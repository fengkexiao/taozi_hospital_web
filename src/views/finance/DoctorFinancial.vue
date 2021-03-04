<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">医生姓名：</span>
        <el-input v-model="query.doctorName" placeholder="请输入" clearable/>
      </div>
      <div class="form-item">
        <span class="item-label">联系电话：</span>
        <el-input v-model="query.phone" placeholder="请输入" clearable maxlength="11"/>
      </div>
      <div class="form-item">
        <span class="item-label">科室：</span>
        <el-input v-model="query.hospitalSectionName"  placeholder="请输入" clearable/>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </div>
    <base-title name="医生明细列表"></base-title>
    <el-table :data="tableData" stripe :loading="tableLoading" class="mt24">
      <el-table-column prop="doctorName" label="医生姓名" align="center">
        <template #default="{row}">
          <el-button type="text" @click="financeDetails(row)">{{row.doctorName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="hospitalSectionName" label="科室" align="center"></el-table-column>
      <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
      <el-table-column label="收支总统" align="center">
        <template #default="{row}">{{row.totalAmount | formatMoney() }}</template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getList" @current-change="getList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "finance-doctorFinancial",
  props: {},
  data () {
    return {
      query: {},
      tableData: [],
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      },
      tableLoading: false,
      rpOrgIDList: []
    };
  },
  activated () {
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
  },
  methods: {
    // 重置
    reset () {
      this.query = {};
    },
    // 查询
    getList () {
      let params = {
        orgID: this.userInfo.orgID,
        ...this.query,
        ...this.pageInfo
      };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_FINANCE_DOCTORBALANCELIST, {
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
    },
    /**
     * 个人明细
     */
    financeDetails (row) {
      this.$router.push({
        params: {
          totalAmount: row.totalAmount,
          doctorID: row.doctorID
        },
        name: "finance-doctorFinancialDetails"
      });
    }
  }
};
</script>

<style lang="scss">
</style>
