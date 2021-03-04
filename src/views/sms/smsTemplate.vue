<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">模板名称：</span>
        <el-input placeholder="请输入" v-model="query.templateName" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">模板类型：</span>
        <el-select v-model="query.templateType" placeholder="请选择" clearable filterable>
          <el-option v-for="(item,index) in staffList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">模板状态：</span>
        <el-select v-model="query.reviewStatus" placeholder="请选择" clearable filterable>
          <el-option v-for="(item,index) in publishList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getTableData()">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
      </div>
    </div>

    <base-title name="模板列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addInquiryCase()">添加</el-button>
    </div>

    <el-table :data="tableData" :loading="tableLoading" stripe>
      <el-table-column prop="templateName" label="模板名称" align="center"></el-table-column>
      <el-table-column prop="templateType" label="模板类型" align="center">
        <template #default="{row}">{{ row.templateType | formatSection }}</template>
      </el-table-column>
      <el-table-column prop="reviewStatus" label="模板状态" align="center">
        <template #default="{row}">{{ row.reviewStatus | formatState }}</template>
      </el-table-column>
      <el-table-column prop="1" label="操作" align="center" width="340">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="detail(row)">详情</span>
            <div class="line"></div>
            <span class="opt-text" @click="edit(row)">修改</span>
            <div class="line"></div>
            <span class="text-danger opt-text" @click="delete1(row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getTableData" @current-change="getTableData" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "smsTemplate",
  filters: {
    formatSection (val) {
      if (val === 1) {
        return "问候类";
      } else if (val === 2) {
        return "宣传类";
      } else if (val === 3) {
        return "复诊类";
      }
    },
    formatState (val) {
      if (val === 0) {
        return "未审核";
      } else if (val === 1) {
        return "已通过";
      } else if (val === 2) {
        return "未通过";
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
        reviewStatus: "",
        templateType: "",
        templateName: ""
      },
      pageInfo: {
        pageSize: 10,
        pageIndex: 1
      },
      tableLoading: false,
      tableData: [],
      staffList: [
        { value: "", label: "全部" },
        { value: 1, label: "问候类" },
        { value: 2, label: "宣传类" },
        { value: 3, label: "复诊类" }
      ],
      publishList: [
        { value: "", label: "全部" },
        { value: 0, label: "未审核" },
        { value: 1, label: "已通过" },
        { value: 2, label: "未通过" }
      ]
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.getTableData();
  },
  activated () {
    if (typeof this.isEdit !== "undefined" || this.isEdit !== "") {
      this.getTableData();
    }
  },
  methods: {
    resetSearchInfo () {
      this.query = {
        reviewStatus: "",
        templateType: "",
        templateName: ""
      };
      // this.$refs.queryData.resetFields();
    },
    // 获取数据，加载表格
    getTableData () {
      let bizInfo = {
        orgID: this.userInfo.orgID
      };
      let params = { ...this.pageInfo, ...this.query, ...bizInfo };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_SMS_TEMPLATE, {
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
    addInquiryCase () {
      this.$router.push({
        name: "addSmsTemplate"
      });
    },
    // 删除
    delete1 (row) {
      this.$confirm("您确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            keyID: row.keyID
          };
          this.$_http
            .post(this.$_API.INTERFACE_POST_SMS_TEMPLATE_DELETE, params)
            .then(res => {
              if (!res.data) return;
              this.$_success("删除成功...");
              this.getTableData();
            });
        })
        .catch(() => { });
    },
    // 编辑
    edit (row) {
      this.$router.push({
        name: "editSmsTemplate",
        params: { keyID: row.keyID, isDetail: "E" }
      });
    },
    // 查看详情
    detail (row) {
      this.$router.push({
        name: "detailSmsTemplate",
        params: { keyID: row.keyID, isDetail: "Y" }
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
