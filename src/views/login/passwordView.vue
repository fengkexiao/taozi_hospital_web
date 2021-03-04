<template>
  <div class="el-card login-card">
    <img :src="hospitalInfo.logo" style="height: 62px" alt />
    <div class="login-header">
      <p class="login-title" style="magin-top: 70px">修改密码</p>
    </div>
    <el-form :model="params" ref="pass" :rules="passRules" class="form-box">
      <el-form-item prop="oldPass">
        <el-input
          type="password"
          v-model.trim="params.oldPass"
          placeholder="请输入初始密码"
          show-password
          maxlength="20"
          @keyup.enter.native="validate"
          class="input-item"
        >
          <template #prefix>
            <svg-icon icon-class="lock" class="icon-class" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="newPass">
        <el-input
          type="password"
          v-model.trim="params.newPass"
          placeholder="请输入新密码"
          show-password
          maxlength="20"
          @keyup.enter.native="validate"
          class="input-item"
        >
          <template #prefix>
            <svg-icon icon-class="lock" class="icon-class" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="againPass">
        <el-input
          type="password"
          v-model.trim="params.againPass"
          placeholder="请再次输入新密码"
          show-password
          maxlength="20"
          @keyup.enter.native="validate"
          class="input-item"
        >
          <template #prefix>
            <svg-icon icon-class="lock" class="icon-class" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          class="btn-login"
          @click="updatePassValidate"
        >确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    hospitalInfo: Object,
    info: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      params: {
        keyID: "",
        oldPass: "",
        newPass: "",
        phone: "",
        orgID: "",
        againPass: ""
      },
      loading: false,
      passRules: {
        oldPass: [
          {
            required: true,
            message: "请输入初始密码"
          }
        ],
        newPass: [
          {
            required: true,
            message: "请输入新密码"
          }
        ],
        againPass: [
          {
            required: true,
            message: "请再次输入新密码"
          }
        ]
      }
    };
  },
  watch: {
    info(val) {
      if (val) {
        this.params.keyID = val.keyID;
        this.params.phone = val.phone;
        this.params.orgID = val.orgID;
      }
    }
  },
  created() {},
  methods: {
    /**
     * 验证更新密码表单
     */
    updatePassValidate() {
      this.$refs.pass.validate(valid => {
        if (!valid) {
          return;
        }
        if (this.params.newPass !== this.params.againPass) {
          this.$_error("新密码两次输入不一致");
          return;
        }
        this.updatePass();
      });
    },
    /**
     * 密码更新
     */
    updatePass() {
      this.loading = true;
      this.$_http
        .post(this.$_API.INTERFACE_UPDATEPASSA_LOGIN, this.params)
        .then(
          res => {
            this.loading = false;
            this.$emit("updatePass", res.data);
          },
          res => {
            this.loading = false;
          }
        )
        .catch(it => {
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
$card-height: 63vh;
$input-height: 3vw;
$icon-color: #438aef;
.login-card {
  position: absolute;
  top: 50vh - $card-height / 2;
  left: 52.5vw;
  width: 31.5vw;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 33px 64px 100px 64px;
}
.login-header {
  padding-top: 1.5vw;
  text-align: center;
  .login-title {
    font-size: 1.5vw;
    font-family: PingFang SC;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
  }
  .title-en {
    font-size: 1.3vw;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
}
.form-box {
  padding-top: 1.1vw;
  .input-item {
    width: 100%;
    max-width: unset;
    font-size: 1.1vw;
    margin-bottom:16px;
    .el-icon-circle-close {
      cursor: pointer;
    }
  }
}
.btn-login {
  width: 100%;
  height: $input-height;
  color: white;
  font-size: 1.2vw;
  font-weight: bold;
  margin-top: 1.6vw;
  background-color: $icon-color;
}
.authCode {
  font-size: 1vw;
  height: $input-height;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.authCodeImage {
  height: $input-height;
}
</style>
<style lang="scss">
$icon-color: #438aef;
$input-height: 3vw;
.input-item {
  input {
    color: black;
    caret-color: $icon-color;
    border-radius: 0.4vw;
    font-size: 1vw;
  }
  &.el-input--prefix .el-input__inner {
    height: $input-height;
    padding-left: 2vw;
  }
  &.el-input .el-input__clear {
    font-size: unset;
  }
  .el-input__prefix {
    height: 100%;
    line-height: 36px;
    width: 1.5vw;
    .el-input__icon {
      color: #7f7f7f;
      width: unset;
    }
  }
  .el-input__suffix .el-input__icon {
    color: #7f7f7f;
  }
  .icon-class {
    color: #7f7f7f;
    height: 100% !important;
    line-height: 36px;
  }
}
</style>
