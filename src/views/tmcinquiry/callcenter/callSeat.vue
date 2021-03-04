<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">坐席组名：</span>
        <el-input placeholder="请输入" v-model="query.thirdGroupName" maxlength="15" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">类型：</span>
        <el-select v-model="query.thirdGroupType" placeholder="请选择" filterable clearable>
          <el-option v-for="(item,index) in jobTypes" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getTableData">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
      </div>
    </div>

    <base-title name="坐席组列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addSeat()">添加</el-button>
    </div>
    <el-table :data="tableData" :loading="tableLoading" stripe>
      <el-table-column prop="thirdGroupID" label="ID" align="center"></el-table-column>
      <el-table-column prop="thirdGroupName" label="坐席组名" align="center"></el-table-column>
      <el-table-column prop="phoneNums" label="分配号码" align="center">
        <template slot-scope="scope">
          <li v-for="(item, index) in scope.row.phoneNums" :key="index">
            <span>{{item.phoneNum}}</span>
          </li>
          <!-- {{scope.row.phoneNums}} -->
        </template>
      </el-table-column>
      <el-table-column prop="thirdGroupType" label="类型" align="center">
        <template #default="{row}">{{ row.thirdGroupType | formatSection }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="340">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="editGroup(row)">修改</span>
            <span class="opt-text" @click="editSeat(row)">管理坐席</span>
            <span class="opt-text text-danger" @click="delete1(row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <addGroup ref="addmedicine" :visible.sync="dialogVisible" :popHandling="popHandling" :propdata="formData" title="坐席组" @save="save" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import addGroup from "./addGroup";
export default {
  name: "callSeat",
  components: {
    addGroup
  },
  filters: {
    formatSection (val) {
      if (val === 0) {
        return "呼入/呼出";
      } else if (val === 1) {
        return "仅呼入";
      } else if (val === 2) {
        return "仅呼出";
      }
    }
  },
  props: {
    isEdit: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      query: {
        thirdGroupType: "",
        thirdGroupName: ""
      },
      formData: {},
      tableLoading: false,
      dialogVisible: false,
      popHandling: false,
      tableData: [],
      jobTypes: [
        { value: 0, label: "呼入/呼出" },
        { value: 1, label: "仅呼入" },
        { value: 2, label: "仅呼出" }
      ],
      phoneList: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.getTableData();
  },
  activated () {
  },
  methods: {
    resetSearchInfo () {
      this.query = {
        thirdGroupType: "",
        thirdGroupName: ""
      };
    },
    // 获取数据，加载表格
    getTableData () {
      let bizInfo = {
        orgID: this.userInfo.orgID
      };
      let params = { ...this.query, ...bizInfo };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_7MOOR_GET_GROUPLIST, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.tableData = res.data;
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 添加
    addSeat () {
      this.dialogVisible = true;
      this.formData = {
        thirdGroupID: "",
        thirdGroupName: "",
        keyID: "",
        thirdGroupType: "",
        phoneNums: []
      };
    },
    save (data) {
      let params = {
        orgID: this.userInfo.orgID,
        keyID: data.keyID,
        thirdGroupName: data.thirdGroupName,
        thirdGroupID: data.thirdGroupID,
        phoneNums: data.phoneNums,
        thirdGroupType: data.thirdGroupType
      };
      this.$_http
        .post(this.$_API.INTERFACE_7MOOR_ADD_GROUP, params)
        .then(res => {
          if (!res.data) return;
          this.dialogVisible = false;
          this.$_success("操作成功...");
          this.getTableData();
          this.$refs.addmedicine.back();
        });
    },
    editGroup (data) {
      this.formData = {};
      this.dialogVisible = true;
      let objs = JSON.parse(JSON.stringify(data));
      this.formData = objs;
    },
    // 删除
    delete1 (row) {
      this.$confirm("您确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            keyID: row.keyID
          };
          this.$_http
            .post(this.$_API.INTERFACE_7MOOR_DELETE_GROUP, params)
            .then(res => {
              if (!res.data) return;
              this.$_success("删除成功...");
              this.getTableData();
            });
        })
        .catch(() => { });
    },
    // 管理坐席
    editSeat (row) {
      this.$router.push({
        name: "seatAllocation",
        params: { keyID: row.keyID }
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
.name {
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
* {
  list-style-type: none;
}
</style>
