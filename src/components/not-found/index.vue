<template>
  <div>
    <div style="background:#f0f2f5;margin-top: -20px;height:100vh;">
      <div class="wscn-http404">
        <div class="pic-404">
          <img class="pic-404__parent" :src="img_404" alt="404" />
          <img class="pic-404__child left" :src="img_404_cloud" alt="404" />
          <img class="pic-404__child mid" :src="img_404_cloud" alt="404" />
          <img class="pic-404__child right" :src="img_404_cloud" alt="404" />
        </div>
        <div class="exception">
          <div class="exception__headline">抱歉，你访问的页面不存在</div>
          <a href="/" class="exception__return-home">返回首页</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Img404 from "@/assets/image/404.png";
import Img404Cloud from "@/assets/image/404_cloud.png";
export default {
  data() {
    return {
      img_404: Img404,
      img_404_cloud: Img404Cloud
    };
  }
};
</script>
<style scoped>
.wscn-http404 {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 20px auto 60px;
  padding: 0 100px;
  overflow: hidden;
}
.wscn-http404 .pic-404 {
  position: relative;
  float: left;
  width: 600px;
  padding: 150px 0;
  overflow: hidden;
}
.wscn-http404 .pic-404__parent {
  width: 100%;
}
.wscn-http404 .pic-404__child {
  position: absolute;
}
.wscn-http404 .pic-404__child.left {
  width: 80px;
  top: 17px;
  left: 220px;
  opacity: 0;
  -webkit-animation-name: cloudLeft-data-v-5ad80bc6;
  animation-name: cloudLeft-data-v-5ad80bc6;
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
}
.wscn-http404 .pic-404__child.mid {
  width: 46px;
  top: 10px;
  left: 420px;
  opacity: 0;
  -webkit-animation-name: cloudMid;
  animation-name: cloudMid;
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-delay: 1.2s;
  animation-delay: 1.2s;
}
.wscn-http404 .pic-404__child.right {
  width: 62px;
  top: 100px;
  left: 500px;
  opacity: 0;
  -webkit-animation-name: cloudRight;
  animation-name: cloudRight;
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
}
@-webkit-keyframes cloudLeft-data-v-5ad80bc6 {
  0% {
    top: 17px;
    left: 220px;
    opacity: 0;
  }
  20% {
    top: 33px;
    left: 188px;
    opacity: 1;
  }
  80% {
    top: 81px;
    left: 92px;
    opacity: 1;
  }
  100% {
    top: 97px;
    left: 60px;
    opacity: 0;
  }
}
@keyframes cloudLeft-data-v-5ad80bc6 {
  0% {
    top: 17px;
    left: 220px;
    opacity: 0;
  }
  20% {
    top: 33px;
    left: 188px;
    opacity: 1;
  }
  80% {
    top: 81px;
    left: 92px;
    opacity: 1;
  }
  100% {
    top: 97px;
    left: 60px;
    opacity: 0;
  }
}
@-webkit-keyframes cloudMid {
  0% {
    top: 10px;
    left: 420px;
    opacity: 0;
  }
  20% {
    top: 40px;
    left: 360px;
    opacity: 1;
  }
  70% {
    top: 130px;
    left: 180px;
    opacity: 1;
  }
  100% {
    top: 160px;
    left: 120px;
    opacity: 0;
  }
}
@keyframes cloudMid {
  0% {
    top: 10px;
    left: 420px;
    opacity: 0;
  }
  20% {
    top: 40px;
    left: 360px;
    opacity: 1;
  }
  70% {
    top: 130px;
    left: 180px;
    opacity: 1;
  }
  100% {
    top: 160px;
    left: 120px;
    opacity: 0;
  }
}
@-webkit-keyframes cloudRight {
  0% {
    top: 100px;
    left: 500px;
    opacity: 0;
  }
  20% {
    top: 120px;
    left: 460px;
    opacity: 1;
  }
  80% {
    top: 180px;
    left: 340px;
    opacity: 1;
  }
  100% {
    top: 200px;
    left: 300px;
    opacity: 0;
  }
}
@keyframes cloudRight {
  0% {
    top: 100px;
    left: 500px;
    opacity: 0;
  }
  20% {
    top: 120px;
    left: 460px;
    opacity: 1;
  }
  80% {
    top: 180px;
    left: 340px;
    opacity: 1;
  }
  100% {
    top: 200px;
    left: 300px;
    opacity: 0;
  }
}
.wscn-http404 .exception {
  position: relative;
  float: left;
  width: 300px;
  padding: 150px 0;
  overflow: hidden;
}
.wscn-http404 .exception__oops {
  font-size: 32px;
  font-weight: bold;
  line-height: 40px;
  color: #1482f0;
  opacity: 0;
  margin-bottom: 20px;
  -webkit-animation-name: slideUp;
  animation-name: slideUp;
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}
.wscn-http404 .exception__headline {
  font-size: 20px;
  line-height: 24px;
  color: #434e59;
  opacity: 0;
  margin-bottom: 20px;
  -webkit-animation-name: slideUp;
  animation-name: slideUp;
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}
.wscn-http404 .exception__info {
  font-size: 13px;
  line-height: 21px;
  color: grey;
  opacity: 0;
  margin-bottom: 30px;
  -webkit-animation-name: slideUp;
  animation-name: slideUp;
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}
.wscn-http404 .exception__return-home {
  display: block;
  float: left;
  width: 110px;
  height: 36px;
  background: #1482f0;
  border-radius: 100px;
  text-align: center;
  text-decoration: none;
  color: #ffffff;
  opacity: 0;
  font-size: 14px;
  line-height: 36px;
  cursor: pointer;
  -webkit-animation-name: slideUp;
  animation-name: slideUp;
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}
@-webkit-keyframes slideUp {
  0% {
    -webkit-transform: translateY(60px);
    transform: translateY(60px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes slideUp {
  0% {
    -webkit-transform: translateY(60px);
    transform: translateY(60px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
