<template>
  <div><b>此页面仅仅用于完成一次跳转，以解决上传检查报告成功后的多余回显问题。如果您看到了这句话，这说明您的视力特别好！</b></div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "examine-orderReportBack",
  inject: ["reload", "close"],
  data () {
    return {
      tableLoading: false
    };
  },
  computed: { ...mapGetters(["userInfo"]) },
  created () {
    this.back();
  },
  activated () {
    this.back();
  },
  methods: {
    // 确定保存的方法
    back () {
      this.close().then(() => {
        this.$router.push({
          name: "examine-orderReport",
          params: {}
        });
      });
    }
  }
};
</script>

<style scoped></style>
