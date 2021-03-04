<template>
  <div id="detailBody">
    <el-dialog :visible.sync="visible" class="popup-vertify" :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="back" width="30%">
      <el-form ref="formVertify" :model="formData" inline>
        <h3>更换IP医生</h3>
        <hr />
        <el-form-item label="">
          <el-cascader v-model="formData.value" :options="options" @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="back">取消</el-button>
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
    assistantOptions: {
      type: Array,
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
      formData: {},
      value: [],
      options: []
    };
  },
  created () {
  },
  activated () {
    // this.getOrderDetail();
  },
  watch: {
    assistantOptions () {
      // console.log(this.assistantOptions, 222);
      this.options = this.assistantOptions.map((item, index) => {
        return {
          key: index,
          value: JSON.stringify(item.assistantGroup),
          label: item.assistantGroup.doctorName,
          children: item.groupMembers
        };
      });
      this.options.forEach(item => {
        item.children.forEach(items => {
          items["value"] = JSON.stringify(items);
          items["label"] = items.assistantName;
        });
      });
      // console.log(this.options);
      // this.options = this.assistantOptions.assistantGroup;
      // this.$nextTick(() => {
      //   this.$refs.formVertify.clearValidate();
      // });
    }
  },
  methods: {
    back () {
      this.$emit("update:visible", false);
      this.formData = {};
    },
    handleChange (value) {
      // console.log(JSON.parse(value[0]));
      // console.log(JSON.parse(value[1]));
    },
    // 点击提交处理
    save () {
      if (this.popHandling) {
        return;
      }
      if (!this.formData.value) {
        this.$alert("您还未选择IP医生！", "温馨提示", {
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
        console.log(this.formData);
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
  .el-form-item {
    margin-top: 30px;
  }
}
</style>
