<template>
  <div class="app-container" id="detailBody">
    <base-loading :loading="tableLoading">
      <div style="width: 700px;margin: 0 auto;padding-top: 24px">
        <el-form :modal="orderDetailData">
          <h3>订单信息</h3>
          <el-divider></el-divider>
          <el-form-item label="订单编号：">{{orderDetailData.keyID}}</el-form-item>
          <el-form-item label="下单时间：">{{orderDetailData.createTime}}</el-form-item>
          <el-form-item label="供应商：">{{orgName}}</el-form-item>
          <el-form-item label="客户：">{{orderDetailData.personName}}</el-form-item>
          <el-form-item label="订单来源：">
            {{orderDetailData.orderSource == 0 ? "用户选购" : orderDetailData.orderSource == 1 ? "问诊开方" : "线下开方"}}
          </el-form-item>
          <el-form-item label="金额：">{{orderDetailData.orderPrice | formatMoneyForSumShow}}</el-form-item>
          <el-form-item label="订单状态：">{{orderDetailData.orderStatusName}}</el-form-item>
          <el-divider></el-divider>
          <h3>药品信息</h3>
          <el-divider></el-divider>
          <el-form-item label="药品处方：" v-if="this.rpTypeID === 1">
            <span v-html="medicineName"></span>
          </el-form-item>
          <el-form-item label="用法用量：" v-if="this.rpTypeID === 1">
            {{chineseMedicine.direction}}，共{{this.rp.totalDoses}}剂，每日{{chineseMedicine.everyDose}}剂，每剂分{{chineseMedicine.frequence}}次服用。
          </el-form-item>
          <el-table :data="orderDetailData.details" border v-if="this.rpTypeID !== 1">
            <el-table-column prop="medicineName" label="药品名称"></el-table-column>
            <el-table-column prop="productSpec" label="规格"></el-table-column>
            <el-table-column prop="productFactory" label="生产厂家"></el-table-column>
            <el-table-column prop="priceItem" label="单价(元)">
              <template slot-scope="scope">
                <p>{{scope.row.priceItem | formatMoney}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="itemCount" label="数量"></el-table-column>
          </el-table>
          <h3>收货信息</h3>
          <el-divider></el-divider>
          <el-form-item label="收货人：">{{orderDetailData.receiverName}}</el-form-item>
          <el-form-item label="联系电话：">{{orderDetailData.receiverPhone}}</el-form-item>
          <el-form-item label="收货地址：">
            {{orderDetailData.province}}{{orderDetailData.city}}{{orderDetailData.area}}{{orderDetailData.address}}
          </el-form-item>
          <el-form-item label="备注：">{{orderDetailData.remarks}}</el-form-item>
          <h3>发货方式</h3>
          <el-divider></el-divider>

          <el-form :model="hospitalPromote" :rules="rules" ref="hospitalPromote">
            <el-form-item label="发货方式" prop="deliveryTypeID" v-model="deliveryTypeID">
              <el-radio v-model="deliveryTypeID" :label="0">上门自取</el-radio>
              <el-radio v-model="deliveryTypeID" :label="1">送药上门</el-radio>
              <el-radio v-model="deliveryTypeID" :label="2">物流配送</el-radio>
            </el-form-item>

            <el-form-item label="快递公司:" prop="deliveryCompany" v-show="showMark">
              <!-- <el-input type="text" v-model="hospitalPromote.deliveryCompany" maxlength=30 size="mini"></el-input> -->
              <el-select v-model="hospitalPromote.deliveryCompany" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="快递单号:" prop="deliveryNo" style="margin-top: 15px;" v-show="showMark">
              <el-input type="text" v-model="hospitalPromote.deliveryNo" maxlength=30 size="mini"></el-input>
            </el-form-item>
            <el-form-item label="备注:" prop="deliveryRemarks" style="margin-top: 15px;">
              <el-input type="textarea" :rows="3" v-model="hospitalPromote.deliveryRemarks"></el-input>
            </el-form-item>
          </el-form>
        </el-form>
        <div style="padding-top: 36px;padding-bottom: 24px;text-align: center;">
          <el-button  @click="back">返回</el-button>
          <el-button type="primary"  @click="deliver">发货</el-button>
        </div>
      </div>
    </base-loading>
  </div>
</template>

<script>
// import axios from "../../plugins/modules/axios";

export default {
  name: "medicine-deliverGoods",
  props: {
    orderID: {
      type: String,
      required: true
    },
    payTypeID: {}
  },
  inject: ["close"],
  data() {
    return {
      ticketCode: "",
      orderDetailData: [{}],
      getOrdersHospitalNameData: [],
      orgName: "",
      rpID: "",
      tableLoading: false,
      rpStatus: "",
      rpTypeID: "",
      showMark: false,
      rp: {},
      // 患者信息
      patientInfo: {},
      // 药品详情
      medicines: [],
      chineseMedicine: {},
      medicineName: "",
      deliveryTypeID: "",
      hospitalPromote: {
        deliveryRemarks: "",
        deliveryCompany: "",
        deliveryNo: ""
      },
      rules: {
        deliveryRemarks: {
          required: true,
          message: "不能为空"
        },
        deliveryTypeID: {
          required: true,
          message: "不能为空"
        },
        deliveryCompany: {
          required: true,
          message: "不能为空"
        },
        deliveryNo: {
          required: true,
          message: "不能为空"
        }
      },
      options: []
    };
  },
  created() {
    this.getOrderDetail();
    this.getExpress();
  },
  watch: {
    deliveryTypeID: {
      handler(newName) {
        if (newName === 2) {
          this.showMark = true;
        } else {
          this.showMark = false;
        }
      },
      immediate: true
    }
  },
  activated() {
    // this.getOrderDetail();
  },
  methods: {
    // 获取快递公司
    getExpress() {
      let params = {
        systemCode: "MEDICAL",
        groupCode: "D_MEDICAL_EXPRESS_COMPANY"
      };
      this.$_http
        .get(
          this.$_API.INTERFACE_CONFIRM_GETEXPRESS,
          { params }
        )
        .then(res => {
          res.data.forEach(i => {
            this.options.push({
              value: i.dictName,
              label: i.dictName
            });
          });
        });
    },
    // 查询：预订详情
    getOrderDetail() {
      let orderID = this.orderID;
      this.$_http
        .get(
          this.$_API.INTERFACE_GET_MEDICINE_GET_ORDERS + "/?orderID=" + orderID
        )
        .then(res => {
          if (!res.data) return;
          // 填充表格数据
          this.orderDetailData = res.data;
          this.deliveryTypeID = this.orderDetailData.deliveryTypeID;
          this.rpID = res.data.rpID;
          // console.log(this.deliveryTypeID);
          this.getOrgName();
          if (res.data.containsRp === 1) {
            this.getrpdetail();
          }
        });
    },
    getOrgName() {
      let orgIDs = [];
      orgIDs.push(this.orderDetailData.orgID);
      this.$_http
        .post(this.$_API.INTERFACE_NURSE_ORDERS_PRICE_FOUR, orgIDs)
        .then(res => {
          if (!res.data) return;
          this.getOrdersHospitalNameData = res.data;
          this.orgName = this.getOrdersHospitalNameData[0].orgName;
        });
    },
    // 获取处方详情
    getrpdetail() {
      let params = {
        inquiryId: this.rpID
      };
      this.$_http
        .get(this.$_API.API_RP_PRESCRIPTION_GETRPDETAIL, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.rp = res.data;
          this.rpStatus = this.rp.rpStatus;
          this.rpTypeID = this.rp.rpTypeID;
          this.patientInfo = this.rp.patientInfo;
          this.medicines = this.rp.medicines;
          this.chineseMedicine = this.rp.chineseMedicine;
          this.medicines.forEach(item => {
            this.medicineName +=
              item.medicineName + " " + item.medicineAmount + item.unit;
            if (item.takeDirection) {
              this.medicineName += "（" + item.takeDirection + "）";
            }
            this.medicineName += "&#12288;&#12288;";
          });
          // console.log(this.rpTypeID);
        });
    },
    // 发货
    deliver() {
      if (this.deliveryTypeID === 2 && !this.hospitalPromote.deliveryCompany) {
        this.$alert("请填写快递公司！", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      if (this.deliveryTypeID === 2 && !this.hospitalPromote.deliveryNo) {
        this.$alert("请填写快递单号！", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      if (!this.hospitalPromote.deliveryRemarks) {
        this.$alert("请填写备注！", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      let params = {
        orderID: this.orderID,
        deliveryTypeID: this.deliveryTypeID,
        payTypeID: this.payTypeID,
        deliveryRemarks: this.hospitalPromote.deliveryRemarks,
        deliveryCompany: this.hospitalPromote.deliveryCompany,
        deliveryNo: this.hospitalPromote.deliveryNo,
        // deliveryNo: this.$store.state.user.userInfo.staffName,
        deliveryMan: this.$store.state.user.userInfo.staffName
      };
      // console.log(params);
      this.$_http
        .post(this.$_API.INTERFACE_POST_ORDERDELIVER, params)
        .then(response => {
          this.close().then(() => {
            this.$router.push({
              name: "hospitalOrders",
              params: {}
            });
          });
        });
    },
    // 操作：返回医生预订诊室列表页
    back() {
      // 关闭当前页
      this.close().then(() => {
        this.$router.push({
          name: "hospitalOrders",
          params: {}
        });
      });
    }
  }
};
</script>

<style lang="scss">
#detailBody {
  .el-calendar__button-group {
    display: none;
  }

  .el-button-group {
    padding-left: 80px;
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .el-form-item__label {
    color: black;
  }

  label {
    font-weight: normal;
  }

  .el-form-item__content {
    padding-left: 50px;
    line-height: 30px;
  }

  .el-form-item--medium,
  .el-form-item__label {
    line-height: 30px;
  }

  .el-button--medium {
    margin-top: 20px;
  }
}
</style>
