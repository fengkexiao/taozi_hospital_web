<template>
  <el-image :fit="fit" class="peach-image" v-bind="$attrs" v-on="$listeners">
    <template #placeholder>
      <base-loading loading class="peach-image" />
    </template>
    <template #error>
      <slot name="error"></slot>
    </template>
  </el-image>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    // 图片的object-fit属性，默认为contain
    fit: {
      type: String,
      default: () => {
        return "contain";
      }
    }
  }
};
</script>
