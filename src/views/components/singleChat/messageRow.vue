<template>
  <div v-if="messageShow()">
    <!-- hint提示消息 -->
    <div class="hintMsg" v-if="hintShow()">
      <div class="hintText">{{customData.data.text}}</div>
    </div>

    <template v-if="messageShow()">
      <!-- 别人发送的消息 -->
      <template v-if="message.from !== userInfo.keyID">
        <div class="message-left_container">
          <!-- 头像 -->
          <div class="myAvatar">
            <el-avatar :src="isDetail?gen_text_img('患') :(clientState?patientFaceImage:defaultAvatar)  " shape="square" :size="35"></el-avatar>
          </div>
          <!-- <div class="chatName-left">{{tmc.groupObj[message.from].role}}</div> -->
          <div style="margin-left:4px;">
            <!-- <div class="chatName-left">{{tmc.groupObj[message.from].role}}</div> -->
            <!-- 文本 -->
            <div class="chatInfo-left" v-if="message.type==='TIMTextElem'">{{message.payload.text}}</div>
            <!-- 图片 -->
            <el-image v-if="message.type === 'TIMImageElem'" @contextmenu.stop.prevent="$refs.ctxshow.showMenu($event)" :style="imageStyle(message.payload.imageInfoArray[0])" :src="message.payload.imageInfoArray[0].imageUrl" :preview-src-list="imgList"></el-image>
            <!-- 语音消息 -->
            <div class="chatInfo-left" v-if="message.type === 'TIMSoundElem'">
              <audio :src="message.payload.url" controls="controls"></audio>
            </div>
          </div>
        </div>
      </template>
      <!-- 自己发送的消息 -->
      <template v-if="message.from === userInfo.keyID ">
        <div class="message-right_container">
          <div class="message-item-right">
            <!-- 文本 -->
            <div class="chatInfo-right" v-if="message.type==='TIMTextElem'">{{message.payload.text}}</div>
            <!-- 图片 -->
            <el-image v-else-if="message.type === 'TIMImageElem'" @contextmenu.stop.prevent="$refs.ctxshow.showMenu($event,message.payload.imageInfoArray[0].imageUrl)" :style="imageStyle(message.payload.imageInfoArray[0])" :src="message.payload.imageInfoArray[0].imageUrl" :preview-src-list="imgList"></el-image>
            <!-- 语音消息 -->
            <div class="chatInfo-left" v-if="message.type === 'TIMSoundElem'">[语音消息]</div>
            <!-- 卡片 -->
            <!-- <message-card :message="message" v-if="message.type === 'TIMCustomElem'"></message-card> -->
          </div>
          <div class="myAvatar">
            <el-avatar :src="isDetail?gen_text_img('医','1'):userInfo.doctorInfo.faceImage || defaultAvatar" shape="square" :size="35"></el-avatar>
          </div>
        </div>
      </template>
    </template>

    <!-- <e-vue-contextmenu ref="ctxshow" id="contextStyle" class="contextmenu" @ctx-show="show">
      <div @click="handleSaveLog">保存到沟通记录</div>
      <div @click="handleSaveLocal">保存到本地</div>
    </e-vue-contextmenu> -->
    <div class="hintMsg" v-if="messageShow() && intervalTime(index)">
      <div class="hintText" v-if="intervalTime(index)">{{intervalTime(index)}}</div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import defaultAvatar from "@/assets/image/tmcinquiry/default-avatar.png";
import { formatDateTime } from "../../../filters";
import "./../../../utils/time.js";
export default {
  components: {},
  props: {
    message: {
      type: Object,
      default: function () {
        return {};
      }
    },
    index: {
      type: Number,
      default: 0
    },
    to: {
      type: String
    },
    isDetail: {
      type: Boolean,
      default: false
    },
    recordList: {
      type: Array,
      default: []
    },
    sex: {
      type: Number
    },
    clientState: {
      type: Boolean,
      default: false
    },
    patientFaceImage: {
      type: String
    }
  },
  computed: {
    ...mapGetters(["tmc", "tim", "userInfo"]),
    imageStyle (imageObj) {
      let size = 200;
      return function (imageObj) {
        const style = {};
        let width = imageObj.width;
        let height = imageObj.height;
        if (width > size) {
          let pre = width / size;
          style.width = size + "px";
          style.height = height / pre + "px";
        } else {
          style.width = width + "px";
          style.height = height + "px";
        }
        return style;
      };
    }
  },
  data () {
    return {
      defaultAvatar,
      imgUrl: "",
      desc: "",
      dialogVisible: false,
      imgList: [],
      customData: {},
      currentUrl: ""
    };
  },
  created () {
    if (this.message.type === "TIMImageElem") {
      this.dealImgMsg();
    }
    if (this.message.type === "TIMCustomElem") {
      this.customData = this.message.payload.data
        ? JSON.parse(this.message.payload.data)
        : {};
    }
  },
  methods: {
    gen_text_img (s, d) {
      if (s) {
        let colors = [];
        if (this.sex === 1 && !d) {
          colors = [
            "#387FE2"
          ]
        } else {
          colors = [
            "#FF9AC9"
          ]
        }
        if (d) {
          colors = [
            "#FE5853"
          ]
        }
        let cvs = document.createElement("canvas");
        cvs.setAttribute('width', 32);
        cvs.setAttribute('height', 32);
        cvs.setAttribute('height', 32);
        let ctx = cvs.getContext("2d");
        ctx.fillStyle = colors[Math.floor(Math.random() * (colors.length))];
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.font = 14 * 1 + "px Arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(s, 32 / 2, 32 / 2);
        return cvs.toDataURL('image/jpeg', 1);
      }
    },
    show (data) {
      this.currentUrl = data;
      this.desc = "";
    },
    handleClose () {
      this.handleClose = false;
    },
    // 保存到你本地
    handleSaveLocal (data) {
      var imgSrc = this.currentUrl;
      var name = "图片";
      // 下载图片地址和图片名
      var image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        var _dataURL = canvas.toDataURL("image/png"); // 得到图片的base64编码数据

        var blob_ = dataURLtoBlob(_dataURL); // 用到Blob是因为图片文件过大时，在一部风浏览器上会下载失败，而Blob就不会

        var url = {
          name: name || "图片.png", // 图片名称不需要加.png后缀名
          src: blob_
        };

        if (window.navigator.msSaveOrOpenBlob) { // if browser is IE
          navigator.msSaveBlob(url.src, url.name);// filename文件名包括扩展名，下载路径为浏览器默认路径
        } else {
          var link = document.createElement("a");
          link.setAttribute("href", window.URL.createObjectURL(url.src));
          link.setAttribute("download", url.name + ".png");
          document.body.appendChild(link);
          link.click();
        }
      };
      image.src = imgSrc;

      function dataURLtoBlob (dataurl) {
        var arr = dataurl.split(","); var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]); var n = bstr.length; var u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      }
    },
    dealImgMsg () {
      this.imgUrl = this.message.payload.imageInfoArray[0].imageUrl;
      this.imgList.push(this.imgUrl);
    },
    hintShow () {
      let res = false;
      if (this.message.from === this.to) {
        if (this.message.type !== "TIMCustomElem") {
          return false;
        }
        if (
          this.customData.customType === "hint" &&
          this.customData.childType !== "other"
        ) {
          res = true;
        }
      }
      return res;
    },
    messageShow () {
      let res = false;
      if (this.message.from === this.to || this.message.from === this.userInfo.keyID) {
        if (this.message.type === "TIMCustomElem") {
          res = false;
        } else {
          res = true;
        }
      } else {
        res = false;
      }
      if (this.isDetail) {
        return true
      }
      return res;
    },
    // 消息间隔时间
    intervalTime () {
      if (!this.isDetail) {
        if (this.index === this.tim.rpMsgList.length - 1) return "";
        else {
          let curItem = this.tim.rpMsgList[this.index];
          let lastItem = this.tim.rpMsgList[this.index + 1];
          // 间隔时间为5分钟
          let intervalTime = 60 * 5;
          if (
            lastItem.time &&
            curItem.time &&
            lastItem.time - curItem.time > intervalTime
          ) {
            let time = formatDateTime(new Date(lastItem.time * 1000));
            return time;
          } else {
            return "";
          }
        }
      } else {
        if (this.index === this.recordList.length - 1) return "";
        else {
          let curItem = this.recordList[this.index];
          let lastItem = this.recordList[this.index + 1];
          // 间隔时间为5分钟
          let intervalTime = 60 * 5;
          if (
            lastItem.time &&
            curItem.time &&
            lastItem.time - curItem.time > intervalTime
          ) {
            let time = formatDateTime(new Date(lastItem.time * 1000));
            return time;
          } else {
            return "";
          }
        }
      }
      return ""
    }
  }
};
</script>

<style lang="scss" scoped>
.contextmenu {
  user-select: none;
  div {
    height: 42px;
    line-height: 42px;
    padding-left: 16px;
    cursor: pointer;
    &:first-child {
      border-bottom: 1px solid #dbdfe8;
    }
    &:hover {
      color: #438bef;
    }
  }
}
.message-item-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 4px;
}
.chatName-left {
  margin-left: 8px;
}
.chatName-right {
  text-align: right;
}
.chatInfo-left {
  white-space: pre-wrap;
  word-break: break-all;
  word-wrap: break-word;
  background: #f6f6f6;
  padding: 9px 15px;
  min-height: 35px;
  border-radius: 5px;
  display: inline-block;
  position: relative;
  margin-left: 8px;
  font-size: 14px;
  color: #000000d9;
  &:before {
    content: "";
    border-width: 8px;
    border-style: solid;
    border-color: transparent #f2f2f4 transparent transparent;
    position: absolute;
    left: -14px;
    top: 9px;
    right: auto;
  }
}
.chatInfo-right {
  white-space: pre-wrap;
  word-break: break-all;
  word-wrap: break-word;
  background: #d9e8fc;
  padding: 9px 15px;
  min-height: 35px;
  border-radius: 5px;
  display: inline-block;
  position: relative;
  margin-right: 8px;
  font-size: 14px;
  color: #000000d9;
  &:before {
    content: "";
    border-width: 8px;
    border-style: solid;
    border-color: transparent transparent transparent #dce6fa;
    position: absolute;
    right: -14px;
    top: 9px;
    left: auto;
  }
}
.myAvatar {
  display: flex;
  /*justify-content: center;*/
  /*align-items: center;*/
}
.hintMsg {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 15px;
  border-radius: 2px;
}
.hintText {
  font-size: 10px;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 2px;
  padding-bottom: 2px;
  // background-color: #dadada;
  font-size: 12px;
  color: #00000073;
}

.myAvatar {
  img {
    width: 34px;
    height: 34px;
    border-radius: 5px;
  }
}
.message-left_container {
  display: flex;
  margin: 10px 0;
}
.message-right_container {
  display: flex;
  margin: 10px 0;
  justify-content: flex-end;
}
</style>
