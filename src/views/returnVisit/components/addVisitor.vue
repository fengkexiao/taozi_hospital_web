<template>
    <el-dialog
            :visible.sync="dialogVisible"
            width="30%"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            >
        <div slot="title" class="dialog-title">创建回访专员<i class="el-icon-close" style="float: right;cursor: pointer" @click="close"></i></div>
      <div>
          <el-form label-width="80px">
              <el-form-item label="姓名：">
                  <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="账号：">
                  <el-input v-model="form.phone"></el-input><el-button style="margin-left: 15px">获取验证码</el-button>
              </el-form-item>
              <el-form-item label="验证码：">
                  <el-input v-model="form.code"></el-input>
              </el-form-item>
              <el-checkbox v-model="checked">同时在“员工管理”列表生成员工账号</el-checkbox>
          </el-form>
      </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 认</el-button>
      </span>
    </el-dialog>
</template>

<script>
  export default {
    name: "addVisitor",
    props:['dialogVisible'],
    data() {
      return {
        checked:false,
        form:{
          name:"",
          phone:"",
          code:""
        }
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

<style scoped>
    .dialog-title {
        padding-bottom: 20px;
        border-bottom: 1px solid #E8E8E8;
        text-align: left;
        font-size: 18px;
        font-weight: bold;
        color: rgba(42, 44, 48, 1);
    }
</style>
