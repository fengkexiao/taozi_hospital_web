<template>
  <div class="app-container base-page">
    <div class="base-page_detail">
      <base-loading :loading="screenLoading">
      <div class="page-detail_title">共享医院</div>
        <el-form ref="fromPharmacist" :model="formData" :rules="formRules" label-width="150px">
          <el-form-item label="医院名称：" prop="doctorName">
            <template v-if="readonly">{{formData.doctorName}}</template>
            <el-input v-else v-model="formData.doctorName" placeholder="请输入" clearable  class="input_358"/>
          </el-form-item>
          <el-form-item label="医院等级：" prop="doctorName">
            <template v-if="readonly">{{formData.doctorName}}</template>
            <select-dictionary v-else v-model="formData.doctorName" system-code="MEDICAL" group-code="D_MEDICAL_HOSPITAL_GRADE"  class="input_358" />
          </el-form-item>
          <el-form-item label="医院性质：" prop="doctorName">
            <template v-if="readonly">{{formData.doctorName}}</template>
            <el-radio-group v-else v-model="formData.doctorName">
              <!-- <el-radio v-for="item of practiceList" :key="item.keyID" :label="item.dictCode" border>{{item.dictName}}
            </el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="专科：" prop="doctorName">
            <template v-if="readonly">{{formData.doctorName}}</template>
            <el-input v-else v-model="formData.doctorName" placeholder="请输入" clearable class="input_358" />
          </el-form-item>
          <el-form-item label="院长：" prop="doctorName">
            <template v-if="readonly">{{formData.doctorName}}</template>
            <el-input v-else v-model="formData.doctorName" placeholder="请输入" clearable class="input_358" />
          </el-form-item>
          <el-form-item label="联系方式：" prop="doctorName">
            <template v-if="readonly">{{formData.doctorName}}</template>
            <el-input v-else v-model="formData.doctorName" placeholder="请输入" clearable maxlength="11" class="input_358" />
          </el-form-item>
          <el-form-item label="所属省市" prop="doctorName">
            <template v-if="readonly">{{formData.doctorName}}</template>
            <el-cascader v-else :options="placeList" v-model="formData.doctorName" placeholder="请选择省市县" clearable filterable @change="HandleChange" class="input_358">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="doctorName">
            <template v-if="readonly">{{formData.doctorName}}</template>
            <el-input v-else v-model="formData.doctorName" placeholder="请输入" clearable class="input_358"></el-input>
          </el-form-item>
          <el-form-item label="经度" prop="doctorName">
            <template v-if="readonly">{{formData.doctorName}}</template>
            <el-input v-else v-model.number="formData.doctorName" placeholder="请输入" clearable class="input_358"></el-input>
          </el-form-item>
          <el-form-item label="纬度" prop="doctorName">
            <template v-if="readonly">{{formData.doctorName}}</template>
            <el-input v-else v-model.number="formData.doctorName" placeholder="请输入" clearable class="input_358"></el-input>
          </el-form-item>
          <el-form-item label="管理员姓名：" prop="doctorName">
            <template v-if="readonly">{{formData.doctorName}}</template>
            <el-input v-else v-model="formData.doctorName" placeholder="请输入" clearable class="input_358" />
          </el-form-item>
          <el-form-item label="管理员账号：" prop="doctorName">
            <template v-if="readonly">{{formData.doctorName}}</template>
            <el-input v-model="formData.doctorName" placeholder="请输入(初始密码为账号后六位)" clearable class="input_358" />
          </el-form-item>
          <el-form-item label="到期时间" prop="doctorName">
            <template v-if="readonly">{{formData.doctorName}}</template>
            <base-date-picker v-else v-model="formData.doctorName" shortcuts-option="weekLater,monthLater,yearLater" :pickerOptions="pickerOptions" class="input_358" />
          </el-form-item>
        </el-form>
      </base-loading>
      <div class="contain-flex justify-content-center form-input-width" style="margin: 0 auto">
        <el-button @click="back">返回</el-button>
        <span></span>
        <el-button v-if="!readonly" type="primary" class="margin-left-40" @click="validate">
          保存
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import SelectDictionary from "@/components/SelectDictionary";
import InputWithTip from "@/components/InputWithTip";
import { optionalFormCopy } from "@/utils/tools";
import placeList from "@/assets/json/place.json";
export default {
  name: "user-hospital-edit",
  components: {
    SelectDictionary,
    InputWithTip
  },
  inject: ["close"],
  props: {
    // 页面显示模式：C（创建）；V只读查看；E（编辑）
    mode: {
      type: String,
      required: true,
      default () {
        return "V";
      }
    },
    // 查询主键
    keyID: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      formData: {},
      formRules: {
        doctorName: {
          required: true,
          message: "医院姓名不能为空"
        },
        titleCode: {
          required: true,
          message: "职称不能为空"
        },
        categoryCode: {
          required: true,
          message: "类别不能为空"
        },
        briefDesc: {
          required: true,
          message: "个人简介不能为空"
        },
        photoUrl: {
          required: true,
          message: "工作照不能为空"
        }
      },
      screenLoading: true,
      pickerOptions: {
        // 禁用今天之前的日期
        disabledDate: date => {
          return date < new Date();
        }
      },
      placeList,
      placeOptions: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    // 是否只读
    readonly () {
      return this.mode === "V";
    }
  },
  created () {
    let loadList = [this.loadDetail];
    this.$_http.all(...loadList).finally(it => {
      this.screenLoading = false;
    });
  },
  methods: {
    // 加载医院信息详情
    loadDetail () {
      let params = {
        keyID: this.keyID
      };
      let request = this.$_http.get(this.$_API.INTERFACE_USER_PHARMACIST_GET, {
        params
      });
      request.then(res => {
        if (!res.data) return;
        let resData = optionalFormCopy(res.data);
        this.formData = { ...this.formData, ...resData };
      });
      return request;
    },
    HandleChange (value) {
      let items = [];
      for (let one in this.placeList) {
        if (this.placeList[one].value === value[0]) {
          items.push(this.placeList[one].text);
          for (let two in this.placeList[one].children) {
            if (this.placeList[one].children[two].value === value[1]) {
              items.push(this.placeList[one].children[two].text);
            }
          }
        }
      }
      this.placeOptions = items;
      this.coordinate();
    },
    // 坐标解析提示
    coordinate () {
      this.$notify({
        title: "温馨提示",
        dangerouslyUseHTMLString: true,
        type: "info",
        duration: 10000,
        message:
          "如果您不确定坐标是否正确，请使用<a href='https://lbs.amap.com/console/show/picker' target='_blank'>坐标标注工具</a>进行选择，手动填写"
      });
      let keys = {
        new: "f778c5056f3e7ff641dab8211a051c6b"
      };
      let params = {
        output: "json",
        key: keys.new,
        address:
          this.placeOptions[0] + this.placeOptions[1] + this.formData.Address
      };
      this.$_http
        .get("https://restapi.amap.com/v3/geocode/geo", {
          params: params
        })
        .then(res => {
          if (!res.data) return;
          let result = res.data.geocodes[0];
          if (!result) {
            return;
          }
          this.$notify({
            title: "逆地址坐标解析",
            dangerouslyUseHTMLString: true,
            type: "success",
            message:
              "<p>结构化地址信息:" +
              result.formatted_address +
              "</p><p>地址所在的省份名:" +
              result.province +
              "</p><p>地址所在的城市名:" +
              result.city +
              "</p><p>匹配级别:" +
              result.level +
              "</p><p style='color:red'>坐标点:" +
              result.location +
              "</p>"
          });
          // let location = result.location.split(",");
          // this.Detail.Lng = location[0];
          // this.Detail.Lat = location[1];
        });
    },
    // 返回列表页
    back () {
      // 关闭当前页
      this.close().then(() => {
        this.$router.push("/user/ShareHospital");
      });
    },
    // 验证表单
    validate () {
      if (this.screenLoading) {
        return;
      }
      this.$refs.fromPharmacist.validate(valid => {
        // 检查表单：医院信息
        if (!valid) {
          this.$_error("表单填写错误");
          return;
        }
        this.savePharmacist();
      });
    },
    // 保存表单
    savePharmacist () {
      let data = {
        doctorID: this.keyID,
        nurseInfo: this.formData
      };
      this.screenLoading = true;
      this.$_http
        .post(this.$_API.INTERFACE_USER_PHARMACIST_CERTIFY_SAVE, data)
        .then(res => {
          // 重置表单
          this.$refs.fromPharmacist.resetFields();
          this.$_success("保存医院信息成功");
          // 返回列表页
          this.back();
        })
        .finally(() => {
          this.screenLoading = false;
        });
    }
  }
};
</script>
