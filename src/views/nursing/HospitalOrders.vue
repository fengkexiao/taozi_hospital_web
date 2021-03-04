<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">医生姓名：</span>
        <el-input v-model="query.doctorName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">患者姓名：</span>
        <el-input v-model="query.patientName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">状态：</span>
        <el-select v-model="serviceStatusID" placeholder="请选择" filterable clearable value="">
          <el-option v-for="item in stateOptions" :key="item.serviceStatusID" :label="item.serviceStatusName" :value="item.serviceStatusID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">服务时间：</span>
        <el-date-picker v-model="searchTimes" type="month" placeholder="请选择(必选)" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getNurseOrders">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetHosOrdInfoFun">重置</el-button>
      </div>
    </div>

    <base-title name="护理订单列表"></base-title>
    <el-table :data="getHospitalOrdersData" :loading="tableLoading" stripe class="mt24">
      <el-table-column prop="doctorName" label="医生姓名" align="center"></el-table-column>
      <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="patientPhone" label="患者电话" align="center"></el-table-column>
      <el-table-column prop="createTime" label="下单时间" align="center" width="155px">
        <template #default="{row}">
          {{ row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column prop="serviceTimes" label="上门次数/需上门次数" align="center" width="180px"></el-table-column>
      <el-table-column prop="orderAmount" label="金额（元）">
        <template #default="{row}">
          {{ row.orderAmount / 100}}
        </template>
      </el-table-column>
      <el-table-column prop="serviceStatusName" label="状态" align="center"></el-table-column>
      <el-table-column label="操作" width="318" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="toNurseOrdersList(row)">服务列表</span>
            <span class="opt-text text-danger" v-if="row.serviceStatusID !== 32"  @click="cancelOrders(row)">取消订单</span>
            <span class="opt-text" @click="toHospitalOrdersDetail(row)">详情</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getNurseOrders" @current-change="getNurseOrders" />

    <!--    取消订单框-->
    <span id="cancelBody">
      <el-dialog title="取消订单" :visible.sync="dialogVisible" width="590px" @close="closeDialog">
        <span>取消订单，可能导致用户投诉，降低医院声誉，影响医生给医院推荐患者，请谨慎操作！</span><br />
        <el-input type="textarea" id="textareaBody" :rows="5" placeholder="请输入" clearable v-model="cancelReason" ref=“cancelInputData”></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button class="btnThinkMore" @click="cancelOrdersNo">取消</el-button>
          <el-button class="sure" type="primary" @click="cancelOrdersSure">确定</el-button>
        </span>
      </el-dialog>
    </span>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "nursing-hospitalOrders",
  data () {
    return {
      // 查询：所有条件集合
      query: { doctorName: "", patientName: "", searchTime: "" },
      serviceStatusID: "",
      // 查询：状态下拉集合
      stateOptions: [
        { serviceStatusID: "", serviceStatusName: "全部" },
        { serviceStatusID: 10, serviceStatusName: "待支付" },
        { serviceStatusID: 11, serviceStatusName: "待接单" },
        { serviceStatusID: 12, serviceStatusName: "拒接单" },
        { serviceStatusID: 20, serviceStatusName: "待服务" },
        { serviceStatusID: 21, serviceStatusName: "服务中" },
        { serviceStatusID: 22, serviceStatusName: "服务完成" },
        { serviceStatusID: 23, serviceStatusName: "待评价" },
        { serviceStatusID: 31, serviceStatusName: "部分取消" },
        { serviceStatusID: 32, serviceStatusName: "已取消" }
      ],
      searchTimes: "",
      // 页码：参数集合
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      },
      // 护理订单信息
      getHospitalOrdersData: [],
      tableLoading: false,
      // 操作：取消订单框
      dialogVisible: false,
      modalCheckedId: -1,
      cancelReason: "",
      searchState: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.setPickerTimes();
  },
  activated () {
    if (this.searchState) {
      this.getNurseOrders();
    }
  },
  methods: {
    setPickerTimes () {
      this.searchTimes = new Date();
    },
    // 查询： 护理订单数据，加载表格
    getNurseOrders () {
      if (this.tableLoading) {
        return;
      }
      // 查询条件：医院ID、医生姓名、患者姓名、状态编号、服务时间（月）
      let hospitalInfo = {
        hospitalID: this.userInfo.orgID
      };
      if (this.searchTimes !== "") {
        let getMonths = (new Date(this.searchTimes)).getMonth() + 1;
        getMonths = getMonths < 10 ? ("0" + getMonths) : getMonths;
        this.query.searchTime = (new Date(this.searchTimes)).getFullYear() + "-" + getMonths;
      }
      this.query.serviceStatusID = this.serviceStatusID;
      let params = { ...this.pageInfo, ...this.query, ...hospitalInfo };
      this.tableLoading = true;
      this.$_http.get(this.$_API.INTERFACE_NURSE_ORDERS, { params }).then(res => {
        if (!res.data) return;
        this.getHospitalOrdersData = res.data.datas;
        this.searchState = true;
        this.pageInfo = res.data.pageInfo;
      }).finally(it => {
        this.tableLoading = false;
      });
    },
    // 操作：重置输入框信息
    resetHosOrdInfoFun () {
      this.query = { doctorName: "", patientName: "", searchTime: "" };
      this.searchTimes = "";
      this.serviceStatusID = "";
    },
    // 操作：组件跳转=》服务列表，传递所选行护理订单的ID
    toNurseOrdersList (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "nursing-hospitalOrders-hospitalOrdersList",
        params: { keyID: row.keyID, hospitalID: row.hospitalID }
      });
    },
    // 操作：组件跳转=》详情，传递所选行护理订单服务列表行的ID
    toHospitalOrdersDetail (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "nursing-hospitalOrders-hospitalOrdersDetail",
        params: { nursingOrderID: row.keyID }
      });
    },
    // 操作：取消订单
    cancelOrders (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.dialogVisible = true;
      this.modalCheckedId = row.keyID;
    },
    // 操作：确认取消订单，传递当前医院ID、所选行护理订单的ID、取消原因、进行操作的人的ID
    cancelOrdersSure () {
      if (this.cancelReason !== "") {
        let hospitalInfo = {
          hospitalID: this.userInfo.orgID,
          nursingOrderID: this.modalCheckedId,
          reason: this.cancelReason,
          modifyUser: this.userInfo.keyID
        };
        this.$_http.post(this.$_API.INTERFACE_NURSE_ORDERS_CANCEL, { ...hospitalInfo }).then(res => {
          this.$_success("取消订单成功");
          // 加载表格
          this.dialogVisible = false;
          this.cancelReason = "";
          this.getNurseOrders();
        });
      } else {
        this.$_error("请输入取消原因");
      }
    },
    // 操作：取消
    cancelOrdersNo () {
      this.dialogVisible = false;
      this.cancelReason = "";
    },
    // 操作：关闭对话框
    closeDialog () {
      this.cancelReason = "";
    },
    // 提醒：表格数据错误时的处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.getNurseOrders();
    }
  }
};
</script>

<style>
.el-dialog__body span:nth-of-type(1) {
  color: #333333;
}
.el-dialog__body span:nth-of-type(2) {
  color: #6c778c;
}
.el-textarea,
#textareaBody {
  max-width: 550px;
}
.btnThinkMore {
  padding: 10px 27px;
}
</style>
