<template>
  <el-dialog title="编辑标签" :visible.sync="dialogVisible" width="512px" append-to-body :before-close="handleClose">
    <div>
      <p>创建标签：</p>
      <el-row>
        <el-col :span="12">
          <el-input placeholder="输入标签名字" v-model="tagName" clearable></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="text" @click="handleAddNewTag">+添加新标签</el-button>
        </el-col>
      </el-row>
      <p>当前标签</p>
      <ul>
        <li class="mr15 tag-defult " v-for="(item,index) of tagList" :key="index">
          <span>{{item.dictName}}</span>
          <i class="el-icon-error cursor-pointer" @click="handleDelTag(item,index)"></i>
        </li>
      </ul>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleClose">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "EditTag",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    currentTag: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      tagList: [],
      tagName: ""
    };
  },
  created () {
  },
  watch: {
    dialogVisible (val) {
      this.tagList = [...this.currentTag];
      // if (this.currentTag) {
      //   this.tagList = [];
      // }s
    }
  },
  methods: {
    handleAdd () {

    },
    // 添加新标签
    handleAddNewTag () {
      this.tagList.push({ dictName: this.tagName });
      this.tagName = "";
    },
    handleClose () {
      this.tagName = "";
      this.$emit("update:currentTag", this.tagList);
      this.$emit("update:dialogVisible", false);
    },
    // 删除标签
    handleDelTag (item, index) {
      this.tagList.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
  li {
    list-style: none;
    margin: 0;
    display: inline-block;
    position: relative;
    background: #ffffff;
    border-radius: 5px;
    padding: 10px 12px 8px 10px;
    border: 1px solid #dadada;
    margin-right: 15px;
    margin-bottom: 16px;
    i {
      color: rgb(254, 88, 83);
      font-size: 13px;
      position: absolute;
      top: -5px;
      right: -5px;
    }
  }
}
</style>
