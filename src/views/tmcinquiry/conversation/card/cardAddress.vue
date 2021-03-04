<template>
<div class="message-address-box">
    <div class="message-address-box-title">
        <img src="../../../../assets/image/tmcinquiry/dingwei.png" alt="">
        <span>请您确认地址</span>
    </div>
    <div class="message-address-box-items">
        <div class="message-address-box-cell">
            姓名：{{message.data.receiverName || "无"}}
        </div>
        <div class="message-address-box-cell">
            电话：{{message.data.receiverPhone || "无"}}
        </div>
        <div class="message-address-box-cell">
            地址：{{address || "无"}}
        </div>
    </div>

</div>
</template>

<script>
  export default {
    name: "cardAddress",
    props:["message"],
    computed: {
      address(){
        if(this.message.data){
          if(this.message.data.province){
            return this.message.data.province+this.message.data.city+this.message.data.area+this.message.data.address
          }
        }
        return  "无"
      }
    }
  };
</script>

<style scoped lang="scss">
    @import "@/styles/index.scss";
    .message-address-box{
        min-height: 210px;
        border-radius: 10px 10px;
        width: 300px;
        margin-right: 8px;
        &-title{
            display: flex;
            align-items: center;
            padding-left: 12px;
            height: 44px;
            width: 300px;
            background: rgba(67,139,239,1);
            position: relative;
            border-radius: 10px 10px 0 0;
            &:before{
                content: "";
                border-width: 8px;
                border-style: solid;
                border-color: transparent transparent transparent rgba(67,139,239,1);
                position: absolute;
                right: -14px;
                top: 9px;
                left: auto
            }
            span{
                font-size: 18px;
                font-weight: 500;
                color: #fff;
            }
            img{
                height: 24px;
                width: 24px;
                margin-right: 5px;
            }
        }
        .message-address-box-items{
            padding: 0 16px 10px;
            border: 1px solid #e8e8e8;
            border-radius: 0 0 10px 10px;
        }
        .message-address-box-cell{
            height: 40px;
            border-bottom: 1px solid #e8e8e8;
            display: flex;
            align-items: center;
            color: rgba(0,0,0,0.65);
            font-size: 14px;
            &:last-child{
                border: 0;
            }
        }
    }
    .message-left_container {
        .message-address-box{
            margin-left: 8px;
            .message-address-box-title{
                &:before{
                    left: -14px;
                    right: auto;
                    transform: rotate(180deg);
                }
            }
        }
    }
</style>
