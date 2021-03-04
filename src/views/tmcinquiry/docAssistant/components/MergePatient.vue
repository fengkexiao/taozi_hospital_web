<template>
  <el-dialog title="患者信息" :visible.sync="visible" width="80%" :before-close="handleClose">
    <el-row>
      <el-col :span="11">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>微信</span>
          </div>
          <div>
            <patient-info :isEdit="true" ref="patientInfo" :patientID="currentPatientInfo.keyID" :personID="currentPatientInfo.personID" :patientInfo="currentPatientInfo" :choosePatientInfo="choosePatientInfo" @close="handleCloseDialog"></patient-info>
          </div>
        </el-card>
      </el-col>
      <el-col :span="1">
        <div style="width: 10px;height: 10px;"></div>
      </el-col>
      <el-col :span="11">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>H5</span>
          </div>
          <div>
            <patient-info-read :patientID="choosePatientInfo.keyID" :patientInfo="choosePatientInfo" @close="handleCloseDialog"></patient-info-read>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConf">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
const PatientInfo = () => import("./PatientInfoDetail");
const PatientInfoRead = () => import("./PatientInfoDetail");

export default {
  name: "mergePatient",
  props: {
    patientList: {
      type: Array,
      default: () => []
    },
    currentPatient: {
      type: String,
      default: ""
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    PatientInfo,
    PatientInfoRead
  },
  watch: {
    visible: {
      immediate: true,
      deep: true,
      handler() {
        this.patientList.map(item => {
          if (item.keyID === this.currentPatient && !item.wechat) {
            this.choosePatientInfo = JSON.parse(JSON.stringify(item));
          }
          if (item.wechat) {
            this.currentPatientInfo = JSON.parse(JSON.stringify(item));
          }
        });
      }
    }
  },
  data () {
    return {
      component1: "patient-info",
      component2: "patient-info",
      currentPatientInfo: {},
      choosePatientInfo: {}
    };
  },
  created () {
  },
  methods: {
    handleClose () {
      this.$emit("update:visible", false);
    },
    handleConf () {
      this.$refs.patientInfo.handleSave();
    },
    handleCloseDialog() {
      this.handleClose();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
