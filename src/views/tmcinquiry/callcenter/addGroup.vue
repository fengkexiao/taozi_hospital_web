<template>
  <div class=" base-page" id="detailBody">
    <el-dialog :visible.sync="visible" class="popup-vertify" :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="back" width="33%">
      <el-form ref="formVertify" :model="formData" :rules="formRules" label-width="170px">
        <el-form-item label="坐席组ID" prop="thirdGroupID">
          <el-input v-model="formData.thirdGroupID" form-type="phone" maxlength="15" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="坐席组名" prop="thirdGroupName">
          <el-input type="text" v-model="formData.thirdGroupName" maxlength="15" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <div style="margin-left:82px; margin-bottom:20px">
          <div>
            <span style="color: red">*</span>
            <span class="text">坐席组号码</span>
            <el-input form-type="phone" v-model="phoneNum" style="margin-left:13px" placeholder="请输入" maxlength="20" clearable></el-input>
            <el-button type="text" size="mini" class="left" @click="add">添加</el-button>
          </div>
          <div v-if="formData.phoneNums.length !== 0" class="m-left">
            <ul v-for="(item, index) in formData.phoneNums" :key="index">
              <li class="flex">
                <span>{{item.phoneNum}}</span><span @click="delete1(index)" class="delMedicineIconDiv"><img class="delMedicineIconImg" src="@/assets/image/tmcinquiry/delete.png" /></span>
              </li>
            </ul>
          </div>
        </div>
        <el-form-item label="坐席组类型" prop="thirdGroupType" id="selectWidth">
          <el-select v-model="formData.thirdGroupType" placeholder="请选择" filterable clearable>
            <el-option v-for="(item,index) in jobTypes" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="back">取消</el-button>
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
      phoneNum: "",
      formData: {
        thirdGroupID: "",
        thirdGroupName: "",
        keyID: "",
        thirdGroupType: "",
        phoneNums: []
      },
      jobTypes: [
        { value: 0, label: "呼入/呼出" },
        { value: 1, label: "仅呼入" },
        { value: 2, label: "仅呼出" }
      ],
      formRules: {
        thirdGroupID: {
          required: true,
          message: "坐席组ID不能为空"
        },
        thirdGroupName: {
          required: true,
          message: "坐席组名不能为空"
        },
        thirdGroupType: {
          required: true,
          message: "请选择坐席组类型"
        }
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
      this.feedback();
    }
  },
  methods: {
    back () {
      this.$emit("update:visible", false);
      this.formData = {
        thirdGroupID: "",
        thirdGroupName: "",
        keyID: "",
        thirdGroupType: "",
        phoneNums: []
      };
      this.$refs.formVertify.resetFields();
    },
    add () {
      if (!this.phoneNum) {
        this.$alert("号码不能为空", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      let params = {
        phoneNum: this.phoneNum
      };
      this.formData.phoneNums.push(params);
      this.phoneNum = "";
    },
    delete1 (index) {
      this.formData.phoneNums.splice(index, 1);
    },
    feedback () {
      this.formData = {};
      this.formData = this.propdata;
      // this.$refs.formVertify.resetFields();
    },
    // 点击提交处理
    save () {
      if (this.popHandling) {
        return;
      }
      if (this.formData.phoneNums.length === 0) {
        this.$alert("请填写坐席组号码并点击添加按钮", "温馨提示", {
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
        this.$emit("save", { ...this.formData });
        // this.formData = {
        //   thirdGroupID: "",
        //   thirdGroupName: "",
        //   keyID: "",
        //   thirdGroupType: "",
        //   phoneNums: []
        // };
        // this.$refs.formVertify.resetFields();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  list-style-type: none;
}
#detailBody {
  .footer {
    padding-left: 300px;
  }
}
.left {
  margin-left: 15px;
}
.flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.delMedicineIconDiv {
  width: 15px;
  height: 15px;
  margin-left: 5px;
  border-radius: 18px;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.delMedicineIconImg {
  width: 11px;
  height: 11px;
}
.text {
  font-size: 14px;
  font-weight: 700;
  color: #606266;
}
.m-left {
  margin-left: 47px;
}
</style>
<style>
#boxCard .el-input {
  max-width: 245px;
}
#selectWidth .el-input {
  width: 114%;
}
</style>
