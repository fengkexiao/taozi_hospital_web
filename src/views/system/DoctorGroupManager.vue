<template>
  <div class="app-container base-page">
    <base-title :name="'医生组'+groupName"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">姓名：</span>
        <el-input placeholder="请输入" v-model="query.doctorName" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">手机号：</span>
        <el-input placeholder="请输入" v-model.trim="query.phone"  label-name="联系电话" maxlength="11" />
      </div>
      <div class="form-item">
        <el-button icon="el-icon-search" type="primary" @click="queryDoctorListByCondition">查询</el-button>
      </div>
      <div class="form-item">
        <el-button @click="reset" icon="el-icon-refresh">重置</el-button>
      </div>
    </div>
    <base-title name="医生列表"></base-title>
    <div class="base-list_option">
      <el-button icon="el-icon-plus" type="primary" @click="addDoctor">添加医生</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" :loading="tableLoading" stripe>
      <el-table-column prop="doctorName" label="姓名" align="center"></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
      <el-table-column prop="workPlace" label="工作单位" align="center"></el-table-column>
      <el-table-column prop="sectionName" label="科室" align="center"></el-table-column>
      <el-table-column prop="titleName" label="职称" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="text-danger opt-text" @click="remove(row)">移除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="queryDoctorList" @current-change="queryDoctorList" />

    <add-doctor :visible="dialogVisible" :groupID="groupId" :addUser="addUser" @selectedDoctor="selectedDoctor" @handleClose="handleClose" @cancleOption="cancleOption"></add-doctor>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AddDoctor from "./components/AddDoctor";
export default {
  name: "system-doctorGroupManager",
  inject: ["close"],
  filters: {},
  computed: {
    ...mapGetters(["userInfo"])
  },
  components: {
    AddDoctor
  },
  props: {
    groupId: {
      type: String,
      required: true
    },
    addUser: {
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
      dialogVisible: false,
      tableLoading: false,
      tableData: [],
      query: {
        doctorName: "",
        phone: ""
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      }
    };
  },
  created () {
    this.queryDoctorList();
  },
  activated () { },
  methods: {
    reset () {
      this.tableData = [];
      this.query = {
        doctorName: "",
        phone: ""
      };
      this.pageInfo = {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      };
      this.queryDoctorList();
    },
    queryDoctorListByCondition () {
      this.queryDoctorList();
    },
    queryDoctorList () {
      this.tableLoading = true;
      let params = {
        groupId: this.groupId,
        ...this.pageInfo,
        ...this.query
      };
      this.$_http
        .get(this.$_API.INTERFACE_GET_OUTSIDEDOC_SEARCHDOC, {
          params
        })
        .then(
          response => {
            this.tableLoading = false;
            if (!response.data) return;
            if (response.data) {
              this.tableData = response.data.datas;
              this.pageInfo = response.data.pageInfo;
            }
            // console.log("获取医生列表--------", response.data);
          },
          () => {
            this.tableLoading = false;
          }
        );
    },
    addDoctor () {
      this.dialogVisible = true;
    },
    handleClose () {
      this.dialogVisible = false;
    },
    cancleOption () {
      this.dialogVisible = false;
    },
    selectedDoctor (item) {
      this.dialogVisible = false;
      this.reset();
    },
    remove (row) {
      let _this = this;
      this.tableLoading = true;
      this.$confirm("是否删除该医生?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            keyID: row.keyID
          };

          _this.$_http
            .post(_this.$_API.INTERFACE_POST_OUTSIDEDOC_DELDOC, data)
            .then(response => {
              this.tableLoading = false;
              if (response.code === 0) return;
              // console.log("删除医生组医生:response--------------", response);
              if (response.success === true) {
                this.reset();
                _this.$_success("删除成功");
              }
            });
        })
        .catch(() => {
          this.tableLoading = false;
          _this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    cancleAction () {
      this.close().then(() => {
        this.$router.go(-1);
      });
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
