<template>
  <div id="detailBody">
    <el-dialog :visible.sync="visible" class="popup-vertify" :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="back" width="1200px">
      <el-form :model="query" inline>
        <el-form-item>
          <base-input v-model="query.medicineName" placeholder="支持名称、拼音简码搜索"></base-input>
        </el-form-item>
        <el-button type="primary" icon="el-icon-query" @click="getDoctorList()">查询</el-button>
      </el-form>
      <div class="images" v-if="doctorList.length === 0">
        <el-image class="img" :src="url"></el-image>
        <p class="text">暂无您搜索的药品</p>
      </div>
      <el-table :data="doctorList" highlight-current-row stripe v-loading="loading" v-if="doctorList.length !== 0">
        <el-table-column prop="medicineName" label="药品名称" align="center"></el-table-column>
        <el-table-column prop="medicineFormID" label="剂型" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.medicineFormID === 10 ? "饮片" : "颗粒剂"}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="medicineForm" label="剂型" align="center"></el-table-column> -->
        <el-table-column prop="productUnit" label="销售单位" align="center"></el-table-column>
        <el-table-column prop="productPlace" label="产地" align="center"></el-table-column>
        <!-- <el-table-column prop="phone" label="使用剂量" align="center"></el-table-column> -->
        <el-table-column prop="price" label="价格（元）" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.price | formatMoney}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination v-model="page" @size-change="getDoctorList" @current-change="getDoctorList" />
    </el-dialog>
  </div>
</template>

<script>
import Img from "@/assets/image/miss.png";
import { mapGetters } from "vuex";
export default {
  props: {
    // 控制显示
    visible: {
      type: Boolean,
      default () {
        return false;
      }
    },
    // 弹窗标题
    title: {
      type: String,
      required: true
    },
    // 弹窗是否在处理中
    popHandling: {
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
      tableLoading: false,
      dialogVisible: false,
      loading: true,
      currentRow: null,
      url: Img,
      radio: "",
      doctorList: [],
      medicineFormID: "",
      query: {
        medicineName: "",
        doctorName: "",
        phone: ""
      },
      page: {
        // 分页参数
        pageIndex: 1,
        pageSize: 10
      },
      // 当前页
      currentPage: 1,
      pageTotal: 0
    };
  },
  created () {
    // this.getDoctorList("", 1);
  },
  activated () {
    // this.getDoctorList();
  },
  watch: {
    propdata () {
      // this.getDoctorList();
      // this.formData = JSON.parse(JSON.stringify(this.propdata));
    }
  },
  methods: {
    handleEdit (index, row) {
      this.$emit("handleEdit", index, row);
    },
    handleSizeChange (val) {
      this.page.PageSize = val;
      this.getDoctorList();
    },
    handleCurrentChange (val) {
      this.page.pageIndex = val;
      this.getDoctorList();
    },
    back () {
      this.$emit("close", () => { });

      this.query = {
        medicineName: "",
        doctorName: "",
        phone: ""
      };
      this.page.pageIndex = 1;
      // this.getDoctorList();
    },
    getDoctorListFun (medicineFormID) {
      this.loading = true;
      this.medicineFormID = medicineFormID;
      let params;
      if (/^[a-zA-Z]+$/.test(this.query.medicineName)) {
        params = {
          medicineFormID: medicineFormID,
          namePy: this.query.medicineName || "",
          medicineClassList: [1],
          orgTypeID: "1",
          orgID: this.userInfo.orgID,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize
        };
      } else {
        params = {
          medicineFormID: medicineFormID,
          medicineName: this.query.medicineName || "",
          medicineClassList: [1],
          orgTypeID: "1",
          orgID: this.userInfo.orgID,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize,
          saleStatus: 1
        };
      }
      this.$_http
        .post(this.$_API.INTERFACE_GET_GOODSRECOMMEND_POST_RECOMMENDLIST, params)
        .then(res => {
          if (!res.data) return;
          if (this.page.pageIndex <= res.data.totalPage) {
            this.doctorList = res.data.datas;
            this.loading = false;
            // console.log(this.medicineFormID);
            this.page = res.data.pageInfo;
          } else {
            this.doctorList = [];
            this.loading = false;
          }
        });
    },
    getDoctorList () {
      this.loading = true;
      let params;
      if (/^[a-zA-Z]+$/.test(this.query.medicineName)) {
        params = {
          medicineFormID: this.medicineFormID,
          namePy: this.query.medicineName || "",
          medicineClassList: [1],
          orgTypeID: "1",
          orgID: this.userInfo.orgID,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize
        };
      } else {
        params = {
          medicineFormID: this.medicineFormID,
          medicineName: this.query.medicineName || "",
          medicineClassList: [1],
          orgTypeID: "1",
          orgID: this.userInfo.orgID,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize,
          saleStatus: 1
        };
      }
      this.$_http
        .post(this.$_API.INTERFACE_GET_GOODSRECOMMEND_POST_RECOMMENDLIST, params)
        .then(res => {
          if (!res.data) return;
          if (this.page.pageIndex <= res.data.totalPage) {
            this.doctorList = res.data.datas;
            this.loading = false;
            this.page = res.data.pageInfo;
          } else {
            this.doctorList = [];
            this.loading = false;
          }
        });
    },
    searchList () {
      this.page.pageIndex = 1;
      this.getDoctorList();
    },
    // handleSizeChange(val) {
    //   this.page.PageSize = val;
    //   this.getDoctorList();
    // },
    // handleCurrentChange(val) {
    //   this.page.pageIndex = val;
    //   this.getDoctorList();
    // },
    // 点击提交处理
    save () {
      if (this.popHandling) {
        return;
      }
      this.$emit("save", this.currentRow);
      this.query = {
        medicineName: "",
        doctorName: "",
        phone: ""
      };
      this.page.pageIndex = 1;
      // this.getDoctorList();
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
.el-form-item__content {
  .el-input,
  .el-textarea {
    /*input输入框宽度调整*/
    width: 400px;
    max-width: none;
  }
}
.el-table {
  margin-top: 30px;
}
.images {
  margin-left: 250px;
  margin-top: 100px;
  .text {
    margin-top: 30px;
    margin-left: 180px;
    font-size: 20px;
    color: rgb(150, 150, 150);
  }
}
</style>
