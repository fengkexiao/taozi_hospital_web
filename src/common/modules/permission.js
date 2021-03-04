import router from "@/router";
// 进度条
import NProgress from "nprogress";
// 进度条样式
import "nprogress/nprogress.css";
import { getCookie } from "@/utils/cookie";
import { AUTH_TOKEN_FRONT } from "@/common/Constant";

NProgress.configure({ showSpinner: false });

// 不需要token的白名单
const whiteList = ["/login"];

// 注册路由跳转的权限控制
router.beforeEach(async (to, from, next) => {
  NProgress.start();

  const hasToken = getCookie(AUTH_TOKEN_FRONT);
  if (hasToken) {
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      next();
    }
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next("/login");
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
