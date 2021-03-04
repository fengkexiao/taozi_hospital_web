<template>
  <div class="app-container" id="detailBody">
    <base-loading :loading="tableLoading">
      <div style="width: 700px;margin: 0 auto;padding-top: 24px">
        <el-form :modal="orderDetailData">
          <h3>订单信息</h3>
          <el-divider></el-divider>
          <el-form-item label="订单编号：">{{orderDetailData.keyID}}</el-form-item>
          <el-form-item label="下单时间：">{{orderDetailData.createTime | formatTime}}</el-form-item>
          <el-form-item label="供应商：">{{orgName}}</el-form-item>
          <el-form-item label="客户：">{{orderDetailData.personName}}</el-form-item>
          <el-form-item label="订单来源：">
            {{orderDetailData.orderSource == 0 ? "用户选购" : orderDetailData.orderSource == 1 ? "问诊开方" : "线下开方"}}
          </el-form-item>
          <el-form-item label="金额：">{{orderDetailData.orderPrice | formatMoney}}</el-form-item>
          <el-form-item label="订单状态：">{{orderDetailData.orderStatusName}}</el-form-item>
          <h3>药品信息</h3>
          <el-divider></el-divider>
          <el-form-item label="药品处方：" v-if="this.rpTypeID === 1">
            <span v-html="medicineName"></span><span v-if="medicineFormID && (medicineFormID == 10 || 11)">[{{Number(medicineFormID) === 10 ? "饮片" : Number(medicineFormID) === 11 ? "颗粒剂" : ""}}]</span>
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
          <el-form-item label="收货地址：">{{orderDetailData.place}}</el-form-item>
          <el-form-item label="备注：">{{orderDetailData.remarks}}</el-form-item>
          <h3>发货方式</h3>
          <el-divider></el-divider>
          <el-form-item label="发货人：">{{orderDetailData.deliveryMan}}</el-form-item>
          <el-form-item label="发货方式：">{{orderDetailData.deliveryTypeName}}</el-form-item>
          <el-form-item label="">{{orderDetailData.deliveryCompany}}&nbsp;&nbsp;{{orderDetailData.deliveryNo}}</el-form-item>
          <el-form-item label="发货时间：">{{orderDetailData.deliveryTime | formatTime}}</el-form-item>
          <el-form-item label="备注：">{{orderDetailData.deliveryRemarks}}</el-form-item>
        </el-form>
        <div style="text-align: center;padding-bottom: 24px">
          <el-button @click="back">返回</el-button>
        </div>
      </div>
    </base-loading>
  </div>
</template>

<script>
export default {
  name: "medicine-order-detail",
  props: {
    orderID: {
      type: String,
      required: true
    }
  },
  inject: ["close"],
  filters: {
    formatTime (val) {
      if (val === "1900-01-01 00:00:00") {
        return "";
      } else {
        return val;
      }
    }
  },
  data () {
    return {
      ticketCode: "",
      orderDetailData: [],
      getOrdersHospitalNameData: [],
      orgName: "",
      tableLoading: false,
      rpID: "",
      rpStatus: "",
      rpTypeID: "",
      medicineFormID: "",
      rp: {},
      // 患者信息
      patientInfo: {},
      // 药品详情
      medicines: [],
      chineseMedicine: {},
      medicineName: ""
    };
  },
  created () {
    this.getOrderDetail();
  },
  methods: {
    // 查询：预订详情
    getOrderDetail () {
      let orderID = this.orderID;
      this.$_http
        .get(
          this.$_API.INTERFACE_GET_MEDICINE_GET_ORDERS + "/?orderID=" + orderID
        )
        .then(res => {
          if (!res.data) return;
          // 填充表格数据
          this.orderDetailData = res.data;
          this.orderDetailData["place"] =
            this.orderDetailData.province +
            this.orderDetailData.city +
            this.orderDetailData.area +
            this.orderDetailData.address;
          this.rpID = res.data.rpID;
          this.getOrgName();
          if (res.data.containsRp === 1) {
            this.getrpdetail();
          }
          // console.log(res.data);
        });
    },
    getOrgName () {
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
    getrpdetail () {
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
          this.medicineFormID = this.rp.medicineFormID;
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
    // 操作：返回医生预订诊室列表页
    back () {
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
    padding-left: 150px;
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
