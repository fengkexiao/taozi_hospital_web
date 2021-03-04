<template>
  <div class="app-container base-page" id="detailBody">
    <el-dialog :visible.sync="visible" width="70%" :before-close="handleClose">
      <base-title name="添加医生"></base-title>
      <div class="base-search_form">
        <div class="form-item">
          <span class="item-label">姓名：</span>
          <el-input placeholder="请输入(必填)" v-model="query.doctorName" clearable></el-input>
        </div>
        <div class="form-item">
          <span class="item-label">手机号： </span>
          <el-input placeholder="请输入(必填)" v-model.trim="query.phone" form-type="phone" maxlength="11" />
        </div>
        <div class="form-item">
          <el-button type="primary" icon="el-icon-search" @click="queryDoctorListByCondition">查询</el-button>
        </div>
        <div class="form-item">
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </div>
      </div>

      <el-table ref="multipleTable" :data="tableData" style="width: 100%" stripe :loading="tableLoading" tooltip-effect="dark" @select="userSelect" @select-all="userSelectAll" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="doctorName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="workPlace" label="工作单位" align="center"></el-table-column>
        <el-table-column prop="sectionName" label="科室" align="center"></el-table-column>
        <el-table-column prop="titleName" label="职称" align="center"></el-table-column>
      </el-table>
      <base-pagination v-model="pageInfo" @size-change="queryDoctorList" @current-change="queryDoctorList" />
      <span class="footer-box">
        <el-button @click="cancleOption">取 消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: {
    // 控制显示
    visible: {
      type: Boolean,
      default () {
        return false;
      }
    },
    groupID: {
      type: String,
      default () {
        return "";
      }
    },
    addUser: {
      type: String,
      default () {
        return "";
      }
    }
  },
  data () {
    return {
      tableLoading: false,
      selectedItem: null,
      tableData: [],
      query: {
        doctorName: "",
        phone: ""
      },
      // 页码：参数集合
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      }
    };
  },
  created () { },
  activated () { },
  watch: {},
  methods: {
    // 重置
    reset () {
      // 清空条件数据
      this.query = { doctorName: "", phone: "" };
      // 还原分页数据
      this.pageInfo = {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      };
      // 清空选择数据
      this.userSelectAll();
      // 清空列表数据
      this.tableData = [];
    },
    queryDoctorListByCondition () {
      if (!this.query.doctorName) {
        this.$message({
          message: "请输入姓名",
          type: "warning"
        });
        return;
      }
      if (!this.query.phone) {
        this.$message({
          message: "请输入手机号",
          type: "warning"
        });
        return;
      }
      this.queryDoctorList();
    },

    queryDoctorList () {
      this.tableLoading = true;
      let params = {
        ...this.pageInfo,
        ...this.query
      };
      this.$_http
        .get(this.$_API.INTERFACE_GET_DOCTORUSER_DOCTORLIST, { params })
        .then(
          response => {
            this.tableLoading = false;
            if (!response.data) return;
            if (response.data) {
              this.tableData = response.data.datas;
              this.pageInfo = response.data.pageInfo;
            }

            if (response.data.length === 0) {
              if (!this.query.phone) {
                this.$message({
                  message: "未查询到结果",
                  type: "warning"
                });
              }
            }
          },
          () => {
            this.tableLoading = false;
          }
        );
    },
    // 关闭界面
    handleClose () {
      this.$emit("handleClose");
    },
    cancleOption () {
      this.$emit("cancleOption");
    },
    // 选择item
    save () {
      if (!this.selectedItem) {
        this.$message({
          message: "请选择医生",
          type: "warning"
        });
        return;
      }
      this.tableLoading = true;
      let params = {
        orgID: this.userInfo.orgID,
        doctorID: this.selectedItem.keyID,
        groupID: this.groupID,
        addUser: this.addUser
      };
      this.$_http
        .post(this.$_API.INTERFACE_POST_OUTSIDEDOC_ADDDOC, params)
        .then(
          response => {
            this.tableLoading = false;
            this.reset();
            this.$emit("selectedDoctor");
          },
          () => {
            this.tableLoading = false;
          }
        );
    },
    userSelectAll () {
      this.$refs.multipleTable.clearSelection();
      this.selectedItem = null;
    },
    userSelect (selection, row) {
      this.$refs.multipleTable.clearSelection();
      if (selection.length === 0) {
        return;
      }
      this.$refs.multipleTable.toggleRowSelection(row, true);
      this.selectedItem = row;
    },
    handleSelectionChange (val) {
      if (val.length === 0) {
        this.selectedItem = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#detailBody {
  .footer {
    padding-left: 300px;
  }
  .footer-box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
/deep/.el-table__header .el-table-column--selection .cell .el-checkbox {
  display: none;
}
/deep/.el-table__header .el-table-column--selection .cell:before {
  content: "选择";
}
</style>
