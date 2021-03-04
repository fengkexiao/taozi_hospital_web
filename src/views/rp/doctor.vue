<template>
  <div class="app-container">
    <!-- 问诊带药开方 待开发 -->
    <div class="videoLogo" v-if="currentlyShow ===1">
      <el-image fit="contain" :src="webim" />
      <p>视频咨询中心</p>
    </div>
    <!-- 协诊视频填写患者信息部分 -->
    <div class="app-container" v-if="currentlyShow ===2">
      <div class="consultation_div1">
        <el-card class="box-card-video">
          <div class="doctor_tv">
            <div>
              <video v-show="multipleList" id="local" style="position: absolute;" autoplay muted playsinline></video>
            </div>
            <div>
              <video v-show="multipleList" class="remote-video" autoplay playsinline id="remoteVideo"></video>
            </div>
          </div>
          <div v-if="sign1" style="margin-left: 30%; margin-top: 30px;">
            <el-button @click="endCall()" type="danger" round>结束视频</el-button>
          </div>
          <!-- 要等视频通了之后 调位置 -->
          <div v-if="!sign1" style="margin-left: 40%;margin-top: 70%;">
            视频已结束...
            <br />
            <br />
            <br />
            <br />
            <br />
            <el-button type="primary" @click="waitFor()" round>返回等待界面</el-button>
          </div>
        </el-card>
        <el-card class="box-card">
          <div>
            <label class="doctor_label">处方笺</label>
            <br /><br /><br />
            <el-form :rules="rules" ref="fromPharmacist" :model="patientInfo" label-width="150px">
              <div class="doctor_div1">
                <el-form-item label="患者姓名：" prop="patientName">
                  <base-input v-model="patientInfo.patientName" />
                </el-form-item>
                <el-form-item label="性别：">
                  <el-radio-group class="radio" v-model="radio">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄：" prop="patientAge">
                  <base-input v-model="patientInfo.patientAge" :maxlength="3"
                    oninput="value=value.replace(/[^\d]/g,'')" />
                </el-form-item>
              </div>
              <div class="doctor_div1">
                <div>
                  <el-form-item label="身份证号：" prop="patientIdNo">
                    <base-input v-model="patientInfo.patientIdNo" :maxlength="18" />
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label="电话：" prop="patientPhone">
                    <base-input form-type="phone" v-model="patientInfo.patientPhone" />
                  </el-form-item>
                </div>
              </div>
              <el-form-item label="病情：" prop="illDesc">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入内容"
                  v-model="patientInfo.illDesc" show-word-limit :maxlength="200">
                </el-input>
              </el-form-item>
              <el-form-item label="过敏史：">
                <el-radio-group class="radio" v-model="historyOfAllergy">
                  <el-radio :label="1" @change="allergyHistory()">是</el-radio>
                  <el-radio :label="2" @change="notAllergyHistory()">否</el-radio>
                </el-radio-group>
                <br />
                <el-input type="textarea" v-if="flag" :autosize="{ minRows: 3, maxRows: 8}"
                  v-model="patientInfo.allergyDetail" show-word-limit :maxlength="100">
                </el-input>
              </el-form-item>
              <el-form-item label="诊断：" prop="primaryDiagnosis">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="patientInfo.primaryDiagnosis"
                  show-word-limit :maxlength="200">
                </el-input>
              </el-form-item>
              <div class="doctor_div1">
                <div>
                  <el-form-item label="R">
                  </el-form-item>
                </div>
                <div class="doctor-aa">
                  <el-form-item label="总价">
                    {{price | formatAmount}}
                  </el-form-item>
                </div>
              </div>
              <table class="doctor-table">
                <tr>
                  <td>药品名称</td>
                  <td>产品规格</td>
                  <td>生产厂家</td>
                  <td>用法</td>
                  <td>用量</td>
                  <td>单位</td>
                  <td>频率</td>
                  <td>单价</td>
                  <td>数量</td>
                </tr>
                <tr class="doctor-table-font" v-for="(med,index) in medicineInfo" :key="index">
                  <td><label class="doctor-text">{{med.medicineName}}</label></td>
                  <td><label class="doctor-text">{{med.productSpec}}</label></td>
                  <td><label class="doctor-text">{{med.productFactory}}</label></td>
                  <td>
                    <input type="text" :prop="med.takeDirection+index" :rules="{required: true,message: '不为空'}"
                      :size="2" v-model="med.takeDirection">
                  </td>
                  <td>
                    <input type="text" :size="5" v-model="med.takeDose">
                  </td>
                  <td>
                    <input v-model="med.formType" :size="1">
                  </td>
                  <td>
                    <select v-model="med.takeFrequence">
                      <option v-for="item in frequencyInfo" :key="item.keyID" :label="item.dictName"
                        :value="item.dictName">
                      </option>
                    </select>
                  </td>
                  <td>{{med.price | formatAmount}}</td>
                  <td>
                    <input v-model="med.medicineAmount" :size="1" oninput="value=value.replace(/[^\d]/g,'')">
                    {{med.productUnit}}
                  </td>
                </tr>
              </table>
              <el-form-item label="医嘱：" prop="enjoin">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 15}" v-model="patientInfo.enjoin"
                  show-word-limit :maxlength="500"></el-input>
              </el-form-item>
              <el-form-item>
                <div class="doctor_div2">
                  <el-button type="primary" @click="validate()">提交处方</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 智能审方提醒 -->
    <span id="cancelBody">
      <el-dialog title="提醒" :visible.sync="tab" width="590px">
        <div>
          {{errorText}}
        </div>
        <div class="doctor-bb" v-if="errorCode === 1 ">
          <el-button type="primary" @click="updataRp()">修改处方</el-button>
          <el-button type="primary" @click="updataRp()">我已知晓，请药师审方</el-button>
        </div>
        <div class="doctor-bb" v-if="errorCode === 2 ">
          <el-button type="primary" @click="updataRp()">修改处方</el-button>
        </div>
      </el-dialog>
    </span>

  </div>
</template>

<script>
import webim from "@/assets/image/webim.svg";
import doctorVideo from "@/views/rp/doctorVideo.js";
import doctorStep from "@/views/rp/doctorStep.js";
import { mapGetters } from "vuex";
import { REGULAR_EXPRESSION_IDNUMBER } from "@/common/Constant";
export default {
  name: "doctor",
  mixins: [doctorVideo, doctorStep],
  filters: {
    // 格式化金额
    formatAmount(val) {
      return (val / 100).toFixed(2);
    }
  },
  data() {
    return {
      // 视频框显示
      multipleList: true,
      // 界面图片
      webim,
      // 界面切换控制（切换等待与业务界面）
      currentlyShow: 1,
      // 问诊ID
      inquiryID: "",
      res: "",
      // 性别选中
      radio: 1,
      // 过敏史显示输入框
      flag: false,
      // 患者信息
      patientInfo: {
        patientName: "",
        patientIdNo: "",
        patientPhone: ""
      },
      // 是否过敏史
      historyOfAllergy: 2,
      // 标记挂断
      sign1: true,
      // 问诊信息
      InquiryRecord: {},
      // 追加药品名
      medicineName: "",
      // 消息对象ID
      sponsorsId: "",
      // im监听事件
      listeners: {
        onConnNotify: this.onConnNotify,
        onMsgNotify: this.onMsgNotify,
        onC2cEventNotifys: this.onC2cEventNotifys
      },
      // 商品ID
      goodsId: [],
      // 药品ID
      medicineId: [],
      // 商品信息
      goodsInfo: [],
      // 药品信息
      medicineInfo: [],
      // 药品数量
      medicineCount: [],
      // 药品供应商类型
      providerType: -1,
      // 药品供应商ID
      providerID: "",
      // 频率数据
      frequencyInfo: [],
      // 提交处方返回参数
      aiResultType: "",
      errorCode: -1,
      errorText: "",
      // doctorUserID
      doctorID: "",
      doctorName: "",
      // 智能审方提示
      tab: false,
      rules: {
        patientName: {
          required: true,
          message: "患者姓名不能为空"
        },
        patientAge: {
          required: true,
          message: "患者年龄不能为空"
        },
        patientIdNo: [
          {
            required: true,
            message: "身份证号不能为空"
          },
          {
            trigger: "blur",
            pattern: REGULAR_EXPRESSION_IDNUMBER,
            message: "请输入正确的身份证号"
          }
        ],
        patientPhone: {
          required: true,
          message: "患者电话不能为空"
        },
        illDesc: {
          required: true,
          message: "病情不能为空"
        },
        primaryDiagnosis: {
          required: true,
          message: "诊断不能为空"
        },
        enjoin: {
          required: true,
          message: "医嘱不能为空"
        }
      }
    };
  },
  created() {
    // 获取腾讯云userSig
    this.getUseSig();
  },
  computed: {
    ...mapGetters(["userInfo"]),
    price() {
      let price = 0;
      for (let i = 0; i < this.medicineInfo.length; i++) {
        let me = this.medicineInfo[i];
        price += me.medicineAmount * me.price;
      }
      return price;
    }
  }
};
</script>

<style scoped>
.videoLogo p {
  text-align: center;
}
.doctor-On-line {
  margin-left: 90%;
  margin-top: 10%;
}
.consultation_div1 {
  display: flex;
  margin-left: 20px;
}

.doctor_label {
  margin-left: 50%;
  font-size: 24px;
}
.box-card {
  width: 65%;
}
.doctor_div1 {
  display: flex;
}
.doctor_div2 {
  margin-left: 25%;
  margin-top: 10%;
}
.doctor_div1 .radio {
  display: flex;
  margin-top: 11px;
}
.doctor-aa {
  margin-left: 40%;
}
.doctor-bb {
  margin-top: 3%;
  margin-left: 30%;
}
.doctor-dd {
  margin-left: 5%;
}
.doctor-table-font {
  font-size: 12px;
}
.doctor-table {
  /* width: 800px; */
  margin-left: 10%;
}
.box-card-video {
  width: 35%;
}
.remote-video {
  height: 850px;
  width: 490px;
}
/* 文本超长 */
.doctor-text {
  -webkit-line-clamp: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  white-space: normal;
}
</style>
