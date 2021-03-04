<template>
  <div class="video-dialog video-drag" v-if="phoneVisible">
    <!-- <div class="video-dialog_body">
      <div id="remote_stream" class="remote_stream" v-if="show === true">
        <span style="color: #fff">{{connect}}</span>
      </div>
      <div id="local_stream" class="local_stream" v-else>
        <div>
          <span
            class="timer"
            :sendSync="sendSync"
            :autoStart="autoStart"
            :defaultVal="defaultVal"
          >{{countString}}</span>
        </div>
      </div>
    </div>
    <div class="video-dialog_footer">
      <div class="video-dialog_footer__end" @click="hangdown"></div>
      <p class="video-dialog_footer__endtxt">&nbsp;</p>
    </div> -->
    <div class="video-dialog_body">
      <div id="remote_stream" class="remote_stream"></div>
      <div id="local_stream" class="local_stream"></div>
    </div>
    <div class="video-dialog_footer">
      <!-- <p class="video-dialog_footer__time">00:20</p> -->
      <div class="video-dialog_footer__end" @click="hangdown"></div>
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
      imgHangup,
      show: true,
      connect: "正在等待对方接受邀请",
      isStart: false,
      globalTimer: null,//获取setInterval对象值
      countString: '', //用来显示时间
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      countVal: this.defaultVal, //获取初始值
      pauseTime: 0
    };
  },
  computed: {
    ...mapGetters(["userInfo", "tmc"]),
    needSendSunc: function() {
      return this.sendSync
    }
  },
  props: {
    phoneVisible: {
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
    },
    sendSync: {
      type: Boolean,
      default: false,
    },
    autoStart: {
      type: Boolean,
      default: false,
    },
    defaultVal: {
      type: Number,
      default: null,
    }
  },
  watch: {
    // 监听挂断视频
    phoneVisible() {
      if (!this.phoneVisible) {
        if (this.roomID) {
          this.trtcClient.leave();
        }
        this.phoneVisible = false;
      }
      if (this.phoneVisible) {
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
    },
    'countVal': {
      deep: true,
      handler: function(val, oldVal) {
        if (this.needSendSunc) {
          this.passToParent(val)
        }
      }
    },
    'needSendSunc': {
      deep: true,
      handler: function(val) {
        if (val) {
          this.passToParent(this.countString)
        }
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
      this.$emit("update:phoneVisible", false);
    },
    hangdown() {
      // 挂断
      // if (this.roomID) {
      //   this.trtcClient.leave();
      // }
      this.$emit("hangdown");
      // this.connect = "正在等待对方接受邀请";
      // this.stopCountFn();
      // this.show = true;
    },
    startTime() {
      this.connect = "正在等待对方接受邀请";
      if (this.autoStart) {
        setTimeout(() => {
          this.show = false;
          this.connect = "正在通话中..."
          this.startCountFn();
        }, 5000);
      }
    },
    counterFn(counterTime) {
      let leave1 = counterTime % (24 * 3600 * 1)    //计算天数后剩余的毫秒数
      let leave2 = leave1 % (3600 * 1)        //计算小时数后剩余的毫秒数
      let leave3 = leave2 % (60 * 1)      //计算分钟数后剩余的毫秒数
      let day = Math.floor(counterTime / (24 * 3600 * 1)) //计算相差天数
      let hour = Math.floor(leave1 / (3600 * 1))//计算相差小时
      let minute = Math.floor(leave2 / (60 * 1))//计算相差分钟
      let second = Math.round(leave3 / 1) //计算相差秒
      day=day>=10?day:'0'+day
      hour=hour>=10?hour:'0'+hour
      minute=minute>=10?minute:'0'+minute
      second=second>=10?second:'0'+second
      if (counterTime >= 3600) {
        this.countString = `${hour}:${minute}:${second}`;
      } else {
        this.countString = `${minute}:${second}`;
      }
    },
    startCountFn() {
      if (!this.isStart) {
        this.countVal = this.countVal ? this.countVal : 0
        let timer = setInterval(() => {
          this.counterFn(this.countVal++)
        }, 1000)
        this.globalTimer = timer;
        this.isStart = true;
      }
    },
    stopCountFn() {
      if (this.isStart) {
        window.clearInterval(this.globalTimer)
        this.globalTimer = null;
        this.isStart = false;
        this.countVal = 0;
        this.countString = "";
        this.pauseTime = new Date().getTime()
      }
    },
    passToParent(data) {
      this.$emit("getDataFromChild", data)
    }
  }
};
</script>

<style scoped lang="scss">
.video-dialog {
  // height: 299px;
  // width: 260px;
  position: fixed;
  height: 532px;
  width: 300px;
  background-color: black;
  // border-radius: 5px;
  // border: 1px solid black;
  // background: url("./../../../assets/image/tmcinquiry/callBg.png") no-repeat;
  z-index: 999999;
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
      cursor: default;
      color: #ffffff;
    }
    .video-dialog_footer__end {
      cursor: pointer;
      display: inline-block;
      width: 40px;
      height: 40px;
      background: url("./../../../assets/image/end.png") no-repeat;
    }
  }
  // .remote_stream {
  //   margin: 80px auto;
  //   text-align: center;
  //   width: 260px;
  // }
  // .local_stream {
  //   margin: 80px auto;
  //   text-align: center;
  //   width: 260px;
  //   z-index: 9999;
  // }
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
.timer {
  font-size: 36px;
  color: #ffffff;
}
</style>
