<template>
  <div id="auditDetailBody">
    <p>财务信息</p>
    <el-divider></el-divider>
    <el-form ref="form" :model="tableData" label-width="170px">
      <el-form-item label="出院结算操作人：">
        <span> {{tableData.settleUser}} </span>
      </el-form-item>
      <el-form-item label="出院结算操作时间：">
        <span>{{tableData.settleTime}}</span>
      </el-form-item>
      <el-form-item label="财务审核状态：">
        <template>
          <span v-if="tableData.orderStatusId===30">待审核</span>
          <span v-if="tableData.orderStatusId===31">财务审核不通过</span>
          <span v-if="[40,41,42].includes(tableData.orderStatusId)">财务审核通过</span>
        </template>
      </el-form-item>
      <el-form-item label="财务审核人：" v-if="[31,40,41,42].includes(orderStatusId)">
        <span>{{tableData.settleAuditUser}}</span>
      </el-form-item>
      <el-form-item label="财务审核时间：" v-if="[31,40,41,42].includes(orderStatusId)">
        <span>{{tableData.settleAuditTime}}</span>
      </el-form-item>
      <el-form-item label="审核不通过原因：" v-if="[31].includes(orderStatusId)">
        <span>{{tableData.settleAuditReason}}</span>
      </el-form-item>
      <el-form-item label="付款状态：" v-if="[41,42].includes(orderStatusId)">
        <span>{{tableData.payStatus}}</span>
      </el-form-item>
      <el-form-item label="付款操作人：" v-if="[41,42].includes(orderStatusId)">
        <span>{{tableData.settlePayUser}}</span>
      </el-form-item>
      <el-form-item :label="settlePayTimeTitle" v-if="[41,42].includes(orderStatusId)">
        <span>{{tableData.settlePayTime}}</span>
      </el-form-item>
      <el-form-item label="付款驳回原因：" v-if="orderStatusId===42">
        <span>{{tableData.settlePayReason}}</span>
      </el-form-item>
    </el-form>
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
  components: {

  },
  computed: {

  },
  data () {
    return {
      tableData: {},
      orderStatusId: "",
      settlePayTimeTitle: ""
    };
  },
  created () {
    this.getFormData();
  },
  activated () {
  },
  methods: {
    getFormData () {
      this.$_http.get(this.$_API.INTERFACE_AUDIT_DETAIL, {
        params: {
          keyId: this.orderID
        }
      }).then(response => {
        if (!response.data) return;
        this.tableData = response.data;
        let temp = response.data.orderStatusId;
        this.$emit("settleAuditReason", response.data.settleAuditReason);
        this.orderStatusId = temp;
        if (temp === 41) {
          this.settlePayTimeTitle = "付款时间：";
          this.tableData.payStatus = "付款完成";
        }
        if (temp === 42) {
          this.settlePayTimeTitle = "付款驳回时间：";
          this.tableData.payStatus = "付款驳回";
        }
      });
    }
  }
};
</script>
