<template>
  <div>
    <el-image style="width: 60px; height: 60px;cursor:pointer;" :class="[showClass?'detail-img':'']" :src="item" @click.native="hanldeOnPreview(index)" @load="load" @error="error" v-for="(item,index) of imgArr" :key="index">
    </el-image>
    <el-image-viewer v-if="showViewer" :initialIndex="initialIndex" :onSwitch="handleOnSwitch" :on-close="hanldeCloseViewer" :url-list="imgList" />
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
        this.initImgList();
      }
    }
  },
  components: { ElImageViewer },
  data () {
    return {
      showViewer: false, // 显示查看器
      showClass: true,
      imgArr: [],
      imgList: [],
      initialIndex: 0
    };
  },
  created () {
    this.initImgList();
  },
  methods: {
    // 初始化图片集合
    initImgList() {
      let urls = this.url || "";
      let newArr = urls.split("||");
      this.imgArr = newArr;
      this.imgList = this.imgArr;
      this.handleOnSwitch(0);
    },
    load () {
      this.showClass = true;
    },
    error () {
      this.showClass = false;
    },
    hanldeOnPreview (index) {
      if (!this.showClass) return;
      this.initialIndex = index;
      this.handleOnSwitch(index);
      this.showViewer = true;
    },
    // 关闭查看器
    hanldeCloseViewer () {
      if(document.querySelector('body')){
        document.querySelector('body').removeAttribute('style');
      }
      this.showViewer = false;
    },
    // 上一步下一步
    handleOnSwitch(val) {
      setTimeout(() => {
        let next = document.querySelector(".el-image-viewer__next");
        let prev = document.querySelector(".el-image-viewer__prev");
        if (val + 1 === this.imgList.length) {
          if (next) next.style.visibility = "hidden";
        } else {
          if (next) next.style.visibility = "visible";
        }

        if (val === 0) {
          if (prev) prev.style.visibility = "hidden";
        } else {
          if (prev) prev.style.visibility = "visible";
        }
      }, 0);
    }
  }
};
</script>
<style style="scss" >
.detail-img img {
  border-radius: 2px;
  opacity: 0.3;
  filter: alpha(opacity=30);
}
.detail-img {
  background: #000000;
}
.detail-img:before {
  content: "点击放大";
  color: #ffffff;
  font-size: 12px;
  position: absolute;
  left: 5px;
  top: 20px;
  cursor: pointer;
}

.el-icon-circle-close{
  color:#fff;
}
</style>
