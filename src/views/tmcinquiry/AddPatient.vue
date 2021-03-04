<template>
  <div class="app-container">
    <base-loading :loading="tableLoading">
      <div class="box-card" style="width: 420px;margin: 0 auto;padding-top: 24px">
        <div id="patientFormDiv">
          <el-form :model="patientInfoData" :rules="formRules" ref="patientInfoForm" label-width="95px">
            <el-form-item prop="patientName" label="姓名：">
              <el-input v-model.trim="patientInfoData.patientName" type="text" placeholder="请输入" clearable maxlength="20" class="input_358" />
            </el-form-item>
            <el-form-item prop="sex" label="性别：">
              <el-select v-model="patientInfoData.sex" placeholder="请选择" filterable clearable class="input_358">
                <el-option v-for="(item,index) in sexOptions" :key="index" :label="item.sexName" :value="item.sex"></el-option>
              </el-select>
            </el-form-item>
            <!--        根据年龄、身份证号  计算出生年及日期-->
            <el-form-item prop="tags" label="病症：">
              <el-tag v-for="(tag,index) in tags" :key="tag.name" closable @close="handleDelTag(tag,index)" style="margin-right: 20px;">
                {{tag.name}}
              </el-tag>
              <el-checkbox-group v-model="patientInfoData.tags" :max="2" @change="handleTagChange">
                <el-checkbox :label="item.paraValue" v-for="(item,index) in diseaseList" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item prop="age" label="年龄：">
              <el-input v-model="patientInfoData.age" placeholder="请输入" clearable maxlength="10" min="0" @keyup.native="loadNumber($event)" class="input_358"></el-input>
            </el-form-item>
            <el-form-item prop="nameList" label="IP医生：">
              <el-cascader ref="nameCascader" v-model="patientInfoData.nameList" :options="assistantNameOptions" @change="handleChange" :disabled="disabled" class="input_358">
              </el-cascader>
            </el-form-item>
            <el-form-item prop="phone" label="联系电话：">
              <el-input v-model.trim="patientInfoData.phone" form-type="phone" placeholder="请输入" clearable maxlength="11" class="input_358" />
            </el-form-item>
            <el-form-item prop="idNumber" label="身份证号：">
              <el-input v-model.trim="patientInfoData.idNumber" type="text" placeholder="请输入" clearable maxlength="18" class="input_358" />
            </el-form-item>
            <el-form-item prop="wechatAccount" label="微信账号：">
              <el-input v-model.trim="patientInfoData.wechatAccount" type="text" placeholder="请输入" clearable maxlength="30" class="input_358" />
            </el-form-item>
            <el-form-item prop="place" label="联系地址：">
              <el-cascader ref="placeCascader" v-model="patientInfoData.place" :options="placeOptions" @change="handleChangeAddress" placeholder="请选择" clearable filterable class="input_358"></el-cascader>
            </el-form-item>
            <el-form-item prop="address" label=" ">
              <el-input v-model.trim="patientInfoData.address" type="text" placeholder="请输入" clearable maxlength="100" @blur="getGeoFun" class="input_358" />
            </el-form-item>
            <el-form-item prop="relationCode" label="患者关系：">
              <el-select v-model="patientInfoData.relationCode" placeholder="请选择" filterable clearable value="" class="input_358">
                <el-option v-for="(item,index) in relationOptions" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="patientLevel" label="患者分级：">
              <el-select v-model="patientInfoData.patientLevel" placeholder="请选择" filterable clearable value="" class="input_358">
                <el-option v-for="item in options" :key="item.keyID" :label="item.levelName" :value="item.levelName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="channel" label="渠道：">
              <el-select v-model="patientInfoData.channelCode" placeholder="请选择" filterable clearable value="" class="input_358">
                <el-option v-for="(item,index) in channelOptions" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="channel" label="严重程度：">
              <el-select v-model="patientInfoData.illnessStr" placeholder="请选择" filterable clearable value="" class="input_358">
                <el-option v-for="(item) in illness" :key="item.dictCode" :label="item.dictName" :value="item.dictName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="currentDisease" label="病史：">
              <el-input v-model.trim="patientInfoData.currentDisease" type="textarea" placeholder="请输入" clearable maxlength="200" class="input_358" />
            </el-form-item>
            <el-form-item prop="diseaseCycle" label="患病周期：">
              <el-input v-model.trim="patientInfoData.diseaseCycle" type="text" placeholder="请输入" clearable maxlength="30" class="input_358" />
            </el-form-item>
            <el-form-item prop="consultationDiseases" label="咨询病种：">
              <el-input v-model.trim="patientInfoData.consultationDiseases" type="text" placeholder="请输入" clearable maxlength="100" class="input_358" />
            </el-form-item>
            <el-form-item prop="consultationMedicinal" label="咨询药品：">
              <el-input v-model.trim="patientInfoData.consultationMedicinal" type="textarea" placeholder="请输入" clearable maxlength="200" class="input_358" />
            </el-form-item>
            <!--        无存储参数-->
            <el-form-item prop="remarks" label="备注：">
              <el-input v-model.trim="patientInfoData.remarks" type="textarea" placeholder="请输入" clearable maxlength="300" class="input_358" />
            </el-form-item>
          </el-form>
        </div>
        <div style="text-align: center;padding-bottom: 24px">
          <el-button @click="back">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </div>
    </base-loading>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import json from "@/assets/json/place.json";
import { REGULAR_EXPRESSION_IDNUMBER } from "@/common/Constant";
import ajax from "axios";
export default {
  name: "addPatient",
  inject: ["reload", "close"],
  props: {
    state: {
      type: String,
      required: true
    },
    keyID: {
      type: String,
      required: true
    },
    orgID: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      tags: [
      ],
      confirmPass: "",
      tableLoading: false,
      disabled: false,
      patientInfoData: {
        patientName: "",
        sex: "",
        illness: '',
        illnessStr: "",
        age: "",
        patientTags: '',
        tags: [],
        nameList: [],
        assistantName: "",
        idNumber: "",
        phone: "",
        wechatAccount: "",
        place: "",
        address: "",
        relationCode: "",
        patientLevel: "",
        channelCode: "",
        currentDisease: "",
        diseaseCycle: "",
        consultationDiseases: "",
        consultationMedicinal: "",
        remarks: ""
      }, // 患者所有信息
      // 医助列表
      assistantNameOptions: [],
      // 分组
      options: [],
      isDisable: [],
      sexOptions: [
        { sex: 1, sexName: "男" },
        { sex: 2, sexName: "女" }
      ],
      placeOptions: json, // 地址下拉级联
      relationOptions: [], // 患者关系
      patientLevelOptions: [], // 患者分级
      channelOptions: [], // 渠道
      historyOfSicknessData: [],
      illness: [
        {
          dictCode: '1',
          dictName: '轻微'
        },
        {
          dictCode: '2',
          dictName: '一般'
        },
        {
          dictCode: '3',
          dictName: '严重'
        }
      ],
      diseaseList: [],
      // 表单验证
      formRules: {
        patientName: {
          required: true,
          message: "姓名不能为空"
        },
        nameList: {
          required: true,
          message: "请选择IP医生"
        },
        age:{
          required: true,
          message: "请输入年龄"
        },
        idNumber: [
          {
            required: false,
            message: ""
          },
          {
            trigger: "blur",
            pattern: REGULAR_EXPRESSION_IDNUMBER,
            message: "请输入有效的身份证号（18位）"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入联系电话"
          },
          {
            trigger: "blur",
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码（11位）"
          }
        ]
      }
    };
  },
  watch: {
  },
  created () {
    this.getDiseaList()
    if (this.state === "V") {
      this.getTmcPatientInfo();
      this.disabled = true;
    }
    this.loadDictionary();
    this.getPatientLevel();
  },
  methods: {
    ...mapActions({
      getDictionary: "dictionary/getDictionary"
    }),
    // 获取病种
    getDiseaList () {
      let params = {
        orgID: this.userInfo.orgID,
        groupCode: "OP_TMC_ORG_FIRST_DISEASE",
        paraCode: "OP_TMC_ORG_SECOND_DISEASE"
      };
      this.$_http
        .get(this.$_API.INTERFACE_ASSISTANT_PARAS, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.diseaseList = res.data
        })
    },
    handleAddTag () {

    },
    handleDelTag (tag, index) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      this.patientInfoData.tags.splice(index, 1);
    },
    handleTagChange (val) {
      this.tags = []
      val.map(item => {
        this.tags.push({ name: item })
      })
      // this.tags
    },
    loadNumber: function (event) {
      var elValue = this.patientInfoData.age;
      var reg = /^((?!0)\d{1,3}|150)$/;
      if (!elValue.match(reg)) {
        this.$set(this.patientInfoData, "age", 1);
        return false;
      } else {
        return true;
      }
    },
    // 根据字典类型获取字典数据
    loadDictionary () {
      // 获取患者关系
      this.getDictionary({
        systemCode: "TMC",
        groupCode: "D_TMC_PATIENT_RELATION",
        parentDictCode: ""
      }).then(res => {
        this.relationOptions = res;
      });
      // 获取患者渠道
      this.getDictionary({
        systemCode: "TMC",
        groupCode: "D_TMC_PATIENT_FROM",
        parentDictCode: ""
      }).then(res => {
        this.channelOptions = res;
      });
      // 获取患者疾病史的既往病史
      this.getDictionary({
        systemCode: "TMC",
        groupCode: "D_TMC_DOCS_SICKNESS_2ND",
        parentDictCode: "ALLERGY"
      }).then(res => {
        let resArray = res;
        let showArray = [];
        resArray.forEach(item => {
          if (item.dictName !== "+++") {
            this.$set(item, "indexIsClicked", false);
            showArray.push(item);
          }
        });
        this.historyOfSicknessData = [...showArray];
      });
      // 获取患者疾病史的过敏史
      this.getDictionary({
        systemCode: "TMC",
        groupCode: "D_TMC_DOCS_SICKNESS_2ND",
        parentDictCode: "ILLNESS"
      }).then(res => {
        let resArray = res;
        let showArray = [];
        resArray.forEach(item => {
          if (item.dictName !== "+++") {
            this.$set(item, "indexIsClicked", false);
            showArray.push(item);
          }
        });
        this.historyOfAllergyData = [...showArray];
      });
    },
    // 获取列表
    getTmcPatientInfo () {
      if (this.tableLoading) {
        return;
      }
      let hospitalInfo = {
        orgID: this.orgID,
        keyID: this.keyID
      };
      let params = { ...hospitalInfo };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_PATIENT_INFO, { params })
        .then(response => {
          if (!response.data) return;
          this.patientInfoData = { ...this.patientInfoData, ...response.data };
          this.patientInfoData.nameList = [response.data.doctorStaffID, response.data.assistantStaffID];
          // console.log(this.patientInfoData, 23232332);
          if (!this.patientInfoData.sex) {
            this.patientInfoData.sex = "";
            this.$set(this.patientInfoData, "sexName", "");
          } else if (this.patientInfoData.sex === 1) {
            this.$set(this.patientInfoData, "sexName", "男");
          } else if (this.patientInfoData.sex === 2) {
            this.$set(this.patientInfoData, "sexName", "女");
          }
          if (this.patientInfoData.birthDate && this.patientInfoData.birthDate !== "1900-01-01") {
            this.jsGetAge(this.patientInfoData.birthDate);
          }
          if (this.patientInfoData.birthDate === "1900-01-01" && this.patientInfoData.birthYear !== 0) {
            this.getAge(this.patientInfoData.birthYear);
          }
          if (this.patientInfoData.birthDate === "1900-01-01" && this.patientInfoData.birthYear === 0) {
            this.patientInfoData.age = "";
          }
          if (!this.patientInfoData.birthYear && !this.patientInfoData.birthDate) {
            this.patientInfoData.age = "";
          }
          if (this.patientInfoData.patientTags) {
            let tmpList = this.patientInfoData.patientTags.split(',')
            tmpList.map(item => {
              this.tags.push({ name: item })
            })
            this.patientInfoData.tags = tmpList
          }
          if (this.patientInfoData.illness) {

            this.illness.map(item => {
              if (this.patientInfoData.illness === parseInt(item.dictCode)) {
                this.patientInfoData.illnessStr = item.dictName
              }
            })
          }
          // 外部微信来源患者有地址无code
          if (this.patientInfoData.province !== "" && this.patientInfoData.provinceCode === "") {
            this.patientInfoData.address = this.patientInfoData.province + this.patientInfoData.city;
          } else {
            this.patientInfoData.place = [this.patientInfoData.provinceCode, this.patientInfoData.cityCode, this.patientInfoData.areaCode];
          }
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 分级名称
    getPatientLevel () {
      let params = {
        orgID: this.userInfo.orgID
      };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_PATIENT_LEVEL_NODISABLELIST, { params })
        .then(response => {
          if (!response.data) return;
          // this.isDisable = response.data.filter(it => {
          //   if (it.isDisable === 0) {
          //     return it;
          //   }
          // });
          this.options = response.data.map(item => {
            return { "levelName": item.levelName };
          });
        })
        .finally(it => {
          this.tableLoading = false;
        });
      this.getAssistantGroup();
    },
    // 医生医助组
    getAssistantGroup () {
      let hospitalInfo = {
        orgID: this.userInfo.orgID
      };
      let params = { ...hospitalInfo };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_ASSISTANT_GROUP_LISTDATA, { params })
        .then(response => {
          // console.log(response.data, 23232332);
          if (!response.data) return;
          this.assistantOptions = response.data;
          this.assistantNameOptions = this.assistantOptions.map((item, index) => {
            return {
              key: index,
              value: item.assistantGroup.doctorStaffID,
              label: item.assistantGroup.doctorName,
              children: item.groupMembers
            };
          });
          this.assistantNameOptions.forEach(item => {
            item.children.forEach(items => {
              items["value"] = items.assistantStaffID;
              items["label"] = items.assistantName;
            });
          });
        });
    },
    handleChange (value) {
      // console.log(value);
      this.$refs.patientInfoForm.validateField("nameList");
      let node = this.$refs.nameCascader.getCheckedNodes();
      // console.log(node);
      if (node.length === 0) {
        return;
      }
      this.patientInfoData.assistantName = node[0].label;
      this.patientInfoData.assistantStaffID = node[0].value;
      this.patientInfoData.doctorName = node[0].parent.label;
      this.patientInfoData.doctorStaffID = node[0].parent.value;
      // this.patientInfoData.doctorStaffID = this.patientInfoData.nameList[0];
      // this.patientInfoData.assistantStaffID = this.patientInfoData.nameList[1];
    },
    back () {
      this.close().then(() => {
        this.$router.push({
          name: "tmc-patient",
          params: {}
        });
      });
    },
    // 根据出生日期算出年龄
    jsGetAge (birthDay) {
      let birthday = new Date(birthDay.replace(/-/g, "\/"));
      let d = new Date();
      this.patientInfoData.age = d.getFullYear() - birthday.getFullYear() - (((d.getMonth() < birthday.getMonth() || d.getMonth() === birthday.getMonth()) && d.getDate() < birthday.getDate()) ? 1 : 0);
    },
    getAge (birthYear) {
      let myDate = new Date();
      let tYear = myDate.getFullYear();
      this.patientInfoData.age = tYear - birthYear;
    },
    // 转换：所选省市区
    handleChangeAddress () {
      this.$refs.patientInfoForm.validateField("place");
      let node3 = this.$refs.placeCascader.getCheckedNodes();
      if (node3.length === 0) {
        return;
      }
      let node2 = node3[0].parent;
      let node1 = node2.parent;
      this.patientInfoData.area = node3[0].label;
      this.patientInfoData.areaCode = node3[0].value;
      this.patientInfoData.city = node2.label;
      this.patientInfoData.cityCode = node2.value;
      this.patientInfoData.province = node1.label;
      this.patientInfoData.provinceCode = node1.value;
    },
    // 定位：根据所选省市区及详细地址获取坐标
    getGeoFun () {
      if (!this.patientInfoData.area) {
        this.$notify.error({
          title: "提示",
          message: "请完善地址信息"
        });
        return;
      }
      this.$_notify({
        title: "温馨提示",
        dangerouslyUseHTMLString: true,
        type: "info",
        duration: 10000,
        message:
          "如果您不确定坐标是否正确，请使用<a href='https://lbs.amap.com/console/show/picker' style='color:#438bef' target='_blank'>坐标标注工具</a>进行选择，手动填写"
      });
      let keys = {
        new: "f778c5056f3e7ff641dab8211a051c6b"
      };
      let params = {
        output: "json",
        key: keys.new,
        address: this.patientInfoData.province + this.patientInfoData.city + this.patientInfoData.area + this.patientInfoData.address
      };
      ajax.get("https://restapi.amap.com/v3/geocode/geo", { params: params }).then(res => {
        let result = res.data.geocodes[0];
        this.$_notify({
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
        let location = result.location.split(",");
        this.patientInfoData.longitude = location[0];
        this.patientInfoData.latitude = location[1];
      }).catch(err => console.log(err));
    },
    // 操作：保存 > 患者信息
    save () {

      this.$refs.patientInfoForm.validate(valid => {
        // 检查表单：医生信息
        if (valid) {
          // 患者关系
          if (this.patientInfoData.relationCode) {
            let itemInfo = this.relationOptions.find(item => {
              return this.patientInfoData.relationCode === item.dictCode;
            });
            this.patientInfoData.relationName = itemInfo.dictName;
          }
          // 渠道
          if (this.patientInfoData.channelCode) {
            let itemInfo = this.channelOptions.find(item => {
              return this.patientInfoData.channelCode === item.dictCode;
            });
            this.patientInfoData.channelName = itemInfo.dictName;
          }
          let addInfo = {
            personID: this.keyID,
            orgID: this.userInfo.orgID
          };

          if (this.patientInfoData.tags.length > 0) {
            this.patientInfoData.patientTags = this.patientInfoData.tags.join(',')
          }
          let myDate = new Date();
          let tYear = myDate.getFullYear();
          if (this.patientInfoData.age !== "") {
            this.patientInfoData.birthYear = tYear - this.patientInfoData.age;
          }
          this.$confirm("确认保存患者信息吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            if (!this.patientInfoData.illnessStr) {
              this.patientInfoData.illness = '0';
            } else {
              let id = ''
              this.illness.map(item => {
                if (item.dictName === this.patientInfoData.illnessStr) {
                  this.patientInfoData.illness = item.dictCode;
                }
              })

            }
            let data = { ...this.patientInfoData, ...addInfo };
            if (this.state === "C") {
              this.$_http.post(this.$_API.INTERFACE_TMC_POST_PATIENT_INFO_ADD, data).then(res => {
                this.$notify({
                  title: "成功",
                  message: "添加患者信息成功",
                  type: "success"
                });
                this.back();
              }).finally(it => {
              });
            }
            if (this.state === "V") {
              this.$_http.post(this.$_API.INTERFACE_TMC_POST_PATIENT_INFO_SAVE, data).then(res => {
                this.$notify({
                  title: "成功",
                  message: "修改患者信息成功",
                  type: "success"
                });
                this.back();
              }).finally(it => {
              });
            }
          }).catch(() => {
            this.dialogVisible = false;
            this.$notify.info({
              title: "已取消",
              message: "已取消保存患者信息"
            });
          });
        }
      });

    }
  }
};
</script>

<style lang="scss" scoped>
#patientFormDiv {
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
      width: 300px;
      max-width: 300px;
    }
    .el-select {
      /*div的宽度调整有效*/
      width: 300px;
      max-width: none;
      .el-input {
        /*选择框的宽度调整《无效果。。。》*/
        width: 300px;
        max-width: none;
      }
    }
  }
  .inputUnit {
    position: absolute;
    right: 10px;
    top: 0;
    color: #868888;
  }
}
</style>
