<template>
  <div class="app-container base-page">
    <!-- 添加患者分享待开发 -->
    <div id="rpDetail" class="base-page_detail">
      <p class="page-detail_title">添加患者分享</p>
      <div class="rp-detail_container">
        <el-form ref="formDoctor" :model="addDoctorData" :rules="addDoctorRules" class="rp-detail_form" label-width="150px">
          <el-form-item label="可见科室：">
            <el-select v-model="addDoctorData.sectionID" placeholder="请选择" clearable filterable class="input_358">
              <el-option v-for="(item,index) in sections" :key="index" :label="item.hospitalSectionName" :value="item.keyID"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可见医生：">
            <el-select v-model="addDoctorData.doctorStaffID" placeholder="请选择" clearable filterable class="input_358">
              <el-option v-for="(item,index) in staffList" :key="index" :label="item.staffName" :value="item.keyID">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传头像：" prop="patientFace">
            <base-upload :data="imgData" :limit="1" :on-success="uploadSuccess" :file-list="workPhotoList">
              <template #tip>
                <div class="el-upload__tip">建议上传图片尺寸120X120像素</div>
              </template>
            </base-upload>
          </el-form-item>
          <el-form-item label="患者姓名：" prop="patientName">
            <el-input v-model="addDoctorData.patientName" clearable placeholder="请输入" class="input_358"></el-input>
          </el-form-item>
          <el-form-item label="患者地址：" prop="patientAddress">
            <el-input v-model="addDoctorData.patientAddress" clearable placeholder="请输入" class="input_358"></el-input>
          </el-form-item>
          <el-form-item label="摘要：" prop="contentSummary">
            <el-input type="textarea" :rows="3" v-model="addDoctorData.contentSummary" clearable placeholder="请输入" class="input_358"></el-input>
          </el-form-item>
          <el-form-item label="详情页地址：" prop="detailUrl" id="input-Lengthen">
            <el-input type="text" placeholder="请输入" v-model="addDoctorData.detailUrl" maxlength="200" clearable class="input_358">
            </el-input>
            &emsp;&emsp; <el-button type="primary" @click="preview">预览</el-button>
          </el-form-item>
          <el-form-item label="设置发布时间：" prop="publishDate">
            <el-date-picker v-model="addDoctorData.publishDate" type="datetime" placeholder="请选择" default-time="8:00:00" clearable class="input_358">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="back()">取消</el-button>
            <el-button type="primary" @click="validate()">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDateTime } from "../../../filters";
export default {
  name: "content-addPatientShare",
  inject: ["close"],
  props: {
    keyID: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      addDoctorData: {
        patientFace: ""
      },
      sections: [],
      staffList: [],
      imgData: {
        systemCode: "TMC",
        belongCode: "CONTENT",
        belongID: "",
        width: 120,
        height: 120
      },
      addDoctorRules: {
        patientFace: {
          required: true,
          message: "患者头像不能为空"
        },
        patientName: {
          required: true,
          message: "患者姓名不能为空"
        },
        patientAddress: {
          required: true,
          message: "患者地址不能为空"
        },
        contentSummary: {
          required: true,
          message: "摘要不能为空"
        },
        detailUrl: {
          required: true,
          message: "详情页地址不能为空"
        },
        publishDate: {
          required: true,
          message: "发布时间不能为空"
        }
      },
      patientFace: "",
      dialogImageUrl: "",
      workPhotoList: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.manufactureData();
    this.getOrgSection();
    this.getStaffListByOrgID();
    if (typeof this.keyID !== "undefined" && this.keyID !== "") {
      this.getDetail();
    }
  },
  methods: {
    // 制造参数
    manufactureData () {
      this.imgData.belongID = this.userInfo.orgID;
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
    // 返回
    back () {
      this.close().then(() => {
        this.$router.push({ name: "content-tmcPatientShare" });
      });
    },
    // 操作：上传图片
    uploadSuccess (res) {
      if (!res.data) return;
      console.log(res);
      this.addDoctorData.patientFace = res.data.remoteAddress;
      console.log(this.addDoctorData.patientFace);
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
          this.updatePatientShare();
        } else {
          this.addPatientShare();
        }
      });
    },
    // 添加患者分享
    addPatientShare () {
      let _this = this;
      let time = formatDateTime(_this.addDoctorData.publishDate);
      _this.addDoctorData.publishDate = time;
      _this.staffList.forEach(staff => {
        if (staff.keyID === _this.addDoctorData.authorID) {
          _this.addDoctorData.authorName = staff.staffName;
        }
        if (staff.keyID === _this.addDoctorData.doctorStaffID) {
          _this.addDoctorData.doctorStaffName = staff.staffName;
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
        .post(_this.$_API.INTERFACE_GET_PATIENTSHARE_ADD, data)
        .then(r => {
          if (!r.data) return;
          _this.$_success("添加成功...");
          _this.close().then(() => {
            _this.$router.push({
              name: "content-tmcPatientShare",
              params: { isLoad: "Y" }
            });
          });
        });
    },
    updatePatientShare () {
      let _this = this;
      let time = formatDateTime(_this.addDoctorData.publishDate);
      _this.addDoctorData.publishDate = time;
      _this.staffList.forEach(staff => {
        if (staff.keyID === _this.addDoctorData.authorID) {
          _this.addDoctorData.authorName = staff.staffName;
        }
        if (staff.keyID === _this.addDoctorData.doctorStaffID) {
          _this.addDoctorData.doctorStaffName = staff.staffName;
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
        .post(_this.$_API.INTERFACE_GET_PATIENTSHARE_UPDATE, data)
        .then(r => {
          if (!r.data) return;
          _this.$_success("修改成功...");
          _this.close().then(() => {
            _this.$router.push({
              name: "content-tmcPatientShare",
              params: { isLoad: "Y" }
            });
          });
        });
    },
    // 获取患者分享
    getDetail () {
      let params = {
        keyID: this.keyID
      };
      this.$_http
        .get(this.$_API.INTERFACE_GET_PATIENTSHARE_DETAIL, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.addDoctorData = res.data;
          this.workPhotoList = [
            {
              uid: "",
              url: res.data.patientFace
            }
          ];
        });
    },
    // 预览
    preview () {
      if (
        typeof this.addDoctorData.detailUrl === "undefined" ||
        this.addDoctorData.detailUrl === ""
      ) {
        this.$_warning("请填写详情页地址...");
        return;
      }
      window.open(this.addDoctorData.detailUrl);
    }
  }
};
</script>

<style lang="scss" scoped>
#rpDetail {
  width: 60%;
  margin: 0 auto;
  position: relative;
}
.rp-detail_container {
  display: flex;
  justify-content: center;
  font-size: 14px;
}

.title {
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(42, 44, 48, 1);
  text-align: center;
  padding: 0;
  margin: 0;
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
