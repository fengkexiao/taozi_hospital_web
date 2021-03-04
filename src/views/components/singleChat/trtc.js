import TRTC from "trtc-js-sdk";
import { SDK_APP_ID } from "@/common/Constant";

class RtcClient {
  constructor(options) {
    this.userID = options.userID;
    this.userSig = options.userSig;
    this.roomID = options.roomID;
  }
  async login() {
    this.client = TRTC.createClient({
      mode: "videoCall",
      sdkAppId: SDK_APP_ID,
      userId: this.userID,
      userSig: this.roomID
    });
    this.handleEvent();
    try {
      await  this.client.join({ roomId: this.roomID });
      console.log("进房成功");
      this.publish();
    }catch(err) {
      console.error("进房失败 " + err);
    }
  }

  async publish() {
    // 从麦克风和摄像头采集本地音视频流
    const localStream = TRTC.createStream({ audio: true, video: true });
    try {
      await localStream.initialize();
      console.log("本地流初始化成功");
      // 本地流初始化成功，可通过Client.publish(localStream)发布本地音视频流
      localStream.play("local_stream");
      try {
        await this.client.publish(localStream);
        console.log("本地流推送成功");
      }catch(err) {
        console.log("本地流推送失败 "+err);
      }
      
    }catch(err) {
      console.error("本地流初始化失败 " + error);
    }
  }

  handleEvent() {
    this.client.on("stream-added", event => {
      const remoteStream = event.stream;
      console.log("远端流增加: " + remoteStream.getId());
      // 订阅远端流
      this.client.subscribe(remoteStream);
    });
    this.client.on("stream-subscribed", event => {
      const remoteStream = event.stream;
      console.log("远端流订阅成功");
      // 播放远端流
      remoteStream.play("remote_stream-" + remoteStream.getId());
    });
  }
}

export default RtcClient;
