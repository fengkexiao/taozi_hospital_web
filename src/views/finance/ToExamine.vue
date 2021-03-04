<template>
  <div class="app-container base-page">
    <!-- 审核待开发 -->
    <div class="toExamine-div" style="width: 600px;margin: 0 auto;padding-top: 24px">
      <el-form>
        <el-form-item v-if="sign === '1' || sign === '2' || sign === '3' " label="订单编号">
          &emsp;
          <template>{{orderDrtail.keyID}}</template>
        </el-form-item>
        <el-form-item v-if="sign === '1' || sign === '2' || sign === '3' " label="创单时间">
          &emsp;
          <template>{{orderDrtail.createTime}}</template>
        </el-form-item>
        <el-form-item v-if="sign === '1' || sign === '2' || sign === '3' " label="诊断医生">
          &emsp;
          <template>{{rpDrtail.doctorName}}</template>
        </el-form-item>
        <el-form-item v-if="sign === '1' || sign === '2' || sign === '3' " label="IP医生">
          &emsp;
          <template>{{rpDrtail.assistantName}}</template>
        </el-form-item>
        <el-form-item v-if="sign === '1' || sign === '2' || sign === '3' " label="医生备注">
          &emsp;
          <template>{{orderDrtail.doctorRemark}}</template>
        </el-form-item>
        <br />
        <el-form-item v-if="sign === '1' || sign === '2' || sign === '3' " label="收货人">
          &emsp;&emsp;
          <template>{{orderDrtail.receiverName}}</template>
        </el-form-item>
        <el-form-item v-if="sign === '1' || sign === '2' || sign === '3' " label="联系电话">
          &emsp;
          <template>{{orderDrtail.receiverPhone}}</template>
        </el-form-item>
        <el-form-item v-if="sign === '1' || sign === '2' || sign === '3' " label="收货地址">
          &emsp;
          <template>{{orderDrtail.place}}</template>
        </el-form-item>
        <el-form-item v-if="sign === '1' || sign === '2' || sign === '3' " label="患者备注">
          &emsp;
          <template>{{orderDrtail.remarks}}</template>
        </el-form-item>
        <br />
        <el-form-item v-if="sign === '1' || sign === '2' || sign === '3' " label="收款方式">
          &emsp;
          <template>{{orderDrtail.payWay | formatPayWay}}</template>
        </el-form-item>
        <el-form-item v-if="sign === '1' || sign === '2' || sign === '3' " label="处方原价">
          &emsp;
          <template>{{orderDrtail.oriPrice | formatAmount}}</template>
        </el-form-item>
        <el-form-item v-if="sign === '1' || sign === '2' || sign === '3' " label="应付价格">
          &emsp;
          <template>{{orderDrtail.costPrice | formatAmount }}</template>
        </el-form-item>
        <el-form-item v-if="sign === '1' || sign === '2' || sign === '3' " label="预付金额">
          &emsp;
          <template>{{orderDrtail.prePrice | formatAmount}}&nbsp;&nbsp;&nbsp;&nbsp;（{{orderDrtail.orderStatusName}}）</template>
        </el-form-item>
        <el-form-item v-if="sign === '1' || sign === '2' || sign === '3' " label="待收金额">
          &emsp;
          <template>{{orderDrtail.waitPrice | formatAmount }}</template>
        </el-form-item>
        <el-form-item v-if="sign === '2' || sign === '3' " label="发货状态">
          &emsp;
          <template>{{orderDrtail.deliveryStatusName}}</template>
        </el-form-item>
        <el-form-item v-if="sign === '2' || sign === '3' " label="发货时间">
          &emsp;
          <template>{{orderDrtail.deliveryTime | formatDateTime}}</template>
        </el-form-item>
        <el-form-item v-if="sign === '2' || sign === '3' " label="快递公司">
          &emsp;
          <template>{{orderDrtail.deliveryCompany}}</template>
        </el-form-item>
        <el-form-item v-if="sign === '2' || sign === '3' " label="物流单号">
          &emsp;
          <template>{{orderDrtail.deliveryNo}}</template>
        </el-form-item>
        <el-form-item v-if="sign === '2' || sign === '3' " label="发货备注">
          &emsp;
          <template>{{orderDrtail.deliveryRemarks}}</template>
          <!--          <base-input-->
          <!--            type="text"-->
          <!--            v-model="orderDrtail.deliveryRemarks"-->
          <!--            placeholder="请输入发货备注"-->
          <!--            maxlength="100"-->
          <!--          ></base-input>-->
        </el-form-item>
        <br />
        <el-form-item v-if="sign === '2' || sign === '3' && orderDrtail.financeStatusID !== 0" label="财务审核人">
          &emsp;
          <template>{{orderDrtail.financeName}}</template>
        </el-form-item>
        <el-form-item v-if="sign === '2' || sign === '3' && orderDrtail.financeStatusID !== 0" label="审核时间">
          &emsp;
          <template>{{orderDrtail.financeTime}}</template>
        </el-form-item>
        <el-form-item v-if="sign === '2' || sign === '3' && orderDrtail.financeStatusID !== 0" label="财务备注">
          &emsp;
          <template>{{orderDrtail.financeRemark}}</template>
        </el-form-item>
        <el-divider></el-divider>

        <!-- 审核区域 -->
        <div v-if="sign === '1'">
          <h3>财务审核</h3>
          <el-form-item label="审核意见：">
            <template>
              <el-radio-group v-model="rpStatus">
                <el-radio :label="1">通过</el-radio>
                <el-radio :label="2">不通过</el-radio>
              </el-radio-group>
            </template>
            <base-input class="input-financeReason" v-if="rpStatus === 2" type="text" v-model="from.financeReason" placeholder="请输入不通过原因"></base-input>
          </el-form-item>
          <el-form-item label="备注：">
            &emsp;&emsp;
            <base-input type="textarea" class="input-top" v-model="from.financeRemark" placeholder="如有备注在此处填写，非必填"></base-input>
          </el-form-item>
          <div class="button-tottom">
            <el-button @click="revert()">返回</el-button>
            <el-button type="primary" @click="submission()">提交</el-button>
          </div>
        </div>
        <!-- 处方区域 -->
        <div v-if="sign === '2' || sign === '3'">
          <WestPrescription :rpDrtail="rpDrtail" :medicines="medicines"></WestPrescription>
          <el-form v-if="sign === '2' && route === 'tmc-tmcDelivery' || sign === '2' && route === 'hf-tmcDelivery'" ref="form" :model="form" :rules="formRules" label-position="left" label-width="100px">
            <el-form-item prop="expressName" label="快递公司:" style="margin-bottom: 22px">
              <el-radio-group v-model="form.expressName">
                <span v-for="(item,index) in express" :key="index" style="display: inline-block;width: 120px">
                  <el-radio :label="item.dictName">{{item.dictName}}</el-radio>
                </span>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="expressID" label="运单号:">
              <el-input v-model="form.expressID"></el-input>
            </el-form-item>
            <el-form-item label="发货备注">
              <base-input type="text" v-model="orderDrtail.deliveryRemarks" placeholder="请输入发货备注" maxlength="100"></base-input>
            </el-form-item>
          </el-form>
          <br />
          <br />
          <br />
          <br />
          <div style="text-align: center;padding-bottom: 24px">
            <el-button @click="revert()">返回</el-button>
            <el-button v-if="sign === '2' && route === 'tmc-tmcDelivery' || sign === '2' && route === 'hf-tmcDelivery'" type="primary" @click="commitDelivery">提交</el-button>
          </div>

        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import WestPrescription from "./westPrescription";
export default {
  name: "to-Examine",
  inject: ["close"],
  components: {
    // ChPrescription,
    WestPrescription
  },
  filters: {
    // 格式化金额
    formatAmount (val) {
      console.log(val)
      return (val / 100).toFixed(2);
    },
    // 过滤收款方式
    formatPayWay (val) {
      if (val === 0) {
        return "预付定金";
      } else if (val === 1) {
        return "在线支付";
      } else if (val === 2) {
        return "货到付款";
      }
    }
  },
  // 参数
  props: {
    orderID: {
      type: String,
      required: true
    },
    sign: {
      type: String,
      required: true
    },
    route: String
  },
  created () {
    if (this.$route.query.orgID) {
      this.currentOrgID = this.$route.query.orgID;
    } else {
      this.currentOrgID = this.userInfo.orgID;
    }
    // this.currentOrgID = this.orgID ? this.orgID : this.userInfo.orgID;
    if (
      typeof this.sign !== "undefined" &&
      typeof this.orderID !== "undefined"
    ) {
      this.loadTable();
    }
    // 获取快递公司
    this.getDictionary({
      systemCode: "MEDICAL",
      groupCode: "D_MEDICAL_EXPRESS_COMPANY",
      parentDictCode: ""
    }).then(res => {
      this.express = res;
    });
  },
  data () {
    return {
      currentOrgID: "", // 默认是用户的机构id
      from: {
        financeReason: ""
      },
      orderDrtail: {},
      rpStatus: "",
      rpDrtail: {},
      medicines: [],
      express: [],
      form: {
        expressName: "",
        expressID: ""
      },
      formRules: {
        expressName: {
          required: true,
          message: "快递公司不能为空"
        },
        expressID: {
          required: true,
          message: "运单号不能为空"
        }
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    ...mapActions({
      getDictionary: "dictionary/getDictionary"
    }),
    // 获取订单详情
    loadTable () {
      let _this = this;
      let params = {
        orderID: _this.orderID,
        orgID: this.currentOrgID
      };
      _this.$_http
        .get(_this.$_API.INTERFACE_TMC_GET_GOODS_ORDER_DETAIL, {
          params
        })
        .then(res => {
          if (!res.data) return;
          _this.orderDrtail = res.data;
          _this.orderDrtail.place =
            res.data.province +
            res.data.city +
            res.data.area +
            res.data.address;
          // 获取药品信息
          _this.getRp(_this.orderDrtail.rpID);
        });
    },
    // 返回
    revert () {
      this.close().then(() => {
        this.$router.push({
          name: this.route,
          params: { sign: "1" }
        });
      });
    },
    // 提交审核
    submission () {
      if (this.rpStatus === "") {
        this.$alert("您还未审核！", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => { }
        });
        return;
      }
      if (this.rpStatus === 2 && this.from.financeReason === "") {
        this.$alert("请填写审核不通过原因！", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => { }
        });
        return;
      }
      let data = {
        financeID: this.userInfo.keyID,
        orgID: this.currentOrgID,
        modifyUser: this.userInfo.keyID,
        financeName: this.userInfo.staffName,
        financeStatusID: this.rpStatus,
        orderID: this.orderID,
        ...this.from,
        modifyTime: this.orderDrtail.modifyTime
      };
      this.$_http
        .post(this.$_API.INTERFACE_TMC_POST_GOODS_ORDER_REVIEW, data)
        .then(res => {
          if (!res.code === 0) return;
          this.close().then(() => {
            this.$router.push({
              name: "finance-examine",
              params: { sign: "1" }
            });
          });
          this.$_success("审核成功");
        });
    },
    // 获取药品信息
    getRp (rpID) {
      let _this = this;
      let params = {
        rpID: rpID,
        orgID: this.currentOrgID
      };
      _this.$_http
        .get(_this.$_API.INTERFACE_TMC_GET_RP_DETAIL, {
          params
        })
        .then(res => {
          if (!res.data) return;
          _this.rpDrtail = res.data;
          _this.medicines = _this.rpDrtail.rpMedicines;
          // console.log(_this.medicines);
        });
    },
    // 验证选择快递公司
    commitDelivery () {
      let _this = this;
      this.$refs.form.validate(valid => {
        if (!valid) return;
        let data = {
          orderID: _this.orderID,
          orgID: this.currentOrgID,
          deliveryTypeID: 2, // 0:上门自取 1:送货上门 2:快递
          deliveryCompany: _this.form.expressName,
          deliveryNo: _this.form.expressID,
          deliveryMan: _this.userInfo.staffName,
          deliveryStatusID: 2, // 0:0 1:待发货 2:已发货 3:确认收货 4:已退货
          modifyUser: _this.userInfo.keyID,
          modifyTime: _this.orderDrtail.deliveryModifyTime,
          deliveryRemarks: _this.orderDrtail.deliveryRemarks
        };
        _this.$_http
          .post(_this.$_API.INTERFACE_TMC_POST_GOODS_ORDER_DELIVERY, data)
          .then(res => {
            _this.$_success("发货成功");
            _this.$refs.form.resetFields();
            _this.revert();
          });
      });
    }
  }
};
</script>

<style scoped>
.toExamine-div {
  margin-left: 4%;
}
th {
  width: 100px;
  text-align: -webkit-left;
}
td {
  width: 100px;
}
.toExamine-div2 {
  display: flex;
}
.toExamine-span1 {
  margin-right: 40%;
}
.toExamine-span2 {
  color: red;
}
.el-form-item {
  margin-bottom: 2px;
}
.input-financeReason {
  margin-left: 20px;
}
.button-tottom {
  margin-top: 30px;
  margin-left: 100px;
}
.input-top {
  margin-top: 13px;
}
</style>
