<template>
  <el-dialog :visible.sync="visible" class="popup-vertify" :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancel" width="470px">
    <el-form ref="formVertify" :model="formData" :rules="formRules" label-width="100px">
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="formData.name" placeholder="请输入" clearable class="w200"/>
      </el-form-item>
      <!-- 只针对 userInfo.orgTypeID === 4 即互联网医院-->
      <el-form-item v-if="userInfo.orgTypeID === 4" label="身份证号：">
        <el-input v-model="formData.idNumber" placeholder="请输入" clearable class="w200"/>
      </el-form-item>
      <el-form-item label="科室：">
        <el-select v-model="formData.sectionID" placeholder="请选择" filterable clearable class="w200">
          <el-option v-for="(item,index) in sections1" :key="index" :label="item.hospitalSectionName" :value="item.keyID"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号：" prop="phone">
        <el-input v-model="formData.phone" maxlength="11" placeholder="请输入" clearable class="w200"/>
        <verification-code ref="verification" class="margin-left-10" :phoneNo="formData.phone" />
      </el-form-item>
      <el-form-item label="验证码：" prop="code">
        <el-input v-model="formData.code" placeholder="请输入" clearable class="w200"/>
      </el-form-item>
      <el-form-item prop="whetherStaff">
        <el-checkbox v-model="formData.whetherStaff">{{ checkboxMsg }}</el-checkbox>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="popHandling" type="primary" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import VerificationCode from "@/components/VerificationCode";
import { mapGetters } from "vuex";
export default {
  components: {
    VerificationCode
  },
  props: {
    // 控制显示
    visible: {
      type: Boolean,
      default () {
        return false;
      }
    },
    // 弹窗标题
    title: {
      type: String,
      required: true
    },
    // 弹窗是否在处理中
    popHandling: {
      type: Boolean,
      default () {
        return false;
      }
    },
    // 医院科室信息
    sections: {
      type: Array,
      required: true
    }
  },
  data () {
    return {

      formData: {
        name: "",
        idNumber: "", // 只针对互联网医院
        phone: "",
        code: "",
        whetherStaff: false,
        sectionID: ""
      },
      formRules: {
        name: {
          required: true,
          message: "姓名不能为空"
        },
        sectionID: {
          required: true,
          message: "科室不能为空不能为空"
        },
        phone: [
          {
            required: true,
            message: "手机号码不能为空"
          },
          {
            trigger: "blur",
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码（11位）"
          }
        ],
        code: {
          required: true,
          message: "验证码不能为空"
        }
      },
      checkboxMsg: "同时在“员工管理”列表中生成员工账号",
      sections1: []
    };
  },
  watch: {
    visible (val) {
      if (!val) {
        // 重置表单
        this.$refs.formVertify.resetFields();
        // 重置组件状态
        this.$refs.verification.reset();
      }
    },
    sections () {
      this.sections1 = this.sections;
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    // 点击取消处理
    cancel () {
      this.$emit("update:visible", false);
    },
    // 点击确定处理
    save () {
      if (this.popHandling) {
        return;
      }
      this.$refs.formVertify.validate(valid => {
        if (!valid) {
          return;
        }
        // 只针对互联网医院做判断
        if (this.userInfo.orgTypeID === 4 && this.formData.idNumber.length === 0) {
          this.$_error("身份证号不能为空");
          return;
        }
        this.$emit("save", this.formData);
      });
    }
  }
};
</script>
<style>
.popup-vertify > .el-dialog {
  max-width: 700px;
}
</style>
