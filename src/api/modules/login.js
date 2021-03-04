// 登录相关api
export default {
  API_LIST_LOGIN: {
    // 登录
    INTERFACE_LOGIN: "api/peachLogin/hospital/loginByUserPass",
    // 选择医院
    INTERFACE_LOGIN_ORGID: "api/peachLogin/hospital/loginByUserPassAndOrgID",
    // 退出登录
    INTERFACE_LOGOUT: "api/peachLogin/hospital/logout",
    // 获取验证码
    INTERFACE_GET_FETCHAUTHCODE: "/api/peachLogin/hospital/getVerifiCode",
    // 校验验证码
    INTERFACE_GET_AUTHVERIFICODE: "api/peachLogin/hospital/authVerifiCode",
    // 校验验证码
    INTERFACE_UPDATEPASSA_LOGIN: "/api/peachLogin/hospital/modifyPassWordAndLogin",
    // 登录域名校验
    INTERFACE_GET_LOGINHOST: "/api/peachLogin/hospital/getLoginPage"

  }
};
