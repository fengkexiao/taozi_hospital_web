<template>
  <component :is="containName" v-loading.lock="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
    element-loading-background="#f8f9fbcc" v-bind="$attrs" v-on="$listeners">
    <slot />
  </component>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    // 容器名称
    containName: {
      type: String,
      default() {
        return "div";
      }
    },
    // loading属性
    loading: {
      type: Boolean,
      default() {
        return false;
      }
    }
  }
};
</script>
