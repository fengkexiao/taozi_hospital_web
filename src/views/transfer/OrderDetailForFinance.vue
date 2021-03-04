<template>
  <div class="app-container" id="OrderDetailForFinanceBody">
    <base-loading :loading="tableLoading">
      <div style="width: 1100px;margin: 0 auto;">
        <transforInfo :orderID="orderID"></transforInfo>
        <financeInfo :orderID="orderID"></financeInfo>
        <auditDetail :order-i-d="orderID" @settleAuditReason="getSettleAuditReason"></auditDetail>
        <template>
          <template v-if="[30].includes(orderStatusId)">
            <h1>审核</h1>
            <el-divider></el-divider>
            <el-form :model="auditingData" :rules="rules" ref="ruleForm" label-width="170px" class="demo-ruleForm">
              <el-form-item label="上次审核未通过原因：" v-if="auditingData.lastSettleAuditReason">{{auditingData.lastSettleAuditReason}}</el-form-item>
              <el-form-item label="审核结果：" prop="answer">
                <el-radio-group v-model="auditingData.answer">
                  <el-radio :label="1">通过</el-radio>
                  <el-radio :label="0">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="审核不通过原因：" prop="settleAuditReason" v-if="auditingData.answer===0">
                <el-input type="textarea" :rows="3" v-model="auditingData.settleAuditReason" maxlength="200" show-word-limit></el-input>
              </el-form-item>
            </el-form>
          </template>
        </template>
        <div>&emsp;</div>&emsp; &emsp;
        <div class="bottom">
          <el-button v-if="[30].includes(orderStatusId)" type="primary" @click="ensure">保存</el-button>
          <el-button @click="back">返回</el-button>
        </div>
      </div>
    </base-loading>
  </div>
</template>

<script>
import transforInfo from "./components/transforInfo";
import financeInfo from "./components/financeInfo";
import auditDetail from "./components/auditDetail";
import { mapGetters } from "vuex";

export default {
  props: {
    orderID: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  name: "OrderDetailForFinance",
  inject: ["reload", "close"],
  components: {
    transforInfo,
    financeInfo,
    auditDetail
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      auditingData: {
        answer: "",
        settleAuditReason: "",
        lastSettleAuditReason: ""
      },
      orderStatusId: "",
      allData: {},
      tableLoading: false,
      tableData: [],
      query: {},
      pageInfo: { pageIndex: 1, pageSize: 10, totalRow: 0, totalPage: 1 },
      // 电话号码正则及提示
      rules: {
        settleAuditReason: [
          {
            required: true,
            message: "审核不通过原因不能为空",
            trigger: "blur"
          }
        ],
        answer: [
          {
            required: true,
            message: "审核结果不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created () {
    this.getOrderDetail();
    console.log(this.userInfo);
  },
  activated () {
    this.getOrderDetail();
  },
  methods: {
    getOrderDetail () {
      let orderID = this.orderID;
      this.$_http
        .get(this.$_API.INTERFACE_ORDER_DETAIL, {
          params: {
            keyId: orderID
          }
        })
        .then(res => {
          if (!res.data) return;
          let temp = res.data;
          this.allData = res.data;
          this.orderStatusId = temp.orderStatusId;
        });
    },
    // 返回列表页
    back () {
      // 关闭当前页
      this.close().then(() => {
        this.$router.push({
          name: this.address
        });
      });
    },
    ensure () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return;
        }
        if (this.auditingData.answer === 1) {
          this.agree();
        } else {
          this.disagree();
        }
      });
    },
    getSettleAuditReason (settleAuditReason) {
      this.auditingData.lastSettleAuditReason = settleAuditReason;
    },
    agree () {
      this.$_http
        .post(this.$_API.INTERFACE_SETTLE_APPROVAL, {
          keyId: this.orderID,
          settleAuditUser: this.userInfo.staffName
        })
        .then(response => {
          this.$message({
            message: "您已审核通过",
            type: "success"
          });
          this.back();
        });
    },
    disagree () {
      this.$_http
        .post(this.$_API.INTERFACE_SETTLE_REFUSE, {
          keyId: this.orderID,
          settleAuditUser: this.userInfo.staffName,
          settleAuditReason: this.auditingData.settleAuditReason
        })
        .then(response => {
          this.$message({
            message: "您已审核不通过",
            type: "success"
          });
          this.back();
        });
    }
  }
};
</script>

<style scoped>
.bottom {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
