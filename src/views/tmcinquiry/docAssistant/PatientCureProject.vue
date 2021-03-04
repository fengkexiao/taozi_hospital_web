<template>
  <div class="app-container">
    <base-loading :loading="tableLoading">
      <div id="rpAdviseBox">
        <!--    患者信息-->
        <div class="patientInfoBox">
          <div class="patientInfoDiv">
            <div class="infoDiv">姓名：&nbsp;{{patientInfo.patientName}}</div>
            <div class="infoDiv">性别：&nbsp;{{getSex}}</div>
            <div class="infoDiv">年龄：&nbsp;{{patientInfo.age}}</div>
          </div>
          <div class="patientInfoDiv">
            <div class="infoDiv">肝功能：&nbsp;{{patientInfo.liver}}</div>
            <div class="infoDiv">肾功能：&nbsp;{{patientInfo.renal}}</div>
            <div class="infoDiv">过敏史：&nbsp;{{patientInfo.historyOfAllergy}}</div>
          </div>
          <div class="patientInfoDiv">
            <div class="infoDiv">既往病史：&nbsp;{{patientInfo.historyOfSickness}}</div>
            <div class="infoDiv">妊娠哺乳：&nbsp;{{patientInfo.pregnancy}}</div>
            <div class="infoDiv"></div>
          </div>
        </div>
        <!--      诊断结果-->
        <div class="diagnosisBox">
          <div class="pageTitle">诊断结果</div>
          <el-input v-model.trim="sendInfo.diagnosis" type="textarea" placeholder="请输入" maxlength="400" :rows="2" :autosize="autosize"  class="input_250"/>
        </div>
        <!--      处方信息-->
        <div class="rpDataBox">
          <div class="flexRowBetween">
            <div class="rpTitle">
              <span>R：</span>
              <!--              <span>{{rpData.illness}}</span>-->
            </div>
            <div class="rpAndMedicineBtn">
              <div class="flexRowBetween rpAndMedicineBtnDiv" @click="toRpTemplateFun(item)">
                <img class="rpIconImg" src="../../../assets/image/tmcinquiry/rpMuBan.png" />
                <span>处方模板</span>
              </div>
              <div class="flexRowBetween rpAndMedicineBtnDiv" @click="addMedicineFun(item)">
                <img class="rpIconImg" src="../../../assets/image/tmcinquiry/addMedicine.png" />
                <span>添加药品</span>
              </div>
            </div>
          </div>
          <!--        药品列表-->
          <ul>
            <li v-for="(item, index) in medicine" :key="index">
              <div class="medicineDivOne">
                <div class="medicineTitleDiv">
                  <div class="delMedicineIcon" @click="delMedicineFun(item)">
                    <div class="delMedicineIconDiv">
                      <img class="delMedicineIconImg" src="../../../assets/image/tmcinquiry/delete.png" />
                    </div>
                  </div>
                  <div class="medicineTitle">
                    <span class="medicineName">{{item.medicineName}}</span>
                    <span class="medicineUnit">{{item.productSpec}}</span>
                  </div>
                </div>
                <div class="medicineNumBDiv">
                  <!--                  需要数量默认1-->
                  <input v-model.trim="item.itemCount" class="medicineNumInput" type="number" placeholder="" oninput="if(value.length>2)value=value.slice(0,1)" />
                  <span class="medicineUnit">{{item.unit}}</span>
                </div>
              </div>
              <div class="medicineDivTwo">
                <div class="delMedicineIcon"></div>
                <div class="medicineTitle">
                  <span class="medicinePrice">单价： {{item.price / 100}}</span>
                  <!--                  <span class="medicineInstruction" @click="toMedicineDetailFun(item)">《药品说明书》</span>-->
                </div>
              </div>
              <div id="medicineDivThree">
                <span>用法:&nbsp;</span>
                <input v-model.trim="item.takeDose" class="medicineUseInputOne" type="number" placeholder="每次用量" />
                <el-select v-model="item.formType" placeholder="" size="mini" style="width: 60px;margin-right: 10px;">
                  <el-option v-for="(item, index) in formTypeOptions" :key="index" :label="item.dictName" :value="item.dictName"></el-option>
                </el-select>
                <el-select v-model="item.takeFrequence" placeholder="" size="mini" style="width: 110px;margin-right: 10px;">
                  <el-option v-for="(item, index) in takeFrequenceOptions" :key="index" :label="item.dictName" :value="item.dictName"></el-option>
                </el-select>
                <el-select v-model="item.takeDirection" placeholder="" size="mini" style="width: 110px;">
                  <el-option v-for="(item, index) in takeDirectionOptions" :key="index" :label="item.dictName" :value="item.dictName"></el-option>
                </el-select>
              </div>
              <div class="medicineDivFour">
                <input v-model.trim="item.medicationDays" class="medicineNumInput" type="number" placeholder="" />
                <span class="medicineUnit">天</span>
              </div>
            </li>
          </ul>
          <div class="totalPriceBox">
            <span class="totalPriceTitle">总价： </span>
            <span class="totalMoneyTxt">{{rpData.orderPrice / 100}}元</span>
          </div>
          <!--        医嘱-->
          <div class="rpEnjoin">
            <el-input v-model.trim="rpData.enjoin" type="textarea" placeholder="注意事项补充（选填）..." maxlength="200" :autosize="autosize" :show-word-limit="true" />
          </div>
        </div>
        <!--      保存提交-->
        <div class="btnBox">
          <el-button type="primary" icon="el-icon-document" @click="saveRpDataFun">保存并提交给医生</el-button>
        </div>
      </div>
    </base-loading>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "TMCInquiry-cureProject",
  data () {
    return {
      patientID: "",
      inquiryID: "",
      tableLoading: false,
      autosize: { minRows: 4, maxRows: 6 },
      // 处方单信息
      rpData: {
        patientInfo: {},
        medicine: [],
        illness: "风湿病-肌肉萎缩",
        orderPrice: 50000
      },
      // 患者信息
      patientInfo: {
        patientName: "谭敏仪",
        sex: 2,
        age: 26,
        liver: "正常",
        renal: "正常",
        historyOfAllergy: "无",
        historyOfSickness: "无",
        pregnancy: "否"
      },
      // 药品信息
      medicine: [
        { itemCount: 1, unit: "盒", medicineName: "舒筋健腰丸", productSpec: "250ml*10颗/盒", price: 1200, medicationDays: 5, takeDose: "3", formType: "颗", takeFrequence: "每日一次", takeDirection: "饭前口服" },
        { itemCount: 2, unit: "瓶", medicineName: "感冒灵", productSpec: "250ml*10颗/瓶", price: 1300, medicationDays: 4, takeDose: "2", formType: "片", takeFrequence: "每日三次", takeDirection: "饭前口服" },
        { itemCount: 3, unit: "盒", medicineName: "大力金刚烷", productSpec: "250ml*10支/瓶", price: 1400, medicationDays: 2, takeDose: "", formType: "片", takeFrequence: "每日两次", takeDirection: "饭前口服" }
      ],
      // 单词用量的单位
      formTypeOptions: [],
      // 单次用量的频率
      takeFrequenceOptions: [],
      // 单次用药的方式
      takeDirectionOptions: [],
      // 待发送的数据
      sendInfo: {
        diagnosis: "", // 诊断结果
        medicine: [] // 药品
      }
    };
  },
  computed: {
    getSex () {
      let sexName = "";
      if (Number(this.patientInfo.sex) === 1) {
        sexName = "男";
      } else if (Number(this.patientInfo.sex) === 2) {
        sexName = "女";
      }
      return sexName;
    },
    ...mapGetters(["userInfo"])
  },
  created () {
    // this.getRpDetailFun();
    this.loadDictionary();
  },
  activated () { },
  methods: {
    ...mapActions({
      getDictionary: "dictionary/getDictionary"
    }),
    // 根据字典类型获取字典数据
    loadDictionary () {
      // 获取患者关系
      this.getDictionary({
        systemCode: "MEDICAL",
        groupCode: "D_MEDICAL_MEDICINE_UNIT",
        parentDictCode: ""
      }).then(res => {
        this.formTypeOptions = res;
      });
      this.getDictionary({
        systemCode: "MEDICAL",
        groupCode: "D_MEDICAL_TREAT_FREQUENCY",
        parentDictCode: ""
      }).then(res => {
        this.takeFrequenceOptions = res;
      });
      this.getDictionary({
        systemCode: "MEDICAL",
        groupCode: "D_MEDICAL_TREAT_ROUTE",
        parentDictCode: ""
      }).then(res => {
        this.takeDirectionOptions = res;
      });
    },
    // 查询：处方相关信息
    getRpDetailFun () {
      let params = {
        personID: this.patientID
      };
      this.$_http.get(this.$_API.INTERFACE_TMC_GET_RP_DETAIL, { params }).then(res => {
        // console.log(res);
        this.medicine = res.data.medicine;
        this.loadDictionary();
      });
    },
    // 操作：处方模板
    toRpTemplateFun (item) { },
    // 操作：添加药品
    addMedicineFun (item) { },
    // 操作：删除药品
    delMedicineFun (item) { },
    // 操作：保存并提交给医生
    saveRpDataFun () {
      if (!this.doctorID) {
        this.$notify.error({
          title: "提示",
          message: "数据异常，请重新操作"
        });
        // 重新获取医生ID
        return;
      }
      let data = {};
      this.$confirm("确认保存处方并提交给医生吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.tableLoading = true;
        this.$_http.post(this.$_API.INTERFACE_TMC_POST_RP_ADD, data).then(res => {
          this.$notify({
            title: "成功",
            message: "保存处方并提交给医生成功",
            type: "success"
          });
        }).finally(it => {
          this.tableLoading = false;
        });
      }).catch(() => {
        this.tableLoading = false;
        this.$notify.info({
          title: "已取消",
          message: "已取消保存处方"
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  width: 460px;
}
#rpAdviseBox {
  font-size:14px;
  .patientInfoBox {
    margin-bottom: 15px;
    .patientInfoDiv {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-bottom: 10px;
      color: #555658;
      > div:nth-of-type(3) {
        text-align: right;
      }
      .infoDiv {
        min-width: 105px;
      }
    }
  }
  .diagnosisBox {
    margin-bottom: 30px;
    .pageTitle {
      margin-bottom: 10px;
      color: #555658;
    }
  }
  .rpDataBox {
    .flexRowBetween {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .rpTitle {
        font-weight: bold;
        color: #2a2c30;
      }
    }
    .rpAndMedicineBtn {
      display: flex;
      flex-direction: row;
      color: #438bef;
      .rpAndMedicineBtnDiv {
        margin-left: 10px;
        cursor: pointer;
        .rpIconImg {
          width: 20px;
          height: 20px;
        }
      }
    }
    ul {
      padding-left: 0;
      li {
        list-style-type: none;
        margin: 0 0 20px 0;
        border-bottom: 1px solid #e8e8e8;
        padding-bottom: 10px;
        .medicineDivOne {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .medicineTitleDiv {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            .delMedicineIconDiv {
              width: 18px;
              height: 18px;
              border-radius: 20px;
              background-color: red;
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
              cursor: pointer;
              .delMedicineIconImg {
                width: 13px;
                height: 13px;
              }
            }
            .medicineName {
              margin-right: 15px;
              color: #242526;
            }
          }
          .medicineNumBDiv {
            width: 150px;
            text-align: right;
          }
        }
        .medicineDivTwo {
          display: flex;
          flex-direction: row;
          margin-bottom: 10px;
          .medicinePrice {
            font-size: 15px;
            color: #555658;
          }
          .medicineInstruction {
            padding-left: 20px;
            font-size: 14px;
            color: #438bef;
            cursor: pointer;
          }
        }
        #medicineDivThree {
          margin-bottom: 10px;
          .medicineUseInputOne {
            margin-right: 5px;
            border-radius: 3px;
            border: 1px solid #e8e8e8;
            width: 70px;
            height: 25px;
            padding-left: 5px;
            padding-right: 5px;
            font-size: 14px;
            text-align: center;
            color: #555658;
          }
        }
        .medicineDivFour {
          text-align: right;
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        /*** 消除input元素 type="number" 时默认的 加减按钮---moz版*/
        input[type="number"] {
          -moz-appearance: textfield;
        }
        .medicineTitle {
          padding-left: 10px;
          padding-right: 10px;
        }
        .delMedicineIcon {
          width: 18px;
          height: 18px;
          padding-top: 3px;
        }
        .medicineUnit {
          font-size: 14px;
          color: #555658;
        }
        .medicineNumInput {
          margin-right: 10px;
          border-radius: 3px;
          border: 1px solid #e8e8e8;
          width: 40px;
          height: 25px;
          padding-left: 5px;
          padding-right: 5px;
          font-size: 14px;
          text-align: center;
          color: #555658;
        }
      }
    }
    .rpEnjoin {
      padding-top: 20px;
    }
    .totalPriceBox {
      width: 100%;
      text-align: right;
      font-size: 15px;
      .totalPriceTitle {
        color: #555658;
      }
      .totalMoneyTxt {
        color: #fe5853;
      }
    }
  }
  .btnBox {
    width: 100%;
    height: 90px;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
