<template>
  <el-dialog :title="title" :visible.sync="visible" width="665px" :before-close="handleClose">
    <div class="medicine-interaction--detail">
      <div class="detail-header" v-if="type==='A'">
        <el-radio-group v-model="form.interactionClass">
          <el-radio label="1">成分互相作用</el-radio>
          <el-radio label="2">类型互相作用</el-radio>
        </el-radio-group>
      </div>
      <div class="detail-body">
        <span class="detail-body--header" v-if="type==='A'">药品{{form.interactionClass==='1'?"成分":"成分类型"}}</span>
        <span class="detail-body--header" v-if="type==='B'">药品名称</span>
        <div class="detail-body-form">
          <template v-if="type==='A'">
            <div class="form-item">
              <div class="item-label"><font style="color:#F56C6C;">*</font>A{{form.interactionClass==='1'?"药品成分":"成分类型"}}：</div>
              <el-input type="text" v-model="form.medicineContentA" :placeholder='`多个${form.interactionClass==="1"?"药品成分":"成分类型"}用"，"分隔`' style="width:500px;max-width: 500px;" clearable @input="changeMedicineContentA" />
            </div>
            <div class="form-item">
              <div class="item-label"><font style="color:#F56C6C;">*</font>B{{form.interactionClass==='1'?"药品成分":"成分类型"}}：</div>
              <el-input type="text" v-model="form.medicineContentB" :placeholder='`多个${form.interactionClass==="1"?"药品成分":"成分类型"}用"，"分隔`' style="width:500px;max-width: 500px;" clearable @input="changeMedicineContentB" />
            </div>
          </template>
          <template v-if="type==='B'">
            <div class="form-item">
              <div class="item-label"><font style="color:#F56C6C;">*</font>A药品名称：</div>
              <el-input type="text" v-model="form.medicineContentA" placeholder='多个药品名称用"，"分隔' style="width:500px;max-width: 500px;" clearable @input="changeMedicineContentA"/>
            </div>
            <div class="form-item">
              <div class="item-label"><font style="color:#F56C6C;">*</font>B药品名称：</div>
              <el-input type="text" v-model="form.medicineContentB" placeholder='多个药品名称用"，"分隔' style="width:500px;max-width: 500px;" @input="changeMedicineContentB" clearable />
            </div>
          </template>
        </div>
        <div class="detail-line"></div>
        <div class="detail-body-form">
          <div class="form-item" style="width:50%;">
            <div class="item-label"><font style="color:#F56C6C;">*</font>作用类型：</div>
            <el-select style="width:190px;max-width: 190px" v-model="form.interactionType" filterable clearable @change="changeInteractionType">
              <el-option v-for="(item,index) in interactionTypeList" :key="index" :label="item.name" :value="item.val"></el-option>
            </el-select>
          </div>
          <div class="form-item"  style="width:50%;">
            <div class="item-label"><font style="color:#F56C6C;">*</font>提示类型：</div>
            <el-select style="width:190px;max-width: 190px" v-model="form.risk" filterable clearable>
              <el-option v-for="(item,index) in riskList" :key="index" :label="item.name" :value="item.val"></el-option>
            </el-select>
          </div>
          <div class="form-item">
            <div class="item-label">提示语：</div>
            <div>
              <el-radio v-model="form.tipType" label="0">默认预览</el-radio>
              <el-radio v-model="form.tipType" label="1">自定义</el-radio>
            </div>
          </div>
          <div class="form-item">
            <div class="item-label"></div>
            <div>
              <el-input type="textarea" v-model="form.tip" :readonly="form.tipType == 0" style="width:500px;max-width: 500px;" placeholder="请输入" :autosize="false" show-word-limit maxlength="200" rows="4" clearable></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSave" style="margin-left:32px;" :disabled="isDisabled">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { RISK } from './../../../common/Constant'
import { mapGetters } from "vuex";
export default {
  name: "medicineInteractionEdit",
  components: {
  },
  props: {
    title: {
      type: String,
      default: ''
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
      riskList: RISK,
      interactionTypeList: [
        { name: "拮抗", val: "1" },
        { name: "十八反", val: "2" },
        { name: "十九畏", val: "3" },
        { name: "禁忌", val: "4" }
      ],
      form: {
        interactionClass: "",
        medicineContentA: "",
        medicineContentB: "",
        interactionType: "",
        risk: "",
        riskName: "",
        tip: "",
        tipType: "0",
        staffName: "",
        staffID: "",
        isDisable: 0,
      },
      isDisabled: false
    };
  },
  created () {

  },
  watch: {
    visible (val) {
      if (val) {
        if (this.isEdit) {
          this.form = JSON.parse(JSON.stringify(this.selData))
          this.form.tipType = JSON.stringify(this.form.tipType)
          this.form.interactionClass = JSON.stringify(this.form.interactionClass)
        } else {
          this.resetData()
        }
        console.log(this.form)
        this.form.staffName = this.userInfo.staffName
        this.form.staffID = this.userInfo.keyID
      }
    },
    "form.tipType"(val) {
      let typeName = ''
      this.interactionTypeList.forEach(ele => {
        if(ele.val == this.form.interactionType) {
          typeName = ele.name
        }
      })
      if(val === "0") {
        this.form.tip = this.form.medicineContentA + (this.form.interactionClass != 0?"成分类型":"") + "与" + this.form.medicineContentB + (this.form.interactionClass != 0?"成分类型":"") + "会产生" + typeName + "作用";
      }
    }
  },
  methods: {
    // 修改成分A
    changeMedicineContentA(val) {
      console.log(val)
      let typeName = ''
      this.interactionTypeList.forEach(ele => {
        if(ele.val == this.form.interactionType) {
          typeName = ele.name
        }
      })
      if(val && this.form.tipType === "0") {
        this.form.tip = this.form.medicineContentA + (this.form.interactionClass != 0?"成分类型":"") + "与" + this.form.medicineContentB + (this.form.interactionClass != 0?"成分类型":"")+ "会产生" + typeName + "作用";
      }
    },
    // 修改成分B
    changeMedicineContentB(val) {
      let typeName = ''
      this.interactionTypeList.forEach(ele => {
        if(ele.val == this.form.interactionType) {
          typeName = ele.name
        }
      })
      if(val && this.form.tipType === "0") {
        this.form.tip = this.form.medicineContentA + (this.form.interactionClass != 0?"成分类型":"")+ "与" + this.form.medicineContentB + (this.form.interactionClass != 0?"成分类型":"") + "会产生" + typeName + "作用";
      }
    },
    // 切换作用类型
    changeInteractionType(val) {
      let typeName = ''
      this.interactionTypeList.forEach(ele => {
        if(ele.val == this.form.interactionType) {
          typeName = ele.name
        }
      })
      if(val && this.form.tipType === "0") {
        this.form.tip = this.form.medicineContentA + (this.form.interactionClass != 0?"成分类型":"") + "与" + this.form.medicineContentB + (this.form.interactionClass != 0?"成分类型":"") + "会产生" + typeName + "作用";
      }
    },
    resetData () {
      this.form = {
        interactionClass: this.type === "A" ? "1" : "0",
        medicineContentA: "",
        medicineContentB: "",
        interactionType: "",
        risk: "",
        riskName: "",
        tip: "",
        tipType: "0",
        staffName: this.userInfo.staffName,
        staffID: this.userInfo.keyID,
        isDisable: 0,
      }
    },
    // radio改变
    handleInteractionClassChange (val) {
      let keyID=JSON.stringify(this.form.keyID)
      this.form = {
        keyID,
        interactionClass: val,
        medicineContentA: "",
        medicineContentB: "",
        interactionType: "",
        risk: "",
        riskName: "",
        tip: "",
        tipType: "0",
        staffName: this.userInfo.staffName,
        staffID: this.userInfo.keyID,
        isDisable: 0,
      }
      console.log(this.form)
    },
    async handleSave () {
      if(this.type == 'A') {
        if(this.form.interactionClass == 1) {
          if(this.form.medicineContentA == '') {
            this.$message({ type: "warning", message: "请输入A药品成分" });
            return
          }
          if(this.form.medicineContentB == '') {
            this.$message({ type: "warning", message: "请输入B药品成分" });
            return
          }
        } else if(this.form.interactionClass == 2) {
          if(this.form.medicineContentA == '') {
            this.$message({ type: "warning", message: "请输入A成分类型" });
            return
          }
          if(this.form.medicineContentB == '') {
            this.$message({ type: "warning", message: "请输入B成分类型" });
            return
          }
        }
      }else if(this.type == 'B') {
        if(this.form.medicineContentA == '') {
          this.$message({ type: "warning", message: "请输入A药品名称" });
          return
        }
        if(this.form.medicineContentB == '') {
          this.$message({ type: "warning", message: "请输入B药品名称" });
          return
        }
      }
      if(this.form.interactionType == '') {
        this.$message({ type: "warning", message: "请选择作用类型" });
        return
      }
      if(this.form.risk == '') {
        this.$message({ type: "warning", message: "请选择提示类型" });
        return
      }
      if(this.form.tip == '') {
        this.$message({ type: "warning", message: "请输入提示语" });
        return
      }
      this.isDisabled = true
      if (this.form.risk) {
        const riskObj = this.riskList.find(item => {
          return item.val == this.form.risk
        })
        this.form.riskName = riskObj.name
      }
      const res = await this.$_http.post(this.$_API.INTERFACE_RM_POST_SAVE_MEDICINEINTERACTION, this.form)
      if (res.data) {
        this.$message({
          type: "success",
          message: "保存成功"
        });
        this.$parent.getList()
        this.$emit('update:visible', false)
        this.isDisabled = false
      }
    },
    handleClose () {
      this.$emit('update:visible', false)
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
