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
        <el-select v-model="serviceStatusID" placeholder="请选择" filterable clearable value="">
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
    <base-title name="检查报告列表"></base-title>
    <el-table :data="orderData" :loading="tableLoading" stripe class="mt24">
      <el-table-column prop="doctorName" label="推荐医生" align="center"></el-table-column>
      <el-table-column prop="doctorPhone" label="医生联系电话" align="center" width="155px"></el-table-column>
      <el-table-column prop="receptTypeName" label="开检查单方式" align="center" width="155px"></el-table-column>
      <el-table-column prop="payTypeName" label="支付方式" align="center"></el-table-column>
      <el-table-column prop="receptDoctorName" label="会诊医生" align="center"></el-table-column>
      <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="patientPhone" label="患者电话" align="center"></el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="155px" align="center">
        <template #default="{row}">{{ row.createTime | formatDateTime }}</template></el-table-column>
      <el-table-column prop="serviceStatusName" label="状态" align="center"></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="toDetail(row)">详情</span>
            <span class="opt-text" v-if="row.serviceStatusID == 21" @click="getReport(row)">上传检查报告</span>
            <span class="opt-text" v-if="row.serviceStatusID == 22 || row.serviceStatusID == 23" @click="getReport(row)">补充检查报告</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="checkValidate1st" @current-change="checkValidate1st" />
    <el-dialog title="上传检查报告" :visible.sync="reportDialogVisible" width="680px" @close="reportDialogClose()">
      <div v-for="(item, index) in picNames" :key="index">
        <br />
        <div><b>{{ item }}</b></div><br />
        <div v-if="oneRow.pics[item].length == 0">
          <i>暂没有上传任何报告</i>
        </div>
        <base-upload class="uploadLabel" :data="data" :limit="nums" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="uploadSuccess(item)" :file-list="oneRow.pics[item+'Show']"></base-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reportDialogEnsure()">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="94%" :src="dialogImageUrl" style="margin-left: 3%" alt="检查报告" /></el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDate } from "../../filters";

export default {
  name: "examine-orderReport",
  inject: ["reload", "close"],
  data () {
    return {
      reportDialogVisible: false,
      picIsShow: false,
      oneRow: {},
      keyID: "",
      nums: 4,
      data: {
        systemCode: "EXAMINE",
        belongCode: "ORDER",
        belongID: 1
      },
      ticketCode: "",
      orderData: [],
      // 查询：条件集合
      query: {
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
        { serviceStatusID: 21, serviceStatusName: "检查中" },
        { serviceStatusID: 22, serviceStatusName: "检查完成" }
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
      dialogVisible: false,
      dialogImageUrl: "",
      tableLoading: false,
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
    this.setPickerTimes();
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
    getInstant1st () {
      let date = new Date();
      let separator = "-";
      let year = date.getFullYear();
      let beginDate = new Date(year + separator + "01-01");
      return beginDate;
    },
    // 查询： 订单数据，加载表格
    checkValidate1st () {
      if (this.tableLoading) {
        return;
      }
      this.getExamineOrderData();
    },
    getExamineOrderData () {
      // 查询条件：医院ID、医生姓名、患者姓名、状态编号
      if (this.searchTimes.length > 0) {
        this.searchTimesConversion = [];
        this.searchTimes.forEach(item => {
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
        this.$_http
          .get(this.$_API.INTERFACE_GET_DOCTOR_BY_PHONE, {
            params: {
              phone: doctorPhone
            }
          })
          .then(response => {
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
      let queryType = "report";
      let pageIndex = this.pageInfo.pageIndex;
      let pageSize = this.pageInfo.pageSize;
      let doctorName = this.query.doctorName;
      let patientName = this.query.patientName;
      let patientPhone = this.query.patientPhone;
      let beginDate = this.query.beginDate;
      let endDate = this.query.endDate;
      let params = {
        pageIndex,
        pageSize,
        hospitalID,
        doctorName,
        doctorID,
        patientName,
        patientPhone,
        beginDate,
        endDate,
        serviceStatusID,
        queryType
      };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_HOSPITAL_ORDER_BY_PAGE, { params })
        .then(res => {
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
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 日期方法
    dataFunction () {
      let date = new Date();
      let endDate = formatDate(date);
      let separator = "-";
      let year = date.getFullYear();
      let beginDate = year + separator + "01-01";
      let dataRegion = {};
      dataRegion.beginDate = beginDate;
      dataRegion.endDate = endDate;
      return dataRegion;
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
    // 获取检查报告的方法
    getReport (row) {
      // 判断是否显示图片
      let theRow = JSON.parse(JSON.stringify(row));
      let orderID = theRow.keyID;
      this.data.belongID = theRow.keyID;
      this.$_http.get(this.$_API.INTERFACE_GET_ORDER_BY_ID + "/" + orderID).then(res => {
        if (!res.data) return;
        // 填充表格数据
        this.oneRow = res.data;
        // 判断是否显示图片
        let pics = res.data.pics;
        this.picNames = this.getKeys(pics);
        for (let i = 0; i < this.picNames.length; i++) {
          let key = this.picNames[i];
          let imageTemp = [];
          pics[key].forEach(image => {
            let item = {};
            item.uid = image.picFileID;
            item.name = image.keyID;
            item.url = image.picFileUrl;
            imageTemp.push(item);
          });
          let showKey = key + "Show";
          pics[showKey] = imageTemp;
        }
      });
      this.reportDialogVisible = true;
    },
    getKeys (map) {
      let keys = [];
      for (let key in map) {
        keys.push(key);
      }
      return keys;
    },

    // 操作：删除所选的图片
    handleRemove (file) {
      this.$_http.post(this.$_API.INTERFACE_REMOVE_REPORT_PIC, { keyID: file.name })
        .then(response => {
        });
    },
    // 操作：删除已有图片
    handlePictureDelete (picsName, i) {
      let picsdata = this.oneRow.pics[picsName];
      picsdata.forEach((item, index) => {
        if (item.picFileID === i.picFileID) {
          this.oneRow.pics[picsName].splice(index, 1);
        }
      });
      this.$_http
        .post(this.$_API.INTERFACE_REMOVE_REPORT_PIC, { keyID: i.keyID })
        .then(response => {
        });
    },
    // 操作：查看上传的大图
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 操作：上传图片
    uploadSuccess (item) {
      return res => {
        if (!res.data) return;
        let orderItems = this.oneRow.items;
        let examineOrderItemPic = {};
        for (let i = 0; i < orderItems.length; i++) {
          if (orderItems[i].examineItemName === item) {
            examineOrderItemPic.picFileID = res.data.keyID;
            examineOrderItemPic.picFileUrl = res.data.remoteAddress;
            examineOrderItemPic.examineOrderItemID = orderItems[i].keyID;
            examineOrderItemPic.examineOrderID = orderItems[i].examineOrderID;
            examineOrderItemPic.reporter = this.userInfo.staffName;
            examineOrderItemPic.reporterPhone = this.userInfo.phone;
          }
        }
        this.$_http
          .post(this.$_API.INTERFACE_ADD_REPORT_PIC, examineOrderItemPic)
          .then(response => {
          });
      };
    },
    // 确定保存的方法
    reportDialogEnsure () {
      this.reportDialogVisible = false;
    },
    reportDialogClose () {
      this.reportDialogVisible = false;
    },
    // 操作：查看已有的大图
    handlePictureCardPre (item) {
      this.dialogImageUrl = item.picFileUrl;
      this.dialogVisible = true;
    },
    refreshQueryCondition () {
      this.query = {
        doctorName: "",
        doctorPhone: "",
        patientName: "",
        patientPhone: "",
        beginDate: "",
        endDate: ""
      };
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

<style lang="scss">
#eReportBox {
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

  .uploadLabel {
    display: inline;
  }

  .isHover {
    position: relative;
  }

  .meng {
    width: 146px;
    height: 146px;
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    bottom: 3px;
    left: 0;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 20px;
    color: white;
    text-align: center;
    line-height: 146px;
  }

  .isHover:hover .meng {
    opacity: 1;
  }

  .iconScale {
    margin-right: 15px;
  }

  .iconScale,
  .iconDelete {
    cursor: pointer;
  }

  .el-upload-list--picture-card .el-upload-list__item {
    margin: 0 8px 0 0;
  }
}
</style>
