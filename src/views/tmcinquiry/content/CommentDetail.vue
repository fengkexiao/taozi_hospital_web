<template>
  <div class="box-body app-container base-page">
    <base-loading :loading="loading">
      <div class="box-card base-page_detail">
        <p class="page-detail_title">患者评价详情</p>
        <el-row class="row-margin">
          <el-col :span="4">
            <div style="color:#686868">所患疾病:</div>
          </el-col>
          <el-col :span="20">
            <div style="color:#242424">{{orderComment.disease}}</div>
          </el-col>
        </el-row>
        <el-row class="row-margin">
          <el-col :span="4">
            <div style="color:#686868">患者主观:</div>
          </el-col>
          <el-col :span="20">
            <div style="color:#242424">{{orderComment.generalCommentName}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div style="color:#474747">疗效:</div>
          </el-col>
          <!-- 评价星级 -->
          <el-col :span="6">
            <div class="start-box">
              <div v-for="(item, index) in 5" :key="index">
                <img v-if="index< orderComment.curativeEffect" style="width:20px;height:20px" src="../../../assets/image/tmcinquiry/full-start.png" />
                <img v-else style="width:20px;height:20px" src="../../../assets/image/tmcinquiry/empty-start.png" />
              </div>
            </div>
          </el-col>
          <!-- <el-col :span="3">
            <div style="color:#EBB742">满意</div>
          </el-col>-->
          <el-col :span="2">
            <div>&nbsp;</div>
          </el-col>
          <el-col :span="2">
            <div style="color:#474747">服务:</div>
          </el-col>
          <!-- 评价星级 -->
          <el-col :span="6">
            <div class="start-box">
              <div v-for="(item, index) in 5" :key="index">
                <img v-if="index< orderComment.doctorAttitude" style="width:20px;height:20px" src="../../../assets/image/tmcinquiry/full-start.png" />
                <img v-else style="width:20px;height:20px" src="../../../assets/image/tmcinquiry/empty-start.png" />
              </div>
            </div>
          </el-col>
          <!-- <el-col :span="3">
            <div style="color:#EBB742">满意</div>
          </el-col>-->
        </el-row>

        <el-row>
          <el-col :span="24">
            <div style="color:#242424">{{orderComment.content}}</div>
          </el-col>
        </el-row>

        <!-- 图片展示 -->
        <el-row>
          <div v-for="(item,index1) in orderComment.orderCommentMaterial" :key="index1">
            <el-col :span="8">
              <el-image style="width:150px;height:95px" :src="item.materialUrl" :preview-src-list="imageList" fit="contain"></el-image>
            </el-col>
          </div>
        </el-row>

        <el-row class="button-box">
          <el-col :span="12" style="display: flex;justify-content: center;">
            <el-button @click="commentReview(2)">审核不通过</el-button>
          </el-col>
          <el-col :span="12" style="display: flex;justify-content: center;">
            <el-button type="primary" @click="commentReview(1)">审核通过</el-button>
          </el-col>
        </el-row>
      </div>
    </base-loading>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "TMCInquiry-commentDetail",
  inject: ["close"],
  data () {
    return {
      loading: false,
      disease: "感冒",
      imageList: [],
      // 评价详情
      orderComment: {},
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      }
    };
  },
  props: {
    keyID: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.queryDetail();
  },
  methods: {
    initImage () {
      let imageArr = this.orderComment.orderCommentMaterial;
      if (imageArr) {
        imageArr.forEach(element => {
          this.imageList.push(element.materialUrl);
          console.log("----iamge---" + JSON.stringify(this.imageList));
        });
      }
    },
    // 查询详情
    queryDetail () {
      let params = {
        ...this.pageInfo,
        orgID: this.userInfo.orgID,
        keyID: this.keyID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_PATIENT_COMMENT, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.orderComment = res.data.datas[0];
          this.initImage();
        })
        .finally(it => { });
    },
    // 1 审核通过 2 审核不通过
    commentReview (isReviewID) {
      let params = {
        keyID: this.orderComment.keyID,
        orgID: this.userInfo.orgID,
        isReviewID: isReviewID
      };
      this.$_http
        .post(this.$_API.INTERFACE_TMC_REVIEW_PATIENT_COMMENT, params)
        .then(res => {
          this.$message.success("审核成功");
          this.close().then(() => {
            this.$router.push({
              name: "content-tmcDoctorComment",
              params: {}
            });
          });
        })
        .finally(it => { });
    }
  }
};
</script>

<style lang="scss" scoped>
.box-body {
  height: 90%;
  display: flex;
  justify-content: center;
  font-size: 14px;
}
.title {
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(42, 44, 48, 1);
  margin: 0;
  padding: 0;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
}
.box-card {
  height: 100%;
  width: 500px;
  position: relative;
  margin: 0;
}
.el-row {
  margin-bottom: 10px;
}
.start-box {
  display: flex;
  justify-content: space-around;
}
.button-box {
  position: absolute;
  height: 10%;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
