<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">医生姓名：</span>
        <el-input placeholder="请输入" v-model="query.doctorName" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">状态：</span>
        <el-select v-model="query.groupStatus" placeholder="请选择" filterable clearable>
          <el-option v-for="item in stateOptions" :key="item.groupStatus" :label="item.groupStatusName" :value="item.groupStatus"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getAssistantGroupList">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
      </div>
    </div>

    <base-title name="IP医生列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addDoctorGroup()">添加分组</el-button>
    </div>
    <el-table :data="assisitantGroupList" stripe style="width: 100%" :loading="tableLoading">
      <el-table-column prop="doctorName" label="负责医生" align="center"></el-table-column>
      <el-table-column prop="memo" label="组名称备注" align="center"></el-table-column>
      <el-table-column prop="addTime" label="创建时间" align="center">
        <template #default="{row}">
          {{ row.addTime | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="groupStatus" label="状态" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.groupStatus==0 ? "禁用" : "启用"}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div class="option-btn_group">
            <span class="opt-text" @click="modifyDoctor(scope.row)">编辑</span>
            <div class="line"></div>
            <span class="text-danger opt-text" v-if="scope.row.groupStatus ==1" @click="disableStaff(scope.row.keyID,'0')">禁用</span>
            <span class="opt-text" v-else @click="disableStaff(scope.row.keyID,'1')">启用</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="page" @size-change="getAssistantGroupList" @current-change="getAssistantGroupList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "tmcPatientLevel",
  filters: {},
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      assisitantGroupList: [],
      query: {
        doctorName: "",
        groupStatus: ""
      },
      // 查询：状态下拉集合
      stateOptions: [
        { groupStatus: "", groupStatusName: "全部" },
        { groupStatus: 0, groupStatusName: "禁用" },
        { groupStatus: 1, groupStatusName: "启用" }
      ],
      state: "",
      dialogVisible: false,
      popHandling: false,
      tableLoading: false,
      formData: {},
      page: {
        // 分页参数
        pageIndex: 1,
        pageSize: 10
      }
    };
  },
  activated () {
    // this.getAssistantGroupList();
  },
  methods: {
    getAssistantGroupList () {
      if (this.tableLoading) {
        return;
      }
      let params = {
        doctorName: this.query.doctorName,
        groupStatus: this.query.groupStatus,
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize,
        orgID: this.userInfo.orgID
      };
      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_TMC_GET_ASSISTANT_GROUP_LIST, params)
        .then(response => {
          if (!response.data) return;
          this.assisitantGroupList = response.data.datas;
          this.page = response.data.pageInfo;
          // console.log(this.assisitantGroupList, 12121);
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    searchList () {
      this.page.pageIndex = 1;
      this.getAssistantGroupList();
    },
    handleSizeChange (val) {
      this.page.PageSize = val;
      this.getAssistantGroupList();
    },
    handleCurrentChange (val) {
      this.page.pageIndex = val;
      this.getAssistantGroupList();
    },
    // 启用禁用
    disableStaff (keyID, groupStatus) {
      let msg = "";
      if (groupStatus === "1") {
        msg = "您确定要启用吗？";
      } else {
        msg = "您确定要禁用吗？";
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            keyID: keyID,
            groupStatus: groupStatus,
            modifyUser: this.userInfo.keyID
          };
          // console.log(params);
          this.$_http
            .post(this.$_API.INTERFACE_TMC_POST_ASSISTANT_GROUP_DISABLE, params)
            .then(response => {
              this.$_success("操作成功");
              this.getAssistantGroupList();
            });
        })
        .catch(() => {
        });
    },
    // 重置
    resetSearchInfo () {
      this.query = {
        doctorName: "",
        groupStatus: ""
      };
    },
    addDoctorGroup () {
      this.$router.push({
        name: "assisGroupEdit",
        params: { keyID: "0", mode: "C" }
      });
    },
    modifyDoctor (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "assisGroupEdit",
        params: { keyID: row.keyID, mode: "E" }
      });
      // console.log(row.keyID);
    },
    // 提醒：表格数据错误时的处理
    dataError () {
      this.$_warning("数据出错了，正在重新获取数据");
      this.getAssistantGroupList();
    }
  },
  created () {
    this.getAssistantGroupList();
    // console.log(this.userInfo);
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
