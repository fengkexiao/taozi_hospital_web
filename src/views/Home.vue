<template>
  <div class="app-container">
    <div>欢迎进入{{userInfo.orgName}}管理系统</div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userInfo"])
  }
};
</script>
<style scoped>
.app-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  padding:24px;
}
</style>
