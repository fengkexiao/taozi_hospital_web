<template>
  <div class="app-container">
    <table id="patient_table" border="1">
      <!-- 获取总分数据 -->
      <tr>
        <td></td>
        <td></td>
        <td>
          <div class="patient-div">评估时间:<br />评分:</div>
        </td>
        <td v-for="(tall,index) in tallScore" :key="index">
          {{tall.date}}<br /> {{tall.score}}
        </td>
      </tr>
      <!-- 确定行数 -->
      <tr v-for="(temp,index) in table" :key="index">
        <td class="huanhang" v-for="(item,ii) in temp" :key="ii">
          {{item}}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    patientID: {
      type: String,
      // 必传
      required: true
    },
    kindCode: {
      type: String,
      // 必传
      required: true
    },
    diseaseCode: {
      type: String,
      // 必传
      required: true
    }
  },
  data() {
    return {
      // 患者评分基础数据
      ScoreComparison: [],
      // 患者评分分数数据
      patientcondition: [],
      // 组合后的数据
      table: [],
      // 总表数据
      tallScore: []
    };
  },
  created() {
    this.$_http.all(this.getCondition()).finally(it => {
      // 重组数据
      // this.recombination();
    });
  },
  methods: {
    // 获取基础数据
    getCondition() {
      let params = {
        patientID: this.patientID,
        diseaseCode: this.diseaseCode,
        kindCode: this.kindCode
      };
      this.$_http
        .get(this.$_API.API_HOU_PATIENT_PATIENTCONDITIONLIST, { params })
        .then(res => {
          if (!res.data) return;
          this.ScoreComparison = res.data;
          this.getScoreComparison();
        });
    },
    // 获取患者评分
    getScoreComparison() {
      let params = {
        patientID: this.patientID,
        kindCode: this.kindCode,
        diseaseCode: this.diseaseCode
      };
      this.$_http
        .get(this.$_API.API_HOU_PATIENT_PATIENTCONDITION, { params })
        .then(res => {
          if (!res.data) return;
          this.patientcondition = res.data;
          this.tallscore();
        });
    },
    // 获取总分
    tallscore() {
      let params = {
        patientID: this.patientID
      };
      this.$_http
        .get(this.$_API.API_HOU_PATIENT_GETALLSCORE, { params })
        .then(res => {
          if (!res.data) return;
          this.tallScore = res.data.filter(v => {
            return (
              v.kindCode === this.kindCode && v.diseaseCode === this.diseaseCode
            );
          });
          this.recombination();
        });
    },
    // 重组数据
    recombination() {
      // 基础数据不用做了      分数看长度决定列
      for (let i = 0; i < this.ScoreComparison.length; i++) {
        let hang = [];
        let son = this.ScoreComparison[i];
        hang[0] = son.classifyName;
        hang[1] = son.groupName;
        hang[2] = son.items;
        let b = 3;
        for (let j = 0; j < this.patientcondition.length; j++) {
          let patient = this.patientcondition[j];
          let c = b + j;
          // 创建一列
          hang[c] = "0";
          for (let k = 0; k < patient.length; k++) {
            let patien = patient[k];
            if (son.groupCode === patien.groupCode) {
              hang[c] = patien.score;
              break;
            }
          }
        }
        this.table.push(hang);
      }
    }
  }
};
</script>

<style scoped>
.huanhang {
  white-space: pre-line;
}
#patient_table td {
  margin: 0;
  padding: 0;
}
.patient-div {
  padding-left: 50%;
}
</style>
