<template>
  <div v-if="isDelete === 0 && prodatas.isDelete === 0">
    <div v-if="subIndex===0" style="display: flex;flex-direction: row;align-items: center;">
      <!-- <span>{{superIndex+1}}.</span> -->
      <el-select style="margin-left: 10px" v-model="selectOption.standProjectName" placeholder="请选择" clearable @change="chargeItemsSelected">
        <el-option v-for="item in chargeItems" :key="item.standProjectCode" :label="item.standProjectName" :value="item.standProjectCode"></el-option>
        <!-- :disabled="item.isDisable === 1" -->
      </el-select>
      <img style="width:15px;height:15px;margin-left:10px;cursor: pointer;" :src="addIcon" @click="addSuperItem" />
      <img v-if="superIndex!=0" style="width:15px;height:15px;margin-left:10px;cursor: pointer;" :src="deleteIcon" @click="deleteSuperModule" />
    </div>

    <div class="box">
      <div class="content">
        <el-form :rules="formRules" :model="amount" ref="amount" label-width="130px">
          <el-form-item label="金额范围:">
            <el-col :span="5">
              <el-form-item prop="rangeMin">
                <base-input form-type="money" v-model="amount.minAmount" placeholder="最小值" @change="minAmountChange"></base-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <span style="margin-left:16px;width:20px;height:1px;margin-right:16px">---</span>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="rangeMax">
                <base-input form-type="money" v-model="amount.maxAmount" placeholder="最大值" @change="maxAmountChange"></base-input>
              </el-form-item>
            </el-col>&emsp;
          </el-form-item>
          <el-form-item label="医生首诊服务费:" style="margin-top: 24px" prop="profit">
            <el-radio v-model="amount.profit.type" :label="0" @change="profitChange('amount')">比例</el-radio>
            <base-input form-type="money" v-model="amount.profit.ratioValue" placeholder="输入比例" @change="profitChangeInput" style="width: 120px" :disabled="amount.profit.type===1"></base-input>&emsp;%&emsp;
            <el-radio v-model="amount.profit.type" :label="1" @change="profitChange('amount')">固定金额</el-radio>
            <base-input form-type="money" v-model="amount.profit.moneyValue" placeholder="输入金额" @change="profitChangeInput" style="width: 120px" :disabled="amount.profit.type===0"></base-input>&emsp;元
          </el-form-item>
        </el-form>
      </div>
      <img style="width:15px;height:15px;margin-left:10px;cursor: pointer;" :src="addIcon" @click="addSubItem" />
      <img v-if="subIndex!=0" style="width:15px;height:15px;margin-left:10px;cursor: pointer;" :src="deleteIcon" @click="deleteSubItem" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import addIcon from "@/assets/image/transfer/circle-add.png";
import deleteIcon from "@/assets/image/transfer/circle-delete.png";
export default {
  props: {
    // 初始化项目类型
    chargeItems: {
      type: Array,
      default () {
        return [];
      }
    },
    // 记录父类Index
    superIndex: {
      type: Number,
      default () {
        return 0;
      }
    },
    // 记录子类Index
    subIndex: {
      type: Number,
      default () {
        return 0;
      }
    },
    // 数据源初始化
    prodatas: {
      type: Object,
      default () {
        return {};
      }
    },
    // 记录项目类型选中项code
    selectOptionCode: {
      type: String,
      default () {
        return "";
      }
    },
    // 记录项目类型选中项Name
    selectOptionName: {
      type: String,
      default () {
        return "";
      }
    },
    // 用于已有规则修改 记录修改过程中的项目删除 父类子类项均有这一参数
    isDelete: {
      type: Number,
      default () {
        return 0;
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    var checkProfit = (rule, value, callback) => {
      if (value.type === 0) {
        if (!value.ratioValue) {
          callback(new Error("比例值不能为空"));
        } else {
          callback();
        }
      } else {
        if (!value.moneyValue) {
          callback(new Error("固定金额不能为空"));
        } else {
          callback();
        }
      }
    };

    var moneyRangeMin = (rule, value, callback) => {
      if (!this.amount.minAmount) {
        callback(new Error("下限值不能为空"));
      } else {
        callback();
      }
    };

    var moneyRangeMax = (rule, value, callback) => {
      if (!this.amount.maxAmount) {
        callback(new Error("上限值不能为空"));
      } else {
        callback();
      }
    };

    return {
      addIcon,
      deleteIcon,
      formRules: {
        rangeMax: [{ validator: moneyRangeMax, trigger: "blur" }],
        rangeMin: [{ validator: moneyRangeMin, trigger: "blur" }],
        profit: [{ validator: checkProfit, trigger: "blur" }]
      },
      oldSelectOptionCode: "",
      selectOption: {
        standProjectName: "",
        standProjectCode: ""
      },
      amount: {
        minAmount: "",
        maxAmount: "",
        profit: {
          type: 0,
          ratioValue: "",
          moneyValue: ""
        }
      }
    };
  },
  created () {
    this.initDatas();
  },
  activated () { },
  watch: {},
  methods: {
    initDatas () {
      this.amount.minAmount = this.prodatas.minAmount;
      this.amount.maxAmount = this.prodatas.maxAmount;
      this.amount.profit.type = this.prodatas.profitType;
      if (this.prodatas.profitType === 0) {
        this.amount.profit.ratioValue = this.prodatas.profitValue;
      } else {
        this.amount.profit.moneyValue = this.prodatas.profitValue;
      }
      this.selectOption = {
        standProjectName: this.selectOptionName,
        standProjectCode: this.selectOptionCode
      };
      this.oldSelectOption = {
        standProjectName: this.selectOptionName,
        standProjectCode: this.selectOptionCode
      };
    },
    // 类型选择
    chargeItemsSelected (val) {
      let newItem = this.chargeItems.find(
        section => section.standProjectCode === val
      );
      this.$emit("chargeItemsSelected", newItem, this.superIndex);
      // this.chargeItems.forEach(element => {
      //   if (element.standProjectCode === superItem.standProjectCode) {
      //     element.isDisable = 0;
      //   }
      // });
    },
    // 添加父类
    addSuperItem () {
      this.$emit("addSuperItem");
    },
    // 移除父类
    deleteSuperModule () {
      this.$emit("deleteSuperModule");
    },
    // 添加子类
    addSubItem () {
      this.$emit("addSubItem");
    },
    // 移除子类
    deleteSubItem () {
      this.$emit("deleteSubItem");
    },
    // 最小金额
    minAmountChange (val) {
      this.amount.minAmount = val;
      this.$emit(
        "minAmountChange",
        this.amount.minAmount,
        this.superIndex,
        this.subIndex
      );
    },
    // 最大金额
    maxAmountChange (val) {
      this.amount.maxAmount = val;
      this.$emit(
        "maxAmountChange",
        this.amount.maxAmount,
        this.superIndex,
        this.subIndex
      );
    },
    // 医生首诊服务费
    profitChange (amount) {
      this.$refs[amount].validate(valid => {
        if (valid) {
          console.log("this.amount.profit-----", this.amount.profit);
          this.$emit(
            "profitChange",
            this.amount.profit,
            this.superIndex,
            this.subIndex
          );
        } else {
          return false;
        }
      });
    },

    profitChangeInput () {
      this.$emit(
        "profitChange",
        this.amount.profit,
        this.superIndex,
        this.subIndex
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.content {
  padding-top: 24px;
  padding-bottom: 24px;
  padding-right: 24px;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

// .add-img {
// display: flex;
//       background-image: url('../../../../assets/image/transfer/circle-add.png');
//     }
</style>
