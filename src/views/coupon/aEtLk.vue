<template>
  <div class="add-coupon app-container base-page">
    <div class="title">{{title}}</div>
    <el-form label-width="160px" :model="form" :rules="rules" class="form-center" ref="formRef" :disabled="staus===3">
      <el-form-item label="优惠券名：" prop="couponName">
        <el-input v-model="form.couponName" maxlength="20" show-word-limit style="width: 90%"></el-input>
      </el-form-item>
      <el-form-item label="指定活动人群：">
        <el-radio-group v-model="form.couponRange">
          <el-radio :label="0">全部</el-radio>
          <el-radio :label="1">首次登陆新用户</el-radio>
          <el-radio :label="2">非首次登陆用户</el-radio>
        </el-radio-group>
      </el-form-item>
      <!--            <div class="add-rules">-->
      <!--                <span @click="addRule">-->
      <!--                    <i class="el-icon-circle-plus-outline"></i>-->
      <!--                    <span>新增规则：</span>-->
      <!--                </span>-->
      <!--&lt;!&ndash;                v-show="ruleShow"&ndash;&gt;-->
      <!--            </div>-->
      <!--            <div class="rule-area">-->
      <!--                <div class="rule-title">规则</div>-->
      <el-form-item label="活动商品：" label-width="160px">
        <div class="add-goods" v-if="!form.rule.medicineName">
          <span @click="addGoods">
            <i class="el-icon-circle-plus-outline"></i>
            <span>添加</span>
          </span>
        </div>
        <div class="goods" :title="form.rule.medicineName" v-else>
          {{form.rule.medicineName}}
          <i class="el-icon-error del" v-if="staus!==3" @click="delGoods"></i>
        </div>

      </el-form-item>
      <el-form-item label="满减规则：" label-width="160px">
        <div class="discount">
          满
          <el-input style="width: 60px;margin: 0 5px" maxlength="2" v-model="form.rule.full" @keyup.native="validateNum('full')"></el-input>
          减
          <el-input style="width: 60px;margin: 0 5px" maxlength="2" v-model="form.rule.reduce" @keyup.native="validateNum('reduce')"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="设置活动时间区间：" label-width="160px" prop="dateRangeTime">
        <el-date-picker style="width: 100%" v-model="form.dateRangeTime" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels :picker-options="pickerOptions" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动介绍：" label-width="160px" prop="description">
        <el-input style="width: 100%" type="textarea" maxlength="50" show-word-limit :autosize="{ minRows: 4, maxRows: 5}" placeholder="请输入活动介绍" v-model="form.description">
        </el-input>
      </el-form-item>
      <el-form-item label="优惠券发放数量：" label-width="160px" prop="count">
        <el-input style="width: 65px;" v-model="form.count" @keyup.native="validateNum('count')" maxlength="2"></el-input>
        <span style="margin-left: 5px;">张</span>
      </el-form-item>
      <el-form-item label="是否可叠加：" label-width="160px">
        <el-radio-group v-model="isOver" @change="isOverChange">
          <el-radio label="1">不可叠加</el-radio>
          <el-radio label="2"> 可叠加数：
            <el-input style="width: 50px;" v-model="form.isOver" @click.native="isOverClick" maxlength="2" @keyup.native="validateNum('isOver')">
            </el-input>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="仅限第几次购药使用：" label-width="160px">
        <el-radio-group v-model="useIndex" @change="useIndexChange">
          <el-radio label="1">不限</el-radio>
          <el-radio label="2">第
            <el-input style="width: 50px;" @click.native="useIndexClick" v-model="form.useIndex" maxlength="2" @keyup.native="validateNum('useIndex')">
            </el-input>
            <span>次</span>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!--            </div>-->
    </el-form>
    <div class="footer-btn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit" v-if="staus!==3" :loading="loading">确 定</el-button>
    </div>
    <goodsDialog :dialogVisible="dialogVisible" @confirmDialog="confirmDialog" @closeDialog="closeDialog"></goodsDialog>
  </div>
</template>

<script>
import goodsDialog from "./goodsDialog";
import { mapGetters } from "vuex";

export default {
  name: "addEditDialog",
  components: {
    goodsDialog
  },
  inject: ["close"],
  data () {
    return {
      pickerOptions: {},
      loading: false,
      staus: 1, //1新增 2修改 3查看
      ruleShow: false,
      dialogVisible: false,
      isOver: "1",
      useIndex: "1",
      form: {
        couponName: "",
        description: "",
        type: 1,
        couponRange: 0,
        rule: {
          full: "",       //满
          reduce: "",     //减
          medicineID: "",   //药品id
          medicineName: ""  //药品名称
        },
        dateRangeTime: [],
        count: "",
        isOver: "",
        useIndex: ""
      },
      rules: {
        // couponName:[{required:true, message:"优惠券名称不能为空", trigger: 'blur'}],
        // description: [{required:true, message:"活动介绍不能为空", trigger: 'blur'}],
        // count:[{required:true, message:"优惠券数量不能为空", trigger: 'blur'}]
      }
    };
  },
  created () {
    this.initData();
    this.pickerOptions = {
      disabledDate (time) {
        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
      }
    }
  },
  computed: {
    title () {
      let name = this.$route.name;
      switch (name) {
        case "add":
          return "新增优惠券";
        case "edit":
          return "修改优惠券";
        default:
          return "预览优惠券";
      }
    },
    ...mapGetters(["userInfo"])
  },
  methods: {
    initData () {
      let name = this.$route.name;
      if (name === "edit") {
        this.staus = 2;
        this.loadData();
      } else if (name === "view") {
        this.staus = 3;
        this.loadData();
      } else {
        this.staus = 1;
      }
    },
    loadData () {
      let params = {
        orgID: this.userInfo.orgID,
        keyID: this.$route.params.id
      };

      this.$_http({ url: this.$_API.API_COUPON_LIST, params: params, method: "get" })
        .then(res => {
          if (res.success) {
            res.data[0].rule = JSON.parse(res.data[0].rule);
            if (res.data[0].isOver > 0) {
              this.isOver = "2";
            } else {
              this.isOver = "1";
              res.data[0].isOver = "";
            }
            if (res.data[0].useIndex > 0) {
              this.useIndex = "2";

            } else {
              this.useIndex = "1";
              res.data[0].useIndex = "";
            }
            res.data[0].dateRangeTime = [res.data[0].startTime, res.data[0].endTime];
            this.form = res.data[0];
          } else {
            this.$message.error(res.message || "优惠券列表查询失败！");
          }
        });
    },
    delGoods () {
      this.form.rule.medicineName = '';
      this.form.rule.medicineID = '';
    },
    confirmDialog (medicine) {
      this.form.rule.medicineName = medicine.medicineName;
      this.form.rule.medicineID = medicine.medicineID;
      this.closeDialog();
    },
    closeDialog () {
      this.dialogVisible = false;
    },
    isOverChange (val) {
      if (val === "1") {
        this.form.isOver = "";
      }
    },
    isOverClick () {
      this.isOver = "2";
    },
    useIndexChange (val) {
      if (val === "1") {
        this.form.useIndex = "";
      }
    },
    useIndexClick () {
      this.useIndex = "2";
    },
    cancel () {
      this.close().then(() => {
        this.$router.push("/activity/coupon");
      });
    },
    addRule () {
      this.ruleShow = !this.ruleShow;
    },
    addGoods () {
      this.dialogVisible = true;
    },
    validateNum (val) {
      let reg = /[^0-9]*/ig;
      let reg2 = /^[1-9](\d*)?$/
      if (val === "full") {
        if (this.form.rule.full && !reg2.test(this.form.rule.full)) {
          this.form.rule.full = 1
        } else {
          this.form.rule.full = this.form.rule.full.replace(reg, "");
          if (this.form.rule.full && this.form.rule.reduce && this.form.rule.full <= this.form.rule.reduce) {
            this.form.rule.reduce = ''
            this.$message.warning("减的数量必须小于" + this.form.rule.full)
          }
        }
      } else if (val === "reduce") {
        if (this.form.rule.reduce == '00') {
          this.form.rule.reduce = '0'
        }
        this.form.rule.reduce = this.form.rule.reduce.replace(reg, "");
        if (this.form.rule.full && this.form.rule.reduce && this.form.rule.full <= this.form.rule.reduce) {
          this.form.rule.reduce = ''
          this.$message.warning("减的数量必须小于" + this.form.rule.full)
        }
      }
      else {
        if (this.form[val] && !reg2.test(this.form[val])) {
          this.form[val] = 1
        } else {
          this.form[val] = this.form[val].replace(reg, "");
        }
        if (val === 'count' || val === 'isOver') {
          if (this.form[val] > 10) {
            this.form[val] = 10
          }
          if (this.form.count && this.form.isOver && this.form.count > this.form.isOver) {
            this.$message.warning('可叠加次数不能小于优惠券张数！')
            this.form[val] = ""
          }
        }
      }
    },
    validate () {
      let msg = "";
      if (!this.form.couponName) {
        msg = "优惠券名称不能为空";
      } else if (!this.form.dateRangeTime || this.form.dateRangeTime.length === 0) {
        msg = "请选择活动时间";
      } else if (!this.form.description) {
        msg = "活动介绍不能为空";
      } else if (!this.form.count || this.form.count == 0) {
        msg = "优惠券数量为1-10";
      }
      if (!this.form.rule.medicineName) {
        msg = "请添加活动商品";
      } else if (this.form.rule.full == "" || this.form.rule.reduce == "") {
        msg = "满减规则不能为空";
      }
      if (msg) {
        return msg;
      }
      if (this.isOver == "2") {
        if (this.form.isOver == "") {
          msg = "可叠加次数不能为空";
        }
      }
      if (msg) {
        return msg;
      }
      if (this.useIndex == "2") {
        if (this.form.useIndex == "") {
          msg = "第几次购药不能为空";
        }
      }
      return msg;

    },
    submit () {
      let msg = this.validate();
      if (msg) {
        this.$message.warning(msg);
        return;
      }
      let _data = JSON.parse(JSON.stringify(this.form));
      if (this.isOver == "1") {
        _data.isOver = 0;
      }
      if (this.useIndex == "1") {
        _data.useIndex = 0;
      }
      _data.startTime = this.form.dateRangeTime[0];
      _data.endTime = this.form.dateRangeTime[1];
      _data.orgID = this.userInfo.orgID;
      _data.count = Number(_data.count);
      _data.isOver = Number(_data.isOver);
      _data.useIndex = Number(_data.useIndex);
      _data.rule = JSON.stringify(_data.rule);
      if (this.staus === 2) {
        _data.keyID = this.$route.params.id
      }
      delete _data.dateRangeTime;
      this.loading = true;
      this.$_http.post(this.$_API.API_COUPON_SAVE, JSON.stringify(_data))
        .then(res => {
          if (res.success) {
            this.$message.success(this.staus == 2 ? '修改优惠券成功！' : '添加优惠券成功！');
            this.loading = false;
            this.close().then(() => {
              this.$router.push("/activity/coupon");
            });
          } else {
            this.loading = false;
            this.$message.error(this.staus == 2 ? '修改优惠券失败' : "添加优惠券失败");
          }
        }).catch(err => {
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped lang="scss">
.add-coupon {
  background-color: #fff;
  /deep/ .el-radio__input.is-checked + .el-radio__label {
    color: #595959;
  }

  /deep/ .el-input {
    max-width: inherit;
  }

  /deep/ .el-form-item__label:before {
    content: "" !important;
  }

  .add-rules {
    color: #1890ff;
    padding-left: 13px;
    padding-bottom: 10px;

    i {
      margin-right: 1px;
      cursor: pointer;
    }

    span {
      cursor: pointer;
    }
  }

  .add-goods {
    color: #1890ff;
    display: inline-block;

    i {
      margin-right: 1px;
      cursor: pointer;
    }

    span {
      cursor: pointer;
    }
  }

  .goods {
    min-width: 88px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    height: 28px;
    line-height: 28px;
    background: rgba(67, 139, 239, 0.1);
    color: #438bef;
    border-radius: 14px;
    padding: 0 20px 0 10px;
    position: relative;

    .del {
      position: absolute;
      right: 5px;
      top: 7px;
      font-size: 14px;
      cursor: pointer;
    }
  }

  /*.rule-area {*/
  /*    height: 520px;*/
  /*    width: 526px;*/
  /*    background: rgba(245, 245, 245, 1);*/
  /*    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2);*/
  /*    margin: 10px 0;*/
  /*    box-sizing: border-box;*/
  /*    padding: 0 10px;*/

  /*    .rule-title {*/
  /*        padding: 10px 0;*/
  /*        text-align: center;*/
  /*        font-weight: bold;*/
  /*        color: rgba(38, 38, 38, 1);*/
  /*        line-height: 24px;*/
  /*    }*/

  /*    .add-goods {*/
  /*        color: #1890FF;*/
  /*        display: inline-block;*/

  /*        i {*/
  /*            margin-right: 1px;*/
  /*            cursor: pointer;*/
  /*        }*/

  /*        span {*/
  /*            cursor: pointer;*/
  /*        }*/
  /*    }*/

  /*    .goods {*/
  /*        min-width: 88px;*/
  /*        overflow: hidden;*/
  /*        text-overflow: ellipsis;*/
  /*        white-space: nowrap;*/
  /*        display: inline-block;*/
  /*        height: 28px;*/
  /*        line-height: 28px;*/
  /*        background: rgba(67, 139, 239, 0.1);*/
  /*        color: #438BEF;*/
  /*        border-radius: 14px;*/
  /*        padding: 0 10px;*/
  /*        position: relative;*/

  /*        .del {*/
  /*            position: absolute;*/
  /*            right: 5px;*/
  /*            top: 7px;*/
  /*            font-size: 14px;*/
  /*            cursor: pointer;*/
  /*        }*/
  /*    }*/
  /*}*/

  .title {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: rgba(42, 44, 48, 1);
    line-height: 26px;
    padding: 24px 0;
  }

  .form-center {
    width: 526px;
    margin: 0 auto;
    font-size: 14px;
    color: #595959;

    /deep/ label {
      font-weight: normal;
      color: #595959;
    }
  }

  .footer-btn {
    text-align: center;
    margin-top: 25px;
  }

  .rule {
    display: flex;

    &-lef,
    &-rig {
      width: 200px;
      cursor: pointer;
    }
  }

  .discount {
    display: flex;
    align-items: center;
  }
}
</style>
