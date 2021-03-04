<template>
  <div class="app-container base-page " id="doctorOrderDetailBody">
    <base-loading :loading="tableLoading">
    <base-title name="医生预定详情"></base-title>
      <el-form :modal="orderDoctorDetailData" class="mt24 pl24">
        <el-form-item label="医生姓名：">
          <template>{{orderDoctorDetailData.doctorName}}</template>
        </el-form-item>
        <el-form-item label="下单时间：">
          <template>{{orderDoctorDetailData.orderTime}}</template>
        </el-form-item>
        <el-form-item label="患者预约价格（元）：">
          <template>{{orderDoctorDetailData.price / 100}}</template>
        </el-form-item>
        <span id="scheduleBody">
          <el-form ref="formPlan" :modal="scheduleFormData">
            <schedule-calendar v-model="selectedDay" :selected-periods.sync="selectedPeriods" :state-options="stateOptions" :period-options="periodOptions" :disabled-date="disabledDate" class="schedule-calendar" />
          </el-form>
        </span>
        <el-form-item label="上午最多接诊人数：">
          <template>{{orderDoctorDetailData.morningMaxNum}}</template>
        </el-form-item>
        <el-form-item label="上午看诊时间：">
          <template>{{orderDoctorDetailData.morningStartTime}} - {{orderDoctorDetailData.morningEndTime}}</template>
        </el-form-item>
        <el-form-item label="下午最多接诊人数：">
          <template>{{orderDoctorDetailData.afternoonMaxNum}}</template>
        </el-form-item>
        <el-form-item label="下午看诊时间：">
          <template>{{orderDoctorDetailData.afternoonStartTime}} - {{orderDoctorDetailData.afternoonEndTime}}</template>
        </el-form-item>
        <el-form-item label="晚上最多接诊人数：">
          <template>{{orderDoctorDetailData.nightMaxNum}}</template>
        </el-form-item>
        <el-form-item label="晚上看诊时间：">
          <template>{{orderDoctorDetailData.nightStartTime}} - {{orderDoctorDetailData.nightEndTime}}</template>
        </el-form-item>
      </el-form>
      <div class="contain-flex justify-content-center form-input-width mt24">
        <el-button  @click="back">返回</el-button>
      </div>
    </base-loading>
  </div>
</template>

<script>
import ScheduleCalendar from "@/components/schedule-calendar";
export default {
  name: "room-order-detail",
  components: {
    ScheduleCalendar
  },
  props: {
    roomOrderID: {
      type: String,
      required: true
    },
    yearMonth: {
      type: String,
      required: true
    }
  },
  inject: ["close"],
  data () {
    return {
      orderDoctorDetailData: [],
      tableLoading: false,
      // 时段
      scheduleFormData: [],
      // 左侧时段：上下晚
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
      // 选中与否的状态
      stateOptions: [{ stateId: 0, content: "已选", boxContent: "✔️", selectAble: true, className: "is-plan", backgroundColor: "#49d88f", color: "white" }],
      // 指定当前显示的月份
      selectedDay: new Date(),
      disabledDate: date => {
        // 设置不可选
        return true;
      },
      // 选择的日期   ：日期、期间ID【对应periodOptions中的选项索引（0、1、2...）】、当天此期间的状态ID【对应stateOptions中的选项stateId】
      selectedPeriods: [],
      searchState: false
    };
  },
  created () {
    let loadListOne = [this.getOrderDetailFun];
    let loadListTwo = [this.getOrderTimeFun];
    this.$_http.all(...loadListOne, ...loadListTwo).finally(it => {
      this.tableLoading = false;
    });
  },
  activated () {
    if (this.searchState) {
      let loadListOne = [this.getOrderDetailFun];
      let loadListTwo = [this.getOrderTimeFun];
      this.$_http.all(...loadListOne, ...loadListTwo).finally(it => {
        this.tableLoading = false;
      });
    }
  },
  methods: {
    // 查询：预订详情
    getOrderDetailFun () {
      let orderInfo = {
        roomOrderID: this.roomOrderID
      };
      let params = { ...orderInfo };
      this.tableLoading = true;
      let requests = this.$_http.get(this.$_API.INTERFACE_SHARE_ROOM_ORDER_INFO, { params });
      requests.then(res => {
        if (!res.data) return;
        this.orderDoctorDetailData = res.data;
        this.searchState = true;
      });
      return requests;
    },
    // 查询：预订时段
    getOrderTimeFun () {
      let orderInfo = {
        roomOrderID: this.roomOrderID,
        yearMonth: this.yearMonth
      };
      let params = { ...orderInfo };
      this.tableLoading = true;
      let requests = this.$_http.get(this.$_API.INTERFACE_SHARE_ROOM_ORDER_PERIOD, { params });
      requests.then(res => {
        if (!res.data) return;
        let scheduleData = res.data.map(it => {
          return {
            date: it.holdDate,
            period: it.openPeriod,
            stateId: 0,
            keyID: it.keyID
          };
        });
        this.selectedPeriods = scheduleData;
        if (this.selectedPeriods && this.selectedPeriods.length > 0) {
          this.selectedDay = new Date(scheduleData[0].date);
        }
      });
      return requests;
    },
    // 操作：返回医生预订诊室列表页
    back () {
      // 关闭当前页
      this.close().then(() => {
        this.$router.push({
          name: "room-order",
          params: {}
        });
      });
    }
  }
};
</script>

<style lang="scss">
#doctorOrderDetailBody {
  .el-button-group {
    padding-left: 80px;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .el-form-item__label {
    color: black;
  }
  label {
    font-weight: normal;
  }
  .el-form-item__content {
    padding-left: 150px;
    line-height: 30px;
  }
  .el-form-item--medium,
  .el-form-item__label {
    line-height: 30px;
  }
  .el-button--medium {
    margin-top: 20px;
  }
}
#scheduleBody {
  .el-calendar__body {
    padding-bottom: 20px;
  }
  .schedule-calendar {
    max-width: 1000px;
  }
  .form-input-width {
    max-width: 1000px;
  }
  .justify-content-center {
    margin-top: 10px;
  }
}
</style>
