<template>
    <div class="coupon">
        <div class="app-container">
            <el-card class="box-card" style="margin:5px 0">
                <el-form :model="searchKey" inline>
                    <el-form-item  label="任务号：">
                        <el-input v-model="searchKey.couponName" maxlength="20" clearable placeholder="请输入优惠券名称"></el-input>
                    </el-form-item>
                    <el-form-item  label="患者姓名：">
                        <el-input v-model="searchKey.couponName" maxlength="20" clearable placeholder="请输入优惠券名称"></el-input>
                    </el-form-item>
                    <el-form-item  label="计划回访时间：">
                        <el-date-picker
                                style="width: 100%"
                                v-model="searchKey.dateRangeTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                unlink-panels
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item  label="购药状态：">
                        <el-input v-model="searchKey.couponName" maxlength="20" clearable placeholder="请输入优惠券名称"></el-input>
                    </el-form-item>
                    <el-form-item  label="处理状态：">
                        <el-input v-model="searchKey.couponName" maxlength="20" clearable placeholder="请输入优惠券名称"></el-input>
                    </el-form-item>
                    <el-form-item  label="最新购药状态：">
                        <el-input v-model="searchKey.couponName" maxlength="20" clearable placeholder="请输入优惠券名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
                        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card>
                <el-table :data="tableData" border fit>
                    <el-table-column prop="couponName" label="任务号" align="center"></el-table-column>
                    <el-table-column prop="startTime" label="患者姓名" align="center"></el-table-column>
                    <el-table-column prop="endTime" label="电话" align="center"></el-table-column>
                    <el-table-column prop="startTime" label="购药状态" align="center"></el-table-column>
                    <el-table-column prop="couponName" label="计划回访时间" align="center"></el-table-column>
                    <el-table-column prop="startTime" label="处理状态" align="center"></el-table-column>
                    <el-table-column prop="endTime" label="最新跟进状态" align="center"></el-table-column>
                    <el-table-column prop="keyID" label="操作" align="center" width="300px">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini"  @click="edit">编辑</el-button>
                            <el-button type="danger" size="mini" >回退</el-button>
                            <el-button type="success" size="mini" >完成</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
    </div>
</template>

<script>
  export default {
    name: "workOrder",
    data(){
      return {
        searchKey:{},
        tableData:[{}]
      }
    },
    methods:{
      edit(){
        this.$router.push("/returnVisit/taskDetail")
      },
      searchData(){},
      reset(){}
    }
  };
</script>

<style scoped>
    /deep/ .el-form--inline .el-form-item{
        margin-right: 40px;
    }
</style>
