<template>
  <div class="app-container base-page">
    <base-title name="查询条件"></base-title>
    <div class="base-search_form">
      <div class="form-item">
        <span class="item-label">品名：</span>
        <base-input placeholder="请输入" v-model="query.medicineName" clearable></base-input>
      </div>
      <div class="form-item">
        <span class="item-label">简码：</span>
        <base-input placeholder="请输入" v-model="query.namePy" clearable></base-input>
      </div>
      <div class="form-item">
        <span class="item-label">批准文号：</span>
        <base-input placeholder="请输入" v-model="query.approveNo" clearable></base-input>
      </div>
      <div class="form-item">
        <span class="item-label">生产厂家：</span>
        <base-input placeholder="请输入" v-model="query.productFactory" clearable></base-input>
      </div>
      <div class="form-item">
        <span class="item-label">编号或条码：</span>
        <base-input placeholder="请输入" v-model="query.barCode" clearable></base-input>
      </div>
      <div class="form-item">
        <span class="item-label">类型：</span>
        <el-select v-model="query.medicineClass" placeholder="请选择" filterable clearable>
          <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-button type="primary" icon="el-icon-search" @click="getCommoditiesList">查询</el-button>
      </div>
      <div class="form-item">
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </div>

    <base-title name="西中成药列表"></base-title>
    <div class="base-list_option">
      <div>
        <a :href="fileUrlHref" download="down">
          <el-button icon="el-icon-download" type="primary">下载导入模版</el-button>
        </a>
      </div>
      <div class="pl24">
        <a download="down">
          <el-button icon="el-icon-upload" type="primary" @click="dialogImportVisible=true,importIsAppend='1'">批量导入</el-button>
        </a>
      </div>
      <div class="pl24">
        <el-button type="primary" icon="el-icon-plus" @click="add(2)">添加药品</el-button>
      </div>
    </div>
    <el-table :data="doctorList" stripe>
      <el-table-column prop="medicineName" label="品名" width="150" align="center"></el-table-column>
      <el-table-column prop="namePy" label="简码" width="130" align="center"></el-table-column>
      <el-table-column prop="barCode" label="编号或条码" align="center" width="110"></el-table-column>
      <el-table-column prop="medicineClass" label="类型" align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.medicineClass == 0">西药</p>
          <p v-if="scope.row.medicineClass == 1">中药</p>
          <p v-if="scope.row.medicineClass == 2">中成药</p>
          <p v-if="scope.row.medicineClass == 9">其他</p>
        </template>
      </el-table-column>
      <el-table-column label="处方药" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.otcType==0 ? "处方药" : "非处方药"}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="productSpec" label="规格" align="center"></el-table-column>
      <el-table-column prop="productUnit" label="销售单位" align="center"></el-table-column>
      <el-table-column prop="approveNo" label="批准文号" align="center"></el-table-column>
      <el-table-column prop="productFactory" label="生产厂家" align="center"></el-table-column>
      <el-table-column prop="price" label="价格(元)" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.price | formatMoney}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="saleStatus" label="状态" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.saleStatus==0 ? "已下架" : "已上架"}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="292" align="center">
        <template slot-scope="scope">
          <div class="option-btn_group">
            <span v-if="scope.row.saleStatus ==1" class="opt-text text-danger" @click="toEditStaff(scope.row,'0')">下架</span>
            <span v-else class="opt-text " @click="toEditStaff(scope.row,'1')">上架</span>
            <span class="opt-text " @click="modify(scope.row, 1)">修改</span>
            <span class="opt-text text-danger" @click="Delete(scope.row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination v-model="page" @size-change="getCommoditiesList" @current-change="getCommoditiesList" />
    <el-dialog title="批量导入" :visible.sync="dialogImportVisible" width="460px" :before-close="handleClose">
      <p>
        <el-radio v-model="importIsAppend" label="1">追加</el-radio>
        <span style="font-size: 12px;color: #676467;">不是本次导入的药品不会被删除</span>
      </p>
      <p>
        <el-radio v-model="importIsAppend" label="0">覆盖</el-radio>
        <span style="font-size: 12px;color: #676467;">以本次导入的药品为准。</span><span style="font-size: 12px;color: #FF433E;">注意：不是本次导入的药品将被删除！</span>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogImportVisible=false">取消</el-button>
        <el-upload class="upload-btn" action :show-file-list="showFileList" :http-request="handleUpload" :on-remove="handleRemove" :before-remove="beforeRemove" :on-error="handleError" multiple :file-list="fileList">
          <el-button type="primary">确定</el-button>
        </el-upload>
      </span>
    </el-dialog>
    <popup-add-by-medicine-western :visible.sync="dialogVisible" :popHandling="popHandling" :propdata="formData" title="药品信息" @save="save" />
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from "vuex";
import { SDK_APP_ID } from "@/common/Constant";
import "@/assets/sdk/webim/webim.js";
import "@/assets/sdk/webim/json2.js";
import PopupAddByMedicineWestern from "./PopupAddByMedicineWestern";
export default {
  name: "doctor",
  filters: {},
  components: {
    PopupAddByMedicineWestern
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data () {
    return {
      fileUrlHref: 'https://com-shuibei-peach-static.100cbc.com/template/西药中成药导入模板.xlsx?20200314',
      listeners: {
        onConnNotify: this.onConnNotify,
        onMsgNotify: this.onMsgNotify,
        onC2cEventNotifys: this.onC2cEventNotifys
      },
      options: {
        isLogOn: false
      },
      userSig: "",
      importIsAppend: "1",
      dialogImportVisible: false,
      showFileList: false,
      state: "",
      formData: {},
      doctorList: [],
      query: {
        orgTypeID: "",
        orgTypeName: "",
        medicineClass: "0",
        otcType: ""
      },
      startLoading: false,
      options1: [
        {
          value: "0",
          label: "西药"
        },
        {
          value: "2",
          label: "中成药"
        },
        {
          value: "9",
          label: "其他"
        }
      ],
      options2: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "处方药"
        },
        {
          value: "1",
          label: "非处方药"
        }
      ],
      page: {
        // 分页参数
        pageIndex: 1,
        pageSize: 10
      },
      dialogVisible: false,
      popHandling: false,
      // 上传
      formLabelWidth: "30px",
      form: {
        file: "",
        orgTypeID: 1
      },
      fileList: []
    };
  },
  activated () {
    // this.getCommoditiesList();
  },
  methods: {
    handleClose () {
      this.dialogImportVisible = false;
    },
    // 上传模块
    handleRemove (file, fileList) {
      // console.log(file, fileList);
    },
    beforeRemove (file, fileList) {
      // console.log(" 确定移除 ");
    },
    handleUpload (fileObj) {
      let formData = new FormData();
      formData.append("file", fileObj.file);
      formData.append("orgTypeID", this.form.orgTypeID);
      formData.append("orgID", this.userInfo.orgID);
      formData.append("addUser", this.userInfo.staffName);
      formData.append("isAppend", this.importIsAppend);
      formData.append("staffID", this.userInfo.keyID);
      // console.log(this.form);
      this.$_http
        .post(this.$_API.INTERFACE_POST_BATCH_IMPORT_XY, formData)
        // .post("http://10.0.0.200:6105/api/medicine/providerGoods/importXy", formData)
        .then(res => {
          this.$message({
            message: res.data,
            type: "success"
          });
          this.dialogImportVisible = false;
          // this.$_info(res.data);
        });
    },
    handleError (fileObj) {
      alert("导入失败");
    },
    getCommoditiesList () {
      let params = {
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize,
        medicineName: this.query.medicineName,
        barCode: this.query.barCode,
        namePy: this.query.namePy,
        otcType: this.query.otcType,
        approveNo: this.query.approveNo,
        medicineClass: this.query.medicineClass,
        productFactory: this.query.productFactory,
        orgTypeID: 1,
        orgID: this.userInfo.orgID
      };
      // console.log(params);
      // console.log(this.userInfo, 3332);
      this.$_http
        .post(
          this.$_API.INTERFACE_GET_GOODSRECOMMEND_POST_RECOMMENDLIST,
          params
        )
        .then(response => {
          if (!response.data) return;
          this.doctorList = response.data.datas;
          this.page = response.data.pageInfo;
          // console.log(response.data.datas);
        })
        .finally(() => {
          this.dialogFormVisible = true;
        });
    },
    searchList () {
      this.page.pageIndex = 1;
      this.getCommoditiesList();
    },
    handleSizeChange (val) {
      this.page.PageSize = val;
      this.getCommoditiesList();
    },
    handleCurrentChange (val) {
      this.page.pageIndex = val;
      this.getCommoditiesList();
    },
    toAudit (val) {
      this.$router.push({
        name: "doctorAudit",
        params: {
          backUrl: "/user/doctor",
          isDisable: val.isDisable,
          auditStatusID: val.auditStatusID,
          keyID: val.keyID
        }
      });
    },
    toAdd () {
      this.$router.push({
        name: "doctorAudit",
        params: {}
      });
    },
    add (state) {
      this.dialogVisible = true;
      this.state = 2;
    },
    // 重置表单
    reset () {
      this.query = {
        orgTypeID: "",
        orgTypeName: "",
        medicineClass: "0",
        otcType: ""
      };
      this.addTime = "";
      this.hospitalName = { hospitalName: "", keyID: "" };
    },
    // 新增药品/修改
    save (data) {
      let params = {
        orgTypeID: "1", // 1 表示医院端    2 表示平台端
        baseMedicineGoods: {
          orgID: this.userInfo.orgID,
          medicineID: data.keyID,
          price: data.price * 100,
          saleStatus: "1",
          thirdGoodsID: "",
          addUser: this.userInfo.keyID,
          keyID: data.keyID
        }
      };
      this.popHandling = true;
      // console.log(params, 123321);
      if (this.state === 2) {
        this.$_http
          .post(this.$_API.INTERFACE_POST_ADD_GOODS, params)
          .then(res => {
            this.$_success("添加成功");
            this.dialogVisible = false;
          })
          .finally(it => {
            this.popHandling = false;
            this.dialogVisible = false;
            this.formData = {};
            this.getCommoditiesList();
          });
      }
      if (this.state === 1) {
        this.$_http
          .post(this.$_API.INTERFACE_POST_MODIFY_GOODS, params)
          .then(res => {
            this.$_success("修改成功");
            this.dialogVisible = false;
          })
          .finally(it => {
            this.popHandling = false;
            this.dialogVisible = false;
            this.formData = {};
            this.getCommoditiesList();
          });
      }
    },
    // 上下架
    toEditStaff (e) {
      let saleStatus = "";
      if (e.saleStatus === 0) {
        saleStatus = 1;
      } else {
        saleStatus = 0;
      }
      let params = {
        orgTypeID: 1,
        goodsKeyID: e.keyID,
        saleStatus: saleStatus
      };
      // console.log(params);
      this.$_http
        .get(this.$_API.INTERFACE_GET_UPPER_SHELF, { params })
        .then(res => {
          this.$_success("操作成功");
          this.getCommoditiesList();
        });
    },
    // 删除
    Delete (e) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let isDelete = "";
          if (e.isDelete === 0) {
            isDelete = 1;
          } else {
            isDelete = 0;
          }
          let params = {
            orgTypeID: 1,
            goodsKeyID: e.keyID,
            isDelete: isDelete
          };
          // console.log(params, 222);
          this.$_http
            .post(this.$_API.INTERFACE_POST_DELETE, params)
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getCommoditiesList();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 修改
    modify (data, state) {
      let objs = JSON.parse(JSON.stringify(data));
      objs.price = objs.price / 100;
      this.dialogVisible = true;
      // console.log(e);
      this.formData = objs;
      this.state = 1;
      // console.log(this.formData);
    },
    // 获取
    getUseSig () {
      this.startLoading = true;
      let params = {
        userId: this.userInfo.keyID
      };
      let requests = this.$_http.get(this.$_API.API_RP_INITIAL_GETUSERSIG, {
        params
      });
      requests.then(res => {
        if (!res.data) return;
        this.userSig = res.data.userSig;
        this.login();
      });
    },
    // im登陆
    login () {
      // im数据
      let ImConfig = {
        sdkAppID: SDK_APP_ID,
        appIDAt3rd: SDK_APP_ID,
        accountType: 0,
        identifier: this.userInfo.keyID,
        userSig: this.userSig,
        identifierNick: this.userInfo.keyID
      };
      webim.login(
        ImConfig,
        this.listeners,
        this.options,
        async (resp) => {
        },
        function (err) {
          alert(err.ErrorInfo);
        }
      );
    },
    // 监听连接状态回调变化事件
    onConnNotify (resp) {
      let info;
      switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
          console.log("建立连接成功: " + resp.ErrorInfo);
          break;
        case webim.CONNECTION_STATUS.OFF:
          info =
            "连接已断开，无法收到新消息，请检查下您的网络是否正常: " +
            resp.ErrorInfo;
          break;
        case webim.CONNECTION_STATUS.RECONNECT:
          info = "连接状态恢复正常: " + resp.ErrorInfo;
          break;
        default:
          console.error("未知连接状态: =" + resp.ErrorInfo);
          break;
      }
    },
    // 监听 C2C 系统消息通道
    onC2cEventNotifys (resp) {
      console.log("resp", resp + " ----");
    },
    // 监听新消息事件
    onMsgNotify (newMsgList) {
      for (const msg of newMsgList) {
        for (const elem of msg.getElems()) {
          let content = elem.getContent();
          if (content.data) {
            if (content.ext === "medicine") {
              let dataStr = JSON.parse(content.data);
              let data = JSON.parse(dataStr.data);
              if (data.medicienType === 1) {
                this.$message({
                  type: "success",
                  message:
                    "<span>导入总数：</span>" + data.totalCount + "<span>条</span><br/>" +
                    "<span>导入成功：</span>" + data.importCountSuc + "<span>条</span><br/>" +
                    "<span>导入无效：</span>" + data.importCountFal + "<span>条</span>",
                  dangerouslyUseHTMLString: true
                });
                this.dialogImportVisible = false;
              }
            }
          }
        }
      }
    }
  },
  created () {
    this.getUseSig();
  }
};
</script>

<style scoped>
.upload-btn {
  display: inline-block;
  margin-left: 10px;
}
.inline-block {
  display: inline-block;
}
.change-line {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.change-line div {
  padding-left: 10px;
}
</style>
