<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">类型：</span>
        <el-select v-model="query.bizCode" placeholder="请选择" clearable filterable>
          <el-option v-for="(item,index) in articleOptionList" :key="index" :label="item.title" :value="item.keyID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">是否展示：</span>
        <el-select v-model="query.isShow" placeholder="请选择" clearable filterable>
          <el-option v-for="(item,index) in showOptionList" :key="index" :label="item.name" :value="item.keyID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">是否回复：</span>
        <el-select v-model="query.isReply" placeholder="请选择" clearable filterable>
          <el-option v-for="(item,index) in replyOptionList" :key="index" :label="item.name" :value="item.keyID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">是否已读：</span>
        <el-select v-model="query.isRead" placeholder="请选择" clearable filterable>
          <el-option v-for="(item,index) in readOptionList" :key="index" :label="item.name" :value="item.keyID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">评论时间：</span>
        <el-date-picker v-model="reviewTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <span class="item-label">ID：</span>
        <el-input v-model="query.objectID" style="width:200px;" placeholder="请输入" type="text" clearable></el-input>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getTableData()">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
      </div>
    </div>

    <base-title name="评论列表"></base-title>
    <el-table :data="tableData" :loading="tableLoading" stripe class="mt24">
      <!-- 类型 -->
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <div>{{formatType(scope.row.bizCode)}}</div>
        </template>
      </el-table-column>
      <!-- objectID -->
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          <div class="content-box">
            <div style="text-align:left">{{scope.row.objectID}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" align="center" show-overflow-tooltip></el-table-column>
      <!-- 头像和昵称 -->
      <el-table-column label="头像/昵称" align="center">
        <template slot-scope="scope">
          <img style="width: 34px;height: 34px;border-radius: 34px;" :src="scope.row.commentUserFace.length > 0 ? scope.row.commentUserFace : avatar" alt />
          <div>{{scope.row.commentUserName}}</div>
        </template>
      </el-table-column>
      <!-- 摘要内容和添加时间 -->
      <el-table-column label="摘要" prop="commentContent" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="添加时间" prop="addTime" align="center"></el-table-column>
      <!-- 回复内容和添加时间 -->
      <el-table-column label="回复内容" prop="replyContent" align="center" show-overflow-tooltip>
      </el-table-column>
      <!-- 操作按钮 -->
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <div style="color:orange" v-if="scope.row.isReply == 1">已回复</div>
          <span v-if="scope.row.isReply == 1">{{scope.row.commentReply}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="1" label="操作" align="center" width="270">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="isReadAction(row)">{{row.isRead == 0 ? "未读" : "已读"}}</span>
            <div class="line"></div>
            <span class="opt-text" @click="isShowAction(row)">{{row.isShow == 0 ? '展示' : "不展示"}}</span>
            <div class="line"></div>
            <span class="opt-text" @click="isTopAction(row)">{{row.isTop == 0 ? '置顶' : "不置顶"}}</span>
            <div class="line"></div>
            <span class="opt-text" @click="isReplyAction(row)">回复</span>
            <div class="line"></div>
            <span class="text-danger opt-text" @click="isDeleteAction(row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination background v-model="pageInfo" @size-change="getTableData" @current-change="getTableData" />
    <el-dialog title="回复" :visible.sync="dialogVisible" width="400px">
      <el-form>
        <el-form-item align="center">
          <el-input type="textarea" v-model="replyInfo.replyContent" :rows="5" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="publishAction">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from "../../filters";
import { mapGetters } from "vuex";
import avatar from "@/assets/image/default-avatar.png";
export default {
  name: "content-tmcArticleComment",
  data () {
    return {
      replyInfo: {
        keyID: "",
        replyContent: ""
      },
      avatar,
      tableData: [],
      tableLoading: false,
      dialogVisible: false,
      doctorList: [],
      articleOptionList: [
        { title: "全部", keyID: "" },
        { title: "文章评论", keyID: "article" },
        { title: "康复案例", keyID: "inquiryCase" }
      ],
      showOptionList: [
        { name: "全部", keyID: "" },
        { name: "展示", keyID: 1 },
        { name: "不展示", keyID: 0 }
      ],
      replyOptionList: [
        { name: "全部", keyID: "" },
        { name: "已回复", keyID: 1 },
        { name: "未回复", keyID: 0 }
      ],
      readOptionList: [
        { name: "全部", keyID: "" },
        { name: "未读", keyID: 0 },
        { name: "已读", keyID: 1 }
      ],
      query: {
        // articleID: "",
        isShow: "",
        isReply: "",
        isRead: "",
        objectID: ""
      },
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      },
      reviewTime: [],
      articleTitleParams: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  watch: {
    dialogVisible (val) {
      if (!val) {
        this.replyInfo = {
          keyID: "",
          commentReply: ""
        };
      }
    }
  },
  created () {
    this.getTableData();
  },
  methods: {
    formatType (id) {
      if (id === "article") {
        return "文章评论";
      } else if (id === "inquiryCase") {
        return "康复案例";
      }
    },
    // 查询评论列表
    getTableData () {
      if (this.tableLoading) {
        return;
      }
      let systemCode = "";
      let bizCode = "";
      let deptID = "";
      let userID = "";
      let objectID = "";
      let startTime = formatDate(this.reviewTime[0]);
      let endTime = formatDate(this.reviewTime[1]);
      let params = {
        systemCode,
        bizCode,
        deptID,
        userID,
        objectID,
        ...this.pageInfo,
        ...this.query,
        orgID: this.userInfo.orgID,
        startTime,
        endTime
      };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_ARTICLECOMMENAT_LIST, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.pageInfo = res.data.pageInfo;
          if (res.data.datas.length === 0) {
            this.tableData = res.data.datas;
            return false;
          }
          this.queryTitles(res.data.datas);
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 获取titles
    queryTitles (list) {
      var queryObjs = [];
      list.forEach(element => {
        let obj = {
          keyID: element.objectID,
          bizCode: element.bizCode
        };
        queryObjs.push(obj);
      });
      if (queryObjs.length === 0) {
        return false;
      }
      this.$_http
        .post(
          this.$_API.INTERFACE_GET_ARTICLETITLE_BY_KEYID,
          JSON.stringify(queryObjs)
        )
        .then(res => {
          if (res.data) {
            list.forEach(element2 => {
              res.data.forEach(element1 => {
                if (element2.objectID === element1.keyID) {
                  let subs = element1.title.substring(0, 20);
                  if (element1.title.length > 20) {
                    subs = subs + "...";
                  }
                  if (subs.length > 0) {
                    if (element1.bizCode === "inquiryCase") {
                      subs = "摘要：" + subs;
                    } else {
                      subs = "标题：" + subs;
                    }
                  }
                  element2.title = subs;
                }
              });
            });

            this.tableData = list;
          }
        });
    },
    // 重置查询条件
    resetSearchInfo () {
      this.query = {};
      this.reviewTime = [];
    },
    // 点击未读/已读按钮
    isReadAction (row) {
      if (row.isRead === 1) {
        return false
      }
      if (this.tableLoading) {
        return;
      }
      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_POST_ARTICLECOMMENAT_READ, {
          keyID: row.keyID
        })
        .then(
          response => {
            this.tableLoading = false;
            if (!response.data) return;
            row.isRead = 1;
          },
          () => {
            this.tableLoading = false;
          }
        );
    },
    /**
     * 展示/不展示请求
     */
    isShowAction (row) {
      if (this.tableLoading) {
        return;
      }
      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_POST_ARTICLECOMMENAT_UPDATESHOW, {
          keyID: row.keyID,
          isShow: row.isShow === 0 ? 1 : 0
        })
        .then(
          response => {
            this.tableLoading = false;
            if (!response.data) return;
            row.isShow = 1;
            this.getTableData();
          },
          () => {
            this.tableLoading = false;
          }
        );
    },
    /**
     * 文章置顶/不置顶 INTERFACE_GET_ARTICLECOMMENAT_UPDATETOP
     */
    isTopAction (row) {
      if (this.tableLoading) {
        return;
      }
      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_POST_ARTICLECOMMENAT_UPDATETOP, {
          keyID: row.keyID,
          isTop: row.isTop === 0 ? 1 : 0
        })
        .then(
          response => {
            this.tableLoading = false;
            if (!response.data) return;
            row.isTop = 1;
            this.getTableData();
          },
          () => {
            this.tableLoading = false;
          }
        );
    },
    /**
     * 评论删除
     */
    isDeleteAction (row) {
      this.$confirm("此操作将删除该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.tableLoading) {
            return;
          }
          this.tableLoading = true;
          this.$_http
            .post(this.$_API.INTERFACE_POST_ARTICLECOMMENAT_DEL, {
              keyID: row.keyID
            })
            .then(
              response => {
                this.tableLoading = false;
                this.getTableData();
              },
              () => {
                this.tableLoading = false;
              }
            );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /**
     * 文章回复
     */
    isReplyAction (row) {
      if (row.isReply === 1) {
        return false
      }
      this.dialogVisible = true;
      this.replyInfo.keyID = row.keyID;
    },
    /**
     * 回复评论
     */
    publishAction () {
      if (this.tableLoading) {
        return;
      }
      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_POST_ARTICLECOMMENAT_REPLY, this.replyInfo)
        .then(
          response => {
            this.dialogVisible = false;
            this.tableLoading = false;
            if (!response.data) return;
            this.getTableData();
          },
          () => {
            this.tableLoading = false;
          }
        );
    }
  }
};
</script>

<style lang="scss" scoped>
#patientFormDiv {
  .el-form--inline .el-form-item {
    margin-right: 0;
  }
  .el-form-item__label {
    /*input输入框标题文本调整*/
    text-align: left;
  }
  .el-form-item__content {
    .el-input,
    .el-textarea {
      /*input输入框宽度调整*/
      width: 300px;
      max-width: 300px;
    }
    .el-select {
      /*div的宽度调整有效*/
      width: 300px;
      max-width: none;
      .el-input {
        /*选择框的宽度调整《无效果。。。》*/
        width: 300px;
        max-width: none;
      }
    }
  }
  .inputUnit {
    position: absolute;
    right: 10px;
    top: 0;
    color: #868888;
  }

  .content-box {
    display: inline;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
