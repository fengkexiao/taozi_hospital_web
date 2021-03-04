<template>
  <div class="app-container base-page">
    <div class="inline" style="overflow: hidden;">
      <base-title name="中药处方模板"></base-title>
      <div >
        <div class="tree-list comp-tree">
          <el-button class="comp-tr-top" type="primary" size="small" @click="handleAddTop">添加顶级目录</el-button>
          <!-- tree -->
          <el-tree ref="SlotTree" class="filter-tree" :data="setTree" :props="defaultProps" :expand-on-click-node="false" :highlight-current="highlightCurrent" :node-key="NODE_KEY" :filter-node-method="filterNode" @node-click="nodeClick">
            <div class="comp-tr-node" slot-scope="{ node, data }">
              <!-- 编辑状态 -->
              <template v-if="node.isEdit">
                <el-input v-model="data.name" autofocus :ref="'slotTreeInput' + data[NODE_KEY]" @blur.stop="handleInput(node, data)" @keyup.enter.native="$event.target.blur" id="elInput" maxlength="9" minlength="1"></el-input>
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
        <div class="images">
          <el-image class="img" :src="url"></el-image>
        </div>
        <div class="content">
          <div v-if="isShow">
            <el-form ref="form" :model="form" label-width="120px" class="form">
              <el-form-item label="模板名称：" required>
                <base-input v-model="rpTemplateInfo.templateName" type="text" :show-word-limit="true" placeholder="请输入模板名称"></base-input>
              </el-form-item>
              <el-form-item label="处方剂型：" required prop="medicineFormID">
                <el-radio v-model="rpTemplateInfo.medicineFormID" :label="10" border :disabled="disabled">饮片</el-radio>
                <el-radio v-model="rpTemplateInfo.medicineFormID" :label="11" border :disabled="disabled">颗粒剂</el-radio>
              </el-form-item>
              <div class="medicine-list">
                <div class="title">
                  <span class="font" required><span style="color: #F56C6C;margin-right: 4px;">*</span>用药建议：</span>
                  <el-button icon="el-icon-plus" class="right" type="primary" @click="addMedicine()">添加药品</el-button>
                </div>
                <!--药品列表-->
                <ul class="item-list">
                  <li v-for="(item, index) in rpTemplateInfo.rpTemplateMedicine" :key="index">
                    <div class="medicineDivOne">
                      <div class="medicineTitleDiv">
                        <div class="delMedicineIcon" @click="delMedicineFun(item)">
                          <div class="delMedicineIconDiv"><img class="delMedicineIconImg" src="@/assets/image/tmcinquiry/delete.png" /></div>
                        </div>
                        <div class="medicineTitle">
                          <span class="medicineName">{{ item.medicineName }}</span>
                          <span class="medicinePrice">单价：{{ item.unitPrice | formatMoney }}元</span>
                          <el-input v-model.trim="item.medicineAmount" size="mini" style="width:40px;" type="text" oninput="value=value.replace(/[^\d]/g,'')" />
                          <span class="medicineUnit">g</span>
                          <el-select v-model="item.takeDirection" placeholder="用法" size="mini" style="width: 100px; margin-left: 10px;">
                            <el-option v-for="(i, index) in usages" :key="index" :label="i.dictName" :value="i.dictName"></el-option>
                          </el-select>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <!-- <div>
                  <span class="font-way">*用法用量：</span><span class="font14 left20">共</span><input v-model="rpTemplateInfo.totalDoses" class="medicineNumInput" type="text"/><span class="font14">剂，每日</span><input v-model="rpTemplateInfo.everyDose" class="medicineNumInput" type="text"/><span class="font14">剂，每剂分</span><input v-model="rpTemplateInfo.frequence" class="medicineNumInput" type="text"/><span class="font14">次使用。</span>
                </div> -->
              </div>
              <el-form-item>
                <div class="totalPriceBox" v-if="rpTemplateInfo.rpTemplateMedicine.length !== 0">
                  <span class="totalPriceTitle">总价：</span>
                  <span class="totalMoneyTxt">{{ sumPrice | formatMoneyForSumShow }}元</span>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="primary"  @click="onSubmit" style="margin-left: 150px;margin-top: 80px;">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <popup-template ref="addmedicine" :visible="visible" title="添加药品" @close="close" @handleEdit="handleEdits"></popup-template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Img from "@/assets/image/tmcinquiry/transfer.png";
import popupTemplate from "@/views/tmcinquiry/template/PopupAddByTemplateZY.vue";
export default {
  name: "rpTemplate-zy",
  components: {
    popupTemplate
  },
  filters: {},
  data () {
    return {
      visible: false,
      disabled: false,
      isLoading: false, // 是否加载
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
      form: {
        name: ""
      },
      filterText: "",
      highlightCurrent: true,
      url: Img,
      setTree: [],
      // 药品信息
      medicine: [],
      // 处方单信息
      rpData: {
        medicine: [],
        orderPrice: 50000
      },
      // 接收请求回来的目录数据
      list: [],
      listIndex: 0,
      rpTemplateInfo: {
        keyID: "",
        orgID: "",
        classifyID: "",
        rpType: 0,
        templateName: "",
        medicineFormID: "",
        duration: 0,
        rpTemplateMedicine: []
      },
      // 用法
      usages: [],
      isShow: false,
      placeholder: "每次用量"
    };
  },

  computed: {
    ...mapGetters(["userInfo"]),
    sumPrice () {
      return this.rpTemplateInfo.rpTemplateMedicine.reduce((total, item) => {
        return total + (item.unitPrice * item.medicineAmount);
      }, 0);
    }
  },
  watch: {
    filterText (val) {
      this.$refs.SlotTree.filter(val);
      this.$refs.upload.clearFiles();
    },
    placeholder (newName) {
      this.placeholder = newName;
    }
  },
  methods: {
    delMedicineFun (item) {
      this.$confirm("是否删除该药品？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 如果是数据库读出来的请求接口删除，如果是内存中的直接删除
          if (item.keyID) {
            this.$_http.get(this.$_API.INTERFACE_GET_DELMEDICIENINFO,
              { params: { keyID: item.keyID } }).then(res => {
                let i = this.rpTemplateInfo.rpTemplateMedicine.findIndex((i) => {
                  return i.goodsID === item.goodsID;
                });
                this.rpTemplateInfo.rpTemplateMedicine.splice(i, 1);
                this.nodeClick(this.datas, this.nodes);
              });
          } else {
            let i = this.rpTemplateInfo.rpTemplateMedicine.findIndex((i) => {
              return i.goodsID === item.goodsID;
            });
            this.rpTemplateInfo.rpTemplateMedicine.splice(i, 1);
          }
          if (this.rpTemplateInfo.rpTemplateMedicine.length === 0) {
            this.disabled = false;
          }
        })
        .catch(() => { });
    },
    ...mapActions({
      getDictionary: "dictionary/getDictionary"
    }),
    handleEdits (index, row) {
      // if (!this.rpTemplateInfo.keyID) {
      //   this.$message.warning("请先选择节点~");
      //   return false;
      // }

      this.$_http.get(this.$_API.INTERFACE_TMC_MEDICINEINFO, { params: { medicineID: row.medicineID, rpTemplateID: this.rpTemplateInfo.keyID } }).then(res => {
        let medicineAmount = res.data.medicineAmount || "";
        let keyID = res.data.keyID || "";
        let goodsID = row.keyID || "";
        let mark = this.rpTemplateInfo.rpTemplateMedicine.some((item) => {
          return goodsID === item.goodsID;
        });
        if (mark) {
          this.$message.warning("已有该商品,请直接增加数量~");
          return false;
        }
        this.rpTemplateInfo.rpTemplateMedicine.push({
          // 用户输入或者选择的
          takeDirection: row.takeDirection,
          medicineAmount: medicineAmount,
          keyID: keyID,
          rpTemplateID: this.rpTemplateInfo.keyID,
          medicineClassName: "中药",
          medicineClassID: 1,
          medicineFormID: row.medicineFormID,
          unitPrice: row.price,
          unit: row.productUnit,
          goodsID: row.keyID,
          medicineID: row.medicineID,
          medicineName: row.medicineName,
          productSpec: row.productSpec
        });
        this.visible = false;
        this.disabled = true;
      });
    },
    close () {
      this.visible = false;
    },
    nodeClick (_data, _node) {
      // console.log(_data.id);
      // 展开节点
      _node.expanded = !_node.expanded;
      this.rpTemplateInfo.rpTemplateMedicine = [];
      this.rpTemplateInfo.medicineFormID = "";
      if (!_data["keyID"]) {
        return false;
      }
      if (_node.level === 1) {
        this.isShow = false;
        return false;
      }
      this.datas = _data;
      this.nodes = _node;
      // 如果为子节点查询模板信息
      this.$_http.get(this.$_API.INTERFACE_GET_GETRPTEMPLATE, { params: { classifyID: _data["keyID"] } }).then(res => {
        this.isShow = true;
        let tmp = res.data;
        // console.log(res.data, 1111111);
        if (tmp[0]) {
          this.disabled = true;
          this.rpTemplateInfo.keyID = tmp[0].keyID;
          this.rpTemplateInfo.medicineFormID = tmp[0].medicineFormID;
          this.rpTemplateInfo.orgID = tmp[0].orgID;
          this.rpTemplateInfo.classifyID = tmp[0].classifyID;
          this.rpTemplateInfo.rpType = tmp[0].rpType;
          this.rpTemplateInfo.templateName = tmp[0].templateName;
          this.rpTemplateInfo.duration = tmp[0].duration;
          res.data.forEach((item, index) => {
            if (item.templateMedicineKeyID) {
              this.rpTemplateInfo.rpTemplateMedicine.push({
                keyID: item.templateMedicineKeyID,
                rpTemplateID: item.rpTemplateID,
                medicineID: item.medicineID,
                goodsID: item.goodsID,
                medicineClassID: item.medicineClassID,
                medicineClassName: item.medicineClassName,
                drugCode: item.drugCode,
                medicineName: item.medicineName,
                specification: item.specification,
                medicineAmount: item.medicineAmount,
                medicineFormID: item.medicineFormID,
                unit: item.unit,
                unitPrice: item.unitPrice,
                drugPackage: item.drugPackage,
                takeDirection: item.takeDirection,
                course: item.course,
                memo: item.memo
              });
            }
          });
        } else {
          this.disabled = false;
          this.rpTemplateInfo.keyID = "";
          this.rpTemplateInfo.orgID = this.userInfo.orgID;
          this.rpTemplateInfo.classifyID = _data["keyID"];
          this.rpTemplateInfo.rpType = 0;
          this.rpTemplateInfo.templateName = "";
          this.rpTemplateInfo.duration = 0;
          this.rpTemplateInfo.rpTemplateMedicine = [];
        }

        this.$forceUpdate();
      });
      // console.log(this.rpTemplateInfo.classifyID);
    },
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
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
              this.$refs.SlotTree.remove(_data);
              // 删除节点
              let params = {
                keyID: _data["keyID"]
              };
              this.$_http.post(this.$_API.INTERFACE_POST_DELETETEMPLATE, params).then(res => { });
              this.$message.success("删除成功！");
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
              this.isShow = false;
            })
            .catch(() => { });
        };

        // 判断是否新增： 新增节点直接删除，已存在的节点要二次确认
        ConfirmFun();
      }
    },
    handleInput (_node, _data) {
      if (!_data.name) {
        _data.name = "新建节点";
      }
      // 修改节点
      // 保存节点信息
      let params = {
        orgID: this.userInfo.orgID,
        keyID: _data["keyID"],
        parantID: _data["parantID"],
        classifyName: _data["name"],
        rpClassifyType: 1
      };
      this.$_http.post(this.$_API.INTERFACE_POST_SAVELIST, params).then(res => {
        _data["keyID"] = res.data;
      });
      // 退出编辑状态
      if (_node.isEdit) {
        this.$set(_node, "isEdit", false);
      }
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
      this.$_http.get(this.$_API.INTERFACE_GET_GETRPTEMPLATE,
        { params: { classifyID: _data["keyID"] } }).then(res => {
          if (res.data.length === 0) {
            // 参数修改
            let obj = JSON.parse(JSON.stringify(this.initParam)); // copy参数
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
              this.handleEdit(tmp, tmp.data);
            });
          } else {
            this.$message.warning("该节点已有模板，不能增加！");
          }
        });
      // 展开节点
      if (!_node.expanded) {
        _node.expanded = true;
      }
    },
    handleAddTop () {
      // 添加顶部节点
      //  this.setTree.reduce((pre,last)=>{
      //   return pre.id<last.id?last.id:pre.id
      // });
      let obj = JSON.parse(JSON.stringify(this.initParam)); // copy参数
      obj[this.NODE_KEY] = this.listIndex++; // 节点id：逐次递减id
      this.setTree.push(obj);
      this.$nextTick(() => {
        this.handleEdit(this.$refs.SlotTree.getNode(obj), obj);
      });
    },
    onSubmit () {
      if (!this.rpTemplateInfo.classifyID) {
        this.$message.warning("请先选择节点！");
        return false;
      }
      // 参数校验
      // medicineAmount
      // takeDose
      // takeFrequence
      // takeDirection
      // medicationDays
      let mark = this.rpTemplateInfo.rpTemplateMedicine.some((item) => {
        const reg2 = /^[1-9][0-9]{0,1}$/;
        if (!reg2.test(item.medicineAmount)) {
          this.$message.warning("请正确填写用量");
          return;
        }
        return item.medicineAmount && item.medicineAmount !== 0;
      });
      // console.log(this.rpTemplateInfo.rpTemplateMedicine.medicineAmount===false);
      // console.log(this.rpTemplateInfo.rpTemplateMedicine.medicationDays===false);
      if (!mark) {
         this.$message({
          message: '请添加药品并完善药品信息',
          type: 'warning'
        });
        return false;
      }
      this.$_http.post(this.$_API.INTERFACE_POST_SAVERPTEMPLATE, this.rpTemplateInfo).then(response => {
        this.$message({
          message: '保存成功！',
          type: 'success'
        });
        this.nodeClick(this.datas, this.nodes);
      });
    },
    // 添加药品
    addMedicine () {
      if (!this.rpTemplateInfo.medicineFormID) {
        this.$message({
          message: '请选择处方剂型',
          type: 'warning'
        });
        return;
      }
      this.$refs.addmedicine.getDoctorListFun(this.rpTemplateInfo.medicineFormID);
      this.visible = true;
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
    this.startId = this.NODE_ID_START;
    let params = {
      orgID: this.userInfo.orgID,
      rpClassifyType: 1
    };
    this.$_http.get(this.$_API.INTERFACE_GET_GETLIST, { params }).then(res => {
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
    // 获取药品剂型
    this.getDictionary({
      systemCode: "MEDICAL",
      groupCode: "D_MEDICAL_SPECIAL_TREATMENT",
      parentDictCode: ""
    }).then(res => {
      this.usages = res;
    });
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
.tree-list {
  margin-left: 30px;
  width: 300px;
  margin-top: 30px;
  border-radius: 5px;
  border: 1px solid #e8e8e8;
  height: 700px;
  overflow-y: auto;
  float: left;
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
  .font-way {
    font-size: 14px;
    font-weight: 800;
    color: #4e4e4e;
    margin-top: 15px;
  }
  .font14 {
    font-size: 14px;
  }
  .left20 {
    margin-left: 20px;
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
  overflow: hidden;
  li {
    float: left;
    list-style-type: none;
    margin: 0 0 8px 0;
    .medicineDivOne {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .medicineTitleDiv {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        width: 430px;
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
      .medicineNumInput {
        width:40px;
        // margin-left: 15px;
        // margin-right: 5px;
        // border-radius: 3px;
        // border: 1px solid #e8e8e8;
        // width: 40px;
        // height: 22px;
        // padding-left: 5px;
        // padding-right: 5px;
        // font-size: 14px;
        // text-align: center;
        // color: #555658;
      }
      .medicineNumBDiv {
        width: 150px;
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
      margin-left: 5px;
    }
  }
}
.medicineNumInput {
  margin-right: 5px;
  border-radius: 3px;
  border: 1px solid #e8e8e8;
  width: 40px;
  height: 22px;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 14px;
  text-align: center;
  color: #555658;
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
// 显示按钮
.show-btns {
  opacity: 1;
}
.comp-tree {
  width: 328px;
  max-width: 479px;
  max-height: 479px;
  padding: 20px;
  overflow: auto;
  // 顶部按钮
  .comp-tr-top {
    width: 100px;
    margin-bottom: 2em;
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
        font-weight: bold;
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
  // 高亮显示按钮
  .is-current {
    & > .el-tree-node__content {
      .comp-tr-node--btns {
        @extend .show-btns;
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
/deep/ .comp-tr-node .el-input--medium .el-input__inner {
  width: 150px;
  height: 25px;
}
/deep/ .comp-tree .comp-tr-node .comp-tr-node--name.is-new {
  font-weight: normal;
}
.el-select-dropdown__item {
  float: none !important;
}
</style>
