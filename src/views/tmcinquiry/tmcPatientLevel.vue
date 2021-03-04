<template>
  <div class="app-container base-page">
    <base-title name="患者分级列表"></base-title>

    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addDoctorGroup(2)">添加分级</el-button>
    </div>

    <el-table :data="doctorGroupList" style="width: 100%" stripe>
      <el-table-column prop="levelName" label="患者分级" align="center"></el-table-column>
      <el-table-column prop="levelDes" label="分级描述" align="center"></el-table-column>
      <el-table-column prop="sortNo" label="排序值" align="center"></el-table-column>
      <el-table-column prop="addTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="isDisable" label="状态" align="center">
        <template #default="{row}">
          <p v-if="row.isDisable === 0">启用</p>
          <p v-if="row.isDisable === 1">禁用</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div class="option-btn_group">
            <span class="opt-text" @click="modifyDoctor(scope.row, 1)">编辑</span>
            <div class="line" v-if="scope.row.isDisable === 1"></div>
            <span class="opt-text" v-if="scope.row.isDisable === 1" type="primary" @click="disableStaff(scope.row, '0')">启用</span>
            <div class="line" v-if="scope.row.isDisable === 0"></div>
            <span class="opt-text text-danger" v-if="scope.row.isDisable === 0" type="danger" @click="disableStaff(scope.row, '1')">禁用</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="page" @size-change="getDoctorGroupList" @current-change="getDoctorGroupList" />
    <popup-add-by-PatientLevel :visible.sync="dialogVisible" :popHandling="popHandling" :propdata="formData" title="患者分级" @save="save" />
  </div>
</template>

<script>
import PopupAddByPatientLevel from "./PopupAddByPatientLevel";
import { mapGetters } from "vuex";
export default {
  name: "tmcPatientLevel",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    PopupAddByPatientLevel
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  filters: {
  },
  data () {
    return {
      doctorGroupList: [],
      state: "",
      dialogVisible: false,
      popHandling: false,
      formData: {},
      page: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      }
    };
  },
  activated () {
    // this.getDoctorGroupList();
  },
  methods: {
    getDoctorGroupList () {
      let params = {
        orgID: this.userInfo.orgID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_PATIENT_LEVEL_LIST, { params })
        .then(response => {
          if (!response.data) return;
          this.doctorGroupList = response.data;
          // console.log(response, 12121);
        });
    },
    searchList () {
      this.page.pageIndex = 1;
      this.getDoctorGroupList();
    },
    handleSizeChange (val) {
      this.page.PageSize = val;
      this.getDoctorGroupList();
    },
    handleCurrentChange (val) {
      this.page.pageIndex = val;
      this.getDoctorGroupList();
    },
    // 禁用/启用
    disableStaff (row, isDisable) {
      let msg = "";
      if (isDisable === "1") {
        msg = "是否禁用该分级";
      } else {
        msg = "是否启用该分级";
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.dialogFormVisible = false;
          let params = {
            orgID: row.orgID,
            keyID: row.keyID,
            isDisable: isDisable
          };
          // console.log(params);
          this.$_http
            .post(this.$_API.INTERFACE_TMC_POST_MATERIAL_TEMPLATE_DISABLE, params)
            .then(response => {
              this.$_success("操作成功");
              this.getDoctorGroupList();
            });
        })
        .catch(() => { });
    },
    addDoctorGroup (state) {
      this.dialogVisible = true;
      this.state = 2;
    },
    modifyDoctor (data, state) {
      this.dialogVisible = true;
      let objs = JSON.parse(JSON.stringify(data));
      this.formData = objs;
      this.state = 1;
      // console.log(this.formData);
    },
    // 添加/修改医生组
    save (data) {
      if (!data.keyID) {
        data.keyID = "";
      }
      let params = {
        orgID: this.userInfo.orgID,
        levelName: data.levelName,
        levelDes: data.levelDes,
        sortNo: data.sortNo,
        keyID: data.keyID,
        isDisable: 0
      };
      // console.log(params, 111);
      this.popHandling = true;
      if (this.state === 2) {
        this.$_http.post(this.$_API.INTERFACE_TMC_POST_PATIENT_LEVEL_SAVE, params).then(res => {
          this.$_success("添加成功");
          this.dialogVisible = false;
        }).finally(it => {
          this.popHandling = false;
          this.dialogVisible = false;
          this.formData = {};
          this.getDoctorGroupList();
        });
      }
      if (this.state === 1) {
        this.$_http.post(this.$_API.INTERFACE_TMC_POST_PATIENT_LEVEL_SAVE, params).then(res => {
          this.$_success("修改成功");
          this.dialogVisible = false;
        }).finally(it => {
          this.popHandling = false;
          this.dialogVisible = false;
          this.formData = {};
          this.getDoctorGroupList();
        });
      }
    },
    // 提醒：表格数据错误时的处理
    dataError () {
      this.$_warning("数据出错了，正在重新获取数据");
      this.getDoctorGroupList();
    }
  },
  created () {
    this.getDoctorGroupList();
  }
};
</script>

<style scoped>
.left {
  float: left;
}
.right {
  float: right;
  margin-right: 20px;
  margin-top: 10px;
}
.color-blue {
  color: #438bef;
  font-weight: 800;
}
</style>
