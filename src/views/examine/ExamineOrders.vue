<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">推荐医生：</span>
        <el-input v-model="query.doctorName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">推荐医生电话：</span>
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
        <span class="item-label">订单状态：</span>
        <el-select v-model="serviceStatusID" placeholder="请选择" value="" filterable clearable>
          <el-option v-for="item in stateOptions" :key="item.serviceStatusID" :label="item.serviceStatusName" :value="item.serviceStatusID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">下单时间：</span>
        <el-date-picker v-model="searchTimes" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="checkValidate1st">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="refreshQueryCondition">重置</el-button>
      </div>
    </div>

    <base-title name="检查单列表"></base-title>
    <el-table :data="orderData" stripe :loading="tableLoading" class="mt24">
      <el-table-column prop="doctorName" label="推荐医生" align="center"></el-table-column>
      <el-table-column prop="doctorPhone" label="医生联系电话" align="center" width="155px"></el-table-column>
      <el-table-column prop="receptTypeName" label="开检查单方式" align="center" width="155px"></el-table-column>
      <el-table-column prop="payTypeName" label="支付方式" align="center"></el-table-column>
      <el-table-column prop="receptDoctorName" label="会诊医生" align="center"></el-table-column>
      <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="patientPhone" label="患者电话" align="center"></el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="155px" align="center">
        <template #default="{row}">
          {{ row.createTime | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="serviceStatusName" label="订单状态" align="center"></el-table-column>
      <el-table-column label="操作" width="360px" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="toDetail(row)">详情</span>
            <span class="opt-text" v-if="[10,11,12].includes(row.serviceStatusID)" @click="cancelOrder(row)">取消订单</span>
            <span class="opt-text" v-if="row.serviceStatusID === 11" @click="forwardReceptOrder(row)">开单</span>
            <span class="opt-text" v-if="row.serviceStatusID === 12 && row.orderStatusID===10" @click="writeOf(row)">开始检查</span>
            <span class="opt-text" v-if="row.serviceStatusID === 21" @click="getReport(row)">查看检查报告</span>
            <span class="opt-text" v-if="row.serviceStatusID === 21" @click="finishExamine(row)">检查完成</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="checkValidate1st" @current-change="checkValidate1st" />
    <el-dialog title="已上传的检查报告" :visible.sync="reportDialogVisible" width="40%">
      <div v-for="(item, index) in picNames" :key="index">
        <br>
        <div>
          <b>{{item}}</b>
        </div>
        <br>
        <div v-if="oneRow.pics[item].length==0"><i>暂没有上传任何报告</i></div>
        <div v-for="(i, key) in oneRow.pics[item]" :key="key">
          <div>上传时间：{{i.addTime}}&emsp; &emsp;上传人：{{i.reporter}}</div>
          <div>
            <a :href="i.picFileUrl" target="_blank">
              <el-image :src="i.picFileUrl" :previewSrcList="i.picFileUrl">
              </el-image>
            </a>
          </div>
        </div>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reportDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { formatDate } from "../../filters";

export default {
  name: "examine-orderDeal",
  data () {
    return {
      reportDialogVisible: false,
      picIsShow: false,
      oneRow: "",
      keyID: "",
      ticketCode: "",
      orderData: [],
      // 查询：条件集合
      query:
      {
        doctorName: "",
        doctorPhone: "",
        patientName: "",
        patientPhone: "",
        beginDate: "",
        endDate: ""
      },
      serviceStatusID: "all",
      // 查询：状态下拉集合
      stateOptions: [
        { serviceStatusID: "all", serviceStatusName: "全部" },
        { serviceStatusID: 10, serviceStatusName: "未开始" },
        { serviceStatusID: 11, serviceStatusName: "待开单" },
        { serviceStatusID: 12, serviceStatusName: "已开单" },
        { serviceStatusID: 20, serviceStatusName: "待检查" },
        { serviceStatusID: 21, serviceStatusName: "检查中" },
        { serviceStatusID: 22, serviceStatusName: "检查完成" },
        { serviceStatusID: 23, serviceStatusName: "待评价" },
        { serviceStatusID: 31, serviceStatusName: "部分取消" },
        { serviceStatusID: 32, serviceStatusName: "已取消" }
      ],
      searchTimes: [],
      searchTimesConversion: [],
      // 页码：参数集合
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      },
      picNames: [],
      tableLoading: false,
      needQuery: false,
      queryRule: {
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
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.setPickerTimes();
  },
  activated () {
    if (this.needQuery) {
      this.checkValidate1st();
    }
  },
  methods: {
    setPickerTimes () {
      let startDate = this.getInstant1st();
      let endDate = new Date();
      this.searchTimes = [startDate, endDate];
    },
    // 查询： 订单数据，加载表格
    checkValidate1st () {
      if (this.tableLoading) {
        return;
      }
      this.getExamineOrderData();
    },

    getExamineOrderData () {
      if (this.searchTimes.length === 2) {
        if (!(this.searchTimes[0].getFullYear() === this.searchTimes[1].getFullYear())) {
          this.$alert("查询条件中的起始日期应在同一年份", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
          return;
        }
      }
      this.needQuery = true;
      // 查询条件：医院ID、医生姓名、患者姓名、状态编号
      if (this.searchTimes.length > 0) {
        this.searchTimesConversion = [];
        this.searchTimes.forEach((item) => {
          item = formatDate(item);
          this.searchTimesConversion.push(item);
        });
        this.query.beginDate = this.searchTimesConversion[0];
        this.query.endDate = this.searchTimesConversion[1];
      } else {
        this.query.beginDate = this.dataFunction().beginDate;
        this.query.endDate = this.dataFunction().endDate;
      }
      let doctorID = "";
      let doctorPhone = this.query.doctorPhone;
      if (doctorPhone) {
        this.$_http.get(this.$_API.INTERFACE_GET_DOCTOR_BY_PHONE, {
          params: {
            phone: doctorPhone
          }
        }).then(response => {
          if (!response.data) return;
          doctorID = response.data.keyID;
          this.getTableData(doctorID);
        });
      } else {
        this.getTableData(doctorID);
      }
    },
    getTableData (doctorID) {
      let hospitalID = this.userInfo.orgID;
      let serviceStatusID = this.serviceStatusID;
      let queryType = "all";
      let pageIndex = this.pageInfo.pageIndex;
      let pageSize = this.pageInfo.pageSize;
      let doctorName = this.query.doctorName;
      let patientName = this.query.patientName;
      let patientPhone = this.query.patientPhone;
      let beginDate = this.query.beginDate;
      let endDate = this.query.endDate;
      let params = { pageIndex, pageSize, hospitalID, doctorName, doctorID, patientName, patientPhone, beginDate, endDate, serviceStatusID, queryType };
      this.tableLoading = true;
      this.$_http.get(this.$_API.INTERFACE_GET_HOSPITAL_ORDER_BY_PAGE, { params }).then(res => {
        if (!res.data) return;
        let oldData = res.data.datas;
        this.pageInfo = res.data.pageInfo;
        let ids = [];
        oldData.forEach(row => {
          ids.push(row.doctorID);
        });
        if (ids.length === 0) {
          this.orderData = oldData;
        } else {
          this.$_http.post(this.$_API.INTERFACE_GET_DOCTOR_PHONE_LIST_BY_IDLIST, ids).then(response => {
            if (!response.data) return;
            let phones = response.data;
            oldData.forEach((item, index) => {
              phones.forEach(p => {
                if (item.doctorID === p.keyID) {
                  oldData[index].doctorPhone = p.phone;
                }
              });
            });
            this.orderData = oldData;
          });
        }
      }).finally(it => {
        this.tableLoading = false;
      });
    },
    // 日期方法
    dataFunction () {
      let date = new Date();
      let separator = "-";
      let year = date.getFullYear();
      let beginDate = year + separator + "01-01";
      let endDate = formatDate(new Date());
      let dataRegion = {};
      dataRegion.beginDate = beginDate;
      dataRegion.endDate = endDate;
      return dataRegion;
    },
    getInstant1st () {
      let date = new Date();
      let separator = "-";
      let year = date.getFullYear();
      let beginDate = new Date(year + separator + "01-01");
      return beginDate;
    },
    // 开单的方法
    forwardReceptOrder (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "examine-orderDeal-recept",
        params: { keyID: row.keyID }
      });
    },
    // 查看详情的方法
    toDetail (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "examine-order-detail",
        params: { orderID: row.keyID }
      });
    },

    // 进入开始检查的对话框
    writeOf (row) {
      this.keyID = row.keyID;
      // 线上支付
      if (row.payTypeID === 0) {
        this.$prompt("请向患者索要核销码，核销后开始检查", "核销", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(({ value }) => {
          this.ticketCode = value;
          this.writeOfOnlineConfirm();
        }).catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
        // 线下支付
      } else if (row.payTypeID === 1) {
        this.$confirm("此笔订单为到院支付，请确认患者已完成支付后开始检查。", "到院支付确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.writeOfUnderlineConfirm();
          this.$message({
            type: "success",
            message: "已经开始检查"
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
      } else {
        this.dataError();
      }
    },
    // 线上支付开始检查的方法
    writeOfOnlineConfirm () {
      this.$_http.post(this.$_API.INTERFACE_WRITE_OFF_TICKET_CODE, {
        keyID: this.keyID,
        ticketCode: this.ticketCode
      }).then(response => {
        this.getExamineOrderData();
      });
    },
    // 到院支付开始检查的方法
    writeOfUnderlineConfirm () {
      this.$_http.post(this.$_API.INTERFACE_WRITE_OFF_UNDER_LINE, {
        keyID: this.keyID
      }).then(response => {
        this.getExamineOrderData();
      });
    },
    // 取消订单的方法
    cancelOrder (row) {
      this.$confirm("您是否确认取消订单?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let parameter = { keyID: row.keyID, cancelParty: 3 };
        console.log(parameter);
        if (row.payTypeID === 1 || [0, 2, 11].includes(row.orderStatusID)) {
          this.$_http.post(this.$_API.INTERFACE_CANCEL_ORDER, parameter).then(res => {
            this.getExamineOrderData();
          });
        } else {
          this.$_http.post(this.$_API.INTERFACE_REFUND_ORDER, parameter).then(res => {
            this.getExamineOrderData();
          });
        }
      }).catch(() => {
      });
    },
    // 获取检查报告的方法
    getReport (row) {
      // 判断是否显示图片
      let orderID = row.keyID;
      this.$_http.get(this.$_API.INTERFACE_GET_ORDER_BY_ID + "/" + orderID).then(res => {
        if (!res.data) return;
        // 填充表格数据
        this.oneRow = res.data;
        // 判断是否显示图片
        let pics = res.data.pics;
        this.picNames = this.getKeys(pics);
        for (let i = 0; i < this.picNames.length; i++) {
          let key = this.picNames[i];
          if (pics[key].length > 0) {
            this.picIsShow = true;
            break;
          }
        }
      });
      this.reportDialogVisible = true;
    },
    // 完成订单的方法
    finishExamine (row) {
      this.$_http.get(this.$_API.INTERFACE_CHECK_REPORT_FINISH + "/" + row.keyID).then(res => {
        if (!res.data) return;
        let status = res.data;
        console.log(status);
        if (status === "はい") {
          this.$confirm("此操作表示检查已完成, 是否继续?", "", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$message({
              type: "success",
              message: "已经标注为完成检查"
            });
            this.$_http.post(this.$_API.INTERFACE_FINISH_EXAMINE, { keyID: row.keyID }).then(res => {
              this.getExamineOrderData();
            }
            );
          }).catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作"
            });
          });
        } else {
          this.$alert("有检查项目未上传检查报告，请上传后再操作。", "", {
            type: "warning",
            callback: action => { }
          });
        }
      });
    },
    getKeys (map) {
      let keys = [];
      for (let key in map) {
        keys.push(key);
      }
      return keys;
    },
    refreshQueryCondition () {
      this.query = { doctorName: "", doctorPhone: "", patientName: "", patientPhone: "", beginDate: "", endDate: "" };
      this.serviceStatusID = "all";
      this.searchTimes = [];
      this.setPickerTimes();
    },

    // 提醒：表格数据错误时的处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.getExamineOrderData();
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

#btnThinkMore {
  padding: 10px 27px;
}
</style>
