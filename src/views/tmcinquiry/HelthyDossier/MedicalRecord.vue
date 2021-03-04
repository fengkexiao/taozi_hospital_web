<template>
  <div class="app-container base-page">
    <div class="inline pl24">
      <div class="left">
        <p><span class="color-blue">丨</span><span><b>历史病历列表</b></span></p>
      </div>
      <div class="track-rcol">
        <div class="track-list">
          <ul v-for="(item, index) in doctorGroupList" :key="index">
            <li>
              <div>
                <span class="time">{{item.addTime}}</span>
                <i class="node-icon"></i>
                <span class="txt">{{item.symptom}}</span>
              </div>
              <div class="flex">
                <!-- <div><el-image class="Img" :src="url"></el-image></div> -->
                <div class="text"><span v-if="item.staffType === 0">执业医师</span><span v-if="item.staffType === 1">IP医生</span></div>
                <div class="text">{{item.staffName}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Img from "@/assets/image/tmcinquiry/doctor.png";
export default {
  name: "communication",
  components: {
    // eslint-disable-next-line vue/no-unused-components
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["keyID", "orgID"],
  filters: {},
  data () {
    return {
      url: Img,
      doctorGroupList: {}
    };
  },
  activated () {
    this.getDoctorGroupList();
  },
  methods: {
    getDoctorGroupList () {
      let params = {
        orgID: this.orgID,
        patientID: this.keyID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_PATIENT_SYMPTOM_LIST, { params })
        .then(response => {
          if (!response.data) return;
          this.doctorGroupList = response.data;
          // console.log(response, 22222222);
        });
    },
    searchList () {
      this.page.pageIndex = 1;
      this.getDoctorGroupList();
    },
    handleSizeChange (val) {
      this.page.PageSize = val;
      this.getDoctorGroupList();
    },
    handleCurrentChange (val) {
      this.page.pageIndex = val;
      this.getDoctorGroupList();
    }
  },
  created () {
    this.getDoctorGroupList();
  }
};
</script>

<style scoped>
.color-blue {
  color: #438bef;
  font-weight: 800;
}
ul li {
  list-style: none;
}
.track-rcol {
  width: 100%;
}
.track-list {
  margin: 20px;
  padding-left: 105px;
  position: relative;
}
.track-list li {
  position: relative;
  padding: 25px 0 0 25px;
  line-height: 18px;
  /* border-left: 1px solid #d9d9d9; */
  color: #999;
  font-size: 14px;
}
.track-list li.first {
  padding-top: 10px;
  border-left-color: #fff;
}
.track-list li .node-icon {
  position: absolute;
  left: -6px;
  top: 105%;
  width: 11px;
  height: 11px;
  background: url(../../../assets/image/tmcinquiry/order-icons.png) -21px -72px
    no-repeat;
}
/* .track-list li.first .node-icon {
  background-position: 0 -72px;
} */
.track-list li .time {
  margin-right: 20px;
  position: relative;
  top: 4px;
  left: -183px;
  display: inline-block;
  vertical-align: middle;
}
.track-list li .txt {
  max-width: 88%;
  position: relative;
  top: 4px;
  left: -143px;
  display: inline-block;
  vertical-align: middle;
}
.track-list li.first .time {
  margin-right: 20px;
}
.track-list li.first .txt {
  max-width: 88%;
}
.Img {
  width: 16px;
  height: 16px;
}
.flex div {
  float: left;
  margin-top: 8px;
  margin-left: 5px;
}
.text {
  line-height: 30px;
}
</style>
