<template>
  <div id="container" ref="containerRef">
    <div v-show="noShow">{{getTMCInfo}}</div>
    <div id="box-card" >
      <div id="list">
        <img src="@/assets/image/soundOn.png" alt="" class="sound" v-if="isOn" @click="setSound(false)" title="声音开启">
        <img src="@/assets/image/soundOff.png" alt="" class="sound" v-else @click="setSound(true)" title="声音静音">
        <patientList :isOn="isOn"></patientList>
      </div>
      <div v-if="!isHavePatient" style="flex: 7">
        <keep-alive>
          <chatIndexNonePatient></chatIndexNonePatient>
        </keep-alive>
      </div>
      <div v-else style="flex: 7">
        <chatIndex></chatIndex>
      </div>
    </div>
  </div>
</template>

<script>
import patientList from "./conversation/patientList";
import chatIndex from "./conversation/chatIndex";
import chatIndexNonePatient from "./conversation/chatIndexNonePatient";
import { mapGetters, mapActions } from "vuex";
import timPublic from "./conversation/timPublic";
export default {
  name: "TMCInquiry-MyInquiry",
  components: {
    patientList,
    chatIndex,
    chatIndexNonePatient
  },
  mixins: [timPublic],
  data () {
    return {
      isOn:false,
      noShow: false,
      isHavePatient: false,
      isFlagLoading: false
    };
  },
  computed: {
    ...mapGetters(["userInfo", "tmc", "tim"]),
    getTMCInfo () {
      let that = this;
      if (that.tmc.patientID) {
        that.isHavePatient = true;
      } else {
        that.isHavePatient = false;
      }
      return "hello";
    }
  },
  watch: {

  },
  mounted () {
    this.getUserSig();
    this.$nextTick(() => {
      this.$refs.containerRef.style.height = (document.body.clientHeight - 134) + 'px'
    })
    window.onresize= () => {
      this.$refs.containerRef.style.height = (document.body.clientHeight - 134) + 'px'
    }
  },
  methods: {
    ...mapActions({
      login: "tim/login", // 登录TIM
      logout: "tim/logout" // 登出
    }),
    setSound(val){
      this.isOn = val;
    },
    // 获取当前用户 userSig
    getUserSig () {
      if (!this.tim.isLogin) {
        let params = {
          userId: this.userInfo.keyID
        };
        this.$_http
          .get(this.$_API.API_RP_INITIAL_GETUSERSIG, {
            params
          })
          .then(res => {
            if (!res.data) return;
            let userSig = res.data.userSig;
            this.login({ userID: this.userInfo.keyID, userSig: userSig });
          });
      }
    }
  },
  destroyed () {
    // this.logout();
    // this.unbindEvent();
  }
};
</script>

<style lang="scss" scoped>
#container {
  height: 100%;
  background: #f0f2f5;
  #box-card {
    margin: 0;
    background: #fff;
    padding: 0;
    height: 100%;
    display: flex;
    border-radius: 2px;
    /*box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);*/
    #list {
      flex: 1.8;
      position: relative;
      .sound{
        position: absolute;
        bottom: 10px;
        right: 10px;
        cursor: pointer;
        height: 20px;
        width: 20px;
      }
    }
    #chat {
      flex: 4;
      border-left: 1px solid #e8e8e8;
      border-right: 1px solid #e8e8e8;
    }
    #form {
      // width: 485px;
      border-right: 1px solid #e8e8e8;
      overflow-y: auto;
    }
  }
}
</style>
