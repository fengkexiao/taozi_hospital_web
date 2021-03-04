<template>
  <div class="refuse_explain">
    <i class="el-icon-close close-cancel" @click="handleClose"></i>
    <p class="title">拒绝说明</p>
    <div class="content">
      <ul class="reminder_ul">
        <template v-for="(item,index) in validateResults"> 
          <li :key="index">
            <el-checkbox v-model="item.state" @change="changeState(item,index)"></el-checkbox>
            <span :class="(item.risk == 1 || item.risk == 2)?'forbidden':'deque'">{{(item.risk == 1 || item.risk == 2)?'禁用':'慎用'}}</span> 
            <p class="text"><span v-if="item.medicineName" class="medicineName">{{item.medicineName}} </span>{{item.tip}}</p>
            <div style="clear:both;"></div>
            <p class="suggest" v-if="item.advise">用药建议：{{item.advise}}</p>
          </li>
        </template>
      </ul>
      <div>
        <p class="custom">自定义说明：</p>
        <el-input type="textarea" v-model.trim="filterText" maxlength="200" :rows="5" show-word-limit placeholder="请输入"></el-input>
      </div>
      <el-button type="primary" class="confirm"  @click="handleConf">确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "reasonRejection",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    validateResults: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      dataList: [],
      filterText: ""
    };
  },
  watch: {
    visible (val) {
      if (val) {
        this.filterText = "";
        this.validateResults.forEach((ele,index) => {
          this.filterText = this.filterText + (ele.medicineName?ele.medicineName+" ":'') + ele.tip + '。\n'
        })
      }
    },
    validateResults(val) {
      this.validateResults = val
    }
  },
  methods: {
    // 复选框点击文本框添加删除文本
    changeState(item,index) {
      if(item.state) {
        let name = (item.medicineName?item.medicineName+" ":'') + item.tip + '。\n'
        this.filterText = this.filterText + name
      }else {
        let name = (item.medicineName?item.medicineName+" ":'') + item.tip + '。\n'
        this.filterText = this.filterText.replace(name,'')
      }
    },  
    // 确定
    handleConf () {
      if (this.filterText) {
        if(this.filterText.length > 200) {
          this.$_warning({
            message: "拒绝说明长度不能超过200",
            type: "warning"
          });
          return false;
        }else {
          this.$emit("change", this.filterText || "");
        }
      } else {
        this.$_warning({
          message: "请输入拒绝说明",
          type: "warning"
        });
        return false;
      }
    },
    // 关闭
    handleClose () {
      this.$emit("close");
    },
  }
};
</script>

<style lang="scss" scoped>
.refuse_explain {
  padding: 0px 12px;
  .close-cancel {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 16px;
    cursor: pointer;
  }
  .title {
    margin-top: 4px;
    text-align: center;
    padding: 0px;
    padding-bottom: 15px;
    font-size: 16px;
    color: #000;
    border-bottom: 1px solid #e8e8e8;;
  }
  .content {
    margin-top: 15px;
    .reminder_ul {
      padding: 0;
      margin: 0;
      border-radius: 4px;
      max-height: 500px;
      overflow: auto;
      li {
        list-style: none;
        overflow: hidden;
        margin-bottom: 12px;
        position: relative;
        >span {
          float: left;
          width: 40px;
          height: 21px;
          line-height: 21px;
          border-radius: 2px;
          text-align: center;
          margin-right: 8px;
          font-size: 12px;
        }
        .text {
          float: left;
          font-size: 14px;
          color: #000;
          line-height: 22px;
          max-width: 390px;
          text-align: left;
          line-height: 16px;
          span {
            padding-left: 10px;
          }
          .medicineName {
            padding: 0px;
            color: #000;
            font-weight: 700;
          }
        }
        .el-checkbox {
          float: left;
          margin-right: 8px;
          padding-top: 2px;
        }
      }
      .suggest {
        padding-left: 71px;
        text-align: left;
        font-size: 12px;
        line-height: 14px;
        color: #262626;
        min-width: 300px;
        max-width: 364px;
      }
    }
    .forbidden {
      color: #fff;
      background: #fe5853;
    }
    .deque {
      color: #fff;
      background: #fa9414;
    }
    .custom {
      color: #000000D9;
      line-height: 14px;
      font-size: 14px;
      margin-bottom: 8px;
    }
    .confirm {
      margin: 16px auto;
      display: block;
    }
  }
}
</style>
