<template>
  <div class="app-container base-page">
    <base-title name="服务列表"></base-title>
    <el-table :data="getHospitalOrdersListData" :loading="tableLoading" class="mt24" stripe>
      <el-table-column prop="rotation" label="服务轮次" align="center"></el-table-column>
      <el-table-column prop="itemsName" label="服务项目" align="center"></el-table-column>
      <el-table-column prop="serviceTimeStart" label="服务时间" align="center">
        <template #default="{row}">
          {{ row.serviceTimeStart | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="nurseName" label="服务护士" align="center"></el-table-column>
      <el-table-column prop="nursePhone" label="护士电话" align="center"></el-table-column>
      <el-table-column prop="serviceStatusName" label="状态" align="center"></el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" v-if="row.serviceStatusID == 0" @click="hospitalOrdersDistribution(row)">分配护士</span>
            <span class="opt-text" v-else-if="[10,11,20].includes(row.serviceStatusID)" @click="hospitalOrdersDistribution(row)">更换护士</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--    护士选择框-->
    <span id="nursingCheckBody">
      <el-dialog title="选择护士" :visible.sync="dialogVisible" id="nursingBody" width="1047px" @close="closeDialog">
        <div class="base-search_form">
          <div class="form-item">
            <span class="item-label">护士姓名：</span>
            <el-input v-model="query.doctorName" placeholder="请输入" clearable />
          </div>
          <div class="form-item">
            <span class="item-label">联系电话：</span>
            <el-input v-model="query.phone" placeholder="请输入" clearable maxlength="11" />
          </div>
          <div class="form-item">
            <span class="item-label">护士职称：</span>
            <el-select v-model="titleCode" value="" placeholder="请选择" filterable clearable>
              <el-option v-for="item in positionNameOptions" :key="item.titleCode" :label="item.titleName" :value="item.titleCode"></el-option>
            </el-select>
          </div>
          <div class="form-item">
            <el-button type="primary" icon="el-icon-search" @click="getHospitalOrdersDistribution">查询</el-button>
          </div>
        </div>
        <el-table :data="hospitalOrdersDistributionData" stripe id="checkBtnOne" class="mt24" :loading="tableLoading2">
          <el-table-column label="选择" width="50" align="center">
            <template #default="{row}">
              <label role="radio" tabindex="0" class="el-radio" :class="{'is-checked':checkedKeyID == row.keyID}" @click="getRadioValue(row)">
                <span class="el-radio__input" :class="{'is-checked':checkedKeyID == row.keyID}">
                  <span class="el-radio__inner"></span>
                  <input type="radio" aria-hidden="true" tabindex="-1" class="el-radio__original" value="{row.keyID}">
                </span>
              </label>
            </template>
          </el-table-column>
          <el-table-column prop="doctorName" label="护士姓名" align="center"></el-table-column>
          <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="titleName" label="职称" align="center"></el-table-column>
        </el-table>
        <base-pagination v-model="pageInfo" @size-change="getHospitalOrdersDistribution" @current-change="getHospitalOrdersDistribution" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="checkedCancel">取消</el-button>
          <el-button class="sure" type="primary" @click="checkedSure">确认</el-button>
        </span>
      </el-dialog>
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import InputWithTip from "@/components/InputWithTip";
export default {
  name: "nursing-hospitalOrders-hospitalOrdersList",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InputWithTip
  },
  props: {
    // 查询主键ID
    keyID: {
      type: String,
      required: true
    },
    hospitalID: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 护理订单单项服务信息
      getHospitalOrdersListData: [],
      tableLoading: false,
      dialogVisible: false,
      // 查询：所有条件集合
      query: { doctorName: "", phone: "", titleCode: "" },
      titleCode: "",
      positionNameOptions: [
        { titleCode: "", titleName: "全部" },
        { titleCode: 10, titleName: "主任护师" },
        { titleCode: 20, titleName: "副主任护师" },
        { titleCode: 30, titleName: "主管护师" },
        { titleCode: 40, titleName: "护师" }
      ],
      // 页码：参数集合
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 10,
        totalPage: 1
      },
      // 护士信息
      hospitalOrdersDistributionData: [],
      tableLoading2: false,
      modalCheckedId: -1,
      // 电话号码正则及提示
      formRules: {
        phone: [
          {
            trigger: "blur",
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码（11位）"
          }
        ]
      },
      checkedKeyID: -1,
      rowDate: [],
      searchState: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    let loadList = [this.getNurseOrdersList];
    this.$_http.all(...loadList).finally(it => {
      this.tableLoading = false;
    });
  },
  activated () {
    if (this.searchState) {
      this.getNurseOrdersList();
    }
  },
  methods: {
    // 获取单项护理订单的服务列表数据，加载表格
    getNurseOrdersList () {
      if (this.tableLoading) {
        return;
      }
      let hospitalOrdersInfo = {
        nursingOrderID: this.keyID,
        hospitalID: this.hospitalID
      };
      let params = { ...this.pageInfo, ...hospitalOrdersInfo };
      this.tableLoading = true;
      let requests = this.$_http.get(this.$_API.INTERFACE_NURSE_ORDERS_LIST, { params });
      requests.then(res => {
        if (!res.data) return;
        this.getHospitalOrdersListData = res.data;
        this.searchState = true;
      }).finally(it => {
        this.tableLoading = false;
      });
      return requests;
    },
    // 操作：分配/更改护士 =》显示护士选择对话框，存储所选行护理订单服务列表行的ID，传递当前用户所在的医院ID
    hospitalOrdersDistribution (row) {
      this.modalCheckedId = row.keyID;
      this.getHospitalOrdersDistribution();
      this.dialogVisible = true;
    },
    // 查询：当前用户所在医院的护士信息，查询条件：医院ID、护士名字、护士电话、职称ID
    getHospitalOrdersDistribution () {
      if (this.tableLoading2) {
        return;
      }
      if ((/^1[3-9]\d{9}$/.test(this.query.phone)) || this.query.phone === undefined || this.query.phone === null || this.query.phone === "") {
        let nursingInfo = {
          orgID: this.userInfo.orgID,
          doctorTypeID: 2
        };
        this.query.titleCode = this.titleCode;
        let params = { ...this.pageInfo, ...this.query, ...nursingInfo };
        this.tableLoading2 = true;
        this.$_http.get(this.$_API.INTERFACE_NURSE_ORDERS_NURSING, { params }).then(res => {
          if (!res.data) return;
          this.hospitalOrdersDistributionData = res.data.datas;
          this.pageInfo = res.data.pageInfo;
        }).finally(it => {
          this.tableLoading2 = false;
        });
      }
    },
    // 操作：选择单选框，保存当前行的keyID
    getRadioValue (row) {
      this.rowDate = row;
      this.checkedKeyID = row.keyID;
    },
    // 操作：关闭模态框,清空表单输入的参数
    closeDialog () {
      this.titleCode = "";
      this.checkedKeyID = -1;
      // this.$refs.formNursing.resetFields();
    },
    // 操作：取消 =》关闭对话框
    checkedCancel () {
      this.dialogVisible = false;
    },
    // 操作：确认=》传递所选行护理订单服务列表行的ID、所选护士的ID+名字+电话、操作用户的ID，关闭对话框
    checkedSure () {
      this.dialogVisible = false;
      let nursingChangeInfo = {
        houseServiceID: this.modalCheckedId,
        nurseID: this.rowDate.doctorID,
        nurseName: this.rowDate.doctorName,
        nursePhone: this.rowDate.phone,
        modifyUser: this.userInfo.keyID
      };
      this.$_http.post(this.$_API.INTERFACE_NURSE_ORDERS_DISTRIBUTION, nursingChangeInfo).then(res => {
        this.dialogVisible = false;
        this.getNurseOrdersList();
      });
    },
    // 表格数据错误时的处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.getNurseOrdersList();
    }
  }
};
</script>

<style>
#nursingCheckBody .box-card .nursingTableInput,
#searchNursingBtn {
  margin-bottom: 0;
}
#searchNursingBtn {
  margin-right: 0;
}
#nursingBody {
  margin-top: -5vh;
}
#checkBtnOne .el-table__row td:nth-of-type(1) {
  text-align: center;
}
</style>
