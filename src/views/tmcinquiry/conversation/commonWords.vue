<template>
  <div class="common-words" v-show="visible">
    <div style="position:relative;width:100%;height:100%;">
      <div class="common-words_head">
        <span>{{type===0?'常用语':'患教素材'}}</span>
        <span class="cursor-pointer" @click="handleClose">隐藏</span>
      </div>
      <div class="input-container">
        <el-input placeholder="请输入关键字" v-model="filterText" size="mini">
        </el-input>
      </div>
      <div class="tree-container">
        <el-tree class="filter-tree" :data="data" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree" @node-click="handleNodeclick">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <el-popover placement="top-start" title="" width="200" trigger="hover" :content="renderNode(data)">
              <span slot="reference" v-html="renderNode(data)"></span>
            </el-popover>
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
// import { drag } from "./../../../utils/tools";
export default {
  name: "CommonWords",
  components: {

  },
  mixins: [],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orgID: {
      type: String,
      default: ""
    },
    type: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      filterText: "",
      data: [],
      defaultProps: {
        children: "childList",
        label: "classifyName"
      }
    };
  },
  watch: {
    visible (val) {
      this.filterText = "";
    },
    filterText (val) {
      this.$refs.tree.filter(val);
    },
    type (val) {
      this.getPharse();
    }
  },
  created () {
    this.getPharse();
  },
  methods: {
    renderNode (label) {
      let str = label.classifyName || label.content || label.descrip || "";
      if (this.filterText) {
        let reg = new RegExp(this.filterText, "g");
        str = str.replace(reg, "<span style=\"color: rgba(67, 139, 239, 1);\">" + this.filterText + "</span>");
      }
      return str;
    },
    handleNodeclick (data, node, nodeEvent) {
      if (node.level > 1) {
        let tmpData = null;
        if (node.level === 2) {
          tmpData = data.childList[0] || null;
          if (tmpData) {
            this.$emit("click", tmpData);
          }
        } else {
          this.$emit("click", data);
        }
      }
    },
    // 关闭
    handleClose () {
      this.$emit("update:visible", false);
    },
    // 筛选
    filterNode (value, data) {
      if (!value) return true;
      let str = data.classifyName || data.content || data.descrip || "";
      return str.indexOf(value) !== -1;
    },
    // 获取常用语模板目录
    getPharse () {
      let params = {
        classifyType: this.type,
        // 发送者
        orgID: this.orgID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_GETTOOLCLASSIFYTREEBYID, {
          params
        })
        .then(res => {
          if (!res.data) {
            return false;
          }
          this.data = res.data;
        });
    }
  }
};
</script>

<style lang="scss" >
.tree-container {
  height: 100%;
  width: 100%;
  overflow: auto;
  padding-top: 99px;
  position: absolute;
}
.input-container {
  padding: 0 14px 14px 14px;
  padding: 0px 14px 14px;
  position: absolute;
  width: 100%;
  z-index: 9999;
  top: 57px;
  background: #ffffff;
}
.common-words {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 202px;
  height: calc(100% - 262px);
  min-height: 408px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  // margin-top: -100px;
  overflow: auto;
  .common-words_head {
    height: 57px;
    line-height: 57px;
    padding: 0 14px;
    background: rgba(249, 249, 249, 1);
    display: flex;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    z-index: 9999;
    top: 0;
    span {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .custom-tree-node {
    width: 120px;
    overflow: hidden;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
  }
}
</style>
