<template>
  <div class="container" :style="{backgroundImage:'url('+hospitalInfo.bgImage+')'}">
    <login-view
      v-show="isShowLoginView"
      :hospitalInfo="hospitalInfo"
      @loginViewAction="loginViewAction"
    ></login-view>
    <password-view
      :info="updatePassInfo"
      v-show="isShowUpdatePass"
      :hospitalInfo="hospitalInfo"
      @updatePass="updatePass"
    ></password-view>
    <!-- 选择医院界面 -->
    <selected-hospital-view
      v-show="isShowSelectedOrg"
      :hospitalInfo="hospitalInfo"
      :loginInfo="loginInfo"
      :orgInfo="orgInfo"
      @chooseOrgName="chooseOrgName"
    ></selected-hospital-view>
  </div>
</template>

<script>
import passwordView from "./passwordView";
import selectedHospitalView from "./selectedHospitalView";
import loginView from "./loginView";
export default {
  components: {
    passwordView,
    selectedHospitalView,
    loginView
  },
  props: {
    hospitalInfo: Object,
    // 是否是互联网医院入口
    isInterHospital: Boolean
  },
  data() {
    return {
      updatePassInfo: {},
      loginInfo: {},
      orgInfo: [],
      isShowLoginView: true,
      isShowUpdatePass: false,
      isShowSelectedOrg: false
    };
  },
  created() {},
  methods: {
    /**
     * 登录组件事件
     */
    loginViewAction(event) {
      let res = event.data;
      this.loginInfo = event.loginInfo;

      if (res.code === 1) {
        if (res.data.bizCode === 1) {
          this.updatePassInfo = res.data;
          this.isShowUpdatePass = true;
          this.isShowLoginView = false;
          this.isShowSelectedOrg = false;
        }
      } else {
        if (Array.isArray(res) === false) {
          this.$store.commit("user/SET_LOGIN", res);
          this.loadMenus(res);
          this.addUserInfo(res);
        } else {
          this.orgInfo = res;
          this.isShowUpdatePass = false;
          this.isShowLoginView = res.length === 0;
          this.isShowSelectedOrg = res.length > 0;
        }
      }
    },
    /**
     * 选择医院组件事件
     */
    chooseOrgName(res) {
      if (res.code === 1) {
        if (res.data.bizCode === 1) {
          this.isShowUpdatePass = true;
          this.isShowSelectedOrg = false;
          this.isShowLoginView = false;
          this.updatePassInfo = res.data;
        }
      } else {
        if (!res) return;
        this.$store.commit("user/SET_LOGIN", res);
        this.loadMenus(res);
        this.addUserInfo(res);
      }
    },
    /**
     * 密码更新组件事件
     */
    updatePass(data) {
      if (!data) return;
      this.isShowSelectedOrg = false;
      this.isShowLoginView = false;
      this.$store.commit("user/SET_LOGIN", data);
      this.loadMenus(data);
      this.addUserInfo(data);
    },
    // 添加userInfo数据（2020-01-08添加医生医助信息）
    addUserInfo(userInfo) {
      // 添加医生信息
      this.addDoctorInfo(userInfo);
    },
    // 添加医生信息
    addDoctorInfo(userInfo) {
      let params = { staffID: userInfo.keyID };
      let addInfo = {};
      let doctorInfo = {};
      // 默认添加为医生类型
      addInfo.jobType = 0;
      this.$store.commit("user/ADD_USERINFO", addInfo);
      this.$_http
        .get(this.$_API.INTERFACE_GET_DOCTOR_INFO, { params })
        .then(res => {
          if (!res.data) return;
          if (res.data.doctorID) addInfo.doctorID = res.data.doctorID;
          if (res.data.jobType !== null) {
            addInfo.jobType = res.data.jobType || 0;
          }
          doctorInfo = res.data;
          addInfo.doctorInfo = doctorInfo;
          this.$store.commit("user/ADD_USERINFO", addInfo);
        });
    },
    // 获取菜单
    loadMenus(userInfo) {
      let params = {
        orgID: userInfo.orgID,
        staffID: userInfo.keyID,
        sysCode: "hospital-web"
      };
      this.$_http
        .get(this.$_API.INTERFACE_USER_FEATURES, { params })
        .then(res => {
          if (!res.data) return;
          const menus = this.combineMenu(res.data);
          this.$store.commit("user/SET_MENU", menus);
          this.$router.push(this.$route.query.redirect || "/");
        })
        .catch(e => {
          let status = e && e.response && e.response.status;
          // 401在共通已处理
          if (status !== 401) {
            window.location.reload();
            this.$store.dispatch("user/logout");
          }
        });
    },
    // 重组菜单
    combineMenu(data) {
      let menus = [];
      if (!Array.isArray(data)) {
        return menus;
      }
      data.forEach(item => {
        // 父菜单是否存在
        let existed = menus.some(it => {
          return it.featureCode === item.pFeatureCode;
        });
        if (existed) {
          let index = menus.findIndex(it => {
            return it.featureCode === item.pFeatureCode;
          });
          // 在父菜单中加入子菜单
          menus[index].children.push({
            sortNo: item.sortNo,
            featureCode: item.featureCode,
            path: item.pageUrl,
            meta: {
              title: item.featureName,
              icon: item.icon
            },
            parentCode: item.pFeatureCode
          });
          return;
        }
        menus.push({
          // 父菜单
          sortNo: item.pSortNo,
          featureCode: item.pFeatureCode,
          path: item.pFeatureCode + item.pSortNo,
          meta: {
            title: item.pFeatureName,
            icon: item.pIcon
          },
          parentCode: "",
          // 子菜单
          children: [
            {
              sortNo: item.sortNo,
              featureCode: item.featureCode,
              path: item.pageUrl,
              meta: {
                title: item.featureName,
                icon: item.icon
              },
              parentCode: item.pFeatureCode
            }
          ]
        });
      });
      // 排序
      menus.sort((pre, next) => {
        return pre.sortNo - next.sortNo;
      });
      menus.forEach(item => {
        item.children.sort((pre, next) => {
          return pre.sortNo - next.sortNo;
        });
      });
      // 添加首页
      menus.unshift({
        path: "/home",
        sortNo: 0,
        meta: { title: "首页", icon: "home", noClose: true }
      });
      return menus;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  background-image: url("../../assets/image/inter-login-bg.jpg");
  background-size: cover;
  height: 100vh;
  width: 100vw;
}
</style>
