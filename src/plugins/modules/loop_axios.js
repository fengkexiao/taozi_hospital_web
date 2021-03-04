"use strict";

import axios from "axios";
import { getCookie } from "@/utils/cookie";
import { AUTH_TOKEN_FRONT, AUTH_TOKEN_END } from "@/common/Constant";
import { getAllPromise } from "@/utils/tools";

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
    const success = response.status === 200 && response.data.code === 0;
    let message = "";
    return {
      data: response.data.data,
      success,
      message
    };
  },
  error => {
    return Promise.reject(error);
  }
);

export default {
  install: Vue => {
    Vue.$_loop_http = _axios;
    window.$_loop_http = _axios;
    Object.defineProperties(Vue.prototype, {
      $_loop_http: {
        get() {
          return _axios;
        }
      }
    });
  }
};
