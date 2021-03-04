<template>
  <div v-if="data.customType==='card' && data.childType==='tmcMaterial'">
    <card-temp2 :content="data"></card-temp2>
  </div>
  <div v-else-if="data.customType==='card' && data.childType==='address'">
    <cardAddress :message="data"></cardAddress>
  </div>
  <div v-else-if="data.customType==='card'">
    <card-temp1 :title="curCardTitle" :cardButtons="cards[curCardType].buttons"></card-temp1>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import cardTemp1 from "./card/cardTemp1";
import cardTemp2 from "./card/cardTemp2";
import cardAddress from './card/cardAddress';
export default {
  components: { cardTemp1, cardTemp2, cardAddress },
  props: {
    message: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  computed: {
    ...mapGetters(["tmc", "userInfo", "tim"])
  },
  watch: {
    message: {
      deep: true,
      immediate: true,
      handler(val) {
        // this.ininMessage();
      }
    }
  },
  data() {
    return {
      // 常用模型 common //普通类型
      cardType: "",
      data: {},
      // 当前卡片类型
      curCardType: "",
      // 当前卡片标题
      curCardTitle: "",
      cards: {
        default: {
          buttons: [{ name: "默认查看", option: this.option }]
        },
        rpInfo: {
          buttons: [{ name: "查看处方", option: this.viewRp }]
        }
      }
    };
  },
  created() {
    this.ininMessage();
  },
  methods: {
    ...mapActions({
      // 切换右侧tab
      changeActiveIndex: "tmc/changeActiveIndex"
    }),
    ininMessage() {
      this.data = JSON.parse(this.message.payload.data);
      this.cardType = this.data.childType;
      this.curCardType = this.data.childType || "default";
      this.curCardTitle = this.data.data.title || "aaa";
    },
    option() {},
    viewRp() {
      this.changeActiveIndex("3");
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
</style>
