<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">医生组名：</span>
        <el-input placeholder="请输入" v-model="query.groupName" clearable></el-input>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getTableData">查询</el-button>
      </div>
    </div>
    <base-title name="医生组列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addDoctorGroup">添加医生组</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" :loading="tableLoading" stripe>
      <el-table-column prop="groupName" label="医生组" align="center"></el-table-column>
      <el-table-column prop="memo" label="说明" align="center"></el-table-column>
      <el-table-column prop="number" label="医生数量" align="center">
        <template #default="{row}">{{ row | dis }}</template>
      </el-table-column>
      <el-table-column prop="addUser" label="添加人" align="center"></el-table-column>
      <el-table-column prop="addTime" label="添加时间" align="center"></el-table-column>
      <el-table-column prop="1" label="操作" align="center" width="370">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class=" opt-text" @click="doctorGroupDetails(row)">管理医生</span>
            <div class="line"></div>
            <span class="opt-text" @click="updateDoctorGroup(row)">修改</span>
            <div class="line"></div>
            <span class="opt-text text-danger" @click="deleteDoctorGroup(row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" background @size-change="getTableData" @current-change="getTableData" />
    <!-- 添加医生组 -->
    <el-dialog title="添加医生组" :visible.sync="dialogVisible" width="350px">
      <el-form ref="formDoctor" :model="doctorGroup" :rules="addDoctorRules" label-width="100px">
        <el-form-item label="医生组名：" prop="groupName">
          <el-input v-model="doctorGroup.groupName" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="说明：" prop="memo">
          <el-input v-model="doctorGroup.memo" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="validate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "system-doctorGroup",
  filters: {
    dis (row) {
      if (row.number === 0) {
        return "暂无医生";
      } else {
        return row.number + " 位";
      }
    }
  },
  data () {
    return {
      tableLoading: false,
      dialogVisible: false,
      doctorGroup: {
        groupName: "",
        memo: ""
      },
      tableData: [],
      // 查询：条件集合
      query: {},
      // 页码：参数集合
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      },
      addDoctorRules: {
        groupName: {
          required: true,
          message: "医生组名称不能为空"
        },
        memo: {
          required: true,
          message: "说明不能为空"
        }
      }
    };
  },
  watch: {
    dialogVisible (val) {
      if (!val) {
        // 重置表单
        this.$refs.formDoctor.resetFields();
        this.doctorGroup.groupName = "";
        this.doctorGroup.memo = "";
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.getTableData();
  },
  activated () {
    if (this.needQuery) {
      this.checkValidate1st();
    }
  },
  methods: {
    // 获取医生组参数
    getTableData () {
      let params = {
        ...this.query,
        orgID: this.userInfo.orgID,
        ...this.pageInfo
      };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_OUTSIDEDOC_LIST, { params })
        .then(res => {
          if (res.data) {
            this.tableData = res.data.datas;
            this.pageInfo = res.data.pageInfo;
          }
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 添加医生组
    addDoctorGroup () {
      this.doctorGroup.keyID=''
      this.dialogVisible = true;
    },
    // 验证表单
    validate () {
      if (this.screenLoading) {
        return;
      }
      this.$refs.formDoctor.validate(valid => {
        if (!valid) {
          return;
        }
        if (
          typeof this.doctorGroup.keyID !== "undefined" &&
          this.doctorGroup.keyID !== ""
        ) {
          this.confirmupdateDoctorGroup();
        } else {
          this.confirmAddDoctorGroup();
        }
      });
    },
    confirmAddDoctorGroup () {
      let _this = this;
      let data = {
        ...this.doctorGroup,
        orgID: this.userInfo.orgID,
        inOut: 0, // 院内院外 0:院外 1:院内
        addUser: this.userInfo.staffName
      };
      _this.$_http
        .post(_this.$_API.INTERFACE_POST_OUTSIDEDOC_ADD, data)
        .then(r => {
          if (r.code === 0) return;
          _this.getTableData();
          _this.dialogVisible = false;
          _this.$refs.formDoctor.resetFields();
        });
    },
    // 删除医生组
    deleteDoctorGroup (row) {
      let _this = this;
      this.$confirm("此操作将删除该医生组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            keyID: row.keyID,
            modifyUser: this.userInfo.staffName
          };
          _this.$_http
            .post(_this.$_API.INTERFACE_POST_OUTSIDEDOC_DEL, data)
            .then(r => {
              if (r.code === 0) return;
              _this.getTableData();
              _this.$_success("删除成功");
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 修改医生组
    updateDoctorGroup (row) {
      this.doctorGroup.groupName = row.groupName;
      this.doctorGroup.memo = row.memo;
      this.doctorGroup.keyID=row.keyID
      this.dialogVisible = true;
      
    },
    confirmupdateDoctorGroup () {
      let _this = this;
      let data = {
        keyID: _this.doctorGroup.keyID,
        groupName: _this.doctorGroup.groupName,
        memo: _this.doctorGroup.memo,
        inOut: 1, // 院内院外 0:院外 1:院内
        modifyUser: _this.userInfo.staffName
      };
      _this.$_http
        .post(_this.$_API.INTERFACE_POST_OUTSIDEDOC_MODIFY, data)
        .then(r => {
          if (r.code === 0) return;
          _this.getTableData();
          _this.dialogVisible = false;
          _this.$refs.formDoctor.resetFields();
        });
    },
    // 管理医生组
    doctorGroupDetails (row) {
      this.$router.push({
        name: "system-doctorGroupManager",
        params: {
          groupId: row.keyID,
          addUser: row.addUser,
          groupName: row.groupName
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.color-blue {
  color: #438bef;
  font-weight: 800;
}
.right-s {
  float: right;
  margin-right: 10px;
  margin-top: 20px;
}
</style>
