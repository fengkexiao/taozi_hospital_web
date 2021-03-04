<template>
  <el-dialog :visible.sync="visible" class="popup-vertify" :title="title" :close-on-click-modal="false" width="500px" :close-on-press-escape="false" :before-close="cancel">
    <el-form ref="formVertify" :model="formData" :rules="formRules" label-width="150px">
      <el-form-item label="账户名称：" prop="accountName">
        <el-input v-model="formData.accountName" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="账号：" prop="accountNo">
        <el-input v-model="formData.accountNo" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="开户行：" prop="accountBank">
        <el-input v-model="formData.accountBank" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="提现金额：" prop="amount">
        <el-input v-model="formData.amount" placeholder="请输入" clearable />元
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
      <el-button :loading="popHandling" type="primary" @click="submit">确定</el-button>
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
    },
    propdata: {
      type: Number,
      required: true
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
        accountNo: {
          required: true,
          message: "账号不能为空"
        },
        amount: {
          required: true,
          pattern: /^\d+$|^\d+[.]?\d+$/,
          message: "提现金额有误"
        },
        accountBank: {
          required: true,
          message: "开户行不能为空"
        },
        accountName: {
          required: true,
          message: "账户名称不能为空"
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
    submit () {
      if (this.popHandling) {
        return;
      }
      if (this.formData.amount * 100 > this.propdata) {
        this.$alert("提现金额大于您的余额！", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      this.$refs.formVertify.validate(valid => {
        if (!valid) {
          return;
        }
        this.$emit("submit", this.formData);
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
