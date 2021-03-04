<template>
  <div class="app-container">
    <base-loading :loading="tableLoading">
    <el-card class="box-card" shadow="never" style="border: 0">
      <h1 class="text" v-if="this.userInfo.jobType !== 1">对不起，您没有二维码</h1>
      <div class="info-box" v-if="this.userInfo.jobType === 1">
        <div class="item-right">
          <div>
            <p class="title">
              <span>扫码分享小程序</span>
            </p>
            <div class="image">
              <el-image class="Imgs" :src="url7"></el-image>
              <p class="describes"></p>
            </div>
          </div>
        </div>
        <!-- <div class="item-left">
          <div>
            <p class="title">
              <span>方式二：下载二维码名片到电脑</span>
            </p>
            <div>
              <div class="images">
                <el-image class="Img" :src="url"></el-image>
              </div>
            </div>
          </div>
        </div>
        <div class="item-middle">
          <div>
            <p class="title">
              <span>方式三：下载二维码名片到手机</span>
            </p>
            <div class="image">
              <el-image class="Imgs" :src="url6"></el-image>
              <p class="describes">请用手机微信扫描上方二维码获取二维码名片</p>
            </div>
          </div>
        </div> -->
      </div>
    </el-card>
  </base-loading>
  </div>
</template>

<script>
import ImgDoctor from "@/assets/image/tmcinquiry/doctor.png";
import ImgAssistant from "@/assets/image/tmcinquiry/assistant.png";
import Imgsave from "@/assets/image/tmcinquiry/save.png";
import Imgyun from "@/assets/image/tmcinquiry/yun.png";
import { mapGetters } from "vuex";
export default {
  name: "doctor",
  filters: {},
  components: {
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      url: "",
      url1: ImgDoctor,
      url2: ImgAssistant,
      url3: Imgsave,
      url4: Imgyun,
      url6: "",
      url7: "",
      assistantInfoList: {},
      assistantGroupMember: {},
      tableLoading: false,
      doctorInfo: {}
    };
  },
  methods: {
    onSubmit() {
    },
    getCode() {
      if (this.tableLoading) {
        return;
      }
      let params = {
        assistantStaffID: this.userInfo.keyID
      };
      this.tableLoading = true;
      this.$_http.get(this.$_API.INTERFACE_TMC_GET_CODE, { params })
        .then(res => {
          // console.log(res);
          if (!res.data) return;
          this.assistantInfoList = res.data;
          this.assistantGroupMember = this.assistantInfoList.assistantGroupMember;
          this.doctorInfo = this.assistantInfoList.doctorInfo;
          this.url6 = this.assistantGroupMember.assistantQrImgUrl;
          this.url = this.assistantGroupMember.wxqrImgUrl;
          this.url7 = this.assistantGroupMember.miniProQrImgUrl;
        })
        .finally(it => {
          this.tableLoading = false;
        });
    }
  },
  created() {
    if (this.userInfo.jobType === 1) {
      this.getCode();
    }
    // console.log(this.userInfo);
  }
};
</script>

<style scoped>
.inline-block {
  display: inline-block;
}
.change-line {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.change-line div {
  padding-left: 10px;
}
.text {
  text-align: center;
  margin-top: 200px;
}
.info-box {
  height: 100%;
}
.item-left {
  float: left;
  border-left: 1px solid #cccccc;
  border-right: 1px solid #cccccc;
  width: 40%;
  height: 100%;
}
.item-middle {
  float: left;
  border-right: 1px solid #cccccc;
  width: 30%;
  height: 100%;
}
.item-right {
  float: left;
  width: 30%;
  box-sizing: border-box;
  height: 100%;
  margin-bottom: 100px;
}
.title {
  text-align: center;
}
.images {
  width: 400px;
  margin: 0 auto;
}
.image {
  width: 360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.Img {
  width: 364px;
  height: 590px;
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 50px;
}
.Imgs {
  width: 270px;
  height: 270px;
  margin: auto;
}
.describe {
  font-size: 12px;
  color: #adadad;
  margin-left: 52px;
}
.describes {
  font-size: 15px;
  color: #adadad;
  text-align: center;
}
.describe-item {
  font-size: 12px;
  margin-left: 30px;
  margin-top: 8px;
  line-height: 12px;
  overflow: hidden;
  font-weight: 600;
}
.item {
  float: left;
  margin-top: 2px;
}
.img {
  float: left;
}
.clear {
  overflow: hidden;
  margin-bottom: 30px;
}
.name {
  margin-left: 10px;
}
.down {
  width: 130px;
  margin: 50px auto;
}
</style>
