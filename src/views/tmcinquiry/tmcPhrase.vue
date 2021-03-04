<template>
  <div class="app-container">
    <div class="inline">
      <div>
        <p><span class="color-blue">丨</span><span>素材模板</span></p>
      </div>
      <hr />
      <div id="addLabelBody">
        <div class="left">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-button class="little" type="primary" icon="el-icon-search" @click="getCommoditiesList()">查询</el-button>
        </div>
        <el-button class="right" type="primary" @click="addDoctorGroup(2)">模板维护</el-button>
      </div>
      <div>
        <div class="tree-list">
          <el-tree class="filter-tree" :highlight-current="highlightCurrent" :data="data" :props="defaultProps" :filter-node-method="filterNode" node-key="id" ref="tree"></el-tree>
        </div>
        <div class="images">
          <el-image class="img" :src="url"></el-image>
        </div>
        <div class="content">
          <el-form ref="form" :model="form" label-width="120px" class="form">
            <el-form-item label="素材类型：">
              <el-radio-group v-model="form.resource">
                <el-radio label="图文"></el-radio>
                <el-radio label="图片"></el-radio>
                <el-radio label="视频"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="图文地址：" v-if="form.resource === '图文'">
              <base-input type="textarea" v-model="form.region" maxlength="1000" placeholder="请输入图文链接地址"></base-input>
            </el-form-item>
            <el-form-item label="视频地址：" v-if="form.resource === '视频'">
              <base-input type="textarea" v-model="form.region" maxlength="1000" placeholder="请输入视频链接地址"></base-input>
            </el-form-item>
            <el-form-item label="标题：" v-if="form.resource === '图文' || form.resource === '视频'">
              <base-input v-model="form.name" type="text" :show-word-limit="true" placeholder="请输入标题"></base-input>
              <p class="color-ccc">*标题将展示在相关阅读页面，建议填写清晰、准确、生动的标题</p>
            </el-form-item>
            <el-form-item label="描述：" v-if="form.resource === '图文'">
              <base-input type="textarea" :show-word-limit="true" v-model="form.desc" placeholder="请输入内容描述"></base-input>
              <p class="color-ccc">*介绍语将展示在相关播放页面，建议填写简洁明确、有信息质量的内容</p>
            </el-form-item>
            <el-form-item label="视频介绍：" v-if="form.resource === '视频'">
              <base-input type="textarea" :show-word-limit="true" v-model="form.desc" placeholder="视频描述"></base-input>
              <p class="color-ccc">*介绍语将展示在相关播放页面，建议填写简洁明确、有信息质量的内容</p>
            </el-form-item>
            <el-form-item label="添加图片：" v-if="form.resource === '图文' || form.resource === '图片'">
              <base-upload  class="uploadLabel" :data="datas" :limit="limitNum" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                                :on-success="uploadSuccess"  :file-list="hospitalPromoteImg" ref="upload">
                  </base-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-folder-checked" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Img from "@/assets/image/tmcinquiry/transfer.png";
export default {
  name: "tmcMaterial",
  components: {
  },
  filters: {
  },
  data() {
    return {
      form: {
        name: "",
        region: "",
        delivery: false,
        type: [],
        resource: "图文",
        desc: ""
      },
      limitNum: 1,
      hospitalPromoteImg: [],
      datas: {
        systemCode: "HOSPITAL",
        belongCode: "RECHARGE",
        belongID: ""
      },
      filterText: "",
      highlightCurrent: true,
      url: Img,
      data: [{
        id: 1,
        label: "常用话术（默认）",
        children: [{
          id: 4,
          label: "二级 1-1",
          children: [{
            id: 9,
            label: "三级 1-1-1"
          }, {
            id: 10,
            label: "三级 1-1-2"
          }]
        }]
      }, {
        id: 2,
        label: "问候话术",
        children: [{
          id: 5,
          label: "二级 2-1"
        }, {
          id: 6,
          label: "二级 2-2"
        }]
      }, {
        id: 3,
        label: "引导话术",
        children: [{
          id: 7,
          label: "二级 3-1"
        }, {
          id: 8,
          label: "二级 3-2"
        }]
      }],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
      this.$refs.upload.clearFiles();
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    onSubmit() {
      console.log("submit!");
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadSuccess(res) {
      if (!res.data) return;
      if (this.limitNum >= 0) {
        let parameter = {};
        parameter.imgID = res.data.keyID;
        parameter.imgUrl = res.data.remoteAddress;
        parameter.orgID = this.userInfo.orgID;
        // this.$_http.post(this.$_API.INTERFACE_HOSPITAL_PROMOTE_SAVE_IMAGE, parameter).then(response => {
        // });
      }
    },
    // 操作：删除所选的医院照片
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.formData.imgID = "";
      this.formData.imgUrl = "";
    }
  },
  created() {
  }
};
</script>

<style lang="scss" scoped>
#addLabelBody {
  overflow: hidden;
  .el-input {
    width: 500px;
    max-width: none;
  }
  .addLabelInput {
    width: 500px;
    padding: 5px 5px;
    border-radius: 5px 5px;
  }
}
.tree-list {
  width: 38%;
  margin-top: 30px;
  border-radius: 5px;
  border: 1px solid #ccc;
  height: 700px;;
  overflow-y: auto;
  float: left;
}
.tree-list::-webkit-scrollbar {
  width: 7px;
  height: 1px;
}
.tree-list::-webkit-scrollbar-thumb {
  border-radius: 7px;
  box-shadow: inset 0 0 5px rgba(102, 102, 102, 0.2);
  background: #858585;
}
.tree-list::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(102, 102, 102, 0.2);
  border-radius: 7px;
  background: #EDEDED;
}
.images {
  float: left;
  margin-top: 300px;
  margin-left: 3%;
  width: 6%;
  height: 6%;
}
.content {
  width: 50%;
  margin-top: 30px;
  margin-left: 3%;
  border-radius: 5px;
  border: 1px solid #ccc;
  height: 700px;
  overflow-y: auto;
  float: left;
}
.form {
  margin: 20px;
}
.content::-webkit-scrollbar {
  width: 7px;
  height: 1px;
}
.content::-webkit-scrollbar-thumb {
  border-radius: 7px;
  box-shadow: inset 0 0 5px rgba(102, 102, 102, 0.2);
  background: #858585;
}
.content::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(102, 102, 102, 0.2);
  border-radius: 7px;
  background: #EDEDED;
}
.filter-tree {
  margin: 20px;
}
.el-input {
  max-width: 200px;
}
.el-radio {
  margin-right: 90px;
}
.color-ccc {
  color: #ccc;
}
.inline p{
  font-weight: 800;
}
.little {
  margin-left: 30px;
}
.left {
  float: left;
  margin-top: 10px;
}
.right {
  float: right;
  margin-right: 20px;
  margin-top: 10px;
}
.color-blue {
  color: #438BEF;
  font-weight: 800;
}
.el-form--inline .el-form-item {
  margin-right: 0;
}
.el-form-item__label { /*input输入框标题文本调整*/
  text-align: left;
}
.el-form-item__content {
  .el-input, .el-textarea { /*input输入框宽度调整*/
    width: 400px;
    max-width: none;
  }
}
</style>
