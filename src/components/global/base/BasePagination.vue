<template>
  <div class="peach-pagination">
    <el-pagination v-show="pageInfo.totalRow" background layout="sizes, prev, pager, next, jumper" :current-page.sync="pageInfo.pageIndex"
      :page-size.sync="pageInfo.pageSize" :total="pageInfo.totalRow" v-bind="$attrs" v-on="$listeners">
      <template #default>
        <slot />
      </template>
    </el-pagination>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    // 分页信息对象
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    // 分页信息
    pageInfo: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>

<style scoped lang="scss">
  .peach-pagination{
    padding-bottom: 24px;
    padding-right: 24px;
  }
</style>
