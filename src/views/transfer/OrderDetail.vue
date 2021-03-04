<template>
  <div class="app-container base-page" id="TransferOrderDetailBody">
    <base-loading :loading="tableLoading">
      <base-title name="转诊信息"></base-title>
      <el-table :data="orderDetailDataList" class="mt24" stripe>
        <el-table-column prop="transferTypeName" label="转诊方式" align="center"></el-table-column>
        <el-table-column prop="hospitalSectionName" label="指定科室" align="center"></el-table-column>
        <el-table-column prop="hospitalDoctorName" label="指定接诊医生" align="center"></el-table-column>
        <el-table-column prop="sourceName" label="转诊医生" align="center"></el-table-column>
        <el-table-column prop="transferDoctorPhone" label="转诊医生电话" align="center"> </el-table-column>
        <el-table-column prop="transferTime" label="转诊发起时间" align="center"></el-table-column>
      </el-table>
      <base-title name="患者信息" class="mt24"></base-title>
      <template v-if="orderDetailDataList[0]">
        <template v-if="[10,11].includes(orderStatusId)">
          <el-form :model="orderDetailData" label-width="120px" class="pl24">
            <el-form-item label="姓名：">
              <el-input v-model="orderDetailData.patientName" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="身份证号：">
              <el-input v-model="orderDetailData.patientIdNo" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="性别：">
              <el-radio-group v-model="orderDetailData.patientSex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="联系方式：">
              <el-input v-model="orderDetailData.patientPhone" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="年龄：">
              <el-input v-model="orderDetailData.patientAge" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="转诊病情描述：">
              <div>{{orderDetailData.patientCondition}}</div>
            </el-form-item>
            <el-form-item label="接诊病情描述：">
              <div>{{orderDetailData.receiveCondition}}</div>
            </el-form-item>
            <el-form-item label="病例资料：" v-if="orderDetailData.transferPatientImgList.length>0">
              <span v-for="(item,index) in orderDetailData.transferPatientImgList" :key="index">
                <span>
                  <el-image :src="item[0]" :preview-src-list="item" style="width: 100px; height: 100px"></el-image>
                </span>&emsp;
              </span>
            </el-form-item>
          </el-form>
        </template>

        <template v-else>
          <el-table :data="orderDetailDataList" class="mt24" stripe>
            <el-table-column prop="patientName" label="姓名" width="80" align="center"></el-table-column>
            <el-table-column prop="patientIdNo" label="身份证号" width="165" align="center"></el-table-column>
            <el-table-column prop="patientSex" label="性别" width="80" align="center">
              <template #default="{row}">
                <span v-if="row.patientSex===1">男</span>
                <span v-if="row.patientSex===2">女</span>
              </template>
            </el-table-column>
            <el-table-column prop="patientPhone" label="联系方式" width="120" align="center"></el-table-column>
            <el-table-column prop="patientAge" label="年龄" width="80" align="center"></el-table-column>
            <el-table-column prop="patientCondition" label="病情描述" align="center"></el-table-column>
          </el-table>
          <base-title name="病例资料" class="mt24"></base-title>
          <div class="ml24 mt24">
            <template v-if="orderDetailData.transferPatientImgList.length > 0">
              <span v-for="(item) in orderDetailData.transferPatientImgList" :key="item[0]">
                <span>
                  <el-image :src="item[0]" :preview-src-list="item" style="width: 300px; height: 200px"></el-image>
                </span>&emsp;
              </span>
            </template>
            <div v-else style="color:rgba(0,0,0,0.45)">暂无图片</div>
          </div>
        </template>
      </template>

      <template v-if="treatmentList.length>0">
        <base-title name="就诊信息" class="mt24"></base-title>
        <div v-for="(item,index) in treatmentList" :key="index">
          <el-table :data="item" style="width: 100%" class="mt24" stripe>
            <el-table-column prop="inquiryModeName" label="就诊方式" width="80" align="center"></el-table-column>
            <el-table-column prop="hospitalSectionName" label="科室" width="80" align="center"></el-table-column>
            <el-table-column prop="hospitalDoctorName" label="医生" width="100" align="center"></el-table-column>
            <el-table-column prop="appointTime" label="预约时间" align="center"></el-table-column>
            <el-table-column prop="receiveCondition" label="病情描述" width="400" align="center"></el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template #default="{row}">
                <div class="option-btn_group">
                  <span class="opt-text" @click="updateBegin(row)">修改</span>
                  <div class="line" v-if="[21,31,42].includes(orderStatusId)&&index>0"></div>
                  <span class="opt-text text-danger" @click="deleteBegin(row)" v-if="[21,31,42].includes(orderStatusId)&&index>0">删除</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div>&emsp;</div>
          <template v-if="item[0].hasSettle===1">
            <el-form label-width="120" ref="form" :modal="item[0]">
              <el-form-item label="出院日期：">
                <template>{{item[0].outTime | formatDate }}</template>
              </el-form-item>
              <el-form-item label="诊疗费用：">
                <template>{{item[0].treatMoney/100}} 元</template>
                <!-- <div>&emsp;</div> -->
              </el-form-item>
              <!-- 治疗结束后 才展示医生相关费用信息 -->
              <template v-if="orderStatusId > 22">
                <el-table :data="item[0].transferItemList" style="width: 50%" stripe>
                  <el-table-column prop="projectName" label="项目" align="center"></el-table-column>
                  <el-table-column prop="treatMoney" label="金额" :formatter="formatTreatMoney" align="center"></el-table-column>
                </el-table>
                <div>&emsp;</div>
                <el-form-item label="医生首诊服务费：">
                  <template>{{item[0].doctorMoney/100}}</template>
                  元
                </el-form-item>
                <el-form-item label="分润规则：">
                  <!-- <div>&emsp;</div> -->
                  <el-table :data="item[0].transferOrderProfitList" style="width: 100%" stripe>
                    <el-table-column min-width="120" prop="ruleName" label="规则" align="center"></el-table-column>
                    <el-table-column min-width="120" prop="doctorSource" label="医生类别" align="center"></el-table-column>
                    <el-table-column min-width="120" prop="groupName" label="医生组" align="center" :formatter="groupNameFormatter"></el-table-column>
                    <el-table-column min-width="120" prop="patientSource" label="患者类别" align="center"></el-table-column>
                    <el-table-column min-width="120" prop="treatWay" label="就诊方式" align="center"></el-table-column>
                    <el-table-column min-width="120" prop="section" label="科室" align="center" :formatter="sectionFormatter"></el-table-column>
                    <el-table-column min-width="120" prop="priority" label="优先级" align="center"></el-table-column>
                    <el-table-column min-width="120" prop="isProfit" label="分润" :formatter="profitFormatter" align="center"></el-table-column>
                    <el-table-column min-width="120" prop="projectName" label="项目" align="center"></el-table-column>
                    <el-table-column min-width="120" prop="moneyRange" label="金额范围" :formatter="moneyRangeFormatter" align="center"></el-table-column>
                    <el-table-column min-width="120" prop="price" label="医生首诊服务费" align="center"></el-table-column>
                    <el-table-column min-width="120" prop="totalPrice" label="项目金额" :formatter="totalPriceFormatter" align="center"></el-table-column>
                    <el-table-column min-width="120" prop="servicePrice" label="服务费金额" :formatter="servicePriceFormatter" align="center"></el-table-column>
                  </el-table>
                </el-form-item>
                <el-form-item label="平台服务费：">
                  <template>{{item[0].platMoney/100}}</template>
                  元
                </el-form-item>
              </template>

              <el-form-item label="治疗方案：">
                <el-col :span="5">
                  <el-image :src="item[0].treatPlanImgUrl" :preview-src-list="item[0].treatPlanImgUrlList" style="width: 150px; height: 100px ;vertical-align:middle">
                    <template #error>
                      <div style="width: 150px;height: 100px;background-color: #f5f7fa;line-height: 100px;text-align: center; color: #C0C4CC;">图片未上传</div>
                    </template>
                  </el-image>
                </el-col>
                <el-col class="line" :span="2"></el-col>
                <el-col :span="10">
                  <span>{{item[0].treatPlanDesc}}</span>
                </el-col>
              </el-form-item>
              <el-form-item label="检查报告：">
                <el-col :span="5">
                  <el-image :src="item[0].checkReportImgUrl" :preview-src-list="item[0].checkReportImgUrlList" style="width: 150px; height: 100px ;vertical-align:middle">
                    <template #error>
                      <div style="width: 150px;height: 100px;background-color: #f5f7fa;line-height: 100px;text-align: center; color: #C0C4CC;">图片未上传</div>
                    </template>
                  </el-image>
                </el-col>
                <el-col class="line" :span="2"></el-col>
                <el-col :span="10">
                  <span>{{item[0].checkReportDesc}}</span>
                </el-col>
              </el-form-item>
              <el-form-item label="诊断结论：">
                <el-col :span="5">
                  <el-image :src="item[0].inquiryResultImgUrl" :preview-src-list="item[0].inquiryResultImgUrlList" style="width: 150px; height: 100px ;vertical-align:middle">
                    <template #error>
                      <div style="width: 150px;height: 100px;background-color: #f5f7fa;line-height: 100px;text-align: center; color: #C0C4CC;">图片未上传</div>
                    </template>
                  </el-image>
                </el-col>
                <el-col class="line" :span="2"></el-col>
                <el-col :span="10">
                  <span>{{item[0].inquiryResultDesc}}</span>
                </el-col>
              </el-form-item>
              <el-form-item label="收费汇总：">
                <el-col :span="5">
                  <el-image :src="item[0].chargeImgUrl" :preview-src-list="item[0].chargeImgUrlList" style="width: 150px; height: 100px ;vertical-align:middle">
                    <template #error>
                      <div style="width: 150px;height: 100px;background-color: #f5f7fa;line-height: 100px;text-align: center; color: #C0C4CC;">图片未上传</div>
                    </template>
                  </el-image>
                </el-col>
                <el-col class="line" :span="2"></el-col>
                <el-col :span="10">
                  <span>{{item[0].chargeDesc}}</span>
                </el-col>
              </el-form-item>
            </el-form>
          </template>
          <el-form :modal="item[0]" label-width="90px" class="pl24">
            <el-form-item label="操作人：">
              <template>{{item[0].modifyUser}}</template>
            </el-form-item>
            <el-form-item label="操作时间：">
              <template>{{item[0].modifyTime}}</template>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template v-if="orderStatusId===12">
        <base-title name="就诊信息" class="mt24"></base-title>
        <el-form ref="form" :model="orderDetailData" label-width="150px" class="mt24 pl24">
          <el-form-item label="拒绝原因：">
            <span>{{orderDetailData.refuseReason}}</span>
          </el-form-item>
          <el-form-item label="拒绝接诊操作人：">
            <span>{{orderDetailData.modifyUser}}</span>
          </el-form-item>
          <el-form-item label="操作时间：">
            <span>{{orderDetailData.modifyTime}}</span>
          </el-form-item>
        </el-form>
      </template>
      <template v-if="orderStatusId===20">
        <base-title name="就诊信息" class="mt24"></base-title>
        <el-table :data="orderDetailDataList" style="width: 100%" class="mt24" stripe>
          <el-table-column prop="inquiryModeName" label="就诊方式" width="80" align="center"></el-table-column>
          <el-table-column prop="hospitalSectionName" label="科室" width="80" align="center"></el-table-column>
          <el-table-column prop="hospitalDoctorName" label="医生" width="100" align="center"></el-table-column>
          <el-table-column prop="appointTime" label="预约时间" align="center"></el-table-column>
          <el-table-column prop="receiveCondition" label="病情描述" align="center"></el-table-column>
          <el-table-column prop="modifyUser" label="操作人" width="80" align="center"></el-table-column>
          <el-table-column prop="modifyTime" label="操作时间" align="center"></el-table-column>
        </el-table>
      </template>
      <template v-if="orderStatusId>=30">
        <auditDetail :order-i-d="orderID"></auditDetail>
      </template>

      <div>
        <el-divider></el-divider>&emsp; &emsp;
        <el-button @click="back">返回</el-button>
        <el-button v-if="[10,11].includes(orderStatusId)" type="primary" @click="ensure">保存</el-button>
      </div>
    </base-loading>

    <div id="receiveBody">
      <el-dialog title="修改就诊信息" :visible.sync="receiveBodyVisible" width="700px" @close="receiveBodyCancel">
        <el-card class="box-card">
          <el-form :model="receiveData" :rules="receiveFormRule" ref="receiveForm">
            <el-form-item label="就诊方式：" label-width="100px" prop="inquiryModeId">
              <el-radio-group v-model="receiveData.inquiryModeId">
                <el-radio :label="1">门诊</el-radio>
                <el-radio :label="2">住院</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="科室：" label-width="100px" prop="hospitalSectionId">
              <el-select v-model="receiveData.hospitalSectionId" placeholder="请选择" clearable filterable>
                <el-option v-for="item in sectionOptions" :key="item.keyID" :label="item.hospitalSectionName" :value="item.keyID"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="医生姓名：" label-width="100px" prop="hospitalDoctorName" ref="hospitalDoctorName">
              <el-autocomplete v-model="receiveData.hospitalDoctorName" placeholder="请输入" clearable label-name="医生姓名" :fetch-suggestions="querySearch" @select="afterSelect"></el-autocomplete>
            </el-form-item>
            <el-form-item label="病情描述：" label-width="100px" prop="receiveCondition">
              <el-input type="textarea" :rows="4" placeholder="请输入" clearable v-model="receiveData.receiveCondition"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button @click="receiveBodyCancel">取消</el-button>
          <el-button class="sure" type="primary" @click="receiveBodyEnsure1st">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import InputWithTip from "@/components/InputWithTip";
import auditDetail from "./components/auditDetail";

import { mapGetters } from "vuex";

export default {
  name: "OrderDetail",
  props: {
    orderID: {
      type: String,
      required: true
    }
  },
  inject: ["reload", "close"],
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InputWithTip,
    auditDetail
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    var checkDoctorName = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        let thereIs = false;
        this.receiveDataDoctors.forEach(doctor => {
          if (doctor.doctorName.indexOf(value) !== -1) {
            thereIs = true;
          }
        });
        if (!thereIs) {
          callback(new Error("该院无此医生"));
        } else {
          callback();
        }
      }
    };
    return {
      tableLoading: false,
      orderDetailData: {},
      orderDetailDataList: [],
      treatmentList: [],
      orderStatusId: "",
      receiveBodyVisible: false,
      receiveData: {},
      sectionOptions: [],
      receiveDataDoctors: [],
      willNotComeHospitalData: [],
      receiveFormRule: {
        appointTimeOriginal: [
          { required: true, message: "此值不可以为空", trigger: "blur" }
        ],
        hospitalDoctorName: [
          { required: true, message: "此值不可以为空", trigger: "blur" },
          {
            validator: checkDoctorName,
            trigger: "change"
          }
        ],
        hospitalSectionId: [
          { required: true, message: "此值不可以为空", trigger: "blur" }
        ],
        inquiryModeId: [
          { required: true, message: "此值不可以为空", trigger: "blur" }
        ],
        receiveCondition: [
          { required: true, message: "此值不可以为空", trigger: "blur" }
        ]
      }
    };
  },
  created () {
    this.getOrderDetail();
    this.getTransferInfos();
  },
  activated () {
    this.getOrderDetail();
    this.getTransferInfos();
  },
  methods: {
    sectionFormatter (row) {
      return row.section ? row.section : "不限";
    },
    groupNameFormatter (row) {
      return row.groupName ? row.groupName : "不限";
    },
    formatTreatMoney (row) {
      return String(row.treatMoney / 100) + "元";
    },
    moneyRangeFormatter (row) {
      return String(row.minPrice / 100) + "-" + String(row.maxPrice / 100);
    },

    totalPriceFormatter (row) {
      return row.totalPrice / 100;
    },
    servicePriceFormatter (row) {
      return row.servicePrice / 100;
    },
    profitFormatter (row) {
      return row.isProfit === 1 ? "是" : "否";
    },
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
          this.orderStatusId = temp.orderStatusId;
          this.$_http
            .get(this.$_API.INTERFACE_GET_PATIENT_IMGS, {
              params: { keyId: orderID }
            })
            .then(response => {
              if (!response.data) return;
              let imageList = response.data;
              let imgList = [];
              imageList.forEach(image => {
                let smallList = [];
                smallList.push(image.imgUrl);
                imgList.push(smallList);
              });
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
                  console.log(this.orderDetailDataList);
                });
            });
        });
    },

    getTransferInfos () {
      this.$_http
        .get(this.$_API.INTERFACE_GET_TRANSFER_INFOS, {
          params: {
            orderId: this.orderID
          }
        })
        .then(response => {
          if (!response.data) return;
          let treatmentListTemp = response.data;
          let result = [];
          treatmentListTemp.forEach(item => {
            item.treatPlanImgUrlList = [item.treatPlanImgUrl];
            item.chargeImgUrlList = [item.chargeImgUrl];
            item.inquiryResultImgUrlList = [item.inquiryResultImgUrl];
            item.checkReportImgUrlList = [item.checkReportImgUrl];
            let tempList = [];
            tempList.push(item);
            result.push(tempList);
          });
          this.treatmentList = result;
        });
    },

    updateBegin (row) {
      if (row.orderStatusId === 41) {
        return false
      }
      this.receiveBodyVisible = true;
      this.receiveData = row;
      this.$_http
        .get(this.$_API.INTERFACE_GET_SECTION_LIST, {
          params: {
            orgId: this.userInfo.orgID,
            disableStatus: 0
          }
        })
        .then(response => {
          if (!response.data) return;
          this.sectionOptions = response.data;
        });
      this.$_http
        .get(this.$_API.INTERFACE_GET_DOCTOR_LIST, {
          params: {
            orgID: this.userInfo.orgID,
            doctorTypeID: 1,
            pageSize: 10000,
            pageIndex: 1
          }
        })
        .then(response => {
          if (!response.data) return;
          this.receiveDataDoctors = response.data.datas;
        });
    },
    receiveBodyCancel () {
      this.receiveBodyVisible = false;
      this.$refs.receiveForm.clearValidate();
    },
    // 搜索触发：根据医生名字的输入值进行模糊查询，并给出完整的提示
    querySearch (queryString, cb) {
      let results = queryString
        ? this.nameFilter(queryString)
        : this.getDoctorNameList();
      if (results.length === 0) {
        this.$message.error("该院无此医生");
      }
      this.$refs.receiveForm.clearValidate("hospitalDoctorName");
      cb(results);
    },
    // 搜索触发的相关方法
    nameFilter (queryString) {
      let doctors = [];
      this.receiveDataDoctors.forEach(doctor => {
        if (doctor.doctorName.indexOf(queryString) !== -1) {
          let item = { value: "", keyId: "" };
          item.value = doctor.doctorName;
          item.keyId = doctor.keyID;
          doctors.push(item);
        }
      });
      return doctors;
    },
    // 搜索触发出发的相关方法
    getDoctorNameList () {
      let nameList = [];
      this.receiveDataDoctors.forEach(doctor => {
        let item = { value: "", keyId: "" };
        item.value = doctor.doctorName;
        item.keyId = doctor.keyID;
        nameList.push(item);
      });
      return nameList;
    },

    afterSelect (item) {
      this.receiveData.hospitalDoctorId = item.keyId;
      this.receiveData.hospitalDoctorName = item.value;
    },
    deleteBegin (row) {
      this.$confirm("此操作将删除该就诊记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$_http
            .post(this.$_API.INTERFACE_REMOVE_TREATMENT, {
              keyId: row.keyId
            })
            .then(response => {
              this.getTransferInfos();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 返回列表页
    back () {
      // 关闭当前页
      this.close().then(() => {
        this.$router.push({
          name: "TransferOrders"
        });
      });
    },
    // 保存并返回列表页
    ensure () {
      this.$_http
        .post(this.$_API.INTERFACE_UPDATE_PATIENT_INFO, this.orderDetailData)
        .then(response => {
          this.getOrderDetail();
          this.close().then(() => {
            this.$router.push({
              name: "TransferOrders"
            });
          });
        });
    },

    receiveBodyEnsure1st () {
      this.$refs.receiveForm.validate(valid => {
        if (!valid) {
        } else {
          this.receiveBodyEnsure2nd();
        }
      });
    },
    receiveBodyEnsure2nd () {
      if (this.receiveData.inquiryModeId === 1) {
        this.receiveData.inquiryModeName = "门诊";
      } else if (this.receiveData.inquiryModeId === 2) {
        this.receiveData.inquiryModeName = "住院";
      } else {
        this.receiveData.inquiryModeName = "不限";
      }
      this.sectionOptions.forEach(section => {
        if (section.keyID === this.receiveData.hospitalSectionId) {
          this.receiveData.hospitalSectionName = section.hospitalSectionName;
        }
      });
      let params = {
        orgId: this.userInfo.orgID,
        ...this.receiveData
      };
      console.log("params------", params);
      this.$_http
        .post(this.$_API.INTERFACE_UPDATE_TREATMENT_INFO, {
          orgId: this.userInfo.orgID,
          orderId: this.orderID,
          ...this.receiveData
        })
        .then(response => {
          this.getOrderDetail();
          this.getTransferInfos();
          this.receiveBodyVisible = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#TransferOrderDetailBody {
  .alignTop * {
    display: inline-block;
    vertical-align: middle;
  }
  .el-table colgroup.gutter {
    display: table-cell !important;
  }
}
.box-card {
  padding: 24px;
}
.title {
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(42, 44, 48, 1);
}
</style>
