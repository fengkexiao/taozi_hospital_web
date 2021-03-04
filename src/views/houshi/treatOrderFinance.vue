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
        <span class="item-label">状态：</span>
        <el-select v-model="query.profitStatusID" placeholder="请选择" filterable clearable value>
          <el-option v-for="item in stateOptions" :key="item.profitStatusID" :label="item.serviceStatusName" :value="item.profitStatusID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="loadTable">查询</el-button>
      </div>
    </div>

    <base-title name="风湿财务结算列表"></base-title>

    <el-table :data="tableData" :loading="tableLoading" stripe class="mt24">
      <el-table-column prop="doctorName" label="医生姓名" align="center"></el-table-column>
      <el-table-column prop="doctorPhone" label="医生联系电话" align="center" width="110px"></el-table-column>
      <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="price" label="订单金额（元）" align="center" width="140px">
        <template #default="{row}">
          {{ row.price | formatStatus }}
        </template>
      </el-table-column>
      <el-table-column prop="doctorFee" label="医生服务费（元）" align="center" width="140px">
        <template #default="{row}">
          {{ row.doctorFee | formatStatus }}
        </template>
      </el-table-column>
      <el-table-column prop="peachFee" label="平台手续费（元）" align="center" width="140px">
        <template #default="{row}">
          {{ row.peachFee | formatStatus }}
        </template>
      </el-table-column>
      <el-table-column prop="houFee" label="侯丽萍医院（元）" align="center" width="140px">
        <template #default="{row}">
          {{ row.houFee | formatStatus }}
        </template>
      </el-table-column>
      <el-table-column prop="addTime" label="创建时间" width="155" align="center"></el-table-column>
      <el-table-column prop="profitStatusName" label="状态" align="center">
        <template #default="{row}">
          {{ row | formatOrderStatus }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" align="center">
        <template #default="{row}">
          <!-- <el-button type="danger" v-if="true" size="mini" @click="reckoning(row.keyID)">发起结算</el-button> -->
          <div class="option-btn_group">
            <span class="opt-text" v-if="row.profitStatusID === 0 && row.orderStatusID === 32" size="mini" @click="reckoning(row.keyID)">发起结算</span>
            <span class="opt-text" v-if="true" size="mini" @click="details(row.keyID)"> 详情</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable()" @current-change="loadTable()" />
    <!-- 结算界面 -->
    <span id="cancelBody">
      <el-dialog title="确认结算" :visible.sync="dialogVisible">
        <div>
          <el-table :data="treatRpMedicines" show-summary :summary-method="addLine" stripe>
            <el-table-column prop="MedicineName" label="药品名称" align="center"></el-table-column>
            <el-table-column prop="price" label="金额" align="center">
              <template #default="{row}">
                {{ row.price | formatStatus }}
              </template>
            </el-table-column>
            <el-table-column prop="doctorFeeRatio" label="医生" align="center">
              <template #default="{row}">{{ row.doctorFeeRatio }}</template>
            </el-table-column>
            <el-table-column prop="peachFeeRatio" label="平台" align="center">
              <template #default="{row}">{{ row.peachFeeRatio }}</template>
            </el-table-column>
            <el-table-column prop="houFeeRatio" label="侯丽萍医院" align="center">
              <template>--</template>
            </el-table-column>
          </el-table>
        </div>
        <br />
        <div class="treatOrder_div2">
          <div class="treatOrder_button1">
            <el-button @click="cancelOrdersNo()">取消</el-button>
          </div>
          <div>
            <el-button type="primary" @click="beginProfit()">确定</el-button>
          </div>
        </div>
      </el-dialog>
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "treatOrderFinance",
  props: {
    sign: {
      type: String,
      required: false
    }
  },
  activated () {
    if (typeof this.sign !== "undefined") {
      if (this.sign === "2") {
        this.loadTable();
      }
    }
  },
  filters: {
    // 格式化金额
    formatStatus (val) {
      if (val === 0) {
        return "";
      }
      return (val / 100).toFixed(2);
    },
    // 过滤状态
    formatOrderStatus (val) {
      if (val.orderStatusID === 32) {
        return "待结算";
      }
      return val.orderStatusName;
    }
  },
  data () {
    return {
      stateOptions: [
        { profitStatusID: "", serviceStatusName: "全部" },
        { profitStatusID: 32, serviceStatusName: "待结算 " },
        { profitStatusID: 41, serviceStatusName: "结算完成" }
      ],
      query: {},
      tableData: [],
      tableLoading: false,
      dialogVisible: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      },
      treatRpMedicines: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    // 获取财务订单列表，加载表格
    loadTable () {
      // 医院ID 医生姓名 医生电话 患者姓名  状态 分页  获取数据  加载表格
      let params = {
        ...this.pageInfo,
        ...this.query,
        hospitalID: this.userInfo.orgID
      };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.API_HOU_ORDERSFINANCE_LIST, { params })
        .then(res => {
          if (!res.data) return;
          this.tableData = res.data.datas;
          this.pageInfo = res.data.pageInfo;
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 表格数据错误时的处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.loadTable();
    },
    // 发起结算
    reckoning (orderId) {
      // 根据订单ID 获取订单处方
      let params = {
        keyID: orderId
      };
      this.dialogVisible = true;
      let request = this.$_http
        .get(this.$_API.API_HOU_ORDER_ORDERMEDICINEPROFIT, { params })
        .then(res => {
          if (!res.data) return;
          this.treatRpMedicines = res.data;
        });
      return request;
    },
    // 查看详情
    details (order) {
      this.$router.push({
        name: "treatRpAuditDetails",
        // 跳转带 订单ID
        params: { orderId: order, sign: "2" }
      });
    },
    // 点击【取消结算】
    cancelOrdersNo () {
      this.dialogVisible = false;
    },
    // 追加合计 一行
    addLine (param) {
      const sums = [];
      let sumPrice = 0;
      let sumDoctorFee = 0;
      let sumPeachFee = 0;
      let sumHouFee = 0;
      for (let index = 0; index < this.treatRpMedicines.length; index++) {
        const element = this.treatRpMedicines[index];
        if (index === 0) {
          sums[index] = "合计";
        }
        sumPrice = sumPrice + element.price;
        sumDoctorFee = sumDoctorFee + element.doctorFee;
        sumPeachFee = sumPeachFee + element.peachFee;
        sumHouFee = sumHouFee + element.houFee;
      }
      sums[1] = (sumPrice / 100).toFixed(2);
      sums[2] = (sumDoctorFee / 100).toFixed(2);
      sums[3] = (sumPeachFee / 100).toFixed(2);
      sums[4] = (sumHouFee / 100).toFixed(2);
      return sums;
    },
    // 确认结算
    beginProfit () {
      // post 请求 不是对象的参数
      let data = {
        keyID: this.treatRpMedicines[0].orderID,
        modifyUser: this.userInfo.staffName,
        hospitalID: this.userInfo.orgID
      };
      this.$_http
        .post(this.$_API.API_HOU_ORDER_BEGINPROFIT, data)
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
  margin-left: 20%;
  margin-right: 50px;
}
.treatOrder_div2 {
  display: flex;
  margin-left: 200px;
}
</style>
