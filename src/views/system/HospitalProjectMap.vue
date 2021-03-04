<template>
  <div class="app-container base-page">
    <base-title :name="'标准项目：'+pjName"></base-title>

    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addHospitalProject">添加医院项目</el-button>
    </div>

    <base-title name="医院项目列表"></base-title>

    <el-table :data="tableData" style="width: 100%" class="mt24" :loading="tableLoading" stripe>
      <el-table-column prop="projectNo" label="项目编号" align="center"></el-table-column>
      <el-table-column prop="projectName" label="项目名称" align="center"></el-table-column>
      <el-table-column prop="addUser" label="添加人" align="center"></el-table-column>
      <el-table-column prop="addTime" label="添加时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="text-danger opt-text" @click="deleteHospitalProject(row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="queryHospitalProjectList" @current-change="queryHospitalProjectList" />
    <div style="display: flex;flex-direction: row;justify-content: center">
      <el-button  @click="cancleAction">返回</el-button>
    </div>
    <!-- 添加医院项目 -->
    <el-dialog title="添加医院项目" :visible.sync="dialogVisible" width="30%">
      <el-form ref="formHospitalProject" :model="hospitalProject" :rules="addHospitalProjectRules" label-width="150px">
        <el-form-item label="项目编号：" prop="projectNo">
          <el-input type="text" placeholder="请输入" v-model="hospitalProject.projectNo" maxlength="30" clearable></el-input>
        </el-form-item>
        <el-form-item label="项目名称：" prop="projectName">
          <el-input type="text" placeholder="请输入" v-model="hospitalProject.projectName" maxlength="30" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="validate">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "hospitalProjectMap",
  inject: ["close"],
  filters: {},
  computed: {
    ...mapGetters(["userInfo"])
  },
  components: {},
  props: {
    orgID: {
      type: String,
      required: true
    },
    standProjectCode: {
      type: String,
      required: true
    },
    standProjectName: {
      type: String,
      required: true
    },
    addUser: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      dialogVisible: false,
      tableLoading: false,
      tableData: [],
      hospitalProject: {
        projectNo: "",
        projectName: ""
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      },
      addHospitalProjectRules: {
        projectNo: {
          required: true,
          message: "项目编号不能为空"
        },
        projectName: {
          required: true,
          message: "项目名称不能为空"
        }
      }
    };
  },
  created () {
    this.pjName = this.standProjectName;
    this.queryHospitalProjectList();
  },
  activated () { },
  methods: {
    reset () {
      this.tableData = [];
      this.pageInfo = {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      };
      // 获取医院项目映射列表
      this.queryHospitalProjectList();
    },
    queryHospitalProjectList () {
      this.tableLoading = true;
      let params = {
        // orgID: "19101610315474350800511001",
        //  standProjectCode: "AAA",
        orgID: this.orgID,
        standProjectCode: this.standProjectCode,
        pageIndex: this.pageInfo.pageIndex,
        pageSize: this.pageInfo.pageSize
      };
      // console.log("获取医院项目映射列表:params--------------", params);
      this.$_http
        .get(
          this.$_API.INTERFACE_GET_HOSPITALMAP_PROJECT_LIST,
          // "http://10.0.0.37:6216/feeItemManage/listMapping",
          {
            params
          }
        )
        .then(
          response => {
            // console.log(
            //   "获取医院项目映射列表:response--------------",
            //   response.data
            // );
            this.tableLoading = false;
            if (!response.data) return;
            if (response.data) {
              this.tableData = response.data.datas;
              this.pageInfo = response.data.pageInfo;
            }
          },
          () => {
            this.tableLoading = false;
          }
        );
    },
    // 添加医院项目
    addHospitalProject () {
      this.dialogVisible = true;
    },
    // 验证表单
    validate () {
      if (this.screenLoading) {
        return;
      }
      this.$refs.formHospitalProject.validate(valid => {
        if (!valid) {
          return;
        }
        this.confirmSaveHospitalProject();
      });
    },
    // 保存医院映射项目
    confirmSaveHospitalProject () {
      let _this = this;
      let params = {
        // orgID: "19101610315474350800511001",
        // standProjectCode: "AAA",
        orgID: this.orgID,
        standProjectCode: this.standProjectCode,
        projectNo: _this.hospitalProject.projectNo,
        projectName: _this.hospitalProject.projectName
      };
      _this.$_http
        .post(
          _this.$_API.INTERFACE_POST_HOSPITALMAP_PROJECT_ADD,
          // "http://10.0.0.37:6216/feeItemManage/addMapping",
          params
        )
        .then(r => {
          if (r.code === 0) return;
          _this.queryHospitalProjectList();
          _this.dialogVisible = false;
        });
    },
    // 删除医院映射项目
    deleteHospitalProject (row) {
      let _this = this;
      // let data = {
      //   keyID: row.keyID
      // };
      // // console.log("删除医院映射项目:data--------------", data);
      // _this.$_http
      //   .post(
      //     _this.$_API.INTERFACE_POST_HOSPITALMAP_PROJECT_DELETE,
      //     // "http://10.0.0.37:6216/feeItemManage/delMapping",
      //     data
      //   )
      //   .then(r => {
      //     if (r.code === 0) return;
      //     _this.queryHospitalProjectList();
      //   });
      this.$confirm("是否删除医院项目?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            keyID: row.keyID
          };
          // console.log("删除医院映射项目:data--------------", data);
          _this.$_http
            .post(
              _this.$_API.INTERFACE_POST_HOSPITALMAP_PROJECT_DELETE,
              // "http://10.0.0.37:6216/feeItemManage/delMapping",
              data
            )
            .then(r => {
              if (r.code === 0) return;
              _this.queryHospitalProjectList();
              _this.$_success("删除成功");
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    handleClose () {
      this.dialogVisible = false;
    },
    cancleOption () {
      this.dialogVisible = false;
    },
    cancleAction () {
      this.close().then(() => {
        this.$router.push({
          name: "feeItemMng",
          params: {}
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.right-s {
  float: right;
  margin-right: 10px;
  margin-top: 20px;
}
.color-blue {
  color: #438bef;
  font-weight: 800;
}
</style>
