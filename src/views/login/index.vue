
<template>
  <div v-if="isShow">
    <new-login-page :hospitalInfo="hospitalInfo" ></new-login-page>
  </div>
</template>

<script>
import NewLoginPage from "./NewLoginPage";
import defaultLoginBg from "@/assets/image/login-bg.jpg";
import interLoginBg from "@/assets/image/inter-login-bg.jpg";
export default {
  name: "home",
  components: {
    NewLoginPage
  },
  data() {
    return {
      hospitalInfo: {
        bgImage: defaultLoginBg,
        isInter: false,
        name: "云门诊医院管理系统",
        logo: "",
        des: "Cloud medical-hospital management system"
      },
      isShow: false
    };
  },
  created() {
    this.loginHostRequest(window.location.hostname);
  },
  activated() {},
  methods: {
    /**
     * bizCode
     * 0：没有业务
     * 1：首次登陆强制修改密码--不需要图形验证码
     * 2：输入密码错误--需要图形验证码
     */
    // 添加医生信息
    loginHostRequest(domain) {
      let params = { domain: domain };
      this.$_http
        .get(this.$_API.INTERFACE_GET_LOGINHOST, { params })
        .then(res => {
          this.isShow = true;
          if (Object.keys(res.data).length > 0) {
            this.hospitalInfo = {
              logo: res.data.logoUrl,
              name: res.data.hospitalName,
              bgImage: interLoginBg,
              isInter: true,
              des: "互联网医院后台管理系统"
            };
          } else {
            this.hospitalInfo = {
              name: "云门诊医院管理系统",
              logo: "",
              bgImage: defaultLoginBg,
              isInter: false,
              des: "Cloud medical-hospital management system"
            };
          }
        }, () => {
          this.isShow = true;
          this.hospitalInfo = {
            name: "云门诊医院管理系统",
            logo: "",
            bgImage: defaultLoginBg,
            isInter: false,
            des: "Cloud medical-hospital management system"
          };
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
