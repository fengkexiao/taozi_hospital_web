<template>
  <div class="app-container">
    <base-title name="常用语模板" class="pt24"></base-title>

    <common-tree :setTree="setTree" :listIndex="listIndex" @handleInput="handleInput" @handleAdd="handleAdd" @handleDelete="handleDelete" @nodeClick="nodeClick"></common-tree>
    <div class="images">
      <el-image class="img" :src="url"></el-image>
    </div>
    <div class="content">
      <div v-if="isShow" class="content-container">
        <textarea v-model.trim="phraseTemplate.content" rows="10" cols="30" class="text-area"></textarea>
        <el-button icon="el-icon-folder" @click="onSubmit" style="margin-left: 250px;margin-top: 24px;">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Img from "@/assets/image/tmcinquiry/transfer.png";
import commonTree from "@/views/tmcinquiry/template/commonTree.vue";
export default {
  name: "tmcPhrase",
  components: {
    commonTree
  },
  filters: {},
  data () {
    return {
      form: {
        name: ""
      },
      isShow: false,
      filterText: "",
      dialogVisible2: false,
      url: Img,
      list: [],
      listIndex: 0,
      setTree: [],
      phraseTemplate: {
        keyID: "",
        orgID: "",
        content: "",
        classifyID: ""
      },
      submitFlag: false,
      NODE_KEY: "id" // id对应字段
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  watch: {},
  methods: {
    close () {
      this.visible = false;
    },
    nodeClick (_data, _node) {
      if (_node.level === 1) {
        this.isShow = false;
        return false;
      }
      // console.log(_data.id);
      if (_node.childNodes.length === 0) {
        this.phraseTemplate = {};
        // 如果为子节点查询模板信息
        if (!_data["keyID"]) {
          return false;
        }
        this.isShow = true;
        this.$_http
          .get(this.$_API.INTERFACE_TMC_GET_PHRASE_TEMPLATE_GET, {
            params: { classifyID: _data["keyID"], orgID: this.userInfo.orgID }
          })
          .then(res => {
            let tmp = res.data;
            if (tmp) {
              this.phraseTemplate.keyID = tmp.keyID;
              this.phraseTemplate.orgID = tmp.orgID;
              this.phraseTemplate.classifyID = tmp.classifyID;
              this.phraseTemplate.content = tmp.content;
            } else {
              this.phraseTemplate.keyID = "";
              this.phraseTemplate.orgID = "";
              this.phraseTemplate.classifyID = _data["keyID"];
              this.phraseTemplate.content = "";
            }
            this.$forceUpdate();
          });
      } else {
        this.phraseTemplate.keyID = "";
        this.phraseTemplate.orgID = "";
        this.phraseTemplate.classifyID = "";
        this.phraseTemplate.content = "";
        this.$forceUpdate();
      }
    },
    filterNode (value, data) { },
    handleDelete (_node, _data) {
      // 删除节点
      let params = {
        keyID: _data["keyID"],
        orgID: this.userInfo.orgID
      };
      this.$_http
        .post(this.$_API.INTERFACE_TMC_POST_TOOL_CLASSIFY_DELETE, params)
        .then(res => {
          this.isShow = false;
        });
    },
    handleInput (_node, _data) {
      // 保存节点信息
      let params = {
        orgID: this.userInfo.orgID,
        keyID: _data["keyID"],
        parantID: _data["parantID"],
        classifyName: _data["name"],
        classifyType: "0"
      };
      this.$_http
        .post(this.$_API.INTERFACE_TMC_POST_TOOL_CLASSIFY_ADD, params)
        .then(res => {
          _data["keyID"] = res.data;
        });
    },
    handleEdit (_node, _data) { },
    handleAdd (_node, _data, handleEdit, initParam, listIndex) {
      this.listIndex = listIndex;
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_PHRASE_TEMPLATE_GET, {
          params: { classifyID: _data["keyID"], orgID: this.userInfo.orgID }
        })
        .then(res => {
          if (!res.data || (res.data && res.data.length === 0)) {
            // 参数修改
            let obj = JSON.parse(JSON.stringify(initParam)); // copy参数
            obj.pid = _data[this.NODE_KEY]; // 父id
            obj.parantID = _data["keyID"];
            obj[this.NODE_KEY] = this.listIndex++;

            // 判断字段是否存在
            if (!_data.children) {
              this.$set(_data, "children", []);
            }
            // 新增数据
            _data.children.push(obj);
            this.$nextTick(() => {
              let tmp = _node.childNodes.reduce((pre, last) => {
                return pre.id < last.id ? last : pre;
              });
              handleEdit(tmp, tmp.data);
            });
          } else {
            this.$message.warning("该节点已有模板，不能增加！");
          }
        });
    },
    handleAddTop () { },
    async onSubmit () {
      if (!this.phraseTemplate.classifyID) {
        this.$message.warning("请先选择子级目录！");
        return false;
      }
      if (!this.phraseTemplate.content) {
        this.$message.warning("请填写内容！");
        return false;
      }
      if (!this.phraseTemplate.orgID) {
        this.phraseTemplate.orgID = this.userInfo.orgID;
      }
      if (this.submitFlag) {
        return false;
      }
      this.submitFlag = true;
      try {
        const res = await this.$_http
          .post(
            this.$_API.INTERFACE_TMC_POST_PHRASE_TEMPLATE_SAVE,
            this.phraseTemplate
          );
        if (res.data) {
          this.phraseTemplate.keyID = res.data.keyID;
          this.$message.success("保存成功！");
        }
      } catch (error) {
      } finally {
        this.submitFlag = false;
      }
    },
    uploadSuccess (res) { },
    // 操作：删除所选的医院照片
    handleRemove (file, fileList) { },
    // 添加
    addMedicine () {
      this.visible = true;
    },
    uphold () {
      this.dialogVisible2 = true;
    },
    save () { },
    // 循环添加所有节点
    addAllList (item) {
      for (let i = 0; i < this.list.length; i++) {
        let tmp = this.list[i];
        if (item.keyID === tmp.parantID) {
          item.children.push({ ...tmp });
          this.addAllList(tmp);
        }
      }
    }
  },
  created () {
    // 从数据库拿出所有父节点
    let params = {
      classifyType: 0,
      orgID: this.userInfo.orgID
    };
    this.$_http
      .get(this.$_API.INTERFACE_TMC_GET_TOOL_CLASSIFY_LIST, { params })
      .then(res => {
        if (res.data) {
          let parentList = res.data.filter(item => {
            return item.parantID === "";
          });
          let parentsList = parentList.map(item => {
            return {
              id: this.listIndex++,
              name: item.classifyName,
              children: [],
              keyID: item.keyID,
              parant: item.parantID
            };
          });
          this.listIndex = 0;
          this.list = res.data.map(item => {
            return {
              id: this.listIndex++,
              name: item.classifyName,
              children: [],
              keyID: item.keyID,
              parantID: item.parantID
            };
          });
          // 通过父节点找出所有子节点
          parentsList.forEach((item, index) => {
            this.addAllList(item);
          });
          this.setTree = [...parentsList];
          // console.log(this.listIndex);
        }
      });
  }
};
</script>

<style lang="scss" scoped>
.color-ccc {
  color: #ccc;
}
.text-area {
  width: 550px;
  height: 300px;
  border-radius: 5px;
  border: 0;
  outline: none;
}
#addLabelBody {
  overflow: hidden;
  .addLabelInput {
    width: 500px;
    padding: 5px 5px;
    border-radius: 5px 5px;
  }
}
.content-container {
  .text-area {
    border: 1px solid #ccc;
  }
}
.images {
  float: left;
  margin-top: 200px;
  margin-left: 40px;
  margin-right: 40px;
  width: 50px;
  height: 50px;
}
.content {
  width: 598px;
  padding: 24px;
  margin-top: 24px;
  //margin-left: 20px;
  border-radius: 5px;
  border: 1px solid #e8e8e8;
  height: 479px;
  overflow-y: auto;
  float: left;
}
.form {
  margin: 20px;
}
.content::-webkit-scrollbar {
  width: 7px;
  height: 1px;
}
.content::-webkit-scrollbar-thumb {
  border-radius: 7px;
  box-shadow: inset 0 0 5px rgba(102, 102, 102, 0.2);
  background: #858585;
}
.content::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(102, 102, 102, 0.2);
  border-radius: 7px;
  background: #ededed;
}
.filter-tree {
  margin: 20px;
}
.title {
  overflow: hidden;
}
.medicine-list {
  margin-left: 30px;
  .font {
    font-size: 14px;
    font-weight: 800;
    color: #4e4e4e;
    float: left;
    margin-top: 15px;
  }
}
.item-list {
  margin-top: 20px;
}
.color-ccc {
  color: #ccc;
}
.inline p {
  font-weight: 800;
}
.little {
  margin-left: 30px;
}
.left {
  float: left;
  margin-top: 10px;
}
.right {
  float: right;
  margin-right: 20px;
  margin-top: 10px;
}
.color-blue {
  color: #438bef;
  font-weight: 800;
}
.el-form--inline .el-form-item {
  margin-right: 0;
}
.el-form-item__label {
  /*input输入框标题文本调整*/
  text-align: left;
}
.el-form-item__content {
  .el-input,
  .el-textarea {
    /*input输入框宽度调整*/
    width: 400px;
    max-width: none;
  }
}
ul {
  padding-left: 0;
  li {
    list-style-type: none;
    margin: 0 0 20px 0;
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 10px;
    .medicineDivOne {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .medicineTitleDiv {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        .delMedicineIconDiv {
          width: 18px;
          height: 18px;
          border-radius: 20px;
          background-color: red;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          cursor: pointer;
          .delMedicineIconImg {
            width: 13px;
            height: 13px;
          }
        }
        .medicineName {
          margin-right: 15px;
          color: #242526;
        }
        .medicinePrice {
          font-size: 15px;
          color: #555658;
        }
        .medicineInstruction {
          margin-left: 20px;
          font-size: 14px;
          color: #438bef;
          cursor: pointer;
        }
      }
      .medicineNumBDiv {
        width: 150px;
        text-align: right;
      }
    }
    #medicineDivThree {
      margin-bottom: 10px;
      margin-top: 15px;
      .medicine-left {
        float: left;
        .medicineUseInputOne {
          margin-right: 5px;
          border-radius: 3px;
          border: 1px solid #d9d9d9;
          width: 70px;
          height: 25px;
          padding-left: 5px;
          padding-right: 5px;
          font-size: 14px;
          text-align: center;
          color: #555658;
        }
      }
      .medicine-right {
        text-align: right;
      }
    }
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    /*** 消除input元素 type="number" 时默认的 加减按钮---moz版*/
    input[type="number"] {
      -moz-appearance: textfield;
    }
    .medicineTitle {
      padding-left: 10px;
      padding-right: 10px;
    }
    .delMedicineIcon {
      width: 18px;
      height: 18px;
      padding-top: 3px;
    }
    .medicineUnit {
      font-size: 14px;
      color: #555658;
      margin-left: 20px;
    }
    .medicineNumInput {
      margin-right: 10px;
      border-radius: 3px;
      border: 1px solid #d9d9d9;
      width: 40px;
      height: 25px;
      padding-left: 5px;
      padding-right: 5px;
      font-size: 14px;
      text-align: center;
      color: #555658;
    }
  }
}
.totalPriceBox {
  width: 100%;
  text-align: right;
  font-size: 15px;
  .totalPriceTitle {
    color: #555658;
  }
  .totalMoneyTxt {
    color: #fe5853;
  }
}
/deep/ .comp-tr-node .el-input--medium .el-input__inner {
  width: 200px;
  height: 25px;
}
</style>
