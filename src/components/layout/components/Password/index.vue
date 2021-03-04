<template>
  <el-dialog :visible.sync="visible" class="popup-password" :title="title" :close-on-click-modal="false"
    :close-on-press-escape="false" :before-close="cancel" width="30%">
    <el-form ref="formPassword" :model="formData" :rules="formRules">
      <el-form-item label="原密码：" prop="oldPwd">
        <base-input v-model="formData.oldPwd" type="password" :clearable="false" show-password label-name="原密码" />
      </el-form-item>
      <el-form-item label="新密码：" prop="newPwd">
        <base-input v-model="formData.newPwd" type="password" :clearable="false" show-password label-name="新密码" />
      </el-form-item>
      <el-form-item label="确认密码：" prop="confirmPwd">
        <base-input v-model="formData.confirmPwd" type="password" :clearable="false" show-password
          @keyup.enter.native="save" placeholder="请确认新密码" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button :loading="popHandling" type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    // 控制显示
    visible: {
      type: Boolean,
      default() {
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
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      formData: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: ""
      },
      formRules: {
        oldPwd: {
          required: true,
          message: "原密码不能为空"
        },
        newPwd: {
          required: true,
          message: "新密码不能为空"
        },
        confirmPwd: [
          {
            required: true,
            message: "确认密码不能为空"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  watch: {
    visible(val) {
      if (!val) {
        // 重置表单
        this.$refs.formPassword.resetFields();
      }
    }
  },
  methods: {
    // 点击取消处理
    cancel() {
      this.$emit("update:visible", false);
    },
    // 点击确定处理
    save() {
      if (this.popHandling) {
        return;
      }
      this.$refs.formPassword.validate(valid => {
        if (!valid) {
          return;
        }
        if (this.formData.newPwd !== this.formData.confirmPwd) {
          this.$_error("两次输入的密码不一致!");
          return;
        }
        this.changePassword();
      });
    },
    // 修改密码
    changePassword() {
      const data = {
        keyId: this.userInfo.keyID,
        phone: this.userInfo.phone,
        oldPass: this.formData.oldPwd,
        newPass: this.formData.newPwd
      };
      this.$_http
        .post(this.$_API.INTERFACE_USER_CHANGE_PASSWORD, data)
        .then(res => {
          this.$_success("修改密码成功");
          this.cancel();
        });
    }
  }
};
</script>
<style lang="scss">
.popup-password {
  .el-dialog {
    max-width: 800px;
  }
  .el-form-item {
    display: flex;
    justify-content: center;
  }
  .el-form-item__label {
    width: 100px;
  }
}
</style>
