<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">任务名称：</span>
        <el-input placeholder="请输入" v-model="query.taskName" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">任务状态：</span>
        <el-select v-model="query.taskStatusID" placeholder="请选择" clearable filterable>
          <el-option v-for="(item,index) in publishList" :key="index" :label="item.taskStatusName" :value="item.taskStatusID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">发送时间：</span>
        <el-date-picker clearable v-model="sendTime" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getTableData1stValidate()">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
      </div>
    </div>
    <base-title name="任务列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addInquiryCase()">添加</el-button>
    </div>
    <el-table :data="tableData" :loading="tableLoading" stripe>
      <el-table-column prop="taskName" label="任务名称" align="center"></el-table-column>
      <el-table-column prop="taskStatusID" label="任务状态" align="center">
        <template #default="{row}">
          <span v-if="row.taskStatusID === 0 || row.taskStatusID === 1">待发送</span>
          <span v-if="row.taskStatusID === 2 || row.taskStatusID === 3 || row.taskStatusID === 4">发送中</span>
          <span v-if="row.taskStatusID === 5">发送成功</span>
          <span v-if="row.taskStatusID === 6">发送失败</span>
        </template>
      </el-table-column>
      <el-table-column prop="statusRemark" label="状态备注" align="center">
        <template #default="{row}">
          <div v-if="row.statusRemark">{{ row.statusRemark }}</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column prop="sendTime" label="发送时间" align="center" width="155">
        <template #default="{row}">{{ row.sendTime | formatDateTime }}</template>
      </el-table-column>
      <el-table-column prop="smsSend" label="发送条数" align="center"></el-table-column>
      <el-table-column prop="smsSuccess" label="成功条数" align="center"></el-table-column>
      <el-table-column prop="costNum" label="计费条数" align="center"></el-table-column>
      <el-table-column prop="costMoney" label="计费金额" align="center" :show-overflow-tooltip="true">
        <template #default="{row}">{{ row.costMoney | formatMoneyForSumShow }}</template>
      </el-table-column>
      <el-table-column prop="orderStatusName" label="扣费状态" align="center">
        <template #default="{row}">
          <div v-if="row.orderStatusName!=='0'">{{row.orderStatusName}}</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="detail(row)">详情</span>
            <div class="line"></div>
            <span class="opt-text" v-if="row.taskStatusID < 2" @click="edit(row)">修改</span>
            <div class="line"></div>
            <span class="opt-text" @click="copy(row)">复制</span>
            <div class="line"></div>
            <span class="opt-text" v-if="row.taskStatusID === 5" @click="preview(row)">发送记录</span>
            <div class="line"></div>
            <span class="text-danger opt-text" @click="delete1(row)" v-if="row.taskStatusID < 2">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getTableData" @current-change="getTableData" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDate } from "../../filters";
export default {
  name: "smsTask",
  filters: {
    formatSection (val) {
      if (val === "") {
        return "全部";
      }
      return val;
    }
  },
  props: {
    isLoad: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      sendTime: "",
      query: {
        taskName: "",
        taskStatusID: "",
        sendStartTime: "",
        sendEndTime: ""
      },
      pageInfo: {
        pageSize: 10,
        pageIndex: 1
      },
      tableLoading: false,
      tableData: [],
      publishList: [
        { taskStatusID: "", taskStatusName: "全部" },
        { taskStatusID: 1, taskStatusName: "待发送" },
        { taskStatusID: 4, taskStatusName: "发送中" },
        { taskStatusID: 5, taskStatusName: "发送成功" },
        { taskStatusID: 6, taskStatusName: "发送失败" }
      ]
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.initializeDateRegion();
  },
  activated () {
    // if (typeof this.isLoad !== "undefined" && this.isLoad !== "") {
    //   this.getTableData();
    // }
    this.getTableData();
  },
  methods: {
    // 日期方法
    dataFunction () {
      let date = new Date();
      let endDate = formatDate(date);
      let separator = "-";
      let year = date.getFullYear();
      let beginDate = year + separator + "01-01";
      let dataRegion = {};
      dataRegion.beginDate = beginDate;
      dataRegion.endDate = endDate;
      return dataRegion;
    },
    getInstant1st () {
      let date = new Date();
      date.setDate(1);
      date.setHours(0);
      date.setSeconds(0);
      date.setMinutes(0);
      return date;
    },
    // 操作：重置输入框信息
    resetSearchInfo () {
      this.query = {
        taskName: "",
        taskStatusID: ""
      };
      // this.$refs.formOrder.resetFields();
      this.initializeDateRegion();
    },
    initializeDateRegion () {
      let startDate = this.getInstant1st();
      let endDate = new Date();
      this.sendTime = [startDate, endDate];
      this.getTableData1stValidate();
    },
    // 第一步验证表单
    getTableData1stValidate () {
      if (this.sendTime.length === 2) {
        if (
          !(
            this.sendTime[0].getFullYear() === this.sendTime[1].getFullYear() &&
            this.sendTime[0].getMonth() === this.sendTime[1].getMonth()
          )
        ) {
          this.$alert("查询条件中的起始日期应在同一月份", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
        }
      }
      this.getTableData2ndFormatParameter();
    },
    // 第三步 格式化参数
    getTableData2ndFormatParameter () {
      // 下单时间（开始、结束）
      // console.log(this.query.sendStartTime, 222);
      if (this.sendTime.length > 0) {
        this.createTimesConversion = [];
        this.sendTime.forEach(item => {
          item = formatDate(item);
          this.createTimesConversion.push(item);
        });
        this.query.sendStartTime = this.createTimesConversion[0];
        this.query.sendEndTime = this.createTimesConversion[1];
      } else {
        this.query.sendStartTime = this.dataFunction().beginDate;
        this.query.sendEndTime = this.dataFunction().endDate;
      }
      this.query.orgID = this.userInfo.orgID;
      this.getTableData();
    },
    // 获取任务列表
    getTableData () {
      let bizInfo = {
        orgID: this.userInfo.orgID
      };
      let params = { ...this.pageInfo, ...this.query, ...bizInfo };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_SMS_SMSTASKLIST, {
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
    // 添加任务
    addInquiryCase () {
      this.$router.push({
        name: "addSmsTask"
      });
    },
    // 删除任务
    delete1 (row) {
      this.$confirm("确认要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            keyID: row.keyID
          };
          this.$_http
            .post(this.$_API.INTERFACE_POST_SMS_TASK_DELETE, params)
            .then(res => {
              if (!res.data) return;
              this.$_success("删除成功...");
              this.getTableData();
            });
        })
        .catch(() => { });
    },
    // 编辑任务
    edit (row) {
      this.$router.push({
        name: "editSmsTask",
        params: { keyID: row.keyID, isSee: "E" }
      });
    },
    // 详情
    detail (row) {
      this.$router.push({
        name: "detailSmsTask",
        params: { keyID: row.keyID, isSee: "Y" }
      });
    },
    // 复制
    copy (row) {
      this.$router.push({
        name: "copySmsTask",
        params: { keyID: row.keyID, isSee: "C" }
      });
    },
    // 发送记录
    preview (row) {
      this.$router.push({
        name: "smsRecord",
        query: { taskName: row.taskName }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.color-blue {
  color: #438bef;
  font-weight: 800;
}
.right-s {
  float: right;
  margin-right: 10px;
  margin-top: 20px;
}
.name {
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
