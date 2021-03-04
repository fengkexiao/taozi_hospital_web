<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">网点医生姓名：</span>
        <el-input v-model="query.doctorName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">网点医生电话：</span>
        <el-input v-model="query.doctorPhone" placeholder="请输入" clearable maxlength="11"></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">患者姓名：</span>
        <el-input v-model="query.patientName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">患者电话：</span>
        <el-input v-model="query.patientPhone" placeholder="请输入" clearable maxlength="11"></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">状态：</span>
        <el-select v-model="query.orderStatusID" placeholder="请选择" filterable clearable>
          <el-option v-for="(item) in stateOptions" :key="item.orderStatusID" :label="item.orderStatusName" :value="item.orderStatusID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="loadTable">查询</el-button>
      </div>
    </div>
    <base-title name="风湿药品发货列表"></base-title>
    <el-table :data="deliveryOrder" :loading="tableLoading" stripe class="mt24">
      <el-table-column prop="doctorName" label="医生姓名" align="center"></el-table-column>
      <el-table-column prop="doctorPhone" label="医生联系电话" align="center"></el-table-column>
      <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="phone" label="患者电话" align="center"></el-table-column>
      <el-table-column prop="address" label="患者地址" align="center">
        <template #default="{row}">{{row | formatAddress}}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template #default="{row}">{{ row.createTime | formatDateTime }}</template>
      </el-table-column>
      <el-table-column prop="orderStatusName" label="状态" align="center">
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" v-if="row.orderStatusID === 31 " @click="deliveryOK(row)">确认发货</span>
            <span class="opt-text" @click="details(row)">详情</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable()" @current-change="loadTable()" />

    <!--    确认发货界面-->
    <span id="cancelBody">
      <el-dialog title="确认发货" :visible.sync="dialogVisible" width="500px">
        <el-form label-width="100px">
          <el-form-item label="快递公司:">
            <el-input v-model="form.expressCompany" placeholder="请输入" clearable> </el-input>
          </el-form-item>
          <el-form-item label="运单号:">
            <el-input v-model="form.expressID" placeholder="请输入" clearable>></el-input>
          </el-form-item>
        </el-form>
        <div class="treatOrder_div2">
          <div class="treatOrder_button1">
            <el-button @click="cancelOrdersNo()">取消</el-button>
          </div>
          <div>
            <el-button type="primary" @click="updateBtn()">确定</el-button>
          </div>
        </div>
      </el-dialog>
    </span>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "treatOrderDelivery",
  props: {
    sign: {
      type: String,
      required: false
    }
  },
  activated () {
    if (typeof this.sign !== "undefined") {
      if (this.sign === "1") {
        this.loadTable();
      }
    }
  },
  filters: {
    formatAddress (row) {
      return row.provinceName + row.cityName + row.areaName + row.address;
    }
  },
  data () {
    return {
      query: {},
      delivery: {},
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      },
      // 列表数据
      deliveryOrder: [],
      // 状态列表
      stateOptions: [
        { orderStatusID: "", orderStatusName: "全部" },
        { orderStatusID: "31", orderStatusName: "待发货" },
        { orderStatusID: "32", orderStatusName: "已发货 " }
      ],
      // 选中数据
      X: {},
      form: {},
      // 发货界面控制
      dialogVisible: false,
      // 表格控制
      tableLoading: false,
      // 物流界面控制
      logisticsDialog: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    // 获取列表
    loadTable () {
      if (this.tableLoading) {
        return;
      }
      // 查询条件：医院ID、医生姓名、患者姓名、状态编号、服务时间（月）
      let hospitalInfo = {
        // 获取当前登陆人  数据
        hospitalID: this.userInfo.orgID
      };
      let params = { ...this.pageInfo, ...this.query, ...hospitalInfo };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.API_HOU_MEDICINEDELIVERY_LIST, { params })
        .then(res => {
          if (!res.data) return;
          this.deliveryOrder = res.data.datas;
          this.pageInfo = res.data.pageInfo;
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 确认发货 {弹出界面}
    deliveryOK (row) {
      this.X = row;
      this.dialogVisible = true;
    },
    // 操作：取消
    cancelOrdersNo () {
      this.dialogVisible = false;
      this.cancelReason = "";
    },
    // 详情
    details (row) {
      // 跳转 详情界面 带orderID
      this.$router.push({
        name: "treatRpAuditDetails",
        // 可以获取状态ID 根据状态Id
        params: { orderId: row.keyID, sign: "1" }
      });
    },
    // 添加物流单确认发货
    updateBtn () {
      let data = {
        keyID: this.X.keyID,
        modifyUser: this.userInfo.keyID,
        expressID: this.form.expressID,
        expressCompany: this.form.expressCompany
      };
      this.$_http
        .post(this.$_API.API_HOU_ORDER_DELIVERY, data)
        .then(response => {
          this.dialogVisible = false;
          this.loadTable();
        });
    }
  }
};
</script>

<style scoped>
.treatOrder_button1 {
  margin-right: 100px;
  margin-left: 90px;
}
.treatOrder_div2 {
  display: flex;
}
</style>
