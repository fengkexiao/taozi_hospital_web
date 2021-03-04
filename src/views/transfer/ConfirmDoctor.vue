<template>
  <div class="app-container base-page">
    <base-title :name="'转诊医生分润规则组'+ruleName"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addDoctorGroup">添加医生组</el-button>
    </div>
    <base-title name="医生组列表"></base-title>
    <el-table :data="tableData" style="width: 100%" class="mt24" :loading="tableLoading" stripe>
      <el-table-column prop="groupName" label="医生组" align="center"></el-table-column>
      <el-table-column prop="number" label="医生数量" align="center"></el-table-column>
      <el-table-column prop="memo" label="说明" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="detail(row)">详情</span>
            <div class="line"></div>
            <span class="text-danger  opt-text" @click="remove(row)">移除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getTableData" @current-change="getTableData" />

    <add-doctor-group :visible="dialogVisible" @selectedDoctorGroup="selectedDoctorGroup" @handleClose="handleClose" @cancleOption="cancleOption"></add-doctor-group>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import addDoctorGroup from "./components/addDoctorGroup";
export default {
  name: "confirmDoctor",
  filters: {},
  computed: {
    ...mapGetters(["userInfo"])
  },
  components: {
    addDoctorGroup
  },
  props: {
    keyID: {
      type: String,
      default () {
        return "";
      }
    },
    ruleName: {
      type: String,
      default () {
        return "";
      }
    },
    orgID: {
      type: String,
      default () {
        return "";
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      tableLoading: false,
      tableData: [],
      // 页码：参数集合
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      }
    };
  },
  // 页面渲染之前触发 只会触发一次
  created () {
    this.getTableData();
  },
  // 进入页面就会触发
  activated () { },
  methods: {
    // 详情
    detail (row) {
      this.$router.push({
        name: "system-doctorGroupManager",
        params: {
          groupId: row.groupID,
          addUser: this.userInfo.staffName,
          groupName: row.groupName
        }
      });
    },
    // 从规则中移除医生组
    remove (row) {
      this.$confirm("此操作将删除该医生组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableLoading = true;
          let data = {
            keyID: row.keyID
          };
          this.$_http
            .post(
              this.$_API.INTERFACE_TRANSFER_POST_SHARERULEGROUP_RULEDOCTORREMOVE,
              data
            )
            .then(
              r => {
                this.tableLoading = false;
                if (r.code === 0) return;
                this.getTableData();
                this.$_success("移除成功");
              },
              () => {
                this.tableLoading = true;
              }
            );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 获取当前规则下医生组参数
    getTableData () {
      let params = {
        keyID: this.keyID,
        ...this.pageInfo
      };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_TRANSFER_POST_SHARERULEGROUP_RULEDOCTORLIST, {
          params
        })
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
    // 添加医生组到规则里
    addDoctorGroup () {
      this.dialogVisible = true;
    },
    handleClose () {
      this.dialogVisible = false;
    },
    cancleOption () {
      this.dialogVisible = false;
    },
    selectedDoctorGroup (item) {
      this.dialogVisible = false;
      this.tableLoading = true;
      let tempArr = [{ keyID: item.keyID, orgID: this.orgID }];
      let _this = this;
      let params = {
        "ruleID": this.keyID,
        "doctorGroupList": tempArr
      };
      _this.$_http
        .post(
          _this.$_API.INTERFACE_TRANSFER_POST_SHARERULEGROUP_RULEDOCTORADD,
          JSON.stringify(params)
        )
        .then(
          r => {
            this.tableLoading = false;
            if (r.code === 0) return;
            _this.getTableData();
          },
          () => {
            this.tableLoading = false;
          }
        );
    }
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
