<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">患者姓名：</span>
        <el-input v-model="query.patientName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">患者电话：</span>
        <el-input v-model="query.phone" maxlength="11" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">医生：</span>
        <el-input v-model="query.doctorName" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">IP医生：</span>
        <el-input v-model="query.assistantName" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">问诊状态：</span>
        <el-select v-model="query.inquiryStatus" placeholder="请选择" value="" filterable clearable>
          <el-option v-for="(item,index) in inquiryStateOptions" :key="index" :label="item.statusName" :value="item.statusID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">问诊时间：</span>
        <el-date-picker v-model="inquiryTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getInquiryHistoryListFun">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfoFun">重置</el-button>
      </div>
    </div>
    <base-title name="问诊记录列表"></base-title>
    <el-table :data="inquiryHistoryList" stripe class="mt24">
      <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="phone" label="患者电话" align="center"></el-table-column>
      <el-table-column prop="doctorName" label="医生" align="center"></el-table-column>
      <el-table-column prop="assistantName" label="IP医生" align="center"></el-table-column>
      <el-table-column prop="inquiryStatusName" label="问诊状态" align="center">
        <template #default="{row}">
          <span v-if="row.inquiryStatus === 0">未开始</span>
          <span v-else-if="row.inquiryStatus === 1">问诊中</span>
          <span v-else-if="row.inquiryStatus === 2">问诊结束</span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" align="center" width="155px">
        <template #default="{row}">{{row.startTime | formatDateTime}}</template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" align="center" width="155px">
        <template #default="{row}">{{row.endTime | formatDateTime}}</template>
      </el-table-column>
      <el-table-column label="图文记录" prop="doctorName" align="center" width="130px">
        <template #default="{row}">
          <span style="color: #409EFF;cursor: pointer" @click="chatDetail(row)" v-if="row.historyRecord && row.historyRecord.length > 0">{{row.historyRecord.length}}条记录</span>
          <span v-else>—</span>
        </template>
      </el-table-column>
      <el-table-column label="视频记录" align="center">
        <template #default="{row}">
          <span v-if="row.videoList && row.videoList.length > 0">
            <a :href="item.videoUrl" v-for="(item, index) in row.videoList" :key="index" class="videoUrlA" :title="'点击下载视频'">
              <div>{{item.fileName}}</div>
            </a>
          </span>
          <span v-else>—</span>
        </template>
      </el-table-column>
      <el-table-column label="电话记录" align="center">
        <template #default="{row}">
          <span v-if="row.callList && row.callList.length > 0">
            <a :href="item.remoteFileUrl ? item.remoteFileUrl : (item.fileServer + '/' + item.recordFile)" v-for="(item, index) in row.callList" :key="index" target="_blank" class="videoUrlA" :title="'点击播放录音'">
              <div>{{item.remoteFileName}}</div>
            </a>
          </span>
          <span v-else>—</span>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getInquiryHistoryListFun" @current-change="getInquiryHistoryListFun" />
    <ChatRecord title="图文记录" :inquiryID="inquiryID" :visible.sync="dialogVisible" :patientID="patientID" :patientName="patientName" :doctorStaffID="doctorStaffID" :assistantStaffID="assistantStaffID" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDateTime } from "../../filters";
import ChatRecord from "./ChatRecord";
export default {
  name: "doctor",
  filters: {},
  components: {
    ChatRecord
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      patientID: "",
      inquiryID: "",
      patientName: "",
      query: {
        patientName: "",
        phone: "",
        doctorName: "",
        assistantName: "",
        inquiryStatus: "",
        startTimeFirst: "",
        startTimeSecond: ""
      },
      inquiryTime: [], // 问诊时间范围
      pageInfo: {
        pageSize: 10,
        pageIndex: 1
      },
      initPageInfo: {
        pageSize: 10,
        pageIndex: 1
      },
      formRules: {
        phone: [
          {
            trigger: "blur",
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码（11位）"
          }
        ]
      },
      inquiryStateOptions: [
        { statusID: "", statusName: "全部" },
        { statusID: 0, statusName: "未开始" },
        { statusID: 1, statusName: "问诊中" },
        { statusID: 2, statusName: "问诊结束" }
      ],
      tableLoading: false,
      inquiryHistoryList: [],
      searchState: false,
      dialogVisible: false,
      popHandling: false,
      doctorStaffID: "",
      assistantStaffID: ""
    };
  },
  created () {
  },
  activated () {
    if (this.searchState) {
      this.getInquiryHistoryListFun();
    }
  },
  methods: {
    getInquiryHistoryListFun () {
      // 下单时间（开始、结束）
      if (this.inquiryTime) {
        let inquiryTimeConversion = [];
        this.inquiryTime.forEach((item) => {
          item = formatDateTime(item);
          inquiryTimeConversion.push(item);
        });
        this.query.startTimeFirst = inquiryTimeConversion[0];
        this.query.startTimeSecond = inquiryTimeConversion[1];
      } else {
        this.query.startTimeFirst = "";
        this.query.startTimeSecond = "";
      }
      let params = {
        orgID: this.userInfo.orgID,
        ...this.query,
        pageSize: this.pageInfo.pageSize,
        pageIndex: this.pageInfo.pageIndex
      };
      this.tableLoading = true;
      this.$_http.get(this.$_API.INTERFACE_TMC_GET_INQUIRY_HISTORY, { params }).then(res => {
        if (!res.data) return;
        this.inquiryHistoryList = res.data.datas;
        this.pageInfo = res.data.pageInfo;
        if (res.data.datas.length > 0) {
          this.getPageVideoRecord(res.data.datas);
          this.getPageCallRecord(res.data.datas);
          this.getHistoryRecord(res.data.datas);
        }
        this.searchState = true;
      }).finally(it => {
        this.tableLoading = false;
      });
    },
    // 操作：重置输入框信息
    resetSearchInfoFun () {
      //this.$refs.formInquiry.resetFields();
      this.query = {
        patientName: "",
        phone: "",
        doctorName: "",
        assistantName: "",
        inquiryStatus: "",
        startTimeFirst: "",
        startTimeSecond: ""
      };
      this.inquiryTime = [];
      this.pageInfo.pageSize = this.initPageInfo.pageSize;
      this.pageInfo.pageIndex = this.initPageInfo.pageIndex;
    },
    chatDetail (row) {
      console.log(row);
      this.inquiryID = row.keyID;
      this.patientID = row.patientID;
      this.patientName = row.patientName;
      this.doctorStaffID = row.doctorStaffID;
      this.assistantStaffID = row.assistantStaffID;
      this.dialogVisible = true;
    },
    // 视频记录
    getPageVideoRecord (data) {
      this.tableLoading = true;
      this.$_http.post(this.$_API.INTERFACE_POST_GETPAGEVIDEORECORD, data).then(res => {
        if (!res.data) return;
        this.inquiryHistoryList.forEach(item => {
          for (var i in res.data) {
            if (item.keyID === i) {
              this.$set(item, "videoList", res.data[i]);
            }
          }
        });
      }).finally(it => {
        this.tableLoading = false;
      });
    },
    // 电话记录
    getPageCallRecord (data) {
      this.tableLoading = true;
      this.$_http.post(this.$_API.INTERFACE_POST_GETPAGECALLRECORD, data).then(res => {
        if (!res.data) return;
        this.inquiryHistoryList.forEach(item => {
          for (var j in res.data) {
            if (item.keyID === j) {
              this.$set(item, "callList", res.data[j]);
            }
          }
        });
      }).finally(it => {
        this.tableLoading = false;
      });
    },
    getHistoryRecord (data) {
      this.tableLoading = true;
      let inquiryIDs = [];
      data.forEach(item => {
        inquiryIDs.push(item.keyID);
      });
      let params = {
        pageIndex: 1,
        inquiryIDs: inquiryIDs.toString()
      };
      this.$_http.get(this.$_API.INTERFACE_POST_TMC_FIND_HISTORYMSG, { params }).then(res => {
        console.log(res);
        if (!res.data) return;
        this.inquiryHistoryList.forEach(item => {
          for (var k in res.data) {
            if (item.keyID === k) {
              this.$set(item, "historyRecord", res.data[k]);
            }
          }
        });
      })
        .finally(it => {
          this.tableLoading = false;
        });
    }
  }
};
</script>

<style scoped>
.videoUrlA {
  color: #438bef;
}
</style>
