<template>
  <div class="app-container pt24">
    <el-form id="medicineBox" label-width="120">
      <el-form-item label="姓名：">
        {{patientInfo.patientName}}
      </el-form-item>
      <el-form-item label="性别：">
        {{patientInfo.sex === 1 ? "男" : ""}}
        {{patientInfo.sex === 2 ? "女" : ""}}
      </el-form-item>
      <el-form-item label="年龄：">
        {{patientInfo.age}}
      </el-form-item>
      <el-form-item label="联系电话：">
        {{patientInfo.phone}}
      </el-form-item>
      <el-form-item label="微信账号：">
        {{patientInfo.wechatAccount}}
      </el-form-item>
      <el-form-item label="联系地址：" style="max-width: 100%;min-width: 100%;">
        {{patientInfo.province}}{{patientInfo.city}}{{patientInfo.area}}{{patientInfo.address}}
      </el-form-item>
      <el-form-item label="患者关系：">
        {{patientInfo.relationName}}
      </el-form-item>
      <el-form-item label="患者分级：">
        {{patientInfo.patientLevel}}
      </el-form-item>
      <el-form-item label="身高：">
        {{height}}cm
      </el-form-item>
      <el-form-item label="体重：">
        {{weight}}kg
      </el-form-item>
      <el-form-item label="现病史：">
        {{patientInfo.currentDisease}}
      </el-form-item>
      <el-form-item label="患病周期：">
        {{patientInfo.diseaseCycle}}
      </el-form-item>
      <el-form-item label="咨询病种：">
        {{patientInfo.consultationDiseases}}
      </el-form-item>
      <el-form-item label="咨询药品：">
        {{patientInfo.consultationMedicinal}}
      </el-form-item>
      <el-form-item label="来源：">
        {{patientInfo.channelName}}
      </el-form-item>
      <el-form-item label="标签：">
        <!-- {{}} -->
      </el-form-item>
      <el-form-item label="备注：" style="max-width: 100%;min-width: 100%;">
        {{patientInfo.remarks}}
      </el-form-item>
      <div style="width: 100%">
        <hr />
      </div>
      <el-form-item label="吸烟史：">
        {{smoke}}<span v-if="smokeDesc !== ''">({{smokeDesc}}年)</span>
      </el-form-item>
      <el-form-item label="饮酒史：">
        {{drink}}<span v-if="drinkDesc !== ''">({{drinkDesc}}年)</span>
      </el-form-item>
      <el-form-item label="既往病史：">
        {{illness}}<span v-if="illnessDesc !== ''">({{illnessDesc}})</span>
      </el-form-item>
      <el-form-item label="过敏史：">
        {{allergy}}<span v-if="allergyDesc !== ''">({{allergyDesc}})</span>
      </el-form-item>
      <el-form-item label="肝功能：">
        {{liver}}<span v-if="liverDesc !== ''">({{liverDesc}})</span>
      </el-form-item>
      <el-form-item label="肾功能：">
        {{kidney}}<span v-if="kidneyDesc !== ''">({{kidneyDesc}})</span>
      </el-form-item>
      <el-form-item label="妊娠哺乳：" v-if="patientInfo.sex === 2">
        {{pregnancy}}<span v-if="pregnancyDesc !== ''">({{pregnancyDesc}})</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["keyID", "orgID"],
  data () {
    return {
      patientInfo: {},
      patientInfoList: [],
      height: "",
      weight: "",
      smoke: "",
      smokeDesc: "",
      drink: "",
      drinkDesc: "",
      illness: "",
      illnessDesc: "",
      allergy: "",
      allergyDesc: "",
      liver: "",
      liverDesc: "",
      kidney: "",
      kidneyDesc: "",
      pregnancy: "",
      pregnancyDesc: ""
    };
  },
  created () {
    this.getPatientInfo();
  },
  activated () {
    this.getPatientInfo();
  },
  methods: {
    getPatientInfo () {
      let params = {
        orgID: this.orgID,
        keyID: this.keyID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_PATIENT_INFO, { params })
        .then(response => {
          if (!response.data) return;
          this.patientInfo = response.data;
          // if (this.patientInfo.birthDate !== "1900-01-01") {
          //   this.jsGetAge(this.patientInfo.birthDate);
          // } else 
          if (this.patientInfo.birthYear !== 0) {
            this.getAge(this.patientInfo.birthYear);
          } else {
            this.patientInfo.age = "";
          }
          // this.jsGetAge(response.data.birthDate);
          this.getPatientInfoList();
          // console.log(response, 3333333);
        });
    },
    getPatientInfoList () {
      let params = {
        orgID: this.orgID,
        keyID: this.keyID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_PATIENT_RECORD, { params })
        .then(response => {
          if (!response.data) return;
          this.patientInfoList = response.data;
          this.patientInfoList.forEach(item => {
            if (item.docItemCode === "HEIGHT") {
              this.height = item.docItemValue;
            } else if (item.docItemCode === "WEIGHT") {
              this.weight = item.docItemValue;
            } else if (item.docItemCode === "SMOKE") {
              this.smoke = item.docItemValue;
              this.smokeDesc = item.docItemDesc;
            } else if (item.docItemCode === "DRINK") {
              this.drink = item.docItemValue;
              this.drinkDesc = item.docItemDesc;
            } else if (item.docItemCode === "ILLNESS") {
              this.illness = item.docItemValue;
              this.illnessDesc = item.docItemDesc;
            } else if (item.docItemCode === "ALLERGY") {
              this.allergy = item.docItemValue;
              this.allergyDesc = item.docItemDesc;
            } else if (item.docItemCode === "LIVER") {
              this.liver = item.docItemValue;
              this.liverDesc = item.docItemDesc;
            } else if (item.docItemCode === "KIDNEY") {
              this.kidney = item.docItemValue;
              this.kidneyDesc = item.docItemDesc;
            } else if (item.docItemCode === "PREGNANCY") {
              this.pregnancy = item.docItemValue;
              this.pregnancyDesc = item.docItemDesc;
            }
          });
          // console.log(response, 112233);
        });
    },
    // 根据出生日期算出年龄
    jsGetAge (birthDay) {
      let birthday = new Date(birthDay.replace(/-/g, "\/"));
      let d = new Date();
      this.patientInfo.age = d.getFullYear() - birthday.getFullYear() - (((d.getMonth() < birthday.getMonth() || d.getMonth() === birthday.getMonth()) && d.getDate() < birthday.getDate()) ? 1 : 0);
    },
    getAge (birthYear) {
      let myDate = new Date();
      let tYear = myDate.getFullYear();
      this.patientInfo.age = tYear - birthYear;
    }
  }
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
  margin-left: 50px;
  margin-right: 50px;
  .el-form-item {
    flex: 1;
    max-width: 33%;
    min-width: 33%;
  }
}
</style>
