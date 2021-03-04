<template>
  <div class="app-container base-page" id="PractiseOnInternetScheduleBody">
    <div style="text-align: center;padding-top: 24px">
      <el-button @click="back">返回</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
    <schedule-calendar v-model="selectedDay" :selected-periods.sync="selectedPeriods" :state-options="stateOptions" :period-options="periodOptions" :display-options="displayOptions" :disabled-date="disabledDate" class="schedule-calendar" />
  </div>
</template>

<script>
import ScheduleCalendar from "@/components/schedule-calendar";
import InputWithTip from "@/components/InputWithTip";
import { mapGetters } from "vuex";
import { formatDate } from "../../filters";

export default {
  name: "PractiseOnInternetSchedule",
  props: {
    keyID: {
      type: String,
      required: true
    }
  },
  inject: ["reload", "close"],
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InputWithTip,
    ScheduleCalendar
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      originalDate: [],
      selectedDay: new Date(),
      currencyTimeSettingData: [],
      // 状态选项，根据提供的选项值，不同的单元格会显示不同的效果
      stateOptions: [
        {
          // 状态id, 必填项
          stateId: 0,
          // 状态名称
          content: "当前操作",
          // 单元格的内容
          boxContent: "✔",
          // 是否可选（通过点击可改变状态）
          selectAble: true,
          // 需要添加的样式名称，若是禁用项，则要添加样式“is-disabled”
          className: "is-plan",
          // 该状态下的单元格显示的背景色
          backgroundColor: "#fff112",
          // 该状态下的单元格显示的文字的颜色
          color: "red"
        },
        {
          stateId: -1,
          content: "过期不可操作",
          selectAble: false,
          // is-disabled表示禁用
          className: "is-disabled",
          backgroundColor: "#f5f7fa"
        }
      ],
      // 期间选项，示例展示默认选项
      periodOptions: [
        {
          // 期间的名称
          label: "上午",
          // 期间的范围，time之前
          time: "12:00:00"
        },
        {
          label: "下午",
          time: "17:00:00"
        },
        {
          label: "晚上",
          time: "22:00:00"
        }
      ],
      // 日历按钮选项，all->全选/取消全选；inverse->反选。默认都不显示
      displayOptions: [],
      disabledDate: date => {
        let year = this.selectedDay.getFullYear();
        let month = this.selectedDay.getMonth();
        let minDate = new Date(year, month, 1, 0, 0);
        let maxDate = new Date(year, month + 1, 0, 23, 59);
        let nowDate = new Date();
        let nowYear = nowDate.getFullYear();
        let nowMonth = nowDate.getMonth();
        let lowest = new Date(nowYear, nowMonth, 1, 0, 0);
        let supreme = new Date(nowYear, nowMonth + 2, 0, 23, 59);
        return date < minDate || date > maxDate || date < lowest || date > supreme;
      },
      // 选择的日期集合
      selectedPeriods: [],
      doctorScheduleOriginal: []
    };
  },
  created () {
    this.currencyTimeSet();
    this.getDocSchedule();
  },
  activated () {
  },
  methods: {
    save () {
      let resultTemp = this.getCurrentMonth(this.selectedPeriods);
      console.log(resultTemp);
      let originalDate = this.getCurrentMonth(this.originalDate);
      console.log(originalDate);
      let neverChage = [];
      let addDate = [];
      let deleteDate = [];
      resultTemp.forEach(item => {
        let number = originalDate.findIndex((element) =>
          (element.date === item.date && element.period === item.period && element.stateId === item.stateId)
        );
        if (number !== -1) {
          neverChage.push(item);
        } else {
          addDate.push(item);
        }
      });
      originalDate.forEach(item => {
        let number = neverChage.findIndex((element) =>
          (element.date === item.date && element.period === item.period && element.stateId === item.stateId)
        );
        if (number === -1) {
          deleteDate.push(item);
        }
      });
      let addData = this.dataConversion(addDate);
      let deleteDataTemp = this.dataConversion(deleteDate);
      let deleteData = [];
      let deleteIDList = [];
      deleteDataTemp.forEach(item => {
        this.doctorScheduleOriginal.forEach(itemOriginal => {
          if (item.scheduleDate === itemOriginal.scheduleDate && item.baseScheduleID === itemOriginal.baseScheduleID) {
            let newItem = JSON.parse(JSON.stringify(item));
            let keyID = itemOriginal.keyID;
            newItem.keyID = keyID;
            deleteIDList.push(keyID);
            deleteData.push(newItem);
          }
        });
      });
      let params = {
        addSchedule: addData,
        deleteDList: deleteIDList,
        hospitalID: this.userInfo.orgID,
        doctorID: this.keyID
      };
      this.$_http.post(this.$_API.INTERFACE_YUNINQUIR_SAVE_DOCTOR_PRACTISE_ON_INTERNET_SCHEDULE, params).then(res => {
        if (res.data === "成功") {
          this.$message({
            message: "网上坐诊排班保存成功",
            type: "success"
          });
          this.reload();
          this.back();
        }
      });
    },
    getCurrentMonth (periods) {
      let year = this.selectedDay.getFullYear();
      let month = this.selectedDay.getMonth();
      if (month + 1 < 10) {
        month = "0" + (month + 1);
      } else {
        month = (month + 1) + "";
      }
      let currentMonthString = year + "-" + month;

      console.log("currentMonthString=");
      console.log(currentMonthString);
      let result = [];
      periods.forEach(period => {
        if (period.date.substr(0, 7) === currentMonthString) {
          let item = JSON.parse(JSON.stringify(period));
          result.push(item);
        }
      });
      return result;
    },

    dataConversion (array) {
      let newArray = [];
      array.forEach(item => {
        let pojo = {
          hospitalID: this.userInfo.orgID,
          doctorID: this.keyID,
          addUser: this.userInfo.staffName,
          scheduleDate: item.date,
          startTime: this.periodOptions[item.period].startTime,
          endTime: this.periodOptions[item.period].time,
          baseScheduleTitle: this.periodOptions[item.period].label,
          baseScheduleID: this.periodOptions[item.period].keyID
        };
        newArray.push(pojo);
      });
      return newArray;
    },

    back () {
      this.close().then(() => {
        this.$router.push({
          name: "DutyPlanForYunInquiry"
        });
      });
    },
    currencyTimeSet () {
      this.$_http.get(this.$_API.INTERFACE_YUNINQUIR_GET_BASE_SCHEDULE, {
        params: {
          hospitalID: this.userInfo.orgID
        }
      }).then(response => {
        let data = response.data;
        if (!data) return;
        this.periodOptions = [];
        let periodOptionsTemp = [];
        data.forEach(item => {
          let temp = {
            label: item.title,
            keyID: item.keyID,
            time: item.endTime,
            startTime: item.startTime
          };
          periodOptionsTemp.push(temp);
        });
        this.periodOptions = periodOptionsTemp;
      });
    },
    getDocSchedule () {
      this.$_http.get(this.$_API.INTERFACE_YUNINQUIR_GET_DOC_SCHEDULE, {
        params: {
          hospitalID: this.userInfo.orgID,
          scheduleTime: formatDate(new Date()).substr(0, 7),
          doctorID: this.keyID
        }
      }).then(res => {
        let data = res.data;
        let nextMonth = new Date().getMonth() + 1;
        this.$_http.get(this.$_API.INTERFACE_YUNINQUIR_GET_DOC_SCHEDULE, {
          params: {
            hospitalID: this.userInfo.orgID,
            scheduleTime: formatDate(new Date().setMonth(nextMonth)).substr(0, 7),
            doctorID: this.keyID
          }
        }).then(response => {
          data.push(...response.data);
          console.log(data);
          this.doctorScheduleOriginal = JSON.parse(JSON.stringify(data));
          let temp = [];
          data.forEach(item => {
            this.periodOptions.forEach((option, index) => {
              if (option.keyID === item.baseScheduleID) {
                let newItem = {
                  date: item.scheduleDate,
                  period: index,
                  stateId: 0
                };
                temp.push(newItem);
              }
            });
          });
          this.originalDate = JSON.parse(JSON.stringify(temp));
          this.selectedPeriods = temp;
        });
      });
    }

  }
};
</script>

<style scoped>
</style>
