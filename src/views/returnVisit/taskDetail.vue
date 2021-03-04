<template>
  <div class="taskBox">
    <div class="box">
      <div class="title">任务详情：</div>
      <el-table :data="tableData" border fit>
        <el-table-column prop="couponName" label="任务号" align="center"></el-table-column>
        <el-table-column prop="startTime" label="患者姓名" align="center"></el-table-column>
        <el-table-column prop="endTime" label="电话" align="center"></el-table-column>
        <el-table-column prop="couponName" label="计划回访时间" align="center"></el-table-column>
        <el-table-column prop="startTime" label="购药状态" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="box">
      <div class="title">历史处理结果：</div>
      <div>
      <el-table :data="tableData" border fit>
        <el-table-column prop="couponName" label="任务号" align="center"></el-table-column>
        <el-table-column prop="startTime" label="处理专员" align="center"></el-table-column>
        <el-table-column prop="endTime" label="任务回访时间" align="center"></el-table-column>
        <el-table-column prop="couponName" label="实际跟进时间" align="center"></el-table-column>
        <el-table-column prop="startTime" label="跟进状态" align="center"></el-table-column>
      </el-table>
        <div class="feedBack">患者反馈：</div>
      </div>
    </div>
    <div style="margin-top: 20px;text-align: right">
      <el-button type="primary" icon="el-icon-add" @click="addWorkOrder">新增工单</el-button>
    </div>
    <div class="foot" style="text-align: center">
      <el-button type="primary" icon="el-icon-add">保存</el-button>
    </div>
    <followStatus :dialogVisible="dialogVisible"></followStatus>
  </div>
</template>

<script>
  import followStatus from './components/followStatus'
  export default {
    name: "taskDetail",
    components:{
      followStatus
    },
    data(){
      return {
        tableData:[{}],
        dialogVisible:false
      }
    },
    methods:{
      addWorkOrder(){
        this.dialogVisible = true
      }
    }
  };
</script>

<style scoped lang="scss">
  .taskBox{
    padding: 20px;
    position: relative;
    min-height: 600px;
    .title{
      margin: 20px 0;
      font-size: 16px;
      font-weight: bold;
    }
    .foot{
       margin-top: 60px;
    }
    .feedBack{
      border: 1px solid #EBEEF5;
      border-top: 0;
      height: 100px;
      margin-bottom: 15px;
      padding: 5px;
    }
  }

</style>
