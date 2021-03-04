<template>
  <div class="tree-list comp-tree">
    <el-button class="comp-tr-top" type="primary" icon="el-icon-plus" @click="handleAddTop">添加顶级目录</el-button>
    <!-- tree -->
    <el-tree ref="SlotTree" class="filter-tree" :data="setTree" :props="defaultProps" :expand-on-click-node="false" :highlight-current="highlightCurrent" :node-key="NODE_KEY" @node-click="nodeClick">
      <div class="comp-tr-node" slot-scope="{ node, data }">
        <!-- 编辑状态 -->
        <template v-if="node.isEdit">
          <el-input v-model="data.name" autofocus :ref="'slotTreeInput' + data[NODE_KEY]" @blur.stop="handleInput(node, data)" @keyup.enter.native="$event.target.blur" maxlength="9" minlength="1" id="elInput"></el-input>
        </template>
        <!-- 非编辑状态 -->
        <template v-else>
          <!-- 名称： 新增节点增加class（is-new） -->
          <span :class="[data[NODE_KEY] < NODE_ID_START ? 'is-new' : '', 'comp-tr-node--name']">{{ node.label }}</span>
          <!-- 按钮 -->
          <span class="comp-tr-node--btns">
            <!-- 新增 -->
            <el-button v-if="node.level===1" icon="el-icon-plus" size="mini" circle type="primary" @click.stop="handleAdd(node, data)"></el-button>
            <!-- 编辑 -->
            <el-button icon="el-icon-edit" size="mini" circle type="info" @click.stop="handleEdit(node, data)"></el-button>
            <!-- 删除 -->
            <el-button icon="el-icon-delete" size="mini" circle type="danger" @click.stop="handleDelete(node, data)"></el-button>
          </span>
        </template>
      </div>
    </el-tree>
    <!-- <el-tree class="filter-tree" :highlight-current="highlightCurrent" :data="data" :props="defaultProps" :filter-node-method="filterNode" node-key="id" ref="tree"></el-tree> -->
  </div>
</template>

<script>
export default {
  name: "rpTemplate",
  props: {
    setTree: {
      type: Array,
      default () {
        return [];
      }
    },
    listIndex: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      MAX_LEVEL: 2, // 设定最大层级
      NODE_ID_START: 1, // 新增节点id，逐次递减
      NODE_KEY: "id", // id对应字段
      startId: null,
      defaultProps: {
        // 默认设置
        children: "children",
        label: "name"
      },
      initParam: {
        // 新增参数
        name: "新增节点",
        pid: 0,
        keyID: "",
        parantID: "",
        children: []
      },
      curIndex: this.listIndex,
      highlightCurrent: true
    };
  },
  watch: {
    listIndex: {
      handler (newName) {
        this.curIndex = newName;
      }
    }
  },
  methods: {
    nodeClick (_data, _node) {
      // 展开节点
      _node.expanded = !_node.expanded;
      this.$emit("nodeClick", _data, _node);
    },
    handleDelete (_node, _data) {
      // 删除节点
      // 判断是否存在子节点
      if (_data.children && _data.children.length !== 0) {
        this.$message.warning("此节点有子级，不可删除！");
        return false;
      } else {
        // 删除操作
        let DeletOprate = () => {
          this.$nextTick(() => {
            if (this.$refs.SlotTree) {
              console.log(_data);
              this.$refs.SlotTree.remove(_data);
              // 删除节点
              this.$emit("handleDelete", _node, _data);
              this.$message.success("删除成功！");
              this.$forceUpdate();
            }
          });
        };

        // 二次确认
        let ConfirmFun = () => {
          this.$confirm("是否删除此节点？", "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              DeletOprate();
            })
            .catch(() => { });
        };

        // 判断是否新增： 新增节点直接删除，已存在的节点要二次确认
        ConfirmFun();
      }
    },
    handleInput (_node, _data) {
      // 修改节点
      // 保存节点信息
      if (!_data.name) {
        _data.name = "新建节点";
      }
      this.$set(_node, "checked", true);
      this.$nextTick(() => {
        this.$emit("handleInput", _node, _data);
      });

      // 退出编辑状态
      if (_node.isEdit) {
        this.$set(_node, "isEdit", false);
      }
      // this.$refs.SlotTree.setCurrentNode(_node);
    },
    handleEdit (_node, _data) {
      // 编辑节点
      // 设置编辑状态
      if (!_node.isEdit) {
        this.$set(_node, "isEdit", true);
      }

      // 输入框聚焦
      this.$nextTick(() => {
        if (this.$refs["slotTreeInput" + _data[this.NODE_KEY]]) {
          this.$refs["slotTreeInput" + _data[this.NODE_KEY]].$refs.input.focus();
        }
      });
    },
    handleAdd (_node, _data) {
      // 新增节点
      // 判断层级
      if (_node.level >= this.MAX_LEVEL) {
        this.$message.warning("当前已达到" + this.MAX_LEVEL + "级，无法新增！");
        return false;
      }
      this.$emit("handleAdd", _node, _data, this.handleEdit, this.initParam, this.curIndex);
      // 展开节点
      if (!_node.expanded) {
        _node.expanded = true;
      }
    },
    handleAddTop () {
      // console.log(this.curIndex);
      // 添加顶部节点
      //  this.setTree.reduce((pre,last)=>{
      //   return pre.id<last.id?last.id:pre.id
      // });
      let obj = JSON.parse(JSON.stringify(this.initParam)); // copy参数
      obj[this.NODE_KEY] = this.curIndex++;
      this.setTree.push(obj);
      this.$nextTick(() => {
        this.handleEdit(this.$refs.SlotTree.getNode(obj), obj);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
// 显示按钮
.show-btns {
  opacity: 1;
}
.comp-tree {
  max-width: 700px;
  max-height: 700px;
  padding: 20px;
  overflow: auto;
  // 顶部按钮
  .comp-tr-top {
    margin-bottom: 24px;
  }
  // 自定义节点
  .comp-tr-node {
    font-size:14px;
    // label
    .comp-tr-node--name {
      display: inline-block;
      line-height: 40px;
      min-height: 40px;
      // 新增
      &.is-new {
        font-weight: normal;
      }
    }
    // button
    .comp-tr-node--btns {
      margin-left: 10px;
      opacity: 0;
      transition: opacity 0.1s;
      .el-button {
        transform: scale(0.8); // 缩小按钮
        & + .el-button {
          margin-left: -1px;
        }
      }
    }
  }
  // 悬浮显示按钮
  .el-tree-node__content {
    &:hover {
      .comp-tr-node--btns {
        @extend .show-btns;
      }
    }
  }
}
.tree-list {
  width: 328px;
  margin-top: 24px;
  margin-left: 24px;
  border-radius: 5px;
  border: 1px solid #E8E8E8;
  height: 479px;
  overflow-y: auto;
  float: left;
  font-size:14px;
  color:#000000;
}
.tree-list::-webkit-scrollbar {
  width: 7px;
  height: 1px;
}
.tree-list::-webkit-scrollbar-thumb {
  border-radius: 7px;
  box-shadow: inset 0 0 5px rgba(102, 102, 102, 0.2);
  background: #858585;
}
.tree-list::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(102, 102, 102, 0.2);
  border-radius: 7px;
  background: #ededed;
}
/deep/ .comp-tr-node .el-input--medium .el-input__inner {
  width: 200px;
  height: 25px;
}
</style>
