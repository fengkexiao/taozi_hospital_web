<template>
  <div>
    <!--图文 或者 视频 -->
    <div class="message-card-box" @click="clickCard" v-if="materialType===0||materialType===2">
      <div class="message-card-title-box">{{checkTitleLength()}}</div>
      <div class="message-card-content-box">
        <div class="message-card-descript-box">{{checkDescriptLength()}}</div>
        <div class="message-card-image-box">
          <img
            class="play-messsage"
            src="../../../../assets/image/tmcinquiry/play-icon.png"
            v-if="materialType===2"
          />
          <img class="message-card-image" :src="content.data.logoUrl" />
        </div>
      </div>
    </div>

    <!-- 图片 -->
    <div v-if="materialType===1">
      <!-- <el-image class="image-type-style" :src="content.data.logoUrl" :preview-src-list="imgList"></el-image> -->
      <el-image class="image-type-style" :src="content.data.logoUrl" :preview-src-list="imgList"></el-image>
    </div>
    <!-- 视频播放窗口 -->
    <div class="video-box" v-if="videoShow">
      <i class="el-icon-close video-close-icon" @click="closeVideo"></i>
      <div id="material-video" class="video-play"></div>
    </div>
  </div>
</template>

<script>
// 常用卡片模板
export default {
  components: {},
  computed: {
    splitLine(index) {
      return function(index) {
        const style = {};
        if (index !== this.cardButtons.length - 1) {
          style.borderRightWidth = "1px";
          style.borderRightColor = "#dbdbdb";
        }
        return style;
      };
    }
  },
  props: {
    // materialType:0:图文 1:图片 2:视频
    content: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      // 是否展示视频窗口
      videoShow: false,
      videoPlayer: null,
      // 素材类型
      materialType: 0,
      imgList: []
    };
  },
  created() {
    console.log("---卡片消息---" + JSON.stringify(this.content));
    this.materialType = this.content.data.materialType;
    if (this.materialType === 1) {
      this.imgList.push(this.content.data.logoUrl);
    }
  },
  methods: {
    clickCard() {
      if (this.materialType === 0) {
        window.open(this.content.data.url, "_blank");
      } else if (this.materialType === 1) {
        this.imgList.push(this.content.data.url);
      } else if (this.materialType === 2) {
        this.videoShow = true;
        setTimeout(() => {
          this.playLiver();
        }, 100);
      }
    },
    // 直播播放
    playLiver() {
      console.log("video---" + this.content.data.url);
      var patientOptions = {
        m3u8: this.content.data.url,
        // mp4:
        //   "https://1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f30.mp4",
        autoplay: false,
        poster: "",
        width: "480", // 视频的显示宽度，请尽量使用视频分辨率宽度
        height: "320" // 视频的显示高度，请尽量使用视频分辨率高度
      };
      // eslint-disable-next-line no-undef
      this.videoPlayer = new TcPlayer("material-video", patientOptions);
    },
    closeVideo() {
      this.videoShow = false;
    },
    checkDescriptLength() {
      let text = this.content.data.descrip;
      let maxLen = text.length;
      if (maxLen < 60) {
      } else {
        text = text.slice(0, 60) + "...";
      }
      return text;
    },
    checkTitleLength() {
      let text = this.content.data.title;
      let maxLen = text.length;
      if (maxLen < 22) {
      } else {
        text = text.slice(0, 22) + "...";
      }
      return text;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.message-card-box {
  width: 400px;
  height: 160px;
  background-color: #f7f4f8;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 10px;
}
.message-card-title-box {
  width: 100%;
  height: 30%;
  display: flex;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  overflow: hidden;
}
.message-card-content-box {
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: row;
}
.message-card-descript-box {
  width: 75%;
  height: 100%;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: #6d6a6d;
}
.message-card-image-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 25%;
  height: 100%;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
}
.message-card-image {
  width: 100%;
  height: 100%;
}
.play-messsage {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 30%;
  height: 30%;
  opacity: 0.7;
}
.video-close-icon {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  right: 0;
}
.video-box {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 540px;
  height: 340px;
  z-index: 222222;
}
.video-play {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 480px;
  height: 320px;
}
.image-type-style {
  width: 100px;
  height: auto;
}
</style>
