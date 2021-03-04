<template>
  <div>
    <el-image :src="item" @click.native="hanldeOnPreview(index)" @load="load" @error="error" v-for="(item,index) of imgArr" :key="index">
    </el-image>
    <el-image-viewer v-if="showViewer" :on-close="hanldeCloseViewer" :url-list="imgList" />
  </div>
</template>
<script>
import ElImageViewer from "element-ui/packages/image/src/image-viewer";

export default {
  props: {
    url: {
      type: String
    }
  },
  watch: {
    url (val) {
      if (val) {
        let urls = this.url || "";
        let newArr = urls.split("||");
        this.imgArr = newArr;
      }
    }
  },
  components: { ElImageViewer },
  data () {
    return {
      showViewer: false, // 显示查看器
      showClass: true,
      imgArr: [],
      imgList: []
    };
  },
  created () {
    let urls = this.url || "";
    let newArr = urls.split("||");
    this.imgArr = newArr;
  },
  methods: {
    load () {
      this.showClass = true;
    },
    error () {
      this.showClass = false;
    },
    hanldeOnPreview (index) {
      if (!this.showClass) return;
      this.imgList = [this.imgArr[index]];
      this.showViewer = true;
    },
    // 关闭查看器
    hanldeCloseViewer () {
      this.showViewer = false;
    }
  }
};
</script>
<style style="scss" >
</style>
