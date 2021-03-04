"use strict";

/* eslint-disable no-unused-vars */

import Vue from "vue";

// name 子系统名称
// url 子系统使用的环境变量（请求地址）
const subList = [
  {
    name: "API_LIST_LOGIN",
    url: "VUE_APP_LOGIN_URL"
  },
  {
    name: "API_LIST_FILE",
    url: "VUE_APP_FILE_URL"
  },
  {
    name: "API_LIST_USER",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_LIST_SHARE_ROOM",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_LIST_NURSE",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_LIST_HOUSHI",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_LIST_FINANCE",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_LIST_EXAMINE",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_LIST_TRANSFER",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_LIST_RP",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_LIST_RPMANAGE",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_LIST_YUNINQUIRY",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_LIST_ASSISTANT",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_LIST_MEDICINE",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_LIST_IMPORT",
    url: "VUE_APP_IMPORT_URL"
  },
  {
    name: "API_LIST_HOSPITAL",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_LIST_TMC",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_LIST_CONTENT",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_LIST_SMS",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_LIST_SYSTEM",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_COUPON",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_STOCK",
    url: "VUE_APP_HOSPITAL_URL"
  },
  {
    name: "API_LIST_AUTORE",
    url: "VUE_APP_HOSPITAL_URL"
  }
];

// 所有api子系统
let API_LIST = {};
const moduleFiles = require.context("./modules", true, /\.js$/);
moduleFiles.keys().forEach(modulePath => {
  API_LIST = { ...API_LIST, ...moduleFiles(modulePath).default };
});
// 合成API地址集合
let apiList = {};
subList.forEach(it => {
  let subApi = Object.entries(API_LIST[it.name]).reduce((target, [key, value]) => {
    target[key] =
      process.env[it.url].replace(/\W*$/, "") + "/" + value.replace(/^\W*/, "");
    return target;
  }, {});
  apiList = { ...apiList, ...subApi };
});

// 注册所有API地址
Object.defineProperty(Vue.prototype, "$_API", {
  get() {
    return apiList;
  }
});
export default apiList;
