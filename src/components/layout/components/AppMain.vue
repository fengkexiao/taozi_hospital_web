<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view v-if="active" :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  props: {
    active: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.fullPath;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/frame/variables.scss";
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh );
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #F0F2F5;
  box-sizing: border-box;
  //padding: 24px;
}

.fixed-header + .app-main {
  padding-top: 50px;
 // height: 100vh;
  overflow: auto;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh);
  }

  .fixed-header + .app-main {
    padding-top: 124px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
  }
}
</style>
