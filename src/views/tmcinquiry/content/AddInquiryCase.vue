<template>
  <div class="app-container base-page">
    <!-- 医生添加手记待开发 -->
    <div id="rpDetail" class="base-page_detail">
      <p class="page-detail_title">{{isEdit ? '编辑康复案例' : '添加康复案例'}}</p>
      <!-- <div style="margin-left: 26%"> -->
      <el-form ref="formDoctor" :model="addDoctorData" :rules="addDoctorRules" label-width="150px">
        <el-form-item label="可见科室：">
          <el-select v-model="addDoctorData.sectionID" placeholder="请选择" filterable clearable class="input_358"> 
            <el-option v-for="(item,index) in sections" :key="index" :label="item.hospitalSectionName" :value="item.keyID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可见医生：">
          <el-select v-model="addDoctorData.doctorStaffID" placeholder="请选择" filterable clearable class="input_358">
            <el-option v-for="(item,index) in staffList" :key="index" :label="item.staffName" :value="item.keyID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作者：" prop="authorID">
          <el-select v-model="addDoctorData.authorID" placeholder="请选择" filterable clearable class="input_358">
            <el-option v-for="(item,index) in authorList" :key="index" :label="item.staffName" :value="item.keyID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摘要：" prop="contentSummary">
          <el-input type="textarea" :rows="3" placeholder="请输入" v-model="addDoctorData.contentSummary" clearable class="input_358"></el-input>
        </el-form-item>
        <el-form-item label="设置发布时间：" prop="publishDate">
          <el-date-picker v-model="addDoctorData.publishDate" type="datetime" placeholder="请选择" default-time="8:00:00" clearable class="input_358"></el-date-picker>
        </el-form-item>
        <el-form-item label="案例详情" prop="content">
          <div>
            <editor-bar v-model="addDoctorData.content" :uploadImgParams="uploadImgParams"></editor-bar>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="return1()">取消</el-button>
          <el-button type="primary" @click="validate()">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDateTime } from "../../../filters";
import EditorBar from "../../../components/editoritem";
// import ajax from "axios";
export default {
  name: "content-addInquiryCase",
  inject: ["close"],
  components: { EditorBar },
  props: {
    keyID: {
      type: String,
      required: false
    },
    isEdit: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      uploadImgParams: {
        systemCode: "TMC",
        belongCode: "ARTICLE",
        belongID: ""
      },
      addDoctorData: {},
      sections: [],
      staffList: [],
      authorList: [],
      addDoctorRules: {
        authorID: {
          required: true,
          message: "医生不能为空"
        },
        contentSummary: {
          required: true,
          message: "摘要不能为空"
        },
        publishDate: {
          required: true,
          message: "发布时间不能为空"
        },
        content: {
          required: true,
          message: "文章详情不能为空"
        }
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  activated () {
    this.addDoctorData = {};
    this.$refs.formDoctor.resetFields();
    if (typeof this.keyID !== "undefined" && this.keyID !== "") {
      this.getDetail();
    }
  },
  created () {
    let loadList = [];
    if (typeof this.keyID !== "undefined" && this.keyID !== "") {
      loadList.push(this.getDetail());
    }
    loadList.push(this.getOrgSection());
    loadList.push(this.manufactureData());
    loadList.push(this.getStaffListByOrgID());
    loadList.push(this.getAuthorListByOrgID());
    this.$_http.all(...loadList).finally(it => { });
  },
  methods: {
    // 制造参数
    manufactureData () {
      this.uploadImgParams.belongID = this.userInfo.orgID;
    },
    // 获取医院下所有的医生
    getAuthorListByOrgID () {
      let params = {
        orgID: this.userInfo.orgID
      };
      this.$_http
        .get(this.$_API.INTERFACE_GET_HOSPITALSTAFF_GETSTAFFLISTBYORGID, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.authorList = res.data;
        });
    },
    getOrgSection () {
      this.$_http
        .get(this.$_API.INTERFACE_GET_SECTION_LIST, {
          params: {
            orgId: this.userInfo.orgID,
            disableStatus: 0
          }
        })
        .then(response => {
          if (!response.data) return;
          this.sections = response.data;
          let temp = {
            hospitalSectionName: "全部",
            keyID: ""
          };
          this.sections.splice(0, 0, temp);
        });
    },
    // 获取医院下所有的医生
    getStaffListByOrgID () {
      let params = {
        orgID: this.userInfo.orgID
      };
      this.$_http
        .get(this.$_API.INTERFACE_GET_HOSPITALSTAFF_GETSTAFFLISTBYORGID, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.staffList = res.data;
          let temp = {
            staffName: "全部",
            keyID: ""
          };
          this.staffList.splice(0, 0, temp);
        });
    },
    // 返回列表
    return1 () {
      this.close().then(() => {
        this.$router.push({ name: "content-tmcInquiryCase" });
      });
    },
    // 添加康复案例验证
    validate () {
      if (this.screenLoading) {
        return;
      }
      this.$refs.formDoctor.validate(valid => {
        if (!valid) {
          return;
        }
        if (typeof this.keyID !== "undefined" && this.keyID !== "") {
          this.updateinquiry();
        } else {
          this.addInquiry();
        }
      });
    },
    // 添加康复案例
    addInquiry () {
      let _this = this;
      let time = formatDateTime(_this.addDoctorData.publishDate);
      _this.addDoctorData.publishDate = time;
      _this.authorList.forEach(staff => {
        if (staff.keyID === _this.addDoctorData.authorID) {
          _this.addDoctorData.authorName = staff.staffName;
        }
        if (staff.keyID === _this.addDoctorData.doctorStaffID) {
          _this.addDoctorData.doctorName = staff.staffName;
        }
      });
      _this.sections.forEach(section => {
        if (section.keyID === _this.addDoctorData.sectionID) {
          _this.addDoctorData.sectionName = section.hospitalSectionName;
        }
      });
      let data = {
        orgID: _this.userInfo.orgID,
        ..._this.addDoctorData
      };
      _this.$_http
        .post(_this.$_API.INTERFACE_GET_INQUIRYCASE_ADD, data)
        .then(r => {
          if (!r.data) return;
          _this.$_success("添加成功...");
          _this.close().then(() => {
            _this.$router.push({
              name: "content-tmcInquiryCase",
              params: { isLoad: "Y" }
            });
          });
        });
    },
    // 获取康复案例
    getDetail () {
      let params = {
        keyID: this.keyID
      };
      this.$_http
        .get(this.$_API.INTERFACE_GET_INQUIRYCASE_DETAIL, { params })
        .then(res => {
          if (!res.data) return;
          console.log(res.data);
          this.addDoctorData = res.data;
          this.addDoctorData.sectionID = res.data.sectionID;
        });
    },
    updateinquiry () {
      let _this = this;
      let time = formatDateTime(_this.addDoctorData.publishDate);
      _this.addDoctorData.publishDate = time;
      _this.authorList.forEach(staff => {
        if (staff.keyID === _this.addDoctorData.authorID) {
          _this.addDoctorData.authorName = staff.staffName;
        }
        if (staff.keyID === _this.addDoctorData.doctorStaffID) {
          _this.addDoctorData.doctorName = staff.staffName;
        }
      });
      _this.sections.forEach(section => {
        if (section.keyID === _this.addDoctorData.sectionID) {
          _this.addDoctorData.sectionName = section.hospitalSectionName;
        }
      });
      let data = {
        keyID: _this.keyID,
        orgID: _this.userInfo.orgID,
        ..._this.addDoctorData
      };
      _this.$_http
        .post(_this.$_API.INTERFACE_GET_INQUIRYCASE_UPDATE, data)
        .then(r => {
          if (!r.data) return;
          _this.$_success("修改成功...");
          _this.close().then(() => {
            _this.$router.push({
              name: "content-tmcInquiryCase",
              params: { isLoad: "Y" }
            });
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#rpDetail {
  width: 100%;
  margin: 0 auto;
  // position: relative;
}
</style>
