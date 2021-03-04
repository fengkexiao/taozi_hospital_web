<template>
  <el-dialog
          :visible.sync="dialogVisible"
          width="1140px"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :show-close="false"
          >
    <div slot="title" class="dialog-title">任务详情<i class="el-icon-close" style="float: right;cursor: pointer" @click="close"></i></div>
    <div class="taskDetailBody">
      <div class="box">
       <div class="title" style="margin-top: 0">任务详情：</div>
        <el-table :data="tableData" border fit>
          <el-table-column prop="couponName" label="任务号" align="center"></el-table-column>
          <el-table-column prop="startTime" label="患者姓名" align="center"></el-table-column>
          <el-table-column prop="endTime" label="电话" align="center"></el-table-column>
          <el-table-column prop="couponName" label="计划回访时间" align="center"></el-table-column>
          <el-table-column prop="startTime" label="购药状态" align="center"></el-table-column>
          <el-table-column prop="keyID" label="最终/当前处理专员" align="center">
            <template slot-scope="scope">
              <el-select v-model="value" placeholder="请选择">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="box">
        <div class="title">处理结果流转详情：</div>
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
      <div class="box">
        <div class="title">备注：</div>
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请填写备注"></el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">保存</el-button>
        <el-button type="primary" @click="dialogVisible = false">手动结束</el-button>
      </span>
  </el-dialog>
</template>

<script>
  export default {
    name: "taskDetail",
    props:['dialogVisible'],
    data() {
      return {
        tableData:[{}],
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
      };
    },
    methods: {
      close(done) {
        this.$confirm('确认关闭？')
                .then(_ => {
                  done();
                })
                .catch(_ => {});
      }
    }
  };
</script>

<style scoped lang="scss">
  .dialog-title {
    padding-bottom: 20px;
    border-bottom: 1px solid #E8E8E8;
    text-align: left;
    font-size: 18px;
    font-weight: bold;
    color: rgba(42, 44, 48, 1);
  }
  /deep/ .el-dialog__body{
    padding-top: 0;
  }
.taskDetailBody{
  .title{
    margin: 20px 0;
    font-size: 16px;
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
