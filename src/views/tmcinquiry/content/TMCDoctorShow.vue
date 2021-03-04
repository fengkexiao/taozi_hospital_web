<template>
  <div class="app-container base-page">
    <div>
      <base-title name="医生列表"></base-title>
      <div class="right-s">
        <el-popover placement="bottom-start" width="400" trigger="click">
          <h3 style="text-align: center">添加医生</h3>
          <el-form :model="addDoctorData" ref="addDoctor1" :rules="addDoctorShow" label-width="120px" style="margin: 10px 0;">
            <el-form-item label="选择医生：" prop="doctorStaffID">
              <el-select v-model="addDoctorData.doctorStaffID" placeholder="请选择" filterable clearable>
                <el-option v-for="(item,index) in staffList" :key="index" :label="item.staffName" :value="item.keyID"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序值：" prop="sortNo">
              <el-input v-model="addDoctorData.sortNo" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item inline>
              <el-button style="text-align: center" type="primary" @click="validate">确定</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" slot="reference" icon="el-icon-plus" @click="addShow()">添加</el-button>
        </el-popover>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%;margin-top:24px;" :loading="tableLoading" stripe>
      <el-table-column prop="doctorDTOForTMC.doctorName" label="医生姓名" align="center"></el-table-column>
      <el-table-column prop="doctorDTOForTMC.duty" label="医生职称" align="center"></el-table-column>
      <el-table-column prop="doctorDTOForTMC.sectionName" label="科室" align="center">
      </el-table-column>
      <el-table-column prop="sortNo" label="排序" align="center"></el-table-column>
      <el-table-column prop="1" label="操作" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <!-- <el-popover placement="bottom" trigger="hover" class="opt-text">
              <h3 style="text-align: center">修改排序</h3>
              医生：{{row.doctorDTOForTMC.doctorName}}&emsp;职称：{{row.doctorDTOForTMC.duty}}&emsp;科室：{{row.doctorDTOForTMC.sectionName}}
              <div>
                <el-form :model="updateDoctorData" :ref="'updateDoctor'+row.keyID" :rules="updateDoctorShow" label-width="120px" style="margin: 10px 0;">
                  <el-form-item label="排序值：" prop="sortNo">
                    <base-input form-type="number" v-model="updateDoctorData.sortNo"></base-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button style="text-align: center" size="mini" type="primary" @click="validate1('updateDoctor'+row.keyID,row)">确定</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="reference" @click="update(row)">修改排序</span>
            </el-popover> -->
            <span class="opt-text" @click="update(row)">修改排序</span>
            <span class="text-danger opt-text" @click="remove(row)">移除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="修改排序" :visible.sync="updateSortVisible" width="30%" :before-close="handleClose">
      <div class="pl24">
        医生：{{row.doctorDTOForTMC.doctorName}}&emsp;<br/>
        <br/>
      职称：{{row.doctorDTOForTMC.duty}}&emsp;<br/><br/>
      科室：{{row.doctorDTOForTMC.sectionName}}
      </div>
      
      <div>
        <el-form :model="updateDoctorData" ref="updateDoctor" :rules="updateDoctorShow" label-width="100px" style="margin: 10px 0;">
          <el-form-item label="排序值：" prop="sortNo">
            <base-input form-type="number" v-model="updateDoctorData.sortNo"></base-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateSortVisible = false,updateDoctorData.sortNo=''">取消</el-button>
        <el-button type="primary" @click="validate1('updateDoctor'+row.keyID)">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data () {
    return {
      show: true,
      query: {},
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      },
      tableLoading: false,
      visible: false,
      updateSortVisible: false,
      tableData: [],
      updateDoctorData: {
        sortNo:''
      },
      dialogVisible: false,
      popHandling: false,
      addDoctor: false,
      // 添加医生时表单验证
      addDoctorShow: {
        doctorStaffID: {
          required: true,
          message: "医生不能为空"
        },
        sortNo: [
          {
            required: true,
            message: "排序值不能为空"
          },
          {
            trigger: "blur",
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数"
          }
        ]
      },
      updateDoctorShow: {
        sortNo: [
          {
            required: true,
            message: "排序值不能为空"
          },
          {
            trigger: "blur",
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数"
          }
        ]
      },
      row: {
        doctorDTOForTMC: {}
      },
      // 添加医生列表数据
      addDoctorData: {},
      staffList: [],
      X: {}
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.doctorShowList();
  },
  methods: {
    handleClose () {
      this.updateSortVisible = false
    },
    doctorShowList () {
      if (this.tableLoading) {
        return;
      }
      let params = {
        orgId: this.userInfo.orgID
      };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_GET_DOCTORSHOW_LIST, {
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
    // 获取医院下所有的医生
    getStaffListByOrgID () {
      let params = {
        orgID: this.userInfo.orgID
      };
      this.$_http
        .get(this.$_API.INTERFACE_GET_HOSPITALSTAFF_GETSTAFFLISTBYORGID, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.staffList = res.data;
        });
    },
    // 点击添加获取展示医生列表
    addShow () {
      this.getStaffListByOrgID();
    },
    // 验证表单
    validate () {
      this.$refs.addDoctor1.validate(valid => {
        if (!valid) {
          return;
        }
        this.addDoctorShowData();
      });
    },
    validate1 (id) {
      this.$refs['updateDoctor'].validate(valid => {
        if (!valid) {
          return;
        }
        this.updateDoc(id);
      });
    },
    update (row) {
      this.updateSortVisible = true
      this.X = row;
      
      this.row = row
      setTimeout(()=>{
        this.$refs['updateDoctor'].resetFields()
      },0)
    },
    // 添加医生列表数据
    addDoctorShowData () {
      let _this = this;
      let data = {
        orgID: this.userInfo.orgID,
        ..._this.addDoctorData
      };
      _this.$_http
        .post(_this.$_API.INTERFACE_POST_DOCTORSHOW_ADD, data)
        .then(r => {
          if (!r.data) return;
          this.$_success("添加成功...");
          this.doctorShowList();
          this.$refs.addDoctor1.resetFields();
        });
    },
    // 修改排序
    updateDoc (id) {
      let _this = this;
      let data = {
        keyID: this.row.keyID,
        sortNo: this.updateDoctorData.sortNo
      };
      _this.$_http
        .post(_this.$_API.INTERFACE_POST_DOCTORSHOW_UPDATE, data)
        .then(r => {
          if (!r.data) return;
          this.$_success("修改成功...");
          this.updateSortVisible = false
          this.doctorShowList();
          this.$refs[id].resetFields();
        });
    },
    // 删除
    remove (row) {
      let _this = this;
      this.$confirm("确认要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            keyID: row.keyID
          };
          _this.$_http
            .post(_this.$_API.INTERFACE_POST_DOCTORSHOW_DELETE, data)
            .then(r => {
              if (!r.data) return;
              this.$_success("删除成功...");
              // 加载列表
              this.doctorShowList();
            });
        })
        .catch(() => { });
    }
  }
};
</script>

<style lang="scss" scoped>
.color-blue {
  color: #438bef;
  font-weight: 800;
}
.right-s {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  margin-right: 24px;
  margin-bottom: 24px;
}
</style>
