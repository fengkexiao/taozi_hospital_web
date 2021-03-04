<template>
  <el-dialog :visible.sync="recordVisible" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" width="80%">
    <div slot="title" class="dialog-title">
      <span>药品交易记录</span>
      <i class="el-icon-close" style="float: right;cursor: pointer" @click="closeFn"></i></div>
    <el-form inline>
      <el-form-item label="购药日期：">
        <el-date-picker v-model="dateRange" type="datetimerange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        <el-button type="primary" icon="el-icon-sold-out" @click="exportExel">导出记录</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" stripe >
      <el-table-column prop="addTime" label="日期" align="center"></el-table-column>
      <el-table-column prop="buyerName" label="客户名称" align="center"></el-table-column>
      <el-table-column prop="medicineAmount" label="购药数量" align="center"></el-table-column>
      <el-table-column prop="couponName" label="销售数量" align="center">
        <template slot-scope="scope">
          {{scope.row.medicineAmount - scope.row.couponAmount}}
        </template>
      </el-table-column>
      <el-table-column prop="couponAmount" label="赠药数量" align="center"></el-table-column>
      <!--            <el-table-column prop="isOver" label="当前库存数" align="center"></el-table-column>-->
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" v-if="pageInfo.totalRow" />
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "transactionRecords",
  props: {
    recordVisible: {
      type: Boolean,
      default: false
    },
    medicineID: {
      type: String,
      default: ''
    },
    rpMedicines: {
      default: () => {
        return [];
      }
    }
  },
  data () {
    return {
      dateRange: [],
      pageInfo: {
        totalRow: 0,
        pageSize: 10,
        pageIndex: 1
      },
      tableData: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      let params = {
        orgID: this.userInfo.orgID,
        medicineID: this.medicineID,
        pageSize: this.pageInfo.pageSize,
        pageIndex: this.pageInfo.pageIndex,
        startTime: this.dateRange && this.dateRange.length ? this.dateRange[0] : null,
        endTime: this.dateRange && this.dateRange.length ? this.dateRange[1] : null,
      };

      this.$_http({ url: this.$_API.API_STOCK_GETTRANSACTIONRECORDS, params: params, method: 'get' })
        .then(res => {
          if (res.success) {
            this.tableData = res.data.datas;
            this.pageInfo = res.data.pageInfo
          } else {
            this.tableData = [];
            this.$message.error(res.message || '药品交易记录列表查询失败！')
          }

        })
    },
    searchData () {
      this.pageInfo.pageIndex = 1
      this.initData()
    },
    loadTable () {
      this.initData()
    },
    closeFn () {
      this.$emit("closeFn");
    },
    reset () {
      this.dateRange = []
    },
    exportExel () {
      let params = {
        orgID: this.userInfo.orgID,
        medicineID: this.medicineID,
        // orgID: '19101017081245502880511001',//this.userInfo.orgID,
        // medicineID: '19101717554340603371103001',//this.medicineID,
        startTime: this.dateRange && this.dateRange.length ? this.dateRange[0] : null,
        endTime: this.dateRange && this.dateRange.length ? this.dateRange[1] : null,
      };

      this.$_http.get(this.$_API.API_STOCK_EXPORT, { params, responseType: 'blob' }).then(res => {
        // let blob = res.data;
        // let reader = new FileReader();
        // reader.readAsDataURL(blob);
        // reader.onload = function(e) {
        //   let a = document.createElement('a');
        //   let fileName = res.headers["content-disposition"] ? res.headers["content-disposition"].split(';')[1].split('=')[1] : new Date().getTime() + '.xls'
        //   a.download = decodeURIComponent(fileName)//解码
        //   a.href = e.target.result;
        //   document.body.appendChild(a);
        //   a.click();
        //   document.body.removeChild(a);
        // }
        let fileName = res.headers["content-disposition"] ? res.headers["content-disposition"].split(';')[1].split('=')[1] : new Date().getTime() + '.xls'
        let blob = new Blob([res.data], { type: 'application/octet-stream' });
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName);
        } else {
          let link = document.createElement('a');
          link.style.display = 'none';
          // link.target='_blank';
          link.href = window.URL.createObjectURL(blob);
          link.download = decodeURIComponent(fileName);
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
        }
      })
    }
  }
};
</script>

<style scoped lang="scss">
ul,
li {
  list-style: none;
}
.dialog-title {
  padding-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
  text-align: left;
  font-size: 18px;
  color: rgba(42, 44, 48, 1);
  font-weight: normal;
}
/deep/ label {
  font-weight: normal;
}
</style>
