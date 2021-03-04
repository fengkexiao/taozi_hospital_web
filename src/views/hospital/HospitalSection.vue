<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">科室名称：</span>
        <el-input v-model="query.sectionName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">状态：</span>
        <el-select v-model="query.disableStatus" placeholder="请选择" clearable filterable value="">
          <el-option v-for="item in stateOptions" :key="item.statusID" :label="item.statusName" :value="item.statusID"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getSectionTableData">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="resetSearchInfoFun">重置</el-button>
      </div>
    </div>

    <base-title name="科室列表"></base-title>
    <div class="base-list_option">
      <el-button type="primary" icon="el-icon-plus" @click="addSection">新增</el-button>
      <el-button type="primary" @click="his_synchronous" v-if="userInfo.orgTypeID === 4">同步</el-button>
    </div>
    <el-table :data="tableData" stripe :loading="tableLoading">
      <el-table-column prop="hospitalSectionName" label="科室名称" align="center"></el-table-column>
      <el-table-column prop="tags" label="标签" align="center"></el-table-column>
      <el-table-column prop="sortNo" label="排序优先级" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="{row}">
          <span v-if="row.isDisable===0">启用</span>
          <span v-if="row.isDisable===1">禁用</span>
        </template>
      </el-table-column>
      <el-table-column prop="addTime" label="创建时间" align="center" width="155px">
        <template #default="{row}">
          {{row.addTime | formatDateTime() }}
        </template>
      </el-table-column>
      <el-table-column prop="addUser" label="创建人" width="150px" align="center"></el-table-column>
      <el-table-column label="操作" width="190px" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="updateSection(row)">修改</span>
            <span class="opt-text text-danger" v-if="row.isDisable===0" @click="switchStatus(row,1)">禁用</span>
            <span class="opt-text" v-if="row.isDisable===1" @click="switchStatus(row,0)">启用</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="getSectionTableData" @current-change="getSectionTableData" />

    <div id="addSectionBody">
      <el-dialog :title="bodyTitle" :visible.sync="addSectionVisible" width="700px">
        <el-form :model="addSectionData" :rules="addSectionRule" ref="addSection">
          <el-form-item label="选择科室" prop="sectionCode" label-width="120px">
            <el-radio-group v-model="addSectionData.sectionCode">
              <span v-for="(item,index) in sections" :key="index" style="display: inline-block;width: 220px">
                <el-radio :label="item.dictCode"><img width="18px" height="18px" :src="require('../../assets/image/section/'+item.dictCode+'.png')" />&nbsp;&nbsp;{{item.dictName}}
                </el-radio>
              </span>
              <div>
                <el-radio label="userDefined">自定义科室</el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="自定义科室名称" label-width="120px" prop="hospitalSectionName" v-if="addSectionData.sectionCode==='userDefined'">
            <div>
              <el-input placeholder="请输入自定义科室名称" v-model="addSectionData.hospitalSectionName"></el-input>
              &emsp;&emsp;
              <img width="25px" height="25px" @click="selectionIcon" :src="splicUrl(addSectionData)">
              <!-- &emsp;&emsp;
                  <span style=" color:red">注：自定义科室仅用于转诊</span> -->
            </div>
          </el-form-item>
          <el-form-item label="排序优先级" label-width="120px" prop="sortNo">
            <el-input placeholder="请输入正整数" v-model="addSectionData.sortNo"></el-input>
            &emsp;
            <span style=" color:red">注：数值越大，优先级越高</span>
          </el-form-item>
          <el-form-item label="标签" label-width="120px" prop="tags">
            <el-input v-model="addSectionData.tags"></el-input>
            &emsp;
            <span style=" color:red">注：可填写“特色”、“强”等标签</span>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addSectionCancel">取消</el-button>
          <el-button class="sure" type="primary" @click="saveSectionEnsure1st">保存</el-button>
        </span>
      </el-dialog>
    </div>

    <el-dialog title="请选择图标" :visible.sync="updateIcon" width="550px">
      <el-form :model="addSectionData" :rules="addSectionRule" ref="addSection">
        <el-form-item>
          <el-radio-group v-model="code">
            <span v-for="(item,index) in sections" :key="index" style="margin-right: 36px">
              <el-radio :label="item.dictCode">
                <img width="40px" height="40px" :src="require('../../assets/image/section/'+item.dictCode+'.png')" />
              </el-radio>
            </span>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button class="sure" type="primary" @click="selectionIcon1">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "HospitalSection",
  inject: ["reload"],
  components: {},
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      needQuery: false,
      tableLoading: false,
      sections: [],
      tableData: [],
      query: {
        sectionName: "",
        disableStatus: ""
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      },
      stateOptions: [
        { statusID: "", statusName: "全部" },
        { statusID: 0, statusName: "启用" },
        { statusID: 1, statusName: "禁用" }
      ],
      bodyTitle: "",
      addSectionVisible: false,
      updateIcon: false,
      code: "03",
      addSectionData: {
        orgID: "",
        sectionCode: "",
        sectionName: "",
        sortNo: "",
        hospitalSectionName: "",
        addUser: "",
        tags: "",
        sectionIcon: "03"
      },
      sectionIcon: "03",
      addSectionRule: {
        sortNo: [
          {
            required: true,
            message: "此值不可以为空",
            trigger: "blur"
          },
          {
            trigger: "blur",
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数"
          }
        ],
        hospitalSectionName: {
          required: true,
          message: "此值不可以为空",
          trigger: "blur"
        },
        firstSectionCode: {
          required: true,
          message: "此值不可以为空",
          trigger: "blur"
        },
        sectionCode: {
          required: true,
          message: "此值不可以为空",
          trigger: "blur"
        }
      }
    };
  },
  activated () {
    if (this.needQuery) {
      this.getSectionTableData();
    }
  },
  methods: {
    getSectionTableData () {
      this.needQuery = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_SECTION_LIST, {
          params: {
            orgId: this.userInfo.orgID,
            disableStatus: 0,
            ...this.query
          }
        })
        .then(response => {
          if (!response.data) return;
          let temp = response.data;

          this.tableData = temp;
        });
    },
    // 操作：重置输入框信息
    resetSearchInfoFun () {
     // this.$refs.formOrder.resetFields();
      this.query = {
        sectionName: "",
        disableStatus: ""
      };
    },
    updateSection (row) {
      this.bodyTitle = "修改科室";
      this.addSectionVisible = true;
      this.getSysSections();
      this.addSectionData = JSON.parse(JSON.stringify(row));
      if (this.addSectionData.sectionCode) {
        this.addSectionData.hospitalSectionName = "";
      } else {
        this.addSectionData.sectionCode = "userDefined";
      }
    },
    switchStatus (row, isDisable) {
      let parameter = {
        keyID: row.keyID,
        isDisable: isDisable
      };
      this.$_http
        .post(this.$_API.INTERFACE_SWITCH_ENABLE_SECTION, parameter)
        .then(res => {
          this.getSectionTableData();
        });
    },
    addSection () {
      this.bodyTitle = "添加科室";
      this.addSectionVisible = true;
      this.getSysSections();
    },

    addSectionCancel () {
      this.$refs.addSection.resetFields();
      this.addSectionVisible = false;
      this.resetData();
      this.getSectionTableData();
    },
    saveSectionEnsure1st () {
      this.$refs.addSection.validate(valid => {
        if (!valid) {
        } else {
          let parameter = JSON.parse(JSON.stringify(this.addSectionData));
          if (parameter.sectionCode === "userDefined") {
            parameter.sectionCode = parameter.sectionIcon;
          } else {
            this.sections.forEach(section => {
              if (section.dictCode === parameter.sectionCode) {
                parameter.sectionName = section.dictName;
                parameter.hospitalSectionName = section.dictName;
              }
            });
          }
          parameter.sectionIcon = parameter.sectionCode;
          if (this.bodyTitle === "添加科室") {
            this.addSectionEnsure2st(parameter);
          } else {
            this.updateSectionEnsure2st(parameter);
          }
        }
      });
    },
    addSectionEnsure2st (parameter) {
      let result = [];
      this.$_http
        .get(this.$_API.INTERFACE_GET_SECTION_LIST, {
          params: {
            orgId: this.userInfo.orgID,
            disableStatus: 0
          }
        })
        .then(response => {
          if (!response.data) return;
          result = response.data;
          const existed = result.some(
            item => item.hospitalSectionName === parameter.hospitalSectionName
          );
          if (existed) {
            this.$message.error(parameter.hospitalSectionName + " 已存在");
            return;
          }
          parameter.orgID = this.userInfo.orgID;
          parameter.addUser = this.userInfo.staffName;
          this.addSectionVisible = false;
          this.$_http
            .post(this.$_API.INTERFACE_ADD_SECTION, parameter)
            .then(response => {
              //this.$refs.formOrder.resetFields();
              this.resetData();
              this.getSectionTableData();
            });
        });
    },
    updateSectionEnsure2st (parameter) {
      this.$_http
        .get(this.$_API.INTERFACE_GET_SECTION_LIST, {
          params: {
            orgId: this.userInfo.orgID,
            disableStatus: 0
          }
        })
        .then(response => {
          if (!response.data) return;
          let result = response.data;
          const existed = result.some(
            item =>
              item.hospitalSectionName === parameter.hospitalSectionName &&
              item.keyID !== parameter.keyID
          );
          if (existed) {
            this.$message.error(parameter.hospitalSectionName + " 已存在");
            return;
          }
          this.$_http
            .post(this.$_API.INTERFACE_MODIFY_SECTION, parameter)
            .then(response => {
             // this.$refs.formOrder.resetFields();
              this.resetData();
              this.addSectionVisible = false;
              this.getSectionTableData();
            });
        });
    },
    getSysSections () {
      this.$_http
        .get(this.$_API.INTERFACE_SYS_DICT_QUERY_LIST, {
          params: {
            systemCode: "MEDICAL",
            groupCode: "D_MEDICAL_SECTION"
          }
        })
        .then(response => {
          if (!response.data) return;
          this.sections = response.data;
        });
    },
    resetData () {
      this.addSectionData = {
        orgID: "",
        sectionCode: "",
        sectionName: "",
        sortNo: "",
        hospitalSectionName: "",
        addUser: "",
        tags: "",
        sectionIcon: "03"
      };
    },
    selectionIcon () {
      // 选取图片
      this.updateIcon = true;
    },
    selectionIcon1 () {
      this.updateIcon = false;
      this.addSectionData.sectionIcon = this.code;
    },
    cancel () {
      this.updateIcon = false;
    },
    splicUrl (code) {
      return require("../../assets/image/section/" + code.sectionIcon + ".png");
    },
    // 科室HIS同步
    his_synchronous () {
      this.$_http
        .get(this.$_API.INTERFACE_GET_HIS_SECTIONCODETABLE, {
          params: {
            orgID: this.userInfo.orgID
          }
        })
        .then(response => {
          if (!response) return;
          this.$message({
            type: "success",
            message: "同步成功"
          });
          if (response.data === true) {
            this.pageInfo = {
              pageSize: 10,
              pageIndex: 1,
              totalRow: 0
            };
            this.getSectionTableData();
          }
        });
    }
  }
};
</script>

<style scoped>
</style>
