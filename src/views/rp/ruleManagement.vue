<template>
  <div class="app-container base-page">
    <div>
      <!-- <base-title name="查询条件"></base-title> -->
      <div class="base-search_form">
        <div class="form-item">
          <span class="item-label">告警级别：</span>
          <el-select v-model="query.reportLevel" placeholder="请选择" clearable class="width_130">
            <el-option label="禁止开方" value="1"></el-option>
            <el-option label="外呼告警" value="2"></el-option>
            <el-option label="确认告警" value="3"></el-option>
            <el-option label="提示告警" value="4"></el-option>
          </el-select>
        </div>
        <div class="form-item">
          <span class="item-label">告警类型：</span>
          <el-select v-model="query.reportType" placeholder="请选择" clearable class="width_130">
            <el-option label="患者信息" :value="1"></el-option>
            <el-option label="药品信息" :value="2"></el-option>
            <el-option label="处方信息" :value="3"></el-option>
          </el-select>
        </div>
        <div class="form-item">
          <span class="item-label">告警状态：</span>
          <el-select v-model="query.disable" placeholder="请选择" clearable class="width_130">
            <el-option label="开启" :value="0"></el-option>
            <el-option label="禁止" :value="1"></el-option>
          </el-select>
        </div>
        <div class="form-item">
          <span class="item-label">告警平台：</span>
          <el-select v-model="query.platForm" placeholder="请选择" clearable class="width_130">
            <el-option label="全部" :value="''"></el-option>
            <el-option label="拼多多" :value="1"></el-option>
            <el-option label="美团" :value="2"></el-option>
            <el-option label="阿里" :value="3"></el-option>
            <el-option label="自建" :value="4"></el-option>
          </el-select>
        </div>
        <div class="form-item">
          <span class="item-label">告警名称：</span>
          <el-input v-model="query.reportName" placeholder="请输入关键词" clearable class="width_130"></el-input>
        </div>
        <div class="form-item">
          <el-button type="primary" icon="el-icon-search" @click="dynamicRuleList">查询</el-button>
        </div>
        <div class="form-item">
          <el-button icon="el-icon-refresh" @click="replacement">重置</el-button>
        </div>
      </div>
    </div>
    <div>
      <div style="position: relative;">
      <base-title name="规则列表"></base-title>
      <div class="base-list_option" style="position: absolute;right: 24px;top: 0px;margin: 0px;">
        <el-button type="primary" icon="el-icon-plus" @click="addAlarm()">新增告警</el-button>
      </div>
    </div>
      <el-table :data="tableData" stripe :loading="tableLoading" class="mt24">
        <el-table-column prop="reportName" label="告警名称" align="center"></el-table-column>
        <el-table-column prop="reportLevel" label="告警级别" align="center">
          <template #default="{ row }">
            <div v-if="row.reportLevel === 1" class="flex">
              <span>禁止开方</span>
              <img src="./../../assets/image/rule/icon_warning.png">
            </div>
            <div v-else-if="row.reportLevel === 2" class="flex">
              <span>外呼警告</span>
              <img src="./../../assets/image/rule/icon_warning_1.png">
            </div>
            <div v-else-if="row.reportLevel === 3" class="flex">
              <span>确认告警</span>
              <img src="./../../assets/image/rule/icon_warning_2.png">
            </div>
            <div v-else-if="row.reportLevel === 4" class="flex">
              <span>提示告警</span>
              <img src="./../../assets/image/rule/icon_warning_3.png">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="disable" label="告警状态" align="center" >
          <template #default="{ row }">
            <span v-if="row.disable == 0">开启</span>
            <span v-else>禁止</span>
          </template>
        </el-table-column>
        <el-table-column prop="platForms" label="告警平台" align="center">
          <template #default="{ row }">
            <span v-if="row.platForms">
              {{row.platForms | filtersPlatForms}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="reportType" label="告警类型" align="center">
          <template #default="{ row }">
            <span v-if="row.reportType == 1">患者信息</span>
            <span v-else-if="row.reportType == 2">药品信息</span>
            <span v-else-if="row.reportType == 3">处方信息</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="providerID" label="告警次数" align="center" min-width="100"></el-table-column> -->
        <el-table-column prop="modifyTime" label="告警更新时间" align="center"></el-table-column>
        <!-- <el-table-column prop="doctorTime" label="告警频率" align="center" width="155px"></el-table-column> -->
        <el-table-column label="操作" align="center" fixed="right">
          <template #default="{row}">
            <el-button type="text" size="mini" class="forbid" @click="dynamicRuleDisable(row._id, 1)" v-if="row.disable == 0">
              禁止
            </el-button>
            <el-button type="text" size="mini" @click="dynamicRuleDisable(row._id, 0)" v-else>
              开启
            </el-button>
            <el-button type="text" size="mini" @click="editRule(row._id)">
              编辑
            </el-button>
            <el-button type="text" size="mini" class="forbid" @click="removeRule(row._id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination background v-model="pageInfo" @size-change="dynamicRuleList" @current-change="dynamicRuleList" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data () {
    return {
      pageInfo: {
        pageSize: 10,
        pageIndex: 1
      },
      // 列表数据
      tableData: [],
      tableLoading: false,
      query: {
        reportLevel: "",
        reportType: "",
        disable: '',
        platForm: "",
        reportName: "",
      }
    };
  },
  filters: {
    filtersPlatForms(list) {
      let arr = []
      list.forEach(ele => {
        if(ele === 1) {
          arr.push("拼多多")
        }
        if(ele === 2) {
          arr.push("美团")
        }
        if(ele === 3) {
          arr.push("阿里")
        }
        if(ele === 4) {
          arr.push("自建")
        }
      })
      arr = arr.join("、")
      return arr
    }
  },  
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.dynamicRuleList()
  },
  methods: {
    replacement() {
      this.query = {
        reportLevel: "",
        reportType: "",
        disable: '',
        platForm: "",
        reportName: "",
      }
    },
    // 获取告警列表
    dynamicRuleList() {
      let params = {
        ...this.pageInfo,
        ...this.query
      }
      this.$_http.get(this.$_API.INTERFACE_RP_GET_DYNAMICRULE_LIST,{params:params}).then(res => {
        if(res.success) {
          this.tableData = res.data.datas
          let pageinfo = {
            pageIndex: res.data.pageIndex,
            pageSize: res.data.pageSize,
            totalPage: res.data.totalPage,
            totalRow: res.data.totalRow
          }
          this.pageInfo = pageinfo
        }
      })
    },
    // 告警规则禁用启用
    dynamicRuleDisable(id,type) {
      let params = {
        _id: id,
        disable: type
      }
      this.$_http.post(this.$_API.INTERFACE_RP_GET_DYNAMICRULE_DISABLE, params).then(res => {
        if(res.success) {
          this.dynamicRuleList()
          this.$message({
            type: "success",
            message: type === 0 ? "开启成功" : "禁止成功"
          })
        }
      })
    },
    addAlarm() {
      this.$router.push({
        name: 'ruleManagementEdit',
        params: {
          mode: "C",
          keyID: '0'
        }
      })
    },
    editRule(id) {
      this.$router.push({
        name: 'ruleManagementEdit',
        params: {
          mode: "E",
          keyID: id
        }
      })
    },
    // 删除当前规则
    removeRule(id) {
      this.$confirm('请确认是否删除当前规则？', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        cancelButtonClass: 'btn-rule-cancel',
        confirmButtonClass: "btn-rule-confirm",
        customClass: 'messageContent',
        type: 'warning',
        iconClass:"el-icon-warning messageDangerIcon",
      }).then(async () => {
        let params = {
          _id: id
        }
        this.$_http.post(this.$_API.INTERFACE_RP_GET_DYNAMICRULE_DELETE, params).then(res => {
          if(res.success) {
            this.dynamicRuleList()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
        })
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.width_130 {
  width: 130px;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    margin-left: 5px;
    height: 20px;
    width: 18px;
  }
}
.forbid {
  color: #fe5853;
}
</style>
