"use strict";

import axios from "axios";
import store from "@/store";
import { getCookie } from "@/utils/cookie";
import { toast } from "@/utils/element";
import { AUTH_TOKEN_FRONT, AUTH_TOKEN_END } from "@/common/Constant";
import { getAllPromise } from "@/utils/tools";
import { triggerEvent } from "@/utils/events";

// 完整配置参考:  https://github.com/axios/axios#request-config
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";

let config = {
  baseURL: process.env.BASE_URL || process.env.apiUrl || "",
  timeout: 60 * 1000,
  withCredentials: false,
  crossDomain: true,
  transformRequest: [
    data => {
      if (!data || typeof data === "string") {
        return data;
      }
      if (data instanceof FormData) {
        return data;
      }
      // 对Blob对象进行处理
      let hasBlob = Object.values(data).some(it => {
        return it instanceof Blob;
      });
      if (!hasBlob) {
        return JSON.stringify(data);
      }
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      return formData;
    }
  ]
};

const _axios = axios.create(config);

// 注册all方法，执行多个并发请求
// 可传入Promise、包含Promise的数组、返回值为Promise的方法
_axios.all = (...requsets) => {
  // 获取所有Promise对象
  let promiseList = getAllPromise(requsets);
  return new Promise((resolve, reject) => {
    axios.all(promiseList)
      .then(axios.spread((...response) => {
        // 两个请求现在都执行完成
        resolve(response);
      }))
      .catch(error => {
        reject(error);
      });
  });
};

_axios.interceptors.request.use(
  config => {
    const token = getCookie(AUTH_TOKEN_FRONT);
    config.headers.common[AUTH_TOKEN_END] = token;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 拦截响应
_axios.interceptors.response.use(
  response => {
    if(response.config.responseType==="arraybuffer" || response.config.responseType === 'blob'){
      return response
    }
    // 用来判断是否请求成功
    const success = response.status === 200 && response.data.code === 0;
    let message = "";
    if (!success) {
      if (typeof response.data === "string") {
        message = "服务器错误，未获取到响应数据";
      } else {
        if (response.status === 200 && response.data.code === 0) {
          return Promise.reject(response);
        }
        // 请求成功，但在业务上为失败
        message = response.data.message || response.data.errorData || "操作执行失败";
      }
      toast("error", message);
      return Promise.reject(response);
    }
    return {
      data: response.data.data,
      success,
      message
    };
  },
  error => {
    if (!navigator.onLine) {
      triggerEvent(window, "offline");
      return Promise.reject(error);
    }
    if (!error.response) {
      toast("error", "连接服务器失败");
      return Promise.reject(error);
    }
    let status = error.response.status;
    if (status === 401) {
      toast("error", "您的登录已过期，请重新登录");
      window.location.reload();
      store.dispatch("user/logout");
      return Promise.reject(error);
    }
    if (status < 200) {
      toast("warning", `未处理的消息响应，状态码：${status}`);
    } else if (status >= 300 && status < 400) {
      toast("warning", `未处理的重定向响应，状态码：${status}`);
    } else if (status >= 400 && status < 500) {
      toast("error", `客户端错误，状态码：${status}`);
    } else if (status >= 500) {
      toast("error", `服务器错误，状态码：${status}`);
    }
    // 系统请求失败
    return Promise.reject(error);
  }
);

export default {
  install: Vue => {
    Vue.$_http = _axios;
    window.$_http = _axios;
    Object.defineProperties(Vue.prototype, {
      $_http: {
        get() {
          return _axios;
        }
      }
    });
  }
};
