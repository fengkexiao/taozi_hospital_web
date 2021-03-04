<template>
  <div class="app-container"  id="detailBody">
    <el-dialog :visible.sync="visible" class="popup-vertify" :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="back" width="350px">
      <el-form ref="formVertify" :model="formData" label-width="100px">
        <el-form-item label="分级名称：">
          <el-input type="text" v-model="formData.levelName" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="分级描述：">
          <el-input type="text" v-model="formData.levelDes" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序值：">
          <el-input type="text" v-model="formData.sortNo" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="back">取消</el-button>
        <el-button :loading="popHandling" type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
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
    // 弹窗标题
    title: {
      type: String,
      required: true
    },
    // 弹窗是否在处理中
    popHandling: {
      type: Boolean,
      default () {
        return false;
      }
    },
    propdata: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      tableLoading: false,
      dialogVisible: false,
      formData: {
        groupName: "",
        groupDesc: "",
        keyID: ""
      }
    };
  },
  created () {
  },
  activated () {
    // this.getOrderDetail();
  },
  watch: {
    propdata () {
      // console.log(this.propdata, 222);
      this.formData = JSON.parse(JSON.stringify(this.propdata));
    }
  },
  methods: {
    back () {
      this.$emit("update:visible", false);
      this.formData = {};
    },
    // 点击提交处理
    save () {
      if (this.popHandling) {
        return;
      }
      if (!this.formData.levelName) {
        this.$alert("您还未填写分级名称！", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      if (!this.formData.levelDes) {
        this.$alert("您还未填写分级描述！", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      if (!this.formData.sortNo) {
        this.$alert("您还未填写排序值！", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      this.$refs.formVertify.validate(valid => {
        if (!valid) {
          return;
        }
        this.$emit("save", this.formData);
        this.formData = {};
      });
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
</style>
