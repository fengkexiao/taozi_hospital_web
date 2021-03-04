<template>
  <div class="app-container base-page">
    <base-loading :loading="screenLoading">
      <el-form ref="formRoom" :model="formData" :rules="formRules" label-width="150px" class="form-room">
        <el-form-item label="诊室：" prop="roomName">
          <el-input v-model="formData.roomName" label-name="诊室" placeholder="注：请描述就诊地点：如“门诊2楼2号”" clearable/>
        </el-form-item>
        <el-form-item label="咨询联系人：" prop="contactName">
          <el-input v-model="formData.contactName" placeholder="请输入" clearable/>
        </el-form-item>
        <el-form-item label="咨询电话：" prop="contactPhone">
          <el-input v-model="formData.contactPhone" placeholder="请输入" clearable maxlength="11"/>
        </el-form-item>
        <el-form-item label="诊室图片：" class="form-required">
          <base-upload ref="upload" :data="pictureData" :limit="5" :uploading.sync="uploading" multiple :file-list="hospitalRoomPics" />
        </el-form-item>
        <el-form-item label="设施设备：" prop="equipments">
          <el-input v-model="formData.equipments" type="textarea" placeholder="请输入" clearable/>
        </el-form-item>
      </el-form>
    </base-loading>
    <div class="contain-flex justify-content-center form-input-width">
      <el-button @click="back">返回</el-button>
      <span></span>
      <el-button type="primary" :loading="screenLoading" class="margin-left-40" @click="validate">保存</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { optionalFormCopy } from "@/utils/tools";
import InputWithTip from "@/components/InputWithTip";
export default {
  name: "room-manage-edit",
  components: {
    InputWithTip
  },
  inject: ["close"],
  props: {
    // 页面显示模式：C（创建）；V只读查看；E（编辑）
    mode: {
      type: String,
      required: true,
      default () {
        return "C";
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
      screenLoading: false,
      formData: {},
      formRules: {
        roomName: {
          required: true,
          message: "诊室不能为空"
        },
        contactName: {
          required: true,
          message: "咨询联系人不能为空"
        },
        contactPhone: [
          {
            required: true,
            message: "咨询电话不能为空"
          },
          {
            trigger: "blur",
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码（11位）"
          }
        ],
        equipments: {
          required: true,
          message: "设施设备不能为空"
        }
      },
      hospitalRoomPics: [],
      pictureData: {
        systemCode: "HOSPITAL",
        belongCode: "SHAREROOM",
        belongID: this.keyID
      },
      uploading: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    if (this.mode !== "C") {
      this.screenLoading = true;
      let loadList = [];
      loadList.push(this.loadDetail, this.loadPictures);
      this.$_http.all(...loadList).finally(it => {
        this.screenLoading = false;
      });
    }
  },
  methods: {
    // 加载诊室信息详情
    loadDetail () {
      let params = {
        keyID: this.keyID
      };
      let request = this.$_http.get(this.$_API.INTERFACE_SHARE_ROOM_INFO, {
        params
      });
      request.then(res => {
        if (!res.data) return;
        let resData = optionalFormCopy(res.data);
        this.formData = { ...this.formData, ...resData.hospitalRoom };
      });
      return request;
    },
    // 加载诊室图片详情
    loadPictures () {
      let params = {
        roomID: this.keyID
      };
      let request = this.$_http.get(this.$_API.INTERFACE_SHARE_ROOM_PICTURE, {
        params
      });
      request.then(res => {
        if (!res.data) return;
        this.hospitalRoomPics = res.data.map(it => ({
          uid: it.picFileID,
          url: it.picFileUrl
        }));
      });
      return request;
    },
    // 返回列表页
    back () {
      // 关闭当前页
      this.close().then(() => {
        this.$router.push("/shareroom/hospitalRoom");
      });
    },
    // 验证表单
    validate () {
      if (this.screenLoading) {
        return;
      }
      this.$refs.formRoom.validate(valid => {
        if (!valid) {
          return;
        }
        const fileList = this.$refs.upload.getFiles();
        // 检查是否上传诊室图片
        if (fileList.length <= 0) {
          this.$_error("请先上传诊室图片");
          return;
        }
        // 有图片处于上传中
        if (this.uploading) {
          this.$_warning("诊室图片正在上传中，请耐心等待哦");
          return;
        }
        this.saveRoom();
      });
    },
    // 保存表单
    saveRoom () {
      let apiStr = this.mode === "C" ? "ADD" : "MODIFY";
      let msgStr = this.mode === "C" ? "添加" : "修改";
      let bizInfo = {
        hospitalID: this.userInfo.orgID,
        hospitalName: this.userInfo.orgName
      };
      let hospitalRoom = { ...{}, ...bizInfo, ...this.formData };
      const fileList = this.$refs.upload.getSimpleFiles();
      const pics = fileList.map(it => ({
        picFileID: it.uid,
        picFileUrl: it.url,
        roomID: this.keyID
      }));
      let data = {
        hospitalRoom,
        hospitalRoomPics: pics
      };
      this.screenLoading = true;
      this.$_http
        .post(this.$_API[`INTERFACE_SHARE_ROOM_${apiStr}`], data)
        .then(res => {
          if (!res.data) return;
          this.$_success(`${msgStr}诊室成功`);
          // 重置表单
          this.$refs.formRoom.resetFields();
          // 返回列表页
          this.back();
        })
        .finally(() => {
          this.screenLoading = false;
        });
    }
  }
};
</script>
<style lang="scss">
.form-room {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .el-form-item .el-input,
  .el-textarea {
    max-width: 358px;
    width: 358px;
  }
}
</style>