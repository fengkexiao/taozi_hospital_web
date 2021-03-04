<template>
  <div class="app-container base-page" id="DutyPlanForYunInquiryBody">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">医生姓名：</span>
        <el-input v-model="query.doctorName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">手机号：</span>
        <el-input v-model="query.phone" form-type="phone" placeholder="请输入" clearable maxlength="11"></el-input>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getDoctorListValidate">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetForm('queryForm')">重置</el-button>
      </div>
    </div>
    <!--表格-->
    <base-title name="问诊列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-setting" @click="currencyTimeSet" v-if="userInfo.orgTypeID !== 4">通用时间设置</el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" :class="[userInfo.orgTypeID !== 4?'':'mt24']" :loading="tableLoading">
      <el-table-column prop="doctorName" label="医生姓名" align="center"></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
      <el-table-column prop="textPriceShow" label="图文问诊价格" align="center"></el-table-column>
      <el-table-column prop="telePriceShow" label="电话问诊价格" align="center"></el-table-column>
      <el-table-column prop="videoPriceShow" label="视频问诊价格" align="center"></el-table-column>
      <el-table-column v-if="userInfo.orgTypeID !== 4" prop="maxScheduleDate" label="网上坐诊已排班至" width="150px" align="center"></el-table-column>
      <el-table-column label="操作" width="350px" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="priceSet(row)">价格设置</span>
            <div class="line" v-if="userInfo.orgTypeID !== 4"></div>
            <span class=" opt-text" v-if="userInfo.orgTypeID !== 4" @click="practiseScheduleSet (row)">网上坐诊排班设置</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getDoctorList" @current-change="getDoctorList" />
    <!--通用时间设置-->
    <div id="currencyTimeSetting">
      <el-dialog title="通用时间设置" :visible.sync="currencyTimeSettingVisible" width="900px" @close="cancelPriceSetting">
        <!--          <el-card class="box-card">-->
        <el-form :model="currencyTimeSettingData" ref="currencyTimeSettingForm" label-width="100px" class="demo-dynamic">
          <el-form-item v-for="(item, index) in currencyTimeSettingData.collocation" :key="index" :label="'时间段'+(index+1)+'：'">
            <el-col :span="5">
              <el-form-item prop="title">
                <el-input v-model="item.title" placeholder="请输入时间段名" label-name="时间段名"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1.5">&emsp;：&emsp;</el-col>
            <el-col :span="12">
              <el-form-item prop="startTime">
                <el-time-picker is-range v-model="item.times" range-separator="至" format="HH:mm" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
              </el-form-item>
            </el-col>
            <el-button type="primary" @click="addDomain">+</el-button>
            <el-button type="danger" @click.prevent="removeDomain(item)" v-if="index>0">-</el-button>
          </el-form-item>

          <el-form-item label label-width="330px">
            <el-button @click="cancelPriceSetting">取消</el-button>
            <el-button type="primary" @click="saveCurrencyTimeSetting">确定</el-button>
          </el-form-item>
        </el-form>
        <!--          </el-card>-->
      </el-dialog>
    </div>

    <!--医生价格设置-->
    <div id="priceSetting">
      <el-dialog title="价格设置" :visible.sync="priceSettingVisible" width="540px" @close="resetPriceSettingForm">
        <!--          <el-card class="box-card">-->
        <el-form :model="priceSettingData" ref="priceSettingForm" label-width="140px" class="demo-dynamic">
          <div v-if="userInfo.orgTypeID === 4" class="colum-box">
            <el-checkbox v-model="priceSettingData.textIsOpen">开通</el-checkbox>
            <el-form-item class="elform-box" prop="textPrice" label="图文问诊价格（元）">
              <el-input v-model="priceSettingData.textPriceShow" placeholder="请输入图文问诊价格" label-name="图文问诊价格" form-type="money" :disabled="priceSettingData.textIsOpen && priceSettingData.textPriceFree || !priceSettingData.textIsOpen"></el-input>&emsp;
              <el-checkbox v-model="priceSettingData.textPriceFree" :disabled="!priceSettingData.textIsOpen">免费</el-checkbox>
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item prop="textPrice" label="图文问诊价格（元）">
              <el-input v-model="priceSettingData.textPriceShow" placeholder="请输入图文问诊价格" label-name="图文问诊价格" form-type="money" :disabled="priceSettingData.textPriceFree"></el-input>&emsp;
              <el-checkbox v-model="priceSettingData.textPriceFree">免费</el-checkbox>
            </el-form-item>
          </div>

          <div v-if="userInfo.orgTypeID === 4" class="colum-box">
            <el-checkbox v-model="priceSettingData.teleIsOpen">开通</el-checkbox>
            <el-form-item class="elform-box" prop="telePrice" label="电话问诊价格（元）">
              <el-input v-model="priceSettingData.telePriceShow" placeholder="请输入电话问诊价格" label-name="电话问诊价格" form-type="money" :disabled="priceSettingData.teleIsOpen && priceSettingData.telePriceFree || !priceSettingData.teleIsOpen"></el-input>&emsp;
              <el-checkbox v-model="priceSettingData.telePriceFree" :disabled="!priceSettingData.teleIsOpen">免费</el-checkbox>
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item prop="telePrice" label="电话问诊价格（元）">
              <el-input v-model="priceSettingData.telePriceShow" placeholder="请输入电话问诊价格" label-name="电话问诊价格" form-type="money" :disabled="priceSettingData.telePriceFree"></el-input>&emsp;
              <el-checkbox v-model="priceSettingData.telePriceFree">免费</el-checkbox>
            </el-form-item>
          </div>

          <div v-if="userInfo.orgTypeID === 4" class="colum-box">
            <el-checkbox v-model="priceSettingData.videoIsOpen">开通</el-checkbox>
            <el-form-item class="elform-box" prop="videoPrice" label="视频问诊价格（元）">
              <el-input v-model="priceSettingData.videoPriceShow" placeholder="请输入视频问诊价格" label-name="视频问诊价格" form-type="money" :disabled="priceSettingData.videoIsOpen && priceSettingData.videoPriceFree || !priceSettingData.videoIsOpen"></el-input>&emsp;
              <el-checkbox v-model="priceSettingData.videoPriceFree" :disabled="!priceSettingData.videoIsOpen">免费</el-checkbox>
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item prop="videoPrice" label="视频问诊价格（元）">
              <el-input v-model="priceSettingData.videoPriceShow" placeholder="请输入视频问诊价格" label-name="视频问诊价格" form-type="money" :disabled="priceSettingData.videoPriceFree"></el-input>&emsp;
              <el-checkbox v-model="priceSettingData.videoPriceFree">免费</el-checkbox>
            </el-form-item>
          </div>

          <el-form-item style="margin-top:20px;" label label-width="180px">
            <el-button @click="resetPriceSettingForm">取消</el-button>
            <el-button type="primary" @click="savePriceSetting">确定</el-button>
          </el-form-item>
        </el-form>
        <!--          </el-card>-->
      </el-dialog>
    </div>
  </div>
</template>

<script>
import InputWithTip from "@/components/InputWithTip";
import { mapGetters } from "vuex";
import { formatDateTime } from "../../filters";
export default {
  name: "DutyPlanForYunInquiry",
  inject: ["reload"],
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InputWithTip
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      priceSettingVisible: false,
      priceSettingData: {},
      currencyTimeSettingData: {
        collocation: [
          {
            title: "上午",
            startTime: "",
            endTime: "",
            times: [new Date(2019, 9, 30, 8, 30), new Date(2019, 9, 30, 12, 0)]
          },
          {
            title: "下午",
            startTime: "",
            endTime: "",
            times: [
              new Date(2019, 9, 30, 13, 30),
              new Date(2019, 9, 30, 17, 30)
            ]
          },
          {
            title: "晚上",
            startTime: "",
            endTime: "",
            times: [new Date(2019, 9, 30, 7, 0), new Date(2019, 9, 30, 23, 0)]
          }
        ]
      },
      currencyTimeSettingVisible: false,
      tableLoading: false,
      tableData: [],
      query: {
        doctorName: "",
        phone: ""
      },
      pageInfo: { pageIndex: 1, pageSize: 10, totalRow: 0, totalPage: 1 },
      // 电话号码正则及提示
      formRules: {
        phone: [
          {
            trigger: "blur",
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码（11位）"
          }
        ]
      }
    };
  },
  created () { },
  activated () {
    this.getDoctorListValidate();
  },
  methods: {
    getDoctorListValidate () {
      // this.$refs.queryForm.validate(valid => {
      //   if (!valid) {
      //     return;
      //   }
      this.getDoctorList();
      //});
    },

    getDoctorList () {
      this.$_http
        .get(this.$_API.INTERFACE_GET_DOCTOR_LIST, {
          params: {
            orgID: this.userInfo.orgID,
            doctorTypeID: 1,
            ...this.query,
            ...this.pageInfo
          }
        })
        .then(response => {
          if (!response.data) return;
          let temp = response.data.datas;
          this.pageInfo = response.data.pageInfo;
          let ids = [];
          ids.push(this.userInfo.orgID);
          temp.forEach(doctor => {
            ids.push(doctor.keyID);
          });
          if (ids.length > 1) {
            this.getPriceInfo(ids, temp);
          } else {
            this.tableData = [];
          }
        });
    },

    getPriceInfo (doctorIDs, temp) {
      this.$_http
        .post(this.$_API.INTERFACE_YUNINQUIR_SCHEDULE_LIST, doctorIDs)
        .then(response => {
          // console.log("获取问诊价格：" + JSON.stringify(response.data) + " ==" + this.$_API.INTERFACE_YUNINQUIR_SCHEDULE_LIST);
          if (!response.data) return;
          let prices = response.data;
          if (this.userInfo.orgTypeID === 4) {
            // 互联网医院
            temp.forEach((item, index) => {
              prices.forEach(price => {
                if (item.keyID === price.doctorID) {
                  temp[index].isTextDisable = price.isTextDisable;
                  temp[index].isTelDisable = price.isTelDisable;
                  temp[index].isVideoDisable = price.isVideoDisable;
                  temp[index].textPrice = price.textPrice;
                  temp[index].videoPrice = price.videoPrice;
                  temp[index].telePrice = price.telePrice;
                  temp[index].maxScheduleDate = price.maxScheduleDate;
                  temp[index].priceKeyID = price.keyID;
                }
              });
            });
            temp.forEach(item => {
              if (item.isTextDisable === 0) {
                // 图文开通
                this.priceSettingData.textIsOpen = true;
                if (!item.textPrice) {
                  item.textPriceShow = "免费";
                } else {
                  item.textPriceShow = item.textPrice / 100;
                }
              } else if (item.isTextDisable === 1) {
                // 图文未开通
                this.priceSettingData.textIsOpen = false;
                item.textPriceShow = "未开通";
                item.textPriceHint = 0;
              }

              if (item.isTelDisable === 0) {
                // 电话开通
                this.priceSettingData.teleIsOpen = true;
                if (!item.telePrice) {
                  item.telePriceShow = "免费";
                } else {
                  item.telePriceShow = item.telePrice / 100;
                }
              } else if (item.isTelDisable === 1) {
                // 电话未开通
                this.priceSettingData.teleIsOpen = false;
                item.telePriceShow = "未开通";
                item.telePriceHint = 0;
              }

              if (item.isVideoDisable === 0) {
                // 视频开通
                this.priceSettingData.videoIsOpen = true;
                if (!item.videoPrice) {
                  item.videoPriceShow = "免费";
                } else {
                  item.videoPriceShow = item.videoPrice / 100;
                }
              } else if (item.isVideoDisable === 1) {
                // 视频未开通
                this.priceSettingData.videoIsOpen = false;
                item.videoPriceShow = "未开通";
                item.videoPriceHint = 0;
              }

              if (item.maxScheduleDate === "1900-01-01") {
                item.maxScheduleDate = "";
              }
            });
          } else {
            temp.forEach((item, index) => {
              prices.forEach(price => {
                if (item.keyID === price.doctorID) {
                  temp[index].textPrice = price.textPrice;
                  temp[index].videoPrice = price.videoPrice;
                  temp[index].telePrice = price.telePrice;
                  temp[index].maxScheduleDate = price.maxScheduleDate;
                  temp[index].priceKeyID = price.keyID;
                }
              });
            });
            temp.forEach(item => {
              if (!item.textPrice) {
                item.textPriceShow = "免费";
              } else {
                item.textPriceShow = item.textPrice / 100;
              }
              if (!item.telePrice) {
                item.telePriceShow = "免费";
              } else {
                item.telePriceShow = item.telePrice / 100;
              }
              if (!item.videoPrice) {
                item.videoPriceShow = "免费";
              } else {
                item.videoPriceShow = item.videoPrice / 100;
              }

              if (item.maxScheduleDate === "1900-01-01") {
                item.maxScheduleDate = "";
              }
            });
          }
          this.tableData = temp;
        });
    },

    currencyTimeSet () {
      this.$_http
        .get(this.$_API.INTERFACE_YUNINQUIR_GET_BASE_SCHEDULE, {
          params: {
            hospitalID: this.userInfo.orgID
          }
        })
        .then(response => {
          console.log(response);
          this.currencyTimeSettingVisible = true;
          if (!response.data || response.data.length === 0) {
            return;
          }
          let data = response.data;
          let temp = [];
          data.forEach(item => {
            let time1 = new Date("2019/9/30 " + item.startTime);
            let time2 = new Date("2019/9/30 " + item.endTime);
            item.times = [time1, time2];
            temp.push(item);
          });
          this.currencyTimeSettingData = {
            collocation: temp
          };
        });
    },
    practiseScheduleSet (row) {
      this.$_http
        .get(this.$_API.INTERFACE_YUNINQUIR_GET_BASE_SCHEDULE, {
          params: {
            hospitalID: this.userInfo.orgID
          }
        })
        .then(response => {
          if (!response.data || response.data.length === 0) {
            this.$confirm("通用时间设置暂未设定，是否前去完成设置?", "提示", {
              confirmButtonText: "去设置",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.currencyTimeSettingVisible = true;
              })
              .catch(() => { });
          } else {
            if (!row || !row.keyID) {
              return;
            }
            this.$router.push({
              name: "PractiseOnInternetSchedule",
              params: { keyID: row.keyID }
            });
          }
        });
    },

    priceSet (row) {
      let data = JSON.parse(JSON.stringify(row));
      console.log("价格设置------", data);
      if (this.userInfo.orgTypeID === 4) {
        // 互联网医院
        if (data.isTextDisable === 0) {
          // 图文开通
          data.textIsOpen = true;
          if (data.textPriceShow === "免费") {
            data.textPriceFree = true;
            data.textPriceShow = 0;
          } else {
            data.textPriceFree = false;
          }
        } else if (data.isTextDisable === 1) {
          // 图文不开通
          data.textIsOpen = false;
          data.textPriceShow = "未开通";
        } else {
          data.textIsOpen = false;
          data.textPriceShow = "";
        }

        if (data.isTelDisable === 0) {
          // 电话开通
          data.teleIsOpen = true;
          if (data.telePriceShow === "免费") {
            data.telePriceFree = true;
            data.telePriceShow = 0;
          } else {
            data.telePriceFree = false;
          }
        } else if (data.isTelDisable === 1) {
          // 电话不开通
          data.teleIsOpen = false;
          data.telePriceShow = "未开通";
        } else {
          data.teleIsOpen = false;
          data.telePriceShow = "";
        }

        if (data.isVideoDisable === 0) {
          // 视频开通
          data.videoIsOpen = true;
          if (data.videoPriceShow === "免费") {
            data.videoPriceFree = true;
            data.videoPriceShow = 0;
          } else {
            data.videoPriceFree = false;
          }
        } else if (data.isVideoDisable === 1) {
          // 视频不开通
          data.videoIsOpen = false;
          data.videoPriceShow = "未开通";
        } else {
          data.videoIsOpen = false;
          data.videoPriceShow = "";
        }
      } else {
        // 非互联网医院
        if (data.textPriceShow === "免费") {
          data.textPriceFree = true;
          data.textPriceShow = 0;
        } else {
          data.textPriceFree = false;
        }

        if (data.telePriceShow === "免费") {
          data.telePriceFree = true;
          data.telePriceShow = 0;
        } else {
          data.telePriceFree = false;
        }

        if (data.videoPriceShow === "免费") {
          data.videoPriceFree = true;
          data.videoPriceShow = 0;
        } else {
          data.videoPriceFree = false;
        }
      }

      this.priceSettingData = data;
      // console.log("价格设置进来------" + JSON.stringify(data));

      this.priceSettingVisible = true;
    },

    resetPriceSettingForm () {
      this.priceSettingData = {};
      // this.resetForm("priceSettingForm");
      this.query = {

      }
      this.priceSettingVisible = false;
    },

    savePriceSetting () {
      if (this.userInfo.orgTypeID === 4) {
        // 互联网医院
        if (this.priceSettingData.textIsOpen) {
          // 图文开通
          this.priceSettingData.isTextDisable = 0;
          if (this.priceSettingData.textPriceFree) {
            this.priceSettingData.textPrice = 0;
          } else {
            this.priceSettingData.textPrice =
              this.priceSettingData.textPriceShow * 100;
          }
        } else {
          // 图文不开通
          this.priceSettingData.isTextDisable = 1;
        }

        if (this.priceSettingData.teleIsOpen) {
          // 电话开通
          this.priceSettingData.isTelDisable = 0;
          if (this.priceSettingData.telePriceFree) {
            this.priceSettingData.telePrice = 0;
          } else {
            this.priceSettingData.telePrice =
              this.priceSettingData.telePriceShow * 100;
          }
        } else {
          // 电话不开通
          this.priceSettingData.isTelDisable = 1;
        }

        if (this.priceSettingData.videoIsOpen) {
          // 视频开通
          this.priceSettingData.isVideoDisable = 0;
          if (this.priceSettingData.videoPriceFree) {
            this.priceSettingData.videoPrice = 0;
          } else {
            this.priceSettingData.videoPrice =
              this.priceSettingData.videoPriceShow * 100;
          }
        } else {
          // 视频不开通
          this.priceSettingData.isVideoDisable = 1;
        }
      } else {
        // 非互联网医院
        if (this.priceSettingData.textPriceFree) {
          this.priceSettingData.textPrice = 0;
        } else {
          this.priceSettingData.textPrice =
            this.priceSettingData.textPriceShow * 100;
        }
        if (this.priceSettingData.telePriceFree) {
          this.priceSettingData.telePrice = 0;
        } else {
          this.priceSettingData.telePrice =
            this.priceSettingData.telePriceShow * 100;
        }
        if (this.priceSettingData.videoPriceFree) {
          this.priceSettingData.videoPrice = 0;
        } else {
          this.priceSettingData.videoPrice =
            this.priceSettingData.videoPriceShow * 100;
        }
      }

      if (
        this.priceSettingData.textPrice > 999999 ||
        this.priceSettingData.textPrice < 0
      ) {
        this.$_error("图文问诊价格设置错误（0-9999.99）");
        return;
      }
      if (
        this.priceSettingData.telePrice > 999999 ||
        this.priceSettingData.telePrice < 0
      ) {
        this.$_error("电话问诊价格设置错误（0-9999.99）");
        return;
      }
      if (
        this.priceSettingData.videoPrice > 999999 ||
        this.priceSettingData.videoPrice < 0
      ) {
        this.$_error("视频问诊价格设置错误（0-9999.99）");
        return;
      }
      if (this.userInfo.orgTypeID === 4) {
        // 互联网医院
        let params = {
          keyID: this.priceSettingData.priceKeyID,
          doctorID: this.priceSettingData.keyID,
          hospitalID: this.userInfo.orgID,
          textPrice: this.priceSettingData.isTextDisable === 1 ? 0 : this.priceSettingData.textPrice,
          telePrice: this.priceSettingData.isTelDisable === 1 ? 0 : this.priceSettingData.telePrice,
          videoPrice: this.priceSettingData.isVideoDisable === 1 ? 0 : this.priceSettingData.videoPrice,
          isTextDisable: this.priceSettingData.isTextDisable, // 0：开通 1：未开通
          isTelDisable: this.priceSettingData.isTelDisable,
          isVideoDisable: this.priceSettingData.isVideoDisable
        };
        this.$_http
          .post(this.$_API.INTERFACE_YUNINQUIR_SAVE_DOC_INQUIRY_PRICE, params)
          .then(response => {
            // console.log("保存问诊价格：" + ",传参：" + JSON.stringify(params) + ",返回结果：" + JSON.stringify(response));
            this.resetPriceSettingForm();
            this.getDoctorList();
          });
      } else {
        // 非互联网医院
        let params = {
          keyID: this.priceSettingData.priceKeyID,
          doctorID: this.priceSettingData.keyID,
          hospitalID: this.userInfo.orgID,
          textPrice: this.priceSettingData.textPrice,
          telePrice: this.priceSettingData.telePrice,
          videoPrice: this.priceSettingData.videoPrice
        };
        this.$_http
          .post(this.$_API.INTERFACE_YUNINQUIR_SAVE_DOC_INQUIRY_PRICE, params)
          .then(response => {
            this.resetPriceSettingForm();
            this.getDoctorList();
          });
      }
    },
    removeDomain (item) {
      let index = this.currencyTimeSettingData.collocation.indexOf(item);
      if (index !== -1) {
        this.currencyTimeSettingData.collocation.splice(index, 1);
      }
    },
    addDomain () {
      this.currencyTimeSettingData.collocation.push({
        title: "",
        startTime: "",
        endTime: ""
      });
    },
    saveCurrencyTimeSetting () {
      let params = [];
      this.currencyTimeSettingData.collocation.forEach(setting => {
        let item = JSON.parse(JSON.stringify(setting));
        let timeString1 = formatDateTime(item.times[0]).substr(11);
        let timeString2 = formatDateTime(item.times[1]).substr(11);
        item.startTime = timeString1;
        item.endTime = timeString2;
        item.hospitalID = this.userInfo.orgID;
        delete item.times;
        params.push(item);
      });
      this.$_http
        .post(this.$_API.INTERFACE_YUNINQUIR_SAVE_BASE_SCHEDULE, params)
        .then(respone => {
          this.cancelPriceSetting();
        });
    },
    cancelPriceSetting () {
      this.currencyTimeSettingVisible = false;
      this.resetForm("currencyTimeSettingForm");
      this.currencyTimeSettingData = {
        collocation: [
          {
            title: "上午",
            startTime: "",
            endTime: "",
            times: [new Date(2019, 9, 30, 8, 30), new Date(2019, 9, 30, 12, 0)]
          },
          {
            title: "下午",
            startTime: "",
            endTime: "",
            times: [
              new Date(2019, 9, 30, 13, 30),
              new Date(2019, 9, 30, 17, 30)
            ]
          },
          {
            title: "晚上",
            startTime: "",
            endTime: "",
            times: [new Date(2019, 9, 30, 7, 0), new Date(2019, 9, 30, 23, 0)]
          }
        ]
      };
    },
    resetForm (formName) {
      this.query = {
        doctorName: "",
        phone: ""
      }
      //this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
.colum-box {
  display: flex;
  align-items: center;
}

.elform-box {
  margin-left: 30px;
  margin-top: 20px;
}
</style>
