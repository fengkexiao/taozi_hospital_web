<template>
  <div class="base-title">
    <div></div>
    <span>{{name}}</span>
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: () => {
        return "";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.base-title {
  display: flex;
  align-items: center;
  padding-left:24px;
  div {
    width: 2px;
    height: 16px;
    background: rgba(67, 139, 239, 1);
    border-radius: 1px;
    margin-right: 4px;
  }
  span {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
}
</style>
