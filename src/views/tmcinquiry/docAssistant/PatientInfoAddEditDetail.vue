<template>
  <div id="patientInfoBody">
    <base-loading :loading="tableLoading">
      <div v-if="patientBasicsInfoData.keyID">
        <div id="patientInfoBoxOne">
          <div class="patientBasicsInfoBox">
            <div class="patientHeadBox">
              <base-image :src="faceImage"></base-image>
            </div>
            <div class="patientBasicsInfoDiv">
              <div class="patientNameTxt">
                <span class="patientNameTxt">{{patientBasicsInfoData.patientName}}</span>
                <span class="patient-info" v-if="patientBasicsInfoData.sex">{{patientBasicsInfoData.sex===1 ? "男" : patientBasicsInfoData.sex===2 ? "女" : "未知"}}</span>
                <span class="patient-info" v-if="patientInfoData.age">{{patientInfoData.age}}岁</span>
                <img class="patient-icon_phone" v-if="patientBasicsInfoData.phone" src="./../../../assets/image/tmcinquiry/phone.png">
                <img class="patient-icon_wechat" v-if="patientBasicsInfoData.unionID" src="./../../../assets/image/tmcinquiry/wechat.png">
                <div class="patient-level" v-if="patientBasicsInfoData.patientLevel">{{patientBasicsInfoData.patientLevel}}</div>
                <el-button :type="!(patientBasicsInfoData.unionID && userInfo.jobType===1 && showMergeBtn)?'info':'danger'" v-if="userInfo.jobType===1" class="ml15" @click="handleMergePatient" :disabled="!(patientBasicsInfoData.unionID && userInfo.jobType===1 && showMergeBtn)">合并!</el-button>
              </div>
              <div>
                <span class="patientAddressTxt">{{patientBasicsInfoData.province}}{{patientBasicsInfoData.city}}</span>
                <span>{{patientBasicsInfoData.phone}}</span>
              </div>
            </div>
          </div>
          <!--        标签-->
          <div id="biaoQianBox">
            <!-- <div class="biaoQianTitleDiv marginBottom10">
              <div class="biaoQianImg" @click="addSicknessOrAllergyFun(3)">
                <img src="../../../assets/image/tmcinquiry/edit.png" />
                <span>编辑</span>
              </div>
            </div> -->
            <div role="group" aria-label="checkbox-group" class="el-checkbox-group">
              <div v-if="tagTextData && tagTextData.length > 0">
                <label v-for="(item, index) in tagTextData" :key="index" class="el-checkbox txtMarginRight" style="cursor: auto;">
                  <span class="el-checkbox__label">{{item.tagText}}</span>
                </label>
              </div>
              <div v-else class="noneTagText">
                <span>（暂无，待添加）</span>
              </div>
            </div>
            <div class="biaoQianImg" @click="addSicknessOrAllergyFun(3)">
              <img src="../../../assets/image/tmcinquiry/edit.png" />
              <span>编辑</span>
            </div>
          </div>

          <!--      form表单-->
          <div v-if="patientInfoData" id="patientFormDiv">
            <el-form :model="patientInfoData" inline :rules="formRules" ref="patientInfoForm" label-width="100px">
              <div class="collapse-panel" @click="handleShowInfo('baseContainerInfo')">
                <span class="collapse-title">基本信息</span>
                <i :class="[!baseContainerInfo?'el-icon-arrow-right':'el-icon-arrow-down']"></i>
              </div>
              <!-- 基本信息 -->
              <div v-show="baseContainerInfo" class="collapse-container">
                <el-form-item prop="patientName" label="姓名：">
                  <el-input v-model.trim="patientInfoData.patientName" type="text" placeholder="请输入" clearable maxlength="15" class="input_250" />
                </el-form-item>
                <el-form-item prop="sex" label="性别：">
                  <el-select v-model="patientInfoData.sexName" placeholder="请选择" value="" clearable filterable @change="changeSexFun" class="input_250">
                    <el-option v-for="(item,index) in sexOptions" :key="index" :label="item.sexName" :value="item.sexName"></el-option>
                  </el-select>
                </el-form-item>
                <div v-show="false">{{patientAgeFun}}</div>
                <el-form-item prop="age" label="年龄：">
                  <el-input v-model.trim="patientInfoData.age" type="text" placeholder="请输入" clearable maxlength="10" min="0" @keyup.native="loadNumber($event)" class="input_250"></el-input>
                </el-form-item>
                <el-form-item prop="height" label="身高：">
                  <el-input v-model.trim="patientRecordData.heightInfo.docItemValue" type="text" placeholder="请输入" clearable maxlength="5" class="input_250" /><span class="inputUnit">cm</span>
                </el-form-item>
                <el-form-item prop="weight" label="体重：">
                  <el-input v-model.trim="patientRecordData.weightInfo.docItemValue" type="text" placeholder="请输入" clearable maxlength="5" class="input_250" /><span class="inputUnit">kg</span>
                </el-form-item>
                <el-form-item prop="idNumber" label="身份证号：">
                  <el-input v-model.trim="patientInfoData.idNumber" type="text" maxlength="18" placeholder="请输入" clearable class="input_250" />
                </el-form-item>
                <el-form-item prop="remarks" label="备注：">
                  <el-input v-model.trim="patientInfoData.remarks" type="textarea" placeholder="请输入" clearable maxlength="300" :autosize="autosize" :show-word-limit="true" class="input_250" />
                </el-form-item>
              </div>

              <!-- 健康信息 -->
              <div class="collapse-panel" @click="handleShowInfo('healthContainerInfo')">
                <span class="collapse-title">健康信息</span>
                <i :class="[!healthContainerInfo?'el-icon-arrow-right':'el-icon-arrow-down']"></i>
              </div>
              <div v-show="healthContainerInfo" class="collapse-container">
                <div class="healthInfoRowBetween borderBottom">
                  <div class="healthInfoRow">
                    <div class="healthTitleTxt">吸烟史</div>
                    <el-radio-group v-model="patientRecordData.smokeInfo.docItemValue">
                      <el-radio label="不吸烟">不吸烟</el-radio>
                      <el-radio label="吸烟">吸烟</el-radio>
                    </el-radio-group>
                  </div>
                  <div v-if="patientRecordData.smokeInfo.docItemValue === '吸烟'">
                    <el-input class="smokeInput" size="mini" type="text" v-model.trim="patientRecordData.smokeInfo.docItemDesc" placeholder="请填写烟龄" maxlength="2" style="width: 150px;">
                      <el-button slot="append">年</el-button>
                    </el-input>
                  </div>
                </div>
                <div class="healthInfoRowBetween borderBottom">
                  <div class="healthInfoRow">
                    <div class="healthTitleTxt">饮酒史</div>
                    <el-radio-group v-model="patientRecordData.drinkInfo.docItemValue">
                      <el-radio label="不饮酒">不饮酒</el-radio>
                      <el-radio label="饮酒">饮酒</el-radio>
                    </el-radio-group>
                  </div>
                  <div v-if="patientRecordData.drinkInfo.docItemValue === '饮酒'">
                    <el-input class="smokeInput" type="text" size="mini" v-model.trim="patientRecordData.drinkInfo.docItemDesc" placeholder="请填写酒龄" maxlength="2" style="width: 150px;">
                      <el-button slot="append">年</el-button>
                    </el-input>
                  </div>
                </div>
                <div class="healthInfoRowBetween borderBottom marginBottom10">
                  <div class="healthTitleTxt">既往病史</div>
                  <el-radio-group v-model="patientRecordData.historyOfSicknessInfo.docItemValue">
                    <el-radio label="有">有</el-radio>
                    <el-radio label="无">无</el-radio>
                  </el-radio-group>
                </div>
                <div v-if="patientRecordData.historyOfSicknessInfo.docItemValue === '有'" role="group" aria-label="checkbox-group" class="el-checkbox-group">
                  <label v-for="(item, index) in historyOfSicknessData" :key="index" class="el-checkbox txtMarginRight" :class="[{ 'labelClicked': item.indexIsClicked }]" @click="clickedSicknessFun(index)">
                    <span class="el-checkbox__label" :class="[{ 'labelTxtClicked': item.indexIsClicked }]">{{item.dictName}}</span>
                  </label>
                  <label class="el-checkbox el-addBox" @click="addSicknessOrAllergyFun(1)">
                    <span class="el-checkbox__label">
                      <img class="addImg" src="../../../assets/image/tmcinquiry/add.png" />
                    </span>
                  </label>
                </div>
                <div class="healthInfoRowBetween borderBottom marginBottom10">
                  <div class="healthTitleTxt">过敏史</div>
                  <el-radio-group v-model="patientRecordData.historyOfAllergyInfo.docItemValue">
                    <el-radio label="有">有</el-radio>
                    <el-radio label="无">无</el-radio>
                  </el-radio-group>
                </div>
                <div v-if="patientRecordData.historyOfAllergyInfo.docItemValue === '有'" role="group" aria-label="checkbox-group" class="el-checkbox-group">
                  <label v-for="(item, index) in historyOfAllergyDataObj" :key="index" class="el-checkbox txtMarginRight" :class="[{ 'labelClicked': item.indexIsClicked }]" @click="clickedAllergyFun(index)">
                    <span class="el-checkbox__label" :class="[{ 'labelTxtClicked': item.indexIsClicked }]">{{item.dictName}}</span>
                  </label>
                  <label class="el-checkbox el-addBox" @click="addSicknessOrAllergyFun(2)">
                    <span class="el-checkbox__label">
                      <img class="addImg" src="../../../assets/image/tmcinquiry/add.png" />
                    </span>
                  </label>
                </div>
                <div class="healthInfoRowBetween borderBottom">
                  <div class="healthTitleTxt">肝功能</div>
                  <el-radio-group v-model="patientRecordData.liverInfo.docItemValue">
                    <el-radio label="正常">正常</el-radio>
                    <el-radio label="异常">异常</el-radio>
                  </el-radio-group>
                </div>
                <div class="healthInfoRowBetween borderBottom">
                  <div class="healthTitleTxt">肾功能</div>
                  <el-radio-group v-model="patientRecordData.renalInfo.docItemValue">
                    <el-radio label="正常">正常</el-radio>
                    <el-radio label="异常">异常</el-radio>
                  </el-radio-group>
                </div>
                <div v-if="patientInfoData.sex === 2" class="healthInfoRowBetween borderBottom">
                  <div class="healthTitleTxt">妊娠哺乳</div>
                  <el-radio-group v-model="patientRecordData.pregnancyInfo.docItemValue">
                    <el-radio label="是">是</el-radio>
                    <el-radio label="否">否</el-radio>
                  </el-radio-group>
                </div>
                <div class="healthInfoRowBetween borderBottom marginBottom10">
                  <div class="healthTitleTxt">曾用药</div>
                  <el-radio-group v-model="patientInfoData.usedDrugsFlag">
                    <el-radio label="有">有</el-radio>
                    <el-radio label="无">无</el-radio>
                  </el-radio-group>
                </div>
                <div v-if="patientInfoData.usedDrugsFlag === '有'" role="group" aria-label="checkbox-group" class="el-checkbox-group">
                  <label v-for="(item, index) in usedDrugsArr" :key="index" class="el-checkbox txtMarginRight labelClicked" @click="clickedUsedDrugs(index)">
                    <span class="el-checkbox__label labelTxtClicked">{{item.tagText}}</span>
                  </label>
                  <label class="el-checkbox el-addBox" @click="addSicknessOrAllergyFun(4)">
                    <span class="el-checkbox__label">
                      <img class="addImg" src="../../../assets/image/tmcinquiry/add.png" />
                    </span>
                  </label>
                </div>
              </div>

              <div class="collapse-panel" @click="handleShowInfo('consultationContainerInfo')">
                <span class="collapse-title">咨询信息</span>
                <i :class="[!consultationContainerInfo?'el-icon-arrow-right':'el-icon-arrow-down']"></i>
              </div>
              <!-- 咨询信息 -->
              <div v-show="consultationContainerInfo" class="collapse-container">
                <el-form-item prop="relationCode" label="患者关系：">
                  <el-select v-model="patientInfoData.relationCode" placeholder="请选择" filterable clearable value="" class="input_250">
                    <el-option v-for="(item,index) in relationOptions" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="patientLevel" label="患者分级：">
                  <el-select v-model="patientInfoData.patientLevel" placeholder="请选择" filterable clearable value="" class="input_250">
                    <el-option v-for="(item,index) in patientLevelOptions" :key="index" :label="item.levelName" :value="item.levelName"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="channelCode" label="渠道：">
                  <el-select v-model="patientInfoData.channelCode" placeholder="请选择" filterable clearable value="" class="input_250">
                    <el-option v-for="(item,index) in channelOptions" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="channelCode" label="是否曾购药：">
                  <span>{{patientInfoData.purchaseRecord}}(系统默认)</span>
                </el-form-item>
                <el-form-item prop="currentDisease" label="患者主诉：">
                  <el-input v-model.trim="patientInfoData.currentDisease" type="text" placeholder="请输入" clearable maxlength="200" :show-word-limit="true" class="input_250" />
                </el-form-item>
                <el-form-item prop="diseaseCycle" label="患病周期：">
                  <el-input v-model.trim="patientInfoData.diseaseCycle" type="text" maxlength="30" :show-word-limit="true" placeholder="请输入" clearable class="input_250" />
                </el-form-item>
                <el-form-item prop="consultationDiseases" label="咨询病种：">
                  <el-input v-model.trim="patientInfoData.consultationDiseases" type="text" placeholder="请输入" clearable maxlength="100" :show-word-limit="true" class="input_250" />
                </el-form-item>
                <el-form-item prop="consultationMedicinal" label="咨询药品：">
                  <el-input v-model.trim="patientInfoData.consultationMedicinal" type="text" placeholder="请输入" clearable maxlength="200" :show-word-limit="true" class="input_250" />
                </el-form-item>

              </div>

              <!-- 联系信息 -->
              <div class="collapse-panel" @click="handleShowInfo('contactContainerInfo')">
                <span class="collapse-title">联系信息</span>
                <i :class="[!contactContainerInfo?'el-icon-arrow-right':'el-icon-arrow-down']"></i>
              </div>
              <div v-show="contactContainerInfo" class="collapse-container">
                <el-form-item prop="phone" label="电话号码：">
                  <el-input v-model.trim="patientInfoData.phone" maxlength="11" placeholder="请输入" clearable class="input_250" />
                </el-form-item>
                <el-form-item prop="wechatAccount" label="微信账号：">
                  <el-input v-model.trim="patientInfoData.wechatAccount" type="text" maxlength="30" placeholder="请输入" clearable class="input_250" />
                </el-form-item>
                <el-form-item prop="tenQQ" label="qq：">
                  <el-input v-model.trim="patientInfoData.tenQQ" type="text" maxlength="30" placeholder="请输入" clearable class="input_250" />
                </el-form-item>
                <el-form-item prop="email" label="邮箱：">
                  <el-input v-model.trim="patientInfoData.email" type="text" maxlength="30" placeholder="请输入" clearable class="input_250" />
                </el-form-item>
                <el-form-item prop="place" label="联系地址：">
                  <el-cascader ref="placeCascader" v-model="patientInfoData.place" :options="placeOptions" @change="handleChangeAddress" label-name="省-市-区" style="width: 200px;" placeholder="请选择" filterable clearable class="input_250"></el-cascader>
                </el-form-item>
                <el-form-item prop="address" label=" ">
                  <el-input v-model.trim="patientInfoData.address" type="text" maxlength="100" placeholder="请输入" clearable class="input_250" @blur="getGeoFun" />
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
        <div class="btnBox">
          <el-button type="primary" @click="savePatientInfoFun">保存</el-button>
        </div>
      </div>
      <!--    弹出框：添加 过敏史、既往病史、标签-->
      <el-dialog title="编辑标签" :visible.sync="dialogSicknessOrAllergy" width="600px" :center="false" :before-close="handleClose">
        <div class="addLabelBody">
          <div>
            <p>创建标签：</p>
            <div class="mt24">
              <!-- <el-input v-if="[1,2].includes(addType)" v-model.trim="addData.addName" type="text" label-name="标签名字" :maxlen="6" :show-word-limit="false" /> -->
              <el-input v-if="[1,2].includes(addType)" v-model.trim="addData.addName" type="text" label-name="标签名字" :maxlength="6" :show-word-limit="false"></el-input>
              <!--              <el-input v-else-if="addType === 3" v-model.trim="addData.addName" type="text" label-name="标签名字" maxlength="20" :show-word-limit="false"/>-->
              <el-autocomplete v-else-if="addType === 3 || addType===4" v-model="addData.addName" placeholder="请输入标签名字" :fetch-suggestions="querySearchAddName" :hide-loading="true" :maxlength="6"></el-autocomplete>
              <span class="addNewLabel" @click="addSicknessOrAllergySureFun">+ 添加新标签</span>
            </div>
          </div>
          <div>
            <p class="mt24">当前标签：</p>
            <div class="mt24">
              <!--            过敏史、既往病史-->
              <div v-if="[1,2].includes(addType)" role="group" aria-label="checkbox-group" class="el-checkbox-group">
                <label v-for="(item, index) in dialogVisibleData" :key="index" class="el-checkbox txtMarginRight" :class="[{ 'labelClicked': item.indexIsClicked }]">
                  <span class="el-checkbox__label" :class="[{ 'labelTxtClicked': item.indexIsClicked }]">{{item.dictName}}</span>
                  <div class="delBox" @click="deleteLabelFun(item, index)">
                    <div class="delDiv">
                      <img class="delImg" src="../../../assets/image/tmcinquiry/delete.png" />
                    </div>
                  </div>
                </label>
              </div>
              <!--            标签-->
              <div v-else-if="addType === 3 || addType===4" role="group" aria-label="checkbox-group" class="el-checkbox-group">
                <div v-if="dialogVisibleData && dialogVisibleData.length > 0">
                  <label v-for="(item, index) in dialogVisibleData" :key="index" class="el-checkbox el-checkboxTwo txtMarginRight">
                    <span class="el-checkbox__label">{{item.tagText}}</span>
                    <div class="delBox" @click="deleteLabelFun(item, index)">
                      <div class="delDiv">
                        <img class="delImg" src="../../../assets/image/tmcinquiry/delete.png" />
                      </div>
                    </div>
                  </label>
                </div>
                <div v-else class="noneTagText">
                  <span>（暂无，待添加）</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogSicknessOrAllergy = false">取消</el-button>
          <el-button type="primary" @click="addAndDeleteSureFun">确定</el-button>
        </span>
      </el-dialog>
    </base-loading>

    <choose-patient :patientList="mergePatientList" :dialogVisible.sync="mergeDialogVisible" @updateCheckMerge="handleFreshList"></choose-patient>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Img from "@/assets/image/tmcinquiry/default-avatar.png";
import json from "@/assets/json/place.json";
import ajax from "axios";
import { REGULAR_EXPRESSION_IDNUMBER } from "@/common/Constant";
const ChoosePatient = () => import("./components/ChoosePatient");
export default {
  name: "TMCInquiry-patientInfo",
  components: {
    ChoosePatient
  },
  data () {
    return {
      mergePatientList: [],
      dialogVisible: false,
      mergeDialogVisible: false,
      baseContainerInfo: true,
      healthContainerInfo: false,
      consultationContainerInfo: false,
      contactContainerInfo: false,
      tableLoading: false,
      faceImage: Img,
      usedDrugsArr: [],
      showMergeBtn: false,
      patientBasicsInfoData: {
        sex: ""
      }, // 患者基础信息
      // 患者档案信息
      patientRecordData: {
        // 身高信息
        heightInfo: {
          patientID: "",
          orgID: "",
          docGroupCode: "D_TMC_DOCS_PERSONAL",
          docGroupName: "健康资料",
          docItemCode: "HEIGHT",
          docItemName: "身高",
          docItemValue: "",
          docItemDesc: ""
        },
        // 体重信息
        weightInfo: {
          patientID: "",
          orgID: "",
          docGroupCode: "D_TMC_DOCS_PERSONAL",
          docGroupName: "健康资料",
          docItemCode: "WEIGHT",
          docItemName: "体重",
          docItemValue: "",
          docItemDesc: ""
        },
        // 吸烟史
        smokeInfo: {
          patientID: "",
          orgID: "",
          docGroupCode: "D_TMC_DOCS_HABIT",
          docGroupName: "生活习惯",
          docItemCode: "SMOKE",
          docItemName: "吸烟史",
          docItemValue: "不吸烟",
          docItemDesc: ""
        },
        // 饮酒史
        drinkInfo: {
          patientID: "",
          orgID: "",
          docGroupCode: "D_TMC_DOCS_HABIT",
          docGroupName: "生活习惯",
          docItemCode: "DRINK",
          docItemName: "饮酒史",
          docItemValue: "不饮酒",
          docItemDesc: ""
        },
        // 既往病史
        historyOfSicknessInfo: {
          patientID: "",
          orgID: "",
          docGroupCode: "D_TMC_DOCS_SICKNESS",
          docGroupName: "疾病史",
          docItemCode: "ILLNESS",
          docItemName: "既往病史",
          docItemValue: "无",
          docItemDesc: ""
        },
        // 过敏史
        historyOfAllergyInfo: {
          patientID: "",
          orgID: "",
          docGroupCode: "D_TMC_DOCS_SICKNESS",
          docGroupName: "疾病史",
          docItemCode: "ALLERGY",
          docItemName: "过敏史",
          docItemValue: "无",
          docItemDesc: ""
        },
        // 肝功能
        liverInfo: {
          patientID: "",
          orgID: "",
          docGroupCode: "D_TMC_DOCS_SICKNESS",
          docGroupName: "疾病史",
          docItemCode: "LIVER",
          docItemName: "肝功能",
          docItemValue: "正常",
          docItemDesc: ""
        },
        // 肾功能
        renalInfo: {
          patientID: "",
          orgID: "",
          docGroupCode: "D_TMC_DOCS_SICKNESS",
          docGroupName: "疾病史",
          docItemCode: "KIDNEY",
          docItemName: "肾功能",
          docItemValue: "正常",
          docItemDesc: ""
        },
        // 妊娠哺乳
        pregnancyInfo: {
          patientID: "",
          orgID: "",
          docGroupCode: "D_TMC_DOCS_SICKNESS",
          docGroupName: "疾病史",
          docItemCode: "PREGNANCY",
          docItemName: "妊娠哺乳",
          docItemValue: "否",
          docItemDesc: ""
        }
      },
      patientInfoData: {}, // 患者信息-输入
      // 患者性别集合
      sexOptions: [
        { sex: 1, sexName: "男" },
        { sex: 2, sexName: "女" }
      ],
      placeOptions: json, // 地址下拉级联
      relationOptions: [], // 患者关系集合
      patientLevelOptions: [], // 患者分级集合
      channelOptions: [], // 渠道集合
      // 标签信息
      tagTextDataAll: [], // 该机构所有标签
      tagTextData: [], // 患者标签集合
      // 存放提醒框的数据
      remindData: [],
      // 健康信息
      healthInfo: {
        smoke: "不吸烟",
        smokeYear: "",
        drink: "不饮酒",
        liver: "正常",
        renal: "正常",
        pregnancy: "否",
        historyOfSickness: "无",
        historyOfSicknessDetail: "",
        historyOfAllergy: "无",
        historyOfAllergyDetail: ""
      },
      historyOfSicknessData: [], // 既往病史标签集合
      historyOfAllergyDataObj: [], // 过敏史标签集合
      patientSicknessData: [], // 患者的既往病史集合
      patientAllergyData: [], // 患者的过敏史集合
      // 添加（既往病史、过敏史）新标签
      dialogVisibleData: [], // 显示
      dialogSicknessOrAllergy: false,
      addType: -1, // 1：既往病史，2：过敏史
      addData: {
        addName: ""
      },
      // 表单验证
      formRules: {
        idNumber: [
          {
            required: false,
            message: ""
          },
          {
            trigger: "blur",
            pattern: REGULAR_EXPRESSION_IDNUMBER,
            message: "请输入有效的身份证号（18位）"
          }
        ],
        phone: [
          {
            required: false,
            message: ""
          },
          {
            trigger: "blur",
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码（11位）"
          }
        ]
      },
      autosize: { minRows: 3, maxRows: 6 },
      searchState: false // 是否查询后
    };
  },
  computed: {
    ...mapGetters(["userInfo", "tmc"]),
    patientAgeFun () {
      let that = this;
      // 根据身份证号：计算出生日期、性别、年龄
      // 计算出生年及出生年月
      if (this.searchState) {
        if (that.patientInfoData.idNumber && that.patientInfoData.idNumber.length === 18) {
          // 出生日期
          if (that.patientInfoData.birthDate === "1900-01-01") {
            that.patientInfoData.birthDate = that.getAnalysisIdCard(that.patientInfoData.idNumber, 1);
          }
          if (that.patientInfoData.birthYear === 0 || !that.patientInfoData.birthYear) {
            that.patientInfoData.birthYear = that.patientInfoData.birthDate.substring(0, 4);
          }
          // 性别
          if (!that.patientInfoData.sex || that.patientInfoData.sex === "") {
            that.patientInfoData.sex = that.getAnalysisIdCard(that.patientInfoData.idNumber, 2);
            if (that.patientInfoData.sex === 1) {
              that.patientInfoData.sexName = "男";
            } else if (that.patientInfoData.sex === 2) {
              that.patientInfoData.sexName = "女";
            }
          }
          // 年龄
          if (!that.patientInfoData.age || that.patientInfoData.age === "") {
            this.$set(that.patientInfoData, "age", that.getAnalysisIdCard(that.patientInfoData.idNumber, 3));
          }
        }
      }
      return "执行了";
    }
  },
  watch: {
    "tmc.patientID": {
      deep: true,
      async handler (val) {
        if (this.tmc.patientID) {
          if (this.tmc.patient.faceImage && this.tmc.patient.faceImage !== "") {
            this.faceImage = this.tmc.patient.faceImage;
          }
          await this.getPatientInfoDataFun();
          this.getPatientPurchaseRecord();
          this.getCheckMerge();
        }
      }
    }
  },
  async created () {
    if (this.tmc.patientID) {
      if (this.tmc.patient.faceImage && this.tmc.patient.faceImage !== "") {
        this.faceImage = this.tmc.patient.faceImage;
      }
      await this.getPatientInfoDataFun();
      this.getPatientPurchaseRecord();
      this.getCheckMerge();
    }
    this.$bus.$on("refreshCheckMerge", () => {
      this.getCheckMerge();
    });
  },
  async activated () {
    if (this.tmc.patientID) {
      if (this.tmc.patient.faceImage && this.tmc.patient.faceImage !== "") {
        this.faceImage = this.tmc.patient.faceImage;
      }
      await this.getPatientInfoDataFun();
      this.getPatientPurchaseRecord();
      this.getCheckMerge();
    }
  },
  methods: {
    loadNumber: function (event) {
      var elValue = this.patientInfoData.age;
      var reg = /^((?!0)\d{1,3}|150)$/;
      if (!elValue.match(reg)) {
        this.$set(this.patientInfoData, "age", 1);
        return false;
      } else {
        return true;
      }
    },
    // 合并
    async handleMergePatient () {
      await this.getCheckMerge();
      this.mergeDialogVisible = true;
    },
    async handleFreshList () {
      this.getCheckMerge();
    },
    // 检查能否合并
    async getCheckMerge () {
      console.log("--");
      try {
        if (this.userInfo.jobType === 1 && this.patientBasicsInfoData.phone) {
          let params = {
            orgID: this.userInfo.orgID,
            assistantStaffID: this.userInfo.keyID,
            patientID: this.tmc.patientID,
            phone: this.patientBasicsInfoData.phone
          };
          const res = await this.$_http.post(this.$_API.INTERFACE_POST_CHECK_MERGESTATUS, params);
          if (res.data) {
            let data = res.data || {};
            this.showMergeBtn = data.canMerge || false;
            this.mergePatientList = JSON.parse(JSON.stringify(data.patientList || []));
          }
        }
      } catch (error) {

      }
    },
    // 展开div
    handleShowInfo (field) {
      this[field] = !this[field];
    },
    // 查询患者信息
    async getPatientInfoDataFun () {
      try {
        let params = {
          orgID: this.userInfo.orgID,
          keyID: this.tmc.patientID
        };
        this.tableLoading = true;
        const res = await this.$_http.get(this.$_API.INTERFACE_TMC_GET_PATIENT_INFO, { params });
        if (res.data && res.data.keyID) {
          this.patientBasicsInfoData = { ...res.data };
          this.patientInfoData = { ...res.data };
          // 转换地址信息
          let provinceCode = res.data.provinceCode;
          let cityCode = res.data.cityCode;
          let areaCode = res.data.areaCode;
          let place = [provinceCode, cityCode, areaCode];
          this.$set(this.patientInfoData, "place", place);
          this.$set(this.patientInfoData, "age", "");
          this.tagTextData = [];
          if (this.patientInfoData.patientTags && this.patientInfoData.patientTags.length > 0) {
            let tagTextDataOld = this.patientInfoData.patientTags.split(",");
            tagTextDataOld.forEach(item => {
              let obj = {
                tagText: item
              };
              this.tagTextData.push(obj);
            });
          }
        }
        this.usedDrugsArr = [];
        let tmpStr = res.data.usedDrugs || "";
        let tmpList = [];
        if (tmpStr.length > 0) {
          tmpList = tmpStr.split(",");
        }
        tmpList.map(item => {
          let obj = {
            tagText: item
          };
          this.usedDrugsArr.push(obj);
        });
        if (this.usedDrugsArr.length > 0) {
          this.$set(this.patientInfoData, "usedDrugsFlag", "有");
        } else {
          this.$set(this.patientInfoData, "usedDrugsFlag", "无");
        }

        if (!this.patientInfoData.sex) {
          this.patientInfoData.sex = "";
          this.$set(this.patientInfoData, "sexName", "");
        } else if (this.patientInfoData.sex === 1) {
          this.$set(this.patientInfoData, "sexName", "男");
        } else if (this.patientInfoData.sex === 2) {
          this.$set(this.patientInfoData, "sexName", "女");
        }
        if (this.patientInfoData.birthYear && this.patientInfoData.birthYear !== 0) {
          this.getAge(this.patientInfoData.birthYear);
        }
        if (!this.patientInfoData.birthYear && !this.patientInfoData.birthDate) {
          this.patientInfoData.age = "";
        } else if (this.patientInfoData.birthDate === "1900-01-01" && this.patientInfoData.birthYear === 0) {
          this.patientInfoData.age = "";
        }
        this.searchState = true;
        this.getPatientLevelDataFun();
        this.getTagTextDataFun();
      } catch (error) {

      } finally {
        this.tableLoading = false;
      }
    },
    // 查询：患者分级信息
    getPatientLevelDataFun () {
      let params = {
        orgID: this.userInfo.orgID
      };
      this.$_http.get(this.$_API.INTERFACE_TMC_GET_PATIENT_LEVEL_LIST, { params }).then(res => {
        if (res.data && res.data.length > 0) {
          let arr = [];
          res.data.forEach(item => {
            if (item.isDisable === 0) {
              arr.push(item);
            }
          });
          this.patientLevelOptions = arr;
        } else {
          this.patientLevelOptions = [];
        }
        this.getPatientRecordDataFun();
      });
    },
    // 查询：患者档案信息
    getPatientRecordDataFun () {
      let params = {
        orgID: this.userInfo.orgID,
        keyID: this.tmc.patientID
      };
      this.$_http.get(this.$_API.INTERFACE_TMC_GET_PATIENT_RECORD, { params }).then(res => {
        if (res.data && res.data.length > 0) {
          res.data.forEach(item => {
            if (item.docGroupCode === this.patientRecordData.heightInfo.docGroupCode && item.docItemCode === this.patientRecordData.heightInfo.docItemCode) { // 身高
              this.patientRecordData.heightInfo.docItemValue = item.docItemValue;
            } else if (item.docGroupCode === this.patientRecordData.weightInfo.docGroupCode && item.docItemCode === this.patientRecordData.weightInfo.docItemCode) { // 体重
              this.patientRecordData.weightInfo.docItemValue = item.docItemValue;
            } else if (item.docGroupCode === this.patientRecordData.smokeInfo.docGroupCode && item.docItemCode === this.patientRecordData.smokeInfo.docItemCode) { // 吸烟史
              this.patientRecordData.smokeInfo.docItemValue = item.docItemValue;
              this.patientRecordData.smokeInfo.docItemDesc = item.docItemDesc;
            } else if (item.docGroupCode === this.patientRecordData.drinkInfo.docGroupCode && item.docItemCode === this.patientRecordData.drinkInfo.docItemCode) { // 饮酒史
              this.patientRecordData.drinkInfo.docItemValue = item.docItemValue;
              this.patientRecordData.drinkInfo.docItemDesc = item.docItemDesc;
            } else if (item.docGroupCode === this.patientRecordData.historyOfSicknessInfo.docGroupCode && item.docItemCode === this.patientRecordData.historyOfSicknessInfo.docItemCode) { // 既往病史
              this.patientRecordData.historyOfSicknessInfo.docItemValue = item.docItemValue;
              this.patientRecordData.historyOfSicknessInfo.docItemDesc = item.docItemDesc;
            } else if (item.docGroupCode === this.patientRecordData.historyOfAllergyInfo.docGroupCode && item.docItemCode === this.patientRecordData.historyOfAllergyInfo.docItemCode) { // 过敏史
              this.patientRecordData.historyOfAllergyInfo.docItemValue = item.docItemValue;
              this.patientRecordData.historyOfAllergyInfo.docItemDesc = item.docItemDesc;
            } else if (item.docGroupCode === this.patientRecordData.liverInfo.docGroupCode && item.docItemCode === this.patientRecordData.liverInfo.docItemCode) { // 肝功能
              this.patientRecordData.liverInfo.docItemValue = item.docItemValue;
            } else if (item.docGroupCode === this.patientRecordData.renalInfo.docGroupCode && item.docItemCode === this.patientRecordData.renalInfo.docItemCode) { // 肾功能
              this.patientRecordData.renalInfo.docItemValue = item.docItemValue;
            } else if (item.docGroupCode === this.patientRecordData.pregnancyInfo.docGroupCode && item.docItemCode === this.patientRecordData.pregnancyInfo.docItemCode) { // 肾功能
              this.patientRecordData.pregnancyInfo.docItemValue = item.docItemValue;
            }
          });
        }
        this.loadDictionary();
      });
    },
    // 曾够药
    async getPatientPurchaseRecord () {
      let params = {
        orgID: this.userInfo.orgID,
        patientID: this.tmc.patientID
      };
      const res = await this.$_http.get(this.$_API.INTERFACE_TMC_GET_PATIENTPURCHASWRECORD, { params });
      if (res.data) {
        if (res.data.length <= 0) {
          this.patientInfoData.purchaseRecord = "否";
        } else if (res.data.length > 0) {
          this.patientInfoData.purchaseRecord = "是";
        }
      }
    },
    // 根据字典类型获取字典数据
    ...mapActions({
      getDictionary: "dictionary/getDictionary"
    }),
    async loadDictionary () {
      try {
        // 获取患者关系
        let res = await this.getDictionary({ systemCode: "TMC", groupCode: "D_TMC_PATIENT_RELATION", parentDictCode: "" });
        this.relationOptions = res;
        // 获取患者渠道
        let channelRes = await this.getDictionary({ systemCode: "TMC", groupCode: "D_TMC_PATIENT_FROM", parentDictCode: "" });
        this.channelOptions = channelRes;
        // 获取患者疾病史的既往病史
        let illnessRes = await this.getDictionary({ systemCode: "TMC", groupCode: "D_TMC_DOCS_SICKNESS_2ND", parentDictCode: "ILLNESS" });
        if (illnessRes) {
          let resArray = illnessRes;
          let showArray = [];
          resArray.forEach(item => {
            if (item.dictName !== "+++") {
              this.$set(item, "indexIsClicked", false);
              showArray.push(item);
            }
          });
          if (this.patientRecordData.historyOfSicknessInfo.docItemValue === "有" && this.patientRecordData.historyOfSicknessInfo.docItemDesc) {
            let alrData = this.patientRecordData.historyOfSicknessInfo.docItemDesc.split(",");
            let alreadyData = [];
            alrData.forEach(item => {
              let obj = {
                dictName: item,
                indexIsClicked: false
              };
              alreadyData.push(obj);
            });
            showArray.forEach(item => {
              alreadyData.forEach(it => {
                if (item.dictName === it.dictName) {
                  item.indexIsClicked = true;
                  it.indexIsClicked = true;
                }
              });
            });
            alreadyData.forEach(item => {
              if (item.indexIsClicked === false) {
                item.indexIsClicked = true;
                showArray.push(item);
              }
            });
          }
          this.historyOfSicknessData = JSON.parse(JSON.stringify([...showArray]));
        }
        // 获取患者疾病史的过敏史
        let allergy = await this.getDictionary({ systemCode: "TMC", groupCode: "D_TMC_DOCS_SICKNESS_2ND", parentDictCode: "ALLERGY" });
        if (allergy) {
          let resArray = allergy;
          let showArray = [];
          resArray.map(item => {
            if (item.dictName !== "+++") {
              this.$set(item, "indexIsClicked", false);
              showArray.push(item);
            }
          });
          if (this.patientRecordData.historyOfAllergyInfo.docItemValue === "有" && this.patientRecordData.historyOfAllergyInfo.docItemDesc) {
            let alrData = this.patientRecordData.historyOfAllergyInfo.docItemDesc.split(",");
            let alreadyData = [];
            alrData.map(item => {
              let obj = {
                dictName: item,
                indexIsClicked: false
              };
              alreadyData.push(obj);
            });
            showArray.map(item => {
              alreadyData.map(it => {
                if (item.dictName === it.dictName) {
                  item.indexIsClicked = true;
                  it.indexIsClicked = true;
                }
              });
            });
            alreadyData.map(item => {
              if (item.indexIsClicked === false) {
                item.indexIsClicked = true;
                showArray.push(item);
              }
            });
          }
          this.historyOfAllergyDataObj = JSON.parse(JSON.stringify([...showArray]));
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 转换：选择性别
    changeSexFun () {
      if (this.patientInfoData.sexName === "男") {
        this.patientInfoData.sex = 1;
      } else if (this.patientInfoData.sexName === "女") {
        this.patientInfoData.sex = 2;
      }
    },
    // 根据出生日期算出年龄
    jsGetAge (birthDay) {
      let birthday = new Date(birthDay.replace(/-/g, "\/"));
      let d = new Date();
      this.$set(this.patientInfoData, "age", d.getFullYear() - birthday.getFullYear() - (((d.getMonth() < birthday.getMonth() || d.getMonth() === birthday.getMonth()) && d.getDate() < birthday.getDate()) ? 1 : 0));
    },
    getAge (birthYear) {
      let myDate = new Date();
      let tYear = myDate.getFullYear();
      this.patientInfoData.age = tYear - birthYear;
    },
    // 转换：所选省市区
    handleChangeAddress () {
      this.$refs.patientInfoForm.validateField("place");
      let node3 = this.$refs.placeCascader.getCheckedNodes();
      if (node3.length === 0) {
        return;
      }
      let node2 = node3[0].parent;
      let node1 = node2.parent;
      this.patientInfoData.area = node3[0].label;
      this.patientInfoData.areaCode = node3[0].value;
      this.patientInfoData.city = node2.label;
      this.patientInfoData.cityCode = node2.value;
      this.patientInfoData.province = node1.label;
      this.patientInfoData.provinceCode = node1.value;
    },
    // 定位：根据所选省市区及详细地址获取坐标
    getGeoFun () {
      if (!this.patientInfoData.area) {
        this.$notify.error({
          title: "提示",
          message: "请完善地址信息"
        });
        return;
      }
      this.$_notify({
        title: "温馨提示",
        dangerouslyUseHTMLString: true,
        type: "info",
        duration: 10000,
        message:
          "如果您不确定坐标是否正确，请使用<a href='https://lbs.amap.com/console/show/picker' style='color:#438bef' target='_blank'>坐标标注工具</a>进行选择，手动填写"
      });
      let keys = {
        new: "f778c5056f3e7ff641dab8211a051c6b"
      };
      let params = {
        output: "json",
        key: keys.new,
        address: this.patientInfoData.province + this.patientInfoData.city + this.patientInfoData.area + this.patientInfoData.address
      };
      ajax.get("https://restapi.amap.com/v3/geocode/geo", { params: params }).then(res => {
        let result = res.data.geocodes[0];
        this.$_notify({
          title: "逆地址坐标解析",
          dangerouslyUseHTMLString: true,
          type: "success",
          message:
            "<p>结构化地址信息:" +
            result.formatted_address +
            "</p><p>地址所在的省份名:" +
            result.province +
            "</p><p>地址所在的城市名:" +
            result.city +
            "</p><p>匹配级别:" +
            result.level +
            "</p><p style='color:red'>坐标点:" +
            result.location +
            "</p>"
        });
        let location = result.location.split(",");
        this.patientInfoData.longitude = location[0];
        this.patientInfoData.latitude = location[1];
      }).catch(err => console.log(err));
    },
    // 查询：机构下所有的标签
    getTagTextDataFun () {
      let params = { orgID: this.userInfo.orgID };
      this.$_http.get(this.$_API.INTERFACE_TMC_GET_ORG_TAG, { params }).then(res => {
        if (!res.data) return;
        this.tagTextDataAll = res.data;
      });
    },
    // 操作：点击既往病史的某个标签
    clickedSicknessFun (index) {
      this.historyOfSicknessData[index].indexIsClicked = !this.historyOfSicknessData[index].indexIsClicked;
    },
    // 曾用药
    clickedUsedDrugs (index) {
      let item = this.usedDrugsArr[index];
      item.indexIsClicked = true;
      this.$set(this.usedDrugsArr, index, item);
    },
    // 操作：点击过敏史的某个标签
    clickedAllergyFun (index) {
      this.historyOfAllergyDataObj[index].indexIsClicked = !this.historyOfAllergyDataObj[index].indexIsClicked;
    },
    // 操作：添加
    addSicknessOrAllergyFun (num) {
      if (num === 1) {
        this.addType = 1;
        this.dialogVisibleData = [...this.historyOfSicknessData];
      } else if (num === 2) {
        this.addType = 2;
        this.dialogVisibleData = [...this.historyOfAllergyDataObj];
      } else if (num === 3) {
        this.addType = 3;
        this.dialogVisibleData = [...this.tagTextData];
      } else if (num === 4) {
        this.addType = 4;
        this.dialogVisibleData = [...this.usedDrugsArr];
      } else {
        return;
      }
      this.addData = {};
      this.dialogSicknessOrAllergy = true;
    },
    // 操作：添加新标签 > 标签、既往病史、过敏史
    addSicknessOrAllergySureFun () {
      if (!this.addData.addName || this.addData.addName === "") {
        this.$_error("请输入标签名字");
        return;
      }
      this.addData.addName = (this.addData.addName).replace(/(^\s*)|(\s*$)/g, "");
      let isSecond = false;
      if (this.addType === 1 || this.addType === 2) {
        this.dialogVisibleData.forEach(item => {
          if (this.addData.addName === item.dictName) {
            isSecond = true;
          }
        });
      } else if (this.addType === 3) {
        this.dialogVisibleData.forEach(item => {
          if (this.addData.addName === item.tagText) {
            isSecond = true;
          }
        });
      } else if (this.addType === 4) {
        this.dialogVisibleData.forEach(item => {
          if (this.addData.addName === item.tagText) {
            isSecond = true;
          }
        });
      }
      if (isSecond) {
        this.$_error("请勿添加重复的标签");
        return;
      }
      let obj = {};
      if (this.addType === 1 || this.addType === 2) {
        obj = {
          dictName: this.addData.addName,
          indexIsClicked: true
        };
      } else if (this.addType === 3 || this.addType === 4) {
        obj = {
          tagText: this.addData.addName
        };
      }
      this.dialogVisibleData.push(obj);
    },
    // 操作：删除某个标签 <既往病史、过敏史>
    deleteLabelFun (item, index) {
      this.dialogVisibleData.splice(index, 1);
    },
    // 操作：确认保存<增加、删除的标签>
    addAndDeleteSureFun () {
      if (this.tableLoading) {
        return;
      }
      this.tableLoading = true;
      if (this.addType === 1) {
        this.historyOfSicknessData = [...this.dialogVisibleData];
      } else if (this.addType === 2) {
        this.historyOfAllergyDataObj = [...this.dialogVisibleData];
      } else if (this.addType === 3) {
        this.tagTextData = [...this.dialogVisibleData];
      } else if (this.addType === 4) {
        this.usedDrugsArr = [...this.dialogVisibleData];
      }
      this.$forceUpdate();
      this.dialogSicknessOrAllergy = false;
      this.tableLoading = false;
    },
    // 操作：关闭dialog
    handleClose () {
      this.dialogSicknessOrAllergy = false;
    },
    // 触发：标签名字输入值进行模糊查询，并给出完整类似的提示
    querySearchAddName (queryString, cb) {
      if (this.addData.addName && this.addData.addName !== "") {
        this.remindData = [];
        let nameTipsArray = [];
        if (this.tagTextDataAll && this.tagTextDataAll.length > 0) {
          this.tagTextDataAll.forEach((item) => {
            if ((item.tagText).toLowerCase().indexOf((this.addData.addName).toLowerCase()) !== -1) {
              let obj = { tagText: "" };
              obj.value = item.tagText;
              this.remindData.push(obj);
            }
          });
          nameTipsArray = this.remindData;
          cb(nameTipsArray);
        }
      } else {
        // eslint-disable-next-line standard/no-callback-literal
        cb([]);
      }
    },
    // 操作：保存 > 患者信息、患者档案
    savePatientInfoFun () {
      this.$refs.patientInfoForm.validate(valid => {
        // 检查表单：医生信息
        if (!valid || this.tableLoading) {
          return;
        }
        // 存储患者信息
        // 姓名、性别、年龄、身份证号、联系电话、微信账号、联系地址
        // 患者关系
        if (this.patientInfoData.relationCode) {
          let itemInfo = this.relationOptions.find(item => {
            return this.patientInfoData.relationCode === item.dictCode;
          });
          this.patientInfoData.relationName = itemInfo.dictName;
        }
        // 患者分级
        // 渠道
        if (this.patientInfoData.channelCode) {
          let itemInfo = this.channelOptions.find(item => {
            return this.patientInfoData.channelCode === item.dictCode;
          });
          this.patientInfoData.channelName = itemInfo.dictName;
        }
        this.patientInfoData.personID = this.tmc.personID;
        this.patientInfoData.inquiryID = this.tmc.inquiryID;
        this.patientInfoData.orgID = this.userInfo.orgID;
        this.patientInfoData.doctorID = this.tmc.doctorStaffID;
        let myDate = new Date();
        let tYear = myDate.getFullYear();
        if (this.patientInfoData.age !== "") {
          this.patientInfoData.birthYear = tYear - this.patientInfoData.age;
        }
        if (this.patientInfoData.usedDrugsFlag === "有") {
          let tmpList = [];
          this.usedDrugsArr.map(item => {
            tmpList.push(item.tagText);
          });
          this.patientInfoData.usedDrugs = tmpList.join(",");
        } else {
          this.patientInfoData.usedDrugs = "";
        }
        let data = { ...this.patientInfoData };
        // 现病史、患病周期、咨询病种、咨询药品、备注
        // 患者标签
        let patientTagsOld = this.tagTextData.map(item => {
          return item.tagText;
        });
        data.patientTags = patientTagsOld.join(",");
        // 存储患者档案信息
        // 身高、体重
        // 吸烟史、烟龄
        if (this.patientRecordData.smokeInfo.docItemValue === "不吸烟") {
          this.patientRecordData.smokeInfo.docItemDesc = "";
        }
        // 饮酒史
        // 既往病史
        if (this.patientRecordData.historyOfSicknessInfo.docItemValue === "无") {
          this.patientRecordData.historyOfSicknessInfo.docItemDesc = "";
        } else {
          let sendArray = [];
          this.historyOfSicknessData.forEach(item => {
            if (item.indexIsClicked) {
              sendArray.push(item.dictName);
            }
          });
          this.patientRecordData.historyOfSicknessInfo.docItemDesc = sendArray.join(",");
        }

        // 过敏史
        if (this.patientRecordData.historyOfAllergyInfo.docItemValue === "无") {
          this.patientRecordData.historyOfAllergyInfo.docItemDesc = "";
        } else {
          let sendArray = [];
          this.historyOfAllergyDataObj.forEach(item => {
            if (item.indexIsClicked) {
              sendArray.push(item.dictName);
            }
          });
          this.patientRecordData.historyOfAllergyInfo.docItemDesc = sendArray.join(",");
        }
        // 肝功能、肾功能、妊娠哺乳
        let dataTwo = [
          this.patientRecordData.heightInfo,
          this.patientRecordData.weightInfo,
          this.patientRecordData.smokeInfo,
          this.patientRecordData.drinkInfo,
          this.patientRecordData.historyOfSicknessInfo,
          this.patientRecordData.historyOfAllergyInfo,
          this.patientRecordData.liverInfo,
          this.patientRecordData.renalInfo,
          this.patientRecordData.pregnancyInfo
        ];
        dataTwo.forEach(item => {
          item.patientID = this.tmc.patientID;
          item.orgID = this.userInfo.orgID;
        });
        this.$confirm("确认保存患者信息吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.tableLoading = true;
          // 保存患者信息
          this.$_http.post(this.$_API.INTERFACE_TMC_POST_PATIENT_INFO_SAVE, data).then(res => {
            // 保存患者档案
            this.$_http.post(this.$_API.INTERFACE_TMC_POST_PATIENT_INFO_SAVE_DOC, dataTwo).then(res => {
              this.$notify({
                title: "成功",
                message: "保存患者信息成功",
                type: "success"
              });
              this.getPatientPurchaseRecord();
              this.getPatientInfoDataFun();
            }).finally(it => {
              this.tableLoading = false;
            });
          }).catch(it => {
            this.tableLoading = false;
          });
        }).catch(() => {
          this.tableLoading = false;
          this.$notify.info({
            title: "已取消",
            message: "已取消保存患者信息"
          });
        });
      });
    },
    // 转换：根据身份证号解析出生年月及年龄
    getAnalysisIdCard (idNumber, type) {
      if (type === 1) {
        // 获取出生日期
        let birth = idNumber.substring(6, 10) + "-" + idNumber.substring(10, 12) + "-" + idNumber.substring(12, 14);
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
        if (idNumber.substring(10, 12) < month || (idNumber.substring(10, 12) === month && idNumber.substring(12, 14) <= day)) {
          age++;
        }
        return age;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#patientInfoBody {
  // width: 460px;
  #patientInfoBoxOne {
    padding: 20px 20px 0 20px;
    .patientBasicsInfoBox {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      // 头像
      .patientHeadBox {
        width: 64px;
        height: 64px;
        margin-right: 20px;
        .peach-image {
          width: 64px;
          height: 64px;
          border-radius: 5px;
        }
      }
      .patientBasicsInfoDiv {
        position: relative;
        /*display: flex;*/
        /*justify-content: center;*/
        /*align-items: center;*/
        // width: 400px;
        .patientNameTxt {
          color: #080808;
          font-weight: bold;
          margin-bottom: 10px;
          margin-right: 12px;
        }
        .mergeBtn {
          position: absolute;
          top: 10px;
          left: 220px;
        }
        .patient-info {
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          margin-right: 8px;
        }
        .patient-icon_phone {
          width: 12px;
          height: 12px;
          margin-right: 5px;
        }
        .patient-icon_wechat {
          width: 12px;
          height: 12px;
          margin-right: 8px;
        }
        .patient-level {
          border-radius: 2px;
          opacity: 0.5;
          border: 1px solid rgba(255, 161, 2, 1);
          color: rgba(255, 161, 2, 1);
          font-size: 12px;
          display: inline-block;
          padding: 1px 4px 1px 4px;
        }

        .patientAddressTxt {
          margin-right: 20px;
          line-height: 25px;
          color: #080808;
        }
      }
    }
    .patientInfoTitleBox {
      padding-top: 10px;
      padding-bottom: 10px;
      color: #121212;
    }
    #patientFormDiv {
      min-width:370px;
      max-width: 560px;
      .el-form--inline .el-form-item {
        margin-right: 0;
      }
      .el-form-item__label {
        /*input输入框标题文本调整*/
        text-align: left;
      }
      .el-form-item__content {
        .el-input,
        .el-textarea {
          /*input输入框宽度调整*/
          width: 300px;
          max-width: none;
        }
        .el-select {
          /*div的宽度调整有效*/
          /*width: 300px;*/
          /*max-width: none;*/
          .el-input {
            /*选择框的宽度调整《无效果。。。》*/
            width: 300px;
            max-width: none;
          }
        }
      }
      .inputUnit {
        position: absolute;
        right: 10px;
        top: 0;
        color: #868888;
      }
    }
    #biaoQianBox {
      padding-top: 16px;
      .el-checkbox-group {
        // width: 350px;
        display: inline-block;
      }
      .biaoQianImg {
        float: right;
        align-items: center;
        color: #438bef;
        cursor: pointer;
        position: relative;
        width: 50px;
        img {
          width: 19px;
          height: 19px;
        }
        span {
          font-size: 13px;
          color: rgba(67, 139, 239, 1);
          position: absolute;
          width: 30px;
        }
      }
      .biaoQianTitleDiv {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .biaoQianTitle {
          color: #121212;
        }
      }
      .el-checkbox {
        margin-bottom: 15px;
        padding: 5px 8px;
        border: 1px solid rgba(67, 139, 239, 1);
        border-radius: 2px;
        opacity: 0.5;
        .el-checkbox__label {
          padding-left: 0;
          color: rgba(67, 139, 239, 1);
        }
      }
      .labelClicked {
        border: 1px solid #438bef;
      }
    }
    #healthBox {
      .smokeInput {
        width: 80px;
        padding: 5px 5px;
        border: none;
        outline: none;
        text-align: right;
      }
    }
  }
  .backgroundGrey {
    height: 20px;
    width: 100%;
    background-color: #f6f6f6;
  }
  #patientInfoBoxTwo {
    padding: 0 20px 20px 20px;
  }
  .btnBox {
    width: 100%;
    height: 100px;
    padding-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /*标题+标签样式*/
  .healthInfoRowBetween {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    padding-bottom: 10px;
    .el-radio {
      min-width: 55px;
    }
    .healthTitleTxt {
      font-size: 14px;
      color: #606266;
      margin-right: 30px;
      height: 25px;
    }
  }
  .healthInfoRow {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .healthTitleTxt {
      font-size: 14px;
      color: #606266;
      margin-right: 30px;
      height: 25px;
    }
  }
  .borderBottom {
    border-bottom: 1px solid #eeeeee;
  }
  .marginBottom10 {
    margin-bottom: 10px;
  }
  .el-checkbox {
    margin-bottom: 15px;
    padding: 5px 15px;
    border: 1px solid #dadada;
    border-radius: 20px;
    .el-checkbox__label {
      padding-left: 0;
      color: #555658;
    }
    .labelTxtClicked {
      color: #ffffff;
    }
  }
  .el-checkboxTwo {
    border-radius: 5px;
    cursor: auto;
  }
  .el-addBox {
    padding: 7px 20px 3px 20px;
    .addImg {
      width: 15px;
      height: 14px;
    }
  }
  .txtMarginRight {
    margin-right: 15px;
  }
  .labelClicked {
    border: 1px solid #438bef;
    background-color: #438bef;
  }
  .noneTagText {
    color: #555658;
    font-size: 16px;
    margin-bottom: 15px;
  }
  /*添加标签弹窗*/
  .el-dialog_header,
  .el-dialog_footer {
    text-align: left; /*被公共样式覆盖了*/
  }
  .addLabelBody {
    .el-input {
      /*input输入框宽度调整*/
      width: 300px;
      max-width: none;
    }
    .addLabelInput {
      width: 300px;
      padding: 5px 5px;
      border-radius: 5px 5px;
    }
    .addNewLabel {
      display: inline-block;
      margin-left: 30px;
      color: #438bef;
      cursor: pointer;
    }
    .delBox {
      position: absolute;
      right: -5px;
      top: -5px;
      cursor: pointer;
    }
    .delDiv {
      width: 15px;
      height: 15px;
      border-radius: 15px;
      background-color: #fe5853;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .delImg {
      width: 13px;
      height: 13px;
    }
  }
}

.collapse-panel {
  height: 46px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(232, 232, 232, 1);
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
.collapse-container {
  padding-top: 16px;
}
</style>
