<template>
  <div class="body" @click="clickoutside">
    <!-- 直播窗口 -->
    <div class="liver-window" v-if="liverVideoShow">
      <div style="width:480px;height:20px;z-index: 111111">
        <div class="videoInfoBox">
          <div
            v-if="videoMultiTalk&&videoMultiTalk.patient"
          >用户：{{videoMultiTalk.patient.personName}}</div>
          <div v-if="videoMultiTalk&&videoMultiTalk.doctor">医生：{{videoMultiTalk.doctor.doctorName}}</div>
        </div>
        <div id="patient-liver-video" class="patient-liver-video"></div>
        <div id="doctor-liver-video" class="doctor-liver-video"></div>
      </div>
    </div>
    <div class="chatIndexNonePatientBox">
      <!-- 视频弹框 -->
      <pop-up-video
        :videoVisible.sync="videoVisible"
        :roomID.sync="roomID"
        @hangup="hangup"
        :videoMultiTalk="videoMultiTalk||tmc.multiTalk"
      ></pop-up-video>
      <!-- 确认接收视频弹框 -->
      <el-dialog
        title="是否接受视频问诊"
        :visible.sync="confirmVideoVisible"
        width="30%"
        :before-close="rejectVideo"
        :close-on-click-modal="false"
      >
        <div class="video-dialog-textContent">{{videoFromName}}</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rejectVideo">拒 绝</el-button>
          <el-button type="primary" @click="acceptVideo">确 定</el-button>
        </span>
      </el-dialog>

      <div class="chatIndexNonePatientDiv">
        <img class="chatIndexNonePatientImg" src="../../../assets/image/tmcinquiry/nonePatient.png" />
        <p class="chatIndexNonePatientTitle">暂无会话，快去问诊吧~</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import timPublic from "./timPublic";
import dealMsg from "./dealMsg";
import popUpVideo from "./popUpVideo";
export default {
  name: "chatIndexNonePatient",
  components: {
    popUpVideo
  },
  mixins: [timPublic, dealMsg],

  data() {
    return {
      doctorLivePlay: null,
      patientLivePlay: null,
      liverVideoShow: false
    };
  },
  computed: {
    ...mapGetters(["tmc", "userInfo", "tim"])
  },
  watch: {
    "tmc.patientLiveAddress": {
      immediate: true,
      handler: function(val) {
        if (this.userInfo.jobType === 1) {
          if (!val) {
            console.log("关闭直播--------");
            this.closeLiver();
          } else {
            // 由于直播不稳定暂时屏蔽 2020-02-28
            // this.liverVideoShow = true;
            // setTimeout(() => {
            //   this.playLiver();
            // }, 3000);
          }
        }
      }
    }
  },
  created() {
    this.$bus.$on("reciveMessage", this.reciveMessage);
  },
  methods: {
    clickoutside(){
      this.$bus.$emit("hideSearchResult");
    },
    ...mapActions({
      // 修改直播地址
      changeLiveStreamIDFun: "tmc/changeLiveStreamIDFun"
    }),
    reciveMessage(data) {
      this.dealCustomeMessage(data);
    },
    // 直播播放
    playLiver() {
      if (this.tmc.patientLiveAddress && this.tmc.doctorLiveAddress) {
        var patientOptions = {
          m3u8: this.tmc.patientLiveAddress, // 这个替换成flv接可以了
          autoplay: true, // iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
          poster: "http://www.test.com/myimage.jpg",
          width: "480", // 视频的显示宽度，请尽量使用视频分辨率宽度
          height: "320" // 视频的显示高度，请尽量使用视频分辨率高度
        };
        var doctorOptions = {
          m3u8: this.tmc.doctorLiveAddress, // 这个替换成flv接可以了
          autoplay: true, // iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
          poster: "http://www.test.com/myimage.jpg",
          width: "480", // 视频的显示宽度，请尽量使用视频分辨率宽度
          height: "320" // 视频的显示高度，请尽量使用视频分辨率高度
        };
        if (this.doctorLivePlay === null) {
          // eslint-disable-next-line no-undef
          this.doctorLivePlay = new TcPlayer(
            "doctor-liver-video",
            doctorOptions
          );
        }
        if (this.patientLivePlay === null) {
          // eslint-disable-next-line no-undef
          this.patientLivePlay = new TcPlayer(
            "patient-liver-video",
            patientOptions
          );
        }
      }
    },
    // 关闭直播
    closeLiver() {
      this.liverVideoShow = false;
      this.doctorLivePlay = null;
      this.patientLivePlay = null;
    }
  },
  destroyed() {
    this.closeLiver();
  }
};
</script>

<style scoped>
.videoInfoBox {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.body {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
.chatIndexNonePatientBox {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px solid #e8e8e8;
}
.chatIndexNonePatientDiv {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.chatIndexNonePatientImg {
  width: 40%;
  height: auto;
}
.chatIndexNonePatientTitle {
  font-size: 25px;
  color: #666666;
  width: 100%;
  text-align: center;
}
.video-dialog-textContent {
  width: 100%;
  display: flex;
  justify-content: center;
}
.liver-window {
  position: absolute;
  width: 100%;
  height: 0px;
  display: flex;
  justify-content: center;
  z-index: 111111;
}
.patient-liver-video {
  z-index: 111111;
}
.doctor-liver-video {
  z-index: 111111;
}
</style>
