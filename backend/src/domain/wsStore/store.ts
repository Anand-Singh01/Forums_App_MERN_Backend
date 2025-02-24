import { WebSocket } from "ws";

class WsStore {
  public sockets: Map<string, WebSocket> = new Map<string, WebSocket>();
  private static instance: WsStore | null = null;

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new WsStore();
    }
    return this.instance;
  }
}

export default WsStore;