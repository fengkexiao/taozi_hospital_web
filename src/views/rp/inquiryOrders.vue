<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">接诊时间：</span>
        <el-date-picker v-model="query.time1" type="month" placeholder="请选择" clearable>
        </el-date-picker>
      </div>
      <div class="form-item">
        <span class="item-label">患者姓名：</span>
        <el-input v-model="query.patientName" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">审方药师：</span>
        <el-input v-model="query.pharmacistName" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">接诊状态：</span>
        <el-select v-model="query.inquiryType" placeholder="请选择" filterable clearable>
          <el-option v-for="item in inquiryStatus" :key="item.inquiryType" :label="item.statusName" :value="item.inquiryType">
          </el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">审方结果：</span>
        <el-select v-model="query.rpStatus" placeholder="请选择" filterable clearable>
          <el-option v-for="item in rpStatus" :key="item.rpStatus" :label="item.statusName" :value="item.rpStatus">
          </el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="validate">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </div>
    <base-title name="信息列表"></base-title>
    <el-table :data="tableData" stripe class="mt24">
      <el-table-column prop="patientName" align="center" label="患者姓名"></el-table-column>
      <el-table-column prop="patientAge" align="center" label="患者年龄"></el-table-column>
      <el-table-column prop="patientSex" align="center" label="患者性别">
        <template #default="{row}">
          {{row.patientSex | formatSex }}
        </template>
      </el-table-column>
      <el-table-column prop="doctorName" label="接诊医生" align="center"></el-table-column>
      <el-table-column prop="responseTime" width="160" label="接诊时间" align="center">
      </el-table-column>
      <el-table-column prop="inquiryTypeName" label="接诊状态" align="center">
      </el-table-column>
      <el-table-column prop="pharmacistName" label="审方药师" align="center"></el-table-column>
      <el-table-column prop="pharmacistTime" width="160" label="审方时间" align="center">
        <template #default="{row}">
          {{row | rpTime}}
        </template>
      </el-table-column>
      <el-table-column prop="rpStatus" label="审方结果" align="center">
        <template #default="{row}">
          {{row.rpStatus | rpStatus}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template #default="{row}">
          <el-button type="primary" v-if="row.hasRp === 1 && row.rpStatus === 3" size="mini" @click="seeRp(row)">
            查看处方详情
          </el-button>
          <div v-if="row.hasRp === 1 && row.rpStatus === 2 && row.rpFileStampFileUrl !== ''">
            <el-link type="success" :href="row.rpFileStampFileUrl" target="view_window">查看处方文件</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getInquiryOrder()" @current-change="getInquiryOrder()" />
    <el-dialog :visible.sync="dialogVisible">
      <img width="94%" :src="dialogImageUrl" style="margin-left: 3%">
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatMonth } from "../../filters";
export default {
  filters: {
    rpStatus (value) {
      if (value === 0) {
        return "开方中";
      } else if (value === 1) {
        return "未审方";
      } else if (value === 2) {
        return "审方通过";
      } else if (value === 3) {
        return "审方不通过";
      }
    },
    rpTime (row) {
      if (row.rpStatus === 0 || row.rpStatus === 1) {
        return "";
      }
      return row.pharmacistTime;
    }
  },
  data () {
    return {
      query: {
        time1: ""
      },
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      },
      // 订单数据
      tableData: [],
      // 处方状态
      rpStatus: [
        { rpStatus: "", statusName: "全部" },
        { rpStatus: "0", statusName: "开方中" },
        { rpStatus: "1", statusName: "未审方" },
        { rpStatus: "2", statusName: "审方通过" },
        { rpStatus: "3", statusName: "审方不通过" }
      ],
      inquiryStatus: [
        { inquiryType: "", statusName: "全部" },
        { inquiryType: "0", statusName: "待接诊" },
        { inquiryType: "1", statusName: "已接诊" },
        { inquiryType: "2", statusName: "未响应" },
        { inquiryType: "3", statusName: "拒绝" },
        { inquiryType: "4", statusName: "取消" }
      ],
      dialogImageUrl: "",
      dialogVisible: false,
      rules: {
        time1: {
          required: true,
          message: "接诊时间不能为空"
        }
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    let _this = this;
    _this.query.time1 = formatMonth(new Date());
  },
  methods: {
    // 重置搜索条件框
    reset () {
      let _this = this;
      _this.query = {};
    },
    // 验证表单
    validate () {
      let _this = this;
      if (!this.query.time1) {
        this.$message({
          message: '请选择接诊时间',
          type: 'warning'
        });
        return false;
      }
      _this.getInquiryOrder();
    },
    // 获取问诊订单列表
    getInquiryOrder () {
      let _this = this;
      let time = formatMonth(_this.query.time1);
      let params = {
        ..._this.query,
        time,
        ..._this.pageInfo
      };
      _this.$_http
        .get(_this.$_API.API_RP_INQUIRY_GETINQUIRYORDER, { params })
        .then(res => {
          if (!res.data) return;
          _this.tableData = res.data.datas;
          _this.pageInfo = res.data.pageInfo;
        });
    },
    // 查看处方详情
    seeRp (row) {
      this.$router.push({
        name: "rpTemplate",
        // 跳转详情界面  传入订单 ID
        params: { inquiryId: row.rpID, state: "0" }
      });
    },
    handlePictureCardPre (val) {
      this.dialogImageUrl = val;
      this.dialogVisible = true;
    }
  }
};
</script>
