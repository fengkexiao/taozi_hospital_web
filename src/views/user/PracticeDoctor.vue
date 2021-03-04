<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">医生姓名：</span>
        <el-input v-model="query.doctorName" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">联系电话：</span>
        <el-input v-model="query.doctorPhone" maxlength="11" placeholder="请输入" clearable />
      </div>
      <div class="form-item">
        <span class="item-label">订单状态：</span>
        <el-select v-model="query.relStatusID" placeholder="请选择" filterable clearable>
          <el-option v-for="(item,index) in relStatusOptions" :key="index" :label="item.relStatusName" :value="item.relStatusID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getPraDocDataFun">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfoFun">重置</el-button>
      </div>
    </div>

    <base-title name="多点执业列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addPraDocBtn">添加</el-button>
    </div>
    <el-table :data="praDocData" stripe  :loading="tableLoading">
      <el-table-column prop="doctorName" label="医生姓名" align="center"></el-table-column>
      <el-table-column prop="doctorPhone" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="applyDirectionName" label="发起方式" align="center"></el-table-column>
      <el-table-column label="执业有效期" align="center">
        <template #default="{row}">
          {{ row.validDateBeg | formatDate}} 至 {{ row.validDateEnd | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="addUser" label="创建人" align="center"></el-table-column>
      <el-table-column prop="addTime" label="创建时间" align="center" width="155">
        <template #default="{row}">
          {{ row.addTime | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="relStatusName" label="状态" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" v-if="row.relStatusID === 0" @click="showDocApplyFun(row)">同意</span>
            <div class="line" v-if="row.relStatusID === 0"></div>
            <template v-if="row.relStatusID === 1">
              <span class="opt-text" @click="importSMSFun(row)">输入邀请码</span>
              <div class="line"></div>
              <span class="opt-text" @click="sendSMSFun(row)">重新发送邀请码</span>
              <div class="line"></div>
            </template>
            <span class="opt-text" @click="toDoctorDetailFun(row)">医生资料</span>
          </div>
        </template>

      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getPraDocDataFun" @current-change="getPraDocDataFun" />
    <!--      添加-->
    <el-dialog title="添加已多点执业医生" :visible.sync="dialogVisible" width="30%" style="min-width: 470px" @close="closeDialog">
      <el-form :model="addInfo" inline :rules="formRules" ref="formDoctor" label-width="165px" style="text-align: center">
        <el-form-item prop="doctorPhone" label="医生电话：">
          <el-input v-model="addInfo.doctorPhone" maxlength="11" placeholder="请输入" clearable class="w200"/>
        </el-form-item>
        <el-form-item prop="validDateBeg" label="执业有效期开始时间：">
          <el-date-picker v-model="addInfo.validDateBeg" type="date" placeholder="开始时间" clearable class="w200"> </el-date-picker>
        </el-form-item>
        <el-form-item prop="validDateEnd" label="执业有效期结束时间：">
          <el-date-picker v-model="addInfo.validDateEnd" type="date" placeholder="结束时间" clearable class="w200"></el-date-picker>
        </el-form-item>
      </el-form>
      <div style="color: #FF0000;">
        注：录入信息并点击“确认”后，我们将向医生发送短信邀请码。录入正确的短信邀请码即可完成该医生多点执业绑定
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addPraDocFun">确定</el-button>
      </span>
    </el-dialog>
    <!--      输入邀请码-->
    <el-dialog title="输入邀请码" :visible.sync="dialogVisibleTwo" width="30%" style="min-width: 470px" @close="closeDialogTwo">
      <el-form :model="invitationCode" :rules="formRules" ref="formInvitationCode" inline style="text-align: center">
        <el-form-item prop="code" label="邀请码：">
          <el-input v-model.trim="invitationCode.code" placeholder="请输入" clearable class="w200"/>
        </el-form-item>
      </el-form>
      <div style="color: #FF0000;text-align: center;">
        注：录入正确的短信邀请码即可完成该医生多点执业绑定
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleTwo = false">取消</el-button>
        <el-button type="primary" @click="passPraDocFun">确定</el-button>
      </span>
    </el-dialog>
    <!--      同意医生执业申请-->
    <el-dialog title="同意医生多点执业申请" :visible.sync="dialogVisibleThree" width="30%" style="min-width: 470px" @close="closeDialogThree">
      <el-form :model="doctorApplyInfo" inline :rules="formRules" ref="agreeDocApply" label-width="165px" style="text-align: center">
        <el-form-item prop="doctorPhone" label="医生电话：">
          <el-input v-model="doctorApplyInfo.doctorPhone" form-type="phone" label-name="医生电话" :disabled="true" class="w200"/>
        </el-form-item>
        <el-form-item prop="validDateBeg" label="执业有效期开始时间：">
          <el-date-picker v-model="doctorApplyInfo.validDateBeg" type="date" placeholder="开始时间" class="w200"></el-date-picker>
        </el-form-item>
        <el-form-item prop="validDateEnd" label="执业有效期结束时间：">
          <el-date-picker v-model="doctorApplyInfo.validDateEnd" type="date" placeholder="结束时间" class="w200"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleThree = false">取消</el-button>
        <el-button type="primary" @click="agreeDocApplyFun">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDate } from "../../filters";

export default {
  name: "user-practice-doctor",
  data () {
    return {
      query: {
        relStatusID: ""
      },
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0,
        totalPage: 1
      },
      tableLoading: false,
      praDocDataOld: [],
      praDocData: [],
      dialogVisible: false,
      dialogVisibleTwo: false,
      searchState: false,
      relStatusOptions: [
        { relStatusID: "", relStatusName: "全部" },
        { relStatusID: 0, relStatusName: "医生发起申请" },
        { relStatusID: 1, relStatusName: "医院发起申请" },
        { relStatusID: 2, relStatusName: "医生拒绝申请" },
        { relStatusID: 3, relStatusName: "医院拒绝申请" },
        { relStatusID: 4, relStatusName: "同意申请" }
      ],
      addInfo: {},
      // 电话号码正则及提示
      formRules: {
        doctorPhone: [
          {
            required: true,
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码（11位）"
          }
        ],
        validDateBeg: [
          {
            required: true,
            message: "请输入执业有效期开始时间"
          }
        ],
        validDateEnd: [
          {
            required: true,
            message: "请输入执业有效期结束时间"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入验证码"
          }
        ]
      },
      // 邀请码
      invitationCode: {},
      smsPhone: "",
      // 审核医生申请的信息
      dialogVisibleThree: false,
      doctorApplyInfo: {
        doctorPhone: "",
        rejectReason: "",
        validDateBeg: "",
        validDateEnd: ""
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  inject: ["reload"],
  created () {
    // 加载表格
    this.getPraDocDataFun();
  },
  activated () {
    if (this.searchState) {
      this.getPraDocDataFun();
    }
  },
  methods: {
    // 操作：重置
    resetSearchInfoFun () {
      this.query = {
        relStatusID: ""
      };
    },
    // 查询：获取医生列表数据，加载表格
    getPraDocDataFun () {
      if (this.tableLoading) {
        return;
      }
      let bizInfo = {
        orgID: this.userInfo.orgID
      };
      let params = { ...this.pageInfo, ...this.query, ...bizInfo };
      this.tableLoading = true;
      this.$_http.get(this.$_API.INTERFACE_SHARE_ROOM_PRACTICE_LIST, { params }).then(res => {
        if (!res.data) return;
        this.praDocData = res.data.datas;
        this.pageInfo = res.data.pageInfo;
        this.searchState = true;
      }).finally(it => {
        this.tableLoading = false;
      });
    },
    // 操作：点击【添加】按钮
    addPraDocBtn () {
      this.dialogVisible = true;
    },
    // 确认添加
    addPraDocFun () {
      this.$refs.formDoctor.validate(valid => {
        if (!valid) {
          return;
        }
        let isHave = false;
        this.praDocData.forEach(item => {
          if (item.doctorPhone === this.addInfo.doctorPhone) {
            isHave = true;
          }
        });
        if (isHave) {
          this.$_warning("已添加该医生多点执业");
          return;
        }
        let params = {
          phone: this.addInfo.doctorPhone
        };
        this.tableLoading = true;
        // 根据电话查询医生ID
        this.$_http.get(this.$_API.INTERFACE_SHARE_ROOM_DOCTOR_BY_PHONE, { params }).then(res => {
          if (!res.data || !res.data.keyID) {
            this.$_error("没有该医生电话信息");
            return;
          }
          let params = {
            keyID: res.data.keyID
          };
          // 根据医生ID查询医生信息
          this.$_http.get(this.$_API.INTERFACE_SHARE_ROOM_DOCTOR_BY_KEYID, { params }).then(res => {
            if (!res.data || !res.data.doctorID) {
              this.$_error("数据异常，请联系管理员核对医生信息准确度");
              return;
            }
            let docInfo = {
              doctorPhone: this.addInfo.doctorPhone,
              validDateBeg: formatDate(this.addInfo.validDateBeg),
              validDateEnd: formatDate(this.addInfo.validDateEnd)
            };
            docInfo.orgID = this.userInfo.orgID;
            docInfo.doctorID = res.data.doctorID;
            docInfo.doctorName = res.data.doctorName;
            docInfo.sectionCode = res.data.sectionCode;
            docInfo.sectionName = res.data.sectionName;
            docInfo.relStatusID = 1;
            docInfo.relStatusName = "医院发起申请";
            docInfo.isMainPractice = 0;
            docInfo.isDisable = 0;
            docInfo.addUser = this.userInfo.staffName;
            // 添加医生多点执业
            this.$_http.post(this.$_API.INTERFACE_SHARE_ROOM_PRACTICE_ADD, docInfo).then(res => {
              // 发送验证码
              let codeInfo = { phone: this.addInfo.doctorPhone };
              this.$_http.post(this.$_API.INTERFACE_SHARE_ROOM_PRACTICE_SMS, codeInfo).then(res => {
                this.dialogVisible = false;
                this.getPraDocDataFun();
              });
            });
          });
        }, () => {
          this.$_error("没有该医生电话信息！");
        }).finally(it => {
          this.tableLoading = false;
        });
      });
    },
    // 操作：点击【详情】按钮
    toDoctorDetailFun (row) {
      if (!row || !row.doctorID) {
        this.dataError();
        return;
      }
      let mode = "V";
      this.$router.push({
        name: "user-doctor-edit",
        params: { keyID: row.doctorID, mode, backUrl: "/user/practiceDoctor" }
      });
    },
    // 操作：输入邀请码
    importSMSFun (row) {
      this.smsPhone = row.doctorPhone;
      this.dialogVisibleTwo = true;
    },
    // 操作：确认提交邀请码审核
    passPraDocFun () {
      this.$refs.formInvitationCode.validate(valid => {
        if (!valid) {
          return;
        }
        let passInfo = {
          phone: this.smsPhone,
          code: this.invitationCode.code
        };
        this.tableLoading = true;
        this.$_http.post(this.$_API.INTERFACE_SHARE_ROOM_PRACTICE_VALIDATE, passInfo).then(res => {
          this.dialogVisibleTwo = false;
          this.reload();
        }).finally(it => {
          this.tableLoading = false;
        });
      });
    },
    // 操作：重新发送邀请码
    sendSMSFun (row) {
      let codeInfo = {
        phone: row.doctorPhone
      };
      this.$_http.post(this.$_API.INTERFACE_SHARE_ROOM_PRACTICE_SMS, codeInfo).then(res => {
        this.dialogVisible = false;
      });
    },
    // 关闭对话框
    closeDialog () {
      this.$refs.formDoctor.resetFields();
    },
    closeDialogTwo () {
      this.$refs.formInvitationCode.resetFields();
      this.invitationCode = {};
      this.smsPhone = "";
    },
    closeDialogThree () {
      this.$refs.agreeDocApply.resetFields();
    },
    // 操作：医院同意医生发起的申请
    showDocApplyFun (row) {
      if (!row || !row.keyID) {
        return;
      }
      this.doctorApplyInfo.keyID = row.keyID;
      this.doctorApplyInfo.doctorPhone = row.doctorPhone;
      this.doctorApplyInfo.validDateBeg = new Date(row.addTime);
      this.doctorApplyInfo.validDateEnd = new Date("2050-01-01");
      this.dialogVisibleThree = true;
    },
    // 操作：确认同意医生发起的申请
    agreeDocApplyFun () {
      let params = {
        keyID: this.doctorApplyInfo.keyID,
        relStatusID: "4",
        relStatusName: "同意申请",
        rejectReason: "",
        validDateBeg: formatDate(this.doctorApplyInfo.validDateBeg),
        validDateEnd: formatDate(this.doctorApplyInfo.validDateEnd)
      };
      this.tableLoading = true;
      this.$_http.post(this.$_API.INTERFACE_SHARE_ROOM_PRACTICE_APPLY, params).then(res => {
        this.dialogVisibleThree = false;
        this.getPraDocDataFun();
        this.$_success("同意医生多点执业申请成功");
      }).finally(it => {
        this.tableLoading = false;
      });
    },
    // 表格数据错误时的处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.getPraDocDataFun();
    }
  }
};
</script>
