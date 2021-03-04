## 使用方法

* 本文档所有组件（base目录下）均已在全局注册，无需引入，直接使用即可。

## 组件列表

* 本文档所有组件（base目录下）均继承自Element-UI，含有对应组件的所有属性、事件、插槽及方法。

组件名称 | 组件功能
:--|:--
base-image | 基础图片组件，用于所有展示图片的地方。继承自Element-UI中的el-image组件
base-input | 基础输入框组件，用于所有使用输入框的地方。继承自Element-UI中的el-input组件
base-loading | 基础加载组件，用于所有需要显示loading的地方。继承自Element-UI中的v-loading属性
base-pagination | 基础分页组件，用于所有需要分页的地方。继承自Element-UI中的el-pagination组件
base-upload | 基础上传组件，用于所有需要上传文件的地方。继承自Element-UI中的el-upload组件
base-date-picker | 基础日期选择组件，用于所有需要选择日期的地方。继承自Element-UI中的el-date-picker组件

## 在Element-UI上有增加属性的组件

#### base-input（输入框）

> 1.增加属性（props）

参数 | 功能 | 类型 | 可选值 | 默认值
:--|:--|:--|:--|:--
label-name | 输入框含义名称，若placeholder属性未设置，则对应生成placeholder | String | - | ""
form-type | 允许输入值的类型，组件会给予输入值一些限制 | String | text/number/float/phone/money | text

* form-type使用说明

form-type值 | 功能
:--|:--
text | 可输入任何值
number | 只能输入数字
float | 只能输入浮点数（数字+小数点）
phone | 只能输入电话号码（11位数字）
money | 只能输入金额（数字+小数点，自动格式化为2位小数）

> 2.示例

```js
// 普通输入框
<base-input v-model="example" label-name="示例" />

// 这里只能输入数字
<base-input v-model="formData.phone" form-type="number" label-name="手机号" />
```

#### base-loading（加载）

> 1.增加属性（props）

参数 | 功能 | 类型 | 可选值 | 默认值
:--|:--|:--|:--|:--
contain-name | 容器名称，可将组建渲染成指定元素 | String | html元素及自定义组件名称 | "div"
loading | loading属性，是否显示加载中 | Boolean | true/false | false

> 2.插槽

参数 | 功能
:--|:--
default | 包裹在容器内部的元素，加载中时会被遮罩层挡住

> 3.示例

```js
<base-loading :loading="loading">
  <el-table>xxxxx</el-table>
</base-loading>
```

#### base-pagination（分页）

> 1.增加属性（props）

参数 | 功能 | 类型 | 可选值 | 默认值
:--|:--|:--|:--|:--
value | 分页对象，一般用来绑定v-model，必传项 | Object | - | -

> 2.示例

```js
<el-table>
  xxxxxx
</el-table>
// 支持v-model绑定分页属性
<base-pagination v-model="pageInfo" @size-change="loadTable" @current-change="loadTable" />
export default {
  data() {
    return {
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        totalRow: 0
      }
    }
  }
}
```

#### base-upload（上传）

> 1.增加属性（props）

参数 | 功能 | 类型 | 可选值 | 默认值
:--|:--|:--|:--|:--
upload-type | 限制上传文件类型 | String | - | "image"
uploading | 是否处于正上传中，支持sync属性 | Boolean | true/false | false

> 2.方法

方法名 | 功能 | 参数 | 限制
:--|:--|:--|:--
getFiles | 获取当前已上传成功的文件列表 | 无 | 无
getSimpleFiles | 获取当前已上传成功的文件列表，只包含上传后的uid和url | 无 | 无

> 3.示例

```js
<el-table>
  xxxxxx
</el-table>
// 支持v-model绑定分页属性
<base-upload :data="data" :limit="2" :on-success="uploadSuccess" />
export default {
  data() {
    return {
      data: {
        systemCode: "DOCTOR",
        belongCode: "CERTIFY",
        belongID: 1
      }
    }
  },
  metods: {
    uploadSuccess(res) {
      console.log(res);
    }
  }
}
```

#### base-date-picker（日期选择）

> 1.增加属性（props）

参数 | 功能 | 类型 | 可选值 | 默认值
:--|:--|:--|:--|:--
shortcuts-option | 可设置快捷选项 | String | today,yesterday,beforeYesterday,weekAgo,tomorrow,afterTomorrow,weekLater,monthLater,yearLater,week,month,threeMonth | -

> 2.示例

```js
<base-date-picker v-model="date" shortcuts-option="today, yesterday, beforeYesterday, weekAgo" />
export default {
  data() {
    return {
      date: null
    }
  }
}
```
