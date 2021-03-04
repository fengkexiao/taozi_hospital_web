<template>
  <div class="el-card login-card is-always-shadow">
    <img :src="hospitalInfo.logo" style="height: 62px" alt />
    <div class="login-header">
      <p class="login-title">选择医院</p>
    </div>
    <el-form class="form-box">
      <el-form-item>
        <el-radio-group v-model="orgID" class="radio-flex">
          <el-radio
            border
            :label="item.orgID"
            class="radio-css"
            v-for="(item, index) in orgInfo"
            :key="index"
          >{{item.orgName}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" class="btn-login" @click="chooseOrgName">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    loginInfo: Object,
    hospitalInfo: Object,
    orgInfo: Array
  },
  data() {
    return {
      loading: false,
      orgID: ""
    };
  },
  created() {},
  methods: {
    chooseOrgName() {
      this.loading = true;
      let orgID = this.orgID;
      this.$_http
        .post(this.$_API.INTERFACE_LOGIN_ORGID, { ...this.loginInfo, orgID })
        .then(
          res => {
            this.loading = false;
            if (!res.data) return;

            this.$emit("chooseOrgName", res.data);
          },
          res => {
            this.$emit("chooseOrgName", res.data);
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
.radio-css {
  width: 100%;
  background: #fff;
  height: 50px;
  margin-top: 20px;
  margin-left: 0px !important;
}
</style>
