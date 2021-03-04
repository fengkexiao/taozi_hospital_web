import Chat from "./Chat";
import TIM from "tim-js-sdk";

export default class SingleChat extends Chat {
  constructor(userID, userSig) {
    super(userID, userSig);
  }
}
