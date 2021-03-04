import { toast } from "@/utils/element";
import Vue from "vue";

// render
const h = new Vue().$createElement;

/**
 * 存储全局事件类
 */
var events = {};
export default class globalEvent {
  static set(key, value) {
    events[key] = value;
  }
  static get(key) {
    return events[key];
  }
}

/**
 * 网络断开
 */
window.onoffline = () => {
  if (globalEvent.get("offline")) {
    return;
  }
  let instance = toast({
    type: "error",
    message: h("span", { style: { color: "teal" } }, "网络连接异常，请检查网络！"),
    duration: 0,
    showClose: false
  }, "Notification");
  globalEvent.set("offline", instance);
};

/**
 * 网络重新连接
 */
window.ononline = () => {
  const notify = globalEvent.get("offline");
  if (notify) {
    notify.close();
  }
  toast({
    type: "success",
    message: h("span", { style: { color: "teal" } }, "网络已重新连接")
  }, "Notification");
};
