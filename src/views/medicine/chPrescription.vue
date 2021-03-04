<template>
  <div >
    <el-form id="medicineBox" label-width="120">
      <template v-if="userInfo.orgTypeID !== 4">
        <el-form-item label="辨病：">
          <span class="underline">{{patientInfo.diseaseDiff}}</span>
        </el-form-item>
        <el-form-item label="辨证：">
          <span class="underline">{{patientInfo.syndromeDiff}}</span>
        </el-form-item>
      </template>
      <el-form-item v-else>
        <span>诊断结果：</span>
        <span class="underline">{{patientInfo.primaryDiagnosis}}</span>
      </el-form-item>
      <div style="height: 400px;">
        <h3>Rp</h3>
        <span v-html="medicineName"></span>
        <span v-if="medicineFormID && (medicineFormID == 10 || 11)">[{{Number(medicineFormID) === 10 ? "饮片" : Number(medicineFormID) === 11 ? "颗粒剂" : ""}}]</span>
        <p class="bottom">&nbsp;&nbsp;</p>
        <p style="text-align: left;">以下空白</p>
      </div>
      <el-form-item label="用法用量：">{{chineseMedicine.direction}}，共{{totalDoses}}剂，每日{{chineseMedicine.everyDose}}剂，每剂分{{chineseMedicine.frequence}}次服用。</el-form-item>
      <el-form-item label="医嘱提醒：">{{enjoin}}</el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: [
    "patientInfo",
    "medicines",
    "chineseMedicine",
    "enjoin",
    "totalDoses",
    "medicineFormID"
  ],
  data () {
    return {
      medicineName: ""
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.medicines.forEach(item => {
      this.medicineName +=
        item.medicineName + " " + item.medicineAmount + item.unit;
      if (item.takeDirection) {
        this.medicineName += "（" + item.takeDirection + "）";
      }
      this.medicineName += "&#12288;&#12288;";
    });
  },
  watch: {
    medicines: {
      handler (val) {
        val.forEach(item => {
          this.medicineName +=
            item.medicineName + " " + item.medicineAmount + item.unit;
          if (item.takeDirection) {
            this.medicineName += "（" + item.takeDirection + "）";
          }
          this.medicineName += "&#12288;&#12288;";
        });
      }
    }
  }
  // mounted() {
  //   this.medicines.forEach(item => {
  //     this.medicineName += item.medicineName + " " + item.medicineAmount + item.unit;
  //     if (item.takeDirection) {
  //       this.medicineName += "（" + item.takeDirection + "）";
  //     }
  //     this.medicineName += "&#12288;&#12288;";
  //   });
  // }
};
</script>

<style scoped>
#medicineBox {
  text-align: left !important;
}
.underline {
  width: 640px;
  display: inline-block;
  border-bottom: 1px solid black;
}
.app-container {
  height: 700px;
}
.bottom {
  border-bottom: 1px solid black;
  width: 200px;
}
</style>
