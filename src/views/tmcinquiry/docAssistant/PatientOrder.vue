<template>
  <div style="height: 100%;padding: 10px">
    <base-loading :loading="tableLoading">
      <div id="patientOrderBody">
        <div v-for="(item, index) in historyOrderListData" :key="index" :class="[{ 'orderBorderBottom': index < (historyOrderListData.length - 1) }]">
          <div class="orderHeaderBox flexRowBetweenCenter">
            <div>
              <span class="orderIDTxt">订单编号：{{item.keyID}}</span>
            </div>
            <div>
              <span class="orderStatus">{{item.orderStatusName}}</span>
            </div>
          </div>
          <div class="orderBodyBox">
            <div class="flexRowStartCenter orderTableHeader rowPadding">
              <div class="orderColWidth">商品名称</div>
              <div class="orderColWidth">规格</div>
              <div class="orderColWidthThree">单价（元）</div>
              <div class="orderColWidthTwo">数量</div>
            </div>
            <div v-for="(its, ind) in item.medicineList" :key="ind" class="flexRowStartCenter orderMedicineDiv rowPadding" :class="[{ 'evenNumberRow': (ind + 1)%2 === 0}]">
              <div class="orderColWidth">{{its.medicineName}}</div>
              <div class="orderColWidth">{{its.specification}}</div>
              <div class="orderColWidthThree">{{its.unitPrice / 100}}</div>
              <div class="orderColWidthTwo">{{its.medicineAmount}}</div>
            </div>
          </div>
          <div class="orderBottomBox">
            <div class="totalPriceDiv">
              <span class="totalPriceTitle">总价：&nbsp;</span>
              <span class="totalPriceTxt">{{item.costPrice / 100}}元</span>
            </div>
            <!--            操作记录-->
            <!-- <div class="orderHistoryOperationBox">
             <ul class="el-timeline is-reverse">
               <li class="el-timeline-item" v-for="(it, indexs) in item.historyListData" :key="indexs">
                 <div class="taskCreateTimeTxt">{{it.addTime | formatDate}}</div>
                 <div class="el-timeline-item__tail"></div>
                 <div class="el-timeline-item__node el-timeline-item__node&#45;&#45;normal el-timeline-item__node&#45;&#45;"></div>
                 <div class="el-timeline-item__wrapper">
                   <div class="el-timeline-item__content taskContentTtx">{{it.dateTimeChange}}&nbsp;&nbsp;&nbsp;&nbsp;{{it.doThing}}</div>
                 </div>
               </li>
             </ul>
           </div> -->
          </div>
        </div>
      </div>
    </base-loading>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "TMCInquiry-order",
  data () {
    return {
      tableLoading: false,
      getPeachOrdersData: {},
      getOrdersHospitalNameData: [],
      historyOrderListData: []
    };
  },
  computed: {
    ...mapGetters(["userInfo", "tmc"])
  },
  created () {
    if (this.tmc.personID) {
      this.getHistoryOrderListDataFun(); // 查询
    }
  },
  activated () {
    if (this.tmc.personID) {
      this.getHistoryOrderListDataFun(); // 查询
    }
  },
  methods: {
    // 查询：历史订单
    getHistoryOrderListDataFun () {
      let params = {
        orgID: this.userInfo.orgID,
        buyerID: this.tmc.personID,
        pageIndex: "1",
        pageSize: "100"
      };
      this.$_http
        .post(this.$_API.INTERFACE_TMC_GET_GOODS_ORDER_LIST, params)
        .then(res => {
          if (res.data) {
            this.historyOrderListData = res.data.datas;
            this.changeHistoryOrderListDataFun();
            this.getOrdersHospitalNameFun();
          } else {
            this.historyOrderListData = [];
          }
        });
    },
    // 查询：批量查询处方
    getOrdersHospitalNameFun () {
      if (this.historyOrderListData.length > 0) {
        let rpIDs = [];
        for (let i = 0; i < this.historyOrderListData.length; i++) {
          if (rpIDs.length === 0) {
            rpIDs.push(this.historyOrderListData[0].rpID);
          } else {
            let isEqual = false;
            for (let j = 0; j < rpIDs.length; j++) {
              if (this.historyOrderListData[i].rpID === rpIDs[j]) {
                isEqual = true;
              }
            }
            if (isEqual === false) {
              rpIDs.push(this.historyOrderListData[i].rpID);
            }
          }
        }
        let data = {
          orgID: this.userInfo.orgID,
          rpIDs: rpIDs
        };
        this.$_http
          .post(this.$_API.INTERFACE_TMC_GET_RP_DETAILLIST, data)
          .then(res => {
            if (!res.data) return;
            this.getOrdersHospitalNameData = res.data;
            this.addOrdersHospitalNameFun();
          });
      } else {
      }
    },
    // 增加：增加药品
    addOrdersHospitalNameFun () {
      this.historyOrderListData.forEach(item => {
        for (let key in this.getOrdersHospitalNameData) {
          if (item.rpID === key) {
            this.$set(
              item,
              "medicineList",
              this.getOrdersHospitalNameData[key].medicineList
            );
          }
        }
      });
    },
    // 转换：操作日期
    changeHistoryOrderListDataFun () {
      this.historyOrderListData.forEach(it => {
        if (it.historyListData && it.historyListData.length > 0) {
          it.historyListData.forEach(item => {
            let dateTimeChange = this.changeAddTimeFun(item.addTime);
            this.$set(item, "dateTimeChange", dateTimeChange);
          });
        }
      });
    },
    // 转换：日期为xxxx年x月x日 时:分:秒
    changeAddTimeFun (dateTime) {
      let dateTimes = new Date(dateTime);
      let m = dateTimes.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = dateTimes.getDate();
      d = d < 10 ? "0" + d : d;
      let h = dateTimes.getHours();
      h = h < 10 ? "0" + h : h;
      let minute = dateTimes.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      let seconds = dateTimes.getSeconds();
      seconds = seconds < 10 ? "0" + seconds : seconds;
      let dateTimeChange = dateTimes.getFullYear() + "年" + m + "月" + d + "日 " + h + ":" + minute + ":" + seconds;
      return dateTimeChange;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  // width: 460px;
}
.flexRowStartCenter {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.flexRowBetweenCenter {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.rowPadding {
  padding-top: 10px;
  padding-bottom: 10px;
}
#patientOrderBody {
  width: 100%;
  font-size:14px;
  .orderBorderBottom {
    width: 100%;
    margin-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;
  }
  .orderHeaderBox {
    margin-bottom: 10px;
    .orderIDTxt {
      font-size: 14px;
      color: #555658;
    }
    .orderStatus {
      color: #555658;
    }
  }
  .orderBodyBox {
    border: 1px solid #e8e8e8;
    border-bottom: none;
    text-align: center;
    .orderColWidth {
      width: 110px;
      padding: 0 5px;
    }
    .orderColWidthTwo {
      width: 60px;
    }
    .orderColWidthThree {
      width: 100px;
    }
    .orderTableHeader {
      background-color: #d0e2fb;
    }
    .orderMedicineDiv {
      font-size: 14px;
      border-bottom: 1px solid #e8e8e8;
    }
    .evenNumberRow {
      background-color: rgba(0, 0, 0, 0.03);
    }
  }
  .orderBottomBox {
    .totalPriceDiv {
      margin-top: 10px;
      margin-bottom: 10px;
      text-align: right;
      .totalPriceTitle {
        font-size: 14px;
        color: #555658;
      }
      .totalPriceTxt {
        color: #fe5853;
      }
    }
    .orderHistoryOperationBox {
      ul {
        padding-left: 85px;
        .el-timeline-item {
          padding-bottom: 6px;
        }
        .el-timeline-item__node--normal {
          left: 1px;
          width: 8px;
          height: 8px;
        }
        .el-timeline-item__tail {
          top: 3px;
        }
      }
      .taskCreateTimeTxt {
        position: absolute;
        left: -85px;
        top: -1px;
        font-size: 14px;
        color: #555658;
      }
      .taskContentTtx {
        font-size: 14px;
        color: #242526;
      }
      .docAssistantName {
        font-size: 14px;
        color: #555658;
      }
    }
  }
}
</style>
