export default {
  data () {
    return {
      isDropToItem: false,
      ruleList: [{infoStatus: false,infoStatus1: false,info:null,info1:null}],
      dragItem: {}
    }
  },
  methods: {
    //拖拽开始
    dragstart(event,item,frm,index){
      console.log('------dragstart------')
      if(this.BrowserType().name == "FF"){
        // 兼容火狐浏览器，火狐拖拽必须携带数据
        console.log(event.dataTransfer.setData("imgInfo", event.target.id)); 
      }
      this.dragItem = JSON.parse(JSON.stringify(item));
      let obj = {
        dragItem: this.dragItem,
        dragFrom: this.dragFrom
      }
      this.$emit("dragstartInfo",obj)
    },
    //拖拽结束后触发，不管是否拖拽成功
    dragend(event,item){
      this.isDropToItem = false
      let dragover = document.getElementsByClassName("dragover")
      for(let i = 0 ; i < dragover.length ; i++) {
        dragover[i].children[0].style.border= "1px solid #DCDFE6"
      }
      if( document.querySelector(".warningList")) {
        let list = document.getElementsByClassName('warningList')
        list.forEach(ele => {
          ele.style.border= "1px solid #DCDFE6"
        })
      }
      if( document.querySelector(".target")) {
        let list = document.getElementsByClassName('target')
        list.forEach(ele => {
          ele.style.border= "1px solid #DCDFE6"
        })
      }
    },
    //进入拖拽区域后多次触发
    dragover(event){
      event.preventDefault();
      var target = event.target;
      var nodeName = target.nodeName;
      var className = target.className;
      if(nodeName !== 'SPAN'){
        if(nodeName === 'INPUT' || className === 'warningList width_917' || className === 'width_290 target') {
          target.style.border= "1px solid #438bef"
        }
      }
    },
    //松开鼠标完成拖拽后触发
    drop(event,target,indexs){
      var dragItem = this.dragItem;
      if(this.isDropToItem){
        return;
      }
      if(target == 'ruleList'){
        this.ruleList.forEach((ele,index) => {
          if(!ele.infoStatus && indexs === index) {
            ele.info = JSON.parse(JSON.stringify(dragItem))
            ele.infoStatus = true
            if(dragItem.dataType === 'enum') {
              ele.infoStatus1 = false
              ele.info1 = ""
            }
          }else if(ele.infoStatus && indexs === index) {
            ele.info = JSON.parse(JSON.stringify(dragItem))
            if(dragItem.dataType === 'enum') {
              ele.infoStatus1 = false
              ele.info1 = ""
            }
          }
        })
      }
      if(target == 'ruleList1'){
        this.ruleList.forEach((ele,index) => {
          if(!ele.infoStatus1 && indexs === index) {
            if (ele.info) {
              ele.info.dataValue = ""
            }
            ele.info1 = JSON.parse(JSON.stringify(dragItem))
            ele.infoStatus1 = true
          }else if(ele.infoStatus1 && indexs === index) {
            if (ele.info) {
              ele.info.dataValue = ""
            }
            ele.info1 = JSON.parse(JSON.stringify(dragItem))
            ele.infoStatus1 = true
          }
        })
      }
      if(target == 'warningList') {
        this.warningList.push(dragItem)
        if( document.querySelector(".warningList")) {
          document.querySelector(".warningList").style.border= "1px solid #DCDFE6"
        }
      }
    },
    //浏览器判断
    BrowserType(){
      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
      var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
      var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
      var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
      var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
      var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

      if (isIE){
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        return {name:"IE",num: fIEVersion};
      }//isIE end
      if (isFF) { return {name:"FF",num: "FF"};}
      if (isOpera) { return {name:"Opera",num: "Opera"};}
      if (isSafari) { return {name:"Safari",num: "Safari"};}
      if (isChrome) { return {name:"Chrome",num: "Chrome"};}
      if (isEdge) { return {name:"Edge",num: "Edge"};}
    }
  }
};