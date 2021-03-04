<template>
  <div class="app-container base-page pt0">
    <div class="pt0">
      <base-title :name="speechcraftType" > </base-title>
<!--      <div style="; width:180px;font-size:20pt;">{{this.speechcraftType}}</div>-->
      <div class="base-search_form">
          <div class="form-item">
              <span class="item-label">场景：</span>
              <el-select v-model="speechcraftScene"  @change="speechcraftSceneChange" placeholder="请选择" filterable clearable>
                  <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
          </div>
          <div class="form-item">
            <el-button type="primary" icon="el-icon-plus" @click="addSpeechcraft()">添加</el-button>
          </div>
      </div>
      <el-table :data="tableData" ref="multipleTable" style="width:100%;" :loading="tableLoading" class="mt24" stripe  @selection-change="handleSelectionChange">
        <el-table-column prop="speechcraftScene" label="场景名称" :show-overflow-tooltip="true" align="center"></el-table-column>
        <el-table-column prop="sentence" label="话术" :show-overflow-tooltip="true" align="center"></el-table-column>
        <el-table-column prop="useCount" label="话术使用次数" :show-overflow-tooltip="true" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="变更时间" :show-overflow-tooltip="true" align="center"></el-table-column>
        <el-table-column prop="updateUser" label="更改人" :show-overflow-tooltip="true" align="center"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
            <template #default="{row}">
                <div class="option-btn_group">
                    <span class="opt-text" @click="editSpeechcraft(row)"  >编辑</span>
                    <span class="text-danger opt-text" @click="deleteBtn(row)"  >删除</span>
                </div>
            </template>
        </el-table-column>
      </el-table>
      <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
    </div>
    <speechcraft-scene-page-edit @scenePageReload="loadData()" :title="!isEdit?'话术添加':'话术编辑'" :visible.sync="dialogVisible" type="A" :isEdit="isEdit" :selData="selData"></speechcraft-scene-page-edit>
  </div>
</template>

<script>
import SpeechcraftScenePageEdit from "./components/speechcraftScenePageEdit";
import { formatDate } from "../../filters";
export default {
  name: "speechcraftScenePage",
  components: {
    SpeechcraftScenePageEdit
  },
  props: {
    speechcraftClass: {
      type: String,
      required: true,
      default () {
        return "0";
      }
    },
    speechcraftType: {
      type: String,
      required: true,
      default () {
        return "欢迎语";
      }
    }
  },
  data () {
    return {
      selData: {},
      isEdit: false,
      dialogVisible: false,
      tableData: [],
      speechcraftClass: "",
      speechcraftType: "",
      speechcraftScene: "",
      options1: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "通用",
          label: "通用"
        },
        {
          value: "儿童",
          label: "儿童"
        },
        {
          value: "过敏",
          label: "过敏"
        },
        {
          value: "肝肾",
          label: "肝肾"
        },
        {
          value: "妊娠哺乳",
          label: "妊娠哺乳"
        },
        {
          value: "抗生素",
          label: "抗生素"
        },
        {
          value: "免疫抑制剂",
          label: "免疫抑制剂"
        },
        {
          value: "精神科",
          label: "精神科"
        },
        {
          value: "高风险药",
          label: "高风险药"
        }
      ]
    };
  },
  created () {
    this.setOptions();
    this.loadData();
  },
  methods: {
    async loadData () {
      // alert(this.speechcraftType+this.speechcraftClass)
      console.log("loadData function hyw");
      // alert("load")
      if (this.tableLoading) {
        return;
      }
      let ps = {
        speechcraftClass: this.speechcraftClass,
        speechcraftType: this.speechcraftType,
        speechcraftScene: this.speechcraftScene
      };
      let params = { ...ps };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_RM_POST_SPEECHCRAFT_LIST, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.tableData = res.data;
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    speechcraftSceneChange () {
      this.loadData();
    },
    setOptions () {
      if (this.speechcraftClass == "0") {
        this.options1 = [
          {
            value: "",
            label: "全部"
          },
          {
            value: "通用",
            label: "通用"
          },
          {
            value: "儿童",
            label: "儿童"
          },
          {
            value: "过敏",
            label: "过敏"
          },
          {
            value: "肝肾",
            label: "肝肾"
          },
          {
            value: "妊娠哺乳",
            label: "妊娠哺乳"
          },
          {
            value: "抗生素",
            label: "抗生素"
          },
          {
            value: "免疫抑制剂",
            label: "免疫抑制剂"
          },
          {
            value: "精神科",
            label: "精神科"
          },
          {
            value: "高风险药",
            label: "高风险药"
          }
        ];
      }
      // else{
      //     this.options1 = [
      //         {
      //             value: "",
      //             label: "全部"
      //         },
      //         {
      //             value: "通用",
      //             label: "通用"
      //         }
      //     ]
      // }
    },
    addSpeechcraft () {
      this.selData = {
        speechcraftClass: this.speechcraftClass,
        speechcraftType: this.speechcraftType
      };
      this.isEdit = false;
      this.dialogVisible = true;
    },
    // 编辑药品作用
    editSpeechcraft (row) {
      this.selData = row;
      this.isEdit = true;
      this.dialogVisible = true;
    },
    deleteBtn (row) {
      // alert(row.sentence+"  keyID"+ row.keyID)
      console.log(row);
      // if (!row || !row.keyID) {
      //     this.dataError();
      //     return;
      // }
      this.$confirm(
        "此操作将[" + row.sentence + "]删除，是否继续",
        "提示",
        {
          type: "warning"
        }
      ).then(it => {
        this.delete(row);
      });
    },
    // 启用/禁用员工
    delete (row) {
      this.tableLoading = true;
      let ps = {
        keyID: row.keyID
      };
      let params = { ...ps };
      this.$_http
        .get(this.$_API.INTERFACE_RM_POST_SPEECHCRAFT_DELETE, {
          params
        })
        .then(res => {
          this.$_success("操作成功");
          this.tableLoading = false;
          this.loadData();
        })
        .finally(it => {
          this.tableLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
