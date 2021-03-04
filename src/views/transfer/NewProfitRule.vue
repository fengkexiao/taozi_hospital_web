<template>
  <div class="app-container base-page">
    <base-loading :loading="loading">
      <div>
        <base-title name="分润条件"></base-title>
        <div class="mt24 pl24">
          <el-form v-model="ruleParams" label-width="120px" :model="ruleParams" :rules="rules" ref="ruleParams">
            <el-form-item prop="ruleName" label="规则名称:">
              <el-input v-model="ruleParams.ruleName" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="医生类别:">
              <el-radio-group v-model="ruleParams.doctorSourceID" @change="doctorSourceChange">
                <el-radio :label="0">不限</el-radio>
                <el-radio :label="1">本院医生</el-radio>
                <el-radio :label="2">院外医生</el-radio>
              </el-radio-group>
              <div>
                <el-radio-group v-if="ruleParams.doctorSourceID === 2" v-model="ruleParams.doctorRange" @change="outGroupChange">
                  <el-radio :label="0">全部</el-radio>
                  <el-radio :label="1">指定院外医生组</el-radio>
                </el-radio-group>
              </div>
              <div v-if="ruleParams.doctorSourceID === 2 && ruleParams.doctorRange === 1">
                <template v-if="outDoctorGroup.items.length > 0">
                  <el-checkbox-group @change="outDoctorGroupChange" v-model="outDoctorGroup.selectedItem">
                    <el-checkbox-button class="check-doctorGroup-Btn" v-for="option in outDoctorGroup.items" :label="option" :key="option.keyID">{{option.groupName}}</el-checkbox-button>
                  </el-checkbox-group>
                </template>
                <span v-else style="color: red">当前类别为指定院外医生组,请先添加院外医生组</span>
              </div>
            </el-form-item>
            <el-form-item label="患者类别:">
              <el-radio-group v-model="ruleParams.trafficSourceID" @change="trafficSourceChange">
                <el-radio :label="0">不限</el-radio>
                <el-radio :label="1">本院患者</el-radio>
                <el-radio :label="2">院外患者</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="科室:">
              <el-select v-model="ruleParams.sectionID" placeholder="请选择" @change="sectionChange" clearable filterable>
                <el-option v-for="item in sectionOptions" :key="item.keyID" :label="item.hospitalSectionName" :value="item.keyID"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="就诊方式: ">
              <el-radio-group v-model="ruleParams.treatWayID" @change="treatWayChange">
                <el-radio :label="0">不限</el-radio>
                <el-radio :label="1">门诊</el-radio>
                <el-radio :label="2">住院</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="priority" label="优先级(1-100):">
              <el-input form-type="number" v-model="ruleParams.priority" placeholder="请输入" clearable></el-input>&emsp;
              <span style="color: red">数字越大优先级越高</span>
            </el-form-item>
            <el-form-item prop="memo" label="规则说明:">
              <el-input type="textarea" :rows="3" v-model="ruleParams.memo" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="分润:">
              <el-radio-group v-model="ruleParams.isProfit">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <template v-if="ruleParams.isProfit === 1">
            <base-title name="分润规则设置"></base-title>
            <el-form label-width="120px" class="mt24 ">
              <el-form-item v-for="(spuerItem,superIndex) of ruleParams.shareTransferFeeItemList" :key="spuerItem.otherID" :label="spuerItem.title" :ref="'child' +  spuerItem.otherID ">
                <profit-project-item v-for="(subItem,subIndex) of spuerItem.shareTransferExpList" :key="subItem.otherID" :chargeItems="chargeItems" :superIndex="superIndex" :subIndex="subIndex" :prodatas="subItem" :selectOptionCode="spuerItem.standProjectCode" :selectOptionName="spuerItem.standProjectName" :isDelete="spuerItem.isDelete" @addSuperItem="addSuperItem" @deleteSuperModule="deleteSuperModule(superIndex)" @addSubItem="addSubItem(superIndex)" @deleteSubItem="deleteSubItem(superIndex,subIndex)" @chargeItemsSelected="chargeItemsSelected" @minAmountChange="minAmountChange" @maxAmountChange="maxAmountChange" @profitChange="profitChange"></profit-project-item>
              </el-form-item>
            </el-form>
          </template>
          <div style="">
            <el-button @click="cancleAction">取消</el-button>
            <el-button type="primary" @click="saveAction('ruleParams')">保存</el-button>
          </div>
        </div>
      </div>
    </base-loading>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ProfitProjectItem from "./components/ProfitProjectItem";
export default {
  name: "transfer-newProfitRule",
  inject: ["close"],
  filters: {},
  computed: {
    ...mapGetters(["userInfo"])
  },
  components: { ProfitProjectItem },
  props: {
    keyID: {
      type: String,
      default () {
        return "";
      }
    },
    // 是否是修改界面
    isUpdate: {
      type: Boolean,
      default () {
        return false;
      }
    }
  },

  data () {
    var checkRuleName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请填写规则名称"));
      } else if (value.length > 49) {
        callback(new Error("字数过长,限制50以内"));
      } else {
        callback();
      }
    };
    var checkPriority = (rule, value, callback) => {
      if (!value) {
        callback(new Error("优先级不能为空"));
      } else if (!/^([1-9][0-9]{0,1}|100)$/.test(value)) {
        callback(new Error("请输入1-100正整数"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      rules: {
        ruleName: [
          { required: true, message: "请填写规则名称", trigger: "blur" },
          {
            validator: checkRuleName,
            trigger: "blur"
          }
        ],
        priority: [
          { required: true, message: "此值不可以为空", trigger: "blur" },
          {
            validator: checkPriority,
            trigger: "blur"
          }
        ],
        memo: [{ required: true, message: "请填写规则说明", trigger: "blur" }]
      },
      // 入参数
      ruleParams: {
        orgID: "",
        ruleName: "",
        trafficSourceID: 0,
        trafficSourceName: "不限",
        doctorSourceID: 0,
        doctorSourceName: "不限",
        doctorRange: 0,
        sectionID: "",
        sectionName: "",
        treatWayID: 0,
        treatWayName: "不限",
        priority: "",
        memo: "",
        isProfit: 0,
        // 院外医生组
        shareTransferRuleDoctorList: [],
        // 新增项目组
        shareTransferFeeItemList: []
      },
      // 院外医生对象
      outDoctorGroup: {
        selectedItem: [],
        items: []
      },
      // 科室组
      sectionOptions: [{ hospitalSectionName: "不限", keyID: "" }],
      // 收费项目组
      chargeItems: []
    };
  },
  watch: {},
  created () {
    this.fetchOutHospitalDoctorGroup();
    if (this.isUpdate) {
      // 修改规则
      this.fetchUpdateDatas();
    } else {
      this.fetchChargeItems();
      this.fetchSectionList();
      // 新增规则
      this.ruleParams.orgID = this.userInfo.orgID;
      this.ruleParams.shareTransferFeeItemList.push(this.createSuperItem());
    }
  },
  activated () { },
  methods: {
    /**
     * 患者类别选择操作
     */
    trafficSourceChange (val) {
      this.ruleParams.trafficSourceID = val;
      if (val === 0) {
        this.ruleParams.trafficSourceName = "不限";
      } else if (val === 1) {
        this.ruleParams.trafficSourceName = "本院患者";
      } else if (val === 2) {
        this.ruleParams.trafficSourceName = "院外患者";
      }
    },
    /**
     * 院外医生组选择操作
     */
    outDoctorGroupChange (val) {
      this.outDoctorGroup.selectedItem = val;
    },
    /**
     * 科室选择操作
     */
    sectionChange (val) {
      this.ruleParams.sectionID = val;
      let item = this.sectionOptions.find(section => section.keyID === val);
      this.ruleParams.sectionName = item.hospitalSectionName;
    },
    /**
     * 就诊方式选择
     */
    treatWayChange (val) {
      this.ruleParams.treatWayID = val;
      if (val === 0) {
        this.ruleParams.treatWayName = "不限";
      } else if (val === 1) {
        this.ruleParams.treatWayName = "门诊";
      } else if (val === 2) {
        this.ruleParams.treatWayName = "住院";
      }
    },
    /**
     * 新增项目分类操作
     */
    chargeItemsSelected (item, superIndex) {
      let superItem = this.ruleParams.shareTransferFeeItemList[superIndex];
      // this.chargeItems.forEach(element => {
      //   if (element.standProjectCode === superItem.standProjectCode) {
      //     element.isDisable = 0;
      //   }
      // });
      superItem.standProjectCode = item.standProjectCode;
      superItem.standProjectName = item.standProjectName;
      superItem.shareTransferExpList.forEach(element => {
        element.standProjectCode = item.standProjectCode;
      });
      // item.isDisable = 1;
      this.$forceUpdate();
    },
    /**
     * 新增项目
     */
    addSuperItem () {
      this.ruleParams.shareTransferFeeItemList.push(this.createSuperItem());
    },
    /**
     * 移除项目
     */
    deleteSuperModule (superIndex) {
      // this.chargeItems.forEach(element => {
      //   if (element.standProjectCode === this.ruleParams.shareTransferFeeItemList[superIndex].standProjectCode) {
      //     element.isDisable = 0;
      //   }
      // });
      if (this.isUpdate) {
        let superItem = this.ruleParams.shareTransferFeeItemList[superIndex];
        if (superItem.keyID) {
          superItem.isDelete = 1;
          superItem.title = "";
        } else {
          this.ruleParams.shareTransferFeeItemList.splice(superIndex, 1);
        }
      } else {
        this.ruleParams.shareTransferFeeItemList.splice(superIndex, 1);
      }
      // this.$forceUpdate();
    },
    /**
     * 新增子项目
     */
    addSubItem (superIndex) {
      let superItem = this.ruleParams.shareTransferFeeItemList[superIndex];
      superItem.shareTransferExpList.push(
        this.createSubItem(superItem.standProjectCode)
      );
    },
    /**
     * 移除子项目
     */
    deleteSubItem (superIndex, subIndex) {
      let superItem = this.ruleParams.shareTransferFeeItemList[superIndex];
      if (this.isUpdate) {
        let subItem = superItem.shareTransferExpList[subIndex];
        if (subItem.keyID) {
          subItem.isDelete = 1;
        } else {
          superItem.shareTransferExpList.splice(subIndex, 1);
        }
      } else {
        superItem.shareTransferExpList.splice(subIndex, 1);
      }
    },
    /**
     * 子项目 金额范围 最小金额
     */
    minAmountChange (val, superIndex, subIndex) {
      let superItem = this.ruleParams.shareTransferFeeItemList[superIndex];
      let subItem = superItem.shareTransferExpList[subIndex];
      subItem.minAmount = val;
    },
    /**
     * 子项目 金额范围 最大金额
     */
    maxAmountChange (val, superIndex, subIndex) {
      let superItem = this.ruleParams.shareTransferFeeItemList[superIndex];
      let subItem = superItem.shareTransferExpList[subIndex];
      subItem.maxAmount = val;
    },
    /**
     * 医生首诊服务费
     */
    profitChange (profit, superIndex, subIndex) {
      let superItem = this.ruleParams.shareTransferFeeItemList[superIndex];
      let subItem = superItem.shareTransferExpList[subIndex];
      subItem.profitType = profit.type;
      subItem.profitValue =
        profit.type === 0 ? profit.ratioValue : profit.moneyValue;
    },
    /**
     * 取消 返回上一级
     */
    cancleAction () {
      this.close().then(() => {
        this.$router.push({
          name: "transfer-transferProfitRule",
          params: {}
        });
      });
    },
    /**
     * 保存数据 更新数据
     */
    saveAction (ruleParams) {
      // 循环遍历规则项目列表 未被删除的项目进行值的判断 自定义校验
      if (this.ruleParams.isProfit === 1) {
        let tempSuperItemsList = this.ruleParams.shareTransferFeeItemList.filter(
          item => item.isDelete !== 1
        );
        console.log("tempSuperItemsList------", tempSuperItemsList);

        if (this.isRepeatValidate(tempSuperItemsList) === true) {
          // 1.校验是否有重复规则项
          return true;
        } else {
          for (
            let suprIndex = 0;
            suprIndex < tempSuperItemsList.length;
            suprIndex++
          ) {
            const superItem = tempSuperItemsList[suprIndex];
            // 2.规则名称校验
            if (
              superItem.standProjectCode === undefined ||
              superItem.standProjectCode.length === 0
            ) {
              this.$message.error("未选择标准项目名");
              return true;
            } else {
              let tempSubItemsList = superItem.shareTransferExpList.filter(
                item => item.isDelete !== 1
              );
              // 3.校验公式
              for (
                let subIndex = 0;
                subIndex < tempSubItemsList.length;
                subIndex++
              ) {
                const subItem = tempSubItemsList[subIndex];
                const subNextItem = tempSubItemsList[subIndex + 1];
                // 3.1 校验公式是否填写完善
                if (subItem) {
                  if (
                    subItem.minAmount.length === 0 ||
                    subItem.maxAmount.length === 0 ||
                    subItem.profitValue.length === 0
                  ) {
                    this.$message.error(
                      superItem.standProjectName + " :新增规则尚未完善"
                    );
                    return true;
                  }
                  // 3.2 校验公式填写范围的上限下限
                  if (
                    parseFloat(subItem.minAmount) >
                    parseFloat(subItem.maxAmount)
                  ) {
                    this.$message.error(
                      superItem.standProjectName +
                      " :金额范围上限应大于等于下限"
                    );
                    return true;
                  }
                }

                if (subNextItem) {
                  if (
                    subNextItem.minAmount.length === 0 ||
                    subNextItem.maxAmount.length === 0 ||
                    subNextItem.profitValue.length === 0
                  ) {
                    this.$message.error(
                      superItem.standProjectName + " :新增规则尚未完善"
                    );
                    return true;
                  }

                  if (
                    parseFloat(subNextItem.minAmount) >
                    parseFloat(subNextItem.maxAmount)
                  ) {
                    this.$message.error(
                      superItem.standProjectName +
                      " :金额范围上限应大于等于下限"
                    );
                    return true;
                  }

                  // 3.4 校验公式的金额范围是否有重叠交叉
                  if (
                    parseFloat(subNextItem.minAmount) <
                    parseFloat(subItem.maxAmount)
                  ) {
                    this.$message.error(
                      superItem.standProjectName + " :金额范围重叠"
                    );
                    return true;
                  }
                  // 3.5 校验公式的金额范围之间是否连续
                  if (
                    parseFloat(subItem.maxAmount) !==
                    parseFloat(subNextItem.minAmount)
                  ) {
                    this.$message.error(
                      superItem.standProjectName + " :金额范围不连续"
                    );
                    return true;
                  }
                }
              }
            }
          }
        }
        this.ruleParams.shareTransferFeeItemList.forEach(superItem => {
          superItem.shareTransferExpList.forEach(element => {
            element.minAmount = parseInt(element.minAmount) * 100;
            element.maxAmount = parseInt(element.maxAmount) * 100;
          });
        });
      }

      // 表单校验
      this.$refs[ruleParams].validate(valid => {
        if (valid) {
          console.log("验证成功");
          this.handleValidResult();
        } else {
          console.log("验证失败");
          return false;
        }
      });
    },
    /**
     * 判断是否有重复
     */
    isRepeatValidate (arr) {
      var hash = {};
      for (var i in arr) {
        if (hash[arr[i].standProjectCode]) {
          this.$message.error(arr[i].standProjectName + ":项目重复");
          return true;
        }
        // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
        hash[arr[i].standProjectCode] = true;
      }
      return false;
    },
    /**
     * 数据验证处理
     */
    handleValidResult () {
      if (
        this.ruleParams.doctorSourceID === 2 &&
        this.ruleParams.doctorRange === 1
      ) {
        let tempArray = [];
        for (
          let index = 0;
          index < this.outDoctorGroup.selectedItem.length;
          index++
        ) {
          const element = this.outDoctorGroup.selectedItem[index];
          let tempDic = {};
          tempDic.orgID = element.orgID;
          tempDic.groupID = element.keyID;
          tempArray.push(tempDic);
        }
        this.ruleParams.shareTransferRuleDoctorList = tempArray;
      } else {
        this.ruleParams.shareTransferRuleDoctorList = [];
      }
      // 当选择指定院外医生组的情况下 未添加医生组保存失败
      if (
        this.ruleParams.shareTransferRuleDoctorList.length === 0 &&
        this.ruleParams.doctorSourceID === 2 &&
        this.ruleParams.doctorRange === 1
      ) {
        this.$message.error("未添加医生组,保存失败");
        return;
      }
      if (this.isUpdate) {
        // 修改
        console.log("修改this.ruleParams----------", this.ruleParams);
        this.updateRulesRequest();
      } else {
        console.log("新增this.ruleParams----------", this.ruleParams);
        // 新增
        this.addRulesRequest();
      }
    },
    /**
     * guid生成 主要用于新增项目的keyID 循环布局时用到
     */
    guid () {
      function S4 () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return (
        S4() +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        S4() +
        S4()
      );
    },
    /**
     * 构建父类模块
     */
    createSuperItem () {
      return {
        keyID: "",
        title: "标准项目",
        orgID: this.userInfo.orgID,
        standProjectCode: "",
        standProjectName: "",
        otherID: this.guid(),
        isDelete: 0,
        shareTransferExpList: [
          {
            keyID: "",
            otherID: this.guid(),
            orgID: this.userInfo.orgID,
            standProjectCode: "",
            minAmount: "",
            maxAmount: "",
            profitType: 0,
            isDelete: 0,
            profitValue: ""
          }
        ]
      };
    },
    /**
     * 构建子类模块
     */
    createSubItem (standProjectCode) {
      return {
        keyID: "",
        otherID: this.guid(),
        orgID: this.userInfo.orgID,
        standProjectCode: standProjectCode,
        minAmount: "",
        maxAmount: "",
        profitType: 0,
        isDelete: 0,
        profitValue: ""
      };
    },
    /**
     * 医生类别选择
     */
    doctorSourceChange (val) {
      this.ruleParams.doctorSourceID = val;
      if (val === 0) {
        this.ruleParams.doctorSourceName = "不限";
      } else if (val === 1) {
        this.ruleParams.doctorSourceName = "本院医生";
      } else if (val === 2) {
        this.ruleParams.doctorSourceName = "院外医生";
      }
    },
    /**
     * 获取医院收费项目列表获取
     */
    fetchChargeItems () {
      this.$_http
        .get(this.$_API.INTERFACE_TRANSFER_GET_FEEITEMMANAGE_LIST, {
          params: {
            orgID: this.userInfo.orgID
          }
        })
        .then(response => {
          if (!response.data) return;
          this.chargeItems = response.data;
          // this.ruleParams.shareTransferFeeItemList.forEach(element => {
          //   let item = this.chargeItems.find(e => {
          //     return e.standProjectCode === element.standProjectCode;
          //   });
          //   item.isDisable = 1;
          // });
          // this.$forceUpdate();
        });
    },
    /**
     * 根据keyID获取当前转诊规则数据(修改数据)
     */
    fetchUpdateDatas () {
      this.loading = true;
      this.$_http
        .get(this.$_API.INTERFACE_TRANSFER_POST_SHARERULEGROUP_DETAIL, {
          params: {
            keyID: this.keyID
          }
        })
        .then(
          response => {
            this.loading = false;
            if (!response.data) return;
            this.ruleParams = response.data;

            this.ruleParams.shareTransferFeeItemList.forEach(element => {
              element.title = "标准项目";
              element.shareTransferExpList.forEach(subItem => {
                subItem.minAmount = parseInt(subItem.minAmount) / 100;
                subItem.maxAmount = parseInt(subItem.maxAmount) / 100;
              });
            });
            // 处理院外医生组数据
            this.fetchSectionList();
            // 避免在修改过程中 更改分润模式
            if (this.ruleParams.shareTransferFeeItemList.length === 0) {
              this.ruleParams.shareTransferFeeItemList.push(
                this.createSuperItem()
              );
            }

            this.fetchChargeItems();

            console.log(
              "根据keyID获取当前转诊规则数据(修改数据)-----",
              response.data
            );
          },
          () => {
            this.loading = false;
          }
        );
    },
    /**
     * 获取科室列表
     */
    fetchSectionList () {
      this.$_http
        .get(this.$_API.INTERFACE_GET_SECTION_LIST, {
          params: {
            orgId: this.userInfo.orgID,
            disableStatus: 0
          }
        })
        .then(response => {
          if (!response.data) return;
          this.sectionOptions = this.sectionOptions.concat(response.data);
          if (
            this.ruleParams.doctorRange === 1 &&
            this.ruleParams.shareTransferRuleDoctorList.length > 0 &&
            this.outDoctorGroup.items.length > 0
          ) {
            this.ruleParams.shareTransferRuleDoctorList.forEach(element => {
              let item = this.outDoctorGroup.items.find(
                it => it.keyID === element.groupID
              );
              this.outDoctorGroup.selectedItem.push(item);
            });
          }
        });
    },
    /**
     * 获取院外医生组列表
     */
    fetchOutHospitalDoctorGroup () {
      let params = {
        orgID: this.userInfo.orgID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TRANSFER_GET_OUTSIDEDOC_ALLLIST, { params })
        .then(res => {
          if (res.data) {
            this.outDoctorGroup.items = res.data;
          }
        });
    },
    /**
     * 保存数据请求
     */
    addRulesRequest () {
      this.loading = true;
      this.$_http
        .post(
          this.$_API.INTERFACE_TRANSFER_POST_SHARERULEGROUP_ADD,
          this.ruleParams
        )
        .then(
          response => {
            this.loading = false;
            this.close().then(() => {
              this.$router.push({
                name: "transfer-transferProfitRule",
                params: { isReload: true }
              });
            });
          },
          () => {
            this.loading = false;
          }
        );
    },
    /**
     * 保存数据请求
     */
    updateRulesRequest () {
      this.loading = true;
      this.$_http
        .post(
          this.$_API.INTERFACE_TRANSFER_POST_SHARERULEGROUP_MODIFY,
          this.ruleParams
        )
        .then(
          response => {
            this.loading = false;
            this.close().then(() => {
              this.$router.push({
                name: "transfer-transferProfitRule"
              });
            });
          },
          () => {
            this.loading = false;
          }
        );
    },
    outGroupChange (val) {
      if (val === 1 && this.outDoctorGroup.items.length === 0) {
        // 指定院外医生组
        this.$message.error("未添加医生组");
      }
    }
  }
};
</script>

<style scoped>
/* .left {
  float: left;
} */
.right {
  float: right;
  margin-right: 20px;
  margin-top: 10px;
}
.color-blue {
  color: #438bef;
  font-weight: 800;
}

.box {
  margin-top: 20px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.check-doctorGroup-Btn {
  margin-bottom: 8px;
  margin-right: 10px;
  border-left: 1px solid #d4d7df;
  border-radius: 4px;
}
</style>
