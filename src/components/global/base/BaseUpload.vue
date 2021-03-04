<template>
  <div>
    <mirror-upload ref="baseUpload" :action="action" :list-type="listType" :drag="drag" :http-request="httpRequest"
      :file-list="files" :before-upload="beforeAvatarUpload" :on-change="uploadChange" :on-remove="uploadRemove"
      :on-exceed="uploadExceed" :on-preview="uploadPreview" v-bind="$attrs" v-on="$listeners">
      <i class="el-icon-upload"></i>
      <br />
      <span class="el-upload__text">将文件<em>拖到此处</em>，<br />或<em>点击上传</em></span>
      <template #trigger>
        <slot name="trigger">
        </slot>
      </template>
      <template #tip>
        <slot name="tip" />
      </template>
    </mirror-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import mirrorUpload from "@/components/mirror-upload";
import { UPLOAD_IMAGE_MAX_SIZE } from "@/common/Constant";
// 文件列表的类型可选项
const LIST_TYPE = ["text", "picture", "picture-card"];
export default {
  inheritAttrs: false,
  components: { mirrorUpload },
  props: {
    // 限制上传文件类型
    uploadType: {
      type: String,
      default() {
        return "image";
      }
    },
    // 文件列表的类型
    listType: {
      type: String,
      default() {
        return "picture-card";
      },
      validator(val) {
        return LIST_TYPE.includes(val);
      }
    },
    // 是否启用拖拽上传
    drag: {
      type: Boolean,
      default() {
        return true;
      }
    },
    // 是否处于正上传中，支持sync属性
    uploading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    fileList: Array,
    beforeUpload: Function,
    onExceed: Function,
    onChange: Function,
    onRemove: Function,
    onPreview: Function
  },
  data() {
    return {
      action: this.$_API.INTERFACE_FILE_LOAD,
      files: this.fileList || [],
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  computed: {
    beforeAvatarUpload() {
      const _this = this;
      return (
        _this.beforeUpload ||
        (file => {
          // 限制文件类型
          let limitType = true;
          let typeMsg = "图片";
          if (_this.uploadType && _this.uploadType === "image") {
            limitType = file.type.startsWith("image/");
          }
          if (!limitType) {
            _this.$_error(`只能上传${typeMsg}`);
          }
          // 限制文件大小
          const limitSize = file.size / 1024 / 1024 < UPLOAD_IMAGE_MAX_SIZE;
          if (!limitSize) {
            _this.$_error(`上传图片的大小不能超过 ${UPLOAD_IMAGE_MAX_SIZE}MB`);
          }
          return limitType && limitSize;
        })
      );
    },
    // 文件超出个数限制处理
    uploadExceed() {
      return (
        this.onExceed ||
        ((files, fileList) => {
          if (!fileList) {
            return;
          }
          this.$_error(`此处最多允许上传${fileList.length}个文件`);
        })
      );
    },
    uploadPreview() {
      const _this = this;
      return (
        this.onPreview ||
        (file => {
          if (!file) {
            return;
          }
          _this.dialogImageUrl = file.url;
          _this.dialogVisible = true;
        })
      );
    }
  },
  watch: {
    fileList(val) {
      this.files = val;
    },
    files(val) {
      const loading = val.some(it => it.uploading);
      this.$emit("update:uploading", loading);
    }
  },
  methods: {
    // Upload Methods
    clearFiles() {
      this.$refs.baseUpload.clearFiles();
    },
    abort() {
      this.$refs.baseUpload.abort();
    },
    submit() {
      this.$refs.baseUpload.submit();
    },
    // 覆盖默认的上传行为
    httpRequest(options) {
      let data = { ...options.data };
      let CancelToken = axios.CancelToken;
      let source = CancelToken.source();
      data.file = options.file;
      data.cancelToken = source.token;
      const ajax = new Promise((resolve, reject) => {
        this.$_http
          .post(options.action, data, {
            withCredentials: false
          })
          .then(res => {
            resolve(res);
          })
          .catch(error => {
            reject(error, options.file);
          });
      });
      ajax.abort = source.cancel;
      return ajax;
    },
    // 文件状态改变时的钩子
    uploadChange(file, fileList) {
      file.uploading = typeof file.uploading === "undefined";
      this.files = [...fileList];
      if (this.onChange) {
        return this.onChange(file, fileList);
      }
    },
    // 文件列表移除文件时的钩子
    uploadRemove(file, fileList) {
      this.files = [...fileList];
      if (this.onRemove) {
        return this.onRemove(file, fileList);
      }
    },
    // 获取当前已上传成功的文件列表
    getFiles() {
      return this.files;
    },
    // 获取当前已上传成功的文件列表，只包含上传后的uid和url
    getSimpleFiles() {
      return this.files.map(it => {
        if (it.response) {
          return {
            uid: it.response.data.keyID,
            url: it.response.data.remoteAddress
          };
        }
        return {
          uid: it.uid,
          url: it.url
        };
      });
    }
  }
};
</script>
