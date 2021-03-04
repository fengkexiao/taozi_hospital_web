<template>
    <el-dialog
            :visible.sync="dialogVisible"
            width="680px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            :before-close="handleClose">
        <div slot="title" class="dialog-title">跟进状态<i class="el-icon-close" style="float: right;cursor: pointer" @click="close"></i></div>
        <el-form label-width="120px">
            <el-form-item label="跟进状态：">
                <el-radio-group v-model="radio">
                    <el-radio :label="item.value" v-for="(item, index) in status" :key="index">{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="患者反馈：">
                <el-input type="textarea" v-model="feedBack" :autosize="{minRows:4,maxRows:8}" maxlength="100" show-word-limit></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
  export default {
    name: "followStatus",
    props:['dialogVisible'],
    data() {
      return {
        radio:"",
        feedBack:"",
        status:[
          {
            label: "已短信患者回复",
            value: 0
          },
          {
            label:"已电联患者回复",
            value: 1
          },
          {
            label:"已联系无回复",
            value: 2
          },
          {
            label:"患者无意向",
            value: 3
          },
          {
            label:"需另外预约时间",
            value: 4
          },
          {
            label:"患者投诉",
            value: 5
          }
        ]
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
    /deep/ .el-radio-group{
        display: flex;
        flex-direction: column;
       /deep/ .el-radio{
           margin: 5px 0;
       }
    }
    /deep/ .el-radio__input.is-checked + .el-radio__label {
        color: #595959;
    }
</style>
