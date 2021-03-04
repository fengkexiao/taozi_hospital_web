import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/login";

Vue.use(Router);

let routes = [
  {
    path: "/login",
    name: "login",
    component: Login
  }
];
// 菜单路由
const moduleFiles = require.context("./modules", true, /\.js$/);
moduleFiles.keys().forEach(modulePath => {
  routes.push(moduleFiles(modulePath).default);
});
// 共通路由
const commonFiles = require.context("./common", true, /\.js$/);
commonFiles.keys().forEach(modulePath => {
  routes.push(...commonFiles(modulePath).default);
});

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
