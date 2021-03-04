"use strict";

// 工具包：输入框的事件专用

/**
 * 只能输入数字
 * @param {*} target input目标对象
 */
export function onlyNumber(target) {
  let value = target.value;
  // 把非数字的都替换掉
  value = value.replace(/\D/g, "");
  target.value = value;
}

/**
 * 只能输入浮点数：负号、数字加小数点
 * @param {*} target input目标对象
 */
export function onlyFloat(target) {
  let value = target.value;
  // 是否是负数
  let negative = value.startsWith("-");
  // 先把非数字的都替换掉，除了数字和.
  value = value.replace(/[^\d\.]/g, "");
  // 前两位不能是0加数字
  value = value.replace(/^0(\d+)/g, "$1");
  // 必须保证第一个为数字而不是.
  value = value.replace(/^\./g, "");
  // 保证只有出现一个.而没有多个.
  value = value.replace(/\.{2,}/g, ".");
  // 保证.只出现一次，而不能出现两次以上
  value = value
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".");
  if (negative) value = "-" + value;
  target.value = value;
}

/**
 * 只能输入2位小数
 * @param {*} target input目标对象
 */
export function onlyFixedTwo(target) {
  let value = target.value;
  value = value.replace(/(.*\.\d\d).*/g, "$1");
  target.value = value;
}

/**
 * 格式化为2位小数
 * @param {*} target input目标对象
 */
export function formatToFixedTwo(target) {
  let value = parseFloat(target.value);
  if (isNaN(value)) {
    target.value = "";
    return;
  }
  if (value === 0) {
    target.value = "0";
    return;
  }
  target.value = (parseFloat(value)).toFixed(2);
}
