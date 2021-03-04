<template>
  <div id="financeInfoBody">
    <p>就诊信息</p>
    <el-divider></el-divider>
    <div v-for="(item,index) in treatmentList" :key="index">
      <p>{{item[0].title}}</p>
      <el-form ref="form" :modal="item[0]" label-width="135px">
        <el-form-item label="出院日期：">
          <template>{{item[0].outTime|formatDate}}</template>
        </el-form-item>
        <el-form-item label="诊疗费用：">
          <template>{{item[0].treatMoneyTotal/100}} 元</template>
          <!-- <div>&emsp;</div> -->
          <el-table :data="item[0].transferItemList" style="width: 50%" stripe>
            <el-table-column prop="projectName" label="项目" align="center"></el-table-column>
            <el-table-column prop="treatMoney" label="金额" :formatter="formatTreatMoney" align="center"></el-table-column>
          </el-table>
        </el-form-item>
        <div>&emsp;</div>
        <el-form-item label="医生首诊服务费：">
          <template>{{item[0].doctorMoney/100}}</template>
          元
        </el-form-item>
        <el-form-item label="分润规则：">
          <div>&emsp;</div>
          <el-table :data="item[0].transferOrderProfitList" style="width: 100%" stripe>
            <el-table-column min-width="120" prop="ruleName" label="规则" align="center"></el-table-column>
            <el-table-column min-width="120" prop="doctorSource" label="医生类别" align="center"></el-table-column>
            <el-table-column min-width="120" prop="groupName" label="医生组" align="center" :formatter="groupNameFormatter"></el-table-column>
            <el-table-column min-width="120" prop="patientSource" label="患者类别" align="center"></el-table-column>
            <el-table-column min-width="120" prop="treatWay" label="就诊方式" align="center"></el-table-column>
            <el-table-column min-width="120" prop="section" label="科室" align="center" :formatter="sectionFormatter"></el-table-column>
            <el-table-column min-width="120" prop="priority" label="优先级" align="center"></el-table-column>
            <el-table-column min-width="120" prop="isProfit" label="分润" :formatter="profitFormatter" align="center"></el-table-column>
            <el-table-column min-width="120" prop="projectName" label="项目" align="center"></el-table-column>
            <el-table-column min-width="120" prop="moneyRange" label="金额范围" :formatter="moneyRangeFormatter" align="center"></el-table-column>
            <el-table-column min-width="120" prop="price" label="医生首诊服务费" align="center"></el-table-column>
            <el-table-column min-width="120" prop="totalPrice" label="项目金额" :formatter="totalPriceFormatter" align="center"></el-table-column>
            <el-table-column min-width="120" prop="servicePrice" label="服务费金额" :formatter="servicePriceFormatter" align="center"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="平台服务费：">
          <template>{{item[0].platMoney/100}}</template>
          元
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orderID: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      treatmentList: []
    };
  },
  created () {
    this.getTransferInfos();
  },
  activated () { },
  methods: {
    sectionFormatter (row) {
      return row.section ? row.section : "不限";
    },
    groupNameFormatter (row) {
      return row.groupName ? row.groupName : "不限";
    },
    formatTreatMoney (row) {
      return String(row.treatMoney / 100) + "元";
    },
    moneyRangeFormatter (row) {
      return String(row.minPrice / 100) + "-" + String(row.maxPrice / 100);
    },

    totalPriceFormatter (row) {
      return row.totalPrice / 100;
    },
    servicePriceFormatter (row) {
      return row.servicePrice / 100;
    },
    profitFormatter (row) {
      return row.isProfit === 1 ? "是" : "否";
    },
    getTransferInfos () {
      this.$_http
        .get(this.$_API.INTERFACE_GET_TRANSFER_INFOS, {
          params: {
            orderId: this.orderID
          }
        })
        .then(response => {
          if (!response.data) return;
          let treatmentListTemp = [];
          this.willNotComeHospitalData = [];
          response.data.forEach(responseItem => {
            if (responseItem.hasSettle === 1) {
              treatmentListTemp.push(responseItem);
            }
            if (responseItem.hasSettle === 0) {
              this.willNotComeHospitalData.push(responseItem);
            }
          });
          let result = [];
          treatmentListTemp.forEach((item, index) => {
            console.log(index);
            item.title = "结算信息" + (index + 1);
            console.log(item.title);
            if (item.maxMoney === -1) {
              item.moneyRange = item.minMoney / 100 + " -- 无穷大";
            } else {
              item.moneyRange =
                item.minMoney / 100 + " -- " + item.maxMoney / 100;
            }
            if (item.feeTypeId === 0) {
              item.doctorIncome = item.feeRatio + "%";
            } else {
              item.doctorIncome = item.feeFix / 100 + "元";
            }
            var treatMoneyTotal = 0;
            item.transferItemList.forEach(element => {
              treatMoneyTotal += element.treatMoney;
            });
            item.treatPlanImgUrlList = [item.treatPlanImgUrl];
            item.chargeImgUrlList = [item.chargeImgUrl];
            item.inquiryResultImgUrlList = [item.inquiryResultImgUrl];
            item.checkReportImgUrlList = [item.checkReportImgUrl];
            item.treatMoneyTotal = [treatMoneyTotal];
            let tempList = [];
            tempList.push(item);
            result.push(tempList);
          });
          this.treatmentList = result;
        });
    }
  }
};
</script>

<style scoped>
</style>
