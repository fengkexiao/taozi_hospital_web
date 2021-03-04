<template>
  <el-dialog title="" :visible.sync="dialogVisible" width="95%" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="drag-area">
    <ul class="dialog-title" v-if="chatList.length>0" >
      <li v-for="(item,index) of chatList" :key="index" :class="[item.check?'li-border-active':'']" @click="handleItem(item,index)">
        <div class="li-border" :class="[item.isNewMsg?'headerBox':'']"></div>
        <span>与{{item.patientName}}问诊</span>
      </li>
    </ul>
    <div style="clear:both;"></div>
    <div  v-loading="loading">
      <el-row>
        <el-col :span="8" v-if="dataInfo.inquiryType!==0">
          <div>
            <chat :userSig="userSig" :to="to" :cus_tim="cus_tim" :conversationID="to" :nameStr="dataInfo.patientName"></chat>
          </div>
        </el-col>
        <el-col :span="dataInfo.inquiryType!==0?16:24" :class="[dataInfo.inquiryType!==0?'border-left':'']" style="padding-left:15px;">
          <el-row class="mb15 ">
            <el-col :span="24" style="text-align:center;">
              <label style="font-size:18px;">开处方</label>
              <template v-if="ageIdentification>0">
                <img src="./../../assets/image/1.png" class="indeimg" v-if="ageIdentification===1">
                <img src="./../../assets/image/2.png" class="indeimg" v-if="ageIdentification===2">
                <img src="./../../assets/image/3.png" class="indeimg" v-if="ageIdentification===3">
              </template>
              <template v-if="statusIdentification>0">
                <img src="./../../assets/image/4.png" class="indeimg" style="right:90px;" v-if="statusIdentification===4">
                <img src="./../../assets/image/5.png" class="indeimg" style="right:90px;" v-if="statusIdentification===5">
                <img src="./../../assets/image/6.png" class="indeimg" style="right:90px;" v-if="statusIdentification===6">
              </template>
            </el-col>
          </el-row>
          <!-- s -->
          <div type="flex" justify="space-between" style="padding-left: 5px;">
            <!-- 患者信息 -->
            <el-row class="mb15 ">
              <el-col :span="12">
                <label class="detail-title">问诊人资料</label>
              </el-col>
              <el-col :span="12" class="text-right">
                <i class="el-icon-edit cursor-pointer edit-color" @click="handleEditBase(0)" v-show="!editBase">编辑</i>
                <!-- <i class="cursor-pointer edit-color" @click="handleEditBase(1)" v-show="editBase">取消</i> -->
              </el-col>
            </el-row>
            <!-- 预览 -->
            <div v-show="!editBase">
              <el-row class="mb15">
                <el-col :span="4">
                  <span>姓名：</span><span>{{dataInfo.patientName}}</span>
                </el-col>
                <el-col :span="4">
                  <span>电话：</span><span>{{dataInfo.patientPhone | formatMobileHidden}}</span>
                </el-col>
                <el-col :span="4">
                  <span>性别：</span>
                  <span v-if="dataInfo.patientSex===1">男</span>
                  <span v-if="dataInfo.patientSex===2">女</span>
                </el-col>
                <el-col :span="4">
                  <span>年龄：</span><span>{{dataInfo.patientAge}}岁</span>
                  <span v-if="dataInfo.patientAge<=14&&dataInfo.patientWeight!=0">（{{formateWight(dataInfo.patientWeight)}}kg）</span>
                </el-col>
                <el-col :span="5" v-if="dataInfo.patientSex!==1">
                  <span>备孕、妊娠、哺乳：</span><span>{{dataInfo.pregnancy}}</span>
                </el-col>
              </el-row>
              <el-row class="mb15">
                <el-col :span="4">
                  <span>肝功能：</span><span :class="[dataInfo.liver==='异常'?'font-red':'']">{{dataInfo.liver}}</span>
                </el-col>
                <el-col :span="4">
                  <span>肾功能：</span><span :class="[dataInfo.renal==='异常'?'font-red':'']">{{dataInfo.renal}}</span>
                </el-col>
                <el-col :span="4" style="display:flex;">
                  <span>过敏史：</span><span style="flex:1">{{dataInfo.historyOfAllergy==='有'?dataInfo.allergyDetail:dataInfo.historyOfAllergy}}</span>
                </el-col>
                <el-col :span="4" style="display:flex;">
                  <span>既往史：</span><span style="flex:1">{{dataInfo.historyOfSickness==='有'?dataInfo.sicknessDetail:dataInfo.historyOfSickness}}</span>
                </el-col>
              </el-row>
            </div>
            <!-- 可编辑 -->
            <div v-show="editBase">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="姓名">
                  <el-input placeholder="姓名" v-model="dataInfo.patientName" disabled></el-input>
                </el-form-item>
                <el-form-item label="电话">
                  <el-input placeholder="电话" v-model.number="dataInfo.patientPhone" disabled></el-input>
                </el-form-item>
                <el-form-item label="性别">
                  <el-select v-model="dataInfo.patientSex" disabled>
                    <el-option label="男" :value="1"></el-option>
                    <el-option label="女" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="年龄">
                  <el-input placeholder="年龄" v-model.number="dataInfo.patientAge" disabled></el-input>
                </el-form-item>
                <el-form-item label="备孕、妊娠、哺乳" class="diplay-block" v-if="dataInfo.patientSex!==1">
                  <el-radio-group v-model="dataInfo.pregnancy">
                    <el-radio label="备孕">备孕</el-radio>
                    <el-radio label="妊娠">妊娠</el-radio>
                    <el-radio label="哺乳">哺乳</el-radio>
                    <el-radio label="否">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="肝功能" class="diplay-block">
                  <el-radio-group v-model="dataInfo.liver">
                    <el-radio label="正常">正常</el-radio>
                    <el-radio label="异常">异常</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="肾功能" class="diplay-block">
                  <el-radio-group v-model="dataInfo.renal">
                    <el-radio label="正常">正常</el-radio>
                    <el-radio label="异常">异常</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="过敏史" class="diplay-block">
                  <el-radio-group v-model="dataInfo.historyOfAllergy" @change="handleChangeRadio(1)">
                    <el-radio label="有">有</el-radio>
                    <el-radio label="无">无</el-radio>
                  </el-radio-group>
                </el-form-item>
                <div v-show="(dataInfo.historyOfAllergy==='有' && dataInfo.historyOfAllergy)">
                  <el-form-item class="diplay-block" style="margin-left:55px;">
                    <span v-for="(item,index) of allergylist" :key="index" :class="[item.check?'tag-check':'tag-defult']" class="mr15  cursor-pointer" @click="handelTag(item,index,1)">
                      {{item.dictName}}
                    </span>
                    <span class=" tag-defult cursor-pointer" @click="handelEditTag(1)">
                      <i class="el-icon-plus"></i>
                    </span>
                  </el-form-item>
                </div>
                <el-form-item label="既往史" class="diplay-block">
                  <el-radio-group v-model="dataInfo.historyOfSickness" @change="handleChangeRadio(0)">
                    <el-radio label="有">有</el-radio>
                    <el-radio label="无">无</el-radio>
                  </el-radio-group>
                </el-form-item>
                <div v-show="(dataInfo.historyOfSickness==='有' && dataInfo.historyOfSickness)">
                  <el-form-item class="diplay-block" style="margin-left:55px;">
                    <span v-for="(item,index) of illnessList" :key="index" :class="[item.check?'tag-check':'tag-defult']" class="mr15  cursor-pointer" @click="handelTag(item,index,0)">
                      {{item.dictName}}
                    </span>
                    <span class=" tag-defult cursor-pointer" @click="handelEditTag(0)">
                      <i class="el-icon-plus"></i>
                    </span>
                  </el-form-item>
                </div>
              </el-form>
              <el-row class="mb15 mt20 " type="flex" justify="center">
                <el-col :span="24" style="text-align:center;">
                  <el-button @click="handleEditBase(1)">取消</el-button>
                  <el-button type="primary" @click="handleSaveBase">保存</el-button>
                </el-col>
              </el-row>
            </div>

            <!-- 疾病信息 -->
            <el-row class="mb15 mt20 ">
              <el-col :span="12">
                <label class="detail-title">疾病信息</label>
              </el-col>
              <el-col :span="12" class="text-right">
                <i class="el-icon-edit cursor-pointer edit-color" @click="handleEditDetail(0)" v-show="!editDetail">编辑</i>
                <!-- <i class="cursor-pointer edit-color" @click="handleEditDetail(1)" v-show="editDetail">取消</i> -->
              </el-col>
            </el-row>
            <!-- 预览 -->
            <div v-show="!editDetail">
              <el-row class="mb15">
                <el-col :span="24">
                  <span>主诉：</span><span>{{dataInfo.illDesc}}</span>
                </el-col>
              </el-row>
              <el-row class="mb15">
                <el-col :span="24">
                  <span>主诊断：</span><span>{{dataInfo.primaryDiagnosis}}</span>
                </el-col>
              </el-row>
              <el-row class="mb15">
                <span>有效凭证：</span>
                <base-image-view :url="dataInfo.certificateUrl" v-if="dataInfo.certificateUrl" style="display: inline-block;"></base-image-view>
                <span v-else>未上传图片</span>
              </el-row>
            </div>
            <!-- 可编辑 -->
            <div v-show="editDetail">
              <el-row class="mb15">
                <el-col :span="24">
                  <span>主诉：</span>
                  <el-input type="text" v-model="dataInfo.illDesc" maxlength="200"></el-input>
                </el-col>
              </el-row>
              <el-row class="mb15 ">
                <el-col :span="24" class="sickness">
                  <span>主诊断：</span>
                  <el-popover placement="bottom" width="230" trigger="click" v-model="popoverVisible">
                    <!-- <el-table :data="chineseMedicine" height="250" :show-header="false" style="width:200px;display:inline-block" @row-click="handleRowClicck" v-loading="searchLoading" element-loading-text="正在加载中" element-loading-spinner="el-icon-loading">
                      <el-table-column width="200" property="sicknessName">
                        <template slot-scope="scope">
                          <span>{{ scope.row }}</span>
                        </template>
                      </el-table-column>
                    </el-table> -->
                    <el-table :data="westernMedicine" height="250" :show-header="false" style="width:200px;display:inline-block" @row-click="handleRowClicck" v-loading="searchLoading" element-loading-text="正在加载中" element-loading-spinner="el-icon-loading">
                      <el-table-column width="200">
                        <template slot-scope="scope">
                          <span>{{ scope.row }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-input slot="reference" class="sickness" type="text" v-model.trim="dataInfo.primaryDiagnosis" @input="handleAuto" maxlength="500"></el-input>
                  </el-popover>
                </el-col>
              </el-row>
              <el-row class="mb15">
                <span>有效凭证：</span>
                <base-image-view :url="dataInfo.certificateUrl" v-if="dataInfo.certificateUrl" style="display: inline-block;"></base-image-view>
                <span v-else>未上传图片</span>
              </el-row>
              <el-row class="mb15 mt20 " type="flex" justify="center">
                <el-col :span="24" style="text-align:center;">
                  <el-button @click="handleEditDetail(1)">取消</el-button>
                  <el-button type="primary" @click="handelSavePr">保存</el-button>
                </el-col>
              </el-row>
            </div>

            <!-- 药品信息 -->
            <el-row class="mb15 mt20 ">
              <el-col :span="12">
                <label>药品信息</label><span v-if="isEditNum" style="font-size:12px;">（注意：药品数量调整时，仅可减少，不可高于原有量）</span>
              </el-col>
              <el-col :span="12" class="text-right">
                <i class="el-icon-edit cursor-pointer edit-color" @click="handleEditTable(0)" v-show="!editTable">编辑</i>
                <!-- <i class="cursor-pointer edit-color" @click="handleEditTable(1)" v-show="editTable">取消</i> -->
              </el-col>
            </el-row>
            <!-- 表格 -->
            <div  style="position: relative">
<!--              :name="scope.row.medicineName"-->
              <drug-description
                       :medicineName="medicineName"
                       v-if="drugVisible"
                       @closeDrugDescription="closeDrugDescription">
              </drug-description>
            <el-table :data="dataInfo.medicines" style="width: 100%" ref="tableDataRef" stripe>
              <el-table-column type="index" label="#" align="center"></el-table-column>
              <el-table-column prop="medicineName" label="药品名称" align="center" min-width="100">
                <template slot-scope="scope">
                  <span class="td-medicineName" style="cursor: pointer;color:#409EFF" @click="showDrug(scope.row)">{{scope.row.medicineName}}</span>
                  <span @click="handleShowTemplate(scope)" class="medicine-record" v-if="scope.row.total>1">{{scope.row.total}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="specification" label="规格" align="center" min-width="100"></el-table-column>
              <el-table-column prop="takeDose" label="每次剂量" align="center" min-width="200">
                <template slot-scope="scope">
                  <div v-if="editTable">
                    <el-input type="text" style="width:70px;" v-model="scope.row.takeDose" maxlength="5" @keyup.native="setDays($event,scope)"></el-input>
                    <el-select style="width:70px;margin-left:5px;" v-model="scope.row.formType" filterable clearable placeholder=" " @change="setDays($event,scope)">
                      <el-option v-for="(item,index) in takeDoseList" :key="index" :label="item.dictName" :value="item.dictName"></el-option>
                    </el-select>
                  </div>
                  <div v-else>
                    {{scope.row.takeDose}}{{scope.row.formType}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="takeFrequence" label="频次" align="center" min-width="140">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.takeFrequence" filterable clearable v-if="editTable" @change="setDays($event,scope)">
                    <el-option v-for="(item,index) in takeFrequenceList" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                  </el-select>
                  <span v-else>
                    {{formatVal("takeFrequenceList",scope.row.takeFrequence)}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="medicationDays" label="天数" align="center">
                <template slot-scope="scope">
                  <el-input type="text" v-model="scope.row.medicationDays" v-if="editTable" @keyup.native="validateNumber(scope.row.medicationDays,scope)" maxlength="10"></el-input>
                  <span v-else>
                    {{scope.row.medicationDays}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="takeDirection" label="用法" align="center" min-width="200">
                <template slot-scope="scope">
                  <el-autocomplete class="inline-input" v-model="scope.row.takeDirection" v-if="editTable" :fetch-suggestions="querySearch" placeholder="请输入用法" @select="handleSelect" :maxlength="45"></el-autocomplete>
                  <span v-else>
                    {{scope.row.takeDirection}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="medicineAmount" label="总量" align="center" :min-width="isEditNum?155:50">
                <template slot-scope="scope">
                  <el-input-number v-if="isEditNum && editTable" size="mini" v-model="scope.row.medicineAmount" :min="1" :max="scope.row.maxAmount" label="总量" maxlength="10" @change="setDays($event,scope)"></el-input-number>
                  <span v-else>
                    {{scope.row.medicineAmount}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="unit" label="单位" align="center">
                <template slot-scope="scope">
                  <el-input type="text" v-model="scope.row.unit" v-if="editTable" maxlength="10" @keyup.native="setDays($event,scope)"></el-input>
                  <span v-else>
                    {{scope.row.unit}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" v-if="editTable && isEditNum">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click.native.prevent="handleDeleteRow(scope.$index, dataInfo.medicines)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            </div>
            <!-- 治疗建议 -->
            <el-row class="mt15 title-border">
              <el-col :span="24">
                <span>治疗建议：</span>
                <el-input type="textarea" v-model="dataInfo.enjoin" clearable v-if="editTable" maxlength="100"></el-input>
                <span v-else>{{dataInfo.enjoin}}</span>
              </el-col>
            </el-row>
            <el-row class="mb15 mt20 " type="flex" justify="center" v-if="editTable">
              <el-col :span="24" style="text-align:center;">
                <el-button @click="handleEditTable(1)">取消</el-button>
                <el-button type="primary" @click="handleSaveTable">保存</el-button>
              </el-col>
            </el-row>
            <!-- 拒绝建议 -->
            <el-row class="mt15" v-if="dataInfo.notPassReason">
              <el-col :span="24">
                <span>退方原因：</span><span>{{dataInfo.notPassReason}}</span>
              </el-col>
            </el-row>
            <el-row class="mt15" v-if="dataInfo.notPassReason">
              <el-col :span="24">
                <span>退方药师：</span><span>{{dataInfo.pharmacistName}}</span>
              </el-col>
            </el-row>
            <!-- 按钮 -->
            <el-row type="flex" justify="center" class="mt15" v-show="!editTable && !editDetail && !editBase">
              <el-button @click="handleClose" type="info"  plain style="margin-right:10px;">返回</el-button>
              <el-popover placement="top" width="802" v-model="visible" title="">
                <!-- <el-input placeholder="请输入拒绝理由" class="refuse-input" v-model="textarea" maxlength="200">
                </el-input>
                <i class="el-icon-close close-cancel" @click="visible=false"></i>
                <div class="mt15 text-center">
                  <el-button type="primary" size="mini" @click="handleCancel">确定</el-button>
                </div> -->
                <reason-rejection @close="visible=false" :visible="visible" @change="handleResonChange"></reason-rejection>
                <el-button slot="reference" class="mr10" type="primary" plain>拒绝</el-button>
              </el-popover>
              <el-button type="primary" @click="handleReview">开处方</el-button>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>

    <edit-tag :dialogVisible.sync="illnessVisible" :currentTag.sync="illnessList"></edit-tag>
    <edit-tag :dialogVisible.sync="allergyVisible" :currentTag.sync="allergylist"></edit-tag>

    <el-dialog title="" :visible.sync="medicineDialogVisible" custom-class='dialog-custom' width="30%" append-to-body :before-close="handleMedicineClose">
      <el-table ref="multipleTable" :data="medicineData" header-cell-class-name="table-cell_cus" :header-cell-style="headerCellStyle" tooltip-effect="dark" style="width: 100%" @select="handleSelectRow" @selection-change="handleSelectionChange" @row-click="handleRowClick">
        <!-- <el-table-column type="selection" label="选择" class-name="column-cus">
        </el-table-column> -->
        <el-table-column width="50">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="radio" :label="scope.row.keyID">&nbsp;
            </el-radio>
          </template>
        </el-table-column>

        <el-table-column prop="address" label="每次剂量" align="center">
          <template slot-scope="scope">
            {{scope.row.takeDose}}{{scope.row.formType}}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="频次" align="center">
          <template slot-scope="scope">
            {{scope.row.takeFrequence}}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="用法">
          <template slot-scope="scope">
            {{scope.row.takeDirection}}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="medicineDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleClickTemp">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>

</template>

<script>
import SingleChat from "./../components/class/SingleChat.js";
import { mapGetters } from "vuex";
import BaseImageView from "@/components/global/base/BaseImageView";
import EditTag from "./components/EditTag";
import Chat from "./../components/singleChat/chat.vue";
import ReasonRejection from "./components/reasonRejection";
import DrugDescription from "./components/DrugDescription";
import { setSesssion, getSession, autoCalcDays} from "./../../utils/tools";
export default {
  name: "patientDetails",
  components: {
    BaseImageView,
    EditTag,
    Chat,
    ReasonRejection,
    DrugDescription
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ""
    },
    userSig: {
      type: String,
      default: ""
    },
    chatList: {
      type: Array
    },
    currentChat: {
      type: Object
    },
    orderStatus: {
      type: Number,
      default: 0
    },
    rpID: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      radio: 0,
      currentRow: {},
      selected: {},
      medicineData: [],
      medicineDialogVisible: false,
      ageIdentification: 0,
      statusIdentification: 0,
      loading: false,
      timer: {},
      restaurants: [],
      conversationID: "",
      cus_tim: {},
      to: "",
      visible: false,
      textarea: "",
      dataList: [],
      editBase: false,
      editDetail: false,
      editTable: false,
      dataInfo: {},
      dataInfoBak: {},
      patientInfo: {},
      allergylist: [], // 过敏史
      illnessList: [], // 既往史
      illnessListBak: [],
      allergylistBak: [],
      allergyVisible: false,
      illnessVisible: false,
      takeFrequenceList: [], // 凭次
      takeDirectionList: [], // 用法
      takeDoseList: [],
      routeList: [],
      dataArrList: [],
      rpData: {},
      chineseMedicine: [],
      westernMedicine: [],
      popoverVisible: false,
      drugVisible:false,
      inputCk: false,
      searchLoading: false,
      checkSubmit: false,
      tableIndex: 0,
      isEditNum: true, // 是否可以编辑数量
      count: 0,
      cacheMain:"",
      medicineName: ""
    };
  },
  async created () {
    window.addEventListener("timOnReceiveMessage", this.timOnReceiveMessage);
    // localStorage.setItem('specification','20mgx1片/盒')
  },
  watch: {
    "orderId": {
      handler (val) {
        this.isEditNum = false;
        this.ageIdentification = 0;
        this.statusIdentification = 0;
      }
    },
    "dialogVisible": {
      handler (val) {
        if (val) {
          this.count = 0;
          this.radio = 0;
          this.dataInfo = {};
          this.editDetail = false;
          this.editBase = false;
          this.editTable = false;
          this.getInit();
          this.editBase = false;
          this.editDetail = false;
          this.editTable = false;
          this.chatList.map(item => {
            if (item.orderID === this.orderId) {
              this.$set(item, "check", true);
            } else {
              this.$set(item, "check", false);
            }
          });
        } else {
          this.dataInfo = {};
        }
      }
    },
    "chatList": {
      handler (val) {
        val.map(item => {
          if (item.orderID === this.orderId) {
            this.$set(item, "check", true);
          } else {
            this.$set(item, "check", false);
          }
        });
      }
    },
    "to": {
      handler (val) {
        if (this.orderStatus < 1) {
          let param = {
            "customType": "sys",
            "childType": "sendDoctorInfo",
            "data": {
              "staffName": this.userInfo.staffName,
              "faceImage": this.userInfo.doctorInfo.faceImage,
              "titleName": this.userInfo.doctorInfo.titleName
            }
          };
          let payload = {
            data: JSON.stringify(param),
            description: "[医生信息]",
            extension: "rp"
          };
          this.cus_tim.sendCustomMessage(this.to, payload);
          let data = {
            customType: "hint",
            childType: "both",
            data: {
              text: `${this.userInfo.staffName}-${this.userInfo.doctorInfo.titleName}已为您接诊`
            }
          };
          let payloads = {
            data: JSON.stringify(data),
            description: "[IP医生提交消息]",
            extension: "tmc"
          };
          this.cus_tim.sendCustomMessage(this.to, payloads);
        }
      }
    },
    popoverVisible (val) {
      // if (!val && !this.inputCk) {
      //   this.dataInfo.primaryDiagnosis = "";
      // }
    }
  },
  methods: {
    showDrug (row) {
        this.drugVisible = true
        this.medicineName = row.medicineName //"葛酮通络胶囊"
    },
    closeDrugDescription () {
      this.drugVisible = false
    },
    //自动设置天数 row当前行的数据
    setDays(val, scope){
      // let reg = /^[1-9]([0-9]*)?$/
      // if(!reg.test(scope.row.takeDose)){
      //   this.dataInfo.medicines[scope.$index].takeDose = '';
      // }
      // let row = scope.row
      // let _specification = row.specification //localStorage.getItem('specification')
      // //
      //
      // this.dataInfo.medicines[scope.$index].medicationDays =  autoCalcDays( _specification, row.medicineAmount, row.unit, row.takeDose, row.formType, this.formatVal("takeFrequenceList", row.takeFrequence))
    },
    // 格式化数据
    formateWight (v) {
      if (!v) {
        return ''
      }
      let mark = v.toString().split(".")[1];
      if (!mark) {
        return v
      } else if (mark === "00" || mark.startsWith("0")) {
        return v.toString().substring(0, v.toString().indexOf("."))
      } else {
        return v.toFixed(1)
      }
    },
    //
    headerCellStyle ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // return "visibility: hidden;";
      }

      return "";
    },
    validateNumber (val, scope) {
      val = val.replace(/[^\.\d]/g, "");
      val = val.replace(".", "");
      this.dataInfo.medicines[scope.$index].medicationDays = val;
    },
    handleSelectRow (selection, row) {
      this.$refs.multipleTable.clearSelection();
      // 当表格数据都没有被勾选的时候 就返回
      // 主要用于将当前勾选的表格状态清除
      if (selection.length === 0) return;
      this.$refs.multipleTable.toggleRowSelection(row, true);
    },
    handleShowTemplate (item) {
      this.tableIndex = item.$index;
      this.currentRow = item.row;
      this.radio = 0
      this.medicineData = item.row.template || [];
      this.medicineDialogVisible = true;
    },
    handleSelectionChange (val) {
      if (val.length > 0) {
        this.selected = val[0];
      } else {
        this.selected = null;
      }
    },
    handleRowClick (row, column, event) {

    },
    handleClickTemp () {
      let select = {};
      if (this.radio !== 0) {
        this.medicineData.map(item => {
          if (item.keyID === this.radio) {
            select = item;
          }
        });
        this.$set(this.dataInfo.medicines[this.tableIndex], "takeDirection", select.takeDirection);
        this.$set(this.dataInfo.medicines[this.tableIndex], "takeFrequence", this.getArrKey("takeFrequenceList", select.takeFrequence));
        this.$set(this.dataInfo.medicines[this.tableIndex], "takeDose", select.takeDose);
        this.$set(this.dataInfo.medicines[this.tableIndex], "formType", select.formType);
        this.$forceUpdate();
      }
      this.medicineDialogVisible = false;
    },
    // 药品弹窗关闭
    handleMedicineClose () {
      this.medicineDialogVisible = false;
    },
    // 删除表格
    handleDeleteRow (index, rows) {
      this.$confirm("您确定删除此药品吗?", "提示", {
        confirmButtonText: "我确定删除",
        cancelButtonText: "点错了",
        type: "warning"
      }).then(() => {
        rows.splice(index, 1);
      }).catch(() => {
      });
    },
    querySearch (queryString, cb) {
      var restaurants = this.routeList;
      this.routeList.map((item, index) => {
        item.value = item.dictName;
        this.$set(item, index, item);
      });
      var results = queryString ? restaurants.filter(this.routeFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    routeFilter (queryString) {
      return (restaurant) => {
        return (restaurant.dictName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect (item) {
      console.log(item);
    },
    // 主诊断
    async handleAuto (flag) {
      this.inputCk = false;
      clearTimeout(this.timer);
      if (this.dataInfo.primaryDiagnosis.length > 0) {
        this.searchLoading = true;
        this.timer = setTimeout(() => {
          let westernRes = [];
          let westernMedicineData = JSON.parse(localStorage.getItem("westernMedicine"));
          for (let i = 0; i < westernMedicineData.length; i++) {
            if (westernMedicineData[i].indexOf(this.dataInfo.primaryDiagnosis) > -1) {
              westernRes.push(westernMedicineData[i]);
            }
          }
          this.westernMedicine = westernRes || [];
          if(!flag){
            this.popoverVisible = true;
          }
          this.searchLoading = false;
        }, 300);
      }else{
        this.searchLoading = false;
      }
    },
    // 主诊断选中
    handleRowClicck (row, column, event) {
      this.dataInfo.primaryDiagnosis = row;
      this.popoverVisible = false;
      this.inputCk = true;
    },
    // 主诊断筛选
    createFilter (queryString) {
      let list = [];
      for (let i = this.restaurants.length - 1; i >= 0; i--) {
        if (this.restaurants[i].val.indexOf(queryString) === 0) {
          list.push(this.restaurants[i]);
        }
      }
      // return (restaurant) => {
      //   return (restaurant.val.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      // };
      return list;
    },
    // 主诊断
    handelSavePr () {
      if (!this.dataInfo.primaryDiagnosis) {
        this.$_warning({
          message: "请输入主诊断",
          type: "warning"
        });
        return false;
      }
      let flag = false;
      for(let i=0, len=this.chineseMedicine.length; i<len; i++) {
        if(this.chineseMedicine[i]===this.dataInfo.primaryDiagnosis){
          flag = true;
          break;
        }
      }
      if(!flag){
        for(let i=0, len=this.westernMedicine.length; i<len; i++) {
          if(this.westernMedicine[i]===this.dataInfo.primaryDiagnosis){
            flag = true;
            break;
          }
        }
      }
      if(this.count<1&&!flag){
        this.count++;
        this.dataInfo.primaryDiagnosis = '';
        return  false;
      }
      this.drugVisible = false;
      this.editDetail = false;
    },
    // tab设置新消息
    timOnReceiveMessage ({ detail }) {
      let strConversationID = "";
      for (const msg of detail) {
        if (msg.conversationType === "C2C") {
          let conversationID = msg.conversationID;
          strConversationID = conversationID.replace("C2C", "");
        }
      }
      if (this.currentChat.orderPatientID === strConversationID) {
        return false;
      }

      this.chatList.map(item => {
        if (item.orderPatientID === strConversationID) {
          this.$set(item, "isNewMsg", true);
        }
      });
    },
    // 切换会话
    handleItem (selItem, index) {
      this.chatList.map(item => {
        if (item.orderID === selItem.orderID) {
          this.$set(item, "isNewMsg", false);
          this.$set(item, "check", true);
        } else {
          this.$set(item, "check", false);
        }
      });
      this.$emit("update:currentChat", selItem);
      this.$emit("update:orderId", selItem.orderID);
      this.getInit();
    },
    // 关闭弹窗
    handleClose () {
      this.$emit("update:dialogVisible", false);
    },
    // input只能输入数字
    handleChange (row, type) {
      let str = row[type];
      row[type] = str.replace(/[^\d]/g, "");
      this.$forceUpdate();
    },
    // 初始化
    async getInit () {
      // 用药频次
      this.takeFrequenceList = await this.getDictionaries("MEDICAL", "D_MEDICAL_TREAT_FREQUENCY");
      // 单位
      this.takeDoseList = await this.getDictionaries("MEDICAL", "D_MEDICAL_MEDICINE_UNIT");
      // 方法
      this.routeList = await this.getDictionaries("MEDICAL", "D_MEDICAL_TREAT_ROUTE");
      // 疾病史
      this.illnessList = [];
      this.allergylist = [];
      const tmpList = await this.getDictionaries("TMC", "D_TMC_DOCS_SICKNESS_2ND");
      tmpList.map(item => {
        if (item.parentDictCode === "ILLNESS") {
          this.illnessList.push(item);
          this.illnessListBak.push(item);
        } else if (item.parentDictCode === "ALLERGY") {
          this.allergylist.push(item);
          this.allergylistBak.push(item);
        }
      });
      this.allergylistBak = JSON.parse(JSON.stringify(this.allergylist));
      this.illnessListBak = JSON.parse(JSON.stringify(this.illnessList));
      this.getDetail();
    },
    // 格式化数据
    formatVal (arrList, key) {
      let value = "";
      if (key) {
        this[arrList].find(item => {
          if (item.dictCode === key) {
            value = item.dictName;
          }
        });
      }
      return value;
    },
    // 找到数据的key
    getArrKey (arrList, val) {
      let value = "";
      if (val) {
        this[arrList].find(item => {
          if (item.dictName === val) {
            value = item.dictCode;
          }
        });
      }
      return value;
    },
    // 发送结束消息
    sendEndMessage (params) {
      let param = {
        "customType": "sys",
        "childType": "endChat",
        "data": params
      };
      let payloads = {
        data: JSON.stringify(param),
        description: "[医生信息]",
        extension: "rp"
      };
      this.cus_tim.sendCustomMessage(this.to, payloads);
    },
    // 开处方
    async handleReview () {
      console.log(this.dataInfo)
      console.log(this.allergylist)
      // 过敏史
      if (this.dataInfo.historyOfAllergy === "有") {
        let list = [];
        this.allergylist.map(item => {
          if (item.check) {
            list.push(item.dictName);
          }
        });
        this.dataInfo.allergyDetail = list.join(",");
      }
      //dataInfo.allergyDetail:dataInfo.historyOfAllergy
      // 既往病史
      if (this.dataInfo.historyOfSickness === "有") {
        let list = [];
        this.illnessList.map(item => {
          if (item.check) {
            list.push(item.dictName);
          }
        });
        this.dataInfo.sicknessDetail = list.join(",");
      }

      if (this.dataInfo.historyOfSickness === "有" && this.dataInfo.sicknessDetail === "") {
        this.$_warning({
          message: "请选择既往史",
          type: "warning"
        });
        return false;
      }
      if (this.dataInfo.historyOfAllergy === "有" && this.dataInfo.allergyDetail === "") {
        this.$_warning({
          message: "请选择过敏史",
          type: "warning"
        });
        return false;
      }

      if (!this.dataInfo.primaryDiagnosis) {
        this.$_warning({
          message: "请输入主诊断",
          type: "warning"
        });
        return false;
      }

      let medicines = JSON.parse(JSON.stringify(this.dataInfo.medicines || []));
      if (medicines) {
        medicines.map(item => {
          if (item.takeFrequence) {
            item.takeFrequence = this.formatVal("takeFrequenceList", item.takeFrequence);
          }
        });
      }
      let patientInfo = {
        ...this.dataInfo
      };
      if (this.orderStatus === 4) {
        patientInfo.keyID = this.rpData.patientInfo.keyID;
      }
      let rp = {
        patientID: "",
        clientID: this.dataInfo.clientID,
        rpTypeID: this.dataInfo.rpTypeID,
        clientType: "0",
        rpSource: this.dataInfo.rpSource,
        patientName: this.dataInfo.patientName,
        providerType: this.dataInfo.providerType,
        providerID: this.dataInfo.providerID,
        providerName: this.dataInfo.providerName,
        doctorOrgType: "1",
        doctorOrgID: this.$store.state.user.userInfo.doctorInfo.orgID,
        sectionCode: this.dataInfo.sectionCode,
        section: this.dataInfo.sectionName,
        doctorID: this.$store.state.user.userInfo.doctorID,
        doctorName: this.dataInfo.doctorName,
        primaryDiagnosis: this.dataInfo.primaryDiagnosis,
        enjoin: this.dataInfo.enjoin || "",
        feeType: this.dataInfo.feeType,
        recipeAllPrice: this.dataInfo.money,
        patientInfo,
        medicines
      };
      if (this.orderStatus === 4) {
        rp.keyID = this.rpData.keyID;
      }
      let params = {
        orderID: this.orderId,
        orderStatus: this.orderStatus === 4 ? 4 : 2,
        bizID:this.dataInfo.bizID,
        rp
      };
      if (this.checkSubmit) {
        return false;
      }
      this.checkSubmit = true;
      try {
        const res = await this.$_http.post(this.$_API.INTERFACE_RP_POST_REVIEWRPORDER, params);
        this.checkSubmit = false;
        if (res.data) {
          this.$_success({
            message: "处理成功",
            type: "success"
          });
          this.$emit("update:dialogVisible", false);
          this.$parent.handleRefresh();
          this.sendEndMessage(res.data);
          // this.$router.push({ name: "orderPool" });
          // this.$store.dispatch("tagsView/delView", this.$route);
          this.chatList.map((item, index) => {
            if (item.orderID === this.orderId) {
              this.chatList.splice(index, 1);
            }
          });
          this.$emit("update:chatList", this.chatList);
        }
      } catch (error) {
        this.checkSubmit = false;
      }
    },
    // 拒绝
    async handleCancel () {
      if (!this.textarea) {
        this.$_warning({
          message: "请输入拒绝理由",
          type: "warning"
        });
        return false;
      }
      let params = {
        orderID: this.orderId,
        orderStatus: "3",
        bizID:this.dataInfo.bizID,
        doctorReason: this.textarea,
        doctorID: this.$store.state.user.userInfo.doctorID,
        doctorName: this.$store.state.user.userInfo.staffName
      };
      if (this.checkSubmit) {
        return false;
      }
      this.checkSubmit = true;
      try {
        const res = await this.$_http.post(this.$_API.INTERFACE_RP_POST_REVIEWRPORDER, params);
        this.checkSubmit = false;
        if (res.data) {
          this.$_success({
            message: "处理成功",
            type: "success"
          });
          this.$emit("update:dialogVisible", false);
          this.sendEndMessage(null);
          this.chatList.map((item, index) => {
            if (item.orderID === this.orderId) {
              this.chatList.splice(index, 1);
            }
          });
          this.visible = false;
          this.textarea = "";
          this.$parent.handleRefresh();
          this.$emit("update:chatList", this.chatList);
        }
      } catch (error) {
        this.checkSubmit = false;
      }
    },
    // radio切换
    handleChangeRadio (type) {
      if (type === 0) {
        this.illnessList = [];
        this.illnessList = this.illnessListBak;
        this.illnessList.map(item => {
          item.check = false;
        });
      } else {
        this.allergylist = [];
        this.allergylist = this.allergylistBak;
        this.allergylist.map(item => {
          item.check = false;
        });
      }
      this.$forceUpdate();
    },
    // 拒绝理由
    handleResonChange (label) {
      this.textarea = label;
      this.visible = false;
      this.handleCancel();
    },
    // 获取详情
    async getDetail () {
      try {
        let res = {};
        let rpRes = {};
        this.loading = true;
        if (this.orderStatus === 4 && this.rpID) {
          rpRes = await this.$_http.get(this.$_API.INTERFACE_RP_GET_GETRPBYID, {
            params: {
              rpID: this.rpID
            }
          });
        }
        res = await this.$_http.get(this.$_API.INTERFACE_RP_GET_GETDETAIL, {
          params: {
            orderID: this.orderId
          }
        });
        if (this.orderStatus === 4) {
          let obj = {};
          let medicines = rpRes.data.medicines || [];
          medicines.map(item => {
            item.maxAmount = item.medicineAmount || 0;
            item.takeFrequence = this.getArrKey("takeFrequenceList", item.takeFrequence);
          });
          obj.medicines = medicines;
          this.dataInfo = {
            ...res.data,
            ...rpRes.data.patientInfo,
            medicines,
            primaryDiagnosis: rpRes.data.primaryDiagnosis || "",
            pharmacistName: rpRes.data.pharmacistName || "",
            enjoin: rpRes.data.enjoin,
            notPassReason: rpRes.data.notPassReason
          };

          this.rpData = rpRes.data;
          if (this.dataInfo.medicines && this.orderStatus !== 4) {
            let medicines = this.dataInfo.medicines || [];
            medicines.map((item, index) => {
              item.takeDirection = this.formatVal("routeList", item.takeDirection);
            });
          }
          await this.getMedicineTemplate();
          this.dataInfoBak = JSON.parse(JSON.stringify(this.dataInfo));
          this.to = this.dataInfo.orderPatientID;
          this.initHistoryOfAllergy();
          this.initHistoryOfSickness();
        } else {
          if (res.data) {
            this.dataInfo = res.data || {};
            await this.initTakeDirection();
            await this.getMedicineTemplate();
            this.dataInfoBak = JSON.parse(JSON.stringify(this.dataInfo));
            this.to = this.dataInfo.orderPatientID;
            this.initHistoryOfAllergy();
            this.initHistoryOfSickness();
          }
        }
        let clientOrg = JSON.parse(sessionStorage.getItem("client_org")) || [];
        this.initAgeImg();
        this.initFormType();
        clientOrg.map(item => {
          if (this.dataInfo.clientID === item) {
            this.isEditNum = true;
          }
        });
        this.loading = false;
        this.cus_tim = SingleChat.getInstance(this.userInfo.keyID, this.userSig);
        this.$forceUpdate();
      } catch (error) {
        this.loading = false;
      }
    },
    // 初始化规格
    initFormType () {
      let list = this.dataInfo.medicines || [];
      list.map(item => {
        if (item.total <= 0) {
          let specification = item.specification || "";
          if (specification.indexOf("片") > -1) {
            item.formType = "片";
          } else if (specification.indexOf("丸") > -1) {
            item.formType = "丸";
          } else if (specification.indexOf("粒") > -1) {
            item.formType = "粒";
          } else if (specification.indexOf("mg") > -1) {
            item.formType = "mg";
          } else if (specification.indexOf("ml") > -1) {
            item.formType = "ml";
          } else if (specification.indexOf("g") > -1) {
            item.formType = "g";
          } else {
            item.formType = "片";
          }
        }
      });
    },
    // 详情初始化用法
    initTakeDirection () {
      if (this.dataInfo.medicines && this.orderStatus !== 4) {
        let medicines = this.dataInfo.medicines || [];
        medicines.map((item, index) => {
          if (item.takeDirection === "HF" && this.dataInfo.clientID === process.env.VUE_APP_YFW_CLIENTID) {
            item.takeDirection = "KF";
          }
          if (!item.takeDirection) {
            item.takeDirection = "KF";
          }
          item.maxAmount = item.medicineAmount || 0;
          item.takeDirection = this.formatVal("routeList", item.takeDirection);
        });
      }
    },
    // 详情初始化年龄图片
    initAgeImg () {
      let patientAge = this.dataInfo.patientAge;
      let ageImg = 0;
      if (patientAge >= 65) {
        ageImg = 1; // 老年人
      } else if (patientAge <= 14 && patientAge > 6) {
        ageImg = 2; // 儿童
      } else if (patientAge <= 6) {
        ageImg = 3; // 六岁以下的
      }
      let status = 0;
      if (this.dataInfo.patientSex === 2 && (this.dataInfo.pregnancy === "备孕中" || this.dataInfo.pregnancy === "备孕")) {
        status = 4; // 备孕中
      } else if (this.dataInfo.patientSex === 2 && (this.dataInfo.pregnancy === "怀孕中" || this.dataInfo.pregnancy === "妊娠")) {
        status = 5; // 怀孕中
      } else if (this.dataInfo.patientSex === 2 && (this.dataInfo.pregnancy === "正在哺乳" || this.dataInfo.pregnancy === "哺乳")) {
        status = 6; // 正在哺乳
      }
      this.ageIdentification = ageImg;
      this.statusIdentification = status;
    },
    // 获取字典数据
    async getDictionaries (systemCode, groupCode) {
      try {
        let sessionData = getSession(`${systemCode}_${groupCode}`);
        if (!sessionData) {
          let params = {
            systemCode: systemCode,
            groupCode: groupCode
          };
          const res = await this.$_http.get(this.$_API.INTERFACE_HOSPITAL_DICTIONARY, { params });
          if (res.data) {
            setSesssion(`${systemCode}_${groupCode}`, res.data);
            return res.data || [];
          };
        } else {
          return sessionData;
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 获取药品频率
    async getMedicineTemplate () {
      try {
        let medicines = this.dataInfo.medicines || [];
        let tmp = [];
        medicines.map(item => {
          tmp.push({ medicineName: item.medicineName, specification: item.specification, keyID: item.keyID });
        });
        const res = await this.$_http.post(this.$_API.INTERFACE_RP_GET_MEDICIENTEMPLATE, tmp);
        if (res.data) {
          let resList = res.data || [];
          resList.map((resItem, index) => {
            let obj = medicines[index];
            obj.total = resItem.length || 0;
            obj.template = resItem || [];
            if (this.orderStatus === 1 || this.orderStatus === 0) {
              if (resItem.length > 0) {
                let tmpObj = resItem[0];
                obj.takeDirection = tmpObj.takeDirection;
                obj.takeFrequence = this.getArrKey("takeFrequenceList", tmpObj.takeFrequence);
                obj.takeDose = tmpObj.takeDose;
                obj.formType = tmpObj.formType;
              }
            };
            this.$set(this.dataInfo.medicines, index, obj);
            this.$forceUpdate();
          });
        };
      } catch (error) {
        console.error(error);
      }
    },
    // 选中tag
    handelTag (item, index, type) {
      this.$set(item, "check", !item.check);
      this.$forceUpdate();
    },
    // 编辑患者信息
    handleEditBase (type) {
      this.editBase = !this.editBase;
      if (type === 1) {
        this.dataInfo = JSON.parse(JSON.stringify(this.dataInfoBak));
        this.allergylist = JSON.parse(JSON.stringify(this.allergylistBak));
        this.illnessList = JSON.parse(JSON.stringify(this.illnessListBak));
        this.initHistoryOfAllergy();
        this.initHistoryOfSickness();
      } else {
        // 过敏史
        // if (this.dataInfo.historyOfAllergy === "有") {
        //   let list = [];
        //   this.allergylist.map(item => {
        //     if (item.check) {
        //       list.push(item.dictName);
        //     }
        //   });
        //   this.dataInfo.allergyDetail = list.join(",");
        // }
        // 既往病史
        // if (this.dataInfo.historyOfSickness === "有") {
        //   let list = [];
        //   this.illnessList.map(item => {
        //     if (item.check) {
        //       list.push(item.dictName);
        //     }
        //   });
        //   this.dataInfo.sicknessDetail = list.join(",");
        // }
        this.initHistoryOfAllergy();
        this.initHistoryOfSickness();
        this.$forceUpdate();
      }
    },
    // 初始化过敏史
    initHistoryOfAllergy () {
      if (this.dataInfo.historyOfAllergy === "有") {
        let tmpArrlergyList = [];
        if (this.dataInfo.allergyDetail) {
          let t = this.dataInfo.allergyDetail || "";
          tmpArrlergyList = t.split(",");
        }
        tmpArrlergyList.map(childItem => {
          let findItem = this.allergylist.find(item => {
            return item.dictName === childItem
          })
          if (!findItem) {
            this.allergylist.push({ dictName: childItem, check: true });
          } else {
            findItem.check = true
          }
        })
        let tmpList = []
        this.allergylist.map(item => {
          if (item.check) {
            tmpList.push(item.dictName)
          }
        })
        this.dataInfo.allergyDetail = tmpList.join(',')
        this.$forceUpdate()
      }
    },
    // 初始化即使史
    initHistoryOfSickness () {
      if (this.dataInfo.historyOfSickness === "有") {
        let tmpArrlergyList = [];
        if (this.dataInfo.sicknessDetail) {
          let t = this.dataInfo.sicknessDetail || "";
          tmpArrlergyList = t.split(",");
        }
        let blist = [];
        this.illnessList.map(item => {
          tmpArrlergyList.map(childItem => {
            if (item.dictName === childItem) {
              this.$set(item, "check", true);
            }
          });
          blist.push(item.dictName);
          tmpArrlergyList.push(item.dictName);
        });
        let filterNonUnique = this.getArrDifference(blist, tmpArrlergyList);
        if (filterNonUnique.length > 0) {
          filterNonUnique.map(item => {
            this.illnessList.push({ dictName: item, check: true });
          });
        }
      }
    },
    // 过敏史去重
    getArrDifference (arr1, arr2) {
      return arr1.concat(arr2).filter(function (v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
      });
    },
    // table
    handleEditTable (type) {
      this.editTable = !this.editTable;
      if (type === 1) {
        let tmpdataInfo = JSON.parse(JSON.stringify(this.dataInfoBak));
        this.dataInfo.medicines = tmpdataInfo.medicines;
        this.dataInfo.enjoin = tmpdataInfo.enjoin;
        this.drugVisible = false;
      }
    },
    // 保存基本类型
    handleSaveBase () {
      // 过敏史
      if (this.dataInfo.historyOfAllergy === "有") {
        let list = [];
        this.allergylist.map(item => {
          if (item.check) {
            list.push(item.dictName);
          }
        });
        this.dataInfo.allergyDetail = list.join(",");
      }
      // 既往病史
      if (this.dataInfo.historyOfSickness === "有") {
        let list = [];
        this.illnessList.map(item => {
          if (item.check) {
            list.push(item.dictName);
          }
        });
        this.dataInfo.sicknessDetail = list.join(",");
      }
      if (this.dataInfo.historyOfSickness === "有" && this.dataInfo.sicknessDetail === "") {
        this.$_warning({
          message: "请选择既往史",
          type: "warning"
        });
        return false;
      }
      if (this.dataInfo.historyOfAllergy === "有" && this.dataInfo.allergyDetail === "") {
        this.$_warning({
          message: "请选择过敏史",
          type: "warning"
        });
        return false;
      }

      this.editBase = false;
      this.$forceUpdate();
    },
    // detail
    handleEditDetail (type) {
      if (type === 1) {
        let tmpdataInfo = JSON.parse(JSON.stringify(this.dataInfoBak));
        this.dataInfo.primaryDiagnosis = tmpdataInfo.primaryDiagnosis;
      }
      if(this.dataInfo.primaryDiagnosis){
        this.handleAuto(true)
      }
      this.drugVisible = false;
      this.editDetail = !this.editDetail;
    },
    // 保存table
    handleSaveTable () {
      let index = 0;
      let medicines = JSON.parse(JSON.stringify(this.dataInfo.medicines || []));
      if (medicines) {
        medicines.map(item => {
          if (!item.formType || !item.takeDose) {
            index = 1;
            return false;
          }
          if (!item.unit) {
            index = 2;
            return false;
          }
        });
      }
      if (index > 0 && index === 1) {
        this.$_warning({
          message: "请选择每次剂量",
          type: "warning"
        });
        return false;
      }
      if (index > 0 && index === 2) {
        this.$_warning({
          message: "请填写单位",
          type: "warning"
        });
        return false;
      }
      this.drugVisible = false;
      this.editTable = false;
    },
    // 编辑疾病信息
    handleEditDisease () {
      this.editDisease = !this.editDisease;
    },
    // 编辑标签
    handelEditTag (type) {
      if (type === 0) {
        this.illnessVisible = true;
      } else {
        this.allergyVisible = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  /deep/ .el-table {
    overflow: visible;
    .el-table__footer-wrapper, .el-table__header-wrapper
    ,.el-table__body-wrapper, .cell{
      overflow: visible;
    }
  }
.font-red {
  color: red;
}
.border-left{
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}
.detail-title{
  font-size:16px;
}
.dialog-title {
  font-size: 14px;
  padding: 20px;
  padding-top: 0;
  padding-left:0;
  li {
    display: flex;
    align-items: center;
    .li-border {
      width: 6px;
      height: 6px;
      background: rgba(67, 139, 239, 1);
      border-radius: 6px;
      margin-right: 7px;
    }

    float: left;
    list-style: none;
    height: 44px;
    line-height: 44px;
    text-align: center;
    cursor: pointer;
    border-radius: 2px;
    border: 1px solid #dad9dc;
    padding-left: 12px;
    padding-right: 12px;
  }
  .li-border-active {
    border: 1px solid rgba(67, 139, 239, 1);
    background: #f5f6fd;
  }
}
.title-border {
  border-bottom: 1px solid #e7e4e7;
  padding-bottom: 15px;
}
.tag-check {
  color: #ffffff;
  background: #438bef;
  border-radius: 14px;
  border: 1px solid #438bef;
  padding: 4px 14px;
}
.tag-defult {
  background: #ffffff;
  border-radius: 14px;
  padding: 4px 14px;
  border: 1px solid #dadada;
}

.refuse-input /deep/ input {
  width: 300px;
}
@keyframes fade {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}

@-webkit-keyframes fade {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}
.headerBox {
  color: #fff;
  animation: fade 600ms infinite;
  -webkit-animation: fade 600ms infinite;
}
.sickness {
  input {
    width: 300px;
  }
}

.indeimg {
  width: 74px;
  height: 84px;
  position: absolute;
  right: 180px;
  top: -50px;
}

.medicine-record {
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #fff;
  background-color: #409eff;
}
</style>
