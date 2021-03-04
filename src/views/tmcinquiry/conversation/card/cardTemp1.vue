<template>
  <div>
    <!-- 自定义卡片消息 -->
    <div class="message-card-box">
      <div class="message-card-top-box">
        <img class="title-image" :src="cardTitleIcon" />
        <div class="title-text">{{title}}</div>
      </div>
      <!-- 如果按钮数量等于1 -->
      <div class="message-card-bottom-box" v-if="cardButtons.length===1">
        <div class="message-card-bottom-content-single-box" @click="cardButtons[0].option">
          <div class="button-text">{{cardButtons[0].name}}</div>
          <img class="right-icon" :src="rightIcon" />
        </div>
      </div>
      <!-- 如果按钮数量大于1 -->
      <div class="message-card-bottom-box" v-if="cardButtons.length>1">
        <div
          v-for="(button,index) in cardButtons"
          :key="index"
          @click="button.option"
          class="message-card-bottom-content-multiple-box"
          :style="splitLine(index)"
        >
          <div class="button-text">{{button.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 普通卡片模板
import cardTitleIcon from "@/assets/image/tmcinquiry/card-title-icon.png";
import rightIcon from "@/assets/image/tmcinquiry/right-icon.png";
export default {
  components: {},
  computed: {
    splitLine(index) {
      return function(index) {
        const style = {};
        if (index !== this.cardButtons.length - 1) {
          style.borderRightWidth = "1px";
          style.borderRightColor = "#dbdbdb";
        }
        return style;
      };
    }
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    // cardButtons 格式[{ name: "", option: "" }]
    cardButtons: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return { cardTitleIcon, rightIcon };
  },
  created() {
    console.log("--title--" + this.title);
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.message-card-box {
  width: 300px;
  background-color: #ffffff;
  border-radius: 10px;
  border: solid 1px #ebeef5;
  margin-right: 8px;
}
.message-card-top-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-left: 5px;
  width: 300px;
  min-height: 44px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #81ca70;
  position: relative;
  &:before{
    content: "";
    border-width: 8px;
    border-style: solid;
    border-color: transparent transparent transparent #81ca70;
    position: absolute;
    right: -14px;
    top: 9px;
    left: auto
  }
}

.message-left_container {
  .message-card-box{
    margin-left: 8px;
    .message-card-top-box{
      &:before{
        left: -14px;
        right: auto;
        transform: rotate(180deg);
      }
    }
  }
}

.title-image {
  width: 25px;
  height: 25px;
}
.title-text {
  word-break: break-all;
  word-wrap: break-word;
  width: 210px;
  padding-left: 10px;
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
}
.message-card-bottom-box {
  min-height: 40px;
  display: flex;
  align-items: center;
}
.message-card-bottom-content-single-box {
  width: 300px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 12px;
  padding-right: 12px;
}
.message-card-bottom-content-multiple-box {
  flex-direction: row;
  justify-content: center;
}
.button-text {
  color: #58585b;
  font-size: 14px;
}
.right-icon {
  width: 10px;
  height: 15px;
}
</style>
