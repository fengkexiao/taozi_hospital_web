<template>
  <div>
    <div id="patientIndexNav">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item v-for="item in menuData" :key="item.index" :index="item.index">{{item.title}}</el-menu-item>
      </el-menu>
      <div v-if="tmc.patientID">
        <patientInfoModify v-if="activeIndex === '1'" />
        <patientSymptomsDescribed v-else-if="activeIndex === '2'" />
        <patientRpAdvise v-else-if="activeIndex === '3'" />
        <patientOrderPrice v-else-if="activeIndex === '4'" />
        <patientRegularReturnVisit v-else-if="activeIndex === '5'" />
        <patientCommunication v-else-if="activeIndex === '6'" />
        <patientOrder v-else-if="activeIndex === '7'" />
      </div>
    </div>
    <div v-show="false">{{isShowFun}}</div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import patientInfoModify from ".././docAssistant/PatientInfoAddEditDetail";
import patientSymptomsDescribed from ".././docAssistant/PatientSymptomsDescribed";
import patientRpAdvise from ".././docAssistant/PatientRpAdvise";
import patientOrderPrice from ".././docAssistant/PatientOrderPrice";
import patientRegularReturnVisit from "./PatientRegularReturnVisitCreate";
import patientCommunication from ".././docAssistant/PatientCommunication";
import patientOrder from ".././docAssistant/PatientOrder";
export default {
  name: "TMCInquiry-patientIndex",
  components: {
    patientInfoModify,
    patientSymptomsDescribed,
    patientRpAdvise,
    patientOrderPrice,
    patientRegularReturnVisit,
    patientCommunication,
    patientOrder
  },
  watch: {
    "tmc.activeIndex": {
      handler (val) {
        this.activeIndex = this.tmc.activeIndex ? this.tmc.activeIndex : "1";
      },
      // 深度监听
      immediate: true
      // deep: true
    }
  },
  data () {
    return {
      menuData: [],
      menuDataOne: [
        { index: "1", title: "患者信息", urlName: "TMCInquiry-patientInfo" },
        {
          index: "2",
          title: "症状描述",
          urlName: "TMCInquiry-symptomsDescribed"
        },
        { index: "3", title: "处方建议", urlName: "TMCInquiry-rpAdvise" },
        // { index: "4", title: "修改价格", urlName: "TMCInquiry-orderPrice" },
        {
          index: "5",
          title: "创建任务",
          urlName: "TMCInquiry-regularReturnVisitCreate"
        },
        { index: "6", title: "沟通记录", urlName: "TMCInquiry-communication" },
        { index: "7", title: "历史订单", urlName: "TMCInquiry-order" }
      ],
      menuDataTwo: [
        { index: "1", title: "患者信息", urlName: "TMCInquiry-patientInfo" },
        {
          index: "2",
          title: "症状描述",
          urlName: "TMCInquiry-symptomsDescribed"
        },
        { index: "3", title: "处方建议", urlName: "TMCInquiry-rpAdvise" },
        { index: "4", title: "修改价格", urlName: "TMCInquiry-orderPrice" },
        {
          index: "5",
          title: "创建任务",
          urlName: "TMCInquiry-regularReturnVisitCreate"
        },
        { index: "6", title: "沟通记录", urlName: "TMCInquiry-communication" },
        { index: "7", title: "历史订单", urlName: "TMCInquiry-order" }
      ],
      activeIndex: "1",
      rpIDIsHave: false
    };
  },
  computed: {
    ...mapGetters(["userInfo", "tmc"]),
    isShowFun () {
      // 助理提交了处方建议，医生在治疗方案中查看并修改
      // 处方没有生成之前，不显示修改价格。
      // ①助理医生初始看到的菜单
      // ②助理填写了处方建议
      // ③医生提交了治疗方案
      let that = this;
      if (that.tmc.inquiryID) {
        that.menuData = this.menuDataTwo;
      } else {
        that.menuData = this.menuDataOne;
      }
      // jobType 0:医生 1:助理
      if (that.userInfo.jobType === 0) {
        that.menuData[2].title = "治疗方案";
      } else if (that.userInfo.jobType === 1) {
        if (that.rpIDIsHave) {
          that.menuData[2].title = "治疗方案";
        } else {
          that.menuData[2].title = "处方建议";
        }
      }
      return "初始化";
    }
  },
  methods: {
    ...mapActions({
      changeActiveIndex: "tmc/changeActiveIndex"
    }),
    handleSelect (key, keyPath) {
      this.activeIndex = keyPath[0];
      this.changeActiveIndex(this.activeIndex);
    }
  }
};
</script>

<style lang="scss" scoped>
#patientIndexNav {
  width: 100%;
  background:#ffffff;
  ul {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    li {
      list-style-type: none;
    }
    .el-menu--horizontal > .el-menu-item {
      height: 40px;
      line-height: 40px;
    }
    .el-menu-item {
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
    }
  }
  .lineBox {
    padding-left: 20px;
    padding-right: 20px;
    .lineDiv {
      width: 100%;
      height: 1px;
      background-color: #e8e8e8;
    }
  }
}
</style>
