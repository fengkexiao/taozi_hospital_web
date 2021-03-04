<template>
  <el-dialog :visible.sync="visible" class="popup-vertify" :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancel" width="500px">
    <el-form ref="formVertify" :model="formData" :rules="formRules" label-width="170px">
      <el-form-item label="批准文号：" prop="approveNo">
        <el-select v-model.trim="formData.approveNo" filterable clearable remote reserve-keyword placeholder="请输入批准文号" @change="handleChoose" :remote-method="querySearch" :loading="loading">
          <el-option v-for="(item,idx) in filterList" :key="idx" :label="item.approveNo + ' ' + '(' + item.productSpec + ')'" :value="item.approveNo + ',' + item.productSpec"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="药品名称：" prop="medicineName">
        <el-input v-model="formData.medicineName" placeholder="请输入" clearable disabled />
      </el-form-item>
      <el-form-item label="药品简码：" prop="namePy">
        <el-input v-model="formData.namePy" placeholder="请输入" clearable disabled />
      </el-form-item>
      <el-form-item label="生产厂家：" prop="productPlace">
        <el-input v-model="formData.productFactory" placeholder="请输入" clearable disabled />
      </el-form-item>
      <el-form-item label="药品类型：" prop="medicineClass">
        <el-radio v-model="formData.medicineClass" disabled :label="0">西药</el-radio>
        <el-radio v-model="formData.medicineClass" disabled :label="2">中成药</el-radio>
      </el-form-item>
      <el-form-item label="处方药：" prop="otcType">
        <el-checkbox v-model="checked" disabled>是</el-checkbox>
      </el-form-item>
      <el-form-item label="规格：" prop="productSpec">
        <el-input v-model="formData.productSpec" placeholder="请输入" clearable disabled />
      </el-form-item>
      <el-form-item label="销售单位：" prop="productUnit">
        <el-input v-model="formData.productUnit" placeholder="请输入" clearable disabled />
      </el-form-item>
      <el-form-item label="价格：" prop="price">
        <el-input v-model="formData.price" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="药店药品编号或条码：" prop="barCode">
        <el-input v-model="formData.barCode" placeholder="请输入" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="popHandling" type="primary" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
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
    propdata: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      checked: false,
      loading: false,
      formData: {
        price: "",
        namePy: "",
        barCode: "",
        approveNo: "",
        medicineName: "",
        medicineClass: "",
        productPlace: "",
        productSpec: "",
        productUnit: "",
        otcType: "",
        whetherStaff: false
      },
      filterList: [],
      formRules: {
        approveNo: {
          required: true,
          message: "批准文号不能为空"
        },
        price: {
          required: true,
          message: "价格不能为空"
        },
        medicineName: {
          required: true,
          message: "请输入正确批准文号"
        }
      }
    };
  },
  watch: {
    propdata () {
      // console.log(this.propdata, 222);
      this.formData = JSON.parse(JSON.stringify(this.propdata));
      if (this.formData.otcType === 1) {
        this.checked = false;
      } else {
        this.checked = true;
      }
    }
  },
  methods: {
    handleChoose (event) {
      let approveNo = event.split(",");
      this.filterList.map((item) => {
        if (item.approveNo === approveNo[0] && item.productSpec === approveNo[1]) {
          this.formData = JSON.parse(JSON.stringify(item));
        }
      });
      if (this.formData.otcType === 1) {
        this.checked = false;
      } else {
        this.checked = true;
      }
    },
    // 搜索
    querySearch (queryString) {
      this.filterList = [];
      if (queryString !== "") {
        let params = {
          approveNo: queryString
        };
        this.$_http
          .get(this.$_API.INTERFACE_GET_DRUG_INFO_XY, { params })
          .then(res => {
            if (!res.data) return;
            if (res.data.otcType === 1) {
              this.checked = false;
            } else {
              this.checked = true;
            }
            this.filterList = res.data;
            // console.log(this.formData);
          });
      }
    },
    // 点击取消处理
    cancel () {
      this.$emit("update:visible", false);
      this.formData = {};
      this.$refs.formVertify.resetFields();
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
        this.$emit("save", { ...this.formData });
        this.formData = {};
        this.$refs.formVertify.resetFields();
      });
    }
  }
};
</script>
<style scoped>
.popup-vertify > .el-dialog {
  max-width: 700px;
}
base-input {
  width: 300px;
}
</style>
