<template>
    <div class="coupon">
        <div class="app-container">
            <el-card class="box-card" style="margin:5px 0">
                <el-form :model="searchKey" inline>
                    <el-form-item  label="姓名：">
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
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
                        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
                        <el-button icon="el-icon-plus" type="primary" @click="add">添加</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card>
                <el-table :data="tableData" border fit>
                    <el-table-column prop="startTime" label="姓名" align="center"></el-table-column>
                    <el-table-column prop="endTime" label="电话" align="center"></el-table-column>
                    <el-table-column prop="couponName" label="总任务数" align="center"></el-table-column>
                    <el-table-column prop="startTime" label="总处理任务数" align="center"></el-table-column>
                    <el-table-column prop="endTime" label="成单数" align="center"></el-table-column>
                    <el-table-column prop="couponName" label="成单金额" align="center"></el-table-column>
                    <el-table-column prop="keyID" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="danger" size="mini">禁用</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
        <addVisitor :dialogVisible="dialogVisible"></addVisitor>
    </div>
</template>

<script>
    import addVisitor from './components/addVisitor'
  export default {
    name: "commissioner",
    components:{
      addVisitor
    },
    data(){
      return {
        dialogVisible:false,
        searchKey:{},
        tableData:[{}]
      }
    },
    methods:{
      add(){
        this.dialogVisible = true;
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
