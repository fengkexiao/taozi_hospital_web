<template>
  <el-dialog :visible.sync="visible" class="popup-vertify" :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancel" width="700px">
    <el-form ref="formVertify" :model="formData" :rules="formRules" label-width="100px">
      <el-form-item label="规则名称：" label-width="200px" prop="targetName">
        <base-input placeholder="请输入" v-model.trim="formData.targetName" clearable maxlength="20" :disabled="disabled" class="input_250"></base-input>
      </el-form-item>
      <!-- <el-form-item label="咨询病种：" label-width="200px" prop="consultationDiseases">
        <base-input placeholder="请输入" v-model="formData.consultationDiseases" clearable></base-input>
      </el-form-item> -->
      <el-form-item label="患者状态：" label-width="200px" prop="patientStatus">
        <el-select v-model="formData.patientStatus" placeholder="全部" clearable filterable :disabled="disabled" class="input_250">
          <el-option v-for="item in orgTypeOptions" :key="item.patientStatus" :label="item.orgTypeName" :value="item.patientStatus"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="患者分级：" label-width="200px" prop="patientLevel">
        <el-select v-model="formData.patientLevel" placeholder="全部" clearable filterable :disabled="disabled" class="input_250">
          <el-option v-for="(item,index) in options" :key="index" :label="item.levelName" :value="item.levelName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签：" label-width="200px" prop="productUnit">
        <el-select v-model="formData.patientTags" placeholder="全部" clearable filterable :disabled="disabled" class="input_250">
          <el-option v-for="(item,index) in tagsList" :key="index" :label="item.tagText" :value="item.tagText"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医生：" label-width="200px" prop="price">
        <el-select v-model="formData.doctorStaffID" @change="doctorChange" placeholder="全部" clearable filterable :disabled="disabled" class="input_250">
          <el-option v-for="(item,index) in doctorList" :key="index" :label="item.doctorName" :value="item.doctorStaffID"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="助理医师：" label-width="200px" prop="thirdGoodsID">
        <el-select v-model="formData.assistantStaffID" @change="assistantChange" placeholder="全部" clearable filterable :disabled="disabled" class="input_250">
          <el-option v-for="(item,index) in assistantList" :key="index" :label="item.assistantName" :value="item.assistantStaffID"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄：" label-width="200px" prop="age" id="addrule-input">
        <el-radio v-model="formData.age" :label="''" :disabled="disabled">不限</el-radio>
        <el-radio v-model="formData.age" :label="2" :disabled="disabled">指定</el-radio>
        <template v-if="formData.age === 2">
          <el-input v-model.trim="formData.startAge" form-type="phone" placeholder="请输入" :show-word-limit="false" :clearable="false" :disabled="disabled"></el-input>至
          <el-input v-model.trim="formData.endAge" form-type="phone" placeholder="请输入" :show-word-limit="false" :clearable="false" :disabled="disabled"></el-input>岁（输入指定年龄段）
        </template>
      </el-form-item>
      <el-form-item label="性别：" label-width="200px" prop="sex">
        <el-radio v-model="formData.sex" :label="''" :disabled="disabled">不限</el-radio>
        <el-radio v-model="formData.sex" :label="1" :disabled="disabled">男</el-radio>
        <el-radio v-model="formData.sex" :label="2" :disabled="disabled">女</el-radio>
      </el-form-item>
      <el-form-item label="地区：" label-width="200px" prop="place" id="addrule-place">
        <el-select v-model="formData.provinceCode" @change="provinceChange" placeholder="不限" class="address_select" clearable filterable :disabled="disabled">
          <el-option v-for="item in provinces" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="formData.cityCode" @change="cityChange" placeholder="不限" class="address_select" clearable filterable :disabled="disabled">
          <el-option v-for="item in citys" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="formData.areaCode" @change="areaChange" placeholder="不限" class="address_select" clearable filterable :disabled="disabled">
          <el-option v-for="item in areas" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="建档时间：" label-width="200px" prop="medicineClas">
        <el-radio v-model="formData.addTime" :label="''" :disabled="disabled">不限</el-radio>
        <el-radio v-model="formData.addTime" :label="2" :disabled="disabled">指定</el-radio>
        <template v-if="formData.addTime === 2">
          <el-date-picker :disabled="disabled" v-model="value3" type="datetimerange"  class="input_358" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </template>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-if="isSee !== 'Y'" :loading="popHandling" type="primary" @click="saveRule">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import json from "@/assets/json/place.json";
import { formatDateTime } from "../../filters";
import { mapGetters } from "vuex";
export default {
  props: {
    // 控制显示
    visible: {
      type: Boolean,
      default () {
        return false;
      }
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
    },
    isSee: {
      type: String
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      provinces: json,
      citys: [],
      areas: [],
      addList: [],
      options: [],
      tagsList: [],
      doctorList: [],
      assistantList: [],
      orgTypeOptions: [
        { patientStatus: "1", orgTypeName: "已购药，需要跟进" },
        { patientStatus: "2", orgTypeName: "已购药不需要跟进" },
        { patientStatus: "3", orgTypeName: "不购药" }
      ],
      value1: "",
      value2: "",
      value3: [],
      disabled: false,
      title: "添加发送规则",
      getMedicineList: [],
      loading: false,
      staffList: [],
      formData: {
        targetName: "",
        consultationDiseases: "",
        patientStatus: "",
        patientLevel: "",
        age: "",
        sex: "",
        province: "",
        provinceCode: "",
        patientTags: "",
        city: "",
        cityCode: "",
        area: "",
        areaCode: "",
        buildStartDate: "",
        buildEndDate: "",
        startAge: "",
        endAge: "",
        addTime: ""
      },
      filterList: [],
      chooseObj: {},
      formRules: {
        targetName: {
          required: true,
          message: "规则名不能为空"
        }
      }
    };
  },
  watch: {
    propdata () {
      this.formData = JSON.parse(JSON.stringify(this.propdata));
      if (this.formData.startAge || this.formData.endAge) {
        this.formData.age = 2;
      }
      let obj = { ...JSON.parse(this.formData.content) };
      this.formData = Object.assign({}, this.formData, obj);
      if (this.formData.addTime === 2) {
        this.value3[0] = this.formData.buildStartDate;
        this.value3[1] = this.formData.buildEndDate;
      }
      if (this.isSee === "Y") {
        this.disabled = true;
        this.title = "发送规则详情";
      } else if (this.isSee === "E") {
        this.title = "修改发送规则";
      } else {
        this.title = "添加发送规则";
      }
      let chooseProvince = this.provinces.find(it => {
        if (it.value === this.formData.provinceCode) {
          return it;
        }
      });
      this.citys = chooseProvince.children;
      let chooseCity = this.citys.find(it => {
        if (it.value === this.formData.cityCode) {
          return it;
        }
      });
      this.areas = chooseCity.children;
    }
  },
  created () {
    let loadList = [];
    loadList.push(this.getPatientLevel());
    loadList.push(this.getDoctorListByOrgID());
    loadList.push(this.getSssistantListByOrgID());
    loadList.push(this.getOrgTags());
    this.$_http.all(...loadList).finally(it => { });
  },
  methods: {
    // 分级名称
    getPatientLevel () {
      let params = {
        orgID: this.userInfo.orgID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_PATIENT_LEVEL_NODISABLELIST, {
          params
        })
        .then(response => {
          if (!response.data) return;
          response.data.map(item => {
            this.options.push({
              levelName: item.levelName
            });
            return { levelName: item.levelName };
          });
          // console.log(this.options);
        })
        .finally(it => { });
    },
    // 获取医院下所有的医生
    getDoctorListByOrgID () {
      let params = {
        orgID: this.userInfo.orgID,
        jobType: 0
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_ASSISTANT_DOCTOR, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.doctorList = res.data;
        });
    },
    // 获取医院下所有的医助
    getSssistantListByOrgID () {
      let params = {
        orgID: this.userInfo.orgID,
        jobType: 1
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_ASSISTANT_DOCTOR, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.assistantList = res.data;
        });
    },
    getOrgTags () {
      let params = {
        orgID: this.userInfo.orgID
      };
      this.$_http
        .get(this.$_API.INTERFACE_GET_TMC_ORGTAGS, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.tagsList = res.data;
        });
    },
    // 点击取消处理
    cancel () {
      this.$emit("update:visible", false);
      this.formData = {
        targetName: "",
        consultationDiseases: "",
        patientStatus: "",
        patientLevel: "",
        age: "",
        sex: "",
        province: "",
        provinceCode: "",
        patientTags: "",
        city: "",
        cityCode: "",
        area: "",
        areaCode: "",
        buildStartDate: "",
        buildEndDate: "",
        startAge: "",
        endAge: "",
        addTime: ""
      };
      this.$refs.formVertify.resetFields();
    },
    // 点击确定处理
    saveRule () {
      if (this.formData.targetName === "") {
        this.$alert("请输入规则名称", "提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      if (this.formData.age === "") {
        this.formData.startAge = "";
        this.formData.endAge = "";
      } else {
        if (this.formData.endAge < this.formData.startAge || (this.formData.endAge === "0" && this.formData.startAge === "0")) {
          this.$alert("请正确填写年龄段", "提示", {
            confirmButtonText: "确定",
            callback: action => {
            }
          });
          return;
        }
      }
      if (this.formData.addTime === 2) {
        this.formData.buildStartDate = formatDateTime(this.value3[0]);
        this.formData.buildEndDate = formatDateTime(this.value3[1]);
      } else {
        this.formData.buildStartDate = "";
        this.formData.buildEndDate = "";
      }
      if (this.popHandling) {
        return;
      }
      this.$refs.formVertify.validate(valid => {
        if (!valid) {
          return;
        }
        this.$emit("saveRule", { ...this.formData });
        this.formData = {
          targetName: "",
          consultationDiseases: "",
          patientStatus: "",
          patientLevel: "",
          age: "",
          sex: "",
          province: "",
          provinceCode: "",
          patientTags: "",
          city: "",
          cityCode: "",
          area: "",
          areaCode: "",
          buildStartDate: "",
          buildEndDate: "",
          startAge: "",
          endAge: "",
          addTime: ""
        };
        this.$refs.formVertify.resetFields();
      });
    },
    provinceChange (event) {
      let chooseProvince = this.provinces.find(it => {
        if (it.value === event) {
          return it;
        }
      });
      this.formData.province = chooseProvince.label;
      this.citys = chooseProvince.children;
      if (this.formData.cityCode) {
        this.formData.cityCode = "";
        this.formData.city = "";
      }
      if (this.formData.areaCode) {
        this.formData.areaCode = "";
        this.formData.area = "";
      }
    },
    cityChange (event) {
      let chooseCity = this.citys.find(it => {
        if (it.value === event) {
          return it;
        }
      });
      this.formData.city = chooseCity.label;
      this.areas = chooseCity.children;
      if (this.formData.areaCode) {
        this.formData.areaCode = "";
        this.formData.area = "";
      }
    },
    areaChange (event) {
      let chooseArea = this.areas.find(it => {
        if (it.value === event) {
          return it;
        }
      });
      this.formData.city = chooseArea.label;
    },
    doctorChange (event) {
      let chooseDoctor = this.doctorList.find(it => {
        if (it.doctorStaffID === event) {
          return it;
        }
      });
      this.formData.doctorName = chooseDoctor.doctorName;
    },
    assistantChange (event) {
      let chooseAssistant = this.assistantList.find(it => {
        if (it.assistantStaffID === event) {
          return it;
        }
      });
      this.formData.assistantName = chooseAssistant.assistantName;
    }
  }
};
</script>
<style scoped>
.popup-vertify > .el-dialog {
  max-width: 700px;
}
</style>
<style>
#addrule-input .el-input {
  max-width: 50px;
}
#addrule-place .el-input {
  max-width: 100px;
  margin: 0 9px;
}
</style>
