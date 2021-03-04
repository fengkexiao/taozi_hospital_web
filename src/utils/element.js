"use strict";

// 工具包：Element-UI中相关的方法，可在js中使用

import { Message, Notification } from "element-ui";
import { isDataType } from "@/utils/tools";
import { ELEMENT_MESSAGE_DURATION } from "@/common/Constant";

/**
 * 释放已提示结束的消息
 * @param {*} instance 消息对象
 */
function freeExpired(instance, toastList) {
  let index = toastList.findIndex(it => {
    return it.type === instance.type && it.message === instance.message && it.toastType === instance.toastType;
  });
  // 删除对应记录
  toastList.splice(index, 1);
  if (toastList.length <= 0) {
    // 释放toastList
    toastList = null;
  }
}

/**
 * 验证函数构造器
 */
function validateBuilder() {
  // 正在提示的信息记录
  let toastList = null;
  // Message提示
  const toastMessage = options => {
    return Message({
      ...{
        showClose: true,
        duration: ELEMENT_MESSAGE_DURATION,
        onClose: instance => {
          freeExpired({
            type: instance.type,
            message: instance.message,
            toastType: "Message"
          }, toastList);
        }
      },
      ...options
    });
  };
  // Notification提示
  const toastNotification = options => {
    return Notification({
      ...{
        title: "提示",
        showClose: true,
        duration: ELEMENT_MESSAGE_DURATION,
        onClose: instance => {
          freeExpired({
            type: instance.type,
            message: instance.message,
            toastType: "Notification"
          }, toastList);
        }
      },
      ...options
    });
  };
  return function({ type, message }, toastType) {
    if (!message) {
      throw new Error("parameter 'message' is required in arguments");
    }
    if (!toastList) {
      toastList = [];
    }
    let existed = toastList.some(it => {
      // 类型和消息都相同
      return it.type === type && it.message === message && it.toastType === toastType;
    });
    if (existed) {
      // 已提示，则跳过，防止重复提示
      return;
    }
    toastList.push({
      type,
      message,
      toastType
    });
    // 若未提示报错，则提示；
    if (toastType === "Message") {
      return toastMessage(arguments[0]);
    } else {
      return toastNotification(arguments[0]);
    }
  };
}

const validator = validateBuilder();
// 弹出提示
export function toast(type, message, toastType = "Message") {
  const args = arguments;
  const options = args[0];
  if (isDataType(options, "Object")) {
    return validator(options, args[1] || "Message");
  }
  if (isDataType(options, "String")) {
    return validator({ type: message ? type : "info", message: message || type }, toastType);
  }
}
