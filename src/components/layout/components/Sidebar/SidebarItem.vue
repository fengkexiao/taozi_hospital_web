<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template v-if="hasOneShowingChild(item.children, item)">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child" :base-path="resolvePath(child.path)" class="nest-menu" />
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ""
    }
  },
  data () {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    this.onlyOneChild = null;
    return {};
  },
  methods: {
    hasOneShowingChild (children = [], parent) {
      const showingChildren = children.filter(item => !item.hidden);

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "" };
        return true;
      }

      return false;
    },
    resolvePath (routePath) {
      if (/^(https?:|mailto:|tel:)/.test(routePath)) {
        return routePath;
      }
      if (/^(https?:|mailto:|tel:)/.test(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    }
  }
};
</script>
