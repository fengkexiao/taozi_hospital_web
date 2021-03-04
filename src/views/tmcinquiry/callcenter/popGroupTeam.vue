<template>
  <div class="app-container base-page">
    <base-title :name="groupName"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">IP医生姓名：</span>
        <el-input v-model.trim="query.assistantName" placeholder="请输入" maxlength="10" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">所属医生：</span>
        <el-input v-model.trim="query.doctorName" placeholder="请输入" maxlength="10" clearable></el-input>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getPopGroupTeamListFun">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfoFun">重置</el-button>
      </div>
    </div>
    <base-title name="成员列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addGroupFun()">添加</el-button>
    </div>
    <el-table :data="popGroupTeamListData" stripe class="mt24" :loading="tableLoading">
      <el-table-column prop="assistantName" label="IP医生姓名" align="center"></el-table-column>
      <el-table-column prop="assistantPhone" label="电话号码" align="center"></el-table-column>
      <el-table-column prop="doctorName" label="所属医生" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="text-danger opt-text" @click="deletePopTeamOneFun(row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getPopGroupTeamListFun" @current-change="getPopGroupTeamListFun" />
    <el-dialog title="新增推广组成员" :visible.sync="dialogAddTeam" width="70%" :center="false" :close-on-click-modal="false" :before-close="dialogClose">
      <div>
        <el-form :model="dialogQuery" inline>
          <el-form-item prop="assistantName" label="IP医生姓名：">
            <el-input v-model.trim="dialogQuery.assistantName" maxlength="10" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item prop="doctorName" label="所属医生：">
            <el-input v-model.trim="dialogQuery.doctorName" maxlength="10" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getDialogListDataFun">查询</el-button>
            <el-button icon="el-icon-refresh" @click="resetDialogSearchInfoFun">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dialogListData" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="assistantName" label="IP医生姓名" align="center"></el-table-column>
          <el-table-column prop="assistantStaffInfo.phone" label="手机号码" align="center"></el-table-column>
          <el-table-column prop="doctorName" label="所属医生" align="center"></el-table-column>
        </el-table>
        <base-pagination v-model="dialogPageInfo" @size-change="getDialogListDataFun" @current-change="getDialogListDataFun" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="addGroupTeamSureFun">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    groupID: {
      type: String,
      required: true
    },
    groupName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      query: {
        assistantName: "",
        doctorName: ""
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 0
      }, // 页码：参数集合
      tableLoading: false,
      popGroupTeamListData: [],
      dialogAddTeam: false, // 弹窗是否显示
      dialogQuery: {
        assistantName: "",
        doctorName: "",
        assistantPhone: ""
      }, // 弹窗 参数
      dialogPageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 0
      }, // 弹窗 页码：参数集合
      dialogListData: [],
      selectionRowData: [] // 弹窗 选中的数据
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.getPopGroupTeamListFun(); // 查询：某推广组的成员列表
  },
  methods: {
    // 操作：重置搜索条件
    resetSearchInfoFun () {
      this.query = {
        assistantName: "",
        doctorName: ""
      };
      this.pageInfo = {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 0
      };
    },
    // 查询：某推广组的成员列表
    getPopGroupTeamListFun () {
      if (this.tableLoading) {
        return;
      }
      this.tableLoading = true;
      let params = {
        ...this.query,
        pageIndex: this.pageInfo.pageIndex,
        pageSize: this.pageInfo.pageSize,
        orgID: this.userInfo.orgID,
        adGroupID: this.groupID
      };
      this.$_http.post(this.$_API.INTERFACE_GET_PROMOTE_GROUP_ASSISTANT, params).then(res => {
        this.popGroupTeamListData = res.data.datas || [];
        this.pageInfo = res.data.pageInfo;
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    // 操作：新增 打开弹窗
    addGroupFun () {
      this.dialogAddTeam = true;
      this.getDialogListDataFun(); // 查询：弹窗的数据列表
    },
    // 操作：移除
    deletePopTeamOneFun (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      if (this.tableLoading) {
        return;
      }
      this.$confirm("是否确认移除该IP医生？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.tableLoading = true;
        let params = {
          adGroupID: row.adGroupID,
          orgID: row.orgID,
          keyID: row.keyID
        };
        this.$_http.post(this.$_API.INTERFACE_POST_PROMOTE_GROUP_TEAM_DELETE, { ...params }).then(res => {
          this.tableLoading = false;
          this.getPopGroupTeamListFun();
          this.$message({
            type: "success",
            message: "移除IP医生成功"
          });
        }).catch(() => {
          this.tableLoading = false;
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
    },
    // 查询：弹窗的数据列表
    getDialogListDataFun () {
      if (this.tableLoading) {
        return;
      }
      this.tableLoading = true;
      this.selectionRowData = [];
      let params = {
        ...this.dialogQuery,
        orgID: this.userInfo.orgID,
        pageIndex: this.dialogPageInfo.pageIndex,
        pageSize: this.dialogPageInfo.pageSize
      };
      this.$_http.post(this.$_API.INTERFACE_GET_PROMOTE_GROUP_OTHER_ASSISTANT, params).then(res => {
        this.dialogListData = res.data.datas;
        this.dialogPageInfo = res.data.pageInfo;
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    // 操作：弹窗 选择行
    handleSelectionChange (val) {
      this.selectionRowData = val;
    },
    // 操作：弹窗 保存
    addGroupTeamSureFun () {
      if (this.tableLoading) {
        return;
      }
      if (!this.selectionRowData.length) {
        this.$message({
          type: "warning",
          message: "请先选择添加人员"
        });
        return;
      }
      this.tableLoading = true;
      let params = [];
      this.selectionRowData.forEach(item => {
        let obj = {
          orgID: this.userInfo.orgID,
          adGroupID: this.groupID,
          doctorStaffID: item.doctorStaffID,
          doctorName: item.doctorName,
          assistantStaffID: item.assistantStaffID,
          assistantName: item.assistantName,
          assistantPhone: item.assistantStaffInfo.phone
        };
        params.push(obj);
      });
      this.$_http.post(this.$_API.INTERFACE_POST_PROMOTE_GROUP_TEAM_ADD, params).then(res => {
        this.dialogClose(); // 关闭弹窗
        this.tableLoading = false;
        this.pageInfo = {
          pageIndex: 1,
          pageSize: 10,
          totalRow: 0,
          totalPage: 0
        };
        this.getPopGroupTeamListFun(); // 重新查询列表数据
        this.$message({
          type: "success",
          message: "添加成功"
        });
      }).catch(() => {
        this.tableLoading = false;
      });
    },
    // 操作：弹窗 重置搜索条件
    resetDialogSearchInfoFun () {
      this.dialogQuery = {
        assistantName: "",
        doctorName: "",
        assistantPhone: ""
      };
      this.dialogPageInfo = {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 0
      };
    },
    // 操作：弹窗 关闭弹窗
    dialogClose () {
      this.resetDialogSearchInfoFun(); // 弹窗 重置搜索条件
      this.dialogListData = [];
      this.dialogAddTeam = false;
    },
    // 错误处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.getPopGroupTeamListFun();
    }
  }
};
</script>

<style scoped>
.groupNameTxt {
  margin-bottom: 20px;
  color: #555658;
}
</style>
