
<template>
  <div class="el-card login-card is-always-shadow">
    <img :src="hospitalInfo.logo" style="height: 62px" alt />
    <div class="login-header">
      <p class="login-title">{{hospitalInfo.name}}</p>
      <p
        class="title-en"
      >{{hospitalInfo.isInter ? '互联网医院后台管理系统' : 'Cloud medical-hospital management system'}}</p>
    </div>
    <el-form :model="loginInfo" ref="login" :rules="rules" class="form-box">
      <el-form-item prop="phone">
        <base-input
          v-model.trim="loginInfo.phone"
          label-name="账号"
          form-type="phone"
          class="input-item"
          prefix-icon="el-icon-s-custom"
          :show-word-limit="false"
          :clearable="false"
        >
          <template v-if="loginInfo.phone" #suffix>
            <i class="el-input__icon el-icon-circle-close" @click="clear"></i>
          </template>
        </base-input>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input
          type="password"
          v-model.trim="loginInfo.pass"
          placeholder="请输入密码"
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
      <el-form-item v-show="isShowAuthCode">
        <base-input
          v-model.trim="loginInfo.authCode"
          label-name="验证码"
          class="input-item"
          prefix-icon="el-icon-s-custom"
          :show-word-limit="false"
          :clearable="false"
        >
          <template #suffix>
            <div class="authCode" v-if="!authCodeImageData" @click="fetchAuthCode">
              <el-button>获取验证码</el-button>
            </div>
            <img class="authCodeImage" :src="authCodeImageData" @click="fetchAuthCode" alt />
          </template>
        </base-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" class="btn-login" @click="validate">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    hospitalInfo: Object
  },
  data() {
    return {
      loginInfo: {
        phone: "",
        pass: "",
        authCode: ""
      },
      loading: false,
      rules: {
        phone: [
          {
            required: true,
            message: "请输入手机号"
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        pass: [
          {
            required: true,
            message: "请输入密码"
          }
        ]
      },
      authCodeImageData: "",
      isShowAuthCode: false
    };
  },
  created() {},
  methods: {
    /**
     * 校验验证码
     */
    verifiAuthCode() {
      if (!this.loginInfo.phone) {
        this.$_error("请先输入手机号");
        return;
      }
      if (!this.loginInfo.authCode) {
        this.$_error("请先输入验证码");
        return;
      }
      let params = {
        phone: this.loginInfo.phone,
        verifiCode: this.loginInfo.authCode
      };
      this.$_http
        .get(this.$_API.INTERFACE_GET_AUTHVERIFICODE, { params })
        .then(res => {
          if (res.data) {
            this.login();
          } else {
            this.$_error("验证失败");
          }
        });
    },
    /**
     * 获取验证码
     */
    fetchAuthCode() {
      if (!this.loginInfo.phone) {
        this.$_error("请先输入手机号");
        return;
      }
      let params = {
        phone: this.loginInfo.phone
      };
      this.$_http
        .get(this.$_API.INTERFACE_GET_FETCHAUTHCODE, { params })
        .then(res => {
          if (res.data) {
            this.authCodeImageData = res.data.replace(/[\r\n]/g, "");
          }
        });
    },
    // 验证登录表单
    validate() {
      this.$refs.login.validate(valid => {
        if (!valid) {
          return;
        }
        if (this.isShowAuthCode) {
          this.verifiAuthCode();
        } else {
          this.login();
        }
      });
    },
    // 登录处理
    login() {
      this.loading = true;
      this.$_http
        .post(this.$_API.INTERFACE_LOGIN, this.loginInfo)
        .then(
          res => {
            this.isShowAuthCode = false;
            this.loading = false;
            if (!res.data) return;
            this.$emit("loginViewAction", {
              data: res.data,
              loginInfo: this.loginInfo
            });
          },
          res => {
            this.isShowAuthCode = res.data.data.bizCode === 2 && true;
            this.$emit("loginViewAction", {
              data: res.data,
              loginInfo: this.loginInfo
            });
            this.loading = false;
          }
        )
        .catch(it => {
          console.log("登录处理错误2------------", it);
          this.loading = false;
        });
    },
    // 清空
    clear() {
      this.loginInfo.phone = "";
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
    font-size: 1.1vw;
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
.mb24{
  margin-bottom:24px;
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
