<template>
  <div class="app-container base-page" id="detailBody">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">处方订单来源：</span>
        <el-select v-model="query.orgID" placeholder="请选择" clearable filterable>
          <el-option v-for="(item) in rpOrgIDList" :key="item.keyID" :label="item.paraName" :value="item.orgID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">订单编号：</span>
        <el-input v-model="query.goodsOrderID" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">患者姓名：</span>
        <el-input v-model="query.buyerName" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">收货人：</span>
        <el-input v-model="query.receiverName" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">联系电话：</span>
        <el-input v-model="query.receiverPhone" maxlength="11" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">省：</span>
        <el-input v-model="query.province" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">市：</span>
        <el-input v-model="query.city" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">发货状态：</span>
        <el-select v-model="query.deliveryStatusID" placeholder="请选择" clearable filterable>
          <el-option v-for="(item) in deliveryStatus" :key="item.deliveryStatusID" :label="item.deliveryStatusName" :value="item.deliveryStatusID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">发货人：</span>
        <el-input v-model="query.deliveryMan" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">创单时间：</span>
        <el-date-picker v-model="createTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="loadTable">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </div>

    <base-title name="TMC药房发货列表"></base-title>
    <el-table :data="tableData" stripe :loading="tableLoading" class="mt24">
      <el-table-column prop="orgName" label="处方订单来源" align="center" width="155px"></el-table-column>
      <el-table-column prop="keyID" label="订单编号" align="center"></el-table-column>
      <el-table-column prop="buyerName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="receiverName" label="收货人" align="center"></el-table-column>
      <el-table-column prop="receiverPhone" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="5" label="省市区">
        <template #default="{row}">{{row | formatProvince}}</template>
      </el-table-column>
      <el-table-column prop="address" label="详细地址" align="center"></el-table-column>
      <el-table-column prop="assistantName" label="IP医生" align="center"></el-table-column>
      <el-table-column prop="doctorName" label="开方医生" align="center"></el-table-column>
      <el-table-column prop="payWay" label="收款方式">
        <template #default="{row}">{{row.payWay | formatPayWay}}</template>
      </el-table-column>
      <el-table-column prop="orderStatusName" label="收款状态" align="center"></el-table-column>
      <el-table-column prop="costPrice" label="总价(元)" align="center">
        <template #default="{row}">{{row.costPrice | formatAmount}}</template>
      </el-table-column>
      <el-table-column prop="prePrice" label="预付(元)" align="center">
        <template #default="{row}">{{row.prePrice | formatAmount}}</template>
      </el-table-column>
      <el-table-column prop="waitPrice" label="待收(元)" align="center">
        <template #default="{row}">{{row.waitPrice | formatAmount}}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="创单时间" align="center" width="155px"></el-table-column>
      <el-table-column prop="deliveryStatusName" label="发货状态" align="center"></el-table-column>
      <el-table-column prop="deliveryMan" label="发货人" align="center"></el-table-column>
      <el-table-column prop="deliveryTime" label="发货时间" align="center" width="155px">
        <template #default="{row}">{{row.deliveryTime | formatTime }}</template>
      </el-table-column>
      <el-table-column prop="18" label="操作" width="180" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="details(row)">详情</span>
            <span class="opt-text" v-if="row.orderStatusID === 10 && row.deliveryStatusID === 1" @click="confirmDelivery(row)">发货</span>
            <span class="opt-text" v-if="row.deliveryStatusID === 2" @click="updataState(row)">确认收货</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
    <!-- 确认收货 -->
    <span id="cancelBody">
      <el-dialog title="确认收货" :visible.sync="updataStates" width="500px">
        <el-form label-width="100px">
          <el-form-item label="订单状态">
            <template>
              <el-radio-group v-model="updataRadio">
                <el-radio :label="3">已收货</el-radio>
                <el-radio :label="4">拒收</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
        </el-form>
        <div class="treatOrder_div">
          <div class="treatOrder_button1">
            <el-button @click="cancelStates">取消</el-button>
          </div>
          <div>
            <el-button type="primary" @click="okStates">确定</el-button>
          </div>
        </div>
      </el-dialog>
    </span>
  </div>
</template>

<script>
import { formatDate } from "../../filters";
import { mapGetters } from "vuex";
export default {
  name: "hf-tmcDelivery",
  filters: {
    // 过滤省市区
    formatProvince (row) {
      if (row.province || row.city || row.area) {
        return row.province + row.city + row.area;
      }
      return "";
    },
    // 格式化金额
    formatAmount (val) {
      return (val / 100).toFixed(2);
    },
    // 过滤时间
    formatTime (val) {
      if (val === "1900-01-01 00:00:00") {
        return "";
      } else {
        return val;
      }
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
  inject: ["close"],
  data () {
    return {
      query: {
        orderStatusID: "",
        payWay: "",
        deliveryStatusID: "",
        orgID: ""
      },
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      },
      rpOrgIDList: [],
      tableData: [],
      tableLoading: false,
      rpStatus: [
        { reviewStatus: "", reviewStatusName: "全部" },
        { reviewStatus: 0, reviewStatusName: "未审核" },
        { reviewStatus: 1, reviewStatusName: "审核通过" },
        { reviewStatus: 2, reviewStatusName: "审核不通过" }
      ],
      // 更新状态控制
      updataStates: false,
      updateItem: {},
      updataRadio: 3,
      // 付款方式
      stateOptions: [
        { payWay: "", payWayName: "全部" },
        { payWay: "0", payWayName: "定金" },
        { payWay: "1", payWayName: "全款 " },
        { payWay: "2", payWayName: "货到付款 " }
      ],
      orderStatus: [
        { orderStatusID: "", orderStatusName: "全部" },
        { orderStatusID: "0", orderStatusName: "待支付" },
        { orderStatusID: "2", orderStatusName: "已取消" },
        { orderStatusID: "10", orderStatusName: "支付成功" },
        { orderStatusID: "11", orderStatusName: "支付失败" },
        { orderStatusID: "20", orderStatusName: "申请退款" },
        { orderStatusID: "21", orderStatusName: "待退款" },
        { orderStatusID: "22", orderStatusName: "退款中" },
        { orderStatusID: "23", orderStatusName: "退款成功" },
        { orderStatusID: "24", orderStatusName: "退款失败" }
      ],
      deliveryStatus: [
        { deliveryStatusID: "", deliveryStatusName: "全部" },
        { deliveryStatusID: "1", deliveryStatusName: "待发货" },
        { deliveryStatusID: "2", deliveryStatusName: "已发货" },
        { deliveryStatusID: "3", deliveryStatusName: "确认收货" },
        { deliveryStatusID: "4", deliveryStatusName: "已退货" }
      ],
      place: [],
      createTime: [],
      // 行数据暂存
      Y: {},
      // 快递公司名字
      expressName: ""
    };
  },
  activated () {
  },
  created () {
    this.setPickerTimes();
    this.getRpOrgIDList();
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    getInstant1st () {
      let date = new Date();
      let separator = "-";
      let year = date.getFullYear();
      let beginDate = new Date(year + separator + "01-01");
      return beginDate;
    },
    setPickerTimes () {
      let startDate = this.getInstant1st();
      let endDate = new Date();
      this.createTime = [startDate, endDate];
    },
    reset () {
      this.query = {
        orderStatusID: "",
        payWay: "",
        deliveryStatusID: "",
        orgID: ""
      };
      this.createTime = [];
    },
    // 查询处方订单来源
    getRpOrgIDList () {
      let params = {
        orgID: this.userInfo.orgID,
        groupCode: "OP_TMC_ORG",
        paraCode: "OP_TMC_ORG_HUAFUSTORE",
        paraValue: "1"
      };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_HOSPITALUSER_ORGPARAS, { params })
        .then(res => {
          if (res.data) {
            this.rpOrgIDList = res.data;
            // 默认选择第一个
            if (this.rpOrgIDList.length > 0) {
              this.query.orgID = this.rpOrgIDList[0].orgID;
            }
          }
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    loadTable () {
      if (!this.query.orgID) {
        this.$message.error("请选择处方订单来源");
        return false;
      }
      let startTime = formatDate(this.createTime[0]);
      let endTime = formatDate(this.createTime[1]);
      let data = {
        ...this.query,
        startTime: startTime,
        endTime: endTime,
        ...this.pageInfo
      };
      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_TMC_GET_GOODSORDER_GETLISTFORDELIVERY, data)
        .then(res => {
          if (!res.data) return;
          // 填充表格数据
          this.tableData = res.data.datas;
          this.pageInfo = res.data.pageInfo;
          console.log(this.tableData);
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 更新状态
    updataState (row) {
      let _this = this;
      this.updateItem = row;
      _this.updataStates = true;
      _this.Y = row;
    },
    // 发货
    confirmDelivery (row) {
      this.$router.push({
        name: "to-Examine",
        params: {
          orderID: row.keyID,
          sign: "2",
          route: "hf-tmcDelivery"
        },
        query: { orgID: row.orgID }
      });
    },
    // 详情
    details (row) {
      this.$router.push({
        name: "to-Examine",
        params: {
          orderID: row.keyID,
          sign: "3",
          route: "hf-tmcDelivery"
        },
        query: { orgID: row.orgID }
      });
    },
    // 返回修改状态
    cancelStates () {
      let _this = this;
      _this.updataStates = false;
    },
    // 发货界面点击确定
    okStates () {
      let _this = this;
      let data = {
        orgID: this.updateItem.orgID,
        orderID: _this.Y.keyID,
        deliveryStatusID: _this.updataRadio,
        modifyUser: _this.userInfo.keyID
      };
      _this.$_http
        .post(_this.$_API.INTERFACE_TMC_POST_GOODS_ORDER_CHANGE_STATUS, data)
        .then(res => {
          if (!res.code === 0) return;
          _this.updataStates = false;
          _this.loadTable();
          _this.$_success("修改状态成功");
        });
    }
  }
};
</script>

<style lang="scss">
</style>

<style scoped>
.treatOrder_button1 {
  margin-right: 100px;
  margin-left: 90px;
}
.treatOrder_div {
  display: flex;
}
</style>
