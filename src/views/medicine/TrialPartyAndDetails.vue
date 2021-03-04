<template>
  <div class="app-container base-page">
    <!-- 审方详情待开发 -->
    <div class="rp-detail">
      <div class="images">
        <el-image class="img" :src="url"></el-image>
      </div>
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
          <div class="row2-name_border">{{rp.patientName}}</div>
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
          <div class="row2-age_border">{{rp.age}}岁</div>
        </div>
      </div>

      <template>
        <WestPrescription :patientInfo="patientInfo" :rp="rp" :medicines="medicines" :diagnosis="rp.diagnosis"></WestPrescription>
      </template>

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
        <img src="./../../../src/assets/chapter.png" class="chapter" />
      </div>
      <div class="detail-row_line mt5"></div>
      <p class="detail-desc">注意：处方有效期为3天，擅自下载打印无效</p>

    </div>
    <div class="split-container" v-if="rp.reviewStatusID === 0 && this.sign == 1"></div>
    <div class="other-container" v-if="rp.reviewStatusID === 0 && this.sign == 1">
      <div class="other-detail">
        <div class="other-item" style="margin-top:33px;">
          <span class="other-item_label">审核结论：</span>
          <div class="other-item_container">
            <el-popover placement="top-start" width="400" v-model="visible" title="审核不通过" offset=150 @hide="hidePopover" @show="showPopover">
              <el-input type="textarea" placeholder="请输入不通过理由" class="refuse-input" v-model="reviewResult" maxlength="100" show-word-limit>
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
      <img src="./../../assets/image/auditFailed.png" class="audit-failed" v-if="rp.rpStatus===3" />
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
  name: "trialPartyAndDetails",
  inject: ["close"],
  filters: {
    // 格式化金额
    formatAmount (val) {
      return (val / 100).toFixed(2);
    }
  },
  components: {
    // ChPrescription,
    WestPrescription
  },
  props: {
    rpID: {
      type: String,
      required: true
    },
    sign: {
      type: String,
      required: true
    },
    route: String
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
      isDisabled: false,
      notPassReason: '',
      checkPayType: false,
      reviewStatusID: "",
      url: Img,
      url1: Img1,
      rp: {},
      visible: false,
      // 患者信息
      patientInfo: {},
      // 药品详情
      medicines: [],
      year: '',
      month: '',
      date: '',
      chineseMedicine: {},
      // 不通过原因
      reviewResult: "",
      checkMan: false,
      checkWoMan: false,
      currentOrgID: "" // 默认是用户的机构id
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    // this.currentOrgID = this.orgID ? this.orgID : this.userInfo.orgID;
    if (this.$route.query.orgID) {
      this.currentOrgID = this.$route.query.orgID;
    } else {
      this.currentOrgID = this.userInfo.orgID;
    }
    this.getrpdetail();
  },
  methods: {
    hidePopover () {
      this.isDisabled = false;
    },
    showPopover () {
      this.isDisabled = true;
    },
    handlePass () {
      this.reviewStatusID = 1;
      this.validate();
    },
    showPopover () {
      this.isDisabled = true;
    },
    handleNoPass () {
      this.reviewStatusID = 2;
      this.validate();
    },
    // 获取处方详情s
    getrpdetail () {
      let _this = this;
      let params = {
        rpID: _this.rpID,
        orgID: this.currentOrgID
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
          if (this.rp.sex === 2) {
            this.checkWoMan = true
          }
          if (this.rp.sex === 1) {
            this.checkMan = true
          }
          if (this.rp.rpTime && this.rp.rpTime !== '1900-01-01 00:00:00') {
            let newDate = new Date(this.rp.rpTime)
            this.year = newDate.getFullYear()
            this.month = newDate.getMonth() + 1
            this.date = newDate.getDate()
          }
          _this.patientInfo = _this.rp;
        });
    },
    // 返回
    back () {
      this.close().then(() => {
        this.$router.push({
          name: this.route,
          params: { sign: "1" }
        });
      });
    },
    // 点击确定审方
    validate () {
      let _this = this;
      if (_this.reviewStatusID === 0) {
        this.$alert("请先审核");
        return;
      }
      if (_this.reviewStatusID === 1) {
        _this.reviewResult = "";
      }
      if (_this.reviewStatusID === 2 && !_this.reviewResult) {
        this.$alert("请填写不同意原因");
        return;
      }
      let data = {
        modifyUser: _this.userInfo.keyID,
        orgID: this.currentOrgID,
        rpID: _this.rpID,
        reviewResult: _this.reviewResult,
        reviewStatusID: _this.reviewStatusID,
        orderID: _this.rp.orderID,
        modifyTime: _this.rp.modifyTime,
        orgName: _this.userInfo.orgName,
        pharmacistStaffID: _this.userInfo.keyID,
        pharmacistName: _this.userInfo.staffName
      };
      _this.$_http
        .post(_this.$_API.INTERFACE_TMC_POST_RP_REVIEW, data)
        .then(res => {
          if (!res.code === 0) return;
          // 填充表格数据
          _this.close().then(() => {
            _this.$router.push({
              name: this.route,
              params: { sign: "1" }
            });
          });
          _this.$_success("审核成功");
        });
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
@import "./../../styles/common/rp-detail.scss";
/deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
  border-color:#000
}
/deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
  background-color: #fff;
}
/deep/ .el-checkbox__input.is-disabled .el-checkbox__inner{
  background-color: #fff;
}
</style>
