# hospital.web--云门诊医院端

---

****************\*\*****************\*****************\*\*****************开发读文档****************\*\*****************\*****************\*\*****************  
****************\*\*****************\*****************\*\*****************效率高又快****************\*\*****************\*****************\*\*****************  
****************\*\*****************\*****************\*\*****************不听文档言****************\*\*****************\*****************\*\*****************  
****************\*\*****************\*****************\*\*****************亲人两行泪****************\*\*****************\*****************\*\*****************

---

### 项目克隆

```
git clone http://git.100cbc.com:3000/peach/hospital.web.git
```

### 项目依赖安装

```
npm install
```

### 开发时，运行项目

```
npm run serve
```

### 打包项目到生产环境--dist 文件夹

```
npm run build
```

### 格式化代码

```
npm run lint
```

## 项目文档地址

| 序号 | 文档地址                                                                      | 功能                                                       |
| :--- | :---------------------------------------------------------------------------- | :--------------------------------------------------------- |
| 1    | /README.md（本页）                                                            | 对项目的结构进行说明；列出了项目中的共通方法、工具、样式等 |
| 2    | [/src/components/README.md](./src/components)                                 | 共通组件使用说明，按需引入                                 |
| 3    | [/src/components/global/base/README.md](./src/components/global/base)         | 基础共通组件使用说明，项目中强制使用，无需引入             |
| 4    | [/src/components/global/svg-icon/README.md](./src/components/global/svg-icon) | svg 图标使用说明，无需引入                                 |
| 5    | /src/utils/\*                                                                 | 已有的 js 工具，莫得文档，请看注释                         |

- Tips：听说看完文档的童鞋开发快得飞起，都不用加班哦 (☆＿☆)

## 项目菜单（由数据库配置）

```js
// 例如
let menus = {
  path: "/user", // 路由路径
  name: "user", // 页面名称，跟页面内的name属性要相同
  meta: {
    title: "用户管理", // 页面标签的标题
    icon: "user", // 菜单图标名称，要在@/icons/svg目录下能找到
    hidden: false, // 是否隐藏该菜单，不配置则默认显示；为true不显示
    noClose: false, // 是否不可关闭，不配置则默认可关闭（显示“x”）；为true则不可关闭，将一直显示，如首页
    noCache: false // 是否缓存页面，不配置则默认缓存（保留对页面的操作及输入的数据）；为true则不缓存
  },
  children: [] // 子菜单，结构跟父菜单一样
};
```

## 项目共通工具使用说明

#### 1.调用后台接口方法：

- 已在全局注册，无需引入，直接使用即可。
- this.\$\_http ==> [axios 配置详解](https://github.com/axios/axios)
- this.\$\_API ==> 接口地址

```js

-----------------------vue实例内部调用后台接口------------------------------

this.$_http.get(url, config)

this.$_http.post(url, config)

this.$_http.put(url, config)

this.$_http.delete(url, config)

this.$_http.request(config)

// 其中 url为接口地址，在api目录下定义
// config内容为参数和其他配置，例如：

--------------------------执行 GET 请求---------------------------------

// 执行 GET 请求
this.$_http.get(this.$_API.INTERFACE_USER_LOGIN + "?ID=12345")
  .then(response => {
    // 自己的操作
    console.log(response);
  })

// 不需要写catch，框架会自动提示出来

// 可选地，上面的请求可以这样做
this.$_http.get(this.$_API.INTERFACE_USER_LOGIN, {
    params: {
      ID: 12345
    }
  }).then(response => {
    // 自己的操作
    console.log(response);
  })

--------------------------执行 POST 请求---------------------------------

// 执行 POST 请求
this.$_http.post(this.$_API.INTERFACE_USER_LOGIN, {
  firstName: "Fred",
  lastName: "Flintstone"
}).then(response => {
  // 自己的操作
  console.log(response);
})

--------------------------其他方式调用---------------------------------

Vue.request(config)/get/post/...
windows.request(config)/get/post/...
```

#### 2.弹出提示：

- 已在全局注册，无需引入，直接使用即可。
- this.$_success、this.$\_warning、this.$_info、this.$\_error

```js
// 例如：
this.$_success("这是成功提示信息");

this.$_error("这是错误提示信息");
```

#### 3.使用共通过滤器

- 所有过滤器已在全局注册，无需引入，直接使用即可。

| 过滤方法名            | 功能                                                         | 示例                         |
| :-------------------- | :----------------------------------------------------------- | :--------------------------- |
| formatDateTime        | 格式化日期+时间                                              | date\|formatDateTime         |
| formatDate            | 格式化日期                                                   | date\|formatDate             |
| formatMoney           | 格式化金额（除以 100 并保留 2 位小数），不带单位             | money\|formatMoney           |
| formatMoneyWithSymbol | 格式化金额（除以 100 并保留 2 位小数），不带单位，带符号：￥ | money\|formatMoneyWithSymbol |
| formatDuration        | 格式化时长                                                   | durition\|formatDuration     |
| formatSex             | 格式化性别，1：男；2：女                                     | sex\|formatSex               |
| formatAge             | 格式化年龄显示                                               | age\|formatAge               |
| formatMobileHidden    | 电话号码隐藏中间几位                                         |

#### 4.使用共通组件

- 项目中强制使用目录`@/components/global/base`下基础组件（如输入框、图片、分页、加载等）。
- 共通组件统一放在目录`@/components`下，其中`@/components/global`文件夹下的 vue 文件会自动注册为全局组件，代码中直接使用即可。
- 开发共通组件需要像`svg-icon`组件一样，在文件夹下加入`README.md`文件，并在文件中详细的列出组件属性、事件及使用示例。

#### 5.当前页面刷新、关闭

- 在代码中依赖`reload`、`close`方法，然后调用即可刷新/关闭当前页面
- `close`方法会返回一个 Promise 对象

```js
// vue实例中依赖reload
export default {
  inject: ["reload", "close"],
  method: {
    xxxxxx() {
      // 页面刷新
      this.reload();
    },
    xxx() {
      this.close().then(() => {
        this.$router.push("/xxx/xxx");
      });
    }
  }
};
```

#### 6.开发时是否使用数据库中的菜单

- 在`@/main.js`目录下修改`MenusFromDB`配置即可，为`false`则使用`@/router/menu.js`中的模拟菜单配置。

#### 7.使用 animate.css 动画效果

- 可自由使用 animate 插件得动画效果。参考[animate.css 演示](https://daneden.github.io/animate.css/)

#### 8.修改样式

- 全局样式都在`@styles`目录下。其中`frame`目录下是框架的样式，除了框架修改一般不建议修改；`components`目录下则是开发时各组件使用得共通样式。
- `element-ui.scss`是用来全局覆盖 element-ui 中的样式，会影响所有对应的 element-ui 组件，慎改。
- `variables.scss`是定义需要的 css 变量；`index.scss`用来写一些通用的样式。
- 特别注意下样式：`form-required`，它用于需要显示 form 表单中的必填红色星号：\*，实际又是非必填，但视觉显示为必填项。一般写在标签`el-form-item`上。

```js
<el-form-item label="诊室图片：" class="form-required">
  <base-upload :data="pictureData" :limit="5" :on-success="uploadSuccess" :uploading.sync="uploading" multiple />
</el-form-item>
```

`由@vue/cli@3.8.2搭建，时间：2019-06-11`

`@vue/cli`脚手架详细配置参考 [Vue Cli 官网](https://cli.vuejs.org/config/).

axios 配置详解参考[axios](https://github.com/axios/axios)
