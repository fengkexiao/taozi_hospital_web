<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">员工姓名：</span>
        <el-input v-model="query.staffName" placeholder="请输入" clearable />
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
    <base-title name="员工列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
    </div>
    <el-table :data="tableData" stripe :loading="tableLoading">
      <el-table-column prop="staffName" label="员工姓名" align="center"></el-table-column>
      <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="addTime" label="创建时间" align="center">
        <template #default="{row}">
          {{ row.addTime | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="loginTime" label="最后登录时间" align="center">
        <template #default="{row}">
          {{ row.loginTime | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="isDisable" label="状态" align="center">
        <template #default="{row}">
          {{ row.isDisable | formatStatus }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="edit(row)" v-if="!row.isDisable">修改</span>
            <span class="opt-text" @click="disableBtn(row)" v-if="row.isDisable">启用</span>
            <span class="text-danger opt-text" @click="disableBtn(row)" v-else>禁用</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const STATUS_LIST = ["启用", "禁用"];
export default {
  name: "user-staff",
  filters: {
    // 格式化状态
    formatStatus (val) {
      return STATUS_LIST[val] || "";
    }
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
      tableData: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    // 加载表格
    this.loadTable();
  },
  activated () {
    this.loadTable();
  },
  methods: {
    resetSearchInfo () {
      this.query = {
        staffName: '',
        phone: ''
      }
    },
    // 获取员工列表数据，加载表格
    loadTable () {
      if (this.tableLoading) {
        return;
      }
      let bizInfo = {
        orgID: this.userInfo.orgID,
        staffTypeID: -1
      };
      let params = { ...this.pageInfo, ...this.query, ...bizInfo };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_USER_STAFF_LIST, {
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
      this.$router.push({
        name: "user-staff-edit",
        params: { keyID: "0", mode: "C" }
      });
    },
    // 操作：点击【修改】按钮
    edit (row) {
      if (!row || !row.phone) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "user-staff-edit",
        params: { keyID: row.keyID, mode: "E" }
      });
    },
    // 操作：点击【启用】/【禁用】按钮
    disableBtn (row) {
      if (!row || !row.keyID || row.isDisable === undefined) {
        this.dataError();
        return;
      }
      this.$confirm(
        `此操作将${STATUS_LIST[~~!row.isDisable]}该员工账号，是否继续`,
        "提示",
        {
          type: "warning"
        }
      ).then(it => {
        this.disable(row);
      });
    },
    // 启用/禁用员工
    disable (row) {
      if (this.tableLoading) {
        return;
      }
      let isDisable = ~~!row.isDisable;
      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_USER_STAFF_DISABLE, {
          isDisable,
          staffID: row.keyID
        })
        .then(res => {
          this.$_success(`${STATUS_LIST[isDisable]}该员工账号成功`);
          this.tableLoading = false;
          this.loadTable();
        })
        .finally(it => {
          this.tableLoading = false;
        });
    }
  }
};
</script>
