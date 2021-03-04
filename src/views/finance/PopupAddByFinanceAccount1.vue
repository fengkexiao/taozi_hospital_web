<template>
  <el-dialog :visible.sync="visible" class="popup-vertify" :title="title" :close-on-click-modal="false" width="500px" :close-on-press-escape="false" :before-close="cancel">
    <el-form ref="formVertify" :model="formData" :rules="formRules" label-width="150px">
      <el-form-item label="收款账户信息：">
        <div class="color">账户名称：四川睡呗科技有限公司</div>
        <div class="color">开户行：中国建设银行股份有限公司成都益州支行</div>
        <div class="color">账号：51001416185052506836</div>
      </el-form-item>
      <el-form-item label="充值金额：" prop="amount">
        <el-input v-model="formData.amount" placeholder="请输入" clearable />元
      </el-form-item>
      <el-form-item label="打款户名：" prop="accountName">
        <el-input v-model="formData.accountName" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="联系人：" prop="linkName">
        <el-input v-model="formData.linkName" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="联系电话：" prop="linkPhone">
        <el-input v-model="formData.linkPhone" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input class="input" type="textarea" v-model="formData.remark" placeholder="请输入" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="popHandling" type="primary" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    // 控制显示
    visible: {
      type: Boolean,
      default () {
        return false;
      }
    },
    // 弹窗标题
    title: {
      type: String,
      required: true
    },
    // 弹窗是否在处理中
    popHandling: {
      type: Boolean,
      default () {
        return false;
      }
    }
  },
  data () {
    return {
      checked: false,
      formData: {
        amount: "",
        accountName: "",
        linkName: "",
        accountBank: "",
        accountNo: "",
        linkPhone: "",
        remark: "",
        whetherStaff: false
      },
      formRules: {
        amount: {
          required: true,
          pattern: /^\d+$|^\d+[.]?\d+$/,
          message: "充值金额有误"
        },
        accountName: {
          required: true,
          message: "打款户名不能为空"
        },
        linkName: {
          required: true,
          message: "联系人不能为空"
        },
        linkPhone: {
          required: true,
          pattern: /^1[3-9]\d{9}$/,
          message: "联系电话错误"
        }
      }
    };
  },
  // watch: {
  //   propdata() {
  //     console.log(this.propdata, 222);
  //     this.formData = JSON.parse(JSON.stringify(this.propdata));
  //   }
  // },
  methods: {
    cancel () {
      this.$emit("update:visible", false);
    },
    // 点击确定处理
    save () {
      if (this.popHandling) {
        return;
      }
      this.$refs.formVertify.validate(valid => {
        if (!valid) {
          return;
        }
        this.$emit("save", this.formData);
      });
    }
  }
};
</script>
<style>
.popup-vertify > .el-dialog {
  max-width: 700px;
}
el-input {
  width: 300px;
}
.color {
  color: red;
}
.input {
  width: 200px;
}
</style>
