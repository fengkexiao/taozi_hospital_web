## 组件功能

* 使用svg图标

## 使用方法

* 此组件已在全局注册，无需引入，直接使用即可。

> 1.属性（props）

参数 | 功能 | 类型 | 可选值 | 默认值
:--|:--|:--|:--|:--
iconClass | 图标名称，在目录`@/icons/svg`下需要有对应`svg`文件。必传项 | String | - | -
className | 图标样式名称，即class名 | String | - | ""

> 2.事件

事件名 | 功能 | 参数 | 限制
:--|:--|:--|:--
- | - | - | -

> 3.示例

```js
// 例如：使用名称为“iconName”的图标，并使用样式“iconClass”
// “iconName”要在@/icons/svg目录下能找到
<svg-icon icon-class="iconName" className="iconClass" />
```
