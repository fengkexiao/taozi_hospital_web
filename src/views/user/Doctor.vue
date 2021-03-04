<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">医生姓名：</span>
        <el-input v-model="query.doctorName" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">联系电话：</span>
        <el-input v-model="query.phone" maxlength="11" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">科室：</span>
        <el-select v-model="query.sectionID" placeholder="请选择" clearable filterable>
          <el-option v-for="item in hospitalSectionList" :key="item.keyID" :label="item.hospitalSectionName" :value="item.keyID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="loadTable">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
      </div>
    </div>
    <base-title name="医生列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
      <el-button v-if="userInfo.orgTypeID === 4" @click="his_synchronous">同步</el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" :loading="tableLoading">
      <el-table-column prop="doctorName" label="医生姓名" align="center"></el-table-column>
      <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="addTime" label="创建时间" align="center">
        <template #default="{row}">{{ row.addTime | formatDateTime }}</template>
      </el-table-column>
      <el-table-column prop="auditStatusName" label="状态" align="center"></el-table-column>
      <el-table-column v-if="userInfo.orgTypeID === 4" prop="hisDoctorCode" align="center" label="医生码"></el-table-column>
      <el-table-column v-if="userInfo.orgTypeID === 4" prop="hospitalSectionName" align="center" label="科室"></el-table-column>
      <el-table-column v-if="userInfo.orgTypeID === 4" label="签章" align="center">
        <template #default="{row}" align="center">
          <div class="operation" v-if="!row.hiSignUrl ||  row.hiSignUrl === 0">
            <span type="primary" size="mini" icon="el-icon-edit" @click="applyHiSign(row)">申请签章</span>
          </div>
          <img v-else style="width: 90px;height: 50px" :src="row.hiSignUrl" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="320" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="detail(row)">详情</span>
            <div class="line"></div>
            <span class="opt-text" @click="update(row)">修改</span>
            <div class="line" v-if="row.auditStatusID === 0 || row.auditStatusID === 3"></div>
            <span class="opt-text" v-if="row.auditStatusID === 0 || row.auditStatusID === 3" @click="detail(row)">去实名认证</span>
            <div class="line" v-if="userInfo.orgTypeID === 4"></div>
            <div class="line opt-text" v-if="userInfo.orgTypeID === 4" @click="associatedHIS(row)">{{row.hisDoctorCode ? "修改绑定HIS" : "绑定HIS"}}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
    <popup-add-by-vertify :visible.sync="dialogVisible" :popHandling="popHandling" :sections="sections" title="创建医生" @save="save" />
    <el-dialog class="popup-vertify" title="修改医生" :visible.sync="updateDoctor" width="470px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="科室：">
          <el-select v-model="formData.sectionID" placeholder="请选择" filterable clearable class="w200">
            <el-option v-for="(item,index) in sections" :key="index" :label="item.hospitalSectionName" :value="item.keyID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="isWorker">
          <el-checkbox v-model="formData.whetherStaff">同时在“员工管理”列表中生成员工账号</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button :loading="popHandling" type="primary" @click="updataStaffUser">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog class="popup-vertify" :title="hisTitle" :visible.sync="showHIS" width="470px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="科室：">
          <el-select v-model="hisQuery.hisSectionCode" placeholder="请选择" filterable clearable class="w200">
            <el-option v-for="(item,index) in hisSection" :key="index" :label="item.hospitalSectionName" :value="item.hisSectionCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="hisQuery.doctorName" placeholder="请输入" clearable class="w200"/>&nbsp;&nbsp;
          <el-button type="primary" @click="his_serach">搜索</el-button>
        </el-form-item>
        <el-form-item v-if="hisDatas.hisDoctorName">
          <el-tag effect="plain">{{hisDatas.hisDoctorName}}</el-tag>&nbsp;&nbsp;
          <el-tag effect="plain">{{hisDatas.hospitalSectionName}}</el-tag>&nbsp;&nbsp;
          <el-tag effect="plain">{{hisDatas.hisDoctorCode}}</el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="his_cancel">取消</el-button>
        <el-button type="primary" @click="his_confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PopupAddByVertify from "./PopupAddByVertify";
export default {
  name: "user-doctor",
  components: {
    PopupAddByVertify
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
      dialogVisible: false,
      popHandling: false,
      sections: [],
      hisSection: [],
      updateDoctor: false,
      showHIS: false,
      formData: {
        whetherStaff: false
      },
      X: {},
      hisQuery: {
        hisSectionCode: "",
        doctorName: ""
      },
      hisDatas: {},
      hisTitle: "绑定HIS",
      hospitalSectionList: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    // 加载表格
    this.loadTable();
    this.getOrgSection();
    this.getHisSetion();
    this.getHospitalSectionList();
  },
  activated () {
    this.loadTable();
  },
  methods: {
    resetSearchInfo () {
      this.query = {
        doctorName: "",
        phone: "",
        sectionID: ""
      }
    },
    getHisSetion () {
      this.$_http
        .get(this.$_API.INTERFACE_GET_HIS_SECTIONLIST, {
          params: {
            orgID: this.userInfo.orgID
          }
        })
        .then(response => {
          if (!response.data) return;
          this.hisSection = response.data;
        });
    },
    getOrgSection () {
      this.$_http
        .get(this.$_API.INTERFACE_GET_SECTION_LIST, {
          params: {
            orgId: this.userInfo.orgID,
            disableStatus: 0
          }
        })
        .then(response => {
          if (!response.data) return;
          this.sections = response.data;
        });
    },
    // 获取医生列表数据，加载表格
    loadTable () {
      if (this.tableLoading) {
        return;
      }
      let bizInfo = {
        orgID: this.userInfo.orgID,
        doctorTypeID: 1
      };
      let params = { ...this.pageInfo, ...this.query, ...bizInfo };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_USER_DOCTOR_LIST, {
          params
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
      this.dialogVisible = true;
    },
    // 新增医生
    save (data) {
      let bizInfo = {
        orgID: this.userInfo.orgID,
        staffTypeID: 1
      };
      this.popHandling = true;
      this.$_http
        .post(this.userInfo.orgTypeID === 4 ? this.$_API.INTERFACE_USER_HIDOCTOR_ADD : this.$_API.INTERFACE_USER_DOCTOR_ADD, {
          ...data,
          ...bizInfo
        })
        .then(res => {
          this.$_success("创建医生成功");
          // 加载表格
          this.loadTable();
          this.dialogVisible = false;
        })
        .finally(it => {
          this.popHandling = false;
        });
    },
    // 操作：点击【详情】、【去实名认证】按钮
    detail (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      let mode =
        row.auditStatusID === 0 ? "C" : row.auditStatusID === 3 ? "E" : "V";
      this.$router.push({
        name: "user-doctor-edit",
        params: { keyID: row.keyID, mode, backUrl: "/user/doctor" }
      });
    },
    code (row) {
      this.$router.push({
        name: "user-doctor-code",
        params: { keyID: row.orgKeyID }
      });
    },
    // 修改医生信息
    update (row) {
      this.updateDoctor = true;
      this.X = row;
      if (this.X.isWorker === 1) {
        this.formData.whetherStaff = true;
      }
    },
    // 关联HIS
    associatedHIS (row) {
      this.X = row;
      this.hisTitle = this.X.hisDoctorCode ? "修改绑定HIS" : "绑定HIS";
      this.hisQuery = {};
      this.hisDatas = {};
      this.showHIS = true;
    },
    // 同步
    his_synchronous () {
      this.$_http
        .get(this.$_API.INTERFACE_GET_HIS_DOCTORCODETABLE, {
          params: {
            orgID: this.userInfo.orgID
          }
        })
        .then(response => {
          if (!response) return;
          this.$message({
            type: "success",
            message: "同步成功"
          });
          if (response.data === true) {
            this.pageInfo = {
              pageSize: 10,
              pageIndex: 1,
              totalRow: 0
            };
            this.loadTable();
            this.hisSection();
          }
        });
    },
    his_cancel () {
      this.showHIS = false;
    },
    his_confirm () {
      let data = {
        doctorID: this.X.keyID,
        doctorStaffID: this.X.orgKeyID,
        hisDoctorCode: this.hisDatas.hisDoctorCode,
        biz: this.X.hisDoctorCode ? "update" : "add",
        orgID: this.X.orgID
      };
      if (!data.hisDoctorCode) {
        this.$_error("请先点击搜索按钮，选择绑定医生");
        return;
      }
      this.showHIS = false;
      this.$_http
        .post(this.$_API.INTERFACE_GET_HIS_ADDRELATION, data)
        .then(res => {
          this.pageInfo = {
            pageSize: 10,
            pageIndex: 1,
            totalRow: 0
          };
          this.loadTable();
          this.hisSection();
          this.$_success("绑定HIS成功");
        });
    },
    his_serach () {
      if (!this.hisQuery.hisSectionCode) {
        this.$_error("请选择绑定科室");
        return;
      }
      if (!this.hisQuery.doctorName) {
        this.$_error("请填写绑定医生名");
        return;
      }
      this.$_http
        .get(this.$_API.INTERFACE_GET_HIS_SERACHHISINFO, {
          params: {
            orgID: this.userInfo.orgID,
            ...this.hisQuery
          }
        })
        .then(response => {
          this.hisDatas = response.data ? response.data : {};
          if (Object.keys(this.hisDatas).length === 0) {
            this.$_error("暂无匹配数据");
          }
        });
    },
    cancel () {
      this.updateDoctor = false;
      this.formData = {};
    },
    updataStaffUser () {
      let isw = 0;
      if (this.formData.whetherStaff === true) {
        isw = 1;
      }
      let data = {
        keyID: this.X.orgKeyID,
        sectionKeyID: this.formData.sectionID,
        isWorker: isw
      };
      this.$_http
        .post(this.$_API.INTERFACE_USER_POST_UPDATEHOSPITALDOCTORBYKEYID, data)
        .then(res => {
          this.$_success("修改医生成功");
          this.updateDoctor = false;
          this.formData.sectionID = "";
          // 加载表格
          this.loadTable();
          this.dialogVisible = false;
        });
    },
    /**
     * 申请签章
     */
    applyHiSign (row) {
      let params = {
        doctorID: row.keyID,
        orgName: this.userInfo.orgName
      };
      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_POST_PEACHUSET_APPLYHISIGN, params)
        .then(res => {
          this.tableLoading = false;
          this.query = {};
          this.pageInfo = {
            pageSize: 10,
            pageIndex: 1,
            totalRow: 0
          };
          this.loadTable();
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    /**
     * 获取科室
     */
    getHospitalSectionList () {
      this.$_http
        .get(this.$_API.INTERFACE_GET_SECTION_LIST, {
          params: {
            orgId: this.userInfo.orgID,
            disableStatus: 0
          }
        })
        .then(response => {
          if (!response.data) return;
          this.hospitalSectionList = response.data;
        });
    }
  }
};
</script>

<style>
.popup-vertify > .el-dialog {
  max-width: 700px;
}
</style>
