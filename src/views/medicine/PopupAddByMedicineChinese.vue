<template>
  <el-dialog :visible.sync="visible" class="popup-vertify" :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancel" width="500px">
    <el-form ref="formVertify" :model="formData" :rules="formRules" label-width="170px">
      <el-form-item label="药品名称：" prop="medicineName">
        <el-select v-model="formData.medicineName" filterable clearable remote reserve-keyword placeholder="请输入药品名称" @change="handleChoose" :remote-method="querySearch" :loading="loading">
          <el-option v-for="(item,idx) in filterList" :key="idx" :label="item.medicineName + ' ' + '(' + item.medicineForm + ')'" :value="item.medicineName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="药品简码：" prop="namePy">
        <el-input v-model="formData.namePy" placeholder="请输入" disabled clearable />
      </el-form-item>
      <el-form-item label="产地：" prop="productPlace">
        <el-input v-model="formData.productPlace" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="销售单位：" prop="productUnit">
        <el-input v-model="formData.productUnit" placeholder="请输入" disabled clearable />
      </el-form-item>
      <el-form-item label="价格：" prop="price">
        <el-input v-model="formData.price" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="医院药品编号或条码：" prop="thirdGoodsID">
        <el-input v-model="formData.thirdGoodsID" placeholder="请输入" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
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
      // 药品列表
      getMedicineList: [],
      loading: false,
      formData: {
        medicineName: "",
        namePy: "",
        productPlace: "",
        productUnit: "",
        price: "",
        thirdGoodsID: "",
        whetherStaff: false
      },
      filterList: [],
      chooseObj: {},
      formRules: {
        medicineName: {
          required: true,
          message: "药品名称不能为空"
        },
        price: {
          required: true,
          message: "价格不能为空"
        },
        namePy: {
          required: true,
          message: "简码不能为空"
        },
        productUnit: {
          required: true,
          message: "单位不能为空"
        }
      }
    };
  },
  watch: {
    propdata () {
      // console.log(this.propdata, 222);
      this.formData = JSON.parse(JSON.stringify(this.propdata));
    }
  },
  methods: {
    handleChoose () {
      // console.log(this.formData.medicineName);
      this.filterList.map((item) => {
        if (item.medicineName === this.formData.medicineName) {
          this.formData = JSON.parse(JSON.stringify(item));
        }
      });
    },
    // 搜索
    querySearch (queryString) {
      this.filterList = [];
      queryString = queryString.replace(/(^\s*)|(\s*$)/g, "");
      if (queryString !== "") {
        let params = {
          searchKeyword: queryString,
          medicineClass: 1
        };
        this.$_http
          .get(this.$_API.INTERFACE_GET_DRUG_INFO_ZY, { params })
          .then(res => {
            if (!res.data) return;
            this.filterList = res.data;
            // console.log(res.data, 333);
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
</style>
