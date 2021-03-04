import "@/assets/sdk/webim/webim.js";
import "@/assets/sdk/webim/json2.js";
/* eslint-disable */
import 'js-md5';
import MessageBox from "element-ui/packages/message-box";
import { SDK_APP_ID } from "@/common/Constant";
export default {
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
          console.log("建立连接成功: " + resp.ErrorInfo);
          break;
        case webim.CONNECTION_STATUS.OFF:
          info =
            "连接已断开，无法收到新消息，请检查下您的网络是否正常: " +
            resp.ErrorInfo;
          break;
        case webim.CONNECTION_STATUS.RECONNECT:
          info = "连接状态恢复正常: " + resp.ErrorInfo;
          break;
        default:
          console.error("未知连接状态: =" + resp.ErrorInfo);
          break;
      }
    },
    // 监听 C2C 系统消息通道
    onC2cEventNotifys(resp) {
      console.log("resp", resp + " ----");
    },
    // 监听新消息事件
    onMsgNotify(newMsgList) {
      const _this = this;
      for (const msg of newMsgList) {
        for (const elem of msg.getElems()) {
          let content = elem.getContent();
          const txt = JSON.parse(content.data);
          switch (txt.childType) {
            // 根据发来消息确定 是否是视频问诊
            case "video":
              _this.inquiryId = txt.data.inquiryId;
              _this.orderId = txt.data.bizId;
              _this.sponsorsId = txt.data.clientUserId;
              MessageBox.confirm(
                "网点端医生发起一个视频问诊请求，是否接听？",
                "提示", {
                  confirmButtonText: "接听",
                  cancelButtonText: "拒绝",
                  type: "warning",
                  closeOnClickModal: false,
                  closeOnPressEscape: true
                }
              ).then(() => {
                if (_this.$route.name !== "coTreatCenter") {
                  _this.$router.push({
                    name: "coTreatCenter"
                  });
                };
                _this.multipleList = true;
                _this.getRoomID();
                _this.responseInquiry();
              }).catch(() => {
                _this.SendImMsg(_this.sponsorsId, "reject", "houshi", "拒绝视频");
                _this.updateInquiryType(3);
              });
              break;
            case "":
              // app 消息
              if (txt.data.type === "appCancel") {
                // 弹框消失
                MessageBox.close();
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
    // 结束问诊
    end() {
      let _this = this;
      // 设置标记
      _this.sign = false;
      let data = {
        keyID: _this.inquiryId,
        clientUserID: _this.sponsorsId,
        doctorID: _this.userInfo.keyID,
        endType: "yun",
      };
      _this.$_http.post(_this.$_API.API_RP_INQUIRY_END, data).then(res => {
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
        console.log("问诊状态修改成功");
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
        console.debug('stop succ')
      }, function() {
        console.debug('stop end')
      });
    },
    // 关掉/拒绝视频
    endCall() {
      let _this = this;
      try {
        _this.RTC.quit(
          _ => {
            _this.stopRTC();
            this.end();
            _this.SendImMsg(_this.sponsorsId, "finished", "houshi", "完成视频");
            _this.multipleList = false;
            _this.sign = false;
          },
          _ => {
            _this.$message.error("关闭失败");
          }
        );
      } catch (error) {
        _this.$message.error("关闭失败");
      }
    },
    // 接受对方呼叫
    acceptCall() {
      let _this = this;
      _this.sign = true;
      // return
      _this.RTC = new WebRTCAPI({
        userId: this.userInfo.keyID,
        sdkAppId: SDK_APP_ID,
        userSig: this.userSig
      });
      _this.RTC.enterRoom(
        {
          roomid: _this.roomid1.roomId
        },
        function() {
          // 进房房间成功
          _this.SendImMsg(_this.sponsorsId, "accept", "houshi", "接收视频");
          _this.currentlyShow = 2;
          _this.getPatientByOrderID(_this.orderId);
          _this.getLocalStream();
        },
        function(data) {
          // 进入房间失败
          _this.endCall();
          _this.SendImMsg(_this.sponsorsId, "reject", "houshi", "进入房间失败");
        }
      );
      _this.RTC.on("onRemoteStreamUpdate", function(data) {
        console.info("远程更新" + JSON.stringify(data));
        if (data && data.stream) {
          var stream = data.stream;
          console.log(
            data.userId + "enter this room with unique videoId " + data.videoId
          );
          document.getElementById("remoteVideo").srcObject = stream;
          setTimeout(() => {
            // 请求混流   暂时不做
            // _this.getStream();
          }, 1000);
          // _this.getStream();
        } else {
          console.debug("somebody enter this room without stream");
        }
      });
      _this.RTC.on("onRemoteStreamRemove", function(data) {
        _this.endCall();
      });
      _this.RTC.on("onRelayTimeout", function(data) {
        // 视频服务器超时
        _this.endCall();
      });
      _this.RTC.on("onStreamNotify", function(info) {
        if (info.event == "onended" && !info.isLocal) {
          // _this.$message.error("用户已挂断");
          setTimeout(() => {
            // 退出房间
            _this.endCall();
          }, 3000);
        }
      });
    },
    getLocalStream() {
      let _this = this;
      _this.RTC.getLocalStream(
        {
          video: true,
          audio: true,
          attributes: {
            width: 150,
            height: 150,
            frameRate: 20
          }
        },
        function(info) {
          var localstream = info.stream;
          document.getElementById("local").srcObject = localstream;
          _this.startRTC(localstream);
        },
        function(error) {
          console.error("本地视频error" + error.errorMsg);
        }
      );
    },
    startRTC(localstream) {
      let _this = this;
      _this.RTC.startRTC(
        {
          role: _this.userInfo.keyID,
          stream: localstream
        },
        function() {
          //成功
          console.log("成功");
        },
        function() {
          //失败
          console.warn("失败");
        }
      );
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
    // 对方ID 消息识别 
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
      msg.addCustom(text_obj);
      webim.sendMsg(msg);
    },
    // 返回按钮事件
    waitFor() {
      this.currentlyShow = 1;
      // 数据重置
      this.setFree();
      this.goone();
    },
    // 修改医生在线状态
    setFree() {
      let _this = this;
      _this.$_http.post(_this.$_API.API_RP_IMSTATUS_SETFREE, { "doctorId": _this.userInfo.keyID }).then(res => {
      });
    }
  },
  destroyed() {
    // 退出登陆im
    webim.logout();
    console.log("退出成功");
  }
};
