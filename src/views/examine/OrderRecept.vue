<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">医生姓名：</span>
        <el-input v-model="query.doctorName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="form-item">
        <span class="item-label">医生电话：</span>
        <el-input v-model="query.phone" placeholder="请输入" clearable maxlength="11"></el-input>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="geDoctors">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="refreshQueryCondition">重置</el-button>
      </div>
    </div>

    <base-title name="数据列表"></base-title>
    <el-table :data="tableData" :loading="tableLoading" stripe class="mt24">
      <el-table-column prop="doctorName" label="医生姓名" align="center"></el-table-column>
      <el-table-column prop="phone" label="医生电话" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{row}">
          <div class="option-btn_group">
            <span class="opt-text" @click="receptOrder(row)">选择</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="pageInfo" @size-change="geDoctors" @current-change="geDoctors" />

    <span id="confirmBody">
      <el-dialog title="" :visible.sync="dialogVisible" width="390px" @close="receptOrderCancel">
        <span>&emsp; &emsp;保存后将不能更改，确定该医生为开单医生？</span><br />
        <span slot="footer" class="dialog-footer" center>
          <el-button @click="receptOrderCancel">取消</el-button>
          <el-button class="sure" type="primary" @click="receptOrderConfirm()">确定</el-button>
        </span>
      </el-dialog>
    </span>

  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "examine-orderDeal-recept",
  inject: ["reload", "close"],
  props: {
    keyID: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      dialogVisible: false,
      tableData: [],
      receptDoctor: {
        receptDoctorID: "",
        receptDoctorName: ""
      },
      // 查询：条件集合
      query:
      {
        doctorName: "",
        phone: ""
      },
      // 页码：参数集合
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPage: 1
      },
      tableLoading: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.setPickerTimes();
    this.geDoctors();
  },
  activated () {
    this.setPickerTimes();
  },
  methods: {
    setPickerTimes () {
      this.searchTimes = new Date();
    },
    // 查询： 医生数据，加载表格
    geDoctors () {
      if (this.tableLoading) {
        return;
      }
      let bizInfo = {
        orgID: this.userInfo.orgID,
        doctorTypeID: 1
      };
      let params = { ...this.pageInfo, ...this.query, ...bizInfo };
      this.tableLoading = true;
      this.$_http
        .get(this.$_API.INTERFACE_USER_DOCTOR_LIST, {
          params
        })
        .then(res => {
          if (!res.data) return;
          this.tableData = res.data.datas;
          this.pageInfo = res.data.pageInfo;
        })
        .finally(it => {
          this.tableLoading = false;
        });
    },
    // 开单的方法
    receptOrderConfirm () {
      this.dialogVisible = false;
      // 执行 POST 请求
      this.$_http.post(this.$_API.INTERFACE_RECEPT_ORDER, {
        keyID: this.keyID,
        receptDoctorID: this.receptDoctor.receptDoctorID,
        receptDoctorName: this.receptDoctor.receptDoctorName
      }).then(response => {
        this.close().then(() => {
          this.$router.push({
            name: "examine-orderDeal",
            params: {}
          });
        });
      });
    },
    receptOrderCancel () {
      this.dialogVisible = false;
    },
    refreshQueryCondition () {
      this.query = { doctorName: "", phone: "" };
    },
    receptOrder (row) {
      this.receptDoctor.receptDoctorID = row.keyID;
      this.receptDoctor.receptDoctorName = row.doctorName;
      this.dialogVisible = true;
    },
    // 提醒：表格数据错误时的处理
    dataError () {
      this.$_warning("列表数据出错了，正在重新获取数据");
      this.geDoctors();
    }
  }
};
</script>

<style>
.el-dialog__body span:nth-of-type(1) {
  color: #333333;
}

.el-dialog__body span:nth-of-type(2) {
  color: #6c778c;
}

.el-textarea,
#textareaBody {
  max-width: 550px;
}

#btnThinkMore {
  padding: 10px 27px;
}
</style>
