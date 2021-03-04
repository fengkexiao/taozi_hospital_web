<template>
  <div class="app-container base-page pt0">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="问诊话术" name="first">
        <div class="pt0">
          <base-title name="类型列表"></base-title>
          <div class="base-list_option">
            <!--      <el-button type="primary" icon="el-icon-plus" @click="addMedicineInteraction()">添加</el-button>-->
          </div>
          <el-table :data="tableData" ref="multipleTable" style="width:100%;" :loading="tableLoading" class="mt24" stripe  @selection-change="handleSelectionChange">
            <el-table-column prop="riskName" label="话术类型" :show-overflow-tooltip="true" align="center">
              <template #default="scope">
                <div class="option-btn_group">
                  <span style="color: #1b8df7" class="opt-text" @click="handlePop(scope.row)">{{scope.row.speechcraftType}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="sentenceCount" label="话术条目" :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column prop="total" label="使用次数" :show-overflow-tooltip="true" align="center"></el-table-column>
          </el-table>
          <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品话术" name="second">
        <div class="pt0">
          <base-title name="类型列表"></base-title>
          <div class="base-list_option">
            <!--      <el-button type="primary" icon="el-icon-plus" @click="addMedicineInteraction()">添加</el-button>-->
          </div>
          <el-table :data="tableData2" ref="multipleTable" style="width:100%;" :loading="tableLoading" class="mt24" stripe  @selection-change="handleSelectionChange">
            <el-table-column prop="riskName" label="话术类型" :show-overflow-tooltip="true" align="center">
              <template #default="scope">
                <div class="option-btn_group">
                  <span style="color: #1b8df7"  class="opt-text" @click="handlePop(scope.row)">{{scope.row.speechcraftType}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="sentenceCount" label="话术条目" :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column prop="total" label="使用次数" :show-overflow-tooltip="true" align="center"></el-table-column>
          </el-table>
          <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { formatDate } from "../../filters";
export default {
  name: "speechcraftClass",
  components: {
  },
  data () {
    return {
      activeName: "first",
      tableData: [],
      tableData2: []
    };
  },
  created () {
    this.speechcraftClass = "0";
    this.loadData();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab);
      if (tab.name === "second") {
        this.speechcraftClass = "1";
        this.loadData();
      } else {
        this.speechcraftClass = "0";
        this.loadData();
      }
    },
    async loadData () {
      console.log("loadData function hyw");
      if (this.tableLoading) {
        return;
      }
      let ps = {
        speechcraftClass: this.speechcraftClass
      };
      let params = { ...ps };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_RM_POST_SPEECHCRAFT_STATISTIC, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.tableData = res.data;
          if (this.speechcraftClass == "1") {
            this.tableData2 = res.data;
          }
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    handlePop (row) {
      this.$router.push({
        name: "speechcraftScenePage",
        params: { speechcraftClass: this.speechcraftClass, speechcraftType: row.speechcraftType }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
