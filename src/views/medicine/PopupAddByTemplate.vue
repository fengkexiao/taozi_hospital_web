<template>
  <div class="app-container" id="detailBody">
    <el-dialog
    :visible.sync="visible"
    class="popup-vertify"
    :title="title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="back"
    width="60%"
  >
      <el-card class="box-card">
            <el-form :model="query" inline>
              <el-form-item>
                <base-input v-model="query.hospitalName" placeholder="请输入药品名称"></base-input>
              </el-form-item>
              <el-button type="primary" icon="el-icon-query" @click="getDoctorList">查询</el-button>
            </el-form>
            <hr />
            <div class="images" v-if="doctorList.length === 0">
              <el-image class="img" :src="url"></el-image>
              <p class="text">暂无您搜索的药品</p>
            </div>
            <el-table :data="doctorList"
            highlight-current-row
            border fit
            v-if="doctorList.length !== 0">
              <el-table-column prop="hospitalName" label="药品名称" align="center"></el-table-column>
              <el-table-column prop="doctorName" label="厂商" align="center"></el-table-column>
              <el-table-column prop="phone" label="规格" align="center"></el-table-column>
              <el-table-column prop="doctorName" label="用法" align="center"></el-table-column>
              <el-table-column prop="phone" label="剂量" align="center"></el-table-column>
              <el-table-column prop="phone" label="价格（元）" align="center">
                <template slot-scope="scope">
                  <p>{{scope.row.price | formatMoney}}</p>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="200">
                <template #default="scope">
                  <el-button type="primary">添加</el-button>
                </template>
              </el-table-column>
            </el-table>
            <base-pagination v-model="page" @size-change="getDoctorList" @current-change="getDoctorList"/>
        </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-refresh-left" @click="back">返回</el-button>
        <el-button :loading="popHandling" type="primary" icon="el-icon-edit" @click="save">提交</el-button>
      </div>
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
      default() {
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
      default() {
        return false;
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      tableLoading: false,
      dialogVisible: false,
      currentRow: null,
      url: Img,
      radio: "",
      doctorList: [{
        hospitalName: "大力金刚丸"
      }],
      query: {
        hospitalName: "",
        doctorName: "",
        phone: ""
      },
      page: {
        // 分页参数
        pageIndex: 1,
        pageSize: 10
      }
    };
  },
  created() {
    // this.getDoctorList();
  },
  activated() {
    // this.getDoctorList();
  },
  watch: {
    propdata() {
      // this.getDoctorList();
      // console.log(this.propdata, 222);
      // this.formData = JSON.parse(JSON.stringify(this.propdata));
    }
  },
  methods: {
    back() {
      this.$emit("update:visible", false);
      this.query = {
        hospitalName: "",
        doctorName: "",
        phone: ""
      };
      this.page.pageIndex = 1;
      // this.getDoctorList();
    },
    getDoctorList() {
      let params = {
        hospitalName: this.query.hospitalName,
        doctorName: this.query.doctorName,
        phone: this.query.phone,
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize,
        doctorTypeID: 3
      };
      this.$_http
        .get(this.$_API.INTERFACE_GET_ALL_DOCTOR_PHARMACIST, { params })
        .then(res => {
          if (!res.data) return;
          this.doctorList = res.data.datas;
          this.page = res.data.pageInfo;
          // console.log(this.doctorList);
        });
    },
    searchList() {
      this.page.pageIndex = 1;
      this.getDoctorList();
    },
    handleSizeChange(val) {
      this.page.PageSize = val;
      this.getDoctorList();
    },
    handleCurrentChange(val) {
      this.page.pageIndex = val;
      this.getDoctorList();
    },
    // 点击提交处理
    save() {
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
  .el-input, .el-textarea { /*input输入框宽度调整*/
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
