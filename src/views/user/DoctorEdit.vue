<template>
  <div class="app-container base-page">
    <div class="base-page_detail">
      <base-loading :loading="screenLoading">
        <div class="page-detail_title">医生详情</div>
        <el-form ref="formDoctor" :model="formData" :rules="formRules" label-width="150px">
          <el-form-item v-if="formData.auditStatusID === 3" label="审核不通过原因：" prop="refuseReason">{{formData.refuseReason}}
          </el-form-item>
          <el-form-item label="姓名：" prop="doctorName">
            <template v-if="readonly">{{formData.doctorName}}</template>
            <el-input v-else v-model="formData.doctorName" placeholder="请输入" clearable class="input_358"/>
          </el-form-item>
          <el-form-item label="医院：">{{userInfo.orgName}}</el-form-item>
          <el-form-item prop="jobType" label="从业类别：">
            <template v-if="readonly">{{formData.jobType == "0" ? "医生" : "IP医生"}}</template>
            <el-select v-else v-model="formData.jobType" placeholder="请选择" filterable clearable class="input_358">
              <el-option v-for="item in jobTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="执业类型：" prop="practiceCode">
            <template v-if="readonly">{{formData.practiceName}}</template>
            <select-dictionary v-else ref="practice" v-model="formData.practiceCode" system-code="DOCTOR" group-code="D_DOCTOR_DOCTOR_PRACTICE" class="input_358"/>
          </el-form-item>
          <el-form-item label="科室：" prop="sectionCode">
            <template v-if="readonly">{{formData.sectionName}}</template>
            <select-dictionary v-else ref="section" v-model="formData.sectionCode" system-code="MEDICAL" group-code="D_MEDICAL_SECTION" @change="sectionChange" class="input_358"/>
          </el-form-item>
          <el-form-item label="职称：" prop="titleCode">
            <template v-if="readonly">{{formData.titleName}}</template>
            <select-dictionary v-else ref="doctorTitle" v-model="formData.titleCode" system-code="DOCTOR" group-code="D_DOCTOR_DOCTOR_TITLE" class="input_358"/>
          </el-form-item>
          <el-form-item label="专治疾病：" prop="disease">
            <template v-if="readonly">{{diseaseList}}</template>
            <el-input v-else v-model="diseaseList" class="input_358" :show-word-limit="false" clearable placeholder="请输入专治疾病，用回车隔开，每条记录（每行）最多50个字" type="textarea" :maxlength="10000" :readonly="readonly" :disabled="!formData.sectionCode" />
          </el-form-item>
          <el-form-item label="擅长：" prop="goodAt">
            <template v-if="readonly">{{formData.goodAt || "无"}}</template>
            <el-input v-else v-model="formData.goodAt" class="input_358" placeholder="请输入" clearable type="textarea" :maxlength="100" :readonly="readonly" />
          </el-form-item>
          <el-form-item label="个人简介：" prop="briefDesc">
            <template v-if="readonly">{{formData.briefDesc || "无"}}</template>
            <el-input v-else v-model="formData.briefDesc" class="input_358" placeholder="请输入" clearable type="textarea" :readonly="readonly" />
          </el-form-item>
          <el-form-item label="工作照：" prop="photoUrl">
            <base-image v-if="readonly" :src="formData.photoUrl" @click="handlePictureCardPre(formData.photoUrl)">
            </base-image>
            <base-upload v-else ref="workPhoto" :data="certifyData1" accept=".jpg,.jpeg,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF" :limit="1" :file-list="workPhotoList" :on-success="workPhotoChange" :on-remove="workPhotoChange">
              <template #tip>
                <div class="el-upload__tip">*工作照将作为该医生的头像显示，建议上传正方形的清晰照片（建议大小500x500）</div>
              </template>
            </base-upload>
          </el-form-item>
          <el-form-item label="身份证号：" prop="idNumber">
            <template v-if="readonly">{{formData.idNumber}}</template>
            <!-- :maxlength="18" -->
            <el-input v-else v-model="formData.idNumber" class="input_358" placeholder="请输入" clearable  />
          </el-form-item>
          <el-form-item label="身份证正反面：" prop="idCard">
            <template v-if="readonly">
              <base-image :src="formData.idCard['ID-FRONT']" @click="handlePictureCardPre(formData.idCard['ID-FRONT'])">
              </base-image>
              <base-image :src="formData.idCard['ID-BACK']" @click="handlePictureCardPre(formData.idCard['ID-BACK'])">
              </base-image>
            </template>
            <div v-else class="contain-flex">
              <base-upload ref="ID-FRONT" :data="certifyData" :limit="1" :on-success="uploadSuccess(certifies[0])" :on-remove="uploadChange(certifies[0])" :file-list="certifyList['ID-FRONT']">
                <template #tip>
                  <div class="el-upload__tip">身份证国徽面</div>
                </template>
              </base-upload>
              <base-upload ref="ID-BACK" :data="certifyData" :limit="1" :on-success="uploadSuccess(certifies[1])" :on-remove="uploadChange(certifies[1])" class="margin-left-10" :file-list="certifyList['ID-BACK']">
                <template #tip>
                  <div class="el-upload__tip">身份证头像面</div>
                </template>
              </base-upload>
            </div>
          </el-form-item>
          <el-form-item label="执业证书编号：" prop="professionNo">
            <template v-if="readonly">{{formData.professionNo}}</template>
            <!-- form-type="number" :maxlength="30" show-word-limit -->
            <el-input v-else v-model="formData.professionNo" class="input_358" placeholder="请输入"  clearable/>
          </el-form-item>
          <el-form-item label="执业证书：" prop="PROFESSION">
            <template v-if="readonly">
              <base-image v-for="item of formData.PROFESSION" :key="item" :src="item" @click="handlePictureCardPre(item)">
              </base-image>
            </template>
            <base-upload v-else ref="PROFESSION" :data="certifyData" :limit="9" :on-success="uploadSuccess(certifies[2])" :on-remove="uploadChange(certifies[2])" :file-list="certifyList['PROFESSION']" />
          </el-form-item>
          <el-form-item label="资格证：" prop="QUALIFICATION">
            <template v-if="readonly">
              <base-image v-for="item of formData.QUALIFICATION" :key="item" :src="item" @click="handlePictureCardPre(item)"></base-image>
            </template>
            <base-upload v-else ref="QUALIFICATION" :data="certifyData" :limit="9" :on-success="uploadSuccess(certifies[3])" :on-remove="uploadChange(certifies[3])" :file-list="certifyList['QUALIFICATION']" />
          </el-form-item>
          <!-- <el-form-item label="职称证：" :prop="formData.titleCode <= 30 ? 'TITLE' : ''"> -->
          <el-form-item label="职称证：" prop="">
            <template v-if="readonly">
              <base-image v-for="item of formData.TITLE" :key="item" :src="item" @click="handlePictureCardPre(item)">
              </base-image>
            </template>
            <base-upload v-else ref="TITLE" :data="certifyData" :limit="9" :on-success="uploadSuccess(certifies[4])" :on-remove="uploadChange(certifies[4])" :file-list="certifyList['TITLE']" />
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
  name: "user-doctor-edit",
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
    },
    // 返回页面地址
    backUrl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      formData: {
        doctorName: "",
        sectionCode: "",
        titleCode: "",
        practiceCode: "",
        disease: [],
        goodAt: "",
        briefDesc: "",
        photoUrl: "",
        idNumber: "",
        idCard: {},
        professionNo: "",
        jobType: "",
        PROFESSION: [],
        QUALIFICATION: [],
        TITLE: []
      },
      jobTypeOptions: [
        { value: 0, label: "医生" },
        { value: 1, label: "IP医生" }
      ],
      workPhotoList: [],
      formRules: {
        doctorName: {
          required: true,
          message: "医生姓名不能为空"
        },
        jobType: {
          required: true,
          message: "请选择从业类别"
        },
        sectionCode: {
          required: true,
          message: "科室不能为空"
        },
        practiceCode: {
          required: true,
          message: "科室不能为空"
        },
        titleCode: {
          required: true,
          message: "职称不能为空"
        },
        disease: {
          required: true,
          validator: (rule, value, callback) => {
            if (value.length <= 0) {
              callback(new Error("专治疾病不能为空"));
              return;
            }
            // 是否长度超出
            const isExceed = value.some(it => it.diseaseName.length > 50);
            if (isExceed) {
              callback(new Error("每一条专治疾病信息的长度不能超过50个字"));
              return;
            }
            callback();
          }
        },
        goodAt: {
          required: true,
          message: "擅长不能为空"
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
        professionNo: {
          required: true,
          message: "执业证书编号不能为空"
        },
        PROFESSION: {
          required: true,
          validator: (rule, value, callback) => {
            if (value.length <= 0) {
              callback(new Error("执业证书不能为空"));
              return;
            }
            if (value.length < 2) {
              callback(new Error("请至少上传2页执业证书"));
              return;
            }
            callback();
          }
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
        },
        TITLE: {
          required: true,
          validator: (rule, value, callback) => {
            if (value.length <= 0) {
              callback(new Error("职称证不能为空"));
              return;
            }
            if (value.length < 2) {
              callback(new Error("请至少上传2页职称证"));
              return;
            }
            callback();
          }
        }
      },
      screenLoading: true,
      diseaseList: "",
      certifyList: {
        "ID-FRONT": [],
        "ID-BACK": [],
        PROFESSION: [],
        QUALIFICATION: [],
        TITLE: []
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
          certifyCode: "PROFESSION",
          certifyName: "执业证书"
        },
        {
          certifyCode: "QUALIFICATION",
          certifyName: "资格证书"
        },
        {
          certifyCode: "TITLE",
          certifyName: "职称证书"
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
        PROFESSION: [],
        QUALIFICATION: [],
        TITLE: []
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
    let loadList = [];
    loadList.push(this.loadDetail);
    if (this.mode !== "C") {
      loadList.push(this.loadDisease, this.loadCertifies);
    }
    this.$_http.all(...loadList).finally(it => {
      this.screenLoading = false;
    });
  },
  watch: {
    diseaseList (val) {
      // 检查专治疾病信息
      const list = val
        .trim()
        .split("\n")
        .map(it => ({
          diseaseName: it.trim()
        }))
        .filter(it => it.diseaseName);
      // 是否全是空格
      const isEmpty = list.every(it => !it.diseaseName);
      this.formData.disease = isEmpty ? [] : list;
    }
  },
  methods: {
    gettitleCode () {
      if (this.formData.titleCode <= 30) {
        return true;
      } else {
        return false;
      }
    },
    // 加载医生信息详情
    loadDetail () {
      let params = {
        keyID: this.keyID
      };
      let request = this.$_http.get(this.$_API.INTERFACE_USER_DOCTOR_GET, {
        params
      });
      request.then(res => {
        if (!res.data) return;
        let resData = optionalFormCopy(res.data);
        this.formData = { ...this.formData, ...resData };
        console.log(this.formData);
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
    // 获取医生专治疾病信息
    loadDisease () {
      let params = {
        doctorID: this.keyID
      };
      let request = this.$_http.get(
        this.$_API.INTERFACE_USER_DOCTOR_DISEASE_GET,
        { params }
      );
      request.then(res => {
        if (!res.data) return;
        if (res.data.length <= 0) {
          return;
        }
        const character = this.readonly ? "，" : "\n";
        this.diseaseList = res.data.map(it => it.diseaseName).join(character);
      });
      return request;
    },
    // 加载医生认证信息
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
          if (it.certifyCode === "PROFESSION" && it.certifyNo) {
            this.formData.professionNo = it.certifyNo;
          }
          // 初始化照片列表
          this.certifyList[it.certifyCode].push({
            certifyId: it.keyID,
            uid: it.photoFileID,
            url: it.photoUrl
          });
        });
      });
      return request;
    },
    // 监听科室选择改变
    sectionChange () {
      if (this.diseaseList) {
        this.diseaseList = "";
      }
    },
    // 工作照增删
    workPhotoChange () {
      const workPhotos = this.$refs.workPhoto.getSimpleFiles();
      this.formData.photoUrl = (workPhotos[0] && workPhotos[0].url) || "";
      this.$refs.formDoctor.validateField("photoUrl");
    },
    // 文件上传成功，保存到数据库
    uploadSuccess (target) {
      const _this = this;
      return (res, file) => {
        if (!res.data) return;
        _this.uploadChange(target)();
        let data = {
          keyID: _this.deletedIds[target.certifyCode][0] || "",
          doctorID: _this.keyID,
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
          _this.$refs.formDoctor.validateField("idCard");
          return;
        }
        _this.formData[target.certifyCode] = files;
        _this.$refs.formDoctor.validateField(target.certifyCode);
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
        this.$router.push(this.backUrl);
      });
    },
    // 验证表单
    validate () {
      if (this.screenLoading) {
        return;
      }
      this.$refs.formDoctor.validate(valid => {
        // 检查表单：医生信息
        if (!valid) {
          return;
        }
        this.saveDoctor();
      });
    },
    // 保存表单
    saveDoctor () {
      this.screenLoading = true;
      let requestList = [
        this.saveWorkPhoto,
        this.saveDoctorInfo,
        this.saveDisease,
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
    // 保存医生工作照
    saveWorkPhoto () {
      const workPhotos = this.$refs.workPhoto.getSimpleFiles();
      let data = {
        doctorID: this.keyID,
        photoFileID: workPhotos[0].uid,
        photoUrl: workPhotos[0].url
      };
      let request = this.$_http.post(
        this.$_API.INTERFACE_USER_DOCTOR_WORKPHOTO_SAVE,
        data
      );
      return request;
    },
    // 保存医生信息
    saveDoctorInfo () {
      let data = {
        doctorID: this.keyID,
        doctorName: this.formData.doctorName,
        jobType: this.formData.jobType,
        workPlace: this.userInfo.orgName,
        practiceCode: this.formData.practiceCode,
        sectionCode: this.formData.sectionCode,
        titleCode: this.formData.titleCode,
        goodAt: this.formData.goodAt,
        briefDesc: this.formData.briefDesc
      };
      data.sectionName = this.$refs.section.getDictName({
        dictCode: this.formData.sectionCode,
        systemCode: "MEDICAL",
        groupCode: "D_MEDICAL_SECTION"
      });
      data.practiceName = this.$refs.practice.getDictName({
        dictCode: this.formData.practiceCode,
        systemCode: "DOCTOR",
        groupCode: "D_DOCTOR_DOCTOR_PRACTICE"
      });
      data.titleName = this.$refs.doctorTitle.getDictName({
        dictCode: this.formData.titleCode,
        systemCode: "DOCTOR",
        groupCode: "D_DOCTOR_DOCTOR_TITLE"
      });
      let request = this.$_http.post(
        this.$_API.INTERFACE_USER_DOCTOR_INFO_SAVE,
        data
      );
      return request;
    },
    // 保存擅长疾病信息
    saveDisease () {
      let data = {
        doctorID: this.keyID,
        disease: this.formData.disease
      };
      let request = this.$_http.post(
        this.$_API.INTERFACE_USER_DOCTOR_DISEASE_SAVE,
        data
      );
      return request;
    },
    // 保存医生证书信息
    saveCertify () {
      const data = this.certifies.filter(it =>
        ["ID-BACK", "PROFESSION"].includes(it.certifyCode)
      );
      data.forEach(it => {
        it.doctorID = this.keyID;
        if (it.certifyCode === "PROFESSION") {
          it.certifyNo = this.formData.professionNo;
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
          this.$refs.formDoctor.resetFields();
          this.$_success("保存医生信息成功");
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

<style scoped>
.center-box {
  padding-top: 24px;
  margin: 0 auto;
  width: 600px;
}
</style>
