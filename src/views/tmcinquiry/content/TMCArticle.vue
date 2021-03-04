<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">可见科室：</span>
        <el-select v-model="query.departmentCanSee" placeholder="请选择" filterable clearable>
          <el-option v-for="(item,index) in sections" :key="index" :label="item.hospitalSectionName" :value="item.keyID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">可见医生：</span>
        <el-select v-model="query.doctorCanSee" placeholder="请选择" filterable clearable>
          <el-option v-for="(item,index) in staffList" :key="index" :label="item.staffName" :value="item.keyID">
          </el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">文章分类：</span>
        <el-select v-model="query.classifyID" placeholder="请选择" filterable clearable>
          <el-option v-for="(item,index) in classification" :key="index" :label="item.classifyName" :value="item.keyID"></el-option>
        </el-select>
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

    <base-title name="文章列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addArticle">添加</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" :loading="tableLoading" stripe>
      <el-table-column prop="departmentCanSeeName" label="可见科室" align="center">
        <template #default="{row}">
          {{ row.departmentCanSeeName | formatSection }}
        </template>
      </el-table-column>
      <el-table-column prop="doctorCanSeeName" label="可见医生" align="center">
        <template #default="{row}">
          {{ row.doctorCanSeeName | formatSection }}
        </template>
      </el-table-column>
      <el-table-column prop="classifyName" label="文章分类" align="center"></el-table-column>
      <el-table-column prop="title" label="标题" align="center" width="370">
        <template #default="{row}">
          <p class="name">{{ row.title}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="publishDate" label="发布时间" align="center" width="100">
        <template #default="{row}">
          {{ row.publishDate | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="isPublishName" label="状态" align="center"></el-table-column>
      <el-table-column prop="1" label="操作" align="center" width="370">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" v-if="row.isTop === 0" @click="placement(row,1,'置顶')">置顶</span>
            <span class="text-danger opt-text" v-else @click="placement(row,0,'取消置顶')">取消置顶</span>
            <div class="line" v-if="row.isPublish === 0"></div>
            <span class="opt-text" v-if="row.isPublish === 0" @click="release(row,1,'发布','已发布')">发布</span>
            <div class="line"></div>
            <span class=" opt-text" @click="edit(row)">编辑</span>
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
  name: "content-tmcArticle",
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
        departmentCanSee: "",
        doctorCanSee: "",
        classifyID: "",
        tag: "",
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
      ],
      classification: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.getOrgSection();
    this.getStaffListByOrgID();
    this.getPharse();
  },
  activated () {
    if (typeof this.isLoad !== "undefined" && this.isLoad !== "") {
      this.getTableData();
    }
  },
  methods: {
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
    // 获取科室信息
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
    // 获取文章分类
    getPharse () {
      let params = {
        classifyType: 2,
        orgID: this.userInfo.orgID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_TOOL_CLASSIFY_LIST, {
          params
        })
        .then(res => {
          if (!res.data) {
            return false;
          }
          this.classification = res.data;
        });
    },
    getTableData () {
      let bizData = {
        orgID: this.userInfo.orgID
      };
      let params = { ...this.pageInfo, ...this.query, ...bizData };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_ARTICLE_LIST, {
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
    // 重置搜索信息
    resetSearchInfo () {
      this.query = {
        departmentCanSee: "",
        doctorCanSee: "",
        classifyID: "",
        tag: "",
        isPublish: ""
      }
    },
    addArticle () {
      // 跳转添加文章界面
      this.$router.push({
        name: "content-addArticle",
        params: { isEdit: false }
      });
    },
    delete1 (row) {
      this.$confirm("确认要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            keyID: row.keyID
          };
          this.$_http
            .post(this.$_API.INTERFACE_GET_ARTICLE_DELETE, data)
            .then(res => {
              if (!res.data) return;
              this.$_success("删除成功...");
              this.getTableData();
            });
        })
        .catch(() => { });
    },
    // 预览
    preview (row) {
      if (typeof row.articleUrl === "undefined" || row.articleUrl === "") {
        this.$_warning("请填写详情页地址...");
        return;
      }
      window.open(row.articleUrl);
    },
    // 置顶
    placement (row, is, name) {
      let params = {
        keyID: row.keyID,
        isTop: is
      };
      this.$_http
        .post(this.$_API.INTERFACE_GET_ARTICLE_UPDATETOP, params)
        .then(res => {
          if (!res.data) return;
          this.$_success(name + "成功...");
          this.getTableData();
        });
    },
    // 发布
    release (row, is, name, isPublishName) {
      let params = {
        keyID: row.keyID,
        isPublish: is,
        isPublishName: isPublishName
      };
      this.$_http
        .post(this.$_API.INTERFACE_GET_ARTICLE_PUBLISHARTICLEOPTION, params)
        .then(res => {
          if (!res.data) return;
          this.$_success(name + "成功...");
          this.getTableData();
        });
    },
    // 跳转修改
    edit (row) {
      this.$router.push({
        name: "content-addArticle",
        params: { keyID: row.keyID, isEdit: true }
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
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
