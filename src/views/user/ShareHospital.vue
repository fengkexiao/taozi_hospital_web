<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">医院名称：</span>
        <el-input v-model="query.doctorName" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">所在地：</span>
        <el-cascader v-model="query.phone" :options="placeList" :props="{ checkStrictly: true }" placeholder="请选择" clearable filterable></el-cascader>
      </div>
      <div class="form-item">
        <span class="item-label">医院等级：</span>
        <select-dictionary v-model="query.phone" system-code="MEDICAL" group-code="D_MEDICAL_HOSPITAL_GRADE" />
      </div>
      <div class="form-item">
        <span class="item-label">状态：</span>
        <select-dictionary v-model="query.phone" system-code="MEDICAL" group-code="D_MEDICAL_HOSPITAL_GRADE" />
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="loadTable">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
      </div>
    </div>
    <base-title name="共享医院列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="edit('C')">添加</el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" :loading="tableLoading">
      <el-table-column prop="staffName" label="医院名称" align="center"></el-table-column>
      <el-table-column prop="phone" label="医院等级" align="center"></el-table-column>
      <el-table-column prop="addTime" label="医院性质" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="所在省市" align="center"></el-table-column>
      <el-table-column prop="auditStatusID" label="状态" align="center">
        <template #default="{row}">
          {{ row.auditStatusID | formatStatus }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" v-if="row.auditStatusID === 0" @click="edit('E', row)">修改</span>
            <span class=" opt-text" v-else @click="edit('V', row)">详情</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SelectDictionary from "@/components/SelectDictionary";
import placeList from "@/assets/json/place.json";
const STATUS_LIST = ["待实名认证", "实名认证审核中", "审核通过", "审核不通过"];
export default {
  name: "user-hospital",
  components: {
    SelectDictionary
  },
  filters: {
    // 格式化状态
    formatStatus (val) {
      return STATUS_LIST[val] || "";
    }
  },
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
      placeList
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    // 加载表格
    this.loadTable();
  },
  activated () {
    this.loadTable();
  },
  methods: {
    resetSearchInfo () {
      this.query = {}
    },
    // 获取医院列表数据，加载表格
    loadTable () {
      if (this.tableLoading) {
        return;
      }
      let bizInfo = {
        orgID: this.userInfo.orgID,
        doctorTypeID: 3
      };
      let params = { ...this.pageInfo, ...this.query, ...bizInfo };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_USER_NURSE_LIST, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.tableData = res.data.datas;
          this.pageInfo = res.data.pageInfo;
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 表格数据错误时的处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.loadTable();
    },
    // 操作：点击【添加】、【修改】、【详情】按钮
    edit (mode, row) {
      let keyID = "0";
      if (mode !== "C") {
        if (!row || !row.keyID) {
          this.dataError();
          return;
        }
        keyID = row.keyID;
      }
      this.$router.push({
        name: "user-hospital-edit",
        params: { keyID, mode }
      });
    }
  }
};
</script>
