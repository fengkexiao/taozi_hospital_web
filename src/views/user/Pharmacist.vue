<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">药师姓名：</span>
        <el-input v-model="query.pharmacistName" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">联系电话：</span>
        <el-input v-model="query.phone" maxlength="11" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="loadTable">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
      </div>
    </div>
    <base-title name="药师列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
    </div>
    <el-table :data="tableData" stripe :loading="tableLoading" style="width: 100%">
      <el-table-column prop="doctorName" label="药师姓名" align="center"></el-table-column>
      <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="addTime" label="创建时间" align="center">
        <template #default="{row}">
          {{ row.addTime | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="auditStatusName" label="状态" align="center"></el-table-column>
      <el-table-column label="操作" width="240" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" v-if="row.auditStatusID === 0 || row.auditStatusID === 3" @click="detail(row)">去实名认证</span>
            <span class="opt-text" v-else @click="detail(row)">详情</span>
            <div class="line"></div>
            <span class=" opt-text" @click="update(row)">修改</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
    <popup-add-by-vertify :visible.sync="dialogVisible" :popHandling="popHandling" :sections="sections" title="创建药师" @save="save" />
    <el-dialog class="popup-vertify" title="修改药师" :visible.sync="updateDoctor" width="470px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="科室：">
          <el-select v-model="formData.sectionID" placeholder="请选择" filterable clearable>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PopupAddByVertify from "./PopupAddByVertify";
export default {
  name: "user-pharmacist",
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
      updateDoctor: false,
      formData: {
        whetherStaff: false
      },
      X: {}
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    // 加载表格
    this.loadTable();
    this.getOrgSection();
  },
  activated () {
    this.loadTable();
  },
  methods: {
    resetSearchInfo () {
      this.query = {
        pharmacistName: "",
        phone: ""
      }
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
    // 获取药师列表数据，加载表格
    loadTable () {
      if (this.tableLoading) {
        return;
      }
      let bizInfo = {
        orgID: this.userInfo.orgID,
        doctorTypeID: 3
      };
      let params = { ...this.pageInfo, ...this.query, ...bizInfo };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_USER_PHARMACIST_LIST, {
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
    // 新增药师
    save (data) {
      let bizInfo = {
        orgID: this.userInfo.orgID,
        staffTypeID: 3
      };
      this.popHandling = true;
      this.$_http
        .post(this.$_API.INTERFACE_USER_DOCTOR_ADD, {
          ...data,
          ...bizInfo
        })
        .then(res => {
          this.$_success("创建药师成功");
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
        name: "user-pharmacist-edit",
        params: { keyID: row.keyID, mode }
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
          this.$_success("修改药师成功");
          this.updateDoctor = false;
          this.formData.sectionID = "";
          // 加载表格
          this.loadTable();
          this.dialogVisible = false;
        });
    }
  }
};
</script>
