/* eslint-disable */
import TIM from "tim-js-sdk";
import globalTim from './../../../common/tim'

export default class Chat {
  static tim;
  static isLogin; // 是否登录成功
  static userSig;
  static userID;
  static isReady = false; // ready 状态

  constructor(userID, userSig) {
    this.tim = globalTim
    this.userSig = userSig;
    this.userID = userID;
    this.instance = null;
    this.init();
  }

  /**
   * 初始化
   */
  init () {
    // tim登录
    this.login({ userID: this.userID, userSig: this.userSig });
  }

  static getInstance (userID, userSig) {
    if (!this.instance) {
      this.instance = new Chat(userID, userSig);
    }
    return this.instance;
  }

  /**
   * 登录
   * @param {*} options {userID,userSig}
   */
  async login (options) {
    try {
      const res = await this.tim.login(options);
      if (res.code === 0) {
        this.isLogin = true;
      }
    } catch (error) {
      this.isLogin = false;
    }
  }

  /**
   * 登出
   */
  logout () {
    this.tim.logout();
  }

  /**
   * 将会话设置已读
   * @param {}} conversationID
   */
  static setMessageRead (conversationID) {
    this.tim.setMessageRead({ conversationID: conversationID });
  }


  /**
   * 发送文本消息
   * @param {*} to 消息的接收方
   * @param {*} text  消息内容的容器
   */
  async sendTextMessage (to, payload) {
    try {
      let message = this.tim.createTextMessage({
        to: to,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: payload,
      });
      let promise = await this.tim.sendMessage(message);
      return promise;
    } catch (error) {
      console.error("发送失败", error);
    }
  }

  /**
   * 发送图片消息
   * @param {*} to 消息的接收方
   * @param {*} text  消息内容的容器
   */
  async sendImageMessage (to, payload) {
    try {
      let message = this.tim.createImageMessage({
        to: to,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: payload,
      });
      let promise = await this.tim.sendMessage(message);
      return promise;
    } catch (error) {
      console.error("发送失败", error);
    }
  }

  /**
   * 发送自定义消息
   * @param {*} to 消息的接收方
   * @param {*} text  消息内容的容器
   */
  async sendCustomMessage (to, payload) {
    try {
      let message = this.tim.createCustomMessage({
        to: to,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: payload,
      });
      let promise = await this.tim.sendMessage(message);
      return promise;
    } catch (error) {
      console.error("发送失败", error);
    }
  }

  /**
  * 创建消息
  * @param {*} to 消息的接收方
  * @param {*} text  消息内容的容器
  * @param {*} msgType  消息类型
  */
  async createMessage(to, payload, msgType) {
    try {
      let message = {};
      let options = {
        to: to,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: payload,
      }
      let msg = "";
      switch (msgType) {
        case "TEXT":
          message = await this.tim.createTextMessage(options);
          msg = payload.text;
          break;
        case "IMAGE":
          message = await this.tim.createImageMessage(options);
          msg = "[图片]";
          break;
        case "AUDIO":
          message = await this.tim.createAudioMessage(options);
          msg = "";
          break;
        case "FILE":
          message = await this.tim.createFileMessage(options);
          msg = "[文件]";
          break;
        case "CUSTOM":
          message = await this.tim.createCustomMessage(options);
          msg = "";
          break;
        case "VIDEO":
          message = await this.tim.createVideoMessage(options);
          msg = "[视频]";
          break;
        case "FACE":
          message = await this.tim.createFaceMessage(options);
          msg = "[表情]";
          break;
        case "ADDRESS":
          message = await this.tim.createCustomMessage(options);
          msg = "";
          break;
      }
      return message;
    } catch (error) {
      console.error("发送失败", error);
    }
  }

  /**
  * @param {*} message 消息体
  */
  async sendMessage(message) {
    let promise = await this.tim.sendMessage(message);
    return promise;
  }

  /**
   * 获取某会话的消息列表
   * @param {*} conversationID 
   * @param {*} nextReqMessageID 
   * @param {*} count 
   */
  async getMessageList (conversationID, count) {
    try {
      let promise = await this.tim.getMessageList({ conversationID: conversationID, count: count });
      return promise;
    } catch (error) {
      console.error("获取某会话的消息列表", error);
    }
  }

  /**
   * 获取会话列表
   */
  async getConversationList(){
    try {
      let promise = await this.tim.getConversationList();
      return promise;
    } catch (error) {
      console.error("获取某会话的消息列表", error);
    }
  }

}
