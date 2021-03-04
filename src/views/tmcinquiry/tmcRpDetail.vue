<template>
  <div class="app-container">
    <!-- 处方详情界面 -->
      <div id="rpDetail" :model="rp">
        <el-card class="box-card">
          <div class="images"><el-image class="img" :src="url"></el-image></div>
          <div >
            <h2 style="color: black;">桃子互联网医院</h2>
            <h3 style="color: black;">电子处方笺</h3>
          </div>
          <div class="rp-ID">
            <div>
              <span>处方编号：</span>
              <span class="color-red">{{rp.keyID}}</span>
            </div>
            <div class="putong"><span class="border">普通处方</span></div>
          </div>
          <div id="patientInfo">
            <div>
              <span>姓名：</span>
              <span class="name">{{rp.patientName}}</span>
            </div>
            <div>
              <span>性别：</span>
              <span class="name">{{rp.sex == 1 ? "男" : rp.sex == 2 ? "女" : "未知"}}</span>
            </div>
            <div>
              <span>年龄：</span>
              <span class="name1">{{rp.age}}</span>
              <span class="age">岁</span>
            </div>
          </div>
          <template>
            <WestPrescription :rp="rp" :medicines="medicines" :primaryDiagnosis="rp.primaryDiagnosis"></WestPrescription>
          </template>
          <!-- <template>
            <ChPrescription :totalDoses="rp.totalDoses" :patientInfo="patientInfo" :medicines="medicines" :chineseMedicine="chineseMedicine" :enjoin="rp.enjoin"></ChPrescription>
          </template> -->
          <div id="rp-status">
            <div>
              <span>开方医生：</span>
              <span>{{rp.doctorName}}<div class="text1">{{rp.doctorName}}</div></span>
              <span>审核药师：</span>
              <span>{{rp.pharmacistName}}<div class="text2" v-if="rp.reviewStatusID !== 0">{{rp.pharmacistName}}</div></span>
            </div>
            <div>
              <span>开方时间：</span>
              <span>{{rp.rpTime | formatDateTime}}</span>
              <span>审核时间：</span>
              <span>{{rp.reviewTime | formatDateTime}}</span>
            </div>
            <div> 
              <span></span>
              <span></span>
              <span>审核结果：</span>
              <span>{{rp.reviewStatusID === 0 ? "未审核" : rp.reviewStatusID === 1 ? "审核通过" : "审核不通过"}}</span>
              <span></span>
              <span></span>
              <span v-if="rp.reviewStatusID === 2">不通过原因：</span>
              <span v-if="rp.reviewStatusID === 2">{{rp.reviewResult}}</span>
            </div>
          </div>
        </el-card>
      </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Img from "@/assets/image/tmcinquiry/signature.png";
import Img1 from "@/assets/image/tmcinquiry/doctorsignature.png";
// import ChPrescription from "./chPrescription";
import WestPrescription from "./westPrescription";
export default {
  name: "tmcRpDetail",
  filters: {
    // 格式化金额
    formatAmount(val) {
      return (val / 100).toFixed(2);
    }
  },
  components: {
    // ChPrescription,
    WestPrescription
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  inject: ["close"],
  // 界面跳转所带参数
  props: {
    rpID: {
      type: String,
      // 必传
      required: true
    }
  },
  created() {
    this.getrpdetail();
  },
  data() {
    return {
      reviewStatusID: "",
      url: Img,
      url1: Img1,
      rp: {},
      // 患者信息
      patientInfo: {},
      // 药品详情
      medicines: [],
      chineseMedicine: {},
      // 不通过原因
      reviewResult: ""
    };
  },
  methods: {
    back() {
      // 关闭当前页
      this.close().then(() => {
        history.go(-1);
      });
    },
    // 获取处方详情
    getrpdetail() {
      let _this = this;
      let params = {
        rpID: _this.rpID,
        orgID: _this.userInfo.orgID
        // rpID: "19122120155807127243012001",
        // orgID: "19122116554357936820511001"
      };
      // console.log(params);
      _this.$_http
        .get(_this.$_API.INTERFACE_TMC_GET_RP_DETAIL, { params })
        .then(res => {
          if (!res.data) return;
          _this.rp = res.data;
          _this.reviewStatusID = _this.rp.reviewStatusID;
          _this.medicines = _this.rp.rpMedicines;
          _this.chineseMedicine = _this.rp.chineseMedicine;
          if (_this.rp.age === 0) {
            _this.rp.age = "未知";
          }
          console.log(_this.rp);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#rpDetail{
  width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  .images {
    position: absolute;
    top: 650px;
    left: 550px;
    right: 110px;
    bottom: 10px;
  }
  .putong {
    position: absolute;
    top: 130px;
    left: 588px;
    right: 10px;
    bottom: 10px;
    .border {
      border: 1px solid black;
      font-size: 18px;
      padding: 5px 7px;
      font-weight: 600;
    }
  }
  #patientInfo{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    div{
      margin-right: 15px;
      margin-left: 20px;
    }
  }
  #rp-status{
    div{
      margin: 5px 20px;
      text-align: left;
      position: relative;
      .text1 {
        position: absolute;
        width: 80px;
        height: 50px;
        text-align: center;
        line-height: 30px;
        top: 0px;
        left: 168px;
        right: 10px;
        bottom: 10px;
        color: #F55B4E;
        background-image: url(../../assets/image/tmcinquiry/doctorsignature.png);
        background-size: 80px 50px;
      }
      .text2 {
        position: absolute;
        width: 80px;
        height: 50px;
        text-align: center;
        line-height: 30px;
        top: 0px;
        left: 548px;
        right: 10px;
        bottom: 10px;
        color: #F55B4E;
        background-image: url(../../assets/image/tmcinquiry/doctorsignature.png);
        background-size: 80px 50px;
      }
      span{
        display: inline-block;
        &:nth-child(odd){
          width: 100px;
          margin-top: 20px;
        }
        &:nth-child(even){
          width: calc(50% - 100px);
          margin-top: 20px;
        }
      }
    }
  }
}
.name {
  width:80px;
  display: inline-block;
  border-bottom: 1px solid black;
}
.name1 {
  width:50px;
  display: inline-block;
  border-bottom: 1px solid black;
  margin-right: 5px;
}
.age{
  margin-right: 5px;
}
.rp-ID {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 20px;
  margin-right: 17px;
  margin-bottom: 20px;
}
* {
  font-weight: 700;
  color: #606266;
}
</style>
