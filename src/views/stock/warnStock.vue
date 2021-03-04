<template>
  <el-dialog :visible.sync="warningStockVisible" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" width="500px">
    <div slot="title" class="dialog-title">预警库存<i class="el-icon-close" style="float: right;cursor: pointer" @click="closeFn"></i></div>
    <el-form label-width="100px" :model="form" ref="formRef" style="width: 340px;margin: 0 auto;">
      <el-form-item label="是否预警：">
        <el-radio-group v-model="form.isWarning" @change="warningChange">
          <el-radio :label="0">暂不预警</el-radio>
          <el-radio :label="1">需要预警</el-radio>
          <!--                    <el-radio :label="2">需要预警</el-radio>-->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预警数量：">
        <el-input v-model="form.warningInventory" maxlength="5" placeholder="请输入" clearable style="width: 75px" @keyup.native="numValid" :disabled="form.isWarning==0"></el-input>
      </el-form-item>
      <el-form-item label="通知人号码：">
        <el-button icon="el-icon-plus" type="primary" style="margin-bottom: 10px" @click="addPhone" :disabled="form.isWarning==0">添加
        </el-button>
        <ul class="warn-phone">
          <li v-for="(item, index) in form.phone" :key="index">
            <el-input v-model="item.phone" maxlength="11" @keyup.native="phoneValid(item)" @blur="phoneCheck(item)" clearable placeholder="请输入" :disabled="form.isWarning==0"></el-input>
            <i class="el-icon-remove-outline del" @click="delPhone(index)"></i>
          </li>
        </ul>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeFn">取消</el-button>
      <el-button type="primary" @click="confirm" :loading="loading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "warnStock",
  props: {
    warningStockVisible: {
      type: Boolean,
      default: false
    },
    keyID: {
      type: String,
      default: ""
    },
    medicineID: {
      type: String,
      default: ""
    },
    warnOpts: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data () {
    return {
      loading: false,
      form: {
        isWarning: 0,
        warningInventory: "",
        phone: []
      }
    };
  },
  created () {
    this.form = this.$props.warnOpts;
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    warningChange (val) {
      if (val == 0) {
        this.form.phone = [];
        this.form.warningInventory = 0;
      }
    },
    numValid () {
      let reg = /[^0-9]/ig;
      this.form.warningInventory = this.form.warningInventory.replace(reg, "");
      let reg2 = /^[1-9]\d{0,4}$/;
      if (!reg2.test(this.form.warningInventory)) {
        this.form.warningInventory = "";
      }
      if (this.form.warningInventory > 10000) {
        this.$message.warning("预警数量最多为10000！");
        this.form.warningInventory = 10000;
      }
    },
    phoneCheck (item) {
      let reg = /^1[3456789]\d{9}$/;
      if (!item.phone) {
        this.$message.closeAll();
        this.$message.warning("手机号不能为空");
      } else if (!reg.test(item.phone)) {
        this.$message.closeAll();
        this.$message.warning("手机号输入不正确！");
      }
    },
    phoneValid (item) {
      let reg = /[^0-9]/ig;
      item.phone = item.phone.replace(reg, "");
    },
    addPhone () {
      this.$message.closeAll();
      if (this.form.phone.length < 10) {
        this.form.phone.push({ phone: "" });
      } else {
        this.$message.warning("最多添加10个通知人");
      }
    },
    delPhone (i) {
      this.form.phone.splice(i, 1);
    },
    confirm () {
      this.$message.closeAll();
      let arr = [];
      let flag = true;
      let reg = /^1[3456789]\d{9}$/;
      let msg = null;
      if (this.form.isWarning == 1) {
        if (this.form.phone.length == 0) {
          this.$message.warning("请添加通知人号码！");
          return;
        }
        this.form.phone.forEach(item => {
          arr.push(item.phone);
        });
        for (let i = 0; i < this.form.phone.length; i++) {
          const ele = this.form.phone[i];
          if (!ele.phone) {
            flag = false;
            msg = "手机号不能为空！";
            break;
          }
          if (!reg.test(ele.phone)) {
            flag = false;
            msg = "手机号输入不正确！";
            ele.phone = "";
            break;
          }
        }
        if (!flag) {
          this.$message.warning(msg);
          return;
        }
      }
      this.loading = true;
      let _data = {
        orgID: this.userInfo.orgID,
        keyID: this.keyID,
        medicineID: this.medicineID,
        isWarning: this.form.isWarning,
        warningInventory: Number(this.form.warningInventory),
        phone: arr.join(",")
      };

      this.$_http.post(this.$_API.INTERFACE_STOCK_WARNING, _data)
        .then(res => {
          if (res.success) {
            this.$emit("upDateData");
            this.$message.success("预警库存设置成功！");
            this.loading = false;
          } else {
            this.$message.warning(res.message);
            this.loading = false;
          }
        });
    },
    closeFn () {
      this.loading = false;
      this.$emit("closeFn");
    }
  }
};
</script>

<style scoped lang="scss">
ul,
li {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dialog-title {
  padding-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
  text-align: left;
  font-size: 18px;
  /*font-weight: bold;*/
  color: rgba(42, 44, 48, 1);
}

.warn-phone {
  .del {
    color: red;
    font-size: 20px;
    margin-left: 10px;
    cursor: pointer;
  }

  li {
    display: flex;
    align-items: center;
    padding: 10px 0;
  }
}

/deep/ .el-radio__input.is-checked + .el-radio__label {
  color: #606266;
}
</style>
