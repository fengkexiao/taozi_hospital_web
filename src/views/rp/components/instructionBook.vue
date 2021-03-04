<template>
  <div class="instructionBook">
    <div class="content">
      <h3>药品说明书</h3>
      <div class="item">
        <span>【生产厂家】</span>{{medicine.manufacturer}}
      </div>
      <div class="item">
        <span>【国药批文】</span>{{medicine.approvalNo}}
      </div>
      <div class="item">
        <span>【用法用量】</span>{{medicine.dosage}}
      </div>
      <div class="item">
        <span>【适应症】</span>{{medicine.indications}}
      </div>
      <div class="item">
        <span>【不良反应】</span>{{medicine.adverseReactions}}
      </div>
      <div class="item">
        <span>【禁忌症】</span>{{medicine.contraindications}}
      </div>
      <div class="item">
        <span>【注意事项】</span>{{medicine.warning}}
      </div>
      <div class="item">
        <span>【孕妇及哺乳期妇女用药】</span>{{medicine.pregnancyAndLactation}}
      </div>
      <div class="item">
        <span>【儿童用药】</span>{{medicine.pediatricUse}}
      </div>
      <div class="item">
        <span>【老年患者用药】</span>{{medicine.geriatricUse}}
      </div>
      <div class="item">
        <span>【药理作用】</span>{{medicine.interactionsOfDrugs}}
      </div>
      <div class="item">
        <span>【药代动力学】</span>{{medicine.pharmacokinetics}}
      </div>
      <div class="item">
        <span>【药物过量】</span>{{medicine.overdose}}
      </div>
      <div class="item">
        <span>【成分】</span>{{medicine.ingredients}}
      </div>
      <!-- <div class="item">
        <span>【化学成分】</span>{{medicine.ingredients}}
      </div> -->
      <div class="item">
        <span>【贮藏】</span>{{medicine.storage}}
      </div>
      <div class="item">
        <span>【包装】</span>{{medicine.packaging}}
      </div>
      <div class="item">
        <span>【有效期】</span>{{medicine.shelfLife}}
      </div>
    </div>
    <div class="specificationSort"> 
      <div :class="['item',index == activeIndex?'active':'']" v-for="(item,index) in medicineList" :key="index" @click="activeClick(index)">
        <span :class="['nub',index + 1 > 9?'numPd':'']">{{index + 1}}</span>
        <div class="moveBtn">
          <!-- <i class="el-icon el-icon-caret-top" v-if="index != 0" @click.stop="topBtn"></i>
          <i class="el-icon el-icon-caret-bottom" v-if="index != medicineList.length -1"  @click.stop="bottomBtn"></i> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'instructionBook',
  data () {
    return {
      activeIndex: 0,
      medicineList: [],
      medicine: {}
    }
  },
  props: {
    medicineObj: {
      type: Object,
			default () {
				return {};
			}
    }
  },
  watch: {
    medicineObj(val) {
      this.medicineList = val.medicineInstructionsList
      if(this.medicineList.length > 0) {
        this.medicine = this.medicineList[0]
      }
    }
  },
  methods:{
    // 上移排序
    topBtn() {
      alert('上移')
    },
    // 下移排序
    bottomBtn() {
      alert("下移")
    },
    // 切换说明书
    activeClick(index) {
      this.activeIndex = index
      this.medicine = this.medicineList[index]
    }
  }
}
</script>
<style lang="scss" scoped>
  .instructionBook {
    width: 590px;
    float: left;
    padding-left: 38px;
    border: 1px solid #bfbfbf;
    border-top: none;
    position: relative;
    height: 100%;
    .content {
      height: 100%;
      overflow: auto;
      padding-right: 28px;
      h3 {
        line-height: 64px;
        text-align: center;
        font-size: 18px;
        padding: 0px;
        margin: 0px;
      }
      .item {
        color: #595959;;
        margin-bottom: 12px;
        font-size: 14px;
        line-height: 22px;
        span {
          display: inline-block;
          color: #000;
          position: relative;
          left: -7px;
          min-width: 84px;
          font-weight: 700;
        }
      }
    }
    .content::-webkit-scrollbar {
      width: 3px;
      height: 10px;
    }
    .content::-webkit-scrollbar-track {
      background: rgb(239, 239, 239);
      border-radius: 2px;
    } 
    .content::-webkit-scrollbar-thumb {
      background: #bfbfbf;
      border-radius: 10px;
    }
    .content::-webkit-scrollbar-thumb:hover {
      background: #aaa;
    }
    .content::-webkit-scrollbar-corner {
      background: #179a16;
    }
    .specificationSort {
      position: absolute;
      top: 17px;
      left: -2px;
       .item {
        width: 33px;
        height: 20px;
        border: 1px solid #438bef;
        border-bottom-right-radius: 9px;
        border-top-right-radius: 9px;
        display: flex;
        margin-bottom: 8px;
        cursor: pointer;
        .nub {
          align-items: center;
          padding-left: 10px;
          font-size: 12px;
          line-height: 20px;
        }
        .numPd {
          padding-left: 4px;
        }
        .moveBtn {
          position: relative;
          top: 0px;
          right: -1px;
          height: 20px;
          line-height: 20px;
          .el-icon {
            font-size: 12px;
            color: #438bef;
            display: block;
            cursor: pointer;
          }
          .el-icon-caret-top {
            position: relative;
            top: -1px;
          }
          .el-icon-caret-bottom {
            position: absolute;
            top: 8px;
          }
        }
       }
       .active {
         background: #438bef !important;
         color: #fff !important;
         .el-icon {
           color: #fff !important;
         }
       }
    }
  }

</style>