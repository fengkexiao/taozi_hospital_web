<template>
  <div class="base-page">
    <P class="mt24">转诊信息</P>
    <el-table :data="orderDetailDataList" stripe class="mt24">
      <el-table-column prop="transferTypeName" label="转诊方式" align="center"></el-table-column>
      <el-table-column prop="hospitalSectionName" label="指定科室" align="center"></el-table-column>
      <el-table-column prop="hospitalDoctorName" label="指定接诊医生" align="center"></el-table-column>
      <el-table-column prop="sourceName" label="转诊医生" align="center"></el-table-column>
      <el-table-column prop="transferDoctorPhone" label="转诊医生电话" align="center"></el-table-column>
      <el-table-column prop="transferTime" label="转诊发起时间" align="center"></el-table-column>
    </el-table>
    <P class="mt24">患者信息</P>
    <template>
      <el-table :data="orderDetailDataList" stripe  class="mt24">
        <el-table-column prop="patientName" label="姓名" width="80" align="center"></el-table-column>
        <el-table-column prop="patientIdNo" label="身份证号" width="165" align="center"></el-table-column>
        <el-table-column prop="patientSex" label="性别" width="80" align="center">
          <template #default="{row}">
            <span v-if="row.patientSex===0">男</span>
            <span v-if="row.patientSex===1">女</span>
          </template>
        </el-table-column>
        <el-table-column prop="patientPhone" label="联系方式" width="120" align="center"></el-table-column>
        <el-table-column prop="patientAge" label="年龄" width="80" align="center"></el-table-column>
        <el-table-column prop="patientCondition" label="病情描述" align="center"></el-table-column>
      </el-table>
      <P class="mt24">病例资料</P>
      <template v-if="orderDetailData.transferPatientImgList.length > 0">
        <span v-for="(item) in orderDetailData.transferPatientImgList" :key="item[0]">
          <span>
            <el-image :src="item[0]" :preview-src-list="images" style="width: 300px; height: 200px"></el-image>
          </span>&emsp;
        </span>
      </template>
      <div v-else style="color:rgba(0,0,0,0.45);margin-left:24px;margin-top:24px;">暂无图片</div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    orderID: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      orderDetailDataList: [],
      orderDetailData: {},
      images: []
    };
  },
  created () {
    this.getOrderDetail();
  },
  methods: {
    // 查询：预订详情
    getOrderDetail () {
      let orderID = this.orderID;
      this.$_http
        .get(this.$_API.INTERFACE_ORDER_DETAIL, {
          params: {
            keyId: orderID
          }
        })
        .then(res => {
          if (!res.data) return;
          let temp = res.data;
          this.$_http
            .get(this.$_API.INTERFACE_GET_PATIENT_IMGS, {
              params: {
                keyId: orderID
              }
            })
            .then(response => {
              if (!response.data) return;
              let imageList = response.data;
              let imgList = [];
              let tempForimages = [];
              imageList.forEach(image => {
                let smallList = [];
                tempForimages.push(image.imgUrl);
                smallList.push(image.imgUrl);
                imgList.push(smallList);
              });
              this.images = tempForimages;
              temp.transferPatientImgList = imgList;
              this.$_http
                .get(this.$_API.INTERFACE_TRANSFER_GET_DOCTOR, {
                  params: { keyID: res.data.sourceId }
                })
                .then(response => {
                  temp.transferDoctorPhone = response.data.phone;
                  this.orderDetailData = temp;
                  this.orderDetailDataList = [];
                  this.orderDetailDataList.push(temp);
                });
            });
        });
    }
  }
};
</script>
