<template>
  <div class="app-container base-page">
    <base-title name="共享诊室管理"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
    </div>
    <el-table :data="tableData" :loading="tableLoading" stripe>
      <el-table-column prop="roomName" label="诊室" align="center"></el-table-column>
      <el-table-column prop="contactName" label="咨询联系人" align="center"></el-table-column>
      <el-table-column prop="contactPhone" label="咨询电话" align="center"></el-table-column>
      <el-table-column prop="addTime" label="添加时间" align="center">
        <template #default="{row}">
          {{ row.addTime | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="isClosed" label="状态" align="center">
        <template #default="{row}">
          {{ row.isClosed | formatStatus }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="270" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" v-if="row.isClosed" @click="isCloseHandle(row)">开放</span>
            <div class="line" v-if="row.isClosed"></div>
            <span class="text-danger opt-text" v-if="!row.isClosed" @click="isCloseHandle(row)">关闭</span>
            <div class="line" v-if="!row.isClosed"></div>
            <span class="opt-text" @click="edit(row)">修改</span>
            <span class="opt-text" @click="plan(row)">排期</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
const STATUS_LIST = ["开放预订中", "已关闭"];
const STATUS_HANDLE_LIST = ["开放", "关闭"];
export default {
  name: "room-manage",
  filters: {
    // 格式化状态
    formatStatus (val) {
      return STATUS_LIST[val] || "";
    }
  },
  data () {
    return {
      tableLoading: false,
      tableData: [],
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      }
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
    // 获取诊室列表数据，加载表格
    loadTable () {
      if (this.tableLoading) {
        return;
      }
      let bizInfo = {
        hospitalID: this.userInfo.orgID
      };
      let params = { ...this.pageInfo, ...bizInfo };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_SHARE_ROOM_LIST, {
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
    // 操作：点击【开放】/【关闭】按钮
    isCloseHandle (row) {
      if (!row || !row.keyID || row.isClosed === undefined) {
        this.dataError();
        return;
      }
      this.$confirm(
        `此操作将${STATUS_HANDLE_LIST[~~!row.isClosed]}该共享诊室，是否继续`,
        "提示",
        {
          type: "warning"
        }
      ).then(it => {
        this.toggleClose(row);
      });
    },
    // 开放/关闭诊室
    toggleClose (row) {
      if (this.tableLoading) {
        return;
      }
      let isClosed = ~~!row.isClosed;
      let isClosedName = "";
      if (isClosed === 1) {
        isClosedName = "已关闭";
      } else if (isClosed === 0) {
        isClosedName = "开放预订中";
      }
      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_SHARE_ROOM_CHANGE, {
          isClosed,
          keyID: row.keyID,
          isClosedName: isClosedName
        })
        .then(res => {
          if (!res.data) return;
          this.$_success(`${STATUS_HANDLE_LIST[isClosed]}该共享诊室成功`);
          this.tableLoading = false;
          this.loadTable();
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 操作：点击【添加】按钮
    add () {
      this.$router.push({
        name: "room-manage-edit",
        params: { keyID: "0", mode: "C" }
      });
    },
    // 操作：点击【修改】按钮
    edit (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "room-manage-edit",
        params: { keyID: row.keyID, mode: "E" }
      });
    },
    // 操作：点击【排期】按钮
    plan (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "room-manage-plan",
        params: { keyID: row.keyID, roomName: row.roomName }
      });
    }
  }
};
</script>
