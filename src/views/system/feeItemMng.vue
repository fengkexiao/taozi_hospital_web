<template>
  <div class="app-container base-page">
    <base-title name="项目列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addStandardProject">添加标准项目</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" stripe :loading="tableLoading">
      <el-table-column prop="standProjectName" label="标准项目" align="center"></el-table-column>
      <el-table-column prop="memo" label="说明" align="center"></el-table-column>
      <el-table-column prop="addUser" label="添加人" align="center"></el-table-column>
      <el-table-column prop="addTime" label="添加时间" align="center"></el-table-column>
      <el-table-column prop="1" label="操作" align="center" width="400">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class=" opt-text" @click="hospitalProjectMap(row)">医院项目映射</span>
            <div class="line"></div>
            <span class="text-danger opt-text" @click="deleteStandardProject(row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加标准项目 -->
    <el-dialog title="添加标准项目" :visible.sync="dialogVisible" width="50%">
      <el-table ref="multipleTable" :data="chargeItems" style="width: 100%" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" label="选择" align="center"></el-table-column>
        <el-table-column prop="dictName" label="标准项目" align="center"></el-table-column>
        <el-table-column prop="dictValue" label="说明" align="center"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "feeItemMng",
  data () {
    return {
      tableLoading: false,
      dialogVisible: false,
      doctorGroup: {
        groupName: "",
        memo: ""
      },
      // 添加的标准项目list
      selectedItem: [],
      tableData: [],
      // 页码：参数集合
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      },
      // 收费项目列表
      chargeItems: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.getChargeItems();
    this.getFeeItemProjectData();
  },
  activated () { },
  methods: {
    // 查询医院标准项目列表
    getFeeItemProjectData () {
      let params = {
        orgID: this.userInfo.orgID
      };
      // console.log("查询医院标准项目列表:params--------------", params);
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_STANDARD_PROJECT_LIST, { params })
        .then(res => {
          if (res.data) {
            this.tableData = res.data;
            // console.log("查询医院标准项目列表:res--------------", res);
          }
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 获取医院收费项目列表
    getChargeItems () {
      this.$_http
        .get(this.$_API.INTERFACE_SYS_DICT_QUERY_LIST, {
          params: {
            systemCode: "HOSPITAL",
            groupCode: "D_HOSPITAL_CHARGING_ITEM"
          }
        })
        .then(response => {
          if (!response.data) return;
          this.chargeItems = response.data;
          // console.log(
          //   "获取医院收费项目列表:chargeItems--------------",
          //   response.data
          // );
          this.$forceUpdate();
        });
    },
    // 添加标准项目
    addStandardProject () {
      this.dialogVisible = true;
      this.$refs.multipleTable.clearSelection();
    },
    handleSelectionChange (val) {
      this.selectedItem = val;
      // console.log(
      //   "添加标准项目:val--------------" + this.selectedItem);
    },
    // 选择标准项目
    save () {
      if (this.selectedItem.length === 0) {
        this.$message({
          message: "请至少选择一个标准项目",
          type: "warning"
        });
        return;
      }
      this.tableLoading = true;
      let selectTempArr = [];
      this.selectedItem.forEach(item => {
        let tempItem = {
          orgID: this.userInfo.orgID,
          addUser: this.userInfo.staffName,
          standProjectCode: item.dictCode,
          standProjectName: item.dictName,
          memo: item.dictValue
        };
        selectTempArr.push(tempItem);
      });
      let params = JSON.stringify(selectTempArr);
      // console.log("选择标准项目:selectTempArr--------------", params);
      this.$_http
        .post(
          this.$_API.INTERFACE_POST_STANDARD_PROJECT_ADD,
          // "http://10.0.0.37:6216/feeItemManage/addStand",
          params
        )
        .then(
          response => {
            // console.log(
            //   "选择标准项目:返回结果--------------",
            //   response.data
            // );
            this.tableLoading = false;
            this.dialogVisible = false;
            this.getFeeItemProjectData();
          },
          () => {
            this.tableLoading = false;
          }
        );
    },
    // 删除标准项目
    deleteStandardProject (row) {
      let _this = this;
      this.$confirm("是否删除标准项目?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            keyID: row.keyID
          };
          _this.$_http
            .post(_this.$_API.INTERFACE_POST_STANDARD_PROJECT_DELETE, data)
            .then(r => {
              if (r.code === 0) return;
              _this.getFeeItemProjectData();
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
    // 医院项目映射
    hospitalProjectMap (row) {
      this.$router.push({
        name: "hospitalProjectMap",
        params: {
          orgID: row.orgID,
          standProjectCode: row.standProjectCode,
          standProjectName: row.standProjectName,
          addUser: row.addUser
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
