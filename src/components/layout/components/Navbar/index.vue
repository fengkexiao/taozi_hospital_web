<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <span class="right-menu-item staff-name">{{userInfo.staffName}}</span>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" @command="command">
        <div class="avatar-wrapper">
          <base-image :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item command="home">首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item command="password">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout" divided>
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "./Breadcrumb";
import Hamburger from "./Hamburger";
import avatar from "@/assets/image/default-avatar.png";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data () {
    return {
      avatar
    };
  },
  computed: {
    ...mapGetters(["sidebar", "device", "userInfo"])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch("app/toggleSideBar");
    },
    command (e) {
      switch (e) {
        case "home":
          break;
        case "password":
          this.$emit("changePsssword");
          break;
        case "logout":
          this.logout();
      }
    },
    async logout () {
      await this.getDoctroStatus()
      this.$_http.post(this.$_API.INTERFACE_LOGOUT).then(() => {
        window.location.reload();
        this.$store.dispatch("user/logout");
      });
    },
    // 获取药师在线状态
    async getDoctroStatus () {
      const res = await this.$_http.post(this.$_API.INTERFACE_RP_POST_DOCTORSTATUS, {
        staffID: this.userInfo.keyID
      });
      if (res.data) {
        if (res.data.offlineType === 0 || res.data.offlineType === 3) {
          let params = {
            keyID: res.data.keyID,
            doctorTypeID: 3,
            staffID: this.userInfo.keyID
          };
          // 退出
          const dRes = await this.$_http.post(this.$_API.INTERFACE_RP_POST_UPDATERECORD, params);
          if (dRes.data) {
            sessionStorage.removeItem('rpOnline');
          }
        }
      } else {
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 64px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 64px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      // padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
      }
    }

    .staff-name {
      font-size: 14px;
      margin-right: 10px;
    }

    .avatar-container {
      margin-right: 10px;

      .avatar-wrapper {
        display: flex;
        height: 64px;
        justify-content: center;
        align-items: center;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 100px;
          margin: 0;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          font-size: 12px;
          color: #5a5e66;
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
