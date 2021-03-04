<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">患者姓名：</span>
        <el-input v-model="query.patientName" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">病症种类：</span>
        <el-select v-model="query.patientTags" placeholder="请选择" filterable clearable>
          <el-option v-for="item in desaList" :key="item.keyID" :label="item.paraValue" :value="item.paraValue">
          </el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">金额区间：</span>
        <el-input v-model="query.minPriceStr" placeholder="请输入" clearable oninput="value=value.replace(/[^-\d.]/g,'')" />
        <template>-</template>
        <el-input v-model="query.maxPriceStr" placeholder="请输入" clearable oninput="value=value.replace(/[^-\d.]/g,'')" />
      </div>
      <div class="form-item">
        <span class="item-label">积分区间：</span>
        <el-input v-model="query.minPoint" placeholder="请输入" clearable oninput="value=value.replace(/[^\d]/g,'')" />
        <template>-</template>
        <el-input v-model="query.maxPoint" placeholder="请输入" clearable oninput="value=value.replace(/[^\d]/g,'')" />
      </div>
      <div class="form-item">
        <span class="item-label">处方时间：</span>
        <el-date-picker v-model="time" type="daterange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" value-format='yyyy-MM-dd'>
        </el-date-picker>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="loadTable">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
      </div>
    </div>
    <base-title :name="'共'+data.rpSum+'条数据'"></base-title>

    <el-table :data="tableData" class="mt24" stripe :loading="tableLoading">
      <el-table-column prop="orderID" label="订单编号" align="center"></el-table-column>
      <el-table-column prop="isDisable" label="所属患者" align="center">
        <template #default="{row}">
          {{ row.patientName }}
          <br />
          {{ row.phone }}
        </template>
      </el-table-column>
      <el-table-column prop="loginTime" label="病种" align="center">
        <template #default="{row}">
          {{ row.patientTags }}
        </template>
      </el-table-column>
      <el-table-column prop="addTime" label="金额" align="center">
        <template #default="{row}">
          {{ row.costPrice/100 }}
        </template>
      </el-table-column>
      <el-table-column prop="loginTime" label="积分" align="center">
        <template #default="{row}">
          {{ row.pointNum }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="商品信息" align="center">
        <template #default="{row}">
          <span v-for="item of row.medicines" :key="item.keyID">
            {{item.medicineName}} X {{item.medicineAmount}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="loginTime" label="处方时间" align="center">
        <template #default="{row}">
          {{ row.rpAddTime | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="handelDetail(row)">查看处方</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
    <ChatRecord title="图文记录" :itemData="itemData" :inquiryID="inquiryID" :visible.sync="dialogVisible" :patientID="patientID" :patientName="patientName" :doctorStaffID="doctorStaffID" :assistantStaffID="assistantStaffID" />
  </div>
</template>

<script>
import ChatRecord from './ChatRecord'
import { mapGetters } from "vuex";
const STATUS_LIST = ["启用", "禁用"];
export default {
  name: "user-staff",
  components: {
    ChatRecord
  },
  data () {
    return {
      query: {},
      time: [],
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      },
      tableLoading: false,
      moneyList: [{
        key: '1',
        label: '0 ~ 500',
        min: 0,
        max: 500
      },
      {
        key: '2',
        label: '500 ~ 1000',
        min: 500,
        max: 1000
      },
      {
        key: '3',
        label: '1000 ~ 2000',
        min: 1000,
        max: 2000
      },
      {
        key: '4',
        label: '2000以上',
        min: 2000,
        max: ''
      }],
      tableData: [],
      desaList: [],
      inquiryID: '',
      dialogVisible: false,
      patientID: '',
      patientName: '',
      doctorStaffID: '',
      assistantStaffID: '',
      itemData: {},
      data: {}
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.getStatistic()
    this.getDiseaList()
    // 加载表格
    this.loadTable();
  },
  activated () {
    this.loadTable();
  },
  methods: {
    // 获取统计
    getStatistic () {
      let params = {
        orgID: this.userInfo.orgID,
        assistantStaffID: this.userInfo.keyID,
        ...this.query
      };
      this.$_http
        .get(this.$_API.INTERFACE_ASSISTANT_STATISTIC, {
          params
        })
        .then(res => {
          this.data = res.data
        });
    },
    handelDetail (row) {
      this.inquiryID = row.inquiryID
      this.patientID = row.patientID
      this.patientName = row.patientName
      this.doctorStaffID = row.doctorStaffID
      this.assistantStaffID = row.assistantStaffID
      this.itemData = row
      this.dialogVisible = true
    },
    resetSearchInfo () {
      this.query = {
        staffName: '',
        phone: ''
      }
      this.time = []
    },
    // 获取病种
    getDiseaList () {
      let params = {
        orgID: this.userInfo.orgID,
        groupCode: "OP_TMC_ORG_FIRST_DISEASE",
        paraCode: "OP_TMC_ORG_SECOND_DISEASE"
      };
      this.$_http
        .get(this.$_API.INTERFACE_ASSISTANT_PARAS, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.desaList = res.data
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 获取员工列表数据，加载表格
    loadTable () {
      if (this.tableLoading) {
        return;
      }
      let bizInfo = {
        orgID: this.userInfo.orgID,
        assistantStaffID: this.userInfo.keyID,
      };
      if (this.time.length > 0) {
        this.query.rpMinAddTime = this.time[0]
        this.query.rpMaxAddTime = this.time[1]
      } else {
        this.query.rpMinAddTime = ''
        this.query.rpMaxAddTime = ''
      }
      if (this.query.minPriceStr) {
        this.query.minPrice = this.query.minPriceStr * 100
      }
      if (this.query.maxPriceStr) {
        this.query.maxPrice = this.query.maxPriceStr * 100
      }

      let params = { ...this.pageInfo, ...this.query, ...bizInfo };

      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_ASSISTANT_ASSISTANTRP, {
          ...params
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
    // 表格数据错误时的处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.loadTable();
    },
    // 操作：点击【添加】按钮
    add () {
      this.$router.push({
        name: "user-staff-edit",
        params: { keyID: "0", mode: "C" }
      });
    },
    // 操作：点击【启用】/【禁用】按钮
    disableBtn (row) {
      if (!row || !row.keyID || row.isDisable === undefined) {
        this.dataError();
        return;
      }
      this.$confirm(
        `此操作将${STATUS_LIST[~~!row.isDisable]}该员工账号，是否继续`,
        "提示",
        {
          type: "warning"
        }
      ).then(it => {
        this.disable(row);
      });
    },
    // 启用/禁用员工
    disable (row) {
      if (this.tableLoading) {
        return;
      }
      let isDisable = ~~!row.isDisable;
      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_USER_STAFF_DISABLE, {
          isDisable,
          staffID: row.keyID
        })
        .then(res => {
          this.$_success(`${STATUS_LIST[isDisable]}该员工账号成功`);
          this.tableLoading = false;
          this.loadTable();
        })
        .finally(it => {
          this.tableLoading = false;
        });
    }
  }
};
</script>
