<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">医生姓名：</span>
        <el-input v-model="query.doctorName" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">患者电话：</span>
        <el-input v-model="query.phone" placeholder="请输入" clearable maxlength="11" />
      </div>
      <div class="form-item">
        <span class="item-label">签约日期：</span>
        <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
        </el-date-picker>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="loadTable">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
      </div>
    </div>
    <base-title name="签约患者列表"></base-title>
    <el-table :data="tableData" stripe :loading="tableLoading" class="mt24">
      <el-table-column prop="doctorName" label="医生姓名" align="center"></el-table-column>
      <el-table-column prop="doctorPhone" label="医生电话" align="center"></el-table-column>
      <el-table-column prop="personName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="personPhone" label="患者电话" align="center"></el-table-column>
      <el-table-column prop="signTime" label="签约时间" align="center"></el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDate } from "../../filters";

export default {
  data () {
    return {
      query: {},
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      },
      tableLoading: false,
      tableData: [],
      time: ""
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  activated () {
    this.loadTable();
  },
  methods: {
    resetSearchInfo(){
      this.query={}
    },
    // 获取医生列表数据，加载表格
    loadTable () {
      let _this = this;
      if (_this.tableLoading) {
        return;
      }
      let startTime = formatDate(_this.time[0]);
      let endTime = formatDate(_this.time[1]);
      let bizInfo = {
        orgId: _this.userInfo.orgID,
        startTime,
        endTime
      };
      let params = { ..._this.pageInfo, ..._this.query, ...bizInfo };
      _this.tableLoading = true;
      _this.$_http
        .get(_this.$_API.API_PEACHUSER_SIGNPATIENT_GETSIGNPATIENT, {
          params
        })
        .then(res => {
          if (!res.data) return;
          _this.tableData = res.data.datas;
          _this.pageInfo = res.data.pageInfo;
        })
        .finally(it => {
          _this.tableLoading = false;
        });
    },
    // 表格数据错误时的处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.loadTable();
    }
  }
};
</script>
