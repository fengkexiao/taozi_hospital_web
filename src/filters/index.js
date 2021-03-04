import fecha from "element-ui/src/utils/date";
import { isDataType } from "@/utils/tools";

// 验证是否是数字或字符串
function validateToNumber(val) {
  return typeof val === "string" || typeof val === "number";
}

// 验证日期是否合理
function validateDate(val) {
  let date = val;
  // Invalid Date
  if (!date || !date.getTime()) {
    return "";
  }
  let day = fecha.format(date, "yyyy-MM-dd");
  if (day === "1970-01-01" || day === "1900-01-01") {
    return false;
  }
  return true;
}

// 格式化日期+时间
export function formatDateTime(date) {
  let temp = date;
  if (!isDataType(date, "Date")) {
    temp = new Date(date);
  }
  if (!validateDate(temp)) {
    return "";
  }
  return fecha.format(temp, "yyyy-MM-dd HH:mm:ss");
}

// 格式化日期
export function formatDate(date) {
  let temp = date;
  if (!isDataType(date, "Date")) {
    temp = new Date(date);
  }
  if (!validateDate(temp)) {
    return "";
  }
  return fecha.format(temp, "yyyy-MM-dd");
}

// 格式化日期
export function formatMonth(date) {
  let temp = date;
  if (!isDataType(date, "Date")) {
    temp = new Date(date);
  }
  if (!validateDate(temp)) {
    return "";
  }
  return fecha.format(temp, "yyyy-MM");
}

// 格式化金额
export function formatMoney(money) {
  if (!validateToNumber(money)) {
    return "";
  }
  let num = parseFloat(money);
  if (num === 0) {
    return 0;
  }
  if (!num) {
    return "";
  }
  let mark = num.toString().split(".")[1];
  if (!mark) {
    return (num / 100).toFixed(2);
  }
  if (mark.length === 1) {
    return (num / 100).toFixed(3);
  }
  return (num / 100).toFixed(4);
}

// 格式化金额(格式化总价时展示用)
export function formatMoneyForSumShow(money) {
  if (!validateToNumber(money)) {
    return "";
  }
  let num = parseFloat(money);
  if (num === 0) {
    return 0;
  }
  if (!num) {
    return "";
  }
  return (num / 100).toFixed(2);
}

// 格式化金额，带符号
export function formatMoneyWithSymbol(money) {
  if (!validateToNumber(money)) {
    return "";
  }
  let num = parseFloat(money);
  if (num === 0) {
    return "￥0";
  }
  if (!num) {
    return "";
  }
  return "￥" + (num / 100).toFixed(2);
}

// 格式化时长
export function formatDuration(time) {
  if (!validateToNumber(time)) {
    return "";
  }
  let durition = parseFloat(time);
  if (!durition && durition !== 0) {
    return "";
  }
  if (durition < 0) {
    return "";
  }
  let m = ~~(durition / 60);
  let s = durition % 60;
  if (m < 60 && s === 0) {
    return `${m}分钟`;
  }
  let h = ~~(m / 60);
  m = m % 60;
  let d = ~~(h / 24);
  h = h % 24;
  let retS = s ? `${s}秒` : "";
  let retM = m ? `${m}分` : "";
  let retH = h ? `${h}小时` : "";
  let retD = d ? `${d}天` : "";
  return `${retD}${retH}${retM}${retS}`;
}

const SEX_LIST = ["", "男", "女"];
// 格式化性别
export function formatSex(sex) {
  return SEX_LIST[sex] || "";
}

// 格式化年龄
export function formatAge(age) {
  if (!age) return "";
  // 纯数字
  if (/^\d+$/.test(age)) return `${age}岁`;
  return age;
}

// 格式化年龄
export function formatMobileHidden(mobile) {
  if (!mobile) return "";
  var reg = /^(\d{3})\d{4}(\d{4})$/;
  return mobile.replace(reg, "$1****$2");
}

export function formatDefaultTime(val) {
  if (!val || val === "1900-01-01 00:00:00") return "";
  return val;
}
