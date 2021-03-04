<template>
  <div class="has-logo">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg" :text-color="textColor" :unique-opened="false" :active-text-color="activeTextColor" :collapse-transition="false" mode="vertical" @select="handleSelect">
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/frame/variables.scss";
export default {
  components: { SidebarItem, Logo },
  data () {
    return {
      activeTextColor: '#438BEF',
      textColor: '#A4A9AD'
    }
  },
  computed: {
    ...mapGetters(["routes", "sidebar"]),
    activeMenu () {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    variables () {
      return variables;
    },
    isCollapse () {
      return !this.sidebar.opened;
    }
  },
  methods: {
    handleSelect (key, path) {
      
    }
  }
};
</script>
