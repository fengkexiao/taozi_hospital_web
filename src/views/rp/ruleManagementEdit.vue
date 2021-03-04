<template>
  <div class="app-container base-page ruleManagementEdit">
    <div class="left">
      <tree-list :list="treeData" @dragstartInfo="dragstartInfo" @treeInfoList="treeInfoList"></tree-list>
    </div>
    <div class="right">
      <el-form class="basicInfo" :model="rule">
        <el-form-item label="告警名称:" label-width="120px" class="width_50">
          <el-input placeholder="请输入告警名称" v-model="rule.reportName" class="width_290"></el-input>
        </el-form-item>
        <el-form-item label="告警类型:" label-width="120px" class="width_50">
          <el-select placeholder="请选择告警类型" class="width_290" v-model="rule.reportType" clearable>
            <el-option v-for="(item,index) in typeList" :key="index" :value="item.value" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警级别:" label-width="120px" clearable>
          <el-select placeholder="请选择告警级别" class="width_290" v-model="rule.reportLevel">
            <el-option v-for="(item,index) in levelList" :key="index" :value="item.value" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="告警标签:" label-width="120px" clearable>
          <el-select placeholder="请选择告警标签类型" class="width_290" v-model="rule.reportName"  style="margin-right:24px" >
            <el-option v-for="(item,index) in tagTypeList" :key="index" :value="item.value" :label="item.name"></el-option>
          </el-select>
          <el-input v-model="text" placeholder="可自定义输入，最高输入16个字符 " class="width_290" maxlength="16" show-word-limit></el-input>
        </el-form-item> -->
        <el-form-item label="告警平台:" label-width="120px" clearable>
          <el-checkbox-group v-model="rule.platForm">
            <el-checkbox v-for="(item,index) in platFormList" :key="index" :label="item.name" :value="item.value"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="如果下列条件:" label-width="120px" clearable>
          <el-select placeholder="请选择满足条件" class="width_290"  v-model="rule.add">
            <el-option label="都满足" :value="1"></el-option>
            <el-option label="只满足一个" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" label-width="120px">
          <div v-for="(item,index) in ruleList" :key="index" class="dragList">
            <div  @drop="drop($event,'ruleList',index)" class="width_290" @dragover="dragover" v-if="!item.infoStatus">
              <el-input placeholder="请将指标拖入此处" class="dragover" readonly></el-input>
            </div>
            <div class="width_290 target" v-else @drop="drop($event,'ruleList',index)" @dragover="dragover">{{item.info.tag}}.{{item.info.name}}</div>
            <el-select placeholder="请选择条件" class="width_290" v-model="typeValue" style="margin-left:24px" v-if="!item.info">
              <el-option :label="item.name" :value="item.value" v-for="(item,index) in contains" :key="index"></el-option>
            </el-select>
            <el-select placeholder="请选择条件" class="width_290" v-model="item.info.typeValue" style="margin-left:24px" v-else>
              <el-option :label="item.name" :value="item.value" v-for="(item,index) in item.info.conditionList" :key="index"></el-option>
            </el-select>
            <template v-if="!item.info">
              <div  @drop="drop($event,'ruleList1',index)"  class="width_290" style="margin-left:24px" @dragover="dragover" v-if="!item.infoStatus1">
                <el-input placeholder="请拖拽指标或自定义填写"  class="dragover"></el-input>
              </div>
              <div class="width_290 target" v-else style="margin-left:24px">{{item.info1.tag}}.{{item.info1.name}}</div>
            </template>
            <el-select placeholder="请选择条件" class="width_290" v-model="item.info.dataValue" style="margin-left:24px" v-else-if="item.info && item.info.dataType === 'enum'">
              <el-option v-for="(items,indexs) in item.info.enumList" :label="items.name" :value="items.value" :key="indexs"></el-option>
            </el-select>
            <template v-else>
              <div  @drop="drop($event,'ruleList1',index)" class="width_290" @dragover="dragover"  style="margin-left:24px" v-if="!item.infoStatus1">
                <el-input placeholder="请拖拽指标或自定义填写" type="number" v-model="item.info.dataValue" @blur="blurInput($event,index)" class="dragover" v-if="item.info.dataType === 'number'"></el-input>
                <el-input placeholder="请拖拽指标或自定义填写" v-model="item.info.dataValue" class="dragover" v-else></el-input>
              </div>
              <div class="width_290 target" v-else style="margin-left:24px" @drop="drop($event,'ruleList1',index)" @dragover="dragover">{{item.info1.tag}}.{{item.info1.name}}</div>
            </template>
            <img src="./../../assets/image/rule/icon_add.png" style="margin-left:24px" @click="addDragList">
            <img src="./../../assets/image/rule/icon_remove.png" style="margin-left:16px" v-if="ruleList.length > 1" @click="removeDrag(index)">
          </div>
        </el-form-item>
      </el-form>
      <el-form style="margin-top:24px;" :model="rule">
        <el-form-item label="自定义告警信息Error Message:" label-width="120px" class="custom">
          <div class="dragList" @drop="drop($event,'warningList')" @dragover="dragover">
            <div v-if="warningList.length > 0" class="warningList width_917">
              <div v-for="(item,index) in warningList" :key="index" class="item">
                <img v-if="item.icon === 'E'" src="./../../assets/image/rule/icon_e.png">
                <img v-else-if="item.icon === 'N'" src="./../../assets/image/rule/icon_n.png">
                <img v-else-if="item.icon === 'T'" src="./../../assets/image/rule/icon_t.png">
                {{item.tag}}.{{item.name}}
                <i class="el-icon-close el_close" @click="closeWarning(index)"></i>
              </div>
            </div>
            <el-input v-else placeholder="自定义填写警告信息内容..." v-model="rule.tip" class="width_917 dragover"></el-input>
          </div>
        </el-form-item>
        <el-form-item label-width="120px" label="预览:"></el-form-item>
        <el-form-item label-width="120px" label="" class="block">
          <div v-for="(item, index) in ruleList" :key="index" class="item_content">
            <template v-if="item.info">
              <span class="index">{{index + 1}}.</span>
              <div class="content">
                <span class="tag">
                  <img v-if="item.info.icon === 'E'" src="./../../assets/image/rule/icon_e.png">
                  <img v-else-if="item.info.icon === 'N'" src="./../../assets/image/rule/icon_n.png">
                  <img v-else-if="item.info.icon === 'T'" src="./../../assets/image/rule/icon_t.png">
                  {{item.info.tag}}.{{item.info.name}}
                </span>
                <span class="condition">{{getCondition(item.info.typeValue,item.info.conditionList)}}</span>
                <span v-if="item.info && item.info.dataType === 'enum' && item.info.enumList">{{getValue(item.info.dataValue,item.info.enumList)}}</span>
                <span class="value" v-else-if="item.info.dataValue">{{item.info.dataValue}}</span>
                <template v-else-if="item.info1">
                  <span class="tag">
                  <img v-if="item.info1.icon === 'E'" src="./../../assets/image/rule/icon_e.png">
                  <img v-else-if="item.info1.icon === 'N'" src="./../../assets/image/rule/icon_n.png">
                  <img v-else-if="item.info1.icon === 'T'" src="./../../assets/image/rule/icon_t.png">
                  {{item.info1.tag}}.{{item.info1.name}}
                </span>
                </template>
              </div>
            </template>
          </div>
        </el-form-item>
      </el-form>
      <div class="footBtn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="saveRule">确定</el-button>
      </div>
      <!-- <div class="footBtnEdit" v-else-if="mode === 'E'">
        <el-button type="danger" plain class="delete" @click="removeRule">删除</el-button>
        <div class="handel">
          <el-button class="cancel" @click="cancel">取消</el-button>
          <el-button type="primary" class="confirm" @click="saveRule">确定</el-button>
        </div>
      </div> -->
    </div>
    
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import treeList from "./rule/treeList";
import treeListMixin from "./rule/treeListMixin";
export default {
  data () {
    return {
      treeData: [],
      checkList: [],
      rule: {platForm:[]},
      typeValue: "",
      dragList: [{infoStatus: false},{infoStatus1: false}],
      warningList: [],
      treeData: [],
      typeList: [
        {name: '患者信息',value: 1},
        {name: '药品信息',value: 2},
        {name: '处方信息',value: 3}
      ],
      levelList: [
        {name: '禁止开方',value: 1},
        {name: '外呼告警',value: 2},
        {name: '确认告警',value: 3},
        {name: '提示告警',value: 4}
      ],
      tagTypeList: [
        {name: '高危药品',value: 1},
        {name: '强制凭证',value: 2},
        {name: '特殊人群',value: 3},
        {name: '其他',value: 4}
      ],
      platFormList: [
        {name: '拼多多',value: 1},
        {name: '美团',value: 2},
        {name: '阿里',value: 3},
        {name: '自建',value: 4}
      ],
      contains: [
        {name: '属于',value: '<contains>'},
        {name: '不属于',value: '<notContains>'}
      ],
      type: "",
      text: '',
      isDropToItem: false,
      layer: [],
      dragItem: {},
      mode: "",
      keyID: ''
    };
  },
  components: {
    treeList
  },
  mixins: [treeListMixin],
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.mode = this.$route.params.mode
    this.keyID = this.$route.params.keyID
    if(this.mode === "E") {
      this.getDetail(this.keyID)
    }
  },
  methods: {
    blurInput(e,index) {
      if(e.target.value) {
        var boolean = new RegExp("^[1-9][0-9]*$").test(e.target.value)
        // 不符合正整数时
        if (!boolean) {
          this.$message.warning("请输入正整数")
          e.target.value = ""
          this.ruleList.forEach((ele,i) => {
            if(index === i) {
              ele.info.dataValue = ""
            }
          })
        }
      }
    },
    // 指标数据 
    treeInfoList(data) {
      this.treeData = data
    },
    // 获取条件枚举名
    getCondition(item,list) {
     let data = ""
     list.forEach(ele => {
       if(ele.value === item) {
         data = ele.name
       }
     })
     return data
    },
    // 获取值的枚举名
    getValue(item,list) {
      let data = ""
     list.forEach(ele => {
       if(ele.value === item) {
         data = ele.name
       }
     })
     return data
    },
    getplatFormName(item) {
      let name = ""
      this.platFormList.forEach(ele => {
        if(ele.value === item) {
          name = ele.name
        }
      })
      return name
    },
    // 查询规则详情
    getDetail(id) {
      let params = {
        _id: id
      }
      this.ruleList = []
      this.warningList= []
      this.$_http.get(this.$_API.INTERFACE_RP_GET_DYNAMICRULE_DETAIL,{params: params}).then(res => {
        if(res.success) {
          if(res.data) {
            res.data.conditions.expresses.forEach(ele => {
              this.treeData.forEach(eles => {
                eles.children.forEach(item => {
                  let info1 = null
                  if(item.expression === ele.left) {
                    let length = ele.right.length
                    if(ele.right.substr(0, 2) === "${" && ele.right.substr(length-2, length) === "}$"){
                      item.dataValue = ""
                      this.treeData.forEach(eles => {
                        eles.children.forEach(item1 => {
                          if(ele.right === item1.expression) {
                            info1 = item1
                          }
                        })
                      })
                    }else {
                      item.dataValue = JSON.parse(JSON.stringify(ele.right.replace(/^\$|\$$/g,"")))
                    }
                    item.typeValue = JSON.parse(JSON.stringify(ele.operator))
                    let obj = {
                      infoStatus: true,
                      infoStatus1: info1?true:false,
                      info: JSON.parse(JSON.stringify(item)),
                      info1: JSON.parse(JSON.stringify(info1))
                    }
                    this.ruleList.push(obj)
                  }
                })
              })
            })
            res.data.add = res.data.conditions.add
            res.data.platForm = []
            res.data.platForms.forEach(async ele => {
              let name = await this.getplatFormName(ele)
              res.data.platForm.push(name)
            })
            // 告警提示拖拽时信息回显
            let tip = res.data.tip
            let le = tip.length
            if(tip.substr(0, 2) === "${" && tip.substr(le-2, le) === "}$"){
              tip = tip.split(",")
              res.data.tip = tip
              res.data.tip.forEach(ele=> {
                this.treeData.forEach(eles => {
                  eles.children.forEach(item => {
                    if(item.expression === ele) {
                      this.warningList.push(item)
                    }
                  })
                })
              })
              res.data.tip = ""
            }
            delete res.data.addTime
            delete res.data.modifyTime
            this.rule = res.data
          }else {
            this.ruleList = [{infoStatus: false,infoStatus1: false,info:null,info1:null}]
            this.$message({
              type: 'warning',
              message: "当前规则不存在，请重新添加！"
            })
          }
        }
      })
    },
    // 将常用的符号转成英文逗号
    replaceComma(item) {
      return item.replace(/[，/|\\\/]/ig,',')
    },
    // 新增编辑规则
    saveRule() {
      let expresses= [], tip= "",platForms = [],single = 0;
      if(!this.rule.reportName || this.rule.reportName === "") {
        this.$message({
          type: "warning",
          message: "请输入告警名称"
        })
        return
      }
      if(this.rule.reportName.length > 20) {
        this.$message({
          type: "warning",
          message: "告警名称长度不能超过20个汉字"
        })
        return
      }
      if(!this.rule.reportType || this.rule.reportType === "") {
        this.$message({
          type: "warning",
          message: "请选择告警类型"
        })
        return
      }
      if(!this.rule.reportLevel || this.rule.reportLevel === "") {
        this.$message({
          type: "warning",
          message: "请选择告警级别"
        })
        return
      }
      if(this.rule.platForm.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择告警平台"
        })
        return
      }
      if(this.rule.add === undefined ||this.rule.add === "") {
        this.$message({
          type: "warning",
          message: "请选择满足条件"
        })
        return
      }
      let state = true
      this.ruleList.forEach(ele => {
        if(ele.info) {
          if(!ele.info1 && ele.info.dataValue === "" || ele.info.typeValue === "") {
            state = false
          }
          if(ele.info.tag === "药品" || ele.info.tags === "药品" || (ele.info1 && (ele.info1.tag === "药品" || ele.info1.tags === "药品"))) {
            single = 1
          }
          let obj = {
            left: ele.info.expression,
            operator: ele.info.typeValue,
            right: ele.info1?ele.info1.expression:('$'+this.replaceComma(ele.info.dataValue)+'$')
          }
          expresses.push(obj)
        }else {
          state = false
        }
      })
      if(!state) {
        this.$message({
          type: 'warning',
          message: '请完善指标信息'
        })
        return
      }
      this.warningList.forEach(ele => {
        tip = tip + (tip?",":'') + ele.expression
      })
      if(tip === "" && (!this.rule.tip || this.rule.tip === "")) {
        this.$message({
          type: 'warning',
          message: '请填写自定义告警信息'
        })
        return
      }
      if(this.rule.tip && this.rule.tip.length > 500) {
        this.$message({
          type: "warning",
          message: "自定义告警信息长度不能超过500个汉字"
        })
        return
      }
      this.rule.platForm.forEach(ele => {
        if(ele === "拼多多") {
          platForms.push(1)
        }else if(ele === "美团") {
          platForms.push(2)
        }else if(ele === "阿里") {
          platForms.push(3)
        }else if(ele === "自建") {
          platForms.push(4)
        }
      })
      let params = {
        ...this.rule,
        platForms: platForms,
        conditions: {
          add: this.rule.add,
          expresses: expresses,
          single: single
        },
        tip: tip !== "" ? tip : this.rule.tip
      }
      if(this.mode === 'E') {
        params._id = this.keyID
      }
      this.$_http.post(this.$_API.INTERFACE_RP_GET_DYNAMICRULE_SAVE,params).then(res => {
        if(res.success) {
          this.$message({
            type: 'success',
            message: this.mode=== 'E'?'编辑成功':"添加成功"
          })
           this.$router.push({
            name: 'ruleManagement'
          })
        }
      })
    },
    // 取消返回列表页面
    cancel() {
      this.$router.push({
        name: 'ruleManagement'
      })
    },
    dragstartInfo(item) {
      this.dragItem = item.dragItem
    },
    // 添加规则定义列表
    addDragList() {
      let status = true
      this.ruleList.forEach(ele => {
        if(!ele.info) {
          status = false
        }else {
          if(ele.info.dataType !== 'enum' && ele.info.dataValue == "" && !ele.info1) {
            status = false
          }
        }
      })
      if(!status) {
        this.$message({
          type: "warning",
          message: "请填充指标后，再添加！"
        })
        return
      }
      let obj = {infoStatus: false, infoStatus1: false,info:null,info1:null}
      this.ruleList.push(obj)
    },
    // 删除规则定义数据
    removeDrag(index) {
      this.ruleList.splice(index,1)
    },
    // 删除当前规则
    removeRule() {
      this.$confirm('请确认是否删除当前规则？', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        cancelButtonClass: 'btn-rule-cancel',
        confirmButtonClass: "btn-rule-confirm",
        customClass: 'messageContent',
        type: 'warning',
        iconClass:"el-icon-warning messageDangerIcon",
      }).then(async () => {
        let params = {
          _id: this.keyID
        }
        this.$_http.post(this.$_API.INTERFACE_RP_GET_DYNAMICRULE_DELETE, params).then(res => {
          if(res.success) {
            this.$router.push('/rational/report')
          }
        })
      })
    },
    // 删除自定义规则
    closeWarning(index) {
      this.warningList.splice(index,1)
    }
  }
};
</script>

<style lang="scss" scoped>
.ruleManagementEdit {
  padding: 0px;
  height: calc(100vh - 154px);
  display: flex;
  .left {
    width: 270px;
    border-right: 4px solid #f0f2f5;
    min-height: 100%;
    height: 100%;
  }
  .right {
    width: calc(100% - 270px);
    padding: 33px 48px;
    min-height: 100%;
    height: 100%;
    overflow: auto;
    &::-webkit-scrollbar-track-piece {
      background: #ffffff;
    }
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: #999999;
      border-radius: 20px;
    }
    .basicInfo {
      border-bottom: 1px solid #d3d3d3;
    }
    .el-form {
      overflow: hidden;
      padding-left: 52px;
      .el-form-item {
        width: 100%;
        float: left;
        .dragList{
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          .target {
            height: 32px;
            text-align: center;
            font-weight: 700;
            color: #606266;
            border: 1px solid #DCDFE6;
            border-radius: 4px;
            overflow: hidden;
            text-overflow:ellipsis; 
            white-space: nowrap;
          }
          img {
            cursor: pointer;
          }
        }
      }
      .custom {
        /deep/.el-form-item__label {
          line-height: 22px;
        }
        .warningList {
          min-height: 32px;
          width: 100%;
          font-weight: 700;
          color: #606266;
          border: 1px solid #DCDFE6;
          border-radius: 4px;
          padding-bottom: 3px;
          .item {
            display: flex;
            float: left;
            height: 100%;
            align-items: center;
            background: rgba(52,137,255,0.10);
            border-radius: 6px;
            padding-left: 10px;
            padding-right: 20px;
            margin-left: 4px;
            height: 24px;
            position: relative;
            margin-top: 3px;
            img {
              width: 16px;
              height: 16px;
              border-radius: 2;
              margin-right: 4px;
            }
            .el_close {
              position: absolute;
              right: 1px;
              top: 1px;
              cursor: pointer;
            }
          }
        }
      }
      .width_50 {
        width: 50%;
        float: left;
      }
      .width_290 {
        max-width: 290px;
        width: 290px;
        /deep/.el-input {
          max-width: 290px !important;
        }
      }
      .width_917 {
        max-width: 917px;
      }
      .block {
        /deep/.el-form-item__content {
          display: block;
          max-width: 917px;
        }
        .content {
          background: #f6f6f6;
          width: calc(100% - 30px);
          border-radius: 2px;
          display: flex;
          align-items: center;
          font-weight: 700;
          color: #606266;
          .tag {
            background: rgba(52,137,255,0.10);
            border-radius: 11px;
            padding-left: 16px;
            padding-right: 10px;
            margin-left: 4px;
            height: 24px;
            display: flex;
            align-items: center;
            margin-right: 8px;
            img {
              width: 16px;
              height: 16px;
              border-radius: 2;
              margin-right: 4px;
            }
          }
          .value {
            margin-left: 5px;
          }
        }
        .item_content {
          display: flex;
          margin-bottom: 8px;
          .index {
            width: 30px;
            display: block;
            padding-right: 10px;
          }
        }
      }
    }
    .footBtn {
      text-align: center;
      margin-top: 46px;
      margin-bottom: 20px;
      max-width: 1180px;
      .el-button {
        width: 88px;
        margin: 0 24px;
      }
    }
    .footBtnEdit {
      max-width: 1090px;
      margin-top: 46px;
      margin-bottom: 20px;
      display: flex;
      .el-button {
        width: 88px;
      }
      .confirm {
        margin-left: 24px;
      }
      .delete {
        margin-left: 200px;
      }
      .handel {
        width: calc(100% - 220px);
        text-align: right;
      }
    }
  }
} 
  
</style>
