<template>
  <div class="app-container">
    <div class="center-box">
      <base-loading :loading="screenLoading">
        <el-form ref="formStaff" :model="formData" :rules="formRules" label-width="150px">
          <el-form-item label="姓名：" prop="staffName">
            <el-input v-model="formData.staffName" placeholder="请输入" clearable/>
          </el-form-item>
          <el-form-item label="手机号码：" prop="phone">
            <input-with-tip v-if="mode === 'C'" v-model="formData.phone" form-type="phone" label-name="" tip="初始密码为账号后六位" />
            <template v-else>{{formData.phone}}</template>
          </el-form-item>
          <el-form-item label="分配角色：" prop="roleInfoList">
            <el-transfer v-model="formData.roleInfoList" :titles="roleTitle" :data="roleData"></el-transfer>
          </el-form-item>
        </el-form>
      </base-loading>
      <div class="contain-flex justify-content-center form-input-width" style="margin: 40px auto">
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
import InputWithTip from "@/components/InputWithTip";
export default {
  name: "user-staff-edit",
  components: {
    InputWithTip
  },
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
      formData: {
        roleInfoList: []
      },
      formRules: {
        staffName: {
          required: true,
          message: "员工姓名不能为空"
        },
        phone: [
          {
            required: true,
            message: "手机号码不能为空"
          },
          {
            trigger: "blur",
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码（11位）"
          }
        ]
      },
      roleData: [],
      roleTitle: ["全部角色", "所属角色"],
      screenLoading: true
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    // 创建
    if (this.mode === "C") {
      this.loadRoleList().then(it => {
        this.screenLoading = false;
      });
      return;
    }
    // 编辑查看
    let loadList = [this.loadRoleList, this.loadDetail];
    this.$_http.all(...loadList).then(it => {
      this.loadStaffRole().finally(it => {
        this.screenLoading = false;
      });
    });
  },
  methods: {
    // 加载全部角色数据
    loadRoleList () {
      let params = {
        userTypeID: 1,
        orgId: this.userInfo.orgID
      };
      let request = this.$_http.get(this.$_API.INTERFACE_USER_ROLES, {
        params
      });
      request.then(res => {
        if (!res.data) return;
        this.roleData = res.data.map(it => {
          return {
            key: it.roleCode,
            label: it.roleName
          };
        });
      });
      return request;
    },
    // 加载员工信息详情
    loadDetail () {
      let params = {
        keyID: this.keyID
      };
      let request = this.$_http.get(this.$_API.INTERFACE_USER_STAFF_GET, {
        params
      });
      request.then(res => {
        if (!res.data) return;
        let resData = optionalFormCopy(res.data);
        this.formData = { ...this.formData, ...resData };
      });
      return request;
    },
    // 加载员工角色信息
    loadStaffRole () {
      let params = {
        staffID: this.formData.keyID
      };
      let request = this.$_http.get(this.$_API.INTERFACE_USER_STAFFROLE_GET, {
        params
      });
      request.then(res => {
        if (!res.data) return;
        let roleList = res.data.map(it => {
          return it.roleCode;
        });
        this.formData.roleInfoList = Array.from(new Set(roleList));
      });
      return request;
    },
    // 返回列表页
    back () {
      // 关闭当前页
      this.close().then(() => {
        this.$router.push("/user/staff");
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
      let apiStr = this.mode === "C" ? "ADD" : "UPDATE";
      let msgStr = this.mode === "C" ? "添加" : "修改";
      let data = JSON.parse(JSON.stringify(this.formData));
      data.orgID = this.userInfo.orgID;
      data.roleInfoList = this.formData.roleInfoList.map(it => {
        return {
          roleCode: it
        };
      });
      this.screenLoading = true;
      this.$_http
        .post(this.$_API[`INTERFACE_USER_STAFF_${apiStr}`], data)
        .then(res => {
          this.$_success(`${msgStr}员工成功`);
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

<style lang="scss" scoped>
.app-container /deep/ .el-transfer-panel {
  width: 300px !important;
}
.center-box {
  width: 930px;
  margin: 0 auto;
  padding-top: 24px;
}
</style>
