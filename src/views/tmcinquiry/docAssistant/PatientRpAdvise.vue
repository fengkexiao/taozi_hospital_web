<template>
  <div style="height: 100%;padding:10px">
    <base-loading :loading="tableLoading">
      <div v-if="patientDoc" id="rpAdviseBox">
        <!--        // rpStatus： 0:建议 1：方案-->
        <div class="floatIconDiv">
          <img v-if="rpData.rp.rpStatus" class="floatIconImg" src="../../../assets/image/tmcinquiry/rpSureIocn.png" />
          <img v-else class="floatIconImg" src="../../../assets/image/tmcinquiry/rpAdvice.png" />
        </div>
        <!--    患者信息-->
        <div class="patientInfoBox">
          <div class="patientInfoDiv">
            <div class="infoDiv">姓名：&nbsp;{{patientInfo.patientName}}</div>
            <div class="infoDiv">性别：&nbsp;{{patientInfo.sexName}}</div>
            <div class="infoDiv">年龄：&nbsp;{{patientInfo.age}}</div>
          </div>
          <div class="patientInfoDiv">
            <div class="infoDiv">肝功能：&nbsp;{{patientInfo.liver}}</div>
            <div class="infoDiv">肾功能：&nbsp;{{patientInfo.renal}}</div>
            <div v-if="patientInfo.sex === 2" class="infoDiv">妊娠哺乳：&nbsp;{{patientInfo.pregnancy}}</div>
          </div>
          <div class="patientInfoDiv">
            <div class="infoDiv">既往病史：&nbsp;{{patientInfo.historyOfSickness}}</div>
          </div>
          <div class="patientInfoDiv">
            <div class="infoDiv">过敏史：&nbsp;{{ patientInfo.historyOfAllergy }}</div>
          </div>
        </div>
        <!--      诊断结果-->
        <div class="diagnosisBox">
          <div class="pageTitle">诊断结果</div>
          <el-autocomplete v-model.trim="rpData.rp.diagnosis" :trigger-on-focus="false" @select="handleSelect" :fetch-suggestions="querySearch" placeholder="请输入" class="input_250"></el-autocomplete>
        </div>
        <!--      处方信息-->
        <div class="rpDataBox">
          <div class="flexRowBetween">
            <div class="rpTitle">
              <span>R：</span>
            </div>
            <div class="rpAndMedicineBtn">
              <div class="flexRowBetween rpAndMedicineBtnDiv" @click="toRpTemplateFun()">
                <img class="rpIconImg" src="../../../assets/image/tmcinquiry/rpMuBan.png" />
                <span>处方模板</span>
              </div>
              <div class="flexRowBetween rpAndMedicineBtnDiv" @click="addMedicineFun()">
                <img class="rpIconImg" src="../../../assets/image/tmcinquiry/addMedicine.png" />
                <span>添加药品</span>
              </div>
            </div>
          </div>
          <!--        药品列表-->
          <ul>
            <li v-for="(item, index) in rpData.rpMedicines" :key="index">
              <div class="medicineDivOne">
                <div class="medicineTitleDiv">
                  <div class="delMedicineIcon" @click="delMedicineFun(item, index)">
                    <div class="delMedicineIconDiv">
                      <img class="delMedicineIconImg" src="../../../assets/image/tmcinquiry/delete.png" />
                    </div>
                  </div>
                  <div class="medicineTitle">
                    <span class="medicineName">{{item.medicineName}}</span>
                    <span class="medicineUnit">{{item.specification}}</span>
                    <span class="medicinePrice">￥{{item.unitPrice | formatMoney}}</span>
                  </div>
                </div>
                <div class="medicineNumDiv">
                  <!--                  需要数量默认1-->
                  <input v-model.trim="item.medicineAmount" class="medicineNumInput" type="number" @input="amountChange" placeholder onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" />
                  <span class="medicineUnit">{{item.unit}}</span>
                </div>
              </div>
              <div id="medicineDivThree">
                <span>用法:&nbsp;</span>
                <input v-model.trim="item.takeDose" class="medicineUseInputOne" type="number" placeholder="每次用量" />
                <el-select v-model="item.formType" placeholder size="mini" style="width: 70px;margin-right: 10px;">
                  <el-option v-for="(item, index) in formTypeOptions" :key="index" :label="item.dictName" :value="item.dictName"></el-option>
                </el-select>
                <el-select v-model="item.takeFrequence" placeholder size="mini" style="width: 100px;margin-right: 10px;">
                  <el-option v-for="(item, index) in takeFrequenceOptions" :key="index" :label="item.dictName" :value="item.dictName"></el-option>
                </el-select>
                <el-select v-model="item.takeDirection" placeholder size="mini" style="width: 110px;">
                  <el-option v-for="(item, index) in takeDirectionOptions" :key="index" :label="item.dictName" :value="item.dictName"></el-option>
                </el-select>
              </div>
              <div class="medicineDivFour">
                <input v-model.trim="item.medicationDays" class="medicineNumInput" type="number" placeholder onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" />
                <span class="medicineUnit">天</span>
              </div>
            </li>
          </ul>
          <div class="totalPriceBox">
            <span class="totalPriceTitle">总价：</span>
            <span class="totalMoneyTxt">{{getTotalPrice / 100}}元</span>
          </div>

          <!--     优惠券列表     -->
          <div class="coupon" @click="showCoupon">
            <div>优惠券：</div>
            <img class="rpIconImg" src="../../../assets/image/tmcinquiry/addMedicine.png" />
            <span>选择优惠券</span>
          </div>
          <!--                     ]-->
          <div class="collapse-panel" @click="handleShowInfo" style="margin-bottom: 10px;" v-show="chooseCouponList.length">
            <span class="collapse-title">优惠详情</span>
            <i :class="[!couponDetail?'el-icon-arrow-right':'el-icon-arrow-down']"></i>
          </div>
          <div v-show="couponDetail" class="collapse-container" style="padding-bottom: 16px;">
            <div class="couponDetail borderBottom" v-for="(item,index) in chooseCouponList" :key="index">
              <span>{{item.couponName}}</span> <span style="margin-left: 10px;">满{{item.rule.full}}减{{item.rule.reduce}}</span>
            </div>
          </div>
          <div class="totalPriceBox">
            <span class="totalPriceTitle">优惠后价格：</span>
            <span class="totalMoneyTxt">{{getOrderPrice / 100}}元</span>
          </div>
          <!--        医嘱-->
          <div class="rpEnjoin">
            <div class="pageTitles">医嘱</div>
            <base-input v-model.trim="rpData.rp.rpAdvice" type="textarea" placeholder="请输入" maxlength="200" :autosize="autosize" :show-word-limit="true" />
          </div>
        </div>
        <!--      保存提交-->
        <div class="btnBox">
          <el-button type="primary"  @click="saveRpDataFun">{{getTitle}}</el-button>
          <el-button type="primary"  @click="view">预览</el-button>
        </div>
      </div>
    </base-loading>
    <popup-template :visible="visible" title="添加药品" @close="close" @handleEdit="handleEdits"></popup-template>
    <!-- 处方模版 -->
    <span>
      <el-dialog title="选择模版" :visible.sync="rpTemplate" width="700px">
        <el-table :data="endData" stripe>
          <el-table-column prop="classifyName" label="父目录" align="center"></el-table-column>
          <el-table-column prop="sonName" label="子目录" align="center"></el-table-column>
          <el-table-column prop="templateName" label="模版名" align="center" ></el-table-column>
          <el-table-column prop="4" label="操作" align="center">
            <template #default="{row}">
              <el-button type="text"  @click="choice(row)">确定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </span>
    <!--   选择优惠券弹窗   -->
    <chooseCoupon :dialogVisible="chooseCouponVisible" :couponList="couponTableList" :rpMedicines="rpData.rpMedicines" @closeFn="closeFn" @confirmFn="confirmFn"></chooseCoupon>
    <TrialPartyAndDetails v-if="trialVisible" @closeFn="closeFn" :trialVisible="trialVisible" :diagnosis="rpData.rp.diagnosis" :rpAdvice="rpData.rp.rpAdvice" :medicines="rpData.rpMedicines" :doctorName="tmc.doctorName" :patientInfo="patientInfo">
    </TrialPartyAndDetails>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import popupTemplate from "@/views/tmcinquiry/template/PopupAddByTemplate.vue";
import timPublic from "@/views/tmcinquiry/conversation/timPublic.js";
import chooseCoupon from "./components/chooseCoupon";
import TrialPartyAndDetails from './components/TrialPartyAndDetails'
export default {
  name: "TMCInquiry-rpAdvise",
  components: {
    popupTemplate,
    chooseCoupon,
    TrialPartyAndDetails
  },
  mixins: [timPublic],
  data () {
    return {
      trialVisible: false,
      couponDetail: true,
      chooseCouponVisible: false,
      restaurants: [],
      tableLoading: false,
      autosize: { minRows: 4, maxRows: 6 },
      btnTxt: "保存",
      formTypeOptions: [], // 单次用量的单位集合
      takeFrequenceOptions: [], // 单次用量的频率集合
      takeDirectionOptions: [], // 单次用药的方式集合
      patientInfo: {}, // 患者信息
      // 处方单信息
      rpData: {
        rp: {
          price: "",
          rpAdvice: "", // 医嘱
          diagnosis: "" // 诊断结果
        },
        rpMedicines: []
      },
      visible: false,
      popHandlingW: false,
      patientDoc: [],
      rpTemplate: false, // 处方模版控制
      endData: [], // 处方模版列表.
      couponTableList: [], //优惠券tab列表
      couponList: [],
      chooseCouponList: [],
    };
  },
  computed: {
    ...mapGetters(["userInfo", "tmc"]),
    getTitle () {
      let that = this;
      if (that.userInfo.jobType === 0) {
        that.btnTxt = "保存并发送给患者";
      } else if (that.userInfo.jobType === 1) {
        that.btnTxt = "保存";
      }
      return that.btnTxt;
    },
    getTotalPrice () {
      let that = this;
      let orderPrice = 0;
      that.rpData.rpMedicines.forEach(item => {
        orderPrice = item.unitPrice * item.medicineAmount + orderPrice;
      });
      return orderPrice;
    },
    getOrderPrice () {
      let that = this;
      let orderPrice = 0;
      that.rpData.rpMedicines.forEach(item => {
        let cloneItem = JSON.parse(JSON.stringify(item))
        let flag = false;
        that.chooseCouponList.forEach(v => {
          if (v.rule.medicineID === cloneItem.medicineID) {
            flag = true;
          }
        })
        if (flag) {
          cloneItem.medicineAmount = Number(cloneItem.medicineAmount) - that.chooseCouponList[0].rule.reduce * that.chooseCouponList.length
        }
        orderPrice = cloneItem.unitPrice * cloneItem.medicineAmount + orderPrice;
      });
      that.rpData.rp.price = orderPrice;
      return orderPrice;
    },
    isDisabled () {
      let findItem = this.rpData.rpMedicines.find(item => {
        return (
          !item.medicineAmount ||
          item.medicineAmount === "0" ||
          !item.takeDose ||
          item.takeDose === "0" ||
          !item.formType ||
          !item.takeFrequence ||
          !item.takeDirection ||
          !item.medicationDays ||
          item.medicationDays === "0"
        );
      });
      if (findItem || !this.rpData.rpMedicines || !this.rpData.rpMedicines.length || !this.rpData.rp.diagnosis) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    if (this.tmc.patientID) {
      this.getPatientInfoDataFun();
    }
    this.queryDiagnosisTemplate();
  },
  activated () {
    if (this.tmc.patientID) {
      this.getPatientInfoDataFun();
    }
  },
  methods: {
    view () {
      if (this.rpData.rp.diagnosis === "" || !this.rpData.rp.diagnosis) {
        this.$notify.error({
          title: "提示",
          message: "请先输入诊断结果"
        });
        return;
      }
      if (this.rpData.rpMedicines.length === 0) {
        this.$notify.error({
          title: "提示",
          message: "请添加药品"
        });
        return;
      }
      let findItem = this.rpData.rpMedicines.find(item => {
        return (
          !item.medicineAmount ||
          item.medicineAmount === "0" ||
          !item.takeDose ||
          item.takeDose === "0" ||
          !item.formType ||
          !item.takeFrequence ||
          !item.takeDirection ||
          !item.medicationDays ||
          item.medicationDays === "0"
        );
      });
      if (findItem) {
        let medicineName = findItem.medicineName;
        let medicineDetail = "";
        if (!findItem.medicineAmount || findItem.medicineAmount === "0") {
          medicineDetail = "的药品数量";
        } else if (!findItem.takeDose || findItem.takeDose === "0") {
          medicineDetail = "的每次用量";
        } else if (!findItem.formType) {
          medicineDetail = "每次用量的单位";
        } else if (!findItem.takeFrequence) {
          medicineDetail = "的用药频率";
        } else if (!findItem.takeDirection) {
          medicineDetail = "的用药方式";
        } else if (
          !findItem.medicationDays ||
          findItem.medicationDays === "0"
        ) {
          medicineDetail = "的用药天数";
        }
        this.$notify.error({
          title: "提示",
          message: "请完善\"" + medicineName + "\"" + medicineDetail
        });
        return;
      }
      this.trialVisible = true;
    },
    amountChange () {
      this.couponList = [];
      this.chooseCouponList = [];
    },
    handleShowInfo () {
      this.couponDetail = !this.couponDetail;
    },
    showCoupon () {
      if (this.rpData.rpMedicines.length === 0) {
        this.$message.warning("请先添加药品！");
        return;
      };
      this.queryAvaliableCouponList();
    },
    confirmFn (list) {
      this.couponList = [];
      this.chooseCouponList = list;
      list.forEach(item => {
        let obj = {
          couponID: item.keyID,
          couponSendID: item.couponSendID
        }
        this.couponList.push(obj)
      })
      this.closeFn()
    },
    closeFn () {
      this.chooseCouponVisible = false;
      this.trialVisible = false;
    },
    //查询可用优惠券列表
    queryAvaliableCouponList () {
      if (this.rpData.rpMedicines.length === 0) {
        this.$message.warning("请先添加药品！");
        return;
      }
      ;
      let _data = {
        orgID: this.userInfo.orgID,
        patientID: this.tmc.patientID,
        medicineList: this.rpData.rpMedicines
      };
      this.$_http.post(this.$_API.API_COUPON_QUERYVALIABLEOUPOOIST, _data)
        .then(res => {
          if (res.data && res.data.length) {
            this.chooseCouponVisible = true;
            res.data.forEach(item => {
              item.rule = JSON.parse(item.rule);
              item.checked = false;
              item.disabled = false;
            });
            this.couponTableList = res.data;
          } else {
            this.chooseCouponVisible = false;
            this.couponTableList = [];
            this.$message.warning('暂无可用优惠券!')
          }
        }).catch(err => {
          this.chooseCouponVisible = false;
          this.couponTableList = [];
        });
    },
    handleSelect (item) {
      console.log(item);
    },
    async queryDiagnosisTemplate () {
      let params = {
        orgID: this.userInfo.orgID
      };
      const res = await this.$_http.get(this.$_API.INTERFACE_TMC_GET_DIAGNOSISTEMPLATE, { params });
      if (res.data) {
        this.restaurants = res.data;
      }
    },
    querySearch (queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      results.map(item => {
        item.value = item.diagnosis;
      });
      cb(results);
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.diagnosis.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    // 选择模版药品
    choice (row) {
      this.rpData.rpMedicines = [];
      let params = {
        classifyID: row.keyID
      };
      this.$_http
        .get(this.$_API.INTERFACE_GET_GETRPTEMPLATE, { params })
        .then(res => {
          if (!res.data) return;
          if (!this.rpData.rpMedicines) {
            this.rpData.rpMedicines = res.data;
            return;
          }
          res.data.forEach(it => {
            let indexs = "";
            let isHave = false;
            this.rpData.rpMedicines.forEach((item, index) => {
              if (it.medicineID === item.medicineID) {
                isHave = true;
                indexs = index;
              }
            });
            if (!isHave) {
              let obj = {
                medicineAmount: 1,
                medicineName: it.medicineName,
                unitPrice: it.price,
                specification: it.productSpec,
                unit: it.productUnit
              };
              obj = { ...obj, ...it };
              this.rpData.rpMedicines.push(obj);
            } else {
              this.rpData.rpMedicines[indexs].medicineAmount++;
            }
          });
          this.rpTemplate = false;
        });
    },
    close () {
      this.visible = false;
    },
    // 查询患者信息
    getPatientInfoDataFun () {
      let params = {
        orgID: this.userInfo.orgID,
        keyID: this.tmc.patientID
      };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_PATIENT_INFO, { params })
        .then(res => {
          this.patientInfo = res.data;
          if (Number(this.patientInfo.sex) === 1) {
            this.$set(this.patientInfo, "sexName", "男");
          } else if (Number(this.patientInfo.sex) === 2) {
            this.$set(this.patientInfo, "sexName", "女");
          } else {
            this.$set(this.patientInfo, "sexName", "未知");
          }
          if (this.patientInfo.birthYear && this.patientInfo.birthYear !== 0) {
            this.getAge(this.patientInfo.birthYear);
          } else {
            this.patientInfo.age = "";
          }
          this.getPatientDoc(this.patientInfo.keyID);
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 根据出生年算出年龄
    getAge (birthYear) {
      let myDate = new Date();
      let tYear = myDate.getFullYear();
      this.patientInfo.age = tYear - birthYear;
    },
    // 获取患者档案
    getPatientDoc (patientID) {
      let _this = this;
      let params = {
        keyID: patientID,
        orgID: _this.userInfo.orgID
      };
      _this.$_http
        .get(_this.$_API.INTERFACE_TMC_GET_PATIENT_RECORD, {
          params
        })
        .then(res => {
          if (!res.data) return;
          _this.patientDoc = res.data;
          if (res.data.length > 0) {
            _this.patientDoc.forEach(it => {
              if (it.docItemCode === "ALLERGY") {
                if (it.docItemValue !== "无") {
                  _this.patientInfo.historyOfAllergy = it.docItemDesc;
                } else {
                  _this.patientInfo.historyOfAllergy = "无";
                }
              }
              if (it.docItemCode === "LIVER") {
                _this.patientInfo.liver = it.docItemValue;
              }
              if (it.docItemCode === "KIDNEY") {
                _this.patientInfo.renal = it.docItemValue;
              }
              if (it.docItemCode === "ILLNESS") {
                if (it.docItemValue !== "无") {
                  _this.patientInfo.historyOfSickness = it.docItemDesc;
                } else {
                  _this.patientInfo.historyOfSickness = "无";
                }
              }
              if (it.docItemCode === "PREGNANCY") {
                _this.patientInfo.pregnancy = it.docItemValue;
              }
            });
          } else {
            this.$set(_this.patientInfo, "historyOfAllergy", "无");
            this.$set(_this.patientInfo, "liver", "正常");
            this.$set(_this.patientInfo, "historyOfSickness", "无");
            this.$set(_this.patientInfo, "renal", "正常");
            this.$set(_this.patientInfo, "pregnancy", "无");
          }
          this.loadDictionary();
        });
    },
    ...mapActions({
      getDictionary: "dictionary/getDictionary",
      resetConversationID: "tmc/resetConversationID", // 改变私聊会话ID
      resetPrivateChatID: "tmc/resetPrivateChatID" // 改变会话ID
    }),
    // 根据字典类型获取字典数据
    loadDictionary () {
      // 单次用量的单位
      this.getDictionary({
        systemCode: "MEDICAL",
        groupCode: "D_MEDICAL_MEDICINE_UNIT",
        parentDictCode: ""
      }).then(res => {
        this.formTypeOptions = res;
      });
      // 单次用量的频率
      this.getDictionary({
        systemCode: "MEDICAL",
        groupCode: "D_MEDICAL_TREAT_FREQUENCY",
        parentDictCode: ""
      }).then(res => {
        this.takeFrequenceOptions = res;
      });
      // 单次用药的方式
      this.getDictionary({
        systemCode: "MEDICAL",
        groupCode: "D_MEDICAL_TREAT_ROUTE",
        parentDictCode: ""
      }).then(res => {
        this.takeDirectionOptions = res;
      });
      if (this.tmc.patientID && this.tmc.inquiryID) {
        this.getRpDetailFun();
      }
    },
    // 查询：处方详情
    getRpDetailFun () {
      let params = {
        inquiryID: this.tmc.inquiryID,
        orgID: this.userInfo.orgID
      };
      this.$_http
        .get(this.$_API.INTERFACE_TMC_GET_RP_DETAIL_INQUIRY, { params })
        .then(res => {
          if (res.data) {
            this.rpData = res.data;
          } else {
            this.rpData = {
              rp: {
                price: "",
                rpAdvice: "", // 医嘱
                diagnosis: "" // 诊断结果
              },
              rpMedicines: []
            };
          }
        });
    },
    // 操作：处方模板
    toRpTemplateFun () {
      this.endData = [];
      let father = [];
      let son = [];
      // 获取所有的模版
      let params = {
        orgID: this.userInfo.orgID,
        rpClassifyType: 0
      };
      this.$_http
        .get(this.$_API.INTERFACE_GET_GETLIST, { params })
        .then(res => {
          if (!res.data) return;
          res.data.forEach(it => {
            if (!it.parantID) {
              father.push(it);
            } else if (it.parantID) {
              son.push(it);
            }
          });
          for (let i = 0; i < father.length; i++) {
            let fatherItem = father[i];
            for (let j = 0; j < son.length; j++) {
              let sonItem = son[j];
              sonItem.sonName = sonItem.classifyName;
              if (fatherItem.keyID === sonItem.parantID) {
                let endDataItem = {
                  ...sonItem,
                  classifyName: fatherItem.classifyName
                };
                this.endData.push(endDataItem);
              }
            }
          }
          this.rpTemplate = true;
        });
    },
    // 操作：添加药品
    addMedicineFun () {
      this.visible = true;
      this.couponList = [];
      this.chooseCouponList = [];
    },
    // 接收药品数据
    handleEdits (index, row) {
      let isHave = false;
      let indexs = -1;
      this.rpData.rpMedicines.forEach((item, index) => {
        if (row.medicineID === item.medicineID) {
          isHave = true;
          indexs = index;
        }
      });
      if (!isHave) {
        let obj = {
          medicineAmount: 1,
          medicineName: row.medicineName,
          unitPrice: row.price,
          specification: row.productSpec,
          unit: row.productUnit
        };
        obj = { ...obj, ...row };
        this.rpData.rpMedicines.push(obj);
      } else {
        this.rpData.rpMedicines[indexs].medicineAmount++;
      }
      this.$_success("添加成功");
    },
    // 操作：删除药品
    delMedicineFun (item, index) {
      this.$confirm("确认删除该药品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.rpData.rpMedicines.splice(index, 1);
          this.couponList = []
          this.chooseCouponList = []
        })
        .catch(() => {
        });
    },
    // 操作：保存并提交给医生
    saveRpDataFun () {
      if (!this.tmc.patientID) {
        this.$notify.error({
          title: "提示",
          message: "请先选择列表中的患者"
        });
        return;
      }
      try {
        // 保存聊天
        if (this.rpData.rp.diagnosis) {
          this.$_http
            .post(this.$_API.INTERFACE_TMC_POST_DIAGNOSISTEMPLATE, {
              orgID: this.userInfo.orgID,
              diagnosis: this.rpData.rp.diagnosis
            }).then(res => {
            })
            .finally(it => {
            });
        }
      } catch (error) {
      }
      if (!this.tmc.inquiryID) {
        this.tableLoading = true;
        // 创建问诊
        this.$_http
          .post(this.$_API.INTERFACE_TMC_POST_CREATE_INQUIRY, {
            orgID: this.userInfo.orgID,
            patientID: this.tmc.patientID,
            assistantStaffID: this.tmc.assistantStaffID,
            assistantName: this.tmc.assistantName,
            doctorName: this.tmc.doctorName,
            doctorStaffID: this.tmc.doctorStaffID,
            talkID: this.tmc.multiTalkID
          })
          .then(res => {
            console.log("------创建问诊----");
            this.tableLoading = false;
            if (!res.data || !res.data.keyID) {
              this.$notify.error({
                title: "创建问诊失败",
                message: "创建问诊失败"
              });
              return;
            }
            this.resetConversationID(res.data.keyID);
            this.resetPrivateChatID(res.data.privateIM);
            this.saveRpDataCheckAndSaveFun();
          })
          .finally(it => {
            this.tableLoading = false;
          });
      } else {
        this.saveRpDataCheckAndSaveFun();
      }
    },
    saveRpDataCheckAndSaveFun () {
      if (this.rpData.rp.diagnosis === "" || !this.rpData.rp.diagnosis) {
        this.$notify.error({
          title: "提示",
          message: "请先输入诊断结果"
        });
        return;
      }
      if (this.rpData.rpMedicines.length === 0) {
        this.$notify.error({
          title: "提示",
          message: "请添加药品"
        });
        return;
      }
      let findItem = this.rpData.rpMedicines.find(item => {
        return (
          !item.medicineAmount ||
          item.medicineAmount === "0" ||
          !item.takeDose ||
          item.takeDose === "0" ||
          !item.formType ||
          !item.takeFrequence ||
          !item.takeDirection ||
          !item.medicationDays ||
          item.medicationDays === "0"
        );
      });
      if (findItem) {
        let medicineName = findItem.medicineName;
        let medicineDetail = "";
        if (!findItem.medicineAmount || findItem.medicineAmount === "0") {
          medicineDetail = "的药品数量";
        } else if (!findItem.takeDose || findItem.takeDose === "0") {
          medicineDetail = "的每次用量";
        } else if (!findItem.formType) {
          medicineDetail = "每次用量的单位";
        } else if (!findItem.takeFrequence) {
          medicineDetail = "的用药频率";
        } else if (!findItem.takeDirection) {
          medicineDetail = "的用药方式";
        } else if (
          !findItem.medicationDays ||
          findItem.medicationDays === "0"
        ) {
          medicineDetail = "的用药天数";
        }
        this.$notify.error({
          title: "提示",
          message: "请完善\"" + medicineName + "\"" + medicineDetail
        });
        return;
      }
      let data = {
        rp: { ...this.rpData.rp },
        rpMedicines: [...this.rpData.rpMedicines],
        couponList: [...this.couponList]
      };
      data.rp.inquiryID = this.tmc.inquiryID;
      data.rp.orgID = this.userInfo.orgID;
      data.rp.patientID = this.tmc.patientID;
      data.rp.personID = this.tmc.personID;
      data.rp.patientName = this.patientInfo.patientName;
      data.rp.sex = this.patientInfo.sex;
      data.rp.age = this.patientInfo.age;
      data.rp.consultDisease = this.patientInfo.consultDisease;
      data.rp.duration = "";
      if (this.patientDoc.length > 0) {
        this.patientDoc.forEach(it => {
          if (it.docItemCode === "LIVER") {
            data.rp.liver = it.docItemValue;
          }
          if (it.docItemCode === "KIDNEY") {
            data.rp.renal = it.docItemValue;
          }
          if (it.docItemCode === "PREGNANCY") {
            data.rp.pregnancy = it.docItemValue;
          }
          if (it.docItemCode === "ALLERGY") {
            data.rp.historyOfAllergy = it.docItemValue;
            if (it.docItemValue === "有") {
              data.rp.allergyDetail = it.docItemDesc;
            }
          }
          if (it.docItemCode === "ILLNESS") {
            data.rp.historyOfSickness = it.docItemValue;
            if (it.docItemValue === "有") {
              data.rp.sicknessDetail = it.docItemDesc;
            }
          }
        });
      } else {
        data.rp.liver = this.patientInfo.liver;
        data.rp.renal = this.patientInfo.renal;
        data.rp.pregnancy = this.patientInfo.pregnancy;
        data.rp.historyOfAllergy = this.patientInfo.historyOfAllergy;
        data.rp.historyOfSickness = this.patientInfo.historyOfSickness;
      }
      let title = "";
      let msg = "";
      if (this.userInfo.jobType === 0) {
        data.rp.rpStatus = 1;
        title = "确认保存处方并发送给患者吗？";
        msg = "保存处方并发送给患者成功";
      } else if (this.userInfo.jobType === 1) {
        data.rp.rpStatus = 0;
        title = "确认保存处方并提交给医生吗？";
        msg = "保存处方并提交给医生成功";
      }
      data.rp.rpType = 0;
      data.rp.assistantStaffID = this.tmc.assistantStaffID;
      data.rp.assistantName = this.tmc.assistantName;
      data.rp.doctorStaffID = this.tmc.doctorStaffID;
      data.rp.doctorName = this.tmc.doctorName;
      this.$confirm(title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableLoading = true;
          this.$_http
            .post(this.$_API.INTERFACE_TMC_POST_RP_ADD, data)
            .then(res => {
              this.saveRp();
              this.couponList = [];
              this.chooseCouponList = [];
              this.$notify({
                title: "成功",
                message: msg,
                type: "success"
              });
              // 医生保存处方就发送自定义消息
              if (this.userInfo.jobType === 0) {
                this.sendRpMessage();
              }
              this.getRpDetailFun();
            })
            .finally(it => {
              this.tableLoading = false;
            });
        })
        .catch(() => {
          this.tableLoading = false;
          this.$notify.info({
            title: "已取消",
            message: "已取消保存处方"
          });
        });
    },
    // 保存药品信息
    async saveRp () {
      try {
        await this.$_http.post(this.$_API.INTERFACE_POST_SAVEMDEICINETEMPLATE, {
          medicineTemplateVOS: [...this.rpData.rpMedicines]
        });
      } catch (error) {

      }
    },
    // 发送处方消息
    sendRpMessage () {
      let data = {
        customType: "card",
        childType: "rpInfo",
        data: {
          title: "诊断：" + this.rpData.rp.diagnosis,
          orgID: this.userInfo.orgID,
          inquiryID: this.tmc.inquiryID
        }
      };
      let payload = {
        data: JSON.stringify(data),
        description: "[处方详情]",
        extension: "tmc"
      };
      this.sendMessage("CUSTOM", payload);
    },
    // 转换：根据身份证号解析出生年月及年龄
    getAnalysisIdCard (idNumber, type) {
      if (type === 1) {
        // 获取出生日期
        let birth =
          idNumber.substring(6, 10) +
          "-" +
          idNumber.substring(10, 12) +
          "-" +
          idNumber.substring(12, 14);
        return birth;
      }
      if (type === 2) {
        // 获取性别
        if (parseInt(idNumber.substr(16, 1)) % 2 === 1) {
          return 1;
        } else {
          return 2;
        }
      }
      if (type === 3) {
        // 获取年龄
        let myDate = new Date();
        let month = myDate.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        let day = myDate.getDate();
        day = day < 10 ? "0" + day : day;
        let age = myDate.getFullYear() - idNumber.substring(6, 10) - 1;
        if (
          idNumber.substring(10, 12) < month ||
          (idNumber.substring(10, 12) === month &&
            idNumber.substring(12, 14) <= day)
        ) {
          age++;
        }
        return age;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  width: 460px;
}

#rpAdviseBox {
  position: relative;
  font-size: 14px;
  .floatIconDiv {
    position: absolute;
    top: 50px;
    right: 0;

    .floatIconImg {
      width: 72px;
      height: 51px;
    }
  }

  .patientInfoBox {
    margin-bottom: 15px;

    .patientInfoDiv {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-bottom: 10px;
      color: #555658;

      > div:nth-of-type(3) {
        text-align: right;
      }

      .infoDiv {
        min-width: 105px;
      }
    }
  }

  .diagnosisBox {
    margin-bottom: 30px;

    .pageTitle {
      margin-bottom: 10px;
      color: #555658;
    }
  }

  .rpDataBox {
    .flexRowBetween {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .rpTitle {
        font-weight: bold;
        color: #2a2c30;
      }
    }

    .rpAndMedicineBtn {
      display: flex;
      flex-direction: row;
      color: #438bef;

      .rpAndMedicineBtnDiv {
        margin-left: 10px;
        cursor: pointer;

        .rpIconImg {
          width: 20px;
          height: 20px;
        }
      }
    }

    ul {
      padding-left: 0;

      li {
        list-style-type: none;
        margin: 0 0 20px 0;
        border-bottom: 1px solid #e8e8e8;
        padding-bottom: 10px;

        .medicineDivOne {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-bottom: 10px;

          .medicineTitleDiv {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;

            .delMedicineIconDiv {
              width: 16px;
              height: 16px;
              border-radius: 16px;
              background-color: red;
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
              cursor: pointer;

              .delMedicineIconImg {
                width: 12px;
                height: 12px;
              }
            }

            .medicineName {
              margin-right: 10px;
              color: #242526;
              font-size: 15px;
            }
          }

          .medicineNumDiv {
            width: 80px;
            text-align: right;
          }
        }

        #medicineDivThree {
          margin-bottom: 10px;

          .medicineUseInputOne {
            margin-right: 5px;
            border-radius: 3px;
            border: 1px solid #e8e8e8;
            width: 70px;
            height: 25px;
            padding-left: 5px;
            padding-right: 5px;
            font-size: 14px;
            text-align: center;
            color: #555658;
          }
        }

        .medicineDivFour {
          text-align: right;
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /*** 消除input元素 type="number" 时默认的 加减按钮---moz版*/
        input[type="number"] {
          -moz-appearance: textfield;
        }

        .medicineTitle {
          padding-left: 10px;
          padding-right: 10px;
        }

        .medicinePrice {
          font-size: 14px;
          color: #555658;
          margin-left: 10px;
        }

        .delMedicineIcon {
          width: 18px;
          height: 18px;
          padding-top: 3px;
        }

        .medicineUnit {
          font-size: 14px;
          color: #555658;
        }

        .medicineNumInput {
          margin-right: 10px;
          border-radius: 3px;
          border: 1px solid #e8e8e8;
          width: 40px;
          height: 25px;
          padding-left: 5px;
          padding-right: 5px;
          font-size: 14px;
          text-align: center;
          color: #555658;
        }
      }
    }

    .rpEnjoin {
      padding-top: 20px;

      .pageTitles {
        margin-bottom: 15px;
        color: #555658;
      }
    }

    .totalPriceBox {
      width: 100%;
      text-align: right;
      font-size: 15px;

      .totalPriceTitle {
        color: #555658;
      }

      .totalMoneyTxt {
        color: #fe5853;
      }
    }
  }

  .btnBox {
    width: 100%;
    height: 90px;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .coupon {
    height: 40px;
    display: flex;
    align-items: center;

    img {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    span {
      cursor: pointer;
      color: #438bef;
    }
  }
  .collapse-panel {
    height: 46px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid e8e8e8;
    align-items: center;
    cursor: pointer;
    span {
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      font-weight: 400;
    }
    i {
      color: rgba(232, 232, 232, 1);
      font-size: 14px;
      font-weight: 800;
    }
  }
  .couponDetail {
    overflow: hidden;
    border-bottom: 1px solid #e8e8e8;
    height: 46px;
    line-height: 46px;
    span {
      color: #606266;
      font-size: 14px;
    }
  }
}
input::-webkit-input-placeholder {
  color: #c0c4cc;
}
</style>
