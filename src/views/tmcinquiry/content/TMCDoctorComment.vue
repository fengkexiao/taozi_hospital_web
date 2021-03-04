<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">医生：</span>
        <el-select v-model="query.doctorStaffID" placeholder="请选择" clearable filterable>
          <el-option v-for="(item,index) in doctorList" :key="index" :label="item.staffName" :value="item.keyID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">患者：</span>
        <el-input placeholder="请输入" v-model="query.patientName" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">所患疾病：</span>
        <el-input placeholder="请输入" v-model="query.disease" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">评价等级：</span>
        <el-select v-model="query.generalCommentName" placeholder="请选择" clearable filterable>
          <el-option v-for="(item,index) in commentLevelOption" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">审核状态：</span>
        <el-select v-model="query.isReviewName" placeholder="请选择" clearable filterable>
          <el-option v-for="(item,index) in reviewOption" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">评价时间：</span>
        <el-date-picker v-model="reviewTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getTableData()">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
      </div>
    </div>
    <base-title name="患者评价列表"></base-title>
    <el-table :data="tableData" class="mt24" :loading="tableLoading" stripe>
      <el-table-column prop="orderID" label="订单号" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="doctorName" label="医生姓名" align="center"></el-table-column>
      <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="disease" label="所患疾病" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="generalCommentName" label="评价等级" align="center"></el-table-column>
      <el-table-column prop="content" label="内容摘要" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="isReviewName" label="审核状态" align="center"></el-table-column>
      <el-table-column prop="addTime" label="评价时间" align="center" width="155px">
        <template #default="{row}">{{row.addTime|formatDateTime}}</template>
      </el-table-column>
      <el-table-column prop="1" label="操作" align="center" width="250">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="toTop(row,1)" v-if="row.isTop===0">置顶</span>
            <span class="text-danger opt-text" @click="toTop(row,0)" v-if="row.isTop===1">取消置顶</span>
            <div class="line"></div>
            <span class="opt-text" @click="commentDetail(row)">详情</span>
            <div class="line"></div>
            <span class="text-danger opt-text" @click="deleteComment(row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" background @size-change="getTableData" @current-change="getTableData" />
  </div>
</template>

<script>
import { formatDate } from "../../../filters";
import { mapGetters } from "vuex";
export default {
  name: "content-tmcDoctorComment",
  data () {
    return {
      tableData: [],
      tableLoading: false,
      doctorList: [],
      query: {},
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      },
      reviewTime: [],
      // 评价等级选项
      commentLevelOption: [
        { value: null, name: "所有" },
        {
          value: "满意",
          name: "满意"
        },
        {
          value: "不满意",
          name: "不满意"
        }
      ],
      // 审核状态选项
      reviewOption: [
        { value: null, name: "所有" },
        { value: "未审核", name: "未审核" },
        { value: "审核通过", name: "审核通过" },
        { value: "审核不通过", name: "审核不通过" }
      ]
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  activated () {
    this.getTableData();
  },
  watch: {},
  created () {
    this.getOrgDoctorList();
    this.getTableData();
  },
  methods: {
    // 查询机构医生列表
    getOrgDoctorList () {
      // jobType 0查询医生 1查询医助
      let params = { orgID: this.userInfo.orgID, jobType: 0 };
      // console.log("--查询医生参数--" + JSON.stringify(params));
      this.$_http
        .get(this.$_API.INTERFACE_USER_GET_ORG_DOCTOR_LIST, { params })
        .then(res => {
          // console.log("--查询医生结果--" + JSON.stringify(res));
          this.doctorList = res.data;
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 查询评价列表
    getTableData () {
      if (this.tableLoading) {
        return;
      }
      let startTime = formatDate(this.reviewTime[0]);
      let endTime = formatDate(this.reviewTime[1]);
      let params = {
        ...this.pageInfo,
        ...this.query,
        orgID: this.userInfo.orgID,
        startTime,
        endTime
      };
      // console.log("查询参数----" + JSON.stringify(params));
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_PATIENT_COMMENT, {
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
    // 重置查询条件
    resetSearchInfo () {
      this.query = {};
      this.reviewTime = [];
    },
    handleSizeChange (val) {
      this.pageInfo.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange (val) {
      this.pageInfo.pageIndex = val;
      this.getTableData();
    },
    // option 置顶 0 不置顶 1 置顶
    toTop (item, option) {
      let params = {
        keyID: item.keyID,
        isTop: option,
        isReviewID: 1,
        orgID: this.userInfo.orgID
      };
      console.log("--置顶参数--" + JSON.stringify(params));
      this.$_http
        .post(this.$_API.INTERFACE_TMC_TOP_PATIENT_COMMENT, params)
        .then(res => {
          this.getTableData();
        })
        .finally(it => { });
    },
    // 详情
    commentDetail (orderComment) {
      console.log("-------" + JSON.stringify(orderComment));
      this.$router.push({
        name: "TMCInquiry-commentDetail",
        params: { keyID: orderComment.keyID }
      });
    },
    // 删除
    deleteComment (item) {
      this.$confirm("确认要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = { keyID: item.keyID, orgID: this.userInfo.orgID };
          this.$_http
            .post(this.$_API.INTERFACE_TMC_DELETE_PATIENT_COMMENT, params)
            .then(res => {
              this.getTableData();
            })
            .finally(it => {
              this.tableLoading = false;
            });
        })
        .catch(() => { });
    }
  }
};
</script>

<style lang="scss" scoped>
#patientFormDiv {
  .el-form--inline .el-form-item {
    margin-right: 0;
  }
  .el-form-item__label {
    /*input输入框标题文本调整*/
    text-align: left;
  }
  .el-form-item__content {
    .el-input,
    .el-textarea {
      /*input输入框宽度调整*/
      width: 300px;
      max-width: 300px;
    }
    .el-select {
      /*div的宽度调整有效*/
      width: 300px;
      max-width: none;
      .el-input {
        /*选择框的宽度调整《无效果。。。》*/
        width: 300px;
        max-width: none;
      }
    }
  }
  .inputUnit {
    position: absolute;
    right: 10px;
    top: 0;
    color: #868888;
  }
}
</style>
