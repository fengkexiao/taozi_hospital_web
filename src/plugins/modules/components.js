export default {
  install: Vue => {
    // 将"@/components/global"目录下的vue文件全部注册为全局组件
    let moduleFiles = require.context("@/components/global", true, /\.vue$/);
    const reg = [/\/([^\/]+)\/index\.vue$/, /\/([^\/]+)\.vue$/];
    moduleFiles.keys().forEach(modulePath => {
      // 匹配
      let regMatch = reg.find(r => {
        return r.test(modulePath);
      });
      // 注册
      Vue.component(
        regMatch.exec(modulePath)[1],
        moduleFiles(modulePath).default
      );
    });
  }
};
