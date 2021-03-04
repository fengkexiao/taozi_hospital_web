<template>
  <div class="reason-rejection">
    <i class="el-icon-close close-cancel" @click="handleClose"></i>
    <div>
      <span>自定义拒绝理由：</span>
      <el-input maxlength="30" v-model.trim="filterText" placeholder="请输入关键字" debounce v-on:input="handleChange" style="width:438px;max-width:438px;" show-word-limit></el-input>
      <el-button type="primary" class="ml20" @click="handleConf">确定</el-button>
    </div>
    <div class="hr-line"></div>
    <div class="li-container">
<!--      <div class="title">请选择拒绝理由：</div>-->
      <ul>
        <li class="li-parent" v-for="(item,index) of dataList" :key="index">
          <span class="li-title" v-html="item.dictName"></span>
          <ul class="li-child-container">
            <li class="li-child" v-for="(childItem,childIndex) of item.childList" :key="childIndex" @click="handleNode(childItem)" :class="[childItem.check?'li-check':'']" v-html="renderNode(childItem)"></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "reasonRejection",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataList: [],
      filterText: ""
    };
  },
  watch: {
    visible (val) {
      if (val) {
        this.init();
        this.filterText = "";
        this.handleChange();
      }
    }
  },
  async created () {
    this.init();
  },
  methods: {
    async init () {
      let parent = null;
      let child = null;
      this.dataList = [];
      if (!sessionStorage.getItem("D_RP_DOCTORREJECTREASON_CLASS")) {
        parent = await this.getDictionaries("RP", "D_RP_DOCTORREJECTREASON_CLASS");
        child = await this.getDictionaries("RP", "D_RP_DOCTORREJECTREASON_ITEM");
        if (parent) {
          sessionStorage.setItem("D_RP_DOCTORREJECTREASON_CLASS", JSON.stringify(parent));
        }
        if (child) {
          sessionStorage.setItem("D_RP_DOCTORREJECTREASON_ITEM", JSON.stringify(child));
        }
      } else {
        parent = JSON.parse(sessionStorage.getItem("D_RP_DOCTORREJECTREASON_CLASS"));
        child = JSON.parse(sessionStorage.getItem("D_RP_DOCTORREJECTREASON_ITEM"));
      }
      if (parent) {
        this.dataList = parent || [];
      }
      let tmpChildList = [];
      if (child) {
        tmpChildList = child || [];
      }
      this.dataList.map((item, index) => {
        item.childList = [];
        this.$set(this.dataList, index, item);
        tmpChildList.map(childItem => {
          if (item.dictCode === childItem.parentDictCode) {
            item.childList.push(childItem);
          }
        });
      });
    },
    handleChange () {
      if (!this.filterText) {
        this.dataList.map(item => {
          item.childList.map(childItem => {
            childItem.check = false;
          });
        });
      }
    },
    // 渲染节点
    renderNode (item) {
      let str = item.dictName;
      if (this.filterText && !item.check) {
        let reg = new RegExp(this.filterText, "g");
        str = str.replace(reg, "<span style=\"color: rgba(67, 139, 239, 1);\">" + this.filterText + "</span>");
      }
      return str;
    },
    // 点击事件
    handleNode (childItem) {
      this.dataList.map(item => {
        item.childList.map(childItem => {
          childItem.check = false;
        });
      });
      this.filterText = childItem.dictName;
      childItem.check = true;
    },
    // 确定
    handleConf () {
      if (this.filterText) {
        this.$emit("change", this.filterText || "");
      } else {
        this.$_warning({
          message: "请输入拒绝理由",
          type: "warning"
        });
        return false;
      }
    },
    // 关闭
    handleClose () {
      this.$emit("close");
    },
    // 获取字典数据
    async getDictionaries (systemCode, groupCode) {
      let params = {
        systemCode: systemCode,
        groupCode: groupCode
      };
      const res = await this.$_http.get(this.$_API.INTERFACE_HOSPITAL_DICTIONARY, { params });
      if (res.data) {
        return res.data || [];
      }
    }

  }
};
</script>

<style lang="scss" scoped>
.reason-rejection {
  padding: 32px;
}
.close-cancel {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 24px;
  cursor: pointer;
}

.hr-line {
  width: 100%;
  height: 1px;
  background: rgba(216, 216, 216, 1);
  margin-top: 24px;
}
.li-container {
  font-size: 14px;
  .title{
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 10px;
  }
  ul {
    margin: 0;
    padding: 0 0 0 5px;
  }
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .li-parent {
    &:first-child {
      padding-top: 24px;
      // padding-bottom: 16px;
    }
  }
  .li-check {
    background: rgba(67, 139, 239, 1) !important;
    color: #ffffff;
  }
  .li-title {
    font-weight: 500;
  }
  .li-child-container {
    display: flex;
    flex-wrap: wrap;
    padding-top: 16px;
    padding-bottom: 8px;
    .li-child {
      padding: 4px 14px;
      margin-right: 24px;
      cursor: pointer;
      margin-bottom: 16px;
      text-align: center;
      height: 26px;
      background: rgba(246, 246, 246, 1);
      border-radius: 14px;
    }
  }
}
</style>
