<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">坐席工号：</span>
        <el-input placeholder="请输入" v-model="query.thirdSeatAgent" form-type="phone" maxlength="10" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">人员：</span>
        <el-input placeholder="请输入" v-model="query.staffName" maxlength="10" clearable></el-input>
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
      <el-button type="primary" icon="el-icon-plus" @click="add()">添加</el-button>
    </div>
    <el-table :data="tableData" :loading="tableLoading" stripe>
      <el-table-column prop="thirdSeatAgent" label="坐席工号" align="center"></el-table-column>
      <el-table-column prop="phoneNum" label="坐席号码" align="center"></el-table-column>
      <el-table-column prop="thirdSeatID" label="坐席ID" align="center"></el-table-column>
      <el-table-column prop="thirdSeatName" label="坐席名" align="center"></el-table-column>
      <el-table-column prop="staffName" label="人员" align="center">
      </el-table-column>
      <el-table-column prop="1" label="操作" align="center" width="340">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="edit(row)">修改</span>
            <span class="text-danger opt-text" @click="delete1(row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getTableData" @current-change="getTableData" />
    <personAllotment ref="addmedicine" :propdata="formData" :visible="visible" title="" @save="save" @back="back" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import personAllotment from "./personAllotment";
export default {
  name: "seatAllocation",
  components: {
    personAllotment
  },
  inject: ["close"],
  filters: {},
  props: {
    keyID: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      query: {
        thirdSeatAgent: "",
        staffName: ""
      },
      formData: {},
      pageInfo: {
        pageSize: 10,
        pageIndex: 1
      },
      tableLoading: false,
      visible: false,
      tableData: []
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
        thirdSeatAgent: "",
        staffName: ""
      };
      // this.$refs.queryData.resetFields();
    },
    // 获取数据，加载表格
    getTableData () {
      let bizInfo = {
        orgSkillGroupID: this.keyID
      };
      let params = { ...this.pageInfo, ...this.query, ...bizInfo };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_7MOOR_GET_GROUP_FINDPAGE, {
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
    // 添加
    add () {
      this.visible = true;
      this.formData = {
        thirdSeatAgent: "",
        phoneNum: "",
        thirdSeatID: "",
        thirdSeatName: ""
      };
      this.$refs.addmedicine.getDoctorList();
    },
    back () {
      this.visible = false;
    },
    validate () {
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
            .post(this.$_API.INTERFACE_7MOOR_ORGSEAT_DELETE, params)
            .then(res => {
              if (!res.data) return;
              this.$_success("删除成功...");
              this.getTableData();
            });
        })
        .catch(() => { });
    },
    // 修改
    edit (row) {
      this.visible = true;
      let objs = JSON.parse(JSON.stringify(row));
      this.formData = objs;
      this.$refs.addmedicine.getDoctorListFun(row.staffName);
    },
    // 查看详情
    handleEdits () {
    },
    cancel () {
      this.close().then(() => {
        this.$router.push({
          name: "callSeat"
        });
      });
    },
    save (data) {
      let params = {
        orgID: this.userInfo.orgID,
        thirdSeatAgent: data.thirdSeatAgent,
        phoneNum: data.phoneNum,
        staffID: data.staffID,
        jobType: data.jobType,
        orgSkillGroupID: this.keyID,
        keyID: data.keyID,
        thirdSeatID: data.thirdSeatID,
        thirdSeatName: data.thirdSeatName,
        staffName: data.staffName
      };
      this.$_http
        .post(this.$_API.INTERFACE_7MOOR_ORGSEAT_ADD, params)
        .then(res => {
          if (!res.data) return;
          this.visible = false;
          this.$_success("操作成功...");
          this.getTableData();
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
</style>
