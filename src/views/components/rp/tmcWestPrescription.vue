<template>
    <div>
        <div class="detail-row">
            <div class="row1-item">
                <span class="detail-label">临床诊断：</span>
                <div class="row1-border">{{diagnosis}}</div>
            </div>
        </div>
        <div class="detail-row">
            <div class="row2-item">
                <span class="detail-label">肝功能：</span>
                <div :class="['row2-border',patientInfo.liver == '异常'?'abnormal':'']">{{patientInfo.liver}}</div>
            </div>
            <div class="row2-item">
                <span class="detail-label">肾功能：</span>
                <div :class="['row2-border',patientInfo.renal == '异常'?'abnormal':'']">{{patientInfo.renal}}</div>
            </div>
        </div>
        <div class="detail-row">
            <div class="row2-item">
                <span class="detail-label">过敏史：</span>
                <div class="row2-border">{{patientInfo.allergyDetail?patientInfo.allergyDetail:"无"}}</div>
            </div>
            <div class="row2-item" v-if="patientInfo.patientSex === 2">
                <span class="detail-label">妊娠哺乳：</span>
                <div class="row2-border">{{patientInfo.pregnancy}}</div>
            </div>
        </div>
        <div class="detail-row_line mt5"></div>
        <drug-description
                style="left: initial;right:0;top:105px;"
                :medicineName="medicineName"
                v-if="drugVisible"
                @closeDrugDescription="closeDrugDescription">
        </drug-description>
        <div class="medicine-container">
            <p>Rp</p>
            <div v-for="(item, index) in medicines" :key="index" class="medicine-item">
                <div class="medicine-item_row1">
                    <span v-if="$route.name==='rpTemplateHf'">{{item.medicineName}}</span>
                    <span  v-else>{{item.medicineName}}</span>
                    <span>{{item.specification}}</span>
                    <span>{{item.medicineAmount}}{{item.unit}}</span>
                </div>
                <div class="medicine-item_row2">
                    <span>用法用量：</span><span class="live">{{item.takeDirection}}，{{item.takeFrequence}}，一次{{item.takeDose}}{{item.formType}}，用药{{item.medicationDays}}天。</span>
                </div>
            </div>
            <div class="medicine-footer">
                <div></div>
                <p>以下空白</p>
            </div>
        </div>
        <div class="detail-row_line "></div>
    </div>
</template>

<script>
  import DrugDescription from "@/views/rp/components/DrugDescription";

  export default {
    props: ["patientInfo", "medicines", "diagnosis"],
    components: {
      DrugDescription
    },
    data() {
      return {
        drugVisible: false,
        medicineName: ""
      };
    },
    methods: {
      openDrugDescription(row) {
        this.drugVisible = true;
        this.medicineName = row.medicineName;
      },
      closeDrugDescription() {
        this.drugVisible = false;
        this.medicineName = "";
      }
    }
  };
</script>

<style lang="scss" scoped>
    .detail-label {
        flex-shrink: 0;
    }

    * {
        font-size: 12px;
        color: #000000a6;
    }

    .detail-row {
        display: flex;
        padding-top: 10px;
        justify-content: space-between;

        .row1-item {
            display: flex;
            align-items: flex-end;
            width: 100%;

            .row1-border {
                border-bottom: 1px solid #bfbfbf;
                width: 100%;
                padding-left: 15px;
                text-align: left;
            }
        }

        .row2-item {
            display: flex;
            align-items: flex-end;

            .row2-border {
                border-bottom: 1px solid #bfbfbf;
                width: 150px;
                padding-left: 15px;
                text-align: left;
            }
            .abnormal {
                color: red;
            }
        }
    }

    .detail-row_line {
        width: 451px;
        height: 1px;
        background: #bfbfbf;
    }

    .medicine-container {
        p {
            font-size: 24px;
            text-align: left;
            color: #000000;
            font-family: STSongti, STSongti-SC;
            font-weight: SC;
            margin-top: 10px;
        }

        .medicine-item {
            margin-top: 10px;

            .medicine-item_row1 {
                display: flex;
                justify-content: space-between;

                span {
                    color: #000000ff;
                }
            }

            .medicine-item_row2 {
                display: flex;
                margin-top: 5px;

                span {
                    color: #000000ff;
                }
            }
        }

        .medicine-footer {
            margin-top: 5px;
            margin-bottom: 135px;

            div {
                width: 200px;
                height: 1px;
                border-bottom: 1px solid #bfbfbf;
            }

            p {
                margin-top: 5px;
                font-size: 12px;
                text-align: left;
                color: #000000;
            }
        }
    }
</style>
