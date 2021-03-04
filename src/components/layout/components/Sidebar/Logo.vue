<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link key="collapse" class="sidebar-logo-link" to="/">
        <div class="page-title">
          <img v-if="logo" :src="logo" class="sidebar-logo" />
          <h1 v-if="!collapse || !logo" class="sidebar-title">{{ title }}</h1>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      logo: "/logo.png"
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    title() {
      return this.userInfo.orgName;
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}


.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 64px;
  line-height: 64px;
  background:linear-gradient(270deg,rgba(93,180,242,1) 0%,rgba(59,140,237,1) 100%);
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    .page-title {
      display: flex;
      height: 64px;
      justify-content: center;
      align-items: center;
    }

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 4px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      white-space: nowrap;
      word-break: keep-all;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
