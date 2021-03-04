<template>
  <div class="app-container base-page">
    <div id="TransferOrders">
      <base-title name="查询条件"></base-title>

      <div class="base-search_form">
        <div class="form-item">
          <span class="item-label">转诊医生：</span>
          <el-input v-model="query.doctorName" placeholder="请输入" label-name="转诊来源" clearable></el-input>
        </div>
        <div class="form-item">
          <span class="item-label">转诊医生电话：</span>
          <el-input v-model="query.doctorPhone" maxlength="11" placeholder="请输入" clearable></el-input>
        </div>
        <div class="form-item">
          <span class="item-label">患者姓名：</span>
          <el-input v-model="query.patientName" placeholder="请输入" label-name="患者姓名" clearable></el-input>
        </div>
        <div class="form-item">
          <span class="item-label">患者电话：</span>
          <el-input v-model="query.patientPhone" maxlength="11" placeholder="请输入" clearable></el-input>
        </div>
        <div class="form-item">
          <span class="item-label">转诊时间：</span>
          <el-date-picker v-model="transferTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
        </div>
        <div class="form-item">
          <span class="item-label">订单状态：</span>
          <el-select v-model="query.orderStatus" placeholder="请选择" value clearable filterable>
            <el-option v-for="(item,index) in orderStateOptions" :key="index" :label="item.orderName" :value="item.orderStatusID"></el-option>
          </el-select>
        </div>
        <div class="form-item">
          <el-button type="primary" icon="el-icon-search" @click="getTableData1stValidate">查询</el-button>
        </div>
        <div class="form-item">
          <el-button icon="el-icon-refresh" @click="resetSearchInfoFun">重置</el-button>
        </div>
      </div>

      <base-title name="订单列表"></base-title>
      <el-table :data="transferOrderData" :loading="tableLoading" class="mt24" stripe>
        <el-table-column prop="sourceName" label="转诊医生" align="center"></el-table-column>
        <el-table-column prop="doctorPhone" label="转诊医生电话" align="center" width="155px"></el-table-column>
        <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
        <el-table-column prop="patientPhone" label="患者电话" align="center"></el-table-column>
        <el-table-column prop="transferTime" label="转诊时间" width="155px" align="center">
          <template #default="{row}">{{ row.transferTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column prop="appointTime" label="预约时间" width="155px" align="center">
          <template #default="{row}">{{ row.appointTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column prop="orderStatusName" label="订单状态" align="center"></el-table-column>
        <el-table-column label="操作" width="550px" align="center">
          <template #default="{row}">
            <div class="option-btn_group">
              <span class="opt-text" v-if=" [21,31,42].includes(row.orderStatusId) " @click="patientTransferBegin(row)">患者流转</span>
              <div class="line" v-if=" [21,31,42].includes(row.orderStatusId) "></div>
              <span class="opt-text" v-if="row.orderStatusId===10 " @click="receiveBegin(row)">同意接诊</span>
              <div class="line" v-if="row.orderStatusId===10  "></div>
              <span class="opt-text" v-if="row.orderStatusId===10 " @click="receiveRefuseBegin(row)">拒绝接诊</span>
              <div class="line" v-if="row.orderStatusId===10  "></div>
              <span class="opt-text" v-if="row.orderStatusId===11 " @click="beHospitalizedBegin(row)">确认入院</span>
              <div class="line" v-if="row.orderStatusId===11  "></div>
              <span class="opt-text" v-if="row.orderStatusId===11 " @click="beUnhospitalized(row)">确认未入院</span>
              <div class="line" v-if="row.orderStatusId===11  "></div>
              <span class="opt-text" v-if="row.orderStatusId===21 " @click="settlementBegin(row)">填写结算信息</span>
              <div class="line" v-if="row.orderStatusId===21  "></div>
              <span class="opt-text" v-if="row.orderStatusId===31||  row.orderStatusId===42 " @click="settlementBegin(row)">修改结算信息</span>
              <div class="line" v-if="row.orderStatusId===31||  row.orderStatusId===42 "></div>
              <span class="opt-text" v-if="row.orderStatusId===21" @click="settleAccountsWhenLeaveHospitalBegin(row)">发起出院结算</span>
              <div class="line" v-if="row.orderStatusId===21"></div>
              <span class="opt-text" v-if="row.orderStatusId===31||  row.orderStatusId===42 " @click="settleAccountsWhenLeaveHospitalBegin(row)">重新发起出院结算</span>
              <div class="line" v-if="row.orderStatusId===31||  row.orderStatusId===42 "></div>
              <span class="opt-text" @click="toDetail(row)">详情</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination v-model="pageInfo" @size-change="getTableData1stValidate" @current-change="getTableData1stValidate" />
      <!--同意接诊话框-->
      <div id="receiveBody">
        <el-dialog :title="receiveBodyTitle" :visible.sync="receiveBodyVisible" width="500px" @close="receiveBodyCancel">
          <el-form :model="receiveData" :rules="receiveFormRule" ref="receiveForm">
            <el-form-item label="就诊方式：" label-width="100px" prop="inquiryModeId">
              <el-radio-group v-model="receiveData.inquiryModeId">
                <el-radio :label="1">门诊</el-radio>
                <el-radio :label="2">住院</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="科室：" label-width="100px" prop="hospitalSectionId">
              <el-select v-model="receiveData.hospitalSectionId" placeholder="请选择" v-on:change="getDoctorList" filterable clearable>
                <el-option v-for="item in sectionOptions" :key="item.keyID" :label="item.hospitalSectionName" :value="item.keyID"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="医生姓名：" label-width="100px" prop="hospitalDoctorName" ref="hospitalDoctorName">
              <el-autocomplete v-model="receiveData.hospitalDoctorName" placeholder="请输入" label-name="医生姓名" :fetch-suggestions="querySearch" @select="afterSelect"></el-autocomplete>
            </el-form-item>
            <el-form-item label="预约时间：" label-width="100px" prop="appointTimeOriginal" v-if="receiveBodyTitle !=='确认入院'">
              <el-date-picker v-model="receiveData.appointTimeOriginal" type="datetime" placeholder="请选择" clearable default-time="10:00:00" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
            <el-form-item label="病情描述：" label-width="100px" prop="receiveCondition">
              <el-input type="textarea" :rows="4" placeholder="请输入" maxlength="200" v-model="receiveData.receiveCondition"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="receiveBodyCancel">取消</el-button>
            <el-button class="sure" type="primary" @click="receiveBodyEnsureCommon1st">确认</el-button>
          </span>
        </el-dialog>
      </div>
      <!--拒绝接诊话框-->
      <div id="receiveRefuseBody">
        <el-dialog title="拒绝接诊" :visible.sync="receiveRefuseVisible" width="700px">
          <el-form :modal="receiveRefuseData">
            <el-form-item label="拒绝接诊原因：" label-width="120px" required>
              <el-input type="textarea" :rows="4" placeholder="请输入" maxlength="200" show-word-limit v-model="receiveRefuseData.refuseReason"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="receiveRefuseCancel">取消</el-button>
            <el-button class="sure" type="primary" @click="receiveRefuseEnsure">确认</el-button>
          </span>
        </el-dialog>
      </div>
      <!-- 填写结算信息 -->
      <div id="settlementBody">
        <el-dialog title="结算信息" :visible.sync="settlementBodyVisible" width="700px">
          <el-table :data="treatmentList" style="width: 100%" stripe>
            <el-table-column prop="inquiryModeName" label="就诊方式" width="80" align="center"></el-table-column>
            <el-table-column prop="hospitalSectionName" label="科室" width="80" align="center"></el-table-column>
            <el-table-column prop="hospitalDoctorName" label="医生" align="center"></el-table-column>
            <el-table-column prop="hasSettle" label="是否填写结算信息" align="center">
              <template #default="{row}">
                <span v-if="row.hasSettle===1">是</span>
                <span v-if="row.hasSettle===0">否</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="{row}">
                <div class="option-btn_group">
                  <span class="opt-text" v-if=" row.hasSettle===0 " @click="openSettlementDetail(row.keyId,row.hasSettle)">填写结算信息</span>
                  <span class="opt-text" v-if=" row.hasSettle===1 " @click="openSettlementDetail(row.keyId,row.hasSettle)">修改结算信息</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button @click="settlementBodyVisible=false">取消</el-button>
            <el-button @click="settlementBodyVisible=false" type="primary">确定</el-button>
          </span>
        </el-dialog>
      </div>
      <!-- 结算信息明细 -->
      <div id="settlementDetailBody">
        <el-dialog title="填写/修改结算信息" :visible.sync="settlementDetailBodyVisible" width="700px" @close="settlementDetailBodyCancel">
          <el-form :model="settlementDetailData" ref="settlementDetailForm" label-width="100px" class="demo-ruleForm" :rules="settlementDetailFormRules">
            <el-form-item label="出院日期" prop="timeOriginal">
              <el-date-picker v-model="settlementDetailData.timeOriginal" type="date" placeholder="请选择（必选）"></el-date-picker>
            </el-form-item>
            <el-form :model="settlementDetailData" ref="saveItems" label-width="100px">
              <!-- <el-form-item>
                    <el-button @click="addItem">新增诊疗费用</el-button>
                  </el-form-item>-->
              <el-row v-for="(saveItems,index) in settlementDetailData.items" :key="index">
                <el-form-item :label="'诊疗费用' + (index + 1)" :prop="'items.' + index + '.feeItemMappingID'" :rules="{ validator: checkItem,  trigger: 'change'}" style="display:inline-block;">
                  <el-select v-model="saveItems.feeItemMappingID" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in mapping" :key="item.keyID" :label="item.projectName" :value="item.keyID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :prop="'items.' + index + '.treatMoney'" :rules="{ validator: checkItem,  trigger: 'blur' }" class="custome-input" :show-message="false">
                  &emsp;
                  <!-- <el-input
                      form-type="money"
                        style="width: 110px;"
                        placeholder="请输入金额"
                        v-model="saveItems.treatMoney"
                        @change="treatMoneyChange"
                      ></el-input>&emsp;-->
                  <el-input style="width: 110px;" placeholder="请输入" v-model="saveItems.treatMoney" @keyup.native="saveItems.treatMoney = oninput(saveItems.treatMoney)" @change="treatMoneyChange" clearable></el-input>&emsp;
                  <el-button type="primary" @click.prevent="addItem(saveItems)">添加</el-button>
                  <el-button type="danger" v-if="index != 0" @click.prevent="deleteItem(saveItems)">删除</el-button>
                </el-form-item>
              </el-row>
              <el-form-item>
                &emsp;
                <span style="margin-left:170px">总计:</span>
                &emsp;{{totalMoney.toFixed(2)}}
              </el-form-item>
            </el-form>
            <el-form-item label="治疗方案" required>
              <el-col :span="5">
                <el-form-item prop="treatPlanImgUrl">
                  <span class="isHover" v-if="settlementDetailData.treatPlanImgUrl">
                    <base-image :src="settlementDetailData.treatPlanImgUrl" @click="handlePictureCardPre(settlementDetailData.treatPlanImgUrl)" style="border: 1px solid #c0ccda;border-radius: 6px;overflow: hidden;display: inline-block;cursor: pointer; ">
                      <span class="el-upload-list__item-preview"></span>
                    </base-image>
                    <div class="meng">
                      <i class="el-icon-zoom-in iconScale" @click="handlePictureCardPre(settlementDetailData.treatPlanImgUrl)"></i>
                      <i class="el-icon-delete iconDelete" @click="handlePictureDelete(1,'treatPlanImg')"></i>
                    </div>
                  </span>
                  <base-upload v-else class="uploadLabel" :data="data" :limit="imageNumber" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="uploadSuccess(1,'treatPlanImg')"></base-upload>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="1"></el-col>
              <el-col :span="5">
                <el-form-item prop="inquiryResultDesc">
                  <el-input type="textarea" placeholder="请输入" v-model="settlementDetailData.treatPlanDesc" clearable style="width: 300px"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="检查报告">
              <el-col :span="5">
                <el-form-item prop="checkReportImgUrl">
                  <span class="isHover" v-if="settlementDetailData.checkReportImgUrl">
                    <base-image :src="settlementDetailData.checkReportImgUrl" @click="handlePictureCardPre(settlementDetailData.checkReportImgUrl)" style="border: 1px solid #c0ccda;border-radius: 6px;overflow: hidden;display: inline-block;cursor: pointer; ">
                      <span class="el-upload-list__item-preview"></span>
                    </base-image>
                    <div class="meng">
                      <i class="el-icon-zoom-in iconScale" @click="handlePictureCardPre(settlementDetailData.checkReportImgUrl)"></i>
                      <i class="el-icon-delete iconDelete" @click="handlePictureDelete(2,'checkReportImg')"></i>
                    </div>
                  </span>
                  <base-upload v-else class="uploadLabel" :data="data" :limit="imageNumber" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="uploadSuccess(2,'checkReportImg')"></base-upload>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="1"></el-col>
              <el-col :span="5">
                <el-form-item prop="checkReportDesc ">
                  <el-input type="textarea" placeholder="请输入" clearable v-model="settlementDetailData.checkReportDesc" style="width: 300px"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="诊断结论">
              <el-col :span="5">
                <el-form-item prop="inquiryResultImgUrl ">
                  <span class="isHover" v-if="settlementDetailData.inquiryResultImgUrl ">
                    <base-image :src="settlementDetailData.inquiryResultImgUrl" @click="handlePictureCardPre(settlementDetailData.inquiryResultImgUrl )" style="border: 1px solid #c0ccda;border-radius: 6px;overflow: hidden;display: inline-block;cursor: pointer; ">
                      <span class="el-upload-list__item-preview"></span>
                    </base-image>
                    <div class="meng">
                      <i class="el-icon-zoom-in iconScale" @click="handlePictureCardPre(settlementDetailData.inquiryResultImgUrl)"></i>
                      <i class="el-icon-delete iconDelete" @click="handlePictureDelete(3,'inquiryResultImg')"></i>
                    </div>
                  </span>
                  <base-upload v-else class="uploadLabel" :data="data" :limit="imageNumber" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="uploadSuccess(3,'inquiryResultImg')"></base-upload>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="1"></el-col>
              <el-col :span="5">
                <el-form-item prop="inquiryResultDesc ">
                  <el-input type="textarea" placeholder="请输入" clearable v-model="settlementDetailData.inquiryResultDesc " style="width: 300px"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="收费汇总">
              <el-col :span="5">
                <el-form-item prop="chargeImgUrl">
                  <span class="isHover" v-if="settlementDetailData.chargeImgUrl">
                    <base-image :src="settlementDetailData.chargeImgUrl" @click="handlePictureCardPre(settlementDetailData.chargeImgUrl)" style="border: 1px solid #c0ccda;border-radius: 6px;overflow: hidden;display: inline-block;cursor: pointer; ">
                      <span class="el-upload-list__item-preview"></span>
                    </base-image>
                    <div class="meng">
                      <i class="el-icon-zoom-in iconScale" @click="handlePictureCardPre(settlementDetailData.chargeImgUrl)"></i>
                      <i class="el-icon-delete iconDelete" @click="handlePictureDelete(4,'chargeImg')"></i>
                    </div>
                  </span>
                  <base-upload v-else class="uploadLabel" :data="data" :limit="imageNumber" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="uploadSuccess(4,'chargeImg')" style="height: 96px;width: 96px"></base-upload>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="1"></el-col>
              <el-col :span="5">
                <el-form-item prop="chargeDesc ">
                  <el-input type="textarea" placeholder="请输入" clearable v-model="settlementDetailData.chargeDesc" style="width: 300px"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="settlementDetailBodyCancel">取消</el-button>
            <el-button class="sure" type="primary" @click="settlementDetailBodyEnsure1st('saveItems')">确定</el-button>
          </span>
        </el-dialog>
      </div>

      <el-dialog :visible.sync="dialogVisible">
        <img width="94%" :src="dialogImageUrl" style="margin-left: 3%" alt="检查报告" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import InputWithTip from "@/components/InputWithTip";
import { mapGetters } from "vuex";
import { formatDate, formatDateTime } from "../../filters";

export default {
  name: "TransferOrders",
  inject: ["reload"],
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InputWithTip
  },
  filters: {
    // 格式化金额
    formatStatus (val) {
      if (val === 0) {
        return "";
      }
      return (val / 100).toFixed(2);
    },
    formatDateTime,
    formatDate
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  watch: {
    settlementDetailBodyVisible (val) {
      if (val) {
        this.listAllMapping();
      }
    }
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
      totalMoney: 0,
      pickerOptions: {},
      receiveDataDoctors: [],
      dialogVisible: false,
      dialogImageUrl: "",
      imageNumber: 1,
      srcList: [],
      data: {
        systemCode: "TRANSFER",
        belongCode: "ORDER",
        belongID: 1
      },
      settlementDetailBodyTitle: "",
      oneRow: {},
      transferOrderData: [],
      tableLoading: false,
      query: {
        doctorPhone: "",
        doctorName: "",
        doctorId: "",
        patientName: "",
        patientPhone: "",
        startTime: "",
        endTime: "",
        orderStatus: ""
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      },
      reOpen: false,
      transferTime: [],
      transferTimeConversion: [],
      receiveBodyTitle: "",
      receiveBodyVisible: false,
      receiveRefuseVisible: false,
      settlementBodyVisible: false,
      settlementDetailBodyVisible: false,
      hospitalSection: {},
      receiveData: {
        keyId: "",
        appointTime: "",
        appointTimeOriginal: "",
        hospitalDoctorId: "",
        hospitalDoctorName: "",
        hospitalSectionId: "",
        hospitalSectionName: "",
        inquiryModeId: "",
        inquiryModeName: "",
        receiveCondition: ""
      },
      settlementDetailData: {
        timeOriginal: "",
        keyId: "",
        outTime: "",
        // treatMoney: "",
        treatMoneyForShow: "",
        hospitalId: "",
        treatPlanImgId: "",
        treatPlanImgUrl: "",
        treatPlanDesc: "",
        checkReportImgId: "",
        checkReportImgUrl: "",
        checkReportDesc: "",
        inquiryResultImgId: "",
        inquiryResultImgUrl: "",
        inquiryResultDesc: "",
        chargeImgID: "",
        chargeImgUrl: "",
        chargeDesc: "",
        inquiryModeId: "",
        hospitalSectionId: "",
        items: [
          {
            keyID: "",
            treatMoney: "",
            feeItemMappingID: "",
            projectNo: "",
            projectName: "",
            standProjectCode: "",
            treatmentID: ""
          }
        ]
      },
      inquiryResultImgUrlList: [],
      receiveRefuseData: {
        keyId: "",
        refuseReason: ""
      },
      sectionOptions: [],
      treatmentList: [],
      rowForGetTreatmentList: {},
      // 订单状态下垃集合
      orderStateOptions: [
        { orderStatusID: "", orderName: "全部" },
        { orderStatusID: 10, orderName: "接诊确认中" },
        { orderStatusID: 12, orderName: "拒绝接诊" },
        { orderStatusID: 11, orderName: "待入院" },
        { orderStatusID: 20, orderName: "未入院" },
        { orderStatusID: 21, orderName: "治疗中" },
        { orderStatusID: 30, orderName: "待财务审核" },
        { orderStatusID: 31, orderName: "财务审核不通过" },
        { orderStatusID: 42, orderName: "付款驳回" },
        { orderStatusID: 40, orderName: "待付款" },
        { orderStatusID: 41, orderName: "付款完成" }
      ],
      // 电话号码正则及提示
      formRules: {
        doctorPhone: [
          {
            trigger: "blur",
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码（11位）"
          }
        ],
        patientPhone: [
          {
            trigger: "blur",
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码（11位）"
          }
        ]
      },
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
      },
      settlementDetailFormRules: {
        timeOriginal: [
          { required: true, message: "此值不可以为空", trigger: "blur" }
        ],
        treatMoneyForShow: [
          { required: true, message: "此值不可以为空", trigger: "blur" }
        ],
        treatPlanImgUrl: [
          { required: true, message: "必须上传图片", trigger: "blur" }
        ]
      },
      needQuery: false,
      saveItems: {},
      // 医院映射项目
      mapping: []
    };
  },
  created () {
    this.initializeDateRegion();
    this.pickerOptionSet();
    this.listAllMapping();
  },
  activated () {
    if (this.needQuery) {
      this.getTableData1stValidate();
    }
  },
  methods: {
    oninput (value) {
      var str = value;
      // 正则替换(正数保留两位小数)
      str = str.replace(/[^\d.]/g, "");
      str = str.replace(/^\./g, "");
      str = str.replace(/\.{2,}/g, ".");
      str = str
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      str = str.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
      return str;
    },
    checkItem (rule, value, callback) {
      let fieldStr = rule.field;
      let fieldArr = fieldStr.split(".");
      let flag = true;
      let tmpObj = {};
      if (fieldArr.length >= 3) {
        tmpObj = this.settlementDetailData[fieldArr[0]][fieldArr[1]];
        if (!tmpObj.treatMoney || !tmpObj.feeItemMappingID) {
          flag = false;
        }
      }
      if (!flag) {
        // callback(new Error("诊疗项目不能为空"));
        this.$refs["saveItems"].clearValidate(
          `items.${fieldArr[1]}.treatMoney`
        );
      } else {
        this.$refs["saveItems"].clearValidate(
          `items.${fieldArr[1]}.feeItemMappingID`
        );
        callback();
      }
    },
    // 获取项目
    listAllMapping () {
      this.$_http
        .get(this.$_API.INTERFACE_TRANSFER_GET_FEEITEMMANAGE_LISTALLMAPPING, {
          params: {
            orgID: this.userInfo.orgID
          }
        })
        .then(response => {
          if (!response.data) return;
          this.mapping = response.data;
          console.log("医院映射项目：", this.mapping);
        });
    },
    pickerOptionSet () {
      this.pickerOptions = {
        disabledDate: time => {
          let nowDate = new Date();
          nowDate.setDate(new Date().getDate() - 1);
          return time.getTime() <= nowDate.getTime();
        }
      };
    },
    initializeDateRegion () {
      let startDate = this.getInstant1st();
      let endDate = new Date();
      this.transferTime = [startDate, endDate];
    },
    // 操作：重置输入框信息
    resetSearchInfoFun () {
      //this.$refs.formOrder.resetFields();
      this.query = {
        doctorPhone: "",
        doctorName: "",
        doctorId: "",
        patientName: "",
        patientPhone: "",
        startTime: "",
        endTime: "",
        orderStatus: ""
      };
      this.initializeDateRegion();
    },
    // 第一步验证表单
    getTableData1stValidate () {
      this.needQuery = true;
      if (this.tableLoading) {
        return;
      }
      if (this.transferTime.length === 2) {
        if (
          !(
            this.transferTime[0].getFullYear() ===
            this.transferTime[1].getFullYear() &&
            this.transferTime[0].getMonth() === this.transferTime[1].getMonth()
          )
        ) {
          this.$alert("查询条件中的起始日期应在同一月份", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
          return;
        }
      }
      if (this.query.doctorPhone && this.query.patientPhone) {
        if (
          /^1[3-9]\d{9}$/.test(this.query.doctorPhone) &&
          /^1[3-9]\d{9}$/.test(this.query.patientPhone)
        ) {
          this.getTableData2ndFormatParameter();
        }
      } else if (this.query.doctorPhone || this.query.patientPhone) {
        if (
          /^1[3-9]\d{9}$/.test(this.query.doctorPhone) ||
          /^1[3-9]\d{9}$/.test(this.query.patientPhone)
        ) {
          this.getTableData2ndFormatParameter();
        }
      } else {
        this.getTableData2ndFormatParameter();
      }
    },
    // 第二步 格式化参数
    getTableData2ndFormatParameter () {
      if (this.query.doctorPhone) {
        this.$_http
          .get(
            this.$_API.INTERFACE_GET_DOCTOR_BY_PHONE +
            "?phone=" +
            this.query.doctorPhone
          )
          .then(res => {
            if (!res.data) {
              this.query.doctorId = "nothingness";
            } else {
              this.query.doctorId = res.data.keyID;
            }
            this.getTableData3ndFormatTimeParameter();
          });
      } else {
        this.getTableData3ndFormatTimeParameter();
      }
    },
    // 第三步 格式化参数
    getTableData3ndFormatTimeParameter () {
      // 转诊时间（开始、结束）
      if (this.transferTime.length > 0) {
        this.transferTimeConversion = [];
        this.transferTime.forEach(item => {
          item = formatDate(item);
          this.transferTimeConversion.push(item);
        });
        this.query.startTime = this.transferTimeConversion[0];
        this.query.endTime = this.transferTimeConversion[1];
      } else {
        this.query.startTime = this.dataFunction().beginDate;
        this.query.endTime = this.dataFunction().endDate;
      }
      this.getTableData4rdFinal();
    },

    // 第四步 查询数据
    getTableData4rdFinal () {
      let params = { ...this.query, ...this.pageInfo };
      this.$_http
        .get(this.$_API.INTERFACE_HOSPITAL_GET_ORDERS_BY_PAGE, { params })
        .then(response => {
          if (!response.data) return;
          let oldData = response.data.datas;
          this.pageInfo = response.data.pageInfo;
          let ids = [];
          oldData.forEach(row => {
            ids.push(row.sourceId);
          });
          if (ids.length === 0) {
            this.transferOrderData = oldData;
          } else {
            this.$_http
              .post(this.$_API.INTERFACE_GET_DOCTOR_PHONE_LIST_BY_IDLIST, ids)
              .then(response => {
                if (!response.data) return;
                let phones = response.data;
                oldData.forEach((item, index) => {
                  phones.forEach(p => {
                    if (item.sourceId === p.keyID) {
                      oldData[index].doctorPhone = p.phone;
                    }
                  });
                });
                this.transferOrderData = oldData;
              });
          }
        });
    },
    // 查看详情的方法
    toDetail (row) {
      if (!row || !row.keyId) {
        this.dataError();
        return;
      }
      this.$router.push({
        name: "OrderDetail",
        params: { orderID: row.keyId }
      });
    },
    // 弹出同意接诊对话框
    receiveBegin (row) {
      this.receiveBodyTitle = "同意接诊";
      let temp = JSON.parse(JSON.stringify(row));
      temp.receiveCondition = temp.patientCondition;
      this.receiveData = temp;
      this.commonFor3Function(temp);
    },
    // 弹出患者流转对话框
    patientTransferBegin (row) {
      this.receiveBodyTitle = "患者流转";
      this.commonFor3Function(row);
    },
    // 确认入院
    beHospitalizedBegin (row) {
      this.receiveBodyTitle = "确认入院";
      this.commonFor3Function(row);
      this.$_http
        .get(this.$_API.INTERFACE_ORDER_DETAIL, {
          params: {
            keyId: row.keyId
          }
        })
        .then(res => {
          if (!res.data) return;
          let receiveDataTemp = res.data;
          receiveDataTemp.appointTimeOriginal = new Date(res.data.appointTime);
          console.log(receiveDataTemp);
          this.receiveData = receiveDataTemp;
        });
    },
    // 同意接诊,患者流转,确认入院三个方法的共同部分
    commonFor3Function (row) {
      this.receiveBodyVisible = true;
      this.oneRow = row;
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
            pageSize: 100000,
            pageIndex: 1
          }
        })
        .then(response => {
          if (!response.data) return;
          this.receiveDataDoctors = response.data.datas;
        });
    },
    receiveBodyEnsureCommon1st () {
      this.$refs.receiveForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.receiveBodyEnsureCommon2nd();
      });
    },
    // 同意接诊,患者流转,确认入院三个方法的确认按钮的共同方法
    receiveBodyEnsureCommon2nd () {
      this.receiveBodyVisible = false;
      // 组装参数
      this.receiveData.keyId = this.oneRow.keyId;
      if (!this.receiveData.hospitalDoctorId) {
        this.receiveDataDoctors.forEach(doctor => {
          if (doctor.doctorName === this.receiveData.hospitalDoctorName) {
            this.receiveData.hospitalDoctorId = doctor.keyID;
          }
        });
      }
      this.receiveData.appointTime = formatDateTime(
        this.receiveData.appointTimeOriginal
      );
      if (this.receiveData.inquiryModeId === 1) {
        this.receiveData.inquiryModeName = "门诊";
      } else {
        this.receiveData.inquiryModeName = "住院";
      }
      this.sectionOptions.forEach(section => {
        if (this.receiveData.hospitalSectionId === section.keyID) {
          this.receiveData.hospitalSectionName = section.hospitalSectionName;
        }
      });
      let parameter = JSON.parse(JSON.stringify(this.receiveData));
      delete parameter.appointTimeOriginal;
      this.$refs.receiveForm.resetFields();
      // 根据情况执行请求
      if (this.receiveBodyTitle === "同意接诊") {
        this.receiveEnsure(parameter);
      } else if (this.receiveBodyTitle === "患者流转") {
        this.patientTransferEnsure(parameter);
      } else if (this.receiveBodyTitle === "确认入院") {
        this.beHospitalizedEnsure(parameter);
      }
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
    // 同意接诊确认
    receiveEnsure (parameter) {
      this.$_http
        .post(this.$_API.INTERFACE_AGREE_RECEIVE, parameter)
        .then(response => {
          this.getTableData1stValidate();
          this.dataReset();
        });
    },
    // 患者流转确认
    patientTransferEnsure (parameter) {
      parameter.orderId = parameter.keyId;
      delete parameter.keyId;
      this.$_http
        .post(this.$_API.INTERFACE_ADD_TREATMENT, parameter)
        .then(response => {
          this.getTableData1stValidate();
          this.dataReset();
        });
    },
    // 确认入院确认
    beHospitalizedEnsure (parameter) {
      this.receiveRefuseVisible = false;
      this.$_http.post(this.$_API.INTERFACE_CONFIRM_IN, parameter).then(res => {
        this.getTableData1stValidate();
        this.dataReset();
      });
    },
    // 拒绝接诊弹出对话框
    receiveRefuseBegin (row) {
      this.receiveRefuseVisible = true;
      this.receiveRefuseData.keyId = row.keyId;
    },
    // 拒绝接诊确定
    receiveRefuseEnsure () {
      if (this.receiveRefuseData.refuseReason) {
        this.receiveRefuseVisible = false;
        this.$_http
          .post(this.$_API.INTERFACE_REFUSE_RECEIVE, this.receiveRefuseData)
          .finally(() => {
            this.dataReset();
            this.getTableData1stValidate();
          });
      } else {
        this.$alert("拒绝接诊理由不能为空", "提示", {
          confirmButtonText: "确定",
          callback: action => { }
        });
        this.receiveRefuseVisible = true;
      }
    },
    beUnhospitalized (row) {
      this.$confirm("请确认已与患者取得联系，患者不入院？", "确认未入院", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$_http
            .post(this.$_API.INTERFACE_CONFIRM_NOT_IN, {
              keyId: row.keyId
            })
            .then(res => {
              this.getTableData1stValidate();
              this.$message({
                type: "success",
                message: "已确定未入院!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    // 填写结算信息
    settlementBegin (row) {
      this.rowForGetTreatmentList = row;
      this.$_http
        .get(this.$_API.INTERFACE_TREATMENT_LIST, {
          params: {
            orderId: row.keyId
          }
        })
        .then(response => {
          if (!response.data) return;
          let treatmentList = response.data;
          console.log("---------", treatmentList);
          if (treatmentList.length > 1) {
            this.treatmentList = treatmentList;
            this.settlementBodyVisible = true;
            this.reOpen = true;
          } else {
            this.openSettlementDetail(treatmentList[0].keyId);
            this.reOpen = false;
          }
        });
    },
    openSettlementDetail (id, hasSettle) {
      this.data.belongID = id;
      this.settlementDetailBodyVisible = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_TRANSFER_TREATMENT, {
          params: {
            keyId: id
          }
        })
        .then(response => {
          if (!response.data) return;
          let data = response.data;
          if (hasSettle === 0) {
            this.settlementDetailBodyTitle = "填写结算信息";
          } else {
            this.settlementDetailBodyTitle = "修改结算信息";
          }
          if (data.outTime !== "1900-01-01") {
            data.timeOriginal = new Date(data.outTime);
          } else {
            data.timeOriginal = "";
          }
          this.settlementDetailData = JSON.parse(JSON.stringify(data));
          // 转诊分润修改
          this.settlementDetailData.items = data.items;
          this.totalMoney = 0;
          this.settlementDetailData.items.forEach(element => {
            element.treatMoney = element.treatMoney / 100;
            this.totalMoney += parseFloat(element.treatMoney);
          });

          if (this.settlementDetailData.items.length === 0) {
            this.settlementDetailData.items.push({
              keyID: "",
              treatMoney: "",
              feeItemMappingID: "",
              projectNo: "",
              projectName: "",
              standProjectCode: "",
              treatmentID: ""
            });
          }
        });
    },
    receiveBodyCancel () {
      this.receiveBodyVisible = false;
      this.dataReset();
      this.$refs.receiveForm.resetFields();
    },
    receiveRefuseCancel () {
      this.receiveRefuseVisible = false;
      this.dataReset();
    },
    // 提醒：表格数据错误时的处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.getTableData1stValidate();
    },
    // 获取默认日期的方法
    dataFunction () {
      let date = this.getInstant1st();
      let beginDate = formatDate(date);
      let endDate = formatDate(new Date());
      let dataRegion = {};
      dataRegion.beginDate = beginDate;
      dataRegion.endDate = endDate;
      return dataRegion;
    },
    getInstant1st () {
      let date = new Date();
      date.setDate(1);
      date.setHours(0);
      date.setSeconds(0);
      date.setMinutes(0);
      return date;
    },
    getDoctorList () {
      // let sectionID = this.receiveData.hospitalSectionId;
      // let orgId = this.userInfo.orgID;
    },

    // 操作：查看上传的大图
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 操作：删除所选的图片
    handleRemove (file, fileList) { },

    // 操作：上传图片
    uploadSuccess (variableCode, variableName) {
      return res => {
        if (!res.data) return;
        let id = variableName + "Id";
        let url = variableName + "Url";
        this.settlementDetailData[id] = res.data.keyID;
        this.settlementDetailData[url] = res.data.remoteAddress;
        let keyId = this.settlementDetailData.keyId;
        let parameter = {
          keyId: keyId,
          variableCode: variableCode,
          imageId: res.data.keyID,
          imageUrl: res.data.remoteAddress
        };
        this.$_http.post(this.$_API.INTERFACE_SAVE_IMAGE, parameter);
      };
    },
    // 操作：查看已有的大图
    handlePictureCardPre (url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 操作：删除已有图片
    handlePictureDelete (variableCode, variableName) {
      let keyId = this.settlementDetailData.keyId;
      let parameter = {
        keyId: keyId,
        variableCode: variableCode,
        imageId: "",
        imageUrl: ""
      };
      let id = variableName + "Id";
      let url = variableName + "Url";
      this.$_http
        .post(this.$_API.INTERFACE_DELETE_IMAGE, parameter)
        .then(res => {
          this.settlementDetailData[id] = null;
          this.settlementDetailData[url] = null;
        });
    },
    settlementDetailBodyEnsure1st (formName) {
      if (!this.settlementDetailData.items[0].feeItemMappingID) {
        this.$alert("诊疗项目不能为空", "提示", {
          confirmButtonText: "确定",
          callback: action => { }
        });
        return;
      }
      if (!this.settlementDetailData.items[0].treatMoney) {
        this.$alert("诊疗费用不能为空", "提示", {
          confirmButtonText: "确定",
          callback: action => { }
        });
        return;
      }
      // 治疗项目验证
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return;
        }
        this.$refs.settlementDetailForm.validate(valid => {
          if (!valid) {
            return;
          }
          if (!this.settlementDetailData.treatPlanImgUrl) {
            this.$alert("尚未上传治疗方案的图片", "提示", {
              confirmButtonText: "确定",
              callback: action => { }
            });
            return;
          }
          if (!this.settlementDetailData.treatPlanDesc) {
            this.$alert("尚未上传治疗方案", "提示", {
              confirmButtonText: "确定",
              callback: action => { }
            });
            return;
          }
          this.settlementDetailBodyEnsure2st();
        });
      });
    },
    // 确认保存结算信息的方法
    settlementDetailBodyEnsure2st () {
      let date = formatDate(this.settlementDetailData.timeOriginal);
      this.settlementDetailData.outTime = date;
      let paramter = JSON.parse(JSON.stringify(this.settlementDetailData));
      console.log("项目参数：", this.mapping);
      delete paramter.timeOriginal;
      // 构建项目参数
      paramter.items.forEach(it => {
        this.mapping.forEach(ic => {
          if (ic.keyID === it.feeItemMappingID) {
            it.treatmentID = this.settlementDetailData.keyId;
            it.projectName = ic.projectName;
            it.projectNo = ic.projectNo;
            it.standProjectCode = ic.standProjectCode;
            it.projectName = ic.projectName;
            it.treatMoney = parseInt(it.treatMoney * 100);
          }
        });
      });
      paramter.hospitalId = this.userInfo.orgID;
      // paramter.treatMoney = paramter.treatMoneyForShow * 100;
      console.log("选去参数：", paramter.items);
      this.$_http.post(this.$_API.INTERFACE_SAVE_SETTLE, paramter).then(res => {
        this.dataReset();
        this.$refs.settlementDetailForm.resetFields();

        this.settlementDetailBodyVisible = false;
        if (this.reOpen) {
          this.settlementBegin(this.rowForGetTreatmentList);
        }
      });
    },
    settlementDetailBodyCancel () {
      this.settlementDetailBodyVisible = false;
      this.$refs.settlementDetailForm.resetFields();
      this.dataReset();
    },
    settleAccountsWhenLeaveHospitalBegin (row) {
      this.$_http
        .get(this.$_API.INTERFACE_INSPECT_FOR_LEAVE_HOSPITAL, {
          params: {
            keyId: row.keyId
          }
        })
        .then(response => {
          if (!response.data) return;
          let answer = response.data.answer;
          if (answer === 1) {
            this.$confirm("请确认发起结算？", "", {
              distinguishCancelAndClose: true,
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.$_http
                  .post(this.$_API.INTERFACE_SETTLE_APPLY, {
                    keyId: row.keyId
                  })
                  .then(response => {
                    this.dataReset();
                    this.getTableData1stValidate();
                    this.$message({
                      type: "info",
                      message: "已经发起结算"
                    });
                  });
              })
              .catch();
          } else {
            this.$confirm("患者的结算信息未完善，请完善。", "提示", {
              confirmButtonText: "去完善",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.settlementBegin(row);
              })
              .catch();
          }
        });
    },

    dataReset () {
      this.receiveData = {
        keyId: "",
        appointTime: "",
        appointTimeOriginal: "",
        hospitalDoctorId: "",
        hospitalDoctorName: "",
        hospitalSectionId: "",
        hospitalSectionName: "",
        inquiryModeId: "",
        inquiryModeName: "",
        receiveCondition: ""
      };
      this.settlementDetailData = {
        timeOriginal: "",
        keyId: "",
        outTime: "",
        hospitalId: "",
        treatPlanImgId: "",
        treatPlanImgUrl: "",
        treatPlanDesc: "",
        checkReportImgId: "",
        checkReportImgUrl: "",
        checkReportDesc: "",
        inquiryResultImgId: "",
        inquiryResultImgUrl: "",
        inquiryResultDesc: "",
        chargeImgID: "",
        chargeImgUrl: "",
        chargeDesc: ""
      };
      this.receiveRefuseData = {
        keyId: "",
        refuseReason: ""
      };
    },
    // 添加
    addItem (id) {
      this.settlementDetailData.items.push({
        keyID: "",
        treatMoney: "",
        feeItemMappingID: "",
        projectNo: "",
        projectName: "",
        standProjectCode: "",
        treatmentID: ""
      });
    },
    // 删除项目
    deleteItem (item) {
      // this.settlementDetailData.items.push(item);
      var index = this.settlementDetailData.items.indexOf(item);
      if (index !== -1) {
        this.settlementDetailData.items.splice(index, 1);
      }
      this.totalMoney = 0;
      this.settlementDetailData.items.forEach(element => {
        if (element.treatMoney) {
          this.totalMoney += parseFloat(element.treatMoney);
        }
      });
    },
    treatMoneyChange (val) {
      this.totalMoney = 0;
      this.settlementDetailData.items.forEach(element => {
        if (element.treatMoney) {
          this.totalMoney += parseFloat(element.treatMoney);
        }
      });
    }
  }
};
</script>

<style lang="scss">
#TransferOrders {
  .uploadLabel {
    display: inline;
  }

  .isHover {
    position: relative;
  }
  .peach-image {
    width: 96px;
    height: 96px;
  }
  .meng {
    width: 96px;
    height: 96px;
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
  }

  .iconScale,
  .iconDelete {
    cursor: pointer;
  }

  .el-upload-list--picture-card .el-upload-list__item {
    margin: 0 8px 0 0;
  }
  .el-textarea el-input--medium {
    height: 96px;
  }
  .el-textarea__inner {
    height: 96px;
  }

  .el-upload-dragger {
    width: 94px;
    height: 94px;
    overflow: visible;
  }
  .el-upload--picture-card {
    width: 96px;
    height: 96px;
  }
  .el-upload-dragger .el-icon-upload {
    margin: 5px 0 0 0px;
  }

  .el-upload-dragger .el-upload__text {
    font-size: 12px;
    margin: 0 0 0 5px;
  }
  .upload-box {
    height: 100px;
    min-width: 100px;
  }
}
.custome-input {
  display: inline-block;
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
</style>
