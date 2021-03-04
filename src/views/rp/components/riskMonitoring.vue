<template>
  <div class="riskMain" :style="!warningState?'height: calc(100% - 42px);':''">
    <div class="riskItem riskItemO">
      <p class="riskItemName" v-if="!warningState" style="position: relative;">
        <span class="beforeBg">风险监测</span>
        <span class="toMonitor"  @click="toMonitorClick" style="top:4px;right:0px;">重新检测</span>
      </p>
      <p class="riskItemName" v-else style="position: relative;margin-bottom: 15px;">
        <span class="beforeBg">风险监测</span>
        <el-popover
          placement="bottom-end"
          width="396"
          trigger="manual"
          popper-class="warningPop"
          v-model="visibleError">
          <div>
            <p class="titleName">一键报错原因说明：(选填)</p>
            <el-input type="textarea" placeholder="请输入一键报错原因" show-word-limit :rows="3" :maxlength="100" v-model="warningText"></el-input>
            <div class="botton_Btm">
              <el-button @click="visibleError = false">取消</el-button>
              <el-button type="primary" @click="warningAffirm">确认</el-button>
            </div>
          </div>
          <span slot="reference" @click="clickVisibleError" class="warningButton"><img src="./../../../assets/image/warning.png" class="warningImg"> 一键报错</span>
        </el-popover>
        <span class="toMonitor"  @click="toMonitorClick">重新检测</span>
      </p>
      <div class="riskItamMain">
        <div class="reminder">
          <p class="reminder_content"><span>{{riskStatiscal.forbidden}}</span>项禁止，<span>{{riskStatiscal.confirm}}</span>项确认，<span>{{riskStatiscal.tip}}</span>项提示，<span>{{riskStatiscal.safe}}</span>项安全，共审查<span>{{riskStatiscal.total}}</span>项内容</p>
          <template  v-if="riskStatiscal.maxRisk != 0">
            <div class="reportError reportForbid" v-if="reportForbidList.length > 0">
              <img class="icon" src="./../../../assets/image/rule/icon_forbid.png" alt="">
              <div class="content">
                <p class="titleName">禁止开方</p>
                <p class="matter" v-for="(item,index) in reportForbidList" :key="index"><span v-if="item.medicineName">{{item.medicineName}} </span>{{item.tip}}</p>
              </div>
              <!-- <div v-if="1" class="affirmBtn">确认</div>
              <div v-else class="confirmed">
                <div>
                  <img src="./../../../assets/image/rule/icon_success.png" alt="">
                  <span>已确认</span>
                </div>
              </div> -->
            </div>
            <div class="reportError reportOutbound" v-if="reportOutboundList.length > 0">
              <img class="icon" src="./../../../assets/image/rule/icon_outbound.png" alt="">
              <div class="content">
                <p class="titleName">外呼警告</p>
                <p class="matter" v-for="(item,index) in reportOutboundList" :key="index"><span v-if="item.medicineName">{{item.medicineName}} </span>{{item.tip}}</p>
              </div>
              <!-- <div v-if="1==2" class="affirmBtn">确认</div>
              <div v-else class="confirmed">
                <div>
                  <img src="./../../../assets/image/rule/icon_success.png" alt="">
                  <span>已确认</span>
                </div>
              </div> -->
            </div>
            <div class="reportError reportAffirm" v-if="reportAffirmList.length > 0">
              <img class="icon" src="./../../../assets/image/rule/icon_affirm.png" alt="">
              <div class="content">
                <p class="titleName">确认告警</p>
                <p class="matter" v-for="(item,index) in reportAffirmList" :key="index"><span v-if="item.medicineName">{{item.medicineName}} </span>{{item.tip}}</p>
                <!-- <p class="matter"><img src="./../../../assets/image/rule/icon_oldPeople.png">西地拉非片年龄大于65岁</p>
                <p class="matter"><img src="./../../../assets/image/rule/icon_voucher.png">西地拉非片年龄大于65岁</p>
                <p class="matter"><img src="./../../../assets/image/rule/icon_highRisk.png">西地拉非片年龄大于65岁</p> -->
              </div>
              <!-- <div v-if="1==2" class="affirmBtn">确认</div>
              <div v-else class="confirmed">
                <div>
                  <img src="./../../../assets/image/rule/icon_success.png" alt="">
                  <span>已确认</span>
                </div>
              </div> -->
            </div>
            <div class="reportError reportHint" v-if="reportHintList.length > 0">
              <img class="icon" src="./../../../assets/image/rule/icon_hint.png" alt="">
              <div class="content">
                <p class="titleName">提示告警</p>
                <p class="matter" v-for="(item,index) in reportHintList" :key="index"><span v-if="item.medicineName">{{item.medicineName}} </span>{{item.tip}}</p>
              </div>
              <!-- <div v-if="1==2" class="affirmBtn">确认</div>
              <div v-else class="confirmed">
                <div>
                  <img src="./../../../assets/image/rule/icon_success.png" alt="">
                  <span>已确认</span>
                </div>
              </div> -->
            </div>
          </template>
          <template v-else>
            <div class="reportSuccess">
              <img src="./../../../assets/image/rule/icon_success.png" alt="">
              <span>未检测到问题，可放心开方</span>
            </div>
          </template>
          
          <!-- <img class="topImage" src="./../../../assets/image/forbidden.png" v-if="(riskStatiscal.maxRisk == 1 || riskStatiscal.maxRisk == 2)">
          <img class="topImage" src="./../../../assets/image/deque.png" v-else>
          <p class="reminder_title">{{(riskStatiscal.maxRisk == 1 || riskStatiscal.maxRisk == 2)?'禁止开方':'谨慎开方'}}</p>
          <p class="reminder_content">共审查{{riskStatiscal.total}}项内容，{{riskStatiscal.forbidden}}项禁止，{{riskStatiscal.caution}}项谨慎，{{riskStatiscal.safe}}项安全</p>
          <ul class="reminder_ul">
            <template v-for="(item,index) in validateResults"> 
              <li :key="index">
                <span :class="(item.risk == 1 || item.risk == 2)?'forbiddenFill':'dequeFill'">{{(item.risk == 1 || item.risk == 2)?'禁用':'慎用'}}</span><p><span v-if="item.medicineName" class="medicineName">{{item.medicineName}} </span>{{item.tip}}</p>
                <p class="suggest" v-if="item.advise">用药建议：{{item.advise}}</p>
              </li>
            </template>
          </ul> -->
        </div>
      </div>
    </div>
    <template v-if="medicineResult.length > 0">
      <div style="background:#eeeeee;height:6px;"></div>
      <el-collapse v-model="activeNames" class="collapse">
        <el-collapse-item title="用药助手" name="1">
          <div class="riskItem">
            <div class="riskItamMain">
              <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane :label="item.medicineName" :name="item.medicineName" v-for="(item,index) in medicineResult" :key="index">
                  <template v-if="item.result">
                    <el-select class="specification" v-model="specificationName" @change="specificationChange">
                      <el-option :label="items.specificationName" :value="items.specificationName" v-for="(items,indexs) in specificationList" :key="indexs"></el-option>
                    </el-select>
                    <ul class="assistant">
                      <li>
                        <span class="assistantName">药品风险</span>
                        <span class="assistantMain">{{item.result.reInquiry == 1 ? '强制要求复诊凭证': '非强制要求复诊凭证'}}</span>
                      </li>
                      <li>
                        <span class="assistantName">6岁以下儿童开方标准</span>
                        <span class="assistantMain">{{specificationInfo.takeDirection == "口服" ? '不可开': '可开'}}</span>
                      </li>
                      <li>
                        <span class="assistantName">给药途径</span>
                        <span class="assistantMain">{{specificationInfo.takeDirection}}</span>
                      </li>
                      <li>
                        <span class="assistantName">频次上限</span>
                        <span class="assistantMain">{{specificationInfo.takeFrequence}}</span>
                      </li>
                      <li>
                        <span class="assistantName">单次剂量上限</span>
                        <span class="assistantMain">
                          <p>{{specificationInfo.takeDose1}}</p>
                          <p>{{specificationInfo.internationalUnit}}</p>
                          <p>{{specificationInfo.takeDose2}}</p>
                          <p>{{specificationInfo.meterageUnit}}</p>
                        </span>
                      </li>
                      <li>
                        <span class="assistantName">每日剂量上限</span>
                        <span class="assistantMain">
                          <p>{{specificationInfo.maxDose1}}</p>
                          <p>{{specificationInfo.internationalUnit}}</p>
                          <p>{{specificationInfo.maxDose2}}</p>
                          <p>{{specificationInfo.meterageUnit}}</p>
                        </span>
                      </li>
                      <li>
                        <span class="assistantName">服用天数上限</span>
                        <span class="assistantMain">{{specificationInfo.maxDays?specificationInfo.maxDays+"天":""}}</span>
                      </li>
                      <li>
                        <span class="assistantName">适用症</span>
                        <span class="assistantMain noFlex">
                          <ul class="indication">
                            <li v-for="(items,indexs) in item.result.indications" :key="indexs">{{items}}</li>
                          </ul>
                          <!-- <span class="more" @click="moreIndications" v-if="item.result.indications && item.result.indications.length > 0">{{isMoreIndications?'更多':'收起'}}</span> -->
                        </span>
                      </li>
                      <li>
                        <span class="assistantName">禁忌症</span>
                        <span class="assistantMain noFlex">
                          <div class="item" v-for="(items,indexs) in item.result.contras" :key="indexs">
                            <p>{{items.value}}<span :class="(items.risk == 1 || items.risk == 2)?'forbiddenFill':((items.risk == 3 || items.risk == 4)?'dequeFill':'')">{{(items.risk == 1 || items.risk == 2)?'禁用':((items.risk == 3 || items.risk == 4)?'确认告警':'')}}</span></p>
                            <p v-if="items.tip">风险提示：{{items.tip}}</p>
                            <p v-if="items.advise">用药建议：{{items.advise}}</p>
                          </div>
                          <!-- <div class="item">
                            <p>冠心病、心绞痛 <span class="deque">慎用</span></p>
                            <p>风险提示：冠心病、心绞痛患者禁用。</p>
                            <p>用药建议：哺乳期妇女用量减半，连续服用不超过7天。</p>
                          </div> -->
                        </span>
                      </li>
                      <li>
                        <span class="assistantName">过敏源</span>
                        <span class="assistantMain noFlex">
                          <ul class="indication">
                            <li v-for="(items,indexs) in item.result.allergyIngredient" :key="indexs">{{items}}</li>
                          </ul>
                          <!-- <span class="more" @click="moreAllergen" v-if="item.result.allergyIngredient && item.result.allergyIngredient.length > 0">{{isMoreAllergen?'更多':'收起'}}</span> -->
                          <!-- {{item.result.allergyIngredient?item.result.allergyIngredient.join(","):''}} -->
                        </span>
                      </li>
                      <li>
                        <span class="assistantName">特殊人群禁用</span>
                        <span class="assistantMain noFlex">
                          <div class="item1"> 
                            <p>肝功能异常</p>
                            <p>肾功能异常</p>
                            <p>备孕期</p>
                            <p>妊娠期</p>
                            <p>哺乳期</p>
                          </div>
                          <div class="item1">
                            <p :class="liverRenalItem1== '禁用'?'color_p':''">{{liverRenalItem1}}</p>
                            <p :class="liverRenalItem2== '禁用'?'color_p':''">{{liverRenalItem2}}</p>
                            <p :class="pregnancyItem1== '禁用'?'color_p':''">{{pregnancyItem1}}</p>
                            <p :class="pregnancyItem2== '禁用'?'color_p':''">{{pregnancyItem2}}</p>
                            <p :class="pregnancyItem3== '禁用'?'color_p':''">{{pregnancyItem3}}</p>
                          </div>
                        </span>
                      </li>
                      <li>
                        <span class="assistantName">特殊人群</span>
                        <span class="assistantMain noFlex">
                          <div class="item" v-for="(items,indexs) in item.result.patientSex" :key="'sex'+indexs">
                            <p>{{items.value == 1 ?'男':'女'}}<span :class="(items.risk == 1 || items.risk == 2)?'forbiddenFill':((items.risk == 3 || items.risk == 4)?'dequeFill':'')">{{(items.risk == 1 || items.risk == 2)?'禁用':((items.risk == 3 || items.risk == 4)?'确认告警':'')}}</span></p>
                            <p v-if="items.tip">风险提示：{{items.tip}}</p>
                            <p v-if="items.advise">用药建议：{{items.advise}}</p>
                          </div>
                          <div class="item" v-for="(items,indexs) in item.result.patientAge" :key="'age'+indexs">
                            <p>{{items.value == 1 ?'儿童':(items.value == 2 ?'老年人': JSON.parse(items.value).join("~") + '岁')}}<span :class="(items.risk == 1 || items.risk == 2)?'forbiddenFill':((items.risk == 3 || items.risk == 4)?'dequeFill':'')">{{(items.risk == 1 || items.risk == 2)?'禁用':((items.risk == 3 || items.risk == 4)?'确认告警':'')}}</span></p>
                            <p v-if="items.tip">风险提示：{{items.tip}}</p>
                            <p v-if="items.advise">用药建议：{{items.advise}}</p>
                          </div>
                        </span>
                      </li>
                    </ul>
                  </template>
                  <template v-else>
                    <div class="notInfo">
                      暂无药品信息，请谨慎开方！
                    </div>
                  </template>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div class="riskItem" v-if="JSON.stringify(medicineRuleResult) !== '{}'">
            <div class="riskItamMain">
              <ul class="assistant">
                <li>
                  <span class="assistantName">药物相互作用</span>
                  <span class="assistantMain content_left noFlex">{{medicineRuleResult.medicineInteraction}}</span>
                </li>
                <li>
                  <span class="assistantName">用法用量</span>
                  <span class="assistantMain content_left noFlex">{{specification.userDoseTip}}</span>
                </li>
                <li>
                  <span class="assistantName">用药范围</span>
                  <span class="assistantMain content_left noFlex">{{medicineRuleResult.medicineRange}}</span>
                </li>
                <li>
                  <span class="assistantName">用药禁忌</span>
                  <span class="assistantMain content_left noFlex">{{medicineRuleResult.medicineContras}}</span>
                </li>
                <li>
                  <span class="assistantName">注意事项</span>
                  <span class="assistantMain content_left noFlex">{{medicineRuleResult.tipThings}}</span>
                </li>
              </ul>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </template>
  </div>
  
</template>
<script>
export default {
  name: 'riskMonitoring',
  data() {
    return {
      activeName: '',
      isMoreIndications: true,
      isMoreAllergen: true,
      specification: {},
      specificationName: '',
      specificationList: [],
      specificationInfo: {},
      medicineRuleResult:[],
      liverRenal: [],
      liverRenalItem1: '不禁用',
      liverRenalItem2: '不禁用',
      pregnancy: [],
      pregnancyItem1: '不禁用',
      pregnancyItem2: '不禁用',
      pregnancyItem3: '不禁用',
      visibleError: false,
      warningText: "",
      activeNames: ["1"],
      reportForbidList: [],
      reportOutboundList: [],
      reportAffirmList: [],
      reportHintList: []
    }
  },
  props: {
    medicineResult:{
      type: Array,
      default: []
    },
    validateResults: {
      type: Array,
      default: []
    },
    riskStatiscal: {
      type: Object,
      default: {}
    },
    dataInfoDetail: {
      type: Object,
      default: {}
    },
    warningState: Boolean
  },
  watch:{
    medicineResult(val) {
      this.medicineResult = val
      if(this.medicineResult.length > 0) {
        this.activeName = this.medicineResult[0].medicineName;
        this.getMedicineRuleResult(this.activeName);
      }else {
        this.medicineRuleResult = {}
        this.activeName = ""
        this.specificationList = []
        this.specification = {}
        this.specificationName = ""
        this.specificationInfo = {}
        this.liverRenalItem1 = "不禁用"
        this.liverRenalItem2 = "不禁用"
        this.pregnancyItem1 = "不禁用"
        this.pregnancyItem2 = "不禁用"
        this.pregnancyItem3 = "不禁用"
      }
    },
    validateResults(val) {
      this.reportForbidList =  []
      this.reportOutboundList = []
      this.reportAffirmList =  []
      this.reportHintList  = []
      if(val.length > 0) {
        val.forEach(ele => {
          if(ele.reportLevel === 1) {
            this.reportForbidList.push(ele)
          }else if(ele.reportLevel === 2) {
            this.reportOutboundList.push(ele)
          }else if(ele.reportLevel === 3) {
            this.reportAffirmList.push(ele)
          }else if(ele.reportLevel === 4) {
            this.reportHintList.push(ele)
          }
        })
      }
    }
  },
  methods:{
    handleClick(val) {
      this.getMedicineRuleResult(val.name)
    },
    // 切换规格
    specificationChange(item) {
      this.specificationInfo = {}
      this.medicineResult.forEach((ele,num) => {
        if(this.activeName == ele.medicineName) {
          this.specificationList.forEach((ele,index) => {
            if(ele.specificationName == item) {
              this.specification = ele
              let state = true
              if(JSON.stringify(this.dataInfoDetail) !== '{}') {
                this.dataInfoDetail.medicines.forEach((eles,indexs) => {
                  if(ele.specificationName == this.replaceItem(eles.specification)) {
                    state = false
                    ele.useWayAndDoseList.forEach(itemU => {
                      let takeDirectionList = itemU.takeDirection.split(',')
                      takeDirectionList.forEach(itemUs => {
                        if(itemUs === eles.takeDirection &&  num == indexs) {
                          this.decimalsTransition(itemU)
                        }
                      })
                    })
                  }else {
                      ele.otherNames.forEach(items => {
                        if(items == this.replaceItem(eles.specification)) {
                          state = false
                          ele.useWayAndDoseList.forEach(itemU => {
                            let takeDirectionList = itemU.takeDirection.split(',')
                            takeDirectionList.forEach(itemUs => {
                              if(itemUs === eles.takeDirection &&  num == indexs) {
                                this.decimalsTransition(itemU)
                              }
                            })
                          })
                        }
                      })
                    }
                })
                if(state) {
                  this.decimalsTransition(ele.useWayAndDoseList[0])
                }
              }
            }
          })
        }
      })
    },
    // 特殊字符转换
    replaceItem(item) {
      item = item.replace(/III/g, "Ⅲ")
      .replace(/II/g, "Ⅱ")
      .replace(/I/g, "Ⅰ")
      .replace(/（/g, "(")
      .replace(/）/g, ")")
      .replace(/毫克/g, "mg")
      .replace(/毫升/g, "ml")
      .replace(/克/g, "g")
      .replace(/升/g, "L")
      .replace(/x/g, "*")
      .replace(/μg/g, "ug")
      return item
    },
    getMedicineRuleResult(name) {
      this.specificationName = ""
      this.specificationInfo = {}
      this.medicineRuleResult = {}
      this.specificationList = []
      this.specification = {}
      this.liverRenalItem1 = "不禁用"
      this.liverRenalItem2 = "不禁用"
      this.pregnancyItem1 = "不禁用"
      this.pregnancyItem2 = "不禁用"
      this.pregnancyItem3 = "不禁用"
      this.medicineResult.forEach((ele,num) => {
        if(ele.result) {
          ele.result.patientAge.forEach(ele => {
            if(ele.value != 1 && ele.value != 2) {
              ele.value = ele.value.replace(")","]")
            }
          })
          if(ele.medicineName == name) {
            this.medicineRuleResult = ele.result
            this.specificationList = ele.result.specificationList;
            this.specificationList.forEach((item,index)=> {
              if(JSON.stringify(this.dataInfoDetail) !== '{}') {
                this.dataInfoDetail.medicines.forEach((eles,indexs) => {
                  if(item.specificationName == this.replaceItem(eles.specification)) {
                    this.specification = item
                    this.specificationName = item.specificationName;
                    item.useWayAndDoseList.forEach(itemU => {
                      let takeDirectionList = itemU.takeDirection.split(',')
                      takeDirectionList.forEach(itemUs => {
                        if(itemUs === eles.takeDirection &&  num == indexs) {
                          this.decimalsTransition(itemU)
                        }
                      })
                    })
                  }else {
                    item.otherNames.forEach(items => {
                      if(items == this.replaceItem(eles.specification)) {
                        this.specification = item
                        this.specificationName = item.specificationName;
                        item.useWayAndDoseList.forEach(itemU => {
                          let takeDirectionList = itemU.takeDirection.split(',')
                          takeDirectionList.forEach(itemUs => {
                            if(itemUs === eles.takeDirection &&  num == indexs) {
                              this.decimalsTransition(itemU)
                            }
                          })
                        })
                      }
                    })
                  }
                })
              }
            })
            this.liverRenal = ele.result.liverRenal;
            this.pregnancy = ele.result.pregnancy;
            this.liverRenalState(this.liverRenal);
            this.pregnancyState(this.pregnancy);
          }
        }
      })
    },
    // 小数转换
    decimalsTransition(arr) {
      arr.maxDose1 = arr.maxDose1?this.transition(arr.maxDose1):''
      arr.maxDose2 = arr.maxDose2?this.transition(arr.maxDose2):''
      arr.takeDose1 = arr.takeDose1?this.transition(arr.takeDose1):''
      arr.takeDose2 = arr.takeDose2?this.transition(arr.takeDose2):''
      arr.maxDays = arr.maxDays?this.transition(arr.maxDays):''
      this.specificationInfo = arr
    },
    // 修改小数后面是0的数据
    transition(num) {
      var str = parseFloat(num).toString().split('.');
      if(str.length == 1) {
        return str[0]
      }else {
        return num
      }
    },
    // 更多适用症
    moreIndications() {
      if(this.isMoreIndications) {
        document.getElementsByClassName('indication')[0].style.maxHeight="none";
        this.isMoreIndications = false;
      }else {
        document.getElementsByClassName('indication')[0].style.maxHeight="83px";
        this.isMoreIndications = true;
      }
    },
    // 更多过敏源
    moreAllergen() {
      if(this.isMoreAllergen) {
        document.getElementsByClassName('indication')[1].style.maxHeight="none";
        this.isMoreAllergen = false;
      }else {
        document.getElementsByClassName('indication')[1].style.maxHeight="83px";
        this.isMoreAllergen = true;
      }
    },
    toMonitorClick() {
      this.$emit("toMonitor")
    },
    // 肝肾功能禁用状态
    liverRenalState(arr) {
      arr.forEach(ele => {
        if(ele.value == 1) {
          this.liverRenalItem1 = (ele.risk == 1 || ele.risk == 2)?'禁用':'不禁用'
        } else {
          this.liverRenalItem2 = (ele.risk == 1 || ele.risk == 2)?'禁用':'不禁用'
        }
      })
    },
    pregnancyState(arr) {
      // 哺乳等禁用状态
      arr.forEach(ele => {
        if(ele.value == 1) {
          this.pregnancyItem1 = (ele.risk == 1 || ele.risk == 2)?'禁用':'不禁用'
        } else if(ele.value == 2){
          this.pregnancyItem2 = (ele.risk == 1 || ele.risk == 2)?'禁用':'不禁用'
        } else if(ele.value == 3){
          this.pregnancyItem3 = (ele.risk == 1 || ele.risk == 2)?'禁用':'不禁用'
        }
      })
    },
    // 点击一键报错
    clickVisibleError() {
      this.warningText = ""
      this.visibleError = !this.visibleError
    },
    // 一键报错确认
    warningAffirm() {
      let medicineName = ""
      let specification = ""
      let validateList = []
      this.dataInfoDetail.medicines.forEach(ele => {
        medicineName = medicineName == "" ?ele.medicineName: ("," + ele.medicineName)
        specification = specification == "" ?ele.specification: ("," + ele.medicineName)
      })
      this.validateResults.forEach(ele => {
        let obj = {
          risk: ele.risk,
          checkTag: ele.medicineName + ele.tip
        }
        validateList.push(obj)
      })
      let params = {
        medicineName: medicineName,
        specification: specification,
        patientName: this.dataInfoDetail.patientName,
        patientSex: this.dataInfoDetail.patientSex,
        patientAge: this.dataInfoDetail.patientAge,
        illDesc: this.dataInfoDetail.illDesc,//主诉
        primaryDiagnosis: this.dataInfoDetail.primaryDiagnosis,//诊断
        liver: this.dataInfoDetail.liver == "正常"? 0 : 1,
        renal: this.dataInfoDetail.renal == "正常"? 0 : 1,
        pregnancy: this.dataInfoDetail.pregnancy == "备孕"?1:(this.dataInfoDetail.pregnancy == "妊娠"?2:(this.dataInfoDetail.pregnancy == "哺乳"?3:0)),
        historyOfAllergy: this.dataInfoDetail.allergyDetail,
        historyOfSickness: this.dataInfoDetail.sicknessDetail,
        reason: this.warningText,
        doctorName: this.dataInfoDetail.doctorName,
        errorDetailList: validateList,
      }
      this.$_http.post(this.$_API.INTERFACE_AUTORE_POST_SUBMITERROR, params).then(res=> {
        if(res.success) {
          this.$message({
            type: "success",
            message: "成功"
          })
        }else {
          this.$message({
            type: "error",
            message: res.message
          })
        }
        this.visibleError = false
      }).catch(error=> {
        this.visibleError = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .riskMain {
    height: calc(100% - 542px);
    overflow: auto;
    .forbiddenFill {
      color: #fff;
      background: #fe5853;
    }
    .dequeFill {
      color: #fff;
      background: #fa9414;
    }
    .riskItemO {
      padding: 0px !important;
      .riskItemName, .reminder_content{
        margin: 0 12px 12px;
      }
    }
    .riskItem {
      padding:  0px 12px;
      .riskItemName {
        font-size: 14px;
        line-height: 22px;
        color: #000;
        margin-top: 16px;
        margin-bottom: 8px;
        font-weight: 700;
        .toMonitor {
          position: absolute;
          top: 4px;
          right: 130px;
          color: #438bef;
          line-height: 14px;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .riskItamMain {
        // border-radius: 2px;
        // box-shadow: 0px -1px 10px 0px #d9d9d9;
        // position: relative;
        // padding-bottom: 8px;
        .reminder {
          text-align: left;
          .el-icon {
            font-size: 47px;
            // color: #f5222d;
          }
          .topImage {
            height: 83px;
            width: 83px;
            position: relative;
            top: -16px;
          }
          .safetyTop {
            position: initial;
            margin-top: 61px;
          }
          .el-forbidden {
            color: #f5222d;
          }
          .el-deque {
            color: #fa9414;
          }
          .el-safety {
            color: #29c41a;
            padding-top: 92px;
          }
          .reminder_title {
            margin-top: -30px;
            font-size: 16px;
            line-height: 24px;
          }
          .safetyReminder_title {
            margin-top: -10px;
          }
          .reminder_content {
            margin-top: 6px;
            font-size: 14px;
            line-height: 24px;
            color: #595959;
            span {
              font-weight: 700;
            }
          }
          .reportSuccess {
            background: #17aa84;
            height: 62px;
            display: flex;
            align-items: center;
            img {
              width: 28px;
              height: 28px;
              margin: 0 29px;
            }
            span {
              color: #fff;
              font-size: 16px;
            }
          }
          .reportError {
            min-height: 62px;
            display: flex;
            border-bottom: 1px solid#eeeeee;
             .icon {
              width: 28px;
              height: 28px;
              margin: 16px 29px;
            }
            .content {
              width: calc(100% - 136px);
              margin-bottom: 9px;
              .titleName {
                font-size: 16px;
                line-height: 24px;
                color: #fff;
                margin-top: 9px;
                font-weight: 600;
              }
              .matter {
                font-size: 14px;
                line-height: 22px;
                color: #fff;
                img {
                  height: 16px;
                  width: 16px;
                  display: block;
                  margin-right: 7px;
                }
              }
            }
            .affirmBtn {
              width: 50px;
              background: rgba(0,0,0,0.20);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
              cursor: pointer;
              font-size: 14px;
            }
            .confirmed {
              width: 50px;
              font-size: 14px;
              text-align: center;
              background: rgba(0,0,0,0.20);
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                width: 16px;
                height: 16px;
                display: block;
                margin: auto;
                margin-bottom: 2px;
              }
            }
          }
          .reportForbid {
            background: #f94d48;
            img {
              width: 32px;
              height: 32px;
            }
          }
          .reportOutbound {
            background: #941eff;
          }
          .reportAffirm {
            background: #e23775;  
          }
          .reportHint {
            background: #6d6565;
          }
          .reminder_ul {
            padding: 12px;
            margin: 12px 8px 0px;
            background: rgba(67,139,239,0.05);
            border-radius: 4px;
            padding-bottom: 1px;
            li {
              list-style: none;
              overflow: hidden;
              margin-bottom: 11px;
              position: relative;
              >span {
                float: left;
                width: 40px;
                height: 21px;
                line-height: 21px;
                border-radius: 2px;
                text-align: center;
                margin-right: 12px;
                font-size: 12px;
              }
              p {
                float: left;
                font-size: 14px;
                color: #000;
                line-height: 22px;
                // padding-right: 30px;
                max-width: 307px;
                text-align: left;
                span {
                  padding-left: 10px;
                }
                .medicineName {
                  color: #000;
                  font-weight: 700;
                  padding: 0px;
                }
              }
            }
            .refuse {
              width: 28px;
              height: 21px;
              margin: 0px;
              background: #f5222d;
              border-radius: 2px 0px 0px 2px;
              color: #fff;
              font-size: 12px;
              position: absolute;
              top: 0;
              right: 0;
            }
            .suggest {
              padding-left: 52px;
              text-align: left;
              font-size: 12px;
              color: #262626;
              line-height: 22px;
              min-width: 300px;
              max-width: 364px;
            }
          }
        }
        /deep/.el-tabs--card>.el-tabs__header .el-tabs__nav {
          border-top: none;
          border-left: none;
        }
        /deep/.el-tabs__item {
          font-size: 13px !important;
          line-height: 38px !important;
          height: 38px !important;
          border: 1px solid #bbbbbb;
          border-bottom: none;
          margin-right: 5px;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }
        /deep/.el-tabs__item.is-active {
          background: #409EFF;
          color: #ffff;
          border: 1px solid #409EFF !important;
        }
        .specification {
          width: 394px;
          margin: auto;
          display: block;
          /deep/.el-input {
            max-width: 394px !important;
            input {
              max-width: 394px !important;
            }
          }
        }
        /deep/.el-tabs__content {
          margin-top: 1px;
        }
        .assistant {
          margin: 0px;
          margin-top: 12px;
          padding: 0px;
          >li {
            list-style: none;
            border-top: 2px solid #e4f1ff;
            color: #262626;
            display: flex;
            .assistantName {
              width: 100px;
              display: inline-block;
              line-height: 20px;
              font-size: 12px;
              padding: 8px 12px;
              display: flex;
              align-items: center;
              background: #d0dcec;
            }
            .assistantMain {
              width: calc(100% - 100px);
              display: inline-block;
              // border-left: 2px solid #e4f1ff;
              line-height: 20px;
              font-size: 12px;
              text-align: center;
              justify-content: center;
              align-items: center;
              overflow: hidden;
              display: flex;
              background: #ffffff;
              >p {
                width: 25%;
                border-right: 2px solid #e4f1ff;
                height: 100%;
                align-items: center;
                justify-content: center;
                display: flex;
                float: left;
              }
              >P:last-child {
                border-right: none;
              }
              .item {
                flex-shrink: 0;
                width: 299px;
                text-align: left;
                padding-bottom: 8px;
                border-bottom: 2px solid#e4f1ff;
                p {
                  width: 100%;
                  padding: 6px 8px 0;
                  span {
                    padding: 0px 8px;
                    line-height: 40px;
                    display: inline-block;
                    height: 21px;
                    line-height: 21px;
                    text-align: center;
                    border-radius: 2px;
                    margin-left: 10px;
                  }
                }
              }
              .item:last-child {
                border-bottom: none;
              }
              .item1 {
                overflow: hidden;
                border-bottom: 2px solid #e4f1ff;
                p {
                  width: 20%;
                  float: left;
                  border-right: 2px solid #e4f1ff;
                  height: 36px;
                  line-height: 17px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                .color_p {
                  color: #fe5853;
                }
                p:last-child {
                  border-right: none;
                }
              }
              .item1:last-child {
                border-bottom: none;
              }
            }
            .content_left {
              text-align: left;
              padding: 8px;
            }
            .noFlex {
              display: block !important;
            }
            .indication {
              overflow: hidden;
              padding: 8px;
              padding-bottom: 0;
              width: 100%;
              float: left;
              height: auto;
              li {
                float: left;
                padding: 5px 8px;
                margin-right: 8px;
                list-style: none;
                border-radius: 4px;
                background: #3489ff26;
                margin-bottom: 8px;
                color: rgba(0,0,0,0.65);
              }
            }
            .more {
              color: #438bef;
              font-size: 11px;
              float: right;
              margin-right: 5px;
              cursor: pointer;
              position: relative;
              top: 15px;
            }
          }
          .border_right {
            .assistantName {
              // border-right: 2px solid #e4f1ff;
              width: 98px;
            }
            .assistantMain {
              border-left: none;
              width: 298px;
              background: #ffffff;
            }
          }
          .border_left {
            .assistantName {
              border-left: 2px solid #e4f1ff;
            }
            .assistantMain {
              border-right: none;
              background: #ffffff;
            }
          }
        }
      }
      .notInfo {
        font-size: 16px;
        text-align: center;
        line-height: 25px;
        padding: 10px;
        color: #ffa216;
      }
    }
  }
  .riskMain::-webkit-scrollbar {
    width: 2px;
    height: 10px;
  }
  .riskMain::-webkit-scrollbar-track {
    background: rgb(239, 239, 239);
    border-radius: 2px;
  } 
  .riskMain::-webkit-scrollbar-thumb {
    background: #e4f1ff;
    border-radius: 10px;
  }
  .riskMain::-webkit-scrollbar-thumb:hover {
    background: #aaa;
  }
  .riskMain::-webkit-scrollbar-corner {
    background: #179a16;
  }
  .beforeBg {
    display: flex;
    align-items: center;
    width: 80px;
    &::before{
      content: "";
      width: 2px;
      height: 14px;
      background: #3489ff;
      border-radius: 1px;
      box-shadow: -1px 0px 2px 0px rgba(52,137,255,0.60); 
      margin-right: 5px;
    }
  }
  .collapse {
    &::-webkit-scrollbar-track-piece {
      background: #ffffff;
    }
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: #999999;
      border-radius: 20px;
    }
  }
  /deep/.el-collapse ,/deep/.el-collapse-item__header,/deep/.el-collapse-item__wrap{
    border: none;
  }
  /deep/.el-collapse-item__arrow {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
  /deep/.el-collapse-item__arrow.is-active {
    -webkit-transform: rotate(-90deg) !important;
    transform: rotate(-90deg) !important;
  }
  /deep/.el-collapse-item__header{
    padding-left: 12px;
    font-size: 14px;
    line-height: 22px;
    color: #000;
    font-weight: 700;
    &:before {
      content: "";
      width: 2px;
      height: 14px;
      background: #3489ff;
      box-shadow: -1px 0px 2px 0px rgba(52,137,255,0.60);
      border-radius: 2px;
      margin-right: 5px;
    }
  }
  /deep/.el-collapse-item__content {
    padding-top: 16px;
    padding-bottom: 12px;
    background: #e4f1ff;
  }
</style>
<style>
  .warningPop {
    z-index:10000 !important;
    border: 1px solid #387ef5 !important;
  }
  .warningPop .popper__arrow {
    border-bottom-color: #387ef5 !important;
  }
  .warningPop .titleName {
    margin: 10px 0 15px;
    font-size: 14px;
  }
  .warningPop .botton_Btm {
    text-align: right;
    margin: 20px 0px 15px;
  }
  .warningPop .botton_Btm .el-button {
    padding: 8px 20px;
  }
  .warningPop .el-button--primary {
    color: #fff;
    background-color: #387ef5;
    border-color: #387ef5;
  }
  .warningPop .el-button--primary:focus {
    color: #fff;
    background-color: #387ef5;
    border-color: #387ef5;
  }
  .warningPop .el-button--primary:hover {
    color: #fff;
    background-color: #66b1ff;
    border-color: #66b1ff;
  }
  .warningButton {
    border: 1px solid #ccc;
    padding: 5px 10px;
    color: #fe5853;
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: -6px;
    border-radius: 4px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .warningButton img {
    margin-right: 5px;
    height: 18px;
    width: 20px;
  }
</style>