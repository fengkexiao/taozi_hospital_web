<template>
  <div class="app-container base-page">
    <div class="base-page_detail">
      <p class="page-detail_title">{{isEdit ? '编辑文章' : '添加文章'}}</p>
      <el-form ref="formDoctor" :model="addDoctorData" :rules="addDoctorRules" label-width="150px">
        <el-form-item label="可见科室：">
          <el-select v-model="addDoctorData.departmentCanSee" placeholder="请选择" filterable clearable class="input_358">
            <el-option v-for="(item,index) in sections" :key="index" :label="item.hospitalSectionName" :value="item.keyID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可见医生：">
          <el-select v-model="addDoctorData.doctorCanSee" placeholder="请选择" filterable clearable class="input_358">
            <el-option v-for="(item,index) in staffList" :key="index" :label="item.staffName" :value="item.keyID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章分类：" prop="classifyID">
          <el-select v-model="addDoctorData.classifyID" placeholder="请选择" filterable clearable class="input_358">
            <el-option v-for="(item,index) in classification" :key="index" :label="item.classifyName" :value="item.keyID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题：" prop="title">
          <el-input v-model="addDoctorData.title" placeholder="请输入" clearable class="input_358"></el-input>
        </el-form-item>
        <el-form-item label="文章类型：" prop="articleType">
          <template>
            <el-radio-group v-model="articleType">
              <el-radio :label="0">文章</el-radio>
              <el-radio :label="1">视频</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="设置发布时间：" prop="publishDate">
          <el-date-picker v-model="addDoctorData.publishDate" type="datetime" placeholder="请选择" default-time="8:00:00" clearable class="input_358"></el-date-picker>
        </el-form-item>
        <template v-if="articleType == 1">
          <el-form-item label="视频地址：" id="input-Lengthen" prop="articleUrl">
            <el-input type="text" placeholder="请输入" v-model="addDoctorData.articleUrl" maxlength="200" clearable class="input_358"></el-input>&emsp;&emsp;
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="文章详情" prop="content">
            <div>
              <editor-bar v-model="addDoctorData.content" :uploadImgParams="uploadImgParams"></editor-bar>
            </div>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button @click="back()">返回</el-button>
          <el-button type="primary" @click="validate()">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDateTime } from "../../../filters";
import EditorBar from "../../../components/editoritem";
export default {
  name: "content-addArticle",
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
      addDoctorData: {
        logoUrl: ""
      },
      // 文章类型
      articleType: 0,
      sections: [],
      staffList: [],
      addDoctorRules: {
        classifyID: {
          required: true,
          message: "文章分类不能为空"
        },
        // tag: {
        //   required: true,
        //   message: "文章标签不能为空"
        // },
        title: {
          required: true,
          message: "标题不能为空"
        },
        doctorarticleTypeName: {
          required: true,
          message: "文章类型不能为空"
        },
        // summary: {
        //   required: true,
        //   message: "摘要不能为空"
        // },
        content: {
          required: true,
          message: "文章详情不能为空"
        },
        publishDate: {
          required: true,
          message: "发布时间不能为空"
        },
        logoUrl: {
          required: true,
          message: "缩略图不能为空"
        },
        articleUrl: {
          required: true,
          message: "视频地址不能为空"
        }
      },
      classification: [],
      workPhotoList: []
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
    loadList.push(this.getPharse());
    this.$_http.all(...loadList).finally(it => { });
  },
  methods: {
    // 制造参数
    manufactureData () {
      this.uploadImgParams.belongID = this.userInfo.orgID;
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
    back () {
      this.close().then(() => {
        this.$router.push({ name: "content-tmcArticle" });
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
    // 操作：上传图片
    uploadSuccess (res) {
      if (!res.data) return;
      this.addDoctorData.logoID = res.data.keyID;
      this.addDoctorData.logoUrl = res.data.remoteAddress;
    },
    // 预览
    preview () {
      if (
        typeof this.addDoctorData.articleUrl === "undefined" ||
        this.addDoctorData.articleUrl === ""
      ) {
        this.$_warning("请填写详情页地址...");
        return;
      }
      window.open(this.addDoctorData.articleUrl);
    },
    // 添加文章
    svae () {
      let _this = this;
      let time = formatDateTime(_this.addDoctorData.publishDate);
      _this.addDoctorData.publishDate = time;
      _this.staffList.forEach(staff => {
        if (staff.keyID === _this.addDoctorData.doctorCanSee) {
          _this.addDoctorData.doctorCanSeeName = staff.staffName;
        }
      });
      _this.sections.forEach(section => {
        if (section.keyID === _this.addDoctorData.departmentCanSee) {
          _this.addDoctorData.departmentCanSeeName =
            section.hospitalSectionName;
        }
      });
      _this.classification.forEach(classif => {
        if (classif.keyID === _this.addDoctorData.classifyID) {
          _this.addDoctorData.classifyName = classif.classifyName;
        }
      });
      _this.addDoctorData.articleType = _this.articleType;
      let data = {};
      let name = "";
      if (typeof this.keyID !== "undefined" && this.keyID !== "") {
        name = "修改";
        data = {
          keyID: this.keyID,
          ..._this.addDoctorData,
          orgID: _this.userInfo.orgID
        };
      } else {
        name = "添加";
        data = {
          ..._this.addDoctorData,
          orgID: _this.userInfo.orgID
        };
      }
      // `
      _this.$_http
        .post(_this.$_API.INTERFACE_POST_ARTICLE_SAVE, data)
        .then(r => {
          if (!r.data) return;
          this.$_success(name + "成功...");
          this.close().then(() => {
            this.$router.push({
              name: "content-tmcArticle",
              params: { isLoad: "Y" }
            });
          });
        });
    },
    // 验证表单
    validate () {
      if (this.screenLoading) {
        return;
      }
      this.$refs.formDoctor.validate(valid => {
        if (!valid) {
          return;
        }
        this.svae();
      });
    },
    // 获取文章分类
    getPharse () {
      let params = {
        classifyType: 2,
        orgID: this.userInfo.orgID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_TOOL_CLASSIFY_LIST, {
          params
        })
        .then(res => {
          if (!res.data) {
            return false;
          }
          this.classification = res.data;
        });
    },
    // 获取详情
    getDetail () {
      let params = {
        keyID: this.keyID
      };
      this.$_http
        .get(this.$_API.INTERFACE_GET_ARTICLE_GETARTICLEBYKEYID, {
          params
        })
        .then(res => {
          if (!res.data) {
            return false;
          }
          this.addDoctorData = res.data;
          this.articleType = res.data.articleType;
          this.workPhotoList = [
            {
              uid: res.data.logoID,
              url: res.data.logoUrl
            }
          ];
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
