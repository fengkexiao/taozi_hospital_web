<template>
  <div>
    <el-image-viewer v-if="visible" :on-close="hanldeCloseViewer" :url-list="urlList" />
  </div>
</template>
<script>
import ElImageViewer from "element-ui/packages/image/src/image-viewer";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    urlList: {
      type: Array,
      default: () => []
    }
  },
  components: { ElImageViewer },
  data () {
    return {
      imgArr: []
    };
  },
  created () {
  },
  methods: {
    // 关闭查看器
    hanldeCloseViewer () {
      this.$emit("close");
    }
  }
};
</script>
<style style="scss" >
</style>
