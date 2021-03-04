<template>
  <div class="app-container base-page">
    <textarea id="inputDis" value="" style="opacity: 0;position: absolute;left: 0;top:0;" />
    <base-title name="推广组管理"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addGroupFun()">添加</el-button>
    </div>
    <el-table :data="promoteGroupListData" :loading="tableLoading" stripe>
      <el-table-column prop="groupName" label="推广组名" align="center"></el-table-column>
      <el-table-column prop="channel" label="渠道" align="center"></el-table-column>
      <el-table-column prop="adUrl" label="推广链接" align="center"></el-table-column>
      <el-table-column label="操作" width="400" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="updateGroupFun(row)">修改</span>
            <span class="text-danger opt-text" @click="deleteGroupFun(row)">删除</span>
            <span class="opt-text" @click="editGroupTeamFun(row)">管理成员</span>
            <span class="opt-text" @click="copyUrlFun(row)">复制链接</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogGroupTitle" :visible.sync="dialogGroup" width="400px" :center="false" :close-on-click-modal="false" :before-close="dialogGroupClose">
      <div>
        <el-form class="dialogForm" :model="dialogGroupData" :rules="formGroupDialogRules" ref="formGroupDialog" inline>
          <el-form-item prop="groupName" label="推广组名：" label-width="120px">
            <el-input v-model.trim="dialogGroupData.groupName" maxlength="20" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="channel" label="渠道：" label-width="120px">
            <el-input v-model.trim="dialogGroupData.channel" maxlength="20" clearable placeholder="请输入" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupClose">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateSureFun">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data () {
    return {
      tableLoading: false,
      searchState: false,
      promoteGroupListData: [],
      dialogGroup: false, // 是否显示弹窗
      dialogGroupTitle: "新增推广组", // 弹窗标题名
      dialogGroupData: {}, // 弹窗的列表数据
      formGroupDialogRules: {
        groupName: {
          required: true,
          message: "请输入推广组名"
        },
        channel: {
          required: true,
          message: "请输入渠道"
        }
      } // 弹窗表单规则
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.getPromoteGroupListFun(); // 操作：查询推广分组列表
  },
  activated () {
    if (this.searchState) {
      this.getPromoteGroupListFun(); // 操作：查询推广分组列表
    }
  },
  methods: {
    // 操作：查询推广分组列表
    getPromoteGroupListFun () {
      if (this.tableLoading) {
        return;
      }
      this.tableLoading = true;
      let params = {
        orgID: this.userInfo.orgID
      };
      this.$_http.get(this.$_API.INTERFACE_GET_PROMOTE_GROUP_LIST, { params }).then(res => {
        this.promoteGroupListData = res.data || [];
      }).finally(() => {
        this.tableLoading = false;
        this.searchState = true;
      });
    },
    // 操作：添加推广组
    addGroupFun () {
      this.dialogGroupTitle = "新增推广组";
      this.dialogGroupData = {
        orgID: this.userInfo.orgID
      };
      this.dialogGroup = true;
    },
    // 操作：修改
    updateGroupFun (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.dialogGroupTitle = "修改推广组";
      this.dialogGroupData = {
        keyID: row.keyID,
        groupName: row.groupName,
        channel: row.channel
      };
      this.dialogGroup = true;
    },
    // 操作：确定保存推广组信息
    addOrUpdateSureFun () {
      this.$refs.formGroupDialog.validate(valid => {
        // 检查表单：医生信息
        if (!valid || this.tableLoading) {
          return;
        }
        this.tableLoading = true;
        let params = {
          ...this.dialogGroupData
        };
        let API = "";
        if (this.dialogGroupTitle === "修改推广组") {
          console.log("修改推广组");
          API = this.$_API.INTERFACE_POST_PROMOTE_GROUP_UPDATE;
        } else {
          console.log("新增推广组");
          API = this.$_API.INTERFACE_POST_PROMOTE_GROUP_ADD;
        }
        this.$_http.post(API, params).then(res => {
          this.dialogGroupClose(); // 关闭弹窗
          this.tableLoading = false;
          this.getPromoteGroupListFun(); // 重新查询列表数据
          this.$message({
            type: "success",
            message: this.dialogGroupTitle + "成功"
          });
        }).catch(() => {
          this.tableLoading = false;
        });
      });
    },
    // 操作：关闭弹窗 修改添加推广组
    dialogGroupClose () {
      this.dialogGroupData = {};
      this.$refs.formGroupDialog.resetFields();
      this.dialogGroup = false;
    },
    // 操作：管理成员
    editGroupTeamFun (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "pop-group-team",
        params: { groupID: row.keyID, groupName: row.groupName }
      });
    },
    // 操作：删除
    deleteGroupFun (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      if (this.tableLoading) {
        return;
      }
      this.$confirm("是否确认删除该推广组？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.tableLoading = true;
        let params = {
          keyID: row.keyID
        };
        this.$_http.post(this.$_API.INTERFACE_POST_PROMOTE_GROUP_DELETE, params).then(res => {
          this.tableLoading = false;
          this.getPromoteGroupListFun();
          this.$message({
            type: "success",
            message: "删除推广组成功"
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
    // 操作：复制链接
    copyUrlFun (row) {
      if (!row.adUrl) {
        this.$message.error("推广链接不存在，无法复制");
        return;
      }
      console.log(row)
      let input = document.getElementById("inputDis");
      input.value = row.adUrl; // 修改文本框的内容
      input.select(); // 选中文本，select()方法只对input和textarea生效
      document.execCommand("copy"); // 执行浏览器复制命令
      this.$message({
        type: "success",
        message: "复制成功"
      });
    },
    // 提醒：表格数据错误时的处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.getPromoteGroupListFun();
    }
  }
};
</script>

<style lang="scss" scoped>
.dialogForm {
  .el-input .el-input__inner {
    width: 240px;
  }
}
</style>
