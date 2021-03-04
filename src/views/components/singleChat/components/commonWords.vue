<template>
  <div class="common-words" v-show="visible">
    <div style="position:relative;width:100%;height:100%;">
      <div class="common-words_head">
        <span>常用语</span>
        <span class="cursor-pointer" @click="handleClose">隐藏</span>
      </div>
      <div class="input-container">
        <el-input placeholder="请输入关键字" v-model="filterText" size="mini">
        </el-input>
      </div>
      <div class="tree-container">
        <el-tree class="filter-tree" :data="data" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree" @node-click="handleNodeclick">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            
            <el-tooltip class="item" effect="dark" :content="renderNodeContent(data)" placement="right-start" v-if="node.level>1">
              <div  v-html="renderNode(data)"></div>
            </el-tooltip>
            <div v-html="renderNode(data)" v-else></div>
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
      data: [{
        "isDisable": 0,
        "modifyUser": "",
        "parantID": "",
        "modifyTime": "2020-03-14 11:12:14.0",
        "addTime": "2020-03-14 11:12:14.0",
        "addUser": "",
        "isDelete": 0,
        "keyID": "20031411150136855123002001",
        "classifyType": 1,
        "childList": [{
          "isDisable": 0,
          "modifyUser": "",
          "parantID": "",
          "modifyTime": "2020-03-14 11:12:14.0",
          "addTime": "2020-03-14 11:12:14.0",
          "addUser": "",
          "isDelete": 0,
          "keyID": "20031411150136855123002001",
          "classifyType": 1,
          "childList": [],
          "orgID": "19101610315474350800511001",
          "classifyName": "您好，我是桃子互联网医院的医生，很高兴为您提供线上复诊服务。"
        }, {
          "isDisable": 0,
          "modifyUser": "",
          "parantID": "",
          "modifyTime": "2020-03-14 11:12:14.0",
          "addTime": "2020-03-14 11:12:14.0",
          "addUser": "",
          "isDelete": 0,
          "keyID": "20031411150136855123002001",
          "classifyType": 1,
          "childList": [],
          "orgID": "19101610315474350800511001",
          "classifyName": "您好，为了方便医生快速了解您的近况，请依次回答以下问题：\n请确认近期服用过该药品，且无不良反应？\n肝肾功能是否正常？\n有无药品过敏史？\n是否处于特殊时期（哺乳，备孕或者怀孕的阶段)? "
        }, {
          "isDisable": 0,
          "modifyUser": "",
          "parantID": "",
          "modifyTime": "2020-03-14 11:12:14.0",
          "addTime": "2020-03-14 11:12:14.0",
          "addUser": "",
          "isDelete": 0,
          "keyID": "20031411150136855123002001",
          "classifyType": 1,
          "childList": [],
          "orgID": "19101610315474350800511001",
          "classifyName": "好的，请稍等。"
        }, {
          "isDisable": 0,
          "modifyUser": "",
          "parantID": "",
          "modifyTime": "2020-03-14 11:12:14.0",
          "addTime": "2020-03-14 11:12:14.0",
          "addUser": "",
          "isDelete": 0,
          "keyID": "20031411150136855123002001",
          "classifyType": 1,
          "childList": [],
          "orgID": "19101610315474350800511001",
          "classifyName": "好的，收到您的消息，正在为您开具处方。"
        }, {
          "isDisable": 0,
          "modifyUser": "",
          "parantID": "",
          "modifyTime": "2020-03-14 11:12:14.0",
          "addTime": "2020-03-14 11:12:14.0",
          "addUser": "",
          "isDelete": 0,
          "keyID": "20031411150136855123002001",
          "classifyType": 1,
          "childList": [],
          "orgID": "19101610315474350800511001",
          "classifyName": "为了您的用药安全，请您补充线下医生为您开具的处方凭证。（凭证可以是线下医院开具的取药单，处方，住院记录，出院记录，检查报告）。"
        },],
        "orgID": "19101610315474350800511001",
        "classifyName": "问候与接诊"
      },
      {
        "isDisable": 0,
        "modifyUser": "",
        "parantID": "",
        "modifyTime": "2020-03-14 11:12:14.0",
        "addTime": "2020-03-14 11:12:14.0",
        "addUser": "",
        "isDelete": 0,
        "keyID": "20031411150136855123002001",
        "classifyType": 1,
        "childList": [{
          "isDisable": 0,
          "modifyUser": "",
          "parantID": "",
          "modifyTime": "2020-03-14 11:12:14.0",
          "addTime": "2020-03-14 11:12:14.0",
          "addUser": "",
          "isDelete": 0,
          "keyID": "20031411150136855123002001",
          "classifyType": 1,
          "childList": [],
          "orgID": "19101610315474350800511001",
          "classifyName": "6岁以下儿童用药无处方 ---儿童用药必须提供线下医院处方，否则无法给您开具处方。该药品属于特殊用药，为了您的用药安全，请您补充线下医生为您开具的处方凭证才能为您开具线上处方。"
        }, {
          "isDisable": 0,
          "modifyUser": "",
          "parantID": "",
          "modifyTime": "2020-03-14 11:12:14.0",
          "addTime": "2020-03-14 11:12:14.0",
          "addUser": "",
          "isDelete": 0,
          "keyID": "20031411150136855123002001",
          "classifyType": 1,
          "childList": [],
          "orgID": "19101610315474350800511001",
          "classifyName": "您好，线上无法明确您的病情，为了您的用药安全，请到实体医疗机构明确诊断与用药。"
        }],
        "orgID": "19101610315474350800511001",
        "classifyName": "特殊情况处理"
      },
      {
        "isDisable": 0,
        "modifyUser": "",
        "parantID": "",
        "modifyTime": "2020-03-14 11:12:14.0",
        "addTime": "2020-03-14 11:12:14.0",
        "addUser": "",
        "isDelete": 0,
        "keyID": "20031411150136855123002001",
        "classifyType": 1,
        "childList": [{
          "isDisable": 0,
          "modifyUser": "",
          "parantID": "",
          "modifyTime": "2020-03-14 11:12:14.0",
          "addTime": "2020-03-14 11:12:14.0",
          "addUser": "",
          "isDelete": 0,
          "keyID": "20031411150136855123002001",
          "classifyType": 1,
          "childList": [],
          "orgID": "19101610315474350800511001",
          "classifyName": "根据您的病情描述，已为您开具电子处方。用药期间注意忌饮酒、辛辣、生冷饮食；需遵医嘱使用，可以参考药物说明书，注意药物副作用，如遇不适，请立即停药，就近就医。"
        }],
        "orgID": "19101610315474350800511001",
        "classifyName": "成功开方"
      }, {
        "isDisable": 0,
        "modifyUser": "",
        "parantID": "",
        "modifyTime": "2020-03-14 11:12:14.0",
        "addTime": "2020-03-14 11:12:14.0",
        "addUser": "",
        "isDelete": 0,
        "keyID": "20031411150136855123002001",
        "classifyType": 1,
        "childList": [{
          "isDisable": 0,
          "modifyUser": "",
          "parantID": "",
          "modifyTime": "2020-03-14 11:12:14.0",
          "addTime": "2020-03-14 11:12:14.0",
          "addUser": "",
          "isDelete": 0,
          "keyID": "20031411150136855123002001",
          "classifyType": 1,
          "childList": [],
          "orgID": "19101610315474350800511001",
          "classifyName": "不客气"
        }, {
          "isDisable": 0,
          "modifyUser": "",
          "parantID": "",
          "modifyTime": "2020-03-14 11:12:14.0",
          "addTime": "2020-03-14 11:12:14.0",
          "addUser": "",
          "isDelete": 0,
          "keyID": "20031411150136855123002001",
          "classifyType": 1,
          "childList": [],
          "orgID": "19101610315474350800511001",
          "classifyName": "处方已为您开具，请点击上方电子处方进行确认取药，祝您健康，再见。"
        }],
        "orgID": "19101610315474350800511001",
        "classifyName": "结束语"
      },
      {
        "isDisable": 0,
        "modifyUser": "",
        "parantID": "",
        "modifyTime": "2020-03-14 11:12:14.0",
        "addTime": "2020-03-14 11:12:14.0",
        "addUser": "",
        "isDelete": 0,
        "keyID": "20031411150136855123002001",
        "classifyType": 1,
        "childList": [{
          "isDisable": 0,
          "modifyUser": "",
          "parantID": "",
          "modifyTime": "2020-03-14 11:12:14.0",
          "addTime": "2020-03-14 11:12:14.0",
          "addUser": "",
          "isDelete": 0,
          "keyID": "20031411150136855123002001",
          "classifyType": 1,
          "childList": [],
          "orgID": "19101610315474350800511001",
          "classifyName": "您的情况不适合使用该药品，为了您的用药安全，请到线下医院就诊。"
        }, {
          "isDisable": 0,
          "modifyUser": "",
          "parantID": "",
          "modifyTime": "2020-03-14 11:12:14.0",
          "addTime": "2020-03-14 11:12:14.0",
          "addUser": "",
          "isDelete": 0,
          "keyID": "20031411150136855123002001",
          "classifyType": 1,
          "childList": [],
          "orgID": "19101610315474350800511001",
          "classifyName": "您的情况不适合使用该药品，建议您到医院就诊后在医生的指导下用药。"
        }],
        "orgID": "19101610315474350800511001",
        "classifyName": "拒绝话术"
      }],
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
    renderNodeContent(label){
      let str = label.classifyName || label.content || label.descrip || "";
      return str;
    },
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
          tmpData = data || null;
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
      // let params = {
      //   classifyType: this.type,
      //   // 发送者
      //   orgID: this.orgID
      // };
      // this.$_http
      //   .get(this.$_API.INTERFACE_TMC_GET_GETTOOLCLASSIFYTREEBYID, {
      //     params
      //   })
      //   .then(res => {
      //     if (!res.data) {
      //       return false;
      //     }
      //     console.log(res.data)
      //     this.data = res.data;
      //   });
    }
  }
};
</script>

<style lang="scss" >
.custom-tree-node {
  div {
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    word-wrap: break-word;
    word-break: normal;
  }
}
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
