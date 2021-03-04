<template>
  <div class="verbalTrick">
    <div style="background:#eeeeee;height:6px;"></div>
    <div class="collapse">
      <div class="beforeBg">话术库</div>
      <div :class="[ activeIndex == index ? 'active' : '' , 'verbalTrickList', (index == dataList.length -1) ? 'noneBorderBottom': '']" v-for="(item,index) in dataList" :key="index" @click="activeIndex = index" >
        <span class="icon" title="复制" @click.stop="copyClick(item.speechcraft,'general')">
          <img :src="activeIndex == index?copyUrl:copyUrl1">
        </span>
        <span class="icon" title="一键发送" @click.stop="sendClick(item.speechcraft,'general')">
          <img :src="activeIndex == index?sendUrl:sendUrl1">
        </span>
        <div class="content">
          <span class="type">{{item.speechcraftType}}:</span>
          <span class="tip" v-for="(items,indexs) in item.speechcraft" :key="indexs">
            <template v-if="items.showState">
              {{items.sentence}}
            </template>
          </span>
        </div>
      </div>
      <div style="background:#eeeeee;height:6px;"></div>
      <el-tabs v-model="tabtActive" type="card" @tab-click="handleTabClick">
        <el-tab-pane :label="item.speechcraftType" :name="item.speechcraftType" v-for="(item,index) in tabList" :key="index">
          <div class="tabList" v-for="(items,indexs) in item.speechcraft" :key="indexs">
            <span class="icon" title="复制" @click.stop="copyClick(items.sentence,items.keyID)">
              <img :src="copyUrl1">
            </span>
            <span class="icon" title="一键发送" @click.stop="sendClick(items.sentence,items.keyID)">
              <img :src="sendUrl1">
            </span>
            <div class="content">
              {{items.sentence}}
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import copyUrl from './../../../assets/image/rule/copy.png'
import copyUrl1 from './../../../assets/image/rule/copy1.png'
import sendUrl from './../../../assets/image/rule/send.png'
import sendUrl1 from './../../../assets/image/rule/send1.png'
export default {
  name: "verbalTrick",
  data() {
    return {
      activeNames: ["1"],
      activeIndex: 0,
      dataList: [],
      tabList: [
        {name: '正品'},
        {name: '物流'},
        {name: '价格/订单'},
        {name: '退款'}
      ],
      tabtActive: '',
      copyUrl: '',
      copyUrl1: '',
      sendUrl: '',
      sendUrl1: '',
      dataObj: {}
    }
  },
  props:{
    scene: String
  },
  watch: {
    scene(val) {
      if(val) {
        this.dataList.forEach(ele => {
          let showIndex = 0, showState = false,defaultState = false,defaultIndex = 0;
          ele.speechcraft.forEach((eles,index) => {
            eles.showState = false
            if(eles.speechcraftScene === this.scene) {
              showState = true
              showIndex = index
            }
            if(eles.speechcraftScene === "通用") {
              defaultState = true
              defaultIndex = index
            }
          })
          if(showState) {
            ele.speechcraft.forEach((eles,index) => {
              if(showIndex === index) {
                eles.showState = true
              }
            })
          }else if(defaultState) {
            ele.speechcraft.forEach((eles,index) => {
              if(defaultIndex === index) {
                eles.showState = true
              }
            })
          }
        })
      }
    },
    dataList: {
      handler(newVal, oldVal) {
        console.log('深度监听', newVal, oldVal)
        this.dataList = newVal
      },
      deep: true
    }
  },
  created() {
    this.copyUrl = copyUrl
    this.copyUrl1 = copyUrl1
    this.sendUrl = sendUrl
    this.sendUrl1 = sendUrl1
    this.getAllVerbalTrick()
  },
  methods: {
    handleTabClick() {

    },
    // 复制话术数据
    copyClick(tip,id) {
      let obj = {}
      if(id === 'general') {
        obj = this.parsing(tip,'')
      }else {
        obj = {
          type: '',
          tip: tip
        }
        this.recordUse(id)
      }
      this.$emit("verbalTrickEmit",obj)
    },
    // 发送话术数据
    sendClick(tip,id) {
      let obj = {}
      if(id === 'general') {
        obj = this.parsing(tip,"send")
      }else {
        obj = {
          type: 'send',
          tip: tip
        }
        this.recordUse(id)
      }
      this.$emit("verbalTrickEmit",obj)
    },
    // 解析话术
    parsing(list,send) {
      let showState = false,showObj = {},initialState = false,initialObj = {},obj = {};
      list.forEach(ele => {
        if(ele.showState) {
          showState = true
          showObj = ele
        }
        if(ele.speechcraftScene === "通用") {
          initialState = true
          initialObj = ele
        }
      })
      if(showState) {
        obj = {
          type: send,
          tip: showObj.sentence
        }
        this.recordUse(showObj.keyID)
      }else if(initialState) {
        obj = {
          type: send,
          tip: initialObj.sentence
        }
        this.recordUse(initialObj.keyID)
      }
      return obj
    },
    // 获取获取话术数据
    getAllVerbalTrick() {
      this.$_http.get(this.$_API.INTERFACE_AUTORE_GET_SPEECHCRAFT_GETALL).then(res => {
        if(res.success) {
          this.dataObj = res.data
          let item = 0;
          for(item in this.dataObj) {
            if(item == 0) {
              this.dataObj[item].forEach(ele => {
                let showIndex = 0, showState = false,defaultState = false,defaultIndex = 0;
                ele.speechcraft.forEach((eles,index) => {
                  eles.showState = false
                  if(eles.speechcraftScene === this.scene) {
                    showState = true
                    showIndex = index
                  }
                  if(eles.speechcraftScene === "通用") {
                    defaultState = true
                    defaultIndex = index
                  }
                })
                if(showState) {
                  ele.speechcraft.forEach((eles,index) => {
                    if(showIndex === index) {
                      eles.showState = true
                    }
                  })
                }else if(defaultState) {
                  ele.speechcraft.forEach((eles,index) => {
                    if(defaultIndex === index) {
                      eles.showState = true
                    }
                  })
                }
              })
              this.dataList = JSON.parse(JSON.stringify(this.dataObj[item]))
            }
            if(item == 1) {
              this.tabList = JSON.parse(JSON.stringify(this.dataObj[item]))
            }
          }
          this.tabtActive = this.tabList[0].speechcraftType
          console.log(this.dataList)
        }
      })
    },
    // 话术计数调用
    recordUse(id) {
      let params = {
        speechcraftID: id
      }
      this.$_http.get(this.$_API.INTERFACE_AUTORE_GET_SPEECHCRAFT_RECORDUSE, {params:params}).then(res => {
        if(res.success) {
          console.log(res.message)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.verbalTrick{
  height: 500px;
  .collapse {
    height: 494px;
  }
  .beforeBg {
    display: flex;
    align-items: center;
    height: 41px;
    padding: 0px 12px;
    &::before{
      content: "";
      width: 2px;
      height: 14px;
      background: #3489ff;
      border-radius: 1px;
      box-shadow: -1px 0px 2px 0px rgba(52,137,255,0.60); 
      margin-right: 5px;
    }
  }
  .verbalTrickList {
    border-bottom: 2px solid #f0f2f5;
    font-size: 14px;
    height: 38px;
    line-height: 38px;
    display: flex;
    align-items: center;
    -webkit-touch-callout: none;
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none;  /*webkit浏览器*/
    -ms-user-select: none;   /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;
    .icon {
      display: block;
      width: 38px;
      border-right: 1px solid #f0f2f5;
      background: rgba(0,0,0,0.08);
      padding: 9px;
      img {
        height: 20px;
        width: 20px;
        display: block;
      }
    }
    .content {
      display: flex;
      overflow-x: auto;
      overflow-y: hidden;
      white-space:nowrap;
      height: 38px;
      .type {
        color: #3489ff;
        margin-left: 12px;
        margin-right: 8px;
        font-weight: 600;
      }
      .tip {
        color: rgba(0,0,0,0.85);
        display: inline-block;
      }
      &::-webkit-scrollbar {
        width: 2px;
        height: 6px;
      }
      &::-webkit-scrollbar-track {
        background: rgb(239, 239, 239);
        border-radius: 2px;
      } 
      &::-webkit-scrollbar-thumb {
        background: #90c2f8;
        border-radius: 6px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: #aaa;
      }
      &::-webkit-scrollbar-corner {
        background: #179a16;
      }
    }
  }
  .noneBorderBottom {
    border-bottom: none;
  }
  .active {
    background: #3489ff !important;
    .icon {
      background: #1956aa;
    }
    .type, .tip{
      color: #fff !important;
    }
  }
  /deep/.el-tabs__header {
    margin: 0px !important;
    border-bottom: none;
    .el-tabs__nav {
      border: none;
      width: 100%;
    }
    /deep/.el-tabs__item {
      width: 25%;
      text-align: center;
      position: relative;
      font-weight: 600;
    }
    /deep/.el-tabs__item.is-active::after {
      content: "";
      height: 2px;
      width: 15px;
      background: #3489ff;
      border-radius: 1px;
      box-shadow: -1px 0px 2px 0px rgba(52,137,255,0.60); 
      display: block;
      position: absolute;
      top: 33px;
      left: 44px
    }
  }
  /deep/.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-bottom: none;
    background: #e8eef6;
  }
  /deep/.el-tabs__content {
    background: #e8eef6 !important;
    padding: 15px 0px;
  }
  .tabList {
    display: flex;
    align-items: center;
    .icon {
      display: block;
      width: 38px;
      border-right: 1px solid #f0f2f5;
      background: rgba(0,0,0,0.08);
      padding: 9px;
      img {
        height: 20px;
        width: 20px;
        display: block;
      }
    }
    .content {
      height: 38px;
      display: flex;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      align-items: center;
      margin-left: 12px;
    }
    .content::-webkit-scrollbar {
      width: 2px;
      height: 6px;
    }
    .content::-webkit-scrollbar-track {
      background: rgb(239, 239, 239);
      border-radius: 2px;
    } 
    .content::-webkit-scrollbar-thumb {
      background: #90c2f8;
      border-radius: 6px;
    }
    .content::-webkit-scrollbar-thumb:hover {
      background: #aaa;
    }
    .content::-webkit-scrollbar-corner {
      background: #179a16;
    }
  }
}
</style>