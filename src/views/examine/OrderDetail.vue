<template>
  <div class="app-container base-page" id="doctorOrderDetailBody">
    <base-loading :loading="tableLoading">
      <div class="pl24">
        <el-form :modal="orderDetailData">
          <h1>检查单详情</h1>
          <el-divider></el-divider>
          <el-form-item label="就诊人信息：">
            {{orderDetailData.patientName}}&emsp;
            <span v-if="orderDetailData.patientSex== 0">未知</span>
            <span v-if="orderDetailData.patientSex== 1">男</span>
            <span v-if="orderDetailData.patientSex== 2">女</span>
            &emsp;{{orderDetailData.patientAge}}岁&emsp;
            {{orderDetailData.patientPhone}}
          </el-form-item>
          <el-form-item label="初步诊断：">
            {{orderDetailData.tentativeDiagnosis}}
          </el-form-item>
          <el-form-item label="推荐医生：">
            {{orderDetailData.doctorName}}&emsp;
          </el-form-item>
          <el-form-item label="开检查单方式：">
            {{orderDetailData.receptTypeName}}
          </el-form-item>

          <el-divider></el-divider>
          <el-form-item label="检查项目：">
          </el-form-item>
          <div v-for="(item, index) in orderDetailData.items" :key="index">
            <div style="display: inline-block;width: 75%;font-weight: bolder">
              {{item.examineItemName}}
            </div>
            <span>￥{{item.personPay/100}}</span>
          </div>
          <div style="display: inline-block;width: 75%">
          </div>
          <span>合计：￥{{orderDetailData.personPay/100}}&emsp;</span>

          <el-form-item label="备注：">
            {{orderDetailData.note}}
          </el-form-item>
          <el-divider></el-divider>
          <div v-if="picIsShow">

            <div v-for="(item, index) in picNames" :key="index">
              <br>
              <div>
                <b>{{item}}</b>
              </div>
              <br>
              <div v-for="(i, key) in orderDetailData.pics[item]" :key="key">
                <div>上传时间：{{i.addTime}}&emsp; &emsp;上传人：{{i.reporter}}</div>
                <div>
                  <a :href="i.picFileUrl" target="_blank">
                    <el-image :src="i.picFileUrl"></el-image>
                  </a>
                </div>
              </div>
            </div>

            <el-divider></el-divider>
          </div>
          <el-form-item label="订单编号：">
            {{orderDetailData.keyID}}&emsp;
          </el-form-item>
          <el-form-item label="下单时间：">
            {{orderDetailData.createTime}}
          </el-form-item>
          <el-form-item label="订单状态：">
            {{orderDetailData.serviceStatusName}}
          </el-form-item>

          <el-form-item label="支付方式：">
            {{orderDetailData.payTypeName}}
          </el-form-item>
        </el-form>
        <div class="pt24">
          <el-button @click="back">返回</el-button>
        </div>
      </div>
    </base-loading>
  </div>
</template>

<script>
export default {
  name: "examine-order-detail",
  props: {
    orderID: {
      type: String,
      required: true
    }
  },
  inject: ["close"],
  data () {
    return {
      ticketCode: "",
      orderDetailData: [],
      picNames: [],
      tableLoading: false,
      picsLength: 0,
      picIsShow: false,
      srcList: []
    };
  },
  created () {
    this.getOrderDetail();
  },
  activated () {
    this.getOrderDetail();
  },
  methods: {
    // 查询：预订详情
    getOrderDetail () {
      let orderID = this.orderID;
      this.$_http.get(this.$_API.INTERFACE_GET_ORDER_BY_ID + "/" + orderID).then(res => {
        if (!res.data) return;
        // 填充表格数据
        this.orderDetailData = res.data;
        // 判断是否显示图片
        let pics = res.data.pics;
        this.picNames = this.getKeys(pics);
        for (let i = 0; i < this.picNames.length; i++) {
          let key = this.picNames[i];
          if (pics[key].length > 0) {
            this.picIsShow = true;
            break;
          }
        }
      });
    },

    getKeys (map) {
      let keys = [];
      for (let key in map) {
        keys.push(key);
      }
      return keys;
    },
    getSrcList (url) {
      this.srcList = [];
      this.srcList.push(url);
    },

    // 操作：返回医生预订诊室列表页
    back () {
      // 关闭当前页
      this.close().then(() => {
        this.$router.push({
          name: "examine-orderDeal",
          params: {}
        });
      });
    }
  }
};
</script>

<style lang="scss">
#doctorOrderDetailBody {
  .el-calendar__button-group {
    display: none;
  }

  .el-button-group {
    padding-left: 80px;
  }

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
    padding-left: 110px;
    line-height: 30px;
  }

  .el-form-item--medium,
  .el-form-item__label {
    line-height: 30px;
  }

  .el-button--medium {
    margin-top: 20px;
  }
}
</style>
