import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const moduleFiles = require.context("./modules", true, /\.js$/);
const modules = moduleFiles.keys().reduce((modules, modulePath) => {
  const storeName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  modules[storeName] = moduleFiles(modulePath).default;
  return modules;
}, {});

export default new Vuex.Store({
  plugins: [createPersistedState({
    storage: window.localStorage,
    reducer: state => {
      return {
        user: state.user
      };
    }
  })],
  modules,
  getters
});
