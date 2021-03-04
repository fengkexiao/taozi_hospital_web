/* eslint-disable */
// 工具包：普通js常用方法

/**
 * 复制对象，除去数组noNeedFileds中的字段
 * @param {*} from 源对象
 * @param  {...any} noNeedFileds 不复制的字段
 */
export function optionalCopy (from, ...noNeedFileds) {
  if (!from) {
    return {};
  }
  return Object.entries(from).reduce((ret, [key, value]) => {
    if (!flat(noNeedFileds).includes(key)) {
      ret[key] = value;
    }
    return ret;
  }, {});
}

/**
 * 设置缓存
 * @param {*} key
 * @param {*} value
 */
export function setSesssion (key, value) {
  if (key && value) {
    sessionStorage.setItem(key, JSON.stringify(value))
  }
}

/**
 * 获取缓存
 * @param {}} key
 */
export function getSession (key) {
  if (key) {
    let str = sessionStorage.getItem(key)
    if (str) {
      return JSON.parse(str)
    } else {
      return null
    }
  }
  return null
}

/**
 * 拖动窗口的方法
 */
export function drag (dom) {
  var drag = document.querySelector(dom);
  console.log(drag)
  if (!drag) return false;
  // //点击某物体时，用drag对象即可，move和up是全局区域，
  // 也就是整个文档通用，应该使用document对象而不是drag对象(否则，采用drag对象时物体只能往右方或下方移动)
  drag.onmousedown = function (event) {
    event = event || window.event; // 兼容IE浏览器
    //    鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离
    var diffX = event.clientX - drag.offsetLeft;
    var diffY = event.clientY - drag.offsetTop;
    if (typeof drag.setCapture !== "undefined") {
      drag.setCapture();
    }
    document.onmousemove = function (event) {
      event = event || window.event;
      var moveX = event.clientX - diffX;
      var moveY = event.clientY - diffY;
      if (moveX < 0) {
        moveX = 0;
      } else if (moveX > window.innerWidth - drag.offsetWidth) {
        moveX = window.innerWidth - drag.offsetWidth;
      }
      if (moveY < 0) {
        moveY = 0;
      } else if (moveY > window.innerHeight - drag.offsetHeight) {
        moveY = window.innerHeight - drag.offsetHeight;
      }
      drag.style.left = moveX + "px";
      drag.style.top = moveY + "px";
    };
    document.onmouseup = function (event) {
      this.onmousemove = null;
      this.onmouseup = null;
      // 修复低版本ie bug
      if (typeof drag.releaseCapture !== "undefined") {
        drag.releaseCapture();
      }
    };
  };
}

/**
 * 复制from表单对象，空值不复制
 * @param {*} from 源对象
 * @param  {...any} noNeedFileds 不复制的字段
 */
export function optionalFormCopy (from, ...noNeedFileds) {
  if (!from) {
    return {};
  }
  return Object.entries(from).reduce((ret, [key, value]) => {
    if (isDataType(value, "null", "undefined")) {
      return ret;
    }
    if (!flat(noNeedFileds).includes(key)) {
      ret[key] = value;
    }
    return ret;
  }, {});
}

/**
 * 判断数据的类型是否符合预期
 * 只传一个参数data，则返回数据的类型；
 * 传入多个参数，则判断数据是否属于该类型（或属于类型数组中的一个）
 * @param {*} data 需要判断类型的数据
 * @param  {...any} typeList 字符串或字符串数组，可不传
 */
export function isDataType (data, ...typeList) {
  let dataType = Object.prototype.toString.call(data)
    .replace(/^\[object/, "")
    .replace(/\]$/, "")
    .replace(/\s/, "");
  typeList = flat(typeList);
  let hasType = typeList.some(it => {
    return it && isDataType(it) === "String";
  });
  if (!hasType) {
    return dataType;
  }
  if (typeList.includes(dataType) || typeList.includes(dataType.toLowerCase())) {
    return true;
  }
  return false;
}

/**
 * 从参数中获取所有Promise对象，组成数组并返回
 * @param  {...any} datas 待解析数据
 */
export function getAllPromise (...datas) {
  let promiseList = [];
  datas.forEach(it => {
    if (isDataType(it, "Promise")) {
      promiseList.push(it);
      return;
    }
    // 是方法则获取执行的结果
    if (isDataType(it, "Function")) {
      promiseList.push(...getAllPromise(it()));
      return;
    }
    if (isDataType(it, "Array")) {
      promiseList.push(...getAllPromise(...it));
    }
  });
  return promiseList;
}

/**
 * 获取指定月的天数；传入多个月份，则返回所有月天数之和
 * @param  {...any} monthList 月份
 */
export function getDayCount (...monthList) {
  let allMonthDay = [31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30];
  let now = new Date();
  return flat(monthList).reduce((total, current) => {
    let m = ~~current;
    if (m % 12 === -10 || m % 12 === 2) {
      // 2月份天数单独算
      let year = now.getFullYear() + ~~(m / 12);
      let day = year % 4 === 0 ? 29 : 28;
      return total + day;
    }
    if (m < 0) {
      return total + allMonthDay[12 + m % 12];
    }
    return total + allMonthDay[m % 12];
  }, 0);
}

/**
 * Array.flat在app和Trident内核上会报错，重写
 * @param {Array} list 目标数组
 */
export function flat (list) {
  if (Array.prototype.flat) {
    return list.flat(Infinity);
  }
  let retArr = [];
  if (!Array.isArray(list)) {
    throw new Error(`Invalid parameter: type check failed for parameter 'list'. Expected Array, But got ${typeof list} with value ${list}`);
  }
  list.forEach(it => {
    if (!Array.isArray(it)) {
      retArr.push(it);
      return;
    }
    retArr.push(...flat(it));
  });
  return retArr;
}
/**
 * 将数组from组装到数组to中去，存在字段field下
 * 参数是一个配置对象
 * @param {Array} from 增量数组
 * @param {Array} to 最终获得的数组
 * @param {String} keyFrom 增量数组的键值
 * @param {String} keyTo 数组to的键值对应数组from中的keyFrom
 * @param {String} field 保存的字段名
 */
export function mixArray ({ from, to, keyFrom, keyTo, field }) {
  to.forEach(item => {
    const target = from.find(it => item[keyTo] === it[keyFrom]);
    item[field] = target;
  });
}
/**
 * 将数组from组装到数组to中去，存在字段field下
 * 参数是一个配置对象
 * @param object owner 调用页this对象
 * @param {Array} from 增量数组
 * @param {Array} to 最终获得的数组
 * @param {String} keyFrom 增量数组的键值
 * @param {String} keyTo 数组to的键值对应数组from中的keyFrom
 * @param {String} field 保存的字段名
 */
export function mixArray4Page (owner, { from, to, keyFrom, keyTo, field }) {
  to.forEach(item => {
    const target = from.find(it => item[keyTo] === it[keyFrom]);
    owner.$set(item, field, target);
  });
}

/**
 * 自动计算药品信息中的天数
 * @param string  specifications 药品规格 （例如：20mgx1片/盒 50μgx25片x4板/盒）
 * @param number  account 购买数量
 * @param number  accountUnit 数量单位
 * @param stirng  dose 每次剂量
 * @param stirng  doseUnit 剂量单位
 * @param stirng  frequency 频次  （例如：每日3次）
 * */

export function autoCalcDays(specifications,account,accountUnit,dose,doseUnit,frequency) {
  if(!dose || dose==0 || !frequency || !account || !specifications){
    return 7
  }
  if(frequency.indexOf('每日') == -1 && frequency.indexOf('1日') == -1){
    return 7
  }

  let arr = specifications.split('x')
  let len = arr.length
  let frequencyNum = frequency.replace(/[^0-9]/ig,"")
  if(len===2){
    let unit1 = arr[0].replace(/\d/g,'') // 规格中第一个单位
    if(arr[1].indexOf('/')!==-1){
      let arr2 = arr[1].split('/')
      let unit2 = arr2[0].replace(/\d/g,'') // 规格中第二个单位
      let unit3 = arr2[1].replace(/\d/g,'') // 规格中第三个单位
      if (unit1 === doseUnit && unit3 === accountUnit) { //第二种类型  规格中第一个单位与每次剂量中单位一致  规格中最后一个单位与购买数量中单位一致
        let num = arr[0].replace(/[^0-9]/ig,""), num2 = arr2[0].replace(/[^0-9]/ig,"")
       return  Math.round(num * num2 * account / (dose * frequencyNum))
      }else if(unit2 === doseUnit && unit3 === accountUnit) { //第一种类型 规格中第二个单位与每次剂量中单位一致 规格中最后一个单位与购买数量中单位一致
        let num = arr2[0].replace(/[^0-9]/ig,"")
        return  Math.round(num * account / (dose * frequencyNum))
      }
    }
  }
  else if(len===3){
   //第三种类型  规格中第二个单位与每次剂量中单位一致  规格中最后一个单位与购买数量中单位一致
    let unit1 = arr[0].replace(/\d/g,'') // 规格中第一个单位
    let unit2 = arr[1].replace(/\d/g, '') // 规格中第二个单位
    if(arr[2].indexOf('/')!==-1) {
      let arr2 = arr[2].split('/')
      let unit3 = arr2[1].replace(/\d/g, '') // 规格中第三个单位
      if(unit2 === doseUnit && unit3 === accountUnit ) {
         let num1 = arr[1].replace(/[^0-9]/ig,""), num2 = arr2[0].replace(/[^0-9]/ig,"")
          return  Math.round(num1 * num2 * account / (dose * frequencyNum))
      }
    }
  }
  return 7
}
