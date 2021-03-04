<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">优惠券名称：</span>
        <el-input v-model="searchKey.couponName" maxlength="20" clearable placeholder="请输入"></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">活动时间：</span>
        <el-date-picker style="width: 100%" v-model="searchKey.dateRangeTime" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="initData">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </div>

    <base-title name="优惠券列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addCoupon">新增</el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="couponName" label="优惠券名称" align="center"></el-table-column>
      <el-table-column prop="startTime" label="活动开始时间" align="center"></el-table-column>
      <el-table-column prop="endTime" label="活动结束时间" align="center"></el-table-column>
      <el-table-column prop="keyID" label="活动详情" align="center">
        <template slot-scope="scope">
          <div class="option-btn_group">
            <span class="opt-text" @click="viewCoupon(scope.row)">预览</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="keyID" label="操作" align="center">
        <template slot-scope="scope">
          <div class="option-btn_group">
            <span class="opt-text" @click="editCoupon(scope.row)">修改活动</span>
            <div class="line"></div>
            <span class="text-danger opt-text" @click="del(scope.row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import addEditDialog from "./aEtLk";
import { mapGetters } from "vuex";

export default {
  name: "coupon",
  components: {
    addEditDialog,
  },
  data () {
    return {
      tableLoading: false,
      tableData: [],
      searchKey: {
        couponName: "",
        dateRangeTime: [],
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.initData();
  },
  activated () {
    this.initData();
  },
  methods: {
    initData () {
      this.tableData = [];
      let params = {
        orgID: this.userInfo.orgID,
        couponName: this.searchKey.couponName || null,
        startTime: this.searchKey.dateRangeTime && this.searchKey.dateRangeTime.length ? this.searchKey.dateRangeTime[0] : null,
        endTime: this.searchKey.dateRangeTime && this.searchKey.dateRangeTime.length ? this.searchKey.dateRangeTime[1] : null
      };

      this.$_http({ url: this.$_API.API_COUPON_LIST, params: params, method: "get" })
        .then(res => {
          if (res.success) {
            res.data.forEach(item => {
              item.startTime = item.startTime.slice(0, item.startTime.length - 2);
              item.endTime = item.endTime.slice(0, item.endTime.length - 2);
            });
            this.tableData = res.data;
          } else {
            this.$message.error(res.message || "优惠券列表查询失败！");
          }
        });
    },
    addCoupon () {
      this.$router.push("/activity/add");
    },
    editCoupon (row) {
      this.$router.push("/activity/edit/" + row.keyID);
    },
    viewCoupon (row) {
      this.$router.push("/activity/view/" + row.keyID);
    },
    del (row) {
      this.$confirm("此操作将删除该优惠券活动，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.delCoupon(row);
      }).catch(() => {

      });
    },
    delCoupon (row) {
      let _data = {
        orgID: this.userInfo.orgID,
        keyID: row.keyID
      };
      this.$_http.post(this.$_API.API_COUPON_DELETE, _data)
        .then(res => {
          if (res.data) {
            this.$message.success("删除成功！");
            this.initData();
          } else {
            this.$message.error("删除失败！");
          }
        });
    },
    reset () {
      this.searchKey = {
        couponName: "",
        dateRangeTime: [],
      };
    }
  }
};
</script>

<style scoped lang="scss">
</style>
