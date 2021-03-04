<template>
  <div class="app-container base-page">
    <div class="treatRpAuditDetails_div">
      <div id="treatRpAuditDetails_div1">
        <label class="treatRpAuditDetails_font">患者信息</label>
      </div>
      <br />
      <el-divider></el-divider>
      <br />
      <base-loading :loading="tableLoading">
        <div class="treatRpAuditDetails_div2">
          <div class="treatRpAuditDetails_div2_div1">姓名：{{patientInfo.patientName}}</div>
          <div class="treatRpAuditDetails_div2_div1">性别：{{patientInfo.patientSex | formatSex }}</div>
          <div class="treatRpAuditDetails_div2_div1">年龄：{{patientInfo.patientAge }}</div>
          <div class="treatRpAuditDetails_div2_div1">手机号：{{patientInfo.patientPhone}}</div>
        </div>
      </base-loading>
      <br />
      <br />
      <br />
      <div id="treatRpAuditDetails_div2">
        <label class="treatRpAuditDetails_font">患者其他信息</label>
      </div>
      <br />
      <el-divider></el-divider>
      <br />
      <div>
        <label class="treatRpAuditDetails_label1">既往史</label>
        <br />
        &emsp;&emsp;
        <span v-for="(cla,index) in classifies" :key="index">
          <span class="treatRpAuditDetails_label1" v-if="cla.classifyCode === 'H1' ">
            {{cla.valueDesc}}
          </span>
        </span>
      </div>
      <br />
      <el-divider></el-divider>
      <br />
      <label class="treatRpAuditDetails_label1">其他信息</label>
      <br />
      &emsp;&emsp;
      <span v-for="(clas,i) in classifies" :key="i+'_'">
        <span class="treatRpAuditDetails_label1" v-if=" ['H2','H3','H4','H5','H6'].includes(clas.classifyCode)">
          {{clas.valueDesc}}
        </span>
      </span>
      <br />

      <el-divider></el-divider>
      <label class="treatRpAuditDetails_label1">中医病史采集</label>
      <br />
      &emsp;&emsp;
      <span v-for="(clasa,j) in classifies" :key="j+'.'">
        <span class="treatRpAuditDetails_label1" v-if="clasa.classifyCode === 'H9' ">
          {{clasa.valueDesc}}
        </span>
      </span>
      <el-divider></el-divider>
      <br />
      <div id="treatRpAuditDetails_div3">
        <label class="treatRpAuditDetails_font">辨病论治</label>
      </div>
      <br />
      <br />
      <div>
        <label class="treatRpAuditDetails_label1">诊断结果：</label>
        {{orderInfo.diseaseName}} . {{orderInfo.kindName}}
      </div>
      <br />
      <el-divider></el-divider>
      <br />
      <div id="treatRpAuditDetails_div4">
        <label class="treatRpAuditDetails_font">处方</label>
      </div>
      <br />
      <br />
      <label class="treatRpAuditDetails_R">R:</label>
      <br />
      <base-loading :loading="tableLoading">
        <!-- 展示药品 -->
        <div class="treatRpAuditDetails_medicines">
          <div v-for="item in treatRpMedicines" :key="item.medicineName">
            <br />
            <br />
            <div class="treatRpAuditDetails_medicines_div1">
              <div class="treatRpAuditDetails_medicines_div1_font1">{{item.medicineName}}</div>&emsp;&emsp;
              <div class="treatRpAuditDetails_medicines_div1_font">{{item.amount}} &nbsp; {{item.packageUnit}}
                &emsp;&emsp; {{item.norms}}</div>
            </div>
            <br />
            <div class="treatRpAuditDetails_medicines_div1 treatRpAuditDetails_medicines_div1_font">
              <div>用法用量：{{item.usageAmount}}</div>&emsp;&emsp;
              <div>{{item.usageWay}} &emsp; {{item.doseDayTimes}}</div>
            </div>
          </div>
        </div>
      </base-loading>
      <div v-if="orderInfo.orderStatusID === 12">
        <div class="treatRpAuditDetails_div4_doctor">开方医生：{{treatRpSummary.doctorName}}</div>
        <div class="treatRpAuditDetails_div4_doctor">开处方时间：{{treatRpSummary.doctorTime}}</div>
      </div>
      <div v-if="orderInfo.orderStatusID === 12">
        <div v-if="treatRpSummary.rpStatusID === 1 || treatRpSummary.rpStatusID === 2 ">
          <!-- 待审核 不显示药师信息 -->
          <div class="treatRpAuditDetails_div4_doctor">药师：{{treatRpSummary.auditorName}}</div>
          <div class="treatRpAuditDetails_div4_doctor">处方审核时间：{{treatRpSummary.auditorTime}}</div>
        </div>
        <div v-if="treatRpSummary.rpStatusID === 2">
          <!-- 审核不通过时出现 -->
          <div class="treatRpAuditDetails_div4_doctor">审核不通过原因：{{treatRpSummary.refuseReason}}</div>
        </div>
      </div>
      <br />
      <el-divider></el-divider>
      <br />
      <label class="treatRpAuditDetails_label1">订单其他信息</label>
      <br />
      <div class="treatRpAuditDetails_div4_order">
        <div class="treatRpAuditDetails_div4_order">订单状态：{{orderInfo | formatStatus(treatRpSummary,sign)}}</div>
        <div class="treatRpAuditDetails_div4_order">订单金额：{{orderInfo.price | formatAmount}} &emsp;元</div>
        <div class="treatRpAuditDetails_div4_order">订单编号：{{orderInfo.keyID}}</div>
      </div>
      <br />
      <div class="treatRpAuditDetails_div4_order" v-if="orderInfo.orderStatusID === 41 && orderInfo.profitStatusID === 10 ">
        <div class="treatRpAuditDetails_div4_order">结算发起人：{{orderInfo.settlementMan}}</div>
        <div class="treatRpAuditDetails_div4_order">结算发起时间：{{orderInfo.settlementTime}}</div>
        <el-divider></el-divider>
        <div>
          <!-- 表格 -->
          <table width="30%">
            <tr>
              <td>结算信息</td>
              <td>总金额</td>
              <td>医生</td>
              <td>平台</td>
              <td>侯丽萍医院</td>
            </tr>
            <tr>
              <td>合计：</td>
              <td>{{orderInfo.price | formatAmount}} 元</td>
              <td>{{orderInfo.doctorFee | formatAmount}} 元</td>
              <td>{{orderInfo.peachFee | formatAmount}} 元</td>
              <td>{{orderInfo.houFee | formatAmount}} 元</td>
            </tr>
          </table>
        </div>
      </div>
      <!-- 待审核时显示的界面 -->
      <div v-if="orderInfo.orderStatusID === 12 && sign === '0' && typeof sign !== 'undefined'">
        <div v-if="treatRpSummary.rpStatusID === 0" class="treatRpAuditDetails_label1">
          <div>
            审核结果：&emsp;&emsp;&emsp;
            <el-radio-group v-model="radio">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">不通过</el-radio>
            </el-radio-group>
          </div>
          <br />
          <el-form>
            <el-form-item>
              <base-input label-name="不通过原因" v-model="formData.cause" type="textarea" :maxlength="100" />
            </el-form-item>
            <el-form-item>
              <div>
                <el-button class="treatRpAuditDetails_button" @click="fanHuiRp()">返回</el-button>
                <el-button type="primary" @click="onSubmit()" class="margin-left-40">确定</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 返回 -->
      <div v-if="sign === '1' || sign === '2' || sign === '3' || (sign === '0' && treatRpSummary.rpStatusID !== 0) ">
        <el-button class="treatRpAuditDetails_button" @click="fanHuiRp()">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  filters: {
    // 格式化金额
    formatAmount (val) {
      return (val / 100).toFixed(2);
    },
    formatStatus (orderInfo, treatRpSummary, sign) {
      if (treatRpSummary !== undefined) {
        if (orderInfo.orderStatusID === 12 || sign === "0") {
          return "处方" + treatRpSummary.rpStatusName;
        }
      }
      if (orderInfo.orderStatusID === 32 && sign === "2") {
        return "待结算";
      }
      return orderInfo.orderStatusName;
    }
  },
  props: {
    orderId: {
      type: String,
      // 必传
      required: true
    },
    sign: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      radio: 1,
      formData: {},
      tableLoading: false,
      // 患者信息
      patientInfo: {},
      // 处理RP摘要
      treatRpSummary: {},
      // 处理RP地址
      treatRpAddress: {},
      // RP药品
      treatRpMedicines: [],
      // 订单详情
      orderInfo: {},
      // 患者历史病情汇总
      patientHistorySummary: {},
      // 患者历史病情分类
      classifies: []
    };
  },
  // 数据重组方法
  created () {
    if (
      typeof this.orderId !== "undefined" &&
      typeof this.sign !== "undefined"
    ) {
      this.getReadPatientInfo();
    } else {
      this.$_error("获取信息失败");
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    // 获取数据 渲染数据(不同的界面   数据不一样)
    // 获取患者基本信息 根据订单ID
    getReadPatientInfo () {
      let params = {
        // 获取从上一个页面传的数据
        orderId: this.orderId
      };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.API_HOU_ORDER_PATIENTINFO, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.patientInfo = res.data;
          this.getReadPatientHistory();
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 获取订单处方详情
    getReadRp () {
      let orderID = {
        // 获取从上一个页面传的数据
        orderID: this.orderId
      };
      let params = { ...orderID };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.API_HOU_ORDER_READRP, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.treatRpSummary = res.data.treatRpSummary;
          this.treatRpAddress = res.data.treatRpAddress;
          this.treatRpMedicines = res.data.treatRpMedicines;
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 获取订单其他信息
    getRead () {
      let orderID = {
        keyID: this.orderId
      };
      let params = { ...orderID };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.API_HOU_ORDER_READ, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.orderInfo = res.data;
          this.getReadRp();
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 获取患者其他信息
    getReadPatientHistory () {
      let params = {
        // 患者ID patientId 病史版本号  historyVersion
        patientID: this.patientInfo.patientID
      };
      this.$_http
        .get(this.$_API.API_HOU_PATIENT_GETSHOWHISTORY, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.classifies = res.data;
          this.getRead();
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 药师审方点击确定
    onSubmit () {
      let treatRpSummary = {
        // 处方ID
        keyID: this.treatRpSummary.keyID,
        // 订单ID
        orderID: this.orderId,
        // 药师ID (获取当前登陆人信息)
        auditorID: this.userInfo.keyID,
        // 药师姓名
        auditorName: this.userInfo.staffName,
        // 处方状态（表单数据）
        rpStatusID: this.radio,
        // 审核不通过原因（表单数据）
        refuseReason: this.formData.cause
      };
      if (treatRpSummary) {
        this.tableLoading = true;
        this.$_http
          .post(this.$_API.API_HOU_ORDER_AUDIT, {
            ...treatRpSummary
          })
          .then(response => {
            // 跳转列表界面
            this.$router.push({
              name: "treatRpAudit",
              params: { sign: "0" }
            });
          });
      }
    },
    // 点击返回按钮跳转处方列表界面
    fanHuiRp () {
      // 跳转列表界面
      // 标记 sign 0 ：药师审核过来参数
      // 标记 sign 1 ：药品发货过来的参数
      // 标记 sign 2 ：财务审核过来的参数
      // 标记 sign 3 ：协诊过来的参数
      let _this = this;
      if (_this.sign === "0") {
        _this.$router.push({
          name: "treatRpAudit",
          params: { sign: "0" }
        });
      } else if (_this.sign === "1") {
        _this.$router.push({
          name: "treatOrderDelivery",
          params: { sign: "1" }
        });
      } else if (_this.sign === "2") {
        _this.$router.push({
          name: "treatOrderFinance",
          params: { sign: "2" }
        });
      } else if (_this.sign === "3") {
        _this.$router.push({
          name: "coTreatOrder",
          params: { sign: "3" }
        });
      }
    }
  }
};
</script>
<style type="text/css" scoped>
.treatRpAuditDetails_font {
  margin-left: 24px;
  font-size: 16px;
}
.treatRpAuditDetails_R {
  font-size: 16spx;
  margin-left: 10%;
}
.treatRpAuditDetails_hr1 {
  width: 50%;
  margin-left: 24px;
  color: black;
  background-color: black;
  height: 3px;
}
.treatRpAuditDetails_hr2 {
  width: 45%;
  margin-left: 89px;
}
.treatRpAuditDetails_div {
  margin-left: 35px;
}
.treatRpAuditDetails_div2 {
  margin-left: 48px;
  display: flex;
}
.treatRpAuditDetails_div2_div1 {
  margin-right: 145px;
}
.treatRpAuditDetails_label1 {
  margin-left: 24px;
}
.treatRpAuditDetails_div4_doctor {
  margin-top: 20px;
  margin-left: 149px;
}
.treatRpAuditDetails_div4_pharmacist {
  margin-top: 20px;
  margin-left: 99px;
}
.treatRpAuditDetails_div4_order {
  margin-left: 60px;
  margin-top: 10px;
}
.treatRpAuditDetails_button {
  margin-left: 40px;
}
.treatRpAuditDetails_medicines {
  margin-left: 48px;
}
.treatRpAuditDetails_medicines_div1 {
  display: flex;
}
.treatRpAuditDetails_medicines_div1_font {
  font-size: 3%;
  margin-top: 0.3%;
}
.treatRpAuditDetails_medicines_div1_font1 {
  font-weight: 900;
}
.treatRpAuditDetails_jws {
  display: flex;
  margin-left: 9%;
}
.treatRpAuditDetails_jws_parentCode {
  margin-left: 6%;
  font-size: 15px;
}
</style>
