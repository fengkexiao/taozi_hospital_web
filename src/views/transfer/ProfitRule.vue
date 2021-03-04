<template>
  <div class="app-container base-page">
    <base-title name="转诊分润规则设置"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addRule">新增</el-button>
    </div>
    <el-table :data="tableData" stripe :loading="tableLoading">
      <el-table-column prop="ruleName" label="规则名称" align="center"></el-table-column>
      <el-table-column prop="moneyRange" label="金额范围" align="center"></el-table-column>
      <el-table-column prop="sectionName" label="科室" align="center"></el-table-column>
      <el-table-column prop="inquiryModeName" label="就诊方式" align="center"></el-table-column>
      <el-table-column prop="doctorIncome" label="医生首诊服务费" align="center" width="200px"></el-table-column>
      <el-table-column prop="priority" label="优先级" align="center"></el-table-column>
      <el-table-column prop="addTime" label="创建时间" width="155px" align="center"></el-table-column>
      <el-table-column prop="addUser" label="创建人" align="center"></el-table-column>
      <el-table-column prop="isDisable" label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isDisable=== 0">启用</span>
          <span v-if="scope.row.isDisable=== 1">已禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="update(row)">修改</span>
            <div class="line"></div>
            <span class="text-danger  opt-text" v-if="row.isDisable===0 " @click="switchEnable(row.keyId,1)">禁用</span>
            <span class="opt-text" v-if=" row.isDisable===1" @click="switchEnable(row.keyId,0)">启用</span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div id="dialogBody">
      <el-dialog :title="bodyTitle" :visible.sync="dialogVisible" width="700px" @close="cancel">
        <el-form :model="oneRowData" :rules="formRules" ref="addRule" class="pl24">
          <el-form-item label="规则名：" label-width="170px" prop="ruleName">
            <el-input v-model="oneRowData.ruleName" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="金额范围：" label-width="170px" class="form-required">
            <el-col :span="4.5">
              <el-form-item prop="minMoneyForShow">
                <el-input v-model="oneRowData.minMoneyForShow" placeholder="最小值" style="max-width: 88px" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">&emsp;--</el-col>
            <el-col :span="4.5">
              <el-form-item prop="maxMoneyForShow">
                <el-input v-model="oneRowData.maxMoneyForShow" placeholder="最大值" style="max-width: 88px" clearable></el-input>
                &emsp;
                <span style=" color:red">注：不填代表无穷大</span>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="科室：" label-width="170px" prop="sectionId" class="form-required">
            <el-select v-model="oneRowData.sectionId" placeholder="请选择" clearable filterable>
              <el-option label="不限" value="" style="width: 245px"></el-option>
              <el-option v-for="item in sectionOptions" :key="item.keyID" :label="item.hospitalSectionName" :value="item.keyID" style="width: 245px"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="就诊方式：" label-width="170px" prop="inquiryModeId" class="form-required">
            <el-radio-group v-model="oneRowData.inquiryModeId">
              <el-radio :label="0">不限</el-radio>
              <el-radio :label="1">门诊</el-radio>
              <el-radio :label="2">住院</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="医生首诊服务费：" label-width="170px" prop="feeTypeId" class="form-required">
            <el-radio-group v-model="oneRowData.feeTypeId">
              <el-radio :label="0">比例</el-radio>
              <el-radio :label="1">固定金额</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="oneRowData.feeTypeId ===0" label="" label-name="医生首诊服务费数额" label-width="170px" prop="feeRatio" class="form-required">
            <el-input v-model="oneRowData.feeRatio" form-type="money" placeholder="请输入" clearable></el-input>
            <span> %</span>
          </el-form-item>
          <el-form-item v-if="oneRowData.feeTypeId ===1" label="" label-name="医生首诊服务费数额" label-width="170px" prop="feeFixForShow" class="form-required">
            <el-input v-model="oneRowData.feeFixForShow" placeholder="请输入" clearable></el-input>
            <span> 元</span>
          </el-form-item>
          <el-form-item prop="priority" label="优先级：" label-width="170px">
            <el-input v-model="oneRowData.priority" clearable placeholder="请输入"></el-input>&emsp;
            <span style=" color:red">注：数值越大，优先级越高</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button class="sure" type="primary" @click="ensureCommon1st()">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import InputWithTip from "@/components/InputWithTip";
import { mapGetters } from "vuex";

export default {
  name: "Orders",
  inject: ["reload"],
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InputWithTip
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    var checkMaxMoney = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        if (!/^[1-9]\d*$/.test(value)) {
          callback(new Error("请输入正整数"));
        } else {
          if (value < this.oneRowData.minMoneyForShow) {
            callback(new Error("需大于下限"));
          } else {
            callback();
          }
        }
      }
    };
    var checkFeeRatio = (rule, value, callback) => {
      if (!/^[1-9]\d?(\.\d|\.\d\d)?$/.test(value)) {
        if (value < 0 || value > 100) {
          callback(new Error("数值范围是(0,100),最多两位小数"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var checkFeeFix = (rule, value, callback) => {
      if (!value) {
        callback(new Error("此值不可以为空"));
      } else {
        if (!/^[1-9]\d*$/.test(value)) {
          callback(new Error("请输入正整数"));
        } else {
          callback();
        }
      }
    };
    return {
      needQuery: false,
      bodyTitle: "",
      dialogVisible: false,
      tableLoading: false,
      tableData: [],
      oneRowData: {
        keyId: "",
        hospitalId: "",
        ruleName: "",
        minMoney: "",
        minMoneyForShow: "",
        maxMoney: "",
        maxMoneyForShow: "",
        sectionId: "",
        sectionName: "",
        inquiryModeId: "",
        inquiryModeName: "",
        feeTypeId: "",
        feeTypeName: "",
        feeRatio: "",
        feeFix: "",
        feeFixForShow: "",
        priority: "",
        doctorIncome: ""
      },
      sectionOptions: [],
      query: {},

      formRules: {
        ruleName: [
          {
            required: true,
            message: "此值不可以为空",
            trigger: "blur"
          }
        ],
        minMoneyForShow: [
          {
            required: true,
            message: "此值不可以为空",
            trigger: "blur"
          },
          {
            trigger: "blur",
            pattern: /^[+]{0,1}(\d+)$/,
            message: "请输入非负整数"
          }
        ],
        maxMoneyForShow: [
          { validator: checkMaxMoney, trigger: "blur" }
        ],
        feeRatio: [
          {
            required: true,
            message: "此值不可以为空",
            trigger: "blur"
          },
          { validator: checkFeeRatio, trigger: "blur" }
        ],
        feeFixForShow: [{ validator: checkFeeFix, trigger: "blur" }],
        priority: [
          {
            required: true,
            message: "此值不可以为空",
            trigger: "blur"
          },
          {
            trigger: "blur",
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数"
          }]
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      }
    };
  },
  created () {
    this.getTableData();
  },
  activated () {
    this.getTableData();
  },
  methods: {
    getTableData () {
      this.$_http.get(this.$_API.INTERFACE_RULE_LIST, {
        params: {
          hospitalId: this.userInfo.orgID
        }
      }).then(response => {
        if (!response.data) return;
        let temp = response.data;
        temp.forEach(item => {
          item.minMoneyForShow = item.minMoney / 100;
          item.maxMoneyForShow = item.maxMoney / 100;
          if (item.maxMoney === (-1)) {
            item.moneyRange = item.minMoney / 100 + " -- 无穷大";
          } else {
            item.moneyRange = item.minMoney / 100 + " -- " + item.maxMoney / 100;
          }
          if (item.feeTypeId === 0) {
            item.doctorIncome = item.feeRatio + "%";
            item.feeFixForShow = "";
          } else {
            item.doctorIncome = item.feeFix / 100 + "元";
            item.feeRatio = "";
            item.feeFixForShow = item.feeFix / 100;
          }
        });
        this.tableData = temp;
        this.needQuery = true;
      });
    },
    addRule () {
      this.dialogVisible = true;
      this.bodyTitle = "添加规则";
      this.$_http.get(this.$_API.INTERFACE_GET_SECTION_LIST, {
        params: {
          orgId: this.userInfo.orgID,
          disableStatus: 0
        }
      }).then(response => {
        if (!response.data) return;
        this.sectionOptions = response.data;
      });
    },

    update (row) {
      let theRow = JSON.parse(JSON.stringify(row));
      this.bodyTitle = "修改规则";
      this.$_http.get(this.$_API.INTERFACE_GET_SECTION_LIST, {
        params: {
          orgId: this.userInfo.orgID,
          disableStatus: 0
        }
      }).then(response => {
        if (!response.data) return;
        this.sectionOptions = response.data;
      });
      if (theRow.maxMoney === (-1)) {
        theRow.maxMoneyForShow = "";
      }
      this.oneRowData = theRow;
      this.dialogVisible = true;
    },
    ensureCommon1st () {
      this.$refs.addRule.validate(valid => {
        if (!valid) {
          return;
        }
        this.ensureCommon2nd();
      });
    },
    ensureCommon2nd () {
      // 填充hospitalId
      this.oneRowData.hospitalId = this.userInfo.orgID;

      // 填充上限
      if (this.oneRowData.maxMoneyForShow === "" || (!this.oneRowData.maxMoneyForShow)) {
        this.oneRowData.maxMoney = -1;
      } else {
        this.oneRowData.maxMoney = this.oneRowData.maxMoneyForShow * 100;
      }
      this.oneRowData.minMoney = this.oneRowData.minMoneyForShow * 100;
      // 填充sectionName
      if (this.oneRowData.sectionId === "") {
        this.oneRowData.sectionName = "不限";
      } else {
        this.sectionOptions.forEach(section => {
          if (this.oneRowData.sectionId === section.keyID) {
            this.oneRowData.sectionName = section.hospitalSectionName;
          }
        });
      }
      // 填充feeTypeName
      if (this.oneRowData.feeTypeId === 0) {
        this.oneRowData.feeTypeName = "按比例";
        this.oneRowData.feeFix = 0;
      }
      if (this.oneRowData.feeTypeId === 1) {
        this.oneRowData.feeTypeName = "按固定金额";
        this.oneRowData.feeRatio = 0;
        this.oneRowData.feeFix = this.oneRowData.feeFixForShow * 100;
      }
      // 填充feeTypeName
      if (this.oneRowData.inquiryModeId === 1) {
        this.oneRowData.inquiryModeName = "门诊";
      } else if (this.oneRowData.inquiryModeId === 2) {
        this.oneRowData.inquiryModeName = "住院";
      } else {
        this.oneRowData.inquiryModeName = "不限";
      }
      let parameter = this.oneRowData;
      delete parameter.doctorIncome;
      if (this.bodyTitle === "添加规则") {
        this.addEnsure(parameter);
      }
      if (this.bodyTitle === "修改规则") {
        this.updateEnsure(parameter);
      }
      this.dialogVisible = false;
      this.$refs.addRule.clearValidate();
    },
    addEnsure (parameter) {
      delete parameter.keyId;
      this.$_http.post(this.$_API.INTERFACE_ADD_RULE, parameter).then(response => {
        this.resetOneRowData();
        this.getTableData();
      });
    },
    updateEnsure (parameter) {
      delete parameter.moneyRange;
      delete parameter.addTime;
      delete parameter.addUser;
      delete parameter.isDisable;
      this.$_http.post(this.$_API.INTERFACE_MODIFY_RULE, parameter).then(response => {
        this.resetOneRowData();
        this.getTableData();
      }
      );
    },
    cancel () {
      this.resetOneRowData();
      this.dialogVisible = false;
      this.$refs.addRule.clearValidate();
    },
    switchEnable (id, number) {
      this.$_http.post(this.$_API.INTERFACE_SWITCH_ENABLE, {
        keyId: id,
        isDisable: number
      }).then(response => {
        this.getTableData();
      });
    },
    resetOneRowData () {
      this.oneRowData = {
        hospitalId: "",
        ruleName: "",
        minMoney: "",
        maxMoney: "",
        sectionId: "",
        sectionName: "",
        inquiryModeId: "",
        inquiryModeName: "",
        feeTypeId: "",
        feeTypeName: "",
        feeRatio: 0.0,
        feeFix: 0.0,
        priority: "",
        doctorIncome: ""
      };
      this.bodyTitle = "";
    }
  }
};
</script>

<style scoped>
</style>
