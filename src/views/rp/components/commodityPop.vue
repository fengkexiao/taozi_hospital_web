<template>
  <div class="reason-rejection">
    <i class="el-icon-close close-cancel" @click="handleClose"></i>
    <div class="header">
      <span>商品搜索：</span>
      <el-input  v-model.trim="textArea" placeholder="请输入商品名称" debounce style="width:338px;max-width:338px;" show-word-limit clearable></el-input>
      <el-button type="primary" icon="el-icon-search" class="ml20" @click="handleSeek">搜索</el-button>
    </div>
    <div class="hr-line"></div>
    <div class="li-container">
      <div class="left">
        <ul>
          <!-- <li v-for="(item,index) in classifyList" :key="index" :class="activeIndex == index?'active':''" @click="activeClassify(item.name,index)">{{item.name}}</li> -->
          <el-tree :data="classifyList" class="classifyTree" :highlight-current="true" :expand-on-click-node="false" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </ul>
      </div>
      <div class="right">
        <ul>
          <li v-for="(item ,index) in goodsList" :key="index">
            <el-checkbox v-model="item.state"></el-checkbox>
            <img src="../../../assets/image/noGoods.png" alt="">
            <div>
              <p class="name">[{{item.productBrand}}] {{item.medicineName}}<span>{{item.specification}}</span></p>
              <p class="num">￥{{(item.unitPrice / 100).toFixed(2)}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" class="confirm" @click="confirm">确定</el-button>
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
    providerID: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      goodsList: [],
      activeIndex: 0,
      classifyList: [],
      classifyFirst: '',
      classifySecond: "",
      textArea: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    };
  },
  watch: {
    visible (val) {
      if (val) {
        this.textArea = "";
        this.handleChange();
      }
    }
  },
  created () {

  },
  methods: {
    handleChange () {
      this.getClassifyList()
    },
    activeClassify(name,index) {
      this.activeIndex = index
      this.classifyFirst = name
      this.goodsSearch()
    },
    // 药品搜索
    goodsSearch() {
      let params = {
        orgID: this.providerID,
        classifyFirst: this.classifyFirst === '全部分类'? '':this.classifyFirst,
        classifySecond: this.classifySecond,
        textArea: this.textArea,
        productBrand: ''
      }
      this.$_http.post(this.$_API.INTERFACE_RP_POST_SEARCH,params).then(res => {
        if(res.success) {
          res.data.forEach(ele => {
            ele.state = false
            ele.takeDirection = ""
            ele.takeDose = ""
            ele.takeFrequence = ""
          })
          this.goodsList = res.data
        }else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    },
    // 药品搜索
    getClassifyList() {
      let params = {
        pharmacyID: this.providerID
      }
      let arr = [{name:'全部分类',num: 1}]
      this.classifyList = []
      this.$_http.get(this.$_API.INTERFACE_RP_GET_CLASSIFYLIST,{params:params}).then(res => {
        if(res.success) {
          res.data.forEach(ele => {
            let obj = {
              name: ele.name,
              num: 1,
              children: []
            }
            ele.childs.forEach(ele => {
              let item = {
                name: ele,
                num: 2
              }
              obj.children.push(item)
            })
            arr.push(obj)
          });
          this.classifyList = arr
          this.$nextTick(() => {
            document.querySelector('.classifyTree .el-tree-node__content').click()
          })
        }else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    },
    handleNodeClick(data,node,item) {
      if(data.num === 1) {
        this.classifyFirst = data.name
        this.classifySecond = ""
      }else if(data.num === 2){
        console.log(node)
        this.classifyFirst = node.parent.label
        this.classifySecond = node.label
      }
      this.goodsSearch()
    },
    handleSeek() {
      this.goodsSearch()
    },
    confirm() {
      let list = [];
      this.goodsList.forEach(ele => {
        if(ele.state) {
          list.push(ele)
        }
      })
      this.$emit("addGoodsList",list)
      this.$emit("close");
    },
    // 关闭
    handleClose () {
      this.$emit("close");
    },

  }
};
</script>

<style lang="scss" scoped>
.reason-rejection {
  padding: 32px 0px 10px;
  max-height: 475px;
}
.header {
  padding-left: 32px;
}
.close-cancel {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 24px;
  cursor: pointer;
}

.hr-line {
  width: 100%;
  height: 1px;
  background: rgba(216, 216, 216, 1);
  margin-top: 24px;
}
.li-container {
  font-size: 14px;
  display: flex;
  height: 300px;
  border-bottom: 1px solid #d8d8d8;
  ul {
    margin: 0;
  }
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .left {
    width: 148px;
    ul {
      padding-top: 20px;
      margin-bottom: 10px;
      padding-left: 0px;
      max-height: 300px;
      overflow: auto;
      width: 140px;
      height: 299px;
      li {
        font-size: 14px;
        color: rgba(0,0,0,0.85);
        line-height: 14px;
        margin-bottom: 16px;
        cursor: pointer;
      }
      li:hover {
        color: #438bef;
      }
      .active {
        color: #438bef;
      }
      /deep/.el-tree-node__label {
        overflow: hidden;
        text-overflow:ellipsis; 
        white-space: nowrap;
      }
    }
  }
  .right {
    border-left: 1px solid #d8d8d8;
    width: calc(100% - 118px);
    ul {
      padding-top: 14px;
      padding-left: 16px;
      height: 100%;
      overflow: auto;
    }
    li {
      display: flex;
      margin-bottom: 12px;
      align-items: center;
      img {
        height: 48px;
        width: 48px;
        margin: 0px 18px;
      }
      .name {
        color: rgba(0,0,0,0.85);
        line-height: 14px;
        font-weight: bolder;
        span {
          color: #595959;
          margin-left: 8px;
        }
      }
      .num {
        color: #fe5853;
        font-size: 14px;
        margin-top: 8px;
      }
    }
  }
}
.footer {
  text-align: center;
  margin-top: 16px;
  .confirm {
    width: 80px;
  }
}

</style>
