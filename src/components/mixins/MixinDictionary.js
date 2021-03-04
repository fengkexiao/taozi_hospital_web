import { mapActions } from "vuex";

// 根据字典code获取字典名称
const getDictName = ({ dictCode, systemCode, groupCode, parentDictCode, dictionaries }) => {
  let target = dictionaries.filter(it => {
    let firstFilter = it.systemCode === systemCode && it.groupCode === groupCode && dictCode.includes(it.dictCode);
    if (parentDictCode) {
      return firstFilter && it.parentDictCode === parentDictCode;
    }
    return firstFilter;
  }).map(it => {
    return it.dictName;
  });
  return target.join("，");
};

export default {
  filters: {
    // 格式化字典数据
    formatDict() {
      return getDictName(arguments[0]);
    }
  },
  data() {
    return {
      dictionaries: []
    };
  },
  methods: {
    ...mapActions({
      getDictionary: "dictionary/getDictionary"
    }),
    /**
     * 根据字典类型获取字典数据
     * @param {*} queryList 对象数组
     * @param {*} systemCode 字典SystemCode
     * @param {*} groupCode 字典分组CODE
     * @param {*} parentDictCode 上级字典CODE
     */
    loadDictionaries(queryList) {
      let syncList = [];
      queryList.forEach(it => {
        let request = this.getDictionary({
          systemCode: it.systemCode,
          groupCode: it.groupCode,
          parentDictCode: it.parentDictCode
        });
        request.then(res => {
          this.dictionaries.push(...res);
        });
        syncList.push(request);
      });
      return syncList;
    },
    // 根据字典code获取字典名称，传入对象
    getDictName() {
      return getDictName(arguments[0]);
    }
  }
};
