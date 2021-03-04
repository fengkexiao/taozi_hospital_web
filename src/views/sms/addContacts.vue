<template>
  <div id="add-container">
    <el-dialog :visible.sync="visible" class="vertify" :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancel" :width="width">
      <div class="contact-box">
        <div class="left-table" v-if="isSee !== 'Y'">
          <el-form :model="query" ref="formOrder" inline id="add-contacts">
            <el-form-item label="患者姓名：">
              <base-input placeholder="请输入" v-model.trim="query.patientName" clearable></base-input>
            </el-form-item>
            <el-form-item label="联系电话：">
              <base-input placeholder="请输入" v-model.trim="query.phone" form-type="phone" maxlength="11" show-word-limit clearable></base-input>
            </el-form-item>
            <el-form-item label="下次联系时间：">
              <el-date-picker class="dateSelect" clearable v-model="query.nextContactDateStart" type="date" placeholder="开始日期">
              </el-date-picker>
              <template>&nbsp;&nbsp;--</template>
            </el-form-item>
            <el-form-item>
              <el-date-picker class="dateSelect" clearable v-model="query.nextContactDateEnd" type="date" placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="followStatus" label="患者状态：">
              <el-select v-model="query.followStatus" placeholder="全部" clearable>
                <el-option v-for="item in orgTypeOptions" :key="item.followStatus" :label="item.orgTypeName" :value="item.followStatus"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="patientLevel" label="患者分级：">
              <el-select v-model="query.patientLevel" placeholder="全部" clearable>
                <el-option v-for="item in options" :key="item.keyID" :label="item.levelName" :value="item.levelName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="IP医生：">
              <base-input placeholder="请输入" v-model.trim="query.assistantName" clearable></base-input>
            </el-form-item>
            <el-form-item label="医生：">
              <base-input placeholder="请输入" v-model.trim="query.doctorName" clearable></base-input>
            </el-form-item>
            <el-form-item label="建档时间：">
              <el-date-picker class="dateSelect" clearable v-model="query.buildStartDate" type="date" placeholder="开始日期">
              </el-date-picker>
              <template>&nbsp;&nbsp;--</template>
            </el-form-item>
            <el-form-item>
              <el-date-picker class="dateSelect" clearable v-model="query.buildEndDate" type="date" placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="getTmcPatientList()">查询</el-button>
              <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
            </el-form-item>
            <span>
              <el-button v-if="isSee !== 'Y'" type="primary" @click="addToList()" style="float: right; margin-right: 50px">添加到发送对象</el-button>
            </span>
          </el-form>
          <el-table :data="tmcPatientList" style="width: 100%" fit ref="multipleTable" @selection-change="handleSelectionChange" tooltip-effect="dark">
            <el-table-column type="selection" width="45" align="center"></el-table-column>
            <el-table-column prop="patientName" label="姓名" align="center" width="80"></el-table-column>
            <el-table-column prop="phone" label="联系电话" align="center" width="110"></el-table-column>
            <el-table-column prop="nextContactDate" label="下次联系日期" align="center" width="130">
              <template #default="{row}">{{ row.nextContactDate | formatDate }}</template>
            </el-table-column>
            <el-table-column prop="patientLevel" label="患者分级" align="center" width="80"></el-table-column>
            <el-table-column prop="consultationDiseases" label="咨询病种" align="center" width="140">
              <template #default="{row}">{{subStr(row.consultationDiseases)}}</template>
            </el-table-column>
            <el-table-column prop="place" label="联系地址" align="center" width="140">
              <template #default="{row}">{{subStr(row.place)}}</template>
            </el-table-column>
            <el-table-column prop="assistantName" label="IP医生" align="center" width="100"></el-table-column>
            <el-table-column prop="doctorName" label="医生" align="center" width="100"></el-table-column>
            <el-table-column prop="followStatus" label="患者状态" align="center" width="150">
              <template #default="{row}">{{row.followStatus | formatSection}}</template>
            </el-table-column>
            <el-table-column prop="addTime" label="建档时间" align="center">
              <template #default="{row}">{{ row.addTime | formatDateTime }}</template>
            </el-table-column>
          </el-table>
          <base-pagination v-model="page" @size-change="getTmcPatientList" @current-change="getTmcPatientList" />
        </div>
        <div class="right-table" id="set-height">
          <div style="margin-left: 20px">
            已选发送对象：
            <span class="title-weight">{{addList.length}}人</span>
          </div>
          <div style="margin-left: 20px; margin-top: 20px">
            规则名称：
            <el-input placeholder="请输入" v-model.trim="targetName" v-if="isSee !== 'Y'" maxlength="20" class="input_250"></el-input>
            <span v-else>{{targetName}}</span>
          </div>
          <el-table :data="showSelectedPatient()"  style="width:100%" stripe ref="multipleTable" @selection-change="handleSelectionChanges" tooltip-effect="dark">
            <el-table-column type="selection" width="65" align="center" v-if="isSee !== 'Y'"></el-table-column>
            <el-table-column prop="patientName" label="姓名" align="center" width="110"></el-table-column>
            <el-table-column prop="patientPhone" label="联系电话" align="center" width="140"></el-table-column>
            <el-table-column align="right" width="110"  >
              <template slot="header" slot-scope="scope">
                <el-button v-if="isSee !== 'Y'" size="mini" type="danger" @click="handleDeleteAll(scope.$index, scope.row)" :disabled="disabled">批量移除</el-button>
              </template>
              <template slot-scope="scope">
                <el-button v-if="isSee !== 'Y'" size="mini" type="danger" @click="handleDelete(scope.$index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination id="paginations" class="mt24" v-model="pages" @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page.sync="currentPage2" :pager-count="5" :page-sizes="[10]" :page-size="pageSize1" background layout="sizes, prev, pager, next, jumper" :total="totalNum"></el-pagination>
          <!-- <base-pagination v-model="pages" @size-change="getTmcPatientList" @current-change="getTmcPatientList" /> -->
          <div class="center" v-if="isSee !== 'Y'">
            <div>
              <el-button @click="cancel">取消</el-button>
              <el-button type="primary" @click="save">确定</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from "../../filters";
import InputWithTip from "@/components/InputWithTip";
import { mapGetters } from "vuex";
export default {
  name: "addContacts",
  filters: {
    formatSection (val) {
      if (val === 1) {
        return "已购药，需要跟进";
      } else if (val === 2) {
        return "已购药不需要跟进";
      } else if (val === 3) {
        return "不购药";
      }
    }
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InputWithTip
  },
  computed: {
    ...mapGetters(["userInfo"]),
    totalNum () {
      let that = this;
      let num = 0;
      if (that.addList.length > 0) {
        num = Math.ceil(that.addList.length / that.pageSize1) * that.pageSize1;
      }
      return num;
    }
  },
  props: {
    // 控制显示
    visible: {
      type: Boolean,
      default () {
        return false;
      }
    },
    // 弹窗是否在处理中
    popHandling1: {
      type: Boolean,
      default () {
        return false;
      }
    },
    propdata: {
      type: Object,
      default () {
        return {};
      }
    },
    isSee: {
      type: String
    }
  },
  data () {
    return {
      tmcPatientList: [],
      formData: {},
      // 添加的联系人数组
      addList: [],
      // 添加的联系人对象
      addListObj: {},
      title: "添加联系人",
      assistantNameList: [],
      multipleSelection: [],
      selectionPatient: [],
      nextContactDate: "",
      targetName: "",
      disabled: true,
      width: "1700px",
      currentPage2: 1,
      pageSize1: 10,
      query: {
        nextContactDateStart: "",
        nextContactDateEnd: "",
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
      orgTypeOptions: [
        { followStatus: "1", orgTypeName: "已购药，需要跟进" },
        { followStatus: "2", orgTypeName: "已购药不需要跟进" },
        { followStatus: "3", orgTypeName: "不购药" }
      ],
      createTimes: [],
      moveData: {},
      createTimesConversion: [],
      dialogVisible: false,
      addClientVisible: false,
      tableLoading: false,
      client: {},
      page: {
        // 分页参数
        pageIndex: 1,
        pageSize: 10
      },
      pages: {
        // 分页参数
        pageIndex: 1,
        pageSize: 10
      }
    };
  },
  watch: {
    propdata () {
      this.moveData = JSON.parse(JSON.stringify(this.propdata));
      this.targetName = this.moveData.targetName;
      this.addList = [...JSON.parse(this.moveData.content)];
      this.showSelectedPatient();
      if (this.isSee === "Y") {
        this.width = "600px";
        this.title = "特定联系人";
      } else if (this.isSee === "E") {
        this.title = "修改联系人";
      } else {
        this.title = "添加联系人";
      }
    }
  },
  created () {
    this.initializeDateRegion();
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
    },
    handleSelectionChanges (val) {
      this.selectionPatient = val;
      if (this.selectionPatient.length > 0) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    // 操作：重置输入框信息
    resetSearchInfo () {
      this.query = {};
      this.$refs.formOrder.resetFields();
      this.options = [];
      this.initializeDateRegion();
    },
    initializeDateRegion () {
      this.getPatientLevel();
    },
    getTmcPatientList () {
      if (this.tableLoading) {
        return;
      }
      if (this.query.buildStartDate && this.query.buildEndDate) {
        if (this.query.buildEndDate < this.query.buildStartDate) {
          this.$alert("建档开始时间不能大于结束时间", "提示", {
            confirmButtonText: "确定",
            callback: action => { }
          });
          return;
        }
      }
      if (this.query.nextContactDateStart && this.query.nextContactDateEnd) {
        if (this.query.nextContactDateEnd < this.query.nextContactDateStart) {
          this.$alert("下次联系开始时间不能大于结束时间", "提示", {
            confirmButtonText: "确定",
            callback: action => { }
          });
          return;
        }
      }
      let hospitalInfo = {
        orgID: this.userInfo.orgID
      };
      this.query.buildStartDate = formatDate(this.query.buildStartDate);
      this.query.buildEndDate = formatDate(this.query.buildEndDate);
      this.query.nextContactDateStart = formatDate(this.query.nextContactDateStart);
      this.query.nextContactDateEnd = formatDate(this.query.nextContactDateEnd);
      let params = {
        ...this.query,
        ...hospitalInfo,
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize
      };
      this.tableLoading = true;
      // console.log(params);
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_PATIENT_LISTINFO, { params })
        .then(response => {
          // console.log(response.data.datas);
          if (!response.data) return;
          this.tmcPatientList = response.data.datas;
          this.page = response.data.pageInfo;
          this.tmcPatientList.forEach(item => {
            item["place"] = item.province + item.city;
          });
        })
        .finally(it => {
          this.tableLoading = false;
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
      this.page.PageSize = val;
      this.getTmcPatientList();
    },
    handleCurrentChange (val) {
      this.page.pageIndex = val;
      this.getTmcPatientList();
    },
    handleSizeChange1 (val) {
    },
    handleCurrentChange1 (val) {
      this.pages.pageIndex = val;
      this.showSelectedPatient();
    },
    // 添加
    addToList () {
      let addList = [];
      addList.push(...this.multipleSelection);
      let isEorr = addList.some(it => {
        return it.phone === "";
      });
      if (isEorr) {
        this.$alert("请完善联系电话", "提示", {
          confirmButtonText: "确定",
          callback: action => { }
        });
        return;
      }
      addList = addList.map(item => {
        return {
          patientID: item.keyID,
          patientName: item.patientName,
          patientPhone: item.phone,
          doctorStaffID: item.doctorStaffID,
          assistantStaffID: item.assistantStaffID,
          orgID: item.orgID
        };
      });
      addList.forEach(element => {
        if (!this.addListObj[element.patientID]) {
          this.addListObj[element.patientID] = element;
          this.addList.push(element);
        }
      });
    },
    handleDelete (index) {
      let element = this.addList[index];
      this.addList.splice(index, 1);
      delete this.addListObj[element.patientID];
    },
    handleDeleteAll () {
      this.$confirm("确定要批量移除选中的对象吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let selectionPatient = this.selectionPatient.map((item) => {
          return item.patientID;
        });
        this.addList = this.addList.filter((it) => {
          return !selectionPatient.includes(it.patientID);
        });
        for (let i = 0; i < selectionPatient.length; i++) {
          delete this.addListObj[selectionPatient[i]];
        }
        this.selectionPatient = [];
        this.disabled = true;
        // this.addList = [];
        // this.addListObj = {};
      });
    },
    // 点击取消处理
    cancel () {
      this.$emit("update:visible", false);
      this.query = {};
      this.targetName = "";
      this.addList = [];
      this.addListObj = {};
      this.tmcPatientList = [];
      this.title = "添加联系人";
    },
    save () {
      if (this.targetName === "") {
        this.$alert("请输入规则名称", "提示", {
          confirmButtonText: "确定",
          callback: action => { }
        });
        return;
      }
      if (this.addList.length === 0) {
        this.$alert("请添加联系人", "提示", {
          confirmButtonText: "确定",
          callback: action => { }
        });
        return;
      }
      let moveData = {};
      moveData.targetName = this.targetName;
      moveData.addList = this.addList;
      if (this.popHandling1) {
        return;
      }
      this.$refs.formOrder.validate(valid => {
        if (!valid) {
          return;
        }
        this.$emit("save", moveData);
        this.query = {};
        this.targetName = "";
        this.addList = [];
        this.tmcPatientList = [];
        this.title = "添加联系人";
      });
    },
    // 提醒：表格数据错误时的处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.getExamineOrderData();
    },
    // 分页展示选中患者
    showSelectedPatient () {
      let pageIndex = this.pages.pageIndex;
      let pageSize = this.pages.pageSize;
      let start = (pageIndex - 1) * pageSize;
      let end = pageIndex * pageSize;
      return this.addList.slice(start, end);
    },
    subStr (str) {
      return str.length > 6 ? str.substr(0, 6) + "..." : str;
    }
  }
};
</script>
<style lang="scss" scoped>
.contact-box {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.left-table {
  width: 1250px;
  margin-right: 1px;
  border-right: 1px solid #cccccc;
}
.right-table {
  width: 420px;
  position: relative;
}
.el-table {
  margin-top: 30px;
}
.el-dropdown {
  margin-left: 10px;
}
.title-weight {
  margin-left: 10px;
  font-weight: 800;
}
.center div {
  position: absolute;
  bottom: 30px;
  right: 130px;
}
#paginations {
  margin-bottom: 100px;
}
</style>
<style>
#add-contacts .el-form-item .el-input {
  max-width: 200px;
}
#add-contacts .el-form-item .dateSelect {
  max-width: 130px;
}
#add-container .vertify .el-dialog__header {
  border-bottom: 1px solid #cccccc;
}
#set-height .el-table td,
.el-table th {
  padding: 3px 0;
}
#paginations .el-select .el-input {
  width: 75px;
}
#paginations .el-select .el-input .el-input__inner {
  padding-right: 20px;
}
</style>
