<template>
  <el-dialog :visible.sync="trialVisible" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" width="850px">
    <div slot="title" class="dialog-title">
      <i class="el-icon-close" style="float: right;cursor: pointer" @click="closeFn"></i>
    </div>
    <div id="rpDetail">
      <div>
        <h2 style="color: black;">桃子互联网医院</h2>
        <h3 style="color: black;">电子处方笺</h3>
      </div>
      <div class="rp-ID">
        <div class="putong">
          <span class="border">普通处方</span>
        </div>
      </div>
      <div id="patientInfo">
        <div>
          <span>姓名：</span>
          <span class="name">{{patientInfo.patientName}}</span>
        </div>
        <div>
          <span>性别：</span>
          <span class="name">{{patientInfo.sex == 1 ? "男" : patientInfo.sex == 2 ? "女" : "未知"}}</span>
        </div>
        <div>
          <span>年龄：</span>
          <span class="name1">{{patientInfo.age || '未知'}}</span>
          <span class="age">岁</span>
        </div>
      </div>
      <template>
        <WestPrescription :patientInfo="patientInfo" :medicines="medicines" :time="time" :rpAdvice="rpAdvice" :diagnosis="diagnosis"></WestPrescription>
      </template>
      <div class="images">
        <el-image class="img" :src="url"></el-image>
      </div>
      <div id="rp-status">
        <div>
          <span>开方医生：</span>
          <span>
            {{doctorName}}
            <div class="text1"> {{doctorName}}</div>
          </span>
          <span>审核药师：</span>
          <span></span>
        </div>
        <!--                    <div>-->
        <!--                        <span>开方时间：</span>-->
        <!--                        <span>{{rp.rpTime | formatDateTime}}</span>-->
        <!--&lt;!&ndash;                        <span>审核时间：</span>&ndash;&gt;-->
        <!--&lt;!&ndash;                        <span>{{rp.reviewTime | formatDateTime}}</span>&ndash;&gt;-->
        <!--                    </div>-->
        <div>
          <span>审核结果：</span>
          <span>未审核</span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import Img from "@/assets/image/tmcinquiry/signature.png";
import Img1 from "@/assets/image/tmcinquiry/doctorsignature.png";
import WestPrescription from "./westPrescription";

export default {
  name: "trialPartyAndDetails",
  components: {
    // ChPrescription,
    WestPrescription
  },
  props: {
    trialVisible: {
      type: Boolean,
      default: false
    },
    patientInfo: {
      type: [String, Object],
      default: () => {
        return {};
      }
    },
    medicines: {
      type: Array,
      default: () => {
        return [];
      }
    },
    diagnosis: {
      type: String,
      default: ""
    },
    doctorName: {
      type: String,
      default: ""
    },
    rpAdvice: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      reviewStatusID: "",
      url: Img,
      url1: Img1,
      // 药品详情
      chineseMedicine: {},
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    time () {
      let myDate = new Date();
      let year = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
      let mouth = myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1;       //获取当前月份(0-11,0代表1月)
      let day = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate();        //获取当前日(1-31)
      let h = myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours();       //获取当前小时数(0-23)
      let m = myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes();     //获取当前分钟数(0-59)
      let s = myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds();     //获取当前秒数(0-59)
      return year + '-' + mouth + '-' + day + ' ' + h + ':' + m + ':' + s;
    }
  },
  created () {

  },
  methods: {
    closeFn () {
      this.$emit("closeFn");
    }
  }
};
</script>

<style lang="scss" scoped>
#rpDetail {
  width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;

  .images {
    /*position: absolute;*/
    /*top: 650px;*/
    /*left: 550px;*/
    /*right: 10px;*/
    /*bottom: 10px;*/
    text-align: right;
  }

  .putong {
    position: absolute;
    top: 15px;
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

  #patientInfo {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    div {
      margin-right: 15px;
      margin-left: 20px;
    }
  }

  #rp-status {
    div {
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
        color: #f55b4e;
        background-image: url("../../../../assets/image/tmcinquiry/doctorsignature.png");
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
        color: #f55b4e;
        background-image: url("../../../../assets/image/tmcinquiry/doctorsignature.png");
        background-size: 80px 50px;
      }

      span {
        display: inline-block;

        &:nth-child(odd) {
          width: 100px;
          margin-top: 20px;
        }

        &:nth-child(even) {
          width: calc(50% - 100px);
          margin-top: 20px;
        }
      }
    }
  }
}

.name {
  width: 80px;
  display: inline-block;
  border-bottom: 1px solid black;
}

.name1 {
  width: 50px;
  display: inline-block;
  border-bottom: 1px solid black;
  margin-right: 5px;
}

.age {
  margin-right: 30px;
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
