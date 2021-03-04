<template>
  <div class="app-container base-page">
    <div class="base-page_detail">
      <base-loading :loading="screenLoading">
      <div class="page-detail_title">药师详情</div>
        <el-form ref="fromPharmacist" :model="formData" :rules="formRules" label-width="150px">
          <el-form-item v-if="formData.auditStatusID === 3" label="审核不通过原因：" prop="refuseReason">{{formData.refuseReason}}</el-form-item>
          <el-form-item label="姓名：" prop="doctorName">
            <template v-if="readonly">{{formData.doctorName}}</template>
            <el-input v-else v-model="formData.doctorName" placeholder="请输入" clearable  class="input_358"/>
          </el-form-item>
          <el-form-item label="医院：">{{userInfo.orgName}}</el-form-item>
          <el-form-item label="职称：" prop="titleCode">
            <template v-if="readonly">{{formData.titleName}}</template>
            <select-dictionary v-else ref="pharmacistTitle" v-model="formData.titleCode" system-code="DOCTOR" group-code="D_DOCTOR_PHARMACIST_TITLE"  class="input_358"/>
          </el-form-item>
          <el-form-item label="类别：" prop="categoryCode">
            <template v-if="readonly">{{formData.categoryName}}</template>
            <select-dictionary v-else ref="pharmacistCategory" v-model="formData.categoryCode" system-code="DOCTOR" group-code="D_DOCTOR_PHARMACIST_PRACTICE"  class="input_358"/>
          </el-form-item>
          <el-form-item label="个人简介：" prop="briefDesc">
            <template v-if="readonly">{{formData.briefDesc || "无"}}</template>
            <el-input v-else v-model="formData.briefDesc" placeholder="请输入" clearable type="textarea" :readonly="readonly"  class="input_358"/>
          </el-form-item>
          <el-form-item label="工作照：" prop="photoUrl">
            <base-image v-if="readonly" :src="formData.photoUrl" @click="handlePictureCardPre(formData.photoUrl)"></base-image>
            <base-upload v-else ref="workPhoto" :data="certifyData1" :limit="1" :file-list="workPhotoList" :on-success="workPhotoChange" :on-remove="workPhotoChange">
              <template #tip>
                <div class="el-upload__tip">*工作照将作为该药师的头像显示，建议上传正方形的清晰照片（建议大小500x500）</div>
              </template>
            </base-upload>
          </el-form-item>
          <el-form-item label="身份证号：" prop="idNumber">
            <template v-if="readonly">{{formData.idNumber}}</template>
            <!-- :maxlength="18" -->
            <el-input v-else v-model="formData.idNumber" placeholder="请输入" clearable  class="input_358" />
          </el-form-item>
          <el-form-item label="身份证正反面：" prop="idCard">
            <template v-if="readonly">
              <base-image :src="formData.idCard['ID-FRONT']" @click="handlePictureCardPre(formData.idCard['ID-FRONT'])"></base-image>
              <base-image :src="formData.idCard['ID-BACK']" @click="handlePictureCardPre(formData.idCard['ID-BACK'])"></base-image>
            </template>
            <div v-else class="contain-flex">
              <base-upload ref="ID-FRONT" :data="certifyData" :limit="1" :on-success="uploadSuccess(certifies[0])" :on-remove="uploadChange(certifies[0])" :file-list="certifyList['ID-FRONT']">
                <template #tip>
                  <div class="el-upload__tip">身份证国徽面</div>
                </template>
              </base-upload>
              <base-upload ref="ID-BACK" :data="certifyData" :limit="1" :on-success="uploadSuccess(certifies[1])" class="margin-left-10" :on-remove="uploadChange(certifies[1])" :file-list="certifyList['ID-BACK']">
                <template #tip>
                  <div class="el-upload__tip">身份证头像面</div>
                </template>
              </base-upload>
            </div>
          </el-form-item>
          <el-form-item label="资格证书编号：" prop="qualificationNo">
            <template v-if="readonly">{{formData.qualificationNo}}</template>
            <!-- form-type="number" :maxlength="30" -->
            <el-input v-else v-model="formData.qualificationNo" placeholder="请输入" clearable  class="input_358" />
          </el-form-item>
          <el-form-item label="资格证书：" prop="QUALIFICATION">
            <template v-if="readonly">
              <base-image v-for="item of formData.QUALIFICATION" :key="item" :src="item" @click="handlePictureCardPre(item)"></base-image>
            </template>
            <base-upload v-else ref="QUALIFICATION" :data="certifyData" :limit="9" :on-remove="uploadChange(certifies[2])" :on-success="uploadSuccess(certifies[2])" :file-list="certifyList['QUALIFICATION']" />
          </el-form-item>
        </el-form>
      </base-loading>
      <div class="contain-flex justify-content-center form-input-width" style="margin: 0 auto;padding-bottom: 24px">
        <el-button @click="back">返回</el-button>
        <span></span>
        <el-button v-if="!readonly" :loading="screenLoading" type="primary" class="margin-left-40" @click="validate">提交审核</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="94%" :src="dialogImageUrl" style="margin-left: 3%" />
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import SelectDictionary from "@/components/SelectDictionary";
import { optionalFormCopy } from "@/utils/tools";
// import { REGULAR_EXPRESSION_IDNUMBER } from "@/common/Constant";
export default {
  name: "user-pharmacist-edit",
  components: {
    SelectDictionary
  },
  inject: ["close"],
  props: {
    // 页面显示模式：C（创建）；V只读查看；E（编辑）
    mode: {
      type: String,
      required: true,
      default () {
        return "V";
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
        doctorName: "",
        titleCode: "",
        categoryCode: "",
        briefDesc: "",
        photoUrl: "",
        idNumber: "",
        idCard: {},
        qualificationNo: "",
        QUALIFICATION: []
      },
      formRules: {
        doctorName: {
          required: true,
          message: "药师姓名不能为空"
        },
        titleCode: {
          required: true,
          message: "职称不能为空"
        },
        categoryCode: {
          required: true,
          message: "类别不能为空"
        },
        briefDesc: {
          required: true,
          message: "个人简介不能为空"
        },
        photoUrl: {
          required: true,
          message: "工作照不能为空"
        },
        idNumber: [
          {
            required: true,
            message: "身份证号不能为空"
          }
          // {
          //   trigger: "blur",
          //   pattern: REGULAR_EXPRESSION_IDNUMBER,
          //   message: "请输入正确的身份证号"
          // }
        ],
        idCard: {
          required: true,
          validator: (rule, value, callback) => {
            const notFront = !value["ID-FRONT"];
            const notBack = !value["ID-BACK"];
            if (notFront && notBack) {
              callback(new Error("身份证正反面照片不能为空"));
              return;
            }
            if (notFront) {
              callback(new Error("身份证国徽面照片不能为空"));
              return;
            }
            if (notBack) {
              callback(new Error("身份证头像面照片不能为空"));
              return;
            }
            callback();
          }
        },
        qualificationNo: {
          required: true,
          message: "资格证书编号不能为空"
        },
        QUALIFICATION: {
          required: true,
          validator: (rule, value, callback) => {
            if (value.length <= 0) {
              callback(new Error("资格证不能为空"));
              return;
            }
            if (value.length < 2) {
              callback(new Error("请至少上传2页资格证"));
              return;
            }
            callback();
          }
        }
      },
      screenLoading: true,
      workPhotoList: [],
      certifyList: {
        "ID-FRONT": [],
        "ID-BACK": [],
        QUALIFICATION: []
      },
      certifies: [
        {
          certifyCode: "ID-FRONT",
          certifyName: "身份证正面"
        },
        {
          certifyCode: "ID-BACK",
          certifyName: "身份证反面"
        },
        {
          certifyCode: "QUALIFICATION",
          certifyName: "资格证书"
        }
      ],
      certifyData: {
        systemCode: "DOCTOR",
        belongCode: "CERTIFY",
        belongID: this.keyID
      },
      certifyData1: {
        systemCode: "DOCTOR",
        belongCode: "CERTIFY",
        belongID: this.keyID,
        width: 500,
        height: 500
      },
      deletedIds: {
        "ID-FRONT": [],
        "ID-BACK": [],
        QUALIFICATION: []
      },
      dialogVisible: false,
      dialogImageUrl: ""
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    // 是否只读
    readonly () {
      return this.mode === "V";
    }
  },
  created () {
    let loadList = [this.loadDetail];
    if (this.mode !== "C") {
      loadList.push(this.loadCertifies);
    }
    this.$_http.all(...loadList).finally(it => {
      this.screenLoading = false;
    });
  },
  methods: {
    // 加载药师信息详情
    loadDetail () {
      let params = {
        keyID: this.keyID
      };
      let request = this.$_http.get(this.$_API.INTERFACE_USER_PHARMACIST_GET, {
        params
      });
      request.then(res => {
        if (!res.data) return;
        let resData = optionalFormCopy(res.data);
        this.formData = { ...this.formData, ...resData };
        if (!resData.photoFileID || !resData.photoUrl) return;
        this.workPhotoList = [
          {
            uid: resData.photoFileID,
            url: resData.photoUrl
          }
        ];
      });
      return request;
    },
    // 加载药师认证信息
    loadCertifies () {
      let params = {
        doctorID: this.keyID
      };
      let request = this.$_http.get(
        this.$_API.INTERFACE_USER_DOCTOR_CERTIFY_GET,
        { params }
      );
      request.then(res => {
        if (!res.data) return;
        // 资质照片
        res.data.forEach(it => {
          if (!it.photoUrl) {
            this.deletedIds[it.certifyCode].push(it.keyID);
            return;
          }
          // 是否是身份证
          const isIDCard =
            it.certifyCode === "ID-FRONT" || it.certifyCode === "ID-BACK";
          if (isIDCard) {
            this.formData.idCard[it.certifyCode] = it.photoUrl;
          } else {
            this.formData[it.certifyCode].push(it.photoUrl);
          }
          if (it.certifyCode === "ID-BACK" && it.certifyNo) {
            this.formData.idNumber = it.certifyNo;
          }
          if (it.certifyCode === "QUALIFICATION" && it.certifyNo) {
            this.formData.qualificationNo = it.certifyNo;
          }
          // 初始化照片列表
          this.certifyList[it.certifyCode].push({
            uid: it.photoFileID,
            url: it.photoUrl
          });
        });
      });
      return request;
    },
    // 工作照增删
    workPhotoChange () {
      const workPhotos = this.$refs.workPhoto.getSimpleFiles();
      this.formData.photoUrl = (workPhotos[0] && workPhotos[0].url) || "";
      this.$refs.fromPharmacist.validateField("photoUrl");
    },
    // 文件上传成功
    uploadSuccess (target) {
      const _this = this;
      return (res, file) => {
        if (!res.data) return;
        _this.uploadChange(target)();
        let data = {
          keyID: _this.deletedIds[target.certifyCode][0] || "",
          doctorID: this.keyID,
          certifyCode: target.certifyCode,
          certifyName: target.certifyName,
          photoFileID: res.data.keyID,
          photoUrl: res.data.remoteAddress
        };
        _this.$_http
          .post(_this.$_API.INTERFACE_USER_DOCTOR_CERTIFY_PHOTO, data)
          .then(r => {
            if (!r.data) return;
            file.certifyId = r.data.keyID;
            _this.deletedIds[target.certifyCode].shift();
          });
      };
    },
    // 资质证书增删
    uploadChange (target) {
      const _this = this;
      return file => {
        const files = _this.$refs[target.certifyCode].getSimpleFiles();
        // 是否是身份证
        const isIDCard =
          target.certifyCode === "ID-FRONT" || target.certifyCode === "ID-BACK";
        if (isIDCard) {
          _this.formData.idCard[target.certifyCode] =
            (files[0] && files[0].url) || "";
          _this.$refs.fromPharmacist.validateField("idCard");
          return;
        }
        _this.formData[target.certifyCode] = files;
        _this.$refs.fromPharmacist.validateField(target.certifyCode);
        // 加入删除列表
        _this.deleteCertify(file, target.certifyCode);
      };
    },
    deleteCertify (file, certifyCode) {
      if (!file) return;
      this.$_http
        .post(this.$_API.INTERFACE_USER_DOCTOR_CERTIFY_DEL, {
          keyIDs: file.certifyId
        })
        .then(() => this.deletedIds[certifyCode].push(file.certifyId));
    },
    // 返回列表页
    back () {
      // 关闭当前页
      this.close().then(() => {
        this.$router.push("/user/pharmacist");
      });
    },
    // 验证表单
    validate () {
      if (this.screenLoading) {
        return;
      }
      this.$refs.fromPharmacist.validate(valid => {
        // 检查表单：药师信息
        if (!valid) {
          return;
        }
        this.savePharmacist();
      });
    },
    // 保存表单
    savePharmacist () {
      this.screenLoading = true;
      let requestList = [
        this.saveWorkPhoto,
        this.saveNurseInfo,
        this.saveCertify
      ];
      this.$_http
        .all(...requestList)
        .then(() => {
          this.commit();
        })
        .finally(() => {
          this.screenLoading = false;
        });
    },
    // 保存药师工作照
    saveWorkPhoto () {
      const workPhotos = this.$refs.workPhoto.getSimpleFiles();
      let data = {
        doctorID: this.keyID,
        photoFileID: workPhotos[0].uid,
        photoUrl: workPhotos[0].url
      };
      let request = this.$_http.post(
        this.$_API.INTERFACE_USER_PHARMACIST_WORKPHOTO_SAVE,
        data
      );
      return request;
    },
    // 保存药师信息
    saveNurseInfo () {
      let data = {
        doctorID: this.keyID,
        doctorName: this.formData.doctorName,
        workPlace: this.userInfo.orgName,
        titleCode: this.formData.titleCode,
        categoryCode: this.formData.categoryCode,
        briefDesc: this.formData.briefDesc
      };
      data.titleName = this.$refs.pharmacistTitle.getDictName({
        dictCode: this.formData.titleCode,
        systemCode: "DOCTOR",
        groupCode: "D_DOCTOR_PHARMACIST_TITLE"
      });
      data.categoryName = this.$refs.pharmacistCategory.getDictName({
        dictCode: this.formData.categoryCode,
        systemCode: "DOCTOR",
        groupCode: "D_DOCTOR_PHARMACIST_PRACTICE"
      });
      let request = this.$_http.post(
        this.$_API.INTERFACE_USER_PHARMACIST_INFO_SAVE,
        data
      );
      return request;
    },
    // 保存药师证书信息
    saveCertify () {
      const data = this.certifies.filter(it =>
        ["ID-BACK", "QUALIFICATION"].includes(it.certifyCode)
      );
      data.forEach(it => {
        it.doctorID = this.keyID;
        if (it.certifyCode === "QUALIFICATION") {
          it.certifyNo = this.formData.qualificationNo;
        }
        if (it.certifyCode === "ID-BACK") {
          it.certifyNo = this.formData.idNumber;
        }
      });
      let request = this.$_http.post(
        this.$_API.INTERFACE_USER_DOCTOR_CERTIFY_SAVE,
        data
      );
      return request;
    },
    // 提交审核
    commit () {
      this.$_http
        .post(this.$_API.INTERFACE_USER_DOCTOR_REVIEW, {
          keyID: this.keyID
        })
        .then(() => {
          // 重置表单
          this.$refs.fromPharmacist.resetFields();
          this.$_success("保存药师信息成功");
          // 返回列表页
          this.back();
        })
        .finally(() => {
          this.screenLoading = false;
        });
    },
    handlePictureCardPre (val) {
      this.dialogImageUrl = val;
      this.dialogVisible = true;
    }
  }
};
</script>
