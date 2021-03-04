<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">协诊医生姓名：</span>
        <el-input v-model="query.houDoctorName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">协诊医生电话：</span>
        <el-input v-model="query.houDoctorPhone" placeholder="请输入" clearable>
        </el-input>
      </div>
      <div class="form-item">
        <span class="item-label">状态：</span>
        <el-select v-model="query.videoStatusID" placeholder="请选择" filterable clearable>
          <el-option v-for="item in stateOptions" :key="item.videoStatusID" :label="item.videoStatusName" :value="item.videoStatusID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="loadTable">查询</el-button>
      </div>
    </div>

    <base-title name="风湿协诊管理"></base-title>

    <el-table :data="deliveryOrder" :loading="tableLoading" stripe class="mt24">
      <el-table-column prop="doctorName" label="协诊请求人" align="center"></el-table-column>
      <el-table-column prop="doctorPhone" label="协诊请求人联系电话" align="center" width="150px"></el-table-column>
      <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="orderID" label="订单号" width="230" align="center"></el-table-column>
      <el-table-column prop="houDoctorName" label="协诊医生" align="center"></el-table-column>
      <el-table-column prop="requestTime" label="协诊发起时间" align="center"></el-table-column>
      <el-table-column prop="videoStatusName" label="状态" align="center"></el-table-column>
      <el-table-column prop="rp" label="是否开处方" align="center"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" v-if="row.rp === '否'" @click="lookRP(row)">查看详情</span>
            <span class="opt-text" v-if="row.rp === '是'" @click="lookRP(row)">查看处方</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
      <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "coTreatOrder",
  props: {
    sign: {
      type: String,
      required: false
    }
  },
  activated () {
    if (typeof this.sign !== "undefined") {
      if (this.sign === "3") {
        this.loadTable();
      }
    }
  },
  data () {
    return {
      // 条件筛选
      query: {},
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      },
      // 列表数据
      deliveryOrder: [],
      // 状态列表
      stateOptions: [
        { videoStatusID: "", videoStatusName: "全部" },
        { videoStatusID: "0", videoStatusName: "通话中" },
        { videoStatusID: "1", videoStatusName: "已结束" }
      ],
      tableLoading: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    // 获取协诊列表
    loadTable () {
      let params = { ...this.pageInfo, ...this.query };
      this.tableLoading = true;
      this.$_http.get(this.$_API.API_HOU_COTREAT_LIST, { params }).then(res => {
        if (!res.data) return;
        this.deliveryOrder = res.data.datas;
        this.pageInfo = res.data.pageInfo;
        this.tableLoading = false;
      });
    },
    lookRP (row) {
      this.$router.push({
        name: "treatRpAuditDetails",
        params: { orderId: row.orderID, sign: "3" }
      });
    }
  }
};
</script>
