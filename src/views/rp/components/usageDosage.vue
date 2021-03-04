<template>
  <div v-if="usageAndDosageList.length > 0">
    <div :class="['item',(index == usageAndDosageList.length - 1?'border_btm_none':'')]" v-for="(items, index) in usageAndDosageList" :key="index">
      <div class="usageTitle"><span class="usageTitleName">用法用量{{index + 1}}</span> <span class="removeBtn"  @click.stop="removeUsageAndDosage(usageAndDosageList,index)" v-if="usageAndDosageList.length > 1"><i class="el-icon-error"></i>删除</span></div>
      <el-form ref="formData" :model="items" label-width="125px" :class="index != usageAndDosageList.length - 1?'border_btm':''">
        <el-form-item label="给药途径：" :required="true">
          <base-input v-model.lazy="items.takeDirection" clearable class="width_245"></base-input>
        </el-form-item>
        <el-form-item label="频次上限：" :required="true">
          <el-select v-model.lazy="items.takeFrequence" class="width_150">
            <el-option v-for="(list,index) in takeFrequenceList" :key="index" :value="list.dictCode" :label="list.dictName"></el-option>
          </el-select>  
        </el-form-item>
        <el-form-item label="单次剂量上限1：">
          <base-input v-model.lazy="items.takeDose1" type="number" :min="0" precision clearable class="width_150" @blur="blurTakeDose1(items.takeDose1,index)"></base-input>
          <el-select class="width_88" v-model.lazy="items.internationalUnit" clearable>
            <el-option v-for="(list,index) in internationalUnitList" :key="index" :value="list.value" :label="list.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单次剂量上限2：">
          <base-input v-model.lazy="items.takeDose2" type="number" :min="0" clearable class="width_150" @blur="blurTakeDose2(items.takeDose2,index)"></base-input>
          <el-select class="width_88" v-model.lazy="items.meterageUnit" clearable>
            <el-option  v-for="(list,index) in meterageUnitList" :key="index" :value="list.value" :label="list.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="每日剂量上限1：">
          <base-input v-model.lazy="items.maxDose1" type="number" :min="0" clearable class="width_150" @blur="blurMaxDose1(items.maxDose1,index)"></base-input>
          <el-select class="width_88" v-model.lazy="items.internationalUnit" clearable>
            <el-option v-for="(list,index) in internationalUnitList" :key="index" :value="list.value" :label="list.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="每日剂量上限2：">
          <base-input v-model.lazy="items.maxDose2" type="number" :min="0" clearable class="width_150" @blur="blurMaxDose2(items.maxDose2,index)"></base-input>
          <el-select class="width_88" v-model.lazy="items.meterageUnit" clearable>
            <el-option  v-for="(list,index) in meterageUnitList" :key="index" :value="list.value" :label="list.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服用天数上限：">
          <base-input v-model.lazy="items.maxDays" type="number" :min="0" clearable class="width_150" @blur="blurmaxDays(items.maxDays,index)"></base-input><span class="unit">天</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      takeFrequenceList: [],
      internationalUnitList: [
        {name: 'mg',value: 'mg'},
        {name: 'g',value: 'g'},
        {name: 'ml',value: 'ml'},
        {name: 'IU',value: 'IU'},
        {name: 'bu',value: 'bu'},
        {name: 'ug',value: 'ug'}
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
    }
  },
  props: {
    usageAndDosageList: {
      type: Array,
			default () {
				return [];
			}
    },
    num:{
      type: Number,
      default: 0
    }
  },
  created() {
    // this.usageAndDosageList = this.data.usageAndDosageList;
    this.getDictionaries()
  },
  watch: {
    usageAndDosageList(val) {
      this.usageAndDosageList = val
    },
    num(val) {
      this.num = val
    }
  },
  methods:{
    // 获取用药频次字典
    getDictionaries() {
      let params = {
        systemCode: "MEDICAL",
        groupCode: "D_MEDICAL_TREAT_FREQUENCY"
      };
      this.$_http.get(this.$_API.INTERFACE_HOSPITAL_DICTIONARY, {params}).then(response => {
        this.takeFrequenceList = response.data ? response.data : [];
      });
    },
    // 删除用法用量
    removeUsageAndDosage(item,index) {
      item.splice(index,1);
    },
    // 将所有负数数据转成正数
    blurTakeDose1(item,index) {
      if(item < 0) {
        this.usageAndDosageList[index].takeDose1 = Math.abs(item)
      }
    },
    blurTakeDose2(item,index) {
      if(item < 0) {
        this.usageAndDosageList[index].takeDose2 = Math.abs(item)
      }
    },
    blurMaxDose1(item,index) {
      if(item < 0) {
        this.usageAndDosageList[index].maxDose1 = Math.abs(item)
      }
    },
    blurMaxDose2(item,index) {
      if(item < 0) {
        this.usageAndDosageList[index].maxDose2 = Math.abs(item)
      }
    },
    blurmaxDays(item,index) {
      if(item < 0) {
        this.usageAndDosageList[index].maxDays = Math.abs(item)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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
    .width_245 {
      width: 245px;
      max-width: 245px;
      input {
        width: 245px;
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
</style>