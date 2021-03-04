<template>
  <div class="medicineBox">
    <el-form id="medicineBox" label-width="120">
      <!-- <el-form-item label="药品处方：" id="medicineList" style="max-width: 100%;min-width: 100%;">
      </el-form-item> -->
      <!-- <el-form-item label="药品处方：">
        <span v-html="medicineName"></span>
      </el-form-item> -->
      <div class="maxwidth">
        <div v-for="(item, index) in medicines" :key="index">
          <div class="font"><span><b>{{item.medicineName}}</b></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{item.specification}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{item.medicineAmount}}{{item.unit}}</span></div>
          <div class="font1">
            <span>用法用量：</span><span class="live">{{item.takeDirection}}，{{item.takeFrequence}}，一次{{item.takeDose}}{{item.formType}}，用药{{item.medicationDays}}天。</span>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["rpDrtail", "medicines"],
  data() {
    return {
      medicineName: ""
    };
  },
  mounted() {
  }
};
</script>

<style lang="scss" scoped>
#medicineList li{
  list-style: none;
}
#medicineBox{
  text-align: left !important;
  display: flex;
  flex-flow:row wrap;
  .el-form-item{
    flex: 1;
    max-width: 50%;
    min-width: 50%;
    margin-bottom: 2px;
  }
  .font {
    font-size: 14px;
    margin-top: 12px;
  }
  .font1 {
    font-size: 14px;
    margin-top: 6px;
    .live {
      margin-left: 20px;
    }
  }
}
</style>
