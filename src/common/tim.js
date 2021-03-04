
import TIM from "tim-js-sdk";
import COS from "cos-js-sdk-v5";
import { SDK_APP_ID } from "@/common/Constant";

let globalTim = TIM.create({
  SDKAppID: SDK_APP_ID
});

// 设置日志级别
globalTim.setLogLevel(1);
// 注册 COS SDK 插件
globalTim.registerPlugin({ "cos-js-sdk": COS });

globalTim.on(TIM.EVENT.SDK_READY, onReadyStateUpdate);
// 取消监听(防止多次监听的情况)
globalTim.off(TIM.EVENT.MESSAGE_RECEIVED, onReceiveMessage);
// 收到新消息
globalTim.on(TIM.EVENT.MESSAGE_RECEIVED, onReceiveMessage);

function onReadyStateUpdate() {
  console.warn("sdk_ready");
}

function onReceiveMessage(event) {
  if (event) {
    let myEvent = new CustomEvent("timOnReceiveMessage", {
      detail: event.data
    });
    if (window.dispatchEvent) {
      window.dispatchEvent(myEvent);
    } else {
      window.fireEvent(myEvent);
    }
  }
}

export default globalTim;
