<template lang="html">
  <div class="editor">
    <div id="div1" class="toolbar">
    </div>
    <div id="div2" class="text"> <!--可使用 min-height 实现编辑区域自动增加高度-->
        <div>请输入内容</div>
    </div>
  </div>
</template>

<script>
import E from "wangeditor";
export default {
  name: "editoritem",
  data() {
    return {
      // uploadPath,
      editor: null,
      info_: null
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    isClear: {
      type: Boolean,
      default: false
    },
    uploadImgParams: {
      type: Object,
      default: {},
      required: true
    }
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear();
        this.info_ = null;
      }
    },
    value: function(value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value);
      }
    }
    // value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  mounted() {
    this.seteditor();
    this.editor.txt.html(this.value);
  },
  methods: {
    seteditor() {
      this.editor = new E("#div1", "#div2");
      this.editor.customConfig.uploadImgShowBase64 = false; // base 64 存储图片
      this.editor.customConfig.uploadImgServer = this.$_API.INTERFACE_FILE_LOAD; // 配置服务器端地址
      this.editor.customConfig.uploadImgHeaders = {}; // 自定义 header
      this.editor.customConfig.uploadFileName = "file"; // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgMaxLength = 6; // 限制一次最多上传 3 张图片
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间
      this.editor.customConfig.pasteFilterStyle = false;
      this.editor.customConfig.pasteIgnoreImg = true;
      this.editor.customConfig.pasteTextHandle = function(content) {
        var html = content;
        html = html.replace(/<\/?SPANYES[^>]*>/gi, ""); //  Remove  all  SPAN  tags
        // html = html.replace(/<(\w[^>]*)  class=([^|>]*)([^>]*)/gi, "<$1$3");  //  Remove  Class  attributes
        // html = html.replace(/<(\w[^>]*)  style="([^"]*)"([^>]*)/gi, "<$1$3");  //  Remove  Style  attributes
        html = html.replace(/<(\w[^>]*) {2}lang=([^|>]*)([^>]*)/gi, "<$1$3"); //  Remove  Lang  attributes
        html = html.replace(/<\\?\?xml[^>]*>/gi, ""); //  Remove  XML  elements  and  declarations
        html = html.replace(/<\/?\w+:[^>]*>/gi, ""); //  Remove  Tags  with  XML  namespace  declarations:  <o:p></o:p>
        html = html.replace(/&nbsp;/, ""); //  Replace  the  &nbsp;
        html = html.replace(/\n(\n)*( )*(\n)*\n/gi, "\n");
        //  Transform  <P>  to  <DIV>
        // var  re  =  new  RegExp("(<P)([^>]*>.*?)(<//P>)","gi")  ;            //  Different  because  of  a  IE  5.0  error
        //        html = html.replace(re, "<div$2</div>");
        return html;
      };
      this.editor.customConfig.uploadImgParams = this.uploadImgParams;
      console.log(
        "this.editor.customConfig.uploadImgParams--------",
        this.editor.customConfig.uploadImgParams
      );
      // 配置菜单
      this.editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "emoticon", // 表情
        "image", // 插入图片
        "table", // 表格
        "video", // 插入视频
        "code", // 插入代码
        "undo", // 撤销
        "redo", // 重复
        "fullscreen" // 全屏
      ];

      this.editor.customConfig.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
        },
        customInsert: (insertImg, result, editor) => {
          insertImg(result.data.remoteAddress);
        }
      };
      this.editor.customConfig.onchange = html => {
        this.info_ = html; // 绑定当前逐渐地值
        this.$emit("change", this.info_); // 将内容同步到父组件中
      };
      // 创建富文本编辑器
      this.editor.create();
    }
  }
};
</script>

<style lang="css">
.editor {
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 0;
}
.toolbar {
  border: 1px solid #DCDFE6;
}
.text {
  border: 1px solid #DCDFE6;
  height: 400px;
}
</style>
