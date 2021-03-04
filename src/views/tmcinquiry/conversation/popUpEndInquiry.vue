<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="500px"
    title="问诊结束"
    :close="dialogClose"
    :show-close="false"
    :modal="false"
    :close-on-click-modal="false"
    style="margin-top: 15vh"
  >
    <el-form label-width="120px">
      <el-form-item label="标记跟进状态">
        <el-select v-model="value" placeholder="选择标记跟进状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建新任务" v-if="value===1 || value===4">
        <!-- <el-input v-model="count" :min="1" :step="1" placeholder="输入天数" clearble></el-input>&#12288;天后复诊 -->
          <el-input-number v-model="count"  :min="1"  :step="1" label="描述文字" @keydown.native="channelInputLimit"></el-input-number>&#12288;天后复诊

        <!-- <base-input v-model="count" placeholder="输入天数" clearble></base-input>&#12288;天后复诊 -->
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button @click="dialogClose">取消</el-button>
        <el-button type="primary" @click="endInquiry">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      value: "",
      count: "",
      options: [
        { label: "已购药，需要跟进", value: 1 },
        { label: "已购药不需要跟进", value: 2 },
        { label: "不购药", value: 3 },
        { label: "未购药，需跟进", value: 4 }
      ]
    };
  },
  props: ["dialogVisible"],
  computed: {
    ...mapGetters(["tmc", "userInfo"])
  },
  methods: {
    ...mapActions({
      clearTmcMsgFun: "tmc/clearTmcMsgFun" // 清空tmc数据
    }),
    channelInputLimit (e) {
      let key = e.key;
      // 不允许输入'e'和'.'
      if (key === "e" || key === ".") {
        e.returnValue = false;
        return false;
      }
      return true;
    },
    dialogClose() {
      this.$emit("update:dialogVisible", false);
    },
    endInquiry() {
      this.dialogClose();
      let params = {
        orgID: this.userInfo.orgID,
        inquiryID: this.tmc.inquiryID,
        followStatus: this.value,
        reInquiryIntervalTime: this.count
      };
      this.$_http
        .post(this.$_API.INTERFACE_TMC_POST_END_INQUIRY, params)
        .then(res => {
          // 清理问诊信息
          this.clearTmcMsgFun();
        });
    }
  }
};
</script>

<style scoped lang="scss">
.aaa {
  margin: 0 !important;
}
</style>
