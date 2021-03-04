<template>
  <div class="contain-flex">
    <base-input v-bind="$attrs" v-on="$listeners">
      <template #prefix>
        <slot name="prefix">
        </slot>
      </template>
      <template #suffix>
        <slot name="suffix">
        </slot>
      </template>
      <template #prepend>
        <slot name="prepend">
        </slot>
      </template>
      <template #append>
        <slot name="append">
        </slot>
      </template>
    </base-input>
    <el-alert :type="tipType" :title="tip" :closable="false" show-icon class="formTip"></el-alert>
  </div>
</template>
<script>
const typeList = ["info", "success", "warning", "error"];
export default {
  inheritAttrs: false,
  props: {
    // 输入框后面提示信息
    tip: {
      type: String,
      required: true
    },
    // 提示类型，可选："info", "success", "warning", "error"
    tipType: {
      type: String,
      default() {
        return "warning";
      },
      validator(val) {
        return typeList.includes(val);
      }
    }
  },
  methods: {
    // Input Methods
    focus() {
      this.$refs.baseInput.focus();
    },
    blur() {
      this.$refs.baseInput.blur();
    },
    select() {
      this.$refs.baseInput.select();
    }
  }
};
</script>
<style scoped>
.formTip {
  width: auto;
  padding: 0 30px 0 8px;
  margin-left: 15px;
}
</style>
