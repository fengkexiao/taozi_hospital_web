<template>
  <div class="app-container base-page">
    <base-title name="风湿药品管理"></base-title>
    <el-table :data="tableData" :loading="tableLoading" stripe class="mt24">
      <el-table-column prop="medicineName" label="药品名称" align="center"></el-table-column>
      <el-table-column prop="price" label="价格（元）" align="center">
        <template #default="{row}">
          {{row.price | formatStatus}}
        </template>
      </el-table-column>
      <el-table-column prop="profitRatio" label="医生劳务费（%）" align="center"></el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="cancelOrders(row)">修改</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getMedicine" @current-change="getMedicine" />
    <!--    修改药品界面-->
    <span id="cancelBody">
      <el-dialog :title="modify.medicineName" :visible.sync="dialogVisible" width="590px">
        <el-form :model="modify" label-width="150px" class="treatOrderDelivery_el-form">
          <el-form-item label="价格：">
            <el-input v-model="modify.price" placeholder="请输入" clearable/> &emsp;元
          </el-form-item>
          <el-form-item label="医生服务费：">
            <el-input v-model="modify.profitRatio" placeholder="请输入" clearable/>&emsp; %
          </el-form-item>
        </el-form>
        <div class="treatOrderDelivery_div1">
          <el-button @click="cancelOrdersNo()">取消</el-button>
          <el-button class="sure" type="primary" @click="updateBtn()">确定</el-button>
        </div>
      </el-dialog>
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  filters: {
    // 格式化金额
    formatStatus (val) {
      return (val / 100).toFixed(2);
    }
  },
  // 药品管理
  name: "medicine",
  data () {
    return {
      modify: {},
      tableData: [],
      tableLoading: false,
      // 操作： 修改药品
      dialogVisible: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      }
    };
  },
  // 获取当前登录对象
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.getMedicine();
  },
  methods: {
    getMedicine () {
      // 获取药品列表  加载数据
      let params = { ...this.pageInfo };
      this.tableLoading = true;
      let requests = this.$_http.get(this.$_API.API_HOU_MEDICINE_LIST, {
        params
      });
      requests
        .then(res => {
          if (!res.data) return;
          this.tableData = res.data.datas;
          this.pageInfo = res.data.pageInfo;
        })
        .finally(it => {
          this.tableLoading = false;
        });
      return requests;
    },
    // 操作：修改
    cancelOrders (row) {
      if (!row || !row.keyID) {
        this.dataError();
        return;
      }
      this.dialogVisible = true;
      this.modify = { ...row };
      this.modify.price = (row.price / 100).toFixed(2);
    },
    // 操作：取消
    cancelOrdersNo () {
      this.dialogVisible = false;
    },
    // 修改药品 医生服务费
    updateBtn () {
      let info = {
        price: parseFloat(this.modify.price) * 100,
        profitRatio: this.modify.profitRatio,
        keyID: this.modify.keyID,
        modifyUser: this.userInfo.keyID
      };
      let params = { ...info };
      this.$_http.post(this.$_API.API_HOU_MEDICINE_MODIFY, params).then(res => {
        this.$_success("修改药品成功");
        // 加载表格
        this.dialogVisible = false;
        this.getMedicine();
      });
    }
  }
};
</script>

<style scoped>
.treatOrderDelivery_div1 {
  margin-left: 30%;
}
</style>
