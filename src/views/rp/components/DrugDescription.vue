<template>
    <div class="drug-dialog popper-drag" v-loading="loading">
        <i class="el-dialog__close el-icon el-icon-close close-icon" @click="closeDrugDescription"></i>
        <!--  <el-popover placement="top" width="860" trigger="click" @show="handleShow"  :value="drugVisible" @hide="hidePopper" popper-class="popper-drag">-->
        <div class="drug-description_title">药品说明书</div>
        <div class="drug-description">
            <template v-if="drugList.length">
                <div class="drug-description_left">
                    <p style="font-weight: bold">说明书列表</p>
                    <ul>
                        <li :class="{'li-item_check':index === currentIndex}" v-for="(item, index) in drugList"
                            :key="index" @click="changeMedicine(item, index)">
                            <span class="li-item_label" :title="item.manufacturer || item.medicineName">{{item.manufacturer || item.medicineName}}</span>
                            <span class="li-item_value" :title="item.specification">{{item.specification}}</span>
                        </li>
                        <li v-for="(item ,i) in linkUrl" :key="i" style="color: #409EFF">
                            <a class="li-item_value" :href="item.site" target="_blank">{{item.name}}</a>
                        </li>
                    </ul>
                </div>
                <div class="drug-description_right">
                    <div class="detail-container" @scroll="handleOnScroll">
                        <div class="drug-description_item" id="anchor1">
                            <div class="drug-description_item__label">【药品名称】</div>
                            <div class="drug-description_item__value">{{drugDes.genericName || "——"}}</div>
                        </div>
                        <div class="drug-description_item" id="anchor2">
                            <div class="drug-description_item__label">【规格】</div>
                            <div class="drug-description_item__value">{{drugDes.specification || "——"}}</div>
                        </div>
                        <div class="drug-description_item" id="anchor3">
                            <div class="drug-description_item__label">【适应症/功能主治】</div>
                            <div class="drug-description_item__value">{{drugDes.indications || "——"}}</div>
                        </div>
                        <div class="drug-description_item" id="anchor4">
                            <div class="drug-description_item__label">【用法用量】</div>
                            <div class="drug-description_item__value">{{drugDes.dosage || "——"}}</div>
                        </div>
                        <div class="drug-description_item" id="anchor6">
                            <div class="drug-description_item__label">【注意事项】</div>
                            <div class="drug-description_item__value">{{drugDes.warning || "——"}}</div>
                        </div>
                        <div class="drug-description_item" id="anchor7">
                            <div class="drug-description_item__label">【禁忌】</div>
                            <div class="drug-description_item__value">{{drugDes.contraindications || "——"}}</div>
                        </div>
                        <div class="drug-description_item" id="anchor8">
                            <div class="drug-description_item__label">【不良反应】</div>
                            <div class="drug-description_item__value">{{drugDes.adverseReactions || "——"}}</div>
                        </div>
                        <div class="drug-description_item" id="anchor9">
                            <div class="drug-description_item__label">【药物互相作用】</div>
                            <div class="drug-description_item__value">{{drugDes.interactionsOfDrugs || "——"}}</div>
                        </div>
                        <div class="drug-description_item" id="anchor10">
                            <div class="drug-description_item__label">【药理毒理】</div>
                            <div class="drug-description_item__value">{{drugDes.pharmacologyAndToxicology || "——"}}
                            </div>
                        </div>
                        <div class="drug-description_item" id="anchor11">
                            <div class="drug-description_item__label">【孕妇及哺乳期妇女用药】</div>
                            <div class="drug-description_item__value">{{drugDes.pregnancyAndLactation || "——"}}</div>
                        </div>
                        <div class="drug-description_item" id="anchor12">
                            <div class="drug-description_item__label">【儿童用药】</div>
                            <div class="drug-description_item__value">{{drugDes.pediatricUse || "——"}}</div>
                        </div>
                        <div class="drug-description_item" id="anchor13">
                            <div class="drug-description_item__label">【老人用药】</div>
                            <div class="drug-description_item__value">{{drugDes.geriatricUse || "——"}}</div>
                        </div>
                    </div>
                    <div class="anchor-point">
                        <ul>
                            <li v-for="(item,index) of anchorPoint" :key="index" @click="handleGoAnchor(item,index)"
                                :class="[activeIndex===index?'li-point_check':'']">{{item.label}}
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
            <template v-else>
                <div style="display: flex;align-items: center;justify-content: center;width: 100%;">
                    <el-form label-width="140px">
                        <el-form-item label="去其他网站查看：">
                            <p v-for="(item ,i) in linkUrl" :key="i" style="color: #409EFF">
                                <a :href="item.site" target="_blank">{{item.name}}</a>
                            </p>
                        </el-form-item>
                    </el-form>

                </div>
            </template>
        </div>
<!--        <div class="popper__arrow"></div>-->
        <!--    <span slot="reference">{{name}}</span>-->
        <!--  </el-popover>-->

    </div>
</template>

<script>
  import { drag } from "../../../utils/tools";

  export default {
    name: "DrugDescription",
    props: {
      drugVisible: {
        type: Boolean,
        default: true
      },
      medicineName: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        loading: false,
        activeIndex: 0,
        list: [],
        isClickOutSide: true,
        drugList: [],
        drugDes: {},
        currentIndex: 0,
        linkUrl: []
      };
    },
    watch: {
      medicineName(val) {
        if (val) {
          this.activeIndex = 0;
          this.drugList = [];
          this.drugDes = {};
          this.currentIndex = 0;
          this.linkUrl = [];
          this.initData();
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        drag('.popper-drag')
        this.initData();
      });
    },
    computed: {
      anchorPoint() {
        return [
          { key: "anchor1", label: "药品名称" },
          { key: "anchor2", label: "规格" },
          { key: "anchor3", label: "适应症" },
          { key: "anchor4", label: "用法用量" },
          { key: "anchor5", label: "功能主治" },
          { key: "anchor6", label: "注意事项" },
          { key: "anchor7", label: "禁忌" },
          { key: "anchor8", label: "不良反应" },
          { key: "anchor9", label: "药物互相作用" },
          { key: "anchor10", label: "药理作用" },
          { key: "anchor11", label: "孕妇及哺乳期妇女用药" },
          { key: "anchor12", label: "儿童用药" },
          { key: "anchor13", label: "老人用药" }
        ];
      }
    },
    methods: {
      initData() {
        let params = {
          medicineName: this.medicineName
        };
        this.loading = true;
        this.$_http.get(this.$_API.INTERFACE_RP_GET_INSTRUCTION_SEARCH, { params })
          .then(res => {
            this.loading = false;
            if (res.success) {
              if (res.data.instructions && res.data.instructions.length) {
                let arr = [];
                res.data.instructions.forEach(item => {
                  if (item.specification) {
                    arr.push(item);
                  }
                });
                if(arr.length){
                  this.currentIndex = 0;
                  this.drugList = arr;
                  this.drugDes = arr[0];
                  this.linkUrl = res.data.searchUrls;
                }else{
                  this.linkUrl = res.data.searchUrls;
                  this.drugList = [];
                }
              } else {
                this.linkUrl = res.data.searchUrls;
                this.drugList = [];
              }
            }
          }).catch(err => {
          this.loading = false;
        });
      },
      changeMedicine(item, index) {
        this.currentIndex = index;
        this.drugDes = item;
        this.activeIndex = 0;
      },
      closeDrugDescription() {
        this.$emit("closeDrugDescription");
      },
      handleShow() {
        this.$nextTick(() => {
          for (let i = 0; i < this.anchorPoint.length; i++) {
            this.list.push(document.querySelector("#" + this.anchorPoint[i].key).offsetTop);
          }
          console.log(this.list);
        });
      },
      handleGoAnchor(item, index) {
        this.activeIndex = index;
        document.querySelector("#" + item.key).scrollIntoView();
      },
      handleOnScroll(event) {
        // for (let i = 0; i < this.anchorPoint.length; i++) {
        //   console.log(this.anchorPoint[i].key, document.querySelector("#" + this.anchorPoint[i].key).offsetTop);
        // }

        // console.log(document.querySelector(".detail-container").scrollTop);
        console.log(document.querySelector(".detail-container").scrollTop, this.test(this.list, document.querySelector(".detail-container").scrollTop));
      },
      test(arr, num) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] > num) {
            return i - 1;
          }
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
    .drug-dialog {
        font-weight: normal;
        width: 820px;
        background-color: #fff;
        position: fixed;
        top: 90px;
        left:142px;
        z-index:99999;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        padding: 15px;
        text-align: left;
        color: #606266;
       cursor: move ;
        .close-icon {
            position: absolute;
            right: 15px;
            top: 14px;
            font-size: 20px;
            color: #909399;
            cursor: pointer;

            &:hover {
                color: #409EFF;
            }
        }

        .popper__arrow, .popper__arrow:after {
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
            z-index: 10;
            border-width: 15px;
        }

        .popper__arrow {
            bottom: -15px;
            left: 54px;
            margin-right: 3px;
            border-top-color: #ebeef5;
            border-bottom-width: 0;
            filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03))
        }

        .popper__arrow:after {
            content: " ";
            bottom: 1px;
            margin-left: -15px;
            border-top-color: #fff;
            border-bottom-width: 0;
        }
    }

    .drug-description_title {
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        color: #333;
        padding-bottom: 15px;
    }

    .drug-description {
        display: flex;
        min-height: 380px;

        .drug-description_left {
            width: 187px;
            padding-right: 16px;
            font-size: 14px;

            p {
                text-align: center;
                color: rgba(0, 0, 0, 0.85);
                margin: 0;
                padding: 0;
                padding-bottom: 16px;
                font-weight: 500;
            }

            ul {
                margin: 0;
                padding: 0;
                overflow: auto;
                height: 350px;
                padding-right: 5px;

                li {
                    color: rgba(0, 0, 0, 1);
                    list-style: none;
                    display: flex;
                    cursor: pointer;
                    padding-bottom: 14px;
                    justify-content: space-between;

                    .li-item_label {
                        width: 60px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .li-item_value {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        flex: 1;
                    }
                }

                .li-item_check {
                    color: rgba(24, 144, 255, 1);
                }
            }
        }

        .drug-description_right {
            padding-left: 10px;
            padding-top: 10px;
            border-left: 1px solid #e8e8e8;
            display: flex;

            .detail-container {
                height: 380px;
                overflow: auto;

                .drug-description_item__label {
                    width: 90px;
                    font-size: 12px;
                    padding-right: 15px;
                }

                .drug-description_item {
                    padding-bottom: 8px;
                    display: flex;
                    font-size: 12px;
                }

                .drug-description_item__value {
                    width: 380px;
                    padding-right: 10px;
                }
            }

            .anchor-point {
                overflow: auto;
                width: 105px;
                height: 380px;
                background: #ffffff;
                border-radius: 5px;
                box-shadow: 0px 1px 11px 0px rgba(0, 0, 0, 0.18);

                ul {
                    margin: 0;
                    padding: 0 10px;

                    li {
                        list-style: none;
                        font-size: 12px;
                        color: rgba(89, 89, 89, 1);
                        line-height: 20px;
                        cursor: pointer;
                        padding-top: 7px;
                    }

                    .li-point_check {
                        color: #1890ffff;
                    }
                }
            }
        }
    }
</style>
