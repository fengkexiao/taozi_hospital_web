<template>
  <div class="app-container">
    <!-- 风湿协诊中心 待开发 -->
    <div class="videoLogo" v-if="currentlyShow ===1">
      <el-image fit="contain" :src="webim" />
      <p>视频咨询中心</p>
    </div>
    <!-- 协诊视频填写患者信息部分 -->
    <div class="app-container" v-if="currentlyShow ===2">
      <div class="consultation_div1">
        <el-card class="box-card">
          <div>
            <video v-show="multipleList" id="local" style="position: absolute;" autoplay muted playsinline></video>
          </div>
          <div>
            <video v-show="multipleList" class="remote-video" autoplay playsinline id="remoteVideo"></video>
          </div>
          <div v-if="sign" style="margin-left: 30%; margin-top: 30px;">
            <el-button @click="endCall()" type="danger" round>结束视频</el-button>
          </div>
          <div v-if="!sign" style="margin-left: 40%;margin-top: 70%;">
            视频已结束...
            <br />
            <br />
            <br />
            <br />
            <br />
            <el-button type="primary" @click="waitFor()" round>返回等待界面</el-button>
          </div>
        </el-card>
        <div v-if="one">
          <el-card class="box-card1">
            <br />
            <br />
            <label style="margin-left: 50%;">患者信息</label>
            <div class="consultation_basic">
              <el-form ref="form" :model="patient" label-width="80px">
                <el-form-item label="姓名">
                  ：<el-input v-model="patient.patientName"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio v-model="patient.patientSex" label="1">男</el-radio>
                  <el-radio v-model="patient.patientSex" label="2">女</el-radio>
                </el-form-item>
                <el-form-item label="年龄">
                  ：
                  <span :class="ageRiskType.riskType === 'forbidden'? 'red' : '' ">
                    <el-input v-model="patient.patientAge"></el-input>
                  </span>
                </el-form-item>
                <el-form-item label="联系电话">
                  ：<el-input v-model="patient.patientPhone"></el-input>
                </el-form-item>
              </el-form>
              <div style="padding-left: 80%;padding-top: 90%;">
                <el-button type="primary" @click="getDisease()">下一步</el-button>
              </div>
            </div>
          </el-card>
        </div>
        <div v-if="two">
          <el-card class="box-card1">
            <br />
            <br />
            <label style="margin-left: 30%;">诊断</label>
            <div class="consultation_basic">
              <el-radio-group v-model="diseaseCode">
                <div v-for="(dis,index) in disease" style="display: flex;margin-top: 20%;" :key="index">
                  <el-radio :label="dis.diseaseCode">
                    {{dis | formatDis }}
                  </el-radio>
                </div>
              </el-radio-group>
              <el-form>
                <el-form-item>
                  <div style="padding-left: 70%;display: flex;padding-top: 80%;">
                    <el-button type="primary" @click="goone">上一步</el-button>
                    <el-button type="primary" @click="getHistortClassify()">下一步</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </div>
        <div v-if="three">
          <el-card class="box-card1" style="overflow: scroll;">
            <br />
            <br />
            <label style="margin-left: 30%;">患者信息</label>
            <div class="consultation_basic1">
              <!-- 既往史 -->
              <div class="subtitle">
                既往史
              </div>
              <!-- 既往史的其他信息 -->
              <div>
                <br /><br />
                <div v-for="(value, key) in historyGroup" :key="key">
                  <div v-if="value.key === 'H1'">
                    <div v-for="(group, key) in value.value" :key="key">
                      <!-- 选择弹框 -->
                      <div v-if="group.valueType === 0">
                        {{group.groupName}}
                        <!-- 原始数据 -->
                        <template v-for="(show,index) in showData">
                          <div v-if="show.groupCode === group.groupCode" :key="index" class="part_four1"
                            v-bind:class="{'red' : countRisk(show.riskType) ,'yellow' : count(show.riskType)}">
                            {{show.valueDesc}}
                          </div>
                        </template>
                        <el-button class="buttom_div2" @click="getHistoryItem(group)">></el-button>
                        <el-divider></el-divider>
                      </div>
                      <!-- 输入弹框 -->
                      <div v-if="group.valueType === 1">
                        {{group.groupName}}
                        <!-- 原始数据 -->
                        <template v-for="(show,index) in showData">
                          <div v-if="show.groupCode === group.groupCode" :key="index" class="part_four1">
                            {{show.valueDesc}}
                          </div>
                        </template>
                        <el-button class="buttom_div2" @click="inputFrame(group)">></el-button>
                        <el-divider></el-divider>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 其他信息 -->
              <div class="subtitle">
                其他信息
              </div>
              <br /><br />
              <div v-for="(value, key) in historyGroup" :key="key">
                <div v-if="['H2','H3','H4','H5','H6'].includes(value.key)">
                  <div v-for="(group, key) in value.value" :key="key">
                    <!-- 选择弹框 -->
                    <div v-if="group.valueType === 0">
                      {{group.groupName}}
                      <!-- 原始数据 -->
                      <template v-for="(show,index) in showData">
                        <div v-if="show.groupCode === group.groupCode" :key="index" class="part_four1"
                          v-bind:class="{'red' : countRisk(show.riskType) ,'yellow' : count(show.riskType)}">
                          {{show.valueDesc}}
                        </div>
                      </template>
                      <el-button class="buttom_div2" @click="getHistoryItem(group)">></el-button>
                      <el-divider></el-divider>
                    </div>
                    <!-- 输入弹框 -->
                    <div v-if="group.valueType === 1">
                      {{group.groupName}}
                      <!-- 原始数据 -->
                      <template v-for="(show,index) in showData">
                        <div v-if="show.groupCode === group.groupCode" :key="index" class="part_four1">
                          {{show.valueDesc}}
                        </div>
                      </template>
                      <el-button class="buttom_div2" @click="inputFrame(group)">></el-button>
                      <el-divider></el-divider>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 中医病史采集 -->
              <div class="subtitle">
                中医病史采集
              </div>
              <div>
                <br /><br />
                <div v-for="(value, key) in historyGroup" :key="key">
                  <div v-if="value.key === 'H9'">
                    <div v-for="(group, key) in value.value" :key="key">
                      <!-- 选择弹框 -->
                      <div v-if="group.valueType === 0">
                        {{group.groupName}}
                        <!-- 原始数据 -->
                        <template v-for="(show,index) in showData">
                          <div v-if="show.groupCode === group.groupCode" :key="index" class="part_four1"
                            v-bind:class="{'red' : countRisk(show.riskType) ,'yellow' : count(show.riskType)}">
                            {{show.valueDesc}}
                          </div>
                        </template>
                        <el-button class="buttom_div2" @click="getHistoryItem(group)">></el-button>
                        <el-divider></el-divider>
                      </div>
                      <!-- 输入弹框 -->
                      <div v-if="group.valueType === 1">
                        {{group.groupName}}
                        <!-- 原始数据 -->
                        <template v-for="(show,index) in showData">
                          <div v-if="show.groupCode === group.groupCode" :key="index" class="part_four1">
                            {{show.valueDesc}}
                          </div>
                        </template>
                        <el-button class="buttom_div2" @click="inputFrame(group)">></el-button>
                        <el-divider></el-divider>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <el-form>
                <el-form-item>
                  <div style="padding-left: 70%;display: flex;padding-top: 10%;">
                    <el-button type="primary" @click="gotwo">上一步</el-button>
                    <el-button type="primary" @click="argueDiseaseTreatment()">下一步</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </div>
        <div v-if="four">
          <el-card class="box-card1" style="overflow: scroll;">
            <label style="margin-left: 30%;">辩证论治</label>
            <div class="consultation_basic1">
              <br />
              <br />
              <div>
                <el-checkbox-group class="part_four" v-model="dsiCheckList">
                  <el-checkbox class="checkbox" v-for="(item, index) in argueDisease" :key="index"
                    :label="item.symptomCode">
                    {{item.symptomDesc}}</el-checkbox>
                </el-checkbox-group>
                <el-form>
                  <el-form-item>
                    <div style="padding-left: 70%;display: flex;padding-top: 10%;">
                      <el-button type="primary" @click="getHistortClassify()">上一步</el-button>
                      <el-button type="primary" @click="addSymptom()">下一步</el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-card>
        </div>
        <div v-if="five">
          <el-card class="box-card1" style="overflow: scroll;">
            <label style="margin-left: 30%;">开处方</label>
            <br />
            <br />
            <div class="consultation_basic">
              <el-form :model="treatRpAddress" :rules="rules" ref="fromPharmacist">
                <el-form-item label="就诊人信息：">
                  {{patient.patientName}} &emsp; &emsp; {{patient.patientSex | formatSex}} &emsp; &emsp;
                  {{patient.patientAge}}
                </el-form-item>
                <el-form-item label="诊断结果：">
                  {{orderInfo.diseaseName}}&emsp;·&emsp; {{orderInfo.kindName}}
                </el-form-item>
                <el-form-item label="收货地址：" prop="place">
                  <el-cascader ref="place" v-model="treatRpAddress.place" :options="placeOptions"
                    @change="handleChange">
                  </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址：" prop="address">
                  <el-input type="textarea" maxlength="200" show-word-limit v-model="treatRpAddress.address" :rows="2"
                    placeholder="请输入详细地址">
                  </el-input>
                </el-form-item>
                <el-form-item label="收货人姓名：" prop="contacts">
                  <el-input v-model="treatRpAddress.contacts" size="mini" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="收货人电话：" prop="phone">
                  <el-input v-model="treatRpAddress.phone" size="mini" placeholder="请输入电话">
                  </el-input>
                </el-form-item>
              </el-form>
              <div class="division_line"></div>
              <!-- 药品 -->
              <div class="drug">
                <div class="drug_herad">
                  <p class="r">R：</p>
                  <div class="addDeug">
                    <el-button size="mini" type="warning" @click="addDrug()">添加药品</el-button>
                    <el-button size="mini" type="warning" @click="templatePrescribing()">模板开方</el-button>
                  </div>
                  <!-- 摆放药品界面 -->
                  <div>
                    <div v-for="(medicines,index) in treatRpMedicines" :key="index">
                      <div class="part_four2">
                        <div>
                          <!-- 减少药品用药 -->
                          <div @click="minusSign(medicines)">
                            <svg-icon icon-class="minusSign" />
                          </div>
                          <div>{{medicines.medicineName}}&emsp;{{medicines.norms}} </div>
                          <!-- 修改数据 -->
                          <div class="cotrearcenter_medicines_div1_font">
                            用法用量：{{medicines.doseDayTimes}}&emsp;{{medicines.usageWay}}</div>
                        </div>
                        <div style="margin: auto;margin-right: 32px" class="caption">
                          &emsp;{{medicines.price | formatStatus}}元/{{medicines.packageUnit}} &emsp;&emsp;
                          <el-input-number :min="1" size="mini" v-model="medicines.amount">
                          </el-input-number>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="division_line"></div>
              <div class="totalPrices">
                <span>总价</span>￥：{{price | formatStatus}}元
              </div>
            </div>
            <!-- 信息 -->
            <el-form class="retreat">
              <el-form-item>
                <div style="padding-left: 70%;display: flex;padding-top: 39%;">
                  <el-button type="primary" @click="argueDiseaseTreatment()">上一步</el-button>
                  <el-button type="primary" @click="validate()">提交</el-button>
                </div>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
      <!-- 模板开方弹框 -->
      <el-dialog title="推荐方案" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <base-loading>
          <el-card class="box-card2">
            <el-table :data="tableData" border>
              <el-table-column prop="kindName" label="疾病名称">
                <template #default="{row}">
                  {{row |formatDisease}}
                </template>
              </el-table-column>
              <el-table-column prop="fangan" label="方案"></el-table-column>
              <el-table-column prop="medicineName" label="药品"></el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="{row}">
                  <el-button type="danger" size="mini" icon="el-icon-edit" @click="goPatientContrasr(row)">选择
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- <base-pagination v-model="pageInfo" @size-change="getPatient" @current-change="getPatient" /> -->
          </el-card>
        </base-loading>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 病史选择框  -->
      <el-dialog :title="groupName" :visible.sync="dialog" width="50%" center>
        <template v-for="(fu , index) in historyItemSon" class="part-item">
          <div v-if="fu.parentCode === '' " class="part_four2" :key="index">
            <!-- 创建父项目（普通选择框） -->
            <div v-if="fu.valueType === 1">
              <el-checkbox-group v-model="checkList">
                <el-checkbox text-color :label="fu.value" class="part-input">
                  <div v-bind:class="{'red' : countRisk(fu.riskType) ,'yellow' : count(fu.riskType)}">
                    {{fu.title}}
                    <el-input v-model="fu.valueDesc"
                      v-show="fu.sign !== true && fu.valueType === 1 && checkList.includes(fu.value)">
                    </el-input>
                  </div>
                </el-checkbox>
                <div v-for="(select,index) in selectData" :key="index">
                  <div v-if="select.itemCode === fu.value && fu.valueType === 1">
                    <el-input v-model="select.valueDesc" v-show="fu.sign === true && checkList.includes(fu.value)">
                    </el-input>
                  </div>
                </div>
              </el-checkbox-group>
            </div>
            <div v-else-if="fu.valueType !== 1 && fu.nodeType === 1">
              <el-checkbox-group v-model="checkList">
                <el-checkbox text-color :label="fu.value" class="part-input">
                  <div v-bind:class="{'red' : countRisk(fu.riskType) ,'yellow' : count(fu.riskType)}">
                    {{fu.title}}
                  </div>
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-else class="item-label part-input">
              {{fu.title}}
            </div>
            <div class="item-list-box">
              <div v-for="(son , index) in historyItemSon" :key="index">
                <el-checkbox-group v-if="son.parentCode === fu.value" v-model="checkList">
                  <el-checkbox text-color :label="son.value" class="part_four1 part-input">
                    <div v-bind:class="{'red' : countRisk(son.riskType) ,'yellow' : count(son.riskType)}">
                      {{son.title}}
                      <el-input v-model="son.valueDesc"
                        v-show="fu.sign !== true && son.valueType === 1 && checkList.includes(son.value)">
                      </el-input>
                    </div>
                  </el-checkbox>
                  <div v-if="selectData.length !== 0">
                    <div v-for="(select,index) in selectData" :key="index">
                      <div v-if="select.itemCode === son.value">
                        <el-input v-model="select.valueDesc"
                          v-show="fu.sign === true && son.valueType === 1 && checkList.includes(son.value)">
                        </el-input>
                      </div>
                    </div>
                  </div>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </template>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog = false">取 消</el-button>
          <el-button type="primary" @click="addHistoryItems(historyItemSon)">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 病史文本框  -->
      <el-dialog :title="groupName" :visible.sync="dialog1" width="30%">
        <br />
        <br /><br />
        <el-input type="textarea" rows="4F" maxlength="200" show-word-limit v-model="inputData.valueDesc"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog1 = false">取 消</el-button>
          <el-button type="primary" @click="updateHistoryGroups()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加药品界面 -->
      <div id="cancelBody">
        <el-dialog title="添加药品" :visible.sync="dialogmedic" width="70%">
          <el-card class="box-card2">
            <el-form :model="query" inline>
              <el-form-item prop="patientName" label="商品名称">
                <base-input v-model="query.patientName" placeholder="商品名称"></base-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="loadTable()">查询</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card class="box-card2">
            <el-table :visible.sync="dialog1" :data="tableData1" border>
              <el-table-column prop="medicineName" label="药品名称"></el-table-column>
              <el-table-column prop="price" label="价格（元）">
                <template #default="{row}">
                  {{ row.price | formatStatus }}
                </template>
              </el-table-column>
              <el-table-column prop="usageAmount" label="用法用量"></el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="{row}">
                  <el-button type="danger" size="mini" icon="el-icon-edit" @click="choiceDrugs(row)">选择
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <base-pagination v-model="pageInfo" @size-change="addDrug()" @current-change="addDrug()" />
          </el-card>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import webim from "@/assets/image/webim.svg";
import "@/styles/special/coTreatCenter.css";
import { mapGetters } from "vuex";
import consultationVideo from "@/views/houshi/consultationVideo.js";
import consultationStep from "@/views/houshi/consultationStep.js";
import json from "@/assets/json/place.json";
export default {
  name: "coTreatCenter",
  mixins: [consultationVideo, consultationStep],
  filters: {
    // 格式化金额
    formatStatus(val) {
      return (val / 100).toFixed(2);
    },
    // 过滤第二步疾病 （中医名不存在 显示西医名）
    formatDis(val) {
      if (val.diseaseNameZy !== "") {
        return val.diseaseNameZy;
      }
      return val.diseaseNameXy;
    },
    // 模版开方过滤名字
    formatDisease(val) {
      return val.diseaseNameZy + "." + val.kindName;
    }
  },
  created() {
    // 获取腾讯云userSig
    this.getUseSig();
  },
  props: {
    orderID: {
      type: String,
      // 必传
      required: false
    },
    step: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      sign: true,
      dialogmedic: false,
      keyID: "",
      medicineName: "",
      price1: "",
      norms: "",
      packageUnit: "",
      usageAmount: "",
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      },
      RTC: {},
      query: {},
      placeOptions: json,
      // 展示待接听界面
      currentlyShow: 1,
      // 订单Id
      orderId: "",
      // 选择病种
      diseaseCode: "",
      // 获取的病症
      kindCode: "",
      // 基础病种集合
      disease: [],
      // 就诊患者信息
      patient: {},
      historyItemSon: [], // 病史item基础数据
      historyClass: [], // 病史类别所有数据
      argueDisease: [], // 病症数据
      // historyItemSon: [], // 病史数据
      classifyCodeArr: [],
      rpData: [],
      orderRP: {},
      readSymptom: {},
      disKin: {},
      tableLoading: "",
      table: false,
      tableData: [],
      tableData1: [],
      activeNames: "",
      // 既往史分组集合
      historyGroup: [],
      goodsAddForm: [],
      checkList: [],
      inputData: {}, // 文本数据
      selectData: [], // 选择数据
      summaryKeyID: "",
      num1: [],
      dialogVisible: false, // 处方弹框默认值
      dialog: false, // 病史选择框默认值
      dialog1: false, // 病史文本框
      dsiCheckList: [], // 病症所选数据
      // 年龄风险类型
      ageRiskType: {},
      // 订单信息
      orderInfo: {},
      // newMap = new Map(),
      // 展示数据
      showData: [],
      treatRpSummary: {}, // 处方总表数据
      treatRpAddress: {}, // 处方地址数据
      treatRpMedicines: [], // 处方药品数据
      // 界面步数相关
      one: true,
      two: false,
      three: false,
      four: false,
      five: false,
      input: "",
      // 视频相关数据
      remoteList: [],
      multipleList: true,
      // 界面图片
      webim,
      // im监听事件
      listeners: {
        onConnNotify: this.onConnNotify,
        onMsgNotify: this.onMsgNotify,
        onC2cEventNotifys: this.onC2cEventNotifys
      },
      options: {
        isLogOn: false
      },
      userSig: "",
      // 房间号相关信息
      roomid1: {},
      // 问诊ID
      inquiryId: "",
      // 请求者ID
      sponsorsId: "",
      // 分组名称
      groupName: "",
      rules: {
        address: {
          required: true,
          message: "详细地址不能为空"
        },
        phone: {
          required: true,
          message: "收货人电话不能为空"
        },
        contacts: {
          required: true,
          message: "收货人姓名不能为空"
        }
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    price() {
      let price = 0;
      for (let i = 0; i < this.treatRpMedicines.length; i++) {
        let me = this.treatRpMedicines[i];
        price += me.amount * me.price;
      }
      return price;
    }
  }
};
</script>

<style scoped>
.box-card {
  width: 600px;
  height: 950px;
}
.box-card1 {
  width: 800px;
  height: 955px;
}
.box-card2 {
  width: 100%;
  height: 100%;
}
.cotrearcenter_medicines_div1_font {
  font-size: 3%;
  margin-top: 0.3%;
}
</style>
