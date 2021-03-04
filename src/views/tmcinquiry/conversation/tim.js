import TIM from "tim-js-sdk";
import COS from "cos-js-sdk-v5";
import { SDK_APP_ID } from "@/common/Constant";

let options = {
  SDKAppID: SDK_APP_ID // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
};
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let tim = TIM.create(options); // SDK 实例通常用 tim 表示

// 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
// tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用

// 注册 COS SDK 插件
tim.registerPlugin({ "cos-js-sdk": COS });

export default tim;
