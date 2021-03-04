<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">患者姓名：</span>
        <el-input v-model="query.patientName" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">年龄区间：</span>
        <el-select v-model="query.ageRange" placeholder="请选择" filterable clearable>
          <el-option v-for="item in ageRangeArray" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">病症种类：</span>
        <el-select v-model="query.patientTags" placeholder="请选择" filterable clearable>
          <el-option v-for="item in desaList" :key="item.keyID" :label="item.paraValue" :value="item.paraValue">
          </el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">严重程度：</span>
        <el-select v-model="query.illness" placeholder="请选择" filterable clearable>
          <el-option v-for="item in severityArray" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">是否复诊：</span>
        <el-select v-model="query.isPay" placeholder="请选择" filterable clearable>
          <el-option v-for="item in followVisitArray" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">建档时间：</span>
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
    <base-title :name="'共'+data.patientSum+'条数据'"></base-title>

    <el-table :data="tableData" class="mt24" stripe :loading="tableLoading">
      <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
      <el-table-column prop="birthYear" label="年龄" align="center">
        <template #default="{row}">
          {{ getAnalysisIdCard(row.birthYear)}}
        </template>
      </el-table-column>
      <el-table-column prop="patientTags" label="病症" align="center"></el-table-column>
      <el-table-column prop="loginTime" label="严重程度" align="center">
        <template #default="{row}">
          <span v-if="row.illness===1">轻微</span>
          <span v-if="row.illness===2">一般</span>
          <span v-if="row.illness===3">严重</span>
        </template>
      </el-table-column>
      <el-table-column prop="isDisable" label="是否复诊" align="center">
        <template #default="{row}">
          <span v-if="row.isPay===0">未复诊</span>
          <span v-if="row.isPay===1">已复诊</span>
        </template>
      </el-table-column>
      <el-table-column prop="loginTime" label="建档时间" align="center">
        <template #default="{row}">
          {{ row.addTime | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="detail(row)">查看详情</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
  </div>
</template>

<script>
const STATUS_LIST = ["启用", "禁用"];
import { mapGetters } from "vuex";
export default {
  name: "user-staff",
  filters: {
    // 格式化状态
    formatStatus (val) {
      return STATUS_LIST[val] || "";
    }
  },
  data () {
    return {
      query: {},
      time: [],
      followVisitArray: [{
        key: '0',
        label: '未复诊'
      },
      {
        key: '1',
        label: '已复诊'
      }
      ],
      severityArray: [{
        key: '1',
        label: '轻微'
      },
      {
        key: '2',
        label: '一般'
      },
      {
        key: '3',
        label: '严重'
      }
      ],
      ageRangeArray: [{
        key: '1',
        label: '0 ~ 2岁',
        min: 0,
        max: 2
      },
      {
        key: '2',
        label: '3 ~ 6岁',
        min: 3,
        max: 6
      },
      {
        key: '3',
        label: '7 ~ 18岁',
        min: 7,
        max: 18
      },
      {
        key: '4',
        label: '19 ~ 59岁',
        min: 19,
        max: 59
      },

      {
        key: '5',
        label: '60 ~ 79岁',
        min: 60,
        max: 70
      },
      {
        key: '6',
        label: '80岁及以上',
        min: 80,
        max: ''
      }
      ],
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      },
      tableLoading: false,
      tableData: [],
      data:{},
      desaList: [],
      patientTotalNum: 0
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.getStatic()
    this.getDiseaList()
    // 加载表格
    this.loadTable();

  },
  activated () {
    this.loadTable();
  },
  methods: {
    detail (row) {
      this.$router.push({
        name: 'chronic-patientDetail',
        query: { data: JSON.stringify(row) }
      })
    },
    resetSearchInfo () {
      this.query = {
        staffName: '',
        phone: ''
      }
      this.time = []
    },
    getStatic () {
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
    // 计算
    getAnalysisIdCard (birthYear) {
      if (birthYear && birthYear > 0) {
        let myDate = new Date();
        let age = myDate.getFullYear() - birthYear;
        return age;
      } else {
        return ''
      }
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
        assistantStaffID: this.userInfo.keyID
      };

      
      if (this.query.ageRange) {
        let item = this.ageRangeArray[parseInt(this.query.ageRange) - 1]
        params['minAge'] = item.min
        params['maxAge'] = item.max
      }
      if (this.time.length > 0) {
        this.query.buildStartTime = this.time[0]
        this.query.buildEndTime = this.time[1]
      } else {
        this.query.buildStartTime = ''
        this.query.buildEndTime = ''
      }
      let params = { ...this.pageInfo, ...this.query, ...bizInfo };
      this.tableLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_ASSISTANT_ASSISTANT_PATIENGBYITEM, {
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
    // 操作：点击【修改】按钮
    edit (row) {
      if (!row || !row.phone) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "user-staff-edit",
        params: { keyID: row.keyID, mode: "E" }
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
