<template>
  <div style="margin:10px 0" v-if="hintShow() || messageShow()">
    <!-- hint提示消息 -->
    <div class="hintMsg" v-if="hintShow()">
      <div class="hintText">{{customData.data.text}}</div>
    </div>
    <div class="hintMsg" v-if="messageShow()">
      <div class="hintText" v-if="intervalTime(index)">{{intervalTime(index)}}</div>
    </div>

    <template v-if="messageShow()">
      <!-- 别人发送的消息 -->
      <template v-if="(!isRecord && message.from !== userInfo.keyID) || (isRecord && (message.from!==assistantStaffID && message.from!==doctorStaffID) )">
        <div class="message-left_container">
          <!-- 头像 -->

          <div class="myAvatar mr10" v-if="tmc.groupObj[message.from]">
            <img v-if="!isRecord" :src="tmc.groupObj[message.from].faceImage || defaultAvatar" shape="square" :size="35" />
            <img v-if="isRecord" :src="patientFaceImage || defaultAvatar" shape="square" :size="35" />
          </div>
          <div v-else class="myAvatar mr10">
            <img :src="defaultAvatar" shape="square" :size="35" />
          </div>
          <!-- <div class="chatName-left">{{tmc.groupObj[message.from].role}}</div> -->
          <div>
            <div class="chatName-left">{{patientName}}</div>
            <!-- 文本 -->
            <div class="chatInfo-left" v-if="message.type==='TIMTextElem'"><span>{{message.payload.text}}</span></div>
            <!-- 图片 -->
            <el-image v-else-if="message.type === 'TIMImageElem'" @contextmenu.stop.prevent="$refs.ctxshow.showMenu($event,message.payload.imageInfoArray[0].imageUrl)" :style="imageStyle(message.payload.imageInfoArray[0])" :src="message.payload.imageInfoArray[0].imageUrl" :preview-src-list="imgList"></el-image>
            <!-- 语音消息 -->
            <div class="chatInfo-left" v-if="message.type === 'TIMSoundElem'">
              <audio :src="message.payload.url" controls="controls"></audio>
            </div>
            <!-- 卡片 -->
            <message-card :message="message" v-if="message.type === 'TIMCustomElem'"></message-card>
          </div>
        </div>
      </template>
      <!-- 自己发送的消息 -->
      <template v-if="message.from === userInfo.keyID || (isRecord && (message.from===assistantStaffID || message.from===doctorStaffID))">
        <div class="message-right_container">
          <div>
            <div class="chatName-right">
              <span v-if="isRecord && message.isSys" style="margin-right: 10px">[系统消息]</span>
              <span v-if="isRecord">{{renderDoctor(message).jobType===0?'医生':'IP医生' || ''}}-{{renderDoctor(message).doctorName || ''}}</span>
            </div>
            <div class="message-item-right">
              <!-- 文本 -->
              <div class="chatInfo-right" v-if="message.type==='TIMTextElem'"><span>{{message.payload.text}}</span></div>
              <!-- 图片 -->
              <el-image v-else-if="message.type === 'TIMImageElem'" @contextmenu.stop.prevent="$refs.ctxshow.showMenu($event,message.payload.imageInfoArray[0].imageUrl)" :style="imageStyle(message.payload.imageInfoArray[0])" :src="message.payload.imageInfoArray[0].imageUrl" :preview-src-list="imgList"></el-image>
              <!-- 语音消息 -->
              <div class="chatInfo-right" v-if="message.type === 'TIMSoundElem'">[语音消息]</div>
              <!-- 卡片 -->
              <message-card :message="message" v-if="message.type === 'TIMCustomElem'"></message-card>
            </div>
          </div>
          <div class="myAvatar ml10">
            <img v-if="!isRecord" :src="tmc.groupObj[userInfo.keyID].faceImage||defaultAvatar" shape="square" :size="35" />
            <img v-if="isRecord" :src="renderDoctor(message).faceImage||defaultAvatar" shape="square" :size="35" />
          </div>
        </div>
      </template>
    </template>

    <e-vue-contextmenu ref="ctxshow" v-if="!isRecord" id="contextStyle" class="contextmenu" @ctx-show="show">
      <div @click="handleSaveLog">保存到沟通记录</div>
      <div @click="handleSaveLocal">保存到本地</div>
    </e-vue-contextmenu>
    <el-dialog title="输入备注" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-input v-model="desc" placeholder="备注" type="textarea" maxlength="400" show-word-limit></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSaveContact">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import EVueContextmenu from "e-vue-contextmenu";
import { mapGetters, mapActions } from "vuex";
import defaultAvatar from "@/assets/image/tmcinquiry/default-avatar.png";
import messageCard from "./messageCard";
import "./../../../utils/time.js";
Vue.use(EVueContextmenu);
export default {
  components: { messageCard },
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
    isRecord: {
      type: Boolean,
      default: false
    },
    recordList: {
      type: Array,
      default: () => []
    },
    patientFaceImage: {
      type: String,
      default: ""
    },
    doctroFaceImage: {
      type: Array,
      default: () => []
    },
    patientName: {
      type: String,
      default: ""
    },
    assistantStaffID: {
      type: String,
      default: ""
    },
    doctorStaffID: {
      type: String,
      default: ""
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
  watch: {
    message: {
      deep: true,
      immediate: true,
      handler (val) {
        this.customData = this.message.payload.data
          ? JSON.parse(this.message.payload.data)
          : {};
      }
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
      currentUrl: "",
      admin: ""
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
    ...mapActions({
      updateGroupObj: "tmc/updateGroupObj" // 更新消息对象
    }),
    renderDoctor (message) {
      let obj = this.doctroFaceImage.find(item => {
        return item.keyID === message.from;
      });
      if (!obj) {
        obj = {};
      }
      return obj;
    },
    show (data) {
      this.currentUrl = data;
      this.desc = "";
    },
    hideMenu () {
      this.$refs.ctxshow.hideMenu(); // 隐藏菜单
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

        if (window.navigator.msSaveOrOpenBlob) {
          // if browser is IE
          navigator.msSaveBlob(url.src, url.name); // filename文件名包括扩展名，下载路径为浏览器默认路径
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
        var arr = dataurl.split(",");
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      }
    },
    // 保存到沟通记录
    handleSaveLog () {
      this.dialogVisible = true;
    },
    // 保存沟通记录
    async handleSaveContact () {
      if (!this.desc) {
        this.$message({
          type: "warning",
          message: "请输入备注"
        });
        return false;
      }
      let params = {
        patientID: this.tmc.patientID, //
        orgID: this.userInfo.orgID,
        record: this.desc,
        staffName: this.userInfo.staffName,
        inquiryID: this.tmc.patientID, // 患者id
        staffID: this.userInfo.keyID,
        staffType: "" + this.userInfo.staffTypeID,
        patientContactImgList: [
          {
            imgUrl: this.message.payload.imageInfoArray[0].imageUrl
          }
        ]
      };
      const res = await this.$_http.post(
        this.$_API.INTERFACE_TMC_POST_UPLOADSAVECONTACT,
        params
      );
      if (res.data) {
        this.$message({
          type: "success",
          message: "保存成功"
        });
        this.$store.dispatch("tmc/saveChatLog");
        this.dialogVisible = false;
      }
    },
    dealImgMsg () {
      this.imgUrl = this.message.payload.imageInfoArray[0].imageUrl;
      this.imgList.push(this.imgUrl);
    },
    hintShow () {
      let res = false;
      if (this.message.type !== "TIMCustomElem") {
        return false;
      }
      if (this.customData.customType === "hint") {
        if (this.customData.childType === "self") {
          res = true;
        } else if (this.customData.childType === "both") {
          res = true;
        } else if (
          this.customData.childType === "assign" &&
          this.customData.data.assign &&
          this.customData.data.assign.match(this.userInfo.keyID)
        ) {
          res = true;
        }
      }
      return res;
    },
    messageShow () {
      if (this.message.from === "administrator" && this.message.type === "TIMTextElem") {
        if (this.isRecord) {
          this.message.from = this.assistantStaffID;
        } else {
          this.message.from = this.tmc.assistantStaffID;
        }
        this.message.isSys = true;
        return true;
      } else if (!this.tmc.groupObj[this.message.from] && !this.isRecord) {
      }
      let res = false;
      if (this.message.type === "TIMCustomElem") {
        if (this.customData.customType === "card") {
          res = true;
        }
      } else {
        res = true;
      }
      return res;
    },
    // 消息间隔时间
    intervalTime (index) {
      if (this.isRecord && index === this.recordList.length - 1 && index !== 0) {
        return "";
      } else if (index === this.tim.msgList.length - 1 && index !== 0) {
        let time = this.formatDateTime(this.message.time * 1000);
        return time;
      } else if (index === 0) {
        return "";
      } else {
        console.log('===')
        let curItem = this.tim.msgList[index];
        let lastItem = this.tim.msgList[index + 1];
        if (this.isRecord) {
          curItem = this.recordList[index];
          lastItem = this.recordList[index + 1];
        }
        // 间隔时间为5分钟
        let intervalTime = 60 * 5;
        if (
          lastItem &&
          curItem &&
          lastItem.time &&
          curItem.time &&
          lastItem.time - curItem.time > intervalTime
        ) {
          let time = new Date(curItem.time * 1000).toWeiXinString();
          return time;
        } else {
          return "";
        }
      }
    },
    formatDateTime (inputTime) {
      var date = new Date(inputTime);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? ("0" + m) : m;
      var d = date.getDate();
      d = d < 10 ? ("0" + d) : d;
      var h = date.getHours();
      h = h < 10 ? ("0" + h) : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? ("0" + minute) : minute;
      second = second < 10 ? ("0" + second) : second;
      return y + "年" + m + "月" + d + "日" + "" + h + ":" + minute + ":" + second;
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
  // margin-right: 10px;
}
.ml10{
  margin-left:10px;
}
.mr10{
  margin-right:10px;
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
}
.message-right_container {
  display: flex;
  justify-content: flex-end;
}
</style>
