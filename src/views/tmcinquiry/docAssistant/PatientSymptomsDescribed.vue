<template>
  <div style="height: 100%;padding: 10px">
    <base-loading :loading="tableLoading">
      <!--    添加症状描述-->
      <div id="addDescribedBox">
        <div class="addDescribedDiv" @click="isShowDescribedFun">
          <div class="pageTitle">{{symptomTitle}}</div>
          <div class="showDescribedInput" >
            <div v-if="isShowDescribed" class="flexRow">
              <!-- <span>隐藏</span>s -->
              <img src="../../../assets/image/tmcinquiry/shang.png" />
            </div>
            <div v-else class="flexRow">
              <!-- <span style="color: #438BEF;">展开</span> -->
              <img src="../../../assets/image/tmcinquiry/xia2.png" />
            </div>
          </div>
        </div>
        <div v-show="isShowDescribed">
          <base-input v-model.trim="symptom" type="textarea" placeholder="请输入" maxlength="200" :autosize="autosize" :show-word-limit="true" />
        </div>
        <div v-show="isShowDescribed" class="btnBox">
          <el-button  @click="saveSymptomFun">保存</el-button>
        </div>
        <div v-show="!isShowDescribed" style="margin-bottom: 20px">......</div>
      </div>
      <!--    历时症状-->
      <div id="historySymptomsBox">
        <div class="pageTitle">历史症状</div>
        <div v-if="symptomListData.length === 0" class="noData">暂无数据</div>
        <ul v-else>
          <li v-for="(item, index) in symptomListData" :key="index">
            <p>{{item.symptom}}</p>
            <span class="comTxtDate">{{item.staffName}}&nbsp;{{item.modifyTime | formatDateTime}}</span>
          </li>
        </ul>
      </div>
    </base-loading>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDateTime } from "../../../filters";
export default {
  name: "TMCInquiry-symptomsDescribed",
  filters: {
    formatDateTime
  },
  data () {
    return {
      tableLoading: false,
      isShowDescribed: true,
      symptomTitle: "添加症状描述",
      symptom: "",
      autosize: { minRows: 6, maxRows: 8 },
      symptomListData: []
    };
  },
  computed: {
    ...mapGetters(["userInfo", "tmc"])
  },
  created () {
    if (this.tmc.patientID) {
      this.getSymptomsDescribedListFun();
    }
  },
  activated () {
    if (this.tmc.patientID) {
      this.getSymptomsDescribedListFun();
    }
  },
  methods: {
    // 查询：症状描述列表
    getSymptomsDescribedListFun () {
      let params = {
        patientID: this.tmc.patientID,
        orgID: this.userInfo.orgID
      };
      this.tableLoading = true;
      this.$_http.get(this.$_API.INTERFACE_TMC_GET_PATIENT_SYMPTOM_LIST, { params }).then(res => {
        if (res.data) {
          this.symptomListData = res.data;
        } else {
          this.symptomListData = [];
        }
      }).finally(it => {
        this.tableLoading = false;
      });
    },
    // 操作：隐藏/显示文本域
    isShowDescribedFun () {
      this.isShowDescribed = !this.isShowDescribed;
    },
    // 操作：保存
    saveSymptomFun () {
      if (this.tableLoading) {
        return;
      }
      if (!this.symptom) {
        this.$notify.error({
          title: "提示",
          message: "请输入症状描述"
        });
        return;
      }
      let data = {
        patientID: this.tmc.patientID,
        orgID: this.userInfo.orgID,
        inquiryID: this.tmc.inquiryID,
        symptom: this.symptom,
        staffType: this.userInfo.jobType,
        staffID: this.userInfo.keyID,
        staffName: this.userInfo.staffName
      };
      let title = "确认保存患者症状描述吗";
      let message = "保存患者症状描述成功";
      let cancelMessage = "已取消保存患者症状描述";
      // 区分是编辑还是新增
      // if (this.editSymptomItem.keyID) {
      //   data.keyID = this.editSymptomItem.keyID;
      //   title = "确认编辑患者历史症状吗？";
      //   message = "编辑患者历史症状成功";
      //   cancelMessage = "已取消编辑患者历史症状";
      // } else {
      //   title = "确认保存患者症状描述吗？";
      //   message = "保存患者症状描述成功";
      //   cancelMessage = "已取消保存患者症状描述";
      // }
      this.$confirm(title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.tableLoading = true;
        this.$_http.post(this.$_API.INTERFACE_TMC_POST_PATIENT_SYMPTOM_SAVE, data).then(res => {
          this.$notify({
            title: "成功",
            message: message,
            type: "success"
          });
          this.symptom = "";
          this.getSymptomsDescribedListFun();
        }).finally(it => {
          this.tableLoading = false;
        });
      }).catch(() => {
        this.tableLoading = false;
        this.$notify.info({
          title: "已取消",
          message: cancelMessage
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  width: 460px;
}
.pageTitle {
  color: #555658;
  font-size:14px;
}
.noData {
  color: #787878;
  margin-top: 15px;
  text-align: center;
}
#addDescribedBox {
  .addDescribedDiv {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    cursor: pointer;
    .showDescribedInput {
      color: #787878;
      .flexRow {
        display: flex;
        flex-direction: row;
        align-items: center;
        span {
          font-size: 14px;
        }
        img {
          margin-left: 5px;
          width: 14px;
          height: 14px;
        }
      }
    }
  }
  .btnBox {
    width: 100%;
    height: 90px;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
#historySymptomsBox {
  ul {
    padding-left: 0;
    li {
      list-style-type: none;
      margin: 0 0 15px 0;
      border-bottom: 1px solid #eeeeee;
      padding-bottom: 10px;
      p {
        color: #242526;
        margin: 10px 0 10px 0;
        font-size:14px;
      }
      .comTxtDate {
        font-size: 12px;
        color: #86888b;
      }
    }
  }
}
</style>
