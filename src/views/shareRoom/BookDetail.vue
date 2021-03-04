<template>
  <div class="app-container base-page">
    <base-loading :loading="tableLoading">
    <base-title name="预约到院详情"></base-title>
      <div id="bookDetailBody" v-if="patientBookingOrderDetailData.personRoomOrder" class="pl24 mt24">
        <el-form :modal="patientBookingOrderDetailData" label-width="180px">
          <el-form-item label="诊室名称：">
            <template>{{patientBookingOrderDetailData.personRoomOrder.roomName}}</template>
          </el-form-item>
          <el-form-item label="预约时间：">
            <template>{{patientBookingOrderDetailData.personRoomOrder.bookDate}} {{patientBookingOrderDetailData.personRoomOrder.openPeriodName}}</template>
          </el-form-item>
          <el-form-item label="医生名称：">
            <template>{{patientBookingOrderDetailData.personRoomOrder.doctorName}}</template>
          </el-form-item>
          <el-form-item label="医生电话：">
            <template>{{patientBookingOrderDetailData.personRoomOrder.doctorPhone}}</template>
          </el-form-item>
          <el-form-item label="患者名称：">
            <template>{{patientBookingOrderDetailData.personRoomOrder.personName}}</template>
          </el-form-item>
          <el-form-item label="患者电话：">
            <template>{{patientBookingOrderDetailData.personRoomOrder.personPhone}}</template>
          </el-form-item>
          <el-form-item label="下单时间：">
            <template>{{patientBookingOrderDetailData.personRoomOrder.createTime | formatDateTime}}</template>
          </el-form-item>
          <el-form-item label="状态：">
            <span class="statusTxtBold" v-if="patientBookingOrderDetailData.personRoomCost">{{patientBookingOrderDetailData.personRoomCost.costStatusName}}</span>
            <span class="statusTxtBold" v-else-if="patientBookingOrderDetailData.personRoomBook">{{patientBookingOrderDetailData.personRoomBook.bookStatusName}}</span>
            <span class="statusTxtBold" v-else>{{patientBookingOrderDetailData.personRoomOrder.orderStatusName}}</span>
            <div style="margin-bottom: 15px"></div>
          </el-form-item>
          <span v-if="patientBookingOrderDetailData.personRoomCost">
            <!--              结算完成-->
            <span v-if="patientBookingOrderDetailData.personRoomCost.costStatusID === 4">
              <el-form-item label="提交时间：">
                <template>
                  {{patientBookingOrderDetailData.personRoomCost.costCreateTime | formatDateTime}}
                </template>
              </el-form-item>
              <el-form-item label="提交人：">
                <template>{{patientBookingOrderDetailData.personRoomCost.costCreateUser}}</template>
              </el-form-item>
              <el-form-item label="审核时间：">
                <template>
                  {{patientBookingOrderDetailData.personRoomCost.costAuditTime | formatDateTime}}
                </template>
              </el-form-item>
              <el-form-item label="审核人：">
                <template>{{patientBookingOrderDetailData.personRoomCost.costAuditUser}}</template>
              </el-form-item>
              <el-form-item label="HIS系统结算金额（元）：">
                <template>{{patientBookingOrderDetailData.personRoomCost.costFeeTotal / 100}}</template>
              </el-form-item>
              <el-form-item label="HIS系统结算凭证(截图)：">
                <span v-if="personRoomCostPics">
                  <span v-for="(item,index) in personRoomCostPics" :key="index" class="isHover">
                    <base-image :src="item.picFileUrl" @click="handlePictureCardPre(item)" style="border: 1px solid #c0ccda;border-radius: 6px;overflow: hidden;">
                      <span class="el-upload-list__item-preview"></span>
                    </base-image>
                    <div class="meng">
                      <i class="el-icon-zoom-in iconScale" @click="handlePictureCardPre(item)"></i>
                    </div>
                  </span>
                </span>
                <span v-else>无</span>
              </el-form-item>
              <el-form-item label="医生分账金额（元）：">
                <template>{{patientBookingOrderDetailData.personRoomCost.costFeeDoctor / 100}}</template>
              </el-form-item>
              <el-form-item label="医生分账说明：">
                <template>{{patientBookingOrderDetailData.personRoomCost.profitStatusName}}</template>
              </el-form-item>
            </span>
            <!--              结算审核不通过-->
            <span v-else-if="patientBookingOrderDetailData.personRoomCost.costStatusID === 1 || patientBookingOrderDetailData.personRoomCost.costStatusID === 3">
              <el-form-item label="提交时间">
                <template>
                  {{patientBookingOrderDetailData.personRoomCost.costCreateTime | formatDateTime}}
                </template>
              </el-form-item>
              <el-form-item label="提交人：">
                <template>{{patientBookingOrderDetailData.personRoomCost.costCreateUser}}</template>
              </el-form-item>
              <el-form-item label="审核时间：">
                <template>
                  {{patientBookingOrderDetailData.personRoomCost.costAuditTime | formatDateTime}}
                </template>
              </el-form-item>
              <el-form-item label="审核人：">
                <template>{{patientBookingOrderDetailData.personRoomCost.costAuditUser}}</template>
              </el-form-item>
              <el-form-item label="审核人不通过原因：">
                <template>{{patientBookingOrderDetailData.personRoomCost.costAuditDesc}}</template>
              </el-form-item>
              <el-form-item label="HIS系统结算金额（元）：">
                <template>{{patientBookingOrderDetailData.personRoomCost.costFeeTotal / 100}}</template>
              </el-form-item>
              <el-form-item label="HIS系统结算凭证(截图)：">
                <span v-if="personRoomCostPics">
                  <span v-for="(item,index) in personRoomCostPics" :key="index" class="isHover">
                    <base-image :src="item.picFileUrl" @click="handlePictureCardPre(item)" style="border: 1px solid #c0ccda;border-radius: 6px;overflow: hidden;">
                      <span class="el-upload-list__item-preview"></span>
                    </base-image>
                    <div class="meng">
                      <i class="el-icon-zoom-in iconScale" @click="handlePictureCardPre(item)"></i>
                    </div>
                  </span>
                </span>
                <span v-else>无</span>
              </el-form-item>
              <el-form-item label="医生分账金额（元）：">
                <template>{{patientBookingOrderDetailData.personRoomCost.costFeeDoctor / 100}}</template>
              </el-form-item>
              <el-form-item label="医生分账说明：">
                <template>{{patientBookingOrderDetailData.personRoomCost.profitStatusName}}</template>
              </el-form-item>
            </span>
            <!--              结算中-->
            <span v-else-if="patientBookingOrderDetailData.personRoomCost.costStatusID === 0 || patientBookingOrderDetailData.personRoomCost.costStatusID === 2">
              <el-form-item label="提交时间：">
                <template>
                  {{patientBookingOrderDetailData.personRoomCost.costCreateTime | formatDateTime}}
                </template>
              </el-form-item>
              <el-form-item label="提交人：">
                <template>{{patientBookingOrderDetailData.personRoomCost.costCreateUser}}</template>
              </el-form-item>
              <el-form-item label="审核人：">
                <template>{{patientBookingOrderDetailData.personRoomCost.costAuditUser}}</template>
              </el-form-item>
              <el-form-item label="HIS系统结算金额（元）：">
                <template>{{patientBookingOrderDetailData.personRoomCost.costFeeTotal / 100}}</template>
              </el-form-item>
              <el-form-item label="HIS系统结算凭证（图）：">
                <span v-if="personRoomCostPics">
                  <span v-for="(item,index) in personRoomCostPics" :key="index" class="isHover">
                    <base-image :src="item.picFileUrl" @click="handlePictureCardPre(item)" style="border: 1px solid #c0ccda;border-radius: 6px;overflow: hidden;">
                      <span class="el-upload-list__item-preview"></span>
                    </base-image>
                    <div class="meng">
                      <i class="el-icon-zoom-in iconScale" @click="handlePictureCardPre(item)"></i>
                    </div>
                  </span>
                </span>
                <span v-else>无</span>
              </el-form-item>
              <el-form-item label="医生分账金额（元）：">
                <template>{{patientBookingOrderDetailData.personRoomCost.costFeeDoctor / 100}}</template>
              </el-form-item>
              <el-form-item label="医生分账说明：">
                <template>{{patientBookingOrderDetailData.personRoomCost.profitStatusName}}</template>
              </el-form-item>
            </span>
          </span>
          <!--            已取消：订单已支付-->
          <span v-else-if="patientBookingOrderDetailData.doctorRoomOrder">
            <span v-if="patientBookingOrderDetailData.doctorRoomOrder.orderStatus === 3">
              <el-form-item label="取消时间">
                <template>
                  {{patientBookingOrderDetailData.doctorRoomOrder.comfirmTime | formatDateTime}}
                </template>
              </el-form-item>
              <el-form-item label="申请退款时间">
                <template>
                  {{patientBookingOrderDetailData.personRoomOrder.refundTime | formatDateTime}}
                </template>
              </el-form-item>
            </span>
          </span>
        </el-form>
        <div class="contain-flex justify-content-center form-input-width">
          <el-button @click="back">返回</el-button>
        </div>
      </div>
      <!--      查看大图-->
      <el-dialog :visible.sync="dialogVisible">
        <img width="94%" :src="dialogImageUrl" style="margin-left: 3%" alt="HIS系统截图">
      </el-dialog>
    </base-loading>
  </div>
</template>

<script>
import BaseImage from "../../components/global/base/BaseImage";
export default {
  name: "room-book-detail",
  components: { BaseImage },
  props: {
    keyID: {
      type: String,
      required: true
    }
  },
  inject: ["close"],
  data () {
    return {
      tableLoading: false,
      openPeriodStateOptions: [
        { openPeriod: 0, openPeriodName: "上午" },
        { openPeriod: 1, openPeriodName: "下午" },
        { openPeriod: 2, openPeriodName: "晚上" }
      ],
      // 预约到院详情
      patientBookingOrderDetailData: [],
      patientBookingOrderDetailDataOld: [],
      personRoomCostPics: [],
      // 查看大图片
      dialogVisible: false,
      dialogImageUrl: "",
      searchState: false
    };
  },
  created () {
    let loadList = [this.getPatientBookingOrderDetailFun];
    this.$_http.all(...loadList).finally(it => {
      this.tableLoading = false;
    });
  },
  activated () {
    if (this.searchState) {
      let loadList = [this.getPatientBookingOrderDetailFun];
      this.$_http.all(...loadList).finally(it => {
        this.tableLoading = false;
      });
    }
  },
  methods: {
    // 查询：患者预约到院单个详情，条件：
    getPatientBookingOrderDetailFun () {
      let params = {
        keyID: this.keyID
      };
      this.tableLoading = true;
      let request = this.$_http.get(this.$_API.INTERFACE_SHARE_ROOM_BOOK_INFO, { params });
      request.then(res => {
        if (!res.data) return;
        this.patientBookingOrderDetailDataOld = res.data;
        this.searchState = true;
        this.changeBookingOrderFun();
      });
      return request;
    },
    // 转换：根据状态ID，给予对应的状态名字
    changeBookingOrderFun () {
      this.openPeriodStateOptions.forEach((item) => {
        if (this.patientBookingOrderDetailDataOld.personRoomOrder.openPeriod === item.openPeriod) {
          this.patientBookingOrderDetailDataOld.personRoomOrder.openPeriodName = item.openPeriodName;
        }
      });
      this.personRoomCostPics = this.patientBookingOrderDetailDataOld.personRoomCostPics;
      this.patientBookingOrderDetailData = this.patientBookingOrderDetailDataOld;
    },
    // 操作：查看已有HIS大图
    handlePictureCardPre (item) {
      this.dialogImageUrl = item.picFileUrl;
      this.dialogVisible = true;
    },
    // 操作：返回患者预约到院列表页
    back () {
      // 关闭当前页
      this.close().then(() => {
        this.$router.push({
          name: "room-book",
          params: {}
        });
      });
    }
  }
};
</script>

<style lang="scss">
#bookDetailBody {
  .el-form-item {
    margin-bottom: 0;
  }
  .el-form-item__label {
    color: black;
  }
  label {
    font-weight: normal;
  }
  .el-form-item__content {
    line-height: 30px;
  }
  .el-form-item--medium,
  .el-form-item__label {
    line-height: 30px;
  }
  .contain-flex {
    margin-top: 30px;
  }
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
  .statusTxtBold {
    font-weight: bold;
  }
}
</style>
