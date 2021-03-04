## 使用方法

* 本文档所有组件（components目录下）均未注册，使用时需单独引入注册。

## 组件列表

组件名称 | 组件功能
:--|:--
verification-code | 获取验证码（按钮）
select-dictionary | 选择字典（下拉框）
schedule-calendar | 日历选择器
input-with-tip | 带提示的输入框
search-hospital | 搜索医院名称：输入信息出现提示列表

#### verification-code（验证码）

> 1.属性（props）

参数 | 功能 | 类型 | 可选值 | 默认值
:--|:--|:--|:--|:--
phone-no | 接收验证码的手机号码，必传项 | String | - | -
countdown | 倒计时时间 | String/Number | - | 60

> 2.事件

事件名 | 功能 | 参数 | 限制
:--|:--|:--|:--
click | 验证码按钮点击事件处理，不传则使用默认处理 | 事件对象e | 无

> 3.方法

方法名 | 功能 | 参数 | 限制
:--|:--|:--|:--
sendSuccess | 发送验证码成功后的回调，进入倒计时 | 无 | 无
reset | 重置组件状态 | 无 | 无

> 4.示例

```js
// margin-left-10 --> 离左边元素10px，按需使用
<verification-code class="margin-left-10" phone-no="13636363636" />
```

#### select-dictionary（字典）

* 继承自Element-UI中的el-select，含有对应组件的所有属性、事件、插槽及方法。

> 1.增加属性（props）

参数 | 功能 | 类型 | 可选值 | 默认值
:--|:--|:--|:--|:--
system-code | 字典SystemCode，必传项 | String | - | -
group-code | 字典分组CODE，必传项 | String | - | -
parent-dict-code | 上级字典CODE | String | - | -
dictionaries | 需要加上.sync属性，用来获取字典数据列表 | Array | - | -

> 2.事件

事件名 | 功能 | 参数 | 限制
:--|:--|:--|:--
loaded | 字典下拉数据加载完成 | 字典下拉数据列表 | 无

> 3.方法

方法名 | 功能
:--|:--
reload | 重载字典的下拉数据

#### schedule-calendar（日历）

* 继承自Element-UI中的el-calendar，含有对应组件的所有属性、事件、插槽及方法。

> 1.增加属性（props）

参数 | 功能 | 类型 | 可选值 | 默认值
:--|:--|:--|:--|:--
state-options | 状态选项，参考示例 | Array | - | []
period-options | 期间选项，参考示例 | Array | - | []
display-options | 日历按钮选项，all->全选/取消全选；inverse->反选 | Array | "all","inverse" | []
selected-periods | 选择的日期集合，支持sync属性，参考示例 | Array | - | []
disabled-date | 禁用的日期 | Function | - | () => false

> 2.示例

```js
// 状态选项，根据提供的选项值，不同的单元格会显示不同的效果
stateOptions: [
  {
    // 状态id, 必填项
    stateId: 0,
    // 状态名称
    content: "已选",
    // 单元格的内容
    boxContent: "✔️",
    // 是否可选（通过点击可改变状态）
    selectAble: true,
    // 需要添加的样式名称，若是禁用项，则要添加样式“is-disabled”
    className: "is-plan",
    // 该状态下的单元格显示的背景色
    backgroundColor: "#49d88f",
    // 该状态下的单元格显示的文字的颜色
    color: "white"
  },
  {
    stateId: 2,
    content: "已预订",
    selectAble: false,
    className: "is-order",
    backgroundColor: "#3e88f2"
  },
  {
    stateId: -1,
    content: "过期不可订",
    selectAble: false,
    // is-disabled表示禁用
    className: "is-disabled",
    backgroundColor: "#f5f7fa"
  }
],
// 期间选项，示例展示默认选项
periodOptions: [
  {
    // 期间的名称
    label: "上午",
    // 期间的范围，time之前
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
],
// 日历按钮选项，all->全选/取消全选；inverse->反选。默认都不显示
displayOptions: ["all", "inverse"],
disabledDate: date => {
  // 设置过期不可选
  return date < new Date();
},
// 选择的日期集合
selectedPeriods: [
  {
    // 日历上得某个日期
    date: "2019-01-15",
    // 期间ID，对应periodOptions中的选项索引（0、1、2...）
    period: 1,
    // 当天此期间的状态ID，对应stateOptions中的选项stateId
    stateId: 0
  }
]
```

#### input-with-tip（输入框）

* 继承自基础组件中的base-input，含有对应组件的所有属性、事件、插槽及方法。

> 1.增加属性（props）

参数 | 功能 | 类型 | 可选值 | 默认值
:--|:--|:--|:--|:--
tip | 输入框后面提示信息，必传项 | String | - | -
tip-type | 提示类型 | String | "info", "success", "warning", "error" | "warning"

#### search-hospital（医院名称）

* 继承自element-ui中的el-autocomplete,含有对应组件的所有属性、事件、插槽及方法。

>1.输入医院名称，动态模糊查询医院名称，根据所选提示信息，以对象的形式返回对应的医院ID、医院名及所有相似的信息

>2.示例

```
html:
<search-hospital v-model="hospitalName"></search-hospital>

js:
data() {
  return {
    hospitalName: { hospitalName: "", hospitalID: "", getHospitalData: [] },
    // ------------------------拓展-----------------------------------------------------------------------------
    // 存放table列表数据中所有医院的ID查询到的对应的名称（可换名字，注意前后一致即可）
    hospitalNameData: [],
    // 存放数据处理结束之前的数组（可换名字，注意前后一致即可）
    listDataOld: [],
    // 存放数据处理结束之后用于显示在页面中的数组（可换名字，注意前后一致即可）
    listData: []
  }
},
methods: {
  // 任意方法内可console.log该对象，查看返回信息
  func() {
    console.log(this.hospitalName);
  },
  // ------------------------拓展--------------------------------------------------------------------------------
  // 若要在table列表中显示每条数据的医院ID对应的医院名称，则需要先遍历取出且不重复的所有医院ID，再去请求，
  // 再对返回的数据遍历ID对应的名称加到table列表数据中
  // 查询：根据数据中的医院ID查对应的医院名称
  getOrdersHospitalNameFun() {
    if (this.listDataOld.length > 0) {
      let hospitalIDArr = [];
        for (let i = 0; i < this.listDataOld.length; i++) {
          if (hospitalIDArr.length === 0) {
            hospitalIDArr.push(this.listDataOld[0].hospitalID);
          } else {
            let isEqual = false;
            for (let j = 0; j < hospitalIDArr.length; j++) {
              if (this.listDataOld[i].hospitalID === hospitalIDArr[j]) {
                isEqual = true;
              }
            }
            if (isEqual === false) {
              hospitalIDArr.push(this.listDataOld[i].hospitalID);
            }
          }
        }
        this.$_http.post(this.$_API.INTERFACE_NURSE_ORDERS_PRICE_FOUR, hospitalIDArr).then(res => {
          this.hospitalNameData = res.data;
          this.addOrdersHospitalNameFun();
        });
      }
    },
  // 操作：增加医院名称到显示数据中
  addOrdersHospitalNameFun() {
    this.listDataOld.forEach((item) => {
      this.hospitalNameData.forEach((items) => {
        if (item.hospitalID === items.keyID) {
          item.hospitalName = items.orgName;
        }
      });
    });
    this.listData = this.listDataOld;
  },
}

```

