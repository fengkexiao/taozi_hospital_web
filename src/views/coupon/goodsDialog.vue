<template>
    <!--  商品弹窗页面  -->
    <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            width="30%">
        <div slot="title" class="dialog-title">{{title}} <i class="el-icon-close" style="float: right;cursor: pointer" @click="close"></i></div>
        <div>
            <el-form  inline>
                <el-form-item prop="doctorName" label="药品名：">
                    <el-input v-model="medicineName" maxlength="20" placeholder="请输入药品名"> </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
                    <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border fit :loading="tableLoading"
                  @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column prop="medicineName" label="药品名" align="center"></el-table-column>
        </el-table>
<!--        <base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable"/>-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
  import { mapGetters } from "vuex";
  export default {
    name: "goodsDialog",
    props:['dialogVisible'],
    data() {
      return {
        tableLoading: false,
        medicineName: '',
        pageInfo: {
          totalRow: 10,
          pageSize: 1000,
          pageIndex: 1
        },
        title: "选择活动商品",
        tableData: [],
        multipleSelection: []
      };
    },
    computed:{
      ...mapGetters(["userInfo"])
    },
    created() {
      this.initData()
    },
    methods: {
      initData(){
        this.tableData = [];
        let params = {
          medicineName: this.medicineName,
          orgTypeID: 1,
          orgID:this.userInfo.orgID,
          pageIndex: this.pageInfo.pageIndex,
          pageSize: this.pageInfo.pageSize
        }
        this.$_http.post(this.$_API.INTERFACE_GET_GOODSRECOMMEND_POST_WITHUSAGE,params)
            .then(res=>{
             if(res.success){
               this.tableData = res.data.datas;
               this.pageInfo.totalRow = res.data.pageInfo.totalRow;
             }
            })
      },
      searchData(){
          this.pageInfo = {
            totalRow: 10,
              pageSize: 10,
              pageIndex: 1
          }
          this.initData();
      },
      reset(){
        this.medicineName='';
        // this.searchData();
      },
      close(){
        this.$emit('closeDialog')
      },
      confirm(){
        if (this.multipleSelection.length === 0) {
          this.$message.warning("请选择一个商品！");
          return;
        }
        if (this.multipleSelection.length > 1) {
          this.$message.warning("只能选择一个商品！");
          return;
        }
        this.$emit('confirmDialog',this.multipleSelection[0])
      },
      loadTable() {
         this.initData()
      },
      handleSelectionChange(val) {
        if (val.length > 1) {
          this.$message.warning("只能选择一个商品！");
        }
        this.multipleSelection = val;
      }
    }
  };
</script>

<style scoped>
    .dialog-title {
        padding-bottom: 20px;
        border-bottom: 1px solid #E8E8E8;
        text-align: left;
        font-size: 18px;
        font-weight: bold;
        color: rgba(42, 44, 48, 1);
    }
</style>
