<template>
  <div class="video-dialog video-drag" v-if="videoVisible">
    <!-- <div class="video-dialog_close" @click="dialogClose">-</div> -->
    <div class="video-dialog_body">
      <div id="remote_stream" class="remote_stream"></div>
      <div id="local_stream" class="local_stream"></div>
    </div>
    <div class="video-dialog_footer">
      <!-- <p class="video-dialog_footer__time">00:20</p> -->
      <div class="video-dialog_footer__end" @click="hangup"></div>
      <p class="video-dialog_footer__endtxt">挂断</p>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { mapGetters } from "vuex";
import RtcClient from "@/utils/rtc-client";
import { SDK_APP_ID } from "@/common/Constant";
import imgHangup from "@/assets/image/tmcinquiry/hang-up.png";
export default {
  components: {},
  data() {
    return {
      value: "",
      count: "",
      options: [],
      userSig: "",
      trtcClient: {},
      imgHangup
    };
  },
  computed: {
    ...mapGetters(["userInfo", "tmc"])
  },
  props: {
    videoVisible: {
      type: Boolean,
      default: false
    },
    // 进入方式 1 主动发起视频 2 接听视频
    roomID: {
      type: Number,
      default: 0
    },
    // 视频对话对象
    videoMultiTalk: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    // 监听挂断视频
    videoVisible() {
      if (!this.videoVisible) {
        if (this.roomID) {
          this.trtcClient.leave();
        }
        this.videoVisible = false;
      }
      if (this.videoVisible) {
        this.$nextTick(() => {
          this.handleDrag();
        });
      }
    },
    // 监听房间号变化
    roomID() {
      if (this.roomID) {
        // 进入房间
        this.getUserSig();
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.handleDrag();
    });
  },
  methods: {
    // 拖动
    handleDrag() {
      var drag = document.querySelector(".video-drag");
      if (!drag) return false;
      // //点击某物体时，用drag对象即可，move和up是全局区域，
      // 也就是整个文档通用，应该使用document对象而不是drag对象(否则，采用drag对象时物体只能往右方或下方移动)
      drag.onmousedown = function(event) {
        var event = event || window.event; // 兼容IE浏览器
        //    鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离
        var diffX = event.clientX - drag.offsetLeft;
        var diffY = event.clientY - drag.offsetTop;
        if (typeof drag.setCapture !== "undefined") {
          drag.setCapture();
        }
        document.onmousemove = function(event) {
          var event = event || window.event;
          var moveX = event.clientX - diffX;
          var moveY = event.clientY - diffY;
          if (moveX < 0) {
            moveX = 0;
          } else if (moveX > window.innerWidth - drag.offsetWidth) {
            moveX = window.innerWidth - drag.offsetWidth;
          }
          if (moveY < 0) {
            moveY = 0;
          } else if (moveY > window.innerHeight - drag.offsetHeight) {
            moveY = window.innerHeight - drag.offsetHeight;
          }
          drag.style.left = moveX + "px";
          drag.style.top = moveY + "px";
        };
        document.onmouseup = function(event) {
          this.onmousemove = null;
          this.onmouseup = null;
          // 修复低版本ie bug
          if (typeof drag.releaseCapture !== "undefined") {
            drag.releaseCapture();
          }
        };
      };
    },
    // 关闭弹窗
    dialogClose() {
      this.$emit("update:videoVisible", false);
    },
    // 获取当前用户 userSig
    getUserSig() {
      let params = {
        userId: this.userInfo.keyID
      };
      this.$_http
        .get(this.$_API.API_RP_INITIAL_GETUSERSIG, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.userSig = res.data.userSig;
          this.goIntoRoom();
        });
    },
    // 进入房间
    goIntoRoom() {
      this.trtcClient = new RtcClient({
        sdkAppId: SDK_APP_ID,
        userId: this.userInfo.keyID,
        userSig: this.userSig
      });
      this.trtcClient.join({
        roomId: this.roomID,
        role: "anchor"
      });
      // 混流
      setTimeout(() => {
        this.videoMix();
      }, 7000);
    },
    hangup() {
      // 挂断
      if (this.roomID) {
        this.trtcClient.leave();
      }
      this.$emit("hangup");
    },
    // 视频云端混流
    videoMix() {
      let params = {
        userStreamID: this.tmc.patientStreamID,
        doctorStreamID: this.tmc.doctorStreamID
      };
      console.log("-----开始混流" + JSON.stringify(params));
      this.$_http
        .post(this.$_API.INTERFACE_RP_POST_VIDEO_MIX, params)
        .then(res => {
          console.log("混流结束");
        });
    }
  }
};
</script>

<style scoped lang="scss">
.video-dialog {
  height: 532px;
  width: 300px;
  position: fixed;
  z-index: 999999;
  background-color: black;
  // top: 50%;
  // left: 50%;
  // margin-left: -150px;
  // margin-top: -266px;
  .video-dialog_close {
    background: rgba(255, 255, 255, 0.1);
    width: 20px;
    height: 20px;
    text-align: center;
    color: #ffffff;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
  }
  .video-dialog_footer {
    user-select: none;
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    .video-dialog_footer__time,
    .video-dialog_footer__endtxt {
      color: #ffffff;
      cursor: default;
    }
    .video-dialog_footer__end {
      cursor: pointer;
      display: inline-block;
      width: 40px;
      height: 40px;
      background: url("./../../../assets/image/end.png") no-repeat;
    }
  }
  .remote_stream {
    height: 100%;
    position: absolute;
    top: 0;
    width: 100%;
  }
  .local_stream {
    height: 150px;
    position: absolute;
    top: 0;
    width: 100px;
    right: 0;
    z-index: 9999;
  }
}
</style>
