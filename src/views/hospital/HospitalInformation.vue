<template>
  <div class='app-container'>
    <el-card>
      <el-form label-width="100px" :model="organization" ref="formDoctor">
        <el-form-item label="医院名称" prop="orgName">
          <template>{{organization.orgName}}</template>
        </el-form-item>
      </el-form>
      <el-form label-width="100px" :model="hospitalInfo" ref="formDoctor">
        <el-form-item label="医院等级" prop="hospitalLevel">
          <template>{{hospitalInfo.hospitalGrade}}</template>
        </el-form-item>
        <el-form-item label="医院性质" prop="natureID">
          <template>{{hospitalInfo.natureName}}</template>
        </el-form-item>
        <el-form-item v-show="isShowHospitalName" label="专科" class="animated bounceInRight " prop="profession">
          <template>{{hospitalInfo.profession}}</template>
        </el-form-item>
        <el-form-item label="医院图片" prop="photoUrl">
          <base-image :src="hospitalInfo.photoUrl" @click="handlePictureCardPre(hospitalInfo.photoUrl)"></base-image>
          <!-- <base-upload class="uploadLabel" :data="data" :limit="nums" :on-preview="handlePictureCardPreview" :file-list="workPhotoList"></base-upload> -->
        </el-form-item>
        <el-form-item label="院长" prop="hospitalMaster">
          <template>{{hospitalInfo.hospitalMaster}}</template>
        </el-form-item>
        <el-form-item label="联系方式" prop="masterTel">
          <template>{{hospitalInfo.masterTel}}</template>
        </el-form-item>
        <el-form-item label="所在省市" prop="place">
          <template>{{hospitalInfo.province}}/{{hospitalInfo.city}}/{{hospitalInfo.area}}</template>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <template>{{hospitalInfo.address}}</template>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <template>{{hospitalInfo.longitude}}</template>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <template>{{hospitalInfo.latitude}}</template>
        </el-form-item>
        <el-form-item label="管理员姓名" prop="adminName">
          <template>{{hospitalInfo.adminName}}</template>
        </el-form-item>
        <el-form-item label="管理员账号" prop="adminPhone">
          <template>{{hospitalInfo.adminPhone}}</template>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="contactMan">
          <template>{{hospitalInfo.contactMan}}</template>
        </el-form-item>
        <el-form-item label="联系人电话" prop="contactTel">
          <template>{{hospitalInfo.contactTel}}</template>
        </el-form-item>
        <el-form-item label="客服电话" prop="servicePhone">
          <template>{{hospitalInfo.servicePhone}}</template>
        </el-form-item>
        <el-form-item label="到期时间" prop="validDateEnd">
          <template>{{hospitalInfo.validDateEnd}}</template>
        </el-form-item>
      </el-form>
    </el-card>
    <!--      查看大图-->
    <el-dialog :visible.sync="dialogVisible">
      <img width="94%" :src="dialogImageUrl" style="margin-left: 3%" alt="医院图片">
    </el-dialog>
  </div>
</template>
<script>
import json from "@/assets/json/place.json";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      isDisable: false,
      placeOptions: json,
      options1: [],
      hospitalInfo: {
        place: [],
        latitude: "",
        longitude: "",
        photoUrl: ""
      },
      isShowHospitalName: false,
      organization: {
        orgName: "",
        validDateEnd: "",
        addUser: ""
      },
      LevelData: [],
      natureList: ["公立医院", "专科医院"],
      // 上传医院照片
      // photoUrl: "",
      photoFileID: "",
      nums: 1,
      data: {
        systemCode: "HOSPITAL",
        belongCode: "INFO",
        belongID: 1
      },
      // 查看大图片
      dialogVisible: false,
      dialogImageUrl: "",
      workPhotoList: []
    };
  },
  created() {
    this.getHospital();
  },
  methods: {
    loaded(data) {
      this.LevelData = data;
    },
    getHospital() {
      this.isDisable = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_HOSPITAL, {
          params: { orgID: this.userInfo.orgID }
        })
        .then(response => {
          if (!response.data) return;
          let provinceCode = response.data.provinceCode;
          let cityCode = response.data.cityCode;
          let areaCode = response.data.areaCode;
          let place = [provinceCode, cityCode, areaCode];
          this.hospitalInfo = response.data;
          this.hospitalInfo.place = place;
          this.data.belongID = this.hospitalInfo.orgID;
          this.photoUrl = this.hospitalInfo.photoUrl;
          this.photoFileID = this.hospitalInfo.photoFileID;
          this.workPhotoList = [
            {
              uid: this.hospitalInfo.photoFileID,
              url: this.hospitalInfo.photoUrl
            }
          ];
          this.organization.orgName = response.data.orgName;
          this.organization.validDateEnd = response.data.validDateEnd;
          this.organization.addUser = response.data.addUser;
        });
    },
    // 操作：查看上传的大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 操作：查看已有的大图
    handlePictureCardPre() {
      this.dialogImageUrl = this.photoUrl;
      this.dialogVisible = true;
    }
  }
};
</script>
