<template>
  <div class="app-container">
    <base-loading :loading="tableLoading" id="detailBody">
      <el-card class="box-card">
        <el-form :modal="hospitalOrdersDetailData">
<!--        患者信息区-->
          <el-form-item label="患者信息">
            <template>{{hospitalOrdersDetailData.patientInfo.patientName}}&#12288;</template>
            <template v-if="hospitalOrdersDetailData.patientInfo.sex===0">未知</template>
            <template v-else-if="hospitalOrdersDetailData.patientInfo.sex===1">男</template>
            <template v-else>女</template>
            <template>&#12288;{{hospitalOrdersDetailData.patientInfo.age}}岁</template>
          </el-form-item>
          <el-form-item label="患者电话">
            <template v-if="hospitalOrdersDetailData.patientInfo.patientPhone">{{hospitalOrdersDetailData.patientInfo.patientPhone}}</template>
            <template v-else>未知</template>
          </el-form-item>
          <el-form-item label="服务地址">
            <template v-if="hospitalOrdersDetailData.patientInfo.patientAddress">{{hospitalOrdersDetailData.patientInfo.patientAddress}}</template>
            <template v-else>未知</template>
          </el-form-item>
          <el-form-item label="疾病">
            <template v-if="hospitalOrdersDetailData.patientInfo.disease">{{hospitalOrdersDetailData.patientInfo.disease}}</template>
            <template v-else>未知</template>
          </el-form-item>
          <el-form-item label="患者备注">
            <template v-if="hospitalOrdersDetailData.patientInfo.remarks">{{hospitalOrdersDetailData.patientInfo.remarks}}</template>
            <template v-else>无</template>
          </el-form-item>
<!--      就医证明区-->
          <el-divider></el-divider>
          <template v-if="hospitalOrdersDetailData.nursingOrder.orderSource===20 && 0===1">
<!--              <el-divider></el-divider>-->
              <el-form-item label="就医证明"></el-form-item>
              <el-form-item label="过敏史">
                <!--          <template>{{hospitalOrdersDetailData.}}</template>-->
                <template>无</template>
              </el-form-item>
              <el-form-item label="诊断结果">
              <!--          <template>{{hospitalOrdersDetailData.}}</template>-->
                <template>排卵</template>
              </el-form-item>
              <el-form-item label="R:"></el-form-item>
                <hr class="myBorder2"/>
                <el-form-item label="医嘱提醒">
                <!--          <template>{{hospitalOrdersDetailData.}}</template>-->
                  <template>这里是医嘱提醒</template>
                </el-form-item>
                <el-form-item label="医师">
                <!--          <template>{{hospitalOrdersDetailData.}}（{{}}）</template>-->
                  <template>张三（12345678910）</template>
                </el-form-item>
                <el-form-item label="药师">
                <!--          <template>{{hospitalOrdersDetailData.}}（{{}}）</template>-->
                  <template>李四（12345678911）</template>
                </el-form-item>
                <hr class="myBorder2"/>
            </template>
<!--      护士上门清单区-->
<!--          <template v-if="hospitalOrdersDetailData.nursingOrder.orderSource===20">-->
          <template>
            <div>护士上门清单</div>
            <el-form :modal="rotationArr" v-for="(arr,indexOne) in rotationArr" :key="indexOne">
              <div>
                <el-form-item :label="'护士第'+arr[0].rotation+'次上门'"></el-form-item>
                <el-form :modal="arr"  v-for="(items,indexTwo) in arr" :key="indexTwo">
                  <el-form-item :label="items.itemName" prop="items.itemName">
                    <template>￥：{{items.amount}}元</template>
                  </el-form-item>
                </el-form>
                <el-form-item label="时间"><template>{{arr[0].serviceTimeStart}}</template></el-form-item>
<!--                <hr class="timeBottomLine"/>-->
                <el-form-item v-if="arr[0].serviceStatusID!==10 && arr[0].serviceStatusID!==11" label="护士信息">
                    <template v-if="arr[0].nurseID">{{arr[0].nurseName}}（{{arr[0].nursePhone}}）</template>
                    <template v-else>暂无</template>
                </el-form-item>
                <el-form-item label="服务状态">{{arr[0].serviceStatusName}}</el-form-item>
                <hr class="myBorder2"/>
              </div>
            </el-form>
          </template>
          <!--        订单信息区-->
<!--          <el-divider></el-divider>-->
          <el-form-item label="订单信息"></el-form-item>
          <div id="orderBody">
            <el-form-item label="订单编号 ">
              <template>{{hospitalOrdersDetailData.nursingOrder.keyID}}</template>
            </el-form-item>
            <el-form-item label="创建时间">
              <template>{{hospitalOrdersDetailData.nursingOrder.createTime}}</template>
            </el-form-item>
            <el-form-item label="订单状态">
              <span id="orderState">{{hospitalOrdersDetailData.nursingOrder.orderStatusName}}</span>
            </el-form-item>
            <el-form-item label="订单金额(元)">
              <template>{{hospitalOrdersDetailData.nursingOrder.orderAmount}}</template>
            </el-form-item>
            <el-form-item label="医院应收(元)">
            <!--            <template>{{hospitalOrdersDetailData.}}</template>-->
              <template>xxx</template>
            </el-form-item>
          </div>
        </el-form>
        <div class="contain-flex justify-content-center form-input-width">
          <el-button @click="back">返回</el-button>
        </div>
      </el-card>
    </base-loading>
  </div>
</template>

<script>
export default {
  name: "nursing-hospitalOrders-hospitalOrdersDetail",
  props: {
    // 查询主键ID
    nursingOrderID: {
      type: String,
      required: true
    }
  },
  inject: ["close"],
  data() {
    return {
      hospitalOrdersDetailData: {
        patientInfo: {},
        nursingOrder: {}
      },
      tableLoading: false,
      rotationArr: [],
      searchState: false
    };
  },
  created() {
    let loadList = [this.getHospitalOrdersDetail];
    this.$_http.all(...loadList).finally(it => {
      this.tableLoading = false;
    });
  },
  activated() {
    if (this.searchState) {
      this.getHospitalOrdersDetail();
    }
  },
  methods: {
    // 查询：获取单项护理订单的服务列表数据，加载表格
    getHospitalOrdersDetail() {
      if (this.tableLoading) {
        return;
      }
      let hospitalOrderOneInfo = {
        nursingOrderID: this.nursingOrderID
      };
      let params = { ...hospitalOrderOneInfo };
      this.tableLoading = true;
      let requests = this.$_http.get(this.$_API.INTERFACE_NURSE_ORDERS_DETAIL, { params });
      requests.then(res => {
        if (!res.data) return;
        this.hospitalOrdersDetailData = res.data;
        this.searchState = true;
        this.getChange();
      }).finally(it => {
        this.tableLoading = false;
      });
      return requests;
    },
    // 转换：将查询护理服务列表结果按类别分割
    getChange() {
      this.rotationArr = [];
      const rotationObj = this.hospitalOrdersDetailData.houseService.reduce((prev, current) => {
        if (typeof prev[current.rotation] === "undefined") {
          prev[current.rotation] = [current];
        } else {
          prev[current.rotation].push(current);
        }
        return prev;
      }, {});
      Object.keys(rotationObj).forEach((k) => {
        this.rotationArr.push(rotationObj[k]);
      });
    },
    // 操作：返回护理订单的服务列表页
    back() {
      // 关闭当前页
      this.close().then(() => {
        this.$router.push({
          name: "nursing-hospitalOrders",
          params: { }
        });
      });
    }
  }
};
</script>

<style lang="scss">
#detailBody{
  .el-form-item{
    margin-bottom: 0;
  }
  .el-form-item__label{
    color: black;
    line-height: 30px;
  }
  .el-form-item__content{
    padding-left: 100px;
    max-width: 500px;
    line-height: 30px;
  }
  /*分割线*/
  .el-form .el-divider--horizontal {
    width: 500px;
    margin: 12px 0;
    background: black;
  }
  .el-form .myBorder2{
    display: inline-block;
    width: 400px;
    line-height: 30px;
  }
  /*护士上门清单区*/
  .timeBottomLine{
    width: 250px;
    margin: 0;
  }
}
  /*订单信息区*/
#orderBody{
  .el-form-item__label,#orderBody .el-form-item__content{
    color: #97a8be;
    font-weight: normal;
  }
  #orderState{
    color: red;
  }
}
</style>
