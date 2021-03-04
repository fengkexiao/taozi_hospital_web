<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">医生类别：</span>
        <el-select v-model="query.doctorSourceID" placeholder="请选择" clearable filterable>
          <el-option v-for="item in doctorOptions" :key="item.groupStatus" :label="item.groupStatusName" :value="item.groupStatus"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">患者类别：</span>
        <el-select v-model="query.trafficSourceID" placeholder="请选择" clearable filterable>
          <el-option v-for="item in patientOptions" :key="item.groupStatus" :label="item.groupStatusName" :value="item.groupStatus"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">科室：</span>
        <el-select v-model="query.sectionID" placeholder="请选择" clearable filterable>
          <el-option v-for="item in sectionOptions" :key="item.keyID" :label="item.hospitalSectionName" :value="item.keyID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">就诊方式：</span>
        <el-select v-model="query.treatWayID" placeholder="请选择" clearable filterable>
          <el-option v-for="item in treatWayOptions" :key="item.groupStatus" :label="item.groupStatusName" :value="item.groupStatus"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">分润：</span>
        <el-select v-model="query.isProfit" placeholder="请选择" clearable filterable>
          <el-option v-for="item in profitOptions" :key="item.groupStatus" :label="item.groupStatusName" :value="item.groupStatus"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <span class="item-label">状态：</span>
        <el-select v-model="query.isDisable" placeholder="请选择" clearable filterable>
          <el-option v-for="item in stateOptions" :key="item.groupStatus" :label="item.groupStatusName" :value="item.groupStatus"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="queryByConditions()">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </div>

    <base-title name="规则列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addRule">新增规则</el-button>
    </div>
    <el-table :data="tableData" :loading="tableLoading" stripe>
      <el-table-column prop="ruleName" label="规则名称" align="center"></el-table-column>
      <el-table-column prop="doctorSourceName" label="医生类别" align="center"></el-table-column>
      <el-table-column prop="doctorRange" label="医生组" :formatter="doctorRangeFormat" align="center"></el-table-column>
      <el-table-column prop="trafficSourceName" label="患者类别" align="center"></el-table-column>
      <el-table-column prop="sectionName" label="科室" :formatter="sectionNameFormat" align="center"></el-table-column>
      <el-table-column prop="treatWayName" label="就诊方式" align="center"></el-table-column>
      <el-table-column prop="isProfit" label="分润" :formatter="isProfitFormatter" align="center"></el-table-column>
      <el-table-column prop="priority" label="优先级" align="center"></el-table-column>
      <el-table-column prop="isDisable" label="状态" :formatter="isDisableFormatter" align="center"></el-table-column>
      <el-table-column prop="modifyUser" label="修改人" align="center"></el-table-column>
      <el-table-column prop="modifyTime" label="修改时间" align="center" width="155px"></el-table-column>
      <el-table-column label="操作" width="270" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="details(row)">详情</span>
            <template v-if="row.platRule === 0">
              <div class="line"></div>
              <span class="opt-text" @click="update(row)">修改</span>
              <div class="line"></div>
              <span class="opt-text" @click="confirmDoctor(row)">指定医生</span>
              <div class="line"></div>
              <span class="opt-text" @click="changeDisable(row)">{{row.isDisable === 0 ? "禁用" : "启用"}}</span>
              <div class="line"></div>
              <span class="text-danger opt-text" @click="remove(row)">删除</span>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "transfer-transferProfitRule",
  filters: {},
  computed: {
    ...mapGetters(["userInfo"])
  },
  components: {},
  props: {
    isReload: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      tableLoading: false,
      tableData: [],
      query: {
        doctorSourceID: "",
        trafficSourceID: "",
        sectionID: "",
        treatWayID: "",
        isProfit: "",
        isDisable: "",
        orgID: ""
      },

      // 科室类别
      sectionOptions: [{ hospitalSectionName: "不限", keyID: "" }],
      // 就诊方式
      treatWayOptions: [
        { groupStatus: 0, groupStatusName: "不限" },
        { groupStatus: 1, groupStatusName: "门诊" },
        { groupStatus: 2, groupStatusName: "住院" }
      ],
      // 医生类别
      doctorOptions: [
        { groupStatus: 0, groupStatusName: "不限" },
        { groupStatus: 1, groupStatusName: "本院医生" },
        { groupStatus: 2, groupStatusName: "院外医生" }
      ],
      // 患者类别
      patientOptions: [
        { groupStatus: 0, groupStatusName: "不限" },
        { groupStatus: 1, groupStatusName: "本院患者" },
        { groupStatus: 2, groupStatusName: "院外患者" }
      ],
      // 是否分润
      profitOptions: [
        { groupStatus: 0, groupStatusName: "否" },
        { groupStatus: 1, groupStatusName: "是" }
      ],
      // 查询：状态下拉集合
      stateOptions: [
        { groupStatus: 0, groupStatusName: "启用" },
        { groupStatus: 1, groupStatusName: "禁用" }
      ],
      page: {
        // 分页参数
        pageIndex: 1,
        pageSize: 10
      }
    };
  },
  // 页面渲染之前触发 只会触发一次
  created () {
    this.query.orgID = this.userInfo.orgID;
    this.fetchSectionList();
    this.queryRulesListRequest();
  },
  activated () {
    this.queryRulesListRequest();
  },
  methods: {
    /**
     * 科室获取
     */
    fetchSectionList () {
      this.$_http
        .get(this.$_API.INTERFACE_GET_SECTION_LIST, {
          params: {
            orgId: this.userInfo.orgID,
            disableStatus: 0
          }
        })
        .then(response => {
          if (!response.data) return;
          this.sectionOptions = this.sectionOptions.concat(response.data);
        });
    },
    /**
     * 重置
     */
    reset () {
      this.query = {
        doctorSourceID: "",
        trafficSourceID: "",
        sectionID: "",
        treatWayID: "",
        isProfit: "",
        isDisable: "",
        orgID: this.userInfo.orgID
      };
      this.queryRulesListRequest();
    },
    /**
     * 条件查询
     */
    queryByConditions () {
      this.queryRulesListRequest();
    },
    /**
     * 规则列表查询
     */
    queryRulesListRequest () {
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_TRANSFER_GET_SHARERULEGROUP_LIST, {
          params: this.query,
          orgID: this.userInfo.orgID
        })
        .then(
          response => {
            this.tableLoading = false;
            if (!response.data) return;
            let temp = response.data;
            this.tableData = temp;
          },
          () => {
            this.tableLoading = false;
          }
        );
    },
    // 添加新规
    addRule () {
      this.$router.push({
        name: "transfer-newProfitRule"
      });
    },
    /**
     * 指定医生
     */
    confirmDoctor (row) {
      this.$router.push({
        name: "confirmDoctor",
        params: {
          ruleName: row.ruleName,
          keyID: row.keyID,
          orgID: row.orgID
        }
      });
    },
    /**
     * 是否禁用/启用
     */
    changeDisable (row) {
      this.tableLoading = true;
      let params = {
        keyID: row.keyID,
        isDisable: row.isDisable === 0 ? 1 : 0
      };
      this.$_http
        .post(
          this.$_API.INTERFACE_TRANSFER_POST_SHARERULEGROUP_SWITCHSTATUS,
          params
        )
        .then(
          response => {
            this.tableLoading = false;
            if (response.data === true) {
              row.isDisable = row.isDisable === 0 ? 1 : 0;
            }
          },
          () => {
            this.tableLoading = false;
          }
        );
    },
    /**
     * 删除
     */
    remove (row) {
      this.$confirm("此操作将删除该规则, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableLoading = true;
          this.$_http
            .post(this.$_API.INTERFACE_TRANSFER_POST_SHARERULEGROUP_DEL, {
              keyID: row.keyID
            })
            .then(
              response => {
                this.$_success("删除成功");
                this.tableLoading = false;
                this.queryRulesListRequest();
              },
              () => {
                this.tableLoading = false;
              }
            );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /**
     * 修改
     */
    update (row) {
      this.$router.push({
        name: "transfer-newProfitRule",
        params: {
          keyID: row.keyID,
          isUpdate: true
        }
      });
    },
    /**
     * 详情
     */
    details (row) {
      this.$router.push({
        name: "transfer-ruleDetail",
        params: {
          keyID: row.keyID,
          isPlatRule: row.platRule === 1
        }
      });
    },
    /**
     * 医生来源格式化
     */
    doctorRangeFormat (row, column) {
      return row.doctorRange === 0 ? "不限" : "指定医生组";
    },
    /**
     * 分润方式式化
     */
    isProfitFormatter (row, column) {
      return row.isProfit === 0 ? "否" : "是";
    },
    /**
     * 分润方式式化
     */
    isDisableFormatter (row, column) {
      return row.isDisable === 0 ? "启用" : "禁用";
    },
    sectionNameFormat (row) {
      return row.sectionName ? row.sectionName : "不限";
    }
  }
};
</script>

<style scoped>
.left {
  float: left;
}
.right {
  float: right;
  margin-right: 20px;
  margin-top: 10px;
}
.color-blue {
  color: #438bef;
  font-weight: 800;
}
</style>
