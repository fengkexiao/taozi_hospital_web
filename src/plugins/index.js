import Vue from "vue";

// 全局注册所有插件
let moduleFiles = require.context("./modules", true, /\.js$/);
moduleFiles.keys().forEach(modulePath => {
  Vue.use(moduleFiles(modulePath).default);
});
