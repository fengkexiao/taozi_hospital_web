<template>
  <div class="app-container drugInstructions">
    <header><p>{{medicineName}}<span></span></p></header>
    <div class="contentMain">
      <instruction-book :medicineObj="medicineObj"></instruction-book>
      <add-regulation :medicineName="medicineName" :medicineObj="medicineObj" v-on:medicineState="getdetail" :keyID="keyID"></add-regulation>
      <div style="clear:both;"></div>
    </div>
  </div>
</template>
<script>
import instructionBook from "./components/instructionBook";
import addRegulation from "./components/addRegulation";
export default {
  data() {
    return {
      medicineName: "",
      medicineObj: {},
      keyID: ''
    }
  },
  components: {
    instructionBook,
    addRegulation
  },
  created() {
    this.medicineName = JSON.parse(this.$route.query.medicineName)
    this.keyID = JSON.parse(this.$route.query.keyID)
  },
  mounted() {
    this.getdetail()
  },
  methods: {
    getdetail() {
      let _this = this
      let data = {
        medicineName: _this.medicineName
      }
      _this.$_http
        .get(
          _this.$_API.INTERFACE_RP_GET_MEDICINERULE_DETAIL,{ params: Object.assign({}, data) }
        )
        .then(response => {
          this.medicineObj = response.data
        });
    }
  }
}
</script>
<style lang="scss" scoped>
  .drugInstructions {
    height: calc(100vh - 154px);
    header{
      width: 100%;
      height: 60px;
      border-bottom: 1px solid #bfbfbf;
      p {
        margin: 0px;
        line-height: 60px;
        padding-left: 20px;
        padding-right: 54px;
        background:#438bef;
        display: inline-block;
        color: #fff;
        position: relative;
        overflow: hidden;
        font-size: 20px;
        font-weight: bold;
      }
      span {
        position: absolute;
        display: inline-block;
        width: 126px;
        height: 36px; 
        background: #fff;
        transform: rotateZ(-120deg);
        right: -60px;
      }
    }
    .contentMain {
      height: calc(100% - 60px);
    }
  }
</style>