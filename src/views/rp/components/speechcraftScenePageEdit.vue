<template>
  <el-dialog :title="title" :visible.sync="visible" width="665px" :before-close="handleClose">
    <div class="medicine-interaction--detail" :model="form">
      <div class="detail-header" v-if="type==='A'">
        <div>
          <div class="form-item">
            <span class="item-label">场景：</span>
            <el-select v-model="form.speechcraftScene" placeholder="请选择" filterable clearable>
              <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="detail-body">
        <el-input type="textarea" placeholder="请输入话术" v-model="form.sentence" maxlength="200" show-word-limit>
        </el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSave" style="margin-left:32px;" :disabled="isDisabled">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "speechcraftScenePageEdit",
  components: {
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    },
    selData: {
      type: Object
    },
    isEdit: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        keyID: "",
        speechcraftClass: "",
        speechcraftType: "",
        speechcraftScene: "",
        sentence: "",
        useCount: "",
        updateUser: "",
        updateTime: "",
        addUser: "",
        modifyUser: ""
      },
      isDisabled: false,
      options1: [
        {
          value: "通用",
          label: "通用"
        },
        {
          value: "儿童",
          label: "儿童"
        },
        {
          value: "过敏",
          label: "过敏"
        },
        {
          value: "肝肾",
          label: "肝肾"
        },
        {
          value: "妊娠哺乳",
          label: "妊娠哺乳"
        },
        {
          value: "抗生素",
          label: "抗生素"
        },
        {
          value: "免疫抑制剂",
          label: "免疫抑制剂"
        },
        {
          value: "精神科",
          label: "精神科"
        },
        {
          value: "高风险药",
          label: "高风险药"
        }
      ]
    };
  },
  created () {

  },
  watch: {
    visible (val) {
      if (val) {
        if (this.isEdit) {
          this.form = JSON.parse(JSON.stringify(this.selData));
        } else {
          this.resetData();
          this.form = JSON.parse(JSON.stringify(this.selData));
        }
        console.log(this.form);
        this.form.updateUser = this.userInfo.staffName;
        this.form.addUser = this.userInfo.keyID;
        this.form.modifyUser = this.userInfo.keyID;
        // this.form.speechcraftScene = "通用"
      }
    }
  },
  methods: {
    resetData () {
      this.form = {
        keyID: "",
        speechcraftClass: "",
        speechcraftType: "",
        speechcraftScene: "",
        sentence: "",
        useCount: "",
        updateUser: "",
        updateTime: "",
        addUser: "",
        modifyUser: ""
      };
    },
    async handleSave () {
      var url = this.$_API.INTERFACE_RM_POST_SPEECHCRAFT_ADD;
      if (this.isEdit) {
        url = this.$_API.INTERFACE_RM_POST_SPEECHCRAFT_UPDATE;
      } else {
      }
      const res = await this.$_http.post(url, this.form);
      console.log(res);
      if (res.success) {
        this.$message({
          type: "success",
          message: "保存成功"
        });
        this.$emit("update:visible", false);
        this.$emit("scenePageReload");
        this.isDisabled = false;
      }
    },
    handleClose () {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style lang="scss" >
.el-dialog__header {
  border-bottom: 1px solid #d8d8d8;
}
.medicine-interaction--detail {
  margin-left: 4px;
  .detail-header {
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 16px;
  }
  .detail-body {
    padding-top: 24px;
    .detail-body--header {
      font-size: 14px;
      font-weight: 700;
      color: #262626;
    }
    .detail-body-form {
      padding-top: 16px;
      overflow: hidden;
      .form-item {
        display: flex;
        align-items: center;
        padding-bottom: 16px;
        float: left;
        .item-label {
          text-align: right;
          font-size: 14px;
          font-weight: 400;
          width: 90px;
          color: #262626;
        }
      }
    }
  }
  .detail-line {
    border-bottom: 1px solid #e8e8e8;
  }
  .el-select {
    input {
      width: 190px;
      max-width: 190px !important;
    }
    .el-input--suffix {
      max-width: 500px !important;
    }
  }
}
</style>
