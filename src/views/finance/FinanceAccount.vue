<template>
  <div class="app-container base-page">
    <base-title name="账户余额"></base-title>
    <div class="base-search_form">
      <div class="form-item" v-if="userInfo.orgTypeID === 4">
        <el-select v-model="query.accountCode" style="width:150px" @change="renewAccount">
          <el-option v-for="item in accountCodeOptions" :key="item.accountCode" :label="item.accountName" :value="item.accountCode"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">账户余额：</span>
        <div style="width:180px;font-size:20pt;color:red;">{{accountBalance.balance | formatMoney}}</div>
      </div>
      <div class="form-item">
        <span class="item-label">累计收入：</span>
        <div style="width:150px">{{accountBalance.totalIncome | formatMoney}}</div>
      </div>
      <div class="form-item" v-if="query.accountCode !== '201400'">
        <el-button type="primary" @click="rechargeMoney">充值</el-button>
      </div>
      <div class="form-item" v-if="query.accountCode !== '201400'">
        <el-button @click="retriveMoney">提现</el-button>
      </div>
    </div>
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">年月：</span>
        <el-date-picker v-model="query4Bill.yearMonth" value-format="yyyy-MM" type="month" placeholder="请选择" style="width:120px" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <span class="item-label">收支：</span>
        <el-select v-model="query4Bill.direction" style="width:100px" placeholder="请选择" clearable filterable>
          <el-option v-for="item in directionOptions" :key="item.dirID" :label="item.dirName" :value="item.dirID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">金额：</span>
        <el-input v-model="query4Bill.minAmount4Dis" style="width:100px" placeholder="请输入" clearable></el-input>
        —
        <el-input v-model="query4Bill.maxAmount4Dis" style="width:100px" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">业务：</span>
        <el-input v-model="query4Bill.bizDesc" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="queryBills">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </div>
    </div>
    <base-title name="资金账户列表"></base-title>
    <el-table :data="bills" stripe class="mt24" :loading="tableLoading">
      <el-table-column prop="billTime" label="账单时间" width="160px" align="center"></el-table-column>
      <el-table-column prop="balanceDirection" label="收支" width="60px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.balanceDirection== 0">收入</span>
          <span v-if="scope.row.balanceDirection== 1">支出</span>
        </template>
      </el-table-column>
      <el-table-column prop="billAmount" label="交易金额" width="120px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.balanceDirection== 1" style="color:green;">{{-scope.row.billAmount | formatMoney}}</span>
          <span v-if="scope.row.balanceDirection== 0">{{scope.row.billAmount | formatMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="本次余额" width="120px" align="center">
        <template slot-scope="scope">{{scope.row.balance | formatMoney}}</template>
      </el-table-column>
      <el-table-column prop="billDesc" label="业务" align="center"></el-table-column>
      <el-table-column prop="transID" label="交易号" align="center"></el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo4Bill" @size-change="queryBills" @current-change="queryBills" />
    <popup-add-by-finance-account1 :visible.sync="dialogVisible1" :popHandling="popHandling" title @save="save" />
    <popup-add-by-finance-account2 :visible.sync="dialogVisible2" :popHandling="popHandling" :propdata="this.accountBalance.balance" title @submit="submit" />
  </div>
</template>
<script>
import InputWithTip from "@/components/InputWithTip";
import { mapGetters } from "vuex";
import { formatMonth } from "../../filters";
import PopupAddByFinanceAccount1 from "./PopupAddByFinanceAccount1";
import PopupAddByFinanceAccount2 from "./PopupAddByFinanceAccount2";

export default {
  name: "FinanceAccount",
  inject: ["reload"],
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InputWithTip,
    PopupAddByFinanceAccount1,
    PopupAddByFinanceAccount2
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      pageNum: "",
      needQuery: true,
      tableLoading: false,
      dialogVisible1: false,
      dialogVisible2: false,
      popHandling: false,
      accountBalance: {
        balance: 0,
        totalIncome: 0
      },
      bills: [],
      query: {
        identity: "",
        belongID: "",
        accountCode: ""
      },
      query4Balance: {},
      query4Bill: {
        yearMonth: "",
        direction: "",
        minAmount: "",
        maxAmount: "",
        minAmount4Dis: "",
        maxAmount4Dis: "",
        bizDesc: ""
      },
      pageInfo4Bill: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      },
      directionOptions: [
        { dirID: "", dirName: "全部" },
        { dirID: "0", dirName: "收入" },
        { dirID: "1", dirName: "支出" }
      ],
      accountCodeOptions: [
        { accountCode: "201400", accountName: "现金账户" },
        { accountCode: "201011", accountName: "余额账户" }
      ]
    };
  },
  created () {
    this.initializeQueryRegion();
    if (this.needQuery) {
      this.queryBalance();
      this.queryBills();
    }
    // console.log(this.userInfo, 111);
  },
  activated () {
  },
  methods: {
    handleReset () {
      this.query4Bill = {
        yearMonth: "",
        direction: "",
        minAmount: "",
        maxAmount: "",
        minAmount4Dis: "",
        maxAmount4Dis: "",
        bizDesc: ""
      }
    },
    renewAccount () {
      this.pageInfo4Bill.pageIndex = 1;
      this.queryBalance();
      this.queryBills();
    },
    initializeQueryRegion () {
      this.query.identity = "G";
      this.query.accountCode = this.userInfo.orgTypeID === 4 ? "201400" : "201011";
      this.query.belongID = this.userInfo.orgID;
      this.query4Bill.yearMonth = formatMonth(new Date());
      this.query4Bill.direction = "";
    },
    rechargeMoney () {
      this.dialogVisible1 = true;
    },
    // 提交
    save (data) {
      let params = {
        accountName: data.accountName,
        amount: data.amount * 100,
        linkName: data.linkName,
        linkPhone: data.linkPhone,
        hospitalID: this.userInfo.orgID,
        hospitalApplyID: this.userInfo.keyID,
        remark: data.remark,
        hospitalApplyName: this.userInfo.staffName
      };
      this.popHandling = true;
      this.$_http
        .post(this.$_API.INTERFACE_FINANCE_RECHARGE, params)
        .then(res => {
          this.$_success("提交成功");
          this.dialogVisible1 = false;
          this.formData = {};
        })
        .finally(it => {
          this.popHandling = false;
          this.formData = {};
          this.initializeQueryRegion();
          if (this.needQuery) {
            this.queryBalance();
            this.queryBills();
          }
        });
    },
    retriveMoney () {
      this.dialogVisible2 = true;
    },
    // 提交
    submit (data) {
      let params = {
        accountName: data.accountName,
        accountNo: data.accountNo,
        accountBank: data.accountBank,
        amount: data.amount * 100,
        linkName: data.linkName,
        linkPhone: data.linkPhone,
        hospitalID: this.userInfo.orgID,
        hospitalApplyID: this.userInfo.keyID,
        remark: data.remark,
        hospitalApplyName: this.userInfo.staffName
      };
      this.popHandling = true;
      this.$_http
        .post(this.$_API.INTERFACE_FINANCE_WITHDRAWAL, params)
        .then(res => {
          this.$_success("提交成功");
          this.dialogVisible2 = false;
          this.formData = {};
        })
        .finally(it => {
          this.popHandling = false;
          this.formData = {};
          this.initializeQueryRegion();
          if (this.needQuery) {
            this.queryBalance();
            this.queryBills();
          }
        });
    },
    queryBalance () {
      this.$_http
        .post(this.$_API.INTERFACE_FINANCE_BALANCE, {
          ...this.query
        })
        .then(res => {
          if (!res.data) return;
          this.accountBalance = res.data;
        });
    },
    queryBills () {
      this.query4Bill.minAmount =
        this.query4Bill.minAmount4Dis === ""
          ? ""
          : this.query4Bill.minAmount4Dis * 100;
      this.query4Bill.maxAmount =
        this.query4Bill.maxAmount4Dis === ""
          ? ""
          : this.query4Bill.maxAmount4Dis * 100;
      // console.log(this.query4Bill.minAmount);
      // console.log(this.query4Bill.maxAmount);
      this.$_http
        .post(this.$_API.INTERFACE_FINANCE_BILLS, {
          ...this.query,
          ...this.query4Bill,
          ...this.pageInfo4Bill
        })
        .then(res => {
          if (!res.data) return;
          let receiveDataTemp = res.data;
          this.bills = receiveDataTemp.datas;
          this.pageInfo4Bill = receiveDataTemp.pageInfo;
        });
    }
  }
};
</script>
