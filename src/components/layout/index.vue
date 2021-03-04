<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <sidebar class="sidebar-container" />
    <div class="hasTagsView main-container">
      <div class="fixed-header">
        <navbar @changePsssword="visible = true" />
        <tags-view ref="tagsView" @reload="reload" />
      </div>
      <app-main :active="active" />
    </div>
    <password :visible.sync="visible" title="修改密码" />
    <dialog-video :visible.sync="showVideo" :inquiry-info="inquiry.info" :receive="inquiry.receive" :refuse="inquiry.refuse" />
  </div>
</template>

<script>
import {
  AppMain,
  Navbar,
  Sidebar,
  TagsView,
  Password,
  DialogVideo
} from "./components";
import { setWaterMark } from "./../../utils/waterMark";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState, mapGetters } from "vuex";
const noop = () => { };
export default {
  name: "Layout",
  provide () {
    return {
      reload: this.reload,
      close: this.close,
      handleVideo: this.handleVideo
    };
  },
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView,
    Password,
    DialogVideo
  },
  mixins: [ResizeMixin],
  data: function () {
    return {
      active: true,
      visible: false,
      showVideo: false,
      inquiry: {
        info: {},
        receive: noop,
        refuse: noop
      }
    };
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device
    }),
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    },
    ...mapGetters(["userInfo"])
  },
  created () {
    this.$nextTick(() => {
      setWaterMark(this.userInfo.staffName);
    });
  },
  methods: {
    handleClickOutside () {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
    // 刷新页面
    reload () {
      this.active = false;
      this.$nextTick(() => {
        this.active = true;
      });
    },
    // 关闭当前页面
    close () {
      return this.$refs.tagsView.closeSelectedTag(this.$route);
    },
    // 收到视频请求
    handleVideo (show, inquiry) {
      console.log("弹框消息", inquiry);
      this.showVideo = show;
      if (show) this.inquiry = inquiry;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/frame/mixin.scss";
@import "~@/styles/frame/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  background-color: $headerBg;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
