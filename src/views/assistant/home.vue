<template>
  <div class="app-container base-page" style="    background: #F0F2F5;">
    <div class="home-bg">
      <div class="header-left">
        <div class="header-top">
          <label class="header-top_text"><img src="./../../assets/image/assistant/data.png" style="    width: 22px;height: 24px;margin-right: 12px;" />目前积分数：</label>
          <label class="header-top_count">{{data.canUseSum}}</label>
        </div>
        <div class="header-bottom">
          <div class="header-item">
            <label class="header-bottom_text">总积分数：</label>
            <label class="header-bottom_count">{{data.pointSum || 0}}</label>
          </div>
          <div class="header-item">
            <label class="header-bottom_text">总患者数：</label>
            <label class="header-bottom_count">{{data.patientSum  || 0}}</label>
          </div>
          <div class="header-item">
            <label class="header-bottom_text">总处方数：</label>
            <label class="header-bottom_count">{{data.rpSum  || 0}}</label>
          </div>
          <div class="header-item">
            <label class="header-bottom_text">总订单金额数：</label>
            <label class="header-bottom_count">{{data.orderSum/100  || 0}}</label>
          </div>
        </div>
      </div>
      <div class="header-right">
        <base-image :src="faceImage" class="user-avatar" />
        <span class="user-name">{{userInfo.staffName}}</span>
      </div>
    </div>
    <div style="background:#fff;margin-top:30px;padding-top:40px;">
      <div class="base-search_form">
        <div class="form-item">
          <span class="item-label">统计时间：</span>
          <el-date-picker v-model="time" type="daterange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" value-format='yyyy-MM-dd'>
          </el-date-picker>
        </div>
        <div class="form-item">
          <el-button type="primary" icon="el-icon-search" @click="getStatistic">查询</el-button>
        </div>
      </div>
      <div class="list">
        <div class="list-item">
          <span class="list-title">新增患者数：</span>
          <span class="list-count">{{data.patientNumByDate  || 0}}</span>
          <img src="././../../assets/image/assistant/huanzhe.png">
        </div>
        <div class="list-item">
          <span class="list-title">处方量：</span>
          <span class="list-count">{{data.rpNumByDate  || 0}}</span>
          <img src="././../../assets/image/assistant/rp.png">
        </div>
        <div class="list-item">
          <span class="list-title">订单金额：</span>
          <span class="list-count">{{data.orderNumByDate/100  || 0}}</span>
          <img src="././../../assets/image/assistant/jine.png">
        </div>
        <div class="list-item">
          <span class="list-title">积分：</span>
          <span class="list-count">{{data.pointNumByDate  || 0}}</span>
          <img src="././../../assets/image/assistant/Jifen.png">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import avatar from "@/assets/image/default-avatar.png";
import { mapGetters } from "vuex";
export default {
  name: "user-staff",
  filters: {
    // 格式化状态
    formatStatus (val) {
      return STATUS_LIST[val] || "";
    }
  },
  data () {
    return {
      query: {
        startDate: '',
        endDate: ''
      },
      time: [],
      data: {},
      faceImage: '',
      orderSum: {}
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created () {
    if (this.userInfo.doctorInfo.faceImage) {
      this.faceImage = this.userInfo.doctorInfo.faceImage
    }
    this.getStatistic()
  },
  activated () {
  },
  methods: {
    // 获取统计
    getStatistic () {
      if (this.time.length > 0) {
        this.query.startDate = this.time[0]
        this.query.endDate = this.time[1]
      } else {
        this.query.startDate = ''
        this.query.endDate = ''
      }
      let params = {
        orgID: this.userInfo.orgID,
        assistantStaffID: this.userInfo.keyID,
        ...this.query
      };

      this.$_http
        .get(this.$_API.INTERFACE_ASSISTANT_ORDRERSUMHOME, {
          params
        })
        .then(res => {
          this.data = res.data
        });
    }
  }
};
</script>

<style lang="scss"  scoped>
.home-bg {
  background: url("./../../assets/image/assistant/assistant-bg.png");
  background-size: 100% 100%;
  height: 211px;
  width: 100%;
  display: flex;
  padding: 40px 62px 50px 62px;
}
.header-left {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.header-item {
  //margin-right: 143px;
}
.header-top_text {
  font-size: 24px;
  color: #ffffff;
}
.header-top_count {
  font-size: 36px;
  color: #ffffff;
  margin-left: 4px;
}
.header-bottom {
  display: flex;
  margin-top: 46px;
  justify-content: space-between;
  width: 90%;
}

.header-bottom_text {
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
}
.header-bottom_count {
  font-size: 24px;
  color: #ffffff;
  margin-left: 4px;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 60px;
  margin-right: 0;
}

.user-name {
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  margin-top: 18px;
}

.list {
  display: flex;
  padding-left: 12px;
  padding-bottom: 80px;
}

.list-item {
  width: 256px;
  height: 130px;
  position: relative;
  background-size: 100% 100%;
  padding: 6px 12px;
  display: flex;
  flex-direction: column;
  margin-right: 24px;
  border-radius: 5px;
  box-shadow: 0px 2px 10px 0px rgba(15, 83, 166, 0.26);
  img {
    width: 84px;
    height: 104px;
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
.list-title {
  font-size: 20px;
  color: rgba(0, 0, 0, 0.65);
  z-index: 9;
}
.list-count {
  font-size: 40px;
  margin-top: 16px;
  text-align: center;
  color: #000000;
}

.item1 {
  background: url("./../../assets/image/assistant/assistant-bg_huanzheshu.png");
}
</style>
