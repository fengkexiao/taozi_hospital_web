<template>
  <div style="height: 100%;padding: 10px">
    <base-loading :loading="tableLoading">
      <div id="createTaskBox">
<!--        创建新复诊任务-->
        <div>
          <div class="titleTxt">创建新任务</div>
          <div>
            <el-input class="prePriceInput" v-model.trim="reInquiryDay" placeholder="请输入天数" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" />&nbsp;天后复诊
          </div>
          <div class="btnBox">
            <el-button type="primary"  @click="saveNewTaskFun">保存</el-button>
          </div>
        </div>
<!--        历史复诊任务-->
        <div class="historyTaskBox">
          <div class="titleTxt">历史复诊任务</div>
            <div>
              <div v-if="taskListData.length === 0" class="noData">暂无数据</div>
              <ul v-else class="el-timeline is-reverse">
                <li class="el-timeline-item" v-for="(item, index) in taskListData" :key="index">
                  <div class="taskCreateTimeTxt">{{item.reInquiryDate}}</div>
                  <div class="el-timeline-item__tail"></div>
                  <div class="el-timeline-item__node el-timeline-item__node--normal el-timeline-item__node--"></div>
                  <div class="el-timeline-item__wrapper">
                    <div v-if="item.reInquiryStatus === 0" class="el-timeline-item__content taskContentTxt taskContentTxtNo">未复诊</div>
                    <div v-else-if="item.reInquiryStatus === 1" class="el-timeline-item__content taskContentTxt">已复诊</div>
                    <div v-if="item.assistantName && item.assistantName.length > 0" class="el-timeline-item__timestamp is-bottom docAssistantName">{{item.assistantName}}&nbsp;创建于 {{item.addTime | formatDateTime}}</div>
                    <div v-else-if="item.doctorName && item.doctorName.length > 0" class="el-timeline-item__timestamp is-bottom docAssistantName">{{item.doctorName}}&nbsp;创建于 {{item.addTime | formatDateTime}}</div>
                  </div>
                </li>
              </ul>
            </div>
        </div>
      </div>
    </base-loading>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDate, formatDateTime } from "../../../filters";
export default {
  name: "TMCInquiry-regularReturnVisitCreate",
  filters: {
    formatDate,
    formatDateTime
  },
  data() {
    return {
      patientID: "",
      inquiryID: "",
      tableLoading: false,
      taskListData: [],
      reInquiryDay: "", // 多少天后复诊
      reInquiryDate: "" // 计算得出的复诊日期
    };
  },
  computed: {
    ...mapGetters(["userInfo", "tmc"])
  },
  created() {
    if (this.tmc.patientID) {
      this.getHistoryTaskListDataFun();
    }
  },
  activated() {
    if (this.tmc.patientID) {
      this.getHistoryTaskListDataFun();
    }
  },
  methods: {
    // 查询：历史复诊任务列表
    getHistoryTaskListDataFun() {
      let params = {
        patientID: this.tmc.patientID,
        orgID: this.userInfo.orgID
      };
      this.$_http.get(this.$_API.INTERFACE_TMC_GET_TASK_LIST, { params }).then(res => {
        if (res.data && res.data.length > 0) {
          this.taskListData = res.data;
          // this.changeTaskListDataFun();
        } else {
          this.taskListData = [];
        }
      });
    },
    // 转换：复诊日期
    changeTaskListDataFun() {
      this.taskListData.forEach(item => {
        let yearMonthDay = this.changeDateFun(item.reInquiryDate);
        this.$set(item, "yearMonthDay", yearMonthDay);
      });
    },
    // 操作：创建复诊任务
    saveNewTaskFun() {
      if (this.tableLoading) {
        return;
      }
      if (!this.reInquiryDay || Number(this.reInquiryDay) < 0) {
        this.$notify.error({
          title: "提示",
          message: "请输入 >=1 的整数天数"
        });
        return;
      }
      this.reInquiryDate = this.getAfterDateFun(this.reInquiryDay);
      let data = {
        orgID: this.userInfo.orgID,
        patientID: this.tmc.patientID,
        inquiryID: this.tmc.inquiryID,
        reInquiryDate: this.reInquiryDate,
        doctorStaffID: "",
        doctorName: "",
        assistantStaffID: "",
        assistantName: ""
      };
      if (this.userInfo.jobType === 0) {
        data.doctorStaffID = this.tmc.doctorStaffID;
        data.doctorName = this.tmc.doctorName;
      } else if (this.userInfo.jobType === 1) {
        data.assistantStaffID = this.tmc.assistantStaffID;
        data.assistantName = this.tmc.assistantName;
      }
      this.$confirm("确认新建复诊任务吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.tableLoading = true;
        this.$_http.post(this.$_API.INTERFACE_TMC_POST_TASK_ADD, data).then(res => {
          this.$notify({
            title: "成功",
            message: "新建复诊任务成功",
            type: "success"
          });
          this.getHistoryTaskListDataFun();
        }).finally(it => {
          this.tableLoading = false;
        });
      }).catch(() => {
        this.tableLoading = false;
        this.$notify.info({
          title: "已取消",
          message: "已取消新建复诊任务"
        });
      });
    },
    // 转换：日期为xxxx年x月x日
    changeDateFun(dateTime) {
      let date = new Date(dateTime);
      let m = date.getMonth() + 1;
      m = m < 10 ? ("0" + m) : m;
      let d = date.getDate();
      d = d < 10 ? ("0" + d) : d;
      let yearMonthDay = date.getFullYear() + "年" + m + "月" + d + "日";
      return yearMonthDay;
    },
    // 计算：N天之后的日期
    getAfterDateFun(days) {
      let dateTemps = formatDate(new Date());
      let dateTemp = dateTemps.split("-");
      let nDate = new Date(dateTemp[1] + "-" + dateTemp[2] + "-" + dateTemp[0]); // 转换为MM-DD-YYYY格式
      let millSeconds = Math.abs(nDate) + (days * 24 * 60 * 60 * 1000);
      let rDate = new Date(millSeconds);
      let year = rDate.getFullYear();
      let month = rDate.getMonth() + 1;
      if (month < 10) month = "0" + month;
      let date = rDate.getDate();
      if (date < 10) date = "0" + date;
      return (year + "-" + month + "-" + date);
    },
    // 计算：两个日期的天数差(日期格式：2006-12-18)
    dateDifferenceFun(reInquiryDate) {
      let sDate1 = Date.parse(formatDate(new Date()));
      let sDate2 = Date.parse(formatDate(reInquiryDate));
      let dateSpan = sDate2 - sDate1;
      dateSpan = Math.abs(dateSpan);
      let reInquiryDay = Math.floor(dateSpan / (24 * 60 * 60 * 1000));
      return reInquiryDay;
    }
  }
};
</script>

<style lang="scss" scoped>

.app-container {
  width: 460px;
}
.noData {
  color: #787878;
  margin-top: 15px;
  text-align: center;
}
#createTaskBox {
  font-size:14px;
  .titleTxt {
    margin-bottom: 10px;
    color: #555658;
  }
  input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /*** 消除input元素 type="number" 时默认的 加减按钮---moz版*/
  input[type=number] {
    -moz-appearance:textfield;
  }
  .prePriceInput {
    margin-right: 10px;
    border-radius: 5px;
    //border: 1px solid #D9D9D9;
    width: 320px;
    height: 34px;
    padding-left: 10px;
    padding-right: 10px;
    // font-size: 16px;
    color: #555658;
  }
  .btnBox {
    width: 100%;
    height: 90px;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .historyTaskBox {
    margin-top: 10px;
    ul {
      padding-left: 95px;
      .el-timeline-item__node--normal {
        left: 1px;
        top: 3px;
        width: 8px;
        height: 8px;
      }
      .el-timeline-item__tail {
        top: 3px;
      }
    }
    .taskCreateTimeTxt {
      position: absolute;
      left: -95px;
      top: 0;
      font-size: 12px;
      color: rgba(0,0,0,0.65);
    }
    .taskContentTxt {
      font-size: 14px;
      color: rgba(0,0,0,0.85);
    }
    .taskContentTxtNo {
      font-size:12px;
      color: #FE5853;
    }
    .docAssistantName {
      font-size: 12px;
      color: rgba(0,0,0,0.65);
    }
  }
}
</style>
