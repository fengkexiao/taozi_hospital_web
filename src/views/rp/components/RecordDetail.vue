<template>
  <el-dialog title="开方详情" :visible.sync="dialogVisible" width="879px" :before-close="handleClose">
    <div class="record-detail__border">
      <el-row>
        <el-col :span="12" v-if="rpImgFileUrl" class="recode-detail-img">
          <!-- <img :src="rpImgFileUrl"> -->
          <image-view :url="rpImgFileUrl" v-if="rpImgFileUrl"></image-view>
        </el-col>
        <el-col :span="12" v-else class="recode-detail-noimg">
          <span>暂无电子处方笺</span>
        </el-col>
        <el-col :span="12" style="border-left: 1px solid #e6e3e6;">
          <div class="record-detail__split pl15" style="border-top: 1px solid #e6e3e6;margin-top: 15px;">
            处方资料
          </div>
          <div class="pl15 mt20 ">
            <span class="mr5">{{name || ''}}</span>
            <span class="mr5" v-if="sex===1">男</span>
            <span class="mr5" v-if="sex===2">女</span>
            <span class="mr5">{{patientInfo.patientAge}}岁</span>
            <span class="mr5">{{inquiryType}}</span>
            <!-- <span class="record-detail__status">{{orderStatus}}</span> -->
            <el-tag>{{orderStatus }}</el-tag>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="record-detail__split pl15">
            聊天记录
          </div>
          <div class="pl15 mt20 pr15" style="overflow: scroll;height: 400px;">
            <div v-for="(item,index) of msgList" :key="index">
              <message-row :message="item" :index="index" :to="item.to" :isDetail="true" :recordList="msgList" :sex="sex"></message-row>
            </div>
            <p v-if="msgList.length<=0" style="text-align: center;margin-top: 100px;">暂无数据</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleClose">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ImageView from "./ImageView";
import MessageRow from "./../../components/singleChat/messageRow";
export default {
  name: "RecordDetail",
  components: {
    ImageView,
    MessageRow
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    orderID: {
      type: String
    },
    rpID: {
      type: String
    },
    inquiryType: {
      type: String
    },
    orderStatus: {
      type: String
    },
    from: {
      type: String
    },
    sectionName: {
      type: String
    },
    doctorName: {
      type: String
    },
    name: {
      type: String
    },
    sex: {
      type: Number
    },
    age: {
      type: Number
    }
  },
  data () {
    return {
      patientInfo: {},
      rpImgFileUrl: "",
      msgList: []
    };
  },
  created () {
  },
  watch: {
    dialogVisible (val) {
      if (val) {
        this.getRecord()
      }
      if (val && this.rpID) {
        this.getRpById();
      } else {
        this.rpImgFileUrl = "";
      }
    }
  },
  methods: {
    async getRecord () {
      const res = await this.$_http.post(this.$_API.INTERFACE_RP_GET_GETIMRECORDBYRPORDERID,
        [this.orderID]
      );
      if (res.data) {
        let newList=[]
        let tmpList = res.data[this.orderID]
        console.log(tmpList)
        tmpList.map(item=>{
          if(item.type!=="TIMCustomElem"){
            newList.push(item)
          }
        })
        this.msgList=newList
      }
    },
    async getRpById () {
      const res = await this.$_http.get(this.$_API.INTERFACE_RP_GET_GETRPBYID, {
        params: {
          rpID: this.rpID
        }
      });
      if (res.data) {
        this.data = res.data || {};
        this.patientInfo = this.data.patientInfo || {};
        this.rpImgFileUrl = this.data.rpImgFileUrl;
      }
      // INTERFACE_RP_GET_GETIMRECORDBYRPORDERID
    },
    handleClose () {
      this.$emit("update:dialogVisible", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.record-detail__split {
  height: 47px;
  border-bottom: 1px solid #e6e3e6;
  line-height: 47px;
}

.record-detail__status {
  padding: 5px 8px;
  border-radius: 2px;
  background-color: #438bef;
  color: #ffffff;
}
.record-detail__border {
  border: 1px solid #e6e3e6;
}
.recode-detail-noimg {
  height: 600px;
  border-right: 1px solid #e6e3e6;
  line-height: 600px;
  text-align: center;
}
.recode-detail-img {
  border-right: 1px solid #e6e3e6;
  .el-image {
    width: 410px !important;
    height: 598px !important;
  }
}
</style>
