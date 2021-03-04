<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link v-for="tag in visitedViews" ref="tag" :key="tag.path" :class="isActive(tag) ? 'active' : ''" :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }" tag="span" class="tags-view-item" @click.middle.native="closeHandle(tag)" @contextmenu.prevent.native="openMenu(tag, $event)">
        {{ tag | formatTitle }}
        <span v-if="!tag.meta.noClose" class="el-icon-error" @click.prevent.stop="closeHandle(tag)" />
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li v-if="isActive(selectedTag)" @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!(selectedTag.meta && selectedTag.meta.noClose)" @click="closeHandle(selectedTag)">
        关闭
      </li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ScrollPane from "./ScrollPane";
import path from "path";
const TITLE_MAP = {
  C: "新增",
  E: "编辑",
  V: "详情"
};

export default {
  components: { ScrollPane },
  filters: {
    formatTitle (route) {
      let title = "";
      // 有模式参数
      if (route.params && route.params.mode) {
        if (route.meta && route.meta.modeName) {
          title = route.meta.modeName[route.params.mode];
        }
        if (!title) {
          title = TITLE_MAP[route.params.mode];
        }
      }
      if (title) {
        let pre = route.title ? route.title + "-" : "";
        return pre + title;
      }
      return route.title || "no-name";
    }
  },
  data () {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      noCloseTags: []
    };
  },
  computed: {
    ...mapGetters(["routes"]),
    visitedViews () {
      return this.$store.state.tagsView.visitedViews;
    }
  },
  watch: {
    $route () {
      this.addTags();
      this.moveToCurrentTag();
    },
    visible (value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    }
  },
  mounted () {
    this.initTags();
    this.addTags();
  },
  methods: {
    isActive (route) {
      const isParent = this.$route.meta.noTag && route.path === this.$route.meta.parent;
      return route.path === this.$route.path || isParent;
    },
    filterAffixTags (routes, basePath = "/") {
      let tags = [];
      routes.forEach(route => {
        if (route.meta && route.meta.noClose) {
          const tagPath = path.resolve(basePath, route.path);
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          });
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path);
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags];
          }
        }
      });
      return tags;
    },
    initTags () {
      const noCloseTags = (this.noCloseTags = this.filterAffixTags(
        this.routes
      ));
      for (const tag of noCloseTags) {
        this.$store.dispatch("tagsView/addVisitedView", tag);
      }
    },
    addTags () {
      if (!this.$route.meta.noTag) {
        this.$store.dispatch("tagsView/addView", this.$route);
      }
    },
    moveToCurrentTag () {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag);
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch("tagsView/updateVisitedView", this.$route);
            }
            break;
          }
        }
      });
    },
    // 刷新页面
    refreshSelectedTag (view) {
      this.$store.dispatch("tagsView/delCachedView", view).then(() => {
        this.$emit("reload");
      });
    },
    closeHandle (view) {
      this.closeSelectedTag(view).then(({ visitedViews }) => {
        if (visitedViews) {
          this.toLastView(visitedViews, view);
        }
      });
    },
    closeSelectedTag (view) {
      return new Promise(resolve => {
        this.$store.dispatch("tagsView/delView", view).then(res => {
          if (this.isActive(view)) {
            resolve(res);
          }
          resolve({});
        });
      });
    },
    closeOthersTags () {
      this.$router.push(this.selectedTag);
      this.$store
        .dispatch("tagsView/delOthersViews", this.selectedTag)
        .then(() => {
          this.moveToCurrentTag();
        });
    },
    closeAllTags (view) {
      this.$store.dispatch("tagsView/delAllViews").then(({ visitedViews }) => {
        if (this.noCloseTags.some(tag => tag.path === view.path)) {
          return;
        }
        this.toLastView(visitedViews, view);
      });
    },
    toLastView (visitedViews, view) {
      console.log(visitedViews);
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView);
      } else {
        this.$router.push("/");
      }
    },
    openMenu (tag, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 15; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }

      this.top = e.clientY;
      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu () {
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 44px;
  width: 100%;
  //border-bottom: 1px solid #d8dce5;
  // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 35px;
      line-height: 35px;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      color: #000000d9;
      background-color: #f5f5f5;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 8px;
      // margin-top: 5px;
      min-width: 60px;
      text-align: center;
      &::before {
        content: "";
        background-color: #d9d9d9;
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        position: relative;
        margin-right: 4px;
        top: -1px;
      }
      &:first-of-type {
        margin-left: 20px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      .el-icon-error{
        color:#d9d9d9;
      }
      &.active {
        background-color: rgba(67, 139, 239, 0.1);
        color: #438befff;
        border: 1px solid #438bef;
        &::before {
          background-color: #06d800ff;
        }
        .el-icon-error{
        color:#438BEFFF;
      }
      }
      
    }
  }
  .contextmenu {
    margin: 0;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    background-color: #f1f4fb;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.8);
        display: inline-block;
        font-weight: 700;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
