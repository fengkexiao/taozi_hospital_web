import Vue from "vue";
import App from "./App.vue";
// 路由
import router from "./router";
// Vuex
import store from "./store";

// 是否启用PWA
import "./sw/registerServiceWorker";
// 注册自定义插件
import "./plugins";
// 调用共通js
import "./common";
// 共通filters
import * as filters from "./filters";
// 全局css
import "@/styles/index.scss";
import "animate.css";
import "./common/tim";

import westernMedicine from "./../public/dict-disease-ICD.json";
// import chineseMedicine from "./../public/dict-disease-ZH.json";

if (!localStorage.getItem("westernMedicine")) {
  localStorage.setItem("westernMedicine", JSON.stringify(westernMedicine));
}
// if (!localStorage.getItem("chineseMedicine")) {
//   localStorage.setItem("chineseMedicine", JSON.stringify(chineseMedicine));
// }

Object.entries(filters).forEach(([key, value]) => {
  Vue.filter(key, value);
});

// 阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false;
// 开发时是否使用数据库中的菜单，修改后需要重新登陆
if (process.env.NODE_ENV !== "production") {
  sessionStorage.MenusFromDB = true;
}

Vue.prototype.$ELEMENT = { size: "small" };

const $bus = new Vue();
Object.defineProperties(Vue.prototype, {
  $bus: {
    get() {
      return $bus;
    }
  }
});

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount("#app");
