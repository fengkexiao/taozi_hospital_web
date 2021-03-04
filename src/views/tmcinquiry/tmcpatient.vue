<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">姓名：</span>
        <el-input v-model="query.patientName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">联系电话：</span>
        <el-input v-model="query.phone" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">患者状态：</span>
        <el-select v-model="query.followStatus" placeholder="请选择" filterable clearable>
          <el-option v-for="item in orgTypeOptions" :key="item.followStatus" :label="item.orgTypeName" :value="item.followStatus"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">患者分级：</span>
        <el-select v-model="query.patientLevel" placeholder="请选择" filterable clearable :popper-append-to-body="false" class="select-style" popper-class="select-popper" clearable>
          <el-option v-for="item in options" :key="item.keyID" :label="item.levelName" :value="item.levelName"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">IP医生：</span>
        <el-input placeholder="请输入" v-model="query.assistantName" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">医生：</span>
        <el-input placeholder="请输入" v-model="query.doctorName" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">建档时间：</span>
        <el-date-picker class="dateSelect" v-model="query.buildStartDate" type="date" placeholder="开始日期">
        </el-date-picker>
        <template>-</template>
        <el-date-picker class="dateSelect" v-model="query.buildEndDate" type="date" placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getTmcPatientList">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
      </div>
    </div>

    <base-title :name="'患者列表(该机构中总计患者人数：'+totalNum+'人)'" v-if="totalNum"></base-title>
    <base-title :name="'患者列表'" v-else></base-title>
    <div class="base-list_option">
      <a :href="fileUrlHref" download="down" style="margin-right: 10px">
        <el-button icon="el-icon-download" type="primary">下载导入模版</el-button>
      </a>
      <el-upload class="upload-btn" action :show-file-list="showFileList" :http-request="handleUpload" :on-remove="handleRemove" :before-remove="beforeRemove" :on-error="handleError" multiple :file-list="fileList">
        <el-button type="primary" icon="el-icon-upload">批量导入</el-button>
        <span class="font-12">单次最多只能上传5000条数据</span>
      </el-upload>
      <el-button type="primary" icon="el-icon-plus" @click="addClient('C')">添加</el-button>
      <el-button type="primary" @click="change">更换IP医生</el-button>
    </div>
    <el-table :data="tmcPatientList" stripe style="width: 100%" @selection-change="handleSelectionChange" ref="multipleTable" :loading="tableLoading">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="patientName" label="姓名" align="center" width="110"></el-table-column>
      <el-table-column prop="phone" label="联系电话" align="center" width="110"></el-table-column>
      <el-table-column prop="nextContactDate" label="下次联系日期" align="center" width="120">
        <template #default="{row}">{{ row.nextContactDate | formatDate }}</template>
      </el-table-column>
      <el-table-column prop="patientLevel" label="患者分级" align="center" width="80"></el-table-column>
      <el-table-column prop="consultationDiseases" label="咨询病种" align="center" width="100"></el-table-column>
      <el-table-column prop="place" label="联系地址" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="assistantName" label="IP医生" align="center" width="110"></el-table-column>
      <el-table-column prop="doctorName" label="医生" align="center" width="110"></el-table-column>
      <el-table-column prop="followStatus" label="患者状态" align="center" width="150">
        <template #default="{row}">
          <p v-if="row.followStatus === 1">已购药，需要跟进</p>
          <p v-if="row.followStatus === 2">已购药不需要跟进</p>
          <p v-if="row.followStatus === 3">不购药</p>
        </template>
      </el-table-column>
      <el-table-column prop="addTime" label="建档时间" align="center" :show-overflow-tooltip="true">
        <template #default="{row}">{{ row.addTime | formatDateTime }}</template>
      </el-table-column>
      <!-- <el-table-column prop="addTime" label="最近进入平台时间" align="center" :show-overflow-tooltip="true">
                          <template #default="{row}">{{ row.addTime | formatDateTime }}</template>
                        </el-table-column> -->
      <el-table-column label="操作" :width="innerwidth" class="width" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="editClient(row,'V')">编辑</span>
            <div class="line"></div>
            <span class="opt-text" @click="toHelthyRecord(row)">患者档案</span>
            <div class="line" v-if="row.phone !== '' && row.doctorStaffID !=='' && row.assistantStaffID !==''"></div>
            <span class="opt-text" @click="toMessage(row)" v-if="row.phone !== '' && row.doctorStaffID !=='' && row.assistantStaffID !==''">发送问诊短信</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="page" @size-change="getTmcPatientList" @current-change="getTmcPatientList" /> 
    <popup-add-by-Tmcpatient :visible.sync="dialogVisible" :popHandling="popHandling" :assistantOptions="assistantOptions" title @save="save" />
  </div>
</template>

<script>
import { formatDate } from "../../filters";
import InputWithTip from "@/components/InputWithTip";
import PopupAddByTmcpatient from "./PopupAddByTmcpatient";
import { mapGetters } from "vuex";

export default {
  name: "tmc-patient",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InputWithTip,
    PopupAddByTmcpatient
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      fileUrlHref: "https://com-shuibei-peach-static.oss-cn-shenzhen.aliyuncs.com/template/tmc_patient_import.xlsx",
      showFileList: false,
      fileList: [],
      tmcPatientList: [],
      formData: [],
      assistantNameList: [],
      multipleSelection: [],
      innerwidth: "180",
      totalNum: "",
      totalRow: null,
      query: {
        buildStartDate: "",
        buildEndDate: "",
        followStatus: "",
        doctorName: "",
        patientName: "",
        phone: "",
        patientLevel: "",
        assistantName: ""
      },
      serviceTypeID: "",
      options: [],
      assistantOptions: [],
      isDisable: [],
      orgTypeOptions: [
        { followStatus: "1", orgTypeName: "已购药，需要跟进" },
        { followStatus: "2", orgTypeName: "已购药不需要跟进" },
        { followStatus: "3", orgTypeName: "不购药" }
      ],
      createTimes: [],
      createTimesConversion: [],
      dialogVisible: false,
      addClientVisible: false,
      popHandling: false,
      tableLoading: false,
      client: {},
      page: {
        // 分页参数
        pageIndex: 1,
        pageSize: 10
      }
    };
  },
  created () {
    this.getPatientLevel();
  },
  activated () {
    this.getTmcPatientList();
  },
  methods: {
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
      // console.log(this.multipleSelection);
    },
    // 操作：重置输入框信息
    resetSearchInfo () {
      this.query = {
        buildStartDate: "",
        buildEndDate: "",
        followStatus: "",
        doctorName: "",
        patientName: "",
        phone: "",
        patientLevel: "",
        assistantName: ""
      };
      // this.$refs.formOrder.resetFields();
    },
    getTmcPatientList () {
      if (this.tableLoading) {
        return;
      }
      if (this.query.buildStartDate && this.query.buildEndDate && this.query.buildEndDate < this.query.buildStartDate) {
        this.$alert("建档开始时间不能大于结束时间", "提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      let hospitalInfo = {
        orgID: this.userInfo.orgID
      };
      this.query.buildStartDate = formatDate(this.query.buildStartDate);
      this.query.buildEndDate = formatDate(this.query.buildEndDate);
      let params = {
        ...this.query,
        ...hospitalInfo,
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize
      };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_PATIENT_LISTINFO, { params })
        .then(response => {
          if (!response.data) return;
          this.tmcPatientList = response.data.datas;
          this.page = response.data.pageInfo;
          this.totalRow = response.data.totalRow;
          this.tmcPatientList.forEach(item => {
            item["place"] =
              item.province + item.city + item.area + item.address;
          });
          let isChangeWidth = this.tmcPatientList.some(item => {
            return item.phone !== "" && item.assistantStaffID !== "" && item.doctorStaffID !== "";
          });
          isChangeWidth ? (this.innerwidth = "282") : (this.innerwidth = "170");
          this.getPatientNum();
          this.getAssistantGroup();
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    getAssistantGroup () {
      let hospitalInfo = {
        orgID: this.userInfo.orgID
      };
      let params = { ...hospitalInfo };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_ASSISTANT_GROUP_LISTDATA, { params })
        .then(response => {
          if (!response.data) return;
          this.assistantOptions = response.data;
        });
    },
    getPatientNum () {
      let params = {
        orgID: this.userInfo.orgID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_PATIENT_TOTALNUM, {
          params
        })
        .then(response => {
          if (!response.data) return;
          this.totalNum = response.data;
          // console.log(this.options);
        })
        .finally(it => {
        });
    },
    // 分级名称
    getPatientLevel () {
      if (this.tableLoading) {
        return;
      }
      let params = {
        orgID: this.userInfo.orgID
      };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_PATIENT_LEVEL_NODISABLELIST, {
          params
        })
        .then(response => {
          if (!response.data) return;
          response.data.map(item => {
            this.options.push({
              levelName: item.levelName
            });
            return { levelName: item.levelName };
          });
          // console.log(this.options);
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    searchList () {
      this.page.pageIndex = 1;
      this.getTmcPatientList();
    },
    handleSizeChange (val) {
      this.page.pageSize = val;
      this.getTmcPatientList();
    },
    handleCurrentChange (val) {
      this.page.pageIndex = val;
      this.getTmcPatientList();
    },
    // 添加
    addClient (state) {
      this.$router.push({
        name: "addPatient",
        params: {
          state: "C",
          keyID: "0",
          orgID: "0"
        }
      });
      // console.log(this.client);
    },
    // 编辑
    editClient (row, state) {
      this.$router.push({
        name: "addPatient",
        params: {
          state: "V",
          keyID: row.keyID,
          orgID: row.orgID
        }
      });
    },
    toMessage (row) {
      // console.log(row);
      let params = {
        keyID: row.keyID,
        orgID: row.orgID,
        phone: row.phone,
        patientName: row.patientName,
        assistantName: row.assistantName,
        doctorName: row.doctorName
      };
      this.$confirm("确定要发送短信吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // console.log(params);
          this.$_http
            .post(this.$_API.INTERFACE_TMC_GET_MESSAGE, params)
            .then(res => {
              if (!res.data) return;
              this.$_success("发送成功");
            });
        })
        .catch(() => {
          this.$notify.info({
            title: "已取消",
            message: "已取消发送短信"
          });
        });
    },
    toHelthyRecord (row) {
      console.log(row)
      this.$router.push({
        name: "TMCInquiry-HelthyIndex",
        // 跳转详情界面  传入订单 ID
        query: {
          keyID: row.keyID,
          orgID: row.orgID,
          personID: row.personID
        }
      });
    },
    save (data) {
      let patientIDs = [];
      this.multipleSelection.forEach(item => {
        patientIDs.push(item.keyID);
      });
      // console.log(data);
      let doctorInfo = JSON.parse(data.value[0]);
      let assistantInfo = JSON.parse(data.value[1]);
      let params = {
        orgID: this.userInfo.orgID,
        newAssistantStaffID: assistantInfo.assistantStaffID,
        newAssistantStaffName: assistantInfo.assistantName,
        newDoctorStaffName: doctorInfo.doctorName,
        newDoctorStaffID: doctorInfo.doctorStaffID,
        modifyUser: this.userInfo.keyID,
        patientIDs: patientIDs
      };
      // console.log(params, 1212);
      this.popHandling = true;
      this.$_http
        .post(this.$_API.INTERFACE_TMC_GET_CHANGE_ASSISTANT, params)
        .then(res => {
          this.$_success("修改成功");
          this.dialogVisible = false;
        })
        .finally(it => {
          this.popHandling = false;
          this.dialogVisible = false;
          this.formData = {};
          this.getTmcPatientList();
        });
    },
    change () {
      if (this.multipleSelection.length === 0) {
        this.$alert("您还未选择患者！", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      this.dialogVisible = true;
    },
    // 提醒：表格数据错误时的处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.getExamineOrderData();
    },
    handleRemove (file, fileList) {
      // console.log(file, fileList);
    },
    beforeRemove (file, fileList) {
      // console.log(" 确定移除 ");
    },
    handleUpload (fileObj) {
      let str = fileObj.file.name;
      if (str.substring(str.length - 4) !== "xlsx" && str.substring(str.length - 4) !== "XLSX") {
        this.$alert("必须导入xlsx格式的文件！", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      let formData = new FormData();
      formData.append("file", fileObj.file);
      formData.append("orgID", this.userInfo.orgID);
      this.$_http
        .post(this.$_API.INTERFACE_POST_TMC_PATIENT_IMPORT, formData)
        // .post("http://192.168.1.120:6105/api/tmc/patient/import", formData)
        .then(res => {
          this.$message({
            message: res.data,
            type: "success"
          });
          // if (res.success === true) {
          //   // this.$_success("上传成功");
          //   // this.$alert("<span>导入数据</span>" + res.data.importCount + "<span>条</span>" + "<br />" + "<span>参数缺失</span>" + res.data.paramMissCount + "<span>条</span>" + "<br />" + "<span>导入总数</span>" + res.data.totalCount + "<span>条</span>" + "<br />" + "<span>未识别</span>" + res.data.unrecognizedCount + "<span>条</span>" + "<br />" + "<span>更新数据</span>" + res.data.updateCount + "<span>条</span>", "导入成功", {
          //   //   dangerouslyUseHTMLString: true
          //   // });
          //   // console.log(res, 123123123);
          // }
        });
    },
    handleError (fileObj) {
      alert("导入失败");
    }
  }
};
</script>
<style lang="scss" scoped>
.left-s {
  float: left;
  margin-top: 5px;
}

.upload-btn {
  position: relative;
  display: inline-block;
  margin-right: 10px;
}

.color-blue {
  color: #438bef;
  font-weight: 600;
}

.left p {
  font-weight: 1600;
}

.right-s {
  float: right;
  margin-right: 10px;
  margin-top: 20px;
}

.left-s p {
  font-weight: 600;
  font-size: 18px;
}

.el-table {
  margin-top: 40px;
}

.el-dropdown {
  margin-left: 10px;
}

.dateSelect {
  max-width: 130px;
  width: 130px;
}

.margin-left {
  margin-left: 50px;
  font-size: 14px;
}

.font-12 {
  position: absolute;
  top: 35px;
  left: 0;
  color: red;
  font-size: 12px;
}
</style>
