<template>
  <div class="app-container base-page">
    <div class="smsTemplate base-page_detail">
      <p class="page-detail_title">{{title}}</p>
      <div class="page-detail_container">
        <el-form ref="formDoctor" :model="formData" :rules="addTask" label-width="150px">
          <el-form-item label="任务名称：" prop="taskName">
            <el-input v-if="isSee !== 'Y'" placeholder="请输入" v-model="formData.taskName" clearable class="input_358"></el-input>
            <template v-else>{{formData.taskName}}</template>
          </el-form-item>
          <el-form-item label="短信模板：" prop="templateID" >
            <el-select v-if="isSee !== 'Y'" v-model="formData.templateID" filterable clearable placeholder="请选择" @change="change($event)" class="input_358">
              <el-option v-for="(item,index) in templateList" :key="index" :label="item.templateName" :value="item.keyID">
              </el-option>
            </el-select>
            <template v-else>{{templateName}}</template>
            <div v-if="formData.templateID" class="color-ccc magin-15">已选模板：<span class="color-blue visit" @click="templateDetail()">{{templateName}}</span>&nbsp;&nbsp;<span>(点击查看详情)</span></div>
          </el-form-item>
          <div class="flex-star">
            <div class="title-left">
              <span style="color: red">*&nbsp;</span>选择发送对象：
            </div>
            <!-- <div v-if="isSee !== 'Y'"> -->
            <div class="flex-center">
              <div v-if="isSee !== 'Y'" style="margin-bottom: 10px">
                <span class="color-blue"><i class="el-icon-circle-plus-outline"></i></span>
                <span style="color: #438BEF; margin-left: 10px; cursor: pointer" @click="addRule">添加发送规则</span>
              </div>
              <div>
                <div style="color: #ccc">已选规则：</div>
                <ul class="list-line" v-for="(item, index) in formData.marketSmsTaskTargets" :key="index">
                  <li class="rule-list" v-if="item.targetType === 1">
                    <span class="visit" @click="details(item, index)">{{item.targetName}}</span>&nbsp;
                    <span class="delMedicineIconDiv" @click="delete1(index)" v-if="isSee !== 'Y'">
                      <img class="delMedicineIconImg" src="@/assets/image/tmcinquiry/delete.png" />
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="flex-right">
              <div v-if="isSee !== 'Y'" style="margin-bottom: 10px">
                <span style="color: #438BEF"><i class="el-icon-circle-plus-outline"></i></span>
                <span style="color: #438BEF; margin-left: 10px; cursor: pointer" @click="addContacts">添加特定联系人</span>
              </div>
              <div>
                <div style="color: #ccc">已选特定联系人：</div>
                <ul class="list-line" v-for="(item, index) in formData.marketSmsTaskTargets" :key="index">
                  <li class="rule-list" v-if="item.targetType === 2">
                    <span class="visit" @click="detailTable(item, index)">{{item.targetName}}</span>&nbsp;
                    <span class="delMedicineIconDiv" @click="delete1(index)" v-if="isSee !== 'Y'">
                      <img class="delMedicineIconImg" src="@/assets/image/tmcinquiry/delete.png" />
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <el-form-item label="发送时间：" prop="sendTimeType">
            <template v-if="isSee !== 'Y'">
              <el-radio v-model="formData.sendTimeType" :label="0">定时发送</el-radio>
              <el-radio v-model="formData.sendTimeType" :label="1">及时发送</el-radio>
            </template>
            <template v-else>
              <span v-if="formData.sendTimeType === 0">定时发送</span>
              <span v-if="formData.sendTimeType === 1">及时发送</span>
            </template>
          </el-form-item>
          <el-form-item v-if="formData.sendTimeType === 0">
            <div class="block">
              <p class="demonstration">设定时间：<span v-if="isSee === 'Y'">{{formData.sendTime | formatDateTime}}</span></p>
              <el-date-picker v-if="isSee !== 'Y'" v-model="formData.sendTime" type="datetime" clearable placeholder="选择日期时间" class="input_358">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item style="margin-top: 30px">
            <el-button v-if="isSee !== 'Y'" @click="return1()">取消</el-button>
            <el-button v-if="isSee === 'Y'" @click="return1()">返回</el-button>
            <el-button v-if="isSee !== 'Y'" type="primary" @click="validate()">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <addRule ref="addrules" :visible.sync="dialogVisible" :popHandling="popHandling" :isSee="isSee" :propdata="moveData" @saveRule="saveRule" />
      <addContacts :visible.sync="dialogVisible1" :popHandling="popHandling1" :isSee="isSee" :propdata="moveData1" @save="save" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import addRule from "./addRule";
import addContacts from "./addContacts";
import { formatDateTime } from "../../filters";
// import ajax from "axios";
export default {
  name: "addSmsTask",
  inject: ["close"],
  components: {
    addRule,
    addContacts
  },
  props: {
    keyID: {
      type: String,
      required: false
    },
    isSee: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      radio: "",
      value1: "",
      index: "",
      title: "",
      dialogVisible: false,
      popHandling: false,
      dialogVisible1: false,
      popHandling1: false,
      templateName: "",
      templateID: "",
      formData: {
        marketSmsTaskTargets: []
      },
      moveData: {},
      moveData1: {},
      templateList: [],
      addTask: {
        taskName: {
          required: true,
          message: "任务名不能为空"
        },
        templateID: {
          required: true,
          message: "请选择短信模板"
        },
        sendTimeType: {
          required: true,
          message: "请选择发送时间"
        }
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    if (this.isSee === "E") {
      this.title = "修改任务";
    } else if (this.isSee === "Y") {
      this.title = "任务详情";
    } else if (this.isSee === "C") {
      this.title = "复制任务";
    } else {
      this.title = "添加任务";
    }
    let loadList = [];
    if (typeof this.keyID !== "undefined" && this.keyID !== "") {
      loadList.push(this.getDetail());
    }
    loadList.push(this.getAllReviewedTemplate());
    this.$_http.all(...loadList).finally(it => { });
  },
  methods: {
    // 获取所有审核通过的模板
    getAllReviewedTemplate () {
      // let params = {
      //   orgID: this.userInfo.orgID
      // };
      // this.$_http
      //   .get(this.$_API.INTERFACE_GET_REVIEWED_SMS_TEMPLATEALL, {
      //     params
      //   })
      //   .then(res => {
      //     if (!res.data) return;
      //     this.templateList = res.data;
      //     if (typeof this.keyID !== "undefined" && this.keyID !== "") {
      //       setTimeout(() => {
      //         this.templateID = this.formData.templateID;
      //         this.templateList.forEach(item => {
      //           if (this.templateID === item.keyID) {
      //             this.templateName = item.templateName;
      //           }
      //         });
      //       }, 150);
      //     }
      //   });
    },
    // 返回列表
    return1 () {
      this.close().then(() => {
        this.$router.push({ name: "smsTask" });
      });
    },
    validate () {
      this.$refs.formDoctor.validate(valid => {
        if (!valid) {
          return;
        }
        if (this.formData.sendTimeType === 0 && !this.formData.sendTime) {
          this.$alert("请添加定时发送时间", "提示", {
            confirmButtonText: "确定",
            callback: action => { }
          });
          return;
        }
        if (this.formData.marketSmsTaskTargets.length === 0) {
          this.$alert("请添加发送对象", "提示", {
            confirmButtonText: "确定",
            callback: action => { }
          });
          return;
        }
        if (typeof this.keyID !== "undefined" && this.keyID !== "" && this.isSee !== "C") {
          this.updateSmsTask();
        } else {
          this.addSmsTask();
        }
      });
    },
    templateDetail () {
      this.$router.push({
        name: "detailSmsTemplate",
        params: { keyID: this.templateID, isDetail: "Y" }
      });
    },
    change (val) {
      this.templateID = val;
      this.templateList.forEach(item => {
        if (val === item.keyID) {
          this.templateName = item.templateName;
        }
      });
      // this.templateName = val;
    },
    details (item, index) {
      this.dialogVisible = true;
      let objs = JSON.parse(JSON.stringify(item));
      this.moveData = objs;
      this.index = index;
    },
    detailTable (item, index) {
      this.dialogVisible1 = true;
      let objs = JSON.parse(JSON.stringify(item));
      this.moveData1 = objs;
      this.index = index;
    },
    addRule () {
      this.dialogVisible = true;
      this.index = "";
    },
    addContacts () {
      this.dialogVisible1 = true;
      this.index = "";
    },
    saveRule (data) {
      let params = {
        targetType: 1,
        targetName: data.targetName,
        content: JSON.stringify(data)
      };
      if (this.index !== "") {
        let index = this.index;
        this.$set(this.formData.marketSmsTaskTargets, index, params);
      } else {
        this.formData.marketSmsTaskTargets.push(params);
      }
      this.dialogVisible = false;
    },
    save (data) {
      let params = {
        targetType: 2,
        targetName: data.targetName,
        content: JSON.stringify(data.addList)
      };
      if (this.index !== "") {
        let index = this.index;
        this.$set(this.formData.marketSmsTaskTargets, index, params);
      } else {
        this.formData.marketSmsTaskTargets.push(params);
      }
      this.dialogVisible1 = false;
    },
    delete1 (index) {
      this.formData.marketSmsTaskTargets.splice(index, 1);
    },
    // 添加
    addSmsTask () {
      let _this = this;
      let data = {
        orgID: _this.userInfo.orgID,
        ..._this.formData
      };
      data.sendTime = formatDateTime(data.sendTime);
      _this.$_http
        .post(_this.$_API.INTERFACE_POST_SMS_TASK_SAVE, data)
        .then(r => {
          if (!r.data) return;
          _this.$_success("添加成功...");
          _this.close().then(() => {
            _this.$router.push({
              name: "smsTask",
              params: { isLoad: "Y" }
            });
          });
        });
    },
    // 获取任务详情
    getDetail () {
      let params = {
        keyID: this.keyID
      };
      this.$_http
        .get(this.$_API.INTERFACE_GET_SMS_SMSTASKBYID, { params })
        .then(res => {
          if (!res.data) return;
          this.formData = res.data;
          if (this.isSee === "C" && this.formData.sendTime) {
            this.formData.sendTime = "";
          }
        });
    },
    updateSmsTask () {
      let _this = this;
      let data = {
        keyID: _this.keyID,
        orgID: _this.userInfo.orgID,
        ..._this.formData
      };
      data.sendTime = formatDateTime(data.sendTime);
      _this.$_http
        .post(_this.$_API.INTERFACE_POST_SMS_TASK_EDIT, data)
        .then(r => {
          if (!r.data) return;
          _this.$_success("修改成功...");
          _this.close().then(() => {
            _this.$router.push({
              name: "smsTask",
              params: { isLoad: "Y" }
            });
          });
        });
    },
    subStr (str) {
      return str.length > 9 ? str.substr(0, 9) + "..." : str;
    }
  }
};
</script>

<style lang="scss" scoped>
// #input-Lengthen {
//   .el-form-item__content {
//     .el-input {
//       /*input输入框宽度调整*/
//       width: 330px;
//       max-width: 330px;
//     }
//   }
// }
* {
  list-style: none;
}

.template-title {
  padding: 0;
  margin: 0;
  margin-top: 40px;
  margin-bottom: 40px;
  text-align: center;
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(42, 44, 48, 1);
}
.smsTask-input1 {
  width: 70px;
}
.smsTask-input {
  width: 50px;
}
.color-ccc {
  color: #ccc;
}
.color-blue {
  color: #438bef;
}
.visit {
  text-decoration: underline;
  max-width: 140px;
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.visit:hover {
  text-overflow: inherit;
  overflow: visible;
  white-space: pre-line;
  z-index: 10;
}
.magin-15 {
  margin-top: 15px;
}
.check {
  margin-left: 150px;
  width: 638px;
}
.delMedicineIconDiv {
  width: 15px;
  height: 15px;
  border-radius: 18px;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.delMedicineIconImg {
  width: 11px;
  height: 11px;
}
.crow {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.flex-star {
  overflow: hidden;
  margin-left: 30px;
}
.title-left {
  float: left;
  font-size: 14px;
  font-weight: 700;
  color: #606266;
}
.flex-center {
  float: left;
  width: 170px;
  font-size: 14px;
  font-weight: 700;
  margin-left: 10px;
  border-right: 1px solid #ccc;
}
.flex-right {
  float: left;
  width: 170px;
  font-size: 14px;
  font-weight: 700;
  margin-left: 50px;
}
.list-line {
  margin-left: -40px;
}
.rule-list {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>

