<template>
  <el-dialog :visible.sync="visible"  title="处方详情" :before-close="handleClose" width="70%">
    <div class="line"></div>
    <div style="    display: flex;">
      <div>
        <tmc-rp-template :inquiryId="inquiryID" :dialogVisible="visible" state="1" :itemData="itemData"></tmc-rp-template>
      </div>
      <div class="record-container" v-loading="loading">
        <div class="record-title">问诊记录</div>
        <el-row v-for="(item, index) in msgList" :key="index" style="padding-left:17px;">
          <rp-message-row :message="item" :index="index" :isRecord="true" :recordList="msgList" :patientFaceImage="patientFaceImage" :assistantStaffID="assistantStaffID" :doctorStaffID="doctorStaffID" :doctroFaceImage="doctroFaceImage" :patientName="patientName"></rp-message-row>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import rpMessageRow from "./../tmcinquiry/conversation/rpMessageRow";
import tmcRpTemplate from "./../components/rp/tmcRpTemplate";
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
    itemData: {
      type: Object
    },
    // 弹窗标题
    title: {
      type: String,
      required: true
    },
    inquiryID: {
      type: String
    },
    patientID: {
      type: String
    },
    patientName: {
      type: String,
      default: ""
    },
    assistantStaffID: {
      type: String,
      default: ""
    },
    doctorStaffID: {
      type: String,
      default: ""
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.msgList = [];
        this.getHistoryRecord();
      }
    }
  },
  components: {
    rpMessageRow,
    tmcRpTemplate
  },
  data () {
    return {
      msgList: [],
      loading: false,
      patientFaceImage: "",
      doctroFaceImage: []
    };
  },
  computed: {
    ...mapGetters(["tmc", "tim", "userInfo"])
  },
  created () {
  },
  methods: {
    handleClose () {
      this.$emit("update:visible", false);
    },
    async getHistoryRecord () {
      this.loading = true;
      try {
        let params = {
          pageIndex: 1,
          inquiryIDs: this.inquiryID
        };
        const res = await this.$_http.get(this.$_API.INTERFACE_POST_TMC_FIND_HISTORYMSG, { params });

        let list = [];
        let data = res.data[this.inquiryID];

        const patientInfo = await this.$_http.get(this.$_API.INTERFACE_POST_GETPERSONINFOBYPATIENTID, { params: { orgID: this.userInfo.orgID, patientID: this.patientID } });
        if (patientInfo.data) {
          this.patientFaceImage = patientInfo.data.faceImage;
        }
        let accountList = [this.doctorStaffID, this.assistantStaffID];
        if (data) {
          for (let i = 0; i < data.length; i++) {
            let element = data[i];
            if (element && element.from !== "administrator") {
              accountList.push(element.from);
            }
            if (element) {
              list.push(element);
            }
          }
        }
        const doctorInfo = await this.$_http.post(this.$_API.INTERFACE_GET_GETDOCTORINFOBYSTAFFIDS, { orgID: this.userInfo.orgID, staffIDs: this.distinct(accountList) });
        if (doctorInfo.data) {
          this.doctroFaceImage = doctorInfo.data || [];
        }
        this.msgList = list;
        console.log(this.msgList)
        this.loading = false;
      } catch (error) {
        this.msgList = [];
        this.loading = false;
      }
    },
    distinct (arr) {
      let obj = {};
      let newArr = [];
      for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i]]) {
          obj[arr[i]] = 1;
          newArr.push(arr[i]);
        }
      }
      return newArr;
    }
  }
};
</script>

<style lang="scss" scoped>
#detailBody {
  .footer {
    padding-left: 300px;
  }
}
.record-container {
  height: 623px;
  width: 100%;
  overflow: auto;
  border-left: 1px solid #e8e8e8;
}
.record-title {
  height: 44px;
  line-height: 44px;
  border-bottom: 1px solid #e8e8e8;
  width: 100%;
  padding-left: 17px;
}
.line {
  width: 100%;
  border-bottom: 1px solid #e8e8e8;
}
</style>
