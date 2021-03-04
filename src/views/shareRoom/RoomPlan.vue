<template>
  <div class="app-container base-page">
    <base-loading :loading="screenLoading">
    <base-title name="设置排期"></base-title>
      <el-form ref="formPlan" :model="formData" label-width="100px" class="pl24 mt24">
        <el-form-item label="共享排期：" class="form-required">
          <schedule-calendar v-model="selectedDay" :selected-periods.sync="selectedPeriods" :state-options="stateOptions" :period-options="periodOptions" :display-options="displayOptions" :disabled-date="disabledDate" class="schedule-calendar" />
        </el-form-item>
      </el-form>
    </base-loading>
    <div class="contain-flex justify-content-center form-input-width">
      <el-button @click="back">返回</el-button>
      <span></span>
      <el-button type="primary" :loading="screenLoading" class="margin-left-40" @click="savePlan">保存</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ScheduleCalendar from "@/components/schedule-calendar";
import { formatDate } from "../../filters";
export default {
  name: "room-manage-plan",
  components: {
    ScheduleCalendar
  },
  inject: ["close"],
  props: {
    // 查询主键
    keyID: {
      type: String,
      required: true
    },
    // 房间名称
    roomName: {
      type: String,
      required: true
    }
  },
  filters: {
    formatDate
  },
  data () {
    return {
      screenLoading: false,
      formData: {},
      selectedDay: new Date(),
      stateOptions: [
        {
          stateId: 0,
          content: "已选",
          boxContent: "✔️",
          selectAble: true,
          className: "is-plan",
          backgroundColor: "#49d88f",
          color: "white"
        },
        {
          stateId: 1,
          content: "预订审核中",
          selectAble: false,
          className: "is-order",
          backgroundColor: "#3e88f2"
        },
        {
          stateId: 2,
          content: "已预订",
          selectAble: false,
          className: "is-order",
          backgroundColor: "#3e88f2"
        },
        {
          stateId: -1,
          content: "过期不可订",
          selectAble: false,
          className: "is-disabled",
          backgroundColor: "#f5f7fa"
        }
      ],
      periodOptions: [
        {
          label: "上午",
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
      displayOptions: ["all", "inverse"],
      disabledDate: date => {
        let dateYear = (new Date(date)).getFullYear();
        let dateMonth = (new Date(date)).getMonth();
        let nowDateMonth = (new Date()).getMonth();
        let nowDateYear = (new Date()).getFullYear();
        let isDisableBox = true;
        // 设置过期不可选
        if (dateYear === nowDateYear) {
          if (dateMonth === nowDateMonth) {
            if (date >= (new Date())) {
              isDisableBox = false;
            }
          } else if (dateMonth === (nowDateMonth + 1)) {
            isDisableBox = false;
          }
        } else if (dateYear === (nowDateYear + 1)) {
          if (dateMonth === 0 && nowDateMonth === 11) {
            isDisableBox = false;
          }
        }
        return isDisableBox;
      },
      // 选中的排期
      selectedPeriods: [],
      // 查询出的排期
      oldSelectedPeriods: [],
      // 选择的年月
      current: {
        year: "2019",
        month: 9
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth();
    this.current.year = y;
    this.current.month = m;
    this.loadPlan();
  },
  methods: {
    // 加载该月已排期的数据
    loadPlan () {
      this.screenLoading = true;
      let params = {
        roomID: this.keyID,
        doctorID: this.userInfo.keyID,
        yearMonth: ""
      };
      let m = this.current.month + 1;
      m = m < 10 ? ("0" + m) : m;
      params.yearMonth = this.current.year + "-" + m + "-01 00:00:00";
      this.$_http.get(this.$_API.INTERFACE_SHARE_ROOM_PLAN_GET, { params }).then(res => {
        if (!res.data.roomPlans) {
          return;
        }
        let schedule = res.data.roomPlans.map(it => {
          let nowYearMonthDay = formatDate(new Date());
          if (it.openDate < nowYearMonthDay) {
            return {
              date: it.openDate,
              period: it.openPeriod,
              stateId: -1,
              keyID: it.keyID
            };
          } else {
            return {
              date: it.openDate,
              period: it.openPeriod,
              stateId: it.roomStatus,
              keyID: it.keyID
            };
          }
        });
        let params = {
          roomID: this.keyID,
          doctorID: this.userInfo.keyID,
          yearMonth: ""
        };
        let m = this.current.month;
        if (m === 11) {
          this.current.year = this.current.year + 1;
          m = 1;
        } else {
          m = m + 2;
        }
        m = m < 10 ? ("0" + m) : m;
        params.yearMonth = this.current.year + "-" + m + "-01 00:00:00";
        this.$_http.get(this.$_API.INTERFACE_SHARE_ROOM_PLAN_GET, { params }).then(res => {
          if (!res.data.roomPlans) {
            return;
          }
          let scheduleTwo = res.data.roomPlans.map(it => {
            return {
              date: it.openDate,
              period: it.openPeriod,
              stateId: it.roomStatus,
              keyID: it.keyID
            };
          });
          this.selectedPeriods.push(...schedule, ...scheduleTwo);
          this.oldSelectedPeriods.push(...schedule, ...scheduleTwo);
        }).finally(() => {
          this.screenLoading = false;
        });
      });
    },
    // 返回列表页
    back () {
      // 关闭当前页
      this.close().then(() => {
        this.$router.push("/shareroom/hospitalRoom");
      });
    },
    // 保存诊室排期信息
    savePlan () {
      let tempOld = JSON.parse(JSON.stringify(this.oldSelectedPeriods));
      let temp = JSON.parse(JSON.stringify(this.selectedPeriods));
      let tempNow = [];
      temp.forEach(itOne => {
        let isHave = false;
        tempOld.forEach(itTwo => {
          if (itOne.date === itTwo.date && itOne.period === itTwo.period) {
            isHave = true;
          }
        });
        if (!isHave) {
          if (itOne.keyID) {
            itOne.isDeleteAx = 1;
          } else {
            itOne.isDeleteAx = -1;
          }
          tempNow.push(itOne);
        }
      });
      tempOld.forEach(itTwo => {
        let isHave = false;
        temp.forEach(itOne => {
          if (itTwo.date === itOne.date && itTwo.period === itOne.period) {
            isHave = true;
          }
        });
        if (!isHave) {
          if (itTwo.keyID) {
            itTwo.isDeleteAx = 1;
          } else {
            itTwo.isDeleteAx = -1;
          }
          tempNow.push(itTwo);
        }
      });
      let selectedDateMonth = this.selectedDay.getMonth() + 1;
      let data = [];
      tempNow.forEach(it => {
        let secDateMonth = new Date(it.date).getMonth() + 1;
        if (secDateMonth === selectedDateMonth) {
          let obj = {
            hospitalID: this.userInfo.orgID,
            hospitalName: this.userInfo.orgName,
            roomID: this.keyID,
            roomName: this.roomName,
            openDate: it.date,
            openPeriod: it.period,
            isDelete: it.isDeleteAx
          };
          if (it.keyID) {
            obj.keyID = it.keyID;
          } else {
            obj.keyID = "";
          }
          data.push(obj);
        }
      });
      this.$_http.post(this.$_API.INTERFACE_SHARE_ROOM_PLAN_SAVE, data).then(res => {
        this.$_success("保存诊室" + selectedDateMonth + "月排期成功");
        // 返回列表页
        this.back();
      });
    },
    savaPlan () {
      let temp = JSON.parse(JSON.stringify(this.selectedPeriods));
      let selectedDateMonth = this.selectedDay.getMonth() + 1;
      let data = [];
      temp.forEach(it => {
        let secDateMonth = new Date(it.date).getMonth() + 1;
        if (secDateMonth === selectedDateMonth) {
          let obj = {
            keyID: it.keyID,
            hospitalID: this.userInfo.orgID,
            hospitalName: this.userInfo.orgName,
            roomID: this.keyID,
            roomName: this.roomName,
            openDate: it.date,
            openPeriod: it.period
          };
          data.push(obj);
        }
      });
      this.$_http.post(this.$_API.INTERFACE_SHARE_ROOM_PLAN_SAVE, data).then(res => {
        this.$_success("保存诊室排期成功");
        // 返回列表页
        this.back();
      });
    }
  }
};
</script>
<style lang="scss">
.schedule-calendar {
  max-width: 1000px;
}
.form-input-width {
  max-width: 1000px;
}
</style>
