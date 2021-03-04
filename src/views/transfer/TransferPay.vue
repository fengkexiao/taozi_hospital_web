<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">转诊医生：</span>
        <el-input v-model="query.doctorName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">转诊医生电话：</span>
        <el-input v-model="query.doctorPhone" maxlength="11" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">患者姓名：</span>
        <el-input v-model="query.patientName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">患者电话：</span>
        <el-input v-model="query.patientPhone" form-type="phone" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">转诊时间：</span>
        <el-date-picker v-model="transferTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <span class="item-label">财务提交时间：</span>
        <el-date-picker v-model="settleTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <span class="item-label">付款状态：</span>
        <el-select v-model="query.orderStatus" placeholder="请选择" value="" filterable clearable>
          <el-option v-for="(item,index) in orderStateOptions" :key="index" :label="item.orderName" :value="item.orderStatusID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getTableDataFirst">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfoFun">重置</el-button>
      </div>
    </div>

    <base-title name="转诊出纳付款列表"></base-title>
    <el-table :data="transferOrderData" stripe :loading="tableLoading" class="mt24">
      <el-table-column prop="sourceName" label="转诊医生" align="center"></el-table-column>
      <el-table-column prop="inquiryModeName" label="接诊部门" align="center"></el-table-column>
      <el-table-column prop="hospitalDoctorName" label="接诊医生" align="center"></el-table-column>
      <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="treatMoneyTotal" label="结算金额（元）" align="center" width="120px">
        <template #default="{row}">
          {{ row.treatMoneyTotal/100}}
        </template>
      </el-table-column>
      <el-table-column prop="settlePayTime" label="付款完成时间" width="155px">
        <template #default="{row}">
          {{ row.settlePayTime | formatDateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="orderStatusName" label="付款状态" width="120px" align="center"></el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span v-if="[40].includes(row.orderStatusId) " class="opt-text" @click="agree(row)">
              付款
            </span>
            <span v-if="[40].includes(row.orderStatusId) " class="opt-text" @click="disagree(row)">
              驳回
            </span>
            <span class="opt-text" @click="toDetail(row)">
              详情
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getTableDataFirst" @current-change="getTableDataFirst" />
    <!--付款驳回话框-->
    <div id="payRefuseBody">
      <el-dialog title="付款驳回" :visible.sync="payRefuseVisible" width="500px" @close="payRefuseCancel">
        <el-form :model="payRefuseData" ref="payRefuse">
          <el-form-item label="付款驳回原因：" prop="settlePayReason" label-width="120px" required>
            <el-input type="textarea" :rows="4" placeholder="请输入" maxlength="200" show-word-limit v-model="payRefuseData.settlePayReason">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="payRefuseVisible = false">取消</el-button>
          <el-button class="sure" type="primary" @click="payRefuseEnsure">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import InputWithTip from "@/components/InputWithTip";
import { mapGetters } from "vuex";
import { formatDate } from "../../filters";

export default {
  name: "TransferPay",
  inject: ["reload"],
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InputWithTip
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      payRefuseData: {
        keyId: "",
        settlePayUser: "",
        settlePayReason: ""
      },
      payRefuseVisible: false,
      needQuery: false,
      tableLoading: false,
      query: {
        doctorPhone: "",
        doctorName: "",
        doctorId: "",
        patientName: "",
        patientPhone: "",
        startTime: "",
        endTime: "",
        settleStartTime: "",
        settleEndTime: "",
        orderStatus: ""
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      },
      settleTime: [],
      transferTime: [],
      transferTimeConversion: [],
      settleTimeConversion: [],
      transferOrderData: [],
      // 订单状态下垃集合
      orderStateOptions: [
        { orderStatusID: "", orderName: "全部" },
        { orderStatusID: 40, orderName: "待付款" },
        { orderStatusID: 42, orderName: "付款驳回" },
        { orderStatusID: 41, orderName: "付款完成" }
      ],
      // 电话号码正则及提示
      formRules: {
        doctorPhone: [
          {
            trigger: "blur",
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码（11位）"
          }
        ],
        patientPhone: [
          {
            trigger: "blur",
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码（11位）"
          }
        ]
      }
    };
  },
  created () {
    this.initializeDateRegion();
  },
  activated () {
    if (this.needQuery) {
      this.getTableDataFirst();
    }
  },
  methods: {
    initializeDateRegion () {
      let startDate = this.getInstant1st();
      let endDate = new Date();
      this.transferTime = [startDate, endDate];
    },
    // 操作：重置输入框信息
    resetSearchInfoFun () {
      //this.$refs.formOrder.resetFields();
      this.query = {
        doctorPhone: "",
        doctorName: "",
        doctorId: "",
        patientName: "",
        patientPhone: "",
        startTime: "",
        endTime: "",
        settleStartTime: "",
        settleEndTime: "",
        orderStatus: ""
      };
      this.initializeDateRegion();
    },
    // 第一步验证表单
    getTableDataFirst () {
      this.needQuery = true;
      if (this.tableLoading) {
        return;
      }
      if (this.transferTime.length === 2) {
        if (!(this.transferTime[0].getFullYear() === this.transferTime[1].getFullYear() && this.transferTime[0].getMonth() === this.transferTime[1].getMonth())) {
          this.$alert("查询条件中的起始日期应在同一月份", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
          return;
        }
      }
      if (this.query.doctorPhone && this.query.patientPhone) {
        if ((/^1[3-9]\d{9}$/.test(this.query.doctorPhone)) && (/^1[3-9]\d{9}$/.test(this.query.patientPhone))) {
          this.getTableData2ndFormatParameter();
        }
      } else if (this.query.doctorPhone || this.query.patientPhone) {
        if ((/^1[3-9]\d{9}$/.test(this.query.doctorPhone)) || (/^1[3-9]\d{9}$/.test(this.query.patientPhone))) {
          this.getTableData2ndFormatParameter();
        }
      } else {
        this.getTableData2ndFormatParameter();
      }
    },
    // 第二步 格式化参数
    getTableData2ndFormatParameter () {
      if (this.query.doctorPhone) {
        this.$_http.get(this.$_API.INTERFACE_GET_DOCTOR_BY_PHONE + "?phone=" + this.query.doctorPhone).then(res => {
          if (!res.data) return;
          this.query.doctorId = res.data.keyID;
          this.getTableData3ndFormatTimeParameter();
        });
      } else {
        this.getTableData3ndFormatTimeParameter();
      }
    },
    // 第三步 格式化参数
    getTableData3ndFormatTimeParameter () {
      // 转诊时间（开始、结束）
      if (this.transferTime.length > 0) {
        this.transferTimeConversion = [];
        this.transferTime.forEach((item) => {
          item = formatDate(item);
          this.transferTimeConversion.push(item);
        });
        this.query.startTime = this.transferTimeConversion[0];
        this.query.endTime = this.transferTimeConversion[1];
      } else {
        this.query.startTime = this.dataFunction().beginDate;
        this.query.endTime = this.dataFunction().endDate;
      }
      if (this.settleTime.length > 0) {
        this.settleTimeConversion = [];
        this.settleTime.forEach((item) => {
          item = formatDate(item);
          this.settleTimeConversion.push(item);
        });
        this.query.settleStartTime = this.settleTimeConversion[0];
        this.query.settleEndTime = this.settleTimeConversion[1];
      }
      this.getTableData4rdFinal();
    },

    // 第三步 查询数据
    getTableData4rdFinal () {
      let params = { ...this.query, ...this.pageInfo };
      this.$_http.get(this.$_API.INTERFACE_HOSPITAL_GET_PAY_ORDERS_BY_PAGE, { params }).then(response => {
        if (!response.data) return;
        let oldData = response.data.datas;
        this.pageInfo = response.data.pageInfo;
        let ids = [];
        oldData.forEach(row => {
          if (row.orderStatusId === 40) {
            row.orderStatusName = "待付款";
          }
          if (row.orderStatusId === 41) {
            row.orderStatusName = "付款完成";
          }
          if (row.orderStatusId === 42) {
            row.orderStatusName = "付款驳回";
          }
          ids.push(row.sourceId);
        });
        if (ids.length === 0) {
          this.transferOrderData = oldData;
        } else {
          this.$_http.post(this.$_API.INTERFACE_GET_DOCTOR_PHONE_LIST_BY_IDLIST, ids).then(response => {
            if (!response.data) return;
            let phones = response.data;
            oldData.forEach((item, index) => {
              phones.forEach(p => {
                if (item.sourceId === p.keyID) {
                  oldData[index].doctorPhone = p.phone;
                }
              });
            });
            this.transferOrderData = oldData;
          });
        }
      });
    },
    // 获取默认日期的方法
    dataFunction () {
      let date = this.getInstant1st();
      let beginDate = formatDate(date);
      let endDate = formatDate(new Date());
      let dataRegion = {};
      dataRegion.beginDate = beginDate;
      dataRegion.endDate = endDate;
      return dataRegion;
    },
    getInstant1st () {
      let date = new Date();
      date.setDate(1);
      date.setHours(0);
      date.setSeconds(0);
      date.setMinutes(0);
      return date;
    },
    agree (row) {
      this.$confirm("请确认付款金额，并向首诊服务医生和平台付款?", "确认付款", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let paramter = {};
        paramter.keyId = row.keyId;
        paramter.settlePayUser = this.userInfo.staffName;
        this.$_http.post(this.$_API.INTERFACE_PAY_APPROVAL, paramter).then(res => {
          this.$message({
            type: "success",
            message: "已经付款!"
          });
          this.getTableDataFirst();
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
    },
    disagree (row) {
      this.payRefuseVisible = true;
      this.payRefuseData.keyId = row.keyId;
      this.payRefuseData.settlePayUser = this.userInfo.staffName;
    },
    payRefuseCancel () {
      this.$refs.payRefuse.resetFields();
      this.payRefuseVisible = false;
    },
    payRefuseEnsure () {
      if (!this.payRefuseData.settlePayReason) {
        this.$message({
          message: "请输入付款驳回原因",
          type: "warnning"
        });
        return false
      }
      this.$_http.post(this.$_API.INTERFACE_PAY_REFUSE, this.payRefuseData).then(response => {
        this.$refs.payRefuse.resetFields();
        this.payRefuseVisible = false;
        this.getTableDataFirst();
        this.$message({
          message: "您已审核为付款驳回",
          type: "success"
        });
      });
    },
    // 查看详情的方法
    toDetail (row) {
      if (!row || !row.keyId) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "OrderDetailForFinance",
        params: {
          orderID: row.keyId,
          address: "TransferPay"
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
