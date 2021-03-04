<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">医生姓名：</span>
        <el-input v-model="query.doctorName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">医生电话：</span>
        <el-input v-model="query.doctorPhone" placeholder="请输入" clearable maxlength="11"/>
      </div>
      <div class="form-item">
        <span class="item-label">患者姓名：</span>
        <el-input v-model="query.patientName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">状态：</span>
        <el-select v-model="rpStatusID" placeholder="请选择" filterable clearable>
          <el-option v-for="item in stateOptions" :key="item.rpStatusID" :label="item.rpStatusName" :value="item.rpStatusID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="loadTable">查询</el-button>
      </div>
    </div>

    <base-title name="风湿处方审核列表"></base-title>

    <el-table :data="tableData" :loading="tableLoading" stripe class="mt24">
      <el-table-column prop="doctorName" label="医生姓名" align="center"></el-table-column>
      <el-table-column prop="doctorPhone" label="医生联系电话" align="center"></el-table-column>
      <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="patientSex" label="患者性别" width="100" align="center">
        <template #default="{row}">{{ row.patientSex | formatSex }}</template>
      </el-table-column>
      <el-table-column prop="patientAge" label="患者年龄" width="100" align="center"></el-table-column>
      <el-table-column prop="kindName" label="诊断结果">
        <template #default="{row}">{{ row | dis }}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="rpStatusName" label="状态" align="center"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" v-if="row.rpStatusID === 0" @click="edit(row)">去审核</span>
            <span class="opt-text" v-if="[1,2].includes(row.rpStatusID)" @click="edit(row)">详情</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable()" @current-change="loadTable()" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "treatRpAudit",
  filters: {
    dis (row) {
      return row.diseaseNameZy + "·" + row.kindName;
    }
  },
  props: {
    sign: {
      type: String,
      required: false
    }
  },
  activated () {
    if (typeof this.sign !== "undefined") {
      if (this.sign === "0") {
        this.loadTable();
      }
    }
  },
  data () {
    return {
      // 查询：所有条件集合
      query: {},
      tableLoading: false,
      rpStatusID: "",
      // 查询：状态下拉集合
      stateOptions: [
        { rpStatusID: "", rpStatusName: "全部" },
        { rpStatusID: 0, rpStatusName: "未审核" },
        { rpStatusID: 1, rpStatusName: "审核通过" },
        { rpStatusID: 2, rpStatusName: "审核不通过" }
      ],
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      },
      tableData: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    loadTable () {
      // 获取处方审核列表  加载数据
      this.query.rpStatusID = this.rpStatusID;
      let hospitalInfo = {
        hospitalID: this.userInfo.orgID
      };
      let params = { ...this.pageInfo, ...this.query, ...hospitalInfo };
      this.tableLoading = true;
      let requests = this.$_http.get(this.$_API.API_HOU_RPORDERS_LIST, {
        params
      });
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
    // 操作：点击【去审核】【详情】按钮
    edit (row) {
      this.$router.push({
        name: "treatRpAuditDetails",
        // 跳转详情界面  传入订单 ID
        params: { orderId: row.keyID, sign: "0" }
      });
    }
  }
};
</script>
