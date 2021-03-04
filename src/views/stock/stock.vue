<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">品名：</span>
        <el-input v-model="searchKey.medicienName" maxlength="20" placeholder="请输入" clearable></el-input>
      </div>

      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </div>

    <base-title name="库存管理列表"></base-title>
    <el-table :data="tableData" stripe class="mt24">
      <el-table-column prop="medicineName" label="品名" align="center"></el-table-column>
      <el-table-column prop="productSpec" label="规格" align="center"></el-table-column>
      <el-table-column prop="productUnit" label="单位" align="center"></el-table-column>
      <el-table-column prop="inventory" label="库存数量" align="center">
        <template slot-scope="scope">
          <span :class="{red:scope.row.warningInventory>scope.row.inventory}">{{scope.row.inventory}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价" align="center">
        <template slot-scope="scope">
          {{scope.row.price ? (scope.row.price/100).toFixed(2) : 0}}
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="含税金额" align="center">
        <template slot-scope="scope">
          {{scope.row.amount ? (scope.row.amount/100).toFixed(2) : 0}}
        </template>
      </el-table-column>
      <el-table-column prop="supplier" label="供应商名称" align="center"></el-table-column>
      <el-table-column prop="warningInventory" label="预警数量" align="center">
        <template slot-scope="scope">
          <span class="pointer" style="color: #409EFF;" @click="showWarning(scope.row)">{{scope.row.warningInventory}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="keyID" label="操作" align="center">
        <template slot-scope="scope">
          <div class="option-btn_group">
            <span class="opt-text" @click="showRecord(scope.row)">交易记录
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" v-if="pageInfo.totalRow" />
    <transactionRecords :recordVisible="recordVisible" v-if="recordVisible" @closeFn="closeFn" :medicineID="medicineID">
    </transactionRecords>
    <warnStock :warningStockVisible="warningStockVisible" v-if="warningStockVisible" @upDateData="upDateData" @closeFn="closeFn" :warnOpts="warnOpts" :medicineID="medicineID" :keyID="keyID">
    </warnStock>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import transactionRecords from "./transactionRecords";
import warnStock from "./warnStock";

export default {
  name: "tmcStock",
  components: {
    transactionRecords,
    warnStock
  },
  data () {
    return {
      keyID: "",
      medicineID: "",
      warnOpts: {},
      warningStockVisible: false,
      recordVisible: false,
      tableLoading: false,
      tableData: [],
      searchKey: {
        medicienName: ""
      },
      pageInfo: {
        totalRow: 0,
        pageSize: 20,
        pageIndex: 1
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
    loadTable () {
      this.initData();
    },
    searchData () {
      this.pageInfo.pageIndex = 1;
      this.initData();
    },
    initData () {
      let params = {
        orgID: this.userInfo.orgID,
        medicineName: this.searchKey.medicienName || null,
        pageSize: this.pageInfo.pageSize,
        pageIndex: this.pageInfo.pageIndex
      };
      this.$_http({ url: this.$_API.INTERFACE_STOCK_LIST, params: params, method: "get" })
        .then(res => {
          if (res.success) {
            this.tableData = res.data.datas;
            this.pageInfo = res.data.pageInfo || 10;
          } else {
            this.tableData = [];
            this.$message.error(res.message || "药品列表查询失败！");
          }
        });
    },
    showWarning (row) {
      this.keyID = row.keyID;
      this.medicineID = row.medicineID;
      let arr = row.phone.split(","), newArr = [];
      if (row.phone) {
        arr.forEach(item => {
          let obj = {
            phone: item
          };
          newArr.push(obj);
        });
      }
      this.warnOpts = {
        isWarning: row.isWarning,
        warningInventory: row.warningInventory,
        phone: newArr
      };
      this.warningStockVisible = true;
    },
    showRecord (row) {
      this.medicineID = row.medicineID;
      this.recordVisible = true;
    },
    upDateData () {
      this.initData();
      this.closeFn();
    },
    closeFn () {
      this.warningStockVisible = false;
      this.recordVisible = false;
      this.medicineID = "";
      this.keyID = "";
    },
    reset () {
      this.searchKey = {
        medicienName: ""
      };
    }
  }
};
</script>

<style scoped lang="scss">
.red {
  color: red;
}
</style>
