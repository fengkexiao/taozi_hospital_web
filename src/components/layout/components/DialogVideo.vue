<template>
  <el-dialog :close-on-click-modal="false" title="请求问诊" :visible.sync="show" width="590px">
    <div class="doctor-div">
      <el-image v-if="inquiryInfo.faceImage" style="width: 60px; height: 60px" :src="inquiryInfo.faceImage">
      </el-image>
      <div class="doctor-cc doctor-phone ">
        患者电话：{{inquiryInfo.phone}}
      </div>
    </div>
    <div class="doctor-div doctor-cc">
      <label style="width: 80px;">药品信息：</label>{{inquiryInfo.medicineName}}
    </div>
    <div class="doctor-bb">
      <el-button type="primary" @click="refuse">拒绝接诊</el-button>
      <el-button type="primary" @click="receive">同意接诊</el-button>
    </div>
  </el-dialog>
</template>
<script>
const noop = () => {};
export default {
  props: {
    // 控制弹框显示
    visible: Boolean,
    // 弹窗显示信息
    inquiryInfo: {
      type: Object,
      default: () => ({})
    },
    // 接受
    receive: {
      type: Function,
      default: noop
    },
    // 拒绝
    refuse: {
      type: Function,
      default: noop
    }
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    }
  }
};
</script>

<style scoped>
.doctor-div {
  display: flex;
}
.doctor-bb {
  margin-top: 3%;
  margin-left: 30%;
}
.doctor-cc {
  margin-top: 3%;
}
.doctor-phone {
  margin-left: 5%;
}
</style>
