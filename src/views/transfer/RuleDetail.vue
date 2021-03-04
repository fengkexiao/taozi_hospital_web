
<template>
  <div class="app-container base-page">
    <base-loading :loading="loading">
      <base-title name="分润条件"></base-title>
      <el-form v-model="ruleParams" label-width="120px" class="mt24 pl24">
        <el-form-item label="规则名称:">{{ruleParams.ruleName}}</el-form-item>
        <el-form-item label="医生类别:">
          {{ruleParams.doctorSourceName}}
          <div v-if="ruleParams.doctorSourceID === 2">{{ruleParams.doctorRangeName}}</div>
          <template v-if="ruleParams.doctorSourceID === 2 && ruleParams.doctorRange === 1">
            <el-button v-for="option in outDoctorGroup.selectedItem" :key="option.keyID"  disabled>{{option.groupName}}</el-button>
          </template>
        </el-form-item>
        <el-form-item label="患者类别:">{{ruleParams.trafficSourceName}}</el-form-item>
        <el-form-item label="科室:">{{ruleParams.sectionName ? ruleParams.sectionName : "不限"}}</el-form-item>
        <el-form-item label="就诊方式: ">{{ruleParams.treatWayName}}</el-form-item>
        <el-form-item label="优先级(1-100):">{{ruleParams.priority}}</el-form-item>
        <el-form-item label="规则说明:">{{ruleParams.memo}}</el-form-item>
        <el-form-item label="分润:">{{ruleParams.isProfit === 1 ? "是" : "否"}}</el-form-item>
      </el-form>
      <template v-if="ruleParams.isProfit === 1">
        <div>
          <base-title name="分润规则设置"></base-title>
          <el-form label-width="120px" class="mt24 pl24">
            <el-form-item v-for="(spuerItem,superIndex) of ruleParams.shareTransferFeeItemList" :key="spuerItem.otherID" :label="spuerItem.title">
              <div v-for="(subItem,subIndex) of spuerItem.shareTransferExpList" :key="subItem.otherID">
                <span v-if="subIndex===0">{{superIndex+1}}.{{spuerItem.standProjectName}}</span>
                <div class="box">
                  <div class="content">
                    <el-form label-width="130px">
                      <el-form-item label="金额范围:">{{subItem.minAmount}}&emsp;--&emsp;{{subItem.maxAmount}}</el-form-item>
                      <el-form-item label="医生首诊服务费:" style="margin-top: 24px" prop="profit">
                        <span v-if="subItem.profitType === 0">比例: {{subItem.profitValue}}%</span>
                        <span v-else>固定金额: {{subItem.profitValue}}元</span>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </template>

      <div style="display: flex;flex-direction: row;justify-content: center">
        <el-button @click="cancleAction">返回</el-button>
      </div>
    </base-loading>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "transfer-ruleDetail",
  inject: ["close"],
  filters: {},
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: {
    keyID: {
      type: String,
      default () {
        return "";
      }
    },
    // 是否是平台规则
    isPlatRule: {
      type: Boolean,
      default () {
        return false;
      }
    }
  },

  data () {
    return {
      currentIsPlatRule: false,
      loading: false,
      // 参数
      ruleParams: {
        doctorRangeName: "",
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
      }
    };
  },
  watch: {},
  created () {
    this.currentIsPlatRule = this.isPlatRule;
    this.fetchOutHospitalDoctorGroup();
    // 详情查看
    if (this.currentIsPlatRule) {
      // 平台规则
      this.fetchFlatRuleDatas();
    } else {
      // 自定义规则
      this.fetchNormalRuleDatas();
    }
  },
  activated () { },
  methods: {
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
        orgID: this.userInfo.orgID,
        title: "标准项目",
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
            profitValue: null
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
        profitValue: null
      };
    },
    /**
     * 根据keyID获取当前转诊规则数据(修改数据)
     */
    fetchNormalRuleDatas () {
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
            this.formatterRule();
            // 处理院外医生组数据
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
            // 金额换算
            this.ruleParams.shareTransferFeeItemList.forEach(element => {
              element.shareTransferExpList.forEach(subItem => {
                subItem.minAmount = parseInt(subItem.minAmount) / 100;
                subItem.maxAmount = parseInt(subItem.maxAmount) / 100;
              });
            });
          },
          () => {
            this.loading = false;
          }
        );
    },
    /**
     * 根据keyID获取当前转诊规则数据(详情数据)
     */
    fetchFlatRuleDatas () {
      this.loading = true;
      this.$_http
        .get(this.$_API.INTERFACE_TRANSFER_POST_SHARERULEGROUP_RULEDETAIL, {
          params: {
            keyID: this.keyID
          }
        })
        .then(
          response => {
            this.loading = false;
            if (!response.data) return;
            this.ruleParams = response.data;
            this.formatterRule();
            // 处理院外医生组数据
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
            // 金额换算
            this.ruleParams.shareTransferFeeItemList.forEach(element => {
              element.shareTransferExpList.forEach(subItem => {
                subItem.minAmount = parseInt(subItem.minAmount) / 100;
                subItem.maxAmount = parseInt(subItem.maxAmount) / 100;
              });
            });
          },
          () => {
            this.loading = false;
          }
        );
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

    formatterRule () {
      if (this.ruleParams.doctorRange === 0) {
        this.ruleParams.doctorRangeName = "不限";
      } else if (this.ruleParams.doctorRange === 1) {
        this.ruleParams.doctorRangeName = "指定院外医生组";
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
  margin-right: 16px;
  margin-bottom: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
