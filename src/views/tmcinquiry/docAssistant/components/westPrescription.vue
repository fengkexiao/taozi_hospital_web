<template>
  <div >
    <el-form id="medicineBox" label-width="120">
      <el-form-item label="诊断：" style="max-width: 100%;min-width: 100%;">
        <span class="underline1">{{diagnosis || "无"}}</span>
      </el-form-item>
      <el-form-item label="过敏史：">
        <span class="underline" v-if="!patientInfo.historyOfAllergy">无</span>
        <span class="underline" v-else>{{patientInfo.historyOfAllergy}}</span>
      </el-form-item>
      <el-form-item label="肝功能：">
        <span class="underline">{{patientInfo.liver || "无"}}</span>
      </el-form-item>
      <el-form-item label="既往病史：">
        <span class="underline" v-if="!patientInfo.historyOfSickness">无</span>
        <span class="underline" v-else>{{patientInfo.historyOfSickness}}</span>
      </el-form-item>
      <el-form-item label="肾功能：">
        <span class="underline2">{{patientInfo.renal || "无"}}</span>
      </el-form-item>
      <el-form-item label="妊娠哺乳：" v-if="patientInfo.sex === 2">
        <span class="underline">{{patientInfo.pregnancy}}</span>
      </el-form-item>
      <el-form-item label="开方时间：">
        <span class="underline">{{time}}</span>
      </el-form-item>
    </el-form>
    <div class="maxwidth">
      <h3>Rp</h3>
<!--      medicines-->
      <div v-for="(item, index) in medicines" :key="index" style="margin-top: 10px;">
        <div class="font"><span><b>{{item.medicineName}}</b></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{item.specification}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{item.medicineAmount}}{{item.unit}}</span></div>
        <div class="font1">
          <span>用法用量：</span><span class="live">{{item.takeDirection }}，{{item.takeFrequence}}，一次{{item.takeDose}}{{item.formType}}，用药{{item.medicationDays}}天。</span>
        </div>
      </div>
      <div>
        <p class="bottom">&nbsp;&nbsp;</p>
        <p>医嘱：{{rpAdvice || '无'}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["patientInfo", "medicines", "diagnosis","rpAdvice","time"]
};
</script>

<style lang="scss" scoped>
#medicineList li {
  list-style: none;
}
#medicineBox {
  text-align: left !important;
  display: flex;
  flex-flow: row wrap;
  .el-form-item {
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
.underline {
  width: 250px;
  display: inline-block;
  border-bottom: 1px solid black;
  word-wrap: break-word;
}
.underline2 {
  width: 263px;
  display: inline-block;
  border-bottom: 1px solid black;
  word-wrap: break-word;
}
.underline1 {
  width: 610px;
  display: inline-block;
  border-bottom: 1px solid black;
  word-wrap: break-word;
}
.maxwidth {
  min-height: 120px;
  text-align: left;
}
.bottom {
  border-bottom: 1px solid black;
  width: 200px;
}
</style>
