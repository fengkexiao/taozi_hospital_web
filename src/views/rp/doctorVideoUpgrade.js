import "@/assets/sdk/webim/webim.js";
// import "@/assets/sdk/webim/json2.js";
/* eslint-disable */
import { SDK_APP_ID } from "@/common/Constant";
import TRTC from 'trtc-js-sdk';
export default {
  inject: ["handleVideo"],
  methods: {
    // 注册im
    login() {
      // im数据
      let ImConfig = {
        sdkAppID: SDK_APP_ID,
        appIDAt3rd: SDK_APP_ID,
        accountType: 0,
        identifier: this.userInfo.keyID,
        userSig: this.userSig,
        identifierNick: this.userInfo.keyID
      };
      webim.login(
        ImConfig,
        this.listeners,
        this.options,
        function(resp) {
          console.log("注册Im成功");
        },
        function(err) {
          alert(err.ErrorInfo);
        }
      );
    },
    // 监听连接状态回调变化事件
    onConnNotify(resp) {
      let info;
      switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
          // console.log("建立连接成功: " + resp.ErrorInfo);
          break;
        case webim.CONNECTION_STATUS.OFF:
          info =
            "连接已断开，无法收到新消息，请检查下您的网络是否正常: " +
            resp.ErrorInfo;
          break;
        case webim.CONNECTION_STATUS.RECONNECT:
          info = "连接状态恢复正常: " + resp.ErrorInfo;
          break;
      }
    },
    // 监听 C2C 系统消息通道
    onC2cEventNotifys(resp) {
      console.log("resp", resp + "----");
    },
    // 监听新消息事件
    onMsgNotify(newMsgList) {
      const _this = this;
      for (const msg of newMsgList) {
        for (const elem of msg.getElems()) {
          let content = elem.getContent();
          const txt = JSON.parse(content.data);
          // 后台消息
          switch (txt.childType) {
            // 根据发来消息确定 是否是视频问诊
            case "video":
              // 获取问诊id  得到问诊信息
              _this.inquiryId = txt.data.inquiryId;
              _this.sponsorsId = txt.data.clientUserId;
              // 获取患者ID + 药品信息
              _this.getPrescribe(_this.inquiryId);
              _this.multipleList = true;
              _this.sign1 = true;
              break;
            case "":
              // app 消息
              if (txt.data.type === "appCancel") {
                // 弹框消失
                _this.handleVideo(false);
                _this.sign1 = false;
                _this.multipleList = false;
                break;
              } else if (txt.data.type === "appSure") {
                // 退出房间
                _this.endCall();
                break;
              }
              break;
          }
        }
      }
    },
    // 返回按钮事件
    waitFor() {
      this.currentlyShow = 1;
      this.fanHui();
    },
    // 结束问诊
    end() {
      let _this = this;
      _this.sign1 = false;
      let data = {
        keyID: _this.inquiryId,
        clientUserID: _this.sponsorsId,
        doctorID: _this.userInfo.keyID
      };
      _this.$_http.post(_this.$_API.API_RP_INQUIRY_END, data).then(res => {
        _this.SendImMsg(_this.sponsorsId, "finished", "medicine", "完成视频");
        _this.endCall();
      });
    },
    // 修改问诊状态
    updateInquiryType(state) {
      let _this = this;
      let data = {
        keyID: _this.inquiryId,
        inquiryType: state,
        clientUserID: _this.sponsorsId,
        doctorID: _this.userInfo.keyID
      };
      _this.$_http.post(_this.$_API.API_RP_INQUIRY_UPDATEINQUIRYTYPE, data).then(res => {
        // console.log("问诊状态修改成功");
      });
    },
    // 获取视频 userSig
    getUseSig() {
      let params = {
        userId: this.userInfo.keyID
      };
      let requests = this.$_http.get(this.$_API.API_RP_INITIAL_GETUSERSIG, {
        params
      });
      requests.then(res => {
        if (!res.data) return;
        this.userSig = res.data.userSig;
        this.login();
      });
    },
    // 停止推流
    stopRTC() {
      let _this = this;
      _this.RTC.stopRTC({}, function() {
        // console.debug("成功停止推流");
      }, function() {
        // console.debug('stop end');
      });
    },
    // 关掉/拒绝视频
    endCall() {
      let _this = this;
      _this.RTC.leave().catch(error => {
        console
          .error(error => {
            console.error('退房失败 ' + error);
            // 错误不可恢复，需要刷新页面。
          })
          .then(() => {
            // 退房成功，可再次调用client.join重新进房开启新的通话。
          });
      });
    },
    // 接受对方呼叫
    acceptCall() {
      let _this = this;
      let sdkAppId = SDK_APP_ID;
      let userId = _this.userInfo.keyID;
      let userSig = _this.userSig;
      let roomId = _this.roomid1.roomId;
      _this.RTC = TRTC.createClient({
        mode: 'videoCall',
        sdkAppId,
        userId,
        userSig
      });
      _this.RTC
        .join({ roomId })
        .catch(error => {
          console.error('进房失败 ' + error);
        })
        .then(() => {
          _this.SendImMsg(_this.sponsorsId, "accept", "medicine", "接收视频");
          _this.currentlyShow = 2;
          _this.getLocalStream();
        });
      _this.RTC.on('stream-added', event => {
        const remoteStream = event.stream;
        console.log('远端流增加: ' + remoteStream.getId());
        //订阅远端流
        _this.RTC.subscribe(remoteStream);
      });
      _this.RTC.on('stream-subscribed', event => {
        const remoteStream = event.stream;
        console.log('远端流订阅成功：' + remoteStream.getId());
        // 播放远端流
        remoteStream.play('remoteVideo' + remoteStream.getId());
      });
    },
    getLocalStream() {
      let _this = this;
      let userId = _this.userInfo.keyID;
      let localStream = TRTC.createStream({ userId, audio: true, video: true });
      // localStream.setVideoProfile({ width: 640, height: 480, frameRate: 15, bitrate: 900 /* kpbs */});
      localStream
        .initialize()
        .then(() => {
          console.log('初始化本地流成功');
          // localStream.play('local');
          // _this.startRTC(localStream);
        });
    },
    startRTC(localstream) {
      let _this = this;
      _this.RTC
        .publish(localstream)
        .catch(error => {
          // console.error('本地流发布失败 ' + error);
        })
        .then(() => {
          console.log('本地流发布成功');
        });
    },
    getRoomID() {
      let _this = this;
      let params = {
        "inquiryId": _this.inquiryId,
        "sponsorsId": _this.sponsorsId,
        "receiverId": _this.userInfo.keyID
      };
      _this.$_http.get(_this.$_API.API_RP_INITIAL_GETROOMID, { params }).then(res => {
        if (!res.data) return;
        _this.roomid1 = res.data;
        _this.acceptCall();
      });
    },
    // 对方ID 消息识别 (参数含义：发消息对象ID，类型，描述，..)
    SendImMsg(targerId, type, ext, desc, id) {
      let _this = this;
      let selSess = new webim.Session(
        "C2C",
        targerId,
        targerId,
        "",
        Math.round(new Date().getTime() / 1000)
      );
      let msg = new webim.Msg(
        selSess,
        true,
        -1,
        Math.round(Math.random() * 4294967296),
        Math.round(new Date().getTime() / 1000),
        id,
        0, ""
      );
      let data = {};
      let msgContent = {};
      data.name = "";
      msgContent.customType = "sys";
      msgContent.childType = "";
      if (type === 'reject') {
        data.type = type,
          data.time = new Date()
      } else if (type === 'accept') {
        data.roomId = _this.roomid1.roomId,
          data.type = type,
          data.time = new Date()
      }
      msgContent.data = data;
      const text_obj = new webim.Msg.Elem.Custom(
        JSON.stringify(msgContent),
        desc,
        ext
      );
      // console.log("发送消息", text_obj);
      msg.addCustom(text_obj);
      webim.sendMsg(msg);
    },
    // 返回按钮事件
    fanHui() {
      let _this = this;
      _this.currentlyShow = 1;
      _this.patientInfo = {};
      _this.InquiryRecord = {};
      _this.medicineName = "";
      _this.goodsId = [];
      _this.medicineId = [];
      _this.goodsInfo = [];
      _this.medicineInfo = [];
      _this.medicineCount = [];
      _this.providerID = [];
      _this.frequencyInfo = [];
    },
    // 医生拒绝接受（发消息给患者）
    refuse() {
      let _this = this;
      _this.SendImMsg(_this.sponsorsId, "reject", "medicine", 2);
      _this.updateInquiryType(3);
      _this.handleVideo(false);
    },
    // 医生同意接诊
    receive() {
      let _this = this;
      _this.getRoomID();
      _this.responseInquiry();
      _this.handleVideo(false);
    }
  },
  // 界面控制
  destroyed() {
    // 退出登陆im
    webim.logout();
    // console.log("退出成功");
  }
};
