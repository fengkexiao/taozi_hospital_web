<template>
  <div>
    <div id="patientIndexNav">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item v-for="item in menuData" :key="item.index" :index="item.index">{{item.title}}</el-menu-item>
      </el-menu>
      <div>
        <Information :keyID="keyID" :orgID="orgID" v-show="activeIndex === '1'" />
        <MedicalRecord :keyID="keyID" :orgID="orgID" v-show="activeIndex === '2'" />
        <Communication :keyID="keyID" :orgID="orgID" v-show="activeIndex === '3'" />
        <SubsequentVisit :keyID="keyID" :orgID="orgID" v-show="activeIndex === '4'" />
        <HistoryOrders :keyID="keyID" :orgID="orgID" :personID="personID" v-show="activeIndex === '5'" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Information from "./Information";
import MedicalRecord from "./MedicalRecord";
import Communication from "./Communication";
import SubsequentVisit from "./SubsequentVisit";
import HistoryOrders from "./HistoryOrders";
export default {
  name: "TMCInquiry-HelthyIndex",
  components: {
    Information,
    MedicalRecord,
    Communication,
    SubsequentVisit,
    HistoryOrders
  },
  data () {
    return {
      keyID: '',
      personID: '',
      orgID: '',
      menuData: [
        { index: "1", title: "患者信息", urlName: "TMCInquiry-Information" },
        { index: "2", title: "历史病历", urlName: "TMCInquiry-MedicalRecord" },
        { index: "3", title: "沟通记录", urlName: "TMCInquiry-Communication" },
        { index: "4", title: "复诊任务", urlName: "TMCInquiry-SubsequentVisit" },
        { index: "5", title: "历史订单", urlName: "TMCInquiry-HistoryOrders" }
      ],
      activeIndex: "1",
      rpIDIsHave: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    console.log(this.$route.query)
    let query = this.$route.query
    this.keyID = query.keyID
    this.orgID = query.orgID
    this.personID = query.personID
    // this.getPatientDoc();
  },
  methods: {
    handleSelect (key, keyPath) {
      this.activeIndex = keyPath[0];
    }
  }
};
</script>

<style lang="scss" scoped>
#patientIndexNav {
  width: 100%;
  background: #ffffff;
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
      margin: 0 30px;
    }
  }
  .lineBox {
    margin-left: 20px;
    margin-right: 20px;
    .lineDiv {
      width: 100%;
      height: 1px;
      background-color: #e8e8e8;
    }
  }
}
</style>
