<template>
  <div class="regulation">
    <div class="regulationMain">
      <span class="warmPrompt">温馨提示：<font style="color:#F56C6C;">*</font>代表必填</span>
      <base-title-bold name="药品类型"></base-title-bold>
      <el-form ref="formData" :model="medicineRule" label-width="90px"  class="el-form_top">
        <el-form-item label="类型：" :required="true">
          <el-radio v-model.lazy="medicineRule.medicineClass" :label="0">西药</el-radio>
          <el-radio v-model.lazy="medicineRule.medicineClass" :label="2">中成药</el-radio>
        </el-form-item>
        <el-form-item label="类型：" :required="true">
          <el-radio v-model.lazy="medicineRule.otc" :label="0">处方药</el-radio>
          <el-radio v-model.lazy="medicineRule.otc" :label="1" disabled>OTC</el-radio>
        </el-form-item>
        <el-form-item label="妊娠分级：" :required="true">
          <el-select v-model.lazy="medicineRule.pregnancy" placeholder="请选择" filterable clearable class="w_150" @change="medicineRulePregnancyChange">
            <el-option v-for="(item,index) in gestationList" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="哺乳分级：" :required="true">
          <el-select v-model.lazy="medicineRule.lactation" placeholder="请选择" filterable clearable class="w_150" @change="medicineRuleLactationChange">
            <el-option v-for="(item,index) in lactationList" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox label="抗生素" v-model.lazy="medicineRule.isAntibiotic"></el-checkbox>
          <el-checkbox label="免疫抑制剂" v-model.lazy="medicineRule.isImmunosuppressant"></el-checkbox>
          <el-checkbox label="精神类" v-model.lazy="medicineRule.isPsychotropic"></el-checkbox>
        </el-form-item>
      </el-form>
      <base-title-bold name="药品成分"></base-title-bold>
      <el-form ref="formData" :model="medicineRule" label-width="90px"  class="el-form_top">
        <el-form-item label="成分：" style="margin-bottom:33px;">
          <base-input v-model.lazy="medicineRule.ingredient" clearable class="width_256"></base-input>
          <span class="hint">提示：多个成分用","分隔</span>
        </el-form-item>
        <el-form-item label="药物分类：" style="margin-bottom:33px;">
          <base-input v-model.lazy="medicineRule.ingredientClass" clearable class="width_256"></base-input>
          <span class="hint">提示：多个药物分类用","分隔</span>
        </el-form-item>
        <el-form-item label="过敏源：" style="margin-bottom:33px;">
          <base-input v-model="medicineRule.allergyIngredient" clearable class="width_256" @input="ingredientClassInput"></base-input>
          <span class="hint">提示：多个过敏源用","分隔</span>
        </el-form-item>
        <el-form-item label="过敏提示：" style="width:100%;">
          <el-input type="textarea" :rows="3" show-word-limit v-model.lazy="medicineRule.allergyTip" placeholder="请输入" style="max-width:100%;"></el-input>
        </el-form-item>
      </el-form>
      <base-title-bold name="药品规格"></base-title-bold>
      <div class="specifications" v-for="(item, index) in specificationsList" :key="index">
        <el-collapse accordion>
          <el-collapse-item>
            <span slot="title" class="collapse-title">
              <ul class="titleName">
                <li v-for="(items, indexs) in item.titleList" :key="indexs">
                  <el-input :ref="'input'+ (index+1)"  v-model.lazy="items.name" v-if="addState && (index == specificationsList.length - 1)" clearable class="width_150" @click.stop="focusSpecifications" @blur.stop="blurSpecifications(items,index)" placeholder="如：10mg*14片*2板/盒"></el-input>
                  <span v-else>{{items.name}}</span>
                  <i class="el-icon-error" @click.stop="removeSpecification(index,indexs)" v-if="item.titleList.length > 1"></i>
                </li>
              </ul>
              <div class="addUsage" @click.stop="addUsageAndDosage(index)"><i class="el-icon-circle-plus"></i>添加用法用量</div>
              <div class="merge" @click.stop="mergeClick(index)" v-if="specificationsList.length > 1"><span><i class="el-icon-error"></i>删除</span></div>
            </span>
            <div class="usageAndDosage">
              <!-- 用法用量 -->
              <usage-dosage :usageAndDosageList="item.usageAndDosageList" :num="index"></usage-dosage>
              <!-- <div :class="['item',(indexs == item.usageAndDosageList.length - 1?'border_btm_none':'')]" v-for="(items, indexs) in item.usageAndDosageList" :key="indexs">
                <div class="usageTitle"><span class="usageTitleName">用法用量{{index + 1}}</span> <span class="removeBtn"  @click.stop="removeUsageAndDosage(item.usageAndDosageList,index)"><i class="el-icon-error"></i>删除</span></div>
                <el-form ref="formData" :model="items" label-width="125px" :class="indexs != item.usageAndDosageList.length - 1?'border_btm':''">
                  <el-form-item label="给药途径：" :required="true">
                    <base-input v-model.lazy="items.takeDirection" clearable class="width_150"></base-input>
                  </el-form-item>
                  <el-form-item label="频次上限：" :required="true">
                    <el-select v-model.lazy="items.takeFrequence" class="width_150">
                      <el-option v-for="(list,index) in takeFrequenceList" :key="index" :value="list.dictCode" :label="list.dictName"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="单次剂量上限1：" :required="true">
                    <base-input v-model.lazy="items.takeDose1" clearable class="width_150"></base-input>
                    <el-select class="width_88" v-model.lazy="items.internationalUnit">
                      <el-option v-for="(list,index) in internationalUnitList" :key="index" :value="list.value" :label="list.name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="单次剂量上限2：" :required="true">
                    <base-input v-model.lazy="items.takeDose2" clearable class="width_150"></base-input>
                    <el-select class="width_88" v-model.lazy="items.meterageUnit">
                      <el-option  v-for="(list,index) in meterageUnitList" :key="index" :value="list.value" :label="list.name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="每日剂量上限1：" :required="true">
                    <base-input v-model.lazy="items.maxDose1" clearable class="width_150"></base-input>
                    <el-select class="width_88" v-model.lazy="items.internationalUnit">
                      <el-option v-for="(list,index) in internationalUnitList" :key="index" :value="list.value" :label="list.name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="每日剂量上限2：" :required="true">
                    <base-input v-model.lazy="items.maxDose2" clearable class="width_150"></base-input>
                    <el-select class="width_88" v-model.lazy="items.meterageUnit">
                      <el-option  v-for="(list,index) in meterageUnitList" :key="index" :value="list.value" :label="list.name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="服用天数上限：">
                    <base-input v-model.lazy="items.maxDays" clearable class="width_150"></base-input><span class="unit">天</span>
                  </el-form-item>
                </el-form>
              </div> -->
              <el-divider></el-divider>
              <div class="usageContent">
                <el-form label-width="125px" >
                  <el-form-item label="用法用量：" style="width:100%">
                    <el-input type="textarea" :rows="3" show-word-limit v-model.lazy="item.userDoseTip" placeholder="请输入" style="max-width:100%;"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="addSpecifications">
        <div class="addUsage" @click="addSpecifications"><i class="el-icon-circle-plus-outline"></i><span>添加药品规格</span></div>
      </div>
      <base-title-bold name="药品适用"></base-title-bold>
      <el-form ref="formData" :model="rationalRule" label-width="120px" class="apply">
        <el-form-item label="适应症：" :required="true">
          <!-- <base-input v-model.lazy="rationalRule.indications" :clearable="false" class="width_256"></base-input> -->
          <el-autocomplete v-model="rationalRule.indications" ref="indications" :debounce="200" :trigger-on-focus="false" :fetch-suggestions="querySearchIndications" placeholder="请输入" type="textarea" @select="handleSelectIndications" class="width_hundred" :rows="3"></el-autocomplete>
          <p class="hint relative">提示：多个适应症用","分隔</p>
        </el-form-item>
        <el-form-item label="禁忌症：">
          <!-- <div class="addIndication" @click="addIndication"><i class="el-icon-circle-plus"></i><span>添加</span></div> -->
          <el-autocomplete v-model.lazy="contrasName" ref="indications1" :debounce="200" :trigger-on-focus="false" :fetch-suggestions="querySearchIndications1" placeholder="请输入" @select="handleSelectIndications1" class="width_hundred-100" clearable></el-autocomplete><el-button type="primary" style="margin-left:10px;" @click="addIndicationConfirm">添加</el-button>
          <div class="contras" v-for="(item, index) in rationalRule.contras" :key="index">
            <span class="removeBtn"  @click.stop="removeIndication(index)"><i class="el-icon-error"></i>删除</span>
            <div class="main">
              <span class="title"><font style="color:#F56C6C;">*</font>{{item.value}}：</span>
              <el-radio v-model.lazy="item.risk" :label="1" @change="contrasChange(index,item.risk)">禁用</el-radio>
              <el-radio v-model.lazy="item.risk" :label="2" @change="contrasChange(index,item.risk)">忌用</el-radio>
              <el-radio v-model.lazy="item.risk" :label="3" @change="contrasChange(index,item.risk)">慎用</el-radio>
              <el-radio v-model.lazy="item.risk" :label="4" @change="contrasChange(index,item.risk)">酌量</el-radio>
            </div>
            <div style="padding-left:30px">
              <p><font style="color:#F56C6C;">*</font>风险提示：</p>
              <el-input type="textarea" :rows="2" show-word-limit v-model.lazy="item.tip" placeholder="请输入" style="max-width:100%;"></el-input>
            </div>
            <div style="padding-left:30px">
              <p>用药建议：</p>
              <el-input type="textarea" :rows="3" show-word-limit v-model.lazy="item.advise" placeholder="请输入" style="max-width:100%;"></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="用药范围：">
          <el-input type="textarea" :rows="3" show-word-limit v-model.lazy="rationalRule.medicineRange " placeholder="请输入" style="max-width:100%;"></el-input>
        </el-form-item>
        <el-form-item label="药物相互作用：">
          <el-input type="textarea" :rows="3" show-word-limit v-model.lazy="rationalRule.medicineInteraction " placeholder="请输入" style="max-width:100%;"></el-input>
        </el-form-item>
        <el-form-item label="用药禁忌：">
          <el-input type="textarea" :rows="3" show-word-limit v-model.lazy="rationalRule.medicineContras" placeholder="请输入" style="max-width:100%;"></el-input>
        </el-form-item>
        <el-form-item label="注意事项：">
          <el-input type="textarea" :rows="3" show-word-limit v-model.lazy="rationalRule.tipThings" placeholder="请输入" style="max-width:100%;"></el-input>
        </el-form-item>
      </el-form>
      <base-title-bold name="特殊人群"></base-title-bold>
      <el-form ref="formData" :model="specialCrowd" label-width="120px" class="apply">
        <el-form-item label="性别"></el-form-item>
        <el-form-item :label="item.name" v-for="(item,index) in specialCrowd.patientSex" class="patientSex" :key="'patientSex-'+index">
          <div class="contras">
            <div>
              <el-radio v-model.lazy="item.patientSex.risk" label="" @change="patientSexChange(index)">不限</el-radio>
              <el-radio v-model.lazy="item.patientSex.risk" :label="1" @change="patientSexChange(index,item.patientSex.risk)">禁用</el-radio>
              <el-radio v-model.lazy="item.patientSex.risk" :label="2" @change="patientSexChange(index,item.patientSex.risk)">忌用</el-radio>
              <el-radio v-model.lazy="item.patientSex.risk" :label="3" @change="patientSexChange(index,item.patientSex.risk)">慎用</el-radio>
              <el-radio v-model.lazy="item.patientSex.risk" :label="4" @change="patientSexChange(index,item.patientSex.risk)">酌量</el-radio>
            </div>
            <div v-show="item.patientSex.risk || item.patientSex.risk == undefined">
              <p><font style="color:#F56C6C;">*</font>风险提示：</p>
              <el-input type="textarea" :rows="2" show-word-limit v-model.lazy="item.patientSex.tip" placeholder="请输入" style="max-width:100%;"></el-input>
            </div>
            <div  v-show="item.patientSex.risk || item.patientSex.risk == undefined">
              <p>用药建议：</p>
              <el-input type="textarea" :rows="3" show-word-limit v-model.lazy="item.patientSex.advise" placeholder="请输入" style="max-width:100%;"></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="备孕/妊娠/哺乳"></el-form-item>
        <el-form-item :label="item.name" v-for="(item,index) in specialCrowd.pregnancy" class="pregnancy" :key="'pregnancy-'+index">
          <div class="contras">
            <div>
              <el-radio v-model.lazy="item.pregnancy.risk" label="" @change="pregnancyChange(index,item.pregnancy.risk)">不限</el-radio>
              <el-radio v-model.lazy="item.pregnancy.risk" :label="1" @change="pregnancyChange(index,item.pregnancy.risk)">禁用</el-radio>
              <el-radio v-model.lazy="item.pregnancy.risk" :label="2" @change="pregnancyChange(index,item.pregnancy.risk)">忌用</el-radio>
              <el-radio v-model.lazy="item.pregnancy.risk" :label="3" @change="pregnancyChange(index,item.pregnancy.risk)">慎用</el-radio>
              <el-radio v-model.lazy="item.pregnancy.risk" :label="4" @change="pregnancyChange(index,item.pregnancy.risk)">酌量</el-radio>
            </div>
            <div v-show="item.pregnancy.risk || item.pregnancy.risk == undefined">
              <p><font style="color:#F56C6C;">*</font>风险提示：</p>
              <el-input type="textarea" :rows="2" show-word-limit v-model.lazy="item.pregnancy.tip" placeholder="请输入" style="max-width:100%;" ></el-input>
            </div>
            <div v-show="item.pregnancy.risk || item.pregnancy.risk == undefined">
              <p>用药建议：</p>
              <el-input type="textarea" :rows="3" show-word-limit v-model.lazy="item.pregnancy.advise" placeholder="请输入" style="max-width:100%;"></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="肝/肾功能异常"></el-form-item>
        <el-form-item :label="item.name" :required="true"  v-for="(item,index) in specialCrowd.liverRenal" class="liverRenal" :key="'liverRenal-'+index">
          <div class="contras">
            <div>
              <el-radio v-model.lazy="item.liverRenal.risk" label="" @change="liverRenalChange(index,item.liverRenal.risk)">不限</el-radio>
              <el-radio v-model.lazy="item.liverRenal.risk" :label="1" @change="liverRenalChange(index,item.liverRenal.risk)">禁用</el-radio>
              <el-radio v-model.lazy="item.liverRenal.risk" :label="2" @change="liverRenalChange(index,item.liverRenal.risk)">忌用</el-radio>
              <el-radio v-model.lazy="item.liverRenal.risk" :label="3" @change="liverRenalChange(index,item.liverRenal.risk)">慎用</el-radio>
              <el-radio v-model.lazy="item.liverRenal.risk" :label="4" @change="liverRenalChange(index,item.liverRenal.risk)">酌量</el-radio>
            </div>
            <div v-show="item.liverRenal.risk || item.liverRenal.risk == undefined">
              <p><font style="color:#F56C6C;">*</font>风险提示：</p>
              <el-input type="textarea" :rows="2" show-word-limit v-model.lazy="item.liverRenal.tip" placeholder="请输入" style="max-width:100%;"></el-input>
            </div>
            <div v-show="item.liverRenal.risk || item.liverRenal.risk == undefined">
              <p>用药建议：</p>
              <el-input type="textarea" :rows="3" show-word-limit v-model.lazy="item.liverRenal.advise" placeholder="请输入" style="max-width:100%;"></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="年龄"></el-form-item>
        <el-form-item :label="(item.name == '自定义'?item.name+(index-1):item.name)" :required="item.name!='自定义'?true:false"  v-for="(item,index) in specialCrowd.patientAge" class="patientAge" :key="'patientAge-'+index">
          <span class="addCustom" @click="addCustom"  v-if="item.name =='自定义' && index == 2" ><i class="el-icon-circle-plus el-icon"></i>添加</span>
          <span class="removeCustom" @click="removeCustom(index)"  v-if="item.name =='自定义' && index > 2"><i class="el-icon-error el-icon"></i>删除</span>
          <div class="contras">
            <div>
              <el-radio v-model.lazy="item.patientAge.risk" label="" @change="patientAgeChange(index,item.patientAge.risk)">不限</el-radio>
              <el-radio v-model.lazy="item.patientAge.risk" :label="1" @change="patientAgeChange(index,item.patientAge.risk)">禁用</el-radio>
              <el-radio v-model.lazy="item.patientAge.risk" :label="2" @change="patientAgeChange(index,item.patientAge.risk)">忌用</el-radio>
              <el-radio v-model.lazy="item.patientAge.risk" :label="3" @change="patientAgeChange(index,item.patientAge.risk)">慎用</el-radio>
              <el-radio v-model.lazy="item.patientAge.risk" :label="4" @change="patientAgeChange(index,item.patientAge.risk)">酌量</el-radio>
            </div>
            <div class="customTime" v-if="item.name == '自定义'" v-show="item.patientAge.risk || item.patientAge.risk == undefined">
              <el-input-number v-model.lazy="item.startTime" controls-position="right"  :min="0" :max="130" @change="startTimeChange(item,index)"></el-input-number> 岁
              <!-- <el-select v-model.lazy="startTime" clearable :disabled="item.patientAge.risk == ''">
                <el-option v-for="(item,index) in 131" :key="'one-'+index" :value="index" :label="index+'岁'"></el-option>
              </el-select> -->
              <span>~</span>
              <el-input-number v-model.lazy="item.endTime" controls-position="right"  :min="item.startTime?(item.startTime+1):1" :max="130" @change="endTimeChange(item,index)"></el-input-number> 岁
              <!-- <el-select v-model.lazy="endTime" clearable :disabled="item.patientAge.risk == ''">
                <el-option v-for="(item,index) in (131 - parseInt(startTime?startTime:0))" :value="index + parseInt(startTime?startTime:0)" :label="index + parseInt(startTime?startTime:0)+'岁'" :key="'two-'+index"></el-option>
              </el-select> -->
              <div class="ageHint">
                <span class="startHint" v-if="item.startTime !== ''">包含{{item.startTime}}岁</span>
                <span class="endHint" v-if="item.endTime">不包含{{item.endTime}}岁</span>
              </div>
            </div>
            <div v-show="item.patientAge.risk || item.patientAge.risk == undefined">
              <p><font style="color:#F56C6C;">*</font>风险提示：</p>
              <el-input type="textarea" :rows="2" show-word-limit v-model.lazy="item.patientAge.tip" placeholder="请输入" style="max-width:100%;"></el-input>
            </div>
            <div v-show="item.patientAge.risk || item.patientAge.risk == undefined">
              <p>用药建议：</p>
              <el-input type="textarea" :rows="3" show-word-limit v-model.lazy="item.patientAge.advise" placeholder="请输入" style="max-width:100%;"></el-input>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" style="margin-left:32px;" @click="medicinerueSave">保存</el-button>
      </div>
    </div>
    <!-- 合并规则 -->
    <el-dialog :title="mergeTitle" :visible.sync="mergeVisible" :close-on-click-modal="false" width="450px" class="borderHeader" :close-on-press-escape="false">
      <el-tooltip class="item" effect="dark" :content="mergeName" placement="top-start">
        <p class="mergeName">{{mergeName}}</p>
      </el-tooltip>
      <el-form :model="mergeForm" label-width="130px">
        <el-form-item label="请选择删除原因：">
          <el-radio v-model.lazy="mergeForm.cause" :label="0">重复</el-radio>
          <el-radio v-model.lazy="mergeForm.cause" :label="1">删除</el-radio>
        </el-form-item>
        <el-form-item label="请选择重复规格：" v-show="mergeForm.cause == 0">
          <el-select v-model.lazy="mergeForm.repetition">
            <el-option v-for="(item,index) in newSpecificationsList" :key="index" :value="item.name" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button @click="mergeVisible = false">取 消</el-button>
        <el-button type="primary" @click="mergeConfirm" style="margin-left:32px;" :disabled="disabledConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加药物分类 -->
    <el-dialog title="添加药物分类" :visible.sync="addComponentTypeVisible" :close-on-click-modal="false" width="432px" class="borderHeader" :close-on-press-escape="false">
      <el-form :model="componentForm" label-width="100px" style="border-bottom: 1px solid #d8d8d8;">
        <el-form-item label="自定义添加：">
          <base-input v-model.lazy="componentForm.title" :clearable="false" style="max-width:215px;margin-right:16px;"></base-input>
          <el-button type="primary" @click="addComponentTypeConfirm">确认</el-button>
        </el-form-item>
      </el-form>
      <div class="dialogList">
        <p class="title">常见药物分类</p>
        <ul>
          <li :class="item.state?'active':''" @click="activeTypeClick(item)" v-for="(item, index) in IndicationList" :key="index">{{item.name}}</li>
        </ul>
      </div>
    </el-dialog>
    <!-- 添加禁忌症 -->
    <el-dialog title="添加禁忌症" :visible.sync="addIndicationVisible" :close-on-click-modal="false" width="562px"  class="borderHeader" :close-on-press-escape="false">
      <el-form :model="indicationForm" label-width="100px" style="border-bottom: 1px solid #d8d8d8;">
        <el-form-item label="自定义添加：">
          <base-input v-model.lazy="indicationForm.title" :clearable="false" style="max-width:338px;margin-right:24px;"></base-input>
          <el-button type="primary" @click="addIndicationConfirm">确认</el-button>
        </el-form-item>
      </el-form>
      <div class="dialogList" >
        <p class="title">常见禁忌症</p>
        <ul>
          <li :class="item.state?'active':''" @click="activeClick(item)" v-for="(item, index) in westernMedicine" :key="index">{{item.name}}</li>
        </ul>
      </div>
    </el-dialog>
    <!-- 删除禁忌症 -->
    <el-dialog  :visible.sync="removeIndicationVsible" :show-close="false" :close-on-click-modal="false" width="350px" :close-on-press-escape="false">
      <div class="removeIndication">
        <i class="el-icon-warning"></i>
        <span>确定删除此禁忌症吗？</span>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button @click="removeIndicationVsible = false">取 消</el-button>
        <el-button type="primary" @click="removeIndicationItam" style="margin-left:32px;">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  mapGetters
} from "vuex";
import usageDosage from "./usageDosage";
import BaseTitleBold from "@/components/global/base/BaseTitleBold";
export default {
  name: 'addregulation',
  props: {
    medicineName:{
      type: String,
      default () {
				return '';
			}
    },
    keyID: {
      type: String,
      default () {
				return '';
			}
    },
    medicineObj:{
      type: Object,
      default () {
				return {};
			}
    }
  },
  components: {
    usageDosage,
    BaseTitleBold
  },
  data () {
    return {
      formRules: {},
      gestationList: [
        {name: '无',value: ''},
        {name: 'A',value: 'A'},
        {name: 'B',value: 'B'},
        {name: 'C',value: 'C'},
        {name: 'D',value: 'D'},
        {name: 'X',value: 'X'}
      ],
      lactationList: [
        {name: '无',value: ''},
        {name: 'L1',value: 'L1'},
        {name: 'L2',value: 'L2'},
        {name: 'L3',value: 'L3'},
        {name: 'L4',value: 'L4'},
        {name: 'L5',value: 'L5'}
      ],
      type: [],
      medicineRule: {otc: 0,allergyTip:''}, // 基本规则
      rationalRule: {indications: "",contras:[]}, // 药品适用规则
      contrasName: "",
      oldIndications: "",
      oldIndications1: "",
      specialCrowd:{
        patientSex:[
         {name: '男性',patientSex:{value:'1', risk: null, tip: '', advise: ''}},
         {name: '女性',patientSex:{value:'2', risk: null, tip: '', advise: ''}}
        ],
        pregnancy:[
          {name: '备孕',pregnancy:{value:'1', risk: null, tip: '', advise: ''}},
          {name: '妊娠',pregnancy:{value:'2', risk: null, tip: '', advise: ''}},
          {name: '哺乳',pregnancy:{value:'3', risk: null, tip: '', advise: ''}},
        ],
        liverRenal:[
          {name: '肝功能异常',liverRenal:{value:'1', risk: null, tip: '', advise: ''}},
          {name: '肾功能异常',liverRenal:{value:'2', risk: null, tip: '', advise: ''}},
        ],
        patientAge:[
          {name: '儿童',patientAge:{value:'1', risk: null, tip: '', advise: ''}},
          {name: '老年人',patientAge:{value:'2', risk: null, tip: '', advise: ''}}
        ],
      }, // 特殊人群
      specificationsList: [], // 药品规则
      newSpecificationsList: [],// 重复规格列表
      mergeList: [], // 需要合并的规则
      mergeVisible: false,
      addState: false,
      mergeForm: {
        cause: 0,
        repetition: ''
      },
      componentForm: {},
      indicationForm: {title: ''},
      mergeTitle: '注 意',
      mergeIndex: '',
      mergeName: '',
      addIndicationVisible: false,
      removeIndicationVsible: false,
      IndicationList: [
        {name: '禁忌症',state: false},
        {name: '心脏病',state: false},
        {name: '少精症',state: false},
        {name: '子宫内膜移位',state: false},
        {name: '输卵管堵塞',state: false}
      ],
      westernMedicine: [],
      addComponentTypeVisible: false,
      indicationIndex: '',
      takeFrequenceList: [],
      internationalUnitList: [
        {name: 'mg',value: 'mg'},
        {name: 'IU',value: 'IU'},
        {name: 'bu',value: 'bu'},
        {name: 'g',value: 'g'},
        {name: 'ug',value: 'ug'},
        {name: 'ml',value: 'ml'}
      ],
      meterageUnitList: [
        {name: '片',value: '片'},
        {name: '粒',value: '粒'},
        {name: '贴',value: '贴'},
        {name: '喷',value: '喷'},
        {name: '滴',value: '滴'},
        {name: '袋',value: '袋'},
        {name: '吸',value: '吸'},
        {name: '支',value: '支'},
        {name: '丸',value: '丸'},
        {name: '揿',value: '揿'},
        {name: '枚',value: '枚'},
        {name: '泡',value: '泡'},
        {name: '瓶',value: '瓶'},
        {name: '张',value: '张'},
        {name: '剂',value: '剂'},
        {name: '盖',value: '盖'}
      ],
      startTime: 0,
      endTime: 130,
      disabledConfirm: false
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  watch: {
    // 进入规则页面数据渲染
    medicineObj: function(item) {
      let that = this
      if(item.medicineRule.isEmpty == 0) {
        // 基本规则回显
        this.medicineRule = item.medicineRule;
        this.medicineRule.isAntibiotic = this.medicineRule.isAntibiotic == 1 ? true : false;
        this.medicineRule.isImmunosuppressant = this.medicineRule.isImmunosuppressant == 1 ? true : false;
        this.medicineRule.isPsychotropic = this.medicineRule.isPsychotropic == 1 ? true : false;
        this.medicineRule.ingredient = this.medicineRule.ingredient.join(',');
        this.medicineRule.ingredientClass = this.medicineRule.ingredientClass.join(',');
        this.medicineRule.allergyIngredient = this.medicineRule.allergyIngredient.join(',');
        // 药品规则回显
        let arr = [];
        let rationalRule = item.medicineRule.rationalRule;
        rationalRule.medicineSpecificationList.forEach((ele,i) => {
          let titleList = [{name: ele.specificationName}];
          ele.otherNames.forEach(eles => {
            let obj = {
              name: eles
            }
            titleList.push(obj);
          })
          let obj = {
            name: ele.specificationName,
            titleList: titleList,
            usageAndDosageList:ele.useWayAndDoseList,
            userDoseTip: ele.userDoseTip
          }
          arr.push(obj);
        })
        this.specificationsList = arr;
        // 药品适用数据回显
        this.rationalRule = rationalRule;
        this.rationalRule.indications = this.rationalRule.indications.join(',');
        // 特殊人群数据回显
        this.specialCrowd.patientSex.forEach(ele => { // 性别
          ele.patientSex.risk = "";
          rationalRule.patientSex.forEach(eles => {
            if(ele.patientSex.value == eles.value) {
              ele.patientSex = eles
            }
          })
        })
        this.specialCrowd.pregnancy.forEach(ele => { // 备孕/妊娠/哺乳
          ele.pregnancy.risk = "";
          rationalRule.pregnancy.forEach(eles => {
            if(ele.pregnancy.value == eles.value) {
              ele.pregnancy = eles
            }
          })
        })
        this.specialCrowd.liverRenal.forEach(ele => { // 肝/肾功能异常
          ele.liverRenal.risk = "";
          rationalRule.liverRenal.forEach(eles => {
            if(ele.liverRenal.value == eles.value) {
              ele.liverRenal = eles
            }
          })
        })
        let custom = true;
        this.specialCrowd.patientAge.forEach(ele => { //年龄
          ele.patientAge.risk = "";
        })
        rationalRule.patientAge.forEach((ele,index) => { // 年龄
          let obj = {}
          if(ele.value != 1 && ele.value != 2) {
            ele.value = ele.value.replace(")","]")
            obj.startTime = JSON.parse(ele.value)[0];
            obj.endTime = JSON.parse(ele.value)[1];
            // ele.value = "";
            obj.name = "自定义"+ (index - 1)
          }
          if(ele.value == 1) {
            obj.name = "儿童"
          }else if(ele.value == 2) {
            obj.name = "老年人"
          }
          obj.patientAge = {...ele}
          let state = false
          for(let i = 0 ; i < this.specialCrowd.patientAge.length ; i++) {
            let eles = this.specialCrowd.patientAge[i]
            if(eles.name == obj.name) {
              eles.patientAge = obj.patientAge
              break;
            }else if(obj.name.indexOf("自定义")  != -1) {
              state  = true
              custom = false
              break;
            }
          }
          if(state) {
            obj.name = '自定义'
            this.specialCrowd.patientAge.push(obj)
          }
        })
        if(custom) {
          this.specialCrowd.patientAge.push({name: '自定义',patientAge:{value:'', risk: "", tip: '', advise: ''},startTime: '',endTime: ''})
        }
      }else {
        let arr = [];
        item.specifications.forEach((ele,i) => {
          let titleList = []
          ele.forEach(eles => {
            let obj = {
              name: eles
            }
            titleList.push(obj)
          })
          let obj = {
            name: ele[0],
            titleList: titleList,
            usageAndDosageList:[
              {
                takeDirection: '',
                takeFrequence: '',
                maxDays: '',
                takeDose1: '',
                maxDose1: '',
                takeDose2: '',
                maxDose2: '',
                internationalUnit: '',
                meterageUnit: ''
              }
            ],
            userDoseTip: ''
          }
          arr.push(obj);
        })
        this.specificationsList = arr;
        this.specialCrowd.patientAge.push({name: '自定义',patientAge:{value:'', risk: null, tip: '', advise: ''},startTime: '',endTime: ''})
      }
      
    },
  },
  created() {
    let westernMedicine = JSON.parse(localStorage.getItem("westernMedicine"));
    westernMedicine.forEach(ele => {
      let obj = {
        name: ele,
        state: false
      }
      this.westernMedicine.push(obj);
    })
  },
  methods: {
    // 切换妊娠分级
    medicineRulePregnancyChange(val) {
      if(val == 'A' || val == 'B') {
        this.specialCrowd.pregnancy.forEach(ele => {
          if(ele.name == '妊娠') {
            ele.pregnancy.risk = "";
            ele.pregnancy.tip = "";
          }
        })
      } else if(val == 'C' || val == 'D') {
        this.specialCrowd.pregnancy.forEach(ele => {
          if(ele.name == '妊娠') {
            ele.pregnancy.risk = 3;
            ele.pregnancy.tip = ele.name + "期慎用";
          }
        })
      } else if(val == 'X') {
        this.specialCrowd.pregnancy.forEach(ele => {
          if(ele.name == '妊娠') {
            ele.pregnancy.risk = 1;
            ele.pregnancy.tip =  ele.name + "期禁用";
          }
        })
      } else {
        this.specialCrowd.pregnancy.forEach(ele => {
          if(ele.name == '妊娠') {
            ele.pregnancy.risk = "";
            ele.pregnancy.tip = "";
          }
        })
      }
    },
    // 切换哺乳分级
    medicineRuleLactationChange(val) {
      if(val == 'L1' || val == 'L2') {
        this.specialCrowd.pregnancy.forEach(ele => {
          if(ele.name == '哺乳') {
            ele.pregnancy.risk = "";
            ele.pregnancy.tip = "";
          }
        })
      } else if(val == 'L3' || val == 'L4') {
        this.specialCrowd.pregnancy.forEach(ele => {
          if(ele.name == '哺乳') {
            ele.pregnancy.risk = 3;
            ele.pregnancy.tip = ele.name + "期慎用";
          }
        })
      } else if(val == 'L5') {
        this.specialCrowd.pregnancy.forEach(ele => {
          if(ele.name == '哺乳') {
            ele.pregnancy.risk = 1;
            ele.pregnancy.tip = ele.name + "期禁用";
          }
        })
      }  else {
        this.specialCrowd.pregnancy.forEach(ele => {
          if(ele.name == '哺乳') {
            ele.pregnancy.risk = "";
            ele.pregnancy.tip = "";
          }
        })
      }
    },
    // 过敏源输入框变化
    ingredientClassInput(val) {
      if(val) {
        this.medicineRule.allergyTip = val + '过敏者禁用'
      } else {
        this.medicineRule.allergyTip = ""
      }
    },
    // 禁忌症
    contrasChange(index,item) {
      if(item == 1) {
        this.rationalRule.contras[index].tip = this.rationalRule.contras[index].value + "患者禁用";
      } else if(item == 2) {
        this.rationalRule.contras[index].tip = this.rationalRule.contras[index].value + "患者忌用";
      } else if(item == 3) {
        this.rationalRule.contras[index].tip = this.rationalRule.contras[index].value + "患者慎用";
      } else if(item == 4) {
        this.rationalRule.contras[index].tip = this.rationalRule.contras[index].value + "患者酌量";
      }
    },
    // 性别
    patientSexChange(index,item) {
      if(item == 1) {
        this.specialCrowd.patientSex[index].patientSex.tip = "该药品" + this.specialCrowd.patientSex[index].name + "患者禁用";
      } else if(item == 2) {
        this.specialCrowd.patientSex[index].patientSex.tip = "该药品" + this.specialCrowd.patientSex[index].name + "患者忌用";
      } else if(item == 3) {
        this.specialCrowd.patientSex[index].patientSex.tip = "该药品" + this.specialCrowd.patientSex[index].name + "患者慎用";
      } else if(item == 4) {
        this.specialCrowd.patientSex[index].patientSex.tip = "该药品" + this.specialCrowd.patientSex[index].name + "患者酌量使用";
      }else {
        this.specialCrowd.patientSex[index].patientSex.tip = '';
        this.specialCrowd.patientSex[index].patientSex.advise = '';
      }
    },
    // 妊娠
    pregnancyChange(index,item) {
      if(item == 1) {
        this.specialCrowd.pregnancy[index].pregnancy.tip = this.specialCrowd.pregnancy[index].name + "期禁用";
      } else if(item == 2) {
        this.specialCrowd.pregnancy[index].pregnancy.tip = this.specialCrowd.pregnancy[index].name + "期忌用";
      } else if(item == 3) {
        this.specialCrowd.pregnancy[index].pregnancy.tip = this.specialCrowd.pregnancy[index].name + "期慎用";
      } else if(item == 4) {
        this.specialCrowd.pregnancy[index].pregnancy.tip = this.specialCrowd.pregnancy[index].name + "期慎用，请参照说明书酌量开方";
      }else {
        this.specialCrowd.pregnancy[index].pregnancy.tip = '';
        this.specialCrowd.pregnancy[index].pregnancy.advise = '';
      }
    },
    // 肝肾
    liverRenalChange(index,item) {
      if(item == 1) {
        this.specialCrowd.liverRenal[index].liverRenal.tip = this.specialCrowd.liverRenal[index].name + "禁用";
      } else if(item == 2) {
        this.specialCrowd.liverRenal[index].liverRenal.tip = this.specialCrowd.liverRenal[index].name + "忌用";
      } else if(item == 3) {
        this.specialCrowd.liverRenal[index].liverRenal.tip = this.specialCrowd.liverRenal[index].name + "慎用";
      } else if(item == 4) {
        this.specialCrowd.liverRenal[index].liverRenal.tip = this.specialCrowd.liverRenal[index].name + "慎用，请参照说明书酌量开方";
      }else {
        this.specialCrowd.liverRenal[index].liverRenal.tip = '';
        this.specialCrowd.liverRenal[index].liverRenal.advise = '';
      }
    },
    // 年龄选择不限时
    patientAgeChange(index,item) {
      let  patientAge = this.specialCrowd.patientAge[index]
      if(item == 1) {
        if(patientAge.name == '自定义') {
          if(patientAge.startTime == 0 && patientAge.endTime == 130) {
            patientAge.patientAge.tip = "0岁以上患者禁用";
          }else if(patientAge.startTime == 0 && patientAge.endTime != 130){
            patientAge.patientAge.tip = patientAge.endTime + "岁以下患者禁用";
          }else if(patientAge.startTime != 0 && patientAge.endTime != 130) {
            patientAge.patientAge.tip = patientAge.startTime + "~" + patientAge.endTime + "岁患者禁用";
          }else if(patientAge.startTime != 0 && patientAge.endTime == 130) {
            patientAge.patientAge.tip = patientAge.startTime + "岁以上患者禁用";
          }
        }else {
          patientAge.patientAge.tip = patientAge.name + "禁用";
        }
      } else if(item == 2) {
        if(patientAge.name == '自定义') {
          if(patientAge.startTime == 0 && patientAge.endTime == 130) {
            patientAge.patientAge.tip = "0岁以上患者忌用";
          }else if(patientAge.startTime == 0 && patientAge.endTime != 130){
            patientAge.patientAge.tip = patientAge.endTime + "岁以下患者忌用";
          }else if(patientAge.startTime != 0 && patientAge.endTime != 130) {
            patientAge.patientAge.tip = patientAge.startTime + "~" + patientAge.endTime + "岁患者忌用";
          }else if(patientAge.startTime != 0 && patientAge.endTime == 130) {
            patientAge.patientAge.tip = patientAge.startTime + "岁以上患者忌用";
          }
        }else {
          patientAge.patientAge.tip = patientAge.name + "忌用";
        }
      } else if(item == 3) {
        if(patientAge.name == '自定义') {
          if(patientAge.startTime == 0 && patientAge.endTime == 130) {
            patientAge.patientAge.tip = "0岁以上患者慎用";
          }else if(patientAge.startTime == 0 && patientAge.endTime != 130){
            patientAge.patientAge.tip = patientAge.endTime + "岁以下患者慎用";
          }else if(patientAge.startTime != 0 && patientAge.endTime != 130) {
            patientAge.patientAge.tip = patientAge.startTime + "~" + patientAge.endTime + "岁患者慎用";
          }else if(patientAge.startTime != 0 && patientAge.endTime == 130) {
            patientAge.patientAge.tip = patientAge.startTime + "岁以上患者慎用";
          }
        }else {
          patientAge.patientAge.tip = patientAge.name + "慎用";
        }
      } else if(item == 4) {
        if(patientAge.name == '自定义') {
          if(patientAge.startTime == 0 && patientAge.endTime == 130) {
            patientAge.patientAge.tip = "0岁以上患者慎用，请参照说明书酌量开方";
          }else if(patientAge.startTime == 0 && patientAge.endTime != 130){
            patientAge.patientAge.tip = patientAge.endTime + "岁以下患者慎用，请参照说明书酌量开方";
          }else if(patientAge.startTime != 0 && patientAge.endTime != 130) {
            patientAge.patientAge.tip = patientAge.startTime + "~" + patientAge.endTime + "岁患者慎用，请参照说明书酌量开方";
          }else if(patientAge.startTime != 0 && patientAge.endTime == 130) {
            patientAge.patientAge.tip = patientAge.startTime + "岁以上患者慎用，请参照说明书酌量开方";
          }
        }else {
          patientAge.patientAge.tip = patientAge.name + "慎用，请参照说明书酌量开方";
        }
      }else {
        patientAge.patientAge.tip = '';
        patientAge.patientAge.advise = '';
        if(patientAge.name == '自定义') {
          patientAge.startTime = '';
          patientAge.endTime = '';
        }
      }
    },
    // 添加药物分类
    addComponentType() {
      if(this.medicineRule.ingredientClass) {
        this.componentForm.title = this.medicineRule.ingredientClass
      }
      this.addComponentTypeVisible = true
      this.IndicationList.forEach(ele => {
        ele.state = false
      })
    },
    // 选取禁忌症
    activeTypeClick(item) {
      item.state = !item.state;
      if(item.state) {
        this.componentForm.title = (this.componentForm.title?this.componentForm.title:'') + (this.componentForm.title?',':'')+item.name
      };
    },
    // 确认添加药物分类 
    addComponentTypeConfirm() {
      this.medicineRule.ingredientClass = this.componentForm.title
      this.addComponentTypeVisible = false
    },
    // 添加用法用量
    addUsageAndDosage(index) {
      let obj = {
        takeDirection: '',
        takeFrequence: '',
        maxDays: '',
        takeDose1: '',
        maxDose1: '',
        takeDose2: '',
        maxDose2: '',
        internationalUnit: '',
        meterageUnit: ''
      }
      this.specificationsList[index].usageAndDosageList.push(obj);
    },
    // 合并规格
    mergeClick(index) {
      this.mergeForm = {
        cause: 0,
        repetition: ''
      }
      this.mergeVisible = true;
      this.mergeIndex = index;
      this.newSpecificationsList = []
      let allNewList = [];
      this.mergeName = '';
      this.mergeList = this.specificationsList[index].titleList;
      this.mergeList.forEach(ele => {
        this.mergeName = this.mergeName + (this.mergeName?"，":'') + ele.name
      })
      // 合并时显示多个规格
      // this.specificationsList.forEach(ele => {
      //   ele.titleList.forEach(eles => {
      //     allNewList.push(eles);
      //   })
      // })
      // let len = allNewList.length - 1;
      // for(let i =  len; i >= 0 ; i--) {
      //   for(let j = 0 ; j <= this.mergeList.length - 1 ; j++) {
      //     if(allNewList[i].name == this.mergeList[j].name) {
      //       allNewList.splice(i,1)
      //       break;
      //     }
      //   }
      // }
      // this.newSpecificationsList = allNewList
      // 合并时只显示单个规格
      let mergeNameItem = this.specificationsList[index].name
      this.specificationsList.forEach(ele => {
        if(ele.name != mergeNameItem) {
          let obj = {
            name: ele.name
          }
          this.newSpecificationsList.push(obj)
        }
      })
    },
    // 确认合并规则
    mergeConfirm() {
      let that = this
      if(this.mergeForm.cause == 0) {
        if(this.mergeForm.repetition == '') {
          this.$message({type:'warning',message:'请选择重复规则'})
          return;
        }
        this.disabledConfirm = true
        this.specificationsList.forEach(ele => {
          if(ele.name == this.mergeForm.repetition) {
            this.mergeList.forEach(item => {
              ele.titleList.push({name: item.name});
            })
          } else {
            ele.titleList.forEach(eles => {
              if(eles.name == this.mergeForm.repetition) {
                this.mergeList.forEach(item => {
                  ele.titleList.push({name: item.name});
                })
              }
            })
          }
        })
        this.specificationsList.splice(this.mergeIndex,1);
      } else {
        this.disabledConfirm = true
        this.specificationsList.splice(this.mergeIndex,1);
      }
      this.mergeVisible = false
      setTimeout(function() {
        that.disabledConfirm = false
      },500)
    },
    // 删除用法用量
    removeUsageAndDosage(item,index) {
      item.splice(index,1);
    },
    // 添加药品规则
    addSpecifications() {
      this.addState = true;
      let obj = {
        name: '',
        titleList:[{name: ''}],
        usageAndDosageList:[
          {
            takeDirection: '',
            takeFrequence: '',
            maxDays: '',
            takeDose1: '',
            maxDose1: '',
            takeDose2: '',
            maxDose2: '',
            internationalUnit: '',
            meterageUnit: ''
          }
        ],
        userDoseTip: ''
      }
      this.specificationsList.push(obj);
    },
    focusSpecifications() {

    },
    // 失去焦点输入规则名称
    blurSpecifications(item,index) {
      this.addState = false;
      this.specificationsList[index].name = item.name;
    },
    // 删除规格
    removeSpecification(index,indexs) {
      let item = this.specificationsList[index].titleList[indexs];
      this.specificationsList[index].titleList.splice(indexs,1);
      if(indexs == 0) {
        this.specificationsList[index].name = this.specificationsList[index].titleList[0].name
      }
      let obj = {
        name: item.name,
        titleList:[{name: item.name}],
        usageAndDosageList:[
          {
            takeDirection: '',
            takeFrequence: '',
            maxDays: '',
            takeDose1: '',
            maxDose1: '',
            takeDose2: '',
            maxDose2: '',
            internationalUnit: '',
            meterageUnit: ''
          }
        ],
        userDoseTip: ''
      }
      this.specificationsList.push(obj);
    },
    // 添加禁忌症弹窗
    addIndication() {
      this.indicationForm = {title: ''};
      this.westernMedicine.forEach(ele => {
        ele.state = false
      })
      this.addIndicationVisible = true;
    },
    // 选取禁忌症
    activeClick(item) {
      item.state = !item.state;
      if(item.state) {
        this.indicationForm.title = (this.indicationForm.title?this.indicationForm.title:'') + (this.indicationForm.title?',':'')+item.name
      } else {
        if(this.indicationForm.title.indexOf(item.name) != -1) {
          let arr =  this.replaceComma(this.indicationForm.title).split(",")
          let len = arr.length;
          for(let i = len ; i >= 0 ; i--) {
            if(arr[i] == item.name) {
              arr.splice(i,1)
            }
          }
          this.indicationForm.title = arr.join(',')
        }
      }
    },
    // 确认添加禁忌症
    addIndicationConfirm() {
      if(this.contrasName == "") {
        this.$message({type:'warning',message:"请输入"})
        return
      }
      // 单条数据去重
      let arr = this.replaceComma(this.contrasName).split(",").filter((x) => x !== '');
      var arr2 =arr.filter(function(value,index,self){
        return self.indexOf(value) ===index;
      });
      this.contrasName = arr2.join(",");
      for(let i = 0 ; i < this.rationalRule.contras.length ; i++) {
        let oldArr = this.rationalRule.contras[i].value.split(",")
        if(JSON.stringify(arr2.sort()) === JSON.stringify(oldArr.sort())) {
          this.$message({type:'warning',message:"当前禁忌症已经存在，请重新输入"})
          return
        }
      }
      let data= {
        value: this.contrasName,
        risk: '',
        tip: '',
        advise: ''
      };
      this.rationalRule.contras.push(data);
      this.addIndicationVisible = false;
      this.contrasName = "";
    },
    // 删除禁忌症
    removeIndication(index) {
      this.indicationIndex = index;
      this.removeIndicationVsible = true;
    }, 
    // 确认删除禁忌症
    removeIndicationItam() {
      this.rationalRule.contras.splice(this.indicationIndex,1);
      this.removeIndicationVsible = false;
    },
    // 添加药品规则取消
    cancel() {
      this.$confirm("当前信息未保存，是否取消", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$router.push({path: "medicineRule"});
      }).catch(() => { });
    },
    // 适应症模糊远程查询
    querySearchIndications(queryString,cb) {
      this.oldIndications = queryString;
      var restaurants = JSON.parse(JSON.stringify(this.westernMedicine));
      let arr = this.replaceComma(queryString).split(",");
      queryString = arr[arr.length-1];
      if(queryString) {
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        results.forEach(ele => {
          ele.value = ele.name
        })
        cb(results);
      }else {
        cb([]);
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    // 适应症模糊远程查询
    querySearchIndications1(queryString,cb) {
      this.oldIndications1 = queryString;
      var restaurants = JSON.parse(JSON.stringify(this.westernMedicine));
      let arr = this.replaceComma(queryString).split(",");
      queryString = arr[arr.length-1];
      if(queryString) {
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        results.forEach(ele => {
          ele.value = ele.name
        })
        cb(results);
      }else {
        cb([]);
      }
    },
    // 选取诊断数据
    handleSelectIndications(item) {
      let arr = [];
      let that = this
      arr = this.replaceComma(this.oldIndications).split(",");
      let end = arr.pop();
      arr.push(item.value);
      this.rationalRule.indications = arr.join(",");
      this.$refs.indications.$refs.input.focus();
      let len = this.$refs.indications.$refs.input.value.length;
      this.$nextTick(()=>{
        let len = this.$refs.indications.$refs.input.value.length;
        that.$refs.indications.$refs.input.selectionStart =  that.$refs.indications.$refs.input.selectionEnd = len;
      })
    },
    // 选取诊断数据
    handleSelectIndications1(item) {
      let arr = [];
      let that = this
      arr = this.replaceComma(this.oldIndications1).split(",");
      let end = arr.pop();
      arr.push(item.value);
      this.contrasName = arr.join(",");
      this.$refs.indications1.$refs.input.focus();
      let len = this.$refs.indications1.$refs.input.value.length;
      this.$nextTick(()=>{
        let len = this.$refs.indications1.$refs.input.value.length;
        that.$refs.indications1.$refs.input.selectionStart =  that.$refs.indications1.$refs.input.selectionEnd = len;
      })
    },
    // 自定义开始时间
    startTimeChange(item,index) {
      if(item.endTime) {
        if(item.startTime >= item.endTime) {
          item.endTime = item.startTime+1
        }
      }
      if(item.patientAge.risk == 1) {
        if(item.startTime == 0 && item.endTime == 130) {
          item.patientAge.tip = "0岁以上患者禁用";
        }else if(item.startTime == 0 && item.endTime != 130){
          item.patientAge.tip = item.endTime + "岁以下患者禁用";
        }else if(item.startTime != 0 && item.endTime != 130) {
          item.patientAge.tip = item.startTime + "~" + item.endTime + "岁患者禁用";
        }else if(item.startTime != 0 && item.endTime == 130) {
          item.patientAge.tip = item.startTime + "岁以上患者禁用";
        }
      } else if(item.patientAge.risk == 2) {
        if(item.startTime == 0 && item.endTime == 130) {
          item.patientAge.tip = "0岁以上患者忌用";
        }else if(item.startTime == 0 && item.endTime != 130){
          item.patientAge.tip = item.endTime + "岁以下患者忌用";
        }else if(item.startTime != 0 && item.endTime != 130) {
          item.patientAge.tip = item.startTime + "~" + item.endTime + "岁患者忌用";
        }else if(item.startTime != 0 && item.endTime == 130) {
          item.patientAge.tip = item.startTime + "岁以上患者忌用";
        }
      } else if(item.patientAge.risk == 3) {
        if(item.startTime == 0 && item.endTime == 130) {
          item.patientAge.tip = "0岁以上患者慎用";
        }else if(item.startTime == 0 && item.endTime != 130){
          item.patientAge.tip = item.endTime + "岁以下患者慎用";
        }else if(item.startTime != 0 && item.endTime != 130) {
          item.patientAge.tip = item.startTime + "~" + item.endTime + "岁患者慎用";
        }else if(item.startTime != 0 && item.endTime == 130) {
          item.patientAge.tip = item.startTime + "岁以上患者慎用";
        }
      } else if(item.patientAge.risk == 4) {
        if(item.startTime == 0 && item.endTime == 130) {
          item.patientAge.tip = "0岁以上患者慎用，请参照说明书酌量开方";
        }else if(item.startTime == 0 && item.endTime != 130){
          item.patientAge.tip = item.endTime + "岁以下患者慎用，请参照说明书酌量开方";
        }else if(item.startTime != 0 && item.endTime != 130) {
          item.patientAge.tip = item.startTime + "~" + item.endTime + "岁患者慎用，请参照说明书酌量开方";
        }else if(item.startTime != 0 && item.endTime == 130) {
          item.patientAge.tip = item.startTime + "岁以上患者慎用，请参照说明书酌量开方";
        }
      }
    },
    endTimeChange(item,index) {
      if(item.patientAge.risk == 1) {
        if(item.startTime == 0 && item.endTime == 130) {
          item.patientAge.tip = "0岁以上患者禁用";
        }else if(item.startTime == 0 && item.endTime != 130){
          item.patientAge.tip = item.endTime + "岁以下患者禁用";
        }else if(item.startTime != 0 && item.endTime != 130) {
          item.patientAge.tip = item.startTime + "~" + item.endTime + "岁患者禁用";
        }else if(item.startTime != 0 && item.endTime == 130) {
          item.patientAge.tip = item.startTime + "岁以上患者禁用";
        }
      } else if(item.patientAge.risk == 2) {
        if(item.startTime == 0 && item.endTime == 130) {
          item.patientAge.tip = "0岁以上患者忌用";
        }else if(item.startTime == 0 && item.endTime != 130){
          item.patientAge.tip = item.endTime + "岁以下患者忌用";
        }else if(item.startTime != 0 && item.endTime != 130) {
          item.patientAge.tip = item.startTime + "~" + item.endTime + "岁患者忌用";
        }else if(item.startTime != 0 && item.endTime == 130) {
          item.patientAge.tip = item.startTime + "岁以上患者忌用";
        }
      } else if(item.patientAge.risk == 3) {
        if(item.startTime == 0 && item.endTime == 130) {
          item.patientAge.tip = "0岁以上患者慎用";
        }else if(item.startTime == 0 && item.endTime != 130){
          item.patientAge.tip = item.endTime + "岁以下患者慎用";
        }else if(item.startTime != 0 && item.endTime != 130) {
          item.patientAge.tip = item.startTime + "~" + item.endTime + "岁患者慎用";
        }else if(item.startTime != 0 && item.endTime == 130) {
          item.patientAge.tip = item.startTime + "岁以上患者慎用";
        }
      } else if(item.patientAge.risk == 4) {
        if(item.startTime == 0 && item.endTime == 130) {
          item.patientAge.tip = "0岁以上患者慎用，请参照说明书酌量开方";
        }else if(item.startTime == 0 && item.endTime != 130){
          item.patientAge.tip = item.endTime + "岁以下患者慎用，请参照说明书酌量开方";
        }else if(item.startTime != 0 && item.endTime != 130) {
          item.patientAge.tip = item.startTime + "~" + item.endTime + "岁患者慎用，请参照说明书酌量开方";
        }else if(item.startTime != 0 && item.endTime == 130) {
          item.patientAge.tip = item.startTime + "岁以上患者慎用，请参照说明书酌量开方";
        }
      }
    },
    // 添加自定义年龄
    addCustom() {
      this.specialCrowd.patientAge.push(
        {name: '自定义',patientAge:{value:'', risk: null, tip: '', advise: ''},startTime: '',endTime: ''},
      )
    },
    // 删除自定义年龄
    removeCustom(index) {
      this.specialCrowd.patientAge.splice(index,1)
    },
    // 将常用的符号转成英文逗号
    replaceComma(item) {
      return item.replace(/[，|.|。|、|;|；|/|\\\/]/ig,',')
    },
    // 保存药品规则
    medicinerueSave() {
      let that = this
      // 基本数据判断
      if(this.medicineRule.medicineClass === undefined) {
        this.$message({type:'warning',message:"请选择类型"})
        return
      }
      if(this.medicineRule.otc === undefined) {
        this.$message({type:'warning',message:"请选择类型"})
        return
      }
      if(this.medicineRule.pregnancy === undefined) {
        this.$message({type:'warning',message:"请选择妊娠分级"})
        return
      }
      if(this.medicineRule.lactation === undefined) {
        this.$message({type:'warning',message:"请选择哺乳分级"})
        return
      }
      // if(this.medicineRule.ingredient === undefined) {
      //   this.$message({type:'warning',message:"请输入成分"})
      //   return
      // }
      // if(this.medicineRule.ingredientClass === undefined) {
      //   this.$message({type:'warning',message:"请输入药物分类"})
      //   return
      // }
      if(this.medicineRule.allergyIngredient) {
        if(this.medicineRule.allergyTip === undefined) {
          this.$message({type:'warning',message:"请输入过敏提示"})
          return
        }
      }

      //  药品规则数据绑定
      for(let z = 0 ; z < this.specificationsList.length ; z++){
        if(this.specificationsList[z].name == "") {
          this.$message({type:'warning',message:"药品规格不能为空"})
          return;
        }
        let list = this.specificationsList[z].usageAndDosageList
        let arr = [];
        for(let i = 0 ; i < list.length  ; i++) {
          if(list[i].takeDirection == "" || list[i].takeDirection == undefined) {
            this.$message({type:'warning',message:"请输入药品规格("+this.specificationsList[z].name+"用法用量"+(i+1)+")的给药途径"})
            return
          }
          list[i].takeDirection = list[i].takeDirection.replace(/，/ig,",")
          let arrList = list[i].takeDirection.split(',')
          arrList.forEach(ele => {
            arr.push(ele)
          })
          if(list[i].takeFrequence == "" || list[i].takeFrequence == undefined) {
            this.$message({type:'warning',message:"请选择药品规格("+this.specificationsList[z].name+"用法用量"+(i+1)+")的频次上限"})
            return
          }
          // if(list[i].takeDose1 == "" || list[i].takeDose1 == undefined) {
          //   this.$message({type:'warning',message:"请输入药品规格("+this.specificationsList[z].name+"用法用量"+(i+1)+")的单次剂量上限1"})
          //   return
          // }
          // if(list[i].takeDose2 == "" || list[i].takeDose2 == undefined) {
          //   this.$message({type:'warning',message:"请输入药品规格("+this.specificationsList[z].name+"用法用量"+(i+1)+")的单次剂量上限2"})
          //   return
          // }
          // if(list[i].maxDose1 == "" || list[i].maxDose1 == undefined) {
          //   this.$message({type:'warning',message:"请输入药品规格("+this.specificationsList[z].name+"用法用量"+(i+1)+")的每日剂量上限1"})
          //   return
          // }
          // if(list[i].maxDose2 == "" || list[i].maxDose2 == undefined) {
          //   this.$message({type:'warning',message:"请输入药品规格("+this.specificationsList[z].name+"用法用量"+(i+1)+")的每日剂量上限2"})
          //   return
          // }
          if((list[i].internationalUnit == "" || list[i].internationalUnit == undefined) && list[i].takeDose1 && list[i].maxDose1) {
            this.$message({type:'warning',message:"请选择药品规格("+this.specificationsList[z].name+"用法用量"+(i+1)+")的国际单位"})
            return
          }
          if((list[i].meterageUnit == "" || list[i].meterageUnit == undefined)  && list[i].takeDose2 && list[i].maxDose2) {
            this.$message({type:'warning',message:"请输入药品规格("+this.specificationsList[z].name+"用法用量"+(i+1)+")的计量单位"})
            return
          }
        }
        let nary = arr.sort();
        for(let j = 0; j < nary.length - 1; j++) {
          if(nary[j] == nary[j + 1]) {
            this.$message({type:'warning',message:"药品规格("+this.specificationsList[z].name+"用法用量)的给药途径相同，请重新输入"})
            return
          }
        }
      }
      let specificationsList = [];
      this.specificationsList.forEach(ele => {
        let list = ele.titleList;
        let arr = [];
        list.forEach(item => {
          if(item.name != ele.name) {
            arr.push(item.name)
          }
        })
        let useWayAndDoseList = []
        let lists = ele.usageAndDosageList
        lists.forEach(item => {
          let obj = { ...item }
          useWayAndDoseList.push(obj)
        })
        let obj = {
          specificationName: ele.name,
          otherNames: arr,
          useWayAndDoseList: useWayAndDoseList,
          userDoseTip: ele.userDoseTip,
        }
        specificationsList.push(obj);
      })

      // 适应症数据绑定
      if(this.rationalRule.indications == "") {
        this.$message({type:'warning',message:"请输入适应症"})
        return
      }
      let contras = this.rationalRule.contras;
      for(let i = 0 ; i < contras.length ; i++) {
        if(!contras[i].risk) {
          this.$message({type:'warning',message:"("+contras[i].value+")风险等级为必填项"})
          return
        } else if(contras[i].risk && contras[i].risk != '') {
          if(!contras[i].tip) {
            this.$message({type:'warning',message:"请输入("+contras[i].value+")的风险提示"})
            return
          }
        }
      }
      let contrass = []
      contras.forEach(ele => {
        contrass.push(ele)
      })

      // 特殊人群数据绑定
      let patientSex = this.specialCrowd.patientSex;
      for(let i = 0 ; i < patientSex.length ; i++) {
        if(!!patientSex[i].patientSex.risk && patientSex[i].patientSex.risk != '') {
          if(!patientSex[i].patientSex.tip) {
            this.$message({type:'warning',message:"请输入("+patientSex[i].name+")的风险提示"})
            return
          }
        }
      }
      let pregnancy = this.specialCrowd.pregnancy;
      for(let i = 0 ; i < pregnancy.length ; i++) {
        if(pregnancy[i].pregnancy.risk && pregnancy[i].pregnancy.risk != '') {
          if(!pregnancy[i].pregnancy.tip) {
            this.$message({type:'warning',message:"请输入("+pregnancy[i].name+")的风险提示"})
            return
          }
        }
      }
      let liverRenal = this.specialCrowd.liverRenal;
      for(let i = 0 ; i < liverRenal.length ; i++) {
        if(liverRenal[i].liverRenal.risk == undefined) {
          this.$message({type:'warning',message:"("+liverRenal[i].name+")为必填项"})
          return
        } else if(liverRenal[i].liverRenal.risk && liverRenal[i].liverRenal.risk != '') {
          if(!liverRenal[i].liverRenal.tip) {
            this.$message({type:'warning',message:"请输入("+liverRenal[i].name+")的风险提示"})
            return
          }
        }
      }
      // 年龄判断
      let patientAge = this.specialCrowd.patientAge;
      for(let i = 0 ; i < patientAge.length ; i++) {
        if(patientAge[i].patientAge.risk == undefined && patientAge[i].name != '自定义') {
          this.$message({type:'warning',message:"("+patientAge[i].name+")为必填项"})
          return
        } else if(patientAge[i].patientAge.risk && patientAge[i].patientAge.risk != '') {
          if(((patientAge[i].startTime !== 0 && !patientAge[i].startTime) || patientAge[i].startTime === '') && patientAge[i].name == '自定义') {
            this.$message({type:'warning',message:"请输入"+patientAge[i].name +(i - 1)+"的开始年龄"})
            return
          } else if((!patientAge[i].endTime || patientAge[i].endTime === '') && patientAge[i].name == '自定义') {
            this.$message({type:'warning',message:"请输入"+patientAge[i].name +(i - 1)+"的结束年龄"})
            return
          } else {
            if(patientAge[i].name == '自定义') {
              patientAge[i].patientAge.value = '['+patientAge[i].startTime+','+patientAge[i].endTime+')';
            }
          }
          if(!patientAge[i].patientAge.tip) {
            if(patientAge[i].name == '自定义') {
              this.$message({type:'warning',message:"请输入("+patientAge[i].name +(i - 1)+")的风险提示"})
            }else {
              this.$message({type:'warning',message:"请输入("+patientAge[i].name+")的风险提示"})
            }
            return
          }
        }
      }
      for(let i = 0 ; i < patientAge.length ; i++) {
        for(let j = 0 ; j < patientAge.length ; j++) {
          if(i != j && patientAge[i].name == "自定义" && patientAge[j].name == "自定义" && patientAge[i].patientAge.risk && patientAge[i].patientAge.risk != "" && patientAge[j].patientAge.risk && patientAge[j].patientAge.risk != "") {
            if(patientAge[i].startTime >= patientAge[j].endTime || patientAge[i].endTime <= patientAge[j].startTime) {
            }else {
              this.$message({type:'warning',message:"自定义年龄重复"})
              return false
            }
          }
        }
      }
      let patientSexs = [];
      patientSex.forEach(ele => {
        if(ele.patientSex.risk && ele.patientSex.risk != '') {
          patientSexs.push(ele.patientSex);
        }
      })
      let pregnancys = [];
      pregnancy.forEach(ele => {
        if(ele.pregnancy.risk && ele.pregnancy.risk != '') {
          pregnancys.push(ele.pregnancy);
        }
      })
      let liverRenals = [];
      liverRenal.forEach(ele => {
        if(ele.liverRenal.risk && ele.liverRenal.risk != '') {
          liverRenals.push(ele.liverRenal);
        }
      });
      let patientAges = [];
      patientAge.forEach(ele => {
        if(ele.patientAge.risk && ele.patientAge.risk != '') {
          patientAges.push(ele.patientAge);
        }
      });
      let data = {
        _id: this.medicineRule._id,
        medicineName: this.medicineName,
        medicineClass: this.medicineRule.medicineClass,
        otc: this.medicineRule.otc,
        pregnancy: this.medicineRule.pregnancy,
        lactation: this.medicineRule.lactation,
        isAntibiotic: this.medicineRule.isAntibiotic?1:0,
        isImmunosuppressant: this.medicineRule.isImmunosuppressant?1:0,
        isPsychotropic: this.medicineRule.isPsychotropic?1:0,
        ingredient: this.medicineRule.ingredient?this.replaceComma(this.medicineRule.ingredient).split(",").filter((x) => x !== ''):[],
        ingredientClass: this.medicineRule.ingredientClass?this.replaceComma(this.medicineRule.ingredientClass).split(",").filter((x) => x !== ''):[],
        allergyIngredient: this.medicineRule.allergyIngredient?this.replaceComma(this.medicineRule.allergyIngredient).split(",").filter((x) => x !== ''):[],
        allergyTip: this.medicineRule.allergyTip,
        rationalRule: {
          medicineSpecificationList: specificationsList,
          indications: this.replaceComma(this.rationalRule.indications).split(",").filter((x) => x !== ''),
          contras: contrass,
          patientSex: patientSexs,
          pregnancy: pregnancys,
          liverRenal: liverRenals,
          patientAge: patientAges,
          medicineRange: this.rationalRule.medicineRange,
          medicineInteraction: this.rationalRule.medicineInteraction,
          medicineContras: this.rationalRule.medicineContras,
          tipThings: this.rationalRule.tipThings
        }
      }
      console.log(data)
      this.$_http
        .post(
          this.$_API.INTERFACE_RP_GET_MEDICINERULE_SAVE, {'medicineRule':data,'instructionCatalog':{staffName: this.userInfo.staffName,staffID: this.userInfo.keyID,keyID: this.keyID}}
        )
        .then(response => {
          this.$message({type: 'success',message: "药品规则修改成功"})
          this.$router.push({path: "medicineRule"});
        });
    }
  }
}
</script>
<style lang="scss" scoped>
  .regulation {
    width: calc(100% - 590px);
    height: 100%;
    float: left;
    padding-right: 76px;
    overflow: auto;
    .regulationMain {
      width: calc(100% - 76px);
      margin-left: 74px;
      padding: 24px 0px;
      position: relative;
      .warmPrompt {
        position: absolute;
        top: 22px;
        right: 0px;
        font-size: 12px;
        color: #606266;
        line-height: 26px;
      }
    }
    .el-form_top {
      overflow: hidden;
      margin: 15px 28px;
      .el-form-item {
        width: 50%;
        float: left;
        position: relative;
        .w_150 {
          width: 150px;
          input {
            width: 150px;
          }
        }
      }
    }
    .hint {
      position: absolute;
      top: 27px;
      left: 0;
      font-size: 12px;
      color: #8c8c8c;
    }
    .relative {
      position: relative !important;
      top: 0px !important;
      line-height: 20px;
    }
    /deep/.el-form-item__label:before {
      margin-right: 0px !important;
    }
    /deep/.width_256 {
      max-width: 256px !important;
      .el-input {
        max-width: 256px !important;
        input {
          width: 256px !important;
        }
      }
    }
    /deep/.width_hundred {
      width: 100% !important;
      .el-textarea {
        max-width: 100% !important;
        textarea {
          width: 100% !important;
        }
      }
    }
    /deep/.width_hundred-100 {
      width: calc(100% - 66px) !important;
      .el-input {
        max-width: 100% !important;
        input {
          width: 100% !important;
        }
      }
    }
    .specifications {
      width: 100%;
      border: 1px solid #bfbfbf;
      border-radius: 5px;
      overflow: hidden;
      margin-top: 16px;
      .el-collapse {
        border: none;
        /deep/.collapse-title {
          flex: 1 0 90%;
          order: 1;
          display: block;
          overflow: hidden;
        }
        /deep/.el-collapse-item__content {
          padding-top: 16px;
          border-top: 1px solid #bfbfbf;
        }
        /deep/.el-collapse-item__header {
          flex: 1 0 auto;
          order: -1;
          min-height: 48px !important;
          height: auto;
        }
        /deep/.el-collapse-item__arrow {
          margin: 0 15px 0 15px !important;
        }
        .titleName {
          max-width: 650px;
          padding: 13px 0px 13px;
          margin: 0px;
          overflow: hidden;
          float: left;
          li {
            list-style: none;
            float: left;
            line-height: 22px;
            margin-right: 24px;
            font-size: 14px;
             .el-icon-error{
              color: #8c8c8c;
             }
          }
        }
        .addUsage {
          color: #438bef;
          font-size: 14px;
          float: left;
          .el-icon-circle-plus {
            font-size: 15px;
            margin-right: 8px;
          }
        }
        .merge {
          float: right;
          padding-right: 24px;
          color: #8c8c8c;
          i {
            height: 19px;
            width: 19px;
            float: left;
            margin-right: 5px;
            margin-top: 15px;
            font-size: 16px;
          }
          span {
            float: left;
          }
        }
      }
      .usageAndDosage {
        .item {
          margin-bottom: 16px;
          .usageTitle {
            font-size: 16px;
            line-height: 26px;
            color: #262626;
            font-weight: 700;
            margin-bottom: 16px;
            padding: 0px 24px 0px 40px;
            .usageTitleName {
              width: 106px;
              text-align: right;
            }
            .removeBtn {
              float: right;
              font-size: 14px;
              font-weight: normal;
              cursor: pointer;
              color: #8c8c8c;
              .el-icon-error {
                font-size: 16px;
                margin-right: 6px;
                padding-top: 5px;
                float: left;
              }
            }
          }
          .el-form {
            overflow: hidden;
            margin: 0px 24px;
            .el-form-item {
              width: 50%;
              float: left;
            }
          }
          .border_btm {
            border-bottom: 1px solid #bfbfbf;
          }
          .width_150 {
            width: 150px;
            input {
              width: 150px;
            }
          }
          .unit {
            margin-left: 8px;
            font-size: 14px;
            color: #262626;
          }
          .width_88 {
            width:88px;
            margin-left: 8px;
          }
        }
        .border_btm_none {
          margin-bottom: 0px;
        }
        .item:last-child {
          margin-bottom: 0px !important;
        }
        .el-divider {
          background-color: #bfbfbf;
          margin-top: 0px;
        }
        .usageContent {
          margin: 0px 24px;
          .el-form {
            border-bottom: none;
          }
        }
      }
    }
    .addSpecifications {
      text-align: center;
      height: 48px;
      line-height: 48px;
      background: #ffffff;
      border: 1px solid #bfbfbf;
      border-radius: 5px;
      margin-top: 16px;
      margin-bottom: 24px;
      color: #438bef;
      .addUsage {
        display: flex;
        justify-content: center;
        cursor: pointer;
      }
      .el-icon-circle-plus-outline {
        font-size: 18px;
        margin-right: 13px;
        line-height: 46px;
      }
    }
    .apply {
      margin-top: 16px;
      .addIndication {
        width: 75px;
        height: 25px;
        border-radius: 13px;
        border: 1px solid #438bef;
        line-height: 25px;
        text-align: center;
        color: #438bef;
        font-size: 14px;
        cursor: pointer;
        margin-bottom: 10px;
        .el-icon-circle-plus {
          font-size: 15px;
          margin-right: 8px;
        }
      }
      .contras {
        position: relative;
        div {
          margin-bottom: 5px;
        }
        .ageHint {
          line-height: 10px;
          font-size: 12px;
          position: relative;
          span {
            margin: 0px !important;
            color: #ff5050 !important;
          }
          .endHint {
            position: absolute;
            top: 0;
            left: 174px;
          }
        }
        p {
          padding: 0;
          margin: 0;
          font-size: 14px;
          color: #8c8c8c;
        }
        .removeBtn {
          position: absolute;
          top: 7px;
          right: 0px;
          font-size: 14px;
          color: #8c8c8c;
          cursor: pointer;
          float: right;
          line-height: 18px;
          .el-icon-error {
            font-size: 16px;
            margin-right: 6px;
          }
        }
        .customTime {
          span {
            color: #262626;
            margin: 0 8px;
          }
          .el-select  {
            width:105px;
          }
        }
        .main {
          max-width: calc(100% - 50px);
          .title {
            font-size: 14px;
            color: #262626FF;
            margin-right: 10px;
          }
        }
      }
      .addCustom {
        float: right;
        color: #438bef;
        font-size: 14px;
        margin-top: 6px;
        cursor: pointer;
        position: relative;
        z-index: 100;
        line-height: 18px;
        .el-icon {
          font-size: 16px;
          margin-right: 8px;
        }
      }
      .removeCustom {
        float: right;
        margin-top: 6px;
        font-size: 14px;
        position: relative;
        z-index: 100;
        color: #8c8c8c;
        line-height: 18px;
        cursor: pointer;
        .el-icon {
          font-size: 16px;
          margin-right: 8px;
        }
      }
    }
  }
  .regulation::-webkit-scrollbar {
    width: 4px;
    height: 10px;
  }
  .regulation::-webkit-scrollbar-track {
    background: rgb(239, 239, 239);
    border-radius: 2px;
  } 
  .regulation::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 10px;
  }
  .regulation::-webkit-scrollbar-thumb:hover {
    background: #aaa;
  }
  .regulation::-webkit-scrollbar-corner {
    background: #179a16;
  }
  .borderHeader {
    /deep/.el-dialog__header {
      border: 1px solid #d8d8d8;
    }
  }
  .removeIndication {
    text-align: center;
    color: #f5222d;
    display: flex;
    justify-content: center;
    i {
      font-size: 20px;
      margin-right: 8px;
      margin-top: 1px;
    }
    span {
      font-size: 16px;
      line-height: 24px;
      color: #262626;
    }
  }
  /deep/.dialogList {
    .title {
      font-size: 14px;
      color :#606266;
      padding-left: 4px;
      font-weight: 700;
    }
    ul  {
      padding: 0;
      margin: 0;
      max-height: 500px;
      overflow: auto;
      li {
        list-style: none;
        padding: 0px 15px;
        line-height: 28px;
        height: 28px;
        float: left;
        margin-right: 12px;
        margin-bottom: 5px;
        font-size: 14px;
        cursor: pointer;
      }
      .active {
        color: #fff;
        background: #438bef;
        border-radius: 14px;
      }
    }
  }
  .mergeName {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 5px;
    margin-bottom: 10px;
  }
</style>