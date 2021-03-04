<template>
  <div class="treeList">
    <el-input suffix-icon="el-icon-search" placeholder="搜索指标项" v-model="treeName" class="width_170" clearable></el-input>
    <el-button slot="append" style="margin-left:10px" @click="searchName">查询</el-button>
    <el-collapse v-model="activeNames" class="collapse">
      <el-collapse-item :title="item.name" :name="item.name" v-for="(item ,index) in treeList" :key="index">
        <div draggable="true"
          @dragstart="dragstart($event,items,'list')"
          @dragend="dragend($event,items)"
          @dragenter.prevent @dragover.prevent v-for="(items, indexs) in item.children" :key="indexs" @click="activeIndex = indexs,itmeIndex = index" :class="['treeItem', activeIndex=== indexs && itmeIndex === index?'active':'']">
          <img v-if="items.icon === 'E'" src="./../../../assets/image/rule/icon_e.png">
          <img v-else-if="items.icon === 'N'" src="./../../../assets/image/rule/icon_n.png">
          <img v-else-if="items.icon === 'T'" src="./../../../assets/image/rule/icon_t.png">
          {{items.name}}
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import json from "./rule.json"
import condition from "./condition.json"
import treeListMixin from "./treeListMixin";
import { setSesssion, getSession, autoCalcDays } from "./../../../utils/tools";
export default {
  data() {
    return {
      treeName: '',
      activeNames: [],
      treeList: [],
      oldTreeList: [],
      activeIndex: 0,
      itmeIndex: 0,
      dragList: []
    }
  },
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  mixins: [treeListMixin],
  async created(){
    // let takeFrequenceList = await this.getDictionaries("MEDICAL", "D_MEDICAL_TREAT_FREQUENCY");
    let treeList = JSON.parse(JSON.stringify(json))
    treeList.forEach((ele,i) => {
      this.activeNames.push(ele.name)
      ele.children.forEach((eles,j) => {
        // if(eles.name === "给药频次") {
        //   takeFrequenceList.forEach(item => {
        //     let obj = {
        //       name: item.dictName,
        //       value: item.dictCode
        //     }
        //     eles.enumList.push(obj)
        //   })
        // }
        if(eles.dataType === "number") {
          eles.conditionList = condition.number
        }else if(eles.dataType === "enum") {
          eles.conditionList = condition.enum
        }else {
          eles.conditionList = condition.rests
        }
      })
    })
    // 目前禁用掉提示信息展示。
    treeList.forEach(ele => {
      if(ele.name !== "提示信息") {
        this.oldTreeList.push(ele)
      }
    })
    this.treeList = this.oldTreeList
    this.$emit("treeInfoList",treeList)
  },
  mounted() {
  },
  methods:{
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
    searchName() {
      if(this.treeName) {
        let arr = []
        let list = this.oldTreeList
        list.forEach(ele => {
          let obj = {
            ...ele
          }
          obj.children = []
          ele.children.forEach(eles => {
            if(eles.name.indexOf(this.treeName) != -1) {
              obj.children.push(eles)
            }
          })
          arr.push(obj)
        })
        this.treeList = arr
      }else {
        this.treeList = this.oldTreeList
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.treeList {
  padding: 9px 0px 9px 16px;
  height: 100%;
  .collapse {
    height: calc(100% - 23px);
    overflow: auto;
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
  .width_170 {
    width: 170px;
  }
  /deep/.el-collapse-item__arrow {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
  /deep/.el-collapse-item__arrow.is-active {
    -webkit-transform: rotate(-90deg) !important;
    transform: rotate(-90deg) !important;
  }
  /deep/.el-collapse-item__header:before {
    content: "";
    width: 2px;
    height: 14px;
    background: #3489ff;
    box-shadow: -1px 0px 2px 0px rgba(52,137,255,0.60);
    border-radius: 2px;
    margin-right: 5px;
  }
  .treeItem {
    display: flex;
    align-items: center;
    padding-left: 20px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    color: #606266;
    font-weight: 700;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    img {
      margin-right: 5px;
    }
  }
  .active {
    background: rgba(52,137,255,0.10);
  }
  /deep/.el-collapse ,/deep/.el-collapse-item__header,/deep/.el-collapse-item__wrap{
    border: none;
  }
  /deep/.el-collapse-item__header {
    font-size: 16px;
    /deep/.el-collapse-item__arrow {
      font-size: 13px;
    }
  }
  /deep/.el-collapse-item__content {
    padding-bottom: 0px;
    padding-right: 10px;
  }
}
</style>