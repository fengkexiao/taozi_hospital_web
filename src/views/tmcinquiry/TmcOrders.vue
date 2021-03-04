<template>
  <div class="app-container" id="detailBody">
    <!-- 订单管理待开发 -->
    <el-card class="box-card">
      <el-form :model="query" ref="ruleForm" inline>
        <el-form-item label="订单编号">
          <base-input v-model="query.goodsOrderID" label-name="订单编号" />
        </el-form-item>
        <el-form-item label="患者姓名">
          <base-input v-model="query.buyerName" label-name="患者姓名" />
        </el-form-item>
        <el-form-item label="收货人">
          <base-input v-model="query.receiverName" label-name="收货人" />
        </el-form-item>
        <el-form-item label="联系电话">
          <base-input v-model="query.receiverPhone" form-type="phone" label-name="联系电话" />
        </el-form-item>
        <el-form-item label="省">
          <base-input v-model="query.province" label-name="省" />
        </el-form-item>
        <el-form-item label="市">
          <base-input v-model="query.city" label-name="市" />
        </el-form-item>
        <el-form-item label="区">
          <base-input v-model="query.area" label-name="区" />
        </el-form-item>
        <el-form-item label="收款方式">
          <el-select v-model="query.payWay">
            <el-option v-for="(item) in stateOptions" :key="item.payWay" :label="item.payWayName" :value="item.payWay">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款状态">
          <el-select v-model="query.orderStatusID">
            <el-option v-for="(item) in orderStatus" :key="item.orderStatusID" :label="item.orderStatusName" :value="item.orderStatusID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创单时间">
          <el-date-picker v-model="createTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发货状态">
          <el-select v-model="query.deliveryStatusID">
            <el-option v-for="(item) in deliveryStatus" :key="item.deliveryStatusID" :label="item.deliveryStatusName" :value="item.deliveryStatusID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货人">
          <base-input v-model="query.deliveryMan" label-name="发货人" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadTable">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <base-loading :loading="tableLoading">
      <el-card class="box-card">
        <el-table :data="tableData" border fit>
          <el-table-column prop="keyID" label="订单编号"></el-table-column>
          <el-table-column prop="buyerName" label="患者姓名"></el-table-column>
          <el-table-column prop="receiverName" label="收货人"></el-table-column>
          <el-table-column prop="receiverPhone" label="联系电话"></el-table-column>
          <el-table-column prop="5" label="省市区">
            <template #default="{row}">
              {{row | formatProvince}}
            </template>
          </el-table-column>
          <el-table-column prop="address" label="详细地址"></el-table-column>
          <el-table-column prop="assistantName" label="IP医生"></el-table-column>
          <el-table-column prop="doctorName" label="开方医生"></el-table-column>
          <el-table-column prop="payWay" label="收款方式">
            <template #default="{row}">
              {{row.payWay | formatPayWay}}
            </template>
          </el-table-column>
          <el-table-column prop="orderStatusName" label="收款状态"></el-table-column>
          <el-table-column prop="costPrice" label="总价(元)">
            <template #default="{row}">
              {{row.costPrice | formatAmount}}
            </template>
          </el-table-column>
          <el-table-column prop="prePrice" label="预付(元)">
            <template #default="{row}">
              {{row.prePrice | formatAmount}}
            </template>
          </el-table-column>
          <el-table-column prop="waitPrice" label="待收(元)">
            <template #default="{row}">
              {{row.waitPrice | formatAmount}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创单时间"></el-table-column>
          <el-table-column prop="deliveryStatusName" label="发货状态"></el-table-column>
          <el-table-column prop="deliveryMan" label="发货人"></el-table-column>
          <el-table-column prop="deliveryTime" label="发货时间">
            <template #default="{row}">
              {{row.deliveryTime | formatTime }}
            </template>
          </el-table-column>
          <el-table-column prop="18" label="操作" width="170">
            <template #default="{row}">
              <el-button type="primary" size="mini" @click="details(row)">
                详情
              </el-button>
              <el-button type="primary" size="mini" @click="handleUpdateAdd(row)" v-if="row.deliveryStatusID===1">
                修改地址
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
      </el-card>
      <el-dialog title="修改收货地址" :visible.sync="dialogVisible" width="25%" :before-close="handleClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="收货人" prop="receiverName">
            <el-input v-model="ruleForm.receiverName" placeholder="请输入收货人" maxlength="15"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="receiverPhone">
            <el-input v-model="ruleForm.receiverPhone" placeholder="请输入联系电话" maxlength="11" type="number"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="provinceStr">
            <el-cascader ref="placeCascader" v-model="ruleForm.provinceStr" :options="placeOptions"  @change="handleChangeAddress"  label-name="省-市-区" class="cus_pro" ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="ruleForm.address" placeholder="请输入详细地址" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button> -->
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('ruleForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
    </base-loading>
  </div>
</template>

<script>
import { formatDate } from "../../filters";
import { mapGetters, mapActions } from "vuex";
import json from "@/assets/json/place.json";
export default {
  name: "tmc-Orders-Run",
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
      placeOptions: json, // 地址下拉级联
      dialogVisible: false,
      ruleForm: {
        receiverName: "",
        receiverPhone: "",
        address: "",
        provinceStr: "",
        area: "",
        province: "",
        city: ""
      },
      rules: {
        receiverName: [
          { required: true, message: "请输入收货人", trigger: "blur" }
        ],
        receiverPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { max: 11, message: '最长只能输入11个字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        provinceStr: [
          { required: true, message: "请选择联系地址", trigger: "change" }
        ]
      },
      query: {
        orderStatusID: "",
        payWay: "",
        deliveryStatusID: ""
      },
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      },
      tableData: [],
      tableLoading: false,
      // 更新状态控制
      updataStates: false,
      form: {
        expressName: "",
        expressID: ""
      },
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
      createTime: []
    };
  },
  activated () {
    if (typeof this.sign !== "undefined" && this.sign === "1") {
      this.loadTable();
    }
  },
  created () {
    this.setPickerTimes();
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    ...mapActions({
      getDictionary: "dictionary/getDictionary"
    }),
    handleClose () {
      this.dialogVisible = false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // INTERFACE_TMC_POST_UPDAE_ADDRESS
          const res = await this.$_http.post(this.$_API.INTERFACE_TMC_POST_UPDAE_ADDRESS, this.ruleForm);
          if (res.success) {
            this.dialogVisible = false;
            this.ruleForm = {
              receiverName: "",
              receiverPhone: "",
              address: "",
              provinceStr: "",
              area: "",
              province: "",
              city: ""
            };
            this.loadTable();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 转换：所选省市区
    handleChangeAddress () {
      let node3 = this.$refs.placeCascader.getCheckedNodes();
      if (node3.length === 0) {
        return;
      }
      let node2 = node3[0].parent;
      let node1 = node2.parent;
      this.ruleForm.area = node3[0].label;
      this.ruleForm.city = node2.label;
      this.ruleForm.province = node1.label;
    },
    handleUpdateAdd (row) {
      this.dialogVisible = true;
      this.ruleForm.orderID = row.keyID;
      this.ruleForm.orgID = row.orgID;
    },
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
      this.query = { orderStatusID: "", payWay: "", deliveryStatusID: "" };
      this.createTime = [];
    },
    // 查询：预订详情
    loadTable () {
      let startTime = formatDate(this.createTime[0]);
      let endTime = formatDate(this.createTime[1]);
      let data = {
        ...this.query,
        startTime: startTime,
        endTime: endTime,
        ...this.pageInfo,
        orgID: this.userInfo.orgID
      };
      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_TMC_GET_GOODS_ORDER_LIST, data)
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
      _this.updataStates = true;
      _this.Y = row;
    },
    // 详情
    details (row) {
      this.$router.push({
        name: "to-Examine",
        params: { orderID: row.keyID, sign: "3", route: "tmc-Orders-Run" }
      });
    }
  }
};
</script>

<style lang="scss" scoped>

.cus_pro /deep/ input{
  width:200px;
}
.cus_pro /deep/ .el-input{
  width:200px;
}
.treatOrder_button {
  margin-right: 100px;
  margin-left: 200px;
}
.treatOrder_button1 {
  margin-right: 100px;
  margin-left: 90px;
}
.treatOrder_div {
  display: flex;
}
</style>
