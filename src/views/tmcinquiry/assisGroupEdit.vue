<template>
  <div class="app-container">
    <div style="padding-top: 24px;width: 870px;margin: 0 auto">
      <base-loading :loading="screenLoading">
        <el-form ref="formStaff" :model="formData" :rules="formRules" label-width="150px">
          <el-form-item label="负责医生：" prop="doctorID">
            <el-select v-if="mode === 'C'" v-model="formData.doctorID" placeholder="请选择" filterable clearable class="w200">
              <el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <!-- <base-input v-if="mode === 'C'" v-model="formData.doctorName" label-name="负责医生" /> -->
            <el-select v-else v-model="formData.doctorName" disabled placeholder="请选择" filterable clearable class="w200">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <!-- <template v-else>{{formData.doctorName}}</template> -->
          </el-form-item>
          <el-form-item label="组名称备注：" prop="memo">
            <el-input v-model="formData.memo" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="IP医生成员：" prop="roleInfoList">
            <el-transfer v-model="roleInfoList" :titles="roleTitle" :data="roleData"></el-transfer>
          </el-form-item>
        </el-form>
      </base-loading>
      <div class="contain-flex justify-content-center form-input-width" style="margin: 0 auto;padding-top: 40px">
        <el-button @click="back">返回</el-button>
        <span></span>
        <el-button type="primary" :loading="screenLoading" class="margin-left-40" @click="validate">
          保存
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { optionalFormCopy } from "@/utils/tools";
export default {
  name: "assisGroupEdit",
  inject: ["close"],
  props: {
    // 页面显示模式：C（创建）；V只读查看；E（编辑）
    mode: {
      type: String,
      required: true,
      default () {
        return "C";
      }
    },
    // 查询主键
    keyID: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      params: {},
      options: [],
      formData: {},
      roleInfoList: [],
      doctorInfo: {},
      formRules: {},
      roleData: [],
      roleTitle: ["可选IP医生", "已有IP医生"],
      screenLoading: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    // 创建
    this.loadRoleList().then(() => {
      if (this.mode === "C") {
        this.loadStaffRole();
        return;
      }
      // 编辑查看
      if (this.mode === "E") {
        this.loadDetail();
      }
    });
  },
  // INTERFACE_TMC_POST_ASSISTANT_DOCTOR_LIST
  methods: {
    // 加载全部角色数据
    loadRoleList () {
      return new Promise((resolve, reject) => {
        let params = {
          jobType: 1,
          orgID: this.userInfo.orgID
        };
        this.$_http.get(this.$_API.INTERFACE_TMC_POST_ASSISTANT_DOCTOR, { params })
          .then(res => {
            if (!res.data) return;
            res.data.map((it, index) => {
              this.roleData.push({
                key: it.staffID,
                label: it.doctorName,
                detail: { assistantStaffID: it.staffID, assistantID: it.doctorID, assistantName: it.doctorName, addUser: it.addUser }
              });
            });
            // console.log(this.roleData, 333);
            resolve();
          });
      });
    },
    // 加载信息详情
    loadDetail () {
      if (this.screenLoading) {
        return;
      }
      let params = {
        keyID: this.keyID
      };
      this.screenLoading = true;
      this.$_http.get(this.$_API.INTERFACE_TMC_GET_ASSISTANT_GROUP_DETAIL, { params })
        .then(res => {
          if (!res.data) return;
          this.formData.memo = res.data.memo;
          let resData = optionalFormCopy(res.data);
          this.formData = { ...this.formData, ...resData };
          // console.log(resData);
          resData.members.map((it, index) => {
            this.roleData.push({
              key: it.assistantStaffID,
              label: it.assistantName,
              detail: { assistantStaffID: it.assistantStaffID, assistantID: it.assistantID, assistantName: it.assistantName, addUser: it.addUser }
            });
          });
          this.roleInfoList = resData.members.map((item, index) => {
            return item.assistantStaffID;
          });
          // console.log(resData, 11111);
        })
        .finally(it => {
          this.screenLoading = false;
        });
    },
    // 加载医生
    loadStaffRole () {
      if (this.screenLoading) {
        return;
      }
      let params = {
        jobType: 0,
        orgID: this.userInfo.orgID
      };
      this.screenLoading = true;
      this.$_http.get(this.$_API.INTERFACE_TMC_POST_ASSISTANT_DOCTOR, { params })
        .then(res => {
          if (!res.data) return;
          this.options = res.data.map((it, index) => {
            return {
              key: it.doctorID,
              value: it.doctorID,
              label: it.doctorName,
              detail: it.staffID
            };
          });
          // console.log(this.options);
        })
        .finally(it => {
          this.screenLoading = false;
        });
    },
    // 返回列表页
    back () {
      // 关闭当前页
      this.close().then(() => {
        this.$router.push("/user/assisGroup");
      });
    },
    // 验证表单
    validate () {
      if (this.screenLoading) {
        return;
      }
      this.$refs.formStaff.validate(valid => {
        if (!valid) {
          return;
        }
        this.saveStaff();
      });
    },
    // 保存表单
    saveStaff () {
      // console.log(this.formData.Name);
      if (!this.formData.doctorID) {
        this.$alert("您还未选择医生！", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      if (!this.formData.memo) {
        this.$alert("您还未添加备注！", "温馨提示", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
        return;
      }
      let apiStr = this.mode === "C" ? "ADD" : "SAVE";
      let msgStr = this.mode === "C" ? "添加" : "修改";
      if (this.mode === "C" && this.formData.doctorID) {
        this.options.forEach(item => {
          if (this.formData.doctorID === item.value) {
            this.formData.doctorID = item.value;
            this.formData.doctorName = item.label;
            this.formData.staffID = item.detail;
          }
        });
      }
      if (!this.formData.doctorStaffID) {
        this.formData["doctorStaffID"] = this.formData.staffID;
      }
      let params = {
        orgID: this.userInfo.orgID,
        doctorStaffID: this.formData.doctorStaffID,
        doctorID: this.formData.doctorID,
        doctorName: this.formData.doctorName,
        memo: this.formData.memo,
        groupStatus: "1"
      };
      if (this.mode === "C") {
        params.addUser = this.userInfo.keyID;
      }
      if (this.mode === "E") {
        params.keyID = this.formData.keyID;
        params.modifyUser = this.userInfo.keyID;
      }
      let members = this.roleData.map(it => {
        if (this.roleInfoList.includes(it.key)) {
          return it.detail;
        }
      });
      let membersArr = [];
      members.forEach(item => {
        if (item) {
          membersArr.push(item);
        }
      });
      this.$set(params, "members", membersArr);
      // console.log(params);
      // console.log(data);
      this.screenLoading = true;
      this.$_http
        .post(this.$_API[`INTERFACE_TMC_POST_ASSISTANT_GROUP_${apiStr}`], params)
        .then(res => {
          this.$_success(`${msgStr}IP医生成功`);
          // 重置表单
          this.$refs.formStaff.resetFields();
          // 返回列表页
          this.back();
        })
        .finally(() => {
          this.screenLoading = false;
        });
    }
  }
};
</script>
<style scoped>
.contain-flex {
  margin-left: 200px;
  margin-top: 50px;
}
</style>
