<template>
  <div style="height: 100%;padding:10px">
    <base-loading :loading="tableLoading">
      <div v-if="isHaveRp" id="changePriceBox">
        <!--        // rpStatus： 0:建议 1：方案-->
        <div class="floatIconDiv">
          <img v-if="rpData.rp.rpStatus" class="floatIconImg" src="../../../assets/image/tmcinquiry/rpSureIocn.png" />
          <img v-else class="floatIconImg" src="../../../assets/image/tmcinquiry/rpAdvice.png" />
        </div>
        <ul>
          <li v-for="(item, index) in rpData.medicine" :key="index">
            <div class="flexRowBetweenEnd rowMarginBottom">
              <div class="rowWidthOne">
                <span class="medicineNameTxt">{{item.medicineName}}</span>
                <span class="productSpecTxt">{{item.specification}}</span>
              </div>
              <div class="flexRowStart">
                <span class="medicinePriceTxt txtMarginRight">{{item.unitPrice / 100}}元</span>
                <span class="usageDosageTxt">x&nbsp;{{item.medicineAmount}} {{item.unit}}</span>
              </div>
            </div>
            <div class="flexRowBetweenEnd">
              <div class="rowWidthTwo">
                <span class="usageDosageTxt">用法用量：&nbsp;{{item.takeDose}}{{item.formType}}&nbsp;/&nbsp;次，&nbsp;{{item.takeFrequence}}，&nbsp;{{item.takeDirection}}，&nbsp;{{item.medicationDays}}天</span>
              </div>
              <div>
                <!--                <span class="usageDosageTxt">x&nbsp;{{item.medicineAmount}}</span>-->
              </div>
            </div>
          </li>
        </ul>
        <div class="rpInfoBox">
          <div class="rowMarginBottom">
            <span class="infoTitle">处方原价：&nbsp;</span>
            <span class="priceTxt">{{rpOrderDetailData.oriPrice / 100}}元</span>
          </div>
          <div class="rowMarginBottom">
            <span class="infoTitle">支付价格：&nbsp;</span>
            <span class="costPriceTxt">{{rpOrderDetailData.costPrice / 100}}元</span>
          </div>
          <div class="rowMarginBottom">
            <span class="infoTitle">调整价格：&nbsp;</span>
            <el-input class="newOrderPriceInput" v-model.trim="costPrice" type="number" placeholder="请输入" @focus="onfocusCostPriceInputFun" @blur="onblurCostPriceInputFun" onkeyup="this.value=this.value.replace(/^(0-9)|[^\d.]/g,'')" onafterpaste="this.value=this.value.replace(/^(0-9)|[^\d.]/g,'')" /> 元
          </div>
          <div>
            <span class="infinite">付款方式：&nbsp;</span>
            <el-radio-group v-model="payWay">
              <el-radio v-for="(item, index) in payWayOptions" :key="index" :label="item.payWay">{{item.payWayName}}
              </el-radio>
            </el-radio-group>
          </div>
          <div v-show="popoverVisibleFun" class="prePriceBody">
            <div class="prePriceBox">
              <div class="trilateralDiv">
                <img src="../../../assets/image/tmcinquiry/trilateral.png" />
              </div>
              <div class="prePriceDiv">
                <div>订金金额：&nbsp;</div>
                <el-input class="prePriceInput" v-model.trim="prePrice" type="number" placeholder="请输入" clearable /> 元
              </div>
            </div>
          </div>
          <div class="btnDiv">
            <div v-if="userInfo.jobType === 1 && !rpData.rp.rpStatus" class="btnHintInfo">需要医生确认以后的处方，才能修改价格！</div>
            <!--      保存、发送患者 // jobType 0:医生 1:助理    // rpStatus： 0:建议 1：方案-->
            <div class="btnBox">
              <el-button type="primary" @click="sendRpDataFun" :disabled="userInfo.jobType === 1 && !rpData.rp.rpStatus">保存</el-button>
            </div>
          </div>
        </div>
      </div>
    </base-loading>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "TMCInquiry-orderPrice",
  data () {
    return {
      tableLoading: false,
      rpData: {
        rp: {
          price: ""
        },
        medicine: []
      },
      visible: false,
      rpOrderDetailData: {}, // 处方药品订单详情
      payWayOptions: [
        { payWay: 1, payWayName: "在线支付" },
        { payWay: 0, payWayName: "预付定金" },
        { payWay: 2, payWayName: "货到付款" }
      ],
      costPrice: "", // 调整后的价格
      payWay: 1, // 付款方式： 0：定金支付，1：全额支付，2：货到付款
      prePrice: "", // 预付金额
      isHaveRp: false, // 是否有处方
      placeholderTxt: "输入调整后的价格"
    };
  },
  computed: {
    ...mapGetters(["userInfo", "tmc"]),
    popoverVisibleFun () {
      let that = this;
      if (that.payWay === 0) {
        that.visible = true;
      } else {
        that.visible = false;
      }
      return that.visible;
    }
  },
  created () {
    if (this.tmc.inquiryID) {
      this.getRpDataFun();
    } else {
      this.isHaveRp = false;
    }
  },
  activated () {
    if (this.tmc.inquiryID) {
      this.getRpDataFun();
    } else {
      this.isHaveRp = false;
    }
  },
  methods: {
    // 查询：处方信息
    getRpDataFun () {
      let params = {
        orgID: this.userInfo.orgID,
        inquiryID: this.tmc.inquiryID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_RPINFO_DETAIL, { params })
        .then(res => {
          if (res.data && res.data.rp.keyID) {
            this.isHaveRp = true;
            this.rpData.medicine = res.data.rpMedicines;
            this.rpData.rp = res.data.rp;
            let orderID = res.data.rp.orderID;
            this.getRpOrderDetailFun(orderID);
          } else {
            this.isHaveRp = false;
          }
        });
    },
    // 查询：处方药品订单详情
    getRpOrderDetailFun (orderID) {
      let params = {
        orgID: this.userInfo.orgID,
        orderID: orderID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_GOODS_ORDER_DETAIL, { params })
        .then(res => {
          if (res.data) {
            this.rpOrderDetailData = res.data;
            if (res.data.payWay || res.data.payWay === 0) {
              this.payWay = res.data.payWay;
              if (res.data.prePrice || res.data.prePrice === 0) {
                this.prePrice = res.data.prePrice / 100;
              }
            }
          }
        });
    },
    // 操作：聚焦修改价格input框时
    onfocusCostPriceInputFun () {
      this.placeholderTxt = "";
    },
    // 操作：移除修改价格input框焦点时
    onblurCostPriceInputFun () {
      this.placeholderTxt = "输入调整后的价格";
    },
    // 操作：发送患者
    sendRpDataFun () {
      if (this.payWay === 0) {
        if (this.prePrice !== 0 && !this.prePrice) {
          this.$notify.error({
            title: "提示",
            message: "请输入订金金额"
          });
          return;
        }
        if (this.prePrice * 100 < 1) {
          this.$notify.error({
            title: "提示",
            message: "订金金额必须大于0"
          });
          return;
        }
      }
      if (this.payWay === 1) {
        if (this.costPrice !== "") {
          this.prePrice = this.costPrice;
        } else {
          this.prePrice = this.rpOrderDetailData.costPrice / 100;
        }
      }
      if (this.payWay === 2) {
        this.prePrice = 0;
      }
      // this.rpData.rp.costPrice = this.costPrice * 100;
      this.rpData.rp.payWay = this.payWay;
      this.rpData.rp.prePrice = this.payWay === 0 ? this.prePrice : "";
      let data = {
        orgID: this.userInfo.orgID,
        orderID: this.rpData.rp.orderID,
        costPrice: Number(this.costPrice) * 100,
        prePrice: this.prePrice * 100,
        payWay: this.payWay,
        modifyUser: this.userInfo.keyID
      };
      if (this.costPrice === "") {
        data.costPrice = this.rpOrderDetailData.costPrice;
      }
      this.$confirm("确认发送给患者吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableLoading = true;
          this.$_http
            .post(this.$_API.INTERFACE_TMC_POST_GOODS_ORDER_MODIFYPRICE, data)
            .then(res => {
              this.$notify({
                title: "成功",
                message: "发送给患者成功",
                type: "success"
              });
              this.getRpDataFun();
            })
            .finally(it => {
              this.tableLoading = false;
            });
        })
        .catch(() => {
          this.tableLoading = false;
          this.$notify.info({
            title: "已取消",
            message: "已取消发送给患者"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  width: 460px;
}
#changePriceBox {
  position: relative;
  font-size: 14px;
  .floatIconDiv {
    position: absolute;
    top: 50px;
    right: 0;
    .floatIconImg {
      width: 72px;
      height: 51px;
    }
  }
  .flexRowStart {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .flexRowBetweenEnd {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
  .flexRowBetweenCenter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .rowMarginBottom {
    margin-bottom: 10px;
  }
  .txtMarginRight {
    margin-right: 10px;
  }
  ul {
    padding-left: 0;
    margin-top: 0;
    li {
      list-style-type: none;
      margin: 0 0 20px 0;
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 10px;
      .rowWidthOne {
        width: 320px;
      }
      .rowWidthTwo {
        width: 370px;
      }
      .medicineNameTxt {
        margin-right: 15px;
        color: #242526;
      }
      .productSpecTxt {
        font-size: 14px;
        color: #86888b;
      }
      .usageDosageTxt {
        font-size: 14px;
        color: #86888b;
      }
    }
  }
  .medicationDaysTxt {
    color: #242526;
  }
  .infoTitle {
    color: #242526;
  }
  .priceTxt {
    color: #242526;
  }
  .medicinePriceTxt {
    font-size: 15px;
    color: #242526;
  }
  .costPriceTxt {
    color: #fe5853;
  }
  .rpInfoBox {
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    /*** 消除input元素 type="number" 时默认的 加减按钮---moz版*/
    input[type="number"] {
      -moz-appearance: textfield;
    }
    .newOrderPriceInput {
      margin-right: 10px;
      border-radius: 5px;
      //border: 1px solid #e8e8e8;
      width: 160px;
      height: 34px;
      padding-left: 5px;
      padding-right: 5px;
      font-size: 14px;
      text-align: center;
      color: #555658;
    }
    .prePriceBody {
      width: 100%;
      .prePriceBox {
        margin-top: 15px;
        margin-left: 90px;
        width: 300px;
        height: 90px;
        border-radius: 5px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border: 1px solid #e8e8e8;
        .trilateralDiv {
          width: 100%;
          margin-top: -21px;
          display: flex;
          justify-content: center;
          img {
            width: 30px;
            height: 30px;
          }
        }
        .prePriceDiv {
          margin-top: 20px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          color: #333333;
          .prePriceInput {
            margin-right: 10px;
            border-radius: 5px;
            // border: 1px solid #e8e8e8;
            width: 130px;
            height: 34px;
            padding-left: 5px;
            padding-right: 5px;
            font-size: 16px;
            text-align: center;
            color: #555658;
          }
        }
      }
    }
    .btnDiv {
      width: 100%;
      margin-top: 40px;
    }
    .btnHintInfo {
      color: rgb(140, 140, 140);
      width: 100%;
      text-align: center;
    }
    .btnBox {
      width: 100%;
      height: 90px;
      padding-bottom: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
