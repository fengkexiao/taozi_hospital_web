<template>
  <el-date-picker ref="baseDate" :picker-options="basePickerOptions" :value-format="valueFormat"
    :placeholder="placeholder" :start-placeholder="startPlaceholder" :end-placeholder="endPlaceholder" v-bind="$attrs"
    v-on="$listeners" clearable>
    <template #range-separator>
      <slot name="range-separator">
      </slot>
    </template>
  </el-date-picker>
</template>
<script>
import { getDayCount } from "@/utils/tools";
const SHORT_CUTS = [
  {
    id: "today",
    text: "今天",
    onClick(picker) {
      picker.$emit("pick", new Date());
    }
  },
  {
    id: "yesterday",
    text: "昨天",
    onClick(picker) {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      picker.$emit("pick", date);
    }
  },
  {
    id: "beforeYesterday",
    text: "前天",
    onClick(picker) {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
      picker.$emit("pick", date);
    }
  },
  {
    id: "weekAgo",
    text: "一周前",
    onClick(picker) {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit("pick", date);
    }
  },
  {
    id: "tomorrow",
    text: "明天",
    onClick(picker) {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000 * 24);
      picker.$emit("pick", date);
    }
  },
  {
    id: "afterTomorrow",
    text: "后天",
    onClick(picker) {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
      picker.$emit("pick", date);
    }
  },
  {
    id: "weekLater",
    text: "一周后",
    onClick(picker) {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
      picker.$emit("pick", date);
    }
  },
  {
    id: "monthLater",
    text: "一月后",
    onClick(picker) {
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const oneMonth =
        day <= getDayCount(month + 1)
          ? getDayCount(month)
          : getDayCount(month + 1);
      date.setTime(date.getTime() + 3600 * 1000 * 24 * oneMonth);
      picker.$emit("pick", date);
    }
  },
  {
    id: "yearLater",
    text: "一年后",
    onClick(picker) {
      const date = new Date();
      const month = date.getMonth() + 1;
      let year = date.getFullYear();
      let isLeapYear = year % 4 === 0;
      if (month > 2) {
        isLeapYear = (year + 1) % 4 === 0;
      }
      const oneYear = isLeapYear ? 366 : 365;
      date.setTime(date.getTime() + 3600 * 1000 * 24 * oneYear);
      picker.$emit("pick", date);
    }
  },
  {
    id: "week",
    text: "最近一周",
    onClick(picker) {
      const start = new Date();
      const end = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit("pick", [start, end]);
    }
  },
  {
    id: "month",
    text: "最近一个月",
    onClick(picker) {
      const start = new Date();
      const end = new Date();
      const day = start.getDate();
      const month = start.getMonth() + 1;
      const oneMonth =
        day <= getDayCount(month - 1)
          ? getDayCount(month - 1)
          : getDayCount(month);
      start.setTime(start.getTime() - 3600 * 1000 * 24 * oneMonth);
      picker.$emit("pick", [start, end]);
    }
  },
  {
    id: "threeMonth",
    text: "最近三个月",
    onClick(picker) {
      const start = new Date();
      const end = new Date();
      const day = start.getDate();
      const month = start.getMonth() + 1;
      const oneMonth =
        day <= getDayCount(month - 3)
          ? getDayCount(month - 3)
          : getDayCount(month);
      const threeMonth = oneMonth + getDayCount(month - 2, month - 1);
      start.setTime(start.getTime() - 3600 * 1000 * 24 * threeMonth);
      picker.$emit("pick", [start, end]);
    }
  }
];
export default {
  inheritAttrs: false,
  props: {
    // 设置快捷选项，可选值：today,yesterday,beforeYesterday,weekAgo,tomorrow,afterTomorrow,weekLater,monthLater,yearLater,week,month,threeMonth
    shortcutsOption: {
      type: [String, Array]
    },
    // 非范围选择时的占位内容
    placeholder: {
      type: String,
      default() {
        return "请选择";
      }
    },
    // 范围选择时开始日期的占位内容
    startPlaceholder: {
      type: String,
      default() {
        return "开始日期";
      }
    },
    // 范围选择时结束日期的占位内容
    endPlaceholder: {
      type: String,
      default() {
        return "结束日期";
      }
    },
    // 可选，绑定值的格式。
    valueFormat: {
      type: String,
      default() {
        return "yyyy-MM-dd HH:mm:ss";
      }
    },
    // 当前时间日期选择器特有的选项
    pickerOptions: {
      type: Object
    }
  },
  computed: {
    // 需要显示的快捷项
    shortcuts() {
      if (!this.shortcutsOption) {
        return [];
      }
      let shortcutsOption = this.shortcutsOption
        .toString()
        .replace(/\s/g, "")
        .split(",");
      return SHORT_CUTS.filter(it => {
        return shortcutsOption.includes(it.id);
      });
    },
    // 设置默认pickerOptions
    basePickerOptions() {
      let shortcutsOption = {};
      if (["daterange", "datetimerange"].includes(this.$attrs.type)) {
        shortcutsOption.shortcuts = SHORT_CUTS.filter(it => {
          return ["week", "month", "threeMonth"].includes(it.id);
        });
      }
      if (this.shortcuts.length > 0) {
        shortcutsOption.shortcuts = this.shortcuts;
      }
      if (this.pickerOptions) {
        return { ...shortcutsOption, ...this.pickerOptions };
      }
      return shortcutsOption;
    }
  },
  methods: {
    // Native Methods
    focus() {
      this.$refs.baseDate.focus();
    }
  }
};
</script>
