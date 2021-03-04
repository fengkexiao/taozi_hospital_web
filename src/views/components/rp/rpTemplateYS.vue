<template>
  <div class="app-container base-page">
    <div class="pool_left">
      <div class="rp-detail">
        <!-- 订单类型/图片展示区 -->
        <template v-if="ageIndex>0">
          <img src="./../../../assets/image/1.png" :class="['indeimg',statusIndex>0?'r120':'']" v-if="ageIndex===1" />
          <img src="./../../../assets/image/2.png" :class="['indeimg',statusIndex>0?'r120':'']" v-if="ageIndex===2" />
          <img src="./../../../assets/image/3.png" :class="['indeimg',statusIndex>0?'r120':'']" v-if="ageIndex===3" />
        </template>
        <template v-if="statusIndex>0">
          <img src="./../../../assets/image/4.png" class="indeimg" v-if="statusIndex===4" />
          <img src="./../../../assets/image/5.png" class="indeimg" v-if="statusIndex===5" />
          <img src="./../../../assets/image/6.png" class="indeimg" v-if="statusIndex===6" />
        </template>

        <!-- 标题 -->
        <div class="detail-title">
          <p class="detail-title_main">桃子互联网医院</p>
          <p class="detail-title_subtitle">普通处方笺</p>
        </div>

        <!-- 费别/编号 -->
        <div class="detail-row detail-row_1">
          <div class="detail-pay_container">
            <span class="detail-label">费别：</span>
            <div class="detail-pay_type">
              <el-checkbox :disabled="true">公费</el-checkbox>
              <el-checkbox :disabled="true">自费</el-checkbox>
              <el-checkbox :disabled="true" v-model="checkPayType">医保</el-checkbox>
              <el-checkbox :disabled="true">其他</el-checkbox>
            </div>
          </div>
          <div class="rp-no">
            <span>处方编号：</span>
            <span>{{rp.keyID}}</span>
          </div>
        </div>
        <div class="detail-row_line"></div>

        <!-- 姓名/性别/年龄 -->
        <div class="detail-row detail-row_2">
          <div class="row2-item">
            <span class="detail-label">姓名：</span>
            <div class="row2-name_border">{{patientInfo.patientName}}</div>
          </div>
          <div class="row2-item">
            <span class="detail-label">性别：</span>
            <div class="detail-sex">
              <el-checkbox v-model="checkMan" :disabled="true">男</el-checkbox>
              <el-checkbox v-model="checkWoMan" :disabled="true">女</el-checkbox>
            </div>
          </div>
          <div class="row2-item">
            <span class="detail-label">年龄：</span>
            <div class="row2-age_border">{{patientInfo.patientAge}}岁<template v-if="patientInfo.patientAge<=14&&patientInfo.patientWeight!=0">（{{formateWight(patientInfo.patientWeight)}}kg）</template></div>
          </div>
        </div>

        <!-- 中药/西药模版 -->
        <template v-if="rp.rpTypeID === 1">
          <ChPrescription :totalDoses="rp.totalDoses" :patientInfo="patientInfo" :medicines="medicines" :chineseMedicine="chineseMedicine" :enjoin="rp.enjoin" :medicineFormID="medicineFormID"></ChPrescription>
        </template>
        <template v-else>
          <WestPrescription :patientInfo="patientInfo" :medicines="medicines" :diagnosis="patientInfo.primaryDiagnosis"></WestPrescription>
        </template>

        <!-- 医师/药师信息 -->
        <div class="examine-container">
          <div class="detail-row">
            <div class="row2-item">
              <span class="detail-label">医师：</span>
              <div class="row2-border">{{rp.doctorName}}</div>
            </div>
            <div class="row2-item">
              <span class="detail-label">复核/发药药师：</span>
              <div class="row2-border"></div>
            </div>
          </div>
          <div class="detail-row">
            <div class="row2-item">
              <span class="detail-label">调配药师/士：</span>
              <div class="row2-border" style="width:108px;"></div>
            </div>
          </div>
          <div class="detail-row">
            <div class="row2-item">
              <span class="detail-label">审方药师：</span>
              <div class="row2-border">{{rp.pharmacistName}}</div>
            </div>
          </div>
          <div class="detail-row">
            <div class="row2-item">
              <span class="detail-label">开具时间：</span>
              <div class="row-time">
                <div class="row-time_year">{{year}}</div>年
                <div class="row-time_month">{{month}}</div>月
                <div class="row-time_day">{{date}}</div>日
              </div>
            </div>
          </div>
          <div class="detail-row" v-if="rp.reviewStatusID === 2">
            <div class="row2-item" style="width:100%">
              <span class="detail-label">不通过原因：</span>
              <div class="row2-border" style="width:100%">{{rp.reviewResult}}</div>
            </div>
          </div>
          <!-- <div class="detail-row">
            <div class="row2-item">
              <span class="detail-label">审核结果：</span>
              <div class="row2-border">{{rp.reviewStatusID === 0 ? "待审核" : rp.reviewStatusID === 1 ? "审核通过" : "审核不通过"}}</div>
            </div>
          </div>
          -->
          <img src="./../../../../src/assets/chapter.png" class="chapter" />
        </div>
        <div class="detail-row_line mt5"></div>
        <p class="detail-desc">注意：处方有效期为3天，擅自下载打印无效</p>
      </div>

      <div class="split-container" v-if="state==='2'"></div>
      <div class="other-container" v-if="state==='2'">
        <!--  不显示审核结果
          1.云药房订单管理查看处方 （route==='hospitalOrders'）
          2.互联网医院就（userInfo.orgTypeID === 4）
        -->
        <div v-if="route==='hospitalOrders' && userInfo.orgTypeID === 4"></div>
        <div v-else>
          <div v-if="(rp.rpStatus === 1 || rp.rpStatus === 4) && (state !== '1' || state !== '4')" class="other-detail">
            <div class="other-item">
              <span class="other-item_label">有效凭证：</span>
              <div class="other-item_container">
                <base-image-view :url="certificateUrl" v-if="certificateUrl" style="display: inline-block;"></base-image-view>
                <span v-else>未上传图片</span>
              </div>
            </div>
            <div class="other-item" style="margin-top:33px;">
              <span class="other-item_label">治疗建议：</span>
              <div class="other-item_container">
                {{rp.enjoin || '无'}}
              </div>
            </div>
            <div class="other-item" style="margin-top:33px;">
              <span class="other-item_label">审核结论：</span>
              <div class="other-item_container">
                <el-popover placement="top-start" width="400" v-model="visible" title="审核不通过" offset=150 @hide="hidePopover" @show="showPopover">
                  <el-input type="textarea" placeholder="请输入不通过理由" class="refuse-input" v-model="notPassReason" maxlength="100" show-word-limit>
                  </el-input>
                  <i class="el-icon-close close-cancel" @click="visible=false"></i>
                  <div class="mt15 text-center">
                    <el-button size="mini" @click="visible=false">取消</el-button>
                    <el-button type="primary" size="mini" style="color:#fff" @click="handleNoPass">确定</el-button>
                  </div>
                  <el-button slot="reference" class="no-pass">不通过</el-button>
                </el-popover>
                <el-button class="pass" @click="handlePass" :disabled="isDisabled">通过</el-button>
              </div>
            </div>
          </div>
        </div>
        <img src="./../../../assets/image/auditFailed.png" class="audit-failed" v-if="rp.rpStatus===3" />
      </div>
    </div>
    <div class="pool_right">
      <div class="prescriptions">
        <span :class="['tab',activeIndex == 1?'active':'']" @click="activeIndex = 1">风险监测</span>
        <span :class="['tab',activeIndex == 2?'active':'']"  @click="activeIndex = 2">用药说明</span>
      </div>
      <risk-monitoring v-show="activeIndex == 1 && (medicineResult.length > 0 || validateResults.length > 0)" @toMonitor="toMonitor" :medicineResult="medicineResult" :validateResults="validateResults" :riskStatiscal="riskStatiscal" :dataInfoDetail="rp" :warningState="false"></risk-monitoring>
      <div v-show="activeIndex == 1 && ( (medicineResult.length == 0 && validateResults.length == 0))" class="noData">暂无风险监测</div>
      <medical-information  v-show="activeIndex == 2 && medicineResult.length > 0" :medicineResult="medicineResult"></medical-information>
      <div v-show="activeIndex == 2 && (medicineResult.length == 0)" class="noData">暂无用药说明</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ChPrescription from "./chPrescription";
import WestPrescription from "./westPrescription";
import riskMonitoring from "./../../rp/components/riskMonitoring";
import medicalInformation from "./../../rp/components/medicalInformation";

export default {
  filters: {
    // 格式化金额
    formatAmount (val) {
      return (val / 100).toFixed(2);
    }
  },
  components: {
    ChPrescription,
    WestPrescription,
    riskMonitoring,
    medicalInformation
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  // 界面跳转所带参数
  props: {
    inquiryId: {
      type: String,
      // 必传
      required: true
    },
    state: {  //1 是查看详情/2是审核
      type: String,
      // 必传
      required: true
    },
    route: String
  },
  created () {
    this.getrpdetail();
  },
  watch: {
    visible (val) {
      if (val) {
        this.notPassReason = "";
      }
    }
  },
  data () {
    return {
      checkPayType: false,
      checkMan: false,
      checkWoMan: false,
      isDisabled: false,
      visible: false,
      rpStatus: "",
      rp: {},
      // 患者信息
      patientInfo: {},
      // 药品详情
      medicines: [],
      medicineFormID: "",
      chineseMedicine: {},
      // 不通过原因
      notPassReason: "",
      markStatus: "",
      ageIndex: 0,
      statusIndex: 0,
      certificateUrl: "",
      year: '',
      month: '',
      date: '',
      activeIndex: 1,
      medicineResult: [],
      validateResults: [],
      riskStatiscal: {}
    };
  },
  methods: {
    hidePopover () {
      this.isDisabled = false;
    },
    showPopover () {
      this.isDisabled = true;
    },
    handleShowVisible () {
      this.visible = true;
      this.notPassReason = "";
    },
    back () {
      if (this.rpStatus === 1) {
        this.$router.push({
          name: "pharmacist"
        });
      } else {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.push({
          name: "rpPool"
        });
      }
    },
    handlePass () {
      this.rpStatus = 2;
      this.validate();
    },
    showPopover () {
      this.isDisabled = true;
    },
    handleNoPass () {
      this.rpStatus = 3;
      this.validate();
    },
    // 药师审方
    validate () {
      let _this = this;
      if (_this.rpStatus === 1) {
        this.$message({
          message: "请先审核",
          type: "warning"
        });
        return;
      }
      if (_this.rpStatus === 3 && !_this.notPassReason) {
        this.$message({
          message: "请填写不通过原因",
          type: "warning"
        });
        return;
      }
      let params = {
        phone: _this.userInfo.phone
      };
      if (_this.markStatus === 1) {
        // 获取药师的doctorUserid
        _this.$_http
          .get(_this.$_API.API_PEACHUSER_DOCTORMNG_GETDOCTORBYPHONE, {
            params
          })
          .then(res => {
            if (!res.data) return;
            let data = {
              modifyTime: this.rp.modifyTime,
              pharmacistOrgType: 1,
              pharmacistOrgID: _this.userInfo.orgID,
              rpStatus: _this.rpStatus,
              notPassReason: _this.notPassReason,
              pharmacistHospitalID: _this.userInfo.orgID,
              // 改为doctorUserID
              pharmacistID: res.data.keyID,
              pharmacistName: _this.userInfo.staffName,
              keyID: _this.inquiryId,
              doctorID: res.data.keyID,
              doctorName: _this.userInfo.staffName
            };
            _this.$_http
              .post(_this.$_API.API_RP_PRESCRIPTION_REVIEWRP, data)
              .then(res => {
                this.$router.push({
                  name: "pharmacist"
                });
              });
          });
      } else {
        let data = {
          modifyTime: this.rp.modifyTime,
          rpStatus: _this.rpStatus,
          notPassReason: _this.notPassReason,
          keyID: _this.inquiryId,
          pharmacistStaffID: this.userInfo.keyID,
          doctorID: _this.userInfo.doctorID,
          doctorName: _this.userInfo.staffName
        };
        _this.$_http
          .post(_this.$_API.INTERFACE_RP_GET_REVIEWDISPATCHRP, data)
          .then(res => {
            this.$message({
              message: "成功",
              type: "success"
            });
            this.back();
          });
      }
    },
    formateWight (v) {
      let mark = v.toString().split(".")[1];
      if (!mark) {
        return v
      } else if (mark === "00" || mark.startsWith("0")) {
        return v.toString().substring(0, v.toString().indexOf("."))
      } else {
        return v.toFixed(1)
      }
    },
    // 详情初始化年龄图片
    initAgeImg () {
      let patientAge = this.rp.patientInfo.patientAge;
      let patientSex = this.rp.patientInfo.patientSex;
      let pregnancy = this.patientInfo.pregnancy;
      let ageImg = 0;
      if (patientAge >= 65) {
        ageImg = 1; // 老年人
      } else if (patientAge <= 14) {
        ageImg = 2; // 儿童
      }
      let status = 0;
      if (
        patientSex === 2 &&
        (pregnancy === "备孕中" || pregnancy === "备孕")
      ) {
        status = 4; // 备孕中
      } else if (
        patientSex === 2 &&
        (pregnancy === "怀孕中" || pregnancy === "妊娠")
      ) {
        status = 5; // 怀孕中
      } else if (
        patientSex === 2 &&
        (pregnancy === "正在哺乳" || pregnancy === "哺乳")
      ) {
        status = 6; // 正在哺乳
      }
      this.ageIndex = ageImg;
      this.statusIndex = status;
    },
    // 获取处方详情
    getrpdetail () {
      // this.checkPayType = true
      let _this = this;
      let params = {
        inquiryId: _this.inquiryId
      };
      _this.$_http
        .get(_this.$_API.API_RP_PRESCRIPTION_GETRPDETAIL, {
          params
        })
        .then(async res => {
          if (!res.data) return;

          let rpParams = {
            rpID: res.data.keyID
          };
          const rpRes = await this.$_http.get(
            this.$_API.INTERFACE_RP_GET_CEERTIFICATEURL,
            { params: rpParams }
          );
          if (rpRes.data) {
            this.certificateUrl = rpRes.data.certificateUrl || "";
          }
          _this.rp = res.data;
          _this.medicineFormID = _this.rp.medicineFormID;
          _this.rpStatus = _this.rp.rpStatus;
          _this.markStatus = _this.rp.rpStatus;
          _this.patientInfo = _this.rp.patientInfo;
          _this.patientInfo.primaryDiagnosis = _this.rp.primaryDiagnosis;
          _this.medicines = _this.rp.medicines;
          _this.chineseMedicine = _this.rp.chineseMedicine;
          if (this.rp.pharmacistTime && this.rp.pharmacistTime !== '1900-01-01 00:00:00') {
            let newDate = new Date(this.rp.pharmacistTime)
            this.year = newDate.getFullYear()
            this.month = newDate.getMonth() + 1
            this.date = newDate.getDate()
          }
          if (this.patientInfo.patientSex === 2) {
            this.checkWoMan = true
          }
          if (this.patientInfo.patientSex === 1) {
            this.checkMan = true
          }
          if(rpRes.data) {
            _this.rp.orderID = rpRes.data.orderID
            _this.rp.rpID = rpRes.data.rpID
          }
          this.initAgeImg();
          this.rationalMedicineCheck(_this.rp,"reviewRp")
          this.rationalMedicineFlushInfo(_this.rp)
        });
    },
    // 子传父事件重新检测审方
    toMonitor() {
      this.rationalMedicineCheck(this.rp,"reviewRp")
    },
    // 检测审方
    async rationalMedicineCheck(data,action) {
      console.log(data)
      let medicineList = [];
      if(data.medicines) {
        data.medicines.forEach(ele => {
          let obj = {
            medicineName: ele.medicineName,
            specification: ele.specification,
            medicineAmount: ele.medicineAmount,                 
            formType: ele.formType,
            takeDose: ele.takeDose,
            takeFrequence: ele.takeFrequence,
            takeDirection: ele.takeDirection,
            medicationDays: ele.medicationDays,
            isCertificate: this.certificateUrl ? 1 : 0
          }
          medicineList.push(obj);
        });
        let params = {
          rp:{
            medicineList: medicineList,
            source: 'peach',
            endPoint: "web",
            clientID: data.clientID,
            orderID: data.orderID,
            doctorID: data.doctorID,
            doctorName: data.doctorName,
            rpID: data.rpID,
            action: action
          },
          patientInfo:{
            patientName: data.patientInfo.patientName,
            patientSex: data.patientInfo.patientSex,
            patientAge: data.patientInfo.patientAge,
            patientWeight: data.patientInfo.patientWeight,
            illDesc: data.patientInfo.illDesc,
            // historyOfAllergy: data.historyOfAllergy,
            allergyDetail: data.patientInfo.allergyDetail,
            // historyOfSickness: data.historyOfSickness,
            sicknessDetail: data.patientInfo.sicknessDetail,
            liver: data.patientInfo.liver == "正常"? 0 : 1,
            renal: data.patientInfo.renal == "正常"? 0 : 1,
            pregnancy: data.patientInfo.pregnancy == "备孕"?1:(data.patientInfo.pregnancy == "妊娠"?2:(data.patientInfo.pregnancy == "哺乳"?3:'')),
            primaryDiagnosis: data.patientInfo.primaryDiagnosis,
            reInquiry: this.certificateUrl ? 1 : 0
          }
        }
        this.validateResults = []
        this.riskStatiscal = {}
        const res = await this.$_http.post(this.$_API.INTERFACE_AUTORE_POST_CHECK, params)
        if(res.data) {
          let validateResults = res.data.caculateResultList
          let arr = []
          validateResults.forEach(ele => {
            ele.state = true
            arr.push(ele)
          })
          this.validateResults = arr
          this.riskStatiscal = res.data.reportStatiscal
        }
      }
    },
    // 查询药品规格信息
    rationalMedicineFlushInfo(data) {
      if(JSON.stringify(data) !== '{}') {
        let params = []
        data.medicines.forEach(ele => {
          params.push(ele.medicineName);
        })
        this.medicineResult = []
        this.$_http.post(this.$_API.INTERFACE_AUTORE_POST_FLUSHINFO, {medicineNames:params}).then(res => {
          if(res.data) {
            this.medicineResult = res.data
          }
        })
      }
    }
  }
};
</script>


<style lang="scss" >
.el-checkbox__label {
  font-size: 12px !important;
  font-weight: 400 !important;
  color: #000000a6 !important;
}
</style>
<style lang="scss" scoped>
@import './../../../styles/common/rp-detail.scss';
/deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
  border-color:#000
}
/deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
  background-color: #fff;
}
/deep/ .el-checkbox__input.is-disabled .el-checkbox__inner{
  background-color: #fff;
}
.pool_left {
  width: calc(100% - 436px);
  float: left;
}
.pool_right {
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 1500;
  width: 420px;
  background: #fff;
  margin-left: 16px;
  height: 100vh;
  overflow: auto;
  .prescriptions {
    height: 40px;
    line-height: 40px;
    background: #3489ff;
    padding-left: 10px;
    .tab {
      text-align: center;
      display: inline-block;
      width: 80px;
      font-size: 14px;
      line-height: 28px;
      height: 28px;
      color: #fff;
      margin-right: 20px;
      cursor: pointer;
    }
    .active {
      background: rgba(255,255,255,0.20);
      border-radius: 5px;
      box-shadow: 0px -1px 2px 0px rgba(52,137,255,0.69); 
    }
  }
  .noData {
    display: flex;
    font-size: 16px;
    justify-content: center;
    align-items: center;
    height: calc(100% - 40px);
    color: #ffa216;
  }
}
</style>
