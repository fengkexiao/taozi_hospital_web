<template>
  <div class="pt0">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">A药品名称：</span>
        <el-input placeholder="请输入" v-model="query.medicineContentA" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">B药品名称：</span>
        <el-input placeholder="请输入" v-model="query.medicineContentB" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">筛选作用类型：</span>
        <el-select v-model="query.interactionType" placeholder="请选择" filterable clearable value="">
          <el-option v-for="(item,index) in interactionTypeList" :key="index" :label="item.name" :value="item.val"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">提示类型：</span>
        <el-select v-model="query.risk" placeholder="请选择" filterable clearable value="">
          <el-option v-for="(item,index) in riskList" :key="index" :label="item.name" :value="item.val"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">更新时间：</span>
        <el-date-picker v-model="query.time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" clearable></el-date-picker>
      </div>
      <div class="form-item">
        <span class="item-label">操作员：</span>
        <el-input placeholder="请输入" v-model="query.staffName" clearable></el-input>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </div>
    </div>
    <base-title name="药品列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addMedicineInteraction()">添加</el-button>
    </div>
    <el-table :data="list" ref="multipleTable" style="width:100%;" :loading="tableLoading" class="mt24" stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="medicineContentA" label="A药品名称" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{scope.row.interactionClass===0?scope.row.medicineContentA:""}}
        </template>
      </el-table-column>
      <el-table-column prop="medicineContentB" label="B药品名称" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{scope.row.interactionClass===0?scope.row.medicineContentB:""}}
        </template>
      </el-table-column>
      <el-table-column prop="interactionType" label="作用类型" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{getInteractionClassName(scope.row.interactionType)}}
        </template>
      </el-table-column>
      <el-table-column prop="riskName" label="提示类型" :show-overflow-tooltip="true" align="center"></el-table-column>
      <el-table-column prop="modifyTime" label="更新时间" :show-overflow-tooltip="true" align="center"></el-table-column>
      <el-table-column prop="staffName" label="操作员" :show-overflow-tooltip="true" align="center"></el-table-column>
      <el-table-column prop="isDisable" label="状态" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{scope.row.isDisable===0?"启用":"禁用"}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" fixed="right" align="center">
        <template #default="scope">
          <div class="option-btn_group">
            <span class="opt-text" @click="handleEdit(scope.row)">编辑</span>
            <span class="opt-text" @click="handleDisabled(scope.row)">{{scope.row.isDisable===0?"禁用":"启用"}}</span>
            <span class="text-danger opt-text" @click="handleDel(scope.row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="ml24 operationMin">
      <base-pagination v-model="page" @size-change="getList" @current-change="getList" />
      <div  class="batchList" v-if="page.totalRow > 0">
        <el-button type="primary" @click="handleAllEnable()" :disabled="multipleSelection.length == 0">批量启用</el-button>
        <el-button type="primary" class="ml24" @click="handleAllDisable()"  :disabled="multipleSelection.length == 0">批量禁用</el-button>
        <el-button type="primary" class="ml24" @click="handleAllDel()"  :disabled="multipleSelection.length == 0">批量删除</el-button>
      </div>
    </div>
    <medicine-interaction-edit :title="!isEdit?'药品名称作用规则添加':'药品名称作用规则编辑'" :visible.sync="dialogVisible" type="B" :isEdit="isEdit" :selData="selData"></medicine-interaction-edit>
  </div>
</template>

<script>
import MedicineInteractionEdit from "./components/medicineInteractionEdit";
import roleDrugsManageMixin from './roleDrugsManageMixin'
import { formatDate } from "../../filters";
import { RISK } from './../../common/Constant'
export default {
  name: "medicineNameManage",
  components: {
    MedicineInteractionEdit,
  },
  mixins: [roleDrugsManageMixin],
  data () {
    return {

    };
  },
  created () {
    // this.setInteractionClass()
    console.log(roleDrugsManageMixin.data.multipleSelection)
  },
  methods: {
    setInteractionClass () {
      this.interactionClass = '0'
      this.getList()
    }
  }
};
</script>

<style lang="scss" scoped>
  .operationMin {
    position: relative;
    .batchList {
      position: absolute;
      top: 0px;
    }
    .peach-pagination{
      padding-bottom: 0px !important;
    }
  }
</style>
