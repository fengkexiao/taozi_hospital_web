import mockMunus from "@/router/menu";
import router from "@/router";
import { setCookie, removeCookie } from "@/utils/cookie";
import { AUTH_TOKEN_FRONT } from "@/common/Constant";

const state = {
  userInfo: {},
  menus: [],
  roles: []
};

const mutations = {
  // 登录状态保存
  SET_LOGIN: (state, user) => {
    state.userInfo = user;
    setCookie(AUTH_TOKEN_FRONT, user.token);
  },
  // 添加userInfo信息
  ADD_USERINFO: (state, addInfo) => {
    let keys = Object.keys(addInfo);
    for (let i = 0; i < keys.length; i++) {
      state.userInfo[keys[i]] = addInfo[keys[i]];
    }
  },
  // 菜单状态保存
  SET_MENU(state, menus) {
    if (sessionStorage.MenusFromDB === "false") {
      state.menus = mockMunus;
      return;
    }
    state.menus = menus;
  },
  // 角色状态保存
  SET_ROLE(state, roles) {
    state.roles = roles;
  },
  // 注销登录状态
  SET_LOGOUT(state) {
    state.userInfo = {};
    state.menus = [];
    state.roles = [];
    sessionStorage.removeItem("online");
    removeCookie(AUTH_TOKEN_FRONT);
  }
};

const actions = {
  logout({ commit, dispatch }) {
    commit("SET_LOGOUT");
    commit("tmc/resetAllInfo");
    router.push("/login");
    return dispatch("tagsView/delAllViews", null, { root: true });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
