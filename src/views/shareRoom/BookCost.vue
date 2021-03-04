<template>
  <div class="app-container base-page pl24">
    <baseLoading :loading="tableLoading">
      <div id="bookCostBody">
        <el-form :modal="bookCostDetailData" v-if="bookCostDetailData.personRoomOrder" ref="formBookCost" label-width="145px">
          <el-form-item v-if="mode !== 'F' && mode !== 'R'" label="订单编号：">
            <template>{{bookCostDetailData.personRoomOrder.keyID}}</template>
          </el-form-item>
          <el-form-item label="诊室名称：">
            <template>{{bookCostDetailData.personRoomOrder.roomName}}</template>
          </el-form-item>
          <el-form-item label="预约时间：">
            <template>{{bookCostDetailData.personRoomOrder.bookDate | formatDateTime}}</template>
          </el-form-item>
          <el-form-item label="医生名称：">
            <template>{{bookCostDetailData.personRoomOrder.doctorName}}</template>
          </el-form-item>
          <el-form-item label="医生电话：">
            <template>{{bookCostDetailData.personRoomOrder.doctorPhone}}</template>
          </el-form-item>
          <el-form-item label="患者名称：">
            <template>{{bookCostDetailData.personRoomOrder.personName}}</template>
          </el-form-item>
          <el-form-item label="患者电话：">
            <template>{{bookCostDetailData.personRoomOrder.personPhone}}</template>
          </el-form-item>
          <el-form-item label="下单时间：">
            <template>{{bookCostDetailData.personRoomOrder.createTime | formatDateTime}}</template>
          </el-form-item>
          <el-form-item label="状态：">
            <span class="statusTxtBold" v-if="bookCostDetailData.personRoomCost">{{bookCostDetailData.personRoomCost.costStatusName}}</span>
            <span class="statusTxtBold" v-else-if="bookCostDetailData.personRoomBook">{{bookCostDetailData.personRoomBook.bookStatusName}}</span>
            <span class="statusTxtBold" v-else>{{bookCostDetailData.personRoomOrder.orderStatusName}}</span>
            <div style="margin-bottom: 15px"></div>
          </el-form-item>
          <el-form-item v-if="mode !== 'F' && mode !== 'R'" label="HIS系统结算金额：">
            <template>{{personRoomCost.costFeeTotal / 100}}</template>
          </el-form-item>
          <el-form-item label="费用明细：" class="form-required">
            <el-button v-if="mode === 'F' || mode === 'R'" class="addCostBtn" @click="addCostListFun">添加</el-button>
          </el-form-item>
          <el-form-item v-for="(item,index) in personRoomCostDetails" :key="index" :label="item.feeItemName + '：'">
            <base-input v-if="mode === 'F' || mode === 'R'" class="priceButton" v-model="item.treatFee" :label-name="item.feeItemName" form-type="float" placeholder="" v-on:change="countPriceFun(item)" />
            <span v-else class="tempTwo">{{item.treatFee}}</span>
            <span class="tempOne">平台系统使用费</span>
            <span class="tempTwo">{{item.platformFeeAmount}}（{{item.platformFeeRatio}}%）</span>
            <span class="tempOne">医生分账金额</span>
            <span v-if="!item.active" class="tempTwo">{{item.doctorFeeAmount}}（{{item.doctorFeeRatio}}%）</span>
            <base-input v-else class="priceBtn" v-model="item.doctorFeeAmount" label-name="医生分账金额" form-type="float" placeholder="" label-width="auto" />
            <template v-if="mode === 'F' || mode === 'R'">
              <span class="tempThree" @click="updatePriceFun(item)">修改</span>
              <span class="tempThree" v-if="item.active" @click="recoverPriceFun(item)">恢复默认</span>
              <span class="tempThree" @click="deleteOnesFun(item)">删除本条</span>
            </template>
          </el-form-item>
          <el-form-item v-if="mode === 'B' || mode === 'BD'" label="合计：">
            <span class="tempFour fontSizeBold">{{parseInt((personRoomCost.treatFeeTotal / 100) * Math.pow(10, 2) + 0.5, 10) / Math.pow(10, 2)}}</span>
            <span class="tempFive fontSizeBold">{{parseInt((personRoomCost.costFeePlatform / 100) * Math.pow(10, 2) + 0.5, 10) / Math.pow(10, 2)}}</span>
            <span class="fontSizeBold">{{parseInt((personRoomCost.costFeeDoctor / 100) * Math.pow(10, 2) + 0.5, 10) / Math.pow(10, 2)}}</span>
          </el-form-item>
          <el-form-item label="HIS系统费用截图：" class="form-required">
            <template v-if="bookCostDetailData.personRoomCostPics && mode !== 'F' && mode !== 'R'">
              <span v-for="(item,index) in bookCostDetailData.personRoomCostPics" :key="index" class="isHover">
                <base-image :src="item.picFileUrl" style="border: 1px solid #c0ccda;border-radius: 6px;overflow: hidden;display: inline-block;" alt="">
                  <span class="el-upload-list__item-preview"></span>
                </base-image>
                <div class="meng">
                  <i class="el-icon-zoom-in iconScale" @click="handlePictureCardPre(item)"></i>
                  <!--                    <i v-if="mode === 'F' || mode === 'R'" class="el-icon-delete iconDelete" @click="handlePictureDelete(item)"></i>-->
                </div>
              </span>
            </template>
            <!--              <base-upload class="uploadLabel" v-if="mode === 'F' || mode === 'R'" :data="data" :limit="nums"-->
            <!--                           :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="uploadSuccess"></base-upload>-->
            <base-upload v-if="mode === 'F' || mode === 'R'" class="uploadLabel" :data="data" :limit="nums" :on-preview="handlePictureCardPreview" :file-list="workPhotoList" :on-remove="handleRemove" :on-success="uploadSuccess"></base-upload>
            <template v-if="!bookCostDetailData.personRoomCostPics && mode !== 'F' && mode !== 'R'">无</template>
          </el-form-item>
          <el-form-item label="备注：" style="margin-top: 10px">
            <el-input v-if="mode === 'F' || mode === 'R'" type="textarea" placeholder="请输入备注内容" v-model="personRoomCost.costCreateDesc" :autosize="{ minRows: 3, maxRows: 5}"></el-input>
            <template v-else>{{personRoomCost.costCreateDesc}}</template>
          </el-form-item>
          <!--            出院结算、重新结算-->
          <template v-if="mode === 'R'">
            <el-form-item label="提交审核时间：">
              <template>{{personRoomCost.costCreateTime | formatDateTime}}</template>
            </el-form-item>
            <el-form-item label="提交人：">
              <template>{{personRoomCost.costCreateUser}}</template>
            </el-form-item>
            <el-form-item label="审核人：">
              <template>{{personRoomCost.costAuditUser}}</template>
            </el-form-item>
            <el-form-item label="审核时间：">
              <template>{{personRoomCost.costAuditTime | formatDateTime}}</template>
            </el-form-item>
            <el-form-item label="审核不通过原因：">
              <template>{{personRoomCost.costAuditDesc}}</template>
            </el-form-item>
          </template>
          <!--              付款-->
          <template v-else-if="mode === 'B'">
            <el-form-item label="审核人：">
              <template>{{personRoomCost.costAuditUser}}</template>
            </el-form-item>
            <el-form-item label="审核时间：">
              <template>{{personRoomCost.costAuditTime | formatDateTime}}</template>
            </el-form-item>
          </template>
          <!--              详情-->
          <template v-else-if="mode === 'D' || mode === 'BD'">
            <!--                付款完成、结算完成-->
            <template v-if="personRoomCost.costStatusID === 4">
              <el-form-item label="审核人：">
                <template>{{personRoomCost.costAuditUser}}</template>
              </el-form-item>
              <el-form-item label="审核时间：">
                <template>{{personRoomCost.costAuditTime | formatDateTime}}</template>
              </el-form-item>
              <el-form-item label="结算人：">
                <template>{{personRoomCost.costPayUser}}</template>
              </el-form-item>
              <el-form-item label="结算时间：">
                <template>{{personRoomCost.costCreateTime | formatDateTime}}</template>
              </el-form-item>
            </template>
            <!--                付款驳回、结算驳回-->
            <template v-else-if="personRoomCost.costStatusID === 3">
              <el-form-item label="审核人：">
                <template>{{personRoomCost.costAuditUser}}</template>
              </el-form-item>
              <el-form-item label="审核时间：">
                <template>{{personRoomCost.costAuditTime | formatDateTime}}</template>
              </el-form-item>
              <el-form-item label="驳回人：">
                <template>{{personRoomCost.modifyUser}}</template>
              </el-form-item>
              <el-form-item label="驳回时间：">
                <template>{{personRoomCost.modifyTime | formatDateTime}}</template>
              </el-form-item>
              <el-form-item label="驳回原因：">
                <template>{{personRoomCost.costPayDesc}}</template>
              </el-form-item>
            </template>
            <!--                审核不通过-->
            <template v-else-if="personRoomCost.costStatusID === 1">
              <el-form-item label="审核人：">
                <template>{{personRoomCost.costAuditUser}}</template>
              </el-form-item>
              <el-form-item label="审核时间：">
                <template>{{personRoomCost.costAuditTime | formatDateTime}}</template>
              </el-form-item>
              <el-form-item label="审核不通过原因：">
                <template>{{personRoomCost.costAuditDesc}}</template>
              </el-form-item>
            </template>
            <!--              待付款-->
            <template v-else-if="personRoomCost.costStatusID === 1">
              <el-form-item label="审核人：">
                <template>{{personRoomCost.costAuditUser}}</template>
              </el-form-item>
              <el-form-item label="审核时间：">
                <template>{{personRoomCost.costAuditTime | formatDateTime}}</template>
              </el-form-item>
            </template>
          </template>
        </el-form>
        <div class="contain-flex justify-content-center form-input-width">
          <el-button @click="back">返 回</el-button>
          <el-button v-if="mode === 'F'" type="primary" @click="submitFun">提交审核</el-button>
          <el-button v-else-if="mode === 'R'" type="primary" icon="" @click="submitFun">再次提交审核</el-button>
          <el-button v-if="mode === 'A'" type="primary" @click="submitFun">审核通过</el-button>
          <el-button v-if="mode === 'A'" type="primary" @click="auditPayNoBtn">审核不通过</el-button>
          <el-button v-if="mode === 'B'" type="primary" @click="submitFun">确认付款</el-button>
          <el-button v-if="mode === 'B'" type="primary" @click="auditPayNoBtn">驳 回</el-button>
        </div>
      </div>
      <!--        更多明细列表对话框-->
      <div id="costDetailListBody">
        <el-dialog title="请选择添加费用项目" :visible.sync="dialogVisibleOne" width="700px">
          <el-table :data="costDetailListMore" stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection" label="选择" width="55" align="center"></el-table-column>
            <el-table-column prop="feeItemName" label="费用项目名称" align="center"></el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleOne = false">取消</el-button>
            <el-button class="sure" type="primary" @click="costSure">确认</el-button>
          </span>
        </el-dialog>
      </div>
      <!--      审核不通过、驳回付款对话框-->
      <el-dialog title="提示" :visible.sync="dialogVisibleTwo" width="30%" style="min-width: 460px">
        <span class="dialogTit">{{dialogContent}}</span><br />
        <el-input type="textarea" placeholder="最多输入200字" v-model="dialogDesc" maxlength="200" show-word-limit></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleTwo = false">取 消</el-button>
          <el-button type="primary" @click="auditPayNoFun">{{dialogSure}}</el-button>
        </span>
      </el-dialog>
      <!--      查看大图-->
      <el-dialog :visible.sync="dialogVisible">
        <img width="94%" :src="dialogImageUrl" style="margin-left: 3%" alt="HIS系统截图">
      </el-dialog>
    </baseLoading>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import BaseInput from "../../components/global/base/BaseInput";
import BaseImage from "../../components/global/base/BaseImage";
export default {
  name: "room-book-cost",
  components: { BaseImage, BaseInput },
  props: {
    keyID: {
      keyID: String,
      required: true
    },
    // F: "出院结算", R: "重新结算", A: "审核", B: "付款", AD: "审核详情", BD: "付款详情"
    mode: {
      type: String,
      required: true
    }
  },
  inject: ["close", "reload"],
  data () {
    return {
      tableLoading: false,
      // 页面数据
      bookCostDetailDataOld: {},
      bookCostDetailData: {},
      // 费用项目
      personRoomCostDetails: [],
      personRoomCost: {},
      // 医生分额输入框是否显示
      active: false,
      // 费用明细服务列表模态框
      dialogVisibleOne: false,
      costDetailListMoreOld: [],
      costDetailListMore: [],
      // 选择的费用项目
      multipleSelection: [],
      // 上传HIS截图
      nums: 3,
      data: {
        systemCode: "SHAREROOM",
        belongCode: "ORDER",
        belongID: 1
      },
      HISImgInfo: [],
      // 审核不通过原因、驳回付款原因对话框
      dialogVisibleTwo: false,
      dialogSure: "",
      dialogContent: "",
      dialogDesc: "",
      // 查看大图片
      dialogVisible: false,
      dialogImageUrl: "",
      searchState: false,
      workPhotoList: []
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created () {
    this.data.belongID = this.keyID;
    let loadList = [this.getBookCostDetailFun];
    this.$_http.all(...loadList).finally(it => {
      this.tableLoading = false;
    });
  },
  activated () {
    if (this.searchState) {
      this.data.belongID = this.keyID;
      let loadList = [this.getBookCostDetailFun];
      this.$_http.all(...loadList).finally(it => {
        this.tableLoading = false;
      });
    }
  },
  methods: {
    // 查询：获取患者预约到院的结算费用详情：条件=》keyID
    getBookCostDetailFun () {
      if (this.tableLoading) {
        return;
      }
      let params = {
        keyID: this.keyID
      };
      this.tableLoading = true;
      let requests = this.$_http.get(this.$_API.INTERFACE_SHARE_ROOM_COST_INFO, { params });
      requests.then(res => {
        if (!res.data) return;
        this.bookCostDetailDataOld = res.data;
        this.searchState = true;
        this.count100Fun();
      });
      return requests;
    },
    // 治疗费用、平台使用费、医生分账金额、医生实际分账金额 / 100
    count100Fun () {
      if (this.bookCostDetailDataOld.personRoomCostDetails) {
        this.bookCostDetailDataOld.personRoomCostDetails.forEach((item) => {
          item.treatFee = parseInt((item.treatFee / 100) * Math.pow(10, 2) + 0.5, 10) / Math.pow(10, 2);
          item.platformFeeAmount = parseInt((item.platformFeeAmount / 100) * Math.pow(10, 2) + 0.5, 10) / Math.pow(10, 2);
          item.doctorFeeCalc = parseInt((item.doctorFeeCalc / 100) * Math.pow(10, 2) + 0.5, 10) / Math.pow(10, 2);
          item.doctorFeeAmount = parseInt((item.doctorFeeAmount / 100) * Math.pow(10, 2) + 0.5, 10) / Math.pow(10, 2);
        });
        this.personRoomCostDetails = this.bookCostDetailDataOld.personRoomCostDetails;
        this.personRoomCost = this.bookCostDetailDataOld.personRoomCost;
      }
      this.HISImgInfo = [];
      let arr = [];
      if (this.bookCostDetailDataOld.personRoomCostPics) {
        this.bookCostDetailDataOld.personRoomCostPics.forEach((item) => {
          let objOne = {
            picFileID: item.picFileID,
            picFileUrl: item.picFileUrl
          };
          this.HISImgInfo.push(objOne);
          let obj = {
            uid: item.picFileID,
            url: item.picFileUrl
          };
          arr.push(obj);
        });
      }
      this.workPhotoList = arr;
      this.bookCostDetailData = this.bookCostDetailDataOld;
    },
    // 操作：添加 =》显示更多明细列表对话框,获取更多费用项目
    addCostListFun () {
      let params = {
        hospitalID: this.userInfo.orgID
      };
      this.dialogVisibleOne = true;
      this.tableLoading = true;
      this.$_http.get(this.$_API.INTERFACE_SHARE_ROOM_COST_ITEM_MORE, { params }).then(res => {
        if (!res.data) return;
        this.costDetailListMoreOld = res.data;
        this.filterCostDetailListMore();
      }).finally(it => {
        this.tableLoading = false;
      });
    },
    // 筛选：没有添加过的费用项目
    filterCostDetailListMore () {
      if (this.personRoomCostDetails) {
        this.personRoomCostDetails.forEach((item) => {
          this.costDetailListMoreOld.forEach((items, index) => {
            if (item.feeItemCode === items.feeItemCode) {
              this.costDetailListMoreOld.splice(index, 1);
            }
          });
        });
      }
      this.costDetailListMore = this.costDetailListMoreOld;
    },
    // 操作：选择费用项目
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // 操作：确认 =》把添加的项目加入页面数据中
    costSure () {
      if (this.multipleSelection) {
        this.multipleSelection.forEach((item) => {
          let isHaveData = false;
          if (this.personRoomCostDetails) {
            this.personRoomCostDetails.forEach((items) => {
              if (item.feeItemCode === items.feeItemCode) {
                isHaveData = true;
              }
            });
          }
          if (!isHaveData) {
            this.personRoomCostDetails.push(item);
          }
        });
      }
      this.dialogVisibleOne = false;
    },
    // 操作：输入治疗费用
    countPriceFun (item) {
      let platformFeeAmount = parseInt(item.treatFee * item.platformFeeRatio / 100 * Math.pow(10, 2) + 0.5, 10) / Math.pow(10, 2);
      let doctorFeeAmount = parseInt(item.treatFee * item.doctorFeeRatio / 100 * Math.pow(10, 2) + 0.5, 10) / Math.pow(10, 2);
      item.doctorFeeCalc = doctorFeeAmount;
      this.$set(item, "platformFeeAmount", platformFeeAmount);
      this.$set(item, "doctorFeeAmount", doctorFeeAmount);
    },
    // 操作:修改某条费用医生分账金额
    updatePriceFun (item) {
      this.$set(item, "active", true);
    },
    // 操作：恢复某条费用医生分账金额默认价格
    recoverPriceFun (item) {
      item.doctorFeeAmount = item.doctorFeeCalc;
      item.active = false;
    },
    // 操作：删除某条费用医生分账金额
    deleteOnesFun (item) {
      this.personRoomCostDetails.forEach((items, index) => {
        if (item.feeItemCode === items.feeItemCode) {
          this.personRoomCostDetails.splice(index, 1);
        }
      });
    },
    // 操作：上传HIS系统费用截图
    uploadSuccess (res) {
      if (!res.data) return;
      if (this.nums >= 0) {
        let obj = {};
        obj.picFileID = res.data.keyID;
        obj.picFileUrl = res.data.remoteAddress;
        this.HISImgInfo.push(obj);
      }
    },
    // 操作：删除所选的HIS上传图片
    handleRemove (file, fileList) {
      let indexOf = -1;
      if (file.response && file.response.data && file.response.data.keyID) {
        this.HISImgInfo.forEach((item, index) => {
          if (item.picFileID === file.response.data.keyID) {
            indexOf = index;
          }
        });
      } else {
        this.HISImgInfo.forEach((item, index) => {
          if (item.picFileID === file.uid) {
            indexOf = index;
          }
        });
      }
      if (indexOf > -1) {
        this.HISImgInfo.splice(indexOf, 1);
      }
    },
    // 操作：删除已有图片
    // handlePictureDelete(item) {
    //   this.bookCostDetailData.personRoomCostPics.forEach((items, index) => {
    //     if (item.picFileID === items.picFileID) {
    //       this.bookCostDetailData.personRoomCostPics.splice(index, 1);
    //     }
    //   });
    //   this.HISImgInfo.forEach((items, index) => {
    //     if (item.picFileID === items.picFileID) {
    //       this.HISImgInfo.splice(index, 1);
    //     }
    //   });
    // },
    // 操作：查看上传的HIS大图
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 操作：查看已有HIS大图
    handlePictureCardPre (item) {
      this.dialogImageUrl = item.picFileUrl;
      this.dialogVisible = true;
    },
    // 操作：提交结算、重新结算、审核通过、确认付款
    submitFun () {
      let msgContent = "";
      if (this.mode === "F") {
        msgContent = "确认提交出院结算审核？";
      } else if (this.mode === "R") {
        msgContent = "确认再次重新结算审核？";
      } else if (this.mode === "A") {
        msgContent = "确认通过审核？";
      } else if (this.mode === "B") {
        msgContent = "确认付款？";
      }
      this.$confirm(msgContent, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (this.mode === "F" || this.mode === "R") {
          // 提交结算、再次结算
          if (this.personRoomCostDetails.length > 0 && this.HISImgInfo.length > 0) {
            let costDetail = [];
            this.personRoomCostDetails.forEach(item => {
              costDetail.push(item);
            });
            let isHaveTreatFee = true;
            costDetail.forEach((item) => {
              if (!item.treatFee) {
                isHaveTreatFee = false;
              }
            });
            if (isHaveTreatFee) {
              costDetail.forEach((item) => {
                item.treatFee = item.treatFee * 100;
                item.platformFeeAmount = item.platformFeeAmount * 100;
                item.doctorFeeCalc = item.doctorFeeCalc * 100;
                item.doctorFeeAmount = item.doctorFeeAmount * 100;
              });
              let personBookVo = {
                bookDate: this.bookCostDetailData.personRoomBook.bookDate,
                personRoomCostDetails: costDetail,
                personRoomCost: {
                  costCreateDesc: "",
                  hospitalID: this.bookCostDetailData.personRoomBook.hospitalID,
                  bookID: this.keyID
                },
                personRoomCostPics: this.HISImgInfo
              };
              personBookVo.personRoomCost.costCreateDesc = this.personRoomCost.costCreateDesc;
              this.$_http.post(this.$_API.INTERFACE_SHARE_ROOM_COST_SAVE, personBookVo).then(res => {
                this.dialogVisibleTwo = false;
                this.close().then(() => {
                  this.$router.push({
                    name: "room-book",
                    params: {}
                  });
                });
                this.$_success("提交审核成功！");
              }, ref => {
                costDetail.forEach((item) => {
                  item.treatFee = parseInt((item.treatFee / 100) * Math.pow(10, 2) + 0.5, 10) / Math.pow(10, 2);
                  item.platformFeeAmount = parseInt((item.platformFeeAmount / 100) * Math.pow(10, 2) + 0.5, 10) / Math.pow(10, 2);
                  item.doctorFeeCalc = parseInt((item.doctorFeeCalc / 100) * Math.pow(10, 2) + 0.5, 10) / Math.pow(10, 2);
                  item.doctorFeeAmount = parseInt((item.doctorFeeAmount / 100) * Math.pow(10, 2) + 0.5, 10) / Math.pow(10, 2);
                });
              });
            } else {
              this.$_error("请添加费用明细信息！");
            }
          } else if (this.personRoomCostDetails.length === 0) {
            this.$_error("请添加费用明细信息！");
          } else if (this.HISImgInfo.length === 0) {
            this.$_error("请上传HIS系统截图！");
          }
        } else {
          // 审核、付款
          let params = {
            costID: this.bookCostDetailData.personRoomBook.costID
          };
          if (this.mode === "A") {
            // 审核通过
            params.costStatusID = 2;
            params.costStatusName = "待付款";
            params.costAuditDesc = "";
            this.$_http.post(this.$_API.INTERFACE_FINANCE_SETTLE_AUDIT_PASS, { ...params }).then(res => {
              this.dialogVisibleTwo = false;
              this.close().then(() => {
                this.$router.push({
                  name: "finance-roomSettle",
                  params: {}
                });
              });
              this.$_success("审核成功！");
            });
          } else if (this.mode === "B") {
            params.transID = this.bookCostDetailData.personRoomOrder.accountTransID;
            params.belongID = this.bookCostDetailData.personRoomOrder.hospitalID;
            this.$_http.post(this.$_API.INTERFACE_FINANCE_SETTLE_AUDIT_PAY, { ...params }).then(res => {
              this.dialogVisibleTwo = false;
              this.close().then(() => {
                this.$router.push({
                  name: "finance-roomPay",
                  params: {}
                });
              });
              this.$_success("确认付款成功！");
            });
          }
        }
      }).catch(() => {
        this.$_info("已取消！");
      });
    },
    // 操作：审核不通过、驳回付款
    auditPayNoBtn () {
      this.dialogDesc = "";
      if (this.mode === "A") {
        this.dialogContent = "请输入审核不通过原因：";
        this.dialogSure = "确认审核不通过";
      } else if (this.mode === "B") {
        this.dialogContent = "请输入驳回付款原因：";
        this.dialogSure = "确认驳回";
      }
      this.dialogVisibleTwo = true;
    },
    // 操作：确认：审核不通过、驳回付款
    auditPayNoFun () {
      let params = {
        costID: this.bookCostDetailData.personRoomBook.costID
      };
      if (this.mode === "A") {
        if (this.dialogDesc.length > 0) {
          // 审核不通过
          params.costStatusID = 1;
          params.costStatusName = "审核不通过";
          params.costAuditDesc = this.dialogDesc;
          this.$_http.post(this.$_API.INTERFACE_FINANCE_SETTLE_AUDIT_PASS, { ...params }).then(res => {
            this.dialogVisibleTwo = false;
            this.close().then(() => {
              this.$router.push({
                name: "finance-roomSettle",
                params: {}
              });
            });
            this.$_success("审核不通过成功！");
          });
        } else {
          this.$_error("请输入审核不通过原因！");
        }
      } else if (this.mode === "B") {
        // 付款驳回
        if (this.dialogDesc.length > 0) {
          params.costStatusID = 3;
          params.costStatusName = "付款驳回";
          params.costAuditDesc = this.dialogDesc;
          this.$_http.post(this.$_API.INTERFACE_FINANCE_SETTLE_AUDIT_PASS, { ...params }).then(res => {
            this.dialogVisibleTwo = false;
            this.close().then(() => {
              this.$router.push({
                name: "finance-roomPay",
                params: {}
              });
            });
            this.$_success("付款驳回成功！");
          });
        } else {
          this.$_error("请输入付款驳回原因！");
        }
      }
    },
    // 操作：返回患者预约到院列表页
    back () {
      // 关闭当前页
      this.close().then(() => {
        if (this.mode === "F" || this.mode === "R") {
          this.$router.push({
            name: "room-book",
            params: {}
          });
        } else if (this.mode === "A" || this.mode === "AD") {
          this.$router.push({
            name: "finance-roomSettle",
            params: {}
          });
        } else if (this.mode === "B" || this.mode === "BD") {
          this.$router.push({
            name: "finance-roomPay",
            params: {}
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
#bookCostBody {
  .el-form-item {
    margin-bottom: 0;
  }
  .el-form-item__label {
    color: black;
  }
  label {
    font-weight: normal;
  }
  .el-form-item__content {
    line-height: 30px;
  }
  .el-form-item--medium,
  .el-form-item__label {
    line-height: 30px;
  }
  .isHover {
    position: relative;
  }
  .meng {
    width: 146px;
    height: 146px;
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    bottom: 3px;
    left: 0;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 20px;
    color: white;
    text-align: center;
    line-height: 146px;
  }
  .isHover:hover .meng {
    opacity: 1;
  }
  .iconScale {
    margin-right: 15px;
    cursor: pointer;
  }
  .iconDelete {
    cursor: pointer;
  }
  .el-textarea {
    margin-top: 10px;
  }
  .dialogTit {
    margin-bottom: 15px;
  }
  .addCostBtn {
    margin-bottom: 10px;
  }
  .priceButton {
    height: 45px;
  }
  .statusTxtBold {
    font-weight: bold;
  }
  .tempOne {
    /*font-weight: bold;*/
    margin: 0 15px;
  }
  .tempTwo {
    color: rgb(120, 120, 120);
    display: inline-block;
    width: 150px;
  }
  .tempFour {
    display: inline-block;
    width: 280px;
  }
  .tempFive {
    display: inline-block;
    width: 263px;
  }
  .fontSizeBold {
    font-weight: bold;
  }
  .priceBtn {
    width: 150px;
    .el-input__inner {
      height: 25px;
      padding-left: 5px;
    }
  }
  .tempThree {
    color: #1482f0;
    cursor: pointer;
    margin-left: 15px;
  }
  .contain-flex {
    margin-top: 30px;
  }
  .uploadLabel {
    width: auto;
  }
  .form-input-width {
    max-width: 400px;
  }
}
#costDetailListBody {
  .el-table th:nth-of-type(1) {
    text-align: center;
  }
  .el-table__row td:nth-of-type(1) {
    text-align: center;
  }
}
</style>
