<template>
  <div class="app-container base-page">
    <div>
      <base-title name="查询条件"></base-title>
      <div class="base-search_form">
        <div class="form-item">
          <span class="item-label">可见科室：</span>
          <el-select v-model="query.sectionID" placeholder="请选择" filterable clearable>
            <el-option v-for="(item,index) in sections" :key="index" :label="item.hospitalSectionName" :value="item.keyID"></el-option>
          </el-select>
        </div>
        <div class="form-item">
          <span class="item-label">可见医生：</span>
          <el-select v-model="query.doctorStaffID" placeholder="请选择" filterable clearable>
            <el-option v-for="(item,index) in staffList" :key="index" :label="item.staffName" :value="item.keyID">
            </el-option>
          </el-select>
        </div>
        <div class="form-item">
          <span class="item-label">作者：</span>
          <el-input placeholder="请输入" v-model="query.authorName" clearable></el-input>
        </div>
        <div class="form-item">
          <span class="item-label">状态：</span>
          <el-select v-model="query.isPublish" placeholder="请选择" filterable clearable>
            <el-option v-for="(item,index) in publishList" :key="index" :label="item.stateName" :value="item.isPublish">
            </el-option>
          </el-select>
        </div>
        <div class="form-item">
          <el-button type="primary" icon="el-icon-search" @click="getTableData()">查询</el-button>
        </div>
        <div class="form-item">
          <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
        </div>
      </div>
    </div>

    <base-title name="康复案例列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addInquiryCase()">添加</el-button>
    </div>

    <el-table :data="tableData" :loading="tableLoading" stripe>
      <el-table-column prop="sectionName" label="可见科室" align="center">
        <template #default="{row}">
          {{ row.sectionName | formatSection }}
        </template>
      </el-table-column>
      <el-table-column prop="doctorName" label="可见医生" align="center">
        <template #default="{row}">
          {{ row.doctorName | formatSection }}
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" align="center"></el-table-column>
      <el-table-column prop="contentSummary" label="摘要" align="center">
        <template #default="{row}">
          <p class="name">{{ row.contentSummary}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="publishDate" label="发布时间" align="center" width="155px">
        <template #default="{row}">
          {{ row.publishDate | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="isPublishName" label="状态" align="center"></el-table-column>
      <el-table-column prop="1" label="操作" align="center" width="340">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" v-if="row.isPublish === 0" @click="release(row,1,'发布')">发布</span>
            <span class="text-danger opt-text" v-else @click="release(row,0,'撤回')">撤回</span>
            <div class="line"></div>
            <span class="opt-text" @click="edit(row)">编辑</span>
            <div class="line"></div>
            <span class="text-danger opt-text" @click="delete1(row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" background @size-change="getTableData" @current-change="getTableData" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "content-tmcInquiryCase",
  filters: {
    formatSection (val) {
      if (val === "") {
        return "全部";
      }
      return val;
    }
  },
  props: {
    isLoad: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      query: {
        sectionID: "",
        doctorStaffID: "",
        authorName: "",
        isPublish: ""
      },
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      },
      tableLoading: false,
      tableData: [],
      dialogVisible: false,
      popHandling: false,
      sections: [],
      staffList: [],
      publishList: [
        { isPublish: "", stateName: "全部" },
        { isPublish: 0, stateName: "未发布" },
        { isPublish: 1, stateName: "已发布" }
      ]
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.getOrgSection();
    this.getStaffListByOrgID();
  },
  activated () {
    if (typeof this.isLoad !== "undefined" && this.isLoad !== "") {
      this.getTableData();
    }
  },
  methods: {
    resetSearchInfo () {
      this.query = {
        sectionID: "",
        doctorStaffID: "",
        authorName: "",
        isPublish: ""
      }
    },
    // 获取医院自定义科室
    getOrgSection () {
      this.$_http
        .get(this.$_API.INTERFACE_GET_SECTION_LIST, {
          params: {
            orgId: this.userInfo.orgID,
            disableStatus: 0
          }
        })
        .then(response => {
          if (!response.data) return;
          this.sections = response.data;
          let temp = {
            hospitalSectionName: "全部",
            keyID: ""
          };
          this.sections.splice(0, 0, temp);
        });
    },
    // 获取医院下所有的医生
    getStaffListByOrgID () {
      let params = {
        orgID: this.userInfo.orgID
      };
      this.$_http
        .get(this.$_API.INTERFACE_GET_HOSPITALSTAFF_GETSTAFFLISTBYORGID, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.staffList = res.data;
          let temp = {
            staffName: "全部",
            keyID: ""
          };
          this.staffList.splice(0, 0, temp);
        });
    },
    // 获取康复案例数据，加载表格
    getTableData () {
      let bizInfo = {
        orgID: this.userInfo.orgID
      };
      let params = { ...this.pageInfo, ...this.query, ...bizInfo };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_INQUIRYCASE_LISTBYCONDITION, {
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
    // 添加康复案例
    addInquiryCase () {
      // 跳转添加康复案例
      this.$router.push({
        name: "content-addInquiryCase",
        params: { isEdit: false }
      });
    },
    // 删除手记
    delete1 (row) {
      this.$confirm("确认要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            keyID: row.keyID
          };
          this.$_http
            .post(this.$_API.INTERFACE_GET_INQUIRYCASE_DELETE, params)
            .then(res => {
              if (!res.data) return;
              this.$_success("删除成功...");
              this.getTableData();
            });
        })
        .catch(() => { });
    },
    // 编辑康复案例
    edit (row) {
      this.$router.push({
        name: "content-addInquiryCase",
        params: { keyID: row.keyID, isEdit: true }
      });
    },
    // 发布康复案例
    release (row, is, name) {
      let params = {
        keyID: row.keyID,
        isPublish: is
      };
      this.$_http
        .post(this.$_API.INTERFACE_GET_INQUIRYCASE_ISPUBLISH, params)
        .then(res => {
          if (!res.data) return;
          this.$_success(name + "成功...");
          this.getTableData();
        });
    },
    // 预览
    preview (row) {
      if (row.detailUrl === "") {
        this.$_warning("请填写详情页地址...");
        return;
      }
      window.open(row.detailUrl);
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
