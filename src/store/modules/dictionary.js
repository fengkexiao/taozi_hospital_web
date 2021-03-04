import Vue from "vue";

const state = {
  dictionaries: []
};

const mutations = {
  ADD_DICTIONARY(state, data) {
    state.dictionaries.push(...data);
  }
};

const actions = {
  // 获取字典
  getDictionary({ commit, state }, { systemCode, groupCode, parentDictCode }) {
    return new Promise((resolve, reject) => {
      let exitDicts = [...state.dictionaries];
      let target = exitDicts.filter(it => {
        let firstFilter = it.systemCode === systemCode && it.groupCode === groupCode;
        if (parentDictCode) {
          return firstFilter && it.parentDictCode === parentDictCode;
        }
        return firstFilter;
      });
      if (target.length > 0) {
        resolve(target);
        return;
      }
      // 若vuex中没有，则从后台获取
      Vue.$_http.get(Vue.prototype.$_API.INTERFACE_HOSPITAL_DICTIONARY, {
        params: {
          systemCode,
          groupCode,
          parentDictCode
        }
      }).then(res => {
        target = res.data;
        commit("ADD_DICTIONARY", target);
        resolve(target);
      }).catch(error => {
        reject(error);
      });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
