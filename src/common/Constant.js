// 网络连接错误提示信息
export const HTTP_ERROR_MESSAGE = "系统出小差了，请联系管理员处理 ≧﹏≦";
// 提示信息停留时间
export const ELEMENT_MESSAGE_DURATION = 3000;
// 前台存储的token字段名
export const AUTH_TOKEN_FRONT = "_PEACH_TOKEN_HOSPITAL";
// 后台存储的token字段名
export const AUTH_TOKEN_END = "Token";
// 允许的图片类型列表
export const UPLOAD_IMAGE_TYPE = [
  "bmp",
  "jpg",
  "jpeg",
  "png",
  "tif",
  "gif",
  "pcx",
  "tga",
  "exif",
  "fpx",
  "svg",
  "psd",
  "cdr",
  "pcd",
  "dxf",
  "ufo",
  "eps,",
  "ai,",
  "raw",
  ",WMF",
  "webp"
];
// 上传图片的最大大小，单位：MB
export const UPLOAD_IMAGE_MAX_SIZE = 10;
// 正则表达式：身份证号
export const REGULAR_EXPRESSION_IDNUMBER = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
// 腾讯im 音视频
export const SDK_APP_ID = process.env.VUE_APP_SDK_APP_ID;
// 视频clientID
export const VIDEO_CLIENT_ID = "19100717375020139551301001";
// TMC直播地址
export const TMC_LIVE_ADDRESS = "https://tmclive.100cbc.com/live/49111_";
// IM直播bizID
export const TENCENT_LIVE_BIZ_ID = "49111";

export const RISK = [{ name: '禁用', val: 1 }, { name: '忌用', val: 2 }, { name: '慎用', val: 3 }, { name: '酌量', val: 4 }]
