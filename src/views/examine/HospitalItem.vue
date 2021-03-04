<template>
  <div class="app-container base-page">
    <div :loading="tableLoading">
      <base-title name="检查项目列表" v-show="showDate"></base-title>
      <el-table :data="getHospitalClassData" stripe v-show="showDate" class="mt24">
        <el-table-column prop="examineClassName" label="检查类型" align="center"></el-table-column>
        <el-table-column prop="statusID" label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.statusID== 0">未启用</span>
            <span v-if="scope.row.statusID== 1">启用</span>
            <span v-if="scope.row.statusID== 2">医院禁用</span>
            <span v-if="scope.row.statusID== 3">禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{row}">
            <div class="option-btn_group">
              <span class="opt-text" @click="toDetail(row)">项目列表</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="showDateForDetail" >
        <base-title name="查询条件"></base-title>
        <div class="base-search_form">
          <div class="form-item">
            <span class="item-label">检查项目：</span>
            <el-input v-model="query.itemName" placeholder="请输入" clearable></el-input>
          </div>
          <div class="form-item">
            <span class="item-label">状态：</span>
            <el-select v-model="query.statusID" placeholder="请选择" value="" filterable clearable>
              <el-option v-for="item in stateOptions" :key="item.statusID" :label="item.statusName" :value="item.statusID"></el-option>
            </el-select>
          </div>
          <div class="form-item">
            <el-button type="primary" icon="el-icon-search" @click="getHospitalItemsData">查询</el-button>
          </div>
          <div class="form-item">
            <el-button icon="el-icon-refresh" @click="resetForDetail">重置</el-button>
          </div>
          <div class="form-item">
            <el-button icon="el-icon-back" @click="goBack">返回</el-button>
          </div>
        </div>
        <base-title name="数据列表"></base-title>
        <el-table :data="hospitalItemsData" stripe class="mt24">
          <el-table-column prop="examineClassName" label="检查类型" align="center"></el-table-column>
          <el-table-column prop="attributeValue" label="检查方法" align="center"></el-table-column>
          <el-table-column prop="examineItemName" label="检查项目" align="center"></el-table-column>
          <el-table-column prop="hisItemCode" label="HIS系统项目编号" align="center"></el-table-column>
          <el-table-column prop="hospitalIncome" label="医院服务费（元）" align="center">
            <template #default="{row}">
              {{ row.hospitalIncome | formatMoney}}
            </template>
          </el-table-column>
          <el-table-column prop="statusID" label="状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.statusID== 0">未启用</span>
              <span v-if="scope.row.statusID== 1">启用</span>
              <span v-if="scope.row.statusID== 2">医院禁用</span>
              <span v-if="scope.row.statusID== 3">禁用</span>
            </template>
          </el-table-column>
        </el-table>
        <base-pagination v-model="pageInfo" @size-change="getHospitalItemsData" @current-change="getHospitalItemsData" />
      </div>
    </div>
  </div>
</template>
<script>
import {
  mapGetters
} from "vuex";

export default {
  name: "examine-hospitalItem",
  inject: ["reload", "close"],
  data () {
    return {
      tableLoading: false,
      getHospitalClassData: [],
      showDate: true,
      showDateForDetail: false,
      hospitalID: "",
      examineClassID: "",
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      },
      query: { itemName: "", statusID: "" },
      stateOptions: [
        { statusID: "", statusName: "全部" },
        { statusID: 1, statusName: "启用" },
        { statusID: 3, statusName: "禁用" }
      ],
      hospitalItemsData: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.hospitalID = this.userInfo.orgID;
    this.getHospitalClass();
  },
  activated () {
    this.getHospitalClass();
  },
  methods: {
    // 查询：加载表格
    getHospitalClass () {
      this.tableLoading = true;
      this.$_http.get(this.$_API.INTERFACE_GET_HOSPITAL_CLASS_LIST + "/" + this.hospitalID).then(res => {
        if (!res.data) return;
        this.getHospitalClassData = res.data;
        // this.pageInfo = res.data.pageInfo;
      }).finally(it => {
        this.tableLoading = false;
      });
    },
    // 查询：加载表格2
    getHospitalItemsData () {
      this.$_http.get(this.$_API.INTERFACE_GET_HOSPITAL_ITEM_BY_PAGE, {
        params: {
          pageSize: this.pageInfo.pageSize,
          pageIndex: this.pageInfo.pageIndex,
          examineClassID: this.examineClassID,
          hospitalID: this.hospitalID,
          examineItemName: this.query.itemName,
          statusID: this.query.statusID
        }
      }).then(response => {
        if (!response.data) return;
        this.hospitalItemsData = response.data.datas;
        this.pageInfo = response.data.pageInfo;
      });
    },
    // // 操作：切换状态
    // toggleBySelf(row, numb) {
    //   if (!row || !row.keyID) {
    //     this.dataError();
    //     return;
    //   }
    //   this.$_http.post(this.$_API.TOGGLE_HOSPITAL_CLASS_BY_SELF, {
    //     keyID: row.keyID,
    //     statusID: numb
    //   }).then(response => {
    //     this.getHospitalClass();
    //     console.log(response);
    //   }).finally(it => {
    //     this.tableLoading = false;
    //   });
    // },
    // 操作：组件跳转=》详情，传递所选行的ID
    toDetail (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.showDate = false;
      this.showDateForDetail = true;
      this.examineClassID = row.examineClassID;
      this.getHospitalItemsData();
    },
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.getHospitalClass();
    },
    // 操作：重置输入框信息
    resetForDetail () {
      this.query = { itemName: "", statusID: "" };
    },
    goBack () {
      this.showDate = true;
      this.showDateForDetail = false;
    }
  }
};
</script>
