<template>
  <div style="height: 100%" v-loading="isLoading">
    <audio style="visibility: hidden;position: absolute;z-index: -1" controls="controls" title="播放音乐" ref="audioRefs">
      <source src="@/assets/music/lingsheng.mp3" type="audio/mpeg" />
    </audio>
    <div id="search-box" ref="boxRefs">
      <!--      <base-input v-model="content" placeholder="搜索" class="my-input" prefix-icon="el-icon-search" clearable @change="changeSeachKey"></base-input>-->
      <!--     -->
      <el-input placeholder="搜索" class="my-input" prefix-icon="el-icon-search" clearable v-model="content" @change="changeInput"></el-input>
      <div id="search-list-box" v-show="content">
        <div class="title">搜索患者</div>
        <searcPatientListBox :content="content" :timeAndMultiTalkProps="timeAndMultiTalk" :timeKeysProps="timeKeys"></searcPatientListBox>
      </div>
      <!-- <el-button class="btn-merge">合并</el-button> -->
    </div>
    <!-- <div id="patient-tab" ref="tabs">
      <span
        v-for="(item, index) in tabNames"
        :key="index"
        :class="{'active': active === index}"
        @click="handleClick(index)"
      >{{item}}</span>
      <div class="active_bar" :style="{'left': active_bar_left}"></div>
    </div>-->
    <!-- 医助显示列表 -->
    <div id="list-box" v-if="userInfo.jobType === 1">
      <el-tabs v-model="tableActive" type="card" @tab-click="handleTabClick" style="height:100%;overflow:hidden;">
        <el-tab-pane label="消息" name="message" style="height:100%">
          <span slot="label">消息<span class="badge" v-if="messageTotalUnread>0">{{messageTotalUnread}}</span></span>
          <list v-for="(item, index) in inConsulation" :title="item.groupname" :key="index" :fold="false" :apiKey="item.apiKey" @messaageUnReadChange="messageTotalUnreadChange" style="height:100%"></list>
        </el-tab-pane>
        <el-tab-pane label="未接诊患者" name="missedPatients" style="height:100%">
          <span slot="label">未接诊患者<span class="badge" v-if="missedPatientsTotalUnread>0">{{missedPatientsTotalUnread}}</span></span>
          <list v-for="(item, index) in missedPatients" :title="item.groupname" :key="index" :fold="false" :apiKey="item.apiKey" ref="mychild" @messaageUnReadChange="missedPatientsTotalUnreadChange" style="height:100%"></list>
        </el-tab-pane>
        <el-tab-pane label="联系人" name="contact" style="height:100%">
          <list v-for="(item, index) in patientList" :class="[index>0?'mt10':'']" :fold="true" :title="item.groupname" :key="index" :apiKey="item.apiKey" style="height:100%"></list>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 医生显示列表 -->
    <div id="list-box" v-if="userInfo.jobType === 0">
      <latest-contact-list></latest-contact-list>
    </div>
    <div class="flex" v-if="haveSeat === 'true'">
      <div v-show="isShow === 'signout' || isShow === ''" @click="signIn" class="pointer">
        <img class="delMedicineIconImg" :src="callOn" />
        <div class="style-font">接入</div>
      </div>
      <div v-show="isShow === 'Reserve'" @click="signOut" class="pointer">
        <img class="delMedicineIconImg" :src="callOff" />
        <div class="style-font">断开</div>
      </div>
    </div>
  </div>
</template>

<script>
import list from "./list";
import latestContactList from "./latestContactList";
import { mapGetters } from "vuex";
import timPublic from "./timPublic";
import callOn from "@/assets/image/tmcinquiry/callOn.png";
import callOff from "@/assets/image/tmcinquiry/callOff.png";
import searcPatientListBox from "./searcPatientListBox";
export default {
  mixins: [timPublic],
  props: ['isOn'],
  data () {
    return {
      patientName: '',
      showSearch: false,
      showAudio: false,
      content: "",
      active: 0,
      callOn,
      callOff,
      haveSeat: false,
      isShow: "",
      active_bar_left: "",
      tabNames: ["复诊任务", "最近联系"],
      tableActive: "message",
      messageTotalUnread: 0,
      missedPatientsTotalUnread: 0,
      inConsulation: [
        {
          apiKey: "inquiry",
          groupname: "消息"
        }
      ],
      missedPatients: [
        {
          apiKey: "missedPatients",
          groupname: "未接诊患者"
        }
      ],
      patientList: [
        {
          apiKey: "all",
          groupname: "我的全部患者"
        },
        {
          apiKey: "followUpTask",
          groupname: "订单跟进任务"
        },
        {
          apiKey: "outTime",
          groupname: "到期未复诊"
        },
        {
          apiKey: "day",
          groupname: "今日需复诊"
        },
        {
          apiKey: "tomorrow",
          groupname: "明日需复诊"
        },
        {
          apiKey: "week",
          groupname: "本周需复诊"
        },
        {
          apiKey: "month",
          groupname: "本月需复诊"
        },
        {
          apiKey: "noMedicine",
          groupname: "未购药患者"
        }
      ],
      timeKeys: [],
      timeAndMultiTalk: {}
    };
  },
  computed: {
    ...mapGetters(["userInfo", "tim"])
  },
  components: {
    list,
    latestContactList,
    searcPatientListBox
  },
  watch: {
    active () {
      this.$nextTick(() => {
        // 页面渲染完成后的回调
        this.changeTab();
      });
    }
  },
  created () {
    if (!this.tim.isLogin) {
      this.bindEvent();
    } else {
      this.isLoading = false;
    }
    this.checkState();
  },
  mounted () {
    this.playLiver();
    this.$bus.$on('hideSearchResult', () => {
      this.showSearch = false;
      this.patientName = "";
      this.content = "";
    })
    this.$bus.$on("getPatientList", (timeKeys, timeAndMultiTalk) => {
      this.timeKeys = timeKeys;
      this.timeAndMultiTalk = timeAndMultiTalk;
    })
  },
  methods: {
    changeInput (val) {
      this.patientName = val;
      if (val) {
        this.showSearch = true;
      } else {
        this.showSearch = false;
      }
    },
    handleTabClick (val) {
      if (val.paneName === "missedPatients") {
        this.$nextTick(() => {
          this.$refs.mychild[0].clearContact();
          // this.$refs.mychild[0].initList();
          // this.$refs.mychild[0].listenBusMsg();
        });
      }
    },
    // 消息未读
    messageTotalUnreadChange (val) {
      if (val.apiKey === "inquiry") {
        this.messageTotalUnread = val.totalCount;
      }
    },
    missedPatientsTotalUnreadChange (val) {
      this.missedPatientsTotalUnread = val;
      if (val.apiKey === "missedPatients") {
        this.missedPatientsTotalUnread = val.totalCount;
      }
    },
    handleClick (index) {
      this.active = index;
    },
    changeTab () {
      const w = this.$refs.tabs.offsetWidth;
      this.active_bar_left = 55 + (this.active * (w - 80)) / 2 + "px";
    },
    checkState () {
      let params = {
        jobType: this.userInfo.jobType,
        staffID: this.userInfo.keyID
      };
      this.$_http
        .post(this.$_API.INTERFACE_7MOOR_ORGSEAT_GET_STATUS, params)
        .then(res => {
          if (!res) return;
          this.haveSeat = res.data.haveSeat;
          this.isShow = res.data.seatStatus;
        });
    },
    signIn () {
      let params = {
        jobType: this.userInfo.jobType,
        staffID: this.userInfo.keyID
      };
      this.$_http
        .post(this.$_API.INTERFACE_7MOOR_ORGSEAT_SIGNIN, params)
        .then(res => {
          if (!res) return;
          this.$_success("接入成功...");
          this.checkState();
        });
    },
    signOut () {
      this.$confirm("断开后，不能正常接听患者来电！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            jobType: this.userInfo.jobType,
            staffID: this.userInfo.keyID
          };
          this.$_http
            .post(this.$_API.INTERFACE_7MOOR_ORGSEAT_SIGNOUT, params)
            .then(res => {
              if (!res) return;
              this.$_success("断开成功...");
              this.checkState();
            });
        })
        .catch(() => { });
    },
    playLiver () {
      // var player = new TcPlayer("id_test_video", {
      //   m3u8:
      //     "http://3891.liveplay.myqcloud.com/live/1400188366_13790_733791_main.flv", // 这个替换成flv接可以了
      //   autoplay: true, // iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
      //   poster: "http://www.test.com/myimage.jpg",
      //   width: "480", // 视频的显示宽度，请尽量使用视频分辨率宽度
      //   height: "320" // 视频的显示高度，请尽量使用视频分辨率高度
      // });
    }
  }
};
</script>
<style>
.el-tabs__content {
  height: calc(100% - 50px);
}
</style>

<style lang="scss" scoped>
.badge {
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #e8e8e8;
  position: absolute;
  z-index: 9;
}
#search-box {
  border-bottom: 1px solid #e8e8e8;
  padding: 0 20px;
  height: 77px;
  line-height: 77px;
  position: relative;
  .my-input {
    border-radius: 5px;
    width: 100%;
    max-width: 100%;
  }
  .btn-search {
    color: #ffffff !important;
    background: #1b8df7 !important;
    padding: 10px;
  }
  .btn-merge {
    float: right;
    padding: 0;
    height: 33px;
    padding: 0 5px;
  }
}
#patient-tab {
  margin-bottom: 10px;
  border-bottom: 1px solid #d0cbcb;
  display: flex;
  padding: 0 40px;
  position: relative;
  span {
    flex: 1;
    min-width: 60px;
    text-align: center;
    margin: 0 15px;
    padding: 10px 0;
    height: 50px;
    line-height: 30px;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    cursor: pointer;
  }
  .active_bar {
    position: absolute;
    bottom: 0;
    height: 2px;
    width: calc(50% - 70px);
    background-color: #409eff;
    z-index: 1;
    transition: 0.3s;
    list-style: none;
  }
  .active {
    color: #409eff;
    // border-bottom: 2px solid #409eff;
  }
}
#list-box {
  height: calc(100% - 138px);
  overflow: auto;
}

::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  height: 30px;
  background-color: #b8b8b8;
  outline-offset: -2px;
  filter: alpha(opacity = 50);
  -moz-opacity: 0.5;
  -khtml-opacity: 0.5;
  opacity: 0.5;
}
.delMedicineIconImg {
  width: 26px;
  height: 26px;
  margin-left: 10px;
  margin-top: 10px;
}
.flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.style-font {
  font-size: 14px;
  color: #8e949d;
  margin-left: 10px;
  margin-top: -5px;
}
.pointer {
  cursor: pointer;
}
#search-list-box {
  border: 1px solid #e8e8e8;
  position: absolute;
  top: 77px;
  left: 0;
  background-color: #fff;
  min-height: 130px;
  width: 100%;
  z-index: 120;
  box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.1);
  .title {
    padding-left: 5px;
    height: 60px;
    font-size:14px;
    line-height: 60px;
    border-bottom: 1px solid #d0cbcb;
  }
}
</style>
