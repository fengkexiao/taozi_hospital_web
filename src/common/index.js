// 注册所有api地址为全局变量
import "@/api";
// 注册所有icon图标
import "@/icons";

// 引入所有modules下的js
let moduleFiles = require.context("./modules", true, /\.js$/);
const requireAll = context => context.keys().map(context);
requireAll(moduleFiles);
