<template>
  <div class="app-container base-page">
    <div class="smsTemplate base-page_detail">
      <p class="page-detail_title">{{title}}</p>
      <div class="page-detail_container">
        <el-form ref="formDoctor" :model="formData" :rules="addDoctorRules" label-width="150px">
          <el-form-item label="模板类型：" prop="templateType">
            <el-select v-model="formData.templateType" placeholder="请选择" :readonly="disabled" filterable clearable class="input_358">
              <el-option v-for="(item,index) in staffList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板名称：" prop="templateName">
            <el-input placeholder="请输入" v-model="formData.templateName" clearable :readonly="disabled" class="input_358"></el-input>
          </el-form-item>
          <el-form-item label="参数：" id="sms-input" v-if="isDetail !== 'Y'">
            <el-select v-model="templateText" placeholder="请选择" :readonly="disabled" filterable clearable class="input_358">
              <el-option v-for="(item,index) in authorList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            &emsp;&emsp;
            <el-button @click="addParameter(templateText)">添加参数</el-button>
          </el-form-item>
          <el-form-item prop="templateContent" id="inputTextArea" label="模板内容：">
            <el-input type="textarea" id="textarea" ref="singleText" placeholder="请输入" class="input_358" :autosize="{ minRows: 10, maxRows: 10 }" clearable v-model="formData.templateContent" maxlength="500" :readonly="disabled"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="isDetail !== 'Y'" @click="cancel()">取消</el-button>
            <el-button v-if="isDetail === 'Y'" @click="cancel()">返回</el-button>
            <el-button v-if="isDetail !== 'Y'" type="primary" @click="validate()">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import ajax from "axios";
export default {
  name: "addSmsTemplate",
  inject: ["close"],
  components: {},
  props: {
    keyID: {
      type: String,
      required: false
    },
    isDetail: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      formData: {
        templateContent: ""
      },
      sections: [],
      title: "",
      templateText: "",
      disabled: false,
      staffList: [
        { value: 1, label: "问候类" },
        { value: 2, label: "宣传类" },
        { value: 3, label: "复诊类" }
      ],
      authorList: [
        { value: "$" + "{patientName}", label: "患者姓名" },
        { value: "$" + "{doctorName}", label: "医生姓名" },
        { value: "$" + "{url}", label: "链接地址" }
      ],
      addDoctorRules: {
        templateType: {
          required: true,
          message: "请选择模板类型"
        },
        templateName: {
          required: true,
          message: "模板名称不能为空"
        },
        templateContent: {
          required: true,
          message: "文本内容不能为空"
        }
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    if (this.isDetail === "E") {
      this.title = "修改模板";
    } else if (this.isDetail === "Y") {
      this.title = "模板详情";
      this.disabled = true;
    } else {
      this.title = "添加模板";
    }
    let loadList = [];
    if (typeof this.keyID !== "undefined" && this.keyID !== "") {
      loadList.push(this.getDetail());
    }
    this.$_http.all(...loadList).finally(it => { });
  },
  methods: {
    // 返回列表
    cancel () {
      this.$router.go(-1);
      // this.close().then(() => {
      //   this.$router.push({ name: "smsTemplate" });
      // });
    },
    // 添加验证
    validate () {
      if (this.screenLoading) {
        return;
      }
      this.$refs.formDoctor.validate(valid => {
        if (!valid) {
          return;
        }
        if (typeof this.keyID !== "undefined" && this.keyID !== "") {
          this.editTemplate();
        } else {
          this.addTemplate();
        }
      });
    },
    // 添加
    addTemplate () {
      let _this = this;
      let data = {
        orgID: _this.userInfo.orgID,
        serviceCode: "tmc",
        targetType: "tmc-patient",
        ..._this.formData
      };
      if (data.templateContent.length > 500) {
        this.$alert("短信内容超长", "提示", {
          confirmButtonText: "确定",
          callback: action => { }
        });
        return;
      }
      _this.$_http
        .post(_this.$_API.INTERFACE_POST_SMS_TEMPLATE_ADD, data)
        .then(r => {
          if (!r.data) return;
          _this.$_success("添加成功...");
          _this.close().then(() => {
            _this.$router.push({
              name: "smsTemplate",
              params: { isEdit: "Y" }
            });
          });
        });
    },
    // 获取
    getDetail () {
      let params = {
        keyID: this.keyID
      };
      this.$_http
        .get(this.$_API.INTERFACE_GET_SMS_TEMPLATEBYKEYID, { params })
        .then(res => {
          if (!res.data) return;
          this.formData = res.data;
        });
    },
    editTemplate () {
      let _this = this;
      let data = {
        keyID: _this.keyID,
        ..._this.formData
      };
      if (data.templateContent.length > 500) {
        this.$alert("短信内容超长", "提示", {
          confirmButtonText: "确定",
          callback: action => { }
        });
        return;
      }
      _this.$_http
        .post(_this.$_API.INTERFACE_POST_SMS_TEMPLATE_EDIT, data)
        .then(res => {
          if (!res.data) return;
          _this.$_success("修改成功...");
          _this.close().then(() => {
            _this.$router.push({
              name: "smsTemplate",
              params: { isEdit: "Y" }
            });
          });
        });
    },
    async addParameter (myValue) {
      const myField = document.querySelector("#textarea");
      // const myField = this.$refs.singleText;
      if (myField.selectionStart || myField.selectionStart === 0) {
        let startPos = myField.selectionStart;
        let endPos = myField.selectionEnd;
        this.formData.templateContent = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
        await this.$nextTick(); // 这句是重点, 圈起来
        myField.focus();
        myField.setSelectionRange(endPos + myValue.length, endPos + myValue.length);
      } else {
        this.formData.templateContent += myValue;
      }
    }
  }
};
</script>


<style lang="scss">
</style>
