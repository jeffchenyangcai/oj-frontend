import router from "@/router";
import store from "@/store";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";

router.beforeEach(async (to, from, next) => {
  console.log("自动登录用户信息", store.state.user.loginUser);
  const loginUser = store.state.user.loginUser;
  //自动登录
  // if (!loginUser || loginUser.userRole) {
  //   await store.dispatch("user/getLoginUser");
  // }

  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    // 如果没登录，跳转到登录页面（还需重定向）
    if (!loginUser || !loginUser.userRole) {
      next(`user/login?redirect=${to.fullPath}`);
      return;
    }
    // 如果已经登陆了，但是不是管理员的话，跳转到权限不足
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }
  next();
});
