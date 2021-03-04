<script>
import fecha from "element-ui/src/utils/date";
import {
  range as rangeArr,
  getFirstDayOfMonth,
  getPrevMonthLastDays,
  getMonthDays,
  getI18nSettings,
  validateRangeInOneMonth
} from "element-ui/src/utils/date-util";

const WEEK_DAYS = getI18nSettings().dayNames;
export default {
  props: {
    selectedDay: String, // formated date yyyy-MM-dd
    range: {
      type: Array,
      validator(val) {
        if (!(val && val.length)) return true;
        const [start, end] = val;
        return validateRangeInOneMonth(start, end);
      }
    },
    date: Date,
    hideHeader: Boolean,
    firstDayOfWeek: Number,
    stateOptions: Array,
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
    selectedPeriods: {
      type: Array,
      default() {
        return [];
      }
    },
    disabledDate: {
      type: Function,
      default() {
        return () => false;
      }
    }
  },

  inject: ["elCalendar"],

  methods: {
    toNestedArr(days) {
      return rangeArr(days.length / 7).map((_, index) => {
        const start = index * 7;
        return days.slice(start, start + 7);
      });
    },

    getFormateDate(day, type) {
      if (!day || ["prev", "current", "next"].indexOf(type) === -1) {
        throw new Error("invalid day or type");
      }
      let prefix = this.curMonthDatePrefix;
      if (type === "prev") {
        prefix = this.prevMonthDatePrefix;
      } else if (type === "next") {
        prefix = this.nextMonthDatePrefix;
      }
      day = `00${day}`.slice(-2);
      return `${prefix}-${day}`;
    },

    // 根据id获取单元格状态
    getStateById(stateId) {
      return this.stateOptions.find(it => {
        return it.stateId === stateId;
      });
    },

    // 获取选中的索引
    getSelectedIndex(text, type, period, selected = this.selectedPeriods) {
      const date = this.getFormateDate(text, type);
      return selected.findIndex(it => {
        return it.date === date && period !== undefined && it.period === period;
      });
    },

    // 获取选中的单元格状态
    getState(text, type, period) {
      const date = this.getFormateDate(text, type);
      const selected = this.selectedPeriods.find(it => {
        return it.date === date && period !== undefined && it.period === period;
      });
      if (selected) {
        return this.getStateById(selected.stateId);
      }
      const isDisabled = this.isDisabled(text, type, period);
      if (isDisabled) {
        return this.disabledState;
      }
    },

    // 是否有状态值
    hasState(text, type, period) {
      return (
        this.getSelectedIndex(text, type, period) !== -1 ||
        this.isDisabled(text, type, period)
      );
    },

    isDisabled(text, type, period) {
      if (period === undefined) {
        const amIsDisabled = this.isDisabled(text, type, 0);
        const pmIsDisabled = this.isDisabled(text, type, 1);
        const nightIsDisabled = this.isDisabled(text, type, 2);
        if (amIsDisabled && pmIsDisabled && nightIsDisabled) {
          return true;
        } else {
          return false;
        }
      }
      // yyyy-MM-dd
      let formatDate = this.getFormateDate(text, type);
      formatDate += " ";
      formatDate += this.periodOptions[period].time;
      let date = new Date(formatDate);
      return this.disabledDate(date);
    },

    getCellClass({ text, type, period }) {
      const classes = [type];
      if (type === "current") {
        const date = this.getFormateDate(text, type);
        // if (date === this.selectedDay) {
        //   classes.push("is-selected");
        // }
        if (date === this.formatedToday) {
          classes.push("is-today");
        }
      }
      const stateItem = this.getState(text, type, period);
      const isDisabled = this.isDisabled(text, type, period);
      const isDisabledItem =
        isDisabled &&
        this.disabledState &&
        stateItem.stateId === this.disabledState.stateId;
      if (stateItem) {
        classes.push(stateItem.className || "");
      }
      if (isDisabled && !isDisabledItem) {
        classes.push("is-disabled");
      }
      return classes;
    },

    getCellStyle({ text, type, period }) {
      const stateItem = this.getState(text, type, period);
      if (!stateItem) {
        return {};
      }
      const isDisabled = this.isDisabled(text, type, period);
      let style = {};
      style.backgroundColor = stateItem.backgroundColor || "";
      style.color = stateItem.color || "";
      const isDisabledItem =
        isDisabled &&
        this.disabledState &&
        stateItem.stateId === this.disabledState.stateId;
      if (isDisabled && !isDisabledItem) {
        style.opacity = 0.5;
      }
      return style;
    },

    // 获取期间的label展示
    getLabel(index) {
      const remainder = index % (this.periodLength + 1);
      return remainder === 0 ? "" : this.periodOptions[remainder - 1].label;
    },

    pickDay({ text, type, period }) {
      const isDisabled = this.isDisabled(text, type, period);
      if (isDisabled) {
        return;
      }
      if (!this.selectedState) {
        throw new Error(
          "在状态集合选项【stateList】中应该存在一个selectAble值为“true”的状态"
        );
      }
      const state = this.getState(text, type, period);
      const date = this.getFormateDate(text, type);
      this.$emit("pick", date);
      const isSelected = this.hasState(text, type, period);
      let update = [...this.selectedPeriods];
      if (isSelected && state) {
        if (this.selectedState.stateId !== state.stateId) {
          return;
        }
        const index = this.getSelectedIndex(text, type, period);
        update.splice(index, 1);
        this.$emit("update:selectedPeriods", update);
        return;
      }
      if (period !== undefined) {
        update.push({
          date,
          period,
          stateId: this.selectedState.stateId
        });
        this.$emit("update:selectedPeriods", update);
        return;
      }
      const indexList = Array.from({ length: this.periodLength }).map(
        (_, index) => index
      );
      const hasNoSelect = indexList.some(
        index => !this.hasState(text, type, index)
      );
      if (!hasNoSelect) {
        indexList.forEach(periodItem => {
          const state = this.getState(text, type, periodItem);
          if (state && state.stateId === this.selectedState.stateId) {
            const index = this.getSelectedIndex(text, type, periodItem, update);
            update.splice(index, 1);
          }
        });
        this.$emit("update:selectedPeriods", update);
        return;
      }
      let allPeriod = indexList.reduce((ret, period) => {
        if (!this.hasState(text, type, period)) {
          ret.push({
            date,
            period,
            stateId: this.selectedState.stateId
          });
        }
        return ret;
      }, []);
      update.push(...allPeriod);
      this.$emit("update:selectedPeriods", update);
    },

    cellRenderProxy({ text, type, period }) {
      if (period !== undefined) {
        const stateItem = this.getState(text, type, period);
        if (stateItem) {
          return stateItem.boxContent || "";
        }
        return "";
      }
      let render = this.elCalendar.$scopedSlots.dateCell;
      if (!render) return <span>{text}</span>;

      const day = this.getFormateDate(text, type);
      const date = new Date(day);
      const data = {
        isSelected: this.selectedDay === day,
        type: `${type}-month`,
        day
      };
      return render({ date, data });
    }
  },

  computed: {
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

    // 期间选项的长度
    periodLength() {
      return this.periodOptions.length;
    },

    prevMonthDatePrefix() {
      const temp = new Date(this.date.getTime());
      temp.setDate(0);
      return fecha.format(temp, "yyyy-MM");
    },

    curMonthDatePrefix() {
      return fecha.format(this.date, "yyyy-MM");
    },

    nextMonthDatePrefix() {
      const temp = new Date(
        this.date.getFullYear(),
        this.date.getMonth() + 1,
        1
      );
      return fecha.format(temp, "yyyy-MM");
    },

    formatedToday() {
      return this.elCalendar.formatedToday;
    },

    isInRange() {
      return this.range && this.range.length;
    },

    rows() {
      let days = [];
      // if range exists, should render days in range.
      if (this.isInRange) {
        const [start, end] = this.range;
        const currentMonthRange = rangeArr(
          end.getDate() - start.getDate() + 1
        ).map((_, index) => ({
          text: start.getDate() + index,
          type: "current"
        }));
        let remaining = currentMonthRange.length % 7;
        remaining = remaining === 0 ? 0 : 7 - remaining;
        const nextMonthRange = rangeArr(remaining).map((_, index) => ({
          text: index + 1,
          type: "next"
        }));
        days = currentMonthRange.concat(nextMonthRange);
      } else {
        const date = this.date;
        let firstDay = getFirstDayOfMonth(date);
        firstDay = firstDay === 0 ? 7 : firstDay;
        const firstDayOfWeek =
          typeof this.firstDayOfWeek === "number" ? this.firstDayOfWeek : 1;
        const prevMonthDays = getPrevMonthLastDays(
          date,
          firstDay - firstDayOfWeek
        ).map(day => ({
          text: day,
          type: "prev"
        }));
        const currentMonthDays = getMonthDays(date).map(day => ({
          text: day,
          type: "current"
        }));
        days = [...prevMonthDays, ...currentMonthDays];
        const nextMonthDays = rangeArr(42 - days.length).map((_, index) => ({
          text: index + 1,
          type: "next"
        }));
        days = days.concat(nextMonthDays);
      }
      // 改造日历显示
      let rows = this.toNestedArr(days);
      const len = rows.length;
      const periodLen = this.periodLength;
      for (let i = 0; i < periodLen * len; i++) {
        let index = len - ~~(i / periodLen);
        let fillArr = rows[index - 1].map(it => {
          let temp = { ...it };
          // period -> 0:上午;1:下午;2:晚上
          temp.period = periodLen - 1 - (i % periodLen);
          return temp;
        });
        rows.splice(index, 0, fillArr);
      }
      return rows;
    },

    weekDays() {
      const start = this.firstDayOfWeek;
      if (typeof start !== "number" || start === 0) {
        return WEEK_DAYS.slice();
      } else {
        return WEEK_DAYS.slice(start).concat(WEEK_DAYS.slice(0, start));
      }
    }
  },

  render() {
    const thead = this.hideHeader ? null : (
      <thead>
        <th>星期</th>
        {this.weekDays.map(day => (
          <th key={day}>{day}</th>
        ))}
      </thead>
    );
    return (
      <table
        class={{
          "el-calendar-table": true,
          "is-range": this.isInRange
        }}
        cellspacing="0"
        cellpadding="0"
      >
        {thead}
        <tbody>
          {this.rows.map((row, index) => (
            <tr
              class={{
                "el-calendar-table__row": true,
                "el-calendar-table__row--hide-border":
                  index === 0 && this.hideHeader
              }}
              key={index}
            >
              <td>
                <div class="el-calendar-day">{this.getLabel(index)}</div>
              </td>
              {row.map((cell, key) => (
                <td
                  key={key}
                  class={this.getCellClass(cell)}
                  style={this.getCellStyle(cell)}
                  onClick={this.pickDay.bind(this, cell)}
                >
                  <div class="el-calendar-day">
                    {this.cellRenderProxy(cell)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
};
</script>
