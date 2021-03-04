import Element from "element-ui";
import { toast } from "@/utils/element";
import { isDataType } from "@/utils/tools";
import "@/styles/frame/element-variables.scss";
import "element-ui/lib/theme-chalk/index.css";

export default {
  install: Vue => {
    Vue.use(Element, { size: "medium", zIndex: 3000 });
    // 统一提示风格
    ["success", "warning", "info", "error"].forEach(type => {
      Object.defineProperty(Vue.prototype, "$_" + type, {
        get() {
          return function() {
            const options = arguments[0];
            if (isDataType(options, "Object")) {
              options.type = type;
              return toast(options, "Message");
            }
            if (isDataType(options, "String")) {
              return toast(type, options, "Message");
            }
          };
        }
      });
    });
    Object.defineProperty(Vue.prototype, "$_notify", {
      get() {
        return function() {
          const args = arguments;
          const options = args[0];
          if (isDataType(options, "Object")) {
            return toast(options, "Notification");
          }
          if (isDataType(options, "String")) {
            return toast(args[0], args[1], "Notification");
          }
        };
      }
    });
  }
};
