<template>
  <el-button-group>
    <el-button v-if="showBtn('all')" @click="allSelect">{{ allSelectDisplay }}</el-button>
    <el-button v-if="showBtn('inverse')" @click="inverse">反选</el-button>
  </el-button-group>
</template>
<script>
import { getDayCount } from "@/utils/tools";
import fecha from "element-ui/src/utils/date";
const ALL_SELECT = ["全选", "取消全选"];
export default {
  props: {
    selectedDay: [Date, String, Number],
    // 需要显示的按钮
    displayOptions: {
      type: Array,
      default() {
        return [];
      }
    },
    stateOptions: {
      type: Array,
      default() {
        return [];
      }
    },
    periodOptions: {
      type: Array,
      default() {
        return [
          {
            label: "上午",
            time: "12:00:00"
          },
          {
            label: "下午",
            time: "17:00:00"
          },
          {
            label: "晚上",
            time: "22:00:00"
          }
        ];
      }
    },
    // 选择的期间
    selectedPeriods: {
      required: true,
      type: Array
    },
    disabledDate: {
      type: Function,
      default() {
        return () => false;
      }
    }
  },
  data() {
    return {
      isAllSelect: false,
      oldSelected: [],
      unwatch: null
    };
  },
  computed: {
    // 选择的期间
    selected: {
      get() {
        return this.selectedPeriods;
      },
      set(val) {
        this.$emit("update:selected-periods", val);
      }
    },
    // 全选/取消全选显示
    allSelectDisplay() {
      return ALL_SELECT[~~this.isAllSelect];
    },
    // 选中时的状态
    selectedState() {
      return this.stateOptions.find(it => {
        return it.selectAble;
      });
    },
    // 禁用时的状态
    disabledState() {
      return this.stateOptions.find(it => {
        return it.className === "is-disabled";
      });
    },
    // 本月所有可选的期间
    currentSelectAble() {
      const now = new Date(this.selectedDay);
      const dayCount = getDayCount(now.getMonth() + 1);
      const thisMonth = fecha.format(now, "yyyy-MM");
      let target = [];
      for (let i = 1; i <= dayCount; i++) {
        this.periodOptions.forEach((periodItem, period) => {
          const date = thisMonth + "-" + i.toString().padStart(2, 0);
          const state = this.getState({ date, period });
          if (state && !this.isSelectedState(state)) {
            return;
          }
          let item = {
            date,
            period
          };
          if (state) {
            item.stateId = this.selectedState.stateId;
            target.push(item);
            return;
          }
          target.push(item);
        });
      }
      return target;
    },
    // 其他月的期间集合
    otherMonthPeriods() {
      return this.selectedPeriods.filter(periodItem => {
        return new Date(periodItem.date).getMonth() !== new Date(this.selectedDay).getMonth();
      });
    }
  },
  watch: {
    isAllSelect(val) {
      if (!val) {
        this.unwatch();
        this.unwatch = null;
      }
    }
  },
  methods: {
    // 需要显示的按钮
    showBtn(option) {
      return this.displayOptions.includes(option);
    },
    // 全选/取消全选
    allSelect() {
      if (this.isAllSelect) {
        // 取消全选
        this.selected = JSON.parse(JSON.stringify(this.oldSelected));
        this.oldSelected = [];
        this.isAllSelect = !this.isAllSelect;
        return;
      }
      // 存储全选之前的数据
      this.oldSelected = JSON.parse(JSON.stringify(this.selected));
      // 全选
      let allSelect = this.currentSelectAble.map(it => {
        let temp = { ...it };
        temp.stateId = this.selectedState.stateId;
        return temp;
      });
      this.selected = JSON.parse(
        JSON.stringify([...allSelect, ...this.otherMonthPeriods])
      );
      this.isAllSelect = !this.isAllSelect;
      this.$nextTick(() => {
        this.unwatch = this.$watch("selected", function() {
          if (this.isAllSelect) {
            this.isAllSelect = false;
          }
        });
      });
    },
    // 反选
    inverse() {
      let inverseArr = this.currentSelectAble
        .filter(it => {
          return !this.getState(it);
        })
        .map(it => {
          let temp = { ...it };
          temp.stateId = this.selectedState.stateId;
          return temp;
        });
      this.selected = JSON.parse(
        JSON.stringify([...inverseArr, ...this.otherMonthPeriods])
      );
    },
    // 根据id获取单元格状态
    getStateById(stateId) {
      return this.stateOptions.find(it => {
        return it.stateId === stateId;
      });
    },
    // 获取选中的单元格状态
    getState({ date, period }) {
      const selected = this.selectedPeriods.find(it => {
        return it.date === date && period !== undefined && it.period === period;
      });
      if (selected) {
        return this.getStateById(selected.stateId);
      }
      const day = new Date(date + " " + this.periodOptions[period].time);
      const isDisabled = this.disabledDate(day);
      if (isDisabled) {
        return this.disabledState;
      }
    },
    // 是否是选择状态
    isSelectedState(state) {
      return state && state.stateId === this.selectedState.stateId;
    }
  }
};
</script>
