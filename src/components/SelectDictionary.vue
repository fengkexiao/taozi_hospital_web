<template>
  <el-select ref="selectDictionary" :clearable="clearable" v-bind="$attrs" v-on="$listeners">
    <template #prefix>
      <slot name="prefix">
      </slot>
    </template>
    <template #empty>
      <slot name="empty">
      </slot>
    </template>
    <el-option v-for="(item,index) in dictionaries" :key="index" :label="item.dictName" :value="item.dictCode">
    </el-option>
  </el-select>
</template>
<script>
import { mapActions } from "vuex";
export default {
  inheritAttrs: false,
  props: {
    // 字典SystemCode
    systemCode: {
      type: String,
      required: true
    },
    // 字典分组CODE
    groupCode: {
      type: String,
      required: true
    },
    // 上级字典CODE
    parentDictCode: {
      type: String
    },
    // 是否可清空，默认为可清空
    clearable: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      dictionaries: []
    };
  },
  created() {
    this.loadDictionary();
  },
  watch: {
    // 父code改变自动重新查询
    parentDictCode(val) {
      this.reload();
    }
  },
  methods: {
    // Select Methods
    focus() {
      this.$refs.selectDictionary.focus();
    },
    blur() {
      this.$refs.selectDictionary.blur();
    },
    ...mapActions({
      getDictionary: "dictionary/getDictionary"
    }),
    // 重新加载字典数据
    reload() {
      this.loadDictionary();
    },
    // 根据字典类型获取字典数据
    loadDictionary() {
      this.getDictionary({
        systemCode: this.systemCode,
        groupCode: this.groupCode,
        parentDictCode: this.parentDictCode
      }).then(res => {
        this.dictionaries = res;
        this.$emit("loaded", res);
        this.$emit("update:dictionaries", res);
      });
    },
    // 根据字典code获取字典名称，传入对象
    getDictName({ dictCode, systemCode, groupCode, parentDictCode }) {
      let target = this.dictionaries
        .filter(it => {
          let firstFilter =
            it.systemCode === systemCode &&
            it.groupCode === groupCode &&
            dictCode.includes(it.dictCode);
          if (parentDictCode) {
            return firstFilter && it.parentDictCode === parentDictCode;
          }
          return firstFilter;
        })
        .map(it => {
          return it.dictName;
        });
      return target.join("，");
    }
  }
};
</script>
