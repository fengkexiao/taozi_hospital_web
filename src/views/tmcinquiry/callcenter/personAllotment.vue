<template>
  <div id="detailBody">
    <el-dialog :visible.sync="visible" class="popup-vertify" :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="back" width="900px">
      <el-form :model="formData" ref="formVertify" :rules="formRules" inline class="pl24">
        <el-form-item label="坐席工号：" prop="thirdSeatAgent" >
          <el-input form-type="phone" placeholder="请输入" maxlength="10" v-model="formData.thirdSeatAgent" clearable></el-input>
        </el-form-item>
        <el-form-item label="坐席号码：" prop="phoneNum" >
          <el-input form-type="phone" placeholder="请输入" maxlength="15" v-model="formData.phoneNum" clearable></el-input>
        </el-form-item>
        <el-form-item label="坐席ID：" prop="thirdSeatID" >
          <el-input form-type="phone" placeholder="请输入" maxlength="15" v-model="formData.thirdSeatID" clearable></el-input>
        </el-form-item>
        <el-form-item label="坐席名：" prop="thirdSeatName" >
          <el-input placeholder="请输入" v-model="formData.thirdSeatName" maxlength="15" clearable></el-input>
        </el-form-item>
      </el-form>
      <base-title name="查询条件"></base-title>
      <el-form :model="query" ref="queryData" inline class="pl24 mt24">
        <el-form-item label="人员姓名：">
          <el-input placeholder="请输入" v-model="query.staffName" maxlength="10" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input placeholder="请输入" form-type="phone" v-model="query.phone" maxlength="15" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getDoctorList()">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetSearchInfo">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="doctorList" ref="multipleTable" :reserve-selection="true" @current-change="clickChange" tooltip-effect="dark" highlight-current-row stripe max-height="300">
        <el-table-column width="55" align="center">
          <template slot-scope="scope">
            <el-radio v-model="doctorInfo" :label="scope.row"><i></i></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="staffName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="jobType" label="类型" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.jobType === 0 ? "医生" : "IP医生"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
      </el-table>
      <base-pagination v-model="pageInfo" @size-change="getDoctorList" @current-change="getDoctorList" />
      <div slot="footer" >
        <el-button @click="back">返回</el-button>
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
      loading: true,
      currentRow: null,
      doctorList: [],
      doctorInfo: {},
      medicineFormID: "",
      formData: {},
      query: {
        staffName: "",
        phone: ""
      },
      pageInfo: {
        pageSize: 10,
        pageIndex: 1
      },
      formRules: {
        thirdSeatAgent: {
          required: true,
          message: "坐席工号不能为空"
        },
        phoneNum: {
          required: true,
          message: "坐席号码不能为空"
        },
        thirdSeatID: {
          required: true,
          message: "坐席ID不能为空"
        },
        thirdSeatName: {
          required: true,
          message: "坐席名不能为空"
        }
      },
      // 当前页
      currentPage: 1,
      pageTotal: 0
    };
  },
  created () {
    // this.getDoctorList();
  },
  activated () {
    // this.getDoctorList();
  },
  watch: {
    propdata () {
      let that = this;
      // this.doctorList = [];
      that.formData = JSON.parse(JSON.stringify(that.propdata));
      // this.feedback();
    }
  },
  methods: {
    back () {
      this.$emit("back", () => { });
      this.query = {
        staffName: "",
        phone: ""
      };
      this.formData = {};
      this.$refs.formVertify.resetFields();
    },
    getDoctorList () {
      this.loading = true;
      let bizInfo = {
        orgID: this.userInfo.orgID
      };
      let params = { ...this.pageInfo, ...this.query, ...bizInfo };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_STAFFLISTWITHJOBTYPE, { params })
        .then(res => {
          if (!res.data) return;
          this.doctorList = res.data.datas;
          this.pageInfo = res.data.pageInfo;
          this.feedback();
          this.loading = false;
        });
    },
    getDoctorListFun (staffName) {
      this.loading = true;
      let bizInfo = {
        orgID: this.userInfo.orgID,
        staffName: staffName,
        phone: ""
      };
      let params = { ...this.pageInfo, ...bizInfo };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_STAFFLISTWITHJOBTYPE, { params })
        .then(res => {
          if (!res.data) return;
          this.doctorList = res.data.datas;
          this.pageInfo = res.data.pageInfo;
          this.feedback();
          this.loading = false;
        });
    },
    resetSearchInfo () {
      this.query = {
        staffName: "",
        phone: ""
      };
    },
    clickChange (item) {
      this.doctorInfo = item;
    },
    feedback () {
      setTimeout(() => {
        this.doctorList.forEach(item => {
          if (this.formData.staffID === item.keyID) {
            this.doctorInfo = item;
          }
        });
      }, 100);
      // this.$refs.formVertify.resetFields();
    },
    // 点击提交处理
    save () {
      if (!this.formData.thirdSeatAgent) {
        this.$alert("坐席工号不能为空", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      if (!this.formData.phoneNum) {
        this.$alert("坐席号码不能为空", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      if (!this.formData.thirdSeatID) {
        this.$alert("坐席ID不能为空", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      if (!this.formData.thirdSeatName) {
        this.$alert("坐席名不能为空", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      if (this.doctorInfo.length === 0) {
        this.$alert("请选择需要坐席的人员", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      if (this.doctorInfo.length > 1) {
        this.$alert("一个坐席只能添加一个坐席人员哦", "温馨提示", {
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
        // 医生有keyID,坐席也有keyID,去掉重名的，只保留一个，医生keyID用staffID保存
        this.$set(this.doctorInfo, "staffID", this.doctorInfo.keyID);
        delete this.doctorInfo.keyID;
        this.formData = { ...this.formData, ...this.doctorInfo };
        this.$emit("save", this.formData);
        this.query = {
          staffName: "",
          phone: ""
        };
        this.$refs.formVertify.resetFields();
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
.el-table {
  margin-top: 30px;
}
.color-blue {
  color: #438bef;
  font-weight: 800;
}
</style>
