<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">药品名称/简拼：</span>
        <el-input placeholder="请输入药品名称/简拼" v-model="query.medicineName" clearable style="width:200px"></el-input>
      </div>  
      <div class="form-item">
        <span class="item-label">更新时间：</span>
        <!-- <el-date-picker type="datetime" placeholder="请输入" value-format="yyyy-MM-dd HH:mm:ss" v-model="query.startTime" clearable style="width:185px"></el-date-picker>&nbsp;-&nbsp;
        <el-date-picker type="datetime" placeholder="请输入" value-format="yyyy-MM-dd HH:mm:ss" v-model="query.endTime" clearable style="width:185px"></el-date-picker> -->
        <el-date-picker v-model="query.time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <span class="item-label">操作员：</span>
        <el-input placeholder="请选择" v-model="query.staffName" clearable style="width:110px"></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">更新状态：</span>
        <el-select placeholder="请选择" v-model="query.updateStatus" clearable style="width:110px">
          <el-option value="" label="全部"></el-option>
          <el-option value="0" label="未更新"></el-option>
          <el-option value="1" label="已更新"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">状态：</span>
        <el-select placeholder="请选择" v-model="query.isDisable" clearable style="width:110px">
          <el-option value="" label="全部"></el-option>
          <el-option value="0" label="启用"></el-option>
          <el-option value="1" label="禁用"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getMedicineruleList">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </div>
    </div>
    <base-title name="药品字典列表"></base-title>
    <el-table :data="MedicineruleList" stripe ref="multipleTable" style="margin-top:15px;" @selection-change="selectionChange">
      <el-table-column  type="selection" width="96" align="center" ></el-table-column>
      <el-table-column prop="medicineName" label="药品名称" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" :show-overflow-tooltip="true" align="center" >
        <template #default="scope">
          <span v-if="scope.row.updateTime !== '1900-01-01 00:00:00.0'">{{scope.row.updateTime.slice(0,19)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="staffName" label="操作员" :show-overflow-tooltip="true" align="center" ></el-table-column>
      <el-table-column label="状态" :show-overflow-tooltip="true" align="center" >
        <template #default="scope">
          <span v-if="scope.row.isDisable == 0">启用</span>
          <span v-else-if="scope.row.isDisable == 1">禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" fixed="right" align="center">
        <template #default="scope">
          <div class="option-btn_group">
            <span class="opt-text" @click="editMedicinerule(scope.row)">编辑</span>
            <span class="opt-text" v-if="scope.row.isDisable == 0 && scope.row.updateTime !== '1900-01-01 00:00:00.0'" @click="disableAndEnabled(scope.row,1)" >禁用</span>
            <span class="opt-text" v-else-if="scope.row.isDisable == 1 && scope.row.updateTime !== '1900-01-01 00:00:00.0'" @click="disableAndEnabled(scope.row,0)" >启用</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="operationMin">
      <base-pagination v-model="page" @size-change="getMedicineruleList" @current-change="getMedicineruleList" />
      <div class="operation" v-show="page.totalRow > 0">
        <el-button type="primary" @click="disableAndEnabledList(0)" :disabled="changeList.length == 0">批量启用</el-button>
        <el-button type="primary" @click="disableAndEnabledList(1)" :disabled="changeList.length == 0">批量禁用</el-button>
      </div>
    </div>
    
  </div>
</template>

<script>
import { formatDate } from "../../filters";
export default {
  name: "recommend",
  components: {
  },
  data () {
    return {
      
      MedicineruleList: [],
      Medicinerule: {},
      query: {
        updateStatus: '',
        isDisable: ''
      },
      page: {
        // 分页参数
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
      },
      changeList: []
    };
  },
  created () {
    this.getMedicineruleList();
  },
  methods: {
    // 选择事件
    selectionChange(val) {
      this.changeList = val
    },
    // 查询重置
    handleReset() {
      this.query = {
        updateStatus: '',
        isDisable: ''
      }
    },
    // 获取药品字典列表
    getMedicineruleList () {
      let data = {
        medicineName: this.query.medicineName,
        startTime: this.query.time ? this.query.time[0] : "",
        endTime: this.query.time ? this.query.time[1] : "",
        staffName: this.query.staffName
      }
      if(this.query.updateStatus !== '全部') {
        data.updateStatus = this.query.updateStatus
      }
      if(this.query.isDisable !== '全部') {
        data.isDisable = this.query.isDisable
      }
      this.$_http
        .get(
          this.$_API.INTERFACE_RP_GET_MEDICINERULE_PAGE,
          { params: Object.assign({}, data, this.page) }
        )
        .then(response => {
          this.MedicineruleList = response.data.datas;
          let pageInfo = {
            totalRow: response.data.totalRow,
            pageIndex: response.data.pageIndex,
            pageSize: response.data.pageSize
          }
          this.page = pageInfo;
        });
    },
    // 修改药品规则
    editMedicinerule (row) {
      this.$router.push({
        path: "drugInstructions",
        query: { medicineName: JSON.stringify(row.medicineName), keyID: JSON.stringify(row.keyID)}
      });
    },
    // 批量禁用启用
    disableAndEnabledList(index) {
      let list = this.$refs.multipleTable.selection
      let data = []
      if(list.length > 0) {
        list.forEach(ele => {
          let obj = {}
          if(ele.updateTime !== '1900-01-01 00:00:00.0') {
            obj = {
              medicineName: ele.medicineName,
              keyID: ele.keyID
            }
            data.push(obj)
          }
        })
        if(data.length > 0) {
          this.medicineRuleDisable(data,index)
        } else {
          this.$message({
            type: 'error',
            message: "当前选中数据不存在规则"
          })
        }
      } else{
        this.$message({
          type: 'error',
          message: "请选择至少一条数据"
        })
      }
    },
    // 禁用启用
    disableAndEnabled (row,index) {
      let data = [{
        medicineName: row.medicineName,
        keyID: row.keyID
      }]
      this.medicineRuleDisable(data,index)
    },
    // 规则
    medicineRuleDisable(list,index) {
      let data = {
        names: list,
        disable: index,
      }
      this.$_http
        .post(
          this.$_API.INTERFACE_RP_GET_MEDICINERULE_DISABLE, data
        )
        .then(response => {
          this.getMedicineruleList()
        });
    }
  }
};
</script>

<style lang="scss">
.btn-set {
  // position: absolute;
  // right: 0;
  margin-left: 5px;
  padding: 3px;
  border-radius: 3px;
}
.el-tooltip__popper {
  max-width: 98%;
}
.operationMin {
  position: relative;
  .operation {
    width: 220px;
    position: absolute;
    top: 0;
    padding-left: 40px;
  }
  .peach-pagination{
    padding-bottom: 0px !important;
  }
}
</style>
