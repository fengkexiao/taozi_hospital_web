<template>
  <div class="app-container">
    <base-title name="素材模板" class="pt24"></base-title>
    <common-tree :setTree="setTree" :listIndex="listIndex" @handleInput="handleInput" @handleAdd="handleAdd" @handleDelete="handleDelete" @nodeClick="nodeClick"></common-tree>
    <div class="images">
      <el-image class="img" :src="url"></el-image>
    </div>
    <div class="content">
      <div v-if="isShow">
        <div class="content-container">
          <el-form ref="form" :model="materialTemplate" label-width="120px" class="form">
            <el-form-item label="素材类型：">
              <el-radio-group v-model="getModal" @change="handleChange">
                <el-radio :label="0">图文</el-radio>
                <el-radio :label="1">图片</el-radio>
                <el-radio :label="2">视频</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="图文地址：" v-show="materialTemplate.materialType === 0">
              <base-input type="textarea" v-model="materialTemplate.url" maxlength="1000" placeholder="请输入图文链接地址"></base-input>
            </el-form-item>
            <el-form-item label="视频地址：" v-show="materialTemplate.materialType === 2">
              <base-input type="textarea" v-model="materialTemplate.url" maxlength="1000" placeholder="请输入视频链接地址"></base-input>
            </el-form-item>
            <el-form-item label="标题：" v-show="materialTemplate.materialType === 0 || materialTemplate.materialType === 2 || materialTemplate.materialType === 1 ">
              <base-input v-model="materialTemplate.title" type="text" :show-word-limit="true" placeholder="请输入标题"></base-input>
              <div class="color-ccc">*标题将展示在相关阅读页面，建议填写清晰、准确、生动的标题</div>
            </el-form-item>
            <el-form-item label="描述：" v-show="materialTemplate.materialType === 0">
              <base-input type="textarea" :show-word-limit="true" v-model="materialTemplate.descrip" placeholder="请输入内容描述"></base-input>
              <div class="color-ccc">*介绍语将展示在相关播放页面，建议填写简洁明确、有信息质量的内容</div>
            </el-form-item>
            <el-form-item label="视频介绍：" v-show="materialTemplate.materialType === 2">
              <base-input type="textarea" :show-word-limit="true" v-model="materialTemplate.descrip" placeholder="视频描述"></base-input>
              <div class="color-ccc">*介绍语将展示在相关播放页面，建议填写简洁明确、有信息质量的内容</div>
            </el-form-item>
            <el-form-item label="添加图片：" v-show="materialTemplate.materialType === 0 || materialTemplate.materialType === 1 || materialTemplate.materialType === 2" ref="upload">
              <base-upload class="uploadLabel" :data="datas" :limit="limitNum" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="uploadSuccess" :file-list="hospitalPromoteImg" ref="upload">
              </base-upload>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-folder" style="margin-left: 120px;margin-top: 24px;" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-dialog :visible.sync="dialogVisible">
          <img width="94%" :src="dialogImageUrl" style="margin-left: 3%" /></el-dialog>
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
  filters: {
  },
  data () {
    return {
      form: {
        name: "",
        region: "",
        delivery: false,
        type: [],
        resource: "0",
        desc: ""
      },
      limitNum: 1,
      datas: {
        systemCode: "HOSPITAL",
        belongCode: "RES",
        belongID: ""
      },
      setTree: [],
      hospitalPromoteImg: [],
      filterText: "",
      highlightCurrent: true,
      dialogVisible: false,
      url: Img,
      listIndex: 0,
      dialogImageUrl: "",
      materialTemplate: {
        descrip: "",
        classifyID: "",
        materialType: 0,
        keyID: "",
        title: "",
        orgID: "",
        logoUrl: "",
        url: "",
        logoID: ""
      },
      bakData: {},
      isShow: false,
      NODE_KEY: "id", // id对应字段
      type: ""
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    getModal: {
      get () {
        return this.materialTemplate.materialType;
      },
      // setter
      set (newValue) {
        this.materialTemplate.materialType = newValue;
      }
    }
  },
  watch: {
    // "materialTemplate.materialType": {
    //   handler: function() {
    //     this.$refs.upload.doRemove();
    //   },
    //   deep: true
    // }

  },
  methods: {
    handleChange (val) {
      if (val !== this.type) {
        this.materialTemplate.descrip = "";
        this.materialTemplate.title = "";
        this.materialTemplate.logoUrl = "";
        this.materialTemplate.url = "";
        this.hospitalPromoteImg = [];
        this.$forceUpdate();
      } else {
        this.materialTemplate = JSON.parse(JSON.stringify(this.bakData));
        if (this.bakData.logoUrl) {
          this.hospitalPromoteImg = [{
            uid: this.bakData.logoID,
            url: this.bakData.logoUrl
          }];
          this.materialTemplate.logoUrl = this.bakData.logoUrl;
          this.materialTemplate.logoID = this.bakData.logoID;
        }
      }
    },
    close () { },
    nodeClick (_data, _node) {
      // console.log(_data.id);
      this.materialTemplate.logoID = "";
      this.materialTemplate.logoUrl = "";
      if (_node.level === 1) {
        this.isShow = false;
        return false;
      }
      if (_node.childNodes.length === 0) {
        // 如果为子节点查询模板信息
        if (!_data["keyID"]) {
          return false;
        };

        this.isShow = true;
        this.$_http.get(this.$_API.INTERFACE_TMC_GET_MATERIAL_TEMPLATE_GET,
          { params: { classifyID: _data["keyID"], orgID: this.userInfo.orgID } }).then(res => {
            let tmp = res.data;

            if (tmp) {
              this.materialTemplate.descrip = tmp.descrip;
              this.materialTemplate.classifyID = tmp.classifyID;
              this.materialTemplate.materialType = tmp.materialType;
              this.materialTemplate.keyID = tmp.keyID;
              this.materialTemplate.title = tmp.title;
              this.materialTemplate.orgID = tmp.orgID;
              this.materialTemplate.url = tmp.url;
              this.type = tmp.materialType;
              if (tmp.logoUrl) {
                this.hospitalPromoteImg = [{
                  uid: tmp.logoID,
                  url: tmp.logoUrl
                }];
                this.materialTemplate.logoUrl = tmp.logoUrl;
                this.materialTemplate.logoID = tmp.logoID;
              }
            } else {
              this.materialTemplate.classifyID = _data["keyID"];
              this.materialTemplate.descrip = "";
              this.materialTemplate.materialType = 0;
              this.materialTemplate.keyID = "";
              this.materialTemplate.title = "";
              this.materialTemplate.orgID = this.userInfo.orgID;
              this.materialTemplate.url = "";
              this.hospitalPromoteImg = [];
              this.materialTemplate.logoUrl = "";
              this.materialTemplate.logoID = "";
            }
            // console.log(this.materialTemplate.materialType);
            // this.$forceUpdate();
            console.warn(this.materialTemplate);
            this.bakData = JSON.parse(JSON.stringify(this.materialTemplate));
          });
      } else {
        this.materialTemplate.classifyID = "";
        this.materialTemplate.descrip = "";
        this.materialTemplate.materialType = 0;
        this.materialTemplate.keyID = "";
        this.materialTemplate.title = "";
        this.materialTemplate.orgID = this.userInfo.orgID;
        this.materialTemplate.url = "";
        this.hospitalPromoteImg = [];
      }
    },
    // 操作：查看上传的大图
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    filterNode (value, data) { },
    handleDelete (_node, _data) {
      let params = {
        keyID: _data["keyID"],
        orgID: this.userInfo.orgID
      };
      this.$_http.post(this.$_API.INTERFACE_TMC_POST_TOOL_CLASSIFY_DELETE, params).then(res => {
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
        classifyType: "1"
      };
      this.$_http.post(this.$_API.INTERFACE_TMC_POST_TOOL_CLASSIFY_ADD, params).then(res => {
        _data["keyID"] = res.data;
      });
    },
    handleEdit (_node, _data) { },
    handleAdd (_node, _data, handleEdit, initParam, listIndex) {
      this.listIndex = listIndex;
      this.$_http.get(this.$_API.INTERFACE_TMC_GET_MATERIAL_TEMPLATE_GET,
        { params: { classifyID: _data["keyID"], orgID: this.userInfo.orgID } }).then(res => {
          if (!res.data || (res.data && res.data.length === 0)) {
            // 参数修改
            let obj = JSON.parse(JSON.stringify(initParam)); // copy参数
            obj.pid = _data[this.NODE_KEY]; // 父id
            obj.parantID = _data["keyID"];
            obj[this.NODE_KEY] = this.listIndex++; // 节点id：逐次递减id

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
    onSubmit () {
      console.log(this.materialTemplate.logoUrl);
      if (!this.materialTemplate.classifyID) {
        this.$message.warning("请先选择节点！");
        return false;
      }
      // 参数校验
      switch (this.materialTemplate.materialType) {
        // 图文
        // 图片
        // 视频
        case 0:
          if (!(this.materialTemplate.url &&
            this.materialTemplate.title &&
            this.materialTemplate.descrip &&
            this.materialTemplate.logoUrl &&
            this.materialTemplate.logoID)) {
            this.$message.warning("请完善信息!");
            return false;
          }
          break;
        case 1:
          if (!(this.materialTemplate.logoUrl &&
            this.materialTemplate.logoID)) {
            // console.log(this.materialTemplate.logoUrl);
            this.$message.warning("请完善信息!");
            return false;
          }
          this.materialTemplate.descrip = "[图片]";
          break;
        default:
          if (!(this.materialTemplate.materialType &&
            this.materialTemplate.title &&
            this.materialTemplate.descrip &&
            this.materialTemplate.logoUrl &&
            this.materialTemplate.logoID)) {
            this.$message.warning("请完善信息!");
            return false;
          }
      }

      this.$_http.post(this.$_API.INTERFACE_TMC_POST_MATERIAL_TEMPLATE_SAVE, this.materialTemplate).then(res => {
        this.materialTemplate.keyID = res.data.keyID;
        this.$message.success("保存成功!");
      });
    },
    uploadSuccess (res) {
      this.materialTemplate.logoUrl = res.data.remoteAddress;
      this.materialTemplate.logoID = res.data.keyID;
    },
    handleRemove (file, fileList) {
      this.materialTemplate.logoUrl = "";
      this.materialTemplate.logoID = "";
    },
    // 添加
    addMedicine () { },
    save () {
    },
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
    this.datas.belongID = this.userInfo.orgID;
    // 从数据库拿出所有父节点
    let params = {
      classifyType: 1,
      orgID: this.userInfo.orgID
    };
    this.$_http.get(this.$_API.INTERFACE_TMC_GET_TOOL_CLASSIFY_LIST, { params }).then(res => {
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
      }
    });
    // var val;
    // var obj = {};
    // Object.defineProperty(obj, "name", {
    //   get() {
    //     console.log("我被获取了");
    //     return val;
    //   },
    //   set(newValue) {
    //     console.log("我被设置了");
    //     val = newValue;
    //   }
    // });
    // // obj.name = "wth";
    // val = "wth";
    // console.log("val:" + val);
    // console.log("obj:" + obj.name);
  }
};
</script>

<style lang="scss" scoped>
#addLabelBody {
  overflow: hidden;
  .addLabelInput {
    width: 500px;
    padding: 5px 5px;
    border-radius: 5px 5px;
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
  //margin: 20px;
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
}
/deep/ .comp-tr-node .el-input--medium .el-input__inner {
  width: 200px;
  height: 25px;
}
/deep/ .comp-tree .comp-tr-node .comp-tr-node--name.is-new {
  font-weight: normal;
}
</style>
