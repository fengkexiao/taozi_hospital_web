<template>
  <div class="app-container base-page">
    <base-title name="护理价格管理"></base-title>
    <div id="hospitalPriceBody" class="pl24">
      <base-loading :loading="tableLoading">
        <el-form :modal="hospitalPriceComeData" label-width="150px" class="pt24">
          <el-form-item label="护士上门费用(元/次)" prop="price" class="form-required">
            <base-input v-model.trim="hospitalPriceComeData.paraValue" onafterpaste="hospitalPriceComeData.paraValue=hospitalPriceComeData.paraValue.replace(/[^\d]/g,'')" label-name="" form-type="number" v-on:change="changeComePriceFun()"></base-input>
          </el-form-item>
        </el-form>
        <div id="hintBody" class="mt24 pl24">
          <span>提示：</span>
          <p>1、设置价格，代表医院提供此项业务，未设置价格，代表医院不提供此项业务；</p>
          <p>2、平台收取2%的系统使用费；</p>
          <p>3、以下设置的价格指患者支付的价格；</p>
          <p>4、医生远程开处方包含护士上门服务时，可以自主选择向某家医院推送订单，若医生将订单推送给我医院，推荐医生分成10%。</p>
        </div>
        <div id="divBody">
          <el-form :modal="typeArr" v-for="(arr,indexOne) in typeArr" :key="indexOne" label-width="150px">
            <div class="divs">
              <div class="listTitle">{{arr[0].itemClassName}}</div>
              <hr class="formBottomLine" />
              <el-form :modal="arr" v-for="(items,indexTwo) in arr" :key="indexTwo" label-width="150px">
                <!--                <svg-icon :icon-class="items.itemIcon" className="iconClass" />-->
                <el-form-item :label="items.itemName" prop="items.itemName">
                  <base-input v-model.trim="items.itemPrice" :placeHolder="items.isOpen?'请输入价格':'需要请开启'" form-type="number" v-bind:disabled="items.isOpen===1?false:true" v-on:change="changeFun(items)"></base-input>
                  <template class="priceUnit"> 元</template>
                  <el-switch v-model.trim="items.isOpen" active-color="#13ce66" inactive-color="grey" :active-value="trueNum" :inactive-value="falseNum" v-on:change="changeFun(items)"></el-switch>
                </el-form-item>
                <hr class="formBottomLine" />
              </el-form>
            </div>
          </el-form>
          <div class="clear"></div>
        </div>
        <el-button v-if="buttonLoading" id="priceSureBtn" :loading="tableLoading" type="primary"  @click="makeSureOrCancel">
          保存
        </el-button>
      </base-loading>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "nursing-hospitalOrders-hospitalPrice",
  data () {
    return {
      hospitalPriceComeData: {
        orgID: "",
        groupCode: "NURSING",
        groupName: "医护上门",
        paraCode: "HOUSESERVICE",
        paraName: "上门价格",
        paraValue: ""
      },
      hospitalPriceServiceData: [],
      tableLoading: false,
      buttonLoading: false,
      typeArr: [],
      trueNum: 1,
      falseNum: 0,
      maySendArr: [],
      addNum: 0,
      indexInfo: -1,
      changeComeState: false,
      changeListState: false,
      searchState: false
    };
  },
  inject: ["reload"],
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.init();
  },
  activated () {
    if (this.searchState) {
      this.init();
    }
  },
  methods: {
    init () {
      this.hospitalPriceComeData.orgID = this.userInfo.orgID;
      this.getHospitalPrice();
      this.getHospitalPriceNursing();
    },
    // 查询：获取护士上门费用，条件：医院ID
    getHospitalPrice () {
      let hospitalInfo = {
        orgID: this.userInfo.orgID,
        groupCode: "NURSING",
        paraCode: "HOUSESERVICE"
      };
      let params = { ...hospitalInfo };
      this.$_http.get(this.$_API.INTERFACE_NURSE_ORDERS_PRICE_ONE, { params }).then(res => {
        if (!res.data) return;
        let resData = res.data;
        if (resData.paraValue) {
          resData.paraValue = resData.paraValue / 100;
        }
        this.hospitalPriceComeData.paraValue = resData.paraValue;
      });
    },
    // 查询：获取医院基础护理服务列表及价格
    getHospitalPriceNursing () {
      // 查询条件：医院ID
      let hospitalInfo = {
        hospitalID: this.userInfo.orgID
      };
      let params = { ...hospitalInfo };
      this.tableLoading = true;
      this.$_http.get(this.$_API.INTERFACE_NURSE_ORDERS_PRICE_TWO, { params }).then(res => {
        if (!res.data) return;
        this.hospitalPriceServiceData = res.data;
        this.searchState = true;
        this.getChange();
        this.buttonLoading = true;
      }).finally(it => {
        this.tableLoading = false;
      });
    },
    // 转换：将查询护理服务列表结果按类别分割
    getChange () {
      this.typeArr = [{}, {}, {}, {}];
      const typeObj = this.hospitalPriceServiceData.reduce((prev, current) => {
        if (current.itemPrice) {
          current.itemPrice = current.itemPrice / 100;
        }
        if (typeof prev[current.itemClassName] === "undefined") {
          prev[current.itemClassName] = [current];
        } else {
          prev[current.itemClassName].push(current);
        }
        return prev;
      }, {});
      Object.keys(typeObj).forEach((k) => {
        if (k === "基础护理服务") {
          this.typeArr[0] = typeObj[k];
        } else if (k === "专科护理服务") {
          this.typeArr[1] = typeObj[k];
        } else if (k === "母婴护理服务") {
          this.typeArr[2] = typeObj[k];
        } else if (k === "陪诊服务") {
          this.typeArr[3] = typeObj[k];
        } else {
          this.typeArr.push(typeObj[k]);
        }
      });
    },
    // 监听：护士上门费用变化
    changeComePriceFun () {
      this.changeComeState = true;
    },
    // 监听：form数据变化
    changeFun (items) {
      this.indexInfo = -1;
      this.changeListState = true;
      if (this.addNum !== 0) {
        let arr = items;
        for (let i = 0; i < this.maySendArr.length; i++) {
          if (this.maySendArr[i].itemCode === arr.itemCode) {
            this.indexInfo = i;
            break;
          }
        }
        if (this.indexInfo > -1) {
          this.maySendArr[this.indexInfo] = arr;
        } else {
          this.maySendArr.push(arr);
        }
      } else {
        this.maySendArr.push(items);
      }
      this.addNum++;
    },
    // 操作：保存=》显示对话框
    makeSureOrCancel () {
      if (this.hospitalPriceComeData.paraValue === "") {
        this.$_error("请填写护士上门费用");
        return;
      }
      if (this.changeComeState === true || this.changeListState === true) {
        let makeSureOne = true;
        let makeSureTwo = true;
        if (this.changeComeState === true) {
          let isOK = true;
          if (this.hospitalPriceComeData.paraValue !== 0 && !this.hospitalPriceComeData.paraValue) {
            isOK = false;
          }
          if (isOK === true) {
            makeSureOne = true;
          } else {
            makeSureOne = false;
          }
        }
        if (this.changeListState === true) {
          let isOK = true;
          this.maySendArr.forEach((item) => {
            if (item.itemPrice !== 0 && !item.itemPrice) {
              isOK = false;
            }
          });
          if (isOK === true) {
            makeSureTwo = true;
          } else {
            makeSureTwo = false;
          }
        }
        if (makeSureOne === true && makeSureTwo === true) {
          this.$confirm("确认保存此次更改吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.priceSure();
          }).catch(() => {
            this.$_info("已取消");
          });
        } else if (makeSureOne === false && makeSureTwo === false) {
          this.$_error("请填写护士上门费用以及开通服务的价格");
        } else if (makeSureOne === false) {
          this.$_error("请填写护士上门费用");
        } else if (makeSureTwo === false) {
          this.$_error("请填写开通服务的价格");
        }
      } else {
        this.$_info("没有数据变化");
      }
    },
    // 操作：确认更改
    priceSure () {
      if (this.tableLoading) {
        return;
      }
      this.tableLoading = true;
      if (this.changeComeState === true) {
        this.hospitalPriceComeData.modifyUser = this.userInfo.keyID;
        if (this.hospitalPriceComeData.paraValue !== 0) {
          this.hospitalPriceComeData.paraValue = this.hospitalPriceComeData.paraValue * 100;
        }
        this.$_http.post(this.$_API.INTERFACE_NURSE_ORDERS_PRICE_SAVE_ONE, this.hospitalPriceComeData).then(res => {
          if (!this.changeListState) {
            this.successFun();
          }
        });
      }
      if (this.changeListState === true) {
        this.maySendArr.forEach((item) => {
          item.itemPrice = item.itemPrice * 100;
          item["hospitalID"] = this.userInfo.orgID;
          item["modifyUser"] = this.userInfo.keyID;
          item["addUser"] = this.userInfo.keyID;
        });
        this.$_http.post(this.$_API.INTERFACE_NURSE_ORDERS_PRICE_SAVE_TWO, this.maySendArr).then(res => {
          this.maySendArr = [];
          this.successFun();
        }, () => {
          this.reload();
        });
      }
    },
    successFun () {
      this.$_success("保存成功");
      this.addNum = 0;
      this.tableLoading = false;
      this.changeComeState = false;
      this.changeListState = false;
      this.reload();
    }
  }
};
</script>

<style lang="scss">
#hospitalPriceBody {
  #hintBody {
    width: 650px;
    padding: 10px 10px 10px 24px;
    background-color: #ebe0ad;
    color: red;
    font-size: 14px;
    margin-bottom: 30px;
    p {
      margin: 0;
    }
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .el-form-item__label {
    text-align: left;
  }
  label {
    font-weight: normal;
  }
  .listTitle {
    font-size: 15px;
    font-weight: 700;
  }
  .careServiceTitle {
    font-size: 14px;
  }
  .el-divider--horizontal {
    margin: 12px 0;
    height: 2px;
    background-color: #b4b4b4;
  }
}
#divBody {
  width: 1400px;
  .divs {
    display: block;
    width: 520px;
    height: 414px;
    float: left;
    margin: 0 40px 20px 0;
  }
  .divs .el-switch {
    margin-left: 20px;
  }
  .priceUnit {
    margin: 0 10px;
  }
  .clear {
    clear: both;
  }
  .formBottomLine {
    width: 520px;
    margin-left: 0;
    border: 1px solid rgb(220, 220, 220);
    border-top: none;
  }
}
#hospitalPriceBody .el-input {
  margin-right: 15px;
}
#priceSureBtn {
  margin: 110px 0 0 428px;
}
.iconClass {
  width: 40px;
  height: 40px;
}
</style>
