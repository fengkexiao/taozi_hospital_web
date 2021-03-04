<template>
  <el-input @input.native="inputEvent($event)" @blur.native="blurEvent($event)" ref="baseInput" :placeholder="placeholder"
    :autosize="autosize" :maxlength="maxlen" :show-word-limit="showLimit" :clearable="clearable" v-bind="$attrs"
    v-on="$listeners">
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
  </el-input>
</template>
<script>
import { onlyNumber, onlyFloat, onlyFixedTwo, formatToFixedTwo } from "@/utils/input";
import { flat } from "@/utils/tools";

const TEXT = "text";
const NUMBER = "number";
const FLOAT = "float";
const PHONE = "phone";
const MONEY = "money";
const typeList = [TEXT, NUMBER, FLOAT, PHONE, MONEY];
const noop = () => {};
const inputHandle = new Map()
  .set(TEXT, noop)
  .set(NUMBER, onlyNumber)
  .set(FLOAT, onlyFloat)
  .set(PHONE, onlyNumber)
  .set(MONEY, [onlyFloat, onlyFixedTwo]);
const blurHandle = new Map().set(MONEY, formatToFixedTwo);

export default {
  inheritAttrs: false,
  props: {
    // 提示信息
    labelName: {
      type: String,
      default() {
        return "";
      }
    },
    // 允许输入值类型，默认为text
    formType: {
      type: String,
      default() {
        return "text";
      },
      validator(val) {
        return typeList.includes(val);
      }
    },
    // 是否可清空，默认为可清空
    clearable: {
      type: Boolean,
      default() {
        return true;
      }
    },
    // 自适应内容高度，只对 type="textarea" 有效
    autosize: {
      type: [Object, Boolean],
      default() {
        return { minRows: 2, maxRows: 4 };
      }
    },
    showWordLimit: {
      type: Boolean,
      default() {
        return undefined;
      }
    }
  },
  computed: {
    // 组装提示信息
    placeholder() {
      if (typeof this.$attrs.placeholder !== "undefined") {
        return this.$attrs.placeholder;
      }
      const readonly = this.$attrs.disabled || this.$attrs.readonly;
      if (readonly) {
        return "";
      }
      return "请输入" + this.labelName;
    },
    // 最大输入长度
    maxlen() {
      if (typeof this.$attrs.maxlength !== "undefined") {
        return this.$attrs.maxlength;
      }
      if (this.formType === PHONE) {
        return 11;
      }
      if (this.$attrs.type === "textarea") {
        return 200;
      }
      return 50;
    },
    // 是否显示输入字数统计
    showLimit() {
      if (typeof this.showWordLimit !== "undefined") {
        return this.showWordLimit;
      }
      if (this.$attrs.type === "textarea" || this.maxlen < 20) {
        return true;
      }
      return false;
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
    },
    // 拦截输入事件
    inputEvent(e) {
      const value = inputHandle.get(this.formType);
      let handleArr = [];
      if (value) {
        handleArr = flat(Array.of(value));
      }
      handleArr.forEach(handle => handle(e.target));
      this.$emit("input", e.target.value);
    },
    blurEvent(e) {
      const value = blurHandle.get(this.formType);
      let handleArr = [];
      if (value) {
        handleArr = flat(Array.of(value));
      }
      handleArr.forEach(handle => handle(e.target));
      this.$emit("blur", e.target.value);
    }
  }
};
</script>
