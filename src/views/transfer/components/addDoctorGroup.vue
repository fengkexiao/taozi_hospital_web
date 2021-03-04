<template>
  <div class="app-container" id="detailBody">
    <el-dialog :visible.sync="visible" width="500px" title="添加医生组" :before-close="handleClose">
      <el-table ref="singleTable" :data="tableData" style="width: 100%" stripe highlight-current-row @current-change="handleCurrentChange">
        <el-table-column type="index" width="55" label="操作" align="center">
          <template #default="{row}">
            <img width="20" :src="selectedItem.keyID === row.keyID ? slectedIcon : normalIcon" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="groupName" label="医生组" align="center"></el-table-column>
        <el-table-column prop="memo" label="说明" align="center"></el-table-column>
      </el-table>
      <base-pagination v-model="pageInfo" @size-change="getTableData" @current-change="getTableData" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleOption">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import normalIcon from "@/assets/image/transfer/circle-normal.png";
import slectedIcon from "@/assets/image/transfer/circle-selected.png";
import { mapGetters } from "vuex";
export default {
  props: {
    // 控制显示
    visible: {
      type: Boolean,
      default () {
        return false;
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      normalIcon,
      slectedIcon,
      selectedItem: { keyID: "" },
      tableData: [],
      // 页码：参数集合
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      }
    };
  },
  created () {
    this.getTableData();
  },

  watch: {
    visible (value) {
      if (value) {
        this.getTableData();
      } else {
        this.resetDatas();
      }
    }
  },
  methods: {
    handleClose () {
      this.$emit("handleClose");
    },
    cancleOption () {
      this.$emit("cancleOption");
    },
    save () {
      this.$emit("selectedDoctorGroup", this.selectedItem);
    },

    handleCurrentChange (newVal, oldVal) {
      this.selectedItem = newVal;
      console.log("newVal------", newVal);
      console.log("oldVal------", oldVal);
    },

    resetDatas () {
      this.tableData = [];
      // 页码：参数集合
      this.pageInfo = {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      };
      this.selectedItem = { keyID: "" };
    },
    // // 选中表头全部按钮
    // userSelectAll() {
    //   this.$refs.multipleTable.clearSelection();
    // },
    // // 添加医生组
    // userSelect(selection, row) {
    //   this.$refs.multipleTable.clearSelection();
    //   if (selection.length === 0) {
    //     return;
    //   }
    //   this.$refs.multipleTable.toggleRowSelection(row, true);
    //   this.selectedItem = row;
    // },
    // 获取所有医生组参数
    getTableData () {
      let params = {
        orgID: this.userInfo.orgID,
        ...this.pageInfo
      };
      console.log("获取所有医生组参数------------", params);
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_OUTSIDEDOC_LIST, { params })
        .then(res => {
          if (res.data) {
            this.selectedItem = { keyID: "" };
            this.tableData = res.data.datas;
            this.pageInfo = res.data.pageInfo;
          }
        })
        .finally(it => {
          this.tableLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#detailBody {
  .footer {
    padding-left: 300px;
  }
}
</style>
