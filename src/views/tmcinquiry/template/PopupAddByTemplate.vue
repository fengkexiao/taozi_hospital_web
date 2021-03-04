<template>
  <div id="detailBody">
    <el-dialog :visible.sync="visible" class="popup-vertify" :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="back" width="1000px">
      <el-form :model="query" inline>
        <el-form-item>
          <base-input v-model="query.hospitalName" placeholder="支持名称、拼音简码搜索"></base-input>
        </el-form-item>
        <el-button type="primary" icon="el-icon-query" @click="getDoctorList(query.hospitalName,1)">查询</el-button>
      </el-form>
      <div class="images" v-if="doctorList.length === 0">
        <el-image class="img" :src="url"></el-image>
        <p class="text">暂无您搜索的药品</p>
      </div>
      <el-table :data="doctorList" highlight-current-row stripe v-if="doctorList.length !== 0">
        <el-table-column prop="medicineName" label="药品名称" align="center"></el-table-column>
        <el-table-column prop="productFactory" label="厂商" align="center"></el-table-column>
        <el-table-column prop="productSpec" label="规格" align="center"></el-table-column>
        <el-table-column prop="dosage" label="用法用量" align="center"></el-table-column>
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
      currentRow: null,
      url: Img,
      radio: "",
      doctorList: [],
      query: {
        hospitalName: "",
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
    this.getDoctorList("", 1);
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
      this.getDoctorList(this.query.hospitalName, val);
    },
    handleCurrentChange (val) {
      this.getDoctorList(this.query.hospitalName, val);
    },
    back () {
      this.$emit("close", () => { });

      this.query = {
        hospitalName: "",
        doctorName: "",
        phone: ""
      };
      this.page.pageIndex = 1;
      // this.getDoctorList();
    },
    getDoctorList () {
      let params;
      let medicineName=this.query.hospitalName
      if (/^[a-zA-Z]+$/.test(this.query.hospitalName)) {
        params = {
          namePy: medicineName || "",
          medicineClassList: [0, 2],
          orgTypeID: "1",
          orgID: this.userInfo.orgID,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize
        };
      } else {
        params = {
          medicineName: medicineName || "",
          medicineClassList: [0, 2],
          orgTypeID: "1",
          orgID: this.userInfo.orgID,
          pageIndex: this.page.pageIndex,
          pageSize: this.page.pageSize,
          saleStatus: 1
        };
      }

      this.$_http
        .post(this.$_API.INTERFACE_GET_GOODSRECOMMEND_POST_WITHUSAGE, params)
        .then(res => {
          if (!res.data) return;
          if (this.page.pageIndex <= res.data.totalPage) {
            this.doctorList = res.data.datas;
            this.page = res.data.pageInfo;
          } else {
            this.doctorList = [];
          }
        });
    },
    searchList () {
      this.page.pageIndex = 1;
      this.getDoctorList("", 1);
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
        hospitalName: "",
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
