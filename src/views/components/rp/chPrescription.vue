<template>
  <div>
    <div class="detail-row" v-if="userInfo.orgTypeID !== 4">
      <div class="row1-item">
        <span class="detail-label">辨病：</span>
        <div class="row1-border">{{patientInfo.diseaseDiff}}</div>
      </div>
    </div>
    <div class="detail-row" v-if="userInfo.orgTypeID !== 4">
      <div class="row1-item">
        <span class="detail-label">辨证：</span>
        <div class="row1-border">{{patientInfo.syndromeDiff}}</div>
      </div>
    </div>
    <div v-else>
      <div class="detail-row">
        <div class="row1-item">
          <span class="detail-label">诊断结果：</span>
          <div class="row1-border">{{patientInfo.primaryDiagnosis}}</div>
        </div>
      </div>
    </div>
    <!-- <el-form id="medicineBox" label-width="120">
      <div style="height: 400px;">
        <h3>Rp</h3>
        <span v-html="medicineName"></span>
        <span v-if="medicineFormID && (medicineFormID == 10 || 11)">[{{Number(medicineFormID) === 10 ? "饮片" : Number(medicineFormID) === 11 ? "颗粒剂" : ""}}]</span>
        <p class="bottom">&nbsp;&nbsp;</p>
        <p style="text-align: left;">以下空白</p>
      </div>
      <el-form-item label="用法用量：">{{chineseMedicine.direction}}，共{{totalDoses}}剂，每日{{chineseMedicine.everyDose}}剂，每剂分{{chineseMedicine.frequence}}次服用。</el-form-item>
      <el-form-item label="医嘱提醒：">{{enjoin}}</el-form-item>
    </el-form> -->


    <div class="medicine-container">
      <p>Rp</p>
      <div class="medicine-item">
        <div class="medicine-item_row1">
          <span >{{medicineName}}</span>
          <span v-if="medicineFormID && (medicineFormID == 10 || 11)">{{Number(medicineFormID) === 10 ? "饮片" : Number(medicineFormID) === 11 ? "颗粒剂" : ""}}</span>
        </div>
      </div>
      <div class="medicine-footer">
        <div></div>
        <p>以下空白</p>
      </div>
      <div class="medicine-item_row2">
          <span>用法用量：</span><span class="live">{{chineseMedicine.direction}}，共{{totalDoses}}剂，每日{{chineseMedicine.everyDose}}剂，每剂分{{chineseMedicine.frequence}}次服用。</span>
      </div>
      <div class="medicine-item_row2">
          <span>医嘱提醒：</span><span class="live">{{enjoin}}</span>
      </div>
    </div>
    <div class="detail-row_line "></div>
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
      //this.medicineName += "&#12288;&#12288;";
      this.medicineName += "";
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

<style lang="scss" scoped>
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

.detail-label {
  flex-shrink: 0;
}

* {
  font-size: 12px;
  color: #000000a6;
}

.detail-row {
  display: flex;
  padding-top: 10px;
  justify-content: space-between;

  .row1-item {
    display: flex;
    align-items: flex-end;
    width: 100%;

    .row1-border {
      border-bottom: 1px solid #bfbfbf;
      width: 100%;
      padding-left: 15px;
      text-align: left;
    }
  }

  .row2-item {
    display: flex;
    align-items: flex-end;

    .row2-border {
      border-bottom: 1px solid #bfbfbf;
      width: 150px;
      padding-left: 15px;
      text-align: left;
    }
  }
}

.detail-row_line {
  width: 451px;
  height: 1px;
  background: #bfbfbf;
}

.medicine-container {
  p {
    font-size: 24px;
    text-align: left;
    color: #000000;
    font-family: STSongti, STSongti-SC;
    font-weight: SC;
    margin-top: 10px;
  }

  .medicine-item {
    margin-top: 10px;

    .medicine-item_row1 {
      display: flex;
      justify-content: space-between;

      span {
        color: #000000ff;
      }
    }

    .medicine-item_row2 {
      display: flex;
      margin-top: 5px;

      span {
        color: #000000ff;
      }
    }
  }

  .medicine-footer {
    margin-top: 5px;
    margin-bottom: 135px;

    div {
      width: 200px;
      height: 1px;
      border-bottom: 1px solid #bfbfbf;
    }

    p {
      margin-top: 5px;
      font-size: 12px;
      text-align: left;
      color: #000000;
    }
  }
}
</style>
