<template>
  <div class="app-container base-page">
    <base-title name="基本信息"></base-title>
    <div class="base-search_form">
      <div style="display:flex;width:100%;">
        <div class="form-item w25">
          <span class="item-label">姓名：{{data.patientName}}</span>
        </div>
        <div class="form-item w25">
          <span class="item-label">性别：<span v-if="data.sex===1">男</span><span v-if="data.sex===2">女</span></span>
        </div>
        <div class="form-item w25">
          <span class="item-label">身高：{{data.height?data.height+'cm':'- -' || '- -'}}</span>
        </div>
        <div class="form-item w25">
          <span class="item-label">体重：{{data.weight?data.weight+'kg':'- -' || '- -'}}</span>
        </div>
        <div class="form-item w25">
          <span class="item-label">联系电话：{{data.phone}}</span>
        </div>
      </div>
      <div style="display:flex;width:100%;">
        <div class="form-item w25">
          <span class="item-label">病史：{{data.illnessStr || '- -'}}</span>
        </div>
        <div class="form-item w25">
          <span class="item-label">既往用药：{{data.usedDrugs || '- -'}}</span>
        </div>
        <div class="form-item w25">
          <span class="item-label">病症：{{data.patientTags || '- -'}}</span>
        </div>
        <div class="form-item w25">
          <span class="item-label">严重程度：
            <span v-if="data.illness===1">轻微</span>
            <span v-if="data.illness===2">一般</span>
            <span v-if="data.illness===3">严重</span>
          </span>
        </div>
        <div class="form-item w25">
          <span class="item-label">吸烟史：{{data.smoke || '- -'}}</span>
        </div>
      </div>
      <div style="display:flex;width:100%;">
        <div class="form-item w25">
          <span class="item-label">饮酒史：{{data.drink || '- -'}}</span>
        </div>
        <div class="form-item w25">
          <span class="item-label">过敏史：{{data.allergy || '- -'}}</span>
        </div>
        <div class="form-item w25">
          <span class="item-label">是否复诊：{{data.isPay===0?'未复诊':'已复诊'}}</span>
        </div>
        <div class="form-item w25">
          <span class="item-label">建档时间：{{data.addTime }}</span>
        </div>
        <div class="form-item w25">
          <span class="item-label"></span>
        </div>
      </div>
    </div>
    <base-title name="患者处方"></base-title>

    <el-table :data="tableData" class="mt24" stripe :loading="tableLoading">
      <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="phone" label="年龄" align="center">
        <template #default="{row}">
          {{ getAnalysisIdCard(row.birthYear)}}
        </template>
      </el-table-column>
      <el-table-column prop="patientTags" label="病症" align="center"></el-table-column>
      <el-table-column prop="loginTime" label="严重程度" align="center">
        <template #default="{row}">
          <span v-if="row.illness===1">轻微</span>
          <span v-if="row.illness===2">一般</span>
          <span v-if="row.illness===3">严重</span>
        </template>
      </el-table-column>
      <el-table-column prop="isDisable" label="金额" align="center">
        <template #default="{row}">
          {{ row.costPrice/100 }}
        </template>
      </el-table-column>
      <el-table-column prop="loginTime" label="处方时间" align="center">
        <template #default="{row}">
          {{ row.rpAddTime | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="handelDetail(row)">查看处方</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
    <ChatRecord title="图文记录" :itemData="itemData" :inquiryID="inquiryID" :visible.sync="dialogVisible" :patientID="patientID" :patientName="patientName" :doctorStaffID="doctorStaffID" :assistantStaffID="assistantStaffID" />
  </div>
</template>

<script>
import ChatRecord from './ChatRecord'
import { mapGetters } from "vuex";
const STATUS_LIST = ["启用", "禁用"];
export default {
  name: "user-staff",
  filters: {
    // 格式化状态
    formatStatus (val) {
      return STATUS_LIST[val] || "";
    }
  },
  data () {
    return {
      query: {},
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      },
      tableLoading: false,
      tableData: [],
      data: {},
      inquiryID: '',
      dialogVisible: false,
      patientID: '',
      patientName: '',
      doctorStaffID: '',
      assistantStaffID: '',
      itemData: {}
    };
  },
  components: {
    ChatRecord
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created () {
    this.data = JSON.parse(this.$route.query.data)
    this.getPatientDoc(this.data.keyID)

    // 加载表格
    this.loadTable();
  },
  activated () {
    this.loadTable();
  },
  methods: {
    handelDetail (row) {
      this.inquiryID = row.inquiryID
      this.patientID = row.patientID
      this.patientName = row.patientName
      this.doctorStaffID = row.doctorStaffID
      this.assistantStaffID = row.assistantStaffID
      this.itemData = row
      this.dialogVisible = true
    },
    // 转换：根据身份证号解析出生年月及年龄
    getAnalysisIdCard (birthYear) {
      if (birthYear && birthYear > 0) {
        let myDate = new Date();
        let age = myDate.getFullYear() - birthYear;
        return age;
      } else {
        return ''
      }
    },
    resetSearchInfo () {
      this.query = {
        staffName: '',
        phone: ''
      }
    },
    getPatientDoc (patientID) {
      let _this = this;
      let params = {
        keyID: patientID,
        orgID: this.userInfo.orgID
      };
      _this.$_http
        .get(_this.$_API.INTERFACE_TMC_GET_PATIENT_RECORD, {
          params
        })
        .then(res => {
          if (!res.data) return;
          let list = res.data || []
          list.map(item => {
            switch (item.docItemCode) {
              case 'HEIGHT': //身高
                this.data.height = item.docItemValue
                break;
              case 'WEIGHT': //体重
                this.data.weight = item.docItemValue
                break;
              case 'SMOKE': //抽烟
                this.data.smoke = item.docItemValue
                break;
              case 'DRINK': //喝酒
                this.data.drink = item.docItemValue
                break;
              case 'ILLNESS': //既往病史
                let illnessValue = item.docItemValue
                if (illnessValue === '有') {
                  this.data.illnessStr = item.docItemDesc
                } else {
                  this.data.illnessStr = ''
                }
                break;
              case 'ALLERGY': //过敏
                let allergyValue = item.docItemValue
                if (allergyValue === '有') {
                  this.data.allergy = item.docItemDesc
                } else {
                  this.data.allergy = ''
                }
                break;
            }
          })
        });
    },
    // 获取员工列表数据，加载表格
    loadTable () {
      if (this.tableLoading) {
        return;
      }
      let bizInfo = {
        orgID: this.userInfo.orgID,
        assistantStaffID: this.userInfo.keyID,
        patientID: this.data.keyID
      };
      let params = { ...this.pageInfo, ...this.query, ...bizInfo };
      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_ASSISTANT_ASSISTANTRP, {
          ...params
        })
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
    // 操作：点击【添加】按钮
    add () {
      this.$router.push({
        name: "user-staff-edit",
        params: { keyID: "0", mode: "C" }
      });
    },
    // 操作：点击【修改】按钮
    edit (row) {
      if (!row || !row.phone) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "user-staff-edit",
        params: { keyID: row.keyID, mode: "E" }
      });
    },
    // 操作：点击【启用】/【禁用】按钮
    disableBtn (row) {
      if (!row || !row.keyID || row.isDisable === undefined) {
        this.dataError();
        return;
      }
      this.$confirm(
        `此操作将${STATUS_LIST[~~!row.isDisable]}该员工账号，是否继续`,
        "提示",
        {
          type: "warning"
        }
      ).then(it => {
        this.disable(row);
      });
    },
    // 启用/禁用员工
    disable (row) {
      if (this.tableLoading) {
        return;
      }
      let isDisable = ~~!row.isDisable;
      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_USER_STAFF_DISABLE, {
          isDisable,
          staffID: row.keyID
        })
        .then(res => {
          this.$_success(`${STATUS_LIST[isDisable]}该员工账号成功`);
          this.tableLoading = false;
          this.loadTable();
        })
        .finally(it => {
          this.tableLoading = false;
        });
    }
  }
};
</script>
