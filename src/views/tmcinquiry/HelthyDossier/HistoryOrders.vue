<template>
  <div class="app-container base-page">
    <base-title name="历史订单列表"></base-title>
    <el-table :data="doctorGroupList" style="width: 100%" class="mt24" stripe>
      <el-table-column prop="orderID" label="订单编号" align="center"></el-table-column>
      <el-table-column prop="receiverName" label="收货人" align="center"></el-table-column>
      <el-table-column prop="receiverPhone" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="place" label="收货地址" align="center"></el-table-column>
      <el-table-column prop="payWay" label="收款方式" align="center">
        <template #default="{row}">
          <p v-if="row.payWay === 0">订金</p>
          <p v-if="row.payWay === 1">全款</p>
          <p v-if="row.payWay === 2">货到付款</p>
        </template>
      </el-table-column>
      <el-table-column prop="costPrice" label="结算金额" align="center">
        <template #default="{row}">
          <p>{{row.costPrice | formatMoney}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="prePrice" label="线上支付" align="center">
        <template #default="{row}">
          <p>{{row.prePrice | formatMoney}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="waitPrice" label="待收款" align="center">
        <template #default="{row}">
          <p>{{row.waitPrice | formatMoney}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="orderStatusName" label="支付状态" align="center"></el-table-column>
      <el-table-column prop="deliveryStatusName" label="配送状态" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div class="option-btn_group">
            <span class="opt-text" @click="toDetail(scope.row)">处方详情</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="page" @size-change="getDoctorGroupList" @current-change="getDoctorGroupList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "historyOrders",
  components: {
    // eslint-disable-next-line vue/no-unused-components
  },
  computed: {
    ...mapGetters(["userInfo", "tmc"])
  },
  filters: {
  },
  props: ["keyID", "orgID", "personID"],
  data () {
    return {
      doctorGroupList: [],
      state: "",
      dialogVisible: false,
      popHandling: false,
      formData: {},
      page: {
        pageSize: 100,
        pageIndex: 1,
        totalRow: 0
      }
    };
  },
  activated () {
    this.getDoctorGroupList();
  },
  methods: {
    getDoctorGroupList () {
      if (!this.personID) return;
      let params = {
        orgID: this.userInfo.orgID,
        buyerID: this.personID,
        pageIndex: "1",
        pageSize: "100"
      };
      // console.log(this.personID, 1212);
      this.$_http
        .post(this.$_API.INTERFACE_TMC_GET_GOODS_ORDER_LIST, params)
        .then(response => {
          if (!response.data) return;
          this.doctorGroupList = response.data.datas;
          this.doctorGroupList.forEach(item => {
            item["place"] = item.province + item.city + item.area + item.address;
          });
          // console.log(response, 1212111111);
        });
    },
    searchList () {
      this.page.pageIndex = 1;
      this.getDoctorGroupList();
    },
    handleSizeChange (val) {
      this.page.PageSize = val;
      this.getDoctorGroupList();
    },
    handleCurrentChange (val) {
      this.page.pageIndex = val;
      this.getDoctorGroupList();
    },
    // 详情
    toDetail (row) {
      if (!row || !row.keyID) {
        return;
      }
      this.$router.push({
        name: "tmc-RpDetail",
        // 跳转详情界面  传入订单 ID
        params: {
          rpID: row.rpID
        }
      });
    },
    // 提醒：表格数据错误时的处理
    dataError () {
      this.$_warning("数据出错了，正在重新获取数据");
      this.getDoctorGroupList();
    }
  },
  created () {
    this.getDoctorGroupList();
  }
};
</script>

<style scoped>
.left {
  float: left;
}
.right {
  float: right;
  margin-right: 20px;
  margin-top: 10px;
}
.color-blue {
  color: #438bef;
  font-weight: 800;
}
</style>
