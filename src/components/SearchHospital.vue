<template>
  <el-form-item :rules="formRules" prop="hospitalName" label="医院名称：">
    <el-autocomplete v-model="inputValue" placeholder="请输入医院名称" label-name="医院名称" :fetch-suggestions="querySearch" @blur="blur" :hide-loading="true" v-bind="$attrs"></el-autocomplete>
  </el-form-item>
</template>

<script>
export default {
  inheritAttrs: false,
  name: "SearchHospital",
  props: {
    value: Object,
    validate: Boolean
  },
  data() {
    return {
      // 输入的值查询结果的医院名数据
      getHospitalData: [],
      // 存放提醒框的数据
      remindData: [],
      // 存放传输医院的数据
      itemData: { hospitalName: "", hospitalID: "", getHospitalData: [] }
    };
  },
  computed: {
    inputValue: {
      get() {
        return this.value.hospitalName;
      },
      set(val) {
        this.setData(val);
      }
    },
    formRules() {
      return {
        hospitalName: {
          required: this.validate,
          message: "医院名称不能为空"
        }
      };
    }
  },
  methods: {
    // 触发：医院名字输入值进行模糊查询，并给出完整类似的提示
    querySearch(queryString, cb) {
      if (this.inputValue !== "") {
        this.remindData = [];
        let params = { name: this.inputValue };
        this.$_http.get(this.$_API.INTERFACE_SHARE_HOSPITAL_NAME, { params }).then(res => {
          if (!res.data) return;
          this.getHospitalData = res.data;
          let nameTipsArray = [];
          if (this.getHospitalData && this.getHospitalData.length > 0) {
            this.getHospitalData.forEach((item) => {
              let obj = { value: "", keyID: "" };
              obj.value = item.orgName;
              obj.keyID = item.keyID;
              this.remindData.push(obj);
            });
            nameTipsArray = this.remindData;
            cb(nameTipsArray);
          } else {
            this.$_error("请输入正确的医院名称");
          }
        });
      } else {
        // eslint-disable-next-line standard/no-callback-literal
        cb([]);
      }
    },
    setData(val) {
      this.itemData = { hospitalName: val, hospitalID: "", getHospitalData: [] };
      if (this.itemData.hospitalName) {
        this.getHospitalData.forEach((item) => {
          if (item.orgName === this.itemData.hospitalName) {
            this.itemData.hospitalID = item.keyID;
          }
        });
        this.itemData.getHospitalData = this.getHospitalData;
      }
      this.$emit("input", this.itemData);
    },
    blur() {
      if (this.itemData.hospitalName !== "" && this.itemData.hospitalID === "" && this.getHospitalData.length > 0) {
        this.itemData.hospitalName = this.getHospitalData[0].orgName;
        this.itemData.hospitalID = this.getHospitalData[0].keyID;
        this.itemData.getHospitalData = this.getHospitalData;
      }
    }
  }
};
</script>

<style scoped>

</style>
