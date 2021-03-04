<template>
  <div class="medicalInformation">
    <div class="header">
      <el-dropdown  @command="handleCommand">
        <span class="el-dropdown-link">
          {{name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="item.medicineName" v-for="(item,index) in medicineResult" :key="index">{{item.medicineName}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-pagination background layout="prev, pager, next" v-if="medicineList.length > 0" :total="medicineList.length" :current-page.sync="currentPage" :page-size="1" @current-change="changeList"></el-pagination>
    </div>
    <ul class="nameList">
      <li v-for="(item, index) in nameList" :key="index" @click="jump(item.index)">{{item.name}}</li>
    </ul>
    <div class="instructionBook">
        <div class="content scroll_cls" @scroll="onScroll" ref="scroll_cls">
          <div class="item scroll-item">
            <span>【通用名称】</span>{{medicine.genericName}}
          </div>
          <div class="item scroll-item">
            <span>【英文名称】</span>{{medicine.englishName}}
          </div>
          <div class="item scroll-item">
            <span>【成分】</span>{{medicine.ingredients}}
          </div>
          <div class="item scroll-item">
            <span>【性状】</span>{{medicine.description}}
          </div>
          <div class="item scroll-item">
            <span>【适应症】</span>{{medicine.indications}}
          </div>
          <div class="item scroll-item">
            <span>【规格】</span>{{medicine.specification}}
          </div>
          <div class="item scroll-item">
            <span>【用法用量】</span>{{medicine.dosage}}
          </div>
          <div class="item scroll-item">
            <span>【不良反应】</span>{{medicine.adverseReactions}}
          </div>
          <div class="item scroll-item">
            <span>【禁忌症】</span>{{medicine.contraindications}}
          </div>
          <div class="item scroll-item">
            <span>【注意事项】</span>{{medicine.warning}}
          </div>
          <div class="item scroll-item">
            <span>【药物互相作用】</span>{{medicine.interactionsOfDrugs}}
          </div>
          <div class="item scroll-item">
            <span>【药理作用】</span>{{medicine.pharmacologyAndToxicology}}
          </div>
          <div class="item scroll-item">
            <span>【药代动力学】</span>{{medicine.pharmacokinetics}}
          </div>
          <div class="item scroll-item">
            <span>【贮藏方法】</span>{{medicine.storage}}
          </div>
          <div class="item scroll-item">
            <span>【有效期】</span>{{medicine.shelfLife}}
          </div>
          <div class="item scroll-item">
            <span>【执行标准】</span>{{medicine.specificationNo}}
          </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'medicalInformation',
  data() {
    return {
      name: "",
      nameList: [
        {name:'名称',index:0},
        {name:'成分',index:2},
        {name:'性状',index:3},
        {name:'适应症',index:4},
        {name:'规格',index:5},
        {name:'用法用量',index:6},
        {name:'不良反应',index:7},
        {name:'禁忌',index:8},
        {name:'注意事项',index:9},
        {name:'药物互相作用',index:10},
        {name:'药理作用',index:11},
        {name:'药代动力学',index:12},
        {name:'贮藏方法',index:13},
        {name:'有效期',index:14},
        {name:'执行标准',index:15},
      ],
      activeStep: 1,
      medicine: {},
      medicineList: [],
      currentPage: 1
    }
  },
  props:{
    medicineResult:{
      type: Array,
      default:[]
    }
  },
  watch:{
    medicineResult(val) {
      this.medicineResult = val
      if(this.medicineResult.length >0) {
        this.name = this.medicineResult[0].medicineName
        this.getMedicineList(this.name)
      }else {
        this.name = ''
        this.medicineList = []
        this.medicine = {}
      }
    }
  },
  mounted() {
    let that = this
    this.box = this.$refs.scroll_cls;
    this.$nextTick(() => {
      that.box.addEventListener('scroll', this.onScroll,true)
    })
  },
  methods:{
    // 切换不同药品
    handleCommand(command) {
      this.name = command
      this.getMedicineList(this.name)
    },
    // 监听标签滚动事件
    onScroll(e) {
      let scrollItems = document.querySelectorAll(".scroll-item");
			for (let i = scrollItems.length - 1; i >= 0; i--) {
				// 判断滚动条滚动距离是否大于当前滚动项可滚动距离
				let judge = e.target.scrollTop >= scrollItems[i].offsetTop - scrollItems[0].offsetTop;
				if (judge) {
					this.activeStep = i.toString();
					break;
				}
			}
    },
    // 实现滚动
		jump(index) {
      let target = document.querySelector(".scroll_cls");
			let scrollItems = document.querySelectorAll(".scroll-item");
			// 判断滚动条是否滚动到底部
			if (target.scrollHeight <= target.scrollTop + target.clientHeight) {
				this.activeStep = index;
			}
      let total = scrollItems[index].offsetTop - scrollItems[0].offsetTop; // 锚点元素距离其offsetParent(这里是body)顶部的距离(待滚动的距离)
      let distance = document.querySelector(".scroll_cls").scrollTop; // 滚动条距离滚动区域顶部的距离
			// let distance = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset // 滚动条距离滚动区域顶部的距离(滚动区域为窗口)
			// 滚动动画实现, 使用setTimeout的递归实现平滑滚动，将距离细分为50小段，10ms滚动一次
			// 计算每一小段的距离
			let step = total / 50;
			if (total > distance) {
				smoothDown(document.querySelector(".scroll_cls"));
			} else {
				let newTotal = distance - total;
				step = newTotal / 50;
				smoothUp(document.querySelector(".scroll_cls"));
			}
			// 参数element为滚动区域
			function smoothDown(element) {
				if (distance < total) {
					distance += step;
          element.scrollTop = distance;
					setTimeout(smoothDown.bind(this, element), 10);
				} else {
					element.scrollTop = total;
				}
			}

			// 参数element为滚动区域
			function smoothUp(element) {
				if (distance > total) {
					distance -= step;
					element.scrollTop = distance;
					setTimeout(smoothUp.bind(this, element), 10);
				} else {
					element.scrollTop = total;
				}
			}
			document.querySelectorAll('.scroll-item').forEach((item, index1) => {
			  if (index === index1) {
			    item.scrollIntoView({
			      block: 'start',
			      behavior: 'smooth'
			    })
			  }
			})
    },
    // 获取药品说明书列表
    getMedicineList(name) {
      this.$_http.get(this.$_API.INTERFACE_AUTORE_GET_LIST, {params:{medicineName: name}}).then(res=> {
        if(res.data) {
          this.medicineList = res.data
          this.medicine = res.data.length > 0 ? res.data[0] : {}
          this.currentPage = 1
        }
      })
    },
    // 切换说明书
    changeList(val) {
      this.medicine = this.medicineList[val-1]
    }
	},
}
</script>
<style lang="scss" scoped>
  .medicalInformation {
    height: calc(100% - 42px);
    padding: 0px 12px;
    overflow: hidden;
    .scroll_cls {
        height: 500px;
      overflow: auto;
    }
    .header {
      margin-top: 24px;
      height: 25px;
      position: relative;
      .el-dropdown {
        font-size: 18px;
        line-height: 24px;
        color: #000;
        font-weight: 700;
        cursor: pointer;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .el-pagination {
        position: absolute;
        top: 3px;
        right: 0;
        width: 250px;
        text-align: right;
        padding: 0px;
        /deep/ .el-pager {
          width: 250px;
          overflow: auto;
        }
        /deep/.el-pager li {
          height: 20px;
          line-height: 20px;
          min-width: 20px;
          margin: 0px;
          margin-left: 5px;
        }
        /deep/.el-pager .more::before {
          line-height: 20px;
        }
        /deep/.btn-prev,/deep/.btn-next {
          display: none;
        }
      }
    }
    .nameList {
        padding: 0;
        margin: 0;
        margin-top: 12px;
        margin-bottom: 8px;
        li {
          list-style: none;
          padding: 3px 11px;
          display: inline-block;
          background: #eee;
          margin-bottom: 8px;
          margin-right: 8px;
          font-size: 14px;
          cursor: pointer;
          border-radius: 4px;
          color: #262626;
        }
      }
    .instructionBook {
      width: 409px;
      float: left;
      border-top: none;
      position: relative;
      height: calc(100% - 200px);
      .content {
        height: 100%;
        overflow: auto;
        padding-right: 12px;
        h3 {
          line-height: 64px;
          text-align: center;
          font-size: 18px;
          padding: 0px;
          margin: 0px;
        }
        .item {
          color: #595959;;
          margin-bottom: 12px;
          font-size: 14px;
          line-height: 22px;
          span {
            display: inline-block;
            color: #000;
            position: relative;
            left: -7px;
            min-width: 84px;
            font-weight: 700;
          }
        }
      }
      .content::-webkit-scrollbar {
        width: 3px;
        height: 10px;
      }
      .content::-webkit-scrollbar-track {
        background: rgb(239, 239, 239);
        border-radius: 2px;
      } 
      .content::-webkit-scrollbar-thumb {
        background: #bfbfbf;
        border-radius: 10px;
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