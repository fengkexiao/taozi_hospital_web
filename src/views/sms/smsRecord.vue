<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">患者姓名：</span>
        <el-input placeholder="请输入" v-model.trim="query.targetUserName" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">手机号：</span>
        <el-input placeholder="请输入" v-model.trim="query.phone" form-type="phone" maxlength="11" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">医生：</span>
        <el-select v-model="query.doctorStaffID" filterable placeholder="请选择" clearable>
          <el-option v-for="(item, index) in doctorList" :key="index" :label="item.doctorName" :value="item.doctorStaffID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">IP医生：</span>
        <el-select v-model="query.assistantStaffID" filterable placeholder="请选择" clearable>
          <el-option v-for="(item, index) in assistantList" :key="index" :label="item.assistantName" :value="item.assistantStaffID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">任务名称：</span>
        <el-input placeholder="请输入" v-model="query.taskName" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">发送状态：</span>
        <el-select v-model="query.sendStatusID" placeholder="请选择" clearable filterable>
          <el-option v-for="(item, index) in publishList" :key="index" :label="item.stateName" :value="item.sendStatusID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">发送时间：</span>
        <el-date-picker clearable v-model="sendTime" type="daterange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      </div>

      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getTableData1stValidate()">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
      </div>
    </div>

    <base-title name="任务记录列表"></base-title>
    <el-table :data="tableData" class="mt24" :loading="tableLoading" stripe>
      <el-table-column prop="targetUserName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="targetUserPhone" label="手机号" align="center"></el-table-column>
      <el-table-column prop="assistantName" label="IP医生" align="center"></el-table-column>
      <el-table-column prop="doctorName" label="医生" align="center"></el-table-column>
      <el-table-column prop="taskName" label="任务名称" align="center"></el-table-column>
      <el-table-column prop="sendTime" label="发送时间" align="center" width="155px">
        <template #default="{row}">
          {{
              row.addTime | formatDateTime
              }}
        </template>
      </el-table-column>
      <el-table-column prop="sendStatusName" label="发送状态" align="center"></el-table-column>
      <el-table-column prop="costNum" label="计费条数" align="center"></el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getTableData" @current-change="getTableData" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDate } from "../../filters";
export default {
  name: "smsRecord",
  filters: {
    formatSection (val) {
      if (val === "") {
        return "全部";
      }
      return val;
    }
  },
  data () {
    return {
      query: {
        targetUserName: "",
        phone: "",
        doctorStaffID: "",
        assistantStaffID: "",
        sendStatusID: "",
        taskName: "",
        taskStartTime: "",
        taskEndTime: ""
      },
      pageInfo: {
        pageSize: 10,
        pageIndex: 1
      },
      taskName: "",
      sendTime: "",
      tableLoading: false,
      tableData: [],
      doctorList: [],
      assistantList: [],
      dialogVisible: false,
      popHandling: false,
      sections: [],
      staffList: [],
      publishList: [
        { sendStatusID: "", stateName: "全部" },
        { sendStatusID: 1, stateName: "发送成功" },
        { sendStatusID: 2, stateName: "发送失败" }
      ]
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    let loadList = [];
    loadList.push(this.initializeDateRegion());
    loadList.push(this.getDoctorListByOrgID());
    loadList.push(this.getSssistantListByOrgID());
    this.$_http.all(...loadList).finally(it => { });
  },
  activated () { },
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
        targetUserName: "",
        phone: "",
        doctorStaffID: "",
        assistantStaffID: "",
        sendStatusID: "",
        taskName: ""
      };
      this.$route.query.taskName = "";
      this.query.taskName = "";
      //this.$refs.queryData.resetFields();
      this.initializeDateRegion();
    },
    initializeDateRegion () {
      let startDate = this.getInstant1st();
      let endDate = new Date();
      this.sendTime = [startDate, endDate];
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
      if (this.sendTime.length > 0) {
        this.createTimesConversion = [];
        this.sendTime.forEach(item => {
          item = formatDate(item);
          this.createTimesConversion.push(item);
        });
        this.query.taskStartTime = this.createTimesConversion[0];
        this.query.taskEndTime = this.createTimesConversion[1];
      } else {
        this.query.taskStartTime = this.dataFunction().beginDate;
        this.query.taskEndTime = this.dataFunction().endDate;
      }
      this.getTableData();
    },
    // 获取记录列表
    getTableData () {
      let bizInfo = {
        orgID: this.userInfo.orgID
      };
      if (
        typeof this.$route.query.taskName !== "undefined" &&
        this.$route.query.taskName !== ""
      ) {
        this.query.taskName = this.$route.query.taskName;
      }
      let params = { ...this.pageInfo, ...this.query, ...bizInfo };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_SMS_RECORDLIST, {
          params
        })
        .then(res => {
          if (!res.data) return;
          res.data.datas.forEach(item => {
            this.doctorList.forEach(it => {
              if (item.belong1ID === it.doctorStaffID) {
                this.$set(item, "doctorName", it.doctorName);
              }
            });
            this.assistantList.forEach(its => {
              if (item.belong2ID === its.assistantStaffID) {
                this.$set(item, "assistantName", its.assistantName);
              }
            });
          });
          this.tableData = res.data.datas;
          this.pageInfo = res.data.pageInfo;
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 获取医院下所有的医生
    getDoctorListByOrgID () {
      let params = {
        orgID: this.userInfo.orgID,
        jobType: 0
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_ASSISTANT_DOCTOR, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.doctorList = res.data;
        });
    },
    // 获取医院下所有的医助
    getSssistantListByOrgID () {
      let params = {
        orgID: this.userInfo.orgID,
        jobType: 1
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_ASSISTANT_DOCTOR, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.assistantList = res.data;
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
