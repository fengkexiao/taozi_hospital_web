<template>
  <div class="display-inline-block">
    <transition mode="out-in">
      <el-button v-if="!sended" type="primary" plain round @click="getVerificationCode" v-on="$listeners">获取验证码
      </el-button>
      <el-tag v-else type="info">重新获取（{{ time }}秒）</el-tag>
    </transition>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
const reg = /^1[3-9]\d{9}$/;
export default {
  inheritAttrs: false,
  props: {
    // 接收验证码的手机号码
    phoneNo: {
      required: true,
      type: String
    },
    // 倒计时时间，默认60秒
    countdown: {
      type: [String, Number],
      default() {
        return 60;
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      sended: false,
      time: this.countdown
    };
  },
  methods: {
    // 点击【获取验证码】按钮
    getVerificationCode(e) {
      if (this.sended) {
        return;
      }
      if (!this.phoneNo) {
        this.$_warning("请先输入手机号");
        return;
      }
      // 可以单独处理点击事件
      if (this.$listeners.click) {
        return;
      }
      if (!reg.test(this.phoneNo)) {
        return;
      }
      this.sended = true;
      this.$_http
        .post(this.$_API.INTERFACE_USER_DOCTOR_VALICODE_GET, {
          phone: this.phoneNo,
          orgID: this.userInfo.orgID
        })
        .then(this.sendSuccess)
        .catch(() => (this.sended = false));
    },
    // 发送验证码成功后的回调
    sendSuccess() {
      const interval = setInterval(it => {
        if (this.time > 1) {
          this.time--;
          return;
        }
        clearInterval(interval);
        this.reset();
      }, 1000);
    },
    // 重置组件状态
    reset() {
      this.sended = false;
      this.time = this.countdown;
    }
  }
};
</script>
