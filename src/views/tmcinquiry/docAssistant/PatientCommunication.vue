<template>
  <div style="height: 100%;padding:10px">
    <base-loading :loading="tableLoading">
      <!--    添加沟通记录-->
      <div id="addDescribedBox">
        <div class="addDescribedDiv" @click="isShowDescribedFun">
          <div class="pageTitle">添加沟通记录</div>
          <div class="showDescribedInput" >
            <div v-if="isShowDescribed" class="flexRow">
              <!-- <span>隐藏</span> -->
              <img src="../../../assets/image/tmcinquiry/shang.png" />
            </div>
            <div v-else class="flexRow">
              <!-- <span style="color: #438BEF;">展开</span> -->
              <img src="../../../assets/image/tmcinquiry/xia2.png" />
            </div>
          </div>
        </div>
        <div v-show="isShowDescribed">
          <el-input v-model.trim="record" type="textarea" placeholder="请在这里填写..." :autosize="autosize" />
        </div>
        <div class="imgbox">
          <base-upload ref="workPhoto" :data="certifyData" :limit="3" :file-list="photoImg" :class="{disabled:isMax}" :on-success="uploadSuccess" :on-remove="uploadChange" :on-change="change">
          </base-upload>
        </div>
        <div v-show="isShowDescribed" class="btnBox">
          <el-button type="primary" @click="saveRecordFun">保存</el-button>
        </div>
        <div v-show="!isShowDescribed" style="margin-bottom: 20px">......</div>
      </div>
      <!--    历时沟通记录-->
      <div id="historySymptomsBox">
        <div class="pageTitle">历史沟通记录</div>
        <div v-if="recordListData.length === 0" class="noData">暂无数据</div>
        <ul v-else>
          <li v-for="(item, index) in recordListData" :key="index">
            <div style="margin-bottom: 10px">
              <template v-if="!item.edit">
                <p v-if="item.subState && item.recordSub" style="display: inline;">{{item.recordSub}}...</p>
                <p v-else style="display: inline;">{{item.record}}</p>
                <div v-if="item.subState && item.recordSub" style="display: inline;margin-left: 20px; color: #438BEF;" @click="showRowsFun(item)">
                  <span class="showOrClose">展开</span>
                  <img class="topBottomIcon" src="../../../assets/image/tmcinquiry/xia2.png" />
                </div>
                <div v-else-if="!item.subState && item.recordSub" style="display: inline;margin-left: 20px; color: #438BEF;" @click="showRowsFun(item)">
                  <span class="showOrClose">收起</span>
                  <img class="topBottomIcon" src="../../../assets/image/tmcinquiry/shang2.png" />
                </div>
              </template>
              <template v-else>
                <el-input v-model.trim="item.record" type="textarea" placeholder="请输入" :autosize="autosize" clearable/>
              </template>
            </div>
            <div v-if="!item.edit">
              <el-image style="width: 112px; height: 112px;cursor:pointer;" v-for="(it,i) of item.patientContactImgList" :key="i" :src="it.imgUrl" @click="handlePictureCardPre(item)"></el-image>
              <base-image-pre-view :urlList="item.imgList" :visible="item.visible" @close="handlePictureCardPre(item)"></base-image-pre-view>
            </div>
            <div v-else>
              <div>
                <base-upload ref="workPhoto" :data="certifyData" :limit="3" :file-list="item.fileList" listType="picture-card" :class="{disabled:isMax}" :on-remove="uploadChange2" :on-change="change2">
                </base-upload>
              </div>
            </div>
            <div style="overflow: hidden" v-if="!item.edit">
              <div style="float: left;"><span class="comTxtDate">{{item.staffName}}&nbsp;{{item.addTime | formatDateTime}}</span></div>
              <div style="float: right;"><span style="color: #438BEF;cursor: pointer;font-size: 14px;" @click="handleUpdate(item)"><i class="el-icon-edit"></i>修改</span><span style="color: #86888B; margin-left: 20px;cursor: pointer;font-size: 14px;" @click="handleDel(item)"> <i class="el-icon-delete"></i>删除</span></div>
            </div>
            <div v-else>
              <div style="text-align: center;margin-top: 24px;">
                <el-button type="primary" @click="handleUpdateDate(item)">保存</el-button>
              </div>
            </div>
            <div style="clear:both;"></div>
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
  name: "TMCInquiry-communication",
  filters: {
    formatDateTime
  },
  data () {
    return {
      tableLoading: false,
      isShowDescribed: true,
      isMax: false,
      photoImg: [],
      certifyData: {
        systemCode: "TMC",
        belongCode: "CONTACT",
        belongID: ""
      },
      record: "",
      autosize: { minRows: 6, maxRows: 8 },
      recordListData: [],
      fileList: [],
      currentItem: {}
    };
  },
  computed: {
    ...mapGetters(["userInfo", "tmc"])
  },
  created () {
    if (this.tmc.patientID) {
      this.$set(this.certifyData, "belongID", this.tmc.patientID);
      this.getRecordDescribedListFun();
    }
  },
  activated () {
    if (this.tmc.patientID) {
      this.getRecordDescribedListFun();
    }
  },
  watch: {
    "tmc.saveChatLog" (val) {
      this.getRecordDescribedListFun();
    }
  },
  methods: {
    // 查看图片
    handlePictureCardPre (item) {
      item.visible = !item.visible;
    },
    // 查询：沟通记录列表
    getRecordDescribedListFun () {
      let params = {
        patientID: this.tmc.patientID,
        orgID: this.userInfo.orgID
      };
      this.tableLoading = true;
      this.$_http.get(this.$_API.INTERFACE_TMC_POST_GETCONTACTLIST, { params }).then(res => {
        if (res.data) {
          this.recordListData = res.data.data || [];
          this.changeRecordListDataFun();
        } else {
          this.recordListData = [];
        }
      }).finally(it => {
        this.tableLoading = false;
      });
    },
    // 转换：列表数据
    changeRecordListDataFun () {
      this.recordListData.forEach(item => {
        if (item.record && item.record.length > 75) {
          this.$set(item, "recordSub", item.record.substring(0, 65));
          this.$set(item, "subState", true);
        }
        this.$set(item, "visible", false);
        this.$set(item, "edit", false);
        let imgList = [];
        let fileList = [];
        if (item.patientContactImgList) {
          let tmp = item.patientContactImgList || [];
          tmp.map(tmpItem => {
            fileList.push({ name: "", imgID: tmpItem.imgID, url: tmpItem.imgUrl });
            imgList.push(tmpItem.imgUrl);
          });
          this.$set(item, "imgList", imgList);
          this.$set(item, "fileList", fileList);
        }
      });
    },
    handleUpdate (item) {
      item.edit = true;
      this.currentItem = item;
    },
    // 删除
    async handleDel (item) {
      this.$confirm("确认删除沟通记录吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        try {
          this.tableLoading = true;
          const res = await this.$_http.post(this.$_API.INTERFACE_TMC_POST_DELCONTACT, {
            keyID: item.keyID,
            orgID: this.userInfo.orgID
          });
          if (res.data) {
            this.$notify({
              title: "成功",
              message: "删除沟通记录成功",
              type: "success"
            });
            this.getRecordDescribedListFun();
          }
        } catch (error) {
        } finally {
          this.tableLoading = false;
        }
      });
    },
    // 操作：隐藏/显示文本域
    isShowDescribedFun () {
      this.isShowDescribed = !this.isShowDescribed;
    },
    handleUpdateDate (item) {
      if (this.tableLoading) {
        return;
      }
      if (!item.record) {
        this.$notify.error({
          title: "提示",
          message: "请输入沟通记录"
        });
      }
      let patientContactImgList = [];
      if (this.currentItem.fileList) {
        this.currentItem.fileList.map(item => {
          if (item.imgID) {
            patientContactImgList.push({ imgID: item.imgID, imgUrl: item.url });
          } else {
            patientContactImgList.push({ imgID: item.response.data.keyID, imgUrl: item.response.data.remoteAddress });
          }
        });
      }

      let data = {
        keyID: item.keyID,
        patientID: this.tmc.patientID, //
        orgID: this.userInfo.orgID,
        record: item.record,
        staffName: this.userInfo.staffName,
        inquiryID: this.tmc.patientID, // 患者id
        staffID: this.userInfo.keyID,
        staffType: "" + this.userInfo.staffTypeID,
        patientContactImgList: patientContactImgList
      };
      this.$confirm("确认修改沟通记录吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.tableLoading = true;
        this.$_http.post(this.$_API.INTERFACE_TMC_TOP_SAVECONTACT, data).then(res => {
          this.$notify({
            title: "成功",
            message: "修改沟通记录成功",
            type: "success"
          });
          this.getRecordDescribedListFun();
        }).finally(it => {
          this.tableLoading = false;
        });
      }).catch(() => {
        this.tableLoading = false;
        this.$notify.info({
          title: "已取消",
          message: "已取消修改沟通记录"
        });
      });
    },
    // 操作：保存
    saveRecordFun () {
      if (this.tableLoading) {
        return;
      }
      if (!this.record) {
        this.$notify.error({
          title: "提示",
          message: "请输入沟通记录"
        });
        return;
      }
      let patientContactImgList = [];
      this.fileList.map(item => {
        if (item.response) {
          patientContactImgList.push({ imgID: item.response.data.keyID, imgUrl: item.response.data.remoteAddress });
        }
      });
      let data = {
        patientID: this.tmc.patientID, //
        orgID: this.userInfo.orgID,
        record: this.record,
        staffName: this.userInfo.staffName,
        inquiryID: this.tmc.patientID, // 患者id
        staffID: this.userInfo.keyID,
        staffType: "" + this.userInfo.staffTypeID,
        patientContactImgList: patientContactImgList
      };
      this.$confirm("确认保存沟通记录吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.tableLoading = true;
        // this.$_http.post(this.$_API.INTERFACE_TMC_POST_PATIENT_CONTACT_SAVE, data).then(res => {
        this.$_http.post(this.$_API.INTERFACE_TMC_TOP_SAVECONTACT, data).then(res => {
          this.$notify({
            title: "成功",
            message: "保存沟通记录成功",
            type: "success"
          });
          this.record = "";
          this.photoImg = [];
          this.fileList = [];
          this.getRecordDescribedListFun();
        }).finally(it => {
          this.tableLoading = false;
        });
      }).catch(() => {
        this.tableLoading = false;
        this.$notify.info({
          title: "已取消",
          message: "已取消保存沟通记录"
        });
      });
    },
    // 操作：隐藏/显示某条历史沟通记录
    showRowsFun (item) {
      item.subState = !item.subState;
    },
    uploadSuccess (res) {
      if (!res.data) return;
      if (this.limitNum >= 0) {
        let parameter = {};
        parameter.imgID = res.data.keyID;
        parameter.imgUrl = res.data.remoteAddress;
        this.formData.imgID = res.data.keyID;
        this.formData.imgUrl = res.data.remoteAddress;
        parameter.orgID = this.userInfo.orgID;
      }
    },
    uploadChange (file, fileList) {
      this.fileList = fileList;
    },
    uploadChange2 (file, fileList) {
      this.currentItem.fileList = fileList;
    },
    change (file, fileList) {
      if (fileList.length >= 3) {
        this.isMax = true;
      }
      this.fileList = fileList;
    },
    change2 (file, fileList) {
      if (fileList.length >= 3) {
        this.isMax = true;
      }
      this.currentItem.fileList = fileList;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-upload-dragger {
  width: 146px;
  height: 146px;
}
.app-container {
  width: 460px;
}
.pageTitle {
  color: #555658;
}
.noData {
  color: #787878;
  margin-top: 15px;
  text-align: center;
}
#addDescribedBox {
  font-size: 14px;
  .addDescribedDiv {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .showDescribedInput {
      color: #787878;
      .flexRow {
        display: flex;
        flex-direction: row;
        align-items: center;
        span {
          font-size: 15px;
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
  .potoUpload {
    display: inline;
  }
}
#historySymptomsBox {
  ul {
    padding-left: 0;
    li {
      list-style-type: none;
      margin: 0 0 15px 0;
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 10px;
      p {
        color: #242526;
        margin: 10px 0 10px 0;
      }
      .comTxtDate {
        color: #86888b;
        font-size: 14px;
      }
      .showOrClose {
        color: #438bef;
        font-size: 14px;
      }
      .topBottomIcon {
        margin-left: 5px;
        width: 12px;
        height: 12px;
      }
    }
  }
}
.el-upload-list--picture-card .el-upload-list__item {
  width: 130px !important;
  height: 130px;
}
.imgbox {
  // width: 460px;
  margin-top: 15px;
}
</style>
