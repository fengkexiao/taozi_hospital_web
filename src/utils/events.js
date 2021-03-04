"use strict";

// 浏览器中的事件管理

/**
 * 触发一个DOM事件
 * @param  {Element} node 事件发生的节点元素
 * @param  {String} name 事件名称，不含前缀：on
 * @param  {...any} options 可选的事件配置项
 */
export function triggerEvent(node, name, ...options) {
  if (node.fireEvent) {
    return node.fireEvent("on" + name);
  }
  let eventName;
  let evt;
  if (/^mouse|click/.test(name)) {
    eventName = "MouseEvents";
    evt = document.createEvent(eventName);
    evt.initMouseEvent(name, ...options);
  } else if (["DOMActivate", "DOMFocusIn", "DOMFocusOut"].includes(name)) {
    eventName = "UIEvents";
    evt = document.createEvent(eventName);
    evt.initUIEvent(name, ...options);
  } else if (/^key/.test(name)) {
    eventName = "KeyboardEvent";
    evt = document.createEvent(eventName);
    evt.initKeyboardEvent(name, ...options);
  } else if (name.startsWith("DOM")) {
    eventName = "MutationEvents";
    evt = document.createEvent(eventName);
    evt.initMutationEvent(name, ...options);
  } else {
    eventName = "HTMLEvents";
    evt = document.createEvent(eventName);
    evt.initEvent(name, ...options);
  }
  return node.dispatchEvent(evt);
};
