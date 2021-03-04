<template>
  <div class="app-container base-page">
    <div id="promote">
      <base-title name="医院介绍"></base-title>
      <div class="mt24 pl24">
        <div>
          <p>推广图片（建议上传图片宽高比为：7:3）</p>
        </div>
        <base-upload class="uploadLabel" :data="data" :limit="9" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="uploadSuccess" :file-list="hospitalPromoteImg">
        </base-upload>
        <el-form label-position="top" label-width="80px" :model="hospitalPromote">
          <el-form-item label="医院简介：">
            <el-input type="textarea" :rows="4" v-model="hospitalPromote.introduction" maxlength="500" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="医院设备：">
            <el-input type="textarea" :rows="4" v-model="hospitalPromote.equipment" maxlength="500" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="医院床位：">
            <el-input type="textarea" :rows="4" v-model="hospitalPromote.beds" maxlength="500" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="医院特色：">
            <el-input type="textarea" :rows="4" v-model="hospitalPromote.features" maxlength="500" show-word-limit></el-input>
          </el-form-item>
        </el-form>
        <div> &emsp; </div>
        <el-button class="sure" type="primary" @click="ensure1st()">保存</el-button>
      </div>
      <el-dialog :visible.sync="dialogVisible">
        <img width="94%" :src="dialogImageUrl" style="margin-left: 3%" alt="检查报告" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import InputWithTip from "@/components/InputWithTip";
import { mapGetters } from "vuex";

export default {
  name: "HospitalPromote",
  inject: ["reload", "close"],
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InputWithTip
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      num: 9,
      dialogImageUrl: "",
      dialogVisible: false,
      data: {
        systemCode: "HOSPITAL",
        belongCode: "INFO",
        belongID: 1,
        width: 900
      },
      hospitalPromoteImg: [],
      hospitalPromote: {
        keyID: "",
        orgID: "",
        introduction: "",
        equipment: "",
        beds: "",
        features: ""
      },
      mark: false
    };
  },
  created () {
    this.getHospitalPromote();
  },
  activated () {

  },
  methods: {
    getHospitalPromote () {
      this.data.belongID = this.userInfo.orgID;
      this.hospitalPromoteImg = [];
      this.$_http.get(this.$_API.INTERFACE_GET_PROMOTE_BY_HOSPITAL + "?orgId=" + this.userInfo.orgID).then(response => {
        if (!response.data) return;
        let images = response.data.hospitalPromoteImg;
        let imageTemp = [];
        images.forEach(image => {
          let item = {};
          item.uid = image.imgID;
          item.name = image.keyID;
          item.url = image.imgUrl;
          imageTemp.push(item);
        });
        this.hospitalPromoteImg = imageTemp;
        let data = response.data.hospitalPromote;
        let keys = Object.keys(this.hospitalPromote);
        let temp = JSON.parse(JSON.stringify(this.hospitalPromote));
        keys.forEach(key => {
          if (data[key]) {
            temp[key] = data[key];
          }
        });
        this.hospitalPromote = temp;
      });
    },

    // 操作：重置输入框信息
    resetSearchInfoFun () {
      this.$refs.formOrder.resetFields();
      this.query = {};
    },
    // 操作：查看已有的大图
    handlePictureCardPre (item) {
      this.dialogImageUrl = item.imgUrl;
      this.dialogVisible = true;
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 操作：删除已有图片
    handlePictureDelete (i) {
      this.$_http.get(this.$_API.INTERFACE_HOSPITAL_PROMOTE_DELETE_IMAGE + "?keyID=" + i.keyID).then(response => {
      });
    },
    // 操作：删除所选的图片
    handleRemove (file) {
      console.log(file);
      this.$_http.get(this.$_API.INTERFACE_HOSPITAL_PROMOTE_DELETE_IMAGE + "?keyID=" + file.name).then(response => {

      });
    },

    uploadSuccess (res) {
      if (!res.data) return;
      if (this.num >= 0) {
        let parameter = {};
        parameter.imgID = res.data.keyID;
        parameter.imgUrl = res.data.remoteAddress;
        parameter.orgID = this.userInfo.orgID;
        this.$_http.post(this.$_API.INTERFACE_HOSPITAL_PROMOTE_SAVE_IMAGE, parameter).then(response => {
        });
      }
    },
    ensure1st () {
      if (!this.mark) {
        this.mark = true;
        this.hospitalPromote.orgID = this.userInfo.orgID;
        let parameter = {
          hospitalPromote: this.hospitalPromote
        };
        this.$_http.post(this.$_API.INTERFACE_HOSPITAL_PROMOTE_SAVE_PROMOTE, parameter).then(response => {
          this.getHospitalPromote();
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.mark = false;
        }).catch(res => {
          this.mark = false;
        });
      }
    }
  }
};
</script>

<style lang="scss">
#promote {
  .isHover {
    position: relative;
  }
  .meng {
    width: 146px;
    height: 146px;
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    bottom: 3px;
    left: 0;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 20px;
    color: white;
    text-align: center;
    line-height: 146px;
  }
  .isHover:hover .meng {
    opacity: 1;
  }
  .iconScale {
    margin-right: 15px;
    cursor: pointer;
  }
  .iconDelete {
    cursor: pointer;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    margin: 0 8px 0 0;
  }
}
</style>
