<template>
  <div class="app-container base-page pt0">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="成分类型作用" name="first">
        <composition-type-manage ref="compositionTypeManage"></composition-type-manage>
      </el-tab-pane>
      <el-tab-pane label="药品名称作用" name="second">
        <medicine-name-manage ref="medicineNameManage"></medicine-name-manage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CompositionTypeManage from './compositionTypeManage'
import MedicineNameManage from './medicineNameManage'
import { formatDate } from "../../filters";
export default {
  name: "roleDrugsManage",
  components: {
    MedicineNameManage,
    CompositionTypeManage
  },
  data () {
    return {
      activeName:'first'
    };
  },
  created () {
  },
  methods: {
    handleClick(tab,event){
      console.log(tab)
      if(tab.name==='second'){
        this.$refs.medicineNameManage.setInteractionClass()
      }else{
        this.$refs.compositionTypeManage.setInteractionClass()
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
